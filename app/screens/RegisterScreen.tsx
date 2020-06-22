import React, { useContext, useState } from "react";
import { Platform, StyleSheet, View } from "react-native";

import { useMutation } from "@apollo/react-hooks";
import Text from "../components/Text";
import Section from "../components/Section";
import { Formik } from "formik";
import { TextField } from "react-native-material-textfield";
import { Icon } from "react-native-elements";
import Button from "../components/Button";
import * as Yup from "yup";
import { useNavigation } from "@react-navigation/native";
import { RegisterDocument, RegisterMutation, RegisterMutationVariables } from "../graph/graphql";
import { ThemeContext } from "../utils/ThemeContext";
import { AuthContext } from "../app/auth";

interface RegisterScreenProps {}

const validationSchema = Yup.object({
    username: Yup.string().required(),
    password: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("confirmPassword")], "The passwords must match")
        .min(8),
    confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password")], "The passwords must match")
        .min(8),
});

const RegisterScreen: React.FC<RegisterScreenProps> = (props: RegisterScreenProps) => {
    const navigation = useNavigation();
    const { dangerColour } = useContext(ThemeContext);
    const [register, { loading }] = useMutation<RegisterMutation, RegisterMutationVariables>(
        RegisterDocument
    );

    const { setTokens } = useContext(AuthContext);

    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);
    const [passwordConfirmVisible, setPasswordConfirmVisible] = useState<boolean>(false);

    return (
        <View style={{ alignItems: "center", margin: 13 * 4 }}>
            <Section style={{ width: 400, alignSelf: "center", margin: 13 * 4 }} first last>
                <Text heading>Register</Text>
                <Formik
                    initialValues={{ username: "", password: "", confirmPassword: "" }}
                    validationSchema={validationSchema}
                    onSubmit={({ username, password }, { setFieldError, setErrors, setStatus }) => {
                        register({
                            variables: {
                                username,
                                password,
                            },
                        }).then((res) => {
                            if (res.data?.userCreate?.__typename === "UserCreate") {
                                const { accessToken, refreshToken } = res.data.userCreate;
                                setTokens(accessToken, refreshToken);
                            } else if (res.data?.userCreate?.__typename === "MutationFail") {
                                res.data.userCreate.errors?.map((error) => {
                                    if (error.path[0]) {
                                        setFieldError(error.path.join("."), error.message);
                                    } else {
                                        setStatus(error.message);
                                    }
                                });
                            }
                        });
                    }}
                >
                    {({
                        status,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        handleBlur,
                        handleChange,
                    }) => (
                        <View>
                            <View style={{ marginVertical: 13, alignItems: "center" }}>
                                <TextField
                                    value={values.username}
                                    error={(touched.username && errors.username) || undefined}
                                    onChange={handleChange("username")}
                                    onBlur={handleBlur("username")}
                                    label={"username"}
                                    containerStyle={styles.containerStyleOverride}
                                    labelTextStyle={styles.labelTextOverride}
                                    fontSize={14}
                                />
                                <TextField
                                    value={values.password}
                                    error={(touched.password && errors.password) || undefined}
                                    onChange={handleChange("password")}
                                    onBlur={handleBlur("password")}
                                    label={"password"}
                                    containerStyle={styles.containerStyleOverride}
                                    labelTextStyle={styles.labelTextOverride}
                                    fontSize={14}
                                    secureTextEntry={!passwordVisible}
                                    renderRightAccessory={() => (
                                        <Icon
                                            name={passwordVisible ? "visibility-off" : "visibility"}
                                            onPress={() => {
                                                setPasswordVisible(!passwordVisible);
                                            }}
                                        />
                                    )}
                                />
                                <TextField
                                    value={values.confirmPassword}
                                    error={
                                        (touched.confirmPassword && errors.confirmPassword) ||
                                        undefined
                                    }
                                    onChange={handleChange("confirmPassword")}
                                    onBlur={handleBlur("confirmPassword")}
                                    label={"confirm password"}
                                    containerStyle={styles.containerStyleOverride}
                                    labelTextStyle={styles.labelTextOverride}
                                    fontSize={14}
                                    secureTextEntry={!passwordConfirmVisible}
                                    renderRightAccessory={() => (
                                        <Icon
                                            name={
                                                passwordConfirmVisible
                                                    ? "visibility-off"
                                                    : "visibility"
                                            }
                                            onPress={() => {
                                                setPasswordConfirmVisible(!passwordConfirmVisible);
                                            }}
                                        />
                                    )}
                                />
                                {status && <Text style={{ color: dangerColour }}>{status}</Text>}
                            </View>
                            <Button onPress={handleSubmit} style={{ marginBottom: 13 }}>
                                Submit
                            </Button>
                            <Text>
                                Already have an account?{" "}
                                <Text
                                    style={{ textDecorationLine: "underline" }}
                                    onPress={() => {
                                        navigation.navigate("Login");
                                    }}
                                >
                                    Login
                                </Text>
                            </Text>
                        </View>
                    )}
                </Formik>
            </Section>
        </View>
    );
};

const styles = StyleSheet.create({
    containerStyleOverride: { marginTop: -16, width: "100%" },
    labelTextOverride: {
        fontFamily: "Quattrocento Sans Regular",
        fontSize: 14,
        paddingLeft: Platform.OS == "web" ? "33.3333333%" : undefined,
    },
    override: {
        fontFamily: "Quattrocento Sans Regular",
        fontSize: 14,
        marginTop: 24,
        flexGrow: 1,
        transform: [{ translateY: 0 }],
    },
});

export default RegisterScreen;
