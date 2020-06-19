from flask_jwt_extended import (
    create_refresh_token,
    create_access_token,
    jwt_refresh_token_required,
    get_jwt_identity,
    decode_token,
)
from graphene import String, ObjectType
from passlib.handlers.pbkdf2 import pbkdf2_sha256

from graph.mutations import BaseMutation
from graph.types.utils.error import Error
from graph.types.models.user import UserModel
from graph.auth import user_loader_callback


class Login(BaseMutation):
    class Arguments:
        username = String(required=True)
        password = String(required=True)

    class Login(ObjectType):
        refresh_token = String(required=True)
        access_token = String(required=True)

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


class Refresh(BaseMutation):
    class Arguments:
        refresh_token = String(required=True)

    class Refresh(ObjectType):
        access_token = String(required=True)

    @staticmethod
    def mutate(root, info, refresh_token):
        try:
            token = decode_token(refresh_token)
            current_user = user_loader_callback(token["identity"])
            return Refresh.Success(
                access_token=create_access_token(identity=current_user)
            )
        except Exception as e:
            return Refresh.Fail(errors=[])
