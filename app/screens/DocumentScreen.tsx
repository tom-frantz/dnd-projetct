import React from "react";
import { StyleSheet, View } from "react-native";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../../App";
import Text from "../components/Text";
import { useQuery } from "@apollo/react-hooks";
import { DocumentDocument, DocumentQuery, DocumentQueryVariables } from "../graph/graphql";
import moment from "moment";
import ContentSection from "../containers/ContentSection";

interface DocumentScreenProps extends StackScreenProps<AppStackParamList, "Document"> {}

const DocumentScreen: React.FC<DocumentScreenProps> = (props: DocumentScreenProps) => {
    const {
        navigation,
        route: {
            params: { id },
        },
    } = props;

    const { data, error, loading } = useQuery<DocumentQuery, DocumentQueryVariables>(
        DocumentDocument,
        { variables: { id }, skip: id === "" }
    );

    if (data == undefined || data.document == undefined) {
        return <Text>This is quirky</Text>;
    }

    const { title, description, contents, created } = data.document;

    return (
        <View style={styles.container}>
            <View
                style={{
                    backgroundColor: "#FFF",
                    padding: 13,
                    borderTopRightRadius: 13,
                    borderTopLeftRadius: 13,
                }}
            >
                <Text title>{title}</Text>
                <Text subtitle>{description}</Text>
                <Text>
                    <Text bold>Created at:</Text> {moment(created).format("MMMM Do, YYYY")}
                </Text>
            </View>
            {contents.map((content, index, array) => {
                if (content == undefined) {
                    return null;
                }
                return (
                    <ContentSection
                        style={
                            index + 1 == array.length && {
                                borderBottomLeftRadius: 13,
                                borderBottomRightRadius: 13,
                            }
                        }
                        key={content.name}
                        name={content.name}
                        description={content.description || undefined}
                        content={content.content || undefined}
                    />
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        padding: 13,
    },
});

export default DocumentScreen;
