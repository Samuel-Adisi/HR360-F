import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
//  THEME — matches employee screen exactly
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
  teal: "#0EA5E9",
  yellow: "#F59E0B",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA — mirrors the Django model fields
// ─────────────────────────────────────────────────────────────
const MOCK_JOBS = [
  {
    id: 1,
    job_title: "Senior React Native Developer",
    department: "Engineering",
    location: "Remote",
    remote_options: "Remote",
    job_type: "Full-time",
    experience_level: "Senior (5-10 years)",
    salary_min: 95000,
    salary_max: 130000,
    salary_currency: "USD",
    salary_period: "Yearly",
    status: "Active",
    priority: "High",
    positions: 2,
    deadline: "2025-04-30",
    views_count: 342,
    applications_count: 28,
    qualified_applications_count: 9,
    is_featured: true,
    created_at: "2025-01-15",
  },
  {
    id: 2,
    job_title: "Product Marketing Manager",
    department: "Marketing",
    location: "New York, NY",
    remote_options: "Hybrid",
    job_type: "Full-time",
    experience_level: "Mid level (3-5 years)",
    salary_min: 75000,
    salary_max: 95000,
    salary_currency: "USD",
    salary_period: "Yearly",
    status: "Active",
    priority: "Medium",
    positions: 1,
    deadline: "2025-03-31",
    views_count: 218,
    applications_count: 14,
    qualified_applications_count: 5,
    is_featured: false,
    created_at: "2025-01-20",
  },
  {
    id: 3,
    job_title: "Financial Analyst",
    department: "Finance",
    location: "Chicago, IL",
    remote_options: "On-site",
    job_type: "Full-time",
    experience_level: "Junior (1-3 years)",
    salary_min: 55000,
    salary_max: 72000,
    salary_currency: "USD",
    salary_period: "Yearly",
    status: "Draft",
    priority: "Low",
    positions: 1,
    deadline: "2025-05-15",
    views_count: 0,
    applications_count: 0,
    qualified_applications_count: 0,
    is_featured: false,
    created_at: "2025-02-01",
  },
  {
    id: 4,
    job_title: "UX/UI Designer",
    department: "Design",
    location: "San Francisco, CA",
    remote_options: "Hybrid",
    job_type: "Contract",
    experience_level: "Mid level (3-5 years)",
    salary_min: 85,
    salary_max: 110,
    salary_currency: "USD",
    salary_period: "Hourly",
    status: "Active",
    priority: "Urgent",
    positions: 1,
    deadline: "2025-03-15",
    views_count: 189,
    applications_count: 21,
    qualified_applications_count: 7,
    is_featured: true,
    created_at: "2025-01-28",
  },
  {
    id: 5,
    job_title: "HR Business Partner",
    department: "Human Resources",
    location: "Remote",
    remote_options: "Remote",
    job_type: "Full-time",
    experience_level: "Senior (5-10 years)",
    salary_min: 80000,
    salary_max: 105000,
    salary_currency: "USD",
    salary_period: "Yearly",
    status: "Closed",
    priority: "Medium",
    positions: 1,
    deadline: "2025-02-28",
    views_count: 410,
    applications_count: 52,
    qualified_applications_count: 12,
    is_featured: false,
    created_at: "2024-12-10",
  },
  {
    id: 6,
    job_title: "Customer Success Manager",
    department: "Customer Support",
    location: "Austin, TX",
    remote_options: "Hybrid",
    job_type: "Full-time",
    experience_level: "Junior (1-3 years)",
    salary_min: 50000,
    salary_max: 65000,
    salary_currency: "USD",
    salary_period: "Yearly",
    status: "Filled",
    priority: "High",
    positions: 3,
    deadline: "2025-02-01",
    views_count: 276,
    applications_count: 39,
    qualified_applications_count: 11,
    is_featured: false,
    created_at: "2024-11-20",
  },
];

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const PERIOD_TABS = ["This Month", "Q1 2025", "2024"];

