import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../navigators/RootNavigator";
import Text from "../components/Text";
import { useQuery, useMutation } from "@apollo/react-hooks";
import {
    DocumentDocument,
    DocumentQuery,
    DocumentQueryVariables,
    DocumentUpdateDocument,
    DocumentUpdateMutation,
    DocumentUpdateMutationVariables,
} from "../graph/graphql";
import moment from "moment";
import ContentSection from "../containers/ContentSection";
import { Formik, FormikErrors, useFormik } from "formik";
import * as Yup from "yup";
import { EditingContext } from "../utils/EditingContext";
import { ThemeContext } from "../utils/ThemeContext";
import Button from "../components/Button";
import Scrollbars from "react-custom-scrollbars";
import Section from "../components/Section";
import EditText from "../components/EditText";
import { Card, Icon, Layout, Modal, Select, SelectItem, useTheme } from "@ui-kitten/components";
import Toast from "react-native-root-toast";
import ShareModal from "../containers/ShareModal";
import _ from "lodash";

interface DocumentScreenProps extends StackScreenProps<AppStackParamList, "Document"> {}

const validationSchema = Yup.object({
    title: Yup.string().required("title is a required field."),
    description: Yup.string().nullable(),
    contents: Yup.array(
        Yup.object({
            name: Yup.string().required("name is a required field."),
            description: Yup.string().nullable(),
            content: Yup.string().nullable(),
        }).required()
    ).ensure(),
});

