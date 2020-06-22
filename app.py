import os

from dotenv import load_dotenv
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_sockets import Sockets

from mongoengine import connect

from graph.overrides import (
    OverriddenView,
    CustomBackend,
    GeventSubscriptionServerOverride,
)

from graph.schema import schema
from graph.auth import init_auth
from graph.types.document import document_middleware

from gevent import pywsgi
from geventwebsocket.handler import WebSocketHandler


load_dotenv(f".env.{os.environ.get('ENV', 'development')}")

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = os.environ["SECRET_KEY"]

db = connect(host=os.environ["CONNECTION_STRING"])
jwt = JWTManager(app)
cors = CORS(app, resources={r"/graphql": {"origins": "*"}})

app.add_url_rule(
    "/graphql",
    view_func=OverriddenView.as_view(
        "graphql",
        schema=schema,
        backend=CustomBackend(),
        middleware=[document_middleware],
    ),
)

sockets = Sockets(app)
subscription_server = GeventSubscriptionServerOverride(schema)
app.app_protocol = lambda environ_path_info: 'graphql-ws'


@sockets.route('/subscriptions')
def echo_socket(ws):
    subscription_server.handle(ws)
    return []


init_auth(jwt)

server = pywsgi.WSGIServer(('0.0.0.0', 5000), app, handler_class=WebSocketHandler)

# For serverless deployment.
application = server.application

if __name__ == '__main__':
    print("Running on localhost (127.0.0.1:5000)")
    server.serve_forever()
