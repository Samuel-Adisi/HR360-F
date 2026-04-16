import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CurrencyDollarIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  MapPinIcon,
  PlusIcon,
  UserGroupIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { BookmarkIcon } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Design tokens (HR360 system + LinkedIn accents) ──────────────────────────
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
  blue: "#0A66C2", // LinkedIn blue
  blueBg: "#EFF6FF",
  blueLight: "#DBEAFE",
  green: "#059669",
  greenBg: "#DCFCE7",
  greenText: "#15803D",
  amber: "#D97706",
  amberBg: "#FEF3C7",
  amberText: "#92400E",
  red: "#DC2626",
  redBg: "#FEE2E2",
  redText: "#B91C1C",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  purpleText: "#6D28D9",
};

// ─── Status config — mirrors JobPosting.status choices ───────────────────────
const STATUS_CONFIG = {
  Active: { bg: C.greenBg, text: C.greenText, dot: C.green },
  Closed: { bg: C.redBg, text: C.redText, dot: C.red },
  Draft: { bg: C.divider, text: C.sub, dot: C.muted },
  Filled: { bg: C.blueBg, text: C.blue, dot: C.blue },
  Paused: { bg: C.amberBg, text: C.amberText, dot: C.amber },
};

const JOB_TYPE_SHORT = {
  "Full-time": "Full-time",
  "Part-time": "Part-time",
  Contract: "Contract",
  Temporary: "Temp",
  Internship: "Intern",
  Freelance: "Freelance",
  Seasonal: "Seasonal",
};

const STATUS_FILTERS = ["All", "Active", "Draft", "Closed", "Filled", "Paused"];

// ─── Mock data — mirrors JobPostingListSerializer exactly ─────────────────────
// TODO: replace with GET /api/job-postings/
const MOCK_STATISTICS = {
  total_postings: 8,
  active_postings: 4,
  closed_postings: 1,
  filled_postings: 1,
  draft_postings: 1,
  paused_postings: 1,
  total_applications: 47,
  by_department: {
    Engineering: 3,
    Finance: 1,
    HR: 1,
    Design: 1,
    Sales: 1,
    Marketing: 1,
  },
  by_job_type: { "Full-time": 5, Contract: 2, Internship: 1 },
};

