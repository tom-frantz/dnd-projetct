from graphene import ObjectType, String, NonNull, List


class Error(ObjectType):
    message = String(required=True)
    path = List(NonNull(String), required=True)
