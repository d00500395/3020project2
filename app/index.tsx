import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import Header from "../components/Header";
import MapCard from "../components/MapCard";

export default function LandingPage() {
  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const mapData = [
    { title: "Vehicle 1", buttonText: "View AFR Map", route: "/map" },
    { title: "Vehicle 2", buttonText: "View AFR Map", route: "/map" },
    { title: "Vehicle 3", buttonText: "View AFR Map", route: "/map" },
    { title: "Vehicle 4", buttonText: "View AFR Map", route: "/map" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />

      <Header
        title="Menu"
        subtitle="Air-Fuel Ratio Mapping Tool"
        isCompact={isLandscape}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={isLandscape && styles.gridContainer}
        showsVerticalScrollIndicator={false}
      >
        {mapData.map((map, index) => (
          <View
            key={index}
            style={isLandscape ? styles.gridItem : undefined}
          >
            <MapCard
              title={map.title}
              description={map.description}
              features={map.features}
              buttonText={map.buttonText}
              route={map.route}
              isPrimary={map.isPrimary}
            />
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1a1a1a",
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "48%", // two columns with spacing
    marginBottom: 15,
  },
});
