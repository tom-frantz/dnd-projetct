import React, { useContext } from "react";
import { Text as RText, TextProps as RTextProps, StyleSheet } from "react-native";
import { ThemeContext } from "../utils/ThemeContext";

export interface TextProps extends RTextProps {
    title?: boolean;
    subtitle?: boolean;
    heading?: boolean;
    subheading?: boolean;

    bold?: boolean;

    children?: any;
}

const Text: React.FC<TextProps> = (props: TextProps) => {
    const { title, subtitle, heading, subheading, style, children, bold, ...other } = props;
    const { defaultFont, titleFont, subtitleFont, headingFont, subheadingFont } = useContext(
        ThemeContext
    );

    return (
        <RText
            {...other}
            style={[
                defaultFont,
                title && titleFont,
                subtitle && subtitleFont,
                heading && headingFont,
                subheading && subheadingFont,

                bold && styles.bold,

                style,
            ]}
        >
            {children}
        </RText>
    );
};

const styles = StyleSheet.create({
    bold: { fontWeight: "bold" },
});

export default Text;
