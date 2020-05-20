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
    EmbeddedDocumentListField,
)

from graph.types.models.template import TemplateSectionModel


class DocumentSectionModel(EmbeddedDocument):
    name = StringField(required=True)
    params = DictField(default=dict)
    content = StringField()


class DocumentModel(Document):
    meta = {}

    title = StringField(required=True)
    description = StringField()

    author = ReferenceField("UserModel", required=True)
    created = DateTimeField(required=True, default=datetime.datetime.utcnow)

    contents = EmbeddedDocumentListField(
        DocumentSectionModel, default=list, required=True
    )
    template = EmbeddedDocumentListField(
        TemplateSectionModel, default=list, required=True
    )
    values = DictField(required=True, default=dict)
