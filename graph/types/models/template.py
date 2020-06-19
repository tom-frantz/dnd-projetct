import datetime

from mongoengine import (
    Document,
    DateTimeField,
    StringField,
    EmbeddedDocument,
    EmbeddedDocumentListField,
    DictField,
)


class TemplateSectionModel(EmbeddedDocument):
    name = StringField(required=True)
    render_type = StringField(required=True)
    default_params = DictField(default=dict)
    default_values = DictField(default=dict)


class TemplateModel(Document):
    meta = {}

    title = StringField(required=True)
    description = StringField()

    created = DateTimeField(required=True, default=datetime.datetime.utcnow)

    contents = EmbeddedDocumentListField(
        TemplateSectionModel, default=list, required=True
    )
