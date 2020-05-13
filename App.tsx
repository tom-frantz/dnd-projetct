import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const App: React.FC<{}> = () => {
    const [loc, setLoc] = useState<{ left: number; top: number } | undefined>(undefined);
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
