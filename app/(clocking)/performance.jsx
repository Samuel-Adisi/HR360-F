import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SW } = Dimensions.get("window");

// ─── Theme ────────────────────────────────────────────────────
const C = {
  bg: "#F0F2F8",
  card: "#FFFFFF",
  navy: "#0F172A",
  accent: "#4361EE",
  accentSoft: "#EEF0FF",
  indigo: "#6366F1",
  teal: "#0EA5E9",
  green: "#22C55E",
  greenSoft: "#EDFBF3",
  red: "#EF4444",
  redSoft: "#FEF2F2",
  yellow: "#F59E0B",
  yellowSoft: "#FFFBEB",
  orange: "#F97316",
  purple: "#8B5CF6",
  text: "#0F172A",
  textSub: "#475569",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
};

// ─── Mock Data ────────────────────────────────────────────────
const PERIOD_TABS = ["This Month", "Q1 2025", "2024"];

const KPI_CARDS = [
  {
    label: "Avg Score",
    value: "87.4",
    unit: "/100",
    icon: "star",
    color: C.accent,
    soft: C.accentSoft,
    trend: "+4.2%",
    up: true,
  },
  {
    label: "Completed",
    value: "142",
    unit: " rev",
    icon: "checkmark-circle",
    color: C.green,
    soft: C.greenSoft,
    trend: "+12",
    up: true,
  },
  {
    label: "Pending",
    value: "18",
    unit: " rev",
    icon: "time",
    color: C.yellow,
    soft: C.yellowSoft,
    trend: "-3",
    up: true,
  },
  {
    label: "At Risk",
    value: "6",
    unit: " emp",
    icon: "warning",
    color: C.red,
    soft: C.redSoft,
    trend: "+2",
    up: false,
  },
];

const BAR_DATA = [
  { label: "Jan", score: 72 },
  { label: "Feb", score: 78 },
  { label: "Mar", score: 81 },
  { label: "Apr", score: 75 },
  { label: "May", score: 88 },
  { label: "Jun", score: 84 },
  { label: "Jul", score: 91 },
  { label: "Aug", score: 87 },
];

const DEPT_DATA = [
  { dept: "Engineering", score: 91, employees: 24, color: C.accent },
  { dept: "Sales", score: 84, employees: 18, color: C.teal },
  { dept: "Marketing", score: 79, employees: 12, color: C.purple },
  { dept: "HR", score: 88, employees: 9, color: C.green },
  { dept: "Finance", score: 76, employees: 11, color: C.orange },
  { dept: "Operations", score: 82, employees: 16, color: C.indigo },
];

const TOP_PERFORMERS = [
  {
    name: "Sarah Chen",
    role: "Sr. Engineer",
    score: 98,
    dept: "Engineering",
    id: 1,
  },
  {
    name: "Marcus Williams",
    role: "Sales Lead",
    score: 96,
    dept: "Sales",
    id: 2,
  },
  {
    name: "Priya Patel",
    role: "Product Manager",
    score: 94,
    dept: "Marketing",
    id: 3,
  },
  {
    name: "James O'Brien",
    role: "DevOps Engineer",
    score: 93,
    dept: "Engineering",
    id: 4,
  },
  { name: "Aisha Kamara", role: "HR Manager", score: 91, dept: "HR", id: 5 },
];

const REVIEW_ITEMS = [
  {
    name: "Alex Turner",
    dept: "Finance",
    due: "3 days",
    score: null,
    status: "pending",
    id: 10,
  },
  {
    name: "Lena Fischer",
    dept: "Marketing",
    due: "Today",
    score: null,
    status: "overdue",
    id: 11,
  },
  {
    name: "Ryan Okoye",
    dept: "Engineering",
    due: "Done",
    score: 88,
    status: "completed",
    id: 12,
  },
  {
    name: "Sofia Mendez",
    dept: "Sales",
    due: "1 week",
    score: null,
    status: "pending",
    id: 13,
  },
];

const GOAL_DATA = [
  { label: "Goals Set", value: 248, color: C.accent },
  { label: "In Progress", value: 134, color: C.teal },
  { label: "Completed", value: 89, color: C.green },
  { label: "Missed", value: 25, color: C.red },
];

