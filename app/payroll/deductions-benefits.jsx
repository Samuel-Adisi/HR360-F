import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
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
  orange: "#D97706",
  orangeSoft: "#FEF3C7",
  purple: "#7C3AED",
  purpleSoft: "#EDE9FE",
  teal: "#0891B2",
  tealSoft: "#ECFEFF",
  pink: "#DB2777",
  pinkSoft: "#FCE7F3",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────
const EMPLOYEES = [
  {
    id: "EMP001",
    name: "James Rodriguez",
    department: "Marketing",
    role: "Product Marketing Manager",
  },
  {
    id: "EMP002",
    name: "Sarah Mitchell",
    department: "Engineering",
    role: "Senior React Native Developer",
  },
];

const MOCK_DEDUCTIONS = [
  // ── James Rodriguez ──────────────────────────────────────
  {
    id: "D001",
    emp_id: "EMP001",
    category: "tax",
    name: "Income Tax (PAYE)",
    amount: 420.0,
    calc_type: "percentage",
    rate: 18,
    frequency: "monthly",
    mandatory: true,
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Standard PAYE bracket",
  },
  {
    id: "D002",
    emp_id: "EMP001",
    category: "social_security",
    name: "SSNIT Contribution",
    amount: 137.5,
    calc_type: "percentage",
    rate: 5.5,
    frequency: "monthly",
    mandatory: true,
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Employee SSNIT 5.5%",
  },
  {
    id: "D003",
    emp_id: "EMP001",
    category: "insurance",
    name: "Health Insurance",
    amount: 80.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    mandatory: false,
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "BlueCross Gold Plan",
  },
  {
    id: "D004",
    emp_id: "EMP001",
    category: "loan",
    name: "Salary Advance Repayment",
    amount: 200.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    mandatory: true,
    taxable: false,
    active: true,
    effective_from: "2025-02-01",
    notes: "12-month repayment plan, 8 remaining",
  },
  {
    id: "D005",
    emp_id: "EMP001",
    category: "other",
    name: "Union Dues",
    amount: 25.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    mandatory: false,
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Marketing union membership",
  },
  {
    id: "D006",
    emp_id: "EMP001",
    category: "custom",
    name: "Parking Levy",
    amount: 15.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    mandatory: false,
    taxable: false,
    active: false,
    effective_from: "2025-01-01",
    notes: "Deactivated — remote work",
  },

  // ── Sarah Mitchell ────────────────────────────────────────
  {
    id: "D007",
    emp_id: "EMP002",
    category: "tax",
    name: "Income Tax (PAYE)",
    amount: 612.0,
    calc_type: "percentage",
    rate: 22,
    frequency: "monthly",
    mandatory: true,
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Higher PAYE bracket",
  },
  {
    id: "D008",
    emp_id: "EMP002",
    category: "social_security",
    name: "SSNIT Contribution",
    amount: 192.5,
    calc_type: "percentage",
    rate: 5.5,
    frequency: "monthly",
    mandatory: true,
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Employee SSNIT 5.5%",
  },
  {
    id: "D009",
    emp_id: "EMP002",
    category: "insurance",
    name: "Health Insurance",
    amount: 80.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    mandatory: false,
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "BlueCross Gold Plan",
  },
  {
    id: "D010",
    emp_id: "EMP002",
    category: "insurance",
    name: "Life Insurance",
    amount: 45.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    mandatory: false,
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Term life — company subsidized",
  },
  {
    id: "D011",
    emp_id: "EMP002",
    category: "other",
    name: "Laptop Installment",
    amount: 125.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    mandatory: true,
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "MacBook Pro — 24-month plan, 16 left",
  },
];

const MOCK_BENEFITS = [
  // ── James Rodriguez ──────────────────────────────────────
  {
    id: "B001",
    emp_id: "EMP001",
    category: "housing",
    name: "Housing Allowance",
    amount: 600.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    taxable: true,
    active: true,
    effective_from: "2025-01-01",
    notes: "Standard housing supplement",
  },
  {
    id: "B002",
    emp_id: "EMP001",
    category: "transport",
    name: "Transport Allowance",
    amount: 150.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Non-taxable commuting benefit",
  },
  {
    id: "B003",
    emp_id: "EMP001",
    category: "meal",
    name: "Meal Allowance",
    amount: 100.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Lunch subsidy",
  },
  {
    id: "B004",
    emp_id: "EMP001",
    category: "performance",
    name: "Q1 Performance Bonus",
    amount: 800.0,
    calc_type: "fixed",
    rate: null,
    frequency: "one_time",
    taxable: true,
    active: true,
    effective_from: "2025-03-31",
    notes: "Paid Q1 2025 — exceeded targets by 18%",
  },
  {
    id: "B005",
    emp_id: "EMP001",
    category: "custom",
    name: "Mobile Stipend",
    amount: 40.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Business phone allowance",
  },

  // ── Sarah Mitchell ────────────────────────────────────────
  {
    id: "B006",
    emp_id: "EMP002",
    category: "housing",
    name: "Housing Allowance",
    amount: 750.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    taxable: true,
    active: true,
    effective_from: "2025-01-01",
    notes: "Senior engineer supplement",
  },
  {
    id: "B007",
    emp_id: "EMP002",
    category: "transport",
    name: "Transport Allowance",
    amount: 200.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Non-taxable commuting benefit",
  },
  {
    id: "B008",
    emp_id: "EMP002",
    category: "medical",
    name: "Medical Benefit",
    amount: 120.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "Outpatient top-up",
  },
  {
    id: "B009",
    emp_id: "EMP002",
    category: "overtime",
    name: "Overtime Pay",
    amount: 340.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    taxable: true,
    active: true,
    effective_from: "2025-03-01",
    notes: "March overtime — 17 hours",
  },
  {
    id: "B010",
    emp_id: "EMP002",
    category: "custom",
    name: "Education Allowance",
    amount: 200.0,
    calc_type: "fixed",
    rate: null,
    frequency: "monthly",
    taxable: false,
    active: true,
    effective_from: "2025-01-01",
    notes: "AWS certification support",
  },
  {
    id: "B011",
    emp_id: "EMP002",
    category: "performance",
    name: "Tech Lead Bonus",
    amount: 1200.0,
    calc_type: "fixed",
    rate: null,
    frequency: "one_time",
    taxable: true,
    active: true,
    effective_from: "2025-02-28",
    notes: "RN migration project delivery",
  },
];

