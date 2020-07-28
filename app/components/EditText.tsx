import React, { useContext, useEffect, useRef, useState } from "react";
import { Platform, StyleProp, StyleSheet, TextStyle } from "react-native";

import { useField } from "formik";
import moment from "moment";
import { TextField } from "react-native-material-textfield";

import Text, { TextProps } from "./Text";
import { EditingContext } from "../utils/EditingContext";
import FormikTextField from "./form/FormikTextField";
import { Input } from "@ui-kitten/components";

interface EditTextProps extends TextProps {
    fieldName: string;
    // children: (value: string) => React.ReactNode;
    renderText?(value: string, setEditing: () => void): React.ReactNode;
    renderField?(): React.ReactNode;

    style?: StyleProp<TextStyle>;
    editStyle?: StyleProp<TextStyle>;
    nonEditStyle?: StyleProp<TextStyle>;

    multiline?: boolean;
    numberOfLines?: number;
    renderContent?: (value: string, setEditingTrue: () => void) => React.ReactNode;
}

const EditText: React.FC<EditTextProps> = (props: EditTextProps) => {
    const {
        fieldName,
        style,
        editStyle,
        nonEditStyle,
        multiline,
        numberOfLines,
        renderContent,
        renderField,
        renderText,
        ...textProps
    } = props;
    const { startUpdate } = useContext(EditingContext);

    const [editing, setEditing] = useState(false);

    const textFieldRef = useRef<Input>();

    useEffect(() => {
        if (textFieldRef.current && editing) textFieldRef.current.focus();
    }, [editing, textFieldRef]);

    const [input] = useField(fieldName);

    const fieldNameElements = fieldName.split(".");
    const label = fieldNameElements[fieldNameElements.length - 1];

    if (editing) {
        return (
            <FormikTextField
                //@ts-ignore
                ref={textFieldRef}
                fieldName={fieldName}
                label={label}
                style={[style, editStyle]}
                multiline={multiline}
                numberOfLines={numberOfLines}
                onBlur={() => {
                    setEditing(false);
                    if (startUpdate) startUpdate();
                }}
            />
        );
    } else {
        return renderText ? (
            renderText(input.value, () => setEditing(true))
        ) : (
            <Text {...textProps} onPress={() => setEditing(true)}>
                {input.value}
            </Text>
        );
        // if (textFieldRef.current) textFieldRef.current.blur();
        // return renderContent != undefined ? (
        //     (renderContent(input.value, () => {
        //         setEditing(true);
        //     }) as null)
        // ) : (
        //     <Text
        //         style={[style, nonEditStyle]}
        //         {...textProps}
        //         onPress={() => {
        //             setEditing(true);
        //         }}
        //     >
        //         {input.value}
        //     </Text>
        // );
    }
};

export default EditText;
