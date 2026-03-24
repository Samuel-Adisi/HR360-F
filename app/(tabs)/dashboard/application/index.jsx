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
  View
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
  pinkSoft: "#FDF2F8",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────
const MOCK_APPLICATIONS = [
  {
    id: 1,
    applicant_name: "Sarah Mitchell",
    applicant_email: "sarah.mitchell@email.com",
    phone: "+1 (555) 234-5678",
    city: "San Francisco",
    state: "CA",
    country: "USA",
    current_job_title: "Senior Frontend Developer",
    current_company: "TechCorp Inc.",
    experience_years: 7,
    education_level: "bachelors",
    status: "shortlisted",
    source: "linkedin",
    overall_score: 87,
    resume_score: 90,
    skills_match_score: 84,
    is_starred: true,
    is_flagged: false,
    viewed_by_hiring_manager: true,
    work_authorization: true,
    requires_sponsorship: false,
    salary_negotiable: true,
    expected_salary_min: 120000,
    expected_salary_max: 145000,
    notice_period_days: 30,
    available_start_date: "2025-04-15",
    applied_date: "2025-02-15T09:23:00Z",
    job_posting: {
      id: 1,
      job_title: "Senior React Native Developer",
      department: "Engineering",
    },
    tags: ["star-candidate", "local"],
    portfolio_url: "https://sarahmitchell.dev",
    linkedin_url: "https://linkedin.com/in/sarahmitchell",
    references_checked: false,
    background_check_status: "not_started",
    interview_scheduled_date: "2025-03-10T14:00:00Z",
  },
  {
    id: 2,
    applicant_name: "James Rodriguez",
    applicant_email: "james.rodriguez@email.com",
    phone: "+1 (555) 345-6789",
    city: "New York",
    state: "NY",
    country: "USA",
    current_job_title: "Product Manager",
    current_company: "StartupXYZ",
    experience_years: 5,
    education_level: "masters",
    status: "interview_scheduled",
    source: "referral",
    overall_score: 92,
    resume_score: 95,
    skills_match_score: 89,
    is_starred: true,
    is_flagged: false,
    viewed_by_hiring_manager: true,
    work_authorization: true,
    requires_sponsorship: false,
    salary_negotiable: false,
    expected_salary_min: 85000,
    expected_salary_max: 100000,
    notice_period_days: 14,
    available_start_date: "2025-03-20",
    applied_date: "2025-02-10T14:30:00Z",
    job_posting: {
      id: 2,
      job_title: "Product Marketing Manager",
      department: "Marketing",
    },
    tags: ["referral", "immediate-hire"],
    portfolio_url: null,
    linkedin_url: "https://linkedin.com/in/jamesrodriguez",
    references_checked: true,
    background_check_status: "in_progress",
    interview_scheduled_date: "2025-03-05T10:00:00Z",
  },
  {
    id: 3,
    applicant_name: "Priya Sharma",
    applicant_email: "priya.sharma@email.com",
    phone: "+1 (555) 456-7890",
    city: "Chicago",
    state: "IL",
    country: "USA",
    current_job_title: "Financial Analyst",
    current_company: "Goldman Partners",
    experience_years: 3,
    education_level: "bachelors",
    status: "under_review",
    source: "company_website",
    overall_score: 74,
    resume_score: 78,
    skills_match_score: 70,
    is_starred: false,
    is_flagged: false,
    viewed_by_hiring_manager: false,
    work_authorization: true,
    requires_sponsorship: false,
    salary_negotiable: true,
    expected_salary_min: 58000,
    expected_salary_max: 70000,
    notice_period_days: 21,
    available_start_date: "2025-04-01",
    applied_date: "2025-02-18T11:00:00Z",
    job_posting: {
      id: 3,
      job_title: "Financial Analyst",
      department: "Finance",
    },
    tags: [],
    portfolio_url: null,
    linkedin_url: null,
    references_checked: false,
    background_check_status: "not_started",
    interview_scheduled_date: null,
  },
  {
    id: 4,
    applicant_name: "Marcus Johnson",
    applicant_email: "marcus.j@email.com",
    phone: "+1 (555) 567-8901",
    city: "Austin",
    state: "TX",
    country: "USA",
    current_job_title: "UX Designer",
    current_company: "DesignStudio Co.",
    experience_years: 4,
    education_level: "bachelors",
    status: "pending",
    source: "indeed",
    overall_score: null,
    resume_score: null,
    skills_match_score: null,
    is_starred: false,
    is_flagged: true,
    viewed_by_hiring_manager: false,
    work_authorization: true,
    requires_sponsorship: false,
    salary_negotiable: true,
    expected_salary_min: 80000,
    expected_salary_max: 100000,
    notice_period_days: 30,
    available_start_date: "2025-05-01",
    applied_date: "2025-02-20T08:45:00Z",
    job_posting: { id: 4, job_title: "UX/UI Designer", department: "Design" },
    tags: ["flagged"],
    portfolio_url: "https://marcusdesigns.com",
    linkedin_url: "https://linkedin.com/in/marcusjohnson",
    references_checked: false,
    background_check_status: "not_started",
    interview_scheduled_date: null,
  },
  {
    id: 5,
    applicant_name: "Emily Chen",
    applicant_email: "emily.chen@email.com",
    phone: "+1 (555) 678-9012",
    city: "Seattle",
    state: "WA",
    country: "USA",
    current_job_title: "HR Generalist",
    current_company: "MegaCorp LLC",
    experience_years: 6,
    education_level: "masters",
    status: "offer_extended",
    source: "linkedin",
    overall_score: 95,
    resume_score: 97,
    skills_match_score: 93,
    is_starred: true,
    is_flagged: false,
    viewed_by_hiring_manager: true,
    work_authorization: true,
    requires_sponsorship: false,
    salary_negotiable: true,
    expected_salary_min: 82000,
    expected_salary_max: 98000,
    notice_period_days: 14,
    available_start_date: "2025-03-15",
    applied_date: "2025-01-28T13:00:00Z",
    job_posting: {
      id: 5,
      job_title: "HR Business Partner",
      department: "Human Resources",
    },
    tags: ["star-candidate", "offer-sent"],
    portfolio_url: null,
    linkedin_url: "https://linkedin.com/in/emilychen",
    references_checked: true,
    background_check_status: "clear",
    interview_scheduled_date: null,
  },
  {
    id: 6,
    applicant_name: "David Park",
    applicant_email: "david.park@email.com",
    phone: "+1 (555) 789-0123",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    current_job_title: "Customer Success Lead",
    current_company: "SaaS Solutions",
    experience_years: 2,
    education_level: "bachelors",
    status: "rejected",
    source: "glassdoor",
    overall_score: 45,
    resume_score: 50,
    skills_match_score: 40,
    is_starred: false,
    is_flagged: false,
    viewed_by_hiring_manager: true,
    work_authorization: true,
    requires_sponsorship: false,
    salary_negotiable: true,
    expected_salary_min: 48000,
    expected_salary_max: 60000,
    notice_period_days: 14,
    available_start_date: "2025-03-01",
    applied_date: "2025-02-05T10:20:00Z",
    job_posting: {
      id: 6,
      job_title: "Customer Success Manager",
      department: "Customer Support",
    },
    tags: [],
    portfolio_url: null,
    linkedin_url: null,
    references_checked: false,
    background_check_status: "not_started",
    interview_scheduled_date: null,
  },
  {
    id: 7,
    applicant_name: "Aisha Williams",
    applicant_email: "aisha.w@email.com",
    phone: "+1 (555) 890-1234",
    city: "Boston",
    state: "MA",
    country: "USA",
    current_job_title: "React Native Developer",
    current_company: "MobileFirst",
    experience_years: 5,
    education_level: "bachelors",
    status: "assessment",
    source: "company_website",
    overall_score: 81,
    resume_score: 85,
    skills_match_score: 77,
    is_starred: false,
    is_flagged: false,
    viewed_by_hiring_manager: true,
    work_authorization: true,
    requires_sponsorship: false,
    salary_negotiable: true,
    expected_salary_min: 100000,
    expected_salary_max: 125000,
    notice_period_days: 30,
    available_start_date: "2025-04-10",
    applied_date: "2025-02-12T15:45:00Z",
    job_posting: {
      id: 1,
      job_title: "Senior React Native Developer",
      department: "Engineering",
    },
    tags: ["assessment-sent"],
    portfolio_url: "https://aishadev.io",
    linkedin_url: "https://linkedin.com/in/aishawilliams",
    references_checked: false,
    background_check_status: "not_started",
    interview_scheduled_date: null,
  },
];

