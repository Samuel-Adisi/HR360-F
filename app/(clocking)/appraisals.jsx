import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
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
  purpleSoft: "#F5F3FF",
  text: "#0F172A",
  textSub: "#475569",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
};

// ─── Helpers ──────────────────────────────────────────────────
const getAvatar = (id) =>
  `https://api.dicebear.com/7.x/avataaars/png?seed=appraisal_${id}&size=80&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`;

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

// ─── Mock Data ────────────────────────────────────────────────
const STATS = [
  {
    label: "Total",
    value: 48,
    icon: "document-text",
    color: C.accent,
    soft: C.accentSoft,
    trend: "+6",
  },
  {
    label: "Completed",
    value: 31,
    icon: "checkmark-circle",
    color: C.green,
    soft: C.greenSoft,
    trend: "+8",
  },
  {
    label: "In Review",
    value: 11,
    icon: "hourglass-outline",
    color: C.yellow,
    soft: C.yellowSoft,
    trend: "+3",
  },
  {
    label: "Overdue",
    value: 6,
    icon: "alert-circle",
    color: C.red,
    soft: C.redSoft,
    trend: "+2",
  },
];

const APPRAISALS = [
  {
    id: 1,
    name: "Sarah Chen",
    role: "Sr. Engineer",
    dept: "Engineering",
    period: "Q1 2025",
    due: "Mar 31, 2025",
    status: "completed",
    score: 94,
    selfScore: 91,
    managerScore: 97,
    competencies: [
      { name: "Technical Skills", self: 9, manager: 9 },
      { name: "Collaboration", self: 8, manager: 9 },
      { name: "Communication", self: 7, manager: 8 },
      { name: "Initiative", self: 9, manager: 10 },
      { name: "Delivery", self: 8, manager: 9 },
    ],
    goals: [
      { title: "Launch API v2", status: "completed", weight: 30 },
      { title: "Team mentorship x3", status: "completed", weight: 20 },
      { title: "Reduce bug rate 20%", status: "completed", weight: 25 },
      { title: "Cloud cert (AWS)", status: "in_progress", weight: 25 },
    ],
    comment:
      "Exceptional performance this quarter. Sarah consistently delivers high-quality work and mentors junior engineers effectively.",
    reviewer: "Emily Konadu",
  },
  {
    id: 2,
    name: "Marcus Williams",
    role: "Sales Lead",
    dept: "Sales",
    period: "Q1 2025",
    due: "Mar 31, 2025",
    status: "completed",
    score: 88,
    selfScore: 85,
    managerScore: 91,
    competencies: [
      { name: "Technical Skills", self: 7, manager: 8 },
      { name: "Collaboration", self: 9, manager: 9 },
      { name: "Communication", self: 10, manager: 10 },
      { name: "Initiative", self: 8, manager: 8 },
      { name: "Delivery", self: 8, manager: 9 },
    ],
    goals: [
      { title: "Hit $2M target", status: "completed", weight: 40 },
      { title: "Onboard 5 new clients", status: "completed", weight: 30 },
      { title: "CRM adoption 100%", status: "in_progress", weight: 30 },
    ],
    comment:
      "Marcus exceeded sales targets and demonstrated strong leadership within the team.",
    reviewer: "Emily Konadu",
  },
  {
    id: 3,
    name: "Priya Patel",
    role: "Product Manager",
    dept: "Marketing",
    period: "Q1 2025",
    due: "Mar 31, 2025",
    status: "in_review",
    score: null,
    selfScore: 82,
    managerScore: null,
    competencies: [
      { name: "Technical Skills", self: 7, manager: null },
      { name: "Collaboration", self: 9, manager: null },
      { name: "Communication", self: 9, manager: null },
      { name: "Initiative", self: 8, manager: null },
      { name: "Delivery", self: 7, manager: null },
    ],
    goals: [
      { title: "Product roadmap Q2", status: "in_progress", weight: 40 },
      { title: "NPS score +10", status: "completed", weight: 30 },
      { title: "Launch 3 features", status: "in_progress", weight: 30 },
    ],
    comment: null,
    reviewer: "Emily Konadu",
  },
  {
    id: 4,
    name: "James O'Brien",
    role: "DevOps Engineer",
    dept: "Engineering",
    period: "Q1 2025",
    due: "Apr 5, 2025",
    status: "overdue",
    score: null,
    selfScore: null,
    managerScore: null,
    competencies: [],
    goals: [
      { title: "CI/CD pipeline setup", status: "completed", weight: 35 },
      { title: "99.9% uptime SLA", status: "in_progress", weight: 40 },
      { title: "Security audit", status: "not_started", weight: 25 },
    ],
    comment: null,
    reviewer: "Emily Konadu",
  },
  {
    id: 5,
    name: "Aisha Kamara",
    role: "HR Manager",
    dept: "HR",
    period: "Q1 2025",
    due: "Mar 31, 2025",
    status: "completed",
    score: 91,
    selfScore: 88,
    managerScore: 94,
    competencies: [
      { name: "Technical Skills", self: 8, manager: 8 },
      { name: "Collaboration", self: 9, manager: 10 },
      { name: "Communication", self: 10, manager: 10 },
      { name: "Initiative", self: 9, manager: 9 },
      { name: "Delivery", self: 8, manager: 9 },
    ],
    goals: [
      { title: "Reduce turnover 15%", status: "completed", weight: 35 },
      { title: "Launch L&D program", status: "completed", weight: 30 },
      { title: "Engagement survey", status: "completed", weight: 35 },
    ],
    comment:
      "Aisha drove exceptional HR initiatives this quarter with measurable results.",
    reviewer: "Emily Konadu",
  },
  {
    id: 6,
    name: "Lena Fischer",
    role: "Marketing Analyst",
    dept: "Marketing",
    period: "Q1 2025",
    due: "Mar 28, 2025",
    status: "overdue",
    score: null,
    selfScore: 79,
    managerScore: null,
    competencies: [],
    goals: [
      { title: "Campaign ROI analysis", status: "in_progress", weight: 50 },
      { title: "Brand audit report", status: "not_started", weight: 50 },
    ],
    comment: null,
    reviewer: "Emily Konadu",
  },
];

