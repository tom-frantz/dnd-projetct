from mongoengine import EmbeddedDocument, StringField, EmbeddedDocumentListField


class RuleModel(EmbeddedDocument):
    target_value = StringField(required=True)
    rule = StringField(required=True)


class ValueModel(EmbeddedDocument):
    name = StringField(required=True)
    description = StringField()

    rules = EmbeddedDocumentListField(RuleModel)
    type = StringField(
        required=True
    )  # TODO make this have a regex with all the valid types.
    value = StringField()
