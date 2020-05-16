from graphene import ObjectType

from graph.mutations.auth import Login
from graph.mutations.user import UserCreate

from graph.mutations.documents import DocumentCreate


class Mutation(ObjectType):
    login = Login.Field()

    user_create = UserCreate.Field()
    document_create = DocumentCreate.Field()
