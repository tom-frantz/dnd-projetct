import React, { forwardRef, useContext, useEffect, useRef, useState } from "react";
import { TextField, TextFieldProps } from "react-native-material-textfield";
import { Platform, StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import { ThemeContext } from "../../utils/ThemeContext";
import { useField, useFormikContext } from "formik";
import _ from "lodash";
import { Icon, Input, InputProps, Layout, Modal, Popover } from "@ui-kitten/components";
import { valueFromAST } from "graphql";
import Text from "../Text";
import { number } from "yup";

interface FormikTextFieldProps extends InputProps {
    fieldName: string;

    passwordField?: boolean;
}

const FormikTextField: React.FC<FormikTextFieldProps> = forwardRef<Input, FormikTextFieldProps>(
    (props: FormikTextFieldProps, ref) => {
        const {
            fieldName,
            passwordField,
            label,
            onContentSizeChange,
            textStyle,
            onBlur,
            ...textFieldProps
        } = props;

        const [input, meta, helpers] = useField(fieldName);
        const innerRef = useRef<Input | null>(ref);

        const [height, setHeight] = useState<number | undefined>(undefined);
        const [localValue, setLocalValue] = useState<string>(input.value);
        const [passwordVisible, setPasswordVisible] = useState<boolean>(false);

        const toggleVisible = () => {
            setPasswordVisible(!passwordVisible);
        };

        return (
            <Input
                ref={innerRef}
                value={localValue}
                label={label}
                caption={meta.touched ? meta.error : undefined}
                status={meta.touched && meta.error ? "danger" : undefined}
                onChangeText={(text) => {
                    setLocalValue(text);
                    console.log(text);
                }}
                onBlur={(e) => {
                    input.onBlur(e);
                    helpers.setValue(localValue);
                    if (onBlur) onBlur(e);
                }}
                onContentSizeChange={(e) => {
                    setHeight(e.nativeEvent.contentSize.height);
                }}
                onLayout={(e) => console.log(e, e.nativeEvent)}
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
    }
);

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
