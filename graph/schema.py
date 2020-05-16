from graphene import Schema

# don't remove these. They're here to register the models according to Mongoengine
from graph.types.models.template import TemplateModel, TemplateSectionModel
from graph.types.models.document import DocumentSectionModel, DocumentModel
from graph.types.models.user import UserModel

from graph.query import Query
from graph.mutation import Mutation


from graph.types.document import DocumentSection, Document
from graph.types.template import TemplateSection, Template
from graph.types.user import User
from graph.types.error import Error


schema = Schema(
    query=Query,
    mutation=Mutation,
    types=[User, DocumentSection, Document, Error, TemplateSection, Template],
)