const DEPT_COLORS = {
  Engineering: { accent: "#3B82F6", soft: "#EFF6FF", text: "#1E40AF" },
  Marketing: { accent: "#F59E0B", soft: "#FFFBEB", text: "#92400E" },
  Finance: { accent: "#F97316", soft: "#FFF7ED", text: "#9A3412" },
  Design: { accent: "#10B981", soft: "#ECFDF5", text: "#065F46" },
  "Human Resources": { accent: "#EC4899", soft: "#FDF2F8", text: "#9D174D" },
  "Customer Support": { accent: "#8B5CF6", soft: "#F5F3FF", text: "#5B21B6" },
  Operations: { accent: "#0EA5E9", soft: "#F0F9FF", text: "#0C4A6E" },
  "Product Management": { accent: "#6366F1", soft: "#EEF2FF", text: "#3730A3" },
  Sales: { accent: "#14B8A6", soft: "#F0FDFA", text: "#134E4A" },
};

const STATUS_META = {
  Active: { color: "#16A34A", bg: "#DCFCE7", text: "#166534" },
  Draft: { color: "#D97706", bg: "#FEF3C7", text: "#92400E" },
  Paused: { color: "#6366F1", bg: "#EEF2FF", text: "#3730A3" },
  Closed: { color: "#64748B", bg: "#F1F5F9", text: "#334155" },
  Filled: { color: "#3B82F6", bg: "#EFF6FF", text: "#1E40AF" },
  Cancelled: { color: "#EF4444", bg: "#FEF2F2", text: "#991B1B" },
};

const PRIORITY_META = {
  Low: { color: "#64748B", bg: "#F1F5F9" },
  Medium: { color: "#D97706", bg: "#FEF3C7" },
  High: { color: "#DC2626", bg: "#FEE2E2" },
  Urgent: { color: "#7C3AED", bg: "#EDE9FE" },
};

