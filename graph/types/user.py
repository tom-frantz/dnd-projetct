from graphene import Node
from graphene_mongo import MongoengineObjectType

from graph.types.models.user import UserModel


class User(MongoengineObjectType):
    class Meta:
        model = UserModel
        interfaces = (Node,)
