from graphene import Schema
from graph.query import Query
from graph.mutation import Mutation


schema = Schema(query=Query, mutation=Mutation)
