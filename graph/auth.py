from flask import jsonify
from flask_jwt_extended import config

from graph.types.models.user import UserModel


def init_auth(jwt):
    @jwt.user_identity_loader
    def user_identity_loader(user):
        return {"username": str(user.username), "id": str(user.pk)}

    @jwt.user_claims_loader
    def user_claims_loader(user):
        return {"roles": user.roles}

    @jwt.user_loader_callback_loader
    def user_loader_callback(identity):
        user = UserModel.objects(id=identity["id"]).first()
        # this may require to return none if the roles in the claims are invalid??
        # if get_jwt_claims()["roles"] != user.roles:
        #     return None
        return user

    @jwt.user_loader_error_loader
    def user_loader_error_loader(identity):
        print("identity")
        return jsonify({"msg": "Wowee"}), 401
