import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { TextField } from "react-native-material-textfield";

const App: React.FC<{}> = () => {
    const [loc, setLoc] = useState<{ left: number; top: number } | undefined>(undefined);

    const [value, setValue] = useState("");

    return (
        <View style={styles.container}>
            <Text>Open up App.js to start working on your app!</Text>
            <Text
                onLayout={({ nativeEvent: { layout } }) => {
                    setLoc({ left: layout.x + layout.width, top: layout.y + layout.height });
                }}
            >
                Hey mang
            </Text>
            <TextField
                label={"hey"}
                value={value}
                onChangeText={setValue}
                // To fix the rest of it for web, make sure to change the line height in the source.
                labelTextStyle={{ paddingLeft: "33.3333333%" }}
                // multiline
                onSelectionChange={({
                    nativeEvent: {
                        selection: { start, end },
                    },
                }) =>
                    console.log(
                        value.substring(0, start) +
                            "'" +
                            value.substring(start, end) +
                            "'" +
                            value.substring(end)
                    )
                }
            />
            {loc && (
                <Text
                    style={{
                        position: "absolute",
                        backgroundColor: "#F00",
                        left: loc.left - 10,
                        top: loc.top - 10,
                    }}
                >
                    wowee
                </Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
    },
});

export default App;
