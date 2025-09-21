import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ScreenOrientation from "expo-screen-orientation";
import Legend from "../components/Legend";
import { useLocalSearchParams } from "expo-router";

// Map 1: Original AFR data (Stock Tune)
const stockAfrData = [
  [15.0, 15.0, 15.0, 14.7, 14.2, 13.8, 13.5, 13.3, 13.1, 12.9, 12.7, 12.5, 12.3],
  [14.9, 14.7, 14.7, 14.4, 14.2, 14.0, 13.8, 13.6, 13.4, 13.2, 13.0, 12.8, 12.6],
  [14.0, 14.7, 14.7, 14.1, 14.2, 14.7, 14.7, 15.5, 15.5, 15.5, 14.9, 14.3, 14.3],
  [14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 13.3, 13.3, 13.3, 13.3],
  [14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 13.9, 13.9, 13.9, 13.9],
  [14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.3, 13.3, 12.6, 12.1, 11.8],
  [14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 14.6, 13.9, 12.2, 11.8, 11.5],
  [13.6, 13.6, 14.7, 14.7, 14.7, 14.7, 14.7, 14.7, 13.3, 12.5, 11.9, 11.4, 10.9],
  [13.4, 13.4, 13.8, 13.9, 14.8, 14.7, 14.7, 13.1, 13.1, 12.2, 11.5, 11.1, 10.7],
  [13.4, 13.4, 13.4, 13.4, 13.4, 13.6, 13.6, 12.1, 12.1, 11.6, 11.2, 10.8, 10.5],
  [13.4, 13.4, 13.4, 13.4, 13.1, 13.1, 13.1, 12.1, 12.1, 11.2, 10.8, 10.5, 10.3],
  [13.4, 13.4, 13.4, 13.4, 12.9, 12.9, 12.5, 11.6, 11.3, 10.5, 10.4, 10.3, 10.2],
  [13.4, 13.4, 13.4, 13.4, 12.9, 12.9, 12.5, 11.5, 11.1, 10.5, 10.4, 10.3, 10.2],
];

// Map 2: Performance AFR data (Tuned/Stage 2)
const performanceAfrData = [
  [14.8, 14.5, 14.2, 13.9, 13.6, 13.3, 13.0, 12.8, 12.6, 12.4, 12.2, 12.0, 11.8],
  [14.6, 14.3, 14.0, 13.7, 13.4, 13.1, 12.9, 12.7, 12.5, 12.3, 12.1, 11.9, 11.7],
  [14.2, 13.9, 13.6, 13.3, 13.0, 12.8, 12.6, 12.4, 12.2, 12.0, 11.8, 11.6, 11.4],
  [14.0, 13.7, 13.4, 13.1, 12.8, 12.6, 12.4, 12.2, 12.0, 11.8, 11.6, 11.4, 11.2],
  [13.8, 13.5, 13.2, 12.9, 12.6, 12.4, 12.2, 12.0, 11.8, 11.6, 11.4, 11.2, 11.0],
  [13.6, 13.3, 13.0, 12.7, 12.4, 12.2, 12.0, 11.8, 11.6, 11.4, 11.2, 11.0, 10.8],
  [13.4, 13.1, 12.8, 12.5, 12.2, 12.0, 11.8, 11.6, 11.4, 11.2, 11.0, 10.8, 10.6],
  [13.2, 12.9, 12.6, 12.3, 12.0, 11.8, 11.6, 11.4, 11.2, 11.0, 10.8, 10.6, 10.4],
  [13.0, 12.7, 12.4, 12.1, 11.8, 11.6, 11.4, 11.2, 11.0, 10.8, 10.6, 10.4, 10.2],
  [12.8, 12.5, 12.2, 11.9, 11.6, 11.4, 11.2, 11.0, 10.8, 10.6, 10.4, 10.2, 10.0],
  [12.6, 12.3, 12.0, 11.7, 11.4, 11.2, 11.0, 10.8, 10.6, 10.4, 10.2, 10.0, 9.8],
  [12.4, 12.1, 11.8, 11.5, 11.2, 11.0, 10.8, 10.6, 10.4, 10.2, 10.0, 9.8, 9.6],
  [12.2, 11.9, 11.6, 11.3, 11.0, 10.8, 10.6, 10.4, 10.2, 10.0, 9.8, 9.6, 9.4],
];

const rpmLabels = ["500", "1000", "1500", "2000", "2500", "3000", "3500", "4000", "4500", "5000", "5500", "6000", "6500"];
const loadLabels = ["LOW", "", "", "", "L", "O", "A", "D", "", "", "", "", "HIGH"];

const legendData = [
  { color: "#ff4444", label: "Rich (14.5+)" },
  { color: "#ffaa00", label: "Moderate" },
  { color: "#ffff00", label: "Optimal" },
  { color: "#88ff88", label: "Good" },
  { color: "#44ff44", label: "Lean" }
];

