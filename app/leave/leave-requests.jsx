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
  pink: "#DB2777",
  pinkSoft: "#FCE7F3",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────
const MOCK_LEAVE_REQUESTS = [
  {
    id: 1,
    employee_name: "Sarah Mitchell",
    employee_role: "Senior React Native Developer",
    department: "Engineering",
    avatar_color: "#0891B2",
    leave_type: "annual",
    status: "pending",
    start_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    days: 5,
    reason:
      "Family vacation — annual leave request for the first week of next month.",
    notes: "",
    approved_by: null,
    approved_at: null,
    rejected_reason: null,
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: [],
    balance_before: 18,
    balance_after: 13,
    is_half_day: false,
    cover_person: "Alex Park",
  },
  {
    id: 2,
    employee_name: "James Rodriguez",
    employee_role: "Product Marketing Manager",
    department: "Marketing",
    avatar_color: "#7C3AED",
    leave_type: "sick",
    status: "approved",
    start_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    end_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    days: 3,
    reason: "Flu symptoms — doctor advised rest for 3 days.",
    notes: "Medical certificate attached.",
    approved_by: "Rachel Kim",
    approved_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    rejected_reason: null,
    created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    attachments: ["medical_cert.pdf"],
    balance_before: 10,
    balance_after: 7,
    is_half_day: false,
    cover_person: null,
  },
];

const MOCK_BALANCES = {
  annual: { total: 21, used: 8, pending: 5, remaining: 13 },
  sick: { total: 14, used: 3, pending: 0, remaining: 11 },
  personal: { total: 5, used: 1, pending: 0, remaining: 4 },
  maternity: { total: 90, used: 0, pending: 0, remaining: 90 },
  paternity: { total: 10, used: 0, pending: 0, remaining: 10 },
  unpaid: { total: null, used: 2, pending: 0, remaining: null },
};

const MOCK_STATS = {
  total_requests: 2,
  pending: 1,
  approved: 1,
  rejected: 0,
  on_leave_today: 0,
  this_month: 2,
  avg_days: 4,
  team_on_leave: 1,
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
  approved: {
    label: "Approved",
    color: "#16A34A",
    bg: "#DCFCE7",
    text: "#166534",
    icon: "checkmark-circle",
  },
  rejected: {
    label: "Rejected",
    color: "#DC2626",
    bg: "#FEF2F2",
    text: "#991B1B",
    icon: "close-circle",
  },
  cancelled: {
    label: "Cancelled",
    color: "#64748B",
    bg: "#F1F5F9",
    text: "#334155",
    icon: "ban-outline",
  },
};

