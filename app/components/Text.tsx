import React from "react";
import { Text as RText, TextProps as RTextProps, StyleSheet } from "react-native";

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
    return (
        <RText
            {...other}
            style={[
                styles.default,
                title && styles.title,
                subtitle && styles.subtitle,
                heading && styles.heading,
                subheading && styles.subheading,

                bold && styles.bold,

                style,
            ]}
        >
            {children}
        </RText>
    );
};

const styles = StyleSheet.create({
    default: { fontFamily: "Quattrocento Sans Regular", fontSize: 14 },
    title: {
        color: "#003362",
        fontFamily: "Libre Baskerville Regular",
        fontSize: 14 * 3.3,
        textTransform: "uppercase",
    },
    subtitle: {
        color: "#054177",
        fontSize: 14 * 1.75,
        fontFamily: "Quattrocento Sans Italic",
    },
    heading: { fontFamily: "Libre Baskerville Regular", fontSize: 14 * 2.5, color: "#003362" },
    subheading: { fontFamily: "Libre Baskerville Regular", fontSize: 14 * 2, color: "#054177" },
    bold: { fontWeight: "bold" },
});

export default Text;
