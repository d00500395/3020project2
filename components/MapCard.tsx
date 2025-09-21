import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

export default function MapCard({
  title,
  description,
  features,
  buttonText = "View Map",
  route,
  isPrimary = false
}) {
  const router = useRouter();

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{title}</Text>
      <Text style={styles.cardDescription}>{description}</Text>
      
      {features && (
        <View style={styles.features}>
          {features.map((feature, index) => (
            <Text key={index} style={styles.featureItem}>• {feature}</Text>
          ))}
        </View>
      )}

      <Pressable
        style={({ pressed }) => [
          isPrimary ? styles.primaryButton : styles.secondaryButton,
          pressed && (isPrimary ? styles.primaryPressed : styles.secondaryPressed)
        ]}
          onPress={() => router.push({ pathname: route, params: { title } })}
      >
        <Text style={isPrimary ? styles.primaryButtonText : styles.secondaryButtonText}>
          {buttonText}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#2a2a2a",
    borderRadius: 12,
    padding: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#333",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 12,
  },
  cardDescription: {
    fontSize: 14,
    color: "#cccccc",
    lineHeight: 20,
    marginBottom: 16,
  },
  features: {
    marginBottom: 20,
  },
  featureItem: {
    fontSize: 14,
    color: "#88ff88",
    marginBottom: 6,
  },
  primaryButton: {
    backgroundColor: "#007acc",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: "center",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryPressed: {
    opacity: 0.8,
    backgroundColor: "#005fa3",
  },
  secondaryButton: {
    backgroundColor: "transparent",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#007acc",
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#007acc",
    fontSize: 14,
    fontWeight: "600",
  },
  secondaryPressed: {
    backgroundColor: "#007acc20",
  },
});