const LEAVE_TYPE_META = {
  annual: {
    label: "Annual Leave",
    icon: "sunny-outline",
    color: "#0A66C2",
    bg: "#EFF6FF",
  },
  sick: {
    label: "Sick Leave",
    icon: "medical-outline",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
  personal: {
    label: "Personal Leave",
    icon: "person-outline",
    color: "#7C3AED",
    bg: "#EDE9FE",
  },
  maternity: {
    label: "Maternity Leave",
    icon: "heart-outline",
    color: "#DB2777",
    bg: "#FCE7F3",
  },
  paternity: {
    label: "Paternity Leave",
    icon: "people-outline",
    color: "#0891B2",
    bg: "#ECFEFF",
  },
  unpaid: {
    label: "Unpaid Leave",
    icon: "cash-outline",
    color: "#64748B",
    bg: "#F1F5F9",
  },
  emergency: {
    label: "Emergency",
    icon: "alert-circle-outline",
    color: "#EA580C",
    bg: "#FFF7ED",
  },
  bereavement: {
    label: "Bereavement",
    icon: "ribbon-outline",
    color: "#475569",
    bg: "#F8FAFC",
  },
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
  "#059669",
];
const avatarColor = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const formatDate = (dateStr) => {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

const formatDateRange = (start, end, days) => {
  if (start === end) return `${formatDate(start)} · 1 day`;
  return `${formatDate(start)} – ${formatDate(end)} · ${days} days`;
};

const timeAgo = (iso) => {
  const diff = Math.floor((Date.now() - new Date(iso)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

const balancePct = (used, total) =>
  total ? Math.min((used / total) * 100, 100) : 0;

// ─────────────────────────────────────────────────────────────
//  BALANCE CARD
// ─────────────────────────────────────────────────────────────
const BalanceCard = ({ type, data }) => {
  const meta = LEAVE_TYPE_META[type];
  const pct = balancePct(data.used, data.total);
  const unlimited = data.total === null;

  return (
    <View style={bc.card}>
      <View style={[bc.iconBox, { backgroundColor: meta.bg }]}>
        <Ionicons name={meta.icon} size={16} color={meta.color} />
      </View>
      <Text style={bc.typeLabel} numberOfLines={1}>
        {meta.label.replace(" Leave", "")}
      </Text>
      {unlimited ? (
        <Text style={[bc.remaining, { color: meta.color }]}>∞</Text>
      ) : (
        <Text style={[bc.remaining, { color: meta.color }]}>
          {data.remaining}
        </Text>
      )}
      <Text style={bc.total}>
        {unlimited ? `${data.used} used` : `/ ${data.total} days`}
      </Text>
      {!unlimited && (
        <View style={bc.barBg}>
          <View
            style={[
              bc.barFill,
              { width: `${pct}%`, backgroundColor: meta.color },
            ]}
          />
        </View>
      )}
      {data.pending > 0 && (
        <View style={bc.pendingPill}>
          <Text style={bc.pendingTxt}>{data.pending} pending</Text>
        </View>
      )}
    </View>
  );
};

const bc = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 13,
    alignItems: "center",
    gap: 3,
    minWidth: 90,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  typeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },
  remaining: { fontSize: 22, fontWeight: "900", letterSpacing: -0.5 },
  total: { fontSize: 9, color: T.textMuted, fontWeight: "500" },
  barBg: {
    width: "100%",
    height: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 2,
    marginTop: 4,
  },
  barFill: { height: 4, borderRadius: 2 },
  pendingPill: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginTop: 2,
  },
  pendingTxt: { fontSize: 8, fontWeight: "800", color: "#92400E" },
});

// ─────────────────────────────────────────────────────────────
//  STATS WIDGET
// ─────────────────────────────────────────────────────────────
const StatsWidget = ({ stats, balances }) => (
  <View style={sw.wrapper}>
    {/* Dark hero */}
    <View style={sw.hero}>
      <View style={sw.blob1} />
      <View style={sw.blob2} />
      <View style={sw.heroRow}>
        <View style={sw.heroLeft}>
          <Text style={sw.eyebrow}>LEAVE MANAGEMENT</Text>
          <Text style={sw.heroNum}>{stats.total_requests}</Text>
          <View style={sw.heroBadges}>
            <View style={sw.heroBadge}>
              <Ionicons name="time" size={10} color="#FCD34D" />
              <Text style={[sw.heroBadgeTxt, { color: "#FCD34D" }]}>
                {stats.pending} pending review
              </Text>
            </View>
            <View
              style={[
                sw.heroBadge,
                { backgroundColor: "rgba(74,222,128,0.12)" },
              ]}
            >
              <Ionicons name="checkmark-circle" size={10} color="#4ADE80" />
              <Text style={sw.heroBadgeTxt}>{stats.approved} approved</Text>
            </View>
          </View>
          <Text style={sw.heroSub}>
            {stats.team_on_leave} team member
            {stats.team_on_leave !== 1 ? "s" : ""} on leave today
          </Text>
        </View>
        <View style={sw.heroRight}>
          <View style={sw.onLeaveCard}>
            <Text style={sw.onLeaveNum}>{stats.on_leave_today}</Text>
            <Text style={sw.onLeaveLabel}>On Leave{"\n"}Today</Text>
          </View>
        </View>
      </View>
    </View>

    {/* Balance tiles */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={sw.balanceRow}
    >
      {Object.entries(balances).map(([type, data]) => (
        <BalanceCard key={type} type={type} data={data} />
      ))}
    </ScrollView>
  </View>
);

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
    backgroundColor: "#7C3AED",
    opacity: 0.08,
    bottom: -40,
    left: 20,
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
  heroRight: { paddingLeft: 16 },
  onLeaveCard: {
    width: 72,
    height: 72,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  onLeaveNum: { fontSize: 26, fontWeight: "900", color: "#fff" },
  onLeaveLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.3,
    textAlign: "center",
  },
  balanceRow: { gap: 8, paddingRight: 4 },
});

