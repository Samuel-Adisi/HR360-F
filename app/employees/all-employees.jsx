import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Clipboard,
  Image,
  Linking,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─────────────────────────────────────────────────────────────
//  THEME
// ─────────────────────────────────────────────────────────────
const T = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  navy: "#0F172A",
  text: "#1E293B",
  textSub: "#475569",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  orange: "#F97316",
  blue: "#3B82F6",
  green: "#22C55E",
  red: "#EF4444",
  purple: "#8B5CF6",
  indigo: "#6366F1",
};

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────
const EMPLOYEES = [
  {
    id: "Emp-001",
    full_name: "Anthony Lewis",
    designation: "Finance Manager",
    department: "Finance",
    position: "Finance Manager",
    jobType: "Full-time",
    email: "anthony@example.com",
    phone: "+1 555-0101",
    status: "Active",
    attendance: "Present",
    joinDate: "12/01/2023",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "Emp-002",
    full_name: "Brian Villalobos",
    designation: "Senior Developer",
    department: "Engineering",
    position: "Senior Developer",
    jobType: "Full-time",
    email: "brian@example.com",
    phone: "+1 555-0102",
    status: "Active",
    attendance: "Present",
    joinDate: "03/15/2023",
    photo: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: "Emp-003",
    full_name: "Harvey Smith",
    designation: "Junior Developer",
    department: "Engineering",
    position: "Junior Developer",
    jobType: "Part-time",
    email: "harvey@example.com",
    phone: "+1 555-0103",
    status: "Active",
    attendance: "Absent",
    joinDate: "06/20/2023",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: "Emp-004",
    full_name: "Stephan Peralt",
    designation: "Operations Manager",
    department: "Operations",
    position: "Operations Manager",
    jobType: "Full-time",
    email: "stephan@example.com",
    phone: "+1 555-0104",
    status: "Active",
    attendance: "Present",
    joinDate: "09/05/2022",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: "Emp-005",
    full_name: "Doglas Martini",
    designation: "HR Manager",
    department: "HR",
    position: "HR Manager",
    jobType: "Contract",
    email: "doglas@example.com",
    phone: "+1 555-0105",
    status: "Inactive",
    attendance: "Absent",
    joinDate: "11/14/2022",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "Emp-006",
    full_name: "Priya Sharma",
    designation: "UI/UX Designer",
    department: "Design",
    position: "UI/UX Designer",
    jobType: "Full-time",
    email: "priya@example.com",
    phone: "+1 555-0106",
    status: "Active",
    attendance: "Present",
    joinDate: "02/28/2024",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "Emp-007",
    full_name: "Sofia Martinez",
    designation: "Marketing Lead",
    department: "Marketing",
    position: "Marketing Lead",
    jobType: "Full-time",
    email: "sofia@example.com",
    phone: "+1 555-0107",
    status: "Active",
    attendance: "Present",
    joinDate: "01/10/2024",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
  },
  {
    id: "Emp-008",
    full_name: "James Okafor",
    designation: "Accountant",
    department: "Finance",
    position: "Accountant",
    jobType: "Part-time",
    email: "james@example.com",
    phone: "+1 555-0108",
    status: "Active",
    attendance: "Absent",
    joinDate: "07/19/2023",
    photo: "https://randomuser.me/api/portraits/men/77.jpg",
  },
];

const DEPT_COLORS = {
  Finance: { accent: "#F97316", soft: "#FFF7ED", text: "#9A3412" },
  Engineering: { accent: "#3B82F6", soft: "#EFF6FF", text: "#1E40AF" },
  Operations: { accent: "#8B5CF6", soft: "#F5F3FF", text: "#5B21B6" },
  HR: { accent: "#EC4899", soft: "#FDF2F8", text: "#9D174D" },
  Design: { accent: "#10B981", soft: "#ECFDF5", text: "#065F46" },
  Marketing: { accent: "#F59E0B", soft: "#FFFBEB", text: "#92400E" },
};

// ─────────────────────────────────────────────────────────────
//  STAT SECTION — Dark hero + metric sub-cards
// ─────────────────────────────────────────────────────────────

const PERIOD_TABS = ["This Month", "Q1 2025", "2024"];

