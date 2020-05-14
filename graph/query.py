from graphene import ObjectType, String, Field


class Query(ObjectType):
    me = Field(String)

    def resolve_me(*args):
        return "me"
