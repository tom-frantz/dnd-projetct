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
import LoginScreen from "./app/screens/LoginScreen";
import DocumentScreen from "./app/screens/DocumentScreen";
import Text from "./app/components/Text";
import Navbar from "./app/containers/Navbar";
import RegisterScreen from "./app/screens/RegisterScreen";
import Version from "./app/utils/Version";

export type AppStackParamList = {
    Login: undefined;
    Register: undefined;
    Landing: undefined;
    Document: { id: string };
};

const Stack = createStackNavigator<AppStackParamList>();

const App: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [accessToken, setReactToken] = useState<string | undefined>(undefined);

    useEffect(() => {
        Promise.all([
            loadFonts(),
            getAccessToken().then((token) => setReactToken(token || undefined)),
        ]).then(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <ActivityIndicator style={{ height: "100%" }} size={"large"} color={"#000"} />;
    }

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
                <NavigationContainer
                    linking={
                        Platform.OS === "web"
                            ? {
                                  prefixes: [],
                                  config: {
                                      Login: "login",
                                      Landing: "landing",
                                      Document: "document/:id",
                                  },
                              }
                            : undefined
                    }
                >
                    <Stack.Navigator screenOptions={{ header: Navbar }}>
                        {accessToken === undefined && (
                            <>
                                <Stack.Screen
                                    name={"Login"}
                                    component={LoginScreen}
                                    options={{ header: () => null }}
                                />
                                <Stack.Screen
                                    name={"Register"}
                                    component={RegisterScreen}
                                    options={{ header: () => null }}
                                />
                            </>
                        )}
                        {accessToken !== undefined && (
                            <>
                                <Stack.Screen name={"Landing"} component={LandingScreen} />
                                <Stack.Screen
                                    name={"Document"}
                                    component={DocumentScreen}
                                    initialParams={{ id: "" }}
                                />
                            </>
                        )}
                    </Stack.Navigator>
                    <View style={{ backgroundColor: "#F2F2F2", padding: 13 }}>
                        <Text>DnD Tracker - Tom Frantz - V{Version}</Text>
                    </View>
                </NavigationContainer>
                {/*</ScrollView>*/}
            </ApolloProvider>
        </AuthContext.Provider>
    );
};

export default App;
