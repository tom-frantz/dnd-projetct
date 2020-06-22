import itertools

from flask_jwt_extended import (
    jwt_required,
    get_jwt_claims,
    get_jwt_identity,
    current_user,
)
from graphene import ID, ObjectType, Field
from graphql_relay import from_global_id

from graph.mutations import BaseMutation
from graph.types.document import Document
from graph.types.inputs.document import DocumentInput
from graph.types.models.template import TemplateModel, TemplateSectionModel
from graph.types.models.user import UserModel
from graph.types.models.document import DocumentModel, DocumentSectionModel
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


class DocumentUpdate(BaseMutation):
    class Arguments:
        id = ID(required=True)
        input = DocumentInput(required=True)

    class DocumentUpdate(ObjectType):
        document = Field(Document)

    @jwt_required
    def mutate(root, info, input, id):
        doc = DocumentModel.objects(id=id).first()

        if current_user.id != doc.author.id:
            return DocumentUpdate.Fail(
                errors=[
                    Error(message="You do not have permission to edit this document")
                ]
            )

        if dict(input) == dict():
            return DocumentUpdate.Success(document=doc)

        # TODO make the lambda a bit more robust.
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

        doc.modify(**input)

        return DocumentUpdate.Success(document=doc)
