from graphene import Schema

from graph.query import Query
from graph.mutation import Mutation

from graph.types.document import DocumentSection, Document
from graph.types.template import TemplateSection, Template
from graph.types.user import User
from graph.types.utils.error import Error


schema = Schema(
    query=Query,
    mutation=Mutation,
    types=[User, DocumentSection, Document, Error, TemplateSection, Template],
)
