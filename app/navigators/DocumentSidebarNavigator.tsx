import React, { useEffect } from "react";
import {
    createDrawerNavigator,
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from "@react-navigation/drawer";
import DocumentScreen from "../screens/DocumentScreen";
import { useQuery } from "@apollo/react-hooks";
import {
    GetMyDocumentsDocument,
    GetMyDocumentsQuery,
    GetMyDocumentsQueryVariables,
} from "../graph/graphql";
import { load } from "dotenv";
import ThemedActivityIndicator from "../components/ThemedActivityIndicator";
import { StackScreenProps } from "@react-navigation/stack";
import { AppStackParamList } from "./RootNavigator";
import { Platform, Dimensions } from "react-native";

interface DocumentSidebarNavigatorProps extends StackScreenProps<AppStackParamList, "Document"> {}
export const DocumentSidebar = createDrawerNavigator();
export type DocumentSidebarParamList = {
    [key: string]: { id: string };
};

const DocumentSidebarNavigator: React.FC<DocumentSidebarNavigatorProps> = (
    props: DocumentSidebarNavigatorProps
) => {
    const { navigation } = props;
    // If you update the name of this query, please also remember to change it for the root navigator.
    // See ./RootNavigator.tsx for more info about this query
    const { data, loading, error } = useQuery<GetMyDocumentsQuery, GetMyDocumentsQueryVariables>(
        GetMyDocumentsDocument
    );

    if (loading || error) {
        return <ThemedActivityIndicator />;
    }
    return (
        <DocumentSidebar.Navigator
            openByDefault={false}
            drawerType={Dimensions.get("window").width >= 768 ? "permanent" : "slide"}
            drawerContent={(props) => {
                console.log(props);
                return (
                    <DrawerContentScrollView {...props}>
                        <DrawerItemList {...props} />
                        {/*{data?.me?.articles?.edges.map((edge) => {*/}
                        {/*    if (edge?.node == undefined) {*/}
                        {/*        return null;*/}
                        {/*    } else {*/}
                        {/*        return (*/}
                        {/*            <DrawerItem*/}
                        {/*                // name={edge.node.id}*/}
                        {/*                // key={edge.node.id}*/}
                        {/*                // options={{ title: edge.node.title }}*/}
                        {/*                // initialParams={{ id: edge.node.id }}*/}
                        {/*                // component={DocumentScreen}*/}
                        {/*                label={edge.node.title}*/}
                        {/*                onPress={() => {}}*/}
                        {/*            />*/}
                        {/*        );*/}
                        {/*    }*/}
                        {/*})}*/}
                    </DrawerContentScrollView>
                );
            }}
        >
            {data?.me?.articles?.edges.map((edge) => {
                if (edge?.node == undefined) {
                    return null;
                } else {
                    return (
                        <DocumentSidebar.Screen
                            name={edge.node.id}
                            key={edge.node.id}
                            options={{ title: edge.node.title }}
                            initialParams={{ id: edge.node.id }}
                            component={DocumentScreen}
                        />
                    );
                }
            })}
        </DocumentSidebar.Navigator>
    );
};
export default DocumentSidebarNavigator;
