import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
  FlatList,
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
//  THEME — matches established HRM app palette
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
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA — 2 employees, multiple leave types
// ─────────────────────────────────────────────────────────────
const MOCK_BALANCES = [
  // James Rodriguez
  {
    id: 1,
    emp_id: "EMP001",
    name: "James Rodriguez",
    department: "Marketing",
    leave_type: "Annual Leave",
    entitled: 20,
    utilized: 7,
    balanced: 13,
    carried_forward: 3,
    pending_approval: 1,
    doj: "2021-03-15",
    year: 2025,
  },
  {
    id: 2,
    emp_id: "EMP001",
    name: "James Rodriguez",
    department: "Marketing",
    leave_type: "Sick Leave",
    entitled: 10,
    utilized: 3,
    balanced: 7,
    carried_forward: 0,
    pending_approval: 0,
    doj: "2021-03-15",
    year: 2025,
  },
  {
    id: 3,
    emp_id: "EMP001",
    name: "James Rodriguez",
    department: "Marketing",
    leave_type: "Casual Leave",
    entitled: 6,
    utilized: 6,
    balanced: 0,
    carried_forward: 0,
    pending_approval: 0,
    doj: "2021-03-15",
    year: 2025,
  },
  {
    id: 4,
    emp_id: "EMP001",
    name: "James Rodriguez",
    department: "Marketing",
    leave_type: "Maternity Leave",
    entitled: 0,
    utilized: 0,
    balanced: 0,
    carried_forward: 0,
    pending_approval: 0,
    doj: "2021-03-15",
    year: 2025,
  },
  // Sarah Mitchell
  {
    id: 5,
    emp_id: "EMP002",
    name: "Sarah Mitchell",
    department: "Engineering",
    leave_type: "Annual Leave",
    entitled: 20,
    utilized: 14,
    balanced: 6,
    carried_forward: 5,
    pending_approval: 2,
    doj: "2020-07-01",
    year: 2025,
  },
  {
    id: 6,
    emp_id: "EMP002",
    name: "Sarah Mitchell",
    department: "Engineering",
    leave_type: "Sick Leave",
    entitled: 10,
    utilized: 9,
    balanced: 1,
    carried_forward: 0,
    pending_approval: 0,
    doj: "2020-07-01",
    year: 2025,
  },
  {
    id: 7,
    emp_id: "EMP002",
    name: "Sarah Mitchell",
    department: "Engineering",
    leave_type: "Casual Leave",
    entitled: 6,
    utilized: 2,
    balanced: 4,
    carried_forward: 0,
    pending_approval: 1,
    doj: "2020-07-01",
    year: 2025,
  },
  {
    id: 8,
    emp_id: "EMP002",
    name: "Sarah Mitchell",
    department: "Engineering",
    leave_type: "Study Leave",
    entitled: 5,
    utilized: 5,
    balanced: 0,
    carried_forward: 0,
    pending_approval: 0,
    doj: "2020-07-01",
    year: 2025,
  },
];

const MOCK_STATS = {
  total_employees: 2,
  total_entitled: 77,
  total_utilized: 46,
  total_remaining: 31,
  avg_utilization: 60,
};

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const LEAVE_TYPE_META = {
  "Annual Leave": { color: "#0A66C2", icon: "sunny-outline" },
  "Sick Leave": { color: "#DC2626", icon: "medical-outline" },
  "Casual Leave": { color: "#7C3AED", icon: "cafe-outline" },
  "Maternity Leave": { color: "#DB2777", icon: "heart-outline" },
  "Paternity Leave": { color: "#0891B2", icon: "person-outline" },
  "Study Leave": { color: "#D97706", icon: "book-outline" },
  "Unpaid Leave": { color: "#64748B", icon: "ban-outline" },
};

const getTypeMeta = (type) =>
  LEAVE_TYPE_META[type] || { color: "#6366F1", icon: "calendar-outline" };

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

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const utilizationColor = (pct) => {
  if (pct >= 90) return T.red;
  if (pct >= 60) return T.orange;
  return T.green;
};

const utilizationBg = (pct) => {
  if (pct >= 90) return T.redSoft;
  if (pct >= 60) return T.orangeSoft;
  return T.greenSoft;
};

