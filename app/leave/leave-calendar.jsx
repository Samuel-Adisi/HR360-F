import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

// ─────────────────────────────────────────────────────────────
//  THEME — matches established HRM app palette
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
const MOCK_LEAVES = [
  {
    id: 1,
    emp_id: "EMP001",
    name: "James Rodriguez",
    department: "Marketing",
    leave_type: "Annual Leave",
    start_date: "2025-07-02",
    end_date: "2025-07-04",
    days: 3,
    status: "approved",
    reason: "Family vacation",
  },
  {
    id: 2,
    emp_id: "EMP002",
    name: "Sarah Mitchell",
    department: "Engineering",
    leave_type: "Sick Leave",
    start_date: "2025-07-07",
    end_date: "2025-07-07",
    days: 1,
    status: "approved",
    reason: "Medical appointment",
  },
  {
    id: 3,
    emp_id: "EMP003",
    name: "Alex Chen",
    department: "Design",
    leave_type: "Casual Leave",
    start_date: "2025-07-10",
    end_date: "2025-07-11",
    days: 2,
    status: "pending",
    reason: "Personal work",
  },
  {
    id: 4,
    emp_id: "EMP001",
    name: "James Rodriguez",
    department: "Marketing",
    leave_type: "Casual Leave",
    start_date: "2025-07-14",
    end_date: "2025-07-14",
    days: 1,
    status: "pending",
    reason: "Errand",
  },
  {
    id: 5,
    emp_id: "EMP004",
    name: "Priya Nair",
    department: "HR",
    leave_type: "Annual Leave",
    start_date: "2025-07-16",
    end_date: "2025-07-22",
    days: 5,
    status: "approved",
    reason: "Holiday trip",
  },
  {
    id: 6,
    emp_id: "EMP002",
    name: "Sarah Mitchell",
    department: "Engineering",
    leave_type: "Study Leave",
    start_date: "2025-07-21",
    end_date: "2025-07-23",
    days: 3,
    status: "approved",
    reason: "AWS certification exam",
  },
  {
    id: 7,
    emp_id: "EMP005",
    name: "Marcus Webb",
    department: "Sales",
    leave_type: "Sick Leave",
    start_date: "2025-07-28",
    end_date: "2025-07-29",
    days: 2,
    status: "rejected",
    reason: "Flu",
  },
  {
    id: 8,
    emp_id: "EMP003",
    name: "Alex Chen",
    department: "Design",
    leave_type: "Annual Leave",
    start_date: "2025-07-30",
    end_date: "2025-07-31",
    days: 2,
    status: "approved",
    reason: "Weekend getaway",
  },
];

const MOCK_STATS = {
  on_leave_today: 1,
  approved_this_month: 5,
  pending_approval: 2,
  total_days_off: 17,
};

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const LEAVE_TYPE_META = {
  "Annual Leave": { color: "#0A66C2", icon: "sunny-outline", soft: "#EFF6FF" },
  "Sick Leave": { color: "#DC2626", icon: "medical-outline", soft: "#FEF2F2" },
  "Casual Leave": { color: "#7C3AED", icon: "cafe-outline", soft: "#EDE9FE" },
  "Maternity Leave": {
    color: "#DB2777",
    icon: "heart-outline",
    soft: "#FCE7F3",
  },
  "Paternity Leave": {
    color: "#0891B2",
    icon: "person-outline",
    soft: "#ECFEFF",
  },
  "Study Leave": { color: "#D97706", icon: "book-outline", soft: "#FEF3C7" },
  "Unpaid Leave": { color: "#64748B", icon: "ban-outline", soft: "#F1F5F9" },
};

const STATUS_META = {
  approved: {
    color: T.green,
    soft: T.greenSoft,
    icon: "checkmark-circle",
    label: "Approved",
  },
  pending: {
    color: T.orange,
    soft: T.orangeSoft,
    icon: "time-outline",
    label: "Pending",
  },
  rejected: {
    color: T.red,
    soft: T.redSoft,
    icon: "close-circle",
    label: "Rejected",
  },
};

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
const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
const getTypeMeta = (type) =>
  LEAVE_TYPE_META[type] || {
    color: "#6366F1",
    icon: "calendar-outline",
    soft: "#EEF2FF",
  };

