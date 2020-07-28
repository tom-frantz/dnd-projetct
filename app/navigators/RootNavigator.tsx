import React from "react";

import LandingScreen from "../../app/screens/LandingScreen";
import { Platform } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { Layout, useTheme } from "@ui-kitten/components";

import LoginScreen from "../../app/screens/LoginScreen";
import DocumentScreen from "../../app/screens/DocumentScreen";
import Text from "../../app/components/Text";
import Navbar from "../../app/containers/Navbar";
import RegisterScreen from "../../app/screens/RegisterScreen";
//@ts-ignore
import expoAppJson from "../../app.json";
import CampaignScreen from "../screens/CampaignScreen";

interface RootNavigatorProps {
    accessToken: string | undefined;
}

export type AppStackParamList = {
    Login: undefined;
    Register: undefined;
    Landing: undefined;
    Document: { id: string };
    Campaigns: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const RootNavigator: React.FC<RootNavigatorProps> = (props: RootNavigatorProps) => {
    const { accessToken } = props;
    const theme = useTheme();
    console.log("THEME", theme);

    return (
        <NavigationContainer
            theme={{
                dark: true,
                colors: {
                    primary: theme["color-primary-500"],
                    background: theme["background-basic-color-4"],
                    card: theme["background-basic-color-4"],
                    text: theme["text-basic-color"],
                    border: theme["border-basic-color-4"],
                },
            }}
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
            <Layout level={"4"} style={{ flex: 1, flexGrow: 1 }}>
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
                            <Stack.Screen name={"Campaigns"} component={CampaignScreen} />
                        </>
                    )}
                </Stack.Navigator>
            </Layout>
            <Layout style={{ padding: 13 }} level={"4"}>
                <Text>Pocket Dimension - Tom Frantz - V{expoAppJson.expo.version}</Text>
            </Layout>
        </NavigationContainer>
    );
};

export default RootNavigator;
