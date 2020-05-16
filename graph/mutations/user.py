from graphene import String, ObjectType, Field
from passlib.handlers.pbkdf2 import pbkdf2_sha256

from graph.mutations import BaseMutation
from graph.types.user import User
from graph.types.models.user import UserModel


class UserCreate(BaseMutation):
    class Arguments:
        username = String(required=True)
        password = String(required=True)

    class UserCreate(ObjectType):
        user = Field(User)

    @staticmethod
    def mutate(root, info, username, password):
        user = UserModel(
            username=username, password=pbkdf2_sha256.hash(password), articles=[]
        )
        user.save()

        return UserCreate(ok=True, user=user)
