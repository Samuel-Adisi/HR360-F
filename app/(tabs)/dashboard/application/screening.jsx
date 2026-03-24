import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
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
//  THEME — matches established app theme
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
  yellow: "#CA8A04",
  yellowSoft: "#FEF9C3",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA — reflects Gemini screening engine output
// ─────────────────────────────────────────────────────────────
const MOCK_JOB_POSTINGS = [
  {
    id: 1,
    job_title: "Senior React Native Developer",
    department: "Engineering",
    applications_count: 28,
  },
  {
    id: 2,
    job_title: "Product Marketing Manager",
    department: "Marketing",
    applications_count: 14,
  },
  {
    id: 4,
    job_title: "UX/UI Designer",
    department: "Design",
    applications_count: 21,
  },
];

const MOCK_SCREENED = [
  {
    id: 1,
    applicant_name: "Sarah Mitchell",
    applicant_email: "sarah.mitchell@email.com",
    current_job_title: "Senior Frontend Developer",
    current_company: "TechCorp Inc.",
    experience_years: 7,
    education_level: "bachelors",
    status: "shortlisted",
    is_starred: true,
    is_flagged: false,
    overall_score: 87,
    resume_score: 90,
    skills_match_score: 84,
    rank: 1,
    interview_readiness: "ready",
    job_posting: { id: 1, job_title: "Senior React Native Developer" },
    screening_result: {
      recommendation:
        "Excellent match. 7 years React Native + strong portfolio. Minor gap in native iOS bridging.",
      next_steps: "Schedule technical interview immediately.",
      ranking_justification:
        "Top candidate with deep RN expertise and quantified impact across all roles.",
      scores: {
        experience: {
          points: 23,
          max: 25,
          pct: 92,
          detail:
            "7 years with progressive responsibility. Led mobile team of 6 at TechCorp.",
          quality: "senior",
        },
        education: {
          points: 17,
          max: 20,
          pct: 85,
          detail: "BS Computer Science - strong field match.",
          match: "matches",
        },
        tech_skills: {
          points: 22,
          max: 25,
          pct: 88,
          detail:
            "Deep React Native, Redux, TypeScript. Missing advanced native iOS bridging.",
          found: ["React Native", "TypeScript", "Redux", "Jest", "GraphQL"],
          missing: ["Native iOS Bridging"],
        },
        soft_skills: {
          points: 8,
          max: 10,
          pct: 80,
          detail:
            "Led 6-person team. Clear communication evidence across multiple roles.",
        },
        certifications: {
          points: 7,
          max: 10,
          pct: 70,
          detail: "AWS Certified Developer - relevant for backend integration.",
        },
        documents: {
          points: 5,
          max: 5,
          pct: 100,
          detail:
            "Exceptional resume. All achievements quantified. Portfolio impressive.",
          resume_quality: "excellent",
          resume_completeness: 97,
        },
        work_auth: {
          points: 5,
          max: 5,
          pct: 100,
          detail: "Fully authorized, no sponsorship needed.",
        },
      },
      ai_insights: {
        red_flags: ["Minor gap in native iOS module bridging"],
        strengths: [
          "Reduced app load time by 42% at TechCorp",
          "Led migration from class to functional components (200k+ LOC)",
          "Published 3 open-source RN libraries with 2k+ GitHub stars",
        ],
        key_achievements: [
          "Reduced crash rate by 78% through comprehensive testing strategy",
          "Led team of 6 delivering $2M product on schedule",
          "Migrated legacy codebase to TypeScript with zero production incidents",
        ],
        consistency_check: {
          claimed_vs_actual_experience:
            "Claims align perfectly with resume content",
          title_appropriateness:
            "Senior title fully supported by responsibilities",
          career_progression: "Strong upward trajectory. No concerning gaps.",
          education_verification: "BS CS from UC Berkeley confirmed in resume",
          salary_alignment:
            "$120k-$145k is appropriate for seniority and market.",
        },
        experience_depth: {
          level_assessment: "senior",
          relevance_percentage: 94,
          industry_match: "strong",
          leadership_evidence: "extensive",
          quantified_impact: "strong",
          technical_depth: "expert",
        },
        cultural_fit: {
          work_environment_preference: "startup",
          growth_trajectory: "fast_growth",
          risk_tolerance: "moderate",
          team_vs_individual: "balanced",
        },
      },
      screened_at: "2025-02-20T10:30:00Z",
      screening_version: "gemini-1.5-comprehensive",
    },
  },
  {
    id: 2,
    applicant_name: "James Rodriguez",
    applicant_email: "james.rodriguez@email.com",
    current_job_title: "Product Manager",
    current_company: "StartupXYZ",
    experience_years: 5,
    education_level: "masters",
    status: "interview_scheduled",
    is_starred: true,
    is_flagged: false,
    overall_score: 92,
    resume_score: 95,
    skills_match_score: 89,
    rank: 2,
    interview_readiness: "ready",
    job_posting: { id: 2, job_title: "Product Marketing Manager" },
    screening_result: {
      recommendation:
        "Outstanding candidate. MBA + 5yr B2B SaaS experience. Top 5% of applicants.",
      next_steps:
        "Proceed directly to panel interview. No phone screen needed.",
      ranking_justification:
        "Highest overall score. Exceptional resume quality with all claims verified.",
      scores: {
        experience: {
          points: 24,
          max: 25,
          pct: 96,
          detail:
            "5 years product marketing in high-growth SaaS. Grew pipeline by $8M.",
          quality: "senior",
        },
        education: {
          points: 19,
          max: 20,
          pct: 95,
          detail:
            "MBA Wharton - exceeds requirements. Business-focused education ideal for role.",
          match: "exceeds",
        },
        tech_skills: {
          points: 21,
          max: 25,
          pct: 84,
          detail:
            "HubSpot, Salesforce, Marketo, Google Analytics. Missing advanced SQL.",
          found: ["HubSpot", "Salesforce", "Marketo", "Tableau", "A/B Testing"],
          missing: ["SQL", "Python"],
        },
        soft_skills: {
          points: 9,
          max: 10,
          pct: 90,
          detail:
            "Evidence of cross-functional leadership, stakeholder management, executive presentations.",
        },
        certifications: {
          points: 8,
          max: 10,
          pct: 80,
          detail:
            "HubSpot Inbound, Google Analytics certified. Product Marketing Alliance cert.",
        },
        documents: {
          points: 5,
          max: 5,
          pct: 100,
          detail:
            "Near-perfect resume. Data-driven accomplishments throughout.",
          resume_quality: "excellent",
          resume_completeness: 98,
        },
        work_auth: {
          points: 5,
          max: 5,
          pct: 100,
          detail: "US Citizen. No issues.",
        },
      },
      ai_insights: {
        red_flags: [
          "Missing technical skills: SQL, Python - may need upskilling for data analysis tasks",
        ],
        strengths: [
          "Generated $8M in pipeline growth via ABM campaigns",
          "Launched 4 product lines resulting in 34% revenue increase",
          "Built and managed $2M marketing budget",
        ],
        key_achievements: [
          "Grew enterprise segment from 12% to 31% of revenue in 18 months",
          "$8M pipeline contribution through account-based marketing",
          "Delivered 34% YoY revenue increase through product launches",
        ],
        consistency_check: {
          claimed_vs_actual_experience:
            "All claims verified and exceed stated experience",
          title_appropriateness:
            "Director-level responsibilities at senior title - strong trajectory",
          career_progression:
            "Linear progression at top companies. Referral is strong signal.",
          education_verification: "MBA Wharton confirmed. GPA 3.8 noted.",
          salary_alignment:
            "$85k-$100k is slightly below market for this caliber.",
        },
        experience_depth: {
          level_assessment: "senior",
          relevance_percentage: 96,
          industry_match: "strong",
          leadership_evidence: "extensive",
          quantified_impact: "strong",
          technical_depth: "proficient",
        },
        cultural_fit: {
          work_environment_preference: "corporate",
          growth_trajectory: "fast_growth",
          risk_tolerance: "moderate",
          team_vs_individual: "team_oriented",
        },
      },
      screened_at: "2025-02-19T14:00:00Z",
      screening_version: "gemini-1.5-comprehensive",
    },
  },
  {
    id: 3,
    applicant_name: "Priya Sharma",
    applicant_email: "priya.sharma@email.com",
    current_job_title: "Financial Analyst",
    current_company: "Goldman Partners",
    experience_years: 3,
    education_level: "bachelors",
    status: "under_review",
    is_starred: false,
    is_flagged: false,
    overall_score: 74,
    resume_score: 78,
    skills_match_score: 70,
    rank: 3,
    interview_readiness: "needs_clarification",
    job_posting: { id: 1, job_title: "Senior React Native Developer" },
    screening_result: {
      recommendation:
        "Good foundation but experience below senior threshold. Worth a phone screen to assess growth potential.",
      next_steps:
        "Phone screen to assess technical depth and senior-level readiness.",
      ranking_justification:
        "Strong technical skills but 3yr experience vs 5yr minimum is a concern.",
      scores: {
        experience: {
          points: 15,
          max: 25,
          pct: 60,
          detail:
            "3 years RN experience. Solid but below 5-year minimum. Work is individual contributor level.",
          quality: "mid",
        },
        education: {
          points: 15,
          max: 20,
          pct: 75,
          detail: "BS Computer Engineering - field match is good.",
          match: "matches",
        },
        tech_skills: {
          points: 18,
          max: 25,
          pct: 72,
          detail:
            "React Native, Redux, TypeScript present. Missing GraphQL, advanced testing.",
          found: ["React Native", "TypeScript", "Redux", "REST APIs"],
          missing: ["GraphQL", "Jest", "Performance Profiling"],
        },
        soft_skills: {
          points: 6,
          max: 10,
          pct: 60,
          detail: "Some team collaboration evidence. No leadership examples.",
        },
        certifications: {
          points: 5,
          max: 10,
          pct: 50,
          detail:
            "No relevant certifications. AWS associate in progress noted.",
        },
        documents: {
          points: 4,
          max: 5,
          pct: 80,
          detail:
            "Good resume but some vague responsibilities. Could add more metrics.",
          resume_quality: "good",
          resume_completeness: 82,
        },
        work_auth: {
          points: 5,
          max: 5,
          pct: 100,
          detail: "Authorized to work. No issues.",
        },
      },
      ai_insights: {
        red_flags: [
          "3 years experience vs 5 year minimum requirement",
          "No leadership or team management evidence",
          "Missing advanced RN skills: GraphQL, performance profiling",
        ],
        strengths: [
          "Consistent React Native specialization for 3 years",
          "Delivered 2 production apps with 50k+ downloads",
          "Fast career progression at Goldman - promoted twice in 3 years",
        ],
        key_achievements: [
          "Built Goldman mobile app used by 50k daily active traders",
          "Reduced API response time by 30% through caching implementation",
          "Promoted from Junior to Mid to Senior in 3 years",
        ],
        consistency_check: {
          claimed_vs_actual_experience:
            "Claims are accurate but experience level is mid, not senior",
          title_appropriateness:
            "Senior title recently acquired - may be title inflation",
          career_progression:
            "Rapid progression but compressed timeline raises experience depth questions",
          education_verification: "BS CompEng from Georgia Tech confirmed",
          salary_alignment:
            "$58k-$70k is significantly below market for a Senior RN developer.",
        },
        experience_depth: {
          level_assessment: "mid",
          relevance_percentage: 78,
          industry_match: "moderate",
          leadership_evidence: "minimal",
          quantified_impact: "moderate",
          technical_depth: "proficient",
        },
        cultural_fit: {
          work_environment_preference: "corporate",
          growth_trajectory: "steady",
          risk_tolerance: "low",
          team_vs_individual: "balanced",
        },
      },
      screened_at: "2025-02-20T09:00:00Z",
      screening_version: "gemini-1.5-comprehensive",
    },
  },
  {
    id: 4,
    applicant_name: "Marcus Johnson",
    applicant_email: "marcus.j@email.com",
    current_job_title: "UX Designer",
    current_company: "DesignStudio Co.",
    experience_years: 4,
    education_level: "bachelors",
    status: "pending",
    is_starred: false,
    is_flagged: true,
    overall_score: null,
    resume_score: null,
    skills_match_score: null,
    rank: null,
    interview_readiness: null,
    job_posting: { id: 4, job_title: "UX/UI Designer" },
    screening_result: null,
  },
  {
    id: 5,
    applicant_name: "Emily Chen",
    applicant_email: "emily.chen@email.com",
    current_job_title: "HR Generalist",
    current_company: "MegaCorp LLC",
    experience_years: 6,
    education_level: "masters",
    status: "offer_extended",
    is_starred: true,
    is_flagged: false,
    overall_score: 95,
    resume_score: 97,
    skills_match_score: 93,
    rank: 1,
    interview_readiness: "ready",
    job_posting: { id: 5, job_title: "HR Business Partner" },
    screening_result: {
      recommendation:
        "Exceptional candidate. Top of talent pool. Recommend immediate offer.",
      next_steps: "Offer extended. Awaiting acceptance.",
      ranking_justification:
        "Highest-scoring HR candidate in this cycle. Exceeds all requirements.",
      scores: {
        experience: {
          points: 25,
          max: 25,
          pct: 100,
          detail:
            "6 years HRBP experience. Led org transformation affecting 1,200 employees.",
          quality: "senior",
        },
        education: {
          points: 19,
          max: 20,
          pct: 95,
          detail:
            "Master's in Industrial-Organizational Psychology - perfect field match.",
          match: "exceeds",
        },
        tech_skills: {
          points: 22,
          max: 25,
          pct: 88,
          detail:
            "Workday, BambooHR, ADP, advanced Excel. Strong HRIS expertise.",
          found: ["Workday", "BambooHR", "ADP", "Excel", "HRIS"],
          missing: ["Python for HR Analytics"],
        },
        soft_skills: {
          points: 10,
          max: 10,
          pct: 100,
          detail:
            "Executive coaching, conflict resolution, and change management all evidenced with specific outcomes.",
        },
        certifications: {
          points: 9,
          max: 10,
          pct: 90,
          detail: "SHRM-CP, PHR, and DISC facilitator certified. All current.",
          found: ["SHRM-CP", "PHR", "DISC"],
        },
        documents: {
          points: 5,
          max: 5,
          pct: 100,
          detail:
            "Exceptional resume. Every bullet quantified. Clear progression.",
          resume_quality: "excellent",
          resume_completeness: 99,
        },
        work_auth: { points: 5, max: 5, pct: 100, detail: "US Citizen." },
      },
      ai_insights: {
        red_flags: [],
        strengths: [
          "Reduced attrition by 22% through structured retention program",
          "Managed HR for 1,200-person org during M&A integration",
          "Employee satisfaction scores increased from 68% to 87% under her oversight",
        ],
        key_achievements: [
          "Led M&A HR integration affecting 1,200 employees across 3 locations",
          "Reduced time-to-hire from 45 to 28 days through process redesign",
          "22% attrition reduction saving estimated $3.2M in recruitment costs",
        ],
        consistency_check: {
          claimed_vs_actual_experience:
            "All claims verified and backed by specific metrics",
          title_appropriateness:
            "HRBP title well-earned based on scope described",
          career_progression: "Textbook senior HR career progression",
          education_verification:
            "MS I-O Psychology from University of Michigan confirmed",
          salary_alignment: "$82k-$98k is slightly below her market value.",
        },
        experience_depth: {
          level_assessment: "senior",
          relevance_percentage: 99,
          industry_match: "strong",
          leadership_evidence: "extensive",
          quantified_impact: "strong",
          technical_depth: "proficient",
        },
        cultural_fit: {
          work_environment_preference: "corporate",
          growth_trajectory: "steady",
          risk_tolerance: "low",
          team_vs_individual: "team_oriented",
        },
      },
      screened_at: "2025-02-15T11:00:00Z",
      screening_version: "gemini-1.5-comprehensive",
    },
  },
  {
    id: 6,
    applicant_name: "David Park",
    applicant_email: "david.park@email.com",
    current_job_title: "Customer Success Lead",
    current_company: "SaaS Solutions",
    experience_years: 2,
    education_level: "bachelors",
    status: "rejected",
    is_starred: false,
    is_flagged: false,
    overall_score: 32,
    resume_score: 45,
    skills_match_score: 28,
    rank: null,
    interview_readiness: "not_suitable",
    job_posting: { id: 6, job_title: "Customer Success Manager" },
    screening_result: {
      recommendation:
        "Does not meet minimum requirements. Experience and skills gaps too significant.",
      next_steps:
        "Send rejection email. Consider for junior role if available.",
      ranking_justification:
        "2 years below minimum, critical skills missing, vague resume with no metrics.",
      scores: {
        experience: {
          points: 7,
          max: 25,
          pct: 28,
          detail:
            "2 years total, only 6 months in CS. Far below 3-year minimum.",
          quality: "junior",
        },
        education: {
          points: 11,
          max: 20,
          pct: 55,
          detail: "BA Communications - tangential relevance at best.",
          match: "below",
        },
        tech_skills: {
          points: 5,
          max: 25,
          pct: 20,
          detail:
            "Only Zendesk mentioned. Missing Salesforce, HubSpot, Gainsight, analytics tools.",
          found: ["Zendesk"],
          missing: ["Salesforce", "HubSpot", "Gainsight", "SQL", "Analytics"],
        },
        soft_skills: {
          points: 3,
          max: 10,
          pct: 30,
          detail:
            "Very vague. 'Responsible for customer satisfaction' - no metrics or specifics.",
        },
        certifications: {
          points: 1,
          max: 10,
          pct: 10,
          detail: "No relevant certifications found.",
        },
        documents: {
          points: 3,
          max: 5,
          pct: 60,
          detail:
            "Resume present but all bullets are vague. No quantified achievements. Generic template.",
          resume_quality: "average",
          resume_completeness: 55,
        },
        work_auth: {
          points: 5,
          max: 5,
          pct: 100,
          detail: "No authorization issues.",
        },
      },
      ai_insights: {
        red_flags: [
          "Only 6 months actual CS experience despite 2-year claim",
          "No quantified achievements - all vague responsibility statements",
          "Missing 4 of 5 required technical tools",
          "Salary expectation $48k-$60k significantly below market (concerning signal)",
          "Resume appears to use a generic template with minimal customization",
        ],
        strengths: [
          "Work authorization is clean",
          "Shows enthusiasm in cover letter",
        ],
        key_achievements: [],
        consistency_check: {
          claimed_vs_actual_experience:
            "Claimed 2 years CS but only 6 months dedicated CS role - misleading",
          title_appropriateness:
            "'Lead' title appears inflated for described scope",
          career_progression: "Unclear trajectory. Multiple short roles.",
          education_verification: "BA confirmed but field relevance is weak",
          salary_alignment:
            "$48k-$60k is 20% below market - may indicate lack of market awareness.",
        },
        experience_depth: {
          level_assessment: "entry",
          relevance_percentage: 22,
          industry_match: "weak",
          leadership_evidence: "none",
          quantified_impact: "none",
          technical_depth: "beginner",
        },
        cultural_fit: {
          work_environment_preference: "unclear",
          growth_trajectory: "unclear",
          risk_tolerance: "low",
          team_vs_individual: "unclear",
        },
      },
      screened_at: "2025-02-18T16:00:00Z",
      screening_version: "gemini-1.5-comprehensive",
    },
  },
];

