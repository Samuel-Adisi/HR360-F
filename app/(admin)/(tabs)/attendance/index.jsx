import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
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
  MagnifyingGlassIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  accentMid: "#CCFBF1",
  navy: "#0F172A",
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

const STATUS_CONFIG = {
  Present: { label: "Present", bg: C.greenBg, text: C.greenText, dot: C.green },
  Absent: { label: "Absent", bg: C.redBg, text: C.redText, dot: C.red },
  Late: { label: "Late", bg: C.amberBg, text: C.amberText, dot: C.amber },
  "On Leave": {
    label: "On Leave",
    bg: C.blueBg,
    text: C.blueText,
    dot: C.blue,
  },
};

const STATUS_FILTERS = ["All", "Present", "Absent", "Late", "On Leave"];

const MOCK_RESPONSE = {
  date: "2025-07-10",
  total: 6,
  employees: [
    {
      id: 1,
      name: "Kwame Asante",
      department: "Engineering",
      status: "Present",
      check_in: "08:47:00",
      check_out: null,
      hours_worked: 0,
      face_verified: true,
    },
    {
      id: 2,
      name: "Abena Mensah",
      department: "Finance",
      status: "Late",
      check_in: "09:14:00",
      check_out: "17:02:00",
      hours_worked: 7.8,
      face_verified: true,
    },
    {
      id: 3,
      name: "Kofi Boateng",
      department: "HR",
      status: "Absent",
      check_in: null,
      check_out: null,
      hours_worked: 0,
      face_verified: false,
    },
    {
      id: 4,
      name: "Ama Owusu",
      department: "Engineering",
      status: "Present",
      check_in: "08:31:00",
      check_out: "17:00:00",
      hours_worked: 8.5,
      face_verified: true,
    },
    {
      id: 5,
      name: "Yaw Darko",
      department: "Sales",
      status: "On Leave",
      check_in: null,
      check_out: null,
      hours_worked: 0,
      face_verified: false,
    },
    {
      id: 6,
      name: "Efua Amponsah",
      department: "Design",
      status: "Present",
      check_in: "08:55:00",
      check_out: null,
      hours_worked: 0,
      face_verified: false,
    },
  ],
};

function formatTime(t) {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h);
  return `${hour % 12 || 12}:${m} ${hour >= 12 ? "PM" : "AM"}`;
}

