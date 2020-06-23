import React, { useContext } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { EditingContext } from "../utils/EditingContext";
import EditText from "../components/EditText";
import { ThemeContext } from "../utils/ThemeContext";
import Section from "../components/Section";

interface ContentSectionProps {
    fieldName: string;

    last?: boolean;
    removeSection(): void;
}

const ContentSection: React.FC<ContentSectionProps> = (props: ContentSectionProps) => {
    const { headingFont } = useContext(ThemeContext);
    const { fieldName, last, removeSection } = props;

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
            <EditText fieldName={`${fieldName}.content`} multiline numberOfLines={5} />
        </Section>
    );
};

export default ContentSection;
