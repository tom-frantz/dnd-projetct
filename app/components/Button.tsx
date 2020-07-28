import React, { useContext } from "react";
import {
    StyleProp,
    StyleSheet,
    TouchableOpacity,
    TouchableOpacityProps,
    ViewStyle,
} from "react-native";
import Text from "./Text";
import { ThemeContext } from "../utils/ThemeContext";
import { useTheme } from "@ui-kitten/components";

interface ButtonProps extends TouchableOpacityProps {
    children: any;
    style?: StyleProp<ViewStyle>;
    danger?: boolean;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const { children, style, danger, ...others } = props;
    const theme = useTheme();

    return (
        <TouchableOpacity
            style={[
                {
                    borderWidth: 1,
                    borderRadius: 6.5,
                    padding: 6.5,
                    borderColor: theme["color-primary-500"],
                    backgroundColor: theme["color-primary-500"],
                    width: "fit-content",
                },
                danger && {
                    backgroundColor: theme["color-danger-500"],
                    borderColor: theme["color-danger-400"],
                },
                style,
            ]}
            {...others}
        >
            <Text style={{ color: "#000" }}>{children}</Text>
        </TouchableOpacity>
    );
};

export default Button;
