import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
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
//  DATA
// ─────────────────────────────────────────────────────────────
const PERIOD_TABS = ["Monthly", "Quarterly", "Yearly"];
const MONTH_TABS = [
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
const QUARTER_TABS = ["Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"];
const YEAR_TABS = ["2024", "2025", "2026"];

const MONTHLY_DATA = {
  Mar: {
    total: 289500,
    net: 231450,
    deductions: 58050,
    bonuses: 14500,
    tax: 38200,
    pension: 12800,
    other: 7050,
  },
  Feb: {
    total: 257800,
    net: 204630,
    deductions: 53170,
    bonuses: 4200,
    tax: 34100,
    pension: 11600,
    other: 7470,
  },
  Jan: {
    total: 271200,
    net: 216480,
    deductions: 54720,
    bonuses: 12800,
    tax: 36200,
    pension: 11900,
    other: 6620,
  },
  Dec: {
    total: 265000,
    net: 211400,
    deductions: 53600,
    bonuses: 18000,
    tax: 35800,
    pension: 11200,
    other: 6600,
  },
  Nov: {
    total: 238500,
    net: 190000,
    deductions: 48500,
    bonuses: 3500,
    tax: 31900,
    pension: 10600,
    other: 6000,
  },
  Oct: {
    total: 231000,
    net: 183500,
    deductions: 47500,
    bonuses: 0,
    tax: 31200,
    pension: 10200,
    other: 6100,
  },
};

const QUARTERLY_DATA = {
  "Q1 2026": {
    total: 818500,
    net: 652560,
    deductions: 165940,
    bonuses: 31500,
    tax: 108500,
    pension: 36300,
    other: 21140,
  },
  "Q4 2025": {
    total: 734500,
    net: 584900,
    deductions: 149600,
    bonuses: 21500,
    tax: 98900,
    pension: 32000,
    other: 18700,
  },
  "Q3 2025": {
    total: 701200,
    net: 558900,
    deductions: 142300,
    bonuses: 11200,
    tax: 93800,
    pension: 30800,
    other: 17700,
  },
  "Q2 2025": {
    total: 688400,
    net: 549200,
    deductions: 139200,
    bonuses: 9800,
    tax: 91700,
    pension: 30100,
    other: 17400,
  },
};

const YEARLY_DATA = {
  2026: {
    total: 818500,
    net: 652560,
    deductions: 165940,
    bonuses: 31500,
    tax: 108500,
    pension: 36300,
    other: 21140,
  },
  2025: {
    total: 2824100,
    net: 2248980,
    deductions: 575120,
    bonuses: 52500,
    tax: 378400,
    pension: 122900,
    other: 73820,
  },
  2024: {
    total: 2644000,
    net: 2104180,
    deductions: 539820,
    bonuses: 39800,
    tax: 355200,
    pension: 114600,
    other: 70020,
  },
};

const CHART_MONTHS = ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"];
const CHART_VALUES = [231000, 238500, 265000, 271200, 257800, 289500];
const CHART_NET = [183500, 190000, 211400, 216480, 204630, 231450];
const CHART_BONUS = [0, 3500, 18000, 12800, 4200, 14500];

const DEPT_DATA = [
  {
    dept: "Engineering",
    color: "#3B82F6",
    icon: "code-slash-outline",
    total: 98550,
    employees: 3,
    avg: 32850,
    pct: 34,
  },
  {
    dept: "Finance",
    color: T.orange,
    icon: "cash-outline",
    total: 75840,
    employees: 2,
    avg: 37920,
    pct: 26,
  },
  {
    dept: "Marketing",
    color: "#F59E0B",
    icon: "megaphone-outline",
    total: 51360,
    employees: 1,
    avg: 51360,
    pct: 18,
  },
  {
    dept: "Design",
    color: "#10B981",
    icon: "color-palette-outline",
    total: 42240,
    employees: 1,
    avg: 42240,
    pct: 15,
  },
  {
    dept: "HR",
    color: "#EC4899",
    icon: "people-outline",
    total: 24250,
    employees: 1,
    avg: 24250,
    pct: 8,
  },
  {
    dept: "Operations",
    color: "#8B5CF6",
    icon: "settings-outline",
    total: 23000,
    employees: 1,
    avg: 23000,
    pct: 8,
  },
];

const TOP_EARNERS = [
  { name: "Sofia Martinez", dept: "Marketing", net: 51360, change: 6.2 },
  { name: "Brian Villalobos", dept: "Engineering", net: 43950, change: -1.2 },
  { name: "Anthony Lewis", dept: "Finance", net: 40300, change: 2.1 },
  { name: "Priya Sharma", dept: "Design", net: 39040, change: 4.5 },
  { name: "Stephan Peralt", dept: "Operations", net: 23000, change: 0.0 },
];

const REPORT_CARDS = [
  {
    label: "Monthly Summary",
    icon: "calendar-outline",
    color: T.blue,
    desc: "Full monthly breakdown",
  },
  {
    label: "Quarterly Report",
    icon: "stats-chart-outline",
    color: T.purple,
    desc: "Q1 2026 comparative analysis",
  },
  {
    label: "Annual Report",
    icon: "document-text-outline",
    color: T.green,
    desc: "Year-to-date summary",
  },
  {
    label: "Tax Report",
    icon: "receipt-outline",
    color: T.red,
    desc: "Tax liabilities & filings",
  },
  {
    label: "Dept. Breakdown",
    icon: "business-outline",
    color: T.amber,
    desc: "Cost per department",
  },
  {
    label: "Bonus Report",
    icon: "gift-outline",
    color: T.teal,
    desc: "Bonus distributions",
  },
];

const fmt = (n) =>
  n >= 1000000
    ? `$${(n / 1000000).toFixed(2)}M`
    : n >= 1000
      ? `$${(n / 1000).toFixed(1)}k`
      : `$${n}`;
const fmtFull = (n) => `$${n.toLocaleString("en-US")}`;
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

// ─────────────────────────────────────────────────────────────
//  SECTION HEADER
// ─────────────────────────────────────────────────────────────
const SectionHeader = ({ icon, iconColor, iconBg, title, action }) => (
  <View style={sh.row}>
    <View style={[sh.iconWrap, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={14} color={iconColor} />
    </View>
    <Text style={sh.title}>{title}</Text>
    {action && (
      <TouchableOpacity style={sh.actionBtn}>
        <Text style={sh.actionTxt}>{action}</Text>
        <Ionicons name="chevron-forward" size={11} color={T.blue} />
      </TouchableOpacity>
    )}
  </View>
);
const sh = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 9, marginBottom: 12 },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { flex: 1, fontSize: 14, fontWeight: "800", color: T.text },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 3 },
  actionTxt: { fontSize: 12, fontWeight: "700", color: T.blue },
});

