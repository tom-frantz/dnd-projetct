from functools import partial

from flask_jwt_extended import current_user, jwt_optional, jwt_required
from graphene import Node, Field, List, NonNull, Enum, String, Boolean
from graphene_mongo import MongoengineObjectType
from promise import Promise

from graph.types.models.document import (
    DocumentModel,
    DocumentSectionModel,
    PrivacySettingsModel,
    PRIVATE,
    USERS,
    PUBLIC,
    EDIT,
    READ,
    NONE,
    UserPrivacySettingsModel,
)
from graph.types.utils.connection import CustomConnectionField
from graph.types.value import Value, NumericValue, get_value_from_model


class VisibilityEnum(Enum):
    PRIVATE = PRIVATE
    USERS = USERS
    PUBLIC = PUBLIC


class AccessEnum(Enum):
    READ = READ
    EDIT = EDIT
    NONE = NONE


@jwt_required
def access_to_document(document):
    if document.privacy_settings.visibility == PUBLIC:
        return True

    if current_user == document.author:
        return True

    if document.privacy_settings.visibility == USERS and current_user in [
        subdoc.user for subdoc in document.privacy_settings.users_access
    ]:
        return True

    return False


class DocumentConnectionField(CustomConnectionField):
    class Meta:
        exclude_fields = ("contents", "template")

    @jwt_optional
    def filter_item(self, document: DocumentModel):
        return access_to_document(document)


class UserPrivacySettings(MongoengineObjectType):
    class Meta:
        model = UserPrivacySettingsModel

    access_type = NonNull(AccessEnum)
    user = NonNull("graph.types.user.User")


class PrivacySettings(MongoengineObjectType):
    class Meta:
        model = PrivacySettingsModel

    users_access = NonNull(List(NonNull(UserPrivacySettings)))
    visibility = VisibilityEnum(required=True)
    public_access_type = AccessEnum(required=True)


class DocumentSection(MongoengineObjectType):
    class Meta:
        model = DocumentSectionModel

    values = List(Value)

    # TODO add in a thing that changes the value bit
    @staticmethod
    def resolve_values(root, info):
        return [get_value_from_model(value) for value in root.values]


class Document(MongoengineObjectType):
    class Meta:
        connection_field_class = DocumentConnectionField
        model = DocumentModel
        interfaces = (Node,)
        filter_fields = {
            "title": ["icontains"],
            # "privacy_settings": ["users_access"],
        }

    author = NonNull("graph.types.user.User")
    is_author = NonNull(Boolean)

    @jwt_optional
    def resolve_is_author(root, info):
        return current_user is not None and current_user == root.author

    access_permission = NonNull(AccessEnum)

    @jwt_optional
    def resolve_access_permission(root, info):
        privacy: PrivacySettings = root.privacy_settings
        if current_user.pk == root.author.pk:
            return EDIT
        if privacy.visibility == PRIVATE:
            return NONE
        elif privacy.visibility == USERS:
            for user_access in privacy.users_access:
                if user_access.user.pk == current_user.pk:
                    return user_access.access_type
            return NONE
        else:
            return privacy.public_access_type

    contents = NonNull(List(NonNull(DocumentSection)))
    privacy_settings = NonNull(PrivacySettings)
