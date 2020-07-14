import React, { useContext, useEffect, useRef, useState } from "react";
import { TextField, TextFieldProps } from "react-native-material-textfield";
import { Platform, StyleSheet, TouchableWithoutFeedback } from "react-native";
import { ThemeContext } from "../../utils/ThemeContext";
import { useField, useFormikContext } from "formik";
import _ from "lodash";
import { Icon, Input, InputProps } from "@ui-kitten/components";
import { valueFromAST } from "graphql";

interface FormikTextFieldProps extends InputProps {
    fieldName: string;

    passwordField?: boolean;
}

const FormikTextField: React.FC<FormikTextFieldProps> = (props: FormikTextFieldProps) => {
    const {
        fieldName,
        passwordField,
        label,
        onContentSizeChange,
        textStyle,
        ...textFieldProps
    } = props;

    const [input, meta, helpers] = useField(fieldName);

    const [height, setHeight] = useState<number | undefined>(undefined);
    const [localValue, setLocalValue] = useState<string>(input.value);
    const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

    const toggleVisible = () => {
        setPasswordVisible(!passwordVisible);
    };

    return (
        <Input
            value={localValue}
            label={label}
            onChangeText={(text) => {
                setLocalValue(text);
                console.log(text);
            }}
            onBlur={(e) => {
                input.onBlur(e);
                helpers.setValue(localValue);
            }}
            onContentSizeChange={(e) => {
                setHeight(e.nativeEvent.contentSize.height);
            }}
            secureTextEntry={passwordField ? !passwordVisible : false}
            accessoryRight={
                passwordField
                    ? (props) => (
                          <TouchableWithoutFeedback onPress={toggleVisible}>
                              <Icon {...props} name={passwordVisible ? "eye-off" : "eye"} />
                          </TouchableWithoutFeedback>
                      )
                    : undefined
            }
            textStyle={[{ minHeight: height, flexGrow: 1 }, textStyle]}
            {...textFieldProps}
        />
    );

    // return (
    //     <TextField
    //         ref={textFieldRef}
    //         value={localValue}
    //         onChangeText={setLocalValue}
    //         onBlur={(e) => {
    //             input.onBlur(e);
    //             helpers.setValue(localValue);
    //         }}
    //         error={((meta.touched || submitCount > 0) && meta.error) || ""}
    //         label={label || _.lowerCase(fieldName)}
    //         secureTextEntry={passwordField ? !passwordVisible : false}
    //         renderRightAccessory={
    //             passwordField
    //                 ? () => (
    //                       <Icon
    //                           name={passwordVisible ? "visibility-off" : "visibility"}
    //                           onPress={() => toggleVisible()}
    //                       />
    //                   )
    //                 : undefined
    //         }
    //         fontSize={fontSize}
    //         labelFontSize={14}
    //         onContentSizeChange={(e) => {
    //             console.log(e);
    //             if (onContentSizeChange) {
    //                 onContentSizeChange(e);
    //             }
    //             setHeight(e.nativeEvent.contentSize.height);
    //         }}
    //         {...textFieldProps}
    //         style={[styles.override, defaultFont, { height }, style]}
    //         labelTextStyle={[defaultFont, styles.labelTextOverride, labelTextStyle]}
    //         containerStyle={[styles.containerStyleOverride, containerStyle]}
    //     />
    // );
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
