from flask_jwt_extended import jwt_required, get_current_user
from graphene import ObjectType, Field, ID, Node
from graphene_mongo import MongoengineConnectionField
from graphql import GraphQLError

from graph.types.document import Document, DocumentConnectionField, access_to_document
from graph.types.models.document import DocumentModel
from graph.types.models.user import UserModel
from graph.types.template import Template, TemplateConnectionField
from graph.types.user import User, UserConnectionField


class Query(ObjectType):
    me = Field(User)
    user = Field(User, id=ID(required=True))
    users = UserConnectionField(User)
    templates = TemplateConnectionField(Template)
    documents = DocumentConnectionField(Document)
    document = Field(Document, id=ID(required=True))

    @jwt_required
    def resolve_me(*args):
        return get_current_user()

    @jwt_required
    def resolve_user(root, info, id):
        _, id = Node.from_global_id(id)
        return UserModel.objects(id=id).first()

    @jwt_required
    def resolve_document(root, info, id):
        _, id = Node.from_global_id(id)

        doc = DocumentModel.objects(id=id).first()
        if doc is not None:
            if access_to_document(doc):
                return doc
            else:
                raise GraphQLError("You do not have access to this document.")
        else:
            return None
