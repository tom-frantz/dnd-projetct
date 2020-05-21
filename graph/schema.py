from graphene import Schema

from graph.query import Query
from graph.mutation import Mutation
from graph.subscription import Subscription

from graph.types.document import DocumentSection, Document
from graph.types.template import TemplateSection, Template
from graph.types.user import User

from graph.types.utils.error import Error

schema = Schema(
    query=Query,
    mutation=Mutation,
    subscription=Subscription,
    types=[User, DocumentSection, Document, TemplateSection, Template, Error],
)
