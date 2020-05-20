from graphene import Node
from graphene_mongo import MongoengineObjectType

from graph.types.models.document import DocumentModel, DocumentSectionModel
from graph.types.utils.connection import CustomConnectionField


class DocumentConnectionField(CustomConnectionField):
    class Meta:
        exclude_fields = ("contents", "template")


class Document(MongoengineObjectType):
    class Meta:
        connection_field_class = DocumentConnectionField
        model = DocumentModel
        interfaces = (Node,)


class DocumentSection(MongoengineObjectType):
    class Meta:
        model = DocumentSectionModel