// Simple circular progress ring (no SVG)
const RingChart = ({
  pct = 75,
  size = 58,
  stroke = 7,
  color = "#60A5FA",
  label,
}) => {
  const inner = size - stroke * 2;
  return (
    <View style={{ alignItems: "center", gap: 5 }}>
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Track */}
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: "rgba(255,255,255,0.1)",
          }}
        />
        {/* Fill — quadrant approximation */}
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderTopColor: pct > 25 ? color : "transparent",
            borderRightColor: pct > 50 ? color : "transparent",
            borderBottomColor: pct > 75 ? color : "transparent",
            borderLeftColor: pct > 0 ? color : "transparent",
            transform: [{ rotate: `${pct * 3.6 - 90}deg` }],
          }}
        />
        <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>
          {pct}%
        </Text>
      </View>
      {label && (
        <Text
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.55)",
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

// The full stats widget: period tabs + dark hero + metric sub-cards
const StatsWidget = ({ employees }) => {
  const [activePeriod, setActivePeriod] = useState(0);

  const active = employees.filter((e) => e.status === "Active").length;
  const inactive = employees.filter((e) => e.status === "Inactive").length;
  const present = employees.filter((e) => e.attendance === "Present").length;
  const joiners = employees.filter((e) => e.joinDate?.endsWith("2024")).length;

  const METRIC_CARDS = [
    {
      value: `${active}`,
      unit: "emp",
      label: "Active",
      trend: "+2.1%",
      up: true,
    },
    {
      value: `${present}`,
      unit: "today",
      label: "Present",
      trend: "+12",
      up: true,
    },
    {
      value: `${inactive}`,
      unit: "emp",
      label: "Inactive",
      trend: "-3",
      up: false,
    },
    {
      value: `${joiners}`,
      unit: "new",
      label: "Joiners",
      trend: "+2",
      up: true,
    },
  ];

  return (
    <View style={sw.wrapper}>
      {/* ── Dark Hero Card ── */}
      <View style={sw.heroCard}>
        {/* Decorative blobs */}
        <View style={sw.blob1} />
        <View style={sw.blob2} />

        <View style={sw.heroInner}>
          {/* Left: score + trend */}
          <View style={sw.heroLeft}>
            <Text style={sw.heroEyebrow}>TOTAL EMPLOYEES</Text>
            <Text style={sw.heroScore}>
              {employees.length.toLocaleString()}
            </Text>
            <View style={sw.trendBadge}>
              <Ionicons name="trending-up" size={11} color="#4ADE80" />
              <Text style={sw.trendTxt}>+5.2% vs last period</Text>
            </View>
            <Text style={sw.heroSub}>
              Based on {employees.length} total employees
            </Text>
          </View>

          {/* Right: rings */}
          <View style={sw.heroRings}>
            <RingChart
              pct={Math.round((active / employees.length) * 100)}
              size={64}
              stroke={8}
              color="#60A5FA"
              label="Active"
            />
            <RingChart
              pct={Math.round((present / employees.length) * 100)}
              size={52}
              stroke={7}
              color="#4ADE80"
              label="Present"
            />
          </View>
        </View>
      </View>

      {/* ── Metric Sub-Cards ── */}
      <View style={sw.metricGrid}>
        {METRIC_CARDS.map((m) => (
          <View key={m.label} style={sw.metricCard}>
            <View style={sw.metricTop}>
              <View
                style={[
                  sw.metricTrend,
                  { backgroundColor: m.up ? "#ECFDF5" : "#FEF2F2" },
                ]}
              >
                <Ionicons
                  name={m.up ? "arrow-up" : "arrow-down"}
                  size={9}
                  color={m.up ? "#16A34A" : "#DC2626"}
                />
                <Text
                  style={[
                    sw.metricTrendTxt,
                    { color: m.up ? "#16A34A" : "#DC2626" },
                  ]}
                >
                  {m.trend}
                </Text>
              </View>
            </View>
            <View style={sw.metricValueRow}>
              <Text style={sw.metricValue}>{m.value}</Text>
              <Text style={sw.metricUnit}>{m.unit}</Text>
            </View>
            <Text style={sw.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

// Styles for the stats widget
const sw = StyleSheet.create({
  wrapper: { paddingHorizontal: 14, marginBottom: 14 },

  // Period tabs
  periodRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 9,
  },
  periodTabActive: {
    backgroundColor: "#4361EE",
    shadowColor: "#4361EE",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 4,
  },
  periodTxt: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  periodTxtActive: { color: "#fff", fontWeight: "800" },

  // Dark hero
  heroCard: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    overflow: "hidden",
    minHeight: 130,
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  blob1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#4361EE",
    opacity: 0.12,
    top: -60,
    right: -40,
  },
  blob2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#6366F1",
    opacity: 0.15,
    bottom: -30,
    left: 50,
  },
  heroInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: { flex: 1, gap: 5 },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.45)",
    letterSpacing: 1.4,
    marginBottom: 2,
  },
  heroScore: {
    fontSize: 46,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: -2,
    lineHeight: 50,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(74,222,128,0.15)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  trendTxt: { fontSize: 11, color: "#4ADE80", fontWeight: "700" },
  heroSub: { fontSize: 10, color: "rgba(255,255,255,0.4)", marginTop: 2 },
  heroRings: { alignItems: "center", gap: 10, paddingLeft: 12 },

  // Metric sub-cards
  metricGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  metricCard: {
    flex: 1,
    minWidth: "22%",
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 2,
  },
  metricTop: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: 4,
  },
  metricTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  metricTrendTxt: { fontSize: 9, fontWeight: "700" },
  metricValueRow: { flexDirection: "row", alignItems: "baseline", gap: 2 },
  metricValue: {
    fontSize: 22,
    fontWeight: "900",
    color: T.text,
    letterSpacing: -0.5,
  },
  metricUnit: { fontSize: 10, color: T.textMuted, fontWeight: "600" },
  metricLabel: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "600",
    marginTop: 1,
  },
});

const FILTER_TABS = ["All", "Present", "Absent"];

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
const copyToClipboard = (value, label) => {
  Clipboard.setString(value);
  Alert.alert("Copied", `${label} copied to clipboard.`);
};

const handleEmailPress = (email) => {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ["Send Email", "Copy Email", "Cancel"], cancelButtonIndex: 2 },
      (idx) => {
        if (idx === 0) Linking.openURL(`mailto:${email}`);
        if (idx === 1) copyToClipboard(email, "Email");
      },
    );
  } else {
    Alert.alert("Email", email, [
      { text: "Send Email", onPress: () => Linking.openURL(`mailto:${email}`) },
      { text: "Copy Email", onPress: () => copyToClipboard(email, "Email") },
      { text: "Cancel", style: "cancel" },
    ]);
  }
};

