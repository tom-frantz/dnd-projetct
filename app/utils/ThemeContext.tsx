import React from "react";
import { TextStyle, ViewStyle } from "react-native";

export interface ThemeContextProps {
    currentTheme: "light" | "dark";
    setCurrentTheme(value: "light" | "dark"): void;
}

export const ThemeContext = React.createContext<ThemeContextProps>({
    currentTheme: "light",
    setCurrentTheme: () => console.error("There was no value passed to this prop"),
});