const MOCK_STATS = {
  total: 154,
  pending: 23,
  under_review: 31,
  shortlisted: 18,
  interview: 12,
  assessment: 9,
  offer_extended: 4,
  offer_accepted: 7,
  rejected: 38,
  on_hold: 6,
  withdrawn: 6,
  starred: 22,
  flagged: 8,
  screened: 119,
  with_resume: 141,
  without_resume: 13,
};

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const STATUS_META = {
  pending: {
    label: "Pending",
    color: "#D97706",
    bg: "#FEF3C7",
    text: "#92400E",
    icon: "time-outline",
  },
  under_review: {
    label: "Under Review",
    color: "#0891B2",
    bg: "#ECFEFF",
    text: "#164E63",
    icon: "eye-outline",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "#7C3AED",
    bg: "#EDE9FE",
    text: "#4C1D95",
    icon: "star-outline",
  },
  assessment: {
    label: "Assessment",
    color: "#2563EB",
    bg: "#EFF6FF",
    text: "#1E40AF",
    icon: "clipboard-outline",
  },
  interview_scheduled: {
    label: "Interview",
    color: "#0A66C2",
    bg: "#E0F2FE",
    text: "#0C4A6E",
    icon: "calendar-outline",
  },
  interview_completed: {
    label: "Interviewed",
    color: "#0369A1",
    bg: "#E0F2FE",
    text: "#0C4A6E",
    icon: "checkmark-circle-outline",
  },
  reference_check: {
    label: "Ref Check",
    color: "#6366F1",
    bg: "#EEF2FF",
    text: "#3730A3",
    icon: "people-outline",
  },
  background_check: {
    label: "BG Check",
    color: "#8B5CF6",
    bg: "#F5F3FF",
    text: "#5B21B6",
    icon: "shield-outline",
  },
  offer_extended: {
    label: "Offer Sent",
    color: "#16A34A",
    bg: "#DCFCE7",
    text: "#166534",
    icon: "mail-outline",
  },
  offer_accepted: {
    label: "Accepted",
    color: "#15803D",
    bg: "#DCFCE7",
    text: "#14532D",
    icon: "checkmark-done-outline",
  },
  offer_declined: {
    label: "Declined",
    color: "#DC2626",
    bg: "#FEF2F2",
    text: "#991B1B",
    icon: "close-circle-outline",
  },
  rejected: {
    label: "Rejected",
    color: "#DC2626",
    bg: "#FEF2F2",
    text: "#991B1B",
    icon: "ban-outline",
  },
  withdrawn: {
    label: "Withdrawn",
    color: "#64748B",
    bg: "#F1F5F9",
    text: "#334155",
    icon: "arrow-back-outline",
  },
  on_hold: {
    label: "On Hold",
    color: "#9333EA",
    bg: "#F5F3FF",
    text: "#581C87",
    icon: "pause-circle-outline",
  },
};

const SOURCE_META = {
  linkedin: { label: "LinkedIn", color: "#0A66C2", icon: "logo-linkedin" },
  indeed: { label: "Indeed", color: "#003A9B", icon: "globe-outline" },
  glassdoor: { label: "Glassdoor", color: "#0CAA41", icon: "globe-outline" },
  referral: { label: "Referral", color: "#F59E0B", icon: "people-outline" },
  career_fair: {
    label: "Career Fair",
    color: "#8B5CF6",
    icon: "business-outline",
  },
  company_website: {
    label: "Website",
    color: "#06B6D4",
    icon: "laptop-outline",
  },
  recruiter: { label: "Recruiter", color: "#EC4899", icon: "person-outline" },
  direct: { label: "Direct", color: "#64748B", icon: "mail-outline" },
  other: {
    label: "Other",
    color: "#94A3B8",
    icon: "ellipsis-horizontal-outline",
  },
};