const MOCK_SUMMARY = {
  total_screened: 119,
  average_score: 68.4,
  median_score: 71,
  score_distribution: {
    excellent_85_100: 18,
    strong_70_84: 34,
    average_55_69: 29,
    weak_40_54: 22,
    poor_0_39: 16,
  },
  status_breakdown: {
    shortlisted: 18,
    under_review: 31,
    on_hold: 15,
    rejected: 55,
  },
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
  },
  under_review: {
    label: "Under Review",
    color: "#0891B2",
    bg: "#ECFEFF",
    text: "#164E63",
  },
  shortlisted: {
    label: "Shortlisted",
    color: "#7C3AED",
    bg: "#EDE9FE",
    text: "#4C1D95",
  },
  assessment: {
    label: "Assessment",
    color: "#2563EB",
    bg: "#EFF6FF",
    text: "#1E40AF",
  },
  interview_scheduled: {
    label: "Interview",
    color: "#0A66C2",
    bg: "#E0F2FE",
    text: "#0C4A6E",
  },
  offer_extended: {
    label: "Offer Sent",
    color: "#16A34A",
    bg: "#DCFCE7",
    text: "#166534",
  },
  offer_accepted: {
    label: "Accepted",
    color: "#15803D",
    bg: "#DCFCE7",
    text: "#14532D",
  },
  rejected: {
    label: "Rejected",
    color: "#DC2626",
    bg: "#FEF2F2",
    text: "#991B1B",
  },
  on_hold: {
    label: "On Hold",
    color: "#9333EA",
    bg: "#F5F3FF",
    text: "#581C87",
  },
};