// ─────────────────────────────────────────────────────────────
//  REQUEST CARD
// ─────────────────────────────────────────────────────────────
const RequestCard = ({
  request: r,
  onPress,
  onApprove,
  onReject,
  isManager,
}) => {
  const sm = STATUS_META[r.status];
  const ltm = LEAVE_TYPE_META[r.leave_type] || LEAVE_TYPE_META.annual;
  const color = avatarColor(r.employee_name);

  return (
    <TouchableOpacity
      style={rc.card}
      onPress={() => onPress(r)}
      activeOpacity={0.85}
    >
      {/* Top row */}
      <View style={rc.topRow}>
        <View style={[rc.avatar, { backgroundColor: color }]}>
          <Text style={rc.avatarTxt}>{getInitials(r.employee_name)}</Text>
        </View>
        <View style={rc.info}>
          <Text style={rc.name}>{r.employee_name}</Text>
          <Text style={rc.role} numberOfLines={1}>
            {r.employee_role}
          </Text>
          <View style={rc.deptRow}>
            <Ionicons name="business-outline" size={10} color={T.textMuted} />
            <Text style={rc.deptTxt}>{r.department}</Text>
          </View>
        </View>
        <View style={rc.rightCol}>
          <View style={[rc.statusBadge, { backgroundColor: sm.bg }]}>
            <Ionicons name={sm.icon} size={10} color={sm.color} />
            <Text style={[rc.statusTxt, { color: sm.text }]}>{sm.label}</Text>
          </View>
          <Text style={rc.timeAgoTxt}>{timeAgo(r.created_at)}</Text>
        </View>
      </View>

      {/* Leave type + dates */}
      <View
        style={[
          rc.leaveBlock,
          { backgroundColor: ltm.bg, borderColor: ltm.color + "30" },
        ]}
      >
        <View style={rc.leaveBlockLeft}>
          <View style={[rc.leaveIcon, { backgroundColor: ltm.color + "20" }]}>
            <Ionicons name={ltm.icon} size={14} color={ltm.color} />
          </View>
          <View>
            <Text style={[rc.leaveTypeTxt, { color: ltm.color }]}>
              {ltm.label}
            </Text>
            <Text style={rc.leaveDateRange}>
              {formatDateRange(r.start_date, r.end_date, r.days)}
            </Text>
          </View>
        </View>
        <View style={[rc.daysBadge, { backgroundColor: ltm.color }]}>
          <Text style={rc.daysNum}>{r.days}</Text>
          <Text style={rc.daysLabel}>day{r.days !== 1 ? "s" : ""}</Text>
        </View>
      </View>

      {/* Reason */}
      <Text style={rc.reason} numberOfLines={2}>
        {r.reason}
      </Text>

      {/* Balance impact */}
      {r.leave_type !== "unpaid" && r.balance_before !== null && (
        <View style={rc.balanceRow}>
          <Ionicons name="analytics-outline" size={12} color={T.textMuted} />
          <Text style={rc.balanceTxt}>Balance: </Text>
          <Text style={[rc.balanceNum, { color: T.blue }]}>
            {r.balance_before}
          </Text>
          <Ionicons name="arrow-forward" size={10} color={T.textMuted} />
          <Text
            style={[
              rc.balanceNum,
              { color: r.status === "approved" ? T.green : T.textSub },
            ]}
          >
            {r.balance_after}
          </Text>
          <Text style={rc.balanceTxt}> days remaining</Text>
        </View>
      )}

      {/* Cover person */}
      {r.cover_person && (
        <View style={rc.coverRow}>
          <Ionicons
            name="person-circle-outline"
            size={12}
            color={T.textMuted}
          />
          <Text style={rc.coverTxt}>
            Covered by{" "}
            <Text style={{ fontWeight: "700", color: T.text }}>
              {r.cover_person}
            </Text>
          </Text>
        </View>
      )}

      {/* Attachments */}
      {r.attachments?.length > 0 && (
        <View style={rc.attachRow}>
          <Ionicons name="attach" size={12} color={T.blue} />
          <Text style={rc.attachTxt}>
            {r.attachments.length} attachment
            {r.attachments.length > 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Approved by */}
      {r.status === "approved" && r.approved_by && (
        <View style={rc.approvedRow}>
          <Ionicons name="checkmark-circle" size={12} color={T.green} />
          <Text style={rc.approvedTxt}>
            Approved by{" "}
            <Text style={{ fontWeight: "700" }}>{r.approved_by}</Text> ·{" "}
            {timeAgo(r.approved_at)}
          </Text>
        </View>
      )}

      {/* Rejected reason */}
      {r.status === "rejected" && r.rejected_reason && (
        <View style={rc.rejectedRow}>
          <Ionicons name="close-circle" size={12} color={T.red} />
          <Text style={rc.rejectedTxt} numberOfLines={1}>
            {r.rejected_reason}
          </Text>
        </View>
      )}

      {/* Manager actions */}
      {isManager && r.status === "pending" && (
        <View style={rc.managerActions}>
          <TouchableOpacity style={rc.rejectBtn} onPress={() => onReject(r.id)}>
            <Ionicons name="close" size={13} color={T.red} />
            <Text style={rc.rejectBtnTxt}>Decline</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={rc.approveBtn}
            onPress={() => onApprove(r.id)}
          >
            <Ionicons name="checkmark" size={13} color="#fff" />
            <Text style={rc.approveBtnTxt}>Approve</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* View details */}
      <TouchableOpacity style={rc.viewRow} onPress={() => onPress(r)}>
        <Text style={rc.viewTxt}>View details</Text>
        <Ionicons name="chevron-forward" size={12} color={T.blue} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const rc = StyleSheet.create({
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
    gap: 11,
    marginBottom: 10,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 14, fontWeight: "800", color: "#fff" },
  info: { flex: 1 },
  name: { fontSize: 15, fontWeight: "700", color: T.text, marginBottom: 2 },
  role: { fontSize: 11, color: T.textMuted, marginBottom: 3 },
  deptRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  deptTxt: { fontSize: 10, color: T.textMuted, fontWeight: "500" },
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
  timeAgoTxt: { fontSize: 9, color: T.textMuted },

  leaveBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 12,
    padding: 11,
    marginBottom: 9,
    borderWidth: 1,
  },
  leaveBlockLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    flex: 1,
  },
  leaveIcon: {
    width: 32,
    height: 32,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveTypeTxt: { fontSize: 12, fontWeight: "700", marginBottom: 2 },
  leaveDateRange: { fontSize: 11, color: T.textSub, fontWeight: "500" },
  daysBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
    alignItems: "center",
    minWidth: 46,
  },
  daysNum: { fontSize: 16, fontWeight: "900", color: "#fff" },
  daysLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  reason: { fontSize: 12, color: T.textSub, lineHeight: 17, marginBottom: 7 },

  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginBottom: 5,
  },
  balanceTxt: { fontSize: 11, color: T.textMuted },
  balanceNum: { fontSize: 11, fontWeight: "800" },

  coverRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  coverTxt: { fontSize: 11, color: T.textMuted },

  attachRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  attachTxt: { fontSize: 11, color: T.blue, fontWeight: "600" },

  approvedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
  },
  approvedTxt: { fontSize: 11, color: T.green },

  rejectedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 5,
    flex: 1,
  },
  rejectedTxt: { flex: 1, fontSize: 11, color: T.red, fontStyle: "italic" },

  managerActions: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: T.red,
  },
  rejectBtnTxt: { fontSize: 12, fontWeight: "700", color: T.red },
  approveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: T.green,
  },
  approveBtnTxt: { fontSize: 12, fontWeight: "700", color: "#fff" },

  viewRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 3,
    paddingTop: 7,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  viewTxt: { fontSize: 11, fontWeight: "600", color: T.blue },
});