const DocumentScreen: React.FC<DocumentScreenProps> = (props: DocumentScreenProps) => {
    const {
        route: {
            params: { id },
        },
    } = props;
    const theme = useTheme();

    const [editing, setEditing] = useState<boolean>(false);
    const [shareModalVisible, setShareModalVisible] = useState<boolean>(false);

    const { data, error, loading } = useQuery<DocumentQuery, DocumentQueryVariables>(
        DocumentDocument,
        { variables: { id }, skip: id === "" }
    );

    const [documentUpdate, { loading: updateLoading }] = useMutation<
        DocumentUpdateMutation,
        DocumentUpdateMutationVariables
    >(DocumentUpdateDocument);

    if (data == undefined || data.document == undefined) {
        return <Text>This is quirky</Text>;
    }

    const {
        title,
        description,
        contents,
        created,
        privacySettings,
        isAuthor,
        author,
        accessPermission,
    } = data.document;

    return (
        <Layout level="4" style={styles.container}>
            <ShareModal
                visible={shareModalVisible}
                setVisible={setShareModalVisible}
                isAuthor={isAuthor}
                privacySettings={{
                    ...privacySettings,
                    usersAccess: privacySettings.usersAccess,
                }}
                onSubmit={({ publicAccessType, visibility, usersAccess }) => {
                    documentUpdate({
                        variables: {
                            id,
                            input: {
                                privacySettings: {
                                    publicAccessType,
                                    visibility,
                                    usersAccess,
                                },
                            },
                        },
                    })
                        .then((data) => {
                            console.log(data);
                            setShareModalVisible(false);
                        })
                        .catch((errors) => {
                            console.log(errors);
                        });
                }}
            />
            <Scrollbars autoHide={true}>
                <Formik
                    initialValues={{
                        title,
                        description,
                        contents,
                    }}
                    // Needed as the contents are rendered from the current formik values
                    // This is in place to display something even if it's not saved ...
                    // Not sure why'd we do that but oh well.

                    // TODO potentially shift from formik values to Apollo values.
                    enableReinitialize
                    onSubmit={async (values) => {
                        let toast = Toast.show("Submitting", {
                            duration: -1,
                            position: Toast.positions.BOTTOM,
                            shadow: true,
                            backgroundColor: theme["color-primary-500"],
                            textColor: "#000",
                            animation: true,
                            opacity: 1,
                            hideOnPress: false,
                        });

                        return documentUpdate({
                            variables: {
                                id,
                                input: {
                                    title: values.title,
                                    description: values.description,
                                    contents:
                                        values.contents != undefined
                                            ? values.contents.map((content) => ({
                                                  name: content.name,
                                                  description: content.description,
                                                  content: content.content,
                                              }))
                                            : values.contents,
                                },
                            },
                            refetchQueries: [{ query: DocumentDocument, variables: { id } }],
                        })
                            .then((data) => {
                                setEditing(false);
                                Toast.hide(toast);
                                Toast.show("Submitted!", {
                                    duration: Toast.durations.SHORT,
                                    position: Toast.positions.BOTTOM,
                                    shadow: true,
                                    backgroundColor: theme["color-primary-500"],
                                    textColor: "#000",
                                    animation: true,
                                    opacity: 1,
                                });
                                return data;
                            })
                            .catch((e) => {
                                Toast.hide(toast);
                                Toast.show(e.message, {
                                    duration: Toast.durations.LONG,
                                    position: Toast.positions.BOTTOM,
                                    shadow: false,
                                    backgroundColor: theme["color-danger-500"],
                                    textColor: "#000",
                                    animation: true,
                                    opacity: 1,
                                });
                                console.error(e);
                            });
                    }}
                    validationSchema={validationSchema}
                >
                    {({ setFieldValue, values, handleSubmit }) => (
                        <>
                            <EditingContext.Provider
                                value={{
                                    startUpdate: () => {
                                        handleSubmit();
                                    },
                                }}
                            >
                                <Section first>
                                    <View style={{ flexDirection: "row", width: "100%" }}>
                                        <View style={{ flex: 1 }}>
                                            <EditText
                                                fieldName={"title"}
                                                category={"h1"}
                                                editStyle={{ textTransform: "none" }}
                                            />
                                            <EditText fieldName={"description"} category={"s1"} />
                                            {!editing && (
                                                <>
                                                    <Text>
                                                        <Text bold>Created at:</Text>{" "}
                                                        {moment(created).format("MMMM Do, YYYY")}
                                                    </Text>
                                                    <Text>
                                                        <Text bold>Created by:</Text>{" "}
                                                        {isAuthor ? "You" : author.username}
                                                    </Text>
                                                    {!isAuthor && (
                                                        <Text>
                                                            You have{" "}
                                                            <Text bold>
                                                                {_.startCase(accessPermission)}
                                                            </Text>{" "}
                                                            access.
                                                        </Text>
                                                    )}
                                                </>
                                            )}
                                        </View>
                                        {!editing && (
                                            <>
                                                <Button
                                                    style={{ alignSelf: "flex-start" }}
                                                    onPress={() => {
                                                        setShareModalVisible(true);
                                                    }}
                                                >
                                                    Share
                                                </Button>
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        values.contents.splice(0, 0, {
                                                            name: "Untitled Section",
                                                        });
                                                        setFieldValue("contents", values.contents);
                                                    }}
                                                    style={{ alignSelf: "flex-end" }}
                                                >
                                                    <Icon
                                                        name={"plus-outline"}
                                                        fill={theme["color-primary-500"]}
                                                        style={{
                                                            width: 24,
                                                            height: 24,
                                                            alignSelf: "flex-end",
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                                {/*<TouchableOpacity*/}
                                                {/*    onPress={() => {*/}
                                                {/*        setEditing(!editing);*/}
                                                {/*    }}*/}
                                                {/*>*/}
                                                {/*    <Icon*/}
                                                {/*        name={"settings-2-outline"}*/}
                                                {/*        fill={theme["color-primary-500"]}*/}
                                                {/*        style={{*/}
                                                {/*            width: 24,*/}
                                                {/*            height: 24,*/}
                                                {/*            marginLeft: 13,*/}
                                                {/*        }}*/}
                                                {/*    />*/}
                                                {/*</TouchableOpacity>*/}
                                            </>
                                        )}
                                        {/*{editing && (*/}
                                        {/*    <TouchableOpacity*/}
                                        {/*        onPress={() => {*/}
                                        {/*            handleSubmit();*/}
                                        {/*        }}*/}
                                        {/*    >*/}
                                        {/*        <Icon*/}
                                        {/*            name={"checkmark-outline"}*/}
                                        {/*            fill={theme["color-primary-500"]}*/}
                                        {/*            style={{*/}
                                        {/*                width: 24,*/}
                                        {/*                height: 24,*/}
                                        {/*                marginLeft: 13,*/}
                                        {/*            }}*/}
                                        {/*        />*/}
                                        {/*    </TouchableOpacity>*/}
                                        {/*)}*/}
                                    </View>
                                </Section>

                                {values.contents.map((content, index, array) => {
                                    return (
                                        <ContentSection
                                            last={index + 1 == array.length && !editing}
                                            fieldName={`contents[${index}]`}
                                            removeSection={() => {
                                                setFieldValue(
                                                    "contents",
                                                    values.contents.filter(
                                                        (_, otherIndex) => index != otherIndex
                                                    )
                                                );
                                                handleSubmit();
                                            }}
                                            addContentUnder={() => {
                                                values.contents.splice(index + 1, 0, {
                                                    name: "Untitled Section",
                                                });
                                                setFieldValue("contents", values.contents);
                                                handleSubmit();
                                            }}
                                            duplicateContent={() => {
                                                values.contents.splice(
                                                    index + 1,
                                                    0,
                                                    _.clone(values.contents[index])
                                                );
                                                setFieldValue("contents", values.contents);
                                                handleSubmit();
                                            }}
                                            moveContentUp={() => {
                                                if (index > 0) {
                                                    values.contents.splice(
                                                        index - 1,
                                                        0,
                                                        values.contents.splice(index, 1)[0]
                                                    );
                                                    setFieldValue("contents", values.contents);
                                                    handleSubmit();
                                                }
                                            }}
                                            moveContentDown={() => {
                                                if (index + 1 < array.length) {
                                                    values.contents.splice(
                                                        index + 1,
                                                        0,
                                                        values.contents.splice(index, 1)[0]
                                                    );
                                                    setFieldValue("contents", values.contents);
                                                    handleSubmit();
                                                }
                                            }}
                                        />
                                    );
                                })}

                                {editing && (
                                    <Section last style={{ flexDirection: "row" }}>
                                        <View style={{ flexGrow: 1 }}>
                                            <Button
                                                onPress={() => {
                                                    setFieldValue("contents", [
                                                        ...values.contents,
                                                        { title },
                                                    ]);
                                                }}
                                            >
                                                Add Document Section
                                            </Button>
                                        </View>
                                        <Button
                                            danger
                                            onPress={() => {}}
                                            style={{ alignSelf: "flex-end" }}
                                        >
                                            Delete Document
                                        </Button>
                                    </Section>
                                )}
                            </EditingContext.Provider>
                        </>
                    )}
                </Formik>
            </Scrollbars>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        display: "flex",
    },
    lastSection: {
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
    },
});

export default DocumentScreen;
