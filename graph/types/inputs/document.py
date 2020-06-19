from graphene import InputObjectType, String, JSONString, ID, List, NonNull

from graph.types.inputs.template import TemplateSectionInput


class DocumentSectionInput(InputObjectType):
    name = String()
    description = String()

    content = String()
    # TODO Other values
    # params = JSONString()


class DocumentInput(InputObjectType):
    title = String()
    description = String()
    author = ID()

    # TODO Other values
    # values = JSONString()

    contents = List(NonNull(DocumentSectionInput))
    # template = List(NonNull(TemplateSectionInput))
