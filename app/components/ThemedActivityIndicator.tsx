import React, { useContext } from "react";
import { ActivityIndicator } from "react-native";
import { ThemeContext } from "../utils/ThemeContext";

interface ThemedActivityIndicatorProps {}

const ThemedActivityIndicator: React.FC<ThemedActivityIndicatorProps> = (
    props: ThemedActivityIndicatorProps
) => {
    const { currentTheme } = useContext(ThemeContext);

    return (
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
    );
};

export default ThemedActivityIndicator;
