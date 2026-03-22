import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
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
  blue: "#0A66C2",
  blueSoft: "#EFF6FF",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  amber: "#D97706",
  amberSoft: "#FEF3C7",
  purple: "#7C3AED",
  purpleSoft: "#EDE9FE",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA — 2 departments only
// ─────────────────────────────────────────────────────────────
const INITIAL_DEPARTMENTS = [
  {
    id: "DEPT-001",
    name: "Engineering",
    code: "ENG",
    head: "Brian Villalobos",
    head_title: "Engineering Director",
    head_photo: "https://randomuser.me/api/portraits/men/44.jpg",
    employees: 12,
    active: 11,
    on_leave: 1,
    location: "Floor 3, Block A",
    email: "engineering@smarthr.com",
    phone: "+1 (555) 201-3344",
    description:
      "Responsible for all software development, infrastructure, and technical architecture across the company.",
    established: "Jan 2019",
    status: "active",
    openRoles: 2,
    members: [
      {
        name: "Brian Villalobos",
        role: "Engineering Director",
        photo: "https://randomuser.me/api/portraits/men/44.jpg",
      },
      {
        name: "Harvey Smith",
        role: "Junior Developer",
        photo: "https://randomuser.me/api/portraits/men/55.jpg",
      },
      {
        name: "Kevin Osei",
        role: "DevOps Engineer",
        photo: "https://randomuser.me/api/portraits/men/62.jpg",
      },
    ],
  },
  {
    id: "DEPT-002",
    name: "Human Resources",
    code: "HR",
    head: "Doglas Martini",
    head_title: "HR Manager",
    head_photo: "https://randomuser.me/api/portraits/men/22.jpg",
    employees: 5,
    active: 5,
    on_leave: 0,
    location: "Floor 1, Block A",
    email: "hr@smarthr.com",
    phone: "+1 (555) 201-1100",
    description:
      "Manages all people operations including recruitment, onboarding, employee relations, and learning & development.",
    established: "Jan 2019",
    status: "active",
    openRoles: 0,
    members: [
      {
        name: "Doglas Martini",
        role: "HR Manager",
        photo: "https://randomuser.me/api/portraits/men/22.jpg",
      },
      {
        name: "Aisha Kamara",
        role: "HR Coordinator",
        photo: "https://randomuser.me/api/portraits/women/28.jpg",
      },
    ],
  },
];

const EMPLOYEES_LIST = [
  {
    id: "Emp-001",
    name: "Anthony Lewis",
    position: "Finance Manager",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "Emp-002",
    name: "Brian Villalobos",
    position: "Senior Developer",
    photo: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: "Emp-003",
    name: "Harvey Smith",
    position: "Junior Developer",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: "Emp-004",
    name: "Stephan Peralt",
    position: "Operations Manager",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: "Emp-005",
    name: "Doglas Martini",
    position: "HR Manager",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "Emp-006",
    name: "Priya Sharma",
    position: "UI/UX Designer",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "Emp-007",
    name: "Sofia Martinez",
    position: "Marketing Lead",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
  },
];

const LOCATIONS = [
  "Floor 1, Block A",
  "Floor 1, Block B",
  "Floor 2, Block A",
  "Floor 2, Block B",
  "Floor 3, Block A",
  "Floor 3, Block C",
  "Floor 4, Block A",
  "Floor 5, Block B",
  "Remote",
];

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
const AVATAR_COLORS = [
  "#0A66C2",
  "#7C3AED",
  "#16A34A",
  "#D97706",
  "#DC2626",
  "#0891B2",
  "#DB2777",
];
const avatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];
const Avatar = ({ photo, name, size = 40, fontSize = 13 }) =>
  photo ? (
    <Image
      source={{ uri: photo }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: T.border,
      }}
    />
  ) : (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: avatarColor(name),
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize, fontWeight: "800", color: "#fff" }}>
        {getInitials(name)}
      </Text>
    </View>
  );

