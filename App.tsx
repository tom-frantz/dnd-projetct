import React, { useEffect, useState } from "react";
import { ApolloProvider } from "@apollo/react-hooks";
import { ActivityIndicator, Platform, View } from "react-native";

import { ApplicationProvider, IconRegistry } from "@ui-kitten/components";
import * as eva from "@eva-design/material";
import { myTheme as customTheme } from "./custom-theme";
//@ts-ignore
import mappings from "./mapping.json";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import {
    AuthContext,
    getAccessToken,
    setAccessToken,
    removeAccessToken,
    getRefreshToken,
    setRefreshToken,
    removeRefreshToken,
} from "./app/app/auth";
import { getClient } from "./app/app/client";
import { loadFonts } from "./app/app/fonts";
import RootNavigator from "./app/navigators/RootNavigator";
import { ThemeContext } from "./app/utils/ThemeContext";
import AsyncStorage from "@react-native-community/async-storage";

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [accessToken, setReactToken] = useState<string | undefined>(undefined);
    const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        Promise.all([
            loadFonts(),
            getAccessToken().then((token) => setReactToken(token || undefined)),
            // Defaults to light theme.
            AsyncStorage.getItem("theme").then((value) =>
                setCurrentTheme(value === "dark" ? "dark" : "light")
            ),
            // new Promise((resolve) => setTimeout(resolve, 4000)),
        ]).then(() => {
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        AsyncStorage.setItem("theme", currentTheme);
    }, [currentTheme]);

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
