from graphene import Node, NonNull, List
from graphene_mongo import MongoengineObjectType

from graph.types.document import Document
from graph.types.models.user import UserModel


class User(MongoengineObjectType):
    class Meta:
        exclude_fields = ("password",)
        model = UserModel
        interfaces = (Node,)
