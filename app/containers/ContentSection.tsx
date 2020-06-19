import React, { useContext, useState } from "react";
import Text from "../components/Text";
import { StyleProp, View, ViewStyle } from "react-native";
import { Icon } from "react-native-elements";
import { EditingContext } from "../utils/EditingContext";
import EditText from "../components/EditText";

interface ContentSectionProps {
    name: string;
    description?: string;
    content?: string;
    style?: StyleProp<ViewStyle>;
}

const ContentSection: React.FC<ContentSectionProps> = (props: ContentSectionProps) => {
    const { name, description, content, style } = props;
    const [editing, setEditing] = useState<boolean>(false);

    return (
        <EditingContext.Provider value={{ editing }}>
            <View
                style={[
                    {
                        borderColor: "#F2F2F2",
                        backgroundColor: "#FFF",
                        marginVertical: 13,
                        padding: 13,
                        marginHorizontal: 0,
                    },
                    style,
                ]}
            >
                <View style={{ flexDirection: "row", alignContent: "center" }}>
                    <View style={{ flexWrap: "wrap", flexDirection: "row", flex: 1 }}>
                        <Text style={{ width: "fit-content", marginRight: 13 }} heading>
                            {name}
                        </Text>

                        <Text
                            style={{
                                width: "fit-content",
                                alignSelf: "flex-end",
                                paddingBottom: 6,
                            }}
                            bold
                        >
                            {description}
                        </Text>
                    </View>
                    <Icon
                        name={"settings"}
                        type={"material"}
                        style={{ alignSelf: "flex-start" }}
                        onPress={() => setEditing(!editing)}
                        containerStyle={{ alignSelf: "flex-start", marginLeft: 13 }}
                    />
                </View>
                <EditText fieldName={"123"} value={content} />
            </View>
        </EditingContext.Provider>
    );
};

export default ContentSection;