// ─────────────────────────────────────────────────────────────
//  HERO WIDGET
// ─────────────────────────────────────────────────────────────
const HeroWidget = ({ departments }) => {
  const totalEmp = departments.reduce((s, d) => s + d.employees, 0);
  const openRoles = departments.reduce((s, d) => s + d.openRoles, 0);
  const active = departments.filter((d) => d.status === "active").length;

  return (
    <View style={hw.hero}>
      <View style={hw.blob1} />
      <View style={hw.blob2} />

      <View style={hw.topRow}>
        <View>
          <Text style={hw.eyebrow}>DEPARTMENTS OVERVIEW</Text>
          <Text style={hw.bigNum}>{departments.length}</Text>
          <Text style={hw.bigLabel}>Total Departments</Text>
        </View>
        <View style={hw.ring}>
          <Text style={hw.ringNum}>{active}</Text>
          <Text style={hw.ringLabel}>Active</Text>
        </View>
      </View>

      <View style={hw.metricsRow}>
        {[
          {
            val: totalEmp,
            label: "Employees",
            color: "#4ADE80",
            icon: "people-outline",
          },
          {
            val: openRoles,
            label: "Open Roles",
            color: "#FBBF24",
            icon: "briefcase-outline",
          },
          {
            val: active,
            label: "Active Depts",
            color: "#93C5FD",
            icon: "checkmark-circle-outline",
          },
        ].map((m, i) => (
          <React.Fragment key={m.label}>
            {i > 0 && <View style={hw.sep} />}
            <View style={hw.metricCell}>
              <Ionicons
                name={m.icon}
                size={13}
                color={m.color}
                style={{ marginBottom: 4 }}
              />
              <Text style={[hw.metricVal, { color: m.color }]}>{m.val}</Text>
              <Text style={hw.metricLabel}>{m.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const hw = StyleSheet.create({
  hero: {
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 14,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  blob1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: T.blue,
    opacity: 0.08,
    top: -70,
    right: -50,
  },
  blob2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: T.purple,
    opacity: 0.08,
    bottom: -50,
    left: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  bigNum: {
    fontSize: 52,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 56,
  },
  bigLabel: { fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  ringNum: { fontSize: 22, fontWeight: "900", color: "#fff" },
  ringLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metricsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  sep: { width: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  metricCell: { flex: 1, alignItems: "center" },
  metricVal: { fontSize: 18, fontWeight: "900" },
  metricLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.35)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 2,
  },
});

// ─────────────────────────────────────────────────────────────
//  DEPARTMENT CARD — clean, uniform blue accent
// ─────────────────────────────────────────────────────────────
const DeptCard = ({ item, onPress }) => (
  <TouchableOpacity
    style={dc.card}
    onPress={() => onPress(item)}
    activeOpacity={0.85}
  >
    <View style={dc.accentBar} />
    <View style={dc.inner}>
      {/* Top: icon + name + status */}
      <View style={dc.topRow}>
        <View style={dc.iconWrap}>
          <Ionicons name="business-outline" size={20} color={T.blue} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={dc.name}>{item.name}</Text>
          <View style={dc.codeRow}>
            <View style={dc.codePill}>
              <Text style={dc.codeTxt}>{item.code}</Text>
            </View>
            <View style={dc.statusDot} />
            <Text style={dc.statusTxt}>Active</Text>
          </View>
        </View>
        {item.openRoles > 0 && (
          <View style={dc.openBadge}>
            <Text style={dc.openBadgeTxt}>{item.openRoles} open</Text>
          </View>
        )}
      </View>

      {/* Head of dept */}
      <View style={dc.headRow}>
        <Avatar
          photo={item.head_photo}
          name={item.head}
          size={36}
          fontSize={11}
        />
        <View style={{ flex: 1 }}>
          <Text style={dc.headName}>{item.head}</Text>
          <Text style={dc.headTitle}>{item.head_title}</Text>
        </View>
        <View style={dc.headBadge}>
          <Ionicons name="ribbon-outline" size={10} color={T.blue} />
          <Text style={dc.headBadgeTxt}>Head</Text>
        </View>
      </View>

      {/* Stats grid */}
      <View style={dc.statGrid}>
        {[
          {
            val: item.employees,
            label: "Employees",
            icon: "people-outline",
            color: T.blue,
          },
          {
            val: item.active,
            label: "Active",
            icon: "checkmark-circle-outline",
            color: T.green,
          },
          {
            val: item.on_leave,
            label: "On Leave",
            icon: "time-outline",
            color: T.amber,
          },
        ].map((s, i) => (
          <React.Fragment key={s.label}>
            {i > 0 && <View style={dc.statSep} />}
            <View style={dc.statCell}>
              <View style={[dc.statIcon, { backgroundColor: s.color + "18" }]}>
                <Ionicons name={s.icon} size={11} color={s.color} />
              </View>
              <Text style={[dc.statVal, { color: s.color }]}>{s.val}</Text>
              <Text style={dc.statLabel}>{s.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>

      {/* Footer */}
      <View style={dc.footer}>
        <Ionicons name="location-outline" size={11} color={T.textMuted} />
        <Text style={dc.locationTxt}>{item.location}</Text>
        <View style={dc.viewBtn}>
          <Text style={dc.viewTxt}>View Details</Text>
          <Ionicons name="chevron-forward" size={12} color={T.blue} />
        </View>
      </View>
    </View>
  </TouchableOpacity>
);

const dc = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  accentBar: { width: 5, backgroundColor: T.blue },
  inner: { flex: 1, padding: 14, gap: 11 },
  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  iconWrap: {
    width: 46,
    height: 46,
    borderRadius: 13,
    backgroundColor: T.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 15, fontWeight: "800", color: T.text, marginBottom: 4 },
  codeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  codePill: {
    backgroundColor: T.blueSoft,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  codeTxt: {
    fontSize: 10,
    fontWeight: "800",
    color: T.blue,
    letterSpacing: 0.5,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.green },
  statusTxt: { fontSize: 10, color: T.textMuted, fontWeight: "600" },
  openBadge: {
    backgroundColor: T.amberSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  openBadgeTxt: { fontSize: 10, fontWeight: "800", color: T.amber },
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 10,
  },
  headName: { fontSize: 12, fontWeight: "700", color: T.text },
  headTitle: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  headBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: T.blueSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 20,
  },
  headBadgeTxt: { fontSize: 9, fontWeight: "700", color: T.blue },
  statGrid: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
    backgroundColor: T.bg,
  },
  statSep: { width: 1, backgroundColor: T.border },
  statCell: { flex: 1, alignItems: "center", paddingVertical: 10, gap: 3 },
  statIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  statVal: { fontSize: 17, fontWeight: "900", color: T.text },
  statLabel: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  locationTxt: { flex: 1, fontSize: 10, color: T.textMuted },
  viewBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
  viewTxt: { fontSize: 12, fontWeight: "700", color: T.blue },
});

// ─────────────────────────────────────────────────────────────
//  DEPARTMENT DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const DeptDetailModal = ({ item, onClose }) => {
  if (!item) return null;
  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={dm.overlay}>
        <View style={dm.sheet}>
          <View style={dm.handle} />
          <View style={dm.header}>
            <View style={dm.headerIcon}>
              <Ionicons name="business-outline" size={18} color={T.blue} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={dm.headerTitle}>{item.name}</Text>
              <View style={dm.codePill}>
                <Text style={dm.codeTxt}>{item.code}</Text>
              </View>
            </View>
            <TouchableOpacity style={dm.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color={T.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Blue band */}
            <View style={dm.band}>
              <View style={dm.bandBlob} />
              <Text style={dm.bandDesc}>{item.description}</Text>
              <View style={dm.bandMeta}>
                <View style={dm.bandMetaItem}>
                  <Ionicons
                    name="calendar-outline"
                    size={11}
                    color="rgba(255,255,255,0.6)"
                  />
                  <Text style={dm.bandMetaTxt}>Est. {item.established}</Text>
                </View>
                <View style={dm.bandMetaItem}>
                  <Ionicons
                    name="location-outline"
                    size={11}
                    color="rgba(255,255,255,0.6)"
                  />
                  <Text style={dm.bandMetaTxt}>{item.location}</Text>
                </View>
              </View>
            </View>

            {/* Stat tiles */}
            <View style={dm.statRow}>
              {[
                {
                  val: item.employees,
                  label: "Total",
                  color: T.blue,
                  icon: "people-outline",
                },
                {
                  val: item.active,
                  label: "Active",
                  color: T.green,
                  icon: "checkmark-circle-outline",
                },
                {
                  val: item.on_leave,
                  label: "On Leave",
                  color: T.amber,
                  icon: "time-outline",
                },
                {
                  val: item.openRoles,
                  label: "Open",
                  color: T.purple,
                  icon: "briefcase-outline",
                },
              ].map((s) => (
                <View key={s.label} style={dm.statCell}>
                  <View
                    style={[dm.statIcon, { backgroundColor: s.color + "15" }]}
                  >
                    <Ionicons name={s.icon} size={13} color={s.color} />
                  </View>
                  <Text style={[dm.statVal, { color: s.color }]}>{s.val}</Text>
                  <Text style={dm.statLabel}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Head */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Department Head</Text>
              <View style={dm.headCard}>
                <Avatar
                  photo={item.head_photo}
                  name={item.head}
                  size={46}
                  fontSize={14}
                />
                <View style={{ flex: 1 }}>
                  <Text style={dm.headName}>{item.head}</Text>
                  <Text style={dm.headRole}>{item.head_title}</Text>
                </View>
                <TouchableOpacity style={dm.msgBtn}>
                  <Ionicons
                    name="chatbubble-outline"
                    size={14}
                    color={T.blue}
                  />
                  <Text style={dm.msgTxt}>Message</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Contact */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Contact Info</Text>
              {[
                { icon: "mail-outline", label: "Email", val: item.email },
                { icon: "call-outline", label: "Phone", val: item.phone },
                {
                  icon: "location-outline",
                  label: "Office",
                  val: item.location,
                },
              ].map((c) => (
                <View key={c.label} style={dm.contactRow}>
                  <View style={dm.contactIcon}>
                    <Ionicons name={c.icon} size={14} color={T.textMuted} />
                  </View>
                  <View>
                    <Text style={dm.contactLabel}>{c.label}</Text>
                    <Text style={dm.contactVal}>{c.val}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Team */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Team Members</Text>
              {item.members.map((m, i) => (
                <View
                  key={m.name}
                  style={[
                    dm.memberRow,
                    i < item.members.length - 1 && dm.memberBorder,
                  ]}
                >
                  <Avatar
                    photo={m.photo}
                    name={m.name}
                    size={40}
                    fontSize={12}
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={dm.memberName}>{m.name}</Text>
                    <Text style={dm.memberRole}>{m.role}</Text>
                  </View>
                  <TouchableOpacity style={dm.profileBtn}>
                    <Text style={dm.profileTxt}>Profile</Text>
                    <Ionicons name="chevron-forward" size={11} color={T.blue} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={{ height: 8 }} />
          </ScrollView>

          <View style={dm.footer}>
            <TouchableOpacity style={dm.closeFooter} onPress={onClose}>
              <Text style={dm.closeFooterTxt}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={dm.editBtn}>
              <Ionicons name="create-outline" size={15} color="#fff" />
              <Text style={dm.editTxt}>Edit Department</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const dm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: "94%",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800", color: T.text },
  codePill: {
    alignSelf: "flex-start",
    backgroundColor: T.blueSoft,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 3,
  },
  codeTxt: {
    fontSize: 10,
    fontWeight: "800",
    color: T.blue,
    letterSpacing: 0.5,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  band: {
    backgroundColor: T.blue,
    margin: 16,
    borderRadius: 16,
    padding: 18,
    overflow: "hidden",
    position: "relative",
  },
  bandBlob: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(0,0,0,0.1)",
    top: -60,
    right: -40,
  },
  bandDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.88)",
    lineHeight: 20,
    marginBottom: 12,
    fontWeight: "500",
  },
  bandMeta: { flexDirection: "row", gap: 14, flexWrap: "wrap" },
  bandMetaItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  bandMetaTxt: {
    fontSize: 11,
    color: "rgba(255,255,255,0.65)",
    fontWeight: "600",
  },
  statRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 4,
  },
  statCell: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    padding: 10,
    alignItems: "center",
    gap: 4,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  statVal: { fontSize: 20, fontWeight: "900" },
  statLabel: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  section: { paddingHorizontal: 16, marginTop: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  headCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: T.bg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  headName: { fontSize: 14, fontWeight: "700", color: T.text },
  headRole: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  msgBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: T.blueSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  msgTxt: { fontSize: 11, fontWeight: "700", color: T.blue },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  contactIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  contactLabel: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "500",
    marginBottom: 2,
  },
  contactVal: { fontSize: 13, color: T.text, fontWeight: "600" },
  memberRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 11,
  },
  memberBorder: { borderBottomWidth: 1, borderBottomColor: "#F8FAFC" },
  memberName: { fontSize: 13, fontWeight: "700", color: T.text },
  memberRole: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  profileBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
  profileTxt: { fontSize: 11, fontWeight: "700", color: T.blue },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  closeFooter: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: "center",
  },
  closeFooterTxt: { fontSize: 13, fontWeight: "700", color: T.textSub },
  editBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: T.blue,
    paddingVertical: 13,
    borderRadius: 12,
  },
  editTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  ADD DEPARTMENT MODAL — simple form
// ─────────────────────────────────────────────────────────────
const EmployeePickerSheet = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = EMPLOYEES_LIST.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={ep.wrap}>
      <Text style={ep.label}>
        Department Head <Text style={{ color: T.red }}>*</Text>
      </Text>
      <TouchableOpacity
        style={[ep.trigger, selected && ep.triggerSelected]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        {selected ? (
          <>
            <Avatar
              photo={selected.photo}
              name={selected.name}
              size={30}
              fontSize={9}
            />
            <View style={{ flex: 1 }}>
              <Text style={ep.selName}>{selected.name}</Text>
              <Text style={ep.selRole}>{selected.position}</Text>
            </View>
          </>
        ) : (
          <>
            <Ionicons name="person-outline" size={15} color={T.textMuted} />
            <Text style={ep.placeholder}>Select employee…</Text>
          </>
        )}
        <Ionicons name="chevron-down" size={14} color={T.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={ep.overlay}>
          <View style={ep.sheet}>
            <View style={ep.handle} />
            <View style={ep.sheetHeader}>
              <Text style={ep.sheetTitle}>Select Department Head</Text>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={ep.closeBtn}
              >
                <Ionicons name="close" size={18} color={T.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={ep.searchWrap}>
              <Ionicons name="search-outline" size={15} color={T.textMuted} />
              <TextInput
                style={ep.searchInput}
                placeholder="Search…"
                placeholderTextColor={T.textMuted}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filtered.map((emp) => {
                const isActive = selected?.id === emp.id;
                return (
                  <TouchableOpacity
                    key={emp.id}
                    style={[ep.row, isActive && ep.rowActive]}
                    onPress={() => {
                      onSelect(emp);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <Avatar
                      photo={emp.photo}
                      name={emp.name}
                      size={40}
                      fontSize={12}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={ep.rowName}>{emp.name}</Text>
                      <Text style={ep.rowRole}>{emp.position}</Text>
                    </View>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={T.blue}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ep = StyleSheet.create({
  wrap: { gap: 6 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    minHeight: 50,
  },
  triggerSelected: { borderColor: T.blue, backgroundColor: T.blueSoft },
  placeholder: { flex: 1, fontSize: 14, color: T.textMuted },
  selName: { fontSize: 13, fontWeight: "700", color: T.text },
  selRole: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 30,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: T.text },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 14,
    backgroundColor: T.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: T.border,
  },
  searchInput: { flex: 1, fontSize: 13, color: T.text },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  rowActive: { backgroundColor: T.blueSoft },
  rowName: { fontSize: 13, fontWeight: "700", color: T.text },
  rowRole: { fontSize: 10, color: T.textMuted, marginTop: 2 },
});

const LocationPicker = ({ value, onSelect }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={lp2.wrap}>
      <Text style={lp2.label}>Office Location</Text>
      <TouchableOpacity
        style={lp2.trigger}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <Ionicons
          name="location-outline"
          size={15}
          color={value ? T.blue : T.textMuted}
        />
        <Text style={[lp2.triggerTxt, !value && { color: T.textMuted }]}>
          {value || "Select location…"}
        </Text>
        <Ionicons name="chevron-down" size={14} color={T.textMuted} />
      </TouchableOpacity>
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={lp2.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={lp2.dropdown}>
            <Text style={lp2.dropTitle}>Office Location</Text>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 280 }}
            >
              {LOCATIONS.map((loc) => {
                const isActive = value === loc;
                return (
                  <TouchableOpacity
                    key={loc}
                    style={[lp2.option, isActive && lp2.optionActive]}
                    onPress={() => {
                      onSelect(loc);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[lp2.optionTxt, isActive && lp2.optionTxtActive]}
                    >
                      {loc}
                    </Text>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={T.blue}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const lp2 = StyleSheet.create({
  wrap: { gap: 6 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 12,
    height: 50,
  },
  triggerTxt: { flex: 1, fontSize: 14, color: T.text },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    padding: 4,
  },
  dropTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: T.text,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  optionActive: { backgroundColor: T.blueSoft },
  optionTxt: { fontSize: 14, color: T.text },
  optionTxtActive: { color: T.blue, fontWeight: "700" },
});

const FInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  required,
  error,
  icon,
  multiline,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <Text
        style={{
          fontSize: 12,
          fontWeight: "700",
          color: T.textSub,
          textTransform: "uppercase",
          letterSpacing: 0.4,
        }}
      >
        {label}
        {required && <Text style={{ color: T.red }}> *</Text>}
      </Text>
      <View
        style={[
          {
            flexDirection: "row",
            alignItems: multiline ? "flex-start" : "center",
            backgroundColor: "#fff",
            borderRadius: 12,
            borderWidth: 1.5,
            borderColor: focused ? T.blue : error ? T.red : T.border,
            paddingHorizontal: 12,
            minHeight: 50,
            paddingTop: multiline ? 12 : 0,
          },
          focused && {
            shadowColor: T.blue,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.12,
            shadowRadius: 6,
            elevation: 2,
          },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={15}
            color={focused ? T.blue : T.textMuted}
            style={{ marginRight: 8, marginTop: multiline ? 2 : 0 }}
          />
        )}
        <TextInput
          style={{
            flex: 1,
            fontSize: 14,
            color: T.text,
            textAlignVertical: multiline ? "top" : "center",
            minHeight: multiline ? 72 : undefined,
          }}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={T.textMuted}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
        />
      </View>
      {error && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="alert-circle-outline" size={12} color={T.red} />
          <Text style={{ fontSize: 11, color: T.red, fontWeight: "600" }}>
            {error}
          </Text>
        </View>
      )}
    </View>
  );
};

const AddDepartmentModal = ({ visible, onClose, onAdd }) => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [head, setHead] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState({});

  const reset = () => {
    setName("");
    setCode("");
    setDescription("");
    setLocation("");
    setHead(null);
    setEmail("");
    setPhone("");
    setErrors({});
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!code.trim()) e.code = "Code is required";
    if (!head) e.head = "Please select a department head";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    const newDept = {
      id: `DEPT-${Date.now()}`,
      name,
      code: code.toUpperCase(),
      head: head.name,
      head_title: head.position,
      head_photo: head.photo,
      employees: 1,
      active: 1,
      on_leave: 0,
      location: location || "TBD",
      email: email || `${code.toLowerCase()}@smarthr.com`,
      phone: phone || "—",
      description: description || `The ${name} department.`,
      established: new Date().toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      }),
      status: "active",
      openRoles: 0,
      members: [{ name: head.name, role: head.position, photo: head.photo }],
    };
    onAdd(newDept);
    reset();
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={am.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1, justifyContent: "flex-end" }}
        >
          <View style={am.sheet}>
            <View style={am.handle} />

            {/* Header */}
            <View style={am.header}>
              <View style={am.headerIcon}>
                <Ionicons name="add-circle-outline" size={18} color={T.blue} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={am.headerTitle}>Add Department</Text>
                <Text style={am.headerSub}>Fill in the details below</Text>
              </View>
              <TouchableOpacity style={am.closeBtn} onPress={handleClose}>
                <Ionicons name="close" size={18} color={T.textMuted} />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={am.body}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Section: Basic */}
              <View style={am.sectionLabel}>
                <View style={am.sectionBar} />
                <Text style={am.sectionTitle}>Basic Information</Text>
              </View>

              <FInput
                label="Department Name"
                value={name}
                onChangeText={setName}
                placeholder="e.g. Engineering"
                icon="business-outline"
                required
                error={errors.name}
              />

              <View style={am.row2}>
                <View style={{ flex: 1 }}>
                  <FInput
                    label="Dept. Code"
                    value={code}
                    onChangeText={(v) => setCode(v.toUpperCase())}
                    placeholder="ENG"
                    icon="code-outline"
                    required
                    error={errors.code}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <LocationPicker value={location} onSelect={setLocation} />
                </View>
              </View>

              <FInput
                label="Description"
                value={description}
                onChangeText={setDescription}
                placeholder="Briefly describe this department…"
                icon="document-text-outline"
                multiline
              />

              {/* Section: People */}
              <View style={am.sectionLabel}>
                <View style={am.sectionBar} />
                <Text style={am.sectionTitle}>Leadership</Text>
              </View>

              <EmployeePickerSheet selected={head} onSelect={setHead} />
              {errors.head && (
                <View
                  style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
                >
                  <Ionicons
                    name="alert-circle-outline"
                    size={12}
                    color={T.red}
                  />
                  <Text
                    style={{ fontSize: 11, color: T.red, fontWeight: "600" }}
                  >
                    {errors.head}
                  </Text>
                </View>
              )}

              {/* Section: Contact */}
              <View style={am.sectionLabel}>
                <View style={am.sectionBar} />
                <Text style={am.sectionTitle}>Contact (Optional)</Text>
              </View>

              <View style={am.row2}>
                <View style={{ flex: 1 }}>
                  <FInput
                    label="Email"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="dept@company.com"
                    icon="mail-outline"
                    keyboardType="email-address"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <FInput
                    label="Phone"
                    value={phone}
                    onChangeText={setPhone}
                    placeholder="+1 (555)…"
                    icon="call-outline"
                    keyboardType="phone-pad"
                  />
                </View>
              </View>
            </ScrollView>

            {/* Footer actions */}
            <View style={am.footer}>
              <TouchableOpacity style={am.cancelBtn} onPress={handleClose}>
                <Text style={am.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={am.saveBtn} onPress={handleSave}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="#fff"
                />
                <Text style={am.saveTxt}>Create Department</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const am = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: "92%",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: T.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: T.text },
  headerSub: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: 18, gap: 14, paddingBottom: 10 },
  sectionLabel: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionBar: {
    width: 4,
    height: 16,
    borderRadius: 2,
    backgroundColor: T.blue,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row2: { flexDirection: "row", gap: 10 },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: "center",
  },
  cancelTxt: { fontSize: 13, fontWeight: "700", color: T.textSub },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: T.blue,
    paddingVertical: 14,
    borderRadius: 12,
  },
  saveTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function AllDepartmentsScreen() {
  const [departments, setDepartments] = useState(INITIAL_DEPARTMENTS);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showAdd, setShowAdd] = useState(false);

  const filtered = departments.filter((d) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.code.toLowerCase().includes(q) ||
      d.head.toLowerCase().includes(q)
    );
  });

  const handleAdd = (dept) => {
    setDepartments((prev) => [...prev, dept]);
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top bar */}
      <View style={s.topBar}>
        <View>
          <Text style={s.pageTitle}>Departments</Text>
          <Text style={s.pageSub}>
            {departments.length} departments ·{" "}
            {departments.reduce((a, d) => a + d.employees, 0)} employees
          </Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={s.addBtnTxt}>Add New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <HeroWidget departments={departments} />

        {/* Search */}
        <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
          <Ionicons
            name="search-outline"
            size={16}
            color={searchFocused ? T.blue : T.textMuted}
          />
          <TextInput
            style={s.searchInput}
            placeholder="Search departments, heads…"
            placeholderTextColor={T.textMuted}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color={T.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Section label */}
        <View style={s.sectionRow}>
          <View style={s.sectionBar} />
          <Text style={s.sectionTitle}>All Departments</Text>
          <View style={s.countPill}>
            <Text style={s.countTxt}>{filtered.length}</Text>
          </View>
        </View>

        {/* Cards */}
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="business-outline" size={52} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No departments found</Text>
          </View>
        ) : (
          filtered.map((item) => (
            <DeptCard key={item.id} item={item} onPress={setSelected} />
          ))
        )}
      </ScrollView>

      {/* Detail modal */}
      <DeptDetailModal item={selected} onClose={() => setSelected(null)} />

      {/* Add department modal */}
      <AddDepartmentModal
        visible={showAdd}
        onClose={() => setShowAdd(false)}
        onAdd={handleAdd}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.blue,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
  scroll: { padding: 14, gap: 12, paddingBottom: 50 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
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
  searchInput: { flex: 1, fontSize: 13.5, color: T.text },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: T.blue,
  },
  sectionTitle: { flex: 1, fontSize: 14, fontWeight: "800", color: T.text },
  countPill: {
    backgroundColor: T.blue,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  countTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },
  empty: { paddingTop: 60, alignItems: "center", gap: 10 },
  emptyTxt: { fontSize: 15, color: T.textMuted, fontWeight: "700" },
});
