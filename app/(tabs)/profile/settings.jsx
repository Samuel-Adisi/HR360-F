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
  DevicePhoneMobileIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  EyeSlashIcon,
  FingerPrintIcon,
  KeyIcon,
  LanguageIcon,
  LockClosedIcon,
  MoonIcon,
  TrashIcon
} from "react-native-heroicons/outline";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  accentMid: "#CCFBF1",
  navy: "#0F172A",
  slate: "#1E293B",
  sub: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  divider: "#F1F5F9",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  green: "#059669",
  greenBg: "#DCFCE7",
  red: "#DC2626",
  redBg: "#FEE2E2",
  amber: "#D97706",
  amberBg: "#FEF3C7",
  blue: "#0A66C2",
  blueBg: "#EFF6FF",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  orange: "#F97316",
  orangeBg: "#FFF7ED",
};

// ─── Sub-components ───────────────────────────────────────────────────────────

// Solid square icon — matches profile index exactly
function IconSquare({ icon: Icon, color, size = 36 }) {
  return (
    <View
      style={[
        s.iconSquare,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size * 0.27,
        },
      ]}
    >
      <Icon size={size * 0.44} color="#FFFFFF" strokeWidth={2} />
    </View>
  );
}

function SectionHeader({ title }) {
  return (
    <View style={s.sectionHeaderRow}>
      <View style={s.sectionBarAccent} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function ToggleRow({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  value,
  onValueChange,
}) {
  return (
    <View style={s.optionRow}>
      <View style={s.optionLeft}>
        <IconSquare icon={Icon} color={iconColor} size={36} />
        <View style={s.optionTextWrap}>
          <Text style={s.optionTitle}>{title}</Text>
          {subtitle ? <Text style={s.optionSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: C.border, true: C.accentMid }}
        thumbColor={value ? C.accent : C.muted}
        ios_backgroundColor={C.border}
      />
    </View>
  );
}

function LinkRow({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  rightLabel,
  onPress,
  isDestructive = false,
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        s.optionRow,
        pressed && { backgroundColor: C.divider },
      ]}
    >
      <View style={s.optionLeft}>
        <IconSquare
          icon={Icon}
          color={isDestructive ? C.red : iconColor}
          size={36}
        />
        <View style={s.optionTextWrap}>
          <Text style={[s.optionTitle, isDestructive && { color: C.red }]}>
            {title}
          </Text>
          {subtitle ? <Text style={s.optionSubtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {rightLabel ? <Text style={s.rightLabel}>{rightLabel}</Text> : null}
    </Pressable>
  );
}

function Divider() {
  return <View style={s.divider} />;
}

function FormCard({ children }) {
  return <View style={s.card}>{children}</View>;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);
  const [pushNotifs, setPushNotifs] = useState(true);
  const [emailNotifs, setEmailNotifs] = useState(false);
  const [smsNotifs, setSmsNotifs] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [autoLock, setAutoLock] = useState(true);

  const handleMockPress = (action) => {
    Alert.alert("Coming soon", `${action} will be available shortly.`);
  };

  return (
    <View style={s.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Appearance ── */}
        <View style={s.section}>
          <SectionHeader title="Appearance" />
          <FormCard>
            <ToggleRow
              icon={MoonIcon}
              iconColor={C.purple}
              title="Dark Mode"
              subtitle="Switch to dark colour scheme"
              value={darkMode}
              onValueChange={setDarkMode}
            />
            <Divider />
            <LinkRow
              icon={LanguageIcon}
              iconColor={C.blue}
              title="Language"
              subtitle="App display language"
              rightLabel="English"
              onPress={() => handleMockPress("Language")}
            />
          </FormCard>
        </View>

        {/* ── Notifications ── */}
        <View style={s.section}>
          <SectionHeader title="Notifications" />
          <FormCard>
            <ToggleRow
              icon={BellIcon}
              iconColor={C.orange}
              title="Push Notifications"
              subtitle="In-app alerts & reminders"
              value={pushNotifs}
              onValueChange={setPushNotifs}
            />
            <Divider />
            <ToggleRow
              icon={EnvelopeIcon}
              iconColor={C.blue}
              title="Email Notifications"
              subtitle="Summary emails & updates"
              value={emailNotifs}
              onValueChange={setEmailNotifs}
            />
            <Divider />
            <ToggleRow
              icon={DevicePhoneMobileIcon}
              iconColor={C.green}
              title="SMS Alerts"
              subtitle="Critical attendance alerts via SMS"
              value={smsNotifs}
              onValueChange={setSmsNotifs}
            />
          </FormCard>
        </View>

        {/* ── Security ── */}
        <View style={s.section}>
          <SectionHeader title="Security" />
          <FormCard>
            <ToggleRow
              icon={FingerPrintIcon}
              iconColor={C.green}
              title="Biometric Login"
              subtitle="Face ID / Touch ID on launch"
              value={biometric}
              onValueChange={setBiometric}
            />
            <Divider />
            <ToggleRow
              icon={LockClosedIcon}
              iconColor={C.amber}
              title="Auto-Lock"
              subtitle="Lock app after 5 min of inactivity"
              value={autoLock}
              onValueChange={setAutoLock}
            />
            <Divider />
            <LinkRow
              icon={KeyIcon}
              iconColor={C.purple}
              title="Change Password"
              subtitle="Update your login credentials"
              onPress={() => handleMockPress("Change Password")}
            />
          </FormCard>
        </View>

        {/* ── Data & Privacy ── */}
        <View style={s.section}>
          <SectionHeader title="Data & Privacy" />
          <FormCard>
            <LinkRow
              icon={EyeSlashIcon}
              iconColor={C.blue}
              title="Privacy Policy"
              subtitle="How we handle your data"
              onPress={() => handleMockPress("Privacy Policy")}
            />
            <Divider />
            <LinkRow
              icon={DocumentTextIcon}
              iconColor={C.slate}
              title="Terms of Service"
              subtitle="Usage terms and conditions"
              onPress={() => handleMockPress("Terms of Service")}
            />
            <Divider />
            <LinkRow
              icon={TrashIcon}
              title="Delete Account"
              subtitle="Permanently remove your account"
              onPress={() =>
                Alert.alert(
                  "Delete Account",
                  "This action is permanent and cannot be undone. Please contact your HR administrator.",
                  [{ text: "OK" }],
                )
              }
              isDestructive
            />
          </FormCard>
        </View>

        {/* ── App Info ── */}
        <View style={s.appInfo}>
          <Text style={s.appVersion}>HR360 · Version 1.0.0</Text>
          <Text style={s.appBuild}>Build 2026.04.08</Text>
          <Text style={s.appCopyright}>© 2026 HR360. All rights reserved.</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },
  section: { paddingHorizontal: 16, marginTop: 20 },

  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionBarAccent: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginLeft: 62,
  },

  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 13,
    gap: 8,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  optionTextWrap: { flex: 1 },
  optionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.1,
  },
  optionSubtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: C.muted,
    marginTop: 2,
  },
  rightLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: C.muted,
    marginRight: 4,
  },

  iconSquare: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  appInfo: {
    alignItems: "center",
    marginTop: 28,
    gap: 3,
  },
  appVersion: { fontSize: 12, color: C.muted, fontWeight: "600" },
  appBuild: { fontSize: 11, color: C.border, fontWeight: "500" },
  appCopyright: { fontSize: 11, color: C.border, fontWeight: "500" },
});