const TABS = ["All", "Completed", "In Review", "Overdue"];

const statusMeta = (s) => {
  if (s === "completed")
    return {
      label: "Completed",
      color: C.green,
      bg: C.greenSoft,
      icon: "checkmark-circle",
    };
  if (s === "in_review")
    return {
      label: "In Review",
      color: C.yellow,
      bg: C.yellowSoft,
      icon: "hourglass-outline",
    };
  if (s === "overdue")
    return {
      label: "Overdue",
      color: C.red,
      bg: C.redSoft,
      icon: "alert-circle",
    };
  return {
    label: "Pending",
    color: C.accent,
    bg: C.accentSoft,
    icon: "time-outline",
  };
};

const goalStatusMeta = (s) => {
  if (s === "completed") return { color: C.green, label: "Done" };
  if (s === "in_progress") return { color: C.yellow, label: "In Progress" };
  return { color: C.red, label: "Not Started" };
};

const DEPT_COLORS = {
  Engineering: C.accent,
  Sales: C.teal,
  Marketing: C.purple,
  HR: C.green,
  Finance: C.orange,
  Operations: C.indigo,
};

// ─── Avatar Component ─────────────────────────────────────────
function Avatar({ name, id, size = 44 }) {
  const [err, setErr] = useState(false);
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        overflow: "hidden",
        borderWidth: 2,
        borderColor: C.border,
      }}
    >
      {!err ? (
        <Image
          source={{ uri: getAvatar(id) }}
          style={{ width: size, height: size }}
          onError={() => setErr(true)}
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            backgroundColor: C.accent,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text
            style={{ color: "#fff", fontWeight: "800", fontSize: size * 0.34 }}
          >
            {getInitials(name)}
          </Text>
        </View>
      )}
    </View>
  );
}

// ─── Score Ring ───────────────────────────────────────────────
function ScoreRing({ score, size = 60, color = C.accent }) {
  const pct = score || 0;
  return (
    <View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 5,
          borderColor: C.border,
        }}
      />
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: 5,
          borderColor: color,
          borderTopColor: pct > 25 ? color : "transparent",
          borderRightColor: pct > 50 ? color : "transparent",
          borderBottomColor: pct > 75 ? color : "transparent",
          transform: [{ rotate: `${pct * 3.6 - 90}deg` }],
        }}
      />
      {score != null ? (
        <Text style={{ fontSize: size * 0.22, fontWeight: "900", color }}>
          {score}
        </Text>
      ) : (
        <Ionicons name="time-outline" size={size * 0.32} color={C.textMuted} />
      )}
    </View>
  );
}

