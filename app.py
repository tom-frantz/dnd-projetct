from dotenv import load_dotenv

from flask import Flask
from flask_cors import CORS

from flask_graphql import GraphQLView

from graph.schema import schema

load_dotenv()

app = Flask(__name__)

app.add_url_rule("/graphql", view_func=GraphQLView.as_view("graphql", schema=schema))
cors = CORS(app, resources={r"/graphql": {"origins": "*"}})

if __name__ == '__main__':
    app.run()
