import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_graphql import GraphQLView
from flask_jwt_extended import JWTManager
from mongoengine import connect

from graph.schema import schema

load_dotenv()

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.environ["SECRET_KEY"]

db = connect(db="dnd_test")
jwt = JWTManager(app)
cors = CORS(app, resources={r"/graphql": {"origins": "*"}})

app.add_url_rule("/graphql", view_func=GraphQLView.as_view("graphql", schema=schema))

if __name__ == '__main__':
    app.run(debug=True)
