import itertools

from flask_jwt_extended import jwt_required, get_jwt_claims, get_jwt_identity
from graphene import ID, ObjectType, Field
from graphql_relay import from_global_id

from graph.mutations import BaseMutation
from graph.types.document import Document
from graph.types.inputs.document import DocumentInput
from graph.types.models.template import TemplateModel, TemplateSectionModel
from graph.types.models.user import UserModel
from graph.types.models.document import DocumentModel, DocumentSectionModel
from graph.types.utils.error import Error


class DocumentCreate(BaseMutation):
    class Arguments:
        input = DocumentInput()
        template = ID(required=True)

    class DocumentCreate(ObjectType):
        document = Field(Document)

    @staticmethod
    @jwt_required
    def mutate(root, info, input, template):
        author = UserModel.objects(id=get_jwt_identity()["id"]).first()
        template = TemplateModel.objects(id=from_global_id(template)[1])

        if not template:
            DocumentCreate.Fail(
                [Error("The template could not be found", ["template"])]
            )

        template_contents = [
            template_section
            for template_section in itertools.chain(
                template.contents,
                [
                    TemplateSectionModel(**template_section_input)
                    for template_section_input in input.get("template", [])
                ],
            )
        ]

        del input["template"]

        document_contents = [
            DocumentSectionModel(**document_section_input)
            for document_section_input in input.get("contents", [])
        ]

        document = DocumentModel(author=author, template=template_contents, **input)
        document.save()

        author.articles.append(document)
        author.save()

        return DocumentCreate.Success(document)
