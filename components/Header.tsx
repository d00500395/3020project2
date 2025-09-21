import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function Header({ title, subtitle, isCompact = false }) {
  return (
    <View style={[styles.header, isCompact && styles.compactHeader]}>
      <Text style={[styles.title, isCompact && styles.compactTitle]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, isCompact && styles.compactSubtitle]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  compactHeader: {
    paddingVertical: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 8,
  },
  compactTitle: {
    fontSize: 22,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#cccccc",
  },
  compactSubtitle: {
    fontSize: 12,
  },
});
