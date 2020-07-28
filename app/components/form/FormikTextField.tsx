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
        const [popoverVisible, setPopoverVisible] = useState(false);
        const [popoverLocation, setPopoverLocation] = useState<{ x: number; y: number }>({
            x: 0,
            y: 0,
        });

        const toggleVisible = () => {
            setPasswordVisible(!passwordVisible);
        };

        return (
            <View style={{ display: "relative" }}>
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
                    onSelectionChange={(e) => {
                        console.log(e.nativeEvent, this);

                        //@ts-ignore
                        // console.log(e.nativeEvent, e.currentTarget.toPrecision(1), this.measure());
                        if (e.nativeEvent.selection.end - e.nativeEvent.selection.start !== 0) {
                            setPopoverVisible(true);
                            setPopoverLocation({
                                x: e.nativeEvent.screenX,
                                y: e.nativeEvent.screenY,
                            });
                        }
                        // console.log(e, e.target, e.nativeEvent.selection.end);
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
                {popoverVisible && (
                    <Layout
                        style={{
                            zIndex: 10000,
                            position: "absolute",
                            top: 0,
                            left: 0,
                        }}
                    >
                        <Text>Penis</Text>
                    </Layout>
                )}
            </View>
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
