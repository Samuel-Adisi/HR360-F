import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import {
  BellIcon,
  GlobeAltIcon,
  MoonIcon,
  ShieldCheckIcon,
} from "react-native-heroicons/outline";

import { sansText, serifText } from "../../../src/theme/fonts";

const ACCENT = "#0F766E";
const BG_LIGHT = "#F8FAFC";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [biometric, setBiometric] = useState(false);

  const handleMockPress = (action) => {
    Alert.alert("Coming soon", `${action} will be available shortly.`);
  };

  const ToggleRow = ({ icon, title, subtitle, value, onValueChange }) => (
    <View style={styles.toggleRow}>
      <View style={styles.toggleLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <View style={styles.toggleText}>
          <Text style={[styles.toggleTitle, sansText()]}>{title}</Text>
          {!!subtitle && (
            <Text style={[styles.toggleSub, sansText()]}>{subtitle}</Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E2E8F0", true: ACCENT }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const LinkRow = ({ icon, title, onPress }) => (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.linkRow, pressed && { backgroundColor: "#F8FAFC" }]}
    >
      <View style={styles.toggleLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={[styles.toggleTitle, sansText()]}>{title}</Text>
      </View>
      <Text style={[styles.linkAction, sansText()]}>Change</Text>
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, sansText()]}>Appearance</Text>
          <View style={styles.card}>
            <ToggleRow
              icon={<MoonIcon size={18} color={ACCENT} />}
              title="Dark Mode"
              subtitle="Switch to dark colour scheme"
              value={darkMode}
              onValueChange={setDarkMode}
            />
          </View>
        </View>

        {/* Notifications */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, sansText()]}>Notifications</Text>
          <View style={styles.card}>
            <ToggleRow
              icon={<BellIcon size={18} color={ACCENT} />}
              title="Push Notifications"
              subtitle="In-app alerts & reminders"
              value={pushNotifs}
              onValueChange={setPushNotifs}
            />
            <View style={styles.divider} />
            <ToggleRow
              icon={<GlobeAltIcon size={18} color={ACCENT} />}
              title="Email Notifications"
              subtitle="Summary emails & updates"
              value={emailNotifs}
              onValueChange={setEmailNotifs}
            />
          </View>
        </View>

        {/* Security */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, sansText()]}>Security</Text>
          <View style={styles.card}>
            <ToggleRow
              icon={<ShieldCheckIcon size={18} color={ACCENT} />}
              title="Biometric Login"
              subtitle="Face ID / Touch ID"
              value={biometric}
              onValueChange={setBiometric}
            />
            <View style={styles.divider} />
            <LinkRow
              icon={<ShieldCheckIcon size={18} color={ACCENT} />}
              title="Change Password"
              onPress={() => handleMockPress("Change Password")}
            />
          </View>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={[styles.appVersion, sansText()]}>HR360 · Version 1.0.0</Text>
          <Text style={[styles.appCopyright, sansText()]}>© 2026 HR360. All rights reserved.</Text>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  toggleText: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1E293B",
  },
  toggleSub: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  linkRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linkAction: {
    fontSize: 14,
    color: ACCENT,
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 62,
  },
  appInfo: {
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    gap: 4,
  },
  appVersion: {
    fontSize: 13,
    color: "#CBD5E1",
  },
  appCopyright: {
    fontSize: 11,
    color: "#CBD5E1",
  },
});
