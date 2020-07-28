import React from "react";
import { ActivityIndicator } from "react-native";

interface ThemedActivityIndicatorProps {}

const ThemedActivityIndicator: React.FC<ThemedActivityIndicatorProps> = (
    props: ThemedActivityIndicatorProps
) => {
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
