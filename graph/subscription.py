from graphene import ObjectType, Field, ID, Node
import rx

from graph.subscriptions.document import document_update_on_subscribe
from graph.subscriptions.user import user_update_on_subscribe
from graph.types.document import Document
from graph.types.user import User


class Subscription(ObjectType):
    document_update = Field(Document, id=ID(required=True))
    user_update = Field(User, id=ID(required=True))

    @staticmethod
    def resolve_document_update(root, info, id):
        _, id = Node.from_global_id(id)
        return rx.Observable.create(document_update_on_subscribe(root, info, id))

    @staticmethod
    def resolve_user_update(root, info, id):
        _, id = Node.from_global_id(id)
        return rx.Observable.create(user_update_on_subscribe(root, info, id))
