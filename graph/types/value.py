from graphene import Interface, String, ObjectType, Float, List
from graphene_mongo import MongoengineObjectType

from graph.types.models.value import RuleModel, ValueModel


class Rule(MongoengineObjectType):
    class Meta:
        model = RuleModel


class Value(Interface):  # TODO change this to an interface
    # class Meta:
    #     model = ValueModel
    name = String(required=True)
    description = String()


class RuleValue(Interface):
    rules = List(Rule)


class NumericValue(MongoengineObjectType):
    class Meta:
        exclude_fields = ('type', 'rules')
        interfaces = (Value,)
        model = ValueModel

    value = Float()

    @staticmethod
    def resolve_value(root, info):
        return float(root.value)

    @classmethod
    def _create_new(cls, model):
        data = dict(model._data)
        del data['type']
        del data['rules']
        return cls(**data)


class NumericRuleValue(NumericValue):
    class Meta:
        exclude_fields = ('type',)
        interfaces = (Value, RuleValue)
        model = ValueModel

    @classmethod
    def _create_new(cls, model):
        data = dict(model._data)
        del data['type']
        return cls(**data)


model_to_value_map = {
    'NumericRuleValue': NumericRuleValue._create_new,
    'NumericValue': NumericValue._create_new,
}


def get_value_from_model(model):
    return model_to_value_map[model.type](model)
