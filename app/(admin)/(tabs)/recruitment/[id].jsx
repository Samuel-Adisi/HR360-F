import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  CheckCircleIcon,
  ClockIcon,
  CurrencyDollarIcon,
  EyeIcon,
  MapPinIcon,
  StarIcon,
  UserCircleIcon,
  UserGroupIcon,
} from "react-native-heroicons/outline";
import {
  FlagIcon as FlagSolid,
  StarIcon as StarSolid,
} from "react-native-heroicons/solid";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  navy: "#0F172A",
  slate: "#1E293B",
  sub: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  divider: "#F1F5F9",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  blue: "#0A66C2",
  blueBg: "#EFF6FF",
  blueText: "#1D4ED8",
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
  orange: "#F97316",
  orangeBg: "#FFF7ED",
};

// ─── Application pipeline — mirrors Application.STATUS_CHOICES ────────────────
const APP_STATUS_CONFIG = {
  pending: { label: "Pending", bg: C.divider, text: C.sub, dot: C.muted },
  under_review: {
    label: "Reviewing",
    bg: C.blueBg,
    text: C.blueText,
    dot: C.blue,
  },
  shortlisted: {
    label: "Shortlisted",
    bg: C.greenBg,
    text: C.greenText,
    dot: C.green,
  },
  interview_scheduled: {
    label: "Interview",
    bg: C.purpleBg,
    text: C.purpleText,
    dot: C.purple,
  },
  interview_completed: {
    label: "Interviewed",
    bg: C.purpleBg,
    text: C.purpleText,
    dot: C.purple,
  },
  assessment: {
    label: "Assessment",
    bg: C.amberBg,
    text: C.amberText,
    dot: C.amber,
  },
  offer_extended: {
    label: "Offer Sent",
    bg: C.orangeBg,
    text: C.orange,
    dot: C.orange,
  },
  offer_accepted: {
    label: "Accepted",
    bg: C.greenBg,
    text: C.greenText,
    dot: C.green,
  },
  rejected: { label: "Rejected", bg: C.redBg, text: C.redText, dot: C.red },
  on_hold: { label: "On Hold", bg: C.amberBg, text: C.amberText, dot: C.amber },
  withdrawn: { label: "Withdrawn", bg: C.divider, text: C.muted, dot: C.muted },
};

const APP_FILTERS = [
  "All",
  "pending",
  "under_review",
  "shortlisted",
  "interview_scheduled",
  "offer_extended",
  "rejected",
];
const APP_FILTER_LABELS = {
  All: "All",
  pending: "Pending",
  under_review: "Review",
  shortlisted: "Shortlisted",
  interview_scheduled: "Interview",
  offer_extended: "Offer",
  rejected: "Rejected",
};

// ─── Mock data — mirrors JobPostingSerializer + ApplicationListSerializer ─────
// TODO: replace with GET /api/job-postings/<id>/ and GET /api/applications/?job_posting=<id>
const MOCK_JOB = {
  id: 1,
  slug: "senior-frontend-engineer",
  status: "Active",
  job_title: "Senior Frontend Engineer",
  department: "Engineering",
  location: "Accra, Ghana",
  remote_options: "Hybrid",
  job_type: "Full-time",
  experience_level: "Senior (5-10 years)",
  company_name: "HR360",
  industry: "Technology",
  salary_min: 8000,
  salary_max: 12000,
  salary_currency: "GHS",
  show_salary: true,
  salary_period: "monthly",
  positions: 2,
  deadline: "2025-08-15",
  start_date: "2025-09-01",
  priority: "High",
  job_description:
    "We are looking for a Senior Frontend Engineer to join our Engineering team. You will lead the development of our React Native mobile app and web dashboard, working closely with product and design teams to ship high-quality user experiences.",
  responsibilities:
    "Lead frontend architecture decisions\nMentor junior engineers\nCollaborate with designers on UX implementation\nConduct code reviews\nOptimize app performance",
  requirements:
    "5+ years React/React Native experience\nStrong TypeScript skills\nExperience with REST APIs and state management\nFamiliarity with CI/CD pipelines",
  benefits:
    "Health insurance\nFlexible working hours\nAnnual bonus\nLearning budget",
  working_hours: "8AM – 5PM (Flexible)",
  contact_email: "careers@hr360.io",
  hiring_manager: "Ama Owusu",
  require_resume: true,
  require_cover_letter: false,
  views_count: 203,
  applications_count: 14,
  qualified_applications_count: 9,
  created_at: "2025-06-20T08:00:00Z",
  published_at: "2025-06-20T08:00:00Z",
};

