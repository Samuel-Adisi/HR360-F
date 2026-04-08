import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ArrowRightOnRectangleIcon,
  BanknotesIcon,
  BellIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  EnvelopeIcon,
  IdentificationIcon,
  LockClosedIcon,
  PencilSquareIcon,
  PhoneIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  UserGroupIcon
} from "react-native-heroicons/outline";
import { ProfileHeaderTitle } from "./_layout";

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
  greenText: "#15803D",
  red: "#DC2626",
  redBg: "#FEE2E2",
  redText: "#B91C1C",
  amber: "#D97706",
  amberBg: "#FEF3C7",
  amberText: "#92400E",
  blue: "#0A66C2",
  blueBg: "#EFF6FF",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  orange: "#F97316",
  orangeBg: "#FFF7ED",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getAvatarUri(nameHint, uriFromStorage) {
  if (uriFromStorage) return uriFromStorage;
  return `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(
    nameHint || "U",
  )}&backgroundColor=0F766E&textColor=ffffff&fontSize=38`;
}

// Solid square icon — exactly like employee detail screen
function IconSquare({ icon: Icon, color, size = 34 }) {
  return (
    <View
      style={[
        p.iconSquare,
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

// ─── Sub-components ───────────────────────────────────────────────────────────
function GroupLabel({ title }) {
  return <Text style={p.groupLabel}>{title}</Text>;
}

function InfoRow({ icon: Icon, iconColor, label, value, last }) {
  return (
    <>
      <View style={p.row}>
        <IconSquare icon={Icon} color={iconColor} size={34} />
        <View style={p.rowTexts}>
          <Text style={p.rowLabel}>{label}</Text>
          <Text style={p.rowValue} numberOfLines={1}>
            {value || "—"}
          </Text>
        </View>
      </View>
      {!last && <View style={p.rowDivider} />}
    </>
  );
}

function NavRow({
  icon: Icon,
  iconColor,
  title,
  subtitle,
  onPress,
  isDestructive,
  rightLabel,
  last,
}) {
  return (
    <>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          p.row,
          pressed && { backgroundColor: C.divider },
        ]}
      >
        <IconSquare
          icon={Icon}
          color={isDestructive ? C.red : iconColor}
          size={34}
        />
        <View style={p.rowTexts}>
          <Text style={[p.rowTitle, isDestructive && { color: C.red }]}>
            {title}
          </Text>
          {subtitle ? <Text style={p.rowSubtitle}>{subtitle}</Text> : null}
        </View>
        {isDestructive ? null : (
          <View style={p.rowRight}>
            {rightLabel ? (
              <Text style={p.rowRightLabel}>{rightLabel}</Text>
            ) : null}
            <ChevronRightIcon size={16} color={C.muted} strokeWidth={2.5} />
          </View>
        )}
      </Pressable>
      {!last && <View style={p.rowDivider} />}
    </>
  );
}

function Card({ children }) {
  return <View style={p.card}>{children}</View>;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileHome() {
  const navigation = useNavigation();

  const [username, setUsername] = useState("Kwame Asante");
  const [avatarUri, setAvatarUri] = useState(null);
  const [email, setEmail] = useState("kwame.asante@hr360.io");
  const [role, setRole] = useState("Lead Backend Engineer");
  const [phone, setPhone] = useState("+233 24 567 8901");
  const [department, setDepartment] = useState("Engineering");
  const [employeeId, setEmployeeId] = useState("EMP-0001");
  const [hireDate, setHireDate] = useState("2021-03-08");

  const loadUser = useCallback(async () => {
    try {
      const name = await AsyncStorage.getItem("username");
      if (name) setUsername(name);
      const raw = await AsyncStorage.getItem("user");
      if (raw) {
        const u = JSON.parse(raw);
        const pic = u.avatar || u.photo || u.profile_picture || null;
        setAvatarUri(typeof pic === "string" && pic.length ? pic : null);
        if (u.email) setEmail(u.email);
        if (u.role || u.position) setRole(u.role || u.position);
        if (u.phone) setPhone(u.phone);
        if (u.department?.name || u.department)
          setDepartment(u.department?.name || u.department);
        if (u.employee_id) setEmployeeId(u.employee_id);
        if (u.hire_date) setHireDate(u.hire_date);
      }
    } catch {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser]),
  );

  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        headerTitle: () => <ProfileHeaderTitle name={username} role={role} />,
      });
    }, [username, role]),
  );

  const mock = (action) =>
    Alert.alert("Coming soon", `${action} will be available shortly.`);

  const confirmSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to end your session?", [
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

  const avatarSource = { uri: getAvatarUri(username, avatarUri) };

  return (
    <View style={p.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={p.scroll}
      >
        {/* ── Hero — WhatsApp style: large centered avatar + name + role ── */}
        <View style={p.hero}>
          <View style={p.avatarWrap}>
            <Image source={avatarSource} style={p.avatar} resizeMode="cover" />
            <Pressable
              style={p.editPhotoBtn}
              onPress={() => mock("Change photo")}
            >
              <PencilSquareIcon size={13} color={C.white} strokeWidth={2.5} />
            </Pressable>
          </View>

          <Text style={p.heroName}>{username}</Text>

          <Text style={p.heroRole}>{role}</Text>

          {/* Employee ID + dept chips — like WhatsApp's bio line */}
          <View style={p.heroBioRow}>
            <View style={p.bioChip}>
              <IdentificationIcon size={11} color={C.sub} strokeWidth={2.5} />
              <Text style={p.bioChipText}>{employeeId}</Text>
            </View>
            <View style={p.bioDot} />
            <View style={p.bioChip}>
              <BuildingOffice2Icon size={11} color={C.sub} strokeWidth={2.5} />
              <Text style={p.bioChipText}>{department}</Text>
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [p.editBtn, pressed && { opacity: 0.8 }]}
            onPress={() => mock("Edit Profile")}
          >
            <PencilSquareIcon size={14} color={C.accent} strokeWidth={2.5} />
            <Text style={p.editBtnText}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* ── Personal Details ── */}
        <GroupLabel title="Personal Details" />
        <Card>
          <InfoRow
            icon={EnvelopeIcon}
            iconColor={C.blue}
            label="Email Address"
            value={email}
          />
          <InfoRow
            icon={PhoneIcon}
            iconColor={C.green}
            label="Phone Number"
            value={phone}
          />
          <InfoRow
            icon={BuildingOffice2Icon}
            iconColor={C.accent}
            label="Department"
            value={department}
          />
          <InfoRow
            icon={IdentificationIcon}
            iconColor={C.purple}
            label="Employee ID"
            value={employeeId}
          />
          <InfoRow
            icon={CalendarDaysIcon}
            iconColor={C.amber}
            label="Hire Date"
            value={hireDate}
            last
          />
        </Card>

        {/* ── Account ── */}
        <GroupLabel title="Account" />
        <Card>
          <NavRow
            icon={UserGroupIcon}
            iconColor={C.accent}
            title="Personal Information"
            subtitle="Update your name, photo & bio"
            onPress={() => mock("Personal Info")}
          />
          <NavRow
            icon={BellIcon}
            iconColor={C.orange}
            title="Notifications"
            subtitle="Manage push & email alerts"
            onPress={() => mock("Notifications")}
          />
          <NavRow
            icon={BanknotesIcon}
            iconColor={C.green}
            title="Payroll & Compensation"
            subtitle="View salary & payment details"
            onPress={() => mock("Payroll")}
            last
          />
        </Card>

        {/* ── Security ── */}
        <GroupLabel title="Security" />
        <Card>
          <NavRow
            icon={LockClosedIcon}
            iconColor={C.purple}
            title="Change Password"
            subtitle="Update your login credentials"
            onPress={() => mock("Change Password")}
          />
          <NavRow
            icon={ShieldCheckIcon}
            iconColor={C.green}
            title="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            rightLabel="Off"
            onPress={() => mock("2FA")}
          />
          <NavRow
            icon={ShieldCheckIcon}
            iconColor={C.blue}
            title="Biometric Login"
            subtitle="Face ID / Touch ID"
            rightLabel="On"
            onPress={() => mock("Biometrics")}
            last
          />
        </Card>

        {/* ── App ── */}
        <GroupLabel title="App" />
        <Card>
          <NavRow
            icon={Cog6ToothIcon}
            iconColor={C.slate}
            title="Settings"
            subtitle="Appearance, language & more"
            onPress={() => router.push("/profile/settings")}
          />
          <NavRow
            icon={QuestionMarkCircleIcon}
            iconColor={C.blue}
            title="Help & Support"
            subtitle="FAQs and contact support"
            onPress={() => mock("Help Center")}
            last
          />
        </Card>

        {/* ── Sign Out ── */}
        <GroupLabel title="" />
        <Card>
          <NavRow
            icon={ArrowRightOnRectangleIcon}
            title="Sign Out"
            subtitle="End your current session"
            onPress={confirmSignOut}
            isDestructive
            last
          />
        </Card>

        <View style={p.appInfo}>
          <Text style={p.appVersion}>HR360 · Version 1.0.0</Text>
          <Text style={p.appCopyright}>© 2026 HR360. All rights reserved.</Text>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const p = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },

  // Hero — WhatsApp style
  hero: {
    backgroundColor: C.white,
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 24,
  },
  avatarWrap: {
    position: "relative",
    marginBottom: 14,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: C.divider,
  },
  editPhotoBtn: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: C.white,
  },
  heroName: {
    fontSize: 22,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroRole: {
    fontSize: 14,
    fontWeight: "500",
    color: C.sub,
    marginBottom: 12,
  },
  heroBioRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 18,
  },
  bioChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  bioChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: C.sub,
  },
  bioDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: C.muted,
  },
  editBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: C.accentLight,
    borderWidth: 1,
    borderColor: C.accentMid,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.accent,
  },

  // Group label — like WhatsApp's "Settings" grey label
  groupLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.sub,
    marginHorizontal: 20,
    marginBottom: 8,
    marginTop: 4,
  },

  // Card
  card: {
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
    marginBottom: 24,
  },

  // Row divider — starts after icon, like WhatsApp
  rowDivider: {
    height: 1,
    backgroundColor: C.divider,
    marginLeft: 62,
  },

  // Shared row layout
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 14,
  },
  rowTexts: { flex: 1 },
  rowLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  rowValue: {
    fontSize: 14,
    fontWeight: "600",
    color: C.navy,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: C.navy,
  },
  rowSubtitle: {
    fontSize: 12,
    fontWeight: "500",
    color: C.muted,
    marginTop: 2,
  },
  rowRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rowRightLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: C.muted,
  },

  // Icon square — solid fill, exactly like employee detail
  iconSquare: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // App footer
  appInfo: {
    alignItems: "center",
    marginTop: 8,
    gap: 3,
  },
  appVersion: { fontSize: 12, color: C.muted, fontWeight: "500" },
  appCopyright: { fontSize: 11, color: C.border, fontWeight: "500" },
});
