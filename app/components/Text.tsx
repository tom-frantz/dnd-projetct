import React, { useContext } from "react";
import { StyleSheet } from "react-native";
import { Text as KText, TextProps as KTextProps } from "@ui-kitten/components";
import { ThemeContext } from "../utils/ThemeContext";

export interface TextProps extends KTextProps {
    bold?: boolean;

    children?: any;
}

const Text: React.FC<TextProps> = (props: TextProps) => {
    const { style, children, bold, ...other } = props;

    return (
        <KText {...other} style={[bold && styles.bold, style]}>
            {children}
        </KText>
    );
};

const styles = StyleSheet.create({
    bold: { fontWeight: "800" },
});

export default Text;