const MOCK_APP_STATS = {
  total: 14,
  pending: 3,
  under_review: 4,
  shortlisted: 3,
  interview: 2,
  offer_extended: 1,
  rejected: 1,
  screened: 11,
  starred: 4,
  flagged: 2,
};

const MOCK_APPLICATIONS = [
  {
    id: 1,
    job_posting: 1,
    job_posting_title: "Senior Frontend Engineer",
    applicant_name: "Kwame Asante",
    applicant_email: "kwame.asante@gmail.com",
    phone: "+233 24 000 0001",
    experience_years: 7,
    status: "shortlisted",
    status_display: "Shortlisted",
    overall_score: 91,
    skills_match_score: 88,
    is_starred: true,
    is_flagged: false,
    applied_date: "2025-06-22T10:00:00Z",
    time_since_application: "18 days ago",
  },
  {
    id: 2,
    job_posting: 1,
    job_posting_title: "Senior Frontend Engineer",
    applicant_name: "Abena Mensah",
    applicant_email: "abena.mensah@gmail.com",
    phone: "+233 24 000 0002",
    experience_years: 5,
    status: "interview_scheduled",
    status_display: "Interview Scheduled",
    overall_score: 85,
    skills_match_score: 82,
    is_starred: true,
    is_flagged: false,
    applied_date: "2025-06-23T14:00:00Z",
    time_since_application: "17 days ago",
  },
  {
    id: 3,
    job_posting: 1,
    job_posting_title: "Senior Frontend Engineer",
    applicant_name: "Kofi Boateng",
    applicant_email: "kofi.boateng@gmail.com",
    phone: "+233 24 000 0003",
    experience_years: 6,
    status: "under_review",
    status_display: "Under Review",
    overall_score: 78,
    skills_match_score: 74,
    is_starred: false,
    is_flagged: false,
    applied_date: "2025-06-25T09:00:00Z",
    time_since_application: "15 days ago",
  },
  {
    id: 4,
    job_posting: 1,
    job_posting_title: "Senior Frontend Engineer",
    applicant_name: "Ama Owusu",
    applicant_email: "ama.owusu@gmail.com",
    phone: "+233 24 000 0004",
    experience_years: 9,
    status: "offer_extended",
    status_display: "Offer Extended",
    overall_score: 96,
    skills_match_score: 95,
    is_starred: true,
    is_flagged: false,
    applied_date: "2025-06-21T11:00:00Z",
    time_since_application: "19 days ago",
  },
  {
    id: 5,
    job_posting: 1,
    job_posting_title: "Senior Frontend Engineer",
    applicant_name: "Yaw Darko",
    applicant_email: "yaw.darko@gmail.com",
    phone: "+233 24 000 0005",
    experience_years: 3,
    status: "pending",
    status_display: "Pending",
    overall_score: null,
    skills_match_score: 55,
    is_starred: false,
    is_flagged: true,
    applied_date: "2025-07-05T08:00:00Z",
    time_since_application: "5 days ago",
  },
  {
    id: 6,
    job_posting: 1,
    job_posting_title: "Senior Frontend Engineer",
    applicant_name: "Efua Amponsah",
    applicant_email: "efua.amponsah@gmail.com",
    phone: "+233 24 000 0006",
    experience_years: 4,
    status: "rejected",
    status_display: "Rejected",
    overall_score: 52,
    skills_match_score: 48,
    is_starred: false,
    is_flagged: false,
    applied_date: "2025-06-24T16:00:00Z",
    time_since_application: "16 days ago",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatSalary(min, max, currency, show) {
  if (!show || (!min && !max)) return "Salary not disclosed";
  const fmt = (n) => `${currency} ${Number(n).toLocaleString()}`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}/mo`;
  return min ? `From ${fmt(min)}/mo` : `Up to ${fmt(max)}/mo`;
}

function scoreColor(score) {
  if (score === null || score === undefined) return C.muted;
  if (score >= 85) return C.green;
  if (score >= 65) return C.amber;
  return C.red;
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function avatarColor(name) {
  const colors = [
    "#0F766E",
    "#0A66C2",
    "#7C3AED",
    "#B45309",
    "#9D174D",
    "#065F46",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++)
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

// ─── Reusable ─────────────────────────────────────────────────────────────────
function GroupLabel({ title }) {
  return (
    <View style={g.row}>
      <View style={g.bar} />
      <Text style={g.title}>{title}</Text>
    </View>
  );
}

const g = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  bar: { width: 3, height: 16, borderRadius: 2, backgroundColor: C.accent },
  title: {
    fontSize: 11,
    fontWeight: "800",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
});

function AppStatusBadge({ status }) {
  const cfg = APP_STATUS_CONFIG[status] || APP_STATUS_CONFIG.pending;
  return (
    <View style={[ab.badge, { backgroundColor: cfg.bg }]}>
      <View style={[ab.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[ab.text, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

const ab = StyleSheet.create({
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

// ─── Score Ring ───────────────────────────────────────────────────────────────
function ScoreRing({ score, size = 40 }) {
  const color = scoreColor(score);
  return (
    <View
      style={[
        sr.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          borderColor: color,
        },
      ]}
    >
      {score !== null && score !== undefined ? (
        <Text style={[sr.num, { color, fontSize: size * 0.28 }]}>{score}</Text>
      ) : (
        <Text style={[sr.na, { fontSize: size * 0.22 }]}>N/A</Text>
      )}
    </View>
  );
}

const sr = StyleSheet.create({
  wrap: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    flexShrink: 0,
  },
  num: { fontWeight: "800", letterSpacing: -0.5 },
  na: { color: C.muted, fontWeight: "700" },
});

// ─── Applicant Avatar ─────────────────────────────────────────────────────────
function ApplicantAvatar({ name, size = 44 }) {
  const bg = avatarColor(name);
  return (
    <View
      style={[
        av.wrap,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
        },
      ]}
    >
      <Text style={[av.text, { fontSize: size * 0.33 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const av = StyleSheet.create({
  wrap: { alignItems: "center", justifyContent: "center", flexShrink: 0 },
  text: { color: C.white, fontWeight: "800" },
});

// ─── Job Detail Hero ──────────────────────────────────────────────────────────
function JobHero({ job }) {
  const statusCfg = {
    Active: { bg: C.greenBg, text: C.greenText, dot: C.green },
    Closed: { bg: C.redBg, text: C.redText, dot: C.red },
    Draft: { bg: C.divider, text: C.sub, dot: C.muted },
    Filled: { bg: C.blueBg, text: C.blue, dot: C.blue },
    Paused: { bg: C.amberBg, text: C.amberText, dot: C.amber },
  };
  const cfg = statusCfg[job.status] || statusCfg.Draft;

  return (
    <LinearGradient
      colors={["#0F172A", "#1E293B", "#243044"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={jh.container}
    >
      {/* Company logo */}
      <LinearGradient
        colors={["#1D4ED8", "#0A66C2"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={jh.logoWrap}
      >
        <Text style={jh.logoText}>HR</Text>
      </LinearGradient>

      <Text style={jh.title}>{job.job_title}</Text>
      <Text style={jh.company}>
        {job.company_name} · {job.department}
      </Text>

      {/* Meta chips */}
      <View style={jh.chips}>
        {[
          { icon: MapPinIcon, label: job.location },
          { icon: BriefcaseIcon, label: job.remote_options },
          { icon: ClockIcon, label: job.job_type },
        ].map((chip) => (
          <View key={chip.label} style={jh.chip}>
            <chip.icon
              size={11}
              color="rgba(255,255,255,0.65)"
              strokeWidth={2}
            />
            <Text style={jh.chipText}>{chip.label}</Text>
          </View>
        ))}
      </View>

      {/* Status + salary row */}
      <View style={jh.bottomRow}>
        <View style={[jh.statusBadge, { backgroundColor: cfg.bg }]}>
          <View style={[jh.statusDot, { backgroundColor: cfg.dot }]} />
          <Text style={[jh.statusText, { color: cfg.text }]}>{job.status}</Text>
        </View>
        <Text style={jh.salary}>
          {formatSalary(
            job.salary_min,
            job.salary_max,
            job.salary_currency,
            job.show_salary,
          )}
        </Text>
      </View>

      {/* Stats strip */}
      <View style={jh.statsStrip}>
        {[
          {
            icon: UserGroupIcon,
            value: job.applications_count,
            label: "Applied",
          },
          {
            icon: CheckBadgeIcon,
            value: job.qualified_applications_count,
            label: "Qualified",
          },
          { icon: EyeIcon, value: job.views_count, label: "Views" },
          { icon: BriefcaseIcon, value: job.positions, label: "Positions" },
        ].map((s, i) => (
          <View key={s.label} style={[jh.statItem, i < 3 && jh.statBorder]}>
            <s.icon size={13} color="rgba(255,255,255,0.55)" strokeWidth={2} />
            <Text style={jh.statNum}>{s.value}</Text>
            <Text style={jh.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const jh = StyleSheet.create({
  container: {
    borderRadius: 18,
    margin: 16,
    padding: 20,
    gap: 12,
    overflow: "hidden",
  },
  logoWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  logoText: {
    fontSize: 20,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -1,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.5,
  },
  company: { fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: "500" },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 11,
    color: "rgba(255,255,255,0.75)",
    fontWeight: "600",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 12, fontWeight: "700" },
  salary: { fontSize: 13, fontWeight: "700", color: "rgba(255,255,255,0.85)" },
  statsStrip: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 14,
    overflow: "hidden",
    marginTop: 4,
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 12, gap: 3 },
  statBorder: {
    borderRightWidth: 1,
    borderRightColor: "rgba(255,255,255,0.1)",
  },
  statNum: {
    fontSize: 16,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.3,
  },
  statLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});

// ─── Info Section (description, requirements, etc.) ───────────────────────────
function BulletList({ text }) {
  const lines = (text || "").split("\n").filter(Boolean);
  return (
    <View style={{ gap: 6 }}>
      {lines.map((line, i) => (
        <View key={i} style={bl.row}>
          <View style={bl.dot} />
          <Text style={bl.text}>{line}</Text>
        </View>
      ))}
    </View>
  );
}

const bl = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  dot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: C.accent,
    marginTop: 7,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    fontSize: 13,
    color: C.slate,
    fontWeight: "500",
    lineHeight: 20,
  },
});

function InfoCard({ icon: Icon, iconColor, title, children }) {
  return (
    <View style={ic.card}>
      <View style={ic.header}>
        <View style={[ic.iconWrap, { backgroundColor: iconColor + "18" }]}>
          <Icon size={15} color={iconColor} strokeWidth={2} />
        </View>
        <Text style={ic.title}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const ic = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.1,
  },
});

// ─── Application Pipeline Summary ────────────────────────────────────────────
function PipelineCard({ stats }) {
  const pipeline = [
    { key: "pending", label: "Pending", value: stats.pending, color: C.muted },
    {
      key: "under_review",
      label: "Review",
      value: stats.under_review,
      color: C.blue,
    },
    {
      key: "shortlisted",
      label: "Shortlisted",
      value: stats.shortlisted,
      color: C.green,
    },
    {
      key: "interview",
      label: "Interview",
      value: stats.interview,
      color: C.purple,
    },
    {
      key: "offer_extended",
      label: "Offer",
      value: stats.offer_extended,
      color: C.orange,
    },
  ];
  const max = Math.max(...pipeline.map((p) => p.value), 1);

  return (
    <LinearGradient
      colors={["#0F172A", "#1E293B", "#243044"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={pp.container}
    >
      <View style={pp.topRow}>
        <View>
          <Text style={pp.title}>Application Pipeline</Text>
          <Text style={pp.sub}>
            {stats.screened} of {stats.total} screened by AI
          </Text>
        </View>
        <View style={pp.badges}>
          <View style={pp.starChip}>
            <StarSolid size={11} color={C.amber} />
            <Text style={pp.starText}>{stats.starred} starred</Text>
          </View>
          <View style={pp.flagChip}>
            <FlagSolid size={11} color={C.red} />
            <Text style={pp.flagText}>{stats.flagged} flagged</Text>
          </View>
        </View>
      </View>

      <View style={pp.bars}>
        {pipeline.map((p) => (
          <View key={p.key} style={pp.barGroup}>
            <Text style={[pp.barNum, { color: p.color }]}>{p.value}</Text>
            <View style={pp.barTrack}>
              <View
                style={[
                  pp.barFill,
                  {
                    height: `${(p.value / max) * 100}%`,
                    backgroundColor: p.color,
                  },
                ]}
              />
            </View>
            <Text style={pp.barLabel}>{p.label}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

const pp = StyleSheet.create({
  container: { borderRadius: 18, padding: 18, gap: 16 },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.2,
  },
  sub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    marginTop: 3,
  },
  badges: { flexDirection: "row", gap: 8 },
  starChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  starText: { fontSize: 11, fontWeight: "700", color: C.amber },
  flagChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  flagText: { fontSize: 11, fontWeight: "700", color: C.red },
  bars: { flexDirection: "row", gap: 8, height: 80, alignItems: "flex-end" },
  barGroup: { flex: 1, alignItems: "center", gap: 5 },
  barNum: { fontSize: 14, fontWeight: "800", letterSpacing: -0.3 },
  barTrack: {
    flex: 1,
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.10)",
    borderRadius: 6,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  barFill: { width: "100%", borderRadius: 6 },
  barLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255,255,255,0.55)",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});

// ─── Applicant Card ───────────────────────────────────────────────────────────
function ApplicantCard({ app }) {
  return (
    <Pressable
      style={({ pressed }) => [apc.root, pressed && { opacity: 0.88 }]}
    >
      <View style={apc.top}>
        <ApplicantAvatar name={app.applicant_name} size={46} />
        <View style={apc.info}>
          <View style={apc.nameRow}>
            <Text style={apc.name} numberOfLines={1}>
              {app.applicant_name}
            </Text>
            {app.is_starred && <StarSolid size={13} color={C.amber} />}
            {app.is_flagged && <FlagSolid size={13} color={C.red} />}
          </View>
          <Text style={apc.email} numberOfLines={1}>
            {app.applicant_email}
          </Text>
          <Text style={apc.exp}>
            {app.experience_years} yrs experience · {app.time_since_application}
          </Text>
        </View>
        <ScoreRing score={app.overall_score} size={42} />
      </View>

      <View style={apc.divider} />

      <View style={apc.bottom}>
        <AppStatusBadge status={app.status} />
        <View style={apc.matchRow}>
          <CheckCircleIcon
            size={12}
            color={scoreColor(app.skills_match_score)}
            strokeWidth={2.5}
          />
          <Text
            style={[
              apc.matchText,
              { color: scoreColor(app.skills_match_score) },
            ]}
          >
            {app.skills_match_score ?? "—"}% match
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const apc = StyleSheet.create({
  root: {
    backgroundColor: C.white,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 12,
  },
  top: { flexDirection: "row", gap: 12, alignItems: "center" },
  info: { flex: 1, gap: 3 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: C.navy,
    flex: 1,
    letterSpacing: -0.2,
  },
  email: { fontSize: 11, color: C.muted, fontWeight: "500" },
  exp: { fontSize: 11, color: C.sub, fontWeight: "500" },
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginTop: 12,
    marginBottom: 10,
  },
  bottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  matchRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  matchText: { fontSize: 12, fontWeight: "700" },
});

// ─── Tabs ─────────────────────────────────────────────────────────────────────
const TABS = ["Overview", "Applications"];

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();
  // add router inside the component
  const router = useRouter();

  const [activeTab, setActiveTab] = useState("Overview");
  const [appFilter, setAppFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  // TODO: replace with GET /api/job-postings/<id>/ and GET /api/applications/?job_posting=<id>
  const job = MOCK_JOB;
  const appStats = MOCK_APP_STATS;
  const applications = MOCK_APPLICATIONS;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const filteredApps = applications.filter(
    (a) => appFilter === "All" || a.status === appFilter,
  );

  return (
    <View style={ds.root}>
      {/* Tab bar */}
      <View style={ds.tabBar}>
        {/* Back Button */}
        <Pressable onPress={() => router.back()} style={ds.backBtn}>
          <ArrowLeftIcon size={20} color={C.navy} strokeWidth={2.5} />
        </Pressable>

        {TABS.map((tab) => (
          <Pressable
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={ds.tabItem}
          >
            <Text style={[ds.tabText, activeTab === tab && ds.tabTextActive]}>
              {tab}
              {tab === "Applications" ? ` (${appStats.total})` : ""}
            </Text>
            {activeTab === tab && <View style={ds.tabIndicator} />}
          </Pressable>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={ds.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.accent}
            colors={[C.accent]}
          />
        }
      >
        {/* Hero always visible */}
        <JobHero job={job} />

        {activeTab === "Overview" && (
          <>
            {/* Key details */}
            <View style={ds.section}>
              <GroupLabel title="Position Details" />
              <View style={ds.detailsCard}>
                {[
                  {
                    icon: BuildingOffice2Icon,
                    color: C.accent,
                    label: "Department",
                    value: job.department,
                  },
                  {
                    icon: MapPinIcon,
                    color: C.blue,
                    label: "Location",
                    value: job.location,
                  },
                  {
                    icon: BriefcaseIcon,
                    color: C.purple,
                    label: "Employment Type",
                    value: job.job_type,
                  },
                  {
                    icon: UserCircleIcon,
                    color: C.slate,
                    label: "Experience Level",
                    value: job.experience_level,
                  },
                  {
                    icon: CalendarDaysIcon,
                    color: C.green,
                    label: "Application Deadline",
                    value: job.deadline,
                  },
                  {
                    icon: CalendarDaysIcon,
                    color: C.amber,
                    label: "Start Date",
                    value: job.start_date,
                  },
                  {
                    icon: ClockIcon,
                    color: C.slate,
                    label: "Working Hours",
                    value: job.working_hours,
                  },
                  {
                    icon: UserGroupIcon,
                    color: C.accent,
                    label: "Open Positions",
                    value: `${job.positions} position${job.positions > 1 ? "s" : ""}`,
                  },
                ].map((row, i, arr) => (
                  <View key={row.label}>
                    <View style={ds.detailRow}>
                      <View
                        style={[
                          ds.detailIcon,
                          { backgroundColor: row.color + "18" },
                        ]}
                      >
                        <row.icon size={14} color={row.color} strokeWidth={2} />
                      </View>
                      <View style={ds.detailTexts}>
                        <Text style={ds.detailLabel}>{row.label}</Text>
                        <Text style={ds.detailValue}>{row.value}</Text>
                      </View>
                    </View>
                    {i < arr.length - 1 && <View style={ds.rowDiv} />}
                  </View>
                ))}
              </View>
            </View>

            {/* Salary */}
            {job.show_salary && (
              <View style={ds.section}>
                <GroupLabel title="Compensation" />
                <InfoCard
                  icon={CurrencyDollarIcon}
                  iconColor={C.green}
                  title="Salary Range"
                >
                  <Text style={ds.salaryBig}>
                    {formatSalary(
                      job.salary_min,
                      job.salary_max,
                      job.salary_currency,
                      true,
                    )}
                  </Text>
                </InfoCard>
              </View>
            )}

            {/* Description */}
            <View style={ds.section}>
              <GroupLabel title="About the Role" />
              <InfoCard
                icon={BriefcaseIcon}
                iconColor={C.blue}
                title="Job Description"
              >
                <Text style={ds.bodyText}>{job.job_description}</Text>
              </InfoCard>
            </View>

            {/* Responsibilities */}
            <View style={ds.section}>
              <GroupLabel title="Responsibilities" />
              <InfoCard
                icon={CheckBadgeIcon}
                iconColor={C.accent}
                title="What You'll Do"
              >
                <BulletList text={job.responsibilities} />
              </InfoCard>
            </View>

            {/* Requirements */}
            <View style={ds.section}>
              <GroupLabel title="Requirements" />
              <InfoCard
                icon={StarIcon}
                iconColor={C.amber}
                title="What We're Looking For"
              >
                <BulletList text={job.requirements} />
              </InfoCard>
            </View>

            {/* Benefits */}
            <View style={ds.section}>
              <GroupLabel title="Benefits" />
              <InfoCard
                icon={CheckCircleIcon}
                iconColor={C.green}
                title="What We Offer"
              >
                <BulletList text={job.benefits} />
              </InfoCard>
            </View>

            {/* Contact */}
            <View style={ds.section}>
              <GroupLabel title="Contact" />
              <View style={ds.detailsCard}>
                <View style={ds.detailRow}>
                  <View
                    style={[ds.detailIcon, { backgroundColor: C.blue + "18" }]}
                  >
                    <UserCircleIcon size={14} color={C.blue} strokeWidth={2} />
                  </View>
                  <View style={ds.detailTexts}>
                    <Text style={ds.detailLabel}>Hiring Manager</Text>
                    <Text style={ds.detailValue}>{job.hiring_manager}</Text>
                  </View>
                </View>
              </View>
            </View>
          </>
        )}

        {activeTab === "Applications" && (
          <>
            {/* Pipeline */}
            <View style={ds.section}>
              <GroupLabel title="Pipeline" />
              <PipelineCard stats={appStats} />
            </View>

            {/* Filter pills */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={ds.filterRow}
            >
              {APP_FILTERS.map((f) => {
                const active = appFilter === f;
                const cfg = APP_STATUS_CONFIG[f];
                return (
                  <Pressable
                    key={f}
                    onPress={() => setAppFilter(f)}
                    style={({ pressed }) => [
                      ds.pill,
                      active && {
                        backgroundColor: cfg ? cfg.dot : C.accent,
                        borderColor: cfg ? cfg.dot : C.accent,
                      },
                      pressed && { opacity: 0.75 },
                    ]}
                  >
                    <Text style={[ds.pillText, active && { color: C.white }]}>
                      {APP_FILTER_LABELS[f]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Result count */}
            <View style={ds.resultRow}>
              <Text style={ds.resultText}>
                {filteredApps.length} applicant
                {filteredApps.length !== 1 ? "s" : ""}
                {appFilter !== "All"
                  ? ` · ${APP_FILTER_LABELS[appFilter]}`
                  : ""}
              </Text>
            </View>

            {/* Applicant list */}
            <View style={ds.listWrap}>
              {filteredApps.map((app, i) => (
                <View key={app.id}>
                  <ApplicantCard app={app} />
                  {i < filteredApps.length - 1 && <View style={ds.cardSep} />}
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const ds = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },

  // Tab bar
  tabBar: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 14,
    position: "relative",
  },
  tabText: { fontSize: 14, fontWeight: "600", color: C.muted },
  tabTextActive: { color: C.accent, fontWeight: "800" },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: "20%",
    right: "20%",
    height: 3,
    backgroundColor: C.accent,
    borderRadius: 2,
  },

  backBtn: {
    width: 52,
    alignItems: "center",
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: C.border,
    marginVertical: 8, // add some breathing room
  },

  section: { paddingHorizontal: 16, marginTop: 20 },

  // Detail rows card
  detailsCard: {
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 12,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  detailTexts: { flex: 1 },
  detailLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  detailValue: { fontSize: 14, fontWeight: "600", color: C.navy },
  rowDiv: { height: 1, backgroundColor: C.divider, marginLeft: 60 },

  salaryBig: {
    fontSize: 18,
    fontWeight: "800",
    color: C.green,
    letterSpacing: -0.3,
  },
  bodyText: { fontSize: 13, color: C.slate, lineHeight: 21, fontWeight: "400" },

  // Applications tab
  filterRow: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  pillText: { fontSize: 12, fontWeight: "600", color: C.sub },
  resultRow: { paddingHorizontal: 18, paddingTop: 8, paddingBottom: 6 },
  resultText: { fontSize: 12, color: C.muted, fontWeight: "600" },
  listWrap: {
    marginHorizontal: 16,
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  cardSep: { height: 1, backgroundColor: C.divider, marginLeft: 74 },
});
