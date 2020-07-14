import React, { useContext } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { EditingContext } from "../utils/EditingContext";
import EditText from "../components/EditText";
import { ThemeContext } from "../utils/ThemeContext";
import Section from "../components/Section";
import Text from "../components/Text";
import { useNavigation } from "@react-navigation/native";

// @ts-ignore
import Parser from "simple-text-parser";

interface ContentSectionProps {
    fieldName: string;

    last?: boolean;
    removeSection(): void;
}

const ContentSection: React.FC<ContentSectionProps> = (props: ContentSectionProps) => {
    const { headingFont, primaryColour } = useContext(ThemeContext);
    const { fieldName, last, removeSection } = props;

    const navigation = useNavigation();
    const { editing } = useContext(EditingContext);

    const renderSudoMarkdown = (value: string): React.ReactNode => {
        const parser = new Parser();

        parser.addRule(/\[b\](.)*?\[\/b\]/gs, (bolded: string) => {
            console.log(bolded, "is bold");
            if (bolded.length > 7) {
                return { type: "bold", tree: parser.toTree(bolded.substr(3, bolded.length - 7)) };
            } else {
                return undefined;
            }
        });

        parser.addRule(/\[i\](.)*?\[\/i\]/gs, (italics: string) => {
            console.log(italics, "is italicized");
            if (italics.length > 7) {
                return {
                    type: "italic",
                    tree: parser.toTree(italics.substr(3, italics.length - 7)),
                };
            } else {
                return undefined;
            }
        });

        parser.addRule(/{.+?@[a-zA-z0-9]*?}/gs, (linkText: string) => {
            const parts = linkText.split("@");
            let link = parts.pop() as string;
            link = link.substring(0, link.length - 1);
            const text = parts.join("@").substr(1);

            return { type: "link", tree: parser.toTree(text), link };
        });

        type TreeNode =
            | { type: "text"; text: string }
            | { type: "bold" | "italic"; tree: TreeNode[] }
            | { type: "link"; tree: TreeNode[]; link: string }
            | undefined;

        const tree: TreeNode[] = parser.toTree(value);
        const renderTree = (tree: TreeNode[]): React.ReactNodeArray => {
            const renderArray: React.ReactNodeArray = [];
            for (const node of tree) {
                if (node === undefined) {
                    continue;
                }
                if (node.type === "text") {
                    renderArray.push(<Text style={{ flexDirection: "row" }}>{node.text}</Text>);
                } else if (node.type === "bold") {
                    renderArray.push(
                        <Text bold style={{ flexDirection: "row" }}>
                            {renderTree(node.tree)}
                        </Text>
                    );
                } else if (node.type === "italic") {
                    renderArray.push(
                        <Text style={{ flexDirection: "row", fontStyle: "italic" }}>
                            {renderTree(node.tree)}
                        </Text>
                    );
                } else if (node.type === "link") {
                    renderArray.push(
                        <Text
                            style={{ color: primaryColour, textDecorationLine: "underline" }}
                            onPress={() => {
                                navigation.navigate("Document", { id: node.link });
                            }}
                        >
                            {renderTree(node.tree)}
                        </Text>
                    );
                }
            }
            return renderArray;
        };

        return <Text>{renderTree(tree)}</Text>;
    };

    return (
        <Section last={last}>
            <View style={{ flexDirection: "row", alignContent: "center" }}>
                <View
                    style={{ flexWrap: "wrap", flexDirection: editing ? "column" : "row", flex: 1 }}
                >
                    <EditText
                        style={[headingFont]}
                        fieldName={`${fieldName}.name`}
                        nonEditStyle={{ marginRight: 13 }}
                    />

                    <EditText
                        style={{ fontWeight: "bold", alignSelf: "flex-end" }}
                        nonEditStyle={{ marginBottom: 6 }}
                        editStyle={{ alignSelf: "stretch" }}
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
            <EditText
                fieldName={`${fieldName}.content`}
                multiline
                numberOfLines={5}
                renderContent={(content: string) => renderSudoMarkdown(content)}
            />
        </Section>
    );
};

export default ContentSection;
