import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { View } from "react-native";
import ModButton from "../components/navButton";
import { AuthProvider } from "../context/Auth_context";

export default function Layout() {
  const router = useRouter();
  const params = useLocalSearchParams<{ vehicleId?: string }>();
  const vehicleId = params.vehicleId;

  return (
    <AuthProvider>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#1a1a1a" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: "Vehicles",
            headerRight: () => (
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <ModButton symbol="add" action={() =>
                  router.push({
                    pathname: "/add",
                    params: { type: "vehicle" },
                  })
                }/>
                <ModButton symbol="person" action={() =>
                  router.push({ pathname: "/permissions" })
                }/>
              </View>
            ),
            animation: "slide_from_left",
            headerBackVisible: false,
          }}
        />
        <Stack.Screen name="map" options={{ title: "", presentation: "card" }} />
        <Stack.Screen name="permissions" options={{ title: "Manage Access", presentation: "card" }} />
        <Stack.Screen name="cell_edit" options={{ title: "", presentation: "card" }} />
        <Stack.Screen
            name="tune_selection"
            options={{
                title: "",
                headerBackVisible: true,
                // remove headerRight here
            }}
        />
        {/* <Stack.Screen
          name="tune_selection"
          options={{
            title: "",
            headerBackVisible: true,
            headerRight: () => (
              <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
                <ModButton symbol="add" action={() =>
                  router.push({
                    pathname: "/add",
                    params: { type: "tune", vehicleId }, // ✅ pass vehicleId
                  })
                }/>
                <ModButton symbol="person" action={() =>
                  router.push({ pathname: "/permissions" })
                }/>
              </View>
            ),
          }}
        /> */}
      </Stack>
    </AuthProvider>
  );
}
