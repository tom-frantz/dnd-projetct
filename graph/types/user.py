from flask_jwt_extended import jwt_required, current_user
from graphene import Node, NonNull, List
from graphene_mongo import MongoengineObjectType
from graphql import GraphQLError

from graph.types.document import Document, DocumentConnectionField
from graph.types.models.document import DocumentModel
from graph.types.models.user import UserModel
from graph.types.utils.connection import CustomConnectionField


class UserConnectionField(CustomConnectionField):
    class Meta:
        exclude_fields = ()


class User(MongoengineObjectType):
    class Meta:
        exclude_fields = ("password",)
        filter_fields = {"username": ["icontains", "not__exact"], "id": ["ne"]}
        model = UserModel
        interfaces = (Node,)

    shared_articles = DocumentConnectionField(Document)

    @staticmethod
    @jwt_required
    def resolve_shared_articles(root, info, **kwargs):
        if current_user != root:
            raise GraphQLError("You are not authorized to access this on another user.")
        return DocumentModel.objects(
            privacy_settings__users_access__user=root.id, **kwargs
        )
