from flask_jwt_extended import create_refresh_token, create_access_token
from graphene import String, ObjectType
from passlib.handlers.pbkdf2 import pbkdf2_sha256

from graph.mutations import BaseMutation
from graph.types.utils.error import Error
from graph.types.models.user import UserModel


class Login(BaseMutation):
    class Arguments:
        username = String(required=True)
        password = String(required=True)

    class Login(ObjectType):
        refresh_token = String()
        access_token = String()

    @staticmethod
    def mutate(root, info, username, password):
        user = UserModel.objects(username=username).first()

        if user is None:
            return Login.Fail([Error("The username or password was incorrect.", [])])

        if not pbkdf2_sha256.verify(password, user.password):
            return Login.Fail([Error("The username or password was incorrect.", [])])

        return Login.Success(
            refresh_token=create_refresh_token(user),
            access_token=create_access_token(user),
        )
