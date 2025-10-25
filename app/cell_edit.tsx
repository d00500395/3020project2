import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

export default function CellEdit() {
  // ⚠ Must match the params passed from MapScreen
  const { vehicleId, tuneId, mode, index, rpm, load, values } = useLocalSearchParams<{ vehicleId?: string; tuneId?: string; mode?: string; index?: string; rpm?: string; load?: string; values?: string }>();
  const router = useRouter();

  const [afrValues, setAfrValues] = useState<number[]>(
    values ? JSON.parse(values as string) : []
  );

  const handleChange = (i: number, newVal: string) => {
    const updated = [...afrValues];
    updated[i] = parseFloat(newVal) || 0;
    setAfrValues(updated);
  };

  const handleSave = async () => {
    if (!vehicleId || !tuneId) {
      Alert.alert("Error", "Missing vehicle or tune ID.");
      return;
    }

    try {
      const raw = await AsyncStorage.getItem("vehicles");
      if (!raw) return;
      const vehicles = JSON.parse(raw);

      const vehicleIdx = vehicles.findIndex((v: any) => v.id === vehicleId);
      if (vehicleIdx === -1) {
        Alert.alert("Error", "Vehicle not found.");
        return;
      }

      const tuneIdx = vehicles[vehicleIdx].tunes.findIndex((t: any) => t.id === tuneId);
      if (tuneIdx === -1) {
        Alert.alert("Error", "Tune not found.");
        return;
      }

      const tune = vehicles[vehicleIdx].tunes[tuneIdx];
      const table = tune.afrTable || [];

      if (mode === "rpm") {
        for (let r = 0; r < table.length; r++) {
          table[r][Number(index)] = afrValues[r];
        }
      } else {
        table[Number(index)] = afrValues;
      }

      tune.afrTable = table;
      vehicles[vehicleIdx].tunes[tuneIdx] = tune;

      await AsyncStorage.setItem("vehicles", JSON.stringify(vehicles));

      Alert.alert("Saved", "AFR values updated successfully.");
      router.back();
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to save tune data.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Edit {mode === "rpm" ? `RPM ${rpm}` : `Load ${load}`}
      </Text>

      <ScrollView>
        {afrValues.map((v, i) => (
          <View key={i} style={styles.row}>
            <Text style={styles.label}>
              {mode === "rpm" ? `Load ${i + 1}` : `${(i + 1) * 500} RPM`}
            </Text>
            <TextInput
              style={styles.input}
              value={v.toString()}
              onChangeText={(text) => handleChange(i, text)}
              keyboardType="numeric"
            />
          </View>
        ))}
      </ScrollView>

      <Pressable style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveText}>Save Changes</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    paddingBottom: 5,
  },
  label: { color: "#ccc", fontSize: 16 },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    padding: 8,
    width: 80,
    borderRadius: 6,
    textAlign: "center",
  },
  saveButton: {
    marginTop: 20,
    backgroundColor: "#007acc",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