const EDUCATION_LABELS = {
  high_school: "High School",
  associate: "Associate",
  bachelors: "Bachelor's",
  masters: "Master's",
  mba: "MBA",
  phd: "PhD",
  other: "Other",
};

const BG_CHECK_META = {
  not_started: { label: "Not Started", color: "#94A3B8" },
  in_progress: { label: "In Progress", color: "#D97706" },
  clear: { label: "Clear", color: "#16A34A" },
  flagged: { label: "Flagged", color: "#DC2626" },
};

const STATUS_TABS = [
  "All",
  "pending",
  "under_review",
  "shortlisted",
  "assessment",
  "interview_scheduled",
  "offer_extended",
  "rejected",
];
const SORT_OPTIONS = [
  { key: "-applied_date", label: "Newest First" },
  { key: "applied_date", label: "Oldest First" },
  { key: "-overall_score", label: "Highest Score" },
  { key: "overall_score", label: "Lowest Score" },
  { key: "applicant_name", label: "Name A–Z" },
  { key: "-experience_years", label: "Most Experience" },
];

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const formatSalary = (min, max) => {
  if (!min && !max) return null;
  const fmt = (n) => `$${Math.round(n / 1000)}k`;
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max)}`;
};

const getInitials = (name) =>
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
  "#6366F1",
  "#059669",
  "#EA580C",
];
const avatarColor = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const scoreColor = (score) => {
  if (score === null || score === undefined) return T.textMuted;
  if (score >= 80) return "#16A34A";
  if (score >= 60) return "#D97706";
  return "#DC2626";
};

const scoreBg = (score) => {
  if (score === null || score === undefined) return "#F1F5F9";
  if (score >= 80) return "#DCFCE7";
  if (score >= 60) return "#FEF3C7";
  return "#FEF2F2";
};

// ─────────────────────────────────────────────────────────────
//  STATS WIDGET
// ─────────────────────────────────────────────────────────────
const StatsWidget = ({ stats }) => {
  const conversionRate =
    stats.total > 0
      ? Math.round(
          ((stats.offer_accepted + stats.offer_extended) / stats.total) * 100,
        )
      : 0;
  const screenedRate =
    stats.total > 0 ? Math.round((stats.screened / stats.total) * 100) : 0;

  const tiles = [
    { val: stats.total, label: "Total", color: T.blue, icon: "people" },
    { val: stats.pending, label: "Pending", color: "#D97706", icon: "time" },
    {
      val: stats.shortlisted,
      label: "Shortlisted",
      color: "#7C3AED",
      icon: "star",
    },
    {
      val: stats.interview,
      label: "Interviews",
      color: "#0891B2",
      icon: "calendar",
    },
    {
      val: stats.offer_extended,
      label: "Offers",
      color: "#16A34A",
      icon: "mail",
    },
    { val: stats.rejected, label: "Rejected", color: "#DC2626", icon: "ban" },
    { val: stats.starred, label: "Starred", color: "#F59E0B", icon: "star" },
    { val: stats.flagged, label: "Flagged", color: "#EF4444", icon: "flag" },
  ];

  return (
    <View style={stw.wrapper}>
      {/* Hero dark card */}
      <View style={stw.hero}>
        <View style={stw.blob1} />
        <View style={stw.blob2} />
        <View style={stw.heroRow}>
          <View style={stw.heroLeft}>
            <Text style={stw.eyebrow}>APPLICATIONS</Text>
            <Text style={stw.heroNum}>{stats.total}</Text>
            <View style={stw.heroMeta}>
              <View style={stw.metaBadge}>
                <Ionicons name="shield-checkmark" size={10} color="#4ADE80" />
                <Text style={stw.metaBadgeTxt}>{stats.screened} screened</Text>
              </View>
              <View
                style={[
                  stw.metaBadge,
                  { backgroundColor: "rgba(251,191,36,0.15)" },
                ]}
              >
                <Ionicons name="star" size={10} color="#FBBF24" />
                <Text style={[stw.metaBadgeTxt, { color: "#FBBF24" }]}>
                  {stats.starred} starred
                </Text>
              </View>
            </View>
          </View>
          <View style={stw.heroRings}>
            <View style={stw.ringWrap}>
              <View style={[stw.ring, { borderColor: "#60A5FA" }]}>
                <Text style={stw.ringPct}>{conversionRate}%</Text>
              </View>
              <Text style={stw.ringLabel}>Conversion</Text>
            </View>
            <View style={stw.ringWrap}>
              <View
                style={[
                  stw.ring,
                  {
                    borderColor: "#4ADE80",
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                  },
                ]}
              >
                <Text style={[stw.ringPct, { fontSize: 11 }]}>
                  {screenedRate}%
                </Text>
              </View>
              <Text style={stw.ringLabel}>Screened</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Scrollable stat tiles */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={stw.tilesRow}
      >
        {tiles.map((t) => (
          <View key={t.label} style={stw.tile}>
            <View style={[stw.tileIcon, { backgroundColor: t.color + "18" }]}>
              <Ionicons name={t.icon} size={14} color={t.color} />
            </View>
            <Text style={stw.tileVal}>{t.val}</Text>
            <Text style={stw.tileLbl}>{t.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const stw = StyleSheet.create({
  wrapper: { paddingHorizontal: 14, marginBottom: 10 },
  hero: {
    backgroundColor: "#0F172A",
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#0F172A",
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
    backgroundColor: "#0A66C2",
    opacity: 0.1,
    top: -70,
    right: -50,
  },
  blob2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#7C3AED",
    opacity: 0.12,
    bottom: -40,
    left: 40,
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
  heroMeta: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  metaBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(74,222,128,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  metaBadgeTxt: { fontSize: 10, color: "#4ADE80", fontWeight: "700" },
  heroRings: { alignItems: "center", gap: 12, paddingLeft: 16 },
  ringWrap: { alignItems: "center", gap: 4 },
  ring: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  ringPct: { fontSize: 13, fontWeight: "800", color: "#fff" },
  ringLabel: { fontSize: 9, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
  tilesRow: { gap: 8, paddingRight: 4 },
  tile: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
    minWidth: 72,
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
    fontSize: 20,
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
//  PIPELINE FUNNEL (kanban-style overview)
// ─────────────────────────────────────────────────────────────
const PipelineBar = ({ stats }) => {
  const stages = [
    { key: "pending", label: "New", count: stats.pending, color: "#D97706" },
    {
      key: "under_review",
      label: "Review",
      count: stats.under_review,
      color: "#0891B2",
    },
    {
      key: "shortlisted",
      label: "Short.",
      count: stats.shortlisted,
      color: "#7C3AED",
    },
    {
      key: "assessment",
      label: "Assess.",
      count: stats.assessment,
      color: "#2563EB",
    },
    {
      key: "interview",
      label: "Interview",
      count: stats.interview,
      color: "#0A66C2",
    },
    {
      key: "offer_extended",
      label: "Offer",
      count: stats.offer_extended,
      color: "#16A34A",
    },
  ];
  const max = Math.max(...stages.map((s) => s.count), 1);

  return (
    <View style={pb.wrap}>
      <Text style={pb.title}>Hiring Pipeline</Text>
      <View style={pb.bars}>
        {stages.map((s) => (
          <View key={s.key} style={pb.stage}>
            <Text style={pb.count}>{s.count}</Text>
            <View style={pb.barBg}>
              <View
                style={[
                  pb.barFill,
                  {
                    height: Math.max(4, (s.count / max) * 56),
                    backgroundColor: s.color,
                  },
                ]}
              />
            </View>
            <Text style={pb.stageLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const pb = StyleSheet.create({
  wrap: {
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 12, fontWeight: "700", color: T.text, marginBottom: 12 },
  bars: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  stage: { flex: 1, alignItems: "center", gap: 4 },
  count: { fontSize: 13, fontWeight: "800", color: T.text },
  barBg: {
    width: "70%",
    height: 64,
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: T.border,
  },
  barFill: { width: "100%", borderRadius: 4 },
  stageLabel: { fontSize: 9, color: T.textMuted, fontWeight: "600" },
});

// ─────────────────────────────────────────────────────────────
//  SCORE RING
// ─────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 42 }) => {
  const color = scoreColor(score);
  const bg = scoreBg(score);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: bg,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: color + "40",
      }}
    >
      {score !== null && score !== undefined ? (
        <Text
          style={{ fontSize: size > 40 ? 13 : 11, fontWeight: "800", color }}
        >
          {score}
        </Text>
      ) : (
        <Ionicons name="remove" size={14} color={T.textMuted} />
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
//  APPLICATION CARD  (LinkedIn-inspired clean style)
// ─────────────────────────────────────────────────────────────
const AppCard = ({ app, onPress, onStar, onFlag }) => {
  const sm = STATUS_META[app.status] || STATUS_META.pending;
  const src = SOURCE_META[app.source] || SOURCE_META.other;

  return (
    <TouchableOpacity
      style={ac.card}
      onPress={() => onPress(app)}
      activeOpacity={0.85}
    >
      {/* Top row: avatar + info + score */}
      <View style={ac.topRow}>
        {/* Avatar */}
        <View
          style={[
            ac.avatar,
            { backgroundColor: avatarColor(app.applicant_name) },
          ]}
        >
          <Text style={ac.avatarTxt}>{getInitials(app.applicant_name)}</Text>
          {app.is_starred && (
            <View style={ac.starBadge}>
              <Ionicons name="star" size={8} color="#FBBF24" />
            </View>
          )}
        </View>

        {/* Name + role */}
        <View style={ac.nameBlock}>
          <View style={ac.nameRow}>
            <Text style={ac.name} numberOfLines={1}>
              {app.applicant_name}
            </Text>
            {app.is_flagged && (
              <Ionicons
                name="flag"
                size={12}
                color={T.red}
                style={{ marginLeft: 4 }}
              />
            )}
          </View>
          <Text style={ac.role} numberOfLines={1}>
            {app.current_job_title || "—"}
            {app.current_company ? ` · ${app.current_company}` : ""}
          </Text>
          <Text style={ac.jobLine} numberOfLines={1}>
            {app.job_posting.job_title}
          </Text>
        </View>

        {/* Score */}
        <ScoreRing score={app.overall_score} />
      </View>

      {/* Meta chips row */}
      <View style={ac.chips}>
        {/* Status */}
        <View style={[ac.chip, { backgroundColor: sm.bg }]}>
          <View style={[ac.chipDot, { backgroundColor: sm.color }]} />
          <Text style={[ac.chipTxt, { color: sm.text }]}>{sm.label}</Text>
        </View>

        {/* Experience */}
        {app.experience_years && (
          <View style={ac.chip}>
            <Ionicons name="briefcase-outline" size={10} color={T.textMuted} />
            <Text style={ac.chipTxt}>{app.experience_years}y exp</Text>
          </View>
        )}

        {/* Education */}
        {app.education_level && (
          <View style={ac.chip}>
            <Ionicons name="school-outline" size={10} color={T.textMuted} />
            <Text style={ac.chipTxt}>
              {EDUCATION_LABELS[app.education_level]}
            </Text>
          </View>
        )}

        {/* Source */}
        <View style={ac.chip}>
          <Ionicons name={src.icon} size={10} color={src.color} />
          <Text style={[ac.chipTxt, { color: src.color }]}>{src.label}</Text>
        </View>
      </View>

      {/* Salary if present */}
      {formatSalary(app.expected_salary_min, app.expected_salary_max) && (
        <View style={ac.salaryRow}>
          <Ionicons name="cash-outline" size={12} color={T.textMuted} />
          <Text style={ac.salaryTxt}>
            Expects{" "}
            {formatSalary(app.expected_salary_min, app.expected_salary_max)}
            {app.salary_negotiable ? " · Negotiable" : ""}
          </Text>
        </View>
      )}

      {/* Tags */}
      {app.tags.length > 0 && (
        <View style={ac.tagsRow}>
          {app.tags.slice(0, 3).map((tag) => (
            <View key={tag} style={ac.tag}>
              <Text style={ac.tagTxt}>#{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Footer */}
      <View style={ac.footer}>
        <View style={ac.footerLeft}>
          <Ionicons name="time-outline" size={11} color={T.textMuted} />
          <Text style={ac.footerTxt}>{timeAgo(app.applied_date)}</Text>
          {!app.viewed_by_hiring_manager && (
            <>
              <View style={ac.sep} />
              <View style={ac.newBadge}>
                <Text style={ac.newBadgeTxt}>NEW</Text>
              </View>
            </>
          )}
          {app.interview_scheduled_date && (
            <>
              <View style={ac.sep} />
              <Ionicons name="calendar" size={11} color={T.blue} />
              <Text style={[ac.footerTxt, { color: T.blue }]}>
                {new Date(app.interview_scheduled_date).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric" },
                )}
              </Text>
            </>
          )}
        </View>

        {/* Quick actions */}
        <View style={ac.footerRight}>
          <TouchableOpacity style={ac.iconBtn} onPress={() => onStar(app.id)}>
            <Ionicons
              name={app.is_starred ? "star" : "star-outline"}
              size={15}
              color={app.is_starred ? "#F59E0B" : T.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity style={ac.iconBtn} onPress={() => onFlag(app.id)}>
            <Ionicons
              name={app.is_flagged ? "flag" : "flag-outline"}
              size={15}
              color={app.is_flagged ? T.red : T.textMuted}
            />
          </TouchableOpacity>
          <TouchableOpacity style={ac.viewBtn} onPress={() => onPress(app)}>
            <Text style={ac.viewBtnTxt}>View</Text>
            <Ionicons name="chevron-forward" size={12} color={T.blue} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const ac = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 8,
    borderBottomColor: "#F1F5F9",
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  avatarTxt: { fontSize: 15, fontWeight: "800", color: "#fff" },
  starBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#1E293B",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  nameBlock: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 15, fontWeight: "700", color: T.text, flex: 1 },
  role: { fontSize: 12, color: T.textSub, marginTop: 1 },
  jobLine: { fontSize: 11, color: T.textMuted, marginTop: 1 },

  chips: { flexDirection: "row", flexWrap: "wrap", gap: 5, marginBottom: 7 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: "#F8FAFC",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  chipDot: { width: 5, height: 5, borderRadius: 3 },
  chipTxt: { fontSize: 10, color: T.textSub, fontWeight: "600" },

  salaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 6,
  },
  salaryTxt: { fontSize: 11, color: T.textSub, fontWeight: "600" },

  tagsRow: { flexDirection: "row", gap: 5, marginBottom: 7, flexWrap: "wrap" },
  tag: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 6,
  },
  tagTxt: { fontSize: 10, color: "#64748B", fontWeight: "600" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 5 },
  footerTxt: { fontSize: 11, color: T.textMuted, fontWeight: "600" },
  sep: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: T.border },
  newBadge: {
    backgroundColor: "#DBEAFE",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  newBadgeTxt: {
    fontSize: 8,
    fontWeight: "800",
    color: "#1E40AF",
    letterSpacing: 0.5,
  },

  footerRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  iconBtn: { padding: 4 },
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1.5,
    borderColor: T.blue,
    borderRadius: 16,
  },
  viewBtnTxt: { fontSize: 11, fontWeight: "700", color: T.blue },
});

// ─────────────────────────────────────────────────────────────
//  DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const DetailModal = ({ app, onClose, onStatusChange, onDelete }) => {
  if (!app) return null;
  const sm = STATUS_META[app.status] || STATUS_META.pending;
  const src = SOURCE_META[app.source] || SOURCE_META.other;
  const bgCheck =
    BG_CHECK_META[app.background_check_status] || BG_CHECK_META.not_started;
  const color = avatarColor(app.applicant_name);

  const STATUS_ACTIONS = [
    "under_review",
    "shortlisted",
    "assessment",
    "interview_scheduled",
    "offer_extended",
    "offer_accepted",
    "rejected",
    "on_hold",
  ];

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={dm.overlay}>
        <View style={dm.sheet}>
          <View style={dm.handle} />

          {/* Header */}
          <View style={dm.header}>
            <TouchableOpacity onPress={onClose} style={dm.closeBtn}>
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
            <Text style={dm.headerTitle}>Application</Text>
            <TouchableOpacity
              style={dm.deleteBtn}
              onPress={() => {
                Alert.alert("Delete", "Remove this application?", [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Delete",
                    style: "destructive",
                    onPress: () => {
                      onDelete(app.id);
                      onClose();
                    },
                  },
                ]);
              }}
            >
              <Ionicons name="trash-outline" size={16} color={T.red} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={[dm.hero, { backgroundColor: color + "18" }]}>
              <View style={[dm.heroAvatar, { backgroundColor: color }]}>
                <Text style={dm.heroAvatarTxt}>
                  {getInitials(app.applicant_name)}
                </Text>
              </View>
              <Text style={dm.heroName}>{app.applicant_name}</Text>
              <Text style={dm.heroRole}>
                {app.current_job_title || "—"}
                {app.current_company ? ` at ${app.current_company}` : ""}
              </Text>
              <Text style={dm.heroJob}>
                {app.job_posting.job_title} · {app.job_posting.department}
              </Text>

              {/* Status + source badges */}
              <View style={dm.heroBadges}>
                <View style={[dm.badge, { backgroundColor: sm.bg }]}>
                  <Ionicons name={sm.icon} size={11} color={sm.color} />
                  <Text style={[dm.badgeTxt, { color: sm.text }]}>
                    {sm.label}
                  </Text>
                </View>
                <View style={[dm.badge, { backgroundColor: "#F8FAFC" }]}>
                  <Ionicons name={src.icon} size={11} color={src.color} />
                  <Text style={[dm.badgeTxt, { color: src.color }]}>
                    {src.label}
                  </Text>
                </View>
                {app.is_starred && (
                  <View style={[dm.badge, { backgroundColor: "#FEF3C7" }]}>
                    <Ionicons name="star" size={11} color="#D97706" />
                    <Text style={[dm.badgeTxt, { color: "#92400E" }]}>
                      Starred
                    </Text>
                  </View>
                )}
                {app.is_flagged && (
                  <View style={[dm.badge, { backgroundColor: T.redSoft }]}>
                    <Ionicons name="flag" size={11} color={T.red} />
                    <Text style={[dm.badgeTxt, { color: T.red }]}>Flagged</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Score cards */}
            <View style={dm.scoreRow}>
              {[
                {
                  label: "Overall",
                  score: app.overall_score,
                  icon: "analytics",
                },
                {
                  label: "Resume",
                  score: app.resume_score,
                  icon: "document-text",
                },
                {
                  label: "Skills",
                  score: app.skills_match_score,
                  icon: "code-slash",
                },
              ].map((s) => (
                <View key={s.label} style={dm.scoreCard}>
                  <Ionicons
                    name={s.icon}
                    size={14}
                    color={scoreColor(s.score)}
                    style={{ marginBottom: 4 }}
                  />
                  <Text style={[dm.scoreVal, { color: scoreColor(s.score) }]}>
                    {s.score !== null && s.score !== undefined
                      ? `${s.score}`
                      : "—"}
                  </Text>
                  <Text style={dm.scoreLbl}>{s.label}</Text>
                </View>
              ))}
            </View>

            {/* Contact info */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Contact Information</Text>
              {[
                { icon: "mail-outline", val: app.applicant_email },
                { icon: "call-outline", val: app.phone || "—" },
                {
                  icon: "location-outline",
                  val:
                    [app.city, app.state, app.country]
                      .filter(Boolean)
                      .join(", ") || "—",
                },
              ].map((r) => (
                <View key={r.icon} style={dm.infoRow}>
                  <View style={dm.infoIcon}>
                    <Ionicons name={r.icon} size={15} color="#64748B" />
                  </View>
                  <Text style={dm.infoVal}>{r.val}</Text>
                </View>
              ))}
            </View>

            {/* Professional */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Professional Details</Text>
              {[
                {
                  icon: "briefcase-outline",
                  label: "Experience",
                  val: app.experience_years
                    ? `${app.experience_years} years`
                    : "—",
                },
                {
                  icon: "school-outline",
                  label: "Education",
                  val: EDUCATION_LABELS[app.education_level] || "—",
                },
                {
                  icon: "cash-outline",
                  label: "Expected Salary",
                  val:
                    formatSalary(
                      app.expected_salary_min,
                      app.expected_salary_max,
                    ) || "Not specified",
                },
                {
                  icon: "time-outline",
                  label: "Notice Period",
                  val: app.notice_period_days
                    ? `${app.notice_period_days} days`
                    : "—",
                },
                {
                  icon: "calendar-outline",
                  label: "Available From",
                  val: app.available_start_date
                    ? new Date(app.available_start_date).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )
                    : "—",
                },
              ].map((r) => (
                <View key={r.label} style={dm.infoRow}>
                  <View style={dm.infoIcon}>
                    <Ionicons name={r.icon} size={15} color="#64748B" />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={dm.infoLabel}>{r.label}</Text>
                    <Text style={dm.infoVal}>{r.val}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Links */}
            {(app.linkedin_url || app.portfolio_url) && (
              <View style={dm.section}>
                <Text style={dm.sectionTitle}>Links</Text>
                {app.linkedin_url && (
                  <View style={dm.infoRow}>
                    <View style={dm.infoIcon}>
                      <Ionicons
                        name="logo-linkedin"
                        size={15}
                        color="#0A66C2"
                      />
                    </View>
                    <Text style={[dm.infoVal, { color: T.blue }]}>
                      LinkedIn Profile
                    </Text>
                  </View>
                )}
                {app.portfolio_url && (
                  <View style={dm.infoRow}>
                    <View style={dm.infoIcon}>
                      <Ionicons
                        name="globe-outline"
                        size={15}
                        color="#64748B"
                      />
                    </View>
                    <Text style={[dm.infoVal, { color: T.blue }]}>
                      Portfolio / Website
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Work Authorization */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Work Authorization</Text>
              <View style={dm.authRow}>
                <View
                  style={[
                    dm.authBadge,
                    {
                      backgroundColor: app.work_authorization
                        ? T.greenSoft
                        : T.redSoft,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      app.work_authorization
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={14}
                    color={app.work_authorization ? T.green : T.red}
                  />
                  <Text
                    style={[
                      dm.authTxt,
                      { color: app.work_authorization ? T.green : T.red },
                    ]}
                  >
                    {app.work_authorization
                      ? "Authorized to work"
                      : "Not authorized"}
                  </Text>
                </View>
                {app.requires_sponsorship && (
                  <View
                    style={[dm.authBadge, { backgroundColor: T.orangeSoft }]}
                  >
                    <Ionicons name="alert-circle" size={14} color={T.orange} />
                    <Text style={[dm.authTxt, { color: T.orange }]}>
                      Needs sponsorship
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Checks */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Checks & Verification</Text>
              <View style={dm.checksRow}>
                <View
                  style={[
                    dm.checkItem,
                    {
                      backgroundColor: app.references_checked
                        ? T.greenSoft
                        : "#F8FAFC",
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      app.references_checked
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={18}
                    color={app.references_checked ? T.green : T.textMuted}
                  />
                  <Text
                    style={[
                      dm.checkLabel,
                      { color: app.references_checked ? T.green : T.textMuted },
                    ]}
                  >
                    References
                  </Text>
                </View>
                <View
                  style={[
                    dm.checkItem,
                    {
                      backgroundColor:
                        bgCheck.color === "#16A34A" ? T.greenSoft : "#F8FAFC",
                    },
                  ]}
                >
                  <Ionicons
                    name="shield-checkmark-outline"
                    size={18}
                    color={bgCheck.color}
                  />
                  <Text style={[dm.checkLabel, { color: bgCheck.color }]}>
                    BG: {bgCheck.label}
                  </Text>
                </View>
              </View>
            </View>

            {/* Tags */}
            {app.tags.length > 0 && (
              <View style={dm.section}>
                <Text style={dm.sectionTitle}>Tags</Text>
                <View style={dm.tagsRow}>
                  {app.tags.map((tag) => (
                    <View key={tag} style={dm.tagBadge}>
                      <Text style={dm.tagBadgeTxt}>#{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Change Status */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Update Status</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 8, paddingBottom: 4 }}
              >
                {STATUS_ACTIONS.map((s) => {
                  const meta = STATUS_META[s];
                  const isActive = app.status === s;
                  return (
                    <TouchableOpacity
                      key={s}
                      style={[
                        dm.statusBtn,
                        isActive && {
                          backgroundColor: meta.bg,
                          borderColor: meta.color,
                        },
                      ]}
                      onPress={() => {
                        onStatusChange(app.id, s);
                        onClose();
                      }}
                    >
                      <Ionicons
                        name={meta.icon}
                        size={12}
                        color={isActive ? meta.color : T.textMuted}
                      />
                      <Text
                        style={[
                          dm.statusBtnTxt,
                          isActive && { color: meta.text },
                        ]}
                      >
                        {meta.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer actions */}
          <View style={dm.footer}>
            <TouchableOpacity style={dm.footerBtn}>
              <Ionicons name="mail-outline" size={16} color="#fff" />
              <Text style={dm.footerBtnTxt}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[dm.footerBtn, { backgroundColor: T.blue }]}
            >
              <Ionicons name="calendar-outline" size={16} color="#fff" />
              <Text style={dm.footerBtnTxt}>Schedule</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[dm.footerBtn, { backgroundColor: T.green }]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#fff"
              />
              <Text style={dm.footerBtnTxt}>Shortlist</Text>
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
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "94%",
    paddingBottom: 0,
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
  headerTitle: { fontSize: 17, fontWeight: "700", color: T.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },

  hero: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 5,
  },
  heroAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroAvatarTxt: { fontSize: 20, fontWeight: "800", color: "#fff" },
  heroName: {
    fontSize: 19,
    fontWeight: "800",
    color: T.text,
    textAlign: "center",
  },
  heroRole: { fontSize: 13, color: T.textSub, textAlign: "center" },
  heroJob: { fontSize: 11, color: T.textMuted, textAlign: "center" },
  heroBadges: {
    flexDirection: "row",
    gap: 6,
    marginTop: 6,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeTxt: { fontSize: 11, fontWeight: "700" },

  scoreRow: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    gap: 0,
    borderWidth: 1,
    borderColor: T.border,
  },
  scoreCard: { flex: 1, alignItems: "center", gap: 2 },
  scoreVal: { fontSize: 22, fontWeight: "900" },
  scoreLbl: { fontSize: 10, color: T.textMuted, fontWeight: "600" },

  section: { paddingHorizontal: 20, marginBottom: 18 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "500",
    marginBottom: 1,
  },
  infoVal: { fontSize: 13, color: T.text, fontWeight: "600" },

  authRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  authBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 10,
  },
  authTxt: { fontSize: 12, fontWeight: "700" },

  checksRow: { flexDirection: "row", gap: 10 },
  checkItem: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  checkLabel: { fontSize: 11, fontWeight: "700", textAlign: "center" },

  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tagBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  tagBadgeTxt: { fontSize: 11, color: "#64748B", fontWeight: "600" },

  statusBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
  },
  statusBtnTxt: { fontSize: 11, fontWeight: "700", color: T.textSub },

  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#fff",
  },
  footerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#475569",
  },
  footerBtnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  SORT MODAL
// ─────────────────────────────────────────────────────────────
const SortModal = ({ visible, current, onSelect, onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity style={sm2.overlay} onPress={onClose} activeOpacity={1}>
      <View style={sm2.sheet}>
        <Text style={sm2.title}>Sort By</Text>
        {SORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            style={[sm2.option, current === opt.key && sm2.optionActive]}
            onPress={() => {
              onSelect(opt.key);
              onClose();
            }}
          >
            <Text
              style={[
                sm2.optionTxt,
                current === opt.key && sm2.optionTxtActive,
              ]}
            >
              {opt.label}
            </Text>
            {current === opt.key && (
              <Ionicons name="checkmark" size={16} color={T.blue} />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </TouchableOpacity>
  </Modal>
);

const sm2 = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 36,
  },
  title: { fontSize: 16, fontWeight: "800", color: T.text, marginBottom: 14 },
  option: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  optionActive: {},
  optionTxt: { fontSize: 14, color: T.textSub, fontWeight: "600" },
  optionTxtActive: { color: T.blue, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function ApplicationsScreen() {
  const [apps, setApps] = useState(MOCK_APPLICATIONS);
  const [stats] = useState(MOCK_STATS);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeStatus, setActiveStatus] = useState("All");
  const [sortKey, setSortKey] = useState("-applied_date");
  const [showSort, setShowSort] = useState(false);
  const [showStarred, setShowStarred] = useState(false);
  const [showFlagged, setShowFlagged] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showPipeline, setShowPipeline] = useState(false);

  const filtered = useMemo(() => {
    let list = [...apps];

    if (activeStatus !== "All")
      list = list.filter((a) => a.status === activeStatus);
    if (showStarred) list = list.filter((a) => a.is_starred);
    if (showFlagged) list = list.filter((a) => a.is_flagged);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.applicant_name.toLowerCase().includes(q) ||
          a.applicant_email.toLowerCase().includes(q) ||
          (a.current_job_title || "").toLowerCase().includes(q) ||
          (a.current_company || "").toLowerCase().includes(q) ||
          a.job_posting.job_title.toLowerCase().includes(q),
      );
    }

    // Sort
    list.sort((a, b) => {
      const desc = sortKey.startsWith("-");
      const key = sortKey.replace("-", "");
      let va = a[key],
        vb = b[key];
      if (key === "applied_date") {
        va = new Date(va);
        vb = new Date(vb);
      }
      if (va === null || va === undefined) return 1;
      if (vb === null || vb === undefined) return -1;
      if (va < vb) return desc ? 1 : -1;
      if (va > vb) return desc ? -1 : 1;
      return 0;
    });

    return list;
  }, [apps, activeStatus, showStarred, showFlagged, search, sortKey]);

  const handleStar = (id) =>
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_starred: !a.is_starred } : a)),
    );
  const handleFlag = (id) =>
    setApps((prev) =>
      prev.map((a) => (a.id === id ? { ...a, is_flagged: !a.is_flagged } : a)),
    );
  const handleDelete = (id) =>
    setApps((prev) => prev.filter((a) => a.id !== id));
  const handleStatusChange = (id, status) =>
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.key === sortKey)?.label || "Sort";
  const hasFilters =
    showStarred ||
    showFlagged ||
    activeStatus !== "All" ||
    search.trim() !== "";

  const ListHeader = () => (
    <>
      {/* Title bar */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Applications</Text>
          <Text style={s.pageSub}>
            {stats.total} total · {stats.pending} new
          </Text>
        </View>
        <View style={s.titleActions}>
          <TouchableOpacity
            style={s.iconAction}
            onPress={() => setShowPipeline((p) => !p)}
          >
            <Ionicons
              name="bar-chart-outline"
              size={18}
              color={showPipeline ? T.blue : "#475569"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={s.exportBtn}>
            <Ionicons name="download-outline" size={14} color="#334155" />
            <Text style={s.exportTxt}>Export</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <StatsWidget stats={stats} />

      {/* Pipeline toggle */}
      {showPipeline && <PipelineBar stats={stats} />}

      {/* Search */}
      <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
        <Ionicons
          name="search-outline"
          size={16}
          color={searchFocused ? T.blue : "#94A3B8"}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search candidates, roles, companies…"
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

      {/* Filter chips row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.filterRow}
      >
        {/* Sort */}
        <TouchableOpacity
          style={[s.filterChip, s.filterChipSort]}
          onPress={() => setShowSort(true)}
        >
          <Ionicons name="swap-vertical-outline" size={12} color="#334155" />
          <Text style={s.filterChipSortTxt}>{currentSortLabel}</Text>
          <Ionicons name="chevron-down" size={10} color="#64748B" />
        </TouchableOpacity>

        {/* Starred */}
        <TouchableOpacity
          style={[
            s.filterChip,
            showStarred && {
              backgroundColor: "#FEF3C7",
              borderColor: "#F59E0B",
            },
          ]}
          onPress={() => setShowStarred((p) => !p)}
        >
          <Ionicons
            name="star"
            size={12}
            color={showStarred ? "#D97706" : T.textMuted}
          />
          <Text style={[s.filterChipTxt, showStarred && { color: "#92400E" }]}>
            Starred
          </Text>
        </TouchableOpacity>

        {/* Flagged */}
        <TouchableOpacity
          style={[
            s.filterChip,
            showFlagged && { backgroundColor: T.redSoft, borderColor: T.red },
          ]}
          onPress={() => setShowFlagged((p) => !p)}
        >
          <Ionicons
            name="flag"
            size={12}
            color={showFlagged ? T.red : T.textMuted}
          />
          <Text style={[s.filterChipTxt, showFlagged && { color: T.red }]}>
            Flagged
          </Text>
        </TouchableOpacity>

        {hasFilters && (
          <TouchableOpacity
            style={[s.filterChip, { backgroundColor: "#F1F5F9" }]}
            onPress={() => {
              setSearch("");
              setActiveStatus("All");
              setShowStarred(false);
              setShowFlagged(false);
            }}
          >
            <Ionicons name="close" size={12} color="#64748B" />
            <Text style={s.filterChipTxt}>Clear</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* Status tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.statusTabs}
      >
        {STATUS_TABS.map((tab) => {
          const meta = tab !== "All" ? STATUS_META[tab] : null;
          const count =
            tab === "All"
              ? apps.length
              : apps.filter((a) => a.status === tab).length;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                s.statusTab,
                activeStatus === tab && s.statusTabActive,
                activeStatus === tab &&
                  meta && { backgroundColor: meta.bg, borderColor: meta.color },
              ]}
              onPress={() => setActiveStatus(tab)}
            >
              {meta && (
                <Ionicons
                  name={meta.icon}
                  size={11}
                  color={activeStatus === tab ? meta.color : T.textMuted}
                />
              )}
              <Text
                style={[
                  s.statusTabTxt,
                  activeStatus === tab && meta && { color: meta.text },
                ]}
              >
                {tab === "All" ? "All" : meta?.label}
              </Text>
              <View
                style={[
                  s.countBadge,
                  activeStatus === tab &&
                    meta && { backgroundColor: meta.color + "20" },
                ]}
              >
                <Text
                  style={[
                    s.countBadgeTxt,
                    activeStatus === tab && meta && { color: meta.color },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results count */}
      {hasFilters && (
        <Text style={s.resultsCnt}>
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          {search ? ` for "${search}"` : ""}
        </Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AppCard
            app={item}
            onPress={setSelectedApp}
            onStar={handleStar}
            onFlag={handleFlag}
          />
        )}
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
            <Ionicons name="people-outline" size={54} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No applications found</Text>
            <Text style={s.emptySub}>Try adjusting your filters or search</Text>
          </View>
        }
      />

      <DetailModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
      />

      <SortModal
        visible={showSort}
        current={sortKey}
        onSelect={setSortKey}
        onClose={() => setShowSort(false)}
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

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 10,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  titleActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  iconAction: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#fff",
  },
  exportTxt: { fontSize: 12, fontWeight: "600", color: "#334155" },

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

  filterRow: { paddingHorizontal: 14, gap: 8, marginBottom: 10 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
  },
  filterChipSort: { borderColor: "#CBD5E1", backgroundColor: "#F8FAFC" },
  filterChipSortTxt: { fontSize: 12, fontWeight: "700", color: "#334155" },
  filterChipTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },

  statusTabs: {
    paddingHorizontal: 14,
    gap: 7,
    marginBottom: 10,
    alignItems: "center",
  },
  statusTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
  },
  statusTabActive: { borderColor: T.blue, backgroundColor: T.blueSoft },
  statusTabTxt: { fontSize: 11, fontWeight: "600", color: "#64748B" },
  countBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  countBadgeTxt: { fontSize: 9, fontWeight: "800", color: T.textMuted },

  resultsCnt: {
    fontSize: 12,
    color: T.textMuted,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 8,
  },

  empty: { padding: 48, alignItems: "center", gap: 8 },
  emptyTxt: { fontSize: 16, color: "#94A3B8", fontWeight: "700" },
  emptySub: { fontSize: 13, color: "#CBD5E1", textAlign: "center" },
});
