import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "../components/Text";
import { StackHeaderProps } from "@react-navigation/stack";
import { useRoute, useNavigation } from "@react-navigation/native";

interface NavbarItemProps {
    name: string;
    routeName?: string;
}
interface NavbarProps extends StackHeaderProps {}

const NavbarItem: React.FC<NavbarItemProps> = (props: NavbarItemProps) => {
    const { name, routeName } = props;
    const route = useRoute();
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            style={[
                styles.navbarItem,
                (routeName || name) === route.name && { backgroundColor: "#054177" },
            ]}
            onPress={() => {
                navigation.navigate(routeName || name);
            }}
        >
            <Text style={{ color: "#FFF" }}>{name}</Text>
        </TouchableOpacity>
    );
};

const Navbar: React.FC<NavbarProps> = (props: NavbarProps) => {
    const {
        navigation,
        scene: {
            route: { name },
        },
    } = props;

    return (
        <View
            style={{ flexDirection: "row", backgroundColor: "#003362", paddingHorizontal: 26 + 16 }}
        >
            <NavbarItem name={"Home"} routeName={"Landing"} />
            <NavbarItem name={"Settings"} />
        </View>
    );
};

const styles = StyleSheet.create({
    navbarItem: {
        padding: 13,
    },
});

export default Navbar;
