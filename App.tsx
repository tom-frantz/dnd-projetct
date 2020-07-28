import React, { useEffect, useState } from "react";

import { ApolloProvider } from "@apollo/react-hooks";

import { getClient } from "./app/app/client";
import {
    AuthContext,
    getAccessToken,
    setAccessToken,
    removeAccessToken,
    getRefreshToken,
    setRefreshToken,
    removeRefreshToken,
} from "./app/app/auth";
import LandingScreen from "./app/screens/LandingScreen";
import { ActivityIndicator, Platform, View } from "react-native";
import { loadFonts } from "./app/app/fonts";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import * as eva from "@eva-design/material";
import { ApplicationProvider, IconRegistry, Layout } from "@ui-kitten/components";

import LoginScreen from "./app/screens/LoginScreen";
import DocumentScreen from "./app/screens/DocumentScreen";
import Text from "./app/components/Text";
import Navbar from "./app/containers/Navbar";
import RegisterScreen from "./app/screens/RegisterScreen";
import { myTheme as customTheme } from "./custom-theme";
//@ts-ignore
import expoAppJson from "./app.json";
//@ts-ignore
import mappings from "./mapping.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import RootNavigator from "./app/navigators/RootNavigator";
import { ThemeContext } from "./app/utils/ThemeContext";

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [accessToken, setReactToken] = useState<string | undefined>(undefined);
    const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        Promise.all([
            loadFonts(),
            getAccessToken().then((token) => setReactToken(token || undefined)),
            // new Promise((resolve) => setTimeout(resolve, 4000)),
        ]).then(() => {
            setLoading(false);
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                token: accessToken,
                setTokens: async (token: string, refreshToken: string): Promise<void> => {
                    await Promise.all([setAccessToken(token), setRefreshToken(refreshToken)]);
                    setReactToken(token);
                },
                clearTokens: async (): Promise<void> => {
                    await Promise.all([removeAccessToken(), removeRefreshToken()]);
                    setReactToken(undefined);
                },
            }}
        >
            <ThemeContext.Provider value={{ currentTheme, setCurrentTheme }}>
                <ApolloProvider
                    client={getClient({
                        getAccessToken,
                        getRefreshToken,
                        setAccessToken: async (token: string) => {
                            await setAccessToken(token);
                            setReactToken(token);
                        },
                        setRefreshToken,
                        removeAccessToken: async () => {
                            await removeAccessToken();
                            setReactToken(undefined);
                        },
                        removeRefreshToken,
                    })}
                >
                    {/*<ScrollView contentContainerStyle={{flex: 1}} style={{flex: 1}}>*/}
                    <IconRegistry icons={EvaIconsPack} />
                    <ApplicationProvider
                        {...eva}
                        theme={{
                            ...(currentTheme === "light" ? eva.light : eva.dark),
                            ...customTheme,
                        }}
                        customMapping={mappings}
                    >
                        {loading && (
                            <ActivityIndicator
                                style={{
                                    height: "100%",
                                    width: "100%",
                                    flex: 1,
                                    alignSelf: "center",
                                    justifyContent: "center",
                                    backgroundColor: currentTheme !== "light" ? "#000" : "#FFF",
                                }}
                                size={"large"}
                                color={currentTheme === "light" ? "#000" : "#FFF"}
                            />
                        )}
                        {!loading && <RootNavigator accessToken={accessToken} />}
                    </ApplicationProvider>
                    {/*</ScrollView>*/}
                </ApolloProvider>
            </ThemeContext.Provider>
        </AuthContext.Provider>
    );
};

export default App;
