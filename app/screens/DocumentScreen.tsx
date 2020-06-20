import React, { useContext, useState } from "react";
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
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { EditingContext } from "../utils/EditingContext";
import { ThemeContext } from "../utils/ThemeContext";
import Button from "../components/Button";
import Scrollbars from "react-custom-scrollbars";
import { Icon } from "react-native-elements";
import Section from "../components/Section";

interface DocumentScreenProps extends StackScreenProps<AppStackParamList, "Document"> {}

const validationSchema = Yup.object({
    title: Yup.string().required(),
    description: Yup.string(),
    contents: Yup.array(
        Yup.object({
            name: Yup.string().required(),
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

    const {} = useContext(ThemeContext);

    const [lastSave, setLastSave] = useState<moment.Moment | undefined>(undefined);
    const [editing, setEditing] = useState<boolean>(false);

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

    const { title, description, contents, created } = data.document;

    return (
        <Scrollbars>
            <View style={styles.container}>
                <EditingContext.Provider value={{ editing }}>
                    <Formik
                        initialValues={{
                            title,
                            description,
                            contents,
                        }}
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
                            }).then(() => {
                                setEditing(false);
                            });
                        }}
                        validationSchema={validationSchema}
                    >
                        {({ submitForm, setFieldValue, errors, values, isValid }) => (
                            <>
                                <Section first>
                                    <View style={{ flexDirection: "row" }}>
                                        <View style={{ flexGrow: 1 }}>
                                            <Text title>{title}</Text>
                                            <Text subtitle>{description}</Text>
                                            <Text>
                                                <Text bold>Created at:</Text>{" "}
                                                {moment(created).format("MMMM Do, YYYY")}
                                            </Text>
                                        </View>
                                        {!editing && (
                                            <Icon
                                                name={"settings"}
                                                type={"material"}
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
                                                onPress={submitForm}
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
                                    if (content == undefined) {
                                        return null;
                                    }
                                    return (
                                        <ContentSection
                                            last={index + 1 == array.length && !editing}
                                            fieldName={`contents[${index}]`}
                                            key={content.name}
                                            name={content.name}
                                            description={content.description || undefined}
                                            content={content.content || undefined}
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
                                    <Section last>
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
                                    </Section>
                                )}
                            </>
                        )}
                    </Formik>
                </EditingContext.Provider>
            </View>
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
