import React from "react";
import { View } from "react-native";

interface SectionProps {
    children?: any;
    first?: boolean;
    last?: boolean;
}

const Section: React.FC<SectionProps> = (props: SectionProps) => {
    const { children, first, last } = props;
    return (
        <View style={[styles.section, first && styles.first, last && styles.last]}>{children}</View>
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
