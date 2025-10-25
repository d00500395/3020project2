import React from "react";
import { ActivityIndicator, Button, StyleSheet, Text, View } from "react-native";
import { ROLES, useAuth } from "../context/Auth_context";

export default function PermissionsPage() {
  const { user, setUser, logout, loading } = useAuth();

  const handleSetRole = async (role: keyof typeof ROLES) => {
    await setUser({ name: "Guest", role });
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a role</Text>
      <View style={styles.buttons}>
        <Button title="Viewer" onPress={() => handleSetRole(ROLES.VIEWER)} />
        <Button title="Editor" onPress={() => handleSetRole(ROLES.EDITOR)} />
        <Button title="Admin" onPress={() => handleSetRole(ROLES.ADMIN)} />
      </View>

      {user ? (
        <>
          <Text style={styles.info}>Current role: {user.role}</Text>
          <Button title="Log out" onPress={logout} />
        </>
      ) : (
        <Text style={styles.info}>No user selected</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a1a", padding: 20 },
  header: { fontSize: 24, color: "#fff", marginBottom: 20 },
  buttons: { width: "80%", gap: 10 },
  info: { marginTop: 20, color: "#fff" },
});
