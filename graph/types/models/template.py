import datetime

from mongoengine import (
    Document,
    DateTimeField,
    StringField,
    ListField,
    EmbeddedDocument,
    EmbeddedDocumentListField,
    DictField,
)


class TemplateSectionModel(EmbeddedDocument):
    name = StringField(required=True)
    render_type = StringField(required=True)
    default_params = DictField(default=dict)


class TemplateModel(Document):
    meta = {}

    created = DateTimeField(required=True, default=datetime.datetime.utcnow)

    contents = EmbeddedDocumentListField(
        TemplateSectionModel, default=list, required=True
    )
