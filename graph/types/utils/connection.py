import graphene
from graphene_mongo import MongoengineConnectionField
from graphene_mongo.utils import get_node_from_global_id
from graphql_relay import from_global_id
from graphql_relay.connection.arrayconnection import connection_from_list_slice


class CustomConnectionField(MongoengineConnectionField):
    @property
    def field_args(self):
        field_args = super(CustomConnectionField, self).field_args
        for field in getattr(self.__class__.Meta, "exclude_fields", []):
            try:
                del field_args[field]
            except Exception as e:
                print(e)
        return field_args

    def default_resolver(self, _root, info, **args):
        # Copy-Paste of the parent code to intercept and filter.
        args = args or {}

        for arg, value in args.items():
            if arg.startswith("id"):
                if type(value) is str:
                    args[arg] = from_global_id(value)[1]
                if type(value) is list:
                    args[arg] = [from_global_id(id)[1] for id in value]

        if _root is not None:
            args["pk__in"] = [r.pk for r in getattr(_root, info.field_name, [])]

        connection_args = {
            "first": args.pop("first", None),
            "last": args.pop("last", None),
            "before": args.pop("before", None),
            "after": args.pop("after", None),
        }

        _id = args.pop("id", None)

        if _id is not None:
            iterables = [get_node_from_global_id(self.node_type, info, _id)]
            list_length = 1
        elif callable(getattr(self.model, "objects", None)):
            iterables = self.get_queryset(self.model, info, **args)
            list_length = iterables.count()
        else:
            iterables = []
            list_length = 0

        # Custom Code
        iterables = list(filter(self.filter_item, iterables))

        connection = connection_from_list_slice(
            list_slice=iterables,
            args=connection_args,
            list_length=list_length,
            list_slice_length=list_length,
            connection_type=self.type,
            edge_type=self.type.Edge,
            pageinfo_type=graphene.PageInfo,
        )
        connection.iterable = iterables
        connection.list_length = list_length
        return connection

    def filter_item(self, document):
        """
        A function that filters on the document based on

        :param document: The mongo document that should be filtered
        :return bool: If the document should be visible
        """
        return True
