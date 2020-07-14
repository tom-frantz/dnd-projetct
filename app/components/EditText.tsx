import React, { useContext, useEffect, useRef, useState } from "react";
import { Platform, StyleProp, StyleSheet, TextStyle } from "react-native";

import { useField } from "formik";
import moment from "moment";
import { TextField } from "react-native-material-textfield";

import Text from "./Text";
import { EditingContext } from "../utils/EditingContext";
import FormikTextField from "./form/FormikTextField";

interface EditTextProps {
    fieldName: string;

    style?: StyleProp<TextStyle>;
    editStyle?: StyleProp<TextStyle>;
    nonEditStyle?: StyleProp<TextStyle>;

    multiline?: boolean;
    numberOfLines?: number;
    renderContent?: (value: string) => React.ReactNode;
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
    } = props;
    const { editing } = useContext(EditingContext);

    const textFieldRef = useRef<TextField>();
    const [input] = useField(fieldName);

    const fieldNameElements = fieldName.split(".");
    const label = fieldNameElements[fieldNameElements.length - 1];

    if (editing) {
        return (
            <FormikTextField
                fieldName={fieldName}
                label={label}
                style={[style, editStyle]}
                multiline={multiline}
                numberOfLines={numberOfLines}
            />
        );
    } else {
        if (textFieldRef.current) textFieldRef.current.blur();
        return renderContent != undefined ? (
            (renderContent(input.value) as null)
        ) : (
            <Text style={[style, nonEditStyle]}>{input.value}</Text>
        );
    }
};

export default EditText;
