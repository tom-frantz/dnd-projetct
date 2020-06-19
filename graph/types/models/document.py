import datetime

from mongoengine import (
    Document,
    ReferenceField,
    DateTimeField,
    EmbeddedDocument,
    StringField,
    EmbeddedDocumentField,
    EmbeddedDocumentListField,
    connect,
)

from graph.types.models.template import TemplateSectionModel
from graph.types.models.value import RuleModel, ValueModel


class DocumentSectionModel(EmbeddedDocument):
    name = StringField(required=True)
    description = StringField()

    template = EmbeddedDocumentField(TemplateSectionModel, required=True)
    values = EmbeddedDocumentListField(ValueModel)
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


if __name__ == '__main__':
    from graph.types.models.user import UserModel

    db = connect(db="dnd_test")

    user = UserModel.objects(username="Tomato150").first()

    assert user is not None, "Please make a new 'Tomato150' user first."
    old_doc = DocumentModel.objects(title="TestingDocument").first()
    old_doc.delete()
    user.articles = []

    doc = DocumentModel(
        title="TestingDocument",
        description="This is a testing document",
        author=user,
        contents=[
            DocumentSectionModel(
                name="TestingSection",
                description="This is a testing document section",
                content="Hey there it's me, the contents of this document.",
                template=TemplateSectionModel(
                    name="TextSection",  # This should be the same as the parent DocumentSection name.
                    render_type="TextSection",
                    default_params={},
                    default_values={},
                ),
                values=[
                    ValueModel(
                        name="TestingValue",
                        type="NumericRuleValue",
                        rules=[RuleModel(target_value="TestingValue", rule="10")],
                        value="10",
                    ),
                    ValueModel(
                        name="TestingInputValue", type="NumericValue", value="10"
                    ),
                ],
            )
        ],
    )

    doc.save()
    user.articles.append(doc.pk)
    user.save()
