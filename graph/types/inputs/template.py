from graphene import InputObjectType, String, JSONString, List, ID, NonNull


class TemplateSectionInput(InputObjectType):
    name = String()
    render_type = String()
    default_params = JSONString()


class TemplateInput(InputObjectType):
    title = String()
    description = String()
    author = ID()

    contents = List(NonNull(TemplateSectionInput))
