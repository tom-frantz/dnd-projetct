from flask_jwt_extended import jwt_required, current_user


def jwt_current_user_required(fn):
    @jwt_required
    def inner(*args, **kwargs):
        if current_user:
            pass
        return fn(*args, **kwargs)