const getProfileImage = (id) =>
  `https://api.dicebear.com/7.x/avataaars/png?seed=perf_user_${id}&size=80&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

// ─── Animated Bar ─────────────────────────────────────────────
function AnimatedBar({
  score,
  maxScore = 100,
  color,
  height = 120,
  delay = 0,
}) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 700,
      delay,
      useNativeDriver: false,
    }).start();
  }, []);
  const barH = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, (score / maxScore) * height],
  });
  return (
    <Animated.View
      style={{
        width: "100%",
        height: barH,
        backgroundColor: color,
        borderRadius: 4,
      }}
    />
  );
}

// ─── Donut Ring (SVG-free) ────────────────────────────────────
// Simple circular progress using border trick
function CircleProgress({ pct, color, size = 64, strokeWidth = 7, label }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 900,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, []);

  // We'll use a visual approximation — two half-masks
  const rotate = Math.min(pct, 100) * 3.6; // degrees

  return (
    <View style={{ alignItems: "center", gap: 6 }}>
      <View
        style={{
          width: size,
          height: size,
          position: "relative",
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
            borderWidth: strokeWidth,
            borderColor: C.border,
          }}
        />
        {/* Fill arc approximation using rotation */}
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: strokeWidth,
            borderColor: color,
            borderTopColor: pct > 25 ? color : "transparent",
            borderRightColor: pct > 50 ? color : "transparent",
            borderBottomColor: pct > 75 ? color : "transparent",
            borderLeftColor: pct > 0 ? color : "transparent",
            transform: [{ rotate: `${rotate - 90}deg` }],
            opacity: 0.9,
          }}
        />
        <Text style={{ fontSize: 13, fontWeight: "800", color: C.text }}>
          {pct}%
        </Text>
      </View>
      {label && (
        <Text
          style={{
            fontSize: 10,
            color: C.textMuted,
            fontWeight: "600",
            textAlign: "center",
            maxWidth: 60,
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
}

// ─── Section Header ───────────────────────────────────────────
function SectionHeader({ title, icon, action, onAction }) {
  return (
    <View style={sh.row}>
      <View style={sh.left}>
        <Ionicons name={icon} size={16} color={C.accent} />
        <Text style={sh.title}>{title}</Text>
      </View>
      {action && (
        <TouchableOpacity onPress={onAction} style={sh.actionBtn}>
          <Text style={sh.actionTxt}>{action}</Text>
          <Ionicons name="chevron-forward" size={13} color={C.accent} />
        </TouchableOpacity>
      )}
    </View>
  );
}
const sh = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  left: { flexDirection: "row", alignItems: "center", gap: 7 },
  title: { fontSize: 15, fontWeight: "800", color: C.text },
  actionBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  actionTxt: { fontSize: 12, color: C.accent, fontWeight: "700" },
});

// ─── Main Dashboard ───────────────────────────────────────────
export default function PerformanceDashboard() {
  const [activePeriod, setActivePeriod] = useState(0);
  const [headerAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const statusMeta = (s) => {
    if (s === "overdue")
      return { label: "Overdue", color: C.red, bg: C.redSoft };
    if (s === "completed")
      return { label: "Done", color: C.green, bg: C.greenSoft };
    return { label: "Pending", color: C.yellow, bg: C.yellowSoft };
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Header ── */}
      <Animated.View style={[s.header, { opacity: headerAnim }]}>
        <View>
          <Text style={s.headerEyebrow}>OVERVIEW</Text>
          <Text style={s.headerTitle}>Performance</Text>
        </View>
        <View style={s.headerRight}>
          <TouchableOpacity style={s.headerIconBtn}>
            <Ionicons name="notifications-outline" size={20} color={C.text} />
            <View style={s.notifDot} />
          </TouchableOpacity>
          <TouchableOpacity style={s.headerIconBtn}>
            <Ionicons name="download-outline" size={20} color={C.text} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Period Selector ── */}
        <View style={s.periodRow}>
          {PERIOD_TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[s.periodTab, activePeriod === i && s.periodTabActive]}
              onPress={() => setActivePeriod(i)}
            >
              <Text
                style={[s.periodTxt, activePeriod === i && s.periodTxtActive]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Hero KPI Banner ── */}
        <View style={s.heroBanner}>
          {/* Decorative circles */}
          <View style={s.heroCircle1} />
          <View style={s.heroCircle2} />

          <View style={s.heroContent}>
            <View>
              <Text style={s.heroEye}>OVERALL RATING</Text>
              <Text style={s.heroScore}>87.4</Text>
              <View style={s.heroTrendRow}>
                <View style={s.heroTrendBadge}>
                  <Ionicons name="trending-up" size={12} color={C.green} />
                  <Text style={s.heroTrendTxt}>+4.2% vs last period</Text>
                </View>
              </View>
              <Text style={s.heroSub}>Based on 142 completed reviews</Text>
            </View>
            <View style={s.heroRings}>
              <CircleProgress
                pct={87}
                color="#60A5FA"
                size={72}
                strokeWidth={8}
                label="Reviews"
              />
              <CircleProgress
                pct={64}
                color="#34D399"
                size={56}
                strokeWidth={7}
                label="Goals"
              />
            </View>
          </View>
        </View>

        {/* ── KPI Cards 2×2 ── */}
        <View style={s.kpiGrid}>
          {KPI_CARDS.map((c) => {
            const cardW = (SW - 14 * 3) / 2;
            return (
              <View key={c.label} style={[s.kpiCard, { width: cardW }]}>
                <View style={s.kpiCardTop}>
                  <View style={[s.kpiIconBox, { backgroundColor: c.soft }]}>
                    <Ionicons name={c.icon} size={16} color={c.color} />
                  </View>
                  <View
                    style={[
                      s.kpiTrendBadge,
                      { backgroundColor: c.up ? C.greenSoft : C.redSoft },
                    ]}
                  >
                    <Ionicons
                      name={c.up ? "arrow-up" : "arrow-down"}
                      size={10}
                      color={c.up ? C.green : C.red}
                    />
                    <Text
                      style={[s.kpiTrendTxt, { color: c.up ? C.green : C.red }]}
                    >
                      {c.trend}
                    </Text>
                  </View>
                </View>
                <Text style={[s.kpiValue, { color: c.color }]}>
                  {c.value}
                  <Text style={s.kpiUnit}>{c.unit}</Text>
                </Text>
                <Text style={s.kpiLabel}>{c.label}</Text>
              </View>
            );
          })}
        </View>

        {/* ── Performance Trend Bar Chart ── */}
        <View style={s.section}>
          <SectionHeader
            title="Score Trend"
            icon="bar-chart-outline"
            action="Full Report"
          />
          <View style={s.barChartCard}>
            {/* Y-axis labels */}
            <View style={s.yAxis}>
              {[100, 75, 50, 25].map((v) => (
                <Text key={v} style={s.yLabel}>
                  {v}
                </Text>
              ))}
            </View>
            {/* Bars */}
            <View style={s.barsArea}>
              {/* Grid lines */}
              {[0, 1, 2, 3].map((i) => (
                <View key={i} style={[s.gridLine, { bottom: i * 30 }]} />
              ))}
              {BAR_DATA.map((d, i) => (
                <View key={d.label} style={s.barCol}>
                  <View style={s.barWrap}>
                    <AnimatedBar
                      score={d.score}
                      height={120}
                      color={
                        d.score >= 85
                          ? C.accent
                          : d.score >= 75
                            ? C.indigo
                            : C.teal
                      }
                      delay={i * 60}
                    />
                  </View>
                  <Text style={s.barLabel}>{d.label}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* ── Department Breakdown ── */}
        <View style={s.section}>
          <SectionHeader
            title="By Department"
            icon="business-outline"
            action="Details"
          />
          <View style={s.deptCard}>
            {DEPT_DATA.map((d, i) => (
              <View
                key={d.dept}
                style={[s.deptRow, i < DEPT_DATA.length - 1 && s.deptRowBorder]}
              >
                <View style={[s.deptDot, { backgroundColor: d.color }]} />
                <View style={s.deptInfo}>
                  <Text style={s.deptName}>{d.dept}</Text>
                  <Text style={s.deptEmp}>{d.employees} employees</Text>
                </View>
                <View style={s.deptRight}>
                  <View style={s.deptBarTrack}>
                    <View
                      style={[
                        s.deptBarFill,
                        { width: `${d.score}%`, backgroundColor: d.color },
                      ]}
                    />
                  </View>
                  <Text style={[s.deptScore, { color: d.color }]}>
                    {d.score}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* ── Goals Overview ── */}
        <View style={s.section}>
          <SectionHeader
            title="Goals Overview"
            icon="trophy-outline"
            action="View All"
          />
          <View style={s.goalsCard}>
            <View style={s.goalsTotal}>
              <Text style={s.goalsTotalNum}>248</Text>
              <Text style={s.goalsTotalLbl}>Total Goals</Text>
            </View>
            <View style={s.goalsList}>
              {GOAL_DATA.map((g) => {
                const pct = Math.round((g.value / 248) * 100);
                return (
                  <View key={g.label} style={s.goalItem}>
                    <View style={s.goalItemLeft}>
                      <View style={[s.goalDot, { backgroundColor: g.color }]} />
                      <Text style={s.goalLbl}>{g.label}</Text>
                    </View>
                    <View style={s.goalBarTrack}>
                      <View
                        style={[
                          s.goalBarFill,
                          { width: `${pct}%`, backgroundColor: g.color },
                        ]}
                      />
                    </View>
                    <Text style={[s.goalVal, { color: g.color }]}>
                      {g.value}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── Top Performers ── */}
        <View style={s.section}>
          <SectionHeader
            title="Top Performers"
            icon="medal-outline"
            action="See All"
          />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.topPerfScroll}
          >
            {TOP_PERFORMERS.map((p, i) => (
              <View key={p.id} style={s.perfCard}>
                {/* Rank badge */}
                <View
                  style={[
                    s.rankBadge,
                    i === 0 && s.rankGold,
                    i === 1 && s.rankSilver,
                    i === 2 && s.rankBronze,
                  ]}
                >
                  <Text style={s.rankTxt}>#{i + 1}</Text>
                </View>
                {/* Avatar */}
                <View style={s.perfAvatarWrap}>
                  <Image
                    source={{ uri: getProfileImage(p.id) }}
                    style={s.perfAvatar}
                    defaultSource={{ uri: getProfileImage(p.id) }}
                  />
                  {i === 0 && (
                    <View style={s.crownBadge}>
                      <Ionicons name="trophy" size={10} color="#F59E0B" />
                    </View>
                  )}
                </View>
                <Text style={s.perfName} numberOfLines={1}>
                  {p.name}
                </Text>
                <Text style={s.perfRole} numberOfLines={1}>
                  {p.role}
                </Text>
                <View style={s.perfDeptBadge}>
                  <Text style={s.perfDeptTxt}>{p.dept}</Text>
                </View>
                <View style={s.perfScoreWrap}>
                  <Text style={s.perfScore}>{p.score}</Text>
                  <Text style={s.perfScoreMax}>/100</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── Pending Reviews ── */}
        <View style={s.section}>
          <SectionHeader
            title="Review Queue"
            icon="clipboard-outline"
            action="Manage"
          />
          <View style={s.reviewsCard}>
            {REVIEW_ITEMS.map((r, i) => {
              const meta = statusMeta(r.status);
              return (
                <View
                  key={r.id}
                  style={[
                    s.reviewRow,
                    i < REVIEW_ITEMS.length - 1 && s.reviewRowBorder,
                  ]}
                >
                  <Image
                    source={{ uri: getProfileImage(r.id) }}
                    style={s.reviewAvatar}
                  />
                  <View style={s.reviewInfo}>
                    <Text style={s.reviewName}>{r.name}</Text>
                    <Text style={s.reviewDept}>{r.dept}</Text>
                  </View>
                  <View style={s.reviewRight}>
                    {r.score != null ? (
                      <Text style={[s.reviewScore, { color: C.green }]}>
                        {r.score}/100
                      </Text>
                    ) : (
                      <View
                        style={[
                          s.reviewStatusBadge,
                          { backgroundColor: meta.bg },
                        ]}
                      >
                        <Text
                          style={[s.reviewStatusTxt, { color: meta.color }]}
                        >
                          {meta.label}
                        </Text>
                      </View>
                    )}
                    {r.due !== "Done" && (
                      <Text
                        style={[
                          s.reviewDue,
                          r.status === "overdue" && { color: C.red },
                        ]}
                      >
                        {r.status === "overdue" ? "⚠ " : ""}
                        {r.due}
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── KPI Summary ── */}
        <View style={[s.section, { marginBottom: 24 }]}>
          <SectionHeader title="KPI Summary" icon="stats-chart-outline" />
          <View style={s.kpiSummaryGrid}>
            {[
              {
                label: "Appraisals Done",
                value: "89%",
                icon: "checkmark-done",
                color: C.green,
              },
              {
                label: "Goal Completion",
                value: "64%",
                icon: "flag",
                color: C.accent,
              },
              {
                label: "Avg Response Time",
                value: "2.3d",
                icon: "timer-outline",
                color: C.teal,
              },
              {
                label: "Team NPS Score",
                value: "72",
                icon: "happy-outline",
                color: C.purple,
              },
              {
                label: "Reviews Overdue",
                value: "6",
                icon: "alert-circle",
                color: C.red,
              },
              {
                label: "High Performers",
                value: "31%",
                icon: "trending-up",
                color: C.orange,
              },
            ].map((k) => (
              <View key={k.label} style={s.kpiSummaryCell}>
                <View
                  style={[
                    s.kpiSummaryIcon,
                    { backgroundColor: k.color + "18" },
                  ]}
                >
                  <Ionicons name={k.icon} size={18} color={k.color} />
                </View>
                <Text style={[s.kpiSummaryVal, { color: k.color }]}>
                  {k.value}
                </Text>
                <Text style={s.kpiSummaryLbl}>{k.label}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  headerEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: C.textMuted,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: C.text,
    letterSpacing: -0.5,
  },
  headerRight: { flexDirection: "row", gap: 8 },
  headerIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.bg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    position: "relative",
  },
  notifDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.red,
    borderWidth: 1.5,
    borderColor: C.card,
  },

  // Period tabs
  periodRow: {
    flexDirection: "row",
    marginHorizontal: 14,
    marginTop: 14,
    marginBottom: 4,
    backgroundColor: C.card,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: C.border,
  },
  periodTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 9,
  },
  periodTabActive: {
    backgroundColor: C.accent,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  periodTxt: { fontSize: 12, fontWeight: "600", color: C.textSub },
  periodTxtActive: { color: "#fff", fontWeight: "800" },

  // Hero Banner
  heroBanner: {
    marginHorizontal: 14,
    marginTop: 12,
    borderRadius: 20,
    backgroundColor: C.navy,
    padding: 20,
    overflow: "hidden",
    minHeight: 140,
  },
  heroCircle1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: C.accent,
    opacity: 0.12,
    top: -60,
    right: -40,
  },
  heroCircle2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: C.indigo,
    opacity: 0.15,
    bottom: -30,
    left: 60,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroEye: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "800",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroScore: {
    fontSize: 48,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 52,
  },
  heroTrendRow: { flexDirection: "row", marginTop: 8, marginBottom: 6 },
  heroTrendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(34,197,94,0.2)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
  },
  heroTrendTxt: { fontSize: 11, color: C.green, fontWeight: "700" },
  heroSub: { fontSize: 11, color: "rgba(255,255,255,0.45)" },
  heroRings: { gap: 10, alignItems: "center" },

  // KPI Cards
  kpiGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  kpiCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: C.border,
    gap: 4,
  },
  kpiCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  kpiIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  kpiTrendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 7,
  },
  kpiTrendTxt: { fontSize: 10, fontWeight: "700" },
  kpiValue: { fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
  kpiUnit: { fontSize: 13, fontWeight: "600", opacity: 0.6 },
  kpiLabel: { fontSize: 11, color: C.textMuted, fontWeight: "600" },

  // Sections
  section: { paddingHorizontal: 14, marginTop: 20 },

  // Bar Chart
  barChartCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  yAxis: {
    justifyContent: "space-between",
    paddingBottom: 20,
    marginRight: 8,
    width: 24,
  },
  yLabel: {
    fontSize: 9,
    color: C.textMuted,
    fontWeight: "600",
    textAlign: "right",
  },
  barsArea: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-end",
    height: 140,
    position: "relative",
    gap: 6,
  },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: C.border,
  },
  barCol: { flex: 1, alignItems: "center", gap: 6 },
  barWrap: { width: "100%", height: 120, justifyContent: "flex-end" },
  barLabel: { fontSize: 9, color: C.textMuted, fontWeight: "600" },

  // Dept card
  deptCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  deptRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  deptRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  deptDot: { width: 10, height: 10, borderRadius: 5 },
  deptInfo: { width: 100 },
  deptName: { fontSize: 13, fontWeight: "700", color: C.text },
  deptEmp: { fontSize: 10, color: C.textMuted, marginTop: 1 },
  deptRight: { flex: 1, flexDirection: "row", alignItems: "center", gap: 8 },
  deptBarTrack: {
    flex: 1,
    height: 7,
    backgroundColor: C.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  deptBarFill: { height: "100%", borderRadius: 4 },
  deptScore: { fontSize: 13, fontWeight: "800", width: 26, textAlign: "right" },

  // Goals
  goalsCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    gap: 16,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    alignItems: "center",
  },
  goalsTotal: { alignItems: "center", width: 70 },
  goalsTotalNum: {
    fontSize: 32,
    fontWeight: "900",
    color: C.text,
    letterSpacing: -1,
  },
  goalsTotalLbl: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: "700",
    textAlign: "center",
  },
  goalsList: { flex: 1, gap: 9 },
  goalItem: { flexDirection: "row", alignItems: "center", gap: 8 },
  goalItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    width: 90,
  },
  goalDot: { width: 7, height: 7, borderRadius: 3.5 },
  goalLbl: { fontSize: 11, color: C.textSub, fontWeight: "600" },
  goalBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: C.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  goalBarFill: { height: "100%", borderRadius: 3 },
  goalVal: { fontSize: 12, fontWeight: "800", width: 28, textAlign: "right" },

  // Top performers
  topPerfScroll: { gap: 10, paddingBottom: 4 },
  perfCard: {
    width: 130,
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    position: "relative",
  },
  rankBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    width: 22,
    height: 22,
    borderRadius: 7,
    backgroundColor: C.border,
    justifyContent: "center",
    alignItems: "center",
  },
  rankGold: { backgroundColor: "#FEF3C7" },
  rankSilver: { backgroundColor: "#F1F5F9" },
  rankBronze: { backgroundColor: "#FEF0E6" },
  rankTxt: { fontSize: 9, fontWeight: "900", color: C.textSub },
  perfAvatarWrap: { position: "relative", marginBottom: 8 },
  perfAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2.5,
    borderColor: C.accentSoft,
  },
  crownBadge: {
    position: "absolute",
    bottom: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#FFFBEB",
    borderWidth: 1.5,
    borderColor: "#F59E0B",
    justifyContent: "center",
    alignItems: "center",
  },
  perfName: {
    fontSize: 12,
    fontWeight: "800",
    color: C.text,
    textAlign: "center",
  },
  perfRole: {
    fontSize: 10,
    color: C.textMuted,
    textAlign: "center",
    marginTop: 2,
  },
  perfDeptBadge: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
    backgroundColor: C.accentSoft,
  },
  perfDeptTxt: { fontSize: 9, color: C.accent, fontWeight: "700" },
  perfScoreWrap: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: 1,
    marginTop: 8,
  },
  perfScore: {
    fontSize: 22,
    fontWeight: "900",
    color: C.accent,
    letterSpacing: -0.5,
  },
  perfScoreMax: { fontSize: 11, color: C.textMuted, fontWeight: "600" },

  // Reviews
  reviewsCard: {
    backgroundColor: C.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  reviewRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 13,
    gap: 12,
  },
  reviewRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  reviewAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  reviewInfo: { flex: 1 },
  reviewName: { fontSize: 13, fontWeight: "700", color: C.text },
  reviewDept: { fontSize: 11, color: C.textMuted, marginTop: 1 },
  reviewRight: { alignItems: "flex-end", gap: 3 },
  reviewScore: { fontSize: 15, fontWeight: "800" },
  reviewStatusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
  },
  reviewStatusTxt: { fontSize: 11, fontWeight: "700" },
  reviewDue: { fontSize: 10, color: C.textMuted, fontWeight: "600" },

  // KPI Summary
  kpiSummaryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  kpiSummaryCell: {
    width: (SW - 14 * 2 - 10 * 2) / 3,
    backgroundColor: C.card,
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  kpiSummaryIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  kpiSummaryVal: { fontSize: 20, fontWeight: "900", letterSpacing: -0.5 },
  kpiSummaryLbl: {
    fontSize: 9,
    color: C.textMuted,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 13,
  },
});
