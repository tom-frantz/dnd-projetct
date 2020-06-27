import React, { useContext, useEffect, useRef, useState } from "react";
import { TextField, TextFieldProps } from "react-native-material-textfield";
import { Platform, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import { ThemeContext } from "../../utils/ThemeContext";
import { useField, useFormikContext } from "formik";
import _ from "lodash";

interface FormikTextFieldProps extends Exclude<TextFieldProps, "ref" | "secureTextEntry"> {
    fieldName: string;

    passwordField?: boolean;
}

const FormikTextField: React.FC<FormikTextFieldProps> = (props: FormikTextFieldProps) => {
    const {
        fieldName,
        passwordField,
        style,
        labelTextStyle,
        label,
        containerStyle,
        onContentSizeChange,
        ...textFieldProps
    } = props;

    const { defaultFont } = useContext(ThemeContext);
    const [input, meta, helpers] = useField(fieldName);
    const { submitCount } = useFormikContext();

    const textFieldRef = useRef<TextField | null>(null);

    const [height, setHeight] = useState<number | undefined>(undefined);
    const [localValue, setLocalValue] = useState<string>(input.value);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const toggleVisible = () => {
        setPasswordVisible(!passwordVisible);
    };

    const fontSize = StyleSheet.flatten(style)?.fontSize || (defaultFont.fontSize as number);
    if ((meta.touched || submitCount > 0) && meta.error) {
        console.error(meta.error);
    }

    return (
        <TextField
            ref={textFieldRef}
            value={localValue}
            onChangeText={setLocalValue}
            onBlur={(e) => {
                input.onBlur(e);
                helpers.setValue(localValue);
            }}
            error={((meta.touched || submitCount > 0) && meta.error) || ""}
            label={label || _.lowerCase(fieldName)}
            secureTextEntry={passwordField ? !passwordVisible : false}
            renderRightAccessory={
                passwordField
                    ? () => (
                          <Icon
                              name={passwordVisible ? "visibility-off" : "visibility"}
                              onPress={() => toggleVisible()}
                          />
                      )
                    : undefined
            }
            fontSize={fontSize}
            labelFontSize={14}
            onContentSizeChange={(e) => {
                console.log(e);
                if (onContentSizeChange) {
                    onContentSizeChange(e);
                }
                setHeight(e.nativeEvent.contentSize.height);
            }}
            {...textFieldProps}
            style={[styles.override, defaultFont, { height }, style]}
            labelTextStyle={[defaultFont, styles.labelTextOverride, labelTextStyle]}
            containerStyle={[styles.containerStyleOverride, containerStyle]}
        />
    );
};

const styles = StyleSheet.create({
    containerStyleOverride: { marginTop: -16, width: "100%" },
    labelTextOverride: {
        paddingLeft: Platform.OS == "web" ? "33.3333333%" : undefined,
    },
    override: {
        marginTop: 24,
        flexGrow: 1,
        transform: [{ translateY: 0 }],
    },
});

export default FormikTextField;