const handlePhonePress = (phone) => {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ["Call", "Copy Number", "Cancel"], cancelButtonIndex: 2 },
      (idx) => {
        if (idx === 0) Linking.openURL(`tel:${phone}`);
        if (idx === 1) copyToClipboard(phone, "Phone number");
      },
    );
  } else {
    Alert.alert("Phone", phone, [
      { text: "Call", onPress: () => Linking.openURL(`tel:${phone}`) },
      {
        text: "Copy Number",
        onPress: () => copyToClipboard(phone, "Phone number"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  }
};

// ─────────────────────────────────────────────────────────────
//  EMPLOYEE DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const EmployeeModal = ({ employee, onClose, onDelete }) => {
  if (!employee) return null;

  const dept = DEPT_COLORS[employee.department] || {
    accent: "#64748B",
    soft: "#F1F5F9",
    text: "#334155",
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Employee",
      `Are you sure you want to delete ${employee.full_name}? This action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete && onDelete(employee.id);
            onClose();
          },
        },
      ],
    );
  };

  const handleChat = () => {
    Alert.alert("Chat", `Opening chat with ${employee.full_name}...`);
  };

  const infoRows = [
    {
      icon: "id-card-outline",
      label: "Employee ID",
      value: employee.id,
      type: "plain",
    },
    {
      icon: "business-outline",
      label: "Department",
      value: employee.department,
      type: "plain",
    },
    {
      icon: "briefcase-outline",
      label: "Position",
      value: employee.position,
      type: "plain",
    },
    {
      icon: "layers-outline",
      label: "Job Type",
      value: employee.jobType,
      type: "plain",
    },
    {
      icon: "mail-outline",
      label: "Email",
      value: employee.email,
      type: "email",
    },
    {
      icon: "call-outline",
      label: "Phone",
      value: employee.phone,
      type: "phone",
    },
    {
      icon: "calendar-outline",
      label: "Join Date",
      value: employee.joinDate,
      type: "plain",
    },
  ];

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={em.overlay}>
        <View style={em.sheet}>
          <View style={em.handle} />

          <View style={em.header}>
            <Text style={em.title}>Employee Details</Text>
            <View style={em.headerActions}>
              <TouchableOpacity onPress={handleDelete} style={em.deleteBtn}>
                <Ionicons name="trash-outline" size={17} color={T.red} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={em.closeBtn}>
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[em.heroCard, { backgroundColor: dept.soft }]}>
              <View style={em.heroPhotoWrap}>
                <Image source={{ uri: employee.photo }} style={em.heroPhoto} />
                <View
                  style={[
                    em.heroDot,
                    {
                      backgroundColor:
                        employee.attendance === "Present" ? T.green : T.red,
                    },
                  ]}
                />
              </View>
              <Text style={em.heroName}>{employee.full_name}</Text>
              <Text style={[em.heroRole, { color: dept.text }]}>
                {employee.position}
              </Text>
              <View style={em.heroBadgeRow}>
                <View
                  style={[
                    em.heroBadge,
                    {
                      backgroundColor:
                        employee.status === "Active" ? "#DCFCE7" : "#FEE2E2",
                    },
                  ]}
                >
                  <View
                    style={[
                      em.dot4,
                      {
                        backgroundColor:
                          employee.status === "Active" ? "#16A34A" : "#DC2626",
                      },
                    ]}
                  />
                  <Text
                    style={[
                      em.heroBadgeText,
                      {
                        color:
                          employee.status === "Active" ? "#166534" : "#991B1B",
                      },
                    ]}
                  >
                    {employee.status}
                  </Text>
                </View>
                <View
                  style={[
                    em.heroBadge,
                    {
                      backgroundColor:
                        employee.attendance === "Present"
                          ? "#DCFCE7"
                          : "#FEE2E2",
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      employee.attendance === "Present" ? "checkmark" : "close"
                    }
                    size={10}
                    color={
                      employee.attendance === "Present" ? "#166534" : "#991B1B"
                    }
                  />
                  <Text
                    style={[
                      em.heroBadgeText,
                      {
                        color:
                          employee.attendance === "Present"
                            ? "#166534"
                            : "#991B1B",
                      },
                    ]}
                  >
                    {employee.attendance}
                  </Text>
                </View>
                <View style={[em.heroBadge, { backgroundColor: "#EFF6FF" }]}>
                  <Ionicons name="layers-outline" size={10} color="#1E40AF" />
                  <Text style={[em.heroBadgeText, { color: "#1E40AF" }]}>
                    {employee.jobType}
                  </Text>
                </View>
              </View>
            </View>

            <View style={em.infoSection}>
              {infoRows.map(({ icon, label, value, type }) => {
                const isInteractive = type === "email" || type === "phone";
                return (
                  <TouchableOpacity
                    key={label}
                    style={em.infoRow}
                    onPress={
                      isInteractive
                        ? () =>
                            type === "email"
                              ? handleEmailPress(value)
                              : handlePhonePress(value)
                        : undefined
                    }
                    onLongPress={
                      isInteractive
                        ? () => copyToClipboard(value, label)
                        : undefined
                    }
                    activeOpacity={isInteractive ? 0.6 : 1}
                    delayLongPress={400}
                  >
                    <View
                      style={[
                        em.infoIconWrap,
                        type === "email" && { backgroundColor: "#EFF6FF" },
                        type === "phone" && { backgroundColor: "#F0FDF4" },
                      ]}
                    >
                      <Ionicons
                        name={icon}
                        size={15}
                        color={
                          type === "email"
                            ? T.blue
                            : type === "phone"
                              ? T.green
                              : "#64748B"
                        }
                      />
                    </View>
                    <View style={em.infoContent}>
                      <Text style={em.infoLabel}>{label}</Text>
                      <Text
                        style={[
                          em.infoValue,
                          type === "email" && { color: T.blue },
                          type === "phone" && { color: T.green },
                        ]}
                      >
                        {value}
                      </Text>
                    </View>
                    {isInteractive && (
                      <View style={em.infoActionHint}>
                        <Ionicons
                          name={
                            type === "email" ? "open-outline" : "call-outline"
                          }
                          size={13}
                          color="#CBD5E1"
                        />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>

          <View style={em.footer}>
            <View style={em.footerBtnRow}>
              <TouchableOpacity style={em.editBtn} onPress={onClose}>
                <Ionicons name="create-outline" size={16} color="#fff" />
                <Text style={em.editBtnText}>Edit Employee</Text>
              </TouchableOpacity>
              <TouchableOpacity style={em.chatBtn} onPress={handleChat}>
                <Ionicons
                  name="chatbubble-ellipses-outline"
                  size={16}
                  color="#fff"
                />
                <Text style={em.chatBtnText}>Chat</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────
//  EMPLOYEE CARD  — clean shadow, no color strip
// ─────────────────────────────────────────────────────────────
const EmployeeCard = ({ emp, onPress }) => {
  const dept = DEPT_COLORS[emp.department] || {
    accent: "#64748B",
    soft: "#F1F5F9",
    text: "#334155",
  };
  const isPresent = emp.attendance === "Present";

  return (
    <TouchableOpacity
      style={c.card}
      onPress={() => onPress(emp)}
      activeOpacity={0.85}
    >
      {/* Attendance badge */}
      <View
        style={[
          c.attendanceBadge,
          { backgroundColor: isPresent ? "#DCFCE7" : "#FEE2E2" },
        ]}
      >
        <View
          style={[
            c.attendanceDot,
            { backgroundColor: isPresent ? "#16A34A" : "#DC2626" },
          ]}
        />
        <Text
          style={[
            c.attendanceText,
            { color: isPresent ? "#166534" : "#991B1B" },
          ]}
        >
          {emp.attendance}
        </Text>
      </View>

      {/* Avatar */}
      <View style={c.avatarWrap}>
        <Image source={{ uri: emp.photo }} style={c.avatar} />
        <View
          style={[
            c.statusRing,
            { borderColor: emp.status === "Active" ? T.green : T.red },
          ]}
        />
      </View>

      <Text style={c.name} numberOfLines={1}>
        {emp.full_name}
      </Text>
      <Text style={c.position} numberOfLines={1}>
        {emp.position}
      </Text>

      {/* Department pill */}
      <View style={[c.deptPill, { backgroundColor: dept.soft }]}>
        <View style={[c.deptDot, { backgroundColor: dept.accent }]} />
        <Text style={[c.deptText, { color: dept.text }]}>{emp.department}</Text>
      </View>

      {/* Job type pill */}
      <View style={c.jobTypePill}>
        <Text style={c.jobTypeText}>{emp.jobType}</Text>
      </View>

      <View style={c.cardFooter}>
        <Text style={c.empId}>{emp.id}</Text>
        <TouchableOpacity style={c.viewBtn} onPress={() => onPress(emp)}>
          <Ionicons name="eye-outline" size={13} color={T.blue} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function EmployeeScreen({ navigation }) {
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  const filtered = useMemo(() => {
    let list = EMPLOYEES;
    if (activeFilter !== "All")
      list = list.filter((e) => e.attendance === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.full_name.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.position.toLowerCase().includes(q) ||
          e.jobType.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeFilter, search]);

  const handleDelete = (id) => {
    console.log("Delete employee:", id);
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Title Row ── */}
        <View style={s.titleRow}>
          <View>
            <Text style={s.pageTitle}>Employees</Text>
            <Text style={s.pageSubtitle}>{EMPLOYEES.length} total members</Text>
          </View>
          <TouchableOpacity
            style={s.addBtn}
            onPress={() => router.push("./add-employee")}
          >
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={s.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* ── DARK HERO STATS WIDGET ── */}
        <StatsWidget employees={EMPLOYEES} />

        {/* ── Search Bar ── */}
        <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
          <Ionicons
            name="search-outline"
            size={16}
            color={searchFocused ? T.blue : "#94A3B8"}
          />
          <TextInput
            style={s.searchInput}
            placeholder="Search by name, position, department, job type…"
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Search hint chips */}
        {!search && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.hintChips}
          >
            {[
              "Engineering",
              "Finance",
              "Design",
              "Full-time",
              "Part-time",
              "Contract",
            ].map((chip) => (
              <TouchableOpacity
                key={chip}
                style={s.hintChip}
                onPress={() => setSearch(chip)}
              >
                <Text style={s.hintChipText}>{chip}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}

        {/* ── Filter Row ── */}
        <View style={s.filterRow}>
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[s.filterTab, activeFilter === tab && s.filterTabActive]}
              onPress={() => setActiveFilter(tab)}
            >
              <Text
                style={[
                  s.filterTabText,
                  activeFilter === tab && s.filterTabTextActive,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={s.exportBtn}>
            <Ionicons name="download-outline" size={14} color="#334155" />
            <Text style={s.exportText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* ── Results label ── */}
        {search.trim() !== "" && (
          <Text style={s.resultsLabel}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""} for "
            {search}"
          </Text>
        )}

        {/* ── Grid ── */}
        <View style={s.grid}>
          {filtered.length > 0 ? (
            filtered.map((emp) => (
              <EmployeeCard
                key={emp.id}
                emp={emp}
                onPress={setSelectedEmployee}
              />
            ))
          ) : (
            <View style={s.empty}>
              <Ionicons name="people-outline" size={48} color="#CBD5E1" />
              <Text style={s.emptyText}>No employees found</Text>
              <Text style={s.emptySubText}>
                Try a different name, department or job type
              </Text>
            </View>
          )}
        </View>
        <View style={{ height: 32 }} />
      </ScrollView>

      <EmployeeModal
        employee={selectedEmployee}
        onClose={() => setSelectedEmployee(null)}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  CARD STYLES — clean shadow, no top strip
// ─────────────────────────────────────────────────────────────
const c = StyleSheet.create({
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 14,
    paddingTop: 14,
    alignItems: "center",
    // Clean layered shadow — no color border strip
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#F1F5F9",
    position: "relative",
  },
  attendanceBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  attendanceDot: { width: 5, height: 5, borderRadius: 3 },
  attendanceText: { fontSize: 9, fontWeight: "700" },
  avatarWrap: { position: "relative", marginBottom: 10, marginTop: 4 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: "#E2E8F0",
  },
  statusRing: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    backgroundColor: "#fff",
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: "#1E293B",
    textAlign: "center",
    marginBottom: 2,
  },
  position: {
    fontSize: 11,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 8,
  },
  deptPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 5,
  },
  deptDot: { width: 5, height: 5, borderRadius: 3 },
  deptText: { fontSize: 10, fontWeight: "700" },
  jobTypePill: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    marginBottom: 10,
  },
  jobTypeText: { fontSize: 9, fontWeight: "600", color: "#64748B" },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 8,
  },
  empId: { fontSize: 10, color: T.blue, fontWeight: "700" },
  viewBtn: {
    width: 24,
    height: 24,
    borderRadius: 6,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─────────────────────────────────────────────────────────────
//  MODAL STYLES
// ─────────────────────────────────────────────────────────────
const em = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    paddingBottom: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: { fontSize: 17, fontWeight: "700", color: "#1E293B" },
  headerActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  heroPhotoWrap: { position: "relative", marginBottom: 4 },
  heroPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  heroDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#fff",
  },
  heroName: { fontSize: 18, fontWeight: "800", color: "#1E293B" },
  heroRole: { fontSize: 13, fontWeight: "500" },
  heroBadgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  dot4: { width: 4, height: 4, borderRadius: 2 },
  heroBadgeText: { fontSize: 11, fontWeight: "700" },
  infoSection: { paddingHorizontal: 20, gap: 4 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: { fontSize: 13, color: "#1E293B", fontWeight: "600" },
  infoActionHint: {
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerBtnRow: { flexDirection: "row", gap: 10 },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: T.orange,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  editBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  chatBtn: {
    flex: 0.55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: T.blue,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  chatBtnText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerLogo: { flexDirection: "row", alignItems: "center", gap: 6 },
  logoCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#FFF7ED",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { fontSize: 15, fontWeight: "800", color: "#1E293B" },
  headerAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },
  headerAvatarImg: { width: "100%", height: "100%" },
  scroll: { flex: 1 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: "#1E293B" },
  pageSubtitle: { fontSize: 12, color: "#94A3B8", marginTop: 2 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: T.orange,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 14,
    marginBottom: 8,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  searchFocused: {
    borderColor: T.blue,
    shadowColor: T.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: "#1E293B" },

  // Hint chips
  hintChips: {
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 10,
  },
  hintChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
  },
  hintChipText: { fontSize: 11, fontWeight: "600", color: "#475569" },

  // Filter
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 14,
  },
  filterTab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterTabActive: { backgroundColor: T.blue, borderColor: T.blue },
  filterTabText: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  filterTabTextActive: { color: "#fff" },
  exportBtn: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#fff",
  },
  exportText: { fontSize: 12, fontWeight: "600", color: "#334155" },

  // Results
  resultsLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 14,
    gap: 12,
    justifyContent: "space-between",
  },
  empty: { width: "100%", padding: 48, alignItems: "center", gap: 8 },
  emptyText: { fontSize: 14, color: "#94A3B8", fontWeight: "700" },
  emptySubText: { fontSize: 12, color: "#CBD5E1", textAlign: "center" },
});