function formatDate(dateStr) {
  if (!dateStr) return "Today";
  return new Date(dateStr).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getAvatarUri(name) {
  return `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(name)}&backgroundColor=0F766E&textColor=ffffff&fontSize=38`;
}

function StatsBanner({ counts, total }) {
  const presentRate =
    total > 0 ? Math.round((counts.Present / total) * 100) : 0;

  const tiles = [
    {
      label: "Present",
      value: counts.Present,
      gradientColors: ["#0F172A", "#1E293B"],
    },
    {
      label: "Absent",
      value: counts.Absent,
      gradientColors: ["#0F172A", "#1E293B"],
    },
    {
      label: "Late",
      value: counts.Late,
      gradientColors: ["#0F172A", "#1E293B"],
    },
    {
      label: "On Leave",
      value: counts["On Leave"],
      gradientColors: ["#0F172A", "#1E293B"],
    },
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
          <Text style={sb.title}>Attendance Rate</Text>
          <Text style={sb.date}>{formatDate(MOCK_RESPONSE.date)}</Text>
          <View style={sb.track}>
            <View style={[sb.fill, { width: `${presentRate}%` }]} />
          </View>
          <Text style={sb.rateSmall}>{total} employees tracked</Text>
        </View>
        <View style={sb.circle}>
          <Text style={sb.circleNum}>{presentRate}%</Text>
          <Text style={sb.circleLabel}>present</Text>
        </View>
      </View>

      <View style={sb.tiles}>
        {tiles.map((t) => (
          <LinearGradient
            key={t.label}
            colors={t.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={sb.tile}
          >
            <Text style={sb.tileNum}>{t.value}</Text>
            <Text style={sb.tileLabel}>{t.label}</Text>
          </LinearGradient>
        ))}
      </View>
    </LinearGradient>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Absent;
  return (
    <View style={[c.badge, { backgroundColor: cfg.bg }]}>
      <View style={[c.badgeDot, { backgroundColor: cfg.dot }]} />
      <Text style={[c.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

// ─── Employee Card ────────────────────────────────────────────────────────────
function EmployeeCard({ employee, onPress }) {
  const cfg = STATUS_CONFIG[employee.status] || STATUS_CONFIG.Absent;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [c.root, pressed && { opacity: 0.85 }]}
    >
      <View style={c.top}>
        <View style={c.avatarWrap}>
          <Image
            source={{ uri: getAvatarUri(employee.name) }}
            style={c.avatar}
            resizeMode="cover"
          />
          <View style={[c.dot, { backgroundColor: cfg.dot }]} />
        </View>
        <View style={c.info}>
          <Text style={c.name} numberOfLines={1}>
            {employee.name}
          </Text>
          <View style={c.deptRow}>
            <BuildingOffice2Icon size={11} color={C.muted} strokeWidth={2} />
            <Text style={c.dept}>{employee.department}</Text>
          </View>
        </View>
        <View style={c.right}>
          <StatusBadge status={employee.status} />
          <Text style={c.chevron}>›</Text>
        </View>
      </View>

      <View style={c.divider} />

      <View style={c.statsRow}>
        {[
          {
            label: "CHECK IN",
            value: formatTime(employee.check_in),
            dim: !employee.check_in,
          },
          {
            label: "CHECK OUT",
            value: formatTime(employee.check_out),
            dim: !employee.check_out,
          },
          {
            label: "HOURS",
            value:
              employee.hours_worked > 0 ? `${employee.hours_worked}h` : "—",
            dim: !employee.hours_worked,
          },
        ].map((stat, i) => (
          <View key={stat.label} style={c.statGroup}>
            {i > 0 && <View style={c.sep} />}
            <View style={c.stat}>
              <Text style={c.statLabel}>{stat.label}</Text>
              <Text style={[c.statVal, stat.dim && { color: C.muted }]}>
                {stat.value}
              </Text>
            </View>
          </View>
        ))}
        <View style={c.statGroup}>
          <View style={c.sep} />
          <View style={c.stat}>
            <Text style={c.statLabel}>FACE</Text>
            {employee.face_verified ? (
              <View style={c.faceRow}>
                <ShieldCheckIcon size={11} color={C.green} strokeWidth={2.5} />
                <Text style={[c.statVal, { color: C.green }]}>OK</Text>
              </View>
            ) : (
              <Text style={[c.statVal, { color: C.muted }]}>Manual</Text>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function EmployeeAttendanceListScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [refreshing, setRefreshing] = useState(false);

  const data = MOCK_RESPONSE;

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const filtered = data.employees.filter((emp) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      emp.name.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q);
    const matchFilter = activeFilter === "All" || emp.status === activeFilter;
    return matchSearch && matchFilter;
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
      {/* ── Custom header matching employees screen style ── */}
      <SafeAreaView edges={["top"]} style={s.header}>
        <View style={s.titleRow}>
          <View style={s.titleLeft}>
            {/* Same iconBadge pattern as employees screen */}
            <View style={s.iconBadge}>
              <UserGroupIcon size={18} color={C.accent} strokeWidth={2} />
            </View>
            <View>
              <Text style={s.title}>Attendance</Text>
              <Text style={s.subtitle}>
                {formatDate(data.date)} · {data.total} employees
              </Text>
            </View>
          </View>
        </View>

        {/* Search — same style as employees screen */}
        <View style={s.controlRow}>
          <View style={s.searchWrap}>
            <MagnifyingGlassIcon size={17} color={C.muted} strokeWidth={2.2} />
            <TextInput
              style={s.searchInput}
              placeholder="Search name or department…"
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
        {/* Stats */}
        <View style={s.section}>
          <StatsBanner counts={counts} total={data.total} />
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
            {filtered.length} employee{filtered.length !== 1 ? "s" : ""}
            {activeFilter !== "All" ? ` · ${activeFilter}` : ""}
            {search ? ` · "${search}"` : ""}
          </Text>
        </View>

        {/* List */}
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <View style={s.emptyIcon}>
              <UserGroupIcon size={30} color={C.muted} strokeWidth={1.5} />
            </View>
            <Text style={s.emptyTitle}>No employees found</Text>
            <Text style={s.emptySub}>Try a different search or filter</Text>
          </View>
        ) : (
          <View style={s.listWrap}>
            {filtered.map((emp, i) => (
              <View key={emp.id}>
                <EmployeeCard
                  employee={emp}
                  onPress={() => router.push(`/attendance/employees/${emp.id}`)}
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

const sb = StyleSheet.create({
  container: {
    borderRadius: 18,
    padding: 18,
    gap: 16,
  },
  topRow: { flexDirection: "row", alignItems: "center", gap: 16 },
  topLeft: { flex: 1, gap: 6 },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  date: { fontSize: 11, color: "rgba(255,255,255,0.5)", fontWeight: "500" },
  track: {
    height: 5,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: "100%", backgroundColor: "#0A66C2", borderRadius: 3 },
  rateSmall: {
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
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  circleLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  tiles: { flexDirection: "row", gap: 8 },
  tile: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 5,
  },
  tileNum: {
    fontSize: 22,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  tileLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});
// ─── Card Styles ──────────────────────────────────────────────────────────────
const c = StyleSheet.create({
  root: { backgroundColor: C.white },
  top: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    gap: 12,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    position: "relative",
    flexShrink: 0,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: C.divider,
  },
  dot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.white,
  },
  info: { flex: 1, gap: 3 },
  name: { fontSize: 15, fontWeight: "700", color: C.navy, letterSpacing: -0.2 },
  deptRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dept: { fontSize: 12, color: C.muted, fontWeight: "500" },
  right: { alignItems: "flex-end", gap: 6 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeDot: { width: 6, height: 6, borderRadius: 3 },
  badgeText: { fontSize: 11, fontWeight: "700" },
  chevron: { fontSize: 20, color: "#CBD5E1", lineHeight: 22 },
  divider: {
    height: 1,
    backgroundColor: C.divider,
    marginTop: 12,
    marginHorizontal: 16,
  },
  statsRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  statGroup: { flex: 1, flexDirection: "row", alignItems: "center" },
  sep: { width: 1, height: 26, backgroundColor: C.divider, marginRight: 0 },
  stat: { flex: 1, alignItems: "center", gap: 3 },
  statLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  statVal: { fontSize: 12, fontWeight: "700", color: C.navy },
  faceRow: { flexDirection: "row", alignItems: "center", gap: 3 },
});

// ─── Screen Styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },

  // Header — matches employees screen pattern exactly
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

  // Search — matches employees screen
  controlRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  searchWrap: {
    flex: 1,
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
  cardSep: { height: 1, backgroundColor: C.divider, marginLeft: 74 },

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
});
