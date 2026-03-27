import { router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { sansText, serifText } from "../../src/theme/fonts";
import { BRAND_TEAL } from "../../src/theme/navigationTheme";

export default function SignupScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.box}>
        <Text style={[styles.title, serifText()]}>Sign up</Text>
        <Text style={[styles.hint, sansText()]}>
          Registration will be wired in the new app. Use Sign in for now.
        </Text>
        <TouchableOpacity style={styles.btn} onPress={() => router.back()}>
          <Text style={[styles.btnText, sansText()]}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f7" },
  box: { flex: 1, padding: 24, justifyContent: "center" },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 12 },
  hint: { fontSize: 15, color: "#666", marginBottom: 24 },
  btn: {
    backgroundColor: BRAND_TEAL,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
