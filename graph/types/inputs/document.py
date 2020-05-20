from graphene import InputObjectType, String, JSONString, ID, List, NonNull

from graph.types.inputs.template import TemplateSectionInput


class DocumentSectionInput(InputObjectType):
    name = String()
    params = JSONString()
    content = String()


class DocumentInput(InputObjectType):
    title = String()
    description = String()
    author = ID()

    values = JSONString()

    contents = List(NonNull(DocumentSectionInput))
    template = List(NonNull(TemplateSectionInput))
