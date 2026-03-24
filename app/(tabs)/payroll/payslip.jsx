import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
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
  teal: "#0891B2",
  tealSoft: "#ECFEFF",
  orange: "#F97316",
  orangeSoft: "#FFF7ED",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────
const MOCK_PAYSLIPS = [
  {
    id: "PS-2026-003",
    emp_id: "Emp-001",
    name: "Anthony Lewis",
    position: "Finance Manager",
    department: "Finance",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    period: "March 2026",
    period_short: "Mar 2026",
    pay_date: "28 Mar 2026",
    status: "issued",
    basic: 40000,
    housing: 5000,
    transport: 2000,
    medical: 1500,
    bonus: 2000,
    tax: 8500,
    pension: 2000,
    other_deductions: 0,
    bank: "Barclays Bank",
    account: "****4821",
  },
  {
    id: "PS-2026-002",
    emp_id: "Emp-001",
    name: "Anthony Lewis",
    position: "Finance Manager",
    department: "Finance",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    period: "February 2026",
    period_short: "Feb 2026",
    pay_date: "28 Feb 2026",
    status: "issued",
    basic: 40000,
    housing: 5000,
    transport: 2000,
    medical: 1500,
    bonus: 0,
    tax: 8200,
    pension: 2000,
    other_deductions: 500,
    bank: "Barclays Bank",
    account: "****4821",
  },
  {
    id: "PS-2026-001",
    emp_id: "Emp-001",
    name: "Anthony Lewis",
    position: "Finance Manager",
    department: "Finance",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
    period: "January 2026",
    period_short: "Jan 2026",
    pay_date: "31 Jan 2026",
    status: "issued",
    basic: 40000,
    housing: 5000,
    transport: 2000,
    medical: 1500,
    bonus: 5000,
    tax: 9100,
    pension: 2000,
    other_deductions: 0,
    bank: "Barclays Bank",
    account: "****4821",
  },
  {
    id: "PS-2026-003-B",
    emp_id: "Emp-002",
    name: "Brian Villalobos",
    position: "Senior Developer",
    department: "Engineering",
    photo: "https://randomuser.me/api/portraits/men/44.jpg",
    period: "March 2026",
    period_short: "Mar 2026",
    pay_date: "28 Mar 2026",
    status: "pending",
    basic: 35000,
    housing: 4000,
    transport: 1500,
    medical: 1000,
    bonus: 3000,
    tax: 7200,
    pension: 1750,
    other_deductions: 0,
    bank: "Chase Bank",
    account: "****2293",
  },
  {
    id: "PS-2026-002-B",
    emp_id: "Emp-002",
    name: "Brian Villalobos",
    position: "Senior Developer",
    department: "Engineering",
    photo: "https://randomuser.me/api/portraits/men/44.jpg",
    period: "February 2026",
    period_short: "Feb 2026",
    pay_date: "28 Feb 2026",
    status: "issued",
    basic: 35000,
    housing: 4000,
    transport: 1500,
    medical: 1000,
    bonus: 0,
    tax: 6800,
    pension: 1750,
    other_deductions: 200,
    bank: "Chase Bank",
    account: "****2293",
  },
  {
    id: "PS-2026-003-C",
    emp_id: "Emp-006",
    name: "Priya Sharma",
    position: "UI/UX Designer",
    department: "Design",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
    period: "March 2026",
    period_short: "Mar 2026",
    pay_date: "28 Mar 2026",
    status: "issued",
    basic: 32000,
    housing: 3500,
    transport: 1200,
    medical: 800,
    bonus: 1500,
    tax: 6200,
    pension: 1600,
    other_deductions: 0,
    bank: "HSBC",
    account: "****7712",
  },
  {
    id: "PS-2026-003-D",
    emp_id: "Emp-007",
    name: "Sofia Martinez",
    position: "Marketing Lead",
    department: "Marketing",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
    period: "March 2026",
    period_short: "Mar 2026",
    pay_date: "—",
    status: "draft",
    basic: 38000,
    housing: 4500,
    transport: 1800,
    medical: 1200,
    bonus: 2500,
    tax: 7800,
    pension: 1900,
    other_deductions: 0,
    bank: "TD Bank",
    account: "****6634",
  },
];

