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
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────
const MOCK_INTERVIEWS = [
  {
    id: 1,
    candidate_name: "James Rodriguez",
    candidate_email: "james.rodriguez@email.com",
    candidate_phone: "+1 (555) 345-6789",
    candidate_score: 92,
    job_title: "Product Marketing Manager",
    department: "Marketing",
    interview_type: "panel",
    format: "video",
    stage: 2,
    total_stages: 3,
    status: "scheduled",
    scheduled_date: new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    duration_minutes: 60,
    location: "Google Meet",
    meeting_link: "https://meet.google.com/abc-defg-hij",
    interviewers: [
      {
        id: 1,
        name: "Rachel Kim",
        role: "HR Manager",
        avatar_color: "#7C3AED",
      },
      {
        id: 2,
        name: "David Chen",
        role: "Marketing Director",
        avatar_color: "#0A66C2",
      },
    ],
    notes:
      "Candidate referred by David. Strong SaaS background. Focus on campaign ROI and data skills.",
    feedback: null,
    overall_rating: null,
    ratings: {},
    source: "referral",
    is_confirmed: true,
    reminder_sent: true,
    application_id: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    candidate_name: "Sarah Mitchell",
    candidate_email: "sarah.mitchell@email.com",
    candidate_phone: "+1 (555) 234-5678",
    candidate_score: 87,
    job_title: "Senior React Native Developer",
    department: "Engineering",
    interview_type: "technical",
    format: "video",
    stage: 1,
    total_stages: 3,
    status: "completed",
    scheduled_date: new Date(
      Date.now() - 1 * 24 * 60 * 60 * 1000,
    ).toISOString(),
    duration_minutes: 90,
    location: "Zoom",
    meeting_link: null,
    interviewers: [
      {
        id: 4,
        name: "Alex Park",
        role: "Lead Engineer",
        avatar_color: "#0891B2",
      },
      {
        id: 5,
        name: "Mia Torres",
        role: "Sr. Developer",
        avatar_color: "#DB2777",
      },
    ],
    notes:
      "Technical deep-dive. Focus on React Native architecture, performance, and system design.",
    feedback:
      "Excellent problem-solving. Deep RN expertise demonstrated. Strong system design answers. Recommend advancing.",
    overall_rating: 4,
    ratings: {
      technical_skills: 5,
      communication: 4,
      problem_solving: 4,
      culture_fit: 4,
      experience_relevance: 4,
    },
    source: "linkedin",
    is_confirmed: true,
    reminder_sent: true,
    application_id: 1,
    created_at: new Date().toISOString(),
  },
];

const MOCK_STATS = {
  total: 2,
  scheduled: 1,
  completed: 1,
  cancelled: 0,
  no_show: 0,
  today: 0,
  this_week: 1,
  avg_rating: 4.0,
  offer_rate: 50,
};

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const STATUS_META = {
  scheduled: {
    label: "Scheduled",
    color: "#0A66C2",
    bg: "#EFF6FF",
    text: "#1E40AF",
    icon: "calendar",
  },
  completed: {
    label: "Completed",
    color: "#16A34A",
    bg: "#DCFCE7",
    text: "#166534",
    icon: "checkmark-circle",
  },
  cancelled: {
    label: "Cancelled",
    color: "#64748B",
    bg: "#F1F5F9",
    text: "#334155",
    icon: "close-circle",
  },
  no_show: {
    label: "No Show",
    color: "#DC2626",
    bg: "#FEF2F2",
    text: "#991B1B",
    icon: "alert-circle",
  },
  rescheduled: {
    label: "Rescheduled",
    color: "#D97706",
    bg: "#FEF3C7",
    text: "#92400E",
    icon: "refresh-circle",
  },
};

const TYPE_META = {
  phone_screen: {
    label: "Phone Screen",
    icon: "call-outline",
    color: "#64748B",
  },
  technical: {
    label: "Technical",
    icon: "code-slash-outline",
    color: "#0891B2",
  },
  panel: { label: "Panel", icon: "people-outline", color: "#7C3AED" },
  final: { label: "Final Round", icon: "trophy-outline", color: "#D97706" },
  portfolio_review: {
    label: "Portfolio",
    icon: "images-outline",
    color: "#DB2777",
  },
  case_study: {
    label: "Case Study",
    icon: "document-text-outline",
    color: "#059669",
  },
  hr: { label: "HR Round", icon: "person-outline", color: "#6366F1" },
  cultural: { label: "Culture Fit", icon: "heart-outline", color: "#F43F5E" },
};

const FORMAT_META = {
  video: { label: "Video Call", icon: "videocam-outline", color: T.blue },
  phone: { label: "Phone", icon: "call-outline", color: "#64748B" },
  in_person: { label: "In Person", icon: "business-outline", color: T.green },
};

const RATING_LABELS = {
  technical_skills: "Technical Skills",
  communication: "Communication",
  problem_solving: "Problem Solving",
  culture_fit: "Culture Fit",
  experience_relevance: "Experience Relevance",
};

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
  "#6366F1",
  "#059669",
  "#EA580C",
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

const formatDateTime = (iso) => {
  const d = new Date(iso);
  const date = d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
  return { date, time, full: `${date} · ${time}` };
};

const isToday = (iso) => {
  const d = new Date(iso);
  const n = new Date();
  return (
    d.getDate() === n.getDate() &&
    d.getMonth() === n.getMonth() &&
    d.getFullYear() === n.getFullYear()
  );
};

const isUpcoming = (iso) => new Date(iso) > new Date();

const daysUntil = (iso) => {
  const diff = Math.ceil((new Date(iso) - new Date()) / (1000 * 60 * 60 * 24));
  if (diff < 0) return null;
  if (diff === 0) return "Today";
  if (diff === 1) return "Tomorrow";
  return `In ${diff}d`;
};

const StarRating = ({
  rating,
  max = 5,
  size = 14,
  interactive = false,
  onRate,
}) => (
  <View style={{ flexDirection: "row", gap: 2 }}>
    {Array.from({ length: max }).map((_, i) => (
      <TouchableOpacity
        key={i}
        onPress={() => interactive && onRate && onRate(i + 1)}
        disabled={!interactive}
      >
        <Ionicons
          name={i < rating ? "star" : "star-outline"}
          size={size}
          color={i < rating ? "#F59E0B" : "#CBD5E1"}
        />
      </TouchableOpacity>
    ))}
  </View>
);

