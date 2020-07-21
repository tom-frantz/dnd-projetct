import React, { useState } from "react";
import {
    IndexPath,
    SelectGroup,
    SelectItem,
    Select as UIKittenSelect,
    SelectProps as UIKittenSelectProps,
} from "@ui-kitten/components";

export interface DataItem {
    title: string;
    value: string;
}
//@ts-ignore
export interface SelectProps extends Exclude<UIKittenSelectProps, "value"> {
    data: DataItem[];
    value: string;
    onChange: (value: DataItem) => void;
}

const Select: React.FC<SelectProps> = (props: SelectProps) => {
    const { data, value, onChange, ...otherProps } = props;
    const [selectedIndex, setSelectedIndex] = useState<IndexPath>(
        new IndexPath(data.findIndex((item) => item.value === value))
    );

    return (
        <UIKittenSelect
            {...otherProps}
            selectedIndex={selectedIndex}
            value={
                data.find((item) => {
                    console.log(item, value);
                    if (value === item.value) {
                        console.warn("HEY PRESTO CUNTS");
                        return true;
                    } else {
                        return false;
                    }
                })?.title
            }
            onSelect={(index) => {
                setSelectedIndex(index as IndexPath);
                onChange(data[(index as IndexPath).row]);
            }}
        >
            {data.map((dataItem) => (
                <SelectItem title={dataItem.title} />
            ))}
        </UIKittenSelect>
    );
};

export default Select;
