import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text } from "react-native";

type ModButtonProps = {
    text?: string;
    symbol?: keyof typeof MaterialIcons.glyphMap;
    action?: () => void;
};

export default function ModButton({
    text,
    symbol,
    action
}: ModButtonProps) {

    return (
        <Pressable
            onPress={action}
            style={({ pressed }) => ({
                height: "auto",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "transparent",
                opacity: pressed ? 0.6 : 1,
                paddingBottom: symbol ? 4 : 0,
                marginHorizontal: 5,
                color: "#fff",
            })}
        >
            {symbol && (
                <MaterialIcons
                    name={symbol}
                    size={28}
                    color="#fff"
                />
            )}
            {text && (
                <Text style={{ fontSize: 12, fontWeight: "bold" }}>
                    {text}
                </Text>
            )}
        </Pressable>
    );
}