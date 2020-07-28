import React from "react";

import LandingScreen from "../../app/screens/LandingScreen";
import { Platform } from "react-native";

import { NavigationContainer, getPathFromState, getStateFromPath } from "@react-navigation/native";
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
import DocumentSidebarNavigator, { DocumentSidebarParamList } from "./DocumentSidebarNavigator";
import { NestedNavigatorParams } from "./utils";
import { useQuery } from "@apollo/react-hooks";
import {
    GetMyDocumentsDocument,
    GetMyDocumentsQuery,
    GetMyDocumentsQueryVariables,
} from "../graph/graphql";
import ThemedActivityIndicator from "../components/ThemedActivityIndicator";

interface RootNavigatorProps {
    accessToken: string | undefined;
}

export type AppStackParamList = {
    Login: undefined;
    Register: undefined;
    Landing: undefined;
    Document: NestedNavigatorParams<DocumentSidebarParamList>;
    Campaigns: undefined;
};

const Stack = createStackNavigator<AppStackParamList>();

const RootNavigator: React.FC<RootNavigatorProps> = (props: RootNavigatorProps) => {
    const { accessToken } = props;
    const theme = useTheme();
    console.log("THEME", theme);

    // The problem basically went that it was document/{randomUUID} that the navigator could not resolve down to an actual page
    // It then defaulted back to the landing page, which would break the url for that session.
    // This ensures that the data for the ./DocumentSidebarNavigator.tsx is present and ready when loading a url from the searchbar.

    // Do not remove this code, Future Tom.
    const { data, loading, error } = useQuery<GetMyDocumentsQuery, GetMyDocumentsQueryVariables>(
        GetMyDocumentsDocument
    );

    if (loading || error) {
        return <ThemedActivityIndicator />;
    }

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
                          prefixes: ["http://localhost:19006"],
                          config: {
                              Login: "login",
                              Landing: "landing",
                          },
                          getStateFromPath: (path, options) => {
                              const splitPath = path.split("/");
                              if (splitPath.length === 3 && splitPath[1] === "document") {
                                  const newPath = `/Document/${splitPath[2]}?d=${splitPath[2]}`;
                                  return getStateFromPath(newPath, options);
                              }
                              return getStateFromPath(path, options);
                          },
                          getPathFromState: (state, config) => {
                              const getPathPart = (statePart: any) => {
                                  if (
                                      statePart?.routes != undefined &&
                                      statePart?.index != undefined
                                  ) {
                                      return statePart.routes[statePart.index];
                                  }
                                  return undefined;
                              };

                              const docPartMaybe = getPathPart(state);
                              if (docPartMaybe?.name === "Document") {
                                  const docID = getPathPart(docPartMaybe?.state);
                                  if (docID?.name != undefined) {
                                      return "/document/" + docID.name;
                                  }
                              }

                              return getPathFromState(state, config);
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
                            <Stack.Screen name={"Document"} component={DocumentSidebarNavigator} />
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