// ─────────────────────────────────────────────────────────────
//  CATEGORY META
// ─────────────────────────────────────────────────────────────
const DEDUCTION_CATEGORIES = {
  tax: { label: "Tax", icon: "receipt-outline", color: "#DC2626" },
  social_security: {
    label: "Social Security",
    icon: "shield-checkmark-outline",
    color: "#7C3AED",
  },
  insurance: { label: "Insurance", icon: "medkit-outline", color: "#0891B2" },
  loan: { label: "Loan / Advance", icon: "card-outline", color: "#D97706" },
  other: {
    label: "Other",
    icon: "ellipsis-horizontal-outline",
    color: "#64748B",
  },
  custom: { label: "Custom", icon: "build-outline", color: "#6366F1" },
};

const BENEFIT_CATEGORIES = {
  housing: { label: "Housing", icon: "home-outline", color: "#0A66C2" },
  transport: { label: "Transport", icon: "car-outline", color: "#0891B2" },
  meal: { label: "Meal", icon: "restaurant-outline", color: "#D97706" },
  medical: { label: "Medical", icon: "heart-outline", color: "#DB2777" },
  performance: {
    label: "Performance",
    icon: "trophy-outline",
    color: "#16A34A",
  },
  overtime: { label: "Overtime", icon: "time-outline", color: "#F59E0B" },
  custom: { label: "Custom", icon: "star-outline", color: "#6366F1" },
};

