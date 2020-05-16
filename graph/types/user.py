from graphene import Node, ID
from graphene_mongo import MongoengineObjectType, MongoengineConnectionField

from graph.types.models.user import UserModel


class User(MongoengineObjectType):
    class Meta:
        model = UserModel
        interfaces = (Node,)
