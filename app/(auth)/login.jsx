import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import api from "../../src/services/api";
import { sansText, serifText } from "../../src/theme/fonts";
import { BRAND_TEAL } from "../../src/theme/navigationTheme";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/api/login", { email, password });
      await AsyncStorage.setItem("access_token", res.data.access_token);
      await AsyncStorage.setItem("refresh_token", res.data.refresh_token);
      await AsyncStorage.setItem("username", res.data.user.username);
      await AsyncStorage.setItem("user", JSON.stringify(res.data.user));
      await AsyncStorage.setItem("user_role", res.data.role);
      router.replace("/(employees)/(tabs)/dashboard");
    } catch (e) {
      Alert.alert("Error", e?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <View style={styles.card}>
          <Text style={[styles.title, serifText()]}>HR360</Text>
          <Text style={[styles.subtitle, sansText()]}>Sign in to continue</Text>
          <TextInput
            style={[styles.input, sansText()]}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View style={styles.passwordRow}>
            <TextInput
              style={[styles.input, styles.passwordInput, sansText()]}
              placeholder="Password"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eye}
              onPress={() => setShowPassword((v) => !v)}
              accessibilityLabel={
                showPassword ? "Hide password" : "Show password"
              }
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={[styles.primary, loading && styles.primaryDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={[styles.primaryText, sansText()]}>Sign in</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={[styles.link, sansText()]}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#f5f5f7" },
  flex: { flex: 1, justifyContent: "center", padding: 24 },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    gap: 12,
  },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center" },
  subtitle: {
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
  },
  passwordRow: { position: "relative" },
  passwordInput: { paddingRight: 44 },
  eye: { position: "absolute", right: 10, top: 12 },
  primary: {
    backgroundColor: BRAND_TEAL,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  primaryDisabled: { opacity: 0.7 },
  primaryText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  link: { textAlign: "center", color: BRAND_TEAL, marginTop: 8 },
});
