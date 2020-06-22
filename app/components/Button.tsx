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

interface ButtonProps extends TouchableOpacityProps {
    children: any;
    style?: StyleProp<ViewStyle>;
    danger?: boolean;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const { children, style, danger, ...others } = props;
    const { buttonContainer, buttonFont, dangerColour } = useContext(ThemeContext);

    return (
        <TouchableOpacity
            style={[
                buttonContainer,
                danger && { backgroundColor: dangerColour, borderColor: dangerColour },
                style,
            ]}
            {...others}
        >
            <Text style={buttonFont}>{children}</Text>
        </TouchableOpacity>
    );
};

export default Button;
