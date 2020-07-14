from graphql import GraphQLError

from graph.types.models.user import UserModel


class UnauthorizedError(GraphQLError):
    def __init__(
        self,
        message,
        nodes=None,
        stack=None,
        source=None,
        positions=None,
        locations=None,
        path=None,
        extensions=None,
    ):
        extensions = {"status": "UNAUTHORIZED", **extensions}

        super(self, UnauthorizedError).__init__(
            message, nodes, stack, source, positions, locations, path, extensions
        )


def user_loader_callback(identity):
    user = UserModel.objects(id=identity["id"]).first()
    # this may require to return none if the roles in the claims are invalid??
    # if get_jwt_claims()["roles"] != user.roles:
    #     return None
    if user is None:
        raise UnauthorizedError("User does not exist")

    return user


def init_auth(jwt):
    @jwt.user_identity_loader
    def user_identity_loader(user):
        return {"username": str(user.username), "id": str(user.pk)}

    @jwt.user_claims_loader
    def user_claims_loader(user):
        return {"roles": user.roles}

    @jwt.user_loader_callback_loader
    def jwt_user_loader_callback(identity):
        return user_loader_callback(identity)

    @jwt.user_loader_error_loader
    def user_loader_error_loader(identity):
        raise UnauthorizedError("The user claims were invalid.")

    @jwt.claims_verification_failed_loader
    def claims_verification_failed_loader():
        raise UnauthorizedError("The user claims were invalid.")

    @jwt.expired_token_loader
    def return_unauth_error(*args, **kwargs):
        raise UnauthorizedError("The token is invalid. Please sign in again.")

    @jwt.invalid_token_loader
    def return_unauth_error(*args, **kwargs):
        raise UnauthorizedError("The token is invalid. Please sign in again.")

    @jwt.revoked_token_loader
    def return_unauth_error(*args, **kwargs):
        raise UnauthorizedError("The token is invalid. Please sign in again.")

    @jwt.token_in_blacklist_loader
    def return_unauth_error(*args, **kwargs):
        raise UnauthorizedError("The token is invalid. Please sign in again.")

    @jwt.unauthorized_loader
    def return_unauth_error(*args, **kwargs):
        raise UnauthorizedError("The token is invalid. Please sign in again.")
