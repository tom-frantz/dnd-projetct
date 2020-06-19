import React from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import Text from "./Text";

interface ButtonProps extends TouchableOpacityProps {
    children: any;
}

const Button: React.FC<ButtonProps> = (props: ButtonProps) => {
    const { children, ...others } = props;
    return (
        <TouchableOpacity {...others}>
            <Text>{children}</Text>
        </TouchableOpacity>
    );
};

export default Button;