// ─────────────────────────────────────────────────────────────
//  STATS WIDGET
// ─────────────────────────────────────────────────────────────
const StatsWidget = ({ stats }) => {
  const tiles = [
    { val: stats.total, label: "Total", icon: "calendar", color: T.blue },
    { val: stats.scheduled, label: "Upcoming", icon: "time", color: "#7C3AED" },
    {
      val: stats.completed,
      label: "Completed",
      icon: "checkmark-circle",
      color: T.green,
    },
    { val: stats.today, label: "Today", icon: "today", color: T.orange },
    {
      val: stats.this_week,
      label: "This Week",
      icon: "calendar-number",
      color: T.teal,
    },
    {
      val: stats.no_show,
      label: "No Shows",
      icon: "alert-circle",
      color: T.red,
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
            <Text style={sw.eyebrow}>INTERVIEWS</Text>
            <Text style={sw.heroNum}>{stats.total}</Text>
            <View style={sw.heroBadges}>
              <View style={sw.heroBadge}>
                <Ionicons name="calendar" size={10} color="#4ADE80" />
                <Text style={sw.heroBadgeTxt}>{stats.this_week} this week</Text>
              </View>
              <View
                style={[
                  sw.heroBadge,
                  { backgroundColor: "rgba(251,191,36,0.12)" },
                ]}
              >
                <Ionicons name="star" size={10} color="#FBBF24" />
                <Text style={[sw.heroBadgeTxt, { color: "#FBBF24" }]}>
                  {stats.avg_rating}/5 avg rating
                </Text>
              </View>
            </View>
            <Text style={sw.heroSub}>
              {stats.offer_rate}% offer conversion rate
            </Text>
          </View>
          <View style={sw.heroRight}>
            {/* Today spotlight */}
            <View style={sw.todayCard}>
              <Text style={sw.todayNum}>{stats.today}</Text>
              <Text style={sw.todayLabel}>Today</Text>
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
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#16A34A",
    opacity: 0.08,
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
  todayCard: {
    width: 70,
    height: 70,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  todayNum: { fontSize: 26, fontWeight: "900", color: "#fff" },
  todayLabel: {
    fontSize: 9,
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
//  CALENDAR STRIP
// ─────────────────────────────────────────────────────────────
const CalendarStrip = ({ interviews, selectedDate, onSelectDate }) => {
  const days = useMemo(() => {
    const arr = [];
    const today = new Date();
    for (let i = -1; i <= 13; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      const iso = d.toISOString().split("T")[0];
      const count = interviews.filter(
        (iv) => iv.scheduled_date.startsWith(iso) && iv.status === "scheduled",
      ).length;
      arr.push({ date: d, iso, count, isToday: i === 0 });
    }
    return arr;
  }, [interviews]);

  return (
    <View style={cs.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={cs.strip}
      >
        {days.map((day) => {
          const isSelected = selectedDate === day.iso;
          return (
            <TouchableOpacity
              key={day.iso}
              style={[
                cs.dayBtn,
                isSelected && cs.dayBtnActive,
                day.isToday && !isSelected && cs.dayBtnToday,
              ]}
              onPress={() => onSelectDate(isSelected ? null : day.iso)}
            >
              <Text
                style={[
                  cs.dayName,
                  isSelected && cs.dayTxtActive,
                  day.isToday && !isSelected && cs.todayTxt,
                ]}
              >
                {day.date
                  .toLocaleDateString("en-US", { weekday: "short" })
                  .toUpperCase()}
              </Text>
              <Text
                style={[
                  cs.dayNum,
                  isSelected && cs.dayTxtActive,
                  day.isToday &&
                    !isSelected && { color: T.blue, fontWeight: "900" },
                ]}
              >
                {day.date.getDate()}
              </Text>
              {day.count > 0 ? (
                <View style={[cs.dot, isSelected && cs.dotActive]}>
                  <Text style={[cs.dotTxt, isSelected && { color: T.blue }]}>
                    {day.count}
                  </Text>
                </View>
              ) : (
                <View style={cs.dotEmpty} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const cs = StyleSheet.create({
  wrapper: {
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  strip: { paddingHorizontal: 8, paddingVertical: 8, gap: 4 },
  dayBtn: {
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 12,
    gap: 3,
    minWidth: 48,
  },
  dayBtnActive: { backgroundColor: T.navy },
  dayBtnToday: { backgroundColor: T.blueSoft },
  dayName: {
    fontSize: 9,
    fontWeight: "700",
    color: T.textMuted,
    letterSpacing: 0.5,
  },
  dayNum: { fontSize: 16, fontWeight: "800", color: T.text },
  dayTxtActive: { color: "#fff" },
  todayTxt: { color: T.blue },
  dot: {
    backgroundColor: T.blueSoft,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 18,
    alignItems: "center",
  },
  dotActive: { backgroundColor: "rgba(255,255,255,0.2)" },
  dotTxt: { fontSize: 9, fontWeight: "800", color: T.blue },
  dotEmpty: { height: 14 },
});

// ─────────────────────────────────────────────────────────────
//  INTERVIEW CARD
// ─────────────────────────────────────────────────────────────
const InterviewCard = ({ interview: iv, onPress }) => {
  const sm = STATUS_META[iv.status] || STATUS_META.scheduled;
  const tm = TYPE_META[iv.interview_type] || TYPE_META.phone_screen;
  const fm = FORMAT_META[iv.format] || FORMAT_META.video;
  const dt = formatDateTime(iv.scheduled_date);
  const until = daysUntil(iv.scheduled_date);
  const color = avatarColor(iv.candidate_name);
  const upcoming = isUpcoming(iv.scheduled_date);
  const todayFlag = isToday(iv.scheduled_date);

  return (
    <TouchableOpacity
      style={ic.card}
      onPress={() => onPress(iv)}
      activeOpacity={0.85}
    >
      {/* Today ribbon */}
      {todayFlag && iv.status === "scheduled" && (
        <View style={ic.todayRibbon}>
          <Text style={ic.todayRibbonTxt}>TODAY</Text>
        </View>
      )}

      {/* Top row */}
      <View style={ic.topRow}>
        {/* Avatar */}
        <View style={[ic.avatar, { backgroundColor: color }]}>
          <Text style={ic.avatarTxt}>{getInitials(iv.candidate_name)}</Text>
          {iv.candidate_score !== null && (
            <View
              style={[
                ic.scoreBadge,
                { backgroundColor: scoreBg(iv.candidate_score) },
              ]}
            >
              <Text
                style={[
                  ic.scoreBadgeTxt,
                  { color: scoreColor(iv.candidate_score) },
                ]}
              >
                {iv.candidate_score}
              </Text>
            </View>
          )}
        </View>

        {/* Info */}
        <View style={ic.info}>
          <Text style={ic.name}>{iv.candidate_name}</Text>
          <Text style={ic.jobLine} numberOfLines={1}>
            {iv.job_title}
          </Text>
          <View style={ic.typeRow}>
            <Ionicons name={tm.icon} size={11} color={tm.color} />
            <Text style={[ic.typeLabel, { color: tm.color }]}>{tm.label}</Text>
            <View style={ic.sep} />
            <Ionicons name={fm.icon} size={11} color={fm.color} />
            <Text style={[ic.typeLabel, { color: fm.color }]}>{fm.label}</Text>
          </View>
        </View>

        {/* Status */}
        <View style={ic.rightCol}>
          <View style={[ic.statusBadge, { backgroundColor: sm.bg }]}>
            <Ionicons name={sm.icon} size={10} color={sm.color} />
            <Text style={[ic.statusTxt, { color: sm.text }]}>{sm.label}</Text>
          </View>
          {/* Stage dots */}
          <View style={ic.stageDots}>
            {Array.from({ length: iv.total_stages }).map((_, i) => (
              <View
                key={i}
                style={[
                  ic.stageDot,
                  i < iv.stage && { backgroundColor: sm.color },
                  i === iv.stage - 1 && { backgroundColor: sm.color },
                ]}
              />
            ))}
          </View>
          <Text style={ic.stageLabel}>
            Stage {iv.stage}/{iv.total_stages}
          </Text>
        </View>
      </View>

      {/* Date + time block */}
      <View
        style={[
          ic.dateBlock,
          todayFlag && iv.status === "scheduled" && ic.dateBlockToday,
        ]}
      >
        <View style={ic.dateLeft}>
          <Ionicons
            name="calendar-outline"
            size={13}
            color={todayFlag ? T.blue : T.textMuted}
          />
          <Text
            style={[
              ic.dateMain,
              todayFlag && { color: T.blue, fontWeight: "800" },
            ]}
          >
            {dt.date}
          </Text>
        </View>
        <View style={ic.dateRight}>
          <Ionicons name="time-outline" size={13} color={T.textMuted} />
          <Text style={ic.timeStr}>{dt.time}</Text>
          <Text style={ic.duration}>· {iv.duration_minutes}min</Text>
          {until && iv.status === "scheduled" && (
            <View
              style={[
                ic.untilPill,
                { backgroundColor: todayFlag ? T.blueSoft : "#F1F5F9" },
              ]}
            >
              <Text
                style={[ic.untilTxt, { color: todayFlag ? T.blue : T.textSub }]}
              >
                {until}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Location */}
      <View style={ic.locationRow}>
        <Ionicons name={fm.icon} size={12} color={T.textMuted} />
        <Text style={ic.locationTxt} numberOfLines={1}>
          {iv.location}
        </Text>
        {iv.meeting_link && (
          <View style={ic.linkChip}>
            <Ionicons name="link-outline" size={10} color={T.blue} />
            <Text style={ic.linkTxt}>Join Link</Text>
          </View>
        )}
      </View>

      {/* Interviewers */}
      <View style={ic.interviewersRow}>
        <View style={ic.avatarStack}>
          {iv.interviewers.slice(0, 3).map((iw, idx) => (
            <View
              key={iw.id}
              style={[
                ic.interviewerAvatar,
                {
                  backgroundColor: iw.avatar_color,
                  marginLeft: idx === 0 ? 0 : -8,
                  zIndex: 10 - idx,
                },
              ]}
            >
              <Text style={ic.interviewerAvatarTxt}>
                {getInitials(iw.name)}
              </Text>
            </View>
          ))}
          {iv.interviewers.length > 3 && (
            <View
              style={[
                ic.interviewerAvatar,
                { backgroundColor: "#E2E8F0", marginLeft: -8 },
              ]}
            >
              <Text style={[ic.interviewerAvatarTxt, { color: T.textSub }]}>
                +{iv.interviewers.length - 3}
              </Text>
            </View>
          )}
        </View>
        <Text style={ic.interviewerNames} numberOfLines={1}>
          {iv.interviewers.map((iw) => iw.name.split(" ")[0]).join(", ")}
        </Text>
      </View>

      {/* Completed: rating preview */}
      {iv.status === "completed" && iv.overall_rating && (
        <View style={ic.ratingPreview}>
          <StarRating rating={iv.overall_rating} size={13} />
          <Text style={ic.ratingPreviewTxt}>{iv.overall_rating}/5 overall</Text>
          {iv.feedback && (
            <Text style={ic.feedbackSnippet} numberOfLines={1}>
              "{iv.feedback.slice(0, 60)}…"
            </Text>
          )}
        </View>
      )}

      {/* Warnings */}
      {!iv.is_confirmed && iv.status === "scheduled" && (
        <View style={ic.warningRow}>
          <Ionicons name="alert-circle" size={12} color={T.orange} />
          <Text style={ic.warningTxt}>Awaiting candidate confirmation</Text>
        </View>
      )}
      {!iv.reminder_sent && iv.status === "scheduled" && (
        <View style={ic.warningRow}>
          <Ionicons
            name="notifications-off-outline"
            size={12}
            color={T.textMuted}
          />
          <Text style={ic.warningTxt}>Reminder not sent</Text>
        </View>
      )}

      {/* Footer actions */}
      <View style={ic.footer}>
        {iv.meeting_link && iv.status === "scheduled" && (
          <TouchableOpacity style={ic.joinBtn}>
            <Ionicons name="videocam" size={13} color="#fff" />
            <Text style={ic.joinBtnTxt}>Join Interview</Text>
          </TouchableOpacity>
        )}
        {iv.status === "scheduled" && !iv.meeting_link && (
          <TouchableOpacity style={[ic.joinBtn, { backgroundColor: T.green }]}>
            <Ionicons name="checkmark-circle-outline" size={13} color="#fff" />
            <Text style={ic.joinBtnTxt}>Mark Complete</Text>
          </TouchableOpacity>
        )}
        {iv.status === "completed" && !iv.feedback && (
          <TouchableOpacity style={[ic.joinBtn, { backgroundColor: T.purple }]}>
            <Ionicons name="create-outline" size={13} color="#fff" />
            <Text style={ic.joinBtnTxt}>Add Feedback</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={ic.viewBtn} onPress={() => onPress(iv)}>
          <Text style={ic.viewBtnTxt}>Details</Text>
          <Ionicons name="chevron-forward" size={12} color={T.blue} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const ic = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 8,
    borderBottomColor: "#F1F5F9",
    position: "relative",
  },
  todayRibbon: {
    position: "absolute",
    top: 14,
    right: 0,
    backgroundColor: T.blue,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderTopLeftRadius: 6,
    borderBottomLeftRadius: 6,
  },
  todayRibbonTxt: {
    fontSize: 9,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 1,
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
  scoreBadge: {
    position: "absolute",
    bottom: -2,
    right: -4,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  scoreBadgeTxt: { fontSize: 8, fontWeight: "900" },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: T.text, marginBottom: 2 },
  jobLine: { fontSize: 11, color: T.textMuted, marginBottom: 4 },
  typeRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  typeLabel: { fontSize: 11, fontWeight: "600" },
  sep: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: T.border },

  rightCol: { alignItems: "flex-end", gap: 5 },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusTxt: { fontSize: 10, fontWeight: "700" },
  stageDots: { flexDirection: "row", gap: 3 },
  stageDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E2E8F0",
  },
  stageLabel: { fontSize: 9, color: T.textMuted, fontWeight: "600" },

  dateBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 11,
    paddingVertical: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  dateBlockToday: { backgroundColor: T.blueSoft, borderColor: "#BFDBFE" },
  dateLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateMain: { fontSize: 13, fontWeight: "700", color: T.text },
  dateRight: { flexDirection: "row", alignItems: "center", gap: 5 },
  timeStr: { fontSize: 13, fontWeight: "600", color: T.textSub },
  duration: { fontSize: 11, color: T.textMuted },
  untilPill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 8 },
  untilTxt: { fontSize: 10, fontWeight: "700" },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 8,
  },
  locationTxt: { flex: 1, fontSize: 12, color: T.textSub, fontWeight: "500" },
  linkChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: T.blueSoft,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: 8,
  },
  linkTxt: { fontSize: 10, color: T.blue, fontWeight: "700" },

  interviewersRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginBottom: 8,
  },
  avatarStack: { flexDirection: "row" },
  interviewerAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#fff",
  },
  interviewerAvatarTxt: { fontSize: 8, fontWeight: "800", color: "#fff" },
  interviewerNames: {
    flex: 1,
    fontSize: 11,
    color: T.textMuted,
    fontWeight: "500",
  },

  ratingPreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#FFFBEB",
    borderRadius: 10,
    padding: 9,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  ratingPreviewTxt: { fontSize: 11, fontWeight: "700", color: "#92400E" },
  feedbackSnippet: {
    flex: 1,
    fontSize: 10,
    color: "#78350F",
    fontStyle: "italic",
  },

  warningRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 4,
  },
  warningTxt: { fontSize: 11, color: T.textMuted, fontWeight: "500" },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  joinBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.blue,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 16,
  },
  joinBtnTxt: { fontSize: 11, fontWeight: "700", color: "#fff" },
  viewBtn: {
    marginLeft: "auto",
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
const DetailModal = ({ iv, onClose, onComplete, onCancel, onFeedback }) => {
  if (!iv) return null;
  const sm = STATUS_META[iv.status] || STATUS_META.scheduled;
  const tm = TYPE_META[iv.interview_type] || TYPE_META.phone_screen;
  const fm = FORMAT_META[iv.format] || FORMAT_META.video;
  const dt = formatDateTime(iv.scheduled_date);
  const color = avatarColor(iv.candidate_name);
  const [localRatings, setLocalRatings] = useState(iv.ratings || {});
  const [feedbackText, setFeedbackText] = useState(iv.feedback || "");
  const [editingFeedback, setEditingFeedback] = useState(false);

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
            <Text style={dm.headerTitle}>Interview Details</Text>
            <View style={[dm.statusPill, { backgroundColor: sm.bg }]}>
              <Ionicons name={sm.icon} size={12} color={sm.color} />
              <Text style={[dm.statusPillTxt, { color: sm.text }]}>
                {sm.label}
              </Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Candidate hero */}
            <View style={[dm.hero, { backgroundColor: color + "15" }]}>
              <View style={[dm.heroAvatar, { backgroundColor: color }]}>
                <Text style={dm.heroAvatarTxt}>
                  {getInitials(iv.candidate_name)}
                </Text>
              </View>
              <Text style={dm.heroName}>{iv.candidate_name}</Text>
              <Text style={dm.heroRole}>
                {iv.job_title} · {iv.department}
              </Text>
              <View style={dm.heroBadges}>
                <View
                  style={[dm.heroBadge, { backgroundColor: tm.color + "18" }]}
                >
                  <Ionicons name={tm.icon} size={11} color={tm.color} />
                  <Text style={[dm.heroBadgeTxt, { color: tm.color }]}>
                    {tm.label}
                  </Text>
                </View>
                <View
                  style={[dm.heroBadge, { backgroundColor: fm.color + "18" }]}
                >
                  <Ionicons name={fm.icon} size={11} color={fm.color} />
                  <Text style={[dm.heroBadgeTxt, { color: fm.color }]}>
                    {fm.label}
                  </Text>
                </View>
                <View style={[dm.heroBadge, { backgroundColor: "#F1F5F9" }]}>
                  <Ionicons name="layers-outline" size={11} color={T.textSub} />
                  <Text style={[dm.heroBadgeTxt, { color: T.textSub }]}>
                    Stage {iv.stage}/{iv.total_stages}
                  </Text>
                </View>
                {iv.candidate_score !== null && (
                  <View
                    style={[
                      dm.heroBadge,
                      { backgroundColor: scoreBg(iv.candidate_score) },
                    ]}
                  >
                    <Ionicons
                      name="analytics-outline"
                      size={11}
                      color={scoreColor(iv.candidate_score)}
                    />
                    <Text
                      style={[
                        dm.heroBadgeTxt,
                        { color: scoreColor(iv.candidate_score) },
                      ]}
                    >
                      AI Score: {iv.candidate_score}
                    </Text>
                  </View>
                )}
              </View>
            </View>

            {/* Schedule info */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Schedule</Text>
              <View style={dm.scheduleCard}>
                <View style={dm.scheduleRow}>
                  <View style={dm.scheduleIcon}>
                    <Ionicons name="calendar" size={16} color={T.blue} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={dm.scheduleLabel}>Date & Time</Text>
                    <Text style={dm.scheduleValue}>{dt.full}</Text>
                  </View>
                </View>
                <View style={dm.scheduleRow}>
                  <View style={dm.scheduleIcon}>
                    <Ionicons
                      name="timer-outline"
                      size={16}
                      color={T.textSub}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={dm.scheduleLabel}>Duration</Text>
                    <Text style={dm.scheduleValue}>
                      {iv.duration_minutes} minutes
                    </Text>
                  </View>
                </View>
                <View style={[dm.scheduleRow, { borderBottomWidth: 0 }]}>
                  <View style={dm.scheduleIcon}>
                    <Ionicons name={fm.icon} size={16} color={fm.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={dm.scheduleLabel}>Location</Text>
                    <Text style={dm.scheduleValue}>{iv.location}</Text>
                  </View>
                  {iv.meeting_link && (
                    <TouchableOpacity style={dm.copyLinkBtn}>
                      <Ionicons name="copy-outline" size={14} color={T.blue} />
                      <Text style={dm.copyLinkTxt}>Copy Link</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            {/* Interviewers */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Interview Panel</Text>
              {iv.interviewers.map((iw) => (
                <View key={iw.id} style={dm.panelRow}>
                  <View
                    style={[
                      dm.panelAvatar,
                      { backgroundColor: iw.avatar_color },
                    ]}
                  >
                    <Text style={dm.panelAvatarTxt}>
                      {getInitials(iw.name)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={dm.panelName}>{iw.name}</Text>
                    <Text style={dm.panelRole}>{iw.role}</Text>
                  </View>
                  <TouchableOpacity style={dm.msgBtn}>
                    <Ionicons name="mail-outline" size={14} color={T.blue} />
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Candidate contact */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Candidate</Text>
              <View style={dm.contactCard}>
                <TouchableOpacity style={dm.contactRow}>
                  <View
                    style={[dm.contactIcon, { backgroundColor: T.blueSoft }]}
                  >
                    <Ionicons name="mail-outline" size={14} color={T.blue} />
                  </View>
                  <Text style={dm.contactTxt}>{iv.candidate_email}</Text>
                  <Ionicons name="copy-outline" size={13} color={T.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity
                  style={[dm.contactRow, { borderBottomWidth: 0 }]}
                >
                  <View
                    style={[dm.contactIcon, { backgroundColor: T.greenSoft }]}
                  >
                    <Ionicons name="call-outline" size={14} color={T.green} />
                  </View>
                  <Text style={dm.contactTxt}>{iv.candidate_phone}</Text>
                  <Ionicons name="call-outline" size={13} color={T.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Status flags */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Status Flags</Text>
              <View style={dm.flagsRow}>
                <View
                  style={[
                    dm.flagItem,
                    {
                      backgroundColor: iv.is_confirmed
                        ? T.greenSoft
                        : T.redSoft,
                    },
                  ]}
                >
                  <Ionicons
                    name={iv.is_confirmed ? "checkmark-circle" : "close-circle"}
                    size={16}
                    color={iv.is_confirmed ? T.green : T.red}
                  />
                  <Text
                    style={[
                      dm.flagTxt,
                      { color: iv.is_confirmed ? T.green : T.red },
                    ]}
                  >
                    {iv.is_confirmed ? "Confirmed" : "Unconfirmed"}
                  </Text>
                </View>
                <View
                  style={[
                    dm.flagItem,
                    {
                      backgroundColor: iv.reminder_sent
                        ? T.greenSoft
                        : T.orangeSoft,
                    },
                  ]}
                >
                  <Ionicons
                    name={
                      iv.reminder_sent
                        ? "notifications"
                        : "notifications-off-outline"
                    }
                    size={16}
                    color={iv.reminder_sent ? T.green : T.orange}
                  />
                  <Text
                    style={[
                      dm.flagTxt,
                      { color: iv.reminder_sent ? T.green : T.orange },
                    ]}
                  >
                    {iv.reminder_sent ? "Reminder Sent" : "No Reminder"}
                  </Text>
                </View>
              </View>
            </View>

            {/* Prep notes */}
            {iv.notes && (
              <View style={dm.section}>
                <Text style={dm.sectionTitle}>Preparation Notes</Text>
                <View style={dm.notesCard}>
                  <Ionicons
                    name="document-text-outline"
                    size={14}
                    color={T.textMuted}
                    style={{ marginBottom: 6 }}
                  />
                  <Text style={dm.notesTxt}>{iv.notes}</Text>
                </View>
              </View>
            )}

            {/* Feedback + Ratings (completed) */}
            {iv.status === "completed" && (
              <>
                <View style={dm.section}>
                  <View style={dm.sectionHeader}>
                    <Text style={dm.sectionTitle}>Ratings</Text>
                    {iv.overall_rating && (
                      <StarRating rating={iv.overall_rating} size={14} />
                    )}
                  </View>
                  <View style={dm.ratingsCard}>
                    {Object.entries(RATING_LABELS).map(([key, label]) => {
                      const val = localRatings[key] || 0;
                      return (
                        <View key={key} style={dm.ratingRow}>
                          <Text style={dm.ratingLabel}>{label}</Text>
                          <StarRating
                            rating={val}
                            size={16}
                            interactive
                            onRate={(r) =>
                              setLocalRatings((p) => ({ ...p, [key]: r }))
                            }
                          />
                          <Text
                            style={[
                              dm.ratingVal,
                              {
                                color:
                                  val >= 4
                                    ? T.green
                                    : val >= 3
                                      ? T.orange
                                      : T.red,
                              },
                            ]}
                          >
                            {val}/5
                          </Text>
                        </View>
                      );
                    })}
                  </View>
                </View>

                <View style={dm.section}>
                  <View style={dm.sectionHeader}>
                    <Text style={dm.sectionTitle}>Interviewer Feedback</Text>
                    <TouchableOpacity
                      onPress={() => setEditingFeedback((p) => !p)}
                    >
                      <Ionicons
                        name={editingFeedback ? "checkmark" : "create-outline"}
                        size={16}
                        color={T.blue}
                      />
                    </TouchableOpacity>
                  </View>
                  {editingFeedback ? (
                    <TextInput
                      style={dm.feedbackInput}
                      value={feedbackText}
                      onChangeText={setFeedbackText}
                      multiline
                      numberOfLines={5}
                      placeholder="Write detailed feedback…"
                      placeholderTextColor={T.textMuted}
                    />
                  ) : (
                    <View style={dm.feedbackCard}>
                      <Text style={dm.feedbackTxt}>
                        {feedbackText || "No feedback recorded yet."}
                      </Text>
                    </View>
                  )}
                </View>
              </>
            )}

            {/* Quick actions for scheduled */}
            {iv.status === "scheduled" && (
              <View style={dm.section}>
                <Text style={dm.sectionTitle}>Quick Actions</Text>
                <View style={dm.actionsGrid}>
                  <TouchableOpacity style={dm.actionItem}>
                    <View
                      style={[dm.actionIcon, { backgroundColor: T.blueSoft }]}
                    >
                      <Ionicons
                        name="notifications-outline"
                        size={18}
                        color={T.blue}
                      />
                    </View>
                    <Text style={dm.actionLabel}>Send Reminder</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={dm.actionItem}>
                    <View
                      style={[dm.actionIcon, { backgroundColor: T.orangeSoft }]}
                    >
                      <Ionicons
                        name="refresh-circle-outline"
                        size={18}
                        color={T.orange}
                      />
                    </View>
                    <Text style={dm.actionLabel}>Reschedule</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={dm.actionItem}
                    onPress={() => {
                      onCancel(iv.id);
                      onClose();
                    }}
                  >
                    <View
                      style={[dm.actionIcon, { backgroundColor: T.redSoft }]}
                    >
                      <Ionicons
                        name="close-circle-outline"
                        size={18}
                        color={T.red}
                      />
                    </View>
                    <Text style={dm.actionLabel}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={dm.actionItem}
                    onPress={() => {
                      onComplete(iv.id);
                      onClose();
                    }}
                  >
                    <View
                      style={[dm.actionIcon, { backgroundColor: T.greenSoft }]}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={18}
                        color={T.green}
                      />
                    </View>
                    <Text style={dm.actionLabel}>Mark Done</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          <View style={dm.footer}>
            {iv.meeting_link && iv.status === "scheduled" && (
              <TouchableOpacity style={dm.footerBtn}>
                <Ionicons name="videocam" size={15} color="#fff" />
                <Text style={dm.footerBtnTxt}>Join Interview</Text>
              </TouchableOpacity>
            )}
            {iv.status === "completed" && !iv.feedback && (
              <TouchableOpacity
                style={[dm.footerBtn, { backgroundColor: T.purple }]}
              >
                <Ionicons name="create-outline" size={15} color="#fff" />
                <Text style={dm.footerBtnTxt}>Submit Feedback</Text>
              </TouchableOpacity>
            )}
            {iv.status === "completed" && iv.overall_rating >= 4 && (
              <TouchableOpacity
                style={[dm.footerBtn, { backgroundColor: T.green }]}
              >
                <Ionicons
                  name="checkmark-done-outline"
                  size={15}
                  color="#fff"
                />
                <Text style={dm.footerBtnTxt}>Extend Offer</Text>
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
    backgroundColor: "rgba(0,0,0,0.5)",
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
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusPillTxt: { fontSize: 11, fontWeight: "700" },

  hero: {
    margin: 16,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
    gap: 5,
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
  heroRole: { fontSize: 12, color: T.textMuted, textAlign: "center" },
  heroBadges: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 4,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  heroBadgeTxt: { fontSize: 11, fontWeight: "700" },

  section: { paddingHorizontal: 20, marginBottom: 18 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  scheduleCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  scheduleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  scheduleIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleLabel: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "600",
    marginBottom: 2,
  },
  scheduleValue: { fontSize: 13, fontWeight: "700", color: T.text },
  copyLinkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: T.blueSoft,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },
  copyLinkTxt: { fontSize: 11, color: T.blue, fontWeight: "700" },

  panelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  panelAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  panelAvatarTxt: { fontSize: 12, fontWeight: "800", color: "#fff" },
  panelName: { fontSize: 13, fontWeight: "700", color: T.text },
  panelRole: { fontSize: 11, color: T.textMuted },
  msgBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  contactCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  contactIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  contactTxt: { flex: 1, fontSize: 13, color: T.text, fontWeight: "500" },

  flagsRow: { flexDirection: "row", gap: 10 },
  flagItem: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    padding: 11,
    borderRadius: 12,
  },
  flagTxt: { fontSize: 12, fontWeight: "700" },

  notesCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  notesTxt: { fontSize: 12, color: "#78350F", lineHeight: 18 },

  ratingsCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
    gap: 12,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  ratingLabel: { fontSize: 12, color: T.textSub, fontWeight: "600", flex: 1 },
  ratingVal: { fontSize: 12, fontWeight: "800", width: 28, textAlign: "right" },

  feedbackCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 13,
    borderWidth: 1,
    borderColor: T.border,
  },
  feedbackTxt: { fontSize: 12, color: T.textSub, lineHeight: 18 },
  feedbackInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 13,
    borderWidth: 1.5,
    borderColor: T.blue,
    fontSize: 13,
    color: T.text,
    textAlignVertical: "top",
    minHeight: 100,
    lineHeight: 20,
  },

  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  actionItem: {
    flex: 1,
    minWidth: "40%",
    alignItems: "center",
    gap: 6,
    padding: 14,
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  actionLabel: { fontSize: 11, fontWeight: "700", color: T.text },

  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: T.blue,
  },
  footerBtnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  SCHEDULE MODAL
// ─────────────────────────────────────────────────────────────
const ScheduleModal = ({ visible, onClose }) => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    candidate: "",
    job: "",
    type: "technical",
    format: "video",
    date: "",
    time: "",
    duration: "60",
    location: "",
    notes: "",
  });

  const types = Object.entries(TYPE_META).map(([key, val]) => ({
    key,
    ...val,
  }));
  const formats = Object.entries(FORMAT_META).map(([key, val]) => ({
    key,
    ...val,
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={sch.overlay}>
        <View style={sch.sheet}>
          <View style={sch.handle} />
          <View style={sch.header}>
            <TouchableOpacity
              onPress={step > 1 ? () => setStep((p) => p - 1) : onClose}
              style={sch.backBtn}
            >
              <Ionicons
                name={step > 1 ? "arrow-back" : "close"}
                size={18}
                color="#64748B"
              />
            </TouchableOpacity>
            <Text style={sch.headerTitle}>Schedule Interview</Text>
            <View style={sch.stepIndicator}>
              {[1, 2, 3].map((s) => (
                <View
                  key={s}
                  style={[sch.stepDot, step >= s && sch.stepDotActive]}
                />
              ))}
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ padding: 20 }}
          >
            {step === 1 && (
              <>
                <Text style={sch.stepTitle}>Candidate & Role</Text>
                <Text style={sch.fieldLabel}>Candidate Name</Text>
                <TextInput
                  style={sch.input}
                  placeholder="Search candidates…"
                  placeholderTextColor={T.textMuted}
                  value={form.candidate}
                  onChangeText={(v) => setForm((p) => ({ ...p, candidate: v }))}
                />
                <Text style={sch.fieldLabel}>Job Position</Text>
                <TextInput
                  style={sch.input}
                  placeholder="Select job posting…"
                  placeholderTextColor={T.textMuted}
                  value={form.job}
                  onChangeText={(v) => setForm((p) => ({ ...p, job: v }))}
                />
                <Text style={sch.fieldLabel}>Interview Type</Text>
                <View style={sch.optionGrid}>
                  {types.map((t) => (
                    <TouchableOpacity
                      key={t.key}
                      style={[
                        sch.optionChip,
                        form.type === t.key && {
                          backgroundColor: t.color + "18",
                          borderColor: t.color,
                        },
                      ]}
                      onPress={() => setForm((p) => ({ ...p, type: t.key }))}
                    >
                      <Ionicons
                        name={t.icon}
                        size={13}
                        color={form.type === t.key ? t.color : T.textMuted}
                      />
                      <Text
                        style={[
                          sch.optionChipTxt,
                          form.type === t.key && { color: t.color },
                        ]}
                      >
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            {step === 2 && (
              <>
                <Text style={sch.stepTitle}>Date, Time & Format</Text>
                <Text style={sch.fieldLabel}>Interview Format</Text>
                <View style={sch.formatRow}>
                  {formats.map((f) => (
                    <TouchableOpacity
                      key={f.key}
                      style={[
                        sch.formatChip,
                        form.format === f.key && {
                          backgroundColor: f.color + "18",
                          borderColor: f.color,
                        },
                      ]}
                      onPress={() => setForm((p) => ({ ...p, format: f.key }))}
                    >
                      <Ionicons
                        name={f.icon}
                        size={16}
                        color={form.format === f.key ? f.color : T.textMuted}
                      />
                      <Text
                        style={[
                          sch.formatLabel,
                          form.format === f.key && { color: f.color },
                        ]}
                      >
                        {f.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={sch.fieldLabel}>Date</Text>
                <TextInput
                  style={sch.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={T.textMuted}
                  value={form.date}
                  onChangeText={(v) => setForm((p) => ({ ...p, date: v }))}
                />
                <Text style={sch.fieldLabel}>Time</Text>
                <TextInput
                  style={sch.input}
                  placeholder="HH:MM (24hr)"
                  placeholderTextColor={T.textMuted}
                  value={form.time}
                  onChangeText={(v) => setForm((p) => ({ ...p, time: v }))}
                />
                <Text style={sch.fieldLabel}>Duration</Text>
                <View style={sch.durationRow}>
                  {["30", "45", "60", "90", "120"].map((d) => (
                    <TouchableOpacity
                      key={d}
                      style={[
                        sch.durationChip,
                        form.duration === d && sch.durationChipActive,
                      ]}
                      onPress={() => setForm((p) => ({ ...p, duration: d }))}
                    >
                      <Text
                        style={[
                          sch.durationTxt,
                          form.duration === d && sch.durationTxtActive,
                        ]}
                      >
                        {d}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                <Text style={sch.fieldLabel}>Location / Link</Text>
                <TextInput
                  style={sch.input}
                  placeholder="Zoom link, office room, etc."
                  placeholderTextColor={T.textMuted}
                  value={form.location}
                  onChangeText={(v) => setForm((p) => ({ ...p, location: v }))}
                />
              </>
            )}

            {step === 3 && (
              <>
                <Text style={sch.stepTitle}>Notes & Confirm</Text>
                <Text style={sch.fieldLabel}>Preparation Notes</Text>
                <TextInput
                  style={[sch.input, { height: 100, textAlignVertical: "top" }]}
                  placeholder="What should interviewers focus on?"
                  placeholderTextColor={T.textMuted}
                  multiline
                  value={form.notes}
                  onChangeText={(v) => setForm((p) => ({ ...p, notes: v }))}
                />
                <View style={sch.confirmCard}>
                  <Text style={sch.confirmTitle}>Review Summary</Text>
                  {[
                    { label: "Candidate", val: form.candidate || "—" },
                    { label: "Job", val: form.job || "—" },
                    { label: "Type", val: TYPE_META[form.type]?.label || "—" },
                    {
                      label: "Format",
                      val: FORMAT_META[form.format]?.label || "—",
                    },
                    { label: "Date", val: form.date || "—" },
                    { label: "Time", val: form.time || "—" },
                    { label: "Duration", val: `${form.duration} min` },
                    { label: "Location", val: form.location || "—" },
                  ].map((row) => (
                    <View key={row.label} style={sch.confirmRow}>
                      <Text style={sch.confirmLabel}>{row.label}</Text>
                      <Text style={sch.confirmVal}>{row.val}</Text>
                    </View>
                  ))}
                </View>
              </>
            )}
            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={sch.footer}>
            <TouchableOpacity
              style={sch.nextBtn}
              onPress={() => {
                if (step < 3) setStep((p) => p + 1);
                else {
                  Alert.alert(
                    "Interview Scheduled",
                    "Invite sent to candidate and interviewers.",
                  );
                  onClose();
                  setStep(1);
                }
              }}
            >
              <Text style={sch.nextBtnTxt}>
                {step === 3 ? "Schedule & Send Invites" : "Continue"}
              </Text>
              <Ionicons
                name={step === 3 ? "checkmark" : "arrow-forward"}
                size={16}
                color="#fff"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const sch = StyleSheet.create({
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
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  stepIndicator: { flexDirection: "row", gap: 5 },
  stepDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: "#E2E8F0" },
  stepDotActive: { backgroundColor: T.blue, width: 18 },
  stepTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: T.text,
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: T.text,
    marginBottom: 7,
    marginTop: 12,
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
  optionGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  optionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
  },
  optionChipTxt: { fontSize: 11, fontWeight: "600", color: T.textSub },
  formatRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  formatChip: {
    flex: 1,
    alignItems: "center",
    gap: 5,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
  },
  formatLabel: { fontSize: 11, fontWeight: "600", color: T.textSub },
  durationRow: { flexDirection: "row", gap: 8, marginBottom: 4 },
  durationChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
  },
  durationChipActive: { backgroundColor: T.blue, borderColor: T.blue },
  durationTxt: { fontSize: 12, fontWeight: "700", color: T.textSub },
  durationTxtActive: { color: "#fff" },
  confirmCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
    marginTop: 4,
  },
  confirmTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: T.text,
    marginBottom: 10,
  },
  confirmRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  confirmLabel: { fontSize: 12, color: T.textMuted, fontWeight: "500" },
  confirmVal: { fontSize: 12, color: T.text, fontWeight: "700" },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  nextBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: T.blue,
    paddingVertical: 14,
    borderRadius: 14,
  },
  nextBtnTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
const STATUS_TABS = ["All", "scheduled", "completed", "cancelled", "no_show"];

export default function InterviewsScreen() {
  const [interviews, setInterviews] = useState(MOCK_INTERVIEWS);
  const [selectedIv, setSelectedIv] = useState(null);
  const [showSchedule, setShowSchedule] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [selectedDate, setSelectedDate] = useState(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filtered = useMemo(() => {
    let list = [...interviews];
    if (activeTab !== "All")
      list = list.filter((iv) => iv.status === activeTab);
    if (selectedDate)
      list = list.filter((iv) => iv.scheduled_date.startsWith(selectedDate));
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (iv) =>
          iv.candidate_name.toLowerCase().includes(q) ||
          iv.job_title.toLowerCase().includes(q) ||
          iv.department.toLowerCase().includes(q),
      );
    }
    return list.sort(
      (a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date),
    );
  }, [interviews, activeTab, selectedDate, search]);

  const handleComplete = useCallback((id) => {
    setInterviews((prev) =>
      prev.map((iv) => (iv.id === id ? { ...iv, status: "completed" } : iv)),
    );
  }, []);

  const handleCancel = useCallback((id) => {
    Alert.alert(
      "Cancel Interview",
      "Are you sure you want to cancel this interview?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: () =>
            setInterviews((prev) =>
              prev.map((iv) =>
                iv.id === id ? { ...iv, status: "cancelled" } : iv,
              ),
            ),
        },
      ],
    );
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  }, []);

  const todayInterviews = interviews.filter(
    (iv) => isToday(iv.scheduled_date) && iv.status === "scheduled",
  );

  const ListHeader = () => (
    <>
      {/* Title row */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Interviews</Text>
          <Text style={s.pageSub}>
            {MOCK_STATS.scheduled} upcoming · {MOCK_STATS.today} today
          </Text>
        </View>
        <TouchableOpacity
          style={s.scheduleBtn}
          onPress={() => setShowSchedule(true)}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={s.scheduleBtnTxt}>Schedule</Text>
        </TouchableOpacity>
      </View>

      {/* Stats widget */}
      <StatsWidget stats={MOCK_STATS} />

      {/* Today's interviews banner */}
      {todayInterviews.length > 0 && (
        <View style={s.todayBanner}>
          <View style={s.todayBannerLeft}>
            <Ionicons name="today" size={16} color={T.blue} />
            <Text style={s.todayBannerTxt}>
              {todayInterviews.length} interview
              {todayInterviews.length > 1 ? "s" : ""} today
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6 }}
          >
            {todayInterviews.map((iv) => (
              <TouchableOpacity
                key={iv.id}
                style={s.todayChip}
                onPress={() => setSelectedIv(iv)}
              >
                <View
                  style={[
                    s.todayChipDot,
                    { backgroundColor: avatarColor(iv.candidate_name) },
                  ]}
                />
                <Text style={s.todayChipTxt}>
                  {iv.candidate_name.split(" ")[0]} ·{" "}
                  {formatDateTime(iv.scheduled_date).time}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Calendar strip */}
      <CalendarStrip
        interviews={interviews}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      {/* Search */}
      <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
        <Ionicons
          name="search-outline"
          size={16}
          color={searchFocused ? T.blue : "#94A3B8"}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search candidates, roles…"
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

      {/* Status tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabs}
      >
        {STATUS_TABS.map((tab) => {
          const meta = tab !== "All" ? STATUS_META[tab] : null;
          const count =
            tab === "All"
              ? interviews.length
              : interviews.filter((iv) => iv.status === tab).length;
          return (
            <TouchableOpacity
              key={tab}
              style={[
                s.tab,
                activeTab === tab && s.tabActive,
                activeTab === tab &&
                  meta && { backgroundColor: meta.bg, borderColor: meta.color },
              ]}
              onPress={() => setActiveTab(tab)}
            >
              {meta && (
                <Ionicons
                  name={meta.icon}
                  size={11}
                  color={activeTab === tab ? meta.color : T.textMuted}
                />
              )}
              <Text
                style={[
                  s.tabTxt,
                  activeTab === tab && meta && { color: meta.text },
                ]}
              >
                {tab === "All" ? "All" : meta?.label}
              </Text>
              <View
                style={[
                  s.countBadge,
                  activeTab === tab &&
                    meta && { backgroundColor: meta.color + "20" },
                ]}
              >
                <Text
                  style={[
                    s.countTxt,
                    activeTab === tab && meta && { color: meta.color },
                  ]}
                >
                  {count}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {selectedDate && (
        <View style={s.dateFilterBanner}>
          <Ionicons name="calendar" size={13} color={T.blue} />
          <Text style={s.dateFilterTxt}>
            Showing interviews for{" "}
            {new Date(selectedDate + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
          <TouchableOpacity onPress={() => setSelectedDate(null)}>
            <Ionicons name="close-circle" size={16} color={T.textMuted} />
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
          <InterviewCard interview={item} onPress={setSelectedIv} />
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
            <Ionicons name="calendar-outline" size={54} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No interviews found</Text>
            <Text style={s.emptySub}>Try a different filter or date</Text>
          </View>
        }
      />

      <DetailModal
        iv={selectedIv}
        onClose={() => setSelectedIv(null)}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />

      <ScheduleModal
        visible={showSchedule}
        onClose={() => setShowSchedule(false)}
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
  scheduleBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.blue,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  scheduleBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },

  todayBanner: {
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: T.blueSoft,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    gap: 8,
  },
  todayBannerLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  todayBannerTxt: { fontSize: 13, fontWeight: "700", color: T.blue },
  todayChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  todayChipDot: { width: 8, height: 8, borderRadius: 4 },
  todayChipTxt: { fontSize: 11, fontWeight: "700", color: T.text },

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
  tabActive: { borderColor: T.blue, backgroundColor: T.blueSoft },
  tabTxt: { fontSize: 11, fontWeight: "600", color: "#64748B" },
  countBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
    minWidth: 20,
    alignItems: "center",
  },
  countTxt: { fontSize: 9, fontWeight: "800", color: T.textMuted },

  dateFilterBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 14,
    marginBottom: 8,
    backgroundColor: T.blueSoft,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  dateFilterTxt: { flex: 1, fontSize: 12, color: T.blue, fontWeight: "600" },

  empty: { padding: 48, alignItems: "center", gap: 8 },
  emptyTxt: { fontSize: 15, color: "#94A3B8", fontWeight: "700" },
  emptySub: { fontSize: 13, color: "#CBD5E1", textAlign: "center" },
});
