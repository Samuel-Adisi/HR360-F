import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { SCREEN_BG } from "../../../src/theme/navigationTheme";

export default function SettingsHome() {
  const signOut = async () => {
    Alert.alert("Sign out", "Clear session and return to login?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove([
            "access_token",
            "refresh_token",
            "username",
            "user",
          ]);
          router.replace("/login");
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.body}>Account and app preferences go here.</Text>
      <TouchableOpacity style={styles.outline} onPress={signOut}>
        <Text style={styles.outlineText}>Sign out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: SCREEN_BG },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 15, color: "#555", lineHeight: 22, marginBottom: 24 },
  outline: {
    borderWidth: 1,
    borderColor: "#dc2626",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  outlineText: { color: "#dc2626", fontWeight: "600" },
});
