import React, { useContext, useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../../App";
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
import { Icon } from "react-native-elements";
import Section from "../components/Section";
import EditText from "../components/EditText";
import { Layout } from "@ui-kitten/components";

interface DocumentScreenProps extends StackScreenProps<AppStackParamList, "Document"> {}

const validationSchema = Yup.object({
    title: Yup.string().required(),
    description: Yup.string(),
    contents: Yup.array(
        Yup.object({
            name: Yup.string().required("name is a required field."),
            description: Yup.string(),
            content: Yup.string(),
        }).required()
    ).ensure(),
});

const DocumentScreen: React.FC<DocumentScreenProps> = (props: DocumentScreenProps) => {
    const {
        route: {
            params: { id },
        },
    } = props;

    const { titleFont, subtitleFont, primaryColour, dangerColour } = useContext(ThemeContext);

    const [editing, setEditing] = useState<boolean>(false);

    const { data, error, loading } = useQuery<DocumentQuery, DocumentQueryVariables>(
        DocumentDocument,
        { variables: { id }, skip: id === "" }
    );

    console.log(data);

    const [documentUpdate, { loading: updateLoading }] = useMutation<
        DocumentUpdateMutation,
        DocumentUpdateMutationVariables
    >(DocumentUpdateDocument);

    if (data == undefined || data.document == undefined) {
        return <Text>This is quirky</Text>;
    }

    const { title, description, contents, created } = data.document;

    return (
        <Scrollbars>
            <Layout level="4" style={styles.container}>
                <EditingContext.Provider value={{ editing }}>
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
                            console.log("Submitting");
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
                                .then(() => {
                                    setEditing(false);
                                })
                                .catch((e) => {
                                    console.error(e);
                                });
                        }}
                        validationSchema={validationSchema}
                    >
                        {({
                            submitForm,
                            setFieldValue,
                            values,
                            handleSubmit,
                            validateForm,
                            setErrors,
                            setTouched,
                        }) => (
                            <>
                                <Section first>
                                    <View style={{ flexDirection: "row", width: "100%" }}>
                                        <View style={{ flex: 1 }}>
                                            <EditText
                                                fieldName={"title"}
                                                style={titleFont}
                                                editStyle={{ textTransform: "none" }}
                                            />
                                            <EditText
                                                fieldName={"description"}
                                                style={subtitleFont}
                                            />
                                            {!editing && (
                                                <Text>
                                                    <Text bold>Created at:</Text>{" "}
                                                    {moment(created).format("MMMM Do, YYYY")}
                                                </Text>
                                            )}
                                        </View>
                                        {!editing && (
                                            <Icon
                                                name={"settings"}
                                                type={"material"}
                                                color={primaryColour}
                                                style={{ alignSelf: "flex-start" }}
                                                onPress={() => setEditing(!editing)}
                                                containerStyle={{
                                                    alignSelf: "flex-start",
                                                    marginLeft: 13,
                                                }}
                                            />
                                        )}
                                        {editing && (
                                            <Icon
                                                name={"check"}
                                                type={"material"}
                                                color={primaryColour}
                                                onPress={handleSubmit}
                                                style={{ alignSelf: "flex-start" }}
                                                containerStyle={{
                                                    alignSelf: "flex-start",
                                                    marginLeft: 13,
                                                }}
                                            />
                                        )}
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
                            </>
                        )}
                    </Formik>
                </EditingContext.Provider>
            </Layout>
        </Scrollbars>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        display: "flex",
        padding: 13,
    },
    lastSection: {
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
    },
});

export default DocumentScreen;
