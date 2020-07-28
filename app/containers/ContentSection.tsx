import React, { useContext } from "react";
import { TouchableOpacity, View } from "react-native";
import { EditingContext } from "../utils/EditingContext";
import EditText from "../components/EditText";
import { ThemeContext } from "../utils/ThemeContext";
import Section from "../components/Section";
import Text from "../components/Text";
import { useNavigation } from "@react-navigation/native";

// @ts-ignore
import Parser from "simple-text-parser";
import { Icon, useTheme, Text as KText } from "@ui-kitten/components";
import { StackNavigationProp } from "@react-navigation/stack";
import { AppStackParamList } from "../navigators/RootNavigator";
import MarkedText from "../components/MarkedText";

interface ContentSectionProps {
    fieldName: string;

    last?: boolean;
    removeSection(): void;
    addContentUnder(): void;
    duplicateContent(): void;
    moveContentUp(): void;
    moveContentDown(): void;
}

const ContentSection: React.FC<ContentSectionProps> = (props: ContentSectionProps) => {
    const {
        fieldName,
        last,
        removeSection,
        addContentUnder,
        duplicateContent,
        moveContentDown,
        moveContentUp,
    } = props;

    const navigation = useNavigation<StackNavigationProp<AppStackParamList>>();
    const theme = useTheme();

    const renderSudoMarkdown = (value: string, setEditingTrue: () => void): React.ReactNode => {
        const parser = new Parser();

        parser.addRule(/\[b](.)*?\[\/b]/gs, (bolded: string) => {
            console.log(bolded, "is bold");
            if (bolded.length > 7) {
                return { type: "bold", tree: parser.toTree(bolded.substr(3, bolded.length - 7)) };
            } else {
                return undefined;
            }
        });

        parser.addRule(/\[i](.)*?\[\/i]/gs, (italics: string) => {
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
                    renderArray.push(node.text);
                } else if (node.type === "bold") {
                    renderArray.push(
                        <Text style={{ flexDirection: "row", fontWeight: "800", fontSize: 14 }}>
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
                            style={{
                                color: theme["color-primary-500"],
                                textDecorationLine: "underline",
                            }}
                            onPress={() => {
                                navigation.push("Document", { id: node.link });
                            }}
                        >
                            {renderTree(node.tree)}
                        </Text>
                    );
                }
            }
            return renderArray;
        };

        return <Text onPress={setEditingTrue}>{renderTree(tree)}</Text>;
    };

    return (
        <Section last={last}>
            <View style={{ flexDirection: "row", alignContent: "center" }}>
                <View
                    style={{ flexWrap: "wrap", flexDirection: "column", flex: 1, marginRight: 13 }}
                >
                    <EditText
                        renderText={(value, setEditing) => (
                            <Text category={"h2"} onPress={setEditing}>
                                {value || "---"}
                            </Text>
                        )}
                        fieldName={`${fieldName}.name`}
                    />

                    <EditText
                        renderText={(value, setEditing) => (
                            <Text bold style={{ marginBottom: 6 }} onPress={setEditing}>
                                {value || "---"}
                            </Text>
                        )}
                        editStyle={{ flex: 1 }}
                        fieldName={`${fieldName}.description`}
                    />
                </View>
                <TouchableOpacity onPress={moveContentUp} style={{}}>
                    <Icon
                        name={"arrow-up-outline"}
                        fill={theme["color-primary-500"]}
                        style={{
                            width: 24,
                            height: 24,
                            marginLeft: 13,
                            alignSelf: "flex-end",
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={moveContentDown} style={{}}>
                    <Icon
                        name={"arrow-down-outline"}
                        fill={theme["color-primary-500"]}
                        style={{
                            width: 24,
                            height: 24,
                            marginLeft: 13,
                            alignSelf: "flex-end",
                        }}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        removeSection();
                    }}
                >
                    <Icon
                        name={"trash-outline"}
                        fill={theme["color-primary-500"]}
                        style={{
                            width: 24,
                            height: 24,
                            marginLeft: 13,
                        }}
                    />
                </TouchableOpacity>
            </View>
            <EditText
                fieldName={`${fieldName}.content`}
                multiline
                numberOfLines={5}
                renderText={(value, setEditing) => (
                    <MarkedText onPress={setEditing}>{value || "---"}</MarkedText>
                )}
            />

            <View style={{ flexDirection: "row", flexGrow: 1, justifyContent: "flex-end" }}>
                <TouchableOpacity onPress={addContentUnder} style={{ alignSelf: "flex-end" }}>
                    <Icon
                        name={"plus-outline"}
                        fill={theme["color-primary-500"]}
                        style={{ width: 24, height: 24, marginLeft: 13, alignSelf: "flex-end" }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={duplicateContent} style={{ alignSelf: "flex-end" }}>
                    <Icon
                        name={"copy-outline"}
                        fill={theme["color-primary-500"]}
                        style={{
                            width: 24,
                            height: 24,
                            marginLeft: 13,
                            alignSelf: "flex-end",
                        }}
                    />
                </TouchableOpacity>
            </View>
        </Section>
    );
};

export default ContentSection;
