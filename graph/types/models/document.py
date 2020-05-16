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
    render_type = StringField(required=True)
    default_params = DictField(default=dict)


class DocumentModel(Document):
    meta = {}

    contents = ListField(EmbeddedDocumentField("DocumentSectionModel"))
    author = ReferenceField("UserModel", required=True)
    created = DateTimeField(required=True, default=datetime.datetime.utcnow)

    template = ReferenceField("TemplateModel", required=True)
    values = DictField(required=True, default=dict)
