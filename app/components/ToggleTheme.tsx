import React, { useContext } from "react";
import { Toggle, ToggleProps } from "@ui-kitten/components";
import { ThemeContext } from "../utils/ThemeContext";

interface ToggleThemeProps extends Exclude<ToggleProps, "checked" | "onChange"> {}

const ToggleTheme: React.FC<ToggleThemeProps> = (props: ToggleThemeProps) => {
    const { children, style, ...otherProps } = props;
    const { currentTheme, setCurrentTheme } = useContext(ThemeContext);
    return (
        <Toggle
            {...otherProps}
            checked={currentTheme === "dark"}
            onChange={(checked) => setCurrentTheme(checked ? "dark" : "light")}
            style={[{ borderColor: "#000" }, style]}
        >
            {children}
        </Toggle>
    );
};

export default ToggleTheme;
