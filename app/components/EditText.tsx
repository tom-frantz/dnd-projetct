import React, { useContext, useEffect, useRef, useState } from "react";
import { EditingContext } from "../utils/EditingContext";
import Text from "./Text";
import { TextField } from "react-native-material-textfield";
import { Platform } from "react-native";
import autosize from "autosize";

interface EditTextProps {
    fieldName: string;
    value?: string;
}

const EditText: React.FC<EditTextProps> = (props: EditTextProps) => {
    const { fieldName, value } = props;
    const [fieldValue, setFieldValue] = useState<string | undefined>(value);
    const [height, setHeight] = useState<number | undefined>(undefined);
    const { editing } = useContext(EditingContext);
    const textFieldRef = useRef<TextField>();

    if (editing) {
        return (
            <TextField
                //@ts-ignore
                ref={textFieldRef}
                label={"hey"}
                value={fieldValue}
                defaultValue={value}
                onChangeText={(text) => {
                    if (textFieldRef.current) {
                    }
                    setFieldValue(text);
                }}
                multiline
                onContentSizeChange={(e) => setHeight(e.nativeEvent.contentSize.height)}
                onBlur={() => setHeight(undefined)}
                numberOfLines={5}
                labelTextStyle={{
                    fontFamily: "Quattrocento Sans Regular",
                    fontSize: 14,
                    paddingLeft: Platform.OS == "web" ? "33.3333333%" : undefined,
                }}
                style={{
                    fontFamily: "Quattrocento Sans Regular",
                    fontSize: 14,
                    height,
                    marginTop: 24,
                    transform: [{ translateY: 0 }],
                }}
                // multiline
            />
        );
    } else {
        if (textFieldRef.current) textFieldRef.current.blur();
        return <Text>{value}</Text>;
    }

    return null;
};

export default EditText;
