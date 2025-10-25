import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Button, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";
import { getStoredVehicles, saveStoredVehicles, Tune, Vehicle } from "../utils/storage";

export default function AddPage() {
  const router = useRouter();
  const params = useLocalSearchParams<{ type?: string; vehicleId?: string }>();
  const { type, vehicleId } = params;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [vehicleName, setVehicleName] = useState("");
  const [vehicleMake, setVehicleMake] = useState("");
  const [vehicleModel, setVehicleModel] = useState("");
  const [vehicleYear, setVehicleYear] = useState("");

  const [tune, setTune] = useState<Tune>({
    id: uuidv4(),
    name: "",
    description: "",
    powerGain: "",
    maxRPM: "",
  });

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchVehicle = async () => {
        if (type === "tune") {
          if (!vehicleId) {
            Alert.alert("Error", "Please select a vehicle first.");
            router.back();
            return;
          }

          const vehicles = await getStoredVehicles();
          const foundVehicle = vehicles.find((v) => v.id === vehicleId);
          if (!foundVehicle) {
            Alert.alert("Error", "Vehicle not found.");
            router.back();
            return;
          }

          if (isActive) setVehicle(foundVehicle);
        }
      };

      fetchVehicle();
      return () => { isActive = false; };
    }, [type, vehicleId])
  );

  const handleSaveVehicle = async () => {
    if (!vehicleName.trim()) {
      Alert.alert("Validation Error", "Vehicle name cannot be empty");
      return;
    }

    try {
      const vehicles = await getStoredVehicles();
      const newVehicle: Vehicle = {
        id: uuidv4(),
        name: vehicleName,
        make: vehicleMake,
        model: vehicleModel,
        year: vehicleYear,
        tunes: [],
      };
      vehicles.push(newVehicle);
      await saveStoredVehicles(vehicles);
      Alert.alert("Success", "Vehicle added successfully!");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save vehicle");
    }
  };

  const handleSaveTune = async () => {
    if (!vehicle) return;

    if (!tune.name.trim()) {
      Alert.alert("Validation Error", "Tune name cannot be empty");
      return;
    }

    try {
      const vehicles = await getStoredVehicles();
      const foundVehicle = vehicles.find((v) => v.id === vehicle.id);
      if (!foundVehicle) {
        Alert.alert("Error", "Vehicle not found");
        return;
      }

      foundVehicle.tunes.push(tune);
      await saveStoredVehicles(vehicles);
      Alert.alert("Success", "Tune saved successfully!");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save tune");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>
        {type === "vehicle" ? "Add Vehicle" : `Add Tune for ${vehicle?.name || ""}`}
      </Text>

      {type === "vehicle" ? (
        <>
          <TextInput
            placeholder="Vehicle Name"
            style={styles.input}
            value={vehicleName}
            onChangeText={setVehicleName}
          />
          <TextInput
            placeholder="Make"
            style={styles.input}
            value={vehicleMake}
            onChangeText={setVehicleMake}
          />
          <TextInput
            placeholder="Model"
            style={styles.input}
            value={vehicleModel}
            onChangeText={setVehicleModel}
          />
          <TextInput
            placeholder="Year"
            style={styles.input}
            value={vehicleYear}
            onChangeText={setVehicleYear}
          />
          <View style={{ marginTop: 20 }}>
            <Button title="Save Vehicle" onPress={handleSaveVehicle} />
          </View>
        </>
      ) : (
        <>
          <TextInput
            placeholder="Tune Name"
            style={styles.input}
            value={tune.name}
            onChangeText={(name) => setTune({ ...tune, name })}
          />
          <TextInput
            placeholder="Description"
            style={styles.input}
            value={tune.description}
            onChangeText={(description) => setTune({ ...tune, description })}
          />
          <TextInput
            placeholder="Power Gain"
            style={styles.input}
            value={tune.powerGain}
            onChangeText={(powerGain) => setTune({ ...tune, powerGain })}
          />
          <TextInput
            placeholder="Max RPM"
            style={styles.input}
            value={tune.maxRPM}
            onChangeText={(maxRPM) => setTune({ ...tune, maxRPM })}
          />
          <View style={{ marginTop: 20 }}>
            <Button title="Save Tune" onPress={handleSaveTune} />
          </View>
        </>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "600", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});
