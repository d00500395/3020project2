import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Legend({ title, items }) {
  return (
    <View style={styles.legend}>
      <Text style={styles.legendTitle}>{title}</Text>
      <View style={styles.legendRow}>
        {items.map((item, index) => (
          <View key={index} style={styles.legendPair}>
            <View style={[styles.legendItem, { backgroundColor: item.color }]} />
            <Text style={styles.legendText}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  legend: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  legendTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
  },
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap", // allows wrapping if it doesn’t fit on one line
    alignItems: "center",
  },
  legendPair: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    marginBottom: 8,
  },
  legendItem: {
    width: 15,
    height: 15,
    marginRight: 6,
    borderRadius: 3,
  },
  legendText: {
    color: "#cccccc",
    fontSize: 12,
  },
});
