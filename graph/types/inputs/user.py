from graphene import InputObjectType, String, List


class UserInput(InputObjectType):
    roles = List(String)
