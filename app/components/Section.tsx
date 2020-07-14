import React from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Layout } from "@ui-kitten/components";

interface SectionProps {
    children?: any;
    first?: boolean;
    last?: boolean;
    style?: StyleProp<ViewStyle>;
}

const Section: React.FC<SectionProps> = (props: SectionProps) => {
    const { children, first, last, style } = props;
    return (
        <Layout
            level={"1"}
            style={[styles.section, first && styles.first, last && styles.last, style]}
        >
            {children}
        </Layout>
    );
};

const styles = {
    section: {
        backgroundColor: "#FFF",
        padding: 13,
        marginBottom: 13,
    },

    first: { borderTopLeftRadius: 13, borderTopRightRadius: 13 },
    last: { borderBottomLeftRadius: 13, borderBottomRightRadius: 13, marginBottom: 0 },
};

export default Section;
