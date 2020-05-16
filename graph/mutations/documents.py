from flask_jwt_extended import jwt_required, get_jwt_claims, get_jwt_identity
from graphene import ID, ObjectType, Field

from graph.mutations import BaseMutation
from graph.types.document import Document
from graph.types.models.user import UserModel
from graph.types.models.document import DocumentModel


class DocumentCreate(BaseMutation):
    class Arguments:
        pass

    class DocumentCreate(ObjectType):
        document = Field(Document)

    @staticmethod
    @jwt_required
    def mutate(root, info):
        author = UserModel.objects(username=get_jwt_identity()).first()
        if not author:
            DocumentCreate.Fail()

        document = DocumentModel(author=author)
        document.save()

        author.articles.append(document)
        author.save()

        return DocumentCreate.Success(document)
