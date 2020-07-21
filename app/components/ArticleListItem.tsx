import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { Icon } from "react-native-elements";
import Text from "./Text";
import { ThemeContext } from "../utils/ThemeContext";

interface ArticleListItemProps {
    id: string;
    first?: boolean;
    title: string;
    description?: string | null;
    authorUsername?: string;
    navigateToDocument(): void;
}

const ArticleListItem: React.FC<ArticleListItemProps> = (props: ArticleListItemProps) => {
    const { id, first, title, description, authorUsername, navigateToDocument } = props;

    const { primaryColour } = useContext(ThemeContext);

    return (
        <TouchableOpacity
            onPress={() => {
                navigateToDocument();
            }}
            key={id}
            style={{
                borderTopWidth: first ? 0.8 : 0,
                borderBottomWidth: 0.8,
            }}
        >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Icon
                    name={"subject"}
                    type={"material"}
                    color={primaryColour}
                    style={{ padding: 13 }}
                    onPress={() => {}}
                />
                <View>
                    <Text subheading>{title}</Text>
                    {description && <Text>{description}</Text>}
                    {authorUsername && (
                        <Text>
                            <Text bold>Posted by:</Text> {authorUsername}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ArticleListItem;
