import datetime

from mongoengine import (
    Document,
    ReferenceField,
    DateTimeField,
    DictField,
    EmbeddedDocument,
    StringField,
    ListField,
    EmbeddedDocumentField,
)


class DocumentSectionModel(EmbeddedDocument):
    name = StringField(required=True)
    params = DictField(default=dict)
    content = StringField()


class DocumentModel(Document):
    meta = {}

    contents = ListField(EmbeddedDocumentField("DocumentSectionModel"))
    author = ReferenceField("UserModel", required=True)
    created = DateTimeField(required=True, default=datetime.datetime.utcnow)

    template = ReferenceField("TemplateModel", required=True)
    values = DictField(required=True, default=dict)
