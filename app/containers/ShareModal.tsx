import React, { useContext, useState } from "react";
import { TouchableOpacity, View, ViewProps } from "react-native";
import Text from "../components/Text";
import { Card, Icon, Modal, useTheme } from "@ui-kitten/components";
import Select, { DataItem } from "../components/Select";
import { AccessEnum, VisibilityEnum } from "../graph/graphql";
import { ThemeContext } from "../utils/ThemeContext";
import Button from "../components/Button";
import { FormikContext, useFormik } from "formik";
import * as Yup from "yup";
import SearchUserPopover from "../components/SearchUserPopover";

interface ShareModalProps {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    privacySettings: {
        visibility: VisibilityEnum;
        publicAccessType: AccessEnum;
        usersAccess: { user: { username: string; id: string }; accessType: AccessEnum }[];
    };
    isAuthor: boolean;
    onSubmit: (visibilityUpdate: {
        visibility: VisibilityEnum;
        publicAccessType: AccessEnum;
        usersAccess: { id: string; accessType: AccessEnum }[];
    }) => void;
}

const validationSchema = Yup.object({});

const ShareModal: React.FC<ShareModalProps> = (props: ShareModalProps) => {
    const { visible, setVisible, privacySettings, isAuthor, onSubmit } = props;
    const theme = useTheme();

    const items = [
        {
            title: "Private",
            value: VisibilityEnum.Private,
        },
        {
            title: "Custom Users",
            value: VisibilityEnum.Users,
        },
        {
            title: "Public",
            value: VisibilityEnum.Public,
        },
    ];

    // TODO change this to just use the root document form???
    const formik = useFormik<{
        visibility: VisibilityEnum;
        publicAccessType: AccessEnum;
        usersAccess: { user: { username: string; id: string }; accessType: AccessEnum }[];
    }>({
        initialValues: privacySettings,
        enableReinitialize: true,
        onSubmit: (values) => {
            props.onSubmit({
                ...values,
                usersAccess: values.usersAccess.map(({ user: { id }, accessType }) => ({
                    id,
                    accessType,
                })),
            });
        },
        validationSchema,
    });

    const { values, setFieldValue, handleSubmit } = formik;

    return (
        <Modal
            visible={visible}
            onBackdropPress={() => setVisible(false)}
            backdropStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
        >
            <FormikContext.Provider value={formik}>
                <Card
                    disabled={true}
                    header={(props?: ViewProps) => (
                        <View
                            {...props}
                            style={[
                                props?.style,
                                { flexDirection: "row", justifyContent: "space-between" },
                            ]}
                        >
                            <Text category={"s1"} bold>
                                Share Page
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    setVisible(false);
                                }}
                                style={{
                                    alignSelf: "center",
                                }}
                            >
                                <Icon
                                    name={"close"}
                                    fill={theme["basic-primary-color-500"]}
                                    style={{
                                        width: 24,
                                        height: 24,
                                        marginLeft: 13,
                                    }}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    footer={(props) => (
                        <View {...props} style={[props?.style, { flexDirection: "row" }]}>
                            <Button onPress={handleSubmit}>Save</Button>
                        </View>
                    )}
                >
                    <Text category={"s1"}>Visibility</Text>
                    <Select
                        disabled={!isAuthor}
                        data={items}
                        label={"Visibility"}
                        caption={
                            "This is the visibility of the entire document. This can be overridden by specific sections."
                        }
                        value={values.visibility}
                        onChange={({ value: visibility }) =>
                            setFieldValue("visibility", visibility as VisibilityEnum)
                        }
                    />
                    {values.visibility === VisibilityEnum.Public && (
                        <View style={{ marginTop: 13 }}>
                            <Text category={"s1"}>Link Access Control</Text>
                            <Select
                                disabled={!isAuthor}
                                data={[
                                    { title: "Read", value: AccessEnum.Read },
                                    { title: "Edit", value: AccessEnum.Edit },
                                ]}
                                caption={"This is the amount of access everyone has."}
                                value={values.publicAccessType}
                                onChange={({ value }) => {
                                    setFieldValue("publicAccessType", value);
                                }}
                            />
                        </View>
                    )}
                    {values.visibility === VisibilityEnum.Users && isAuthor && (
                        <View style={{ marginTop: 13 }}>
                            <Text category={"s1"}>User Access Control</Text>
                            {values.usersAccess.map(({ user, accessType }, index) => (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        marginTop: 13,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setFieldValue(
                                                "usersAccess",
                                                values.usersAccess.filter(
                                                    (item) => item.user.id != user.id
                                                )
                                            );
                                        }}
                                        style={{
                                            alignSelf: "center",
                                        }}
                                    >
                                        <Icon
                                            name={"close"}
                                            fill={theme["basic-primary-color-500"]}
                                            style={{
                                                width: 24,
                                                height: 24,
                                            }}
                                        />
                                    </TouchableOpacity>
                                    <Text bold style={{ flex: 1, fontSize: 14 * 1.75 }}>
                                        {user.username}
                                    </Text>
                                    <Select
                                        style={{ flex: 1 }}
                                        data={[
                                            { title: "Read", value: AccessEnum.Read },
                                            { title: "Edit", value: AccessEnum.Edit },
                                        ]}
                                        value={accessType}
                                        onChange={({ value: accessType }) => {
                                            setFieldValue(`usersAccess.${index}`, {
                                                user,
                                                accessType,
                                            });
                                        }}
                                    />
                                </View>
                            ))}
                            {values.usersAccess.length === 0 && (
                                <Text>Currently, no users have specific access permissions</Text>
                            )}
                            <SearchUserPopover
                                onSubmit={(user) => {
                                    if (
                                        values.usersAccess.find(
                                            (item) => item.user.id == user.id
                                        ) === undefined
                                    )
                                        setFieldValue("usersAccess", [
                                            ...formik.values.usersAccess,
                                            {
                                                user,
                                                accessType: AccessEnum.Read,
                                            },
                                        ]);
                                }}
                            />
                        </View>
                    )}
                </Card>
            </FormikContext.Provider>
        </Modal>
    );
};

export default ShareModal;