// ─────────────────────────────────────────────────────────────
//  STATS WIDGET
// ─────────────────────────────────────────────────────────────
const StatsWidget = ({ stats }) => {
  const tiles = [
    {
      val: stats.total_employees,
      label: "Employees",
      icon: "people",
      color: T.blue,
    },
    {
      val: stats.total_entitled,
      label: "Entitled",
      icon: "calendar",
      color: T.purple,
    },
    {
      val: stats.total_utilized,
      label: "Utilized",
      icon: "exit-outline",
      color: T.red,
    },
    {
      val: stats.total_remaining,
      label: "Remaining",
      icon: "leaf",
      color: T.green,
    },
    {
      val: `${stats.avg_utilization}%`,
      label: "Avg Used",
      icon: "analytics",
      color: T.orange,
    },
  ];

  return (
    <View style={sw.wrapper}>
      {/* Dark hero */}
      <View style={sw.hero}>
        <View style={sw.blob1} />
        <View style={sw.blob2} />
        <View style={sw.heroRow}>
          <View style={sw.heroLeft}>
            <Text style={sw.eyebrow}>LEAVE BALANCE</Text>
            <Text style={sw.heroNum}>{stats.total_entitled}</Text>
            <View style={sw.heroBadges}>
              <View style={sw.heroBadge}>
                <Ionicons name="leaf" size={10} color="#4ADE80" />
                <Text style={sw.heroBadgeTxt}>
                  {stats.total_remaining} days remaining
                </Text>
              </View>
              <View
                style={[
                  sw.heroBadge,
                  { backgroundColor: "rgba(251,191,36,0.12)" },
                ]}
              >
                <Ionicons name="analytics" size={10} color="#FBBF24" />
                <Text style={[sw.heroBadgeTxt, { color: "#FBBF24" }]}>
                  {stats.avg_utilization}% avg utilization
                </Text>
              </View>
            </View>
            <Text style={sw.heroSub}>
              Total entitled days · {stats.total_employees} employees
            </Text>
          </View>
          <View style={sw.heroRight}>
            {/* Donut-style utilization ring */}
            <View style={sw.ringWrap}>
              <Text style={sw.ringNum}>{stats.total_utilized}</Text>
              <Text style={sw.ringLabel}>Used</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stat tiles */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sw.tilesRow}
      >
        {tiles.map((t) => (
          <View key={t.label} style={sw.tile}>
            <View style={[sw.tileIcon, { backgroundColor: t.color + "18" }]}>
              <Ionicons name={t.icon} size={14} color={t.color} />
            </View>
            <Text style={sw.tileVal}>{t.val}</Text>
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
    backgroundColor: "#0A66C2",
    opacity: 0.1,
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
    fontSize: 50,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 54,
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
    minWidth: 76,
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
    fontSize: 18,
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
//  USAGE BAR
// ─────────────────────────────────────────────────────────────
const UsageBar = ({ utilized, entitled }) => {
  const pct = entitled > 0 ? Math.min((utilized / entitled) * 100, 100) : 0;
  const color = utilizationColor(pct);
  return (
    <View style={ub.wrap}>
      <View style={ub.track}>
        <View style={[ub.fill, { width: `${pct}%`, backgroundColor: color }]} />
      </View>
      <Text style={[ub.pct, { color }]}>{Math.round(pct)}%</Text>
    </View>
  );
};

const ub = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  track: {
    flex: 1,
    height: 6,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3 },
  pct: { fontSize: 11, fontWeight: "800", width: 34, textAlign: "right" },
});

// ─────────────────────────────────────────────────────────────
//  LEAVE BALANCE CARD
// ─────────────────────────────────────────────────────────────
const BalanceCard = ({ item }) => {
  const [expanded, setExpanded] = useState(false);
  const meta = getTypeMeta(item.leave_type);
  const pct =
    item.entitled > 0
      ? Math.min((item.utilized / item.entitled) * 100, 100)
      : 0;
  const color = avatarColor(item.name);
  const isExhausted = item.balanced === 0 && item.entitled > 0;
  const isPending = item.pending_approval > 0;

  return (
    <TouchableOpacity
      style={[bc.card, isExhausted && bc.cardExhausted]}
      onPress={() => setExpanded((p) => !p)}
      activeOpacity={0.88}
    >
      {/* Color bar */}
      <View style={[bc.bar, { backgroundColor: meta.color }]} />

      <View style={bc.inner}>
        {/* Top row */}
        <View style={bc.topRow}>
          {/* Avatar */}
          <View style={[bc.avatar, { backgroundColor: color }]}>
            <Text style={bc.avatarTxt}>{getInitials(item.name)}</Text>
          </View>

          {/* Info */}
          <View style={bc.info}>
            <Text style={bc.name} numberOfLines={1}>
              {item.name}
            </Text>
            <View style={bc.metaRow}>
              <Text style={bc.metaTxt}>{item.emp_id}</Text>
              <View style={bc.metaDot} />
              <Text style={bc.metaTxt}>{item.department}</Text>
            </View>
          </View>

          {/* Leave type badge */}
          <View style={[bc.typeBadge, { backgroundColor: meta.color + "15" }]}>
            <Ionicons name={meta.icon} size={11} color={meta.color} />
            <Text style={[bc.typeTxt, { color: meta.color }]} numberOfLines={1}>
              {item.leave_type}
            </Text>
          </View>
        </View>

        {/* Usage bar */}
        <View style={bc.barSection}>
          <View style={bc.barHeader}>
            <Text style={bc.barLabel}>Utilization</Text>
            <Text style={bc.barSub}>
              {item.utilized} of {item.entitled} days
            </Text>
          </View>
          <UsageBar utilized={item.utilized} entitled={item.entitled} />
        </View>

        {/* Stats grid */}
        <View style={bc.statsRow}>
          {[
            { label: "Entitled", val: item.entitled, color: T.blue },
            { label: "Utilized", val: item.utilized, color: T.red },
            { label: "Remaining", val: item.balanced, color: T.green },
            { label: "Carried", val: item.carried_forward, color: T.orange },
          ].map((st, i) => (
            <View key={st.label} style={[bc.statCell, i < 3 && bc.statBorder]}>
              <Text style={[bc.statVal, { color: st.color }]}>{st.val}</Text>
              <Text style={bc.statLbl}>{st.label}</Text>
            </View>
          ))}
        </View>

        {/* Status flags */}
        {(isExhausted || isPending || item.carried_forward > 0) && (
          <View style={bc.flagsRow}>
            {isExhausted && (
              <View style={[bc.flag, { backgroundColor: T.redSoft }]}>
                <Ionicons name="alert-circle" size={11} color={T.red} />
                <Text style={[bc.flagTxt, { color: T.red }]}>
                  Leave Exhausted
                </Text>
              </View>
            )}
            {isPending && (
              <View style={[bc.flag, { backgroundColor: T.orangeSoft }]}>
                <Ionicons name="time-outline" size={11} color={T.orange} />
                <Text style={[bc.flagTxt, { color: T.orange }]}>
                  {item.pending_approval} Pending
                </Text>
              </View>
            )}
            {item.carried_forward > 0 && (
              <View style={[bc.flag, { backgroundColor: T.purpleSoft }]}>
                <Ionicons
                  name="arrow-forward-circle-outline"
                  size={11}
                  color={T.purple}
                />
                <Text style={[bc.flagTxt, { color: T.purple }]}>
                  {item.carried_forward}d Carried
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Expand toggle */}
        {expanded && (
          <View style={bc.expandSection}>
            <View style={bc.expandRow}>
              <Ionicons name="calendar-outline" size={13} color={T.textMuted} />
              <Text style={bc.expandLabel}>Date of Joining</Text>
              <Text style={bc.expandVal}>{item.doj}</Text>
            </View>
            <View style={bc.expandRow}>
              <Ionicons
                name="trending-up-outline"
                size={13}
                color={T.textMuted}
              />
              <Text style={bc.expandLabel}>Utilization Rate</Text>
              <Text
                style={[
                  bc.expandVal,
                  { color: utilizationColor(pct), fontWeight: "800" },
                ]}
              >
                {Math.round(pct)}%
              </Text>
            </View>
            <View style={bc.expandRow}>
              <Ionicons name="time-outline" size={13} color={T.textMuted} />
              <Text style={bc.expandLabel}>Pending Approval</Text>
              <Text style={bc.expandVal}>{item.pending_approval} days</Text>
            </View>
            <View style={bc.expandRow}>
              <Ionicons
                name="swap-horizontal-outline"
                size={13}
                color={T.textMuted}
              />
              <Text style={bc.expandLabel}>Carried Forward</Text>
              <Text style={bc.expandVal}>{item.carried_forward} days</Text>
            </View>
            <View style={bc.expandRow}>
              <Ionicons name="business-outline" size={13} color={T.textMuted} />
              <Text style={bc.expandLabel}>Year</Text>
              <Text style={bc.expandVal}>{item.year}</Text>
            </View>
          </View>
        )}

        {/* Footer */}
        <View style={bc.footer}>
          <Text style={bc.expandHint}>
            {expanded ? "Tap to collapse" : "Tap for details"}
          </Text>
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={13}
            color={T.textMuted}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const bc = StyleSheet.create({
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
  cardExhausted: { borderColor: "#FECACA", borderWidth: 1.5 },
  bar: { width: 4 },
  inner: { flex: 1, padding: 13, gap: 10 },

  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 13, fontWeight: "800", color: "#fff" },
  info: { flex: 1 },
  name: { fontSize: 14, fontWeight: "700", color: T.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  metaTxt: { fontSize: 11, color: T.textMuted },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: T.border,
  },
  typeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    maxWidth: 120,
  },
  typeTxt: {
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 0.2,
  },

  barSection: { gap: 5 },
  barHeader: { flexDirection: "row", justifyContent: "space-between" },
  barLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  barSub: { fontSize: 10, color: T.textMuted },

  statsRow: {
    flexDirection: "row",
    backgroundColor: T.bg,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: T.border,
  },
  statCell: { flex: 1, alignItems: "center", paddingVertical: 8 },
  statBorder: { borderRightWidth: 1, borderRightColor: T.border },
  statVal: { fontSize: 17, fontWeight: "900", letterSpacing: -0.5 },
  statLbl: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "600",
    marginTop: 1,
    textTransform: "uppercase",
  },

  flagsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  flag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  flagTxt: { fontSize: 10, fontWeight: "700" },

  expandSection: {
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  expandRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  expandLabel: { flex: 1, fontSize: 12, color: T.textSub, fontWeight: "500" },
  expandVal: { fontSize: 12, fontWeight: "700", color: T.text },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    paddingTop: 2,
  },
  expandHint: { fontSize: 10, color: T.textMuted, fontWeight: "600" },
});

// ─────────────────────────────────────────────────────────────
//  EMPLOYEE SUMMARY ROW (grouped view)
// ─────────────────────────────────────────────────────────────
const EmployeeSummaryCard = ({ empId, name, department, records }) => {
  const color = avatarColor(name);
  const totalEntitled = records.reduce((s, r) => s + r.entitled, 0);
  const totalUtilized = records.reduce((s, r) => s + r.utilized, 0);
  const totalRemaining = records.reduce((s, r) => s + r.balanced, 0);
  const pct =
    totalEntitled > 0 ? Math.round((totalUtilized / totalEntitled) * 100) : 0;
  const hasExhausted = records.some((r) => r.balanced === 0 && r.entitled > 0);
  const hasPending = records.some((r) => r.pending_approval > 0);

  return (
    <View style={ec.card}>
      {/* Header */}
      <View style={ec.header}>
        <View style={[ec.avatar, { backgroundColor: color }]}>
          <Text style={ec.avatarTxt}>{getInitials(name)}</Text>
        </View>
        <View style={ec.headerInfo}>
          <Text style={ec.name}>{name}</Text>
          <View style={ec.metaRow}>
            <Text style={ec.metaTxt}>{empId}</Text>
            <View style={ec.metaDot} />
            <Text style={ec.metaTxt}>{department}</Text>
          </View>
        </View>
        <View style={[ec.pctBadge, { backgroundColor: utilizationBg(pct) }]}>
          <Text style={[ec.pctTxt, { color: utilizationColor(pct) }]}>
            {pct}%
          </Text>
          <Text style={[ec.pctSub, { color: utilizationColor(pct) }]}>
            used
          </Text>
        </View>
      </View>

      {/* Overall bar */}
      <View style={ec.barWrap}>
        <UsageBar utilized={totalUtilized} entitled={totalEntitled} />
      </View>

      {/* Totals */}
      <View style={ec.totals}>
        {[
          { label: "Entitled", val: totalEntitled, color: T.blue },
          { label: "Utilized", val: totalUtilized, color: T.red },
          { label: "Remaining", val: totalRemaining, color: T.green },
        ].map((s, i) => (
          <View key={s.label} style={[ec.totalCell, i < 2 && ec.totalBorder]}>
            <Text style={[ec.totalVal, { color: s.color }]}>{s.val}</Text>
            <Text style={ec.totalLbl}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Leave type breakdown */}
      <View style={ec.breakdownWrap}>
        <Text style={ec.breakdownTitle}>By Leave Type</Text>
        {records.map((r) => {
          const m = getTypeMeta(r.leave_type);
          const p =
            r.entitled > 0 ? Math.min((r.utilized / r.entitled) * 100, 100) : 0;
          return (
            <View key={r.id} style={ec.breakdownRow}>
              <View style={[ec.typeIcon, { backgroundColor: m.color + "15" }]}>
                <Ionicons name={m.icon} size={11} color={m.color} />
              </View>
              <Text style={ec.breakdownType} numberOfLines={1}>
                {r.leave_type}
              </Text>
              <Text style={ec.breakdownFraction}>
                {r.utilized}/{r.entitled}
              </Text>
              <View style={ec.miniBarTrack}>
                <View
                  style={[
                    ec.miniBarFill,
                    { width: `${p}%`, backgroundColor: m.color },
                  ]}
                />
              </View>
              {r.balanced === 0 && r.entitled > 0 && (
                <Ionicons name="alert-circle" size={12} color={T.red} />
              )}
              {r.pending_approval > 0 && <View style={ec.pendingDot} />}
            </View>
          );
        })}
      </View>

      {/* Flags */}
      {(hasExhausted || hasPending) && (
        <View style={ec.flagsRow}>
          {hasExhausted && (
            <View style={[ec.flag, { backgroundColor: T.redSoft }]}>
              <Ionicons name="alert-circle" size={11} color={T.red} />
              <Text style={[ec.flagTxt, { color: T.red }]}>
                Some leave exhausted
              </Text>
            </View>
          )}
          {hasPending && (
            <View style={[ec.flag, { backgroundColor: T.orangeSoft }]}>
              <Ionicons name="time-outline" size={11} color={T.orange} />
              <Text style={[ec.flagTxt, { color: T.orange }]}>
                Pending approvals
              </Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

const ec = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
    gap: 11,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
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
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  metaTxt: { fontSize: 11, color: T.textMuted },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: T.border,
  },
  pctBadge: {
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pctTxt: { fontSize: 18, fontWeight: "900", letterSpacing: -0.5 },
  pctSub: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  barWrap: { marginTop: -2 },

  totals: {
    flexDirection: "row",
    backgroundColor: T.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  totalCell: { flex: 1, alignItems: "center", paddingVertical: 9 },
  totalBorder: { borderRightWidth: 1, borderRightColor: T.border },
  totalVal: { fontSize: 18, fontWeight: "900", letterSpacing: -0.5 },
  totalLbl: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "600",
    marginTop: 1,
    textTransform: "uppercase",
  },

  breakdownWrap: {
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 10,
    gap: 7,
    borderWidth: 1,
    borderColor: T.border,
  },
  breakdownTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 2,
  },
  breakdownRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  typeIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  breakdownType: { flex: 1, fontSize: 11, fontWeight: "600", color: T.textSub },
  breakdownFraction: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: "600",
    width: 36,
    textAlign: "right",
  },
  miniBarTrack: {
    width: 60,
    height: 5,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  miniBarFill: { height: "100%", borderRadius: 3 },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.orange,
  },

  flagsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  flag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  flagTxt: { fontSize: 10, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
const VIEW_MODES = ["By Type", "By Employee"];
const UTIL_FILTERS = [
  { key: "", label: "All" },
  { key: "low", label: "Low ≤33%", color: T.green },
  { key: "medium", label: "Mid 34-66%", color: T.orange },
  { key: "high", label: "High >66%", color: T.red },
];

export default function LeaveBalanceScreen() {
  const [balances] = useState(MOCK_BALANCES);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [typeFilter, setTypeFilter] = useState("");
  const [utilFilter, setUtilFilter] = useState("");
  const [viewMode, setViewMode] = useState("By Employee");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const leaveTypes = useMemo(
    () => [...new Set(balances.map((b) => b.leave_type))].sort(),
    [balances],
  );

  const filtered = useMemo(() => {
    let d = [...balances];
    if (typeFilter) d = d.filter((b) => b.leave_type === typeFilter);
    if (utilFilter) {
      d = d.filter((b) => {
        const pct = b.entitled > 0 ? (b.utilized / b.entitled) * 100 : 0;
        if (utilFilter === "low") return pct <= 33;
        if (utilFilter === "medium") return pct > 33 && pct <= 66;
        if (utilFilter === "high") return pct > 66;
        return true;
      });
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(
        (b) =>
          b.name?.toLowerCase().includes(q) ||
          b.emp_id?.toLowerCase().includes(q) ||
          b.leave_type?.toLowerCase().includes(q) ||
          b.department?.toLowerCase().includes(q),
      );
    }
    return d;
  }, [balances, search, typeFilter, utilFilter]);

  // Group by employee for "By Employee" view
  const groupedByEmployee = useMemo(() => {
    const groups = {};
    filtered.forEach((b) => {
      if (!groups[b.emp_id]) {
        groups[b.emp_id] = {
          empId: b.emp_id,
          name: b.name,
          department: b.department,
          records: [],
        };
      }
      groups[b.emp_id].records.push(b);
    });
    return Object.values(groups);
  }, [filtered]);

  const hasFilters = search || typeFilter || utilFilter;
  const clearAll = () => {
    setSearch("");
    setTypeFilter("");
    setUtilFilter("");
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  const ListHeader = () => (
    <>
      {/* Title */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Leave Balance</Text>
          <Text style={s.pageSub}>
            {MOCK_STATS.total_employees} employees · {balances.length} records
          </Text>
        </View>
        <TouchableOpacity
          style={[s.filterToggle, showFilters && s.filterToggleActive]}
          onPress={() => setShowFilters((p) => !p)}
        >
          <Ionicons
            name={showFilters ? "options" : "options-outline"}
            size={16}
            color={showFilters ? "#fff" : T.blue}
          />
          <Text style={[s.filterToggleTxt, showFilters && { color: "#fff" }]}>
            {hasFilters ? "Filters •" : "Filter"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <StatsWidget stats={MOCK_STATS} />

      {/* View mode toggle */}
      <View style={s.modeToggle}>
        {VIEW_MODES.map((mode) => (
          <TouchableOpacity
            key={mode}
            style={[s.modeBtn, viewMode === mode && s.modeBtnActive]}
            onPress={() => setViewMode(mode)}
          >
            <Ionicons
              name={mode === "By Type" ? "list-outline" : "people-outline"}
              size={13}
              color={viewMode === mode ? "#fff" : T.textSub}
            />
            <Text
              style={[s.modeBtnTxt, viewMode === mode && s.modeBtnTxtActive]}
            >
              {mode}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
        <Ionicons
          name="search-outline"
          size={16}
          color={searchFocused ? T.blue : T.textMuted}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search name, ID, leave type…"
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

      {/* Filter panel */}
      {showFilters && (
        <View style={s.filterPanel}>
          {/* Leave type */}
          <View>
            <Text style={s.filterGroupLabel}>LEAVE TYPE</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ gap: 7 }}
            >
              <TouchableOpacity
                style={[s.filterChip, !typeFilter && s.filterChipActive]}
                onPress={() => setTypeFilter("")}
              >
                <Text
                  style={[
                    s.filterChipTxt,
                    !typeFilter && s.filterChipTxtActive,
                  ]}
                >
                  All
                </Text>
              </TouchableOpacity>
              {leaveTypes.map((t) => {
                const m = getTypeMeta(t);
                const isActive = typeFilter === t;
                return (
                  <TouchableOpacity
                    key={t}
                    style={[
                      s.filterChip,
                      isActive && {
                        backgroundColor: m.color,
                        borderColor: m.color,
                      },
                    ]}
                    onPress={() => setTypeFilter(isActive ? "" : t)}
                  >
                    <Ionicons
                      name={m.icon}
                      size={11}
                      color={isActive ? "#fff" : m.color}
                    />
                    <Text
                      style={[
                        s.filterChipTxt,
                        isActive && s.filterChipTxtActive,
                      ]}
                    >
                      {t}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Utilization */}
          <View>
            <Text style={s.filterGroupLabel}>UTILIZATION LEVEL</Text>
            <View style={{ flexDirection: "row", gap: 7, flexWrap: "wrap" }}>
              {UTIL_FILTERS.map((f) => {
                const isActive = utilFilter === f.key;
                return (
                  <TouchableOpacity
                    key={f.key}
                    style={[s.filterChip, isActive && s.filterChipActive]}
                    onPress={() => setUtilFilter(isActive ? "" : f.key)}
                  >
                    {f.color && (
                      <View
                        style={[
                          s.filterDot,
                          { backgroundColor: isActive ? "#fff" : f.color },
                        ]}
                      />
                    )}
                    <Text
                      style={[
                        s.filterChipTxt,
                        isActive && s.filterChipTxtActive,
                      ]}
                    >
                      {f.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {hasFilters && (
            <TouchableOpacity style={s.clearAllBtn} onPress={clearAll}>
              <Ionicons name="refresh-outline" size={12} color={T.blue} />
              <Text style={s.clearAllTxt}>Clear all filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results count */}
      {hasFilters && (
        <View style={s.resultsBar}>
          <Ionicons name="funnel" size={11} color={T.blue} />
          <Text style={s.resultsTxt}>
            {viewMode === "By Employee"
              ? `${groupedByEmployee.length} employee`
              : `${filtered.length} record`}
            {(viewMode === "By Employee"
              ? groupedByEmployee.length
              : filtered.length) !== 1
              ? "s"
              : ""}{" "}
            found
          </Text>
        </View>
      )}
    </>
  );

  const renderByType = ({ item }) => <BalanceCard item={item} />;

  const renderByEmployee = ({ item }) => (
    <EmployeeSummaryCard
      empId={item.empId}
      name={item.name}
      department={item.department}
      records={item.records}
    />
  );

  const listData = viewMode === "By Employee" ? groupedByEmployee : filtered;
  const renderItem =
    viewMode === "By Employee" ? renderByEmployee : renderByType;
  const keyExtractor = (item, i) =>
    viewMode === "By Employee"
      ? item.empId
      : item.id?.toString() || i.toString();

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
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="calendar-outline" size={52} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No results found</Text>
            <Text style={s.emptySub}>
              {hasFilters
                ? "Try a different filter or search term."
                : "No leave balance data available."}
            </Text>
            {hasFilters && (
              <TouchableOpacity style={s.clearBtn} onPress={clearAll}>
                <Text style={s.clearBtnTxt}>Clear Filters</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
  filterToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: T.blue,
    backgroundColor: T.blueSoft,
  },
  filterToggleActive: { backgroundColor: T.blue, borderColor: T.blue },
  filterToggleTxt: { fontSize: 12, fontWeight: "700", color: T.blue },

  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 4,
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
    paddingVertical: 8,
    borderRadius: 10,
  },
  modeBtnActive: { backgroundColor: T.navy },
  modeBtnTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  modeBtnTxtActive: { color: "#fff", fontWeight: "700" },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
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

  filterPanel: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
    gap: 14,
    marginBottom: 10,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  filterGroupLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: T.textMuted,
    letterSpacing: 0.8,
    marginBottom: 7,
  },
  filterChip: {
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
  filterChipActive: { backgroundColor: T.blue, borderColor: T.blue },
  filterChipTxt: { fontSize: 11, fontWeight: "600", color: T.textSub },
  filterChipTxtActive: { color: "#fff", fontWeight: "700" },
  filterDot: { width: 7, height: 7, borderRadius: 3.5 },
  clearAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    alignSelf: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: T.blueSoft,
  },
  clearAllTxt: { fontSize: 12, color: T.blue, fontWeight: "700" },

  resultsBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
    backgroundColor: T.blueSoft,
    borderRadius: 8,
    paddingHorizontal: 11,
    paddingVertical: 6,
  },
  resultsTxt: { fontSize: 12, color: T.blue, fontWeight: "700" },

  empty: { padding: 48, alignItems: "center", gap: 10 },
  emptyTxt: { fontSize: 15, color: T.textMuted, fontWeight: "700" },
  emptySub: { fontSize: 13, color: "#CBD5E1", textAlign: "center" },
  clearBtn: {
    marginTop: 4,
    backgroundColor: T.blue,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  clearBtnTxt: { color: "#fff", fontWeight: "700", fontSize: 13 },
});