// ─────────────────────────────────────────────────────────────
//  DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const DetailModal = ({
  request: r,
  onClose,
  onApprove,
  onReject,
  isManager,
}) => {
  if (!r) return null;
  const sm = STATUS_META[r.status];
  const ltm = LEAVE_TYPE_META[r.leave_type] || LEAVE_TYPE_META.annual;
  const color = avatarColor(r.employee_name);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectInput, setShowRejectInput] = useState(false);

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
            <Text style={dm.headerTitle}>Leave Request</Text>
            <View style={[dm.statusPill, { backgroundColor: sm.bg }]}>
              <Ionicons name={sm.icon} size={12} color={sm.color} />
              <Text style={[dm.statusPillTxt, { color: sm.text }]}>
                {sm.label}
              </Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Employee hero */}
            <View style={[dm.hero, { backgroundColor: color + "12" }]}>
              <View style={[dm.heroAvatar, { backgroundColor: color }]}>
                <Text style={dm.heroAvatarTxt}>
                  {getInitials(r.employee_name)}
                </Text>
              </View>
              <Text style={dm.heroName}>{r.employee_name}</Text>
              <Text style={dm.heroRole}>{r.employee_role}</Text>
              <View style={dm.heroBadges}>
                <View style={[dm.heroBadge, { backgroundColor: ltm.bg }]}>
                  <Ionicons name={ltm.icon} size={11} color={ltm.color} />
                  <Text style={[dm.heroBadgeTxt, { color: ltm.color }]}>
                    {ltm.label}
                  </Text>
                </View>
                <View style={[dm.heroBadge, { backgroundColor: "#F1F5F9" }]}>
                  <Ionicons
                    name="business-outline"
                    size={11}
                    color={T.textSub}
                  />
                  <Text style={[dm.heroBadgeTxt, { color: T.textSub }]}>
                    {r.department}
                  </Text>
                </View>
              </View>
            </View>

            {/* Leave period */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Leave Period</Text>
              <View style={dm.periodCard}>
                <View style={dm.periodRow}>
                  <View style={dm.periodDate}>
                    <Text style={dm.periodLabel}>FROM</Text>
                    <Text style={dm.periodDateTxt}>
                      {formatDate(r.start_date)}
                    </Text>
                  </View>
                  <View style={dm.periodArrow}>
                    <Ionicons
                      name="arrow-forward"
                      size={18}
                      color={T.textMuted}
                    />
                    <View
                      style={[dm.daysBubble, { backgroundColor: ltm.color }]}
                    >
                      <Text style={dm.daysBubbleTxt}>{r.days}d</Text>
                    </View>
                  </View>
                  <View style={[dm.periodDate, { alignItems: "flex-end" }]}>
                    <Text style={dm.periodLabel}>TO</Text>
                    <Text style={dm.periodDateTxt}>
                      {formatDate(r.end_date)}
                    </Text>
                  </View>
                </View>
                {r.is_half_day && (
                  <View style={dm.halfDayTag}>
                    <Ionicons
                      name="partly-sunny-outline"
                      size={12}
                      color={T.orange}
                    />
                    <Text style={dm.halfDayTxt}>Half Day</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Reason */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Reason</Text>
              <View style={dm.reasonCard}>
                <Text style={dm.reasonTxt}>{r.reason}</Text>
                {r.notes && <Text style={dm.notesAddl}>{r.notes}</Text>}
              </View>
            </View>

            {/* Balance impact */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Balance Impact</Text>
              <View style={dm.balanceCard}>
                <View style={dm.balImpactRow}>
                  <View style={dm.balImpactItem}>
                    <Text style={dm.balImpactLabel}>Before</Text>
                    <Text style={[dm.balImpactNum, { color: T.blue }]}>
                      {r.balance_before ?? "—"}
                    </Text>
                    <Text style={dm.balImpactSub}>days</Text>
                  </View>
                  <View style={dm.balImpactDivider}>
                    <View
                      style={[
                        dm.balMinusBadge,
                        { backgroundColor: ltm.color + "20" },
                      ]}
                    >
                      <Ionicons name="remove" size={12} color={ltm.color} />
                      <Text style={[dm.balMinusTxt, { color: ltm.color }]}>
                        {r.days}d
                      </Text>
                    </View>
                  </View>
                  <View style={dm.balImpactItem}>
                    <Text style={dm.balImpactLabel}>After</Text>
                    <Text
                      style={[
                        dm.balImpactNum,
                        {
                          color: r.status === "approved" ? T.green : T.textSub,
                        },
                      ]}
                    >
                      {r.balance_after ?? "—"}
                    </Text>
                    <Text style={dm.balImpactSub}>days</Text>
                  </View>
                </View>
                <View style={dm.balBarBg}>
                  <View
                    style={[
                      dm.balBarFill,
                      {
                        width: `${balancePct(r.balance_before - r.balance_after, r.balance_before)}%`,
                        backgroundColor: ltm.color,
                      },
                    ]}
                  />
                </View>
                <Text style={dm.balNote}>
                  {ltm.label} · {r.balance_before} days available before request
                </Text>
              </View>
            </View>

            {/* Cover */}
            {r.cover_person && (
              <View style={dm.section}>
                <Text style={dm.sectionTitle}>Coverage</Text>
                <View style={dm.coverCard}>
                  <View
                    style={[
                      dm.coverAvatar,
                      { backgroundColor: avatarColor(r.cover_person) },
                    ]}
                  >
                    <Text style={dm.coverAvatarTxt}>
                      {getInitials(r.cover_person)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={dm.coverName}>{r.cover_person}</Text>
                    <Text style={dm.coverRole}>Covering during absence</Text>
                  </View>
                  <TouchableOpacity style={dm.msgBtn}>
                    <Ionicons name="mail-outline" size={14} color={T.blue} />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Attachments */}
            {r.attachments?.length > 0 && (
              <View style={dm.section}>
                <Text style={dm.sectionTitle}>Attachments</Text>
                {r.attachments.map((file, i) => (
                  <TouchableOpacity key={i} style={dm.attachItem}>
                    <View style={dm.attachIcon}>
                      <Ionicons
                        name="document-outline"
                        size={16}
                        color={T.blue}
                      />
                    </View>
                    <Text style={dm.attachName}>{file}</Text>
                    <Ionicons
                      name="download-outline"
                      size={16}
                      color={T.textMuted}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Timeline */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Timeline</Text>
              <View style={dm.timeline}>
                <View style={dm.timelineItem}>
                  <View style={[dm.timelineDot, { backgroundColor: T.blue }]} />
                  <View style={dm.timelineContent}>
                    <Text style={dm.timelineEvent}>Request submitted</Text>
                    <Text style={dm.timelineTime}>{timeAgo(r.created_at)}</Text>
                  </View>
                </View>
                {r.status === "approved" && (
                  <View style={dm.timelineItem}>
                    <View
                      style={[dm.timelineDot, { backgroundColor: T.green }]}
                    />
                    <View style={dm.timelineContent}>
                      <Text style={dm.timelineEvent}>
                        Approved by {r.approved_by}
                      </Text>
                      <Text style={dm.timelineTime}>
                        {timeAgo(r.approved_at)}
                      </Text>
                    </View>
                  </View>
                )}
                {r.status === "rejected" && r.rejected_reason && (
                  <View style={dm.timelineItem}>
                    <View
                      style={[dm.timelineDot, { backgroundColor: T.red }]}
                    />
                    <View style={dm.timelineContent}>
                      <Text style={dm.timelineEvent}>Declined</Text>
                      <Text style={dm.timelineRejected}>
                        {r.rejected_reason}
                      </Text>
                    </View>
                  </View>
                )}
                {r.status === "pending" && (
                  <View style={dm.timelineItem}>
                    <View
                      style={[
                        dm.timelineDot,
                        {
                          backgroundColor: T.orange,
                          borderWidth: 2,
                          borderColor: "#FDE68A",
                        },
                      ]}
                    />
                    <View style={dm.timelineContent}>
                      <Text style={[dm.timelineEvent, { color: T.orange }]}>
                        Awaiting manager review
                      </Text>
                    </View>
                  </View>
                )}
              </View>
            </View>

            {/* Reject input */}
            {showRejectInput && (
              <View style={dm.section}>
                <Text style={dm.sectionTitle}>Decline Reason</Text>
                <TextInput
                  style={dm.rejectInput}
                  value={rejectNote}
                  onChangeText={setRejectNote}
                  placeholder="Explain why this leave is being declined…"
                  placeholderTextColor={T.textMuted}
                  multiline
                  numberOfLines={3}
                />
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer */}
          {isManager && r.status === "pending" && (
            <View style={dm.footer}>
              {!showRejectInput ? (
                <>
                  <TouchableOpacity
                    style={dm.declineBtn}
                    onPress={() => setShowRejectInput(true)}
                  >
                    <Ionicons name="close" size={16} color={T.red} />
                    <Text style={dm.declineBtnTxt}>Decline</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={dm.approveBtn}
                    onPress={() => {
                      onApprove(r.id);
                      onClose();
                    }}
                  >
                    <Ionicons name="checkmark" size={16} color="#fff" />
                    <Text style={dm.approveBtnTxt}>Approve Leave</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <TouchableOpacity
                    style={dm.cancelRejectBtn}
                    onPress={() => setShowRejectInput(false)}
                  >
                    <Text style={dm.cancelRejectTxt}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      dm.declineConfirmBtn,
                      !rejectNote.trim() && { opacity: 0.5 },
                    ]}
                    onPress={() => {
                      if (!rejectNote.trim()) return;
                      onReject(r.id, rejectNote);
                      onClose();
                    }}
                  >
                    <Ionicons name="close-circle" size={16} color="#fff" />
                    <Text style={dm.declineConfirmTxt}>Confirm Decline</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
          {r.status === "approved" && (
            <View style={dm.footer}>
              <TouchableOpacity
                style={[dm.approveBtn, { backgroundColor: T.purple }]}
              >
                <Ionicons name="mail-outline" size={16} color="#fff" />
                <Text style={dm.approveBtnTxt}>Notify Employee</Text>
              </TouchableOpacity>
            </View>
          )}
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

  periodCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: T.border,
  },
  periodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  periodDate: { alignItems: "flex-start" },
  periodLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: T.textMuted,
    letterSpacing: 1,
    marginBottom: 4,
  },
  periodDateTxt: { fontSize: 14, fontWeight: "800", color: T.text },
  periodArrow: { alignItems: "center", gap: 5 },
  daysBubble: { paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8 },
  daysBubbleTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },
  halfDayTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  halfDayTxt: { fontSize: 11, color: T.orange, fontWeight: "600" },

  reasonCard: {
    backgroundColor: "#FFFBEB",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  reasonTxt: { fontSize: 13, color: "#78350F", lineHeight: 20 },
  notesAddl: {
    fontSize: 11,
    color: "#A16207",
    marginTop: 8,
    fontStyle: "italic",
  },

  balanceCard: {
    backgroundColor: "#F8FAFC",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  balImpactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  balImpactItem: { alignItems: "center", flex: 1 },
  balImpactLabel: {
    fontSize: 9,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  balImpactNum: { fontSize: 28, fontWeight: "900", letterSpacing: -1 },
  balImpactSub: { fontSize: 10, color: T.textMuted },
  balImpactDivider: { alignItems: "center", paddingHorizontal: 12 },
  balMinusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  balMinusTxt: { fontSize: 12, fontWeight: "800" },
  balBarBg: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    marginBottom: 8,
  },
  balBarFill: { height: 6, borderRadius: 3 },
  balNote: { fontSize: 10, color: T.textMuted, textAlign: "center" },

  coverCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  coverAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  coverAvatarTxt: { fontSize: 12, fontWeight: "800", color: "#fff" },
  coverName: { fontSize: 13, fontWeight: "700", color: T.text },
  coverRole: { fontSize: 11, color: T.textMuted },
  msgBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },

  attachItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 6,
  },
  attachIcon: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: T.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  attachName: { flex: 1, fontSize: 13, color: T.text, fontWeight: "500" },

  timeline: { gap: 0 },
  timelineItem: {
    flexDirection: "row",
    gap: 12,
    paddingBottom: 14,
    borderLeftWidth: 2,
    borderLeftColor: "#E2E8F0",
    marginLeft: 6,
    paddingLeft: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -22,
    marginTop: 2,
    flexShrink: 0,
  },
  timelineContent: { flex: 1 },
  timelineEvent: { fontSize: 13, fontWeight: "600", color: T.text },
  timelineTime: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  timelineRejected: {
    fontSize: 11,
    color: T.red,
    marginTop: 2,
    fontStyle: "italic",
  },

  rejectInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 13,
    borderWidth: 1.5,
    borderColor: T.red,
    fontSize: 13,
    color: T.text,
    textAlignVertical: "top",
    minHeight: 80,
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
  declineBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.red,
  },
  declineBtnTxt: { fontSize: 14, fontWeight: "700", color: T.red },
  approveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: T.green,
  },
  approveBtnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
  cancelRejectBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
  },
  cancelRejectTxt: { fontSize: 14, fontWeight: "600", color: T.textSub },
  declineConfirmBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: T.red,
  },
  declineConfirmTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  NEW REQUEST MODAL
// ─────────────────────────────────────────────────────────────
const NewRequestModal = ({ visible, onClose, onSubmit }) => {
  const [form, setForm] = useState({
    leave_type: "annual",
    start_date: "",
    end_date: "",
    is_half_day: false,
    reason: "",
    cover_person: "",
    notes: "",
  });

  const leaveTypes = Object.entries(LEAVE_TYPE_META).map(([key, val]) => ({
    key,
    ...val,
  }));

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={nr.overlay}>
        <View style={nr.sheet}>
          <View style={nr.handle} />
          <View style={nr.header}>
            <TouchableOpacity onPress={onClose} style={nr.closeBtn}>
              <Ionicons name="close" size={18} color="#64748B" />
            </TouchableOpacity>
            <Text style={nr.headerTitle}>New Leave Request</Text>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ padding: 20 }}
          >
            <Text style={nr.sectionLabel}>Leave Type</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={nr.typeGrid}
            >
              {leaveTypes.map((lt) => (
                <TouchableOpacity
                  key={lt.key}
                  style={[
                    nr.typeChip,
                    form.leave_type === lt.key && {
                      backgroundColor: lt.bg,
                      borderColor: lt.color,
                      borderWidth: 2,
                    },
                  ]}
                  onPress={() => setForm((p) => ({ ...p, leave_type: lt.key }))}
                >
                  <Ionicons
                    name={lt.icon}
                    size={14}
                    color={form.leave_type === lt.key ? lt.color : T.textMuted}
                  />
                  <Text
                    style={[
                      nr.typeChipTxt,
                      form.leave_type === lt.key && {
                        color: lt.color,
                        fontWeight: "700",
                      },
                    ]}
                  >
                    {lt.label.replace(" Leave", "")}
                  </Text>
                  {MOCK_BALANCES[lt.key] && (
                    <Text
                      style={[
                        nr.typeBalance,
                        form.leave_type === lt.key && { color: lt.color },
                      ]}
                    >
                      {MOCK_BALANCES[lt.key].remaining ?? "∞"}d
                    </Text>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={nr.dateRow}>
              <View style={{ flex: 1 }}>
                <Text style={nr.fieldLabel}>Start Date</Text>
                <TextInput
                  style={nr.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={T.textMuted}
                  value={form.start_date}
                  onChangeText={(v) =>
                    setForm((p) => ({ ...p, start_date: v }))
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={nr.fieldLabel}>End Date</Text>
                <TextInput
                  style={nr.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={T.textMuted}
                  value={form.end_date}
                  onChangeText={(v) => setForm((p) => ({ ...p, end_date: v }))}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[
                nr.halfDayToggle,
                form.is_half_day && nr.halfDayToggleActive,
              ]}
              onPress={() =>
                setForm((p) => ({ ...p, is_half_day: !p.is_half_day }))
              }
            >
              <Ionicons
                name={form.is_half_day ? "checkmark-circle" : "ellipse-outline"}
                size={18}
                color={form.is_half_day ? T.blue : T.textMuted}
              />
              <Text
                style={[
                  nr.halfDayTxt,
                  form.is_half_day && { color: T.blue, fontWeight: "700" },
                ]}
              >
                Half day only
              </Text>
            </TouchableOpacity>

            <Text style={nr.fieldLabel}>Reason for Leave</Text>
            <TextInput
              style={[nr.input, { height: 90, textAlignVertical: "top" }]}
              placeholder="Briefly describe the reason for your leave request…"
              placeholderTextColor={T.textMuted}
              multiline
              value={form.reason}
              onChangeText={(v) => setForm((p) => ({ ...p, reason: v }))}
            />

            <Text style={nr.fieldLabel}>Who will cover for you?</Text>
            <TextInput
              style={nr.input}
              placeholder="Colleague's name (optional)"
              placeholderTextColor={T.textMuted}
              value={form.cover_person}
              onChangeText={(v) => setForm((p) => ({ ...p, cover_person: v }))}
            />

            <Text style={nr.fieldLabel}>Additional Notes</Text>
            <TextInput
              style={[nr.input, { height: 60, textAlignVertical: "top" }]}
              placeholder="Any additional context or notes…"
              placeholderTextColor={T.textMuted}
              multiline
              value={form.notes}
              onChangeText={(v) => setForm((p) => ({ ...p, notes: v }))}
            />

            {/* Balance preview */}
            {form.leave_type && MOCK_BALANCES[form.leave_type] && (
              <View style={nr.balancePreview}>
                <Ionicons name="analytics-outline" size={14} color={T.blue} />
                <Text style={nr.balancePreviewTxt}>
                  {MOCK_BALANCES[form.leave_type].remaining ?? "Unlimited"} days
                  available · {MOCK_BALANCES[form.leave_type].pending} pending
                </Text>
              </View>
            )}

            <View style={{ height: 20 }} />
          </ScrollView>

          <View style={nr.footer}>
            <TouchableOpacity
              style={[
                nr.submitBtn,
                (!form.start_date || !form.reason.trim()) && { opacity: 0.5 },
              ]}
              onPress={() => {
                if (!form.start_date || !form.reason.trim()) return;
                onSubmit(form);
                onClose();
                Alert.alert(
                  "Leave Request Submitted",
                  "Your manager will be notified for review.",
                );
              }}
            >
              <Ionicons name="paper-plane-outline" size={16} color="#fff" />
              <Text style={nr.submitBtnTxt}>Submit Request</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const nr = StyleSheet.create({
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
  sectionLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: T.text,
    marginBottom: 8,
  },
  typeGrid: { gap: 8, paddingBottom: 4, paddingRight: 4 },
  typeChip: {
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#F8FAFC",
    minWidth: 80,
  },
  typeChipTxt: {
    fontSize: 10,
    fontWeight: "600",
    color: T.textSub,
    textAlign: "center",
  },
  typeBalance: { fontSize: 9, color: T.textMuted, fontWeight: "700" },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: T.text,
    marginBottom: 7,
    marginTop: 14,
  },
  dateRow: { flexDirection: "row", gap: 10 },
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
  halfDayToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
    paddingHorizontal: 4,
  },
  halfDayToggleActive: {},
  halfDayTxt: { fontSize: 13, color: T.textSub },
  balancePreview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: T.blueSoft,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#BFDBFE",
  },
  balancePreviewTxt: { fontSize: 12, color: T.blue, fontWeight: "600" },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  submitBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: T.blue,
    paddingVertical: 14,
    borderRadius: 14,
  },
  submitBtnTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
const STATUS_TABS = ["All", "pending", "approved", "rejected", "cancelled"];
const IS_MANAGER = true; // toggle for manager vs employee view

export default function LeaveRequestScreen() {
  const [requests, setRequests] = useState(MOCK_LEAVE_REQUESTS);
  const [selectedReq, setSelectedReq] = useState(null);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filtered = useMemo(() => {
    let list = [...requests];
    if (activeTab !== "All") list = list.filter((r) => r.status === activeTab);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (r) =>
          r.employee_name.toLowerCase().includes(q) ||
          r.leave_type.toLowerCase().includes(q) ||
          r.department.toLowerCase().includes(q),
      );
    }
    return list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }, [requests, activeTab, search]);

  const handleApprove = useCallback((id) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "approved",
              approved_by: "You",
              approved_at: new Date().toISOString(),
            }
          : r,
      ),
    );
  }, []);

  const handleReject = useCallback((id, reason) => {
    setRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: "rejected",
              rejected_reason: reason || "Request declined.",
            }
          : r,
      ),
    );
  }, []);

  const handleSubmitNew = useCallback((form) => {
    const newReq = {
      id: Date.now(),
      employee_name: "You",
      employee_role: "Current User",
      department: "Your Department",
      avatar_color: "#0A66C2",
      leave_type: form.leave_type,
      status: "pending",
      start_date: form.start_date,
      end_date: form.end_date || form.start_date,
      days: 1,
      reason: form.reason,
      notes: form.notes,
      approved_by: null,
      approved_at: null,
      rejected_reason: null,
      created_at: new Date().toISOString(),
      attachments: [],
      balance_before: MOCK_BALANCES[form.leave_type]?.remaining ?? null,
      balance_after: (MOCK_BALANCES[form.leave_type]?.remaining ?? 1) - 1,
      is_half_day: form.is_half_day,
      cover_person: form.cover_person || null,
    };
    setRequests((prev) => [newReq, ...prev]);
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 700);
  }, []);

  const pendingRequests = requests.filter((r) => r.status === "pending");

  const ListHeader = () => (
    <>
      {/* Title row */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Leave Requests</Text>
          <Text style={s.pageSub}>
            {MOCK_STATS.pending} pending · {MOCK_STATS.approved} approved
          </Text>
        </View>
        <TouchableOpacity
          style={s.newBtn}
          onPress={() => setShowNewRequest(true)}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={s.newBtnTxt}>New Request</Text>
        </TouchableOpacity>
      </View>

      {/* Stats + Balances */}
      <StatsWidget stats={MOCK_STATS} balances={MOCK_BALANCES} />

      {/* Pending banner */}
      {IS_MANAGER && pendingRequests.length > 0 && (
        <View style={s.pendingBanner}>
          <View style={s.pendingBannerLeft}>
            <Ionicons name="time" size={15} color={T.orange} />
            <Text style={s.pendingBannerTxt}>
              {pendingRequests.length} request
              {pendingRequests.length > 1 ? "s" : ""} awaiting your approval
            </Text>
          </View>
          <TouchableOpacity onPress={() => setActiveTab("pending")}>
            <Text style={s.reviewNow}>Review →</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Search */}
      <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
        <Ionicons
          name="search-outline"
          size={16}
          color={searchFocused ? T.blue : T.textMuted}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search by name, type, department…"
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
              ? requests.length
              : requests.filter((r) => r.status === tab).length;
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
    </>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <RequestCard
            request={item}
            onPress={setSelectedReq}
            onApprove={handleApprove}
            onReject={handleReject}
            isManager={IS_MANAGER}
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
            <Ionicons name="calendar-outline" size={54} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No leave requests</Text>
            <Text style={s.emptySub}>
              Requests will appear here once submitted
            </Text>
          </View>
        }
      />

      <DetailModal
        request={selectedReq}
        onClose={() => setSelectedReq(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        isManager={IS_MANAGER}
      />

      <NewRequestModal
        visible={showNewRequest}
        onClose={() => setShowNewRequest(false)}
        onSubmit={handleSubmitNew}
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
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.blue,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  newBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },

  pendingBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 14,
    marginBottom: 10,
    backgroundColor: T.orangeSoft,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  pendingBannerLeft: { flexDirection: "row", alignItems: "center", gap: 7 },
  pendingBannerTxt: { fontSize: 12, fontWeight: "700", color: T.orange },
  reviewNow: { fontSize: 12, fontWeight: "800", color: T.orange },

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

  empty: { padding: 48, alignItems: "center", gap: 8 },
  emptyTxt: { fontSize: 15, color: "#94A3B8", fontWeight: "700" },
  emptySub: { fontSize: 13, color: "#CBD5E1", textAlign: "center" },
});