const MOCK_POSTINGS = [
  {
    id: 1,
    slug: "senior-frontend-engineer",
    job_title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Accra, Ghana",
    remote_options: "Hybrid",
    job_type: "Full-time",
    job_type_display: "Full-time",
    experience_level: "Senior (5-10 years)",
    salary_min: 8000,
    salary_max: 12000,
    salary_currency: "GHS",
    show_salary: true,
    positions: 2,
    deadline: "2025-08-15",
    status: "Active",
    status_display: "Active",
    is_active: true,
    is_featured: true,
    days_until_deadline: 36,
    applications_count: 14,
    views_count: 203,
    created_at: "2025-06-20T08:00:00Z",
  },
  {
    id: 2,
    slug: "product-designer",
    job_title: "Product Designer",
    department: "Design",
    location: "Remote",
    remote_options: "Remote",
    job_type: "Full-time",
    job_type_display: "Full-time",
    experience_level: "Mid Level (3-5 years)",
    salary_min: 6000,
    salary_max: 9000,
    salary_currency: "GHS",
    show_salary: true,
    positions: 1,
    deadline: "2025-07-30",
    status: "Active",
    status_display: "Active",
    is_active: true,
    is_featured: false,
    days_until_deadline: 20,
    applications_count: 9,
    views_count: 145,
    created_at: "2025-06-25T09:00:00Z",
  },
  {
    id: 3,
    slug: "hr-coordinator",
    job_title: "HR Coordinator",
    department: "HR",
    location: "Accra, Ghana",
    remote_options: "On-site",
    job_type: "Full-time",
    job_type_display: "Full-time",
    experience_level: "Junior (1-3 years)",
    salary_min: 4000,
    salary_max: 6000,
    salary_currency: "GHS",
    show_salary: false,
    positions: 1,
    deadline: "2025-08-01",
    status: "Active",
    status_display: "Active",
    is_active: true,
    is_featured: false,
    days_until_deadline: 22,
    applications_count: 11,
    views_count: 89,
    created_at: "2025-06-28T10:00:00Z",
  },
  {
    id: 4,
    slug: "backend-engineer-contract",
    job_title: "Backend Engineer",
    department: "Engineering",
    location: "Kumasi, Ghana",
    remote_options: "Hybrid",
    job_type: "Contract",
    job_type_display: "Contract",
    experience_level: "Mid Level (3-5 years)",
    salary_min: null,
    salary_max: null,
    salary_currency: "GHS",
    show_salary: false,
    positions: 1,
    deadline: "2025-07-20",
    status: "Paused",
    status_display: "Paused",
    is_active: false,
    is_featured: false,
    days_until_deadline: 10,
    applications_count: 6,
    views_count: 72,
    created_at: "2025-06-15T08:00:00Z",
  },
  {
    id: 5,
    slug: "finance-analyst",
    job_title: "Finance Analyst",
    department: "Finance",
    location: "Accra, Ghana",
    remote_options: "On-site",
    job_type: "Full-time",
    job_type_display: "Full-time",
    experience_level: "Junior (1-3 years)",
    salary_min: 5000,
    salary_max: 7500,
    salary_currency: "GHS",
    show_salary: true,
    positions: 1,
    deadline: "2025-09-01",
    status: "Draft",
    status_display: "Draft",
    is_active: false,
    is_featured: false,
    days_until_deadline: 52,
    applications_count: 0,
    views_count: 0,
    created_at: "2025-07-01T12:00:00Z",
  },
  {
    id: 6,
    slug: "software-intern",
    job_title: "Software Engineering Intern",
    department: "Engineering",
    location: "Accra, Ghana",
    remote_options: "On-site",
    job_type: "Internship",
    job_type_display: "Internship",
    experience_level: "Entry Level",
    salary_min: 1500,
    salary_max: 2000,
    salary_currency: "GHS",
    show_salary: true,
    positions: 3,
    deadline: "2025-07-25",
    status: "Active",
    status_display: "Active",
    is_active: true,
    is_featured: false,
    days_until_deadline: 15,
    applications_count: 7,
    views_count: 118,
    created_at: "2025-07-02T09:00:00Z",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatSalary(min, max, currency, show) {
  if (!show || (!min && !max)) return "Salary not disclosed";
  const fmt = (n) => `${currency} ${Number(n).toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}/mo`;
  if (min) return `From ${fmt(min)}/mo`;
  return `Up to ${fmt(max)}/mo`;
}

function daysLabel(days) {
  if (days === null || days === undefined) return "";
  if (days < 0) return "Expired";
  if (days === 0) return "Closes today";
  if (days === 1) return "1 day left";
  return `${days}d left`;
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  if (diff < 7) return `${diff}d ago`;
  if (diff < 30) return `${Math.floor(diff / 7)}w ago`;
  return `${Math.floor(diff / 30)}mo ago`;
}

function getCompanyInitials(dept) {
  return dept.substring(0, 2).toUpperCase();
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────
function StatsBanner({ stats }) {
  const tiles = [
    { label: "Active", value: stats.active_postings, color: C.green },
    { label: "Draft", value: stats.draft_postings, color: C.muted },
    { label: "Paused", value: stats.paused_postings, color: C.amber },
    { label: "Filled", value: stats.filled_postings, color: C.blue },
  ];
  return (
    <LinearGradient
      colors={["#0F172A", "#1E293B", "#243044"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={sb.container}
    >
      <View style={sb.topRow}>
        <View style={sb.topLeft}>
          <Text style={sb.title}>Job Postings</Text>
          <Text style={sb.sub}>
            {stats.total_applications} total applications received
          </Text>
          <View style={sb.track}>
            <View
              style={[
                sb.fill,
                {
                  width: `${
                    stats.total_postings > 0
                      ? Math.round(
                          (stats.active_postings / stats.total_postings) * 100,
                        )
                      : 0
                  }%`,
                },
              ]}
            />
          </View>
          <Text style={sb.trackLabel}>
            {stats.total_postings > 0
              ? Math.round((stats.active_postings / stats.total_postings) * 100)
              : 0}
            % active
          </Text>
        </View>
        <View style={sb.circle}>
          <Text style={sb.circleNum}>{stats.total_postings}</Text>
          <Text style={sb.circleLabel}>total</Text>
        </View>
      </View>
      <View style={sb.tiles}>
        {tiles.map((t) => (
          <View key={t.label} style={sb.tile}>
            <Text style={[sb.tileNum, { color: t.color }]}>{t.value}</Text>
            <Text style={sb.tileLabel}>{t.label}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

// ─── Department logo placeholder (LinkedIn-style company logo) ────────────────
function DeptLogo({ department, size = 48 }) {
  const colors = {
    Engineering: ["#0F172A", "#1D4ED8"],
    Finance: ["#065F46", "#059669"],
    HR: ["#0F766E", "#14B8A6"],
    Design: ["#6D28D9", "#8B5CF6"],
    Sales: ["#B45309", "#F59E0B"],
    Marketing: ["#9D174D", "#EC4899"],
    Default: ["#1E293B", "#334155"],
  };
  const [c1, c2] = colors[department] || colors.Default;
  return (
    <LinearGradient
      colors={[c1, c2]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[
        logo.wrap,
        { width: size, height: size, borderRadius: size * 0.22 },
      ]}
    >
      <Text style={[logo.text, { fontSize: size * 0.33 }]}>
        {getCompanyInitials(department)}
      </Text>
    </LinearGradient>
  );
}

const logo = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", flexShrink: 0 },
  text: { color: "#FFFFFF", fontWeight: "800", letterSpacing: -0.5 },
});

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Draft;
  return (
    <View style={[bd.badge, { backgroundColor: cfg.bg }]}>
      <View style={[bd.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[bd.text, { color: cfg.text }]}>{status}</Text>
    </View>
  );
}

const bd = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: "700" },
});

// ─── Job Card — LinkedIn style ────────────────────────────────────────────────
function JobCard({ job, onPress }) {
  const urgency = job.days_until_deadline <= 7 && job.is_active;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [jc.root, pressed && { opacity: 0.88 }]}
    >
      {/* Featured stripe */}
      {job.is_featured && <View style={jc.featuredStripe} />}

      {/* Top row */}
      <View style={jc.top}>
        <DeptLogo department={job.department} size={48} />
        <View style={jc.topInfo}>
          <Text style={jc.title} numberOfLines={1}>
            {job.job_title}
          </Text>
          <Text style={jc.company} numberOfLines={1}>
            HR360 · {job.department}
          </Text>
          <View style={jc.metaRow}>
            <View style={jc.metaChip}>
              <MapPinIcon size={10} color={C.muted} strokeWidth={2.2} />
              <Text style={jc.metaText}>{job.location}</Text>
            </View>
            <View style={jc.metaDot} />
            <Text style={jc.metaText}>{job.remote_options}</Text>
            <View style={jc.metaDot} />
            <Text style={jc.metaText}>
              {JOB_TYPE_SHORT[job.job_type] || job.job_type}
            </Text>
          </View>
        </View>
        <View style={jc.topRight}>
          <StatusBadge status={job.status} />
          {job.is_featured && <BookmarkIcon size={14} color={C.blue} />}
        </View>
      </View>

      {/* Salary */}
      <View style={jc.salaryRow}>
        <CurrencyDollarIcon
          size={13}
          color={job.show_salary ? C.accent : C.muted}
          strokeWidth={2}
        />
        <Text style={[jc.salary, !job.show_salary && { color: C.muted }]}>
          {formatSalary(
            job.salary_min,
            job.salary_max,
            job.salary_currency,
            job.show_salary,
          )}
        </Text>
      </View>

      <View style={jc.divider} />

      {/* Stats row */}
      <View style={jc.stats}>
        <View style={jc.statItem}>
          <UserGroupIcon size={12} color={C.sub} strokeWidth={2} />
          <Text style={jc.statText}>{job.applications_count} applicants</Text>
        </View>
        <View style={jc.statItem}>
          <EyeIcon size={12} color={C.sub} strokeWidth={2} />
          <Text style={jc.statText}>{job.views_count} views</Text>
        </View>
        <View style={jc.statItem}>
          <BriefcaseIcon size={12} color={C.sub} strokeWidth={2} />
          <Text style={jc.statText}>
            {job.positions} position{job.positions > 1 ? "s" : ""}
          </Text>
        </View>
        <View style={jc.statSpacer} />
        <Text style={[jc.deadline, urgency && { color: C.red }]}>
          {daysLabel(job.days_until_deadline)}
        </Text>
      </View>

      {/* Experience level tag */}
      <View style={jc.tagsRow}>
        <View style={jc.tag}>
          <Text style={jc.tagText}>{job.experience_level}</Text>
        </View>
        <View style={jc.tagSpacer} />
        <Text style={jc.postedAt}>Posted {timeAgo(job.created_at)}</Text>
      </View>
    </Pressable>
  );
}

const jc = StyleSheet.create({
  root: {
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    position: "relative",
    overflow: "hidden",
  },
  featuredStripe: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 3,
    height: "100%",
    backgroundColor: C.blue,
  },
  top: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    marginBottom: 10,
  },
  topInfo: { flex: 1, gap: 3 },
  topRight: { alignItems: "flex-end", gap: 6 },
  title: {
    fontSize: 15,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.2,
  },
  company: { fontSize: 12, fontWeight: "500", color: C.sub },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    flexWrap: "wrap",
    marginTop: 2,
  },
  metaChip: { flexDirection: "row", alignItems: "center", gap: 3 },
  metaText: { fontSize: 11, color: C.muted, fontWeight: "500" },
  metaDot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.muted },
  salaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 10,
  },
  salary: { fontSize: 13, fontWeight: "600", color: C.accent },
  divider: { height: 1, backgroundColor: C.divider, marginBottom: 10 },
  stats: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 10,
  },
  statItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  statText: { fontSize: 11, color: C.sub, fontWeight: "500" },
  statSpacer: { flex: 1 },
  deadline: { fontSize: 11, fontWeight: "700", color: C.amber },
  tagsRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  tag: {
    backgroundColor: C.blueBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: { fontSize: 11, fontWeight: "600", color: C.blue },
  tagSpacer: { flex: 1 },
  postedAt: { fontSize: 11, color: C.muted, fontWeight: "500" },
});

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function JobPostingsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // TODO: replace with GET /api/job-postings/ and GET /api/job-postings/statistics/
  const postings = MOCK_POSTINGS;
  const stats = MOCK_STATISTICS;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const filtered = postings.filter((j) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      j.job_title.toLowerCase().includes(q) ||
      j.department.toLowerCase().includes(q) ||
      j.location.toLowerCase().includes(q);
    const matchFilter = activeFilter === "All" || j.status === activeFilter;
    return matchSearch && matchFilter;
  });

  return (
    <View style={s.root}>
      {/* Header */}
      <SafeAreaView edges={["top"]} style={s.header}>
        <View style={s.titleRow}>
          <View style={s.titleLeft}>
            {/* Back Button */}
            <Pressable
              onPress={() => router.replace("/dashboard")}
              style={s.backBtn}
            >
              <ArrowLeftIcon size={20} color={C.navy} strokeWidth={2.5} />
            </Pressable>

            <View style={s.iconBadge}>
              <BriefcaseIcon size={18} color={C.accent} strokeWidth={2} />
            </View>
            <View>
              <Text style={s.title}>Job Posting</Text>
              <Text style={s.subtitle}>
                {stats.total_postings} postings · {stats.active_postings} active
              </Text>
            </View>
          </View>
          <Pressable style={s.addBtn}>
            <PlusIcon size={18} color={C.white} strokeWidth={2.5} />
          </Pressable>
        </View>
        <View style={s.searchWrap}>
          <MagnifyingGlassIcon size={17} color={C.muted} strokeWidth={2.2} />
          <TextInput
            style={s.searchInput}
            placeholder="Search jobs, departments…"
            placeholderTextColor={C.muted}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
            autoCapitalize="none"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")} hitSlop={8}>
              <XMarkIcon size={15} color={C.muted} strokeWidth={2.5} />
            </Pressable>
          )}
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.accent}
            colors={[C.accent]}
          />
        }
      >
        {/* Stats banner */}
        <View style={s.section}>
          <StatsBanner stats={stats} />
        </View>

        {/* Filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.filterRow}
        >
          {STATUS_FILTERS.map((f) => {
            const active = activeFilter === f;
            const cfg = STATUS_CONFIG[f];
            return (
              <Pressable
                key={f}
                onPress={() => setActiveFilter(f)}
                style={({ pressed }) => [
                  s.pill,
                  active && {
                    backgroundColor: cfg ? cfg.dot : C.accent,
                    borderColor: cfg ? cfg.dot : C.accent,
                  },
                  pressed && { opacity: 0.75 },
                ]}
              >
                <Text style={[s.pillText, active && { color: C.white }]}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Result count */}
        <View style={s.resultRow}>
          <Text style={s.resultText}>
            {filtered.length} posting{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "All" ? ` · ${activeFilter}` : ""}
            {search ? ` · "${search}"` : ""}
          </Text>
        </View>

        {/* List */}
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <BriefcaseIcon size={30} color={C.muted} strokeWidth={1.5} />
            </View>
            <Text style={s.emptyTitle}>No postings found</Text>
            <Text style={s.emptySub}>Try a different search or filter</Text>
          </View>
        ) : (
          <View style={s.listWrap}>
            {filtered.map((job, i) => (
              <View key={job.id}>
                <JobCard
                  job={job}
                  onPress={() =>
                    router.push(`/dashboard/recruitment/${job.id}`)
                  }
                />
                {i < filtered.length - 1 && <View style={s.cardSep} />}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const sb = StyleSheet.create({
  container: { borderRadius: 18, padding: 18, gap: 16 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  topLeft: { flex: 1, gap: 6 },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.3,
  },
  sub: { fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: "500" },
  track: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: C.green, borderRadius: 3 },
  trackLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.45)",
    fontWeight: "500",
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  circleNum: {
    fontSize: 20,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.5,
  },
  circleLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tiles: {
    flexDirection: "row",
    gap: 0,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    overflow: "hidden",
  },
  tile: { flex: 1, paddingVertical: 12, alignItems: "center", gap: 4 },
  tileNum: { fontSize: 20, fontWeight: "800", letterSpacing: -0.5 },
  tileLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255,255,255,0.65)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
    marginBottom: 14,
  },
  titleLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.4,
  },
  subtitle: { fontSize: 12, color: C.muted, fontWeight: "500", marginTop: 1 },
  addBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 11,
    paddingHorizontal: 12,
    height: 44,
    gap: 9,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.navy, fontWeight: "500" },
  section: { paddingHorizontal: 16, paddingTop: 16 },
  filterRow: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  pillText: { fontSize: 13, fontWeight: "600", color: C.sub },
  resultRow: { paddingHorizontal: 18, paddingTop: 10, paddingBottom: 6 },
  resultText: { fontSize: 12, color: C.muted, fontWeight: "600" },
  listWrap: {
    marginHorizontal: 16,
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  cardSep: { height: 1, backgroundColor: C.divider, marginLeft: 76 },
  empty: { alignItems: "center", paddingTop: 52, paddingHorizontal: 32 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: C.divider,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.navy,
    marginBottom: 6,
  },
  emptySub: {
    fontSize: 13,
    color: C.muted,
    fontWeight: "500",
    textAlign: "center",
  },

  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.divider,
    alignItems: "center",
    justifyContent: "center",
  },
});
