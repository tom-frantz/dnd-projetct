import React, { useContext } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { EditingContext } from "../utils/EditingContext";
import EditText from "../components/EditText";
import { ThemeContext } from "../utils/ThemeContext";
import Section from "../components/Section";

interface ContentSectionProps {
    // Content sections
    name: string;
    description?: string;
    content?: string;

    fieldName: string; // Name for formik field props.

    last?: boolean;
    removeSection(): void;
}

const ContentSection: React.FC<ContentSectionProps> = (props: ContentSectionProps) => {
    const { headingFont } = useContext(ThemeContext);
    const { name, description, content, fieldName, last, removeSection } = props;

    const { editing } = useContext(EditingContext);

    return (
        <Section last={last}>
            <View style={{ flexDirection: "row", alignContent: "center" }}>
                <View style={{ flexWrap: "wrap", flexDirection: "row", flex: 1 }}>
                    <EditText
                        style={[headingFont]}
                        fieldName={`${fieldName}.name`}
                        nonEditStyle={{ marginRight: 13 }}
                    />

                    <EditText
                        style={{ fontWeight: "bold", alignSelf: "flex-end" }}
                        nonEditStyle={{ marginBottom: 6 }}
                        fieldName={`${fieldName}.description`}
                    />
                </View>
                {editing && (
                    <>
                        <Icon
                            name={"delete"}
                            type={"material"}
                            style={{ alignSelf: "flex-start" }}
                            onPress={removeSection}
                            containerStyle={{ alignSelf: "flex-start", marginLeft: 13 }}
                        />
                    </>
                )}
            </View>
            <EditText fieldName={`${fieldName}.content`} />
        </Section>
    );
};

export default ContentSection;
