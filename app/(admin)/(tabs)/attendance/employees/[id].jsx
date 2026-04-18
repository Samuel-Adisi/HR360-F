import { useLocalSearchParams, useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ClockIcon,
  EnvelopeIcon,
  ExclamationCircleIcon,
  FingerPrintIcon,
  IdentificationIcon,
  ShieldCheckIcon,
} from "react-native-heroicons/outline";

// ─── Design tokens ────────────────────────────────────────────────────────────
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
  green: "#059669",
  greenBg: "#DCFCE7",
  greenText: "#15803D",
  red: "#DC2626",
  redBg: "#FEE2E2",
  redText: "#B91C1C",
  amber: "#D97706",
  amberBg: "#FEF3C7",
  amberText: "#92400E",
  blue: "#0A66C2",
  blueBg: "#EFF6FF",
  blueText: "#1D4ED8",
  purple: "#7C3AED",
  purpleBg: "#F5F3FF",
  orange: "#F97316",
  orangeBg: "#FFF7ED",
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Present: { bg: C.greenBg, text: C.greenText, dot: C.green },
  Absent: { bg: C.redBg, text: C.redText, dot: C.red },
  Late: { bg: C.amberBg, text: C.amberText, dot: C.amber },
  "On Leave": { bg: C.blueBg, text: C.blueText, dot: C.blue },
};

// ─── Mock data — mirrors EmployeeAttendanceDetail API response exactly ────────
// TODO: replace with GET /api/attendance/employees/<user_id>/?period=<period>
const MOCK_DETAIL = {
  employee: {
    id: 1,
    name: "Kwame Asante",
    email: "kwame.asante@hr360.io",
    department: "Engineering",
  },
  period: {
    type: "monthly",
    start: "2025-06-11",
    end: "2025-07-10",
    total_days: 30,
  },
  today: {
    status: "Present",
    check_in: "08:47:00",
    check_out: null,
    hours_worked: 0.0,
    is_checked_in: true,
    is_checked_out: false,
  },
  summary: {
    days_present: 22,
    days_absent: 3,
    days_late: 4,
    days_on_leave: 1,
    total_hours_worked: 172.5,
    overtime_hours: 8.5,
    attendance_rate: 73.3,
  },
  history: [
    {
      date: "2025-07-10",
      status: "Present",
      check_in: "08:47:00",
      check_out: null,
      hours_worked: 0.0,
      face_verified: true,
    },
    {
      date: "2025-07-09",
      status: "Present",
      check_in: "08:31:00",
      check_out: "17:00:00",
      hours_worked: 8.5,
      face_verified: true,
    },
    {
      date: "2025-07-08",
      status: "Late",
      check_in: "09:14:00",
      check_out: "17:02:00",
      hours_worked: 7.8,
      face_verified: true,
    },
    {
      date: "2025-07-07",
      status: "Absent",
      check_in: null,
      check_out: null,
      hours_worked: 0.0,
      face_verified: false,
    },
    {
      date: "2025-07-04",
      status: "On Leave",
      check_in: null,
      check_out: null,
      hours_worked: 0.0,
      face_verified: false,
    },
    {
      date: "2025-07-03",
      status: "Present",
      check_in: "08:55:00",
      check_out: "17:10:00",
      hours_worked: 8.2,
      face_verified: false,
    },
    {
      date: "2025-07-02",
      status: "Present",
      check_in: "08:40:00",
      check_out: "17:00:00",
      hours_worked: 8.3,
      face_verified: true,
    },
    {
      date: "2025-07-01",
      status: "Late",
      check_in: "09:30:00",
      check_out: "17:00:00",
      hours_worked: 7.5,
      face_verified: true,
    },
  ],
};