const FREQ_META = {
  monthly: { label: "Monthly", color: T.blue },
  one_time: { label: "One-time", color: T.purple },
  quarterly: { label: "Quarterly", color: T.teal },
  annual: { label: "Annual", color: T.orange },
};

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
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
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const fmt = (n) =>
  `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// ─────────────────────────────────────────────────────────────
//  STATS WIDGET
// ─────────────────────────────────────────────────────────────
const StatsWidget = ({ deductions, benefits, empId }) => {
  const d = empId
    ? deductions.filter((x) => x.emp_id === empId && x.active)
    : deductions.filter((x) => x.active);
  const b = empId
    ? benefits.filter((x) => x.emp_id === empId && x.active)
    : benefits.filter((x) => x.active);

  const totalDed = d.reduce((s, x) => s + x.amount, 0);
  const totalBen = b.reduce((s, x) => s + x.amount, 0);
  const net = totalBen - totalDed;

  return (
    <View style={sw.wrapper}>
      <View style={sw.hero}>
        <View style={sw.blob1} />
        <View style={sw.blob2} />
        <View style={sw.heroRow}>
          <View style={sw.heroLeft}>
            <Text style={sw.eyebrow}>DEDUCTIONS & BENEFITS</Text>
            <Text style={sw.heroNum}>{fmt(totalBen)}</Text>
            <View style={sw.heroBadges}>
              <View style={sw.heroBadge}>
                <Ionicons name="trending-up" size={10} color="#4ADE80" />
                <Text style={sw.heroBadgeTxt}>{b.length} active benefits</Text>
              </View>
              <View
                style={[
                  sw.heroBadge,
                  { backgroundColor: "rgba(239,68,68,0.15)" },
                ]}
              >
                <Ionicons name="trending-down" size={10} color="#F87171" />
                <Text style={[sw.heroBadgeTxt, { color: "#F87171" }]}>
                  {d.length} deductions
                </Text>
              </View>
            </View>
            <Text style={sw.heroSub}>
              Total benefits · {empId ? "selected employee" : "all employees"}
            </Text>
          </View>
          <View style={sw.heroRight}>
            <View style={sw.netCard}>
              <Text style={sw.netLabel}>Net Impact</Text>
              <Text
                style={[sw.netNum, { color: net >= 0 ? "#4ADE80" : "#F87171" }]}
              >
                {net >= 0 ? "+" : ""}
                {fmt(net)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Tiles */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sw.tilesRow}
      >
        {[
          {
            label: "Benefits",
            val: fmt(totalBen),
            icon: "trending-up",
            color: T.green,
          },
          {
            label: "Deductions",
            val: fmt(totalDed),
            icon: "trending-down",
            color: T.red,
          },
          {
            label: "Net",
            val: fmt(net),
            icon: "swap-vertical",
            color: net >= 0 ? T.green : T.red,
          },
          {
            label: "Ben. Items",
            val: b.length,
            icon: "gift-outline",
            color: T.blue,
          },
          {
            label: "Ded. Items",
            val: d.length,
            icon: "remove-circle-outline",
            color: T.orange,
          },
          {
            label: "Taxable Ben.",
            val: fmt(
              b.filter((x) => x.taxable).reduce((s, x) => s + x.amount, 0),
            ),
            icon: "receipt-outline",
            color: T.purple,
          },
        ].map((t) => (
          <View key={t.label} style={sw.tile}>
            <View style={[sw.tileIcon, { backgroundColor: t.color + "18" }]}>
              <Ionicons name={t.icon} size={13} color={t.color} />
            </View>
            <Text
              style={[
                sw.tileVal,
                { fontSize: typeof t.val === "number" ? 20 : 13 },
              ]}
            >
              {t.val}
            </Text>
            <Text style={sw.tileLbl}>{t.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const sw = StyleSheet.create({
  wrapper: { paddingHorizontal: 14, marginBottom: 10 },
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
    backgroundColor: "#16A34A",
    opacity: 0.08,
    top: -60,
    right: -40,
  },
  blob2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#DC2626",
    opacity: 0.07,
    bottom: -50,
    left: 30,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: { flex: 1, gap: 6 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1.5,
  },
  heroNum: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
    lineHeight: 38,
  },
  heroBadges: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(74,222,128,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroBadgeTxt: { fontSize: 10, color: "#4ADE80", fontWeight: "700" },
  heroSub: { fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: "500" },
  heroRight: { paddingLeft: 16 },
  netCard: {
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1.5,
    borderColor: "rgba(255,255,255,0.12)",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
    minWidth: 100,
  },
  netLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  netNum: { fontSize: 16, fontWeight: "900", letterSpacing: -0.5 },
  tilesRow: { gap: 8, paddingRight: 4 },
  tile: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
    minWidth: 88,
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
  tileVal: { fontWeight: "900", color: T.text, letterSpacing: -0.5 },
  tileLbl: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
});

// ─────────────────────────────────────────────────────────────
//  ITEM CARD (used for both deductions and benefits)
// ─────────────────────────────────────────────────────────────
const ItemCard = ({ item, type, onEdit, onDelete, onToggle }) => {
  const isDeduction = type === "deduction";
  const catMeta = isDeduction
    ? DEDUCTION_CATEGORIES[item.category] || DEDUCTION_CATEGORIES.custom
    : BENEFIT_CATEGORIES[item.category] || BENEFIT_CATEGORIES.custom;
  const freqMeta = FREQ_META[item.frequency] || FREQ_META.monthly;
  const emp = EMPLOYEES.find((e) => e.id === item.emp_id);

  return (
    <View style={[ic.card, !item.active && ic.cardInactive]}>
      {/* Color bar */}
      <View
        style={[
          ic.bar,
          { backgroundColor: item.active ? catMeta.color : "#CBD5E1" },
        ]}
      />

      <View style={ic.inner}>
        {/* Top */}
        <View style={ic.topRow}>
          {/* Category icon */}
          <View
            style={[
              ic.iconWrap,
              {
                backgroundColor: item.active ? catMeta.color + "15" : "#F1F5F9",
              },
            ]}
          >
            <Ionicons
              name={catMeta.icon}
              size={18}
              color={item.active ? catMeta.color : T.textMuted}
            />
          </View>

          <View style={ic.info}>
            <View style={ic.nameRow}>
              <Text
                style={[ic.name, !item.active && ic.nameInactive]}
                numberOfLines={1}
              >
                {item.name}
              </Text>
              {!item.active && (
                <View style={ic.inactivePill}>
                  <Text style={ic.inactiveTxt}>Inactive</Text>
                </View>
              )}
            </View>
            <View style={ic.metaRow}>
              {/* Employee */}
              {emp && (
                <View
                  style={[
                    ic.avatar,
                    { backgroundColor: avatarColor(emp.name) },
                  ]}
                >
                  <Text style={ic.avatarTxt}>{getInitials(emp.name)}</Text>
                </View>
              )}
              <Text style={ic.metaTxt}>{emp?.name || item.emp_id}</Text>
            </View>
          </View>

          {/* Amount */}
          <View style={ic.amountCol}>
            <Text style={[ic.amount, { color: isDeduction ? T.red : T.green }]}>
              {isDeduction ? "-" : "+"}
              {fmt(item.amount)}
            </Text>
            {item.calc_type === "percentage" && (
              <Text style={ic.rate}>{item.rate}%</Text>
            )}
          </View>
        </View>

        {/* Tags row */}
        <View style={ic.tagsRow}>
          {/* Category */}
          <View style={[ic.tag, { backgroundColor: catMeta.color + "12" }]}>
            <Text style={[ic.tagTxt, { color: catMeta.color }]}>
              {catMeta.label}
            </Text>
          </View>
          {/* Frequency */}
          <View style={[ic.tag, { backgroundColor: freqMeta.color + "12" }]}>
            <Ionicons name="repeat-outline" size={10} color={freqMeta.color} />
            <Text style={[ic.tagTxt, { color: freqMeta.color }]}>
              {freqMeta.label}
            </Text>
          </View>
          {/* Mandatory / Voluntary */}
          {isDeduction && (
            <View
              style={[
                ic.tag,
                { backgroundColor: item.mandatory ? T.redSoft : T.blueSoft },
              ]}
            >
              <Text
                style={[ic.tagTxt, { color: item.mandatory ? T.red : T.blue }]}
              >
                {item.mandatory ? "Mandatory" : "Voluntary"}
              </Text>
            </View>
          )}
          {/* Taxable (benefits) */}
          {!isDeduction && (
            <View
              style={[
                ic.tag,
                { backgroundColor: item.taxable ? T.orangeSoft : T.greenSoft },
              ]}
            >
              <Ionicons
                name={
                  item.taxable ? "receipt-outline" : "shield-checkmark-outline"
                }
                size={10}
                color={item.taxable ? T.orange : T.green}
              />
              <Text
                style={[
                  ic.tagTxt,
                  { color: item.taxable ? T.orange : T.green },
                ]}
              >
                {item.taxable ? "Taxable" : "Non-taxable"}
              </Text>
            </View>
          )}
          {/* Calc type */}
          <View style={[ic.tag, { backgroundColor: "#F1F5F9" }]}>
            <Text style={[ic.tagTxt, { color: T.textSub }]}>
              {item.calc_type === "percentage"
                ? `${item.rate}% of gross`
                : "Fixed"}
            </Text>
          </View>
        </View>

        {/* Notes */}
        {item.notes && (
          <View style={ic.notesRow}>
            <Ionicons
              name="information-circle-outline"
              size={12}
              color={T.textMuted}
            />
            <Text style={ic.notesTxt}>{item.notes}</Text>
          </View>
        )}

        {/* Effective from */}
        <View style={ic.dateRow}>
          <Ionicons name="calendar-outline" size={11} color={T.textMuted} />
          <Text style={ic.dateTxt}>Effective from {item.effective_from}</Text>
        </View>

        {/* Actions */}
        <View style={ic.actions}>
          <TouchableOpacity
            style={[ic.actionBtn, { backgroundColor: T.blueSoft }]}
            onPress={() => onEdit(item)}
          >
            <Ionicons name="create-outline" size={13} color={T.blue} />
            <Text style={[ic.actionTxt, { color: T.blue }]}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              ic.actionBtn,
              { backgroundColor: item.active ? T.orangeSoft : T.greenSoft },
            ]}
            onPress={() => onToggle(item.id)}
          >
            <Ionicons
              name={
                item.active ? "pause-circle-outline" : "play-circle-outline"
              }
              size={13}
              color={item.active ? T.orange : T.green}
            />
            <Text
              style={[
                ic.actionTxt,
                { color: item.active ? T.orange : T.green },
              ]}
            >
              {item.active ? "Deactivate" : "Activate"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[ic.actionBtn, { backgroundColor: T.redSoft }]}
            onPress={() => onDelete(item.id)}
          >
            <Ionicons name="trash-outline" size={13} color={T.red} />
            <Text style={[ic.actionTxt, { color: T.red }]}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const ic = StyleSheet.create({
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
  cardInactive: { opacity: 0.65 },
  bar: { width: 4 },
  inner: { flex: 1, padding: 13, gap: 9 },

  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: { fontSize: 14, fontWeight: "700", color: T.text, flex: 1 },
  nameInactive: { color: T.textMuted },
  inactivePill: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  inactiveTxt: { fontSize: 9, color: T.textMuted, fontWeight: "700" },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 6, marginTop: 3 },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 7, fontWeight: "900", color: "#fff" },
  metaTxt: { fontSize: 11, color: T.textMuted, fontWeight: "500" },

  amountCol: { alignItems: "flex-end" },
  amount: { fontSize: 16, fontWeight: "900", letterSpacing: -0.5 },
  rate: { fontSize: 10, color: T.textMuted, fontWeight: "600" },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagTxt: { fontSize: 10, fontWeight: "700" },

  notesRow: { flexDirection: "row", alignItems: "flex-start", gap: 5 },
  notesTxt: { flex: 1, fontSize: 11, color: T.textSub, lineHeight: 16 },

  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateTxt: { fontSize: 10, color: T.textMuted, fontWeight: "500" },

  actions: {
    flexDirection: "row",
    gap: 7,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 7,
    borderRadius: 10,
  },
  actionTxt: { fontSize: 11, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────
//  EMPLOYEE SUMMARY CARD (for "By Employee" view)
// ─────────────────────────────────────────────────────────────
const EmployeeSummaryCard = ({
  emp,
  deductions,
  benefits,
  onExpand,
  expanded,
}) => {
  const totalDed = deductions
    .filter((d) => d.active)
    .reduce((s, d) => s + d.amount, 0);
  const totalBen = benefits
    .filter((b) => b.active)
    .reduce((s, b) => s + b.amount, 0);
  const net = totalBen - totalDed;
  const color = avatarColor(emp.name);

  return (
    <View style={es.card}>
      {/* Header */}
      <TouchableOpacity
        style={es.header}
        onPress={onExpand}
        activeOpacity={0.85}
      >
        <View style={[es.avatar, { backgroundColor: color }]}>
          <Text style={es.avatarTxt}>{getInitials(emp.name)}</Text>
        </View>
        <View style={es.headerInfo}>
          <Text style={es.name}>{emp.name}</Text>
          <Text style={es.sub}>
            {emp.role} · {emp.department}
          </Text>
        </View>
        <Ionicons
          name={expanded ? "chevron-up" : "chevron-down"}
          size={16}
          color={T.textMuted}
        />
      </TouchableOpacity>

      {/* Summary totals */}
      <View style={es.totals}>
        {[
          { label: "Benefits", val: fmt(totalBen), color: T.green },
          { label: "Deductions", val: fmt(totalDed), color: T.red },
          { label: "Net", val: fmt(net), color: net >= 0 ? T.green : T.red },
        ].map((s, i) => (
          <View key={s.label} style={[es.totalCell, i < 2 && es.totalBorder]}>
            <Text style={[es.totalVal, { color: s.color }]}>{s.val}</Text>
            <Text style={es.totalLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Quick breakdown bars */}
      {[
        { label: "Benefits", items: benefits, color: T.green },
        { label: "Deductions", items: deductions, color: T.red },
      ].map((group) => (
        <View key={group.label} style={es.breakdownGroup}>
          <Text style={es.breakdownTitle}>{group.label}</Text>
          {group.items
            .filter((x) => x.active)
            .map((item) => {
              const catMeta =
                group.label === "Benefits"
                  ? BENEFIT_CATEGORIES[item.category] ||
                    BENEFIT_CATEGORIES.custom
                  : DEDUCTION_CATEGORIES[item.category] ||
                    DEDUCTION_CATEGORIES.custom;
              const total = group.items
                .filter((x) => x.active)
                .reduce((s, x) => s + x.amount, 0);
              const pct = total > 0 ? (item.amount / total) * 100 : 0;
              return (
                <View key={item.id} style={es.breakRow}>
                  <View
                    style={[
                      es.breakIcon,
                      { backgroundColor: catMeta.color + "15" },
                    ]}
                  >
                    <Ionicons
                      name={catMeta.icon}
                      size={11}
                      color={catMeta.color}
                    />
                  </View>
                  <Text style={es.breakName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={es.breakAmt}>{fmt(item.amount)}</Text>
                  <View style={es.miniTrack}>
                    <View
                      style={[
                        es.miniFill,
                        { width: `${pct}%`, backgroundColor: catMeta.color },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
        </View>
      ))}
    </View>
  );
};

const es = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
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
  header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 14, fontWeight: "800", color: "#fff" },
  headerInfo: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: T.text },
  sub: { fontSize: 11, color: T.textMuted, marginTop: 2 },

  totals: {
    flexDirection: "row",
    backgroundColor: T.bg,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: T.border,
  },
  totalCell: { flex: 1, alignItems: "center", paddingVertical: 10 },
  totalBorder: { borderRightWidth: 1, borderRightColor: T.border },
  totalVal: { fontSize: 14, fontWeight: "900", letterSpacing: -0.5 },
  totalLbl: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "600",
    marginTop: 1,
    textTransform: "uppercase",
  },

  breakdownGroup: {
    paddingHorizontal: 13,
    paddingTop: 10,
    paddingBottom: 4,
    gap: 7,
  },
  breakdownTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  breakRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  breakIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  breakName: { flex: 1, fontSize: 11, fontWeight: "600", color: T.textSub },
  breakAmt: {
    fontSize: 11,
    fontWeight: "800",
    color: T.text,
    width: 60,
    textAlign: "right",
  },
  miniTrack: {
    width: 50,
    height: 5,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  miniFill: { height: "100%", borderRadius: 3 },
});

// ─────────────────────────────────────────────────────────────
//  ADD / EDIT MODAL
// ─────────────────────────────────────────────────────────────
const AddEditModal = ({ visible, type, item, onClose, onSave }) => {
  const isDeduction = type === "deduction";
  const categories = isDeduction ? DEDUCTION_CATEGORIES : BENEFIT_CATEGORIES;
  const [form, setForm] = useState({
    name: item?.name || "",
    category: item?.category || Object.keys(categories)[0],
    amount: item?.amount?.toString() || "",
    calc_type: item?.calc_type || "fixed",
    rate: item?.rate?.toString() || "",
    frequency: item?.frequency || "monthly",
    mandatory: item?.mandatory ?? true,
    taxable: item?.taxable ?? false,
    emp_id: item?.emp_id || EMPLOYEES[0].id,
    notes: item?.notes || "",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={am.overlay}>
        <View style={am.sheet}>
          <View style={am.handle} />
          <View style={am.header}>
            <TouchableOpacity onPress={onClose} style={am.closeBtn}>
              <Ionicons name="close" size={18} color={T.textSub} />
            </TouchableOpacity>
            <Text style={am.headerTitle}>
              {item ? "Edit" : "Add"} {isDeduction ? "Deduction" : "Benefit"}
            </Text>
            <TouchableOpacity
              style={am.saveBtn}
              onPress={() => {
                onSave(form);
                onClose();
              }}
            >
              <Text style={am.saveTxt}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ padding: 20 }}
          >
            {/* Employee */}
            <Text style={am.label}>Employee</Text>
            <View style={am.empRow}>
              {EMPLOYEES.map((e) => (
                <TouchableOpacity
                  key={e.id}
                  style={[am.empChip, form.emp_id === e.id && am.empChipActive]}
                  onPress={() => set("emp_id", e.id)}
                >
                  <View
                    style={[
                      am.empAvatar,
                      { backgroundColor: avatarColor(e.name) },
                    ]}
                  >
                    <Text style={am.empAvatarTxt}>{getInitials(e.name)}</Text>
                  </View>
                  <Text
                    style={[
                      am.empChipTxt,
                      form.emp_id === e.id && am.empChipTxtActive,
                    ]}
                  >
                    {e.name.split(" ")[0]}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Name */}
            <Text style={am.label}>Name *</Text>
            <TextInput
              style={am.input}
              value={form.name}
              onChangeText={(v) => set("name", v)}
              placeholder="e.g. Income Tax"
              placeholderTextColor={T.textMuted}
            />

            {/* Category */}
            <Text style={am.label}>Category</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 7, paddingBottom: 4 }}
            >
              {Object.entries(categories).map(([key, meta]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    am.catChip,
                    form.category === key && {
                      backgroundColor: meta.color,
                      borderColor: meta.color,
                    },
                  ]}
                  onPress={() => set("category", key)}
                >
                  <Ionicons
                    name={meta.icon}
                    size={12}
                    color={form.category === key ? "#fff" : meta.color}
                  />
                  <Text
                    style={[
                      am.catChipTxt,
                      form.category === key && { color: "#fff" },
                    ]}
                  >
                    {meta.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Calculation type */}
            <Text style={am.label}>Calculation Type</Text>
            <View style={am.toggleRow}>
              {[
                { key: "fixed", label: "Fixed Amount" },
                { key: "percentage", label: "% of Gross" },
              ].map((opt) => (
                <TouchableOpacity
                  key={opt.key}
                  style={[
                    am.toggleBtn,
                    form.calc_type === opt.key && am.toggleBtnActive,
                  ]}
                  onPress={() => set("calc_type", opt.key)}
                >
                  <Text
                    style={[
                      am.toggleTxt,
                      form.calc_type === opt.key && am.toggleTxtActive,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Amount / Rate */}
            <Text style={am.label}>
              {form.calc_type === "percentage" ? "Rate (%)" : "Amount ($)"}
            </Text>
            <TextInput
              style={am.input}
              value={form.calc_type === "percentage" ? form.rate : form.amount}
              onChangeText={(v) =>
                set(form.calc_type === "percentage" ? "rate" : "amount", v)
              }
              placeholder={
                form.calc_type === "percentage" ? "e.g. 18" : "e.g. 200.00"
              }
              placeholderTextColor={T.textMuted}
              keyboardType="numeric"
            />

            {/* Frequency */}
            <Text style={am.label}>Frequency</Text>
            <View style={am.freqRow}>
              {Object.entries(FREQ_META).map(([key, meta]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    am.freqChip,
                    form.frequency === key && {
                      backgroundColor: meta.color,
                      borderColor: meta.color,
                    },
                  ]}
                  onPress={() => set("frequency", key)}
                >
                  <Text
                    style={[
                      am.freqTxt,
                      form.frequency === key && { color: "#fff" },
                    ]}
                  >
                    {meta.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Mandatory toggle (deductions) */}
            {isDeduction && (
              <>
                <Text style={am.label}>Type</Text>
                <View style={am.toggleRow}>
                  {[
                    { key: true, label: "Mandatory" },
                    { key: false, label: "Voluntary" },
                  ].map((opt) => (
                    <TouchableOpacity
                      key={String(opt.key)}
                      style={[
                        am.toggleBtn,
                        form.mandatory === opt.key && am.toggleBtnActive,
                      ]}
                      onPress={() => set("mandatory", opt.key)}
                    >
                      <Text
                        style={[
                          am.toggleTxt,
                          form.mandatory === opt.key && am.toggleTxtActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Taxable toggle (benefits) */}
            {!isDeduction && (
              <>
                <Text style={am.label}>Taxability</Text>
                <View style={am.toggleRow}>
                  {[
                    { key: false, label: "Non-taxable" },
                    { key: true, label: "Taxable" },
                  ].map((opt) => (
                    <TouchableOpacity
                      key={String(opt.key)}
                      style={[
                        am.toggleBtn,
                        form.taxable === opt.key && am.toggleBtnActive,
                      ]}
                      onPress={() => set("taxable", opt.key)}
                    >
                      <Text
                        style={[
                          am.toggleTxt,
                          form.taxable === opt.key && am.toggleTxtActive,
                        ]}
                      >
                        {opt.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {/* Notes */}
            <Text style={am.label}>Notes</Text>
            <TextInput
              style={[am.input, { height: 80, textAlignVertical: "top" }]}
              value={form.notes}
              onChangeText={(v) => set("notes", v)}
              placeholder="Optional notes…"
              placeholderTextColor={T.textMuted}
              multiline
            />
            <View style={{ height: 20 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const am = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "95%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: T.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    backgroundColor: T.blue,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 10,
  },
  saveTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: T.text,
    marginTop: 14,
    marginBottom: 7,
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: T.text,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  empRow: { flexDirection: "row", gap: 8 },
  empChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
  },
  empChipActive: { borderColor: T.blue, backgroundColor: T.blueSoft },
  empAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  empAvatarTxt: { fontSize: 9, fontWeight: "900", color: "#fff" },
  empChipTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  empChipTxtActive: { color: T.blue, fontWeight: "700" },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
  },
  catChipTxt: { fontSize: 11, fontWeight: "600", color: T.textSub },
  toggleRow: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 9,
    borderRadius: 9,
  },
  toggleBtnActive: { backgroundColor: T.blue },
  toggleTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  toggleTxtActive: { color: "#fff", fontWeight: "700" },
  freqRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  freqChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
  },
  freqTxt: { fontSize: 11, fontWeight: "600", color: T.textSub },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
const TABS = ["Overview", "Deductions", "Benefits"];
const VIEW_MODES = ["All Items", "By Employee"];

export default function DeductionsBenefitsScreen() {
  const [deductions, setDeductions] = useState(MOCK_DEDUCTIONS);
  const [benefits, setBenefits] = useState(MOCK_BENEFITS);
  const [activeTab, setActiveTab] = useState("Overview");
  const [viewMode, setViewMode] = useState("By Employee");
  const [empFilter, setEmpFilter] = useState("");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [addModal, setAddModal] = useState(null); // null | "deduction" | "benefit"
  const [editItem, setEditItem] = useState(null);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  const handleToggle = useCallback((id, isDeduction) => {
    const setter = isDeduction ? setDeductions : setBenefits;
    setter((prev) =>
      prev.map((x) => (x.id === id ? { ...x, active: !x.active } : x)),
    );
  }, []);

  const handleDelete = useCallback((id, isDeduction) => {
    Alert.alert(
      "Delete Item",
      "Are you sure you want to delete this item? This cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const setter = isDeduction ? setDeductions : setBenefits;
            setter((prev) => prev.filter((x) => x.id !== id));
          },
        },
      ],
    );
  }, []);

  const handleSave = useCallback(
    (form, isDeduction) => {
      const setter = isDeduction ? setDeductions : setBenefits;
      if (editItem) {
        setter((prev) =>
          prev.map((x) =>
            x.id === editItem.id
              ? {
                  ...x,
                  ...form,
                  amount: parseFloat(form.amount) || 0,
                  rate: parseFloat(form.rate) || null,
                }
              : x,
          ),
        );
      } else {
        const newId = `${isDeduction ? "D" : "B"}${Date.now()}`;
        setter((prev) => [
          ...prev,
          {
            id: newId,
            active: true,
            effective_from: new Date().toISOString().split("T")[0],
            ...form,
            amount: parseFloat(form.amount) || 0,
            rate: parseFloat(form.rate) || null,
          },
        ]);
      }
      setEditItem(null);
    },
    [editItem],
  );

  // Filter helpers
  const filterItems = useCallback(
    (items) => {
      let d = [...items];
      if (empFilter) d = d.filter((x) => x.emp_id === empFilter);
      if (!showInactive) d = d.filter((x) => x.active);
      if (search.trim()) {
        const q = search.toLowerCase();
        d = d.filter(
          (x) =>
            x.name.toLowerCase().includes(q) ||
            x.category.toLowerCase().includes(q),
        );
      }
      return d;
    },
    [empFilter, showInactive, search],
  );

  const filteredDeductions = useMemo(
    () => filterItems(deductions),
    [deductions, filterItems],
  );
  const filteredBenefits = useMemo(
    () => filterItems(benefits),
    [benefits, filterItems],
  );

  // Grouped by employee for overview
  const employeeGroups = useMemo(() => {
    return EMPLOYEES.map((emp) => ({
      emp,
      deductions: deductions.filter((d) => d.emp_id === emp.id),
      benefits: benefits.filter((b) => b.emp_id === emp.id),
    }));
  }, [deductions, benefits]);

  const ListHeader = () => (
    <>
      {/* Title */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Deductions & Benefits</Text>
          <Text style={s.pageSub}>
            {EMPLOYEES.length} employees · {deductions.length + benefits.length}{" "}
            items
          </Text>
        </View>
        <View style={s.addBtns}>
          <TouchableOpacity
            style={[s.addBtn, { backgroundColor: T.redSoft }]}
            onPress={() => {
              setEditItem(null);
              setAddModal("deduction");
            }}
          >
            <Ionicons name="remove-circle-outline" size={14} color={T.red} />
            <Text style={[s.addBtnTxt, { color: T.red }]}>Deduction</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.addBtn, { backgroundColor: T.greenSoft }]}
            onPress={() => {
              setEditItem(null);
              setAddModal("benefit");
            }}
          >
            <Ionicons name="add-circle-outline" size={14} color={T.green} />
            <Text style={[s.addBtnTxt, { color: T.green }]}>Benefit</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <StatsWidget
        deductions={deductions}
        benefits={benefits}
        empId={empFilter}
      />

      {/* Tabs */}
      <View style={s.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeTab === tab && s.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text style={[s.tabTxt, activeTab === tab && s.tabTxtActive]}>
              {tab}
            </Text>
            {tab !== "Overview" && (
              <View style={[s.tabBadge, activeTab === tab && s.tabBadgeActive]}>
                <Text
                  style={[
                    s.tabBadgeTxt,
                    activeTab === tab && s.tabBadgeTxtActive,
                  ]}
                >
                  {tab === "Deductions"
                    ? filteredDeductions.length
                    : filteredBenefits.length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Controls */}
      {activeTab !== "Overview" && (
        <>
          {/* View mode */}
          <View style={s.modeToggle}>
            {VIEW_MODES.map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[s.modeBtn, viewMode === mode && s.modeBtnActive]}
                onPress={() => setViewMode(mode)}
              >
                <Ionicons
                  name={
                    mode === "All Items" ? "list-outline" : "people-outline"
                  }
                  size={12}
                  color={viewMode === mode ? "#fff" : T.textSub}
                />
                <Text style={[s.modeTxt, viewMode === mode && s.modeTxtActive]}>
                  {mode}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Search */}
          <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
            <Ionicons
              name="search-outline"
              size={15}
              color={searchFocused ? T.blue : T.textMuted}
            />
            <TextInput
              style={s.searchInput}
              placeholder="Search name, category…"
              placeholderTextColor={T.textMuted}
              value={search}
              onChangeText={setSearch}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={15} color={T.textMuted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Employee filter + inactive toggle */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.filterChips}
          >
            <TouchableOpacity
              style={[s.chip, !empFilter && s.chipActive]}
              onPress={() => setEmpFilter("")}
            >
              <Text style={[s.chipTxt, !empFilter && s.chipTxtActive]}>
                All Employees
              </Text>
            </TouchableOpacity>
            {EMPLOYEES.map((e) => {
              const active = empFilter === e.id;
              return (
                <TouchableOpacity
                  key={e.id}
                  style={[s.chip, active && s.chipActive]}
                  onPress={() => setEmpFilter(active ? "" : e.id)}
                >
                  <View
                    style={[
                      s.chipAvatar,
                      { backgroundColor: avatarColor(e.name) },
                    ]}
                  >
                    <Text style={s.chipAvatarTxt}>{getInitials(e.name)}</Text>
                  </View>
                  <Text style={[s.chipTxt, active && s.chipTxtActive]}>
                    {e.name.split(" ")[0]}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              style={[
                s.chip,
                showInactive && {
                  backgroundColor: T.orange,
                  borderColor: T.orange,
                },
              ]}
              onPress={() => setShowInactive((p) => !p)}
            >
              <Ionicons
                name="eye-outline"
                size={11}
                color={showInactive ? "#fff" : T.textMuted}
              />
              <Text style={[s.chipTxt, showInactive && { color: "#fff" }]}>
                Show Inactive
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      )}
    </>
  );

  // ── Render by tab ──
  const renderDeduction = ({ item }) => (
    <ItemCard
      item={item}
      type="deduction"
      onEdit={(i) => {
        setEditItem(i);
        setAddModal("deduction");
      }}
      onDelete={(id) => handleDelete(id, true)}
      onToggle={(id) => handleToggle(id, true)}
    />
  );

  const renderBenefit = ({ item }) => (
    <ItemCard
      item={item}
      type="benefit"
      onEdit={(i) => {
        setEditItem(i);
        setAddModal("benefit");
      }}
      onDelete={(id) => handleDelete(id, false)}
      onToggle={(id) => handleToggle(id, false)}
    />
  );

  const renderOverviewCard = ({ item }) => (
    <EmployeeSummaryCard
      emp={item.emp}
      deductions={item.deductions}
      benefits={item.benefits}
      expanded
      onExpand={() => {}}
    />
  );

  const listData =
    activeTab === "Overview"
      ? employeeGroups
      : activeTab === "Deductions"
        ? filteredDeductions
        : filteredBenefits;

  const renderItem =
    activeTab === "Overview"
      ? renderOverviewCard
      : activeTab === "Deductions"
        ? renderDeduction
        : renderBenefit;

  const keyExtractor = (item, i) =>
    activeTab === "Overview"
      ? item.emp.id
      : item.id?.toString() || i.toString();

  const isDeductionModal = addModal === "deduction";

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      <FlatList
        data={listData}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[T.blue]}
            tintColor={T.blue}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          activeTab !== "Overview" ? (
            <View style={s.empty}>
              <Ionicons
                name={
                  activeTab === "Deductions"
                    ? "remove-circle-outline"
                    : "gift-outline"
                }
                size={52}
                color="#CBD5E1"
              />
              <Text style={s.emptyTxt}>No {activeTab.toLowerCase()} found</Text>
              <Text style={s.emptySub}>Add one using the button above.</Text>
            </View>
          ) : null
        }
      />

      {/* Add/Edit Modal */}
      <AddEditModal
        visible={!!addModal}
        type={addModal || "deduction"}
        item={editItem}
        onClose={() => {
          setAddModal(null);
          setEditItem(null);
        }}
        onSave={(form) => handleSave(form, isDeductionModal)}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  listContent: { padding: 14, paddingTop: 0, paddingBottom: 40 },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 12,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  addBtns: { flexDirection: "row", gap: 7 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 10,
  },
  addBtnTxt: { fontSize: 12, fontWeight: "700" },

  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 4,
    gap: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
  },
  tabActive: { backgroundColor: T.navy },
  tabTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  tabTxtActive: { color: "#fff", fontWeight: "700" },
  tabBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 18,
    alignItems: "center",
  },
  tabBadgeActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  tabBadgeTxt: { fontSize: 9, fontWeight: "800", color: T.textMuted },
  tabBadgeTxtActive: { color: "#fff" },

  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 3,
    gap: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 7,
    borderRadius: 9,
  },
  modeBtnActive: { backgroundColor: T.navy },
  modeTxt: { fontSize: 11, fontWeight: "600", color: T.textSub },
  modeTxtActive: { color: "#fff", fontWeight: "700" },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 46,
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

  filterChips: {
    gap: 7,
    marginBottom: 10,
    paddingRight: 4,
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.border,
  },
  chipActive: { backgroundColor: T.blue, borderColor: T.blue },
  chipTxt: { fontSize: 11, fontWeight: "600", color: T.textSub },
  chipTxtActive: { color: "#fff", fontWeight: "700" },
  chipAvatar: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chipAvatarTxt: { fontSize: 6, fontWeight: "900", color: "#fff" },

  empty: { padding: 48, alignItems: "center", gap: 10 },
  emptyTxt: { fontSize: 15, color: T.textMuted, fontWeight: "700" },
  emptySub: { fontSize: 13, color: "#CBD5E1", textAlign: "center" },
});