const FILTER_STATUSES = ["All", "Active", "Draft", "Filled", "Closed"];
const DEPT_OPTIONS = [
  "All",
  "Engineering",
  "Marketing",
  "Finance",
  "Design",
  "Human Resources",
  "Customer Support",
];
const JOB_TYPE_OPTIONS = [
  "All",
  "Full-time",
  "Part-time",
  "Contract",
  "Internship",
  "Freelance",
];
const REMOTE_OPTIONS = ["All", "Remote", "Hybrid", "On-site"];
const EXP_OPTIONS = [
  "All",
  "Entry Level",
  "Junior (1-3 years)",
  "Mid level (3-5 years)",
  "Senior (5-10 years)",
  "Lead (10+ years)",
];

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
const formatSalary = (min, max, currency = "USD", period = "Yearly") => {
  if (!min && !max) return "Salary not specified";
  const sym = currency === "USD" ? "$" : currency;
  const fmt = (n) =>
    period === "Hourly"
      ? `${sym}${n}/hr`
      : `${sym}${Number(n).toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
};

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const daysLeft = (deadline) => {
  const diff = Math.ceil(
    (new Date(deadline) - new Date()) / (1000 * 60 * 60 * 24),
  );
  if (diff < 0) return { label: "Expired", color: T.red };
  if (diff === 0) return { label: "Today", color: T.red };
  if (diff <= 7) return { label: `${diff}d left`, color: T.yellow };
  return { label: `${diff}d left`, color: T.textMuted };
};

// ─────────────────────────────────────────────────────────────
//  RING CHART  (same as employee screen)
// ─────────────────────────────────────────────────────────────
const RingChart = ({
  pct = 75,
  size = 58,
  stroke = 7,
  color = "#60A5FA",
  label,
}) => (
  <View style={{ alignItems: "center", gap: 5 }}>
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
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

// ─────────────────────────────────────────────────────────────
//  STATS WIDGET  (dark hero + metric sub-cards)
// ─────────────────────────────────────────────────────────────
const StatsWidget = ({ jobs }) => {
  const [activePeriod, setActivePeriod] = useState(0);

  const total = jobs.length;
  const active = jobs.filter((j) => j.status === "Active").length;
  const totalApps = jobs.reduce((s, j) => s + (j.applications_count || 0), 0);
  const totalViews = jobs.reduce((s, j) => s + (j.views_count || 0), 0);
  const filled = jobs.filter((j) => j.status === "Filled").length;
  const qualified = jobs.reduce(
    (s, j) => s + (j.qualified_applications_count || 0),
    0,
  );

  const fillRate = total > 0 ? Math.round((filled / total) * 100) : 0;
  const applyRate =
    totalViews > 0 ? Math.round((totalApps / totalViews) * 100) : 0;

  const METRICS = [
    {
      value: String(total),
      unit: "jobs",
      label: "Total Postings",
      trend: "+3",
      up: true,
    },
    {
      value: String(active),
      unit: "live",
      label: "Active",
      trend: "+1",
      up: true,
    },
    {
      value: String(totalApps),
      unit: "apps",
      label: "Applications",
      trend: "+18%",
      up: true,
    },
    {
      value: String(qualified),
      unit: "qual",
      label: "Qualified",
      trend: "+5",
      up: true,
    },
  ];

  return (
    <View style={sw.wrapper}>
      {/* Dark hero */}
      <View style={sw.heroCard}>
        <View style={sw.blob1} />
        <View style={sw.blob2} />
        <View style={sw.heroInner}>
          <View style={sw.heroLeft}>
            <Text style={sw.heroEyebrow}>JOB POSTINGS</Text>
            <Text style={sw.heroScore}>{total}</Text>
            <View style={sw.trendBadge}>
              <Ionicons name="trending-up" size={11} color="#4ADE80" />
              <Text style={sw.trendTxt}>+12.4% vs last period</Text>
            </View>
            <Text style={sw.heroSub}>
              {totalApps} total applications received
            </Text>
          </View>
          <View style={sw.heroRings}>
            <RingChart
              pct={fillRate}
              size={64}
              stroke={8}
              color="#60A5FA"
              label="Fill Rate"
            />
            <RingChart
              pct={applyRate > 100 ? 100 : applyRate}
              size={52}
              stroke={7}
              color="#4ADE80"
              label="Apply Rate"
            />
          </View>
        </View>
      </View>

      {/* Metric sub-cards */}
      <View style={sw.metricGrid}>
        {METRICS.map((m) => (
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

const sw = StyleSheet.create({
  wrapper: { paddingHorizontal: 14, marginBottom: 14 },
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
  metricGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
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

// ─────────────────────────────────────────────────────────────
//  JOB DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const JobModal = ({ job, onClose, onDelete, onEdit }) => {
  if (!job) return null;
  const dept = DEPT_COLORS[job.department] || {
    accent: "#64748B",
    soft: "#F1F5F9",
    text: "#334155",
  };
  const status = STATUS_META[job.status] || STATUS_META.Draft;
  const prio = PRIORITY_META[job.priority] || PRIORITY_META.Medium;
  const dl = daysLeft(job.deadline);

  const handleDelete = () => {
    Alert.alert(
      "Delete Job Posting",
      `Are you sure you want to delete "${job.job_title}"? This cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            onDelete(job.id);
            onClose();
          },
        },
      ],
    );
  };

  const infoRows = [
    { icon: "business-outline", label: "Department", value: job.department },
    {
      icon: "location-outline",
      label: "Location",
      value: `${job.location} · ${job.remote_options}`,
    },
    { icon: "briefcase-outline", label: "Job Type", value: job.job_type },
    {
      icon: "school-outline",
      label: "Experience",
      value: job.experience_level,
    },
    {
      icon: "people-outline",
      label: "Open Positions",
      value: `${job.positions} position${job.positions > 1 ? "s" : ""}`,
    },
    {
      icon: "calendar-outline",
      label: "Deadline",
      value: formatDate(job.deadline),
    },
    {
      icon: "time-outline",
      label: "Posted",
      value: formatDate(job.created_at),
    },
  ];

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={jm.overlay}>
        <View style={jm.sheet}>
          <View style={jm.handle} />

          {/* Header */}
          <View style={jm.header}>
            <Text style={jm.title}>Job Details</Text>
            <View style={jm.headerActions}>
              <TouchableOpacity onPress={handleDelete} style={jm.deleteBtn}>
                <Ionicons name="trash-outline" size={17} color={T.red} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={jm.closeBtn}>
                <Ionicons name="close" size={18} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={[jm.heroCard, { backgroundColor: dept.soft }]}>
              {/* Department icon circle */}
              <View style={[jm.deptCircle, { backgroundColor: dept.accent }]}>
                <Ionicons name="briefcase" size={22} color="#fff" />
              </View>
              <Text style={jm.heroTitle}>{job.job_title}</Text>
              <Text style={[jm.heroDept, { color: dept.text }]}>
                {job.department}
              </Text>

              {/* Badges row */}
              <View style={jm.badgeRow}>
                <View style={[jm.badge, { backgroundColor: status.bg }]}>
                  <View
                    style={[jm.badgeDot, { backgroundColor: status.color }]}
                  />
                  <Text style={[jm.badgeTxt, { color: status.text }]}>
                    {job.status}
                  </Text>
                </View>
                <View style={[jm.badge, { backgroundColor: prio.bg }]}>
                  <Ionicons name="flag" size={10} color={prio.color} />
                  <Text style={[jm.badgeTxt, { color: prio.color }]}>
                    {job.priority}
                  </Text>
                </View>
                {job.is_featured && (
                  <View style={[jm.badge, { backgroundColor: "#FEF3C7" }]}>
                    <Ionicons name="star" size={10} color="#D97706" />
                    <Text style={[jm.badgeTxt, { color: "#92400E" }]}>
                      Featured
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Salary banner */}
            <View style={jm.salaryBanner}>
              <Ionicons name="cash-outline" size={18} color={T.blue} />
              <Text style={jm.salaryTxt}>
                {formatSalary(
                  job.salary_min,
                  job.salary_max,
                  job.salary_currency,
                  job.salary_period,
                )}
              </Text>
              <Text style={jm.salaryPeriod}>/ {job.salary_period}</Text>
            </View>

            {/* Stats row */}
            <View style={jm.statsRow}>
              {[
                { icon: "eye-outline", val: job.views_count, lbl: "Views" },
                {
                  icon: "document-outline",
                  val: job.applications_count,
                  lbl: "Applied",
                },
                {
                  icon: "checkmark-circle-outline",
                  val: job.qualified_applications_count,
                  lbl: "Qualified",
                },
              ].map((s) => (
                <View key={s.lbl} style={jm.statItem}>
                  <Ionicons name={s.icon} size={16} color={T.textMuted} />
                  <Text style={jm.statVal}>{s.val}</Text>
                  <Text style={jm.statLbl}>{s.lbl}</Text>
                </View>
              ))}
            </View>

            {/* Info rows */}
            <View style={jm.infoSection}>
              {infoRows.map(({ icon, label, value }) => (
                <View key={label} style={jm.infoRow}>
                  <View style={jm.infoIconWrap}>
                    <Ionicons name={icon} size={15} color="#64748B" />
                  </View>
                  <View style={jm.infoContent}>
                    <Text style={jm.infoLabel}>{label}</Text>
                    <Text style={jm.infoValue}>{value}</Text>
                  </View>
                  {label === "Deadline" && (
                    <Text style={[jm.deadlinePill, { color: dl.color }]}>
                      {dl.label}
                    </Text>
                  )}
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Footer */}
          <View style={jm.footer}>
            <View style={jm.footerRow}>
              <TouchableOpacity
                style={jm.editBtn}
                onPress={() => {
                  onEdit(job);
                  onClose();
                }}
              >
                <Ionicons name="create-outline" size={16} color="#fff" />
                <Text style={jm.editBtnTxt}>Edit Posting</Text>
              </TouchableOpacity>
              <TouchableOpacity style={jm.appsBtn} onPress={onClose}>
                <Ionicons name="people-outline" size={16} color="#fff" />
                <Text style={jm.appsBtnTxt}>Applications</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const jm = StyleSheet.create({
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
  deptCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#1E293B",
    textAlign: "center",
  },
  heroDept: { fontSize: 13, fontWeight: "500" },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeDot: { width: 4, height: 4, borderRadius: 2 },
  badgeTxt: { fontSize: 11, fontWeight: "700" },

  salaryBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 13,
  },
  salaryTxt: { fontSize: 15, fontWeight: "800", color: T.blue, flex: 1 },
  salaryPeriod: { fontSize: 11, color: T.textMuted, fontWeight: "600" },

  statsRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    gap: 0,
  },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statVal: { fontSize: 18, fontWeight: "900", color: T.text },
  statLbl: { fontSize: 10, color: T.textMuted, fontWeight: "600" },

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
  deadlinePill: { fontSize: 11, fontWeight: "700" },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerRow: { flexDirection: "row", gap: 10 },
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
  editBtnTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
  appsBtn: {
    flex: 0.7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: T.blue,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  appsBtnTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  JOB CARD  (list view)
// ─────────────────────────────────────────────────────────────
const JobCard = ({ job, onPress }) => {
  const status = STATUS_META[job.status] || STATUS_META.Draft;
  const dl = daysLeft(job.deadline);

  // Single neutral icon background — no rainbow dept colors
  const iconBg = "#F1F5F9";
  const iconColor = "#475569";

  const metaParts = [job.remote_options, job.job_type, job.experience_level]
    .filter(Boolean)
    .join(" · ");

  return (
    <TouchableOpacity
      style={jc.card}
      onPress={() => onPress(job)}
      activeOpacity={0.85}
    >
      {/* Top row: icon + title block + status */}
      <View style={jc.topRow}>
        <View style={[jc.deptIcon, { backgroundColor: iconBg }]}>
          <Ionicons name="briefcase-outline" size={20} color={iconColor} />
        </View>

        <View style={jc.titleBlock}>
          <View style={jc.titleLine}>
            <Text style={jc.title} numberOfLines={1}>
              {job.job_title}
            </Text>
            {job.is_featured && (
              <Ionicons
                name="shield-checkmark"
                size={14}
                color="#0A66C2"
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          <Text style={jc.company} numberOfLines={1}>
            {job.department}
          </Text>
          <Text style={jc.location} numberOfLines={1}>
            {job.location} · {job.remote_options}
          </Text>
        </View>
      </View>

      {/* Meta line */}
      <Text style={jc.meta}>
        {job.job_type} · {job.experience_level}
      </Text>

      {/* Salary */}
      {(job.salary_min || job.salary_max) && (
        <Text style={jc.salary}>
          {formatSalary(
            job.salary_min,
            job.salary_max,
            job.salary_currency,
            job.salary_period,
          )}
        </Text>
      )}

      {/* Benefits / positions pill */}
      {job.positions > 0 && (
        <View style={jc.benefitRow}>
          <Ionicons name="people-outline" size={13} color="#16A34A" />
          <Text style={jc.benefitTxt}>
            {job.positions} open position{job.positions > 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Footer: posted date · status · deadline */}
      <View style={jc.footer}>
        <Text style={jc.footerDate}>{formatDate(job.created_at)}</Text>
        <View style={jc.dot} />
        <View style={[jc.statusBadge, { backgroundColor: status.bg }]}>
          <View style={[jc.statusDot, { backgroundColor: status.color }]} />
          <Text style={[jc.statusTxt, { color: status.text }]}>
            {job.status}
          </Text>
        </View>
        <View style={jc.dot} />
        <Text style={[jc.deadlineTxt, { color: dl.color }]}>{dl.label}</Text>
      </View>
    </TouchableOpacity>
  );
};

const jc = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 0,
    borderBottomWidth: 8,
    borderBottomColor: "#F1F5F9",
  },

  // Top row
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 8,
  },
  deptIcon: {
    width: 48,
    height: 48,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  titleBlock: { flex: 1 },
  titleLine: { flexDirection: "row", alignItems: "center" },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
    flex: 1,
  },
  company: {
    fontSize: 13,
    color: "#475569",
    fontWeight: "400",
    marginTop: 1,
  },
  location: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 1,
  },

  // Meta + salary
  meta: {
    fontSize: 12,
    color: "#64748B",
    marginBottom: 3,
  },
  salary: {
    fontSize: 13,
    color: "#1E293B",
    fontWeight: "600",
    marginBottom: 6,
  },

  // Benefits
  benefitRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  benefitTxt: {
    fontSize: 12,
    color: "#16A34A",
    fontWeight: "600",
  },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 10,
  },
  footerDate: {
    fontSize: 11,
    color: "#94A3B8",
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: "#CBD5E1",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusTxt: { fontSize: 10, fontWeight: "700" },
  deadlineTxt: { fontSize: 11, fontWeight: "600" },

  // Apply button
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    borderWidth: 1.5,
    borderColor: "#0A66C2",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  applyTxt: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0A66C2",
  },
});

// ─────────────────────────────────────────────────────────────
//  FILTER PANEL
// ─────────────────────────────────────────────────────────────
const FilterPanel = ({ filters, setFilters, onClear }) => {
  const Section = ({ title, options, filterKey }) => (
    <View style={fp.section}>
      <View style={fp.sectionHead}>
        <Text style={fp.sectionTitle}>{title}</Text>
        {filters[filterKey] !== "All" && (
          <TouchableOpacity
            onPress={() => setFilters((p) => ({ ...p, [filterKey]: "All" }))}
          >
            <Text style={fp.clearTxt}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={fp.chips}
      >
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[fp.chip, filters[filterKey] === opt && fp.chipActive]}
            onPress={() => setFilters((p) => ({ ...p, [filterKey]: opt }))}
          >
            <Text
              style={[
                fp.chipTxt,
                filters[filterKey] === opt && fp.chipTxtActive,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <ScrollView style={fp.container} showsVerticalScrollIndicator={false}>
      <Section
        title="Department"
        options={DEPT_OPTIONS}
        filterKey="department"
      />
      <Section
        title="Job Type"
        options={JOB_TYPE_OPTIONS}
        filterKey="jobType"
      />
      <Section
        title="Work Arrangement"
        options={REMOTE_OPTIONS}
        filterKey="remote"
      />
      <Section
        title="Experience Level"
        options={EXP_OPTIONS}
        filterKey="experience"
      />
      <TouchableOpacity style={fp.clearAll} onPress={onClear}>
        <Text style={fp.clearAllTxt}>Clear All Filters</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const fp = StyleSheet.create({
  container: {
    maxHeight: 280,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  section: { paddingVertical: 10 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 13, fontWeight: "700", color: T.text },
  clearTxt: { fontSize: 12, color: T.blue, fontWeight: "600" },
  chips: { paddingHorizontal: 16, gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: T.border,
  },
  chipActive: { backgroundColor: T.blue, borderColor: T.blue },
  chipTxt: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  chipTxtActive: { color: "#fff" },
  clearAll: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    alignItems: "center",
  },
  clearAllTxt: { fontSize: 14, fontWeight: "700", color: "#475569" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function JobPostingsScreen() {
  const [jobs, setJobs] = useState(MOCK_JOBS);
  const [selectedJob, setSelectedJob] = useState(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeStatus, setActiveStatus] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [filters, setFilters] = useState({
    department: "All",
    jobType: "All",
    remote: "All",
    experience: "All",
  });

  // ── Derived filtered list ──
  const filtered = useMemo(() => {
    let list = jobs;
    if (activeStatus !== "All")
      list = list.filter((j) => j.status === activeStatus);
    if (filters.department !== "All")
      list = list.filter((j) => j.department === filters.department);
    if (filters.jobType !== "All")
      list = list.filter((j) => j.job_type === filters.jobType);
    if (filters.remote !== "All")
      list = list.filter((j) => j.remote_options === filters.remote);
    if (filters.experience !== "All")
      list = list.filter((j) => j.experience_level === filters.experience);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (j) =>
          j.job_title.toLowerCase().includes(q) ||
          j.department.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.job_type.toLowerCase().includes(q) ||
          j.experience_level.toLowerCase().includes(q) ||
          j.status.toLowerCase().includes(q),
      );
    }
    return list;
  }, [jobs, activeStatus, filters, search]);

  const hasActiveFilters =
    filters.department !== "All" ||
    filters.jobType !== "All" ||
    filters.remote !== "All" ||
    filters.experience !== "All";

  const clearFilters = () => {
    setFilters({
      department: "All",
      jobType: "All",
      remote: "All",
      experience: "All",
    });
    setSearch("");
    setActiveStatus("All");
  };

  const handleDelete = (id) => {
    Alert.alert("Delete Job Posting", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setJobs((prev) => prev.filter((j) => j.id !== id)),
      },
    ]);
  };

  const handleEdit = (job) => router.push(`/edit-job-posting/${job.id}`);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  const renderItem = ({ item }) => (
    <JobCard job={item} onPress={setSelectedJob} onDelete={handleDelete} />
  );

  const ListHeader = () => (
    <>
      {/* Title row */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Job Postings</Text>
          <Text style={s.pageSubtitle}>{jobs.length} total postings</Text>
        </View>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push("/add-job-posting")}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={s.addBtnText}>Post Job</Text>
        </TouchableOpacity>
      </View>

      {/* Stats widget */}
      <StatsWidget jobs={jobs} />

      {/* Search */}
      <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
        <Ionicons
          name="search-outline"
          size={16}
          color={searchFocused ? T.blue : "#94A3B8"}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search by title, department, location, type…"
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={setSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          autoCorrect={false}
        />
        <TouchableOpacity
          style={[
            s.filterIconBtn,
            (showFilters || hasActiveFilters) && s.filterIconBtnActive,
          ]}
          onPress={() => setShowFilters((p) => !p)}
        >
          <Ionicons
            name={showFilters ? "filter" : "filter-outline"}
            size={16}
            color={showFilters || hasActiveFilters ? "#fff" : T.blue}
          />
          {hasActiveFilters && <View style={s.filterDot} />}
        </TouchableOpacity>
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color="#94A3B8" />
          </TouchableOpacity>
        )}
      </View>

      {/* Hint chips */}
      {!search && !showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.hintChips}
        >
          {[
            "Engineering",
            "Remote",
            "Full-time",
            "Senior",
            "Active",
            "Urgent",
          ].map((chip) => (
            <TouchableOpacity
              key={chip}
              style={s.hintChip}
              onPress={() => setSearch(chip)}
            >
              <Text style={s.hintChipTxt}>{chip}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Filter panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          setFilters={setFilters}
          onClear={clearFilters}
        />
      )}

      {/* Status tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.statusTabs}
      >
        {FILTER_STATUSES.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.statusTab, activeStatus === tab && s.statusTabActive]}
            onPress={() => setActiveStatus(tab)}
          >
            <Text
              style={[
                s.statusTabTxt,
                activeStatus === tab && s.statusTabTxtActive,
              ]}
            >
              {tab}
            </Text>
            {tab !== "All" && (
              <View
                style={[
                  s.statusCount,
                  activeStatus === tab && s.statusCountActive,
                ]}
              >
                <Text
                  style={[
                    s.statusCountTxt,
                    activeStatus === tab && s.statusCountTxtActive,
                  ]}
                >
                  {jobs.filter((j) => j.status === tab).length}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={s.exportBtn}>
          <Ionicons name="download-outline" size={14} color="#334155" />
          <Text style={s.exportTxt}>Export</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Results label */}
      {(search.trim() !== "" || hasActiveFilters) && (
        <Text style={s.resultsLabel}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""} found
          {search.trim() !== "" ? ` for "${search}"` : ""}
        </Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="briefcase-outline" size={52} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No job postings found</Text>
            <Text style={s.emptySubTxt}>
              Try adjusting your filters or search terms
            </Text>
            {!search && !hasActiveFilters && (
              <TouchableOpacity
                style={s.emptyBtn}
                onPress={() => router.push("/add-job-posting")}
              >
                <Ionicons name="add" size={16} color="#fff" />
                <Text style={s.emptyBtnTxt}>Create First Posting</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[T.blue]}
            tintColor={T.blue}
          />
        }
      />

      <JobModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  listContent: { paddingBottom: 40 },

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
  avatarPlaceholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

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
  filterIconBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  filterIconBtnActive: { backgroundColor: T.blue },
  filterDot: {
    position: "absolute",
    top: 4,
    right: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.orange,
    borderWidth: 1.5,
    borderColor: "#fff",
  },

  hintChips: { paddingHorizontal: 14, gap: 8, marginBottom: 10 },
  hintChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
  },
  hintChipTxt: { fontSize: 11, fontWeight: "600", color: "#475569" },

  statusTabs: {
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 14,
    alignItems: "center",
  },
  statusTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statusTabActive: { backgroundColor: T.blue, borderColor: T.blue },
  statusTabTxt: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  statusTabTxtActive: { color: "#fff" },
  statusCount: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  statusCountActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  statusCountTxt: { fontSize: 9, fontWeight: "800", color: "#475569" },
  statusCountTxtActive: { color: "#fff" },

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
  exportTxt: { fontSize: 12, fontWeight: "600", color: "#334155" },

  resultsLabel: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 10,
  },

  empty: { padding: 48, alignItems: "center", gap: 8 },
  emptyTxt: { fontSize: 16, color: "#94A3B8", fontWeight: "700" },
  emptySubTxt: { fontSize: 13, color: "#CBD5E1", textAlign: "center" },
  emptyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    backgroundColor: T.orange,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 10,
  },
  emptyBtnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
