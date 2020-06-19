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


class RuleEngine(object):
    pass


def document_middleware(next, root, info, **args):
    # print(root, info)
    # if isinstance(root, DocumentModel) and not getattr(root, "rule_engine", False):
    #     setattr(root, "rule_engine", RuleEngine())
    return next(root, info, **args)


class Document(MongoengineObjectType):
    class Meta:
        connection_field_class = DocumentConnectionField
        model = DocumentModel
        interfaces = (Node,)


class DocumentSection(MongoengineObjectType):
    class Meta:
        model = DocumentSectionModel

    values = List(Value)

    # TODO add in a thing that changes the value bit
    @staticmethod
    def resolve_values(root, info):
        return [get_value_from_model(value) for value in root.values]
