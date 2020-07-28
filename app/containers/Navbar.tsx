import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../components/Text";
import { StackHeaderProps } from "@react-navigation/stack";

import { useRoute, useNavigation } from "@react-navigation/native";
import { useTheme } from "@ui-kitten/components";
import ToggleTheme from "../components/ToggleTheme";

interface NavbarItemProps {
    name: string;
    routeName?: string;
}
interface NavbarProps extends StackHeaderProps {}

const NavbarItem: React.FC<NavbarItemProps> = (props: NavbarItemProps) => {
    const theme = useTheme();
    const { name, routeName } = props;
    const route = useRoute();
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={[
                styles.navbarItem,
                (routeName || name) === route.name && {
                    backgroundColor: theme["color-primary-400"],
                },
                { justifyContent: "center" },
            ]}
            onPress={() => {
                navigation.navigate(routeName || name);
            }}
        >
            <Text category={"basic"} style={{ color: "#000" }}>
                {name}
            </Text>
        </TouchableOpacity>
    );
};

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
    const theme = useTheme();
    const {
        navigation,
        scene: {
            route: { name },
        },
    } = props;

    return (
        <View
            style={{
                flexDirection: "row",
                backgroundColor: theme["color-primary-500"],
                paddingHorizontal: 26 + 16,
                justifyContent: "space-between",
            }}
        >
            <View style={{ flexDirection: "row" }}>
                <NavbarItem name={"Home"} routeName={"Landing"} />
                <NavbarItem name={"Settings"} />
                <NavbarItem name={"Campaigns"} />
            </View>
            <ToggleTheme style={{ margin: 13 }} status={"primary"}>
                <Text style={{ color: "#000" }}>Use Dark Theme</Text>
            </ToggleTheme>
        </View>
    );
};

const styles = StyleSheet.create({
    navbarItem: {
        padding: 13,
    },
});

export default Navbar;
