import React, { useContext } from "react";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";
import Text from "./Text";
import { ThemeContext } from "../utils/ThemeContext";

interface ButtonProps extends TouchableOpacityProps {
    children: any;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const { children, ...others } = props;
    const { buttonContainer, buttonFont } = useContext(ThemeContext);

    return (
        <TouchableOpacity style={buttonContainer} {...others}>
            <Text style={buttonFont}>{children}</Text>
        </TouchableOpacity>
    );
};

export default Button;
