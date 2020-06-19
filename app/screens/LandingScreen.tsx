import React, { useContext, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { useQuery } from "@apollo/react-hooks";
import Text from "../components/Text";
import { MeDocument, MeQuery, MeQueryVariables } from "../graph/graphql";
import { AuthContext } from "../app/auth";
import { StackNavigationProp, StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "../../App";

interface LandingScreenProps extends StackScreenProps<AppStackParamList, "Landing"> {}

const LandingScreen: React.FC<LandingScreenProps> = (props: LandingScreenProps) => {
    const { navigation } = props;
    const { token, setTokens } = useContext(AuthContext);

    const { data, loading, error } = useQuery<MeQuery, MeQueryVariables>(MeDocument);

    if (loading) {
        return <ActivityIndicator size={"large"} color={"#000"} />;
    }

    if (error) {
        console.info(error);
        return <Text>There was an error</Text>;
    }

    if (data?.me == undefined) {
        return <Text>There was an interesting error here?</Text>;
    }

    const { username, articles } = data.me;

    return (
        <View style={styles.container}>
            <Text title>{username}</Text>
            <Text heading>Articles</Text>
            <View style={{ paddingLeft: 13 }}>
                {articles &&
                    articles.edges.map((edge) => {
                        if (edge == undefined || edge.node == undefined) {
                            return null;
                        }
                        return (
                            <View key={edge.node.id}>
                                <Text
                                    subheading
                                    onPress={() => {
                                        navigation.navigate("Document", {
                                            id: (edge.node as { id: string }).id,
                                        });
                                    }}
                                    style={{ textDecorationLine: "underline" }}
                                >
                                    {edge.node.title}
                                </Text>
                                <Text>{edge.node.description}</Text>
                            </View>
                        );
                    })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        margin: 13,
        padding: 13,
        borderRadius: 13,
        backgroundColor: "#fff",
    },
});

export default LandingScreen;
