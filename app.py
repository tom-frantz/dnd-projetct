import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
from flask_jwt_extended import JWTManager, get_jwt_claims
from mongoengine import connect

from graph.schema import schema
from graph.types.models.user import UserModel

load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.environ["SECRET_KEY"]

db = connect(db="dnd_test")
jwt = JWTManager(app)
cors = CORS(app, resources={r"/graphql": {"origins": "*"}})

app.add_url_rule("/graphql", view_func=GraphQLView.as_view("graphql", schema=schema))


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


if __name__ == '__main__':
    app.run(debug=True)
