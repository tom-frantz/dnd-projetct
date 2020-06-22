from graphene import ObjectType

from graph.mutations.auth import Login, Refresh
from graph.mutations.user import UserCreate, UserUpdate, UserDelete

from graph.mutations.documents import DocumentUpdate, DocumentCreate


class Mutation(ObjectType):
    login = Login.Field()
    refresh = Refresh.Field()

    user_create = UserCreate.Field()
    user_update = UserUpdate.Field()
    user_delete = UserDelete.Field()

    document_create = DocumentCreate.Field()
    document_update = DocumentUpdate.Field()