// ─── Competency Bar ───────────────────────────────────────────
function CompBar({ name, self, manager }) {
  const selfPct = (self / 10) * 100;
  const manPct = manager != null ? (manager / 10) * 100 : null;
  return (
    <View style={cb.wrap}>
      <Text style={cb.name}>{name}</Text>
      <View style={cb.bars}>
        <View style={cb.barRow}>
          <Text style={cb.barLbl}>Self</Text>
          <View style={cb.track}>
            <View
              style={[
                cb.fill,
                { width: `${selfPct}%`, backgroundColor: C.accent },
              ]}
            />
          </View>
          <Text style={[cb.val, { color: C.accent }]}>{self}/10</Text>
        </View>
        {manPct != null && (
          <View style={cb.barRow}>
            <Text style={cb.barLbl}>Mgr</Text>
            <View style={cb.track}>
              <View
                style={[
                  cb.fill,
                  { width: `${manPct}%`, backgroundColor: C.green },
                ]}
              />
            </View>
            <Text style={[cb.val, { color: C.green }]}>{manager}/10</Text>
          </View>
        )}
      </View>
    </View>
  );
}
const cb = StyleSheet.create({
  wrap: { marginBottom: 10 },
  name: { fontSize: 12, fontWeight: "700", color: C.text, marginBottom: 5 },
  bars: { gap: 4 },
  barRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  barLbl: { fontSize: 10, color: C.textMuted, fontWeight: "600", width: 26 },
  track: {
    flex: 1,
    height: 7,
    backgroundColor: C.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 4 },
  val: { fontSize: 11, fontWeight: "800", width: 34, textAlign: "right" },
});

