from graphene import Node
from graphene_mongo import MongoengineObjectType

from graph.types.models.template import TemplateModel, TemplateSectionModel
from graph.types.utils.connection import CustomConnectionField


class TemplateConnectionField(CustomConnectionField):
    class Meta:
        exclude_fields = ("contents",)


class Template(MongoengineObjectType):
    class Meta:
        connection_field_class = TemplateConnectionField
        model = TemplateModel
        interfaces = (Node,)


class TemplateSection(MongoengineObjectType):
    class Meta:
        model = TemplateSectionModel
