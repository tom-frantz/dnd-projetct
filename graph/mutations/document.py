import itertools

from flask_jwt_extended import (
    jwt_required,
    get_jwt_claims,
    get_jwt_identity,
    current_user,
)
from graphene import ID, ObjectType, Field
from graphql import GraphQLError
from graphql_relay import from_global_id

from graph.mutations import BaseMutation
from graph.types.document import Document
from graph.types.inputs.document import DocumentInput
from graph.types.models.template import TemplateModel, TemplateSectionModel
from graph.types.models.user import UserModel
from graph.types.models.document import (
    DocumentModel,
    DocumentSectionModel,
    PrivacySettingsModel,
    UserPrivacySettingsModel,
    PUBLIC,
    USERS,
    EDIT,
)
from graph.types.utils.error import Error


# TODO FIX
class DocumentCreate(BaseMutation):
    class Arguments:
        input = DocumentInput(required=True)

    class DocumentCreate(ObjectType):
        document = Field(Document, required=True)

    @staticmethod
    @jwt_required
    def mutate(root, info, input):
        author = current_user
        # template = TemplateModel.objects(id=from_global_id(template)[1])

        # if not template:
        #     DocumentCreate.Fail(
        #         [Error("The template could not be found", ["template"])]
        #     )

        # template_contents = [
        #     template_section
        #     for template_section in itertools.chain(
        #         template.contents,
        #         [
        #             TemplateSectionModel(**template_section_input)
        #             for template_section_input in input.get("template", [])
        #         ],
        #     )
        # ]

        # del input["template"]

        # document_contents = [
        #     DocumentSectionModel(**document_section_input)
        #     for document_section_input in input.get("contents", [])
        # ]

        if input.contents is not None:
            contents = list(
                map(
                    lambda content_input: DocumentSectionModel(
                        **content_input,
                        values=[],
                        template=TemplateSectionModel(
                            name="TextSection",  # This should be the same as the parent DocumentSection name.
                            render_type="TextSection",
                            default_params={},
                            default_values={},
                        ),
                    ),
                    input.contents,
                )
            )

            input["contents"] = contents
        else:
            input['contents'] = []

        document = DocumentModel(**input, author=author.id)
        document.save()

        author.articles.append(document)
        author.save()

        return DocumentCreate.Success(document=document)


class AccessError(Exception):
    pass


class DocumentUpdate(BaseMutation):
    class Arguments:
        id = ID(required=True)
        input = DocumentInput(required=True)

    class DocumentUpdate(ObjectType):
        document = Field(Document)

    @jwt_required
    def mutate(root, info, input, id):
        doc = DocumentModel.objects(id=id).first()

        if doc is None:
            raise GraphQLError("No such document exists.")

        try:
            if current_user.id == doc.author.id:
                pass
            elif (
                doc.privacy_settings.visibility == PUBLIC
                and doc.privacy_settings.visibility != EDIT
            ):
                raise AccessError("You do not have permission to edit this document.")
            elif doc.privacy_settings.visibility == USERS:
                for user_settings in doc.privacy_settings.users_access:
                    if (
                        user_settings.user.id == current_user.id
                        and user_settings.access_type == EDIT
                    ):
                        break
                else:
                    # If no break
                    raise AccessError(
                        "You do not have permission to edit this document."
                    )
            elif current_user.id != doc.author.id:
                raise AccessError("You do not have access to this document.")
                # return DocumentUpdate.Fail(
                #     errors=[
                #         Error(message="You do not have permission to edit this document")
                #     ]
                # )
        except AccessError as e:
            raise GraphQLError(str(e))

        if dict(input) == dict():
            return DocumentUpdate.Success(document=doc)

        # TODO make the lambda a bit more robust.
        # Handle the contents returned from input
        if input.contents is not None:
            contents = list(
                map(
                    lambda content_input: DocumentSectionModel(
                        **content_input,
                        values=[],
                        template=TemplateSectionModel(
                            name="TextSection",  # This should be the same as the parent DocumentSection name.
                            render_type="TextSection",
                            default_params={},
                            default_values={},
                        ),
                    ),
                    input.contents,
                )
            )

            input["contents"] = contents

        # Handle Privacy Settings
        if input.privacy_settings is not None:
            if doc.privacy_settings is not None:
                for key, value in input.privacy_settings.items():
                    if key == "users_access":
                        doc.privacy_settings[key] = [
                            UserPrivacySettingsModel(
                                user=from_global_id(user.id)[1],
                                access_type=user.access_type,
                            )
                            for user in value
                        ]
                    else:
                        doc.privacy_settings[key] = value
                del input["privacy_settings"]
            else:
                input.privacy_settings["users_access"] = [
                    UserPrivacySettingsModel(
                        id=from_global_id(user.id)[1], access_type=user.access_type,
                    )
                    for user in input.privacy_settings["users_access"]
                ]
                privacy_settings = PrivacySettingsModel(**input.privacy_settings)
                input["privacy_settings"] = privacy_settings

        if len(dict(input)) != 0:
            doc.update(**input)
        doc.save()

        return DocumentUpdate.Success(document=doc)
