import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { BRAND_TEAL, SCREEN_BG } from "../../../src/theme/navigationTheme";

export default function AddEmployeePlaceholder() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add</Text>
      <Text style={styles.body}>
        Quick-add flow from the + button — wire forms when you are ready.
      </Text>
      <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
        <Text style={styles.btnText}>Close</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 15, color: "#555", lineHeight: 22, marginBottom: 24 },
  btn: {
    backgroundColor: BRAND_TEAL,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
