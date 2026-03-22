import { FontAwesome, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { router } from "expo-router";
import api from "../../src/services/api";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.post("/api/login", { email, password });

      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("refresh_token", res.data.refresh_token);
      localStorage.setItem("username", res.data.user.username);

      if (res.status === 200) {
        router.push("./dashboard");
      }
    } catch (error) {
      console.log("ERROR DATA:", error.response?.data);
      console.log("ERROR STATUS:", error.response?.status);
      console.log("ERROR MESSAGE:", error.message);
      Alert.alert("Error", "Login failed!");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    Alert.alert("Google Sign In", "Redirecting to Google authentication...");
  };

  const handleForgotPassword = () => {
    Alert.alert(
      "Forgot Password",
      "Password reset link will be sent to your email",
    );
  };

  const handleSignUp = () => {
    Alert.alert("Sign Up", "Navigating to registration screen...");
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo Section */}
          <View style={styles.logoSection}>
            <View style={styles.logoCircle}>
              <Ionicons name="business" size={40} color="#3B82F6" />
            </View>
            <Text style={styles.logoText}>HR360</Text>
            <Text style={styles.tagline}>Your Complete HR Solution</Text>
          </View>

          {/* Welcome Text */}
          <View style={styles.welcomeSection}>
            <Text style={styles.welcomeTitle}>Welcome Back</Text>
            <Text style={styles.welcomeSubtitle}>
              Sign in to continue to your account
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formSection}>
            {/* Email Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your email"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  editable={!isLoading}
                />
              </View>
            </View>

            {/* Password Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <View style={styles.inputWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#64748B"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Enter your password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  editable={!isLoading}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeIcon}
                  disabled={isLoading}
                >
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#64748B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Remember Me & Forgot Password */}
            <View style={styles.optionsRow}>
              <TouchableOpacity
                style={styles.rememberMe}
                onPress={() => setRememberMe(!rememberMe)}
                disabled={isLoading}
              >
                <View
                  style={[styles.checkbox, rememberMe && styles.checkboxActive]}
                >
                  {rememberMe && (
                    <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                  )}
                </View>
                <Text style={styles.rememberMeText}>Remember me</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleForgotPassword}
                disabled={isLoading}
              >
                <Text style={styles.forgotPassword}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              style={[
                styles.loginButton,
                isLoading && styles.loginButtonDisabled,
              ]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.loginButtonText}>Signing In...</Text>
                </>
              ) : (
                <>
                  <Text style={styles.loginButtonText}>Sign In</Text>
                  <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
                </>
              )}
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Google Sign In */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              disabled={isLoading}
            >
              <FontAwesome name="google" size={20} color="#DB4437" />
              <Text style={styles.googleButtonText}>Sign in with Google</Text>
            </TouchableOpacity>

            {/* Social Login Options */}
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                disabled={isLoading}
              >
                <Ionicons name="logo-apple" size={24} color="#1E293B" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                disabled={isLoading}
              >
                <Ionicons name="logo-linkedin" size={24} color="#0A66C2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpSection}>
            <Text style={styles.signUpText}>Don't have an account? </Text>
            <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              By signing in, you agree to our{" "}
            </Text>
            <View style={styles.footerLinks}>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Terms of Service</Text>
              </TouchableOpacity>
              <Text style={styles.footerText}> and </Text>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  tagline: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  welcomeSection: {
    marginBottom: 32,
  },
  welcomeTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: "#64748B",
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: "#1E293B",
    fontWeight: "500",
  },
  eyeIcon: {
    padding: 4,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  rememberMeText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "600",
  },
  loginButton: {
    backgroundColor: "#3B82F6",
    borderRadius: 12,
    height: 56,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E2E8F0",
  },
  dividerText: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
    paddingHorizontal: 16,
    letterSpacing: 0.5,
  },
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    height: 56,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  googleButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
  },
  socialButton: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpSection: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  signUpText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  signUpLink: {
    fontSize: 14,
    color: "#3B82F6",
    fontWeight: "700",
  },
  footer: {
    alignItems: "center",
    marginTop: 32,
  },
  footerText: {
    fontSize: 12,
    color: "#94A3B8",
    textAlign: "center",
  },
  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 4,
  },
  footerLink: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "600",
  },
});