const READINESS_META = {
  ready: {
    label: "Interview Ready",
    color: T.green,
    bg: T.greenSoft,
    icon: "checkmark-circle",
  },
  needs_clarification: {
    label: "Needs Review",
    color: T.orange,
    bg: T.orangeSoft,
    icon: "help-circle",
  },
  not_suitable: {
    label: "Not Suitable",
    color: T.red,
    bg: T.redSoft,
    icon: "close-circle",
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

const SCORE_CATEGORIES = [
  {
    key: "experience",
    label: "Experience",
    max: 25,
    icon: "briefcase-outline",
    color: T.blue,
  },
  {
    key: "education",
    label: "Education",
    max: 20,
    icon: "school-outline",
    color: T.purple,
  },
  {
    key: "tech_skills",
    label: "Technical",
    max: 25,
    icon: "code-slash-outline",
    color: T.teal,
  },
  {
    key: "soft_skills",
    label: "Soft Skills",
    max: 10,
    icon: "people-outline",
    color: T.orange,
  },
  {
    key: "certifications",
    label: "Certs",
    max: 10,
    icon: "ribbon-outline",
    color: "#DB2777",
  },
  {
    key: "documents",
    label: "Documents",
    max: 5,
    icon: "document-text-outline",
    color: T.green,
  },
  {
    key: "work_auth",
    label: "Work Auth",
    max: 5,
    icon: "shield-checkmark-outline",
    color: "#6366F1",
  },
];

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
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
];
const avatarColor = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const scoreColor = (s) => {
  if (s === null || s === undefined) return T.textMuted;
  if (s >= 85) return "#16A34A";
  if (s >= 70) return "#2563EB";
  if (s >= 55) return "#D97706";
  return "#DC2626";
};

const scoreBg = (s) => {
  if (s === null || s === undefined) return "#F1F5F9";
  if (s >= 85) return "#DCFCE7";
  if (s >= 70) return "#DBEAFE";
  if (s >= 55) return "#FEF3C7";
  return "#FEF2F2";
};

const scoreLabel = (s) => {
  if (s === null || s === undefined) return "Unscreened";
  if (s >= 85) return "Excellent";
  if (s >= 70) return "Strong";
  if (s >= 55) return "Average";
  if (s >= 40) return "Below Avg";
  return "Poor";
};

const timeAgo = (d) => {
  if (!d) return "";
  const diff = Math.floor((Date.now() - new Date(d)) / 1000);
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(d).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

// ─────────────────────────────────────────────────────────────
//  SCORE RING
// ─────────────────────────────────────────────────────────────
const ScoreRing = ({ score, size = 50, showLabel = false }) => {
  const color = scoreColor(score);
  const bg = scoreBg(score);
  return (
    <View style={{ alignItems: "center", gap: 3 }}>
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bg,
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2.5,
          borderColor: color + "50",
        }}
      >
        {score !== null && score !== undefined ? (
          <Text
            style={{ fontSize: size > 44 ? 14 : 11, fontWeight: "900", color }}
          >
            {score}
          </Text>
        ) : (
          <Ionicons
            name="hourglass-outline"
            size={size > 44 ? 16 : 13}
            color={T.textMuted}
          />
        )}
      </View>
      {showLabel && (
        <Text style={{ fontSize: 9, color, fontWeight: "700" }}>
          {scoreLabel(score)}
        </Text>
      )}
    </View>
  );
};

