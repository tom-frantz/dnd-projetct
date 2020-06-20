import React from "react";
import { TextStyle, ViewStyle } from "react-native";

export interface Theme {
    defaultSpacing: number;
    primaryColour: string;
    secondaryColour: string;

    defaultFont: TextStyle;
    titleFont: TextStyle;
    subtitleFont: TextStyle;
    headingFont: TextStyle;
    subheadingFont: TextStyle;

    buttonContainer: ViewStyle;
    buttonFont: TextStyle;
}

export const defaultTheme: Theme = {
    defaultSpacing: 13,
    primaryColour: "#003362",
    secondaryColour: "#054177",
    defaultFont: { fontFamily: "Quattrocento Sans Regular", fontSize: 14 },
    titleFont: {
        color: "#003362",
        fontFamily: "Libre Baskerville Regular",
        fontSize: 14 * 3.3,
        textTransform: "uppercase",
    },
    subtitleFont: {
        color: "#054177",
        fontSize: 14 * 1.75,
        fontFamily: "Quattrocento Sans Italic",
    },
    headingFont: { fontFamily: "Libre Baskerville Regular", fontSize: 14 * 2.5, color: "#003362" },
    subheadingFont: { fontFamily: "Libre Baskerville Regular", fontSize: 14 * 2, color: "#054177" },
    buttonContainer: {
        borderWidth: 1,
        borderRadius: 6.5,
        padding: 6.5,
        borderColor: "#003362",
        backgroundColor: "#003362",
        width: "fit-content",
    },
    buttonFont: {
        color: "#FFF",
    },
};

export const ThemeContext = React.createContext<Theme>(defaultTheme);
