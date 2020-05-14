from graphene import ObjectType, Mutation, String


class UserCreate(Mutation):
    class Arguments:
        pass

    Output = String

    @staticmethod
    def mutate(info, *args):
        return "123"


class Mutation(ObjectType):
    user_create = UserCreate.Field()
