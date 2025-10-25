import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapCard from "../components/MapCard";
import { getStoredVehicles, Vehicle } from "../utils/storage";

export default function TunesPage() {
  const params = useLocalSearchParams<{ vehicleId?: string }>();
  const vehicleId = params.vehicleId;
  const router = useRouter();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      const fetchVehicle = async () => {
        if (!vehicleId) {
          Alert.alert("Error", "No vehicle selected");
          return;
        }
        const vehicles = await getStoredVehicles();
        const found = vehicles.find((v) => v.id === vehicleId) || null;
        if (isActive) setVehicle(found);
      };
      fetchVehicle();
      return () => { isActive = false; };
    }, [vehicleId])
  );

  if (!vehicle) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Vehicle not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{vehicle.name} Tunes</Text>
        <Pressable
          style={styles.addButton}
          onPress={() =>
            router.push({
              pathname: "/add",
              params: { type: "tune", vehicleId: vehicle.id }, // ✅ correct vehicleId
            })
          }
        >
          <Text style={styles.addButtonText}>+ Add Tune</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {vehicle.tunes.length > 0 ? (
          vehicle.tunes.map((tune) => (
            <MapCard
              key={tune.id}
              title={tune.name}
              description={tune.description || ""}
              features={[]}
              buttonText="View AFR Map"
              route="/map"
              params={{ id: tune.id, title: tune.name, vehicleId: vehicle.id }}
            />
          ))
        ) : (
          <Text style={styles.noTunesText}>No tunes found for this vehicle.</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a", padding: 20 },
  content: { flex: 1 },
  errorText: { color: "#ff4444", textAlign: "center", marginTop: 40 },
  noTunesText: { color: "#ccc", textAlign: "center", marginTop: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  headerTitle: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  addButton: {
    backgroundColor: "#007acc",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 14 },
});
