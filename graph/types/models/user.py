from mongoengine import (
    Document,
    ReferenceField,
    ListField,
    StringField,
    ReferenceField,
)


class UserModel(Document):

    meta = {}

    username = StringField(required=True, unique=True)
    password = StringField(required=True)
    roles = ListField(StringField(), default=[])

    articles = ListField(ReferenceField("DocumentModel"))
