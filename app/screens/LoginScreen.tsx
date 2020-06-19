import React, { useContext } from "react";
import { Button, View } from "react-native";
import { useMutation } from "@apollo/react-hooks";
import Text from "../components/Text";
import { LoginDocument, LoginMutation, LoginMutationVariables } from "../graph/graphql";
// @ts-ignore
import { GRAPH_PASSWORD, GRAPH_USERNAME } from "react-native-dotenv";
import { AuthContext } from "../app/auth";

interface LoginScreenProps {}

const LoginScreen: React.FC<LoginScreenProps> = (props: LoginScreenProps) => {
    const { setTokens } = useContext(AuthContext);
    const [login, { data, loading }] = useMutation<LoginMutation, LoginMutationVariables>(
        LoginDocument
    );

    return (
        <View>
            <Text>Login Screen</Text>
            {data?.login?.__typename === "MutationFail" &&
                data.login.errors?.map((err) => <Text>{err.message}</Text>)}
            <Button
                onPress={() => {
                    console.log("happening?");
                    login({
                        variables: {
                            username: GRAPH_USERNAME,
                            password: GRAPH_PASSWORD,
                        },
                    }).then(({ data }) => {
                        if (data?.login?.__typename === "Login") {
                            console.log("HYE");
                            setTokens(data.login.accessToken, data.login.refreshToken);
                        } else console.log("WOW");
                    });
                }}
                title={"Login"}
            >
                Login Default
            </Button>
        </View>
    );
};

export default LoginScreen;
