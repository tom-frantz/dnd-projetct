from graphene import InputObjectType, String, JSONString, ID, List, NonNull

from graph.types.document import VisibilityEnum, AccessEnum
from graph.types.inputs.template import TemplateSectionInput


class DocumentSectionInput(InputObjectType):
    name = String()
    description = String()

    content = String()
    # TODO Other values
    # params = JSONString()


class UserPrivacySettingsInput(InputObjectType):
    access_type = AccessEnum()
    id = NonNull(ID)


class PrivacySettingsInput(InputObjectType):
    visibility = VisibilityEnum()
    public_access_type = AccessEnum()
    users_access = List(NonNull(UserPrivacySettingsInput))


class DocumentInput(InputObjectType):
    title = String()
    description = String()
    author = ID()

    # TODO Other values
    # values = JSONString()

    contents = List(NonNull(DocumentSectionInput))
    privacy_settings = PrivacySettingsInput()
    # template = List(NonNull(TemplateSectionInput))