// Parse "YYYY-MM-DD" without timezone shift
const parseDate = (str) => {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const isSameDay = (a, b) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

const isInRange = (day, start, end) => day >= start && day <= end;

// ─────────────────────────────────────────────────────────────
//  HERO STATS WIDGET
// ─────────────────────────────────────────────────────────────
const HeroWidget = ({ stats, month, year }) => (
  <View style={hw.wrapper}>
    <View style={hw.hero}>
      <View style={hw.blob1} />
      <View style={hw.blob2} />
      <View style={hw.heroRow}>
        <View style={hw.heroLeft}>
          <Text style={hw.eyebrow}>LEAVE CALENDAR</Text>
          <Text style={hw.heroMonth}>{MONTHS[month]}</Text>
          <Text style={hw.heroYear}>{year}</Text>
          <View style={hw.badges}>
            <View style={hw.badge}>
              <Ionicons name="checkmark-circle" size={10} color="#4ADE80" />
              <Text style={hw.badgeTxt}>
                {stats.approved_this_month} approved
              </Text>
            </View>
            <View
              style={[hw.badge, { backgroundColor: "rgba(251,191,36,0.12)" }]}
            >
              <Ionicons name="time-outline" size={10} color="#FBBF24" />
              <Text style={[hw.badgeTxt, { color: "#FBBF24" }]}>
                {stats.pending_approval} pending
              </Text>
            </View>
          </View>
        </View>
        <View style={hw.heroRight}>
          <View style={hw.ringWrap}>
            <Text style={hw.ringNum}>{stats.total_days_off}</Text>
            <Text style={hw.ringLabel}>Days Off</Text>
          </View>
        </View>
      </View>
    </View>

    {/* Stat tiles */}
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={hw.tilesRow}
    >
      {[
        {
          val: stats.on_leave_today,
          label: "On Leave Today",
          icon: "person-remove-outline",
          color: T.red,
        },
        {
          val: stats.approved_this_month,
          label: "Approved",
          icon: "checkmark-circle-outline",
          color: T.green,
        },
        {
          val: stats.pending_approval,
          label: "Pending",
          icon: "time-outline",
          color: T.orange,
        },
        {
          val: stats.total_days_off,
          label: "Total Days",
          icon: "calendar-outline",
          color: T.blue,
        },
      ].map((t) => (
        <View key={t.label} style={hw.tile}>
          <View style={[hw.tileIcon, { backgroundColor: t.color + "18" }]}>
            <Ionicons name={t.icon} size={14} color={t.color} />
          </View>
          <Text style={hw.tileVal}>{t.val}</Text>
          <Text style={hw.tileLbl}>{t.label}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const hw = StyleSheet.create({
  wrapper: { paddingHorizontal: 14, marginBottom: 10 },
  hero: {
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  blob1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#0A66C2",
    opacity: 0.09,
    top: -70,
    right: -50,
  },
  blob2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#7C3AED",
    opacity: 0.08,
    bottom: -50,
    left: 20,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: { flex: 1, gap: 5 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1.5,
  },
  heroMonth: {
    fontSize: 34,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
    lineHeight: 38,
  },
  heroYear: {
    fontSize: 14,
    fontWeight: "700",
    color: "rgba(255,255,255,0.4)",
    marginTop: -4,
  },
  badges: { flexDirection: "row", gap: 8, flexWrap: "wrap", marginTop: 4 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(74,222,128,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTxt: { fontSize: 10, color: "#4ADE80", fontWeight: "700" },
  heroRight: { alignItems: "center", paddingLeft: 16 },
  ringWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
  ringNum: { fontSize: 22, fontWeight: "900", color: "#fff" },
  ringLabel: {
    fontSize: 8,
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
    minWidth: 82,
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
    fontSize: 18,
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
    textAlign: "center",
  },
});

// ─────────────────────────────────────────────────────────────
//  CALENDAR GRID
// ─────────────────────────────────────────────────────────────
const CalendarGrid = ({ month, year, leaves, selectedDate, onSelectDate }) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  // Build array: nulls for leading blanks + day numbers
  const cells = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  // Pad to complete grid rows
  while (cells.length % 7 !== 0) cells.push(null);

  const getDayLeaves = (day) => {
    if (!day) return [];
    const d = new Date(year, month, day);
    return leaves.filter((l) => {
      const s = parseDate(l.start_date);
      const e = parseDate(l.end_date);
      return isInRange(d, s, e);
    });
  };

  const rows = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <View style={cg.wrap}>
      {/* Day headers */}
      <View style={cg.headerRow}>
        {DAYS_SHORT.map((d, i) => (
          <View key={d} style={cg.headerCell}>
            <Text style={[cg.headerTxt, (i === 0 || i === 6) && cg.weekend]}>
              {d}
            </Text>
          </View>
        ))}
      </View>

      {/* Grid rows */}
      {rows.map((row, ri) => (
        <View key={ri} style={cg.row}>
          {row.map((day, ci) => {
            const dayLeaves = getDayLeaves(day);
            const isToday = day && isSameDay(new Date(year, month, day), today);
            const isSelected =
              day &&
              selectedDate &&
              isSameDay(new Date(year, month, day), selectedDate);
            const isWeekend = ci === 0 || ci === 6;
            const hasLeaves = dayLeaves.length > 0;
            const dotColors = [
              ...new Set(dayLeaves.map((l) => getTypeMeta(l.leave_type).color)),
            ].slice(0, 3);

            return (
              <TouchableOpacity
                key={ci}
                style={[
                  cg.cell,
                  isWeekend && cg.weekendCell,
                  isToday && cg.todayCell,
                  isSelected && cg.selectedCell,
                  hasLeaves && !isSelected && !isToday && cg.hasLeavesCell,
                ]}
                onPress={() => day && onSelectDate(new Date(year, month, day))}
                activeOpacity={day ? 0.7 : 1}
              >
                {day ? (
                  <>
                    <Text
                      style={[
                        cg.dayNum,
                        isWeekend && cg.weekendNum,
                        isToday && cg.todayNum,
                        isSelected && cg.selectedNum,
                      ]}
                    >
                      {day}
                    </Text>
                    {/* Leave dots */}
                    {dotColors.length > 0 && (
                      <View style={cg.dotsRow}>
                        {dotColors.map((c, di) => (
                          <View
                            key={di}
                            style={[
                              cg.dot,
                              { backgroundColor: isSelected ? "#fff" : c },
                            ]}
                          />
                        ))}
                      </View>
                    )}
                    {/* Count badge if > 1 employee */}
                    {dayLeaves.length > 1 && (
                      <View
                        style={[
                          cg.countBadge,
                          isSelected && cg.countBadgeSelected,
                        ]}
                      >
                        <Text
                          style={[cg.countTxt, isSelected && { color: T.blue }]}
                        >
                          {dayLeaves.length}
                        </Text>
                      </View>
                    )}
                  </>
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
};

const CELL_SIZE = 44;

const cg = StyleSheet.create({
  wrap: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    marginHorizontal: 14,
    marginBottom: 12,
  },
  headerRow: { flexDirection: "row", marginBottom: 6 },
  headerCell: { flex: 1, alignItems: "center", paddingVertical: 6 },
  headerTxt: {
    fontSize: 10,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  weekend: { color: "#CBD5E1" },
  row: { flexDirection: "row" },
  cell: {
    flex: 1,
    height: CELL_SIZE,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    margin: 1,
    gap: 2,
    position: "relative",
  },
  weekendCell: { backgroundColor: "#F8FAFC" },
  todayCell: { backgroundColor: T.navy },
  selectedCell: { backgroundColor: T.blue },
  hasLeavesCell: { backgroundColor: "#F0F7FF" },
  dayNum: { fontSize: 13, fontWeight: "700", color: T.text },
  weekendNum: { color: "#94A3B8" },
  todayNum: { color: "#fff", fontWeight: "900" },
  selectedNum: { color: "#fff", fontWeight: "900" },
  dotsRow: { flexDirection: "row", gap: 3, alignItems: "center" },
  dot: { width: 5, height: 5, borderRadius: 2.5 },
  countBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: T.blue,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  countBadgeSelected: { backgroundColor: "#fff" },
  countTxt: { fontSize: 8, fontWeight: "900", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  LEAVE EVENT ROW
// ─────────────────────────────────────────────────────────────
const LeaveEventRow = ({ item }) => {
  const meta = getTypeMeta(item.leave_type);
  const status = STATUS_META[item.status];
  const color = avatarColor(item.name);

  return (
    <View style={lr.card}>
      <View style={[lr.bar, { backgroundColor: meta.color }]} />
      <View style={lr.inner}>
        <View style={lr.topRow}>
          <View style={[lr.avatar, { backgroundColor: color }]}>
            <Text style={lr.avatarTxt}>{getInitials(item.name)}</Text>
          </View>
          <View style={lr.info}>
            <Text style={lr.name}>{item.name}</Text>
            <View style={lr.metaRow}>
              <Text style={lr.metaTxt}>{item.emp_id}</Text>
              <View style={lr.dot} />
              <Text style={lr.metaTxt}>{item.department}</Text>
            </View>
          </View>
          <View style={[lr.statusBadge, { backgroundColor: status.soft }]}>
            <Ionicons name={status.icon} size={11} color={status.color} />
            <Text style={[lr.statusTxt, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={lr.detailsRow}>
          <View style={[lr.typePill, { backgroundColor: meta.soft }]}>
            <Ionicons name={meta.icon} size={11} color={meta.color} />
            <Text style={[lr.typeTxt, { color: meta.color }]}>
              {item.leave_type}
            </Text>
          </View>
          <View style={lr.dateRange}>
            <Ionicons name="calendar-outline" size={11} color={T.textMuted} />
            <Text style={lr.dateTxt}>
              {item.start_date === item.end_date
                ? item.start_date
                : `${item.start_date} → ${item.end_date}`}
            </Text>
          </View>
          <View style={lr.daysBadge}>
            <Text style={lr.daysTxt}>{item.days}d</Text>
          </View>
        </View>

        {item.reason ? (
          <View style={lr.reasonRow}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={11}
              color={T.textMuted}
            />
            <Text style={lr.reasonTxt} numberOfLines={1}>
              {item.reason}
            </Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const lr = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  bar: { width: 4 },
  inner: { flex: 1, padding: 12, gap: 8 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 9 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 12, fontWeight: "800", color: "#fff" },
  info: { flex: 1 },
  name: { fontSize: 13, fontWeight: "700", color: T.text },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  metaTxt: { fontSize: 10, color: T.textMuted },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: T.border },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusTxt: { fontSize: 10, fontWeight: "700" },
  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    flexWrap: "wrap",
  },
  typePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeTxt: { fontSize: 10, fontWeight: "700" },
  dateRange: { flexDirection: "row", alignItems: "center", gap: 4, flex: 1 },
  dateTxt: { fontSize: 10, color: T.textSub, fontWeight: "600" },
  daysBadge: {
    backgroundColor: T.navy,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  daysTxt: { fontSize: 10, fontWeight: "900", color: "#fff" },
  reasonRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  reasonTxt: { fontSize: 11, color: T.textMuted, flex: 1, fontStyle: "italic" },
});

// ─────────────────────────────────────────────────────────────
//  LEAVE LEGEND
// ─────────────────────────────────────────────────────────────
const LeaveLegend = ({ leaves }) => {
  const types = [...new Set(leaves.map((l) => l.leave_type))];
  return (
    <View style={ll.wrap}>
      <Text style={ll.title}>LEGEND</Text>
      <View style={ll.row}>
        {types.map((t) => {
          const m = getTypeMeta(t);
          return (
            <View key={t} style={ll.item}>
              <View style={[ll.dot, { backgroundColor: m.color }]} />
              <Text style={ll.lbl}>{t}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const ll = StyleSheet.create({
  wrap: {
    marginHorizontal: 14,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
    marginBottom: 12,
  },
  title: {
    fontSize: 9,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  row: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  item: { flexDirection: "row", alignItems: "center", gap: 5 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  lbl: { fontSize: 10, fontWeight: "600", color: T.textSub },
});

// ─────────────────────────────────────────────────────────────
//  STATUS FILTER TABS
// ─────────────────────────────────────────────────────────────
const STATUS_TABS = [
  { key: "", label: "All" },
  { key: "approved", label: "Approved", color: T.green },
  { key: "pending", label: "Pending", color: T.orange },
  { key: "rejected", label: "Rejected", color: T.red },
];

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function LeaveCalendarScreen() {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 6 = July
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");

  const navigateMonth = (dir) => {
    let m = currentMonth + dir;
    let y = currentYear;
    if (m < 0) {
      m = 11;
      y -= 1;
    }
    if (m > 11) {
      m = 0;
      y += 1;
    }
    setCurrentMonth(m);
    setCurrentYear(y);
    setSelectedDate(null);
  };

  // Leaves for current month
  const monthLeaves = useMemo(() => {
    return MOCK_LEAVES.filter((l) => {
      const s = parseDate(l.start_date);
      const e = parseDate(l.end_date);
      const monthStart = new Date(currentYear, currentMonth, 1);
      const monthEnd = new Date(currentYear, currentMonth + 1, 0);
      return s <= monthEnd && e >= monthStart;
    });
  }, [currentMonth, currentYear]);

  // Leaves for selected date (or all month if none selected)
  const displayLeaves = useMemo(() => {
    let base = selectedDate
      ? MOCK_LEAVES.filter((l) => {
          const s = parseDate(l.start_date);
          const e = parseDate(l.end_date);
          return isInRange(selectedDate, s, e);
        })
      : monthLeaves;
    if (statusFilter) base = base.filter((l) => l.status === statusFilter);
    return base;
  }, [selectedDate, monthLeaves, statusFilter]);

  const selectedLabel = selectedDate
    ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]}`
    : `All of ${MONTHS[currentMonth]}`;

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      <FlatList
        data={displayLeaves}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={s.listContent}
        ListHeaderComponent={() => (
          <>
            {/* Title row */}
            <View style={s.titleRow}>
              <View>
                <Text style={s.pageTitle}>Leave Calendar</Text>
                <Text style={s.pageSub}>
                  {MONTHS[currentMonth]} {currentYear}
                </Text>
              </View>
              <TouchableOpacity
                style={s.todayBtn}
                onPress={() => {
                  setCurrentMonth(today.getMonth());
                  setCurrentYear(today.getFullYear());
                  setSelectedDate(today);
                }}
              >
                <Ionicons name="today-outline" size={14} color={T.blue} />
                <Text style={s.todayBtnTxt}>Today</Text>
              </TouchableOpacity>
            </View>

            {/* Hero */}
            <HeroWidget
              stats={MOCK_STATS}
              month={currentMonth}
              year={currentYear}
            />

            {/* Month navigator */}
            <View style={s.monthNav}>
              <TouchableOpacity
                style={s.navBtn}
                onPress={() => navigateMonth(-1)}
              >
                <Ionicons name="chevron-back" size={18} color={T.text} />
              </TouchableOpacity>
              <Text style={s.monthLabel}>
                {MONTHS[currentMonth]} {currentYear}
              </Text>
              <TouchableOpacity
                style={s.navBtn}
                onPress={() => navigateMonth(1)}
              >
                <Ionicons name="chevron-forward" size={18} color={T.text} />
              </TouchableOpacity>
            </View>

            {/* Calendar grid */}
            <CalendarGrid
              month={currentMonth}
              year={currentYear}
              leaves={monthLeaves}
              selectedDate={selectedDate}
              onSelectDate={(d) =>
                setSelectedDate(
                  isSameDay(d, selectedDate ?? new Date(0)) ? null : d,
                )
              }
            />

            {/* Legend */}
            <LeaveLegend leaves={monthLeaves} />

            {/* Section header + status filters */}
            <View style={s.sectionHeader}>
              <View style={s.sectionLeft}>
                <View style={s.sectionDot} />
                <Text style={s.sectionTitle}>{selectedLabel}</Text>
                <View style={s.countPill}>
                  <Text style={s.countPillTxt}>{displayLeaves.length}</Text>
                </View>
              </View>
            </View>

            {/* Status tabs */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.tabsRow}
            >
              {STATUS_TABS.map((tab) => {
                const isActive = statusFilter === tab.key;
                return (
                  <TouchableOpacity
                    key={tab.key}
                    style={[
                      s.tab,
                      isActive && {
                        backgroundColor: tab.color || T.navy,
                        borderColor: tab.color || T.navy,
                      },
                    ]}
                    onPress={() => setStatusFilter(isActive ? "" : tab.key)}
                  >
                    {tab.color && (
                      <View
                        style={[
                          s.tabDot,
                          { backgroundColor: isActive ? "#fff" : tab.color },
                        ]}
                      />
                    )}
                    <Text style={[s.tabTxt, isActive && s.tabTxtActive]}>
                      {tab.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 14 }}>
            <LeaveEventRow item={item} />
          </View>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="calendar-outline" size={52} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No leaves found</Text>
            <Text style={s.emptySub}>
              {selectedDate
                ? "No leaves recorded for this date."
                : "No leaves this month."}
            </Text>
          </View>
        }
        ListFooterComponent={<View style={{ height: 40 }} />}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  listContent: { paddingTop: 0, paddingBottom: 20 },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingTop: 16,
    paddingBottom: 12,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  todayBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: T.blue,
    backgroundColor: T.blueSoft,
  },
  todayBtnTxt: { fontSize: 12, fontWeight: "700", color: T.blue },

  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  monthLabel: { fontSize: 16, fontWeight: "800", color: T.text },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionDot: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: T.blue,
  },
  sectionTitle: { fontSize: 14, fontWeight: "800", color: T.text },
  countPill: {
    backgroundColor: T.blue,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    minWidth: 22,
    alignItems: "center",
  },
  countPillTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },

  tabsRow: { gap: 8, paddingHorizontal: 14, paddingBottom: 12 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.border,
  },
  tabDot: { width: 7, height: 7, borderRadius: 3.5 },
  tabTxt: { fontSize: 11, fontWeight: "600", color: T.textSub },
  tabTxtActive: { color: "#fff", fontWeight: "700" },

  empty: { padding: 48, alignItems: "center", gap: 10 },
  emptyTxt: { fontSize: 15, color: T.textMuted, fontWeight: "700" },
  emptySub: { fontSize: 13, color: "#CBD5E1", textAlign: "center" },
});