// ─── Detail Modal ─────────────────────────────────────────────
function AppraisalDetailModal({ item, visible, onClose }) {
  if (!item) return null;
  const meta = statusMeta(item.status);
  const deptColor = DEPT_COLORS[item.dept] || C.accent;
  const scoreColor =
    item.score >= 90
      ? C.green
      : item.score >= 75
        ? C.accent
        : item.score >= 60
          ? C.yellow
          : C.red;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={md.overlay}>
        <View style={md.sheet}>
          <View style={md.handle} />

          {/* Header */}
          <View style={[md.header, { borderBottomColor: C.border }]}>
            <Text style={md.title}>Appraisal Detail</Text>
            <TouchableOpacity onPress={onClose} style={md.closeBtn}>
              <Ionicons name="close" size={20} color={C.textSub} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={md.body}>
            {/* Employee hero */}
            <View style={md.hero}>
              <View style={[md.heroBg, { backgroundColor: deptColor }]}>
                <View style={md.heroBgCircle1} />
                <View style={md.heroBgCircle2} />
              </View>
              <View style={md.heroContent}>
                <View style={md.heroLeft}>
                  <Avatar name={item.name} id={item.id} size={56} />
                  <View>
                    <Text style={md.heroName}>{item.name}</Text>
                    <Text style={md.heroRole}>{item.role}</Text>
                    <View
                      style={[
                        md.deptTag,
                        { backgroundColor: "rgba(255,255,255,0.25)" },
                      ]}
                    >
                      <Text style={md.deptTagTxt}>{item.dept}</Text>
                    </View>
                  </View>
                </View>
                <ScoreRing
                  score={item.score}
                  size={64}
                  color={item.score ? "#fff" : C.textMuted}
                />
              </View>
            </View>

            {/* Status + meta */}
            <View style={md.metaRow}>
              <View style={[md.statusPill, { backgroundColor: meta.bg }]}>
                <Ionicons name={meta.icon} size={13} color={meta.color} />
                <Text style={[md.statusTxt, { color: meta.color }]}>
                  {meta.label}
                </Text>
              </View>
              <View style={md.metaItem}>
                <Ionicons
                  name="calendar-outline"
                  size={13}
                  color={C.textMuted}
                />
                <Text style={md.metaTxt}>{item.period}</Text>
              </View>
              <View style={md.metaItem}>
                <Ionicons name="time-outline" size={13} color={C.textMuted} />
                <Text style={md.metaTxt}>Due {item.due}</Text>
              </View>
            </View>

            {/* Score breakdown */}
            {(item.selfScore || item.managerScore) && (
              <View style={md.card}>
                <Text style={md.cardTitle}>Score Breakdown</Text>
                <View style={md.scoreBreakRow}>
                  <View style={md.scoreBreakCell}>
                    <Text style={[md.scoreBreakVal, { color: C.accent }]}>
                      {item.selfScore ?? "—"}
                    </Text>
                    <Text style={md.scoreBreakLbl}>Self Score</Text>
                  </View>
                  <View style={md.scoreBreakDivider} />
                  <View style={md.scoreBreakCell}>
                    <Text style={[md.scoreBreakVal, { color: C.green }]}>
                      {item.managerScore ?? "—"}
                    </Text>
                    <Text style={md.scoreBreakLbl}>Manager Score</Text>
                  </View>
                  <View style={md.scoreBreakDivider} />
                  <View style={md.scoreBreakCell}>
                    <Text
                      style={[
                        md.scoreBreakVal,
                        { color: item.score ? scoreColor : C.textMuted },
                      ]}
                    >
                      {item.score ?? "—"}
                    </Text>
                    <Text style={md.scoreBreakLbl}>Final Score</Text>
                  </View>
                </View>
              </View>
            )}

            {/* Competencies */}
            {item.competencies?.length > 0 && (
              <View style={md.card}>
                <Text style={md.cardTitle}>Competency Ratings</Text>
                {item.competencies.map((c) => (
                  <CompBar
                    key={c.name}
                    name={c.name}
                    self={c.self}
                    manager={c.manager}
                  />
                ))}
              </View>
            )}

            {/* Goals */}
            {item.goals?.length > 0 && (
              <View style={md.card}>
                <Text style={md.cardTitle}>Goals & Objectives</Text>
                {item.goals.map((g, i) => {
                  const gm = goalStatusMeta(g.status);
                  return (
                    <View
                      key={i}
                      style={[
                        md.goalRow,
                        i < item.goals.length - 1 && md.goalRowBorder,
                      ]}
                    >
                      <View
                        style={[md.goalDot, { backgroundColor: gm.color }]}
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={md.goalTitle}>{g.title}</Text>
                        <Text style={md.goalWeight}>Weight: {g.weight}%</Text>
                      </View>
                      <View
                        style={[
                          md.goalBadge,
                          { backgroundColor: gm.color + "18" },
                        ]}
                      >
                        <Text style={[md.goalBadgeTxt, { color: gm.color }]}>
                          {gm.label}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Manager comment */}
            {item.comment && (
              <View style={md.card}>
                <Text style={md.cardTitle}>Manager's Comment</Text>
                <View style={md.commentBox}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={16}
                    color={C.accent}
                    style={{ marginTop: 2 }}
                  />
                  <Text style={md.commentTxt}>{item.comment}</Text>
                </View>
                <View style={md.reviewerRow}>
                  <Avatar name={item.reviewer} id={99} size={24} />
                  <Text style={md.reviewerTxt}>
                    Reviewed by{" "}
                    <Text style={{ fontWeight: "800", color: C.text }}>
                      {item.reviewer}
                    </Text>
                  </Text>
                </View>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer actions */}
          {item.status !== "completed" && (
            <View style={md.footer}>
              <TouchableOpacity style={md.secondaryBtn}>
                <Ionicons name="create-outline" size={17} color={C.accent} />
                <Text style={md.secondaryBtnTxt}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={md.primaryBtn}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={17}
                  color="#fff"
                />
                <Text style={md.primaryBtnTxt}>
                  {item.status === "overdue" ? "Submit Now" : "Submit Review"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const md = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: C.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "93%",
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: "center",
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
  },
  title: { fontSize: 17, fontWeight: "800", color: C.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  body: { paddingHorizontal: 16 },

  // Hero
  hero: {
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 14,
    marginBottom: 12,
    minHeight: 110,
  },
  heroBg: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0 },
  heroBgCircle1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.1)",
    top: -40,
    right: -30,
  },
  heroBgCircle2: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255,255,255,0.08)",
    bottom: -20,
    left: 40,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
  },
  heroLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  heroName: { fontSize: 17, fontWeight: "900", color: "#fff" },
  heroRole: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  deptTag: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 7,
  },
  deptTagTxt: { fontSize: 10, color: "#fff", fontWeight: "700" },

  // Meta
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
    marginBottom: 12,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  statusTxt: { fontSize: 12, fontWeight: "700" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaTxt: { fontSize: 11, color: C.textSub, fontWeight: "600" },

  // Cards
  card: {
    backgroundColor: C.bg,
    borderRadius: 16,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: C.border,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: C.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 12,
  },

  // Score breakdown
  scoreBreakRow: { flexDirection: "row" },
  scoreBreakCell: { flex: 1, alignItems: "center", paddingVertical: 6 },
  scoreBreakVal: { fontSize: 28, fontWeight: "900", letterSpacing: -1 },
  scoreBreakLbl: {
    fontSize: 10,
    color: C.textMuted,
    fontWeight: "600",
    marginTop: 2,
  },
  scoreBreakDivider: { width: 1, backgroundColor: C.border, marginVertical: 4 },

  // Goals
  goalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  goalRowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  goalDot: { width: 10, height: 10, borderRadius: 5 },
  goalTitle: { fontSize: 13, fontWeight: "700", color: C.text },
  goalWeight: { fontSize: 11, color: C.textMuted, marginTop: 1 },
  goalBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 },
  goalBadgeTxt: { fontSize: 10, fontWeight: "700" },

  // Comment
  commentBox: { flexDirection: "row", gap: 10, marginBottom: 10 },
  commentTxt: { flex: 1, fontSize: 13, color: C.textSub, lineHeight: 20 },
  reviewerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  reviewerTxt: { fontSize: 12, color: C.textMuted },

  // Footer
  footer: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.accent,
    backgroundColor: C.accentSoft,
  },
  secondaryBtnTxt: { fontSize: 14, fontWeight: "700", color: C.accent },
  primaryBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor: C.accent,
    shadowColor: C.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryBtnTxt: { fontSize: 14, fontWeight: "800", color: "#fff" },
});

// ─── Main Screen ──────────────────────────────────────────────
export default function AppraisalsScreen() {
  const [activeTab, setActiveTab] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(headerAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, []);

  const filtered = APPRAISALS.filter((a) => {
    const tabMatch =
      activeTab === 0
        ? true
        : activeTab === 1
          ? a.status === "completed"
          : activeTab === 2
            ? a.status === "in_review"
            : a.status === "overdue";

    const q = search.toLowerCase();
    const searchMatch =
      !q ||
      a.name.toLowerCase().includes(q) ||
      a.dept.toLowerCase().includes(q) ||
      a.role.toLowerCase().includes(q);
    return tabMatch && searchMatch;
  });

  const openDetail = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const renderItem = ({ item, index }) => {
    const meta = statusMeta(item.status);
    const deptColor = DEPT_COLORS[item.dept] || C.accent;
    const cardW = SW - 28;

    // Progress calc from goals
    const totalGoals = item.goals?.length || 0;
    const doneGoals =
      item.goals?.filter((g) => g.status === "completed").length || 0;
    const goalPct =
      totalGoals > 0 ? Math.round((doneGoals / totalGoals) * 100) : 0;

    return (
      <TouchableOpacity
        style={[s.card, { width: cardW }]}
        onPress={() => openDetail(item)}
        activeOpacity={0.88}
      >
        {/* Colored left accent bar */}
        <View style={[s.cardBar, { backgroundColor: deptColor }]} />

        <View style={s.cardInner}>
          {/* Top row */}
          <View style={s.cardTop}>
            <Avatar name={item.name} id={item.id} size={46} />
            <View style={s.cardTopInfo}>
              <Text style={s.cardName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={s.cardRole} numberOfLines={1}>
                {item.role}
              </Text>
              <View style={s.cardMeta}>
                <View
                  style={[s.deptBadge, { backgroundColor: deptColor + "18" }]}
                >
                  <Text style={[s.deptBadgeTxt, { color: deptColor }]}>
                    {item.dept}
                  </Text>
                </View>
                <Text style={s.periodTxt}>{item.period}</Text>
              </View>
            </View>
            {/* Score or status */}
            <View style={s.cardRight}>
              {item.score != null ? (
                <View style={s.scoreWrap}>
                  <Text
                    style={[
                      s.scoreNum,
                      {
                        color:
                          item.score >= 90
                            ? C.green
                            : item.score >= 75
                              ? C.accent
                              : C.yellow,
                      },
                    ]}
                  >
                    {item.score}
                  </Text>
                  <Text style={s.scoreMax}>/100</Text>
                </View>
              ) : (
                <View style={[s.statusPill, { backgroundColor: meta.bg }]}>
                  <Ionicons name={meta.icon} size={12} color={meta.color} />
                  <Text style={[s.statusTxt, { color: meta.color }]}>
                    {meta.label}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Goal progress */}
          <View style={s.goalSection}>
            <View style={s.goalHeader}>
              <Text style={s.goalLabel}>Goals</Text>
              <Text style={s.goalCount}>
                {doneGoals}/{totalGoals} done
              </Text>
            </View>
            <View style={s.goalTrack}>
              <View
                style={[
                  s.goalFill,
                  {
                    width: `${goalPct}%`,
                    backgroundColor:
                      goalPct === 100
                        ? C.green
                        : goalPct > 50
                          ? C.accent
                          : C.yellow,
                  },
                ]}
              />
            </View>
          </View>

          {/* Bottom row */}
          <View style={s.cardBottom}>
            <View style={[s.fullStatusBadge, { backgroundColor: meta.bg }]}>
              <View style={[s.statusDot, { backgroundColor: meta.color }]} />
              <Text style={[s.fullStatusTxt, { color: meta.color }]}>
                {meta.label}
              </Text>
            </View>
            <View style={s.dueRow}>
              <Ionicons name="calendar-outline" size={12} color={C.textMuted} />
              <Text style={s.dueTxt}>Due {item.due}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.border} />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={C.bg} />

      {/* ── Header ── */}
      <Animated.View style={[s.header, { opacity: headerAnim }]}>
        <View>
          <Text style={s.headerEye}>PERFORMANCE</Text>
          <Text style={s.headerTitle}>Appraisals</Text>
        </View>
        <View style={s.headerActions}>
          <TouchableOpacity style={s.headerBtn}>
            <Ionicons name="search-outline" size={19} color={C.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.headerBtn, { backgroundColor: C.accent }]}
          >
            <Ionicons name="add" size={19} color="#fff" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* ── Stat Cards Row ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.statsScroll}
        style={s.statsWrap}
      >
        {STATS.map((st) => (
          <View key={st.label} style={s.statCard}>
            <View style={s.statCardTop}>
              <View style={[s.statIconBox, { backgroundColor: st.soft }]}>
                <Ionicons name={st.icon} size={15} color={st.color} />
              </View>
              <View style={[s.statTrend, { backgroundColor: C.greenSoft }]}>
                <Ionicons name="arrow-up" size={9} color={C.green} />
                <Text style={[s.statTrendTxt, { color: C.green }]}>
                  {st.trend}
                </Text>
              </View>
            </View>
            <Text style={[s.statValue, { color: st.color }]}>{st.value}</Text>
            <Text style={s.statLabel}>{st.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* ── Search ── */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={16} color={C.textMuted} />
        <TextInput
          style={s.searchInput}
          placeholder="Search name, role, department…"
          placeholderTextColor={C.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color={C.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── Tabs ── */}
      <View style={s.tabsOuter}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabsRow}
        >
          {TABS.map((t, i) => {
            const counts = [
              APPRAISALS.length,
              APPRAISALS.filter((a) => a.status === "completed").length,
              APPRAISALS.filter((a) => a.status === "in_review").length,
              APPRAISALS.filter((a) => a.status === "overdue").length,
            ];
            const isActive = activeTab === i;
            return (
              <TouchableOpacity
                key={t}
                style={[s.tab, isActive && s.tabActive]}
                onPress={() => setActiveTab(i)}
              >
                <Text style={[s.tabTxt, isActive && s.tabTxtActive]}>{t}</Text>
                <View style={[s.tabBadge, isActive && s.tabBadgeActive]}>
                  <Text
                    style={[s.tabBadgeTxt, isActive && s.tabBadgeTxtActive]}
                  >
                    {counts[i]}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={[s.list, filtered.length === 0 && { flex: 1 }]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <Ionicons
                name="document-text-outline"
                size={36}
                color={C.accent}
              />
            </View>
            <Text style={s.emptyTitle}>No appraisals found</Text>
            <Text style={s.emptyText}>Try a different tab or search term.</Text>
          </View>
        )}
      />

      {/* ── Detail Modal ── */}
      <AppraisalDetailModal
        item={selectedItem}
        visible={showModal}
        onClose={() => setShowModal(false)}
      />
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.bg },

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
  headerEye: {
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
  headerActions: { flexDirection: "row", gap: 8 },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.bg,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: C.border,
  },

  // Stats
  statsWrap: {
    backgroundColor: C.card,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  statsScroll: { paddingHorizontal: 12, paddingVertical: 12, gap: 9 },
  statCard: {
    width: 110,
    backgroundColor: C.bg,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statIconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  statTrend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statTrendTxt: { fontSize: 9, fontWeight: "800" },
  statValue: { fontSize: 24, fontWeight: "900", letterSpacing: -0.5 },
  statLabel: {
    fontSize: 11,
    color: C.textMuted,
    fontWeight: "600",
    marginTop: 1,
  },

  // Search
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 14,
    marginTop: 12,
    marginBottom: 2,
    backgroundColor: C.card,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#0000000A",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: { flex: 1, fontSize: 14, color: C.text, paddingVertical: 0 },

  // Tabs
  tabsOuter: { paddingHorizontal: 14, marginTop: 10, marginBottom: 4 },
  tabsRow: { gap: 7 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.card,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  tabActive: {
    backgroundColor: "#1D4ED8",
    borderColor: "#1D4ED8",
    shadowColor: "#1D4ED8",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  tabTxt: { fontSize: 12, color: C.textSub, fontWeight: "600" },
  tabTxtActive: { color: "#fff", fontWeight: "800" },
  tabBadge: {
    backgroundColor: C.border,
    borderRadius: 9,
    paddingHorizontal: 6,
    paddingVertical: 1,
    minWidth: 20,
    alignItems: "center",
  },
  tabBadgeActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  tabBadgeTxt: { fontSize: 10, color: C.textSub, fontWeight: "700" },
  tabBadgeTxtActive: { color: "#fff", fontWeight: "800" },

  // List
  list: { padding: 14, paddingTop: 10, gap: 10 },

  // Card
  card: {
    backgroundColor: C.card,
    borderRadius: 18,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  cardBar: { width: 4 },
  cardInner: { flex: 1, padding: 13, gap: 10 },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  cardTopInfo: { flex: 1 },
  cardName: { fontSize: 14, fontWeight: "800", color: C.text },
  cardRole: { fontSize: 11, color: C.textMuted, marginTop: 1 },
  cardMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 5,
  },
  deptBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 7 },
  deptBadgeTxt: { fontSize: 10, fontWeight: "700" },
  periodTxt: { fontSize: 10, color: C.textMuted, fontWeight: "600" },
  cardRight: { alignItems: "flex-end" },
  scoreWrap: { flexDirection: "row", alignItems: "baseline", gap: 1 },
  scoreNum: { fontSize: 24, fontWeight: "900", letterSpacing: -1 },
  scoreMax: { fontSize: 11, color: C.textMuted, fontWeight: "600" },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9,
  },
  statusTxt: { fontSize: 10, fontWeight: "700" },

  // Goal bar
  goalSection: { gap: 5 },
  goalHeader: { flexDirection: "row", justifyContent: "space-between" },
  goalLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  goalCount: { fontSize: 10, color: C.textMuted },
  goalTrack: {
    height: 6,
    backgroundColor: C.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  goalFill: { height: "100%", borderRadius: 3 },

  // Card bottom
  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fullStatusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 9,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  fullStatusTxt: { fontSize: 11, fontWeight: "700" },
  dueRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dueTxt: { fontSize: 11, color: C.textMuted, fontWeight: "600" },

  // Empty
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: C.accentSoft,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.text,
    marginBottom: 6,
  },
  emptyText: { fontSize: 13, color: C.textMuted, textAlign: "center" },
});
