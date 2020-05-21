from flask_jwt_extended import jwt_required, get_current_user
from graphene import ObjectType, Field, ID, Node
from graphene_mongo import MongoengineConnectionField

from graph.types.document import Document, DocumentConnectionField
from graph.types.models.user import UserModel
from graph.types.template import Template, TemplateConnectionField
from graph.types.user import User


class Query(ObjectType):
    me = Field(User)
    user = Field(User, id=ID(required=True))
    users = MongoengineConnectionField(User)
    templates = TemplateConnectionField(Template)
    documents = DocumentConnectionField(Document)

    @jwt_required
    def resolve_me(*args):
        return get_current_user()

    def resolve_user(root, info, id):
        _, id = Node.from_global_id(id)
        return UserModel.objects(id=id).first()
