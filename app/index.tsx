import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Alert, Image, Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import MapCard from "../components/MapCard";
import { useAuth } from "../context/Auth_context";
import { deleteVehicleById, getStoredVehicles, Vehicle } from "../utils/storage";

export default function LandingPage() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const { isAdmin } = useAuth();

  const fetchVehicles = async () => {
    const stored = await getStoredVehicles();
    setVehicles(stored);
  };

  useFocusEffect(
    useCallback(() => {
      let active = true;
      if (active) fetchVehicles();
      return () => { active = false; };
    }, [])
  );

  const handleDeleteVehicle = async (id: string, name: string) => {
    Alert.alert("Delete Vehicle", `Are you sure you want to delete ${name}?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        await deleteVehicleById(id);
        fetchVehicles();
      }},
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.content}
        contentContainerStyle={isLandscape && styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {vehicles.map((vehicle) => (
          <View key={vehicle.id} style={isLandscape ? styles.gridItem : undefined}>
            {vehicle.photoUri && (
              <Image source={{ uri: vehicle.photoUri }} style={styles.photo} />
            )}
            <MapCard
              title={vehicle.name}
              description={`${vehicle.make || ""} ${vehicle.model || ""} (${vehicle.year || ""})`}
              features={[]}
              buttonText="View Tunes"
              route="/tune_selection"
              params={{ vehicleId: vehicle.id }}
            />
            {isAdmin && (
              <Pressable
                style={styles.deleteButton}
                onPress={() => handleDeleteVehicle(vehicle.id, vehicle.name)}
              >
                <View style={styles.minusCircle}><></></View>
              </Pressable>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#1a1a1a" },
  content: { flex: 1, paddingHorizontal: 20 },
  gridContainer: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  gridItem: { width: "48%", marginBottom: 15 },
  photo: { width: "100%", height: 120, borderRadius: 8, marginBottom: 10 },
  deleteButton: { position: "absolute", top: 10, right: 10 },
  minusCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: "red", justifyContent: "center", alignItems: "center" },
});
