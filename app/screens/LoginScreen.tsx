import React, { useContext } from "react";
import { ActivityIndicator, View } from "react-native";
import { useMutation } from "@apollo/react-hooks";
import Text from "../components/Text";
import { LoginDocument, LoginMutation, LoginMutationVariables } from "../graph/graphql";
// @ts-ignore
import { GRAPH_PASSWORD, GRAPH_USERNAME } from "react-native-dotenv";
import { AuthContext } from "../app/auth";
import { Formik } from "formik";
import * as Yup from "yup";
import Section from "../components/Section";
import { useNavigation } from "@react-navigation/native";
import { ThemeContext } from "../utils/ThemeContext";
import Button from "../components/Button";
import FormikTextField from "../components/form/FormikTextField";

interface LoginScreenProps {}

const validationSchema = Yup.object({
    username: Yup.string().required(),
    password: Yup.string().required(),
});

const LoginScreen: React.FC<LoginScreenProps> = (props: LoginScreenProps) => {
    const { setTokens } = useContext(AuthContext);
    const { dangerColour } = useContext(ThemeContext);

    const [login, { loading }] = useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);

    const navigation = useNavigation();

    return (
        <View style={{ alignItems: "center", margin: 13 * 4 }}>
            <Text title>DnD Projetct</Text>
            <Section style={{ width: 400, alignSelf: "center", margin: 13 * 4 }} first last>
                <Text heading>Login</Text>
                <Formik
                    initialValues={{ username: "", password: "" }}
                    validationSchema={validationSchema}
                    onSubmit={({ username, password }, { setFieldError, setErrors, setStatus }) => {
                        login({
                            variables: {
                                username,
                                password,
                            },
                        })
                            .then((res) => {
                                if (res.data?.login?.__typename === "Login") {
                                    const { accessToken, refreshToken } = res.data.login;
                                    setTokens(accessToken, refreshToken);
                                } else if (res.data?.login?.__typename === "MutationFail") {
                                    res.data.login.errors?.map((error) => {
                                        if (error.path[0]) {
                                            setFieldError(error.path.join("."), error.message);
                                        } else {
                                            setStatus(error.message);
                                        }
                                    });
                                }
                            })
                            .catch((e) => {
                                setStatus(e.message);
                            });
                    }}
                >
                    {({ status, handleSubmit }) => (
                        <View>
                            <View style={{ marginVertical: 13, alignItems: "center" }}>
                                <FormikTextField fieldName={"username"} />
                                <FormikTextField
                                    fieldName={"password"}
                                    passwordField
                                />
                                {status && <Text style={{ color: dangerColour }}>{status}</Text>}
                            </View>
                            <View
                                style={{
                                    flexDirection: "row",
                                    justifyContent: "flex-start",
                                    alignItems: "center",
                                    marginBottom: 13,
                                }}
                            >
                                <Button onPress={handleSubmit} style={{ marginRight: 13 }}>
                                    Submit
                                </Button>
                                <ActivityIndicator animating={loading} size={"small"} />
                            </View>
                            <Text>
                                Don't have an account?{" "}
                                <Text
                                    style={{ textDecorationLine: "underline" }}
                                    onPress={() => {
                                        navigation.navigate("Register");
                                    }}
                                >
                                    Register
                                </Text>
                            </Text>
                        </View>
                    )}
                </Formik>
            </Section>
        </View>
    );
};

export default LoginScreen;
