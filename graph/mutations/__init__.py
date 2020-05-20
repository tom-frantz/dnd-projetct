from graphene import ObjectType, List, NonNull, Mutation, Union, Node

from graph.types.utils.error import Error


class MutationFail(ObjectType):
    errors = List(NonNull(Error))


class BaseMutation(Mutation):
    Fail = MutationFail

    def __init_subclass__(cls, **kwargs):
        old_mutate = cls.mutate
        success_output = getattr(cls, cls.__name__)

        # Change the name and update the old class.
        new_success_output = type(cls.__name__, (success_output,), {})
        setattr(cls, cls.__name__, new_success_output)
        cls.Success = new_success_output

        # Add to the union
        class UnionMeta:
            types = (MutationFail, new_success_output)

        # Set the output to be the union type
        cls.Output = type(
            cls.__name__ + "MutationResult", (Union,), {"Meta": UnionMeta}
        )

        def new_mutate(*args, **kwargs):
            if "id" in kwargs:
                kwargs["id"] = Node.from_global_id(kwargs["id"])
            return old_mutate(*args, **kwargs)

        cls.mutate = new_mutate

        super().__init_subclass__(**kwargs)

    @classmethod
    def get_response(cls, *args, **kwargs):
        return cls.Output(*args, **kwargs)

    @staticmethod
    def mutate(*args, **kwargs):
        raise NotImplementedError()