const PERIODS = ["daily", "weekly", "monthly"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(t) {
  if (!t) return "--:--";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getAvatarUri(name) {
  return `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(name)}&backgroundColor=0F766E&textColor=ffffff&fontSize=38`;
}

// ─── Reusable sub-components ──────────────────────────────────────────────────

// Solid square icon — matches profile index exactly
function IconSquare({ icon: Icon, color, size = 34 }) {
  return (
    <View
      style={[
        p.iconSquare,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size * 0.27,
        },
      ]}
    >
      <Icon size={size * 0.44} color="#FFFFFF" strokeWidth={2} />
    </View>
  );
}

function GroupLabel({ title }) {
  return (
    <View style={p.sectionHeaderRow}>
      <View style={p.sectionBarAccent} />
      <Text style={p.sectionTitle}>{title}</Text>
    </View>
  );
}

function InfoRow({ icon: Icon, iconColor, label, value, last }) {
  return (
    <>
      <View style={p.row}>
        <IconSquare icon={Icon} color={iconColor} size={34} />
        <View style={p.rowTexts}>
          <Text style={p.rowLabel}>{label}</Text>
          <Text style={p.rowValue} numberOfLines={1}>
            {value || "—"}
          </Text>
        </View>
      </View>
      {!last && <View style={p.rowDivider} />}
    </>
  );
}

function Card({ children }) {
  return <View style={p.card}>{children}</View>;
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Absent"];
  return (
    <View style={[p.badge, { backgroundColor: cfg.bg }]}>
      <View style={[p.badgeDot, { backgroundColor: cfg.dot }]} />
      <Text style={[p.badgeText, { color: cfg.text }]}>{status}</Text>
    </View>
  );
}

// ─── Today's Status Card ──────────────────────────────────────────────────────
function TodayCard({ today }) {
  const cfg = STATUS_CONFIG[today.status] || STATUS_CONFIG["Absent"];
  return (
    <Card>
      <View style={p.todayHeader}>
        <View style={p.todayLeft}>
          <IconSquare icon={CalendarDaysIcon} color={C.accent} size={34} />
          <View>
            <Text style={p.rowLabel}>TODAY'S STATUS</Text>
            <StatusBadge status={today.status} />
          </View>
        </View>
        {today.is_checked_in && !today.is_checked_out && (
          <View style={p.liveChip}>
            <View style={p.liveDot} />
            <Text style={p.liveText}>Live</Text>
          </View>
        )}
      </View>
      <View style={p.rowDivider} />
      <View style={p.todayStats}>
        {[
          { label: "CHECK IN", value: formatTime(today.check_in) },
          { label: "CHECK OUT", value: formatTime(today.check_out) },
          {
            label: "HOURS",
            value: today.hours_worked > 0 ? `${today.hours_worked}h` : "--",
          },
        ].map((s, i) => (
          <View key={s.label} style={[p.todayStat, i < 2 && p.todayStatBorder]}>
            <Text style={p.cardStatLabel}>{s.label}</Text>
            <Text style={p.cardStatValue}>{s.value}</Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

// ─── Summary Stats Card ───────────────────────────────────────────────────────
function SummaryCard({ summary }) {
  const rate = summary.attendance_rate;
  const tiles = [
    {
      label: "Present",
      value: summary.days_present,
      icon: CheckBadgeIcon,
      color: C.greenText,
      bg: C.greenBg,
    },
    {
      label: "Absent",
      value: summary.days_absent,
      icon: ExclamationCircleIcon,
      color: C.redText,
      bg: C.redBg,
    },
    {
      label: "Late",
      value: summary.days_late,
      icon: ClockIcon,
      color: C.amberText,
      bg: C.amberBg,
    },
    {
      label: "On Leave",
      value: summary.days_on_leave,
      icon: CalendarDaysIcon,
      color: C.blueText,
      bg: C.blueBg,
    },
  ];

  return (
    <Card>
      {/* Rate bar */}
      <View style={p.row}>
        <IconSquare icon={ShieldCheckIcon} color={C.accent} size={34} />
        <View style={p.rowTexts}>
          <Text style={p.rowLabel}>ATTENDANCE RATE</Text>
          <Text
            style={[
              p.rowValue,
              { color: C.accent, fontSize: 20, fontWeight: "800" },
            ]}
          >
            {rate}%
          </Text>
        </View>
        <View style={p.rateRightCol}>
          <Text style={p.overtimeLabel}>Overtime</Text>
          <Text
            style={[
              p.overtimeValue,
              { color: summary.overtime_hours > 0 ? C.amber : C.muted },
            ]}
          >
            {summary.overtime_hours}h
          </Text>
        </View>
      </View>

      {/* Progress track */}
      <View style={p.track}>
        <View style={[p.trackFill, { width: `${rate}%` }]} />
      </View>

      <View style={p.rowDivider} />

      {/* Stat tiles */}
      <View style={p.tilesRow}>
        {tiles.map((t) => {
          const Icon = t.icon;
          return (
            <View key={t.label} style={[p.tile, { backgroundColor: t.bg }]}>
              <Icon size={14} color={t.color} strokeWidth={2.5} />
              <Text style={[p.tileValue, { color: t.color }]}>{t.value}</Text>
              <Text style={[p.tileLabel, { color: t.color }]}>{t.label}</Text>
            </View>
          );
        })}
      </View>

      <View style={p.rowDivider} />

      {/* Hours summary */}
      <View style={p.hoursRow}>
        <IconSquare icon={ClockIcon} color={C.slate} size={34} />
        <View style={p.rowTexts}>
          <Text style={p.rowLabel}>TOTAL HOURS WORKED</Text>
          <Text style={p.rowValue}>{summary.total_hours_worked}h</Text>
        </View>
      </View>
    </Card>
  );
}

// ─── History Row ──────────────────────────────────────────────────────────────
function HistoryRow({ record, last }) {
  const cfg = STATUS_CONFIG[record.status] || STATUS_CONFIG["Absent"];
  return (
    <>
      <View style={p.historyRow}>
        {/* Date col */}
        <View style={p.historyDateCol}>
          <Text style={p.historyDateMain}>
            {formatDate(record.date).split(",")[0]}
          </Text>
          <Text style={p.historyDateSub}>
            {formatDate(record.date).replace(/^\w+,\s*/, "")}
          </Text>
        </View>

        {/* Status badge */}
        <StatusBadge status={record.status} />

        {/* Times */}
        <View style={p.historyTimes}>
          <View style={p.historyTimeRow}>
            <Text style={p.historyTimeLabel}>IN </Text>
            <Text style={p.historyTimeValue}>
              {formatTime(record.check_in)}
            </Text>
          </View>
          <View style={p.historyTimeRow}>
            <Text style={p.historyTimeLabel}>OUT </Text>
            <Text style={p.historyTimeValue}>
              {formatTime(record.check_out)}
            </Text>
          </View>
        </View>

        {/* Hours + face */}
        <View style={p.historyRight}>
          <Text style={p.historyHours}>
            {record.hours_worked > 0 ? `${record.hours_worked}h` : "--"}
          </Text>
          {record.face_verified ? (
            <FingerPrintIcon size={13} color={C.green} strokeWidth={2} />
          ) : (
            <Text style={p.manualTag}>Manual</Text>
          )}
        </View>
      </View>
      {!last && <View style={p.rowDivider} />}
    </>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EmployeeAttendanceDetailScreen() {
  const { id } = useLocalSearchParams();
  const navigation = useNavigation();

  const [activePeriod, setActivePeriod] = useState("monthly");
  const [refreshing, setRefreshing] = useState(false);

  // TODO: replace mock with:
  // GET /api/attendance/employees/<id>/?period=<activePeriod>
  const data = MOCK_DETAIL;
  const { employee, today, summary, history, period } = data;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: re-fetch
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  return (
    <View style={p.root}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={p.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.accent}
            colors={[C.accent]}
          />
        }
      >
        {/* ── Hero — mirrors profile screen exactly ── */}
        <View style={p.hero}>
          <View style={p.avatarWrap}>
            <Image
              source={{ uri: getAvatarUri(employee.name) }}
              style={p.avatar}
              resizeMode="cover"
            />
            <View
              style={[
                p.statusDot,
                {
                  backgroundColor: (
                    STATUS_CONFIG[today.status] || STATUS_CONFIG["Absent"]
                  ).dot,
                },
              ]}
            />
          </View>
          <Text style={p.heroName}>{employee.name}</Text>
          <Text style={p.heroRole}>{employee.department}</Text>
          <View style={p.heroBioRow}>
            <View style={p.bioChip}>
              <EnvelopeIcon size={11} color={C.sub} strokeWidth={2.5} />
              <Text style={p.bioChipText} numberOfLines={1}>
                {employee.email}
              </Text>
            </View>
          </View>
          <StatusBadge status={today.status} />
        </View>
        {/* ── Employee Info ── */}
        <View style={p.section}>
          <GroupLabel title="Employee Info" />
          <Card>
            <InfoRow
              icon={EnvelopeIcon}
              iconColor={C.blue}
              label="Email Address"
              value={employee.email}
            />
            <InfoRow
              icon={BuildingOffice2Icon}
              iconColor={C.accent}
              label="Department"
              value={employee.department}
            />
            <InfoRow
              icon={IdentificationIcon}
              iconColor={C.purple}
              label="Employee ID"
              value={`EMP-${String(employee.id).padStart(4, "0")}`}
              last
            />
          </Card>
        </View>
        {/* ── Period picker ── */}
        <View style={p.section}>
          <GroupLabel title="Attendance Period" />
          <View style={p.periodRow}>
            {PERIODS.map((per) => {
              const active = activePeriod === per;
              return (
                <Pressable
                  key={per}
                  onPress={() => setActivePeriod(per)}
                  style={({ pressed }) => [
                    p.periodPill,
                    active && p.periodPillActive,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text
                    style={[p.periodPillText, active && p.periodPillTextActive]}
                  >
                    {per.charAt(0).toUpperCase() + per.slice(1)}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          <Text style={p.periodRange}>
            {formatDate(period.start)} — {formatDate(period.end)} ·{" "}
            {period.total_days} days
          </Text>
        </View>
        {/* ── Today's Status ── */}
        <View style={p.section}>
          <GroupLabel title="Today" />
          <TodayCard today={today} />
        </View>
        {/* ── Summary ── */}
        <View style={p.section}>
          <GroupLabel title="Summary" />
          <SummaryCard summary={summary} />
        </View>
        {/* ── History ── */}
        <View style={p.section}>
          <GroupLabel title="Attendance History" />
          <Card>
            {history.map((rec, i) => (
              <HistoryRow
                key={rec.date}
                record={rec}
                last={i === history.length - 1}
              />
            ))}
          </Card>
        </View>
        <View style={{ height: 60 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const p = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },
  section: { paddingHorizontal: 16, marginTop: 20 },

  // ── Section header — matches settings screen ──
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionBarAccent: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // ── Hero — mirrors profile index ──
  hero: {
    backgroundColor: C.white,
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 22,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  avatarWrap: { position: "relative", marginBottom: 12 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: C.divider,
  },
  statusDot: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2.5,
    borderColor: C.white,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  heroRole: { fontSize: 13, fontWeight: "500", color: C.sub, marginBottom: 10 },
  heroBioRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  bioChip: { flexDirection: "row", alignItems: "center", gap: 4 },
  bioChipText: { fontSize: 12, fontWeight: "600", color: C.sub },

  // ── Card ──
  card: {
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: C.border,
  },

  // ── Row — shared ──
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    gap: 14,
  },
  rowTexts: { flex: 1 },
  rowLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 2,
  },
  rowValue: { fontSize: 14, fontWeight: "600", color: C.navy },
  rowDivider: { height: 1, backgroundColor: C.divider, marginLeft: 62 },

  iconSquare: { alignItems: "center", justifyContent: "center", flexShrink: 0 },

  // ── Badge ──
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.1 },

  // ── Period pills ──
  periodRow: { flexDirection: "row", gap: 8, marginBottom: 8 },
  periodPill: {
    flex: 1,
    paddingVertical: 9,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  periodPillActive: { backgroundColor: C.accent, borderColor: C.accent },
  periodPillText: { fontSize: 13, fontWeight: "600", color: C.sub },
  periodPillTextActive: { color: C.white },
  periodRange: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "500",
    textAlign: "center",
  },

  // ── Today card ──
  todayHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  todayLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  liveChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.greenBg,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  liveText: { fontSize: 11, fontWeight: "700", color: C.greenText },
  todayStats: { flexDirection: "row" },
  todayStat: { flex: 1, alignItems: "center", paddingVertical: 12, gap: 3 },
  todayStatBorder: { borderRightWidth: 1, borderRightColor: C.divider },
  cardStatLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  cardStatValue: { fontSize: 13, fontWeight: "700", color: C.navy },

  // ── Summary card ──
  track: {
    height: 5,
    backgroundColor: C.divider,
    borderRadius: 3,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
  },
  trackFill: { height: "100%", backgroundColor: C.accent, borderRadius: 3 },
  tilesRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  tile: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    gap: 3,
  },
  tileValue: { fontSize: 18, fontWeight: "800", letterSpacing: -0.5 },
  tileLabel: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  rateRightCol: { alignItems: "flex-end", gap: 2 },
  overtimeLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  overtimeValue: { fontSize: 15, fontWeight: "800" },
  hoursRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 13,
    gap: 14,
  },

  // ── History row ──
  historyRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  historyDateCol: { width: 44, gap: 1 },
  historyDateMain: { fontSize: 12, fontWeight: "800", color: C.navy },
  historyDateSub: { fontSize: 10, fontWeight: "500", color: C.muted },
  historyTimes: { flex: 1, gap: 3 },
  historyTimeRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  historyTimeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: C.muted,
    letterSpacing: 0.4,
  },
  historyTimeValue: { fontSize: 11, fontWeight: "600", color: C.navy },
  historyRight: { alignItems: "flex-end", gap: 4 },
  historyHours: { fontSize: 12, fontWeight: "700", color: C.navy },
  manualTag: { fontSize: 9, fontWeight: "600", color: C.muted },
});