export default function MapScreen() {
  // useState for managing current AFR data and map info
  const [afrDataState, setAfrDataState] = useState(stockAfrData);
  const [currentMap, setCurrentMap] = useState(0); // 0 for stock, 1 for performance
  const [mapTitle, setMapTitle] = useState("Stock AFR Map");
  const [refreshCount, setRefreshCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const { width, height } = useWindowDimensions()
  const cellSize = { width: 60, height: 40 };

  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
  };

    
  useEffect(() => {
    ScreenOrientation.unlockAsync();
  }, []);
    
  const { title } = useLocalSearchParams();

  useEffect(() => {
    setIsLoading(true);
    
    const timer = setTimeout(() => {
      if (currentMap === 0) {
        setAfrDataState([...stockAfrData]);
        setMapTitle("Stock AFR Map");
      } else {
        setAfrDataState([...performanceAfrData]);
        setMapTitle("Performance AFR Map (Stage 2)");
      }
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [currentMap]);

  useEffect(() => {
    console.log('AFR Map component mounted');
    setAfrDataState([...stockAfrData]);
  }, []);

  useEffect(() => {
    if (refreshCount > 0) {
      console.log(`Map refreshed ${refreshCount} times`);
    }
  }, [refreshCount]);

  const handleRefresh = () => {
    setCurrentMap(prevMap => prevMap === 0 ? 1 : 0);
    setRefreshCount(prev => prev + 1);
  };

  const getColorForAFR = (value: number) => {
    if (value >= 14.5) return "#ff4444";
    if (value >= 13.5) return "#ffaa00";
    if (value >= 12.5) return "#ffff00";
    if (value >= 11.5) return "#88ff88";
    return "#44ff44";
  };

  const getMapStats = () => {
    const flatData = afrDataState.flat();
    const avgAFR = (flatData.reduce((sum, val) => sum + val, 0) / flatData.length).toFixed(2);
    const minAFR = Math.min(...flatData).toFixed(1);
    const maxAFR = Math.max(...flatData).toFixed(1);
    
    return { avgAFR, minAFR, maxAFR };
  };

  const { avgAFR, minAFR, maxAFR } = getMapStats();

  return (
    <SafeAreaView style={styles.safeArea} edges={["top", "left", "right"]}>
        <ScrollView style={styles.mapContainer}>
          <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
          
          <View style={styles.mapHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.mapTitle}>
                {title || mapTitle}
              </Text>
              <Text style={styles.mapIndicator}>
                Map {currentMap + 1} of 2 • Refreshed {refreshCount} times
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.refreshButton,
                pressed && styles.refreshButtonPressed,
                isLoading && styles.refreshButtonLoading,
              ]}
              onPress={handleRefresh}
              disabled={isLoading}
            >
              <Ionicons
                name={isLoading ? "hourglass-outline" : "refresh"}
                size={22}
                color="#ffffff"
              />
            </Pressable>
          </View>

          <Text style={styles.mapSubtitle}>
            Open-Loop Control (1995 300GT Spyder VR4) - {currentMap === 0 ? "Stock Configuration" : "Performance Tune"}
          </Text>

          {/* Map Statistics */}
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>AVG</Text>
              <Text style={styles.statValue}>{avgAFR}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>MIN</Text>
              <Text style={styles.statValue}>{minAFR}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>MAX</Text>
              <Text style={styles.statValue}>{maxAFR}</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>TYPE</Text>
              <Text style={styles.statValue}>{currentMap === 0 ? "STOCK" : "PERF"}</Text>
            </View>
          </View>
            <View style={styles.mapControls}>
              <Pressable
                style={({ pressed }) => [
                  styles.fullscreenButton,
                  pressed && styles.fullscreenButtonPressed,
                ]}
                onPress={toggleFullscreen}
              >
                <Ionicons
                  name={isFullscreen ? "contract" : "expand"}
                  size={22}
                  color="#fff"
                />
              </Pressable>
            </View>
              {isFullscreen ? (
                // Fullscreen mode
                               <View style={isFullscreen ? styles.fullscreenOverlay : null}>
                                 {/* Shrink button (only visible in fullscreen) */}
                                 {isFullscreen && (
                                   <Pressable
                                     style={styles.shrinkButton}
                                     onPress={toggleFullscreen}
                                   >
                                     <Ionicons name="contract" size={28} color="#fff" />
                                   </Pressable>
                                 )}

                                 <ScrollView horizontal>
                                   <ScrollView>
                                     <View style={[styles.mapGrid, isLoading && styles.mapGridLoading]}>
                                       <View style={styles.headerRow}>
                                         <Text style={[styles.cornerLabel, { width: cellSize.width }]}>
                                           RPM
                                         </Text>
                                         {rpmLabels.map((rpm, index) => (
                                           <Text
                                             key={index}
                                             style={[styles.rpmLabel, { width: cellSize.width }]}
                                           >
                                             {rpm}
                                           </Text>
                                         ))}
                                       </View>
                                       {afrDataState.map((row, rowIndex) => (
                                         <View key={rowIndex} style={styles.dataRow}>
                                           <Text
                                             style={[
                                               styles.loadLabel,
                                               { width: cellSize.width, height: cellSize.height },
                                             ]}
                                           >
                                             {loadLabels[rowIndex]}
                                           </Text>
                                           {row.map((value, colIndex) => (
                                             <View
                                               key={colIndex}
                                               style={[
                                                 styles.dataCell,
                                                 {
                                                   backgroundColor: getColorForAFR(value),
                                                   width: cellSize.width,
                                                   height: cellSize.height,
                                                 },
                                                 isLoading && styles.dataCellLoading,
                                               ]}
                                             >
                                               <Text style={styles.cellText}>{value.toFixed(1)}</Text>
                                             </View>
                                           ))}
                                         </View>
                                       ))}
                                     </View>
                                   </ScrollView>
                                 </ScrollView>
                               </View>
              ) : (
                // Normal embedded mode
                <ScrollView horizontal directionalLockEnabled showsHorizontalScrollIndicator>
                  <ScrollView showsVerticalScrollIndicator>
                    <View style={[styles.mapGrid, isLoading && styles.mapGridLoading]}>
                      <View style={styles.headerRow}>
                        <Text style={styles.cornerLabel}>RPM</Text>
                        {rpmLabels.map((rpm, index) => (
                          <Text key={index} style={styles.rpmLabel}>{rpm}</Text>
                        ))}
                      </View>

                      {afrDataState.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.dataRow}>
                          <Text style={styles.loadLabel}>{loadLabels[rowIndex]}</Text>
                          {row.map((value, colIndex) => (
                            <View
                              key={colIndex}
                              style={[
                                styles.dataCell,
                                { backgroundColor: getColorForAFR(value) },
                                isLoading && styles.dataCellLoading,
                              ]}
                            >
                              <Text style={styles.cellText}>{value.toFixed(1)}</Text>
                            </View>
                          ))}
                        </View>
                      ))}
                    </View>
                  </ScrollView>
                </ScrollView>
          )}


          <Legend title="AFR Legend:" items={legendData} />

          {/* Additional Info Panel */}
          <View style={styles.infoPanel}>
            <Text style={styles.infoText}>
              💡 Tap refresh to switch between Stock and Performance maps
            </Text>
            <Text style={styles.infoText}>
              🔧 Current: {currentMap === 0 ? "Conservative tuning for daily driving" : "Aggressive tuning for maximum performance"}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#1a1a1a", // match your theme
  },
  mapContainer: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  mapHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  titleContainer: {
    flex: 1,
  },
  mapTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ffffff",
  },
  mapIndicator: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  refreshButton: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007acc",
    minWidth: 48,
    alignItems: 'center',
  },
  refreshButtonPressed: {
    backgroundColor: "#005fa3",
  },
  refreshButtonLoading: {
    backgroundColor: "#666",
  },
  mapSubtitle: {
    textAlign: "center",
    fontSize: 14,
    color: "#cccccc",
    paddingVertical: 10,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 10,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    color: '#888',
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 2,
  },
  mapGrid: {
    margin: 20,
  },
  mapGridLoading: {
    opacity: 0.7,
  },
  headerRow: {
    flexDirection: "row",
    marginBottom: 2,
  },
  cornerLabel: {
    width: 50,
    textAlign: "center",
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "bold",
    padding: 8,
  },
  rpmLabel: {
    width: 50,
    textAlign: "center",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
    padding: 8,
    backgroundColor: "#333",
  },
  dataRow: {
    flexDirection: "row",
    marginBottom: 1,
  },
  loadLabel: {
    width: 50,
    textAlign: "center",
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "bold",
    padding: 8,
    backgroundColor: "#333",
  },
  dataCell: {
    width: 50,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 1,
    borderRadius: 2,
  },
  dataCellLoading: {
    opacity: 0.5,
  },
  cellText: {
    color: "#000000",
    fontSize: 10,
    fontWeight: "bold",
  },
  infoPanel: {
    backgroundColor: '#2a2a2a',
    marginHorizontal: 20,
    marginVertical: 10,
    padding: 15,
    borderRadius: 8,
  },
  infoText: {
    color: '#ccc',
    fontSize: 12,
    marginBottom: 5,
  },
    mapControls: {
      flexDirection: "row",
      justifyContent: "flex-end",
      paddingHorizontal: 20,
      marginBottom: 8,
    },
    fullscreenButton: {
      padding: 10,
      borderRadius: 8,
      backgroundColor: "#444",
    },
    fullscreenButtonPressed: {
      backgroundColor: "#666",
    },
    fullscreenOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "#000",
      zIndex: 99,
      justifyContent: "center",
      alignItems: "center",
    },
    shrinkButton: {
      position: "absolute",
      top: 20,
      right: 20,
      zIndex: 100,
      backgroundColor: "rgba(0,0,0,0.6)",
      padding: 10,
      borderRadius: 30,
    },
});
