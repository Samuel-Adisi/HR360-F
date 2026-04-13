import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  BuildingOffice2Icon,
  CalendarDaysIcon,
  CheckBadgeIcon,
  ChevronRightIcon,
  ClockIcon,
  ExclamationCircleIcon,
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { CheckCircleIcon } from "react-native-heroicons/solid";
import { AttendanceHeaderRight, AttendanceHeaderTitle } from "./_layout";

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
};

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Present: {
    label: "Present",
    bg: "#F1F5F9",
    text: "#0F172A",
    dot: "#1E293B",
    iconColor: "#1E293B",
  },
  Absent: {
    label: "Absent",
    bg: "#F8FAFC",
    text: "#64748B",
    dot: "#94A3B8",
    iconColor: "#94A3B8",
  },
  Late: {
    label: "Late",
    dot: C.amber,
    iconColor: C.amber,
  },
  "On Leave": {
    label: "On Leave",
    bg: C.blueBg,
    text: C.blueText,
    dot: C.blue,
    iconColor: C.blue,
  },
};

const STATUS_FILTERS = ["All", "Present", "Absent", "Late", "On Leave"];

// ─── Mock data — mirrors EmployeeAttendanceList API response exactly ──────────
// TODO: replace with GET /api/attendance/employees/?status=<filter>&search=<search>
const MOCK_RESPONSE = {
  date: "2025-07-10",
  total: 6,
  employees: [
    {
      id: 1,
      name: "Kwame Asante",
      email: "kwame.asante@company.com",
      department: "Engineering",
      status: "Present",
      check_in: "08:47:00",
      check_out: null,
      hours_worked: 0.0,
      face_verified: true,
      is_checked_in: true,
      is_checked_out: false,
      // avatar: require("../../../assets/avatars/kwame.jpg"), // uncomment when you have real images
    },
    {
      id: 2,
      name: "Abena Mensah",
      email: "abena.mensah@company.com",
      department: "Finance",
      status: "Late",
      check_in: "09:14:00",
      check_out: "17:02:00",
      hours_worked: 7.8,
      face_verified: true,
      is_checked_in: false,
      is_checked_out: true,
    },
    {
      id: 3,
      name: "Kofi Boateng",
      email: "kofi.boateng@company.com",
      department: "HR",
      status: "Absent",
      check_in: null,
      check_out: null,
      hours_worked: 0.0,
      face_verified: false,
      is_checked_in: false,
      is_checked_out: false,
    },
    {
      id: 4,
      name: "Ama Owusu",
      email: "ama.owusu@company.com",
      department: "Engineering",
      status: "Present",
      check_in: "08:31:00",
      check_out: "17:00:00",
      hours_worked: 8.5,
      face_verified: true,
      is_checked_in: false,
      is_checked_out: true,
    },
    {
      id: 5,
      name: "Yaw Darko",
      email: "yaw.darko@company.com",
      department: "Sales",
      status: "On Leave",
      check_in: null,
      check_out: null,
      hours_worked: 0.0,
      face_verified: false,
      is_checked_in: false,
      is_checked_out: false,
    },
    {
      id: 6,
      name: "Efua Amponsah",
      email: "efua.amponsah@company.com",
      department: "Design",
      status: "Present",
      check_in: "08:55:00",
      check_out: null,
      hours_worked: 0.0,
      face_verified: false,
      is_checked_in: true,
      is_checked_out: false,
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatTime(timeStr) {
  if (!timeStr) return "--:--";
  const [h, m] = timeStr.split(":");
  const hour = parseInt(h);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = hour % 12 || 12;
  return `${display}:${m} ${ampm}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "Today";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getInitials(name) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// Placeholder avatar URL — swap for real image URIs from your API/CDN
function getAvatarUri(employee) {
  if (employee.avatar) return employee.avatar;
  // DiceBear — generates a consistent illustrated avatar per seed
  return `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(employee.name)}&backgroundColor=0F766E&textColor=ffffff&fontSize=38`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG["Absent"];
  return (
    <View style={[s.badge, { backgroundColor: cfg.bg }]}>
      <View style={[s.badgeDot, { backgroundColor: cfg.dot }]} />
      <Text style={[s.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

// ─── Stats Banner ─────────────────────────────────────────────────────────────
function StatsBanner({ counts, total }) {
  const presentRate =
    total > 0 ? Math.round((counts["Present"] / total) * 100) : 0;

  const tiles = [
    {
      label: "Present",
      value: counts["Present"],
      icon: CheckBadgeIcon,
      color: "#1E293B",
    },
    {
      label: "Absent",
      value: counts["Absent"],
      icon: ExclamationCircleIcon,
      color: "#64748B",
    },
    {
      label: "Late",
      value: counts["Late"],
      icon: ClockIcon,
      color: "#475569",
    },
    {
      label: "On Leave",
      value: counts["On Leave"],
      icon: CalendarDaysIcon,
      color: "#94A3B8",
    },
  ];

  return (
    <View style={sb.container}>
      {/* Attendance rate bar */}
      <View style={sb.rateRow}>
        <View style={sb.rateLabelRow}>
          <UserGroupIcon size={13} color="#0F172A" strokeWidth={2.5} />
          <Text style={sb.rateLabel}>Today's Attendance Rate</Text>
        </View>
        <Text style={sb.rateValue}>{presentRate}%</Text>
      </View>

      <View style={sb.track}>
        <View style={[sb.fill, { width: `${presentRate}%`, backgroundColor: "#0F172A" }]} />
      </View>

      {/* Stat tiles */}
      <View style={sb.tilesRow}>
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <View key={tile.label} style={sb.tile}>
              <Icon size={13} color={tile.color} strokeWidth={2.5} />
              <Text style={[sb.tileValue, { color: tile.color }]}>
                {tile.value}
              </Text>
              <Text style={sb.tileLabel}>{tile.label}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

// ─── Employee Card ────────────────────────────────────────────────────────────
function EmployeeCard({ employee, onPress }) {
  const cfg = STATUS_CONFIG[employee.status] || STATUS_CONFIG["Absent"];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.card, pressed && { opacity: 0.92 }]}
    >
      <View style={s.cardContent}>
        {/* Top row */}
        <View style={s.cardTopRow}>
          {/* Profile image */}
          <View style={s.avatarWrap}>
            <Image
              source={{ uri: getAvatarUri(employee) }}
              style={s.avatar}
              resizeMode="cover"
            />
            {/* Online/status dot */}
            <View style={[s.statusDotOverlay, { backgroundColor: cfg.dot }]} />
          </View>

          <View style={s.cardMeta}>
            <Text style={s.cardName} numberOfLines={1}>
              {employee.name}
            </Text>
            <View style={s.cardDeptRow}>
              <BuildingOffice2Icon size={11} color={C.muted} strokeWidth={2} />
              <Text style={s.cardDept} numberOfLines={1}>
                {employee.department}
              </Text>
            </View>
          </View>

          <View style={s.cardRight}>
            <StatusBadge status={employee.status} />
            <ChevronRightIcon
              size={14}
              color={C.muted}
              strokeWidth={2.5}
              style={{ marginTop: 6 }}
            />
          </View>
        </View>

        {/* Divider */}
        <View style={s.cardDivider} />

        {/* Bottom stats row */}
        <View style={s.cardBottomRow}>
          <View style={s.cardStat}>
            <Text style={s.cardStatLabel}>CHECK IN</Text>
            <Text
              style={[
                s.cardStatValue,
                !employee.check_in && { color: C.muted },
              ]}
            >
              {formatTime(employee.check_in)}
            </Text>
          </View>

          <View style={s.cardStatDivider} />

          <View style={s.cardStat}>
            <Text style={s.cardStatLabel}>CHECK OUT</Text>
            <Text
              style={[
                s.cardStatValue,
                !employee.check_out && { color: C.muted },
              ]}
            >
              {formatTime(employee.check_out)}
            </Text>
          </View>

          <View style={s.cardStatDivider} />

          <View style={s.cardStat}>
            <Text style={s.cardStatLabel}>HOURS</Text>
            <Text style={s.cardStatValue}>
              {employee.hours_worked > 0 ? `${employee.hours_worked}h` : "--"}
            </Text>
          </View>

          <View style={s.cardStatDivider} />

          <View style={s.cardStat}>
            <Text style={s.cardStatLabel}>FACE</Text>
            <View style={s.faceRow}>
              {employee.face_verified ? (
                <>
                  <ShieldCheckIcon
                    size={11}
                    color={C.green}
                    strokeWidth={2.5}
                  />
                  <Text
                    style={[s.cardStatValue, { color: C.green, fontSize: 11 }]}
                  >
                    OK
                  </Text>
                </>
              ) : (
                <Text
                  style={[s.cardStatValue, { color: C.muted, fontSize: 11 }]}
                >
                  Manual
                </Text>
              )}
            </View>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

function EmptyState({ search, filter }) {
  return (
    <View style={s.emptyState}>
      <View style={s.emptyIconWrap}>
        <UserGroupIcon size={34} color={C.muted} strokeWidth={1.5} />
      </View>
      <Text style={s.emptyTitle}>No employees found</Text>
      <Text style={s.emptySubtitle}>
        {search
          ? `No results for "${search}"`
          : filter !== "All"
            ? `No employees with status "${filter}" today`
            : "No attendance records for today"}
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EmployeeAttendanceListScreen() {
  const router = useRouter();
  const navigation = useNavigation();

  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);

  // ── Data ───────────────────────────────────────────────────────────────────
  // TODO: Replace with API call:
  // GET /api/attendance/employees/?status=<filter>&search=<search>
  const data = MOCK_RESPONSE;

  // ── Sync header with real data once API is wired ───────────────────────────
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <AttendanceHeaderTitle
          date={formatDate(data.date)}
          total={data.total}
        />
      ),
      headerRight: () => <AttendanceHeaderRight total={data.total} />,
    });
  }, [data.date, data.total]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    // TODO: re-fetch GET /api/attendance/employees/
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  // Client-side filter — remove once API params are wired
  const filtered = data.employees.filter((emp) => {
    const matchesSearch =
      search.trim() === "" ||
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.email.toLowerCase().includes(search.toLowerCase()) ||
      emp.department.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === "All" || emp.status === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const counts = data.employees.reduce(
    (acc, e) => {
      acc[e.status] = (acc[e.status] || 0) + 1;
      return acc;
    },
    { Present: 0, Absent: 0, Late: 0, "On Leave": 0 },
  );

  return (
    <View style={s.root}>
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
        {/* ── Stats Banner ── */}
        <View style={s.section}>
          <StatsBanner counts={counts} total={data.total} />
        </View>

        {/* ── Search ── */}
        <View style={s.searchWrap}>
          <View style={s.searchInner}>
            <MagnifyingGlassIcon size={16} color={C.muted} strokeWidth={2.5} />
            <TextInput
              style={s.searchInput}
              placeholder="Search by name, email or department…"
              placeholderTextColor={C.muted}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
              autoCapitalize="none"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <XMarkIcon size={14} color={C.muted} strokeWidth={2.5} />
              </Pressable>
            )}
          </View>
        </View>

        {/* ── Filter pills ── */}
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
                  s.filterPill,
                  active && {
                    backgroundColor: cfg ? cfg.dot : C.accent,
                    borderColor: cfg ? cfg.dot : C.accent,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                {active && (
                  <CheckCircleIcon
                    size={12}
                    color="#fff"
                    style={{ marginRight: 4 }}
                  />
                )}
                <Text style={[s.filterPillText, active && { color: "#fff" }]}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* ── Result label ── */}
        <View style={s.resultRow}>
          <Text style={s.resultText}>
            {filtered.length} employee{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "All" ? ` · ${activeFilter}` : ""}
            {search ? ` · "${search}"` : ""}
          </Text>
        </View>

        {/* ── List ── */}
        {loading ? (
          <ActivityIndicator
            size="large"
            color={C.accent}
            style={{ marginTop: 40 }}
          />
        ) : filtered.length === 0 ? (
          <EmptyState search={search} filter={activeFilter} />
        ) : (
          <View style={s.listWrap}>
            {filtered.map((emp, index) => (
              <View key={emp.id}>
                <EmployeeCard
                  employee={emp}
                  onPress={() => {
                    // TODO: navigate to EmployeeAttendanceDetail
                    router.push(`/attendance/employees/${emp.id}`);
                  }}
                />
                {index < filtered.length - 1 && (
                  <View style={s.cardSeparator} />
                )}
              </View>
            ))}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// ─── Stats Banner Styles ──────────────────────────────────────────────────────
const sb = StyleSheet.create({
  container: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 12,
    gap: 10,
  },
  rateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rateLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  rateLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  rateValue: {
    fontSize: 15,
    fontWeight: "800",
    color: C.accent,
    letterSpacing: -0.4,
  },
  track: {
    height: 4,
    backgroundColor: C.divider,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    backgroundColor: C.accent,
    borderRadius: 2,
  },
  tilesRow: {
    flexDirection: "row",
    gap: 6,
  },
  tile: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: C.divider,
    backgroundColor: C.bg, // Neutral light background
    paddingVertical: 8,
    alignItems: "center",
    gap: 2,
  },
  tileValue: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  tileLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});

// ─── Screen Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },
  section: { paddingHorizontal: 16, paddingTop: 16 },

  // Search
  searchWrap: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 4 },
  searchInner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.navy,
    fontWeight: "500",
    paddingVertical: 0,
  },

  // Filter pills
  filterRow: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
    gap: 8,
  },
  filterPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
  },
  filterPillText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.sub,
  },

  // Result count
  resultRow: {
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
  },
  resultText: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "600",
  },

  // Card list container
  listWrap: {
    marginHorizontal: 16,
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  cardSeparator: {
    height: 1,
    backgroundColor: C.divider,
    marginLeft: 78,
  },

  // Employee card
  card: { backgroundColor: C.white },
  cardContent: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 12,
  },
  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  // Avatar — real image, no gradient background
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    flexShrink: 0,
    position: "relative",
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.divider, // shows while image loads
  },
  statusDotOverlay: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.white,
  },

  cardMeta: { flex: 1, gap: 3 },
  cardName: {
    fontSize: 15,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.2,
  },
  cardDeptRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cardDept: {
    fontSize: 12,
    color: C.muted,
    fontWeight: "500",
  },
  cardRight: {
    alignItems: "flex-end",
    gap: 4,
  },

  // Badge
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

  // Card bottom stats
  cardDivider: {
    height: 1,
    backgroundColor: C.divider,
    marginVertical: 10,
  },
  cardBottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardStat: { flex: 1, alignItems: "center", gap: 3 },
  cardStatDivider: { width: 1, height: 28, backgroundColor: C.divider },
  cardStatLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  cardStatValue: {
    fontSize: 12,
    fontWeight: "700",
    color: C.navy,
  },
  faceRow: { flexDirection: "row", alignItems: "center", gap: 3 },

  // Empty state
  emptyState: {
    alignItems: "center",
    paddingTop: 52,
    paddingBottom: 32,
    paddingHorizontal: 32,
  },
  emptyIconWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
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
  emptySubtitle: {
    fontSize: 13,
    color: C.muted,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 20,
  },
});