const DEPT_COLORS = {
  Finance: { bg: "#FFF7ED", accent: "#F97316", text: "#9A3412" },
  Engineering: { bg: "#EFF6FF", accent: "#3B82F6", text: "#1E40AF" },
  Operations: { bg: "#F5F3FF", accent: "#8B5CF6", text: "#5B21B6" },
  HR: { bg: "#FDF2F8", accent: "#EC4899", text: "#9D174D" },
  Design: { bg: "#ECFDF5", accent: "#10B981", text: "#065F46" },
  Marketing: { bg: "#FFFBEB", accent: "#F59E0B", text: "#92400E" },
};

const STATUS_META = {
  issued: {
    color: T.green,
    soft: T.greenSoft,
    icon: "checkmark-circle",
    label: "Issued",
  },
  pending: {
    color: T.amber,
    soft: T.amberSoft,
    icon: "time-outline",
    label: "Pending",
  },
  draft: {
    color: T.textMuted,
    soft: "#F1F5F9",
    icon: "document-outline",
    label: "Draft",
  },
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const FILTER_TABS = ["All", "Issued", "Pending", "Draft"];

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

const calcNet = (p) => {
  const gross = p.basic + p.housing + p.transport + p.medical + p.bonus;
  const deductions = p.tax + p.pension + p.other_deductions;
  return { gross, deductions, net: gross - deductions };
};

const fmt = (n) =>
  n.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// ─────────────────────────────────────────────────────────────
//  HERO STATS
// ─────────────────────────────────────────────────────────────
const HeroStats = ({ payslips }) => {
  const issued = payslips.filter((p) => p.status === "issued").length;
  const pending = payslips.filter((p) => p.status === "pending").length;
  const totalNet = payslips
    .filter((p) => p.status === "issued")
    .reduce((s, p) => s + calcNet(p).net, 0);

  return (
    <View style={hs.wrap}>
      <View style={hs.hero}>
        <View style={hs.blob1} />
        <View style={hs.blob2} />
        <View style={hs.heroRow}>
          <View style={hs.heroLeft}>
            <Text style={hs.eyebrow}>PAYSLIPS OVERVIEW</Text>
            <Text style={hs.heroNum}>{payslips.length}</Text>
            <View style={hs.badges}>
              <View style={hs.badge}>
                <Ionicons name="checkmark-circle" size={10} color="#4ADE80" />
                <Text style={hs.badgeTxt}>{issued} issued</Text>
              </View>
              {pending > 0 && (
                <View
                  style={[
                    hs.badge,
                    { backgroundColor: "rgba(251,191,36,0.12)" },
                  ]}
                >
                  <Ionicons name="time-outline" size={10} color="#FBBF24" />
                  <Text style={[hs.badgeTxt, { color: "#FBBF24" }]}>
                    {pending} pending
                  </Text>
                </View>
              )}
            </View>
            <Text style={hs.heroSub}>Total records · all employees</Text>
          </View>
          <View style={hs.heroRight}>
            <View style={hs.ringWrap}>
              <Text style={hs.ringNum}>{issued}</Text>
              <Text style={hs.ringLabel}>Issued</Text>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={hs.tilesRow}
      >
        {[
          {
            val: payslips.length,
            label: "Total",
            icon: "documents-outline",
            color: T.blue,
          },
          {
            val: issued,
            label: "Issued",
            icon: "checkmark-circle-outline",
            color: T.green,
          },
          {
            val: pending,
            label: "Pending",
            icon: "time-outline",
            color: T.amber,
          },
          {
            val: `$${(totalNet / 1000).toFixed(0)}k`,
            label: "Net Paid",
            icon: "cash-outline",
            color: T.purple,
          },
        ].map((t) => (
          <View key={t.label} style={hs.tile}>
            <View style={[hs.tileIcon, { backgroundColor: t.color + "18" }]}>
              <Ionicons name={t.icon} size={14} color={t.color} />
            </View>
            <Text style={hs.tileVal}>{t.val}</Text>
            <Text style={hs.tileLbl}>{t.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const hs = StyleSheet.create({
  wrap: { paddingHorizontal: 14, marginBottom: 10 },
  hero: {
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  blob1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: T.blue,
    opacity: 0.08,
    top: -60,
    right: -40,
  },
  blob2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: T.purple,
    opacity: 0.1,
    bottom: -50,
    left: 30,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: { flex: 1, gap: 5 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1.5,
  },
  heroNum: {
    fontSize: 50,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 54,
  },
  badges: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(74,222,128,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTxt: { fontSize: 10, color: "#4ADE80", fontWeight: "700" },
  heroSub: { fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: "500" },
  heroRight: { alignItems: "center", paddingLeft: 16 },
  ringWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  ringNum: { fontSize: 22, fontWeight: "900", color: "#fff" },
  ringLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tilesRow: { gap: 8, paddingRight: 4 },
  tile: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
    minWidth: 80,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  tileIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  tileVal: {
    fontSize: 16,
    fontWeight: "900",
    color: T.text,
    letterSpacing: -0.5,
  },
  tileLbl: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

// ─────────────────────────────────────────────────────────────
//  PAYSLIP CARD
// ─────────────────────────────────────────────────────────────
const PayslipCard = ({ item, onPress }) => {
  const dept = DEPT_COLORS[item.department] || {
    bg: T.bg,
    accent: T.textMuted,
    text: T.textSub,
  };
  const status = STATUS_META[item.status];
  const { gross, deductions, net } = calcNet(item);
  const utilPct = gross > 0 ? Math.round((deductions / gross) * 100) : 0;

  return (
    <TouchableOpacity
      style={ps.card}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      <View style={[ps.bar, { backgroundColor: dept.accent }]} />
      <View style={ps.inner}>
        {/* Top row */}
        <View style={ps.topRow}>
          {item.photo ? (
            <Image source={{ uri: item.photo }} style={ps.avatar} />
          ) : (
            <View
              style={[ps.avatarFb, { backgroundColor: avatarColor(item.name) }]}
            >
              <Text style={ps.avatarTxt}>{getInitials(item.name)}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={ps.name} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={ps.metaRow}>
              <Text style={ps.metaTxt}>{item.emp_id}</Text>
              <View style={ps.metaDot} />
              <Text style={ps.metaTxt}>{item.position}</Text>
            </View>
          </View>
          <View style={[ps.statusBadge, { backgroundColor: status.soft }]}>
            <Ionicons name={status.icon} size={11} color={status.color} />
            <Text style={[ps.statusTxt, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* Period + Dept row */}
        <View style={ps.midRow}>
          <View style={ps.periodChip}>
            <Ionicons name="calendar-outline" size={11} color={T.blue} />
            <Text style={ps.periodTxt}>{item.period_short}</Text>
          </View>
          <View style={[ps.deptChip, { backgroundColor: dept.bg }]}>
            <View style={[ps.deptDot, { backgroundColor: dept.accent }]} />
            <Text style={[ps.deptTxt, { color: dept.text }]}>
              {item.department}
            </Text>
          </View>
          <View style={ps.idChip}>
            <Text style={ps.idTxt}>{item.id}</Text>
          </View>
        </View>

        {/* Salary breakdown grid */}
        <View style={ps.salaryGrid}>
          {[
            { label: "Gross", val: `$${fmt(gross)}`, color: T.blue },
            { label: "Deduct", val: `-$${fmt(deductions)}`, color: T.red },
            { label: "Net Pay", val: `$${fmt(net)}`, color: T.green },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={ps.gridSep} />}
              <View style={ps.gridCell}>
                <Text style={[ps.gridVal, { color: s.color }]}>{s.val}</Text>
                <Text style={ps.gridLabel}>{s.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Deduction bar */}
        <View style={ps.barSection}>
          <View style={ps.barTrack}>
            <View style={[ps.barFill, { width: `${utilPct}%` }]} />
          </View>
          <Text style={ps.barPct}>{utilPct}% deducted</Text>
        </View>

        {/* Footer */}
        <View style={ps.footer}>
          <View style={ps.payDateRow}>
            <Ionicons name="card-outline" size={11} color={T.textMuted} />
            <Text style={ps.payDateTxt}>
              {item.bank} · {item.account}
            </Text>
          </View>
          {item.pay_date !== "—" && (
            <View style={ps.paidChip}>
              <Ionicons name="checkmark-done" size={10} color={T.green} />
              <Text style={ps.paidChipTxt}>Paid {item.pay_date}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={13} color={T.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ps = StyleSheet.create({
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
  bar: { width: 4 },
  inner: { flex: 1, padding: 13, gap: 10 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 2,
    borderColor: T.border,
  },
  avatarFb: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 13, fontWeight: "800", color: "#fff" },
  name: { fontSize: 14, fontWeight: "700", color: T.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  metaTxt: { fontSize: 10, color: T.textMuted },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: T.border,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusTxt: { fontSize: 10, fontWeight: "700" },
  midRow: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    flexWrap: "wrap",
  },
  periodChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: T.blueSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  periodTxt: { fontSize: 10, fontWeight: "700", color: T.blue },
  deptChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deptDot: { width: 5, height: 5, borderRadius: 2.5 },
  deptTxt: { fontSize: 10, fontWeight: "700" },
  idChip: {
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  idTxt: {
    fontSize: 9,
    fontWeight: "700",
    color: T.textMuted,
    letterSpacing: 0.3,
  },
  salaryGrid: {
    flexDirection: "row",
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  gridCell: { flex: 1, alignItems: "center", paddingVertical: 9 },
  gridSep: { width: 1, backgroundColor: T.border },
  gridVal: { fontSize: 13, fontWeight: "900", letterSpacing: -0.3 },
  gridLabel: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "600",
    marginTop: 2,
    textTransform: "uppercase",
  },
  barSection: { flexDirection: "row", alignItems: "center", gap: 8 },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: T.red,
    borderRadius: 3,
    opacity: 0.7,
  },
  barPct: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "600",
    width: 80,
    textAlign: "right",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  payDateRow: { flex: 1, flexDirection: "row", alignItems: "center", gap: 5 },
  payDateTxt: { fontSize: 10, color: T.textMuted, fontWeight: "500" },
  paidChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: T.greenSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  paidChipTxt: { fontSize: 9, fontWeight: "700", color: T.green },
});

// ─────────────────────────────────────────────────────────────
//  PAYSLIP DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const PayslipDetailModal = ({ item, onClose }) => {
  if (!item) return null;
  const dept = DEPT_COLORS[item.department] || {
    bg: T.bg,
    accent: T.textMuted,
    text: T.textSub,
  };
  const status = STATUS_META[item.status];
  const { gross, deductions, net } = calcNet(item);

  const earnings = [
    { label: "Basic Salary", val: item.basic, icon: "wallet-outline" },
    { label: "Housing Allowance", val: item.housing, icon: "home-outline" },
    { label: "Transport Allowance", val: item.transport, icon: "car-outline" },
    { label: "Medical Allowance", val: item.medical, icon: "medical-outline" },
    { label: "Bonus", val: item.bonus, icon: "gift-outline" },
  ].filter((e) => e.val > 0);

  const dedItems = [
    { label: "Income Tax", val: item.tax, icon: "receipt-outline" },
    { label: "Pension", val: item.pension, icon: "shield-outline" },
    {
      label: "Other Deductions",
      val: item.other_deductions,
      icon: "remove-circle-outline",
    },
  ].filter((e) => e.val > 0);

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={dm.overlay}>
        <View style={dm.sheet}>
          <View style={dm.handle} />

          {/* Header */}
          <View style={dm.header}>
            <Text style={dm.headerTitle}>Payslip</Text>
            <View style={[dm.headerBadge, { backgroundColor: status.soft }]}>
              <Ionicons name={status.icon} size={11} color={status.color} />
              <Text style={[dm.headerBadgeTxt, { color: status.color }]}>
                {status.label}
              </Text>
            </View>
            <TouchableOpacity style={dm.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color={T.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Employee hero */}
            <View style={[dm.empHero, { backgroundColor: dept.bg }]}>
              <View style={dm.empHeroBlob} />
              {item.photo ? (
                <Image source={{ uri: item.photo }} style={dm.heroPhoto} />
              ) : (
                <View
                  style={[
                    dm.heroAvatarFb,
                    { backgroundColor: avatarColor(item.name) },
                  ]}
                >
                  <Text style={dm.heroInitials}>{getInitials(item.name)}</Text>
                </View>
              )}
              <Text style={dm.heroName}>{item.name}</Text>
              <Text style={[dm.heroRole, { color: dept.text }]}>
                {item.position} · {item.department}
              </Text>
              <View style={dm.heroBadgeRow}>
                <View style={dm.heroBadge}>
                  <Ionicons name="calendar-outline" size={11} color={T.blue} />
                  <Text style={dm.heroBadgeTxt}>{item.period}</Text>
                </View>
                <View style={dm.heroBadge}>
                  <Ionicons
                    name="document-text-outline"
                    size={11}
                    color={T.blue}
                  />
                  <Text style={dm.heroBadgeTxt}>{item.id}</Text>
                </View>
              </View>
            </View>

            {/* Net Pay hero */}
            <View style={dm.netHero}>
              <View style={dm.netBlob1} />
              <View style={dm.netBlob2} />
              <Text style={dm.netEyebrow}>NET PAY</Text>
              <Text style={dm.netAmount}>${fmt(net)}</Text>
              <View style={dm.netSubRow}>
                <View style={dm.netSubChip}>
                  <Ionicons name="trending-up" size={10} color="#4ADE80" />
                  <Text style={dm.netSubTxt}>Gross ${fmt(gross)}</Text>
                </View>
                <View
                  style={[
                    dm.netSubChip,
                    { backgroundColor: "rgba(239,68,68,0.12)" },
                  ]}
                >
                  <Ionicons name="remove-circle" size={10} color="#F87171" />
                  <Text style={[dm.netSubTxt, { color: "#F87171" }]}>
                    Deductions ${fmt(deductions)}
                  </Text>
                </View>
              </View>
            </View>

            {/* Earnings section */}
            <View style={dm.section}>
              <View style={dm.sectionHeader}>
                <View
                  style={[dm.sectionIcon, { backgroundColor: T.greenSoft }]}
                >
                  <Ionicons
                    name="trending-up-outline"
                    size={13}
                    color={T.green}
                  />
                </View>
                <Text style={dm.sectionTitle}>Earnings</Text>
                <Text style={[dm.sectionTotal, { color: T.green }]}>
                  ${fmt(gross)}
                </Text>
              </View>
              {earnings.map((e, i) => (
                <View
                  key={e.label}
                  style={[
                    dm.lineRow,
                    i < earnings.length - 1 && dm.lineRowBorder,
                  ]}
                >
                  <View style={dm.lineIconWrap}>
                    <Ionicons name={e.icon} size={13} color={T.textMuted} />
                  </View>
                  <Text style={dm.lineLabel}>{e.label}</Text>
                  <Text style={dm.lineVal}>${fmt(e.val)}</Text>
                </View>
              ))}
            </View>

            {/* Deductions section */}
            <View style={dm.section}>
              <View style={dm.sectionHeader}>
                <View style={[dm.sectionIcon, { backgroundColor: T.redSoft }]}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={13}
                    color={T.red}
                  />
                </View>
                <Text style={dm.sectionTitle}>Deductions</Text>
                <Text style={[dm.sectionTotal, { color: T.red }]}>
                  -${fmt(deductions)}
                </Text>
              </View>
              {dedItems.map((e, i) => (
                <View
                  key={e.label}
                  style={[
                    dm.lineRow,
                    i < dedItems.length - 1 && dm.lineRowBorder,
                  ]}
                >
                  <View style={dm.lineIconWrap}>
                    <Ionicons name={e.icon} size={13} color={T.textMuted} />
                  </View>
                  <Text style={dm.lineLabel}>{e.label}</Text>
                  <Text style={[dm.lineVal, { color: T.red }]}>
                    -${fmt(e.val)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Net pay summary */}
            <View style={dm.netSummary}>
              <Text style={dm.netSumLabel}>Net Pay</Text>
              <Text style={dm.netSumVal}>${fmt(net)}</Text>
            </View>

            {/* Payment info */}
            <View style={dm.section}>
              <View style={dm.sectionHeader}>
                <View style={[dm.sectionIcon, { backgroundColor: T.blueSoft }]}>
                  <Ionicons name="card-outline" size={13} color={T.blue} />
                </View>
                <Text style={dm.sectionTitle}>Payment Details</Text>
              </View>
              {[
                { label: "Bank", val: item.bank, icon: "business-outline" },
                {
                  label: "Account No.",
                  val: item.account,
                  icon: "keypad-outline",
                },
                {
                  label: "Pay Date",
                  val: item.pay_date,
                  icon: "calendar-outline",
                },
                {
                  label: "Employee ID",
                  val: item.emp_id,
                  icon: "id-card-outline",
                },
              ].map((r, i) => (
                <View
                  key={r.label}
                  style={[dm.lineRow, i < 3 && dm.lineRowBorder]}
                >
                  <View style={dm.lineIconWrap}>
                    <Ionicons name={r.icon} size={13} color={T.textMuted} />
                  </View>
                  <Text style={dm.lineLabel}>{r.label}</Text>
                  <Text style={dm.lineVal}>{r.val}</Text>
                </View>
              ))}
            </View>

            <View style={{ height: 8 }} />
          </ScrollView>

          {/* Footer actions */}
          <View style={dm.footer}>
            <TouchableOpacity style={dm.footerBtn} onPress={onClose}>
              <Ionicons name="close-outline" size={15} color={T.textSub} />
              <Text style={dm.footerBtnTxt}>Close</Text>
            </TouchableOpacity>
            <TouchableOpacity style={dm.shareBtn}>
              <Ionicons name="share-outline" size={15} color={T.blue} />
              <Text style={dm.shareBtnTxt}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity style={dm.downloadBtn}>
              <Ionicons name="download-outline" size={15} color="#fff" />
              <Text style={dm.downloadBtnTxt}>Download PDF</Text>
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
    maxHeight: "95%",
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
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 17, fontWeight: "800", color: T.text, flex: 1 },
  headerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  headerBadgeTxt: { fontSize: 11, fontWeight: "700" },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  empHero: {
    margin: 16,
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    gap: 5,
    overflow: "hidden",
    position: "relative",
  },
  empHeroBlob: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(0,0,0,0.04)",
    top: -60,
    right: -40,
  },
  heroPhoto: {
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 6,
  },
  heroAvatarFb: {
    width: 76,
    height: 76,
    borderRadius: 38,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  heroInitials: { fontSize: 24, fontWeight: "900", color: "#fff" },
  heroName: { fontSize: 18, fontWeight: "800", color: T.text },
  heroRole: { fontSize: 12, fontWeight: "600" },
  heroBadgeRow: { flexDirection: "row", gap: 8, marginTop: 6 },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(10,102,194,0.1)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroBadgeTxt: { fontSize: 10, fontWeight: "700", color: T.blue },

  netHero: {
    backgroundColor: T.navy,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 8,
    overflow: "hidden",
    position: "relative",
    marginBottom: 4,
  },
  netBlob1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: T.blue,
    opacity: 0.1,
    top: -50,
    right: -30,
  },
  netBlob2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: T.green,
    opacity: 0.07,
    bottom: -30,
    left: 20,
  },
  netEyebrow: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1.8,
  },
  netAmount: {
    fontSize: 38,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1.5,
  },
  netSubRow: { flexDirection: "row", gap: 8 },
  netSubChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(74,222,128,0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  netSubTxt: { fontSize: 10, color: "#4ADE80", fontWeight: "700" },

  section: {
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: T.bg,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  sectionIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionTitle: {
    flex: 1,
    fontSize: 12,
    fontWeight: "800",
    color: T.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  sectionTotal: { fontSize: 14, fontWeight: "900" },
  lineRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  lineRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F8FAFC" },
  lineIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: T.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  lineLabel: { flex: 1, fontSize: 13, color: T.textSub },
  lineVal: { fontSize: 13, fontWeight: "700", color: T.text },

  netSummary: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 16,
    marginTop: 10,
    backgroundColor: T.navy,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 16,
  },
  netSumLabel: { fontSize: 14, fontWeight: "800", color: "#fff" },
  netSumVal: { fontSize: 22, fontWeight: "900", color: "#fff" },

  footer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  footerBtnTxt: { fontSize: 12, fontWeight: "700", color: T.textSub },
  shareBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: T.blueSoft,
    borderWidth: 1.5,
    borderColor: T.blue,
  },
  shareBtnTxt: { fontSize: 12, fontWeight: "700", color: T.blue },
  downloadBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: T.blue,
    paddingVertical: 13,
    borderRadius: 12,
  },
  downloadBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  MONTH FILTER STRIP
// ─────────────────────────────────────────────────────────────
const MonthStrip = ({ selected, onChange, payslips }) => {
  const available = [...new Set(payslips.map((p) => p.period_short))];
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={mf.row}
    >
      <TouchableOpacity
        style={[mf.chip, !selected && mf.chipActive]}
        onPress={() => onChange(null)}
      >
        <Text style={[mf.chipTxt, !selected && mf.chipTxtActive]}>
          All Months
        </Text>
      </TouchableOpacity>
      {MONTHS.map((m) => {
        const periodStr = `${m} 2026`;
        const hasRecords = available.some((a) => a.startsWith(m));
        if (!hasRecords) return null;
        const isActive = selected === periodStr;
        return (
          <TouchableOpacity
            key={m}
            style={[mf.chip, isActive && mf.chipActive]}
            onPress={() => onChange(isActive ? null : periodStr)}
          >
            <Text style={[mf.chipTxt, isActive && mf.chipTxtActive]}>
              {m} 2026
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const mf = StyleSheet.create({
  row: { paddingHorizontal: 14, gap: 8, paddingBottom: 10 },
  chip: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.border,
  },
  chipActive: { backgroundColor: T.navy, borderColor: T.navy },
  chipTxt: { fontSize: 11, fontWeight: "700", color: T.textSub },
  chipTxtActive: { color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function PayslipsScreen() {
  const [statusFilter, setStatusFilter] = useState("All");
  const [monthFilter, setMonthFilter] = useState(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [selectedPayslip, setSelectedPayslip] = useState(null);

  const filtered = useMemo(() => {
    let d = [...MOCK_PAYSLIPS];
    if (statusFilter !== "All")
      d = d.filter((p) => p.status === statusFilter.toLowerCase());
    if (monthFilter) d = d.filter((p) => p.period_short === monthFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.emp_id.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.department.toLowerCase().includes(q),
      );
    }
    return d;
  }, [statusFilter, monthFilter, search]);

  const hasFilters = search || statusFilter !== "All" || monthFilter;

  const ListHeader = () => (
    <>
      {/* Title */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Payslips</Text>
          <Text style={s.pageSub}>
            {MOCK_PAYSLIPS.length} records · all employees
          </Text>
        </View>
        <TouchableOpacity style={s.exportBtn}>
          <Ionicons name="download-outline" size={14} color={T.textSub} />
          <Text style={s.exportTxt}>Export</Text>
        </TouchableOpacity>
      </View>

      <HeroStats payslips={MOCK_PAYSLIPS} />

      {/* Month strip */}
      <MonthStrip
        selected={monthFilter}
        onChange={setMonthFilter}
        payslips={MOCK_PAYSLIPS}
      />

      {/* Search */}
      <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
        <Ionicons
          name="search-outline"
          size={16}
          color={searchFocused ? T.blue : T.textMuted}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search name, ID, department…"
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

      {/* Status filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabsRow}
      >
        {FILTER_TABS.map((tab) => {
          const isActive = statusFilter === tab;
          const meta = tab !== "All" ? STATUS_META[tab.toLowerCase()] : null;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                s.tab,
                isActive && {
                  backgroundColor: meta?.color || T.navy,
                  borderColor: meta?.color || T.navy,
                },
              ]}
              onPress={() => setStatusFilter(tab)}
            >
              {meta && (
                <View
                  style={[
                    s.tabDot,
                    { backgroundColor: isActive ? "#fff" : meta.color },
                  ]}
                />
              )}
              <Text style={[s.tabTxt, isActive && s.tabTxtActive]}>{tab}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results count */}
      {hasFilters && (
        <View style={s.resultsBar}>
          <Ionicons name="funnel" size={11} color={T.blue} />
          <Text style={s.resultsTxt}>
            {filtered.length} payslip{filtered.length !== 1 ? "s" : ""} found
          </Text>
          <TouchableOpacity
            onPress={() => {
              setSearch("");
              setStatusFilter("All");
              setMonthFilter(null);
            }}
          >
            <Text style={s.clearTxt}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Section label */}
      <View style={s.sectionRow}>
        <View style={s.sectionDot} />
        <Text style={s.sectionTitle}>
          {monthFilter ||
            (statusFilter !== "All"
              ? `${statusFilter} Payslips`
              : "All Payslips")}
        </Text>
        <View style={s.countPill}>
          <Text style={s.countPillTxt}>{filtered.length}</Text>
        </View>
      </View>
    </>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 14, marginBottom: 10 }}>
            <PayslipCard item={item} onPress={setSelectedPayslip} />
          </View>
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={{ paddingTop: 0, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="documents-outline" size={52} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No payslips found</Text>
            <Text style={s.emptySub}>
              Try a different filter or search term.
            </Text>
          </View>
        }
      />

      <PayslipDetailModal
        item={selectedPayslip}
        onClose={() => setSelectedPayslip(null)}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 12,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#fff",
  },
  exportTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 14,
    marginBottom: 10,
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

  tabsRow: { paddingHorizontal: 14, gap: 8, marginBottom: 10 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.border,
  },
  tabDot: { width: 7, height: 7, borderRadius: 3.5 },
  tabTxt: { fontSize: 11, fontWeight: "700", color: T.textSub },
  tabTxtActive: { color: "#fff", fontWeight: "800" },

  resultsBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: T.blueSoft,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  resultsTxt: { flex: 1, fontSize: 12, color: T.blue, fontWeight: "700" },
  clearTxt: {
    fontSize: 11,
    color: T.blue,
    fontWeight: "800",
    textDecorationLine: "underline",
  },

  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  sectionDot: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: T.blue,
  },
  sectionTitle: { flex: 1, fontSize: 14, fontWeight: "800", color: T.text },
  countPill: {
    backgroundColor: T.blue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  countPillTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },

  empty: { padding: 48, alignItems: "center", gap: 10 },
  emptyTxt: { fontSize: 15, color: T.textMuted, fontWeight: "700" },
  emptySub: { fontSize: 13, color: "#CBD5E1", textAlign: "center" },
});
