import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import * as ScreenOrientation from "expo-screen-orientation";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useWindowDimensions,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/Auth_context";

type Tune = {
  id: string;
  name: string;
  description?: string;
  powerGain?: string;
  maxRPM?: string;
  afrTable?: number[][];
};

type Vehicle = {
  id: string;
  name: string;
  make?: string;
  model?: string;
  year?: string;
  tunes?: Tune[];
};

const LOAD_ROWS = 12;
const DEFAULT_MAX_RPM = 6500;

export default function MapScreen() {
  const { vehicleId, tuneId } = useLocalSearchParams();
  const navigation = useNavigation();
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const { user, isViewer, isEditor, isAdmin, loading } = useAuth();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [tune, setTune] = useState<Tune | null>(null);
  const [afrTable, setAfrTable] = useState<number[][] | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState<"rpm" | "load">("rpm");

  // Load tune from vehicle
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem("vehicles");
        const vehicles: Vehicle[] = stored ? JSON.parse(stored) : [];

        const foundVehicle = vehicles.find(v => v.id === vehicleId);
        if (!foundVehicle) {
          Alert.alert("Vehicle not found", `Could not find vehicle with ID ${vehicleId}.`);
          return;
        }

        setVehicle(foundVehicle);

        let foundTune = foundVehicle.tunes?.find(t => t.id === tuneId) || foundVehicle.tunes?.[0];
        if (!foundTune) {
          Alert.alert("No tunes", "This vehicle has no tunes available.");
          return;
        }

        const rpm = parseInt(foundTune.maxRPM || "") || DEFAULT_MAX_RPM;
        let table = foundTune.afrTable;

        if (!table || !Array.isArray(table) || table.length === 0) {
          table = generateAFRTable(rpm);
          foundTune.afrTable = table;
          await AsyncStorage.setItem("vehicles", JSON.stringify(vehicles));
        }

        setTune(foundTune);
        setAfrTable(table);
      } catch (e) {
        console.error("Load tune error:", e);
      }
    })();
  }, [vehicleId, tuneId]);

  // Manage fullscreen orientation and header visibility
  useEffect(() => {
    (async () => {
      try {
        if (isFullscreen) {
          navigation.setOptions?.({ headerShown: false });
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
        } else {
          navigation.setOptions?.({ headerShown: true });
          await ScreenOrientation.unlockAsync();
        }
      } catch {}
    })();
  }, [isFullscreen]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>Checking user...</Text>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>Please select a role on Permissions page.</Text>
      </SafeAreaView>
    );
  }

  if (!vehicle || !tune || !afrTable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.loadingText}>Loading tune data...</Text>
      </SafeAreaView>
    );
  }

  const cols = afrTable[0].length;
  const rows = afrTable.length;
  const paddingHorizontal = isFullscreen ? 20 : 30;
  const paddingVertical = isFullscreen ? 20 : 160;
  const usableWidth = width - paddingHorizontal * 2;
  const usableHeight = height - paddingVertical;
  const cellWidth = usableWidth / (cols + 1);
  const cellHeight = usableHeight / (rows + 1);

  const getColorForAFR = (value: number) => {
    if (value >= 14.5) return "#ff4444";
    if (value >= 13.5) return "#ffaa00";
    if (value >= 12.5) return "#ffff00";
    if (value >= 11.5) return "#88ff88";
    return "#44ff44";
  };

  const rpmLabels = Array.from({ length: cols }, (_, i) => `${(i + 1) * 500}`);
  const loadLabels = Array.from({ length: rows }, (_, i) => `Load ${i + 1}`);

  const handleCellEdit = (index: number) => {
    if (isViewer) {
      Alert.alert("Access Denied", "Viewers cannot edit AFR tables.");
      return;
    }
    if (!tune || !afrTable) return;

    if (viewMode === "rpm") {
      const rpmValues = afrTable.map((row) => row[index]);
      router.push({
        pathname: "/cell_edit",
        params: {
          vehicleId: vehicle.id,
          tuneId: tune.id,
          mode: "rpm",
          index: String(index),
          rpm: String((index + 1) * 500),
          values: JSON.stringify(rpmValues),
        },
      });
    } else {
      const loadValues = afrTable[index];
      router.push({
        pathname: "/cell_edit",
        params: {
          vehicleId: vehicle.id,
          tuneId: tune.id,
          mode: "load",
          index: String(index),
          load: String(index + 1),
          values: JSON.stringify(loadValues),
        },
      });
    }
  };

  // --- UI ---
  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      {!isFullscreen && (
        <>
          <View style={styles.header}>
            <View>
                <Text style={styles.titleText}>
                {tune.name} ({vehicle.name})
                </Text>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.modeToggle}>
                <Pressable
                  style={[styles.modeButton, viewMode === "rpm" && styles.modeButtonActive]}
                  onPress={() => setViewMode("rpm")}
                >
                  <Text style={styles.modeText}>RPM</Text>
                </Pressable>
                <Pressable
                  style={[styles.modeButton, viewMode === "load" && styles.modeButtonActive]}
                  onPress={() => setViewMode("load")}
                >
                  <Text style={styles.modeText}>Load</Text>
                </Pressable>
              </View>

              {!isViewer && (
                <Pressable
                  style={({ pressed }) => [
                    styles.fullscreenButton,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => setIsFullscreen(true)}
                >
                  <Ionicons name="expand" size={22} color="#fff" />
                </Pressable>
              )}
            </View>
          </View>

          <ScrollView style={styles.listContainer}>
            {(viewMode === "rpm" ? rpmLabels : loadLabels).map((label, i) => (
              <Pressable
                key={i}
                style={({ pressed }) => [
                  styles.listItem,
                  pressed && { backgroundColor: "#333" },
                ]}
                onPress={() => handleCellEdit(i)}
              >
                <Text style={styles.listItemText}>
                  {viewMode === "rpm" ? `RPM ${label}` : label}
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#888" />
              </Pressable>
            ))}
          </ScrollView>
        </>
      )}

      {isFullscreen && (
        <View style={styles.fullscreenOverlay}>
          <Pressable
            style={styles.shrinkButton}
            onPress={() => setIsFullscreen(false)}
          >
            <Ionicons name="contract" size={28} color="#fff" />
          </Pressable>

          <View style={styles.mapGrid}>
            <View style={styles.headerRow}>
              <Text style={[styles.cornerLabel, { width: cellWidth }]}>RPM</Text>
              {rpmLabels.map((rpm, i) => (
                <Text key={i} style={[styles.rpmLabel, { width: cellWidth }]}>
                  {rpm}
                </Text>
              ))}
            </View>

            {afrTable.map((row, r) => (
              <View key={r} style={styles.dataRow}>
                <Text style={[styles.loadLabel, { width: cellWidth }]}>
                  {loadLabels[r]}
                </Text>
                {row.map((value, c) => (
                  <View
                    key={c}
                    style={[
                      styles.dataCell,
                      {
                        width: cellWidth,
                        height: cellHeight,
                        backgroundColor: getColorForAFR(value),
                      },
                    ]}
                  >
                    <Text style={styles.cellText}>{value.toFixed(1)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

function generateAFRTable(maxRpm: number) {
  const cols = Math.max(1, Math.floor(maxRpm / 500));
  const rows = LOAD_ROWS;
  const minAFR = 10.5;
  const maxAFR = 15.5;

  const table: number[][] = [];
  for (let r = 0; r < rows; r++) {
    const loadFactor = r / (rows - 1);
    const rowArr: number[] = [];
    for (let c = 0; c < cols; c++) {
      const rpmFactor = c / Math.max(1, cols - 1);
      const blend = 0.75 * loadFactor + 0.25 * rpmFactor;
      const afr = maxAFR - (maxAFR - minAFR) * blend;
      rowArr.push(Math.round(afr * 10) / 10);
    }
    table.push(rowArr);
  }
  return table;
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#1a1a1a" },
  loadingText: { color: "#fff", padding: 20 },
  header: {
    flexDirection: "column",
    gap: 10,
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  titleText: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 10 },
  modeToggle: { flexDirection: "row", gap: 10 },
  modeButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: "#333",
  },
  modeButtonActive: { backgroundColor: "#007acc" },
  modeText: { color: "#fff", fontWeight: "bold" },
  fullscreenButton: {
    marginLeft: 8,
    backgroundColor: "#333",
    borderRadius: 8,
    padding: 10,
  },
  listContainer: { paddingHorizontal: 10, paddingTop: 10 },
  listItem: {
    backgroundColor: "#222",
    borderRadius: 8,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  listItemText: { color: "#fff", fontSize: 16 },
  fullscreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 40,
  },
  shrinkButton: {
    position: "absolute",
    top: 24,
    right: 24,
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 10,
    borderRadius: 30,
  },
  mapGrid: { marginBottom : 70, margin: 50 },
  headerRow: { flexDirection: "row", marginBottom: 4 },
  cornerLabel: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "bold",
  },
  rpmLabel: {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#333",
  },
  dataRow: { flexDirection: "row" },
  loadLabel: {
    textAlign: "center",
    color: "#fff",
    backgroundColor: "#333",
  },
  dataCell: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 1,
  },
  cellText: { color: "#000", fontWeight: "bold" },
});
