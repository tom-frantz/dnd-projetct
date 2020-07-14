from graphene import Node, Field, List, NonNull
from graphene_mongo import MongoengineObjectType

from graph.types.models.document import (
    DocumentModel,
    DocumentSectionModel,
)
from graph.types.utils.connection import CustomConnectionField
from graph.types.value import Value, NumericValue, get_value_from_model


class DocumentConnectionField(CustomConnectionField):
    class Meta:
        exclude_fields = ("contents", "template")


class DocumentSection(MongoengineObjectType):
    class Meta:
        model = DocumentSectionModel

    values = List(Value)

    # TODO add in a thing that changes the value bit
    @staticmethod
    def resolve_values(root, info):
        return [get_value_from_model(value) for value in root.values]


class Document(MongoengineObjectType):
    class Meta:
        connection_field_class = DocumentConnectionField
        model = DocumentModel
        interfaces = (Node,)

    contents = NonNull(List(NonNull(DocumentSection)))
