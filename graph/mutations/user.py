from flask_jwt_extended import jwt_required, get_jwt_identity, get_current_user
from graphene import String, ObjectType, Field
from graphql_relay import from_global_id
from passlib.handlers.pbkdf2 import pbkdf2_sha256

from graph.mutations import BaseMutation
from graph.types.inputs.user import UserInput
from graph.types.user import User
from graph.types.models.user import UserModel


class UserCreate(BaseMutation):
    class Arguments:
        username = String(required=True)
        password = String(required=True)
        input = UserInput()

    class UserCreate(ObjectType):
        user = Field(User)

    @staticmethod
    def mutate(root, info, username, password):
        user = UserModel(
            username=username, password=pbkdf2_sha256.hash(password), articles=[]
        )
        user.save()

        return UserCreate.Success(user)


class UserUpdate(BaseMutation):
    class Arguments:
        input = UserInput()

    class UserUpdate(ObjectType):
        user = Field(User)

    @jwt_required
    def mutate(root, info, input):
        # print(get_jwt_identity()["id"])
        # user = UserModel.objects(id=get_jwt_identity()["id"]).first()
        user = get_current_user()
        user.modify(**input)
        user.save()

        return UserUpdate.Success(user=user)


class UserDelete(BaseMutation):
    class UserDelete(ObjectType):
        user = Field(User)

    @jwt_required
    def mutate(root, info):
        user = get_current_user()
        user.delete()

        return UserDelete.Success(user=user)
