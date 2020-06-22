import React, { useContext, useEffect } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { useQuery, useMutation } from "@apollo/react-hooks";
import Text from "../components/Text";
import {
    CreateNewDocumentDocument,
    CreateNewDocumentMutation,
    CreateNewDocumentMutationVariables,
    MeDocument,
    MeQuery,
    MeQueryVariables,
} from "../graph/graphql";
import { AuthContext } from "../app/auth";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../../App";
import Button from "../components/Button";
import Section from "../components/Section";
import { Icon } from "react-native-elements";
import { ThemeContext } from "../utils/ThemeContext";

interface LandingScreenProps extends StackScreenProps<AppStackParamList, "Landing"> {}

const LandingScreen: React.FC<LandingScreenProps> = (props: LandingScreenProps) => {
    const { navigation } = props;
    const { token, setTokens, clearTokens } = useContext(AuthContext);
    const { primaryColour } = useContext(ThemeContext);

    const { data, loading, error, refetch } = useQuery<MeQuery, MeQueryVariables>(MeDocument);

    const [createNewDocument, {}] = useMutation<
        CreateNewDocumentMutation,
        CreateNewDocumentMutationVariables
    >(CreateNewDocumentDocument);

    if (loading) {
        return <ActivityIndicator size={"large"} color={"#000"} />;
    }

    if (error) {
        return <Text>There was an error</Text>;
    }

    if (data?.me == undefined) {
        return <Text>There was an interesting error here?</Text>;
    }

    const { username, articles } = data.me;

    return (
        <View style={styles.container}>
            <Section first>
                <Text title>{username}</Text>
            </Section>
            <Section>
                <View style={{ flexDirection: "row" }}>
                    <Text style={{ marginRight: 13, flexGrow: 1 }} heading>
                        Articles
                    </Text>
                    <Button
                        onPress={() => {
                            createNewDocument().then((res) => {
                                if (res.data?.documentCreate?.__typename == "DocumentCreate") {
                                    navigation.navigate("Document", {
                                        id: res.data.documentCreate.document.id,
                                    });
                                }
                            });
                        }}
                        style={{ alignSelf: "flex-start" }}
                    >
                        Create
                    </Button>
                </View>
                <View>
                    {articles &&
                        articles.edges.map((edge) => {
                            if (edge == undefined || edge.node == undefined) {
                                return null;
                            }
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        navigation.navigate("Document", {
                                            id: (edge.node as { id: string }).id,
                                        });
                                    }}
                                    key={edge.node.id}
                                    style={{ borderTopWidth: 0.8, borderBottomWidth: 0.8 }}
                                >
                                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                                        <Icon
                                            name={"subject"}
                                            type={"material"}
                                            color={primaryColour}
                                            style={{ padding: 13 }}
                                            onPress={() => {}}
                                        />
                                        <View>
                                            <Text subheading>{edge.node.title}</Text>
                                            <Text style={{ paddingLeft: 13 * 1.5 }}>
                                                {edge.node.description}
                                            </Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            );
                        })}
                </View>
            </Section>
            <Section last>
                <Button onPress={clearTokens}>Logout</Button>
            </Section>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        padding: 13,
    },
    sectionStyle: {
        backgroundColor: "#FFF",
        padding: 13,
        marginBottom: 13,
    },
    firstSection: {
        borderTopRightRadius: 13,
        borderTopLeftRadius: 13,
    },
});

export default LandingScreen;
