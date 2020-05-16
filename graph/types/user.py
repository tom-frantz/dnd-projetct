from graphene import Node
from graphene_mongo import MongoengineObjectType

from graph.types.models.user import UserModel


class User(MongoengineObjectType):
    class Meta:
        exclude_fields = ("password",)
        model = UserModel
        interfaces = (Node,)
