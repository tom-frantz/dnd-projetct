import React from "react";
import { Platform } from "react-native";
import { useTheme } from "@ui-kitten/components";
import Text from "./Text";

interface CustomTextEditorProps {}

const CustomTextEditor: React.FC<CustomTextEditorProps> = (props: CustomTextEditorProps) => {
    const theme = useTheme();
    return (
        <p
            contentEditable={true}
            style={{
                ":focus": {
                    color: "#ffffff",
                },
            }}
            onChange={(event) => {
                event.target.value;
            }}
        >
            <Text>1234</Text>
        </p>
    );
};

export default CustomTextEditor;
