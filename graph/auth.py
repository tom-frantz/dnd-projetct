from app import jwt
from graph.types.models.user import UserModel


@jwt.user_identity_loader
def user_identity_loader(user):
    return str(user.username)


@jwt.user_claims_loader
def user_claims_loader(user):
    return {"roles": user.roles}


@jwt.user_loader_callback_loader
def user_loader_callback(identity):
    user = UserModel.objects(username=identity).first()
    # this may require to return none if the roles in the claims are invalid??
    # if get_jwt_claims()["roles"] != user.roles:
    #     return None
    return user