// ─────────────────────────────────────────────────────────────
//  PERIOD SELECTOR
// ─────────────────────────────────────────────────────────────
const PeriodSelector = ({ period, setPeriod, sub, setSub }) => {
  const subTabs =
    period === "Monthly"
      ? MONTH_TABS
      : period === "Quarterly"
        ? QUARTER_TABS
        : YEAR_TABS;
  return (
    <View style={ps.wrap}>
      <View style={ps.periodRow}>
        {PERIOD_TABS.map((p) => (
          <TouchableOpacity
            key={p}
            style={[ps.periodBtn, period === p && ps.periodBtnActive]}
            onPress={() => {
              setPeriod(p);
              setSub(subTabs[0]);
            }}
          >
            <Text style={[ps.periodTxt, period === p && ps.periodTxtActive]}>
              {p}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={ps.subRow}
      >
        {subTabs.map((s) => (
          <TouchableOpacity
            key={s}
            style={[ps.subChip, sub === s && ps.subChipActive]}
            onPress={() => setSub(s)}
          >
            <Text style={[ps.subTxt, sub === s && ps.subTxtActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};
const ps = StyleSheet.create({
  wrap: {
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 12,
    gap: 10,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  periodRow: {
    flexDirection: "row",
    backgroundColor: T.bg,
    borderRadius: 10,
    padding: 4,
    gap: 2,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: 7,
    borderRadius: 8,
    alignItems: "center",
  },
  periodBtnActive: { backgroundColor: T.navy },
  periodTxt: { fontSize: 12, fontWeight: "700", color: T.textMuted },
  periodTxtActive: { color: "#fff" },
  subRow: { gap: 8 },
  subChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: T.bg,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  subChipActive: { backgroundColor: T.blue, borderColor: T.blue },
  subTxt: { fontSize: 12, fontWeight: "700", color: T.textSub },
  subTxtActive: { color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  HERO SUMMARY CARD
// ─────────────────────────────────────────────────────────────
const HeroSummary = ({ data, label }) => {
  const netPct = Math.round((data.net / data.total) * 100);
  const dedPct = 100 - netPct;
  return (
    <View style={hc.wrap}>
      <View style={hc.hero}>
        <View style={hc.blob1} />
        <View style={hc.blob2} />
        <View style={hc.topRow}>
          <View>
            <Text style={hc.eyebrow}>TOTAL PAYROLL COST</Text>
            <Text style={hc.amount}>{fmt(data.total)}</Text>
          </View>
          <View style={hc.periodBadge}>
            <Ionicons name="calendar-outline" size={11} color={T.blue} />
            <Text style={hc.periodTxt}>{label}</Text>
          </View>
        </View>
        <View style={hc.barSection}>
          <View style={hc.barTrack}>
            <View style={[hc.barNet, { flex: netPct }]} />
            <View style={[hc.barDed, { flex: dedPct }]} />
          </View>
          <View style={hc.barLegend}>
            <View style={hc.legendItem}>
              <View style={[hc.legendDot, { backgroundColor: "#4ADE80" }]} />
              <Text style={hc.legendTxt}>Net {netPct}%</Text>
            </View>
            <View style={hc.legendItem}>
              <View style={[hc.legendDot, { backgroundColor: "#F87171" }]} />
              <Text style={hc.legendTxt}>Deductions {dedPct}%</Text>
            </View>
          </View>
        </View>
        <View style={hc.metricsGrid}>
          {[
            {
              label: "Net Pay",
              val: fmt(data.net),
              color: "#4ADE80",
              icon: "wallet-outline",
            },
            {
              label: "Deductions",
              val: fmt(data.deductions),
              color: "#F87171",
              icon: "remove-circle-outline",
            },
            {
              label: "Bonuses",
              val: fmt(data.bonuses),
              color: "#FBBF24",
              icon: "gift-outline",
            },
            {
              label: "Tax",
              val: fmt(data.tax),
              color: "#C084FC",
              icon: "receipt-outline",
            },
          ].map((m, i) => (
            <React.Fragment key={m.label}>
              {i > 0 && <View style={hc.metricSep} />}
              <View style={hc.metricCell}>
                <Ionicons
                  name={m.icon}
                  size={12}
                  color={m.color}
                  style={{ marginBottom: 4 }}
                />
                <Text style={[hc.metricVal, { color: m.color }]}>{m.val}</Text>
                <Text style={hc.metricLabel}>{m.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      </View>
      <View style={hc.subRow}>
        {[
          {
            label: "Pension",
            val: fmt(data.pension),
            color: T.purple,
            icon: "shield-checkmark-outline",
          },
          {
            label: "Other Ded.",
            val: fmt(data.other),
            color: T.teal,
            icon: "ellipsis-horizontal-circle-outline",
          },
        ].map((s) => (
          <View key={s.label} style={hc.subCell}>
            <View style={[hc.subIcon, { backgroundColor: s.color + "18" }]}>
              <Ionicons name={s.icon} size={14} color={s.color} />
            </View>
            <View>
              <Text style={[hc.subVal, { color: s.color }]}>{s.val}</Text>
              <Text style={hc.subLabel}>{s.label}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};
const hc = StyleSheet.create({
  wrap: { marginHorizontal: 14, marginBottom: 16, gap: 10 },
  hero: {
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 20,
    overflow: "hidden",
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
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
    left: 30,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  amount: {
    fontSize: 40,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1.5,
    lineHeight: 44,
  },
  periodBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.blueSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  periodTxt: { fontSize: 11, fontWeight: "700", color: T.blue },
  barSection: { marginBottom: 16, gap: 8 },
  barTrack: {
    flexDirection: "row",
    height: 8,
    borderRadius: 4,
    overflow: "hidden",
    backgroundColor: "rgba(255,255,255,0.08)",
  },
  barNet: { backgroundColor: "#4ADE80" },
  barDed: { backgroundColor: "#F87171", opacity: 0.85 },
  barLegend: { flexDirection: "row", gap: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 7, height: 7, borderRadius: 3.5 },
  legendTxt: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "600",
  },
  metricsGrid: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  metricSep: { width: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  metricCell: { flex: 1, alignItems: "center" },
  metricVal: { fontSize: 14, fontWeight: "900", letterSpacing: -0.5 },
  metricLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.35)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 2,
  },
  subRow: { flexDirection: "row", gap: 10 },
  subCell: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 12,
  },
  subIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  subVal: { fontSize: 15, fontWeight: "900" },
  subLabel: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "600",
    marginTop: 1,
  },
});

// ─────────────────────────────────────────────────────────────
//  BAR CHART (6-month trend)
// ─────────────────────────────────────────────────────────────
const TrendBarChart = ({ activeBar, setActiveBar }) => {
  const MAX = Math.max(...CHART_VALUES);
  return (
    <View style={bc.card}>
      <SectionHeader
        icon="bar-chart-outline"
        iconColor={T.blue}
        iconBg={T.blueSoft}
        title="6-Month Payroll Trend"
        action="Full Report"
      />
      <View style={bc.legend}>
        {[
          { label: "Total Payroll", color: T.navy },
          { label: "Net Pay", color: T.blue },
          { label: "Bonuses", color: T.amber },
        ].map((l) => (
          <View key={l.label} style={bc.legendItem}>
            <View style={[bc.legendDot, { backgroundColor: l.color }]} />
            <Text style={bc.legendTxt}>{l.label}</Text>
          </View>
        ))}
      </View>
      <View style={bc.chartWrap}>
        <View style={bc.yAxis}>
          {["300k", "250k", "200k", "150k"].map((v) => (
            <Text key={v} style={bc.yLabel}>
              {v}
            </Text>
          ))}
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ flex: 1 }}
        >
          <View style={bc.barsArea}>
            {["25%", "50%", "75%", "100%"].map((b) => (
              <View key={b} style={[bc.gridLine, { bottom: b }]} />
            ))}
            {CHART_MONTHS.map((m, i) => {
              const totalH = (CHART_VALUES[i] / MAX) * 150;
              const netH = (CHART_NET[i] / MAX) * 150;
              const bonusH =
                CHART_BONUS[i] > 0
                  ? Math.max((CHART_BONUS[i] / MAX) * 150, 6)
                  : 0;
              const isActive = activeBar === i;
              const isCurrent = i === CHART_MONTHS.length - 1;
              return (
                <TouchableOpacity
                  key={m}
                  style={bc.barGroup}
                  onPress={() => setActiveBar(isActive ? null : i)}
                  activeOpacity={0.9}
                >
                  {isActive && (
                    <View style={bc.tooltip}>
                      <Text style={bc.tooltipTitle}>{m}</Text>
                      <Text style={bc.tooltipNet}>Net {fmt(CHART_NET[i])}</Text>
                      <Text style={bc.tooltipTotal}>
                        Total {fmt(CHART_VALUES[i])}
                      </Text>
                      {CHART_BONUS[i] > 0 && (
                        <Text style={bc.tooltipBonus}>
                          Bonus {fmt(CHART_BONUS[i])}
                        </Text>
                      )}
                    </View>
                  )}
                  <View style={bc.barsRow}>
                    <View
                      style={[
                        bc.barTotal,
                        {
                          height: totalH,
                          backgroundColor: isCurrent ? T.navy : "#CBD5E1",
                        },
                      ]}
                    />
                    <View
                      style={[
                        bc.barNet,
                        {
                          height: netH,
                          backgroundColor: isCurrent ? T.blue : "#93C5FD",
                        },
                      ]}
                    />
                    {bonusH > 0 && (
                      <View style={[bc.barBonus, { height: bonusH }]} />
                    )}
                  </View>
                  {isActive && <View style={bc.activeDot} />}
                  <Text
                    style={[
                      bc.barLabel,
                      (isCurrent || isActive) && bc.barLabelActive,
                    ]}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
      <View style={bc.strip}>
        {[
          { label: "Peak Month", val: "Mar 2026", color: T.navy },
          {
            label: "Avg Monthly",
            val: fmt(
              CHART_VALUES.reduce((a, b) => a + b, 0) / CHART_VALUES.length,
            ),
            color: T.blue,
          },
          { label: "Growth", val: "+12.4%", color: T.green },
        ].map((s, i) => (
          <View key={s.label} style={[bc.stripCell, i < 2 && bc.stripSep]}>
            <Text style={[bc.stripVal, { color: s.color }]}>{s.val}</Text>
            <Text style={bc.stripLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
const bc = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  legend: { flexDirection: "row", gap: 14, marginBottom: 12 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendTxt: { fontSize: 11, color: T.textMuted, fontWeight: "600" },
  chartWrap: { flexDirection: "row", height: 195, marginBottom: 0 },
  yAxis: {
    width: 34,
    justifyContent: "space-between",
    paddingBottom: 28,
    paddingTop: 2,
  },
  yLabel: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "600",
    textAlign: "right",
  },
  barsArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    paddingBottom: 28,
    gap: 8,
    position: "relative",
    minWidth: 300,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#F1F5F9",
  },
  barGroup: { alignItems: "center", gap: 5, width: 44, position: "relative" },
  barsRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 3,
    height: 150,
    width: 42,
  },
  barTotal: { width: 14, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  barNet: { width: 14, borderTopLeftRadius: 5, borderTopRightRadius: 5 },
  barBonus: {
    width: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    backgroundColor: T.amber,
    opacity: 0.9,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.blue },
  barLabel: { fontSize: 10, color: T.textMuted, fontWeight: "600" },
  barLabelActive: { color: T.blue, fontWeight: "800" },
  tooltip: {
    position: "absolute",
    top: -100,
    backgroundColor: T.navy,
    borderRadius: 10,
    padding: 9,
    zIndex: 10,
    width: 100,
    left: -28,
  },
  tooltipTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 4,
  },
  tooltipNet: { fontSize: 10, color: "#4ADE80", fontWeight: "700" },
  tooltipTotal: { fontSize: 10, color: "#93C5FD", fontWeight: "700" },
  tooltipBonus: { fontSize: 10, color: "#FBBF24", fontWeight: "700" },
  strip: {
    flexDirection: "row",
    backgroundColor: T.bg,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  stripCell: { flex: 1, alignItems: "center", paddingVertical: 10 },
  stripSep: { borderRightWidth: 1, borderRightColor: T.border },
  stripVal: { fontSize: 14, fontWeight: "900" },
  stripLabel: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 2,
  },
});

// ─────────────────────────────────────────────────────────────
//  DEDUCTION BREAKDOWN
// ─────────────────────────────────────────────────────────────
const DeductionBreakdown = ({ data }) => {
  const items = [
    {
      label: "Income Tax",
      val: data.tax,
      color: T.red,
      pct: Math.round((data.tax / data.deductions) * 100),
    },
    {
      label: "Pension",
      val: data.pension,
      color: T.purple,
      pct: Math.round((data.pension / data.deductions) * 100),
    },
    {
      label: "Other",
      val: data.other,
      color: T.teal,
      pct: Math.round((data.other / data.deductions) * 100),
    },
  ];
  return (
    <View style={dd.card}>
      <SectionHeader
        icon="pie-chart-outline"
        iconColor={T.purple}
        iconBg={T.purpleSoft}
        title="Deductions Breakdown"
      />
      <View style={dd.body}>
        <View style={dd.ringWrap}>
          <View style={dd.ring}>
            <View style={dd.ringInner}>
              <Text style={dd.ringMain}>{fmt(data.deductions)}</Text>
              <Text style={dd.ringSub}>Total Deductions</Text>
            </View>
          </View>
        </View>
        <View style={dd.legend}>
          {items.map((item, i) => (
            <View
              key={item.label}
              style={[dd.legendRow, i < items.length - 1 && dd.legendBorder]}
            >
              <View style={[dd.legendDot, { backgroundColor: item.color }]} />
              <Text style={dd.legendLabel}>{item.label}</Text>
              <View style={dd.legendRight}>
                <Text style={dd.legendPct}>{item.pct}%</Text>
                <Text style={[dd.legendVal, { color: item.color }]}>
                  {fmtFull(item.val)}
                </Text>
              </View>
            </View>
          ))}
          <View style={dd.totalRow}>
            <Text style={dd.totalLabel}>Total</Text>
            <Text style={dd.totalVal}>{fmtFull(data.deductions)}</Text>
          </View>
        </View>
      </View>

      {/* Bar visualisation per deduction */}
      <View style={dd.bars}>
        {items.map((item) => (
          <View key={item.label} style={dd.barRow}>
            <Text style={dd.barLabel}>{item.label}</Text>
            <View style={dd.barTrack}>
              <View
                style={[
                  dd.barFill,
                  { width: `${item.pct}%`, backgroundColor: item.color },
                ]}
              />
            </View>
            <Text style={[dd.barPct, { color: item.color }]}>{item.pct}%</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
const dd = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  body: {
    flexDirection: "row",
    gap: 16,
    alignItems: "center",
    marginBottom: 14,
  },
  ringWrap: { alignItems: "center", justifyContent: "center" },
  ring: {
    width: 108,
    height: 108,
    borderRadius: 54,
    borderWidth: 12,
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: T.red,
    borderRightColor: T.purple,
    borderBottomColor: T.teal,
    borderLeftColor: "#E2E8F0",
    transform: [{ rotate: "-30deg" }],
  },
  ringInner: { transform: [{ rotate: "30deg" }], alignItems: "center" },
  ringMain: { fontSize: 13, fontWeight: "900", color: T.text },
  ringSub: {
    fontSize: 7,
    color: T.textMuted,
    fontWeight: "600",
    textAlign: "center",
  },
  legend: { flex: 1, gap: 0 },
  legendRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  legendBorder: { borderBottomWidth: 1, borderBottomColor: "#F8FAFC" },
  legendDot: { width: 10, height: 10, borderRadius: 5 },
  legendLabel: { flex: 1, fontSize: 12, color: T.textSub, fontWeight: "600" },
  legendRight: { alignItems: "flex-end" },
  legendPct: { fontSize: 10, color: T.textMuted, fontWeight: "700" },
  legendVal: { fontSize: 13, fontWeight: "900" },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 8,
    borderTopWidth: 1.5,
    borderTopColor: T.border,
    marginTop: 4,
  },
  totalLabel: { fontSize: 13, fontWeight: "800", color: T.text },
  totalVal: { fontSize: 14, fontWeight: "900", color: T.text },
  bars: { gap: 8, backgroundColor: T.bg, borderRadius: 12, padding: 12 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  barLabel: { fontSize: 11, color: T.textSub, fontWeight: "600", width: 80 },
  barTrack: {
    flex: 1,
    height: 8,
    backgroundColor: T.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 4 },
  barPct: { fontSize: 10, fontWeight: "800", width: 32, textAlign: "right" },
});

// ─────────────────────────────────────────────────────────────
//  COST COMPONENTS (horizontal bars)
// ─────────────────────────────────────────────────────────────
const CostComponents = ({ data }) => {
  const items = [
    {
      label: "Basic Salaries",
      val: data.net - data.bonuses,
      color: T.blue,
      icon: "wallet-outline",
    },
    {
      label: "Bonuses",
      val: data.bonuses,
      color: T.amber,
      icon: "gift-outline",
    },
    {
      label: "Income Tax",
      val: data.tax,
      color: T.red,
      icon: "receipt-outline",
    },
    {
      label: "Pension",
      val: data.pension,
      color: T.purple,
      icon: "shield-outline",
    },
    {
      label: "Other",
      val: data.other,
      color: T.teal,
      icon: "ellipsis-horizontal-circle-outline",
    },
  ];
  const max = Math.max(...items.map((i) => i.val));
  return (
    <View style={cc.card}>
      <SectionHeader
        icon="layers-outline"
        iconColor={T.teal}
        iconBg={T.tealSoft}
        title="Cost Components"
      />
      {items.map((item, i) => (
        <View
          key={item.label}
          style={[cc.row, i < items.length - 1 && cc.rowBorder]}
        >
          <View style={[cc.iconWrap, { backgroundColor: item.color + "15" }]}>
            <Ionicons name={item.icon} size={13} color={item.color} />
          </View>
          <View style={{ flex: 1, gap: 5 }}>
            <View style={cc.rowTop}>
              <Text style={cc.label}>{item.label}</Text>
              <Text style={[cc.val, { color: item.color }]}>
                {fmtFull(item.val)}
              </Text>
            </View>
            <View style={cc.barTrack}>
              <View
                style={[
                  cc.barFill,
                  {
                    width: `${(item.val / max) * 100}%`,
                    backgroundColor: item.color,
                  },
                ]}
              />
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
const cc = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F8FAFC" },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTop: { flexDirection: "row", justifyContent: "space-between" },
  label: { fontSize: 12, fontWeight: "600", color: T.textSub },
  val: { fontSize: 13, fontWeight: "900" },
  barTrack: {
    height: 5,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 3 },
});

// ─────────────────────────────────────────────────────────────
//  DEPT BREAKDOWN
// ─────────────────────────────────────────────────────────────
const DeptBreakdown = () => {
  const [sortBy, setSortBy] = useState("total");
  const sorted = [...DEPT_DATA].sort((a, b) => b[sortBy] - a[sortBy]);
  return (
    <View style={dpt.card}>
      <SectionHeader
        icon="business-outline"
        iconColor={T.amber}
        iconBg={T.amberSoft}
        title="Department-wise Payroll"
        action="Details"
      />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={dpt.sortRow}
      >
        {[
          { key: "total", label: "By Total" },
          { key: "avg", label: "By Avg Salary" },
          { key: "employees", label: "By Headcount" },
        ].map((s) => (
          <TouchableOpacity
            key={s.key}
            style={[dpt.sortChip, sortBy === s.key && dpt.sortChipActive]}
            onPress={() => setSortBy(s.key)}
          >
            <Text style={[dpt.sortTxt, sortBy === s.key && dpt.sortTxtActive]}>
              {s.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {sorted.map((d, i) => (
        <View
          key={d.dept}
          style={[dpt.row, i < sorted.length - 1 && dpt.rowBorder]}
        >
          <View style={[dpt.icon, { backgroundColor: d.color + "15" }]}>
            <Ionicons name={d.icon} size={15} color={d.color} />
          </View>
          <View style={{ flex: 1, gap: 4 }}>
            <View style={dpt.rowTop}>
              <Text style={dpt.deptName}>{d.dept}</Text>
              <Text style={dpt.deptTotal}>{fmtFull(d.total)}</Text>
            </View>
            <View style={dpt.barRow}>
              <View style={dpt.barTrack}>
                <View
                  style={[
                    dpt.barFill,
                    { width: `${d.pct}%`, backgroundColor: d.color },
                  ]}
                />
              </View>
              <Text style={dpt.pct}>{d.pct}%</Text>
            </View>
            <View style={dpt.metaRow}>
              <View style={dpt.metaChip}>
                <Ionicons name="people-outline" size={9} color={T.textMuted} />
                <Text style={dpt.metaTxt}>{d.employees} emp</Text>
              </View>
              <View style={dpt.metaChip}>
                <Ionicons name="person-outline" size={9} color={T.textMuted} />
                <Text style={dpt.metaTxt}>Avg {fmtFull(d.avg)}</Text>
              </View>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
};
const dpt = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  sortRow: { gap: 8, marginBottom: 12 },
  sortChip: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
  },
  sortChipActive: { backgroundColor: T.navy, borderColor: T.navy },
  sortTxt: { fontSize: 11, fontWeight: "700", color: T.textMuted },
  sortTxtActive: { color: "#fff" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 11,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F8FAFC" },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  rowTop: { flexDirection: "row", justifyContent: "space-between" },
  deptName: { fontSize: 13, fontWeight: "700", color: T.text },
  deptTotal: { fontSize: 13, fontWeight: "900", color: T.text },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  barTrack: {
    flex: 1,
    height: 5,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 3 },
  pct: {
    fontSize: 10,
    fontWeight: "800",
    color: T.textMuted,
    width: 30,
    textAlign: "right",
  },
  metaRow: { flexDirection: "row", gap: 8 },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaTxt: { fontSize: 10, color: T.textMuted, fontWeight: "500" },
});

// ─────────────────────────────────────────────────────────────
//  TOP EARNERS
// ─────────────────────────────────────────────────────────────
const TopEarners = () => (
  <View style={te.card}>
    <SectionHeader
      icon="trophy-outline"
      iconColor={T.amber}
      iconBg={T.amberSoft}
      title="Top Earners"
      action="All Employees"
    />
    {[...TOP_EARNERS]
      .sort((a, b) => b.net - a.net)
      .map((emp, i) => (
        <View
          key={emp.name}
          style={[te.row, i < TOP_EARNERS.length - 1 && te.rowBorder]}
        >
          <View
            style={[
              te.rank,
              i === 0 && te.rankGold,
              i === 1 && te.rankSilver,
              i === 2 && te.rankBronze,
            ]}
          >
            <Text style={[te.rankTxt, i < 3 && { color: "#fff" }]}>
              {i + 1}
            </Text>
          </View>
          <View style={[te.avatar, { backgroundColor: avatarColor(emp.name) }]}>
            <Text style={te.avatarTxt}>{getInitials(emp.name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={te.name} numberOfLines={1}>
              {emp.name}
            </Text>
            <Text style={te.dept}>{emp.dept}</Text>
          </View>
          <View style={te.right}>
            <Text style={te.net}>{fmtFull(emp.net)}</Text>
            <View
              style={[
                te.changeBadge,
                { backgroundColor: emp.change >= 0 ? T.greenSoft : T.redSoft },
              ]}
            >
              <Ionicons
                name={emp.change >= 0 ? "trending-up" : "trending-down"}
                size={9}
                color={emp.change >= 0 ? T.green : T.red}
              />
              <Text
                style={[
                  te.changeTxt,
                  { color: emp.change >= 0 ? T.green : T.red },
                ]}
              >
                {emp.change >= 0 ? "+" : ""}
                {emp.change}%
              </Text>
            </View>
          </View>
        </View>
      ))}
  </View>
);
const te = StyleSheet.create({
  card: {
    marginHorizontal: 14,
    marginBottom: 16,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: 10,
  },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: "#F8FAFC" },
  rank: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: T.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: T.border,
  },
  rankGold: { backgroundColor: "#F59E0B", borderColor: "#F59E0B" },
  rankSilver: { backgroundColor: "#94A3B8", borderColor: "#94A3B8" },
  rankBronze: { backgroundColor: "#B45309", borderColor: "#B45309" },
  rankTxt: { fontSize: 10, fontWeight: "900", color: T.textMuted },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 12, fontWeight: "800", color: "#fff" },
  name: { fontSize: 13, fontWeight: "700", color: T.text },
  dept: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  right: { alignItems: "flex-end", gap: 3 },
  net: { fontSize: 14, fontWeight: "900", color: T.text },
  changeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
  },
  changeTxt: { fontSize: 9, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────
//  REPORT SHORTCUTS
// ─────────────────────────────────────────────────────────────
const ReportShortcuts = () => (
  <View style={rs.wrap}>
    <SectionHeader
      icon="document-text-outline"
      iconColor={T.green}
      iconBg={T.greenSoft}
      title="Reports"
    />
    <View style={rs.grid}>
      {REPORT_CARDS.map((r) => (
        <TouchableOpacity key={r.label} style={rs.card} activeOpacity={0.8}>
          <View style={[rs.icon, { backgroundColor: r.color + "15" }]}>
            <Ionicons name={r.icon} size={20} color={r.color} />
          </View>
          <Text style={rs.label}>{r.label}</Text>
          <Text style={rs.desc} numberOfLines={1}>
            {r.desc}
          </Text>
          <Ionicons
            name="arrow-forward"
            size={12}
            color={r.color}
            style={{ alignSelf: "flex-end", marginTop: 2 }}
          />
        </TouchableOpacity>
      ))}
    </View>
  </View>
);
const rs = StyleSheet.create({
  wrap: { marginHorizontal: 14, marginBottom: 16 },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  card: {
    width: "47.5%",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    gap: 6,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  icon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  label: { fontSize: 13, fontWeight: "800", color: T.text },
  desc: { fontSize: 10, color: T.textMuted, lineHeight: 14 },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function PayrollDashboardScreen() {
  const [period, setPeriod] = useState("Monthly");
  const [subPeriod, setSubPeriod] = useState("Mar");
  const [activeBar, setActiveBar] = useState(null);

  const data =
    period === "Monthly"
      ? MONTHLY_DATA[subPeriod] || MONTHLY_DATA["Mar"]
      : period === "Quarterly"
        ? QUARTERLY_DATA[subPeriod] || QUARTERLY_DATA["Q1 2026"]
        : YEARLY_DATA[subPeriod] || YEARLY_DATA["2026"];

  const periodLabel =
    period === "Monthly"
      ? `${subPeriod} 2026`
      : period === "Quarterly"
        ? subPeriod
        : `FY ${subPeriod}`;

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top bar */}
      <View style={s.topBar}>
        <View>
          <Text style={s.pageTitle}>Payroll Dashboard</Text>
          <Text style={s.pageSub}>Analytics & Reports</Text>
        </View>
        <View style={s.topActions}>
          <TouchableOpacity style={s.iconBtn}>
            <Ionicons
              name="notifications-outline"
              size={18}
              color={T.textSub}
            />
            <View style={s.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity style={s.exportBtn}>
            <Ionicons name="download-outline" size={13} color={T.textSub} />
            <Text style={s.exportTxt}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* Period selector */}
        <PeriodSelector
          period={period}
          setPeriod={setPeriod}
          sub={subPeriod}
          setSub={setSubPeriod}
        />

        {/* Hero */}
        <HeroSummary data={data} label={periodLabel} />

        {/* Trend — monthly only */}
        {period === "Monthly" && (
          <TrendBarChart activeBar={activeBar} setActiveBar={setActiveBar} />
        )}

        {/* Deduction breakdown */}
        <DeductionBreakdown data={data} />

        {/* Cost components */}
        <CostComponents data={data} />

        {/* Dept breakdown */}
        <DeptBreakdown />

        {/* Top earners */}
        <TopEarners />

        {/* Report shortcuts */}
        <ReportShortcuts />

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

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
  topActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconBtn: {
    position: "relative",
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: T.bg,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: T.border,
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: T.red,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#fff",
  },
  exportTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  scroll: { paddingTop: 16 },
});
