from graphene_mongo import MongoengineConnectionField


class CustomConnectionField(MongoengineConnectionField):
    def __init_subclass__(cls, **kwargs):
        print("III", cls.Meta)

    @property
    def field_args(self):
        field_args = super(CustomConnectionField, self).field_args
        for field in getattr(self.__class__.Meta, "exclude_fields", []):
            del field_args[field]
        return field_args
