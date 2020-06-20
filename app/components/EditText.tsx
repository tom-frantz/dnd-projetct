// TODO edit out some stuff here, tis hurting.
import React, { useContext, useEffect, useRef, useState } from "react";
import { Platform, StyleProp, StyleSheet, TextStyle } from "react-native";

import { useField } from "formik";
import moment from "moment";
import { TextField } from "react-native-material-textfield";

import Text from "./Text";
import { EditingContext } from "../utils/EditingContext";

interface EditTextProps {
    fieldName: string;
    value?: string;

    style?: StyleProp<TextStyle>;
    editStyle?: StyleProp<TextStyle>;
    nonEditStyle?: StyleProp<TextStyle>;
}

const EditText: React.FC<EditTextProps> = (props: EditTextProps) => {
    const { fieldName, value, style, editStyle, nonEditStyle } = props;
    const { editing } = useContext(EditingContext);

    const [fieldValue, setFieldValue] = useState<string | undefined>(value);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const textFieldRef = useRef<TextField>();

    const [input, meta, helper] = useField(fieldName);

    const fieldNameElements = fieldName.split(".");
    const label = fieldNameElements[fieldNameElements.length - 1];
    const fontSize = StyleSheet.flatten(style)?.fontSize;

    if (editing) {
        return (
            <TextField
                //@ts-ignore
                ref={textFieldRef}
                value={fieldValue}
                defaultValue={value}
                error={meta.touched ? meta.error : undefined}
                onChangeText={(text) => {
                    setFieldValue(text);
                }}
                onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
                onBlur={(e) => {
                    setHeight(undefined);
                    helper.setValue(fieldValue);
                    input.onBlur(e);
                }}
                label={label}
                containerStyle={styles.containerStyleOverride}
                labelTextStyle={styles.labelTextOverride}
                fontSize={fontSize}
                style={[
                    styles.override,
                    {
                        height,
                    },
                    style,
                    editStyle,
                ]}
            />
        );
    } else {
        if (textFieldRef.current) textFieldRef.current.blur();
        return <Text style={[style, nonEditStyle]}>{value}</Text>;
    }
};

const styles = StyleSheet.create({
    containerStyleOverride: { marginTop: -16, width: "100%" },
    labelTextOverride: {
        fontFamily: "Quattrocento Sans Regular",
        fontSize: 14,
        paddingLeft: Platform.OS == "web" ? "33.3333333%" : undefined,
    },
    override: {
        fontFamily: "Quattrocento Sans Regular",
        fontSize: 14,
        marginTop: 24,
        flexGrow: 1,
        transform: [{ translateY: 0 }],
    },
});

export default EditText;
