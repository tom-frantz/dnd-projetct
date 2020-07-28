import React from "react";
// @ts-ignore
import Parser from "simple-text-parser";
import Text, { TextProps } from "./Text";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "@ui-kitten/components";

interface MarkedTextProps extends TextProps {
    children?: string;
}
type TextTreeNode =
    | { type: "text"; text: string }
    | {
          type: "token";
          textMod: "bold" | "italics";
          subType: "close" | "open";
      }
    | {
          type: "link";
          link: string;
          text: string;
      };

const MarkedText: React.FC<MarkedTextProps> = (props: MarkedTextProps) => {
    const { children, ...textProps } = props;
    const navigation = useNavigation();
    const theme = useTheme();

    const parseText = (text?: string): TextTreeNode[] => {
        if (text === undefined) {
            return [];
        }
        const parser = new Parser();

        parser.addRule(/\[b]/gs, (_: string) => ({
            type: "token",
            textMod: "bold",
            subType: "open",
        }));

        parser.addRule(/\[i]/gs, (_: string) => ({
            type: "token",
            textMod: "italics",
            subType: "open",
        }));

        parser.addRule(/\[\/b]/gs, (_: string) => ({
            type: "token",
            textMod: "bold",
            subType: "close",
        }));

        parser.addRule(/\[\/i]/gs, (_: string) => ({
            type: "token",
            textMod: "italics",
            subType: "close",
        }));

        parser.addRule(/{.+?@[a-zA-z0-9]*?}/gs, (linkText: string) => {
            const parts = linkText.split("@");
            let link = parts.pop() as string;
            link = link.substring(0, link.length - 1);
            const text = parts.join("@").substr(1);

            return { type: "link", text, link };
        });

        return parser.toTree(text);
    };

    const renderText = (tree: TextTreeNode[]): React.ReactNodeArray => {
        const renderedNodes: React.ReactNodeArray = [];

        let bolded = false;
        let italics = false;
        for (const node of tree) {
            if (node.type === "token") {
                if (node.textMod === "bold") {
                    bolded = node.subType === "open";
                } else if (node.textMod === "italics") {
                    italics = node.subType === "open";
                }
            } else if (node.type === "text") {
                renderedNodes.push(
                    <Text bold={bolded} style={[italics && { fontStyle: "italic" }]}>
                        {node.text}
                    </Text>
                );
            } else if (node.type === "link") {
                renderedNodes.push(
                    <Text
                        // @ts-ignore
                        onPress={() => navigation.push("Document", { id: node.link })}
                        bold={bolded}
                        style={[
                            italics && { fontStyle: "italic" },
                            { textDecorationLine: "underline", color: theme["color-primary-500"] },
                        ]}
                    >
                        {node.text}
                    </Text>
                );
            }
        }

        return renderedNodes;
    };

    return <Text {...textProps}>{renderText(parseText(props.children))}</Text>;
};

export default MarkedText;
