import datetime

from mongoengine import (
    Document,
    ReferenceField,
    DateTimeField,
    DictField,
    EmbeddedDocumentListField,
    EmbeddedDocument,
    StringField,
    ListField,
    EmbeddedDocumentField,
)
from mongoengine.base import DocumentMetaclass


class DocumentSectionModel(EmbeddedDocument):
    name = StringField(required=True)
    render_type = StringField(required=True)
    default_params = DictField(default=dict)

    # def serialize(self):
    #     return "{},{},{}"


class DocumentModel(Document):
    meta = {}

    contents = ListField(EmbeddedDocumentField("DocumentSectionModel"))
    author = ReferenceField("UserModel", required=True)
    created = DateTimeField(required=True, default=datetime.datetime.utcnow)

    template = ReferenceField("TemplateModel", required=True)
    values = DictField(required=True, default=dict)