// ─────────────────────────────────────────────────────────────
//  SCORE BAR
// ─────────────────────────────────────────────────────────────
const ScoreBar = ({
  label,
  points,
  max,
  color,
  icon,
  detail,
  found,
  missing,
}) => {
  const pct = max > 0 ? (points / max) * 100 : 0;
  const [expanded, setExpanded] = useState(false);

  return (
    <TouchableOpacity
      onPress={() => detail && setExpanded((p) => !p)}
      activeOpacity={detail ? 0.7 : 1}
    >
      <View style={sb.row}>
        <View style={[sb.iconWrap, { backgroundColor: color + "18" }]}>
          <Ionicons name={icon} size={13} color={color} />
        </View>
        <View style={sb.barBlock}>
          <View style={sb.labelRow}>
            <Text style={sb.label}>{label}</Text>
            <Text style={[sb.pts, { color }]}>
              {points}/{max}
            </Text>
          </View>
          <View style={sb.barBg}>
            <View
              style={[sb.barFill, { width: `${pct}%`, backgroundColor: color }]}
            />
          </View>
        </View>
        {detail && (
          <Ionicons
            name={expanded ? "chevron-up" : "chevron-down"}
            size={13}
            color={T.textMuted}
            style={{ marginLeft: 4 }}
          />
        )}
      </View>
      {expanded && detail && (
        <View style={sb.detail}>
          <Text style={sb.detailTxt}>{detail}</Text>
          {found && found.length > 0 && (
            <View style={sb.tagRow}>
              {found.map((t) => (
                <View
                  key={t}
                  style={[sb.tag, { backgroundColor: T.greenSoft }]}
                >
                  <Ionicons name="checkmark" size={9} color={T.green} />
                  <Text style={[sb.tagTxt, { color: T.green }]}>{t}</Text>
                </View>
              ))}
            </View>
          )}
          {missing && missing.length > 0 && (
            <View style={sb.tagRow}>
              {missing.map((t) => (
                <View key={t} style={[sb.tag, { backgroundColor: T.redSoft }]}>
                  <Ionicons name="close" size={9} color={T.red} />
                  <Text style={[sb.tagTxt, { color: T.red }]}>{t}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const sb = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  barBlock: { flex: 1 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
  },
  label: { fontSize: 11, fontWeight: "600", color: T.textSub },
  pts: { fontSize: 11, fontWeight: "800" },
  barBg: {
    height: 5,
    backgroundColor: "#F1F5F9",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: { height: "100%", borderRadius: 3 },
  detail: {
    marginLeft: 36,
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#E2E8F0",
  },
  detailTxt: {
    fontSize: 11,
    color: T.textSub,
    lineHeight: 16,
    marginBottom: 6,
  },
  tagRow: { flexDirection: "row", flexWrap: "wrap", gap: 4, marginBottom: 4 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  tagTxt: { fontSize: 10, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────
//  STATS WIDGET
// ─────────────────────────────────────────────────────────────
const StatsWidget = ({ summary, totalApps }) => {
  const shortlistRate =
    summary.total_screened > 0
      ? Math.round(
          (summary.status_breakdown.shortlisted / summary.total_screened) * 100,
        )
      : 0;
  const screenedRate =
    totalApps > 0 ? Math.round((summary.total_screened / totalApps) * 100) : 0;

  const distItems = [
    {
      label: "Excellent",
      key: "excellent_85_100",
      color: "#16A34A",
      range: "85–100",
    },
    { label: "Strong", key: "strong_70_84", color: T.blue, range: "70–84" },
    { label: "Average", key: "average_55_69", color: T.orange, range: "55–69" },
    { label: "Weak", key: "weak_40_54", color: "#EA580C", range: "40–54" },
    { label: "Poor", key: "poor_0_39", color: T.red, range: "0–39" },
  ];

  return (
    <View style={sw.wrapper}>
      {/* Dark hero */}
      <View style={sw.hero}>
        <View style={sw.blob1} />
        <View style={sw.blob2} />
        <View style={sw.heroRow}>
          <View style={sw.heroLeft}>
            <Text style={sw.eyebrow}>AI SCREENING</Text>
            <View style={sw.heroNumRow}>
              <Text style={sw.heroNum}>{summary.total_screened}</Text>
              <View style={sw.aiChip}>
                <Ionicons name="sparkles" size={10} color="#A78BFA" />
                <Text style={sw.aiChipTxt}>Gemini AI</Text>
              </View>
            </View>
            <Text style={sw.heroSub}>
              avg score {summary.average_score}/100 · median{" "}
              {summary.median_score}
            </Text>
            <View style={sw.heroBadges}>
              <View style={sw.heroBadge}>
                <Ionicons name="checkmark-circle" size={10} color="#4ADE80" />
                <Text style={sw.heroBadgeTxt}>
                  {shortlistRate}% shortlisted
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
                  {screenedRate}% screened
                </Text>
              </View>
            </View>
          </View>
          <View style={sw.heroRight}>
            <View style={sw.bigRing}>
              <Text style={sw.bigRingNum}>{summary.average_score}</Text>
              <Text style={sw.bigRingLabel}>avg</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Score distribution */}
      <View style={sw.distCard}>
        <Text style={sw.distTitle}>Score Distribution</Text>
        <View style={sw.distBars}>
          {distItems.map((item) => {
            const count = summary.score_distribution[item.key] || 0;
            const pct =
              summary.total_screened > 0
                ? (count / summary.total_screened) * 100
                : 0;
            return (
              <View key={item.key} style={sw.distItem}>
                <Text style={[sw.distCount, { color: item.color }]}>
                  {count}
                </Text>
                <View style={sw.distBarBg}>
                  <View
                    style={[
                      sw.distBarFill,
                      {
                        height: `${Math.max(pct, 4)}%`,
                        backgroundColor: item.color,
                      },
                    ]}
                  />
                </View>
                <Text style={sw.distLabel}>{item.range}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const sw = StyleSheet.create({
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
    backgroundColor: "#4338CA",
    opacity: 0.1,
    top: -70,
    right: -50,
  },
  blob2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#0891B2",
    opacity: 0.1,
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
  heroNumRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  heroNum: {
    fontSize: 46,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 50,
  },
  aiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(167,139,250,0.15)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  aiChipTxt: { fontSize: 10, color: "#A78BFA", fontWeight: "700" },
  heroSub: { fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: "500" },
  heroBadges: { flexDirection: "row", gap: 8 },
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
  heroRight: { alignItems: "center", paddingLeft: 16 },
  bigRing: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 3,
    borderColor: "#60A5FA",
    backgroundColor: "rgba(96,165,250,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  bigRingNum: { fontSize: 20, fontWeight: "900", color: "#fff" },
  bigRingLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
  },

  distCard: {
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
  distTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: T.text,
    marginBottom: 12,
  },
  distBars: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-end",
    height: 80,
  },
  distItem: { alignItems: "center", gap: 4, flex: 1 },
  distCount: { fontSize: 12, fontWeight: "800" },
  distBarBg: {
    width: "55%",
    height: 52,
    backgroundColor: "#F8FAFC",
    borderRadius: 4,
    justifyContent: "flex-end",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  distBarFill: { width: "100%", borderRadius: 3 },
  distLabel: {
    fontSize: 8,
    color: T.textMuted,
    fontWeight: "600",
    textAlign: "center",
  },
});

// ─────────────────────────────────────────────────────────────
//  CANDIDATE CARD
// ─────────────────────────────────────────────────────────────
const CandidateCard = ({ app, onPress, onScreen, isScreening }) => {
  const sm = STATUS_META[app.status] || STATUS_META.pending;
  const hasResult = app.screening_result !== null && app.overall_score !== null;
  const readiness = hasResult ? READINESS_META[app.interview_readiness] : null;
  const color = avatarColor(app.applicant_name);

  return (
    <TouchableOpacity
      style={cc.card}
      onPress={() => onPress(app)}
      activeOpacity={0.85}
    >
      {/* Top row */}
      <View style={cc.topRow}>
        <View style={[cc.avatar, { backgroundColor: color }]}>
          <Text style={cc.avatarTxt}>{getInitials(app.applicant_name)}</Text>
          {app.rank && (
            <View style={cc.rankBadge}>
              <Text style={cc.rankTxt}>#{app.rank}</Text>
            </View>
          )}
        </View>

        <View style={cc.info}>
          <View style={cc.nameRow}>
            <Text style={cc.name} numberOfLines={1}>
              {app.applicant_name}
            </Text>
            {app.is_starred && (
              <Ionicons
                name="star"
                size={12}
                color="#F59E0B"
                style={{ marginLeft: 4 }}
              />
            )}
            {app.is_flagged && (
              <Ionicons
                name="flag"
                size={12}
                color={T.red}
                style={{ marginLeft: 2 }}
              />
            )}
          </View>
          <Text style={cc.role} numberOfLines={1}>
            {app.current_job_title}
            {app.current_company ? ` · ${app.current_company}` : ""}
          </Text>
          <Text style={cc.jobLine} numberOfLines={1}>
            {app.job_posting.job_title}
          </Text>
        </View>

        <ScoreRing score={app.overall_score} size={48} showLabel />
      </View>

      {hasResult ? (
        <>
          {/* Mini score bars for top 3 categories */}
          <View style={cc.miniBars}>
            {SCORE_CATEGORIES.slice(0, 3).map((cat) => {
              const s = app.screening_result.scores[cat.key];
              if (!s) return null;
              const pct = (s.points / cat.max) * 100;
              return (
                <View key={cat.key} style={cc.miniBar}>
                  <Text style={cc.miniBarLabel}>{cat.label}</Text>
                  <View style={cc.miniBarBg}>
                    <View
                      style={[
                        cc.miniBarFill,
                        { width: `${pct}%`, backgroundColor: cat.color },
                      ]}
                    />
                  </View>
                  <Text style={[cc.miniBarPts, { color: cat.color }]}>
                    {s.points}/{cat.max}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* Recommendation snippet */}
          <View style={cc.recBox}>
            <Ionicons name="sparkles" size={12} color="#7C3AED" />
            <Text style={cc.recTxt} numberOfLines={2}>
              {app.screening_result.recommendation}
            </Text>
          </View>

          {/* Red flags */}
          {app.screening_result.ai_insights.red_flags.length > 0 && (
            <View style={cc.flagRow}>
              <Ionicons name="warning-outline" size={11} color={T.orange} />
              <Text style={cc.flagTxt} numberOfLines={1}>
                {app.screening_result.ai_insights.red_flags[0]}
              </Text>
            </View>
          )}
        </>
      ) : (
        <View style={cc.unscreened}>
          <Ionicons name="hourglass-outline" size={14} color={T.textMuted} />
          <Text style={cc.unscreenedTxt}>Not yet screened by AI</Text>
        </View>
      )}

      {/* Footer */}
      <View style={cc.footer}>
        <View style={cc.footerLeft}>
          <View style={[cc.statusChip, { backgroundColor: sm.bg }]}>
            <View style={[cc.statusDot, { backgroundColor: sm.color }]} />
            <Text style={[cc.statusTxt, { color: sm.text }]}>{sm.label}</Text>
          </View>
          {readiness && (
            <View style={[cc.readinessChip, { backgroundColor: readiness.bg }]}>
              <Ionicons
                name={readiness.icon}
                size={10}
                color={readiness.color}
              />
              <Text style={[cc.readinessTxt, { color: readiness.color }]}>
                {readiness.label}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[cc.screenBtn, hasResult && cc.screenBtnRescreeen]}
          onPress={() => onScreen(app)}
          disabled={isScreening}
        >
          {isScreening ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <>
              <Ionicons name="sparkles" size={12} color="#fff" />
              <Text style={cc.screenBtnTxt}>
                {hasResult ? "Re-screen" : "Screen"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const cc = StyleSheet.create({
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
  rankBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: "#0F172A",
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  rankTxt: { fontSize: 8, fontWeight: "800", color: "#fff" },
  info: { flex: 1 },
  nameRow: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 15, fontWeight: "700", color: T.text, flex: 1 },
  role: { fontSize: 12, color: T.textSub, marginTop: 2 },
  jobLine: { fontSize: 11, color: T.textMuted, marginTop: 1 },

  miniBars: { gap: 4, marginBottom: 8 },
  miniBar: { flexDirection: "row", alignItems: "center", gap: 7 },
  miniBarLabel: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "600",
    width: 56,
  },
  miniBarBg: {
    flex: 1,
    height: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 2,
    overflow: "hidden",
  },
  miniBarFill: { height: "100%", borderRadius: 2 },
  miniBarPts: {
    fontSize: 10,
    fontWeight: "700",
    width: 28,
    textAlign: "right",
  },

  recBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    backgroundColor: "#F5F3FF",
    borderRadius: 8,
    padding: 8,
    marginBottom: 6,
  },
  recTxt: {
    flex: 1,
    fontSize: 11,
    color: "#4C1D95",
    lineHeight: 16,
    fontWeight: "500",
  },

  flagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  flagTxt: { flex: 1, fontSize: 11, color: T.orange, fontWeight: "500" },

  unscreened: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: T.border,
    borderStyle: "dashed",
  },
  unscreenedTxt: { fontSize: 12, color: T.textMuted, fontWeight: "500" },

  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  statusChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusTxt: { fontSize: 10, fontWeight: "700" },
  readinessChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 20,
  },
  readinessTxt: { fontSize: 10, fontWeight: "600" },
  screenBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
    backgroundColor: "#7C3AED",
  },
  screenBtnRescreeen: { backgroundColor: "#475569" },
  screenBtnTxt: { fontSize: 11, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  DETAIL MODAL — full AI screening report
// ─────────────────────────────────────────────────────────────
const DetailModal = ({ app, onClose, onStatusChange }) => {
  if (!app) return null;
  const result = app.screening_result;
  const sm = STATUS_META[app.status] || STATUS_META.pending;
  const color = avatarColor(app.applicant_name);

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={dm.overlay}>
        <View style={dm.sheet}>
          <View style={dm.handle} />

          {/* Header */}
          <View style={dm.header}>
            <TouchableOpacity onPress={onClose} style={dm.closeBtn}>
              <Ionicons name="arrow-back" size={18} color="#64748B" />
            </TouchableOpacity>
            <Text style={dm.headerTitle}>Screening Report</Text>
            {result && (
              <View style={dm.geminiChip}>
                <Ionicons name="sparkles" size={11} color="#A78BFA" />
                <Text style={dm.geminiChipTxt}>Gemini AI</Text>
              </View>
            )}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Candidate hero */}
            <View style={[dm.hero, { backgroundColor: color + "15" }]}>
              <View style={[dm.heroAvatar, { backgroundColor: color }]}>
                <Text style={dm.heroAvatarTxt}>
                  {getInitials(app.applicant_name)}
                </Text>
              </View>
              <Text style={dm.heroName}>{app.applicant_name}</Text>
              <Text style={dm.heroRole}>
                {app.current_job_title}
                {app.current_company ? ` · ${app.current_company}` : ""}
              </Text>
              <Text style={dm.heroJob}>{app.job_posting.job_title}</Text>
              <View style={[dm.statusBadge, { backgroundColor: sm.bg }]}>
                <View style={[dm.statusDot, { backgroundColor: sm.color }]} />
                <Text style={[dm.statusBadgeTxt, { color: sm.text }]}>
                  {sm.label}
                </Text>
              </View>
            </View>

            {result ? (
              <>
                {/* Overall score + readiness */}
                <View style={dm.scoreHero}>
                  <View style={dm.scoreHeroLeft}>
                    <ScoreRing score={app.overall_score} size={72} showLabel />
                  </View>
                  <View style={dm.scoreHeroRight}>
                    {app.rank && (
                      <View style={dm.rankRow}>
                        <Ionicons name="trophy" size={13} color="#D97706" />
                        <Text style={dm.rankTxt}>
                          Ranked #{app.rank} for this job
                        </Text>
                      </View>
                    )}
                    {(() => {
                      const rm = READINESS_META[app.interview_readiness];
                      if (!rm) return null;
                      return (
                        <View
                          style={[
                            dm.readinessBadge,
                            { backgroundColor: rm.bg },
                          ]}
                        >
                          <Ionicons name={rm.icon} size={13} color={rm.color} />
                          <Text style={[dm.readinessTxt, { color: rm.color }]}>
                            {rm.label}
                          </Text>
                        </View>
                      );
                    })()}
                    <Text style={dm.screenedAt}>
                      Screened {timeAgo(result.screened_at)}
                    </Text>
                  </View>
                </View>

                {/* AI Recommendation */}
                <View style={dm.recCard}>
                  <View style={dm.recHeader}>
                    <Ionicons name="sparkles" size={14} color="#7C3AED" />
                    <Text style={dm.recTitle}>AI Recommendation</Text>
                  </View>
                  <Text style={dm.recText}>{result.recommendation}</Text>
                  <View style={dm.nextStepsBox}>
                    <Ionicons
                      name="arrow-forward-circle"
                      size={14}
                      color={T.blue}
                    />
                    <Text style={dm.nextStepsTxt}>{result.next_steps}</Text>
                  </View>
                </View>

                {/* Score Breakdown */}
                <View style={dm.section}>
                  <Text style={dm.sectionTitle}>Score Breakdown</Text>
                  {SCORE_CATEGORIES.map((cat) => {
                    const s = result.scores[cat.key];
                    if (!s) return null;
                    return (
                      <ScoreBar
                        key={cat.key}
                        label={cat.label}
                        points={s.points}
                        max={cat.max}
                        color={cat.color}
                        icon={cat.icon}
                        detail={s.detail}
                        found={s.found}
                        missing={s.missing}
                      />
                    );
                  })}
                </View>

                {/* Key Achievements */}
                {result.ai_insights.key_achievements.length > 0 && (
                  <View style={dm.section}>
                    <Text style={dm.sectionTitle}>Key Achievements</Text>
                    {result.ai_insights.key_achievements.map((a, i) => (
                      <View key={i} style={dm.achieveRow}>
                        <View style={dm.achieveBullet} />
                        <Text style={dm.achieveTxt}>{a}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Strengths */}
                {result.ai_insights.strengths.length > 0 && (
                  <View style={dm.section}>
                    <Text style={dm.sectionTitle}>Strengths</Text>
                    {result.ai_insights.strengths.map((s, i) => (
                      <View key={i} style={dm.strengthRow}>
                        <View
                          style={[
                            dm.strengthIcon,
                            { backgroundColor: T.greenSoft },
                          ]}
                        >
                          <Ionicons
                            name="checkmark"
                            size={11}
                            color={T.green}
                          />
                        </View>
                        <Text style={dm.strengthTxt}>{s}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Red Flags */}
                {result.ai_insights.red_flags.length > 0 && (
                  <View style={dm.section}>
                    <Text style={dm.sectionTitle}>Red Flags / Concerns</Text>
                    {result.ai_insights.red_flags.map((f, i) => (
                      <View key={i} style={dm.flagRow}>
                        <View
                          style={[
                            dm.strengthIcon,
                            { backgroundColor: T.redSoft },
                          ]}
                        >
                          <Ionicons name="warning" size={11} color={T.red} />
                        </View>
                        <Text style={dm.flagTxt}>{f}</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Consistency Check */}
                {result.ai_insights.consistency_check && (
                  <View style={dm.section}>
                    <Text style={dm.sectionTitle}>Consistency Check</Text>
                    <View style={dm.consistencyCard}>
                      {Object.entries(result.ai_insights.consistency_check).map(
                        ([key, val]) => (
                          <View key={key} style={dm.consistRow}>
                            <Text style={dm.consistKey}>
                              {key
                                .replace(/_/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </Text>
                            <Text style={dm.consistVal}>{val}</Text>
                          </View>
                        ),
                      )}
                    </View>
                  </View>
                )}

                {/* Experience Depth */}
                {result.ai_insights.experience_depth &&
                  Object.keys(result.ai_insights.experience_depth).length >
                    0 && (
                    <View style={dm.section}>
                      <Text style={dm.sectionTitle}>Experience Analysis</Text>
                      <View style={dm.depthGrid}>
                        {Object.entries(
                          result.ai_insights.experience_depth,
                        ).map(([key, val]) => (
                          <View key={key} style={dm.depthItem}>
                            <Text style={dm.depthKey}>
                              {key.replace(/_/g, " ")}
                            </Text>
                            <Text style={dm.depthVal}>{String(val)}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                {/* Cultural Fit */}
                {result.ai_insights.cultural_fit &&
                  Object.keys(result.ai_insights.cultural_fit).length > 0 && (
                    <View style={dm.section}>
                      <Text style={dm.sectionTitle}>
                        Cultural Fit Indicators
                      </Text>
                      <View style={dm.culturalRow}>
                        {Object.entries(result.ai_insights.cultural_fit).map(
                          ([key, val]) => (
                            <View key={key} style={dm.culturalItem}>
                              <Text style={dm.culturalKey}>
                                {key.replace(/_/g, " ")}
                              </Text>
                              <Text style={dm.culturalVal}>
                                {String(val).replace(/_/g, " ")}
                              </Text>
                            </View>
                          ),
                        )}
                      </View>
                    </View>
                  )}

                {/* Update Status */}
                <View style={dm.section}>
                  <Text style={dm.sectionTitle}>Update Status</Text>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 7 }}
                  >
                    {Object.entries(STATUS_META).map(([key, meta]) => (
                      <TouchableOpacity
                        key={key}
                        style={[
                          dm.statusBtn,
                          app.status === key && {
                            backgroundColor: meta.bg,
                            borderColor: meta.color,
                          },
                        ]}
                        onPress={() => {
                          onStatusChange(app.id, key);
                          onClose();
                        }}
                      >
                        <Text
                          style={[
                            dm.statusBtnTxt,
                            app.status === key && { color: meta.text },
                          ]}
                        >
                          {meta.label}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </>
            ) : (
              <View style={dm.noResult}>
                <Ionicons name="sparkles-outline" size={48} color="#CBD5E1" />
                <Text style={dm.noResultTxt}>Not yet screened</Text>
                <Text style={dm.noResultSub}>
                  Tap "Screen" to run Gemini AI analysis on this application
                </Text>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={dm.footer}>
            <TouchableOpacity style={dm.footerBtnGray}>
              <Ionicons name="mail-outline" size={16} color="#fff" />
              <Text style={dm.footerBtnTxt}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[dm.footerBtnGray, { backgroundColor: T.blue }]}
            >
              <Ionicons name="calendar-outline" size={16} color="#fff" />
              <Text style={dm.footerBtnTxt}>Schedule</Text>
            </TouchableOpacity>
            {result && (
              <TouchableOpacity
                style={[dm.footerBtnGray, { backgroundColor: T.green }]}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={16}
                  color="#fff"
                />
                <Text style={dm.footerBtnTxt}>Shortlist</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const dm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "95%",
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
  geminiChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#EDE9FE",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  geminiChipTxt: { fontSize: 11, color: "#7C3AED", fontWeight: "700" },

  hero: {
    margin: 16,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    gap: 4,
  },
  heroAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroAvatarTxt: { fontSize: 18, fontWeight: "800", color: "#fff" },
  heroName: {
    fontSize: 18,
    fontWeight: "800",
    color: T.text,
    textAlign: "center",
  },
  heroRole: { fontSize: 12, color: T.textSub, textAlign: "center" },
  heroJob: { fontSize: 11, color: T.textMuted },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginTop: 4,
  },
  statusDot: { width: 5, height: 5, borderRadius: 3 },
  statusBadgeTxt: { fontSize: 11, fontWeight: "700" },

  scoreHero: {
    flexDirection: "row",
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    gap: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  scoreHeroLeft: { alignItems: "center", justifyContent: "center" },
  scoreHeroRight: { flex: 1, gap: 8, justifyContent: "center" },
  rankRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  rankTxt: { fontSize: 13, fontWeight: "700", color: T.text },
  readinessBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  readinessTxt: { fontSize: 12, fontWeight: "700" },
  screenedAt: { fontSize: 11, color: T.textMuted },

  recCard: {
    marginHorizontal: 16,
    marginBottom: 14,
    backgroundColor: "#F5F3FF",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#DDD6FE",
  },
  recHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  recTitle: { fontSize: 13, fontWeight: "700", color: "#7C3AED" },
  recText: { fontSize: 12, color: "#4C1D95", lineHeight: 18, marginBottom: 10 },
  nextStepsBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 7,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    padding: 9,
  },
  nextStepsTxt: {
    flex: 1,
    fontSize: 11,
    color: T.blue,
    fontWeight: "600",
    lineHeight: 16,
  },

  section: { paddingHorizontal: 20, marginBottom: 18 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 12,
  },

  achieveRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  achieveBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: T.blue,
    marginTop: 5,
  },
  achieveTxt: {
    flex: 1,
    fontSize: 12,
    color: T.text,
    fontWeight: "500",
    lineHeight: 18,
  },

  strengthRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 7,
  },
  strengthIcon: {
    width: 22,
    height: 22,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  strengthTxt: { flex: 1, fontSize: 12, color: T.textSub, lineHeight: 17 },

  flagRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 7,
  },
  flagTxt: { flex: 1, fontSize: 12, color: "#92400E", lineHeight: 17 },

  consistencyCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  consistRow: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  consistKey: {
    fontSize: 10,
    fontWeight: "700",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  consistVal: { fontSize: 12, color: T.text, lineHeight: 17 },

  depthGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  depthItem: {
    minWidth: "47%",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  depthKey: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "600",
    textTransform: "capitalize",
    marginBottom: 3,
  },
  depthVal: {
    fontSize: 12,
    color: T.text,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  culturalRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  culturalItem: {
    flex: 1,
    minWidth: "45%",
    backgroundColor: "#EFF6FF",
    borderRadius: 10,
    padding: 10,
  },
  culturalKey: {
    fontSize: 10,
    color: "#1E40AF",
    fontWeight: "600",
    textTransform: "capitalize",
    marginBottom: 2,
  },
  culturalVal: {
    fontSize: 12,
    color: T.blue,
    fontWeight: "700",
    textTransform: "capitalize",
  },

  statusBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
  },
  statusBtnTxt: { fontSize: 11, fontWeight: "700", color: T.textSub },

  noResult: { padding: 48, alignItems: "center", gap: 10 },
  noResultTxt: { fontSize: 16, color: "#94A3B8", fontWeight: "700" },
  noResultSub: {
    fontSize: 13,
    color: "#CBD5E1",
    textAlign: "center",
    lineHeight: 18,
  },

  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerBtnGray: {
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
//  BULK SCREEN MODAL
// ─────────────────────────────────────────────────────────────
const BulkScreenModal = ({ visible, onClose, onStart, jobs }) => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyRec, setApplyRec] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending");

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={bm.overlay}>
        <View style={bm.sheet}>
          <View style={bm.handle} />
          <Text style={bm.title}>Bulk AI Screening</Text>
          <Text style={bm.sub}>
            Screen multiple candidates at once using Gemini AI
          </Text>

          <Text style={bm.label}>Select Job Posting</Text>
          {jobs.map((job) => (
            <TouchableOpacity
              key={job.id}
              style={[
                bm.jobOption,
                selectedJob?.id === job.id && bm.jobOptionActive,
              ]}
              onPress={() => setSelectedJob(job)}
            >
              <View style={bm.jobOptionLeft}>
                <Text
                  style={[
                    bm.jobTitle,
                    selectedJob?.id === job.id && { color: T.blue },
                  ]}
                >
                  {job.job_title}
                </Text>
                <Text style={bm.jobDept}>
                  {job.department} · {job.applications_count} applications
                </Text>
              </View>
              {selectedJob?.id === job.id && (
                <Ionicons name="checkmark-circle" size={20} color={T.blue} />
              )}
            </TouchableOpacity>
          ))}

          <Text style={bm.label}>Screen Applications With Status</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={bm.statusRow}
          >
            {["pending", "under_review", "shortlisted"].map((s) => {
              const meta = STATUS_META[s];
              return (
                <TouchableOpacity
                  key={s}
                  style={[
                    bm.statusChip,
                    statusFilter === s && {
                      backgroundColor: meta.bg,
                      borderColor: meta.color,
                    },
                  ]}
                  onPress={() => setStatusFilter(s)}
                >
                  <Text
                    style={[
                      bm.statusChipTxt,
                      statusFilter === s && { color: meta.text },
                    ]}
                  >
                    {meta.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity
            style={bm.toggleRow}
            onPress={() => setApplyRec((p) => !p)}
          >
            <View style={[bm.toggle, applyRec && bm.toggleOn]}>
              <View style={[bm.toggleDot, applyRec && bm.toggleDotOn]} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={bm.toggleLabel}>Auto-apply AI recommendation</Text>
              <Text style={bm.toggleSub}>
                Automatically update candidate status based on score
              </Text>
            </View>
          </TouchableOpacity>

          <View style={bm.infoBox}>
            <Ionicons name="information-circle" size={14} color={T.blue} />
            <Text style={bm.infoTxt}>
              Screening up to 100 applications. This may take a few minutes.
            </Text>
          </View>

          <View style={bm.btnRow}>
            <TouchableOpacity style={bm.cancelBtn} onPress={onClose}>
              <Text style={bm.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[bm.startBtn, !selectedJob && bm.startBtnDisabled]}
              disabled={!selectedJob}
              onPress={() => {
                onStart({ job: selectedJob, applyRec, statusFilter });
                onClose();
              }}
            >
              <Ionicons name="sparkles" size={14} color="#fff" />
              <Text style={bm.startTxt}>Start Bulk Screen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const bm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 36,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginBottom: 16,
  },
  title: { fontSize: 18, fontWeight: "800", color: T.text, marginBottom: 4 },
  sub: { fontSize: 12, color: T.textMuted, marginBottom: 18 },
  label: { fontSize: 12, fontWeight: "700", color: T.text, marginBottom: 8 },
  jobOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 7,
    backgroundColor: "#F8FAFC",
  },
  jobOptionActive: { borderColor: T.blue, backgroundColor: T.blueSoft },
  jobOptionLeft: { flex: 1 },
  jobTitle: { fontSize: 13, fontWeight: "700", color: T.text },
  jobDept: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  statusRow: { gap: 8, marginBottom: 16 },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
  },
  statusChipTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
  },
  toggle: {
    width: 40,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    padding: 2,
  },
  toggleOn: { backgroundColor: T.blue },
  toggleDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#fff",
  },
  toggleDotOn: { transform: [{ translateX: 18 }] },
  toggleLabel: { fontSize: 13, fontWeight: "700", color: T.text },
  toggleSub: { fontSize: 11, color: T.textMuted, marginTop: 1 },
  infoBox: {
    flexDirection: "row",
    gap: 7,
    backgroundColor: T.blueSoft,
    borderRadius: 10,
    padding: 10,
    marginBottom: 18,
  },
  infoTxt: { flex: 1, fontSize: 11, color: T.blue, lineHeight: 16 },
  btnRow: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 0.4,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  cancelTxt: { fontSize: 14, fontWeight: "700", color: T.textSub },
  startBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#7C3AED",
  },
  startBtnDisabled: { opacity: 0.4 },
  startTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function ScreeningScreen() {
  const [apps, setApps] = useState(MOCK_SCREENED);
  const [selectedApp, setSelectedApp] = useState(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [screeningId, setScreeningId] = useState(null);
  const [showBulk, setShowBulk] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const FILTER_TABS = [
    "All",
    "Unscreened",
    "Excellent",
    "Strong",
    "Average",
    "Rejected",
  ];

  const filtered = useMemo(() => {
    let list = [...apps];

    if (activeFilter === "Unscreened")
      list = list.filter((a) => a.overall_score === null);
    else if (activeFilter === "Excellent")
      list = list.filter((a) => a.overall_score >= 85);
    else if (activeFilter === "Strong")
      list = list.filter((a) => a.overall_score >= 70 && a.overall_score < 85);
    else if (activeFilter === "Average")
      list = list.filter((a) => a.overall_score >= 55 && a.overall_score < 70);
    else if (activeFilter === "Rejected")
      list = list.filter((a) => a.status === "rejected");

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.applicant_name.toLowerCase().includes(q) ||
          a.applicant_email.toLowerCase().includes(q) ||
          (a.current_job_title || "").toLowerCase().includes(q) ||
          a.job_posting.job_title.toLowerCase().includes(q),
      );
    }

    return list.sort((a, b) => {
      if (a.overall_score === null) return 1;
      if (b.overall_score === null) return -1;
      return b.overall_score - a.overall_score;
    });
  }, [apps, activeFilter, search]);

  const handleScreen = useCallback(async (app) => {
    setScreeningId(app.id);
    // Simulate AI call
    await new Promise((r) => setTimeout(r, 2000));
    setApps((prev) =>
      prev.map((a) =>
        a.id === app.id
          ? {
              ...a,
              overall_score: Math.floor(Math.random() * 40) + 60,
              status: "under_review",
            }
          : a,
      ),
    );
    setScreeningId(null);
    Alert.alert(
      "Screening Complete",
      `AI analysis for ${app.applicant_name} is ready.`,
    );
  }, []);

  const handleStatusChange = useCallback((id, status) => {
    setApps((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  }, []);

  const handleBulkStart = (config) => {
    Alert.alert(
      "Bulk Screening Started",
      `Screening all ${config.statusFilter} applications for "${config.job.job_title}". Results will be available shortly.`,
    );
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  const unscreenedCount = apps.filter((a) => a.overall_score === null).length;

  const ListHeader = () => (
    <>
      {/* Title row */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>AI Screening</Text>
          <Text style={s.pageSub}>
            {apps.length} candidates · {unscreenedCount} unscreened
          </Text>
        </View>
        <TouchableOpacity style={s.bulkBtn} onPress={() => setShowBulk(true)}>
          <Ionicons name="sparkles" size={14} color="#fff" />
          <Text style={s.bulkBtnTxt}>Bulk Screen</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <StatsWidget summary={MOCK_SUMMARY} totalApps={154} />

      {/* Search */}
      <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
        <Ionicons
          name="search-outline"
          size={16}
          color={searchFocused ? T.blue : "#94A3B8"}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search candidates…"
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

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabs}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeFilter === tab && s.tabActive]}
            onPress={() => setActiveFilter(tab)}
          >
            <Text style={[s.tabTxt, activeFilter === tab && s.tabTxtActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {unscreenedCount > 0 && (
        <View style={s.pendingBanner}>
          <Ionicons name="hourglass-outline" size={14} color="#D97706" />
          <Text style={s.pendingTxt}>
            {unscreenedCount} candidates waiting for AI screening
          </Text>
          <TouchableOpacity
            onPress={() => setShowBulk(true)}
            style={s.pendingBtn}
          >
            <Text style={s.pendingBtnTxt}>Screen All</Text>
          </TouchableOpacity>
        </View>
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
          <CandidateCard
            app={item}
            onPress={setSelectedApp}
            onScreen={handleScreen}
            isScreening={screeningId === item.id}
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
            <Ionicons name="sparkles-outline" size={54} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No candidates match this filter</Text>
          </View>
        }
      />

      <DetailModal
        app={selectedApp}
        onClose={() => setSelectedApp(null)}
        onStatusChange={handleStatusChange}
      />

      <BulkScreenModal
        visible={showBulk}
        onClose={() => setShowBulk(false)}
        onStart={handleBulkStart}
        jobs={MOCK_JOB_POSTINGS}
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
  bulkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#7C3AED",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  bulkBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },

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

  tabs: {
    paddingHorizontal: 14,
    gap: 7,
    marginBottom: 10,
    alignItems: "center",
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
  },
  tabActive: { backgroundColor: "#7C3AED", borderColor: "#7C3AED" },
  tabTxt: { fontSize: 12, fontWeight: "600", color: "#64748B" },
  tabTxtActive: { color: "#fff" },

  pendingBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: T.orangeSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  pendingTxt: { flex: 1, fontSize: 12, color: "#92400E", fontWeight: "600" },
  pendingBtn: {
    backgroundColor: T.orange,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  pendingBtnTxt: { fontSize: 11, fontWeight: "700", color: "#fff" },

  empty: { padding: 48, alignItems: "center", gap: 8 },
  emptyTxt: { fontSize: 15, color: "#94A3B8", fontWeight: "700" },
});
