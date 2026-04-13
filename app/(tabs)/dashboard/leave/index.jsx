import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BanknotesIcon,
  BriefcaseIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  FaceSmileIcon,
  PlusCircleIcon,
  UserGroupIcon,
  XCircleIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Design tokens (no conflicts with tabs) ───────────────────────────────────
const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  accentMid: "#CCFBF1",
  navy: "#0F172A",
  sub: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  divider: "#F1F5F9",
  bg: "#F8FAFC", // ← matches tab background, no conflict
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
  purpleText: "#6D28D9",
  orange: "#F97316",
  orangeBg: "#FFF7ED",
};

// ─── Mock data mirroring API exactly ─────────────────────────────────────────
const MOCK_STATISTICS = {
  total: 18,
  pending: 3,
  approved: 12,
  rejected: 3,
  by_type: [
    { leave_type: "Annual", count: 8 },
    { leave_type: "Sick", count: 5 },
    { leave_type: "Casual", count: 3 },
    { leave_type: "Maternity", count: 2 },
  ],
};

const MOCK_MY_BALANCE = {
  employee: "Kwame Asante",
  balances: [
    {
      leave_type: "Annual",
      entitled: 21,
      utilized: 6,
      balance: 15,
      carried_forward: 0,
    },
    {
      leave_type: "Sick",
      entitled: 10,
      utilized: 2,
      balance: 8,
      carried_forward: 0,
    },
    {
      leave_type: "Casual",
      entitled: 5,
      utilized: 1,
      balance: 4,
      carried_forward: 0,
    },
    {
      leave_type: "Maternity",
      entitled: 90,
      utilized: 0,
      balance: 90,
      carried_forward: 0,
    },
  ],
  total_entitled: 126,
  total_utilized: 9,
  total_balance: 117,
};

const MOCK_PENDING = [
  {
    id: 1,
    employee: 2,
    employee_name: "Abena Mensah",
    leave_type: "Annual",
    start_date: "2026-04-14",
    end_date: "2026-04-18",
    total_days: 5,
    reason: "Family vacation",
    status: "Pending",
    entitled: 21,
    utilized: 0,
    balance: 21,
    carried_forward: 0,
    approved_by: null,
    approved_by_name: null,
    approved_at: null,
    rejected_by: null,
    rejected_at: null,
    rejection_reason: null,
    created_at: "2026-04-10T08:22:00Z",
    updated_at: "2026-04-10T08:22:00Z",
  },
  {
    id: 2,
    employee: 3,
    employee_name: "Kofi Boateng",
    leave_type: "Sick",
    start_date: "2026-04-12",
    end_date: "2026-04-13",
    total_days: 2,
    reason: "Flu and fever",
    status: "Pending",
    entitled: 10,
    utilized: 0,
    balance: 10,
    carried_forward: 0,
    approved_by: null,
    approved_by_name: null,
    approved_at: null,
    rejected_by: null,
    rejected_at: null,
    rejection_reason: null,
    created_at: "2026-04-09T14:10:00Z",
    updated_at: "2026-04-09T14:10:00Z",
  },
  {
    id: 3,
    employee: 5,
    employee_name: "Yaw Darko",
    leave_type: "Casual",
    start_date: "2026-04-15",
    end_date: "2026-04-15",
    total_days: 1,
    reason: "Personal errand",
    status: "Pending",
    entitled: 5,
    utilized: 0,
    balance: 5,
    carried_forward: 0,
    approved_by: null,
    approved_by_name: null,
    approved_at: null,
    rejected_by: null,
    rejected_at: null,
    rejection_reason: null,
    created_at: "2026-04-10T09:00:00Z",
    updated_at: "2026-04-10T09:00:00Z",
  },
];

const MOCK_ON_LEAVE_TODAY = {
  date: "2026-04-10",
  total_on_leave: 2,
  employees: [
    {
      id: 5,
      employee_id: 5,
      employee_name: "Yaw Darko",
      email: "yaw@hr360.io",
      department: "Sales",
      leave_type: "Annual",
      start_date: "2026-04-07",
      end_date: "2026-04-11",
      days_remaining: 2,
    },
    {
      id: 6,
      employee_id: 6,
      employee_name: "Efua Amponsah",
      email: "efua@hr360.io",
      department: "Design",
      leave_type: "Sick",
      start_date: "2026-04-10",
      end_date: "2026-04-10",
      days_remaining: 1,
    },
  ],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function fmtDateShort(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function getAvatarUri(name) {
  return `https://api.dicebear.com/7.x/initials/png?seed=${encodeURIComponent(name)}&backgroundColor=0F766E&textColor=ffffff&fontSize=38`;
}

const STATUS_CFG = {
  Pending: {
    label: "Pending",
    bg: C.amberBg,
    text: C.amberText,
    dot: C.amber,
    icon: ClockIcon,
  },
  Approved: {
    label: "Approved",
    bg: C.greenBg,
    text: C.greenText,
    dot: C.green,
    icon: CheckCircleIcon,
  },
  Rejected: {
    label: "Rejected",
    bg: C.redBg,
    text: C.redText,
    dot: C.red,
    icon: XCircleIcon,
  },
  Cancelled: {
    label: "Cancelled",
    bg: C.divider,
    text: C.muted,
    dot: C.muted,
    icon: XCircleIcon,
  },
  Completed: {
    label: "Completed",
    bg: C.blueBg,
    text: C.blueText,
    dot: C.blue,
    icon: CheckCircleIcon,
  },
};

const LEAVE_TYPE_CFG = {
  Annual: { color: C.accent, bg: C.accentLight, icon: CalendarDaysIcon },
  Sick: { color: C.red, bg: C.redBg, icon: ExclamationTriangleIcon },
  Casual: { color: C.blue, bg: C.blueBg, icon: BriefcaseIcon },
  Maternity: { color: C.purple, bg: C.purpleBg, icon: FaceSmileIcon },
  Paternity: { color: C.orange, bg: C.orangeBg, icon: FaceSmileIcon },
  Unpaid: { color: C.muted, bg: C.divider, icon: BanknotesIcon },
};

function leaveTypeCfg(type) {
  return (
    LEAVE_TYPE_CFG[type] || {
      color: C.sub,
      bg: C.divider,
      icon: DocumentTextIcon,
    }
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────

// Solid square icon — same pattern as AddEmployeeScreen
function IconSquare({ icon: Icon, color, size = 34 }) {
  return (
    <View
      style={[
        sh.iconSquare,
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

function StatusBadge({ status }) {
  const cfg = STATUS_CFG[status] || STATUS_CFG.Pending;
  const Icon = cfg.icon;
  return (
    <View style={[sh.badge, { backgroundColor: cfg.bg }]}>
      <Icon size={11} color={cfg.dot} strokeWidth={2.5} />
      <Text style={[sh.badgeText, { color: cfg.text }]}>{cfg.label}</Text>
    </View>
  );
}

function SectionLabel({ title, badge, onAction, actionLabel }) {
  return (
    <View style={sh.sectionRow}>
      <View style={sh.sectionLeft}>
        <View style={sh.sectionBar} />
        <Text style={sh.sectionTitle}>{title}</Text>
        {badge != null && (
          <View style={sh.sectionBadge}>
            <Text style={sh.sectionBadgeText}>{badge}</Text>
          </View>
        )}
      </View>
      {onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <Text style={sh.sectionAction}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Statistics Banner ────────────────────────────────────────────────────────
function StatsBanner({ stats }) {
  const tiles = [
    {
      label: "Total",
      value: stats.total,
      gradientColors: ["#0F172A", "#1E293B"],
    },
    {
      label: "Approved",
      value: stats.approved,
      gradientColors: ["#0F172A", "#1E293B"],
    },
    {
      label: "Pending",
      value: stats.pending,
      gradientColors: ["#0F172A", "#1E293B"],
    },
    {
      label: "Rejected",
      value: stats.rejected,
      gradientColors: ["#0F172A", "#1E293B"],
    },
  ];

  return (
    <LinearGradient
      colors={["#0F172A", "#1E293B", "#243044"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={st.bannerContainer}
    >
      <View style={st.bannerTop}>
        <View>
          <Text style={st.bannerTitle}>Leave Overview</Text>
          <Text style={st.bannerSub}>{stats.total} requests this period</Text>
        </View>
        <View style={st.bannerCircle}>
          <Text style={st.bannerPct}>
            {stats.total > 0
              ? Math.round((stats.approved / stats.total) * 100)
              : 0}
            %
          </Text>
          <Text style={st.bannerPctLabel}>approved</Text>
        </View>
      </View>
      <View style={st.bannerTiles}>
        {tiles.map((t) => (
          <LinearGradient
            key={t.label}
            colors={t.gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={st.bannerTile}
          >
            <Text style={st.bannerTileNum}>{t.value}</Text>
            <Text style={st.bannerTileLabel}>{t.label}</Text>
          </LinearGradient>
        ))}
      </View>
    </LinearGradient>
  );
}

// ─── Balance Card (my_balance API) ───────────────────────────────────────────
function BalanceCard({ balance }) {
  const cfg = leaveTypeCfg(balance.leave_type);
  const Icon = cfg.icon;
  const pct =
    balance.entitled > 0
      ? Math.round((balance.utilized / balance.entitled) * 100)
      : 0;

  return (
    <View style={bc.card}>
      <View style={bc.top}>
        <IconSquare icon={Icon} color={cfg.color} size={36} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={bc.type}>{balance.leave_type} Leave</Text>
          <Text style={bc.entitled}>{balance.entitled} days entitled</Text>
        </View>
        <View style={bc.balancePill}>
          <Text style={[bc.balanceNum, { color: cfg.color }]}>
            {balance.balance}
          </Text>
          <Text style={[bc.balanceLabel, { color: cfg.color }]}>left</Text>
        </View>
      </View>
      {/* Progress bar — utilized vs entitled */}
      <View style={bc.trackWrap}>
        <View style={bc.track}>
          <View
            style={[bc.fill, { width: `${pct}%`, backgroundColor: C.blue }]}
          />
        </View>
        <Text style={bc.pctText}>{pct}% used</Text>
      </View>
      <View style={bc.statsRow}>
        {[
          { label: "ENTITLED", value: balance.entitled },
          { label: "UTILIZED", value: balance.utilized },
          { label: "BALANCE", value: balance.balance },
          { label: "CARRIED", value: balance.carried_forward },
        ].map((s, i) => (
          <View key={s.label} style={bc.statCell}>
            {i > 0 && <View style={bc.sep} />}
            <View style={bc.stat}>
              <Text style={bc.statLabel}>{s.label}</Text>
              <Text style={[bc.statVal, i === 2 && { color: cfg.color }]}>
                {s.value}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Pending Request Card ─────────────────────────────────────────────────────
function PendingCard({ item, onApprove, onReject }) {
  const cfg = leaveTypeCfg(item.leave_type);
  const Icon = cfg.icon;

  return (
    <View style={pc.card}>
      <View style={pc.top}>
        <IconSquare icon={Icon} color={cfg.color} size={36} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={pc.name}>{item.employee_name}</Text>
          <Text style={[pc.type, { color: cfg.color }]}>
            {item.leave_type} Leave
          </Text>
        </View>
        <StatusBadge status={item.status} />
      </View>

      {/* Date range + days */}
      <View style={pc.dateRow}>
        <CalendarDaysIcon size={13} color={C.muted} strokeWidth={2} />
        <Text style={pc.dateText}>
          {fmtDateShort(item.start_date)} – {fmtDateShort(item.end_date)}
        </Text>
        <View style={pc.daysPill}>
          <Text style={pc.daysText}>{item.total_days}d</Text>
        </View>
      </View>

      {/* Reason */}
      {item.reason ? (
        <View style={pc.reasonRow}>
          <DocumentTextIcon size={12} color={C.muted} strokeWidth={2} />
          <Text style={pc.reasonText} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>
      ) : null}

      {/* Balance info from API */}
      <View style={pc.balanceRow}>
        <Text style={pc.balanceMeta}>
          Balance:{" "}
          <Text style={{ color: cfg.color, fontWeight: "700" }}>
            {item.balance}
          </Text>{" "}
          days · Entitled: {item.entitled}
        </Text>
        <Text style={pc.appliedAt}>Applied {fmtDate(item.created_at)}</Text>
      </View>

      {/* Actions */}
      <View style={pc.actions}>
        <Pressable
          onPress={() => onReject(item.id)}
          style={({ pressed }) => [pc.rejectBtn, pressed && { opacity: 0.7 }]}
        >
          <XCircleIcon size={15} color={C.red} strokeWidth={2.5} />
          <Text style={pc.rejectText}>Reject</Text>
        </Pressable>
        <Pressable
          onPress={() => onApprove(item.id)}
          style={({ pressed }) => [pc.approveBtn, pressed && { opacity: 0.85 }]}
        >
          <CheckCircleIcon size={15} color={C.white} strokeWidth={2.5} />
          <Text style={pc.approveText}>Approve</Text>
        </Pressable>
      </View>
    </View>
  );
}

// ─── On Leave Today Row ───────────────────────────────────────────────────────
function OnLeaveTodayRow({ item, last }) {
  const cfg = leaveTypeCfg(item.leave_type);
  return (
    <>
      <View style={ol.row}>
        <IconSquare icon={cfg.icon} color={cfg.color} size={34} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={ol.name}>{item.employee_name}</Text>
          <Text style={ol.dept}>
            {item.department} · {item.leave_type} Leave
          </Text>
        </View>
        <View style={ol.right}>
          <View style={[ol.pill, { backgroundColor: cfg.bg }]}>
            <Text style={[ol.pillText, { color: cfg.color }]}>
              {item.days_remaining}d left
            </Text>
          </View>
          <Text style={ol.dates}>
            {fmtDateShort(item.start_date)} – {fmtDateShort(item.end_date)}
          </Text>
        </View>
      </View>
      {!last && <View style={ol.divider} />}
    </>
  );
}

// ─── By-Type Row (statistics.by_type) ────────────────────────────────────────
function ByTypeRow({ item, total, last }) {
  const cfg = leaveTypeCfg(item.leave_type);
  const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
  return (
    <>
      <View style={btr.row}>
        <IconSquare icon={cfg.icon} color={cfg.color} size={30} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <View style={btr.labelRow}>
            <Text style={btr.type}>{item.leave_type}</Text>
            <Text style={[btr.count, { color: cfg.color }]}>{item.count}</Text>
          </View>
          <View style={btr.track}>
            <View
              style={[
                btr.fill,
                { width: `${pct}%`, backgroundColor: C.blue }, // was cfg.color
              ]}
            />
          </View>
        </View>
      </View>
      {!last && <View style={btr.divider} />}
    </>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LeaveScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [pendingList, setPendingList] = useState(MOCK_PENDING);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 900);
  }, []);

  const handleApprove = useCallback((id) => {
    Alert.alert("Approve Leave", "Approve this leave request?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Approve",
        onPress: () => {
          // WIRE: POST /leave/{id}/approve/ or bulk_approve with ids:[id]
          setPendingList((prev) => prev.filter((r) => r.id !== id));
        },
      },
    ]);
  }, []);

  const handleReject = useCallback((id) => {
    Alert.alert(
      "Reject Leave",
      "Reject this leave request? A rejection reason will be required.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Reject",
          style: "destructive",
          onPress: () => {
            // WIRE: POST /leave/{id}/reject/ with rejection_reason
            setPendingList((prev) => prev.filter((r) => r.id !== id));
          },
        },
      ],
    );
  }, []);

  const stats = MOCK_STATISTICS;
  const myBalance = MOCK_MY_BALANCE;
  const onLeaveToday = MOCK_ON_LEAVE_TODAY;

  return (
    <View style={s.root}>
      {/* ── Custom header ── */}
      <SafeAreaView edges={["top"]} style={s.header}>
        <View style={s.titleRow}>
          <View style={s.titleLeft}>
            <View style={s.iconBadge}>
              <DocumentTextIcon size={18} color={C.accent} strokeWidth={2} />
            </View>
            <View>
              <Text style={s.title}>Leave</Text>
              <Text style={s.subtitle}>
                {stats.pending} pending · {onLeaveToday.total_on_leave} out
                today
              </Text>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              s.addBtn,
              pressed && { opacity: 0.8, transform: [{ scale: 0.92 }] },
            ]}
            onPress={() =>
              Alert.alert("Coming soon", "Apply for leave form coming shortly.")
            }
          >
            <PlusCircleIcon size={18} color={C.white} strokeWidth={2.5} />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.accent}
            colors={[C.accent]}
          />
        }
      >
        {/* ── Statistics banner ── */}
        <View style={s.section}>
          <StatsBanner stats={stats} />
        </View>

        {/* ── By leave type breakdown (statistics.by_type) ── */}
        <SectionLabel title="By Leave Type" />
        <View style={s.card}>
          {stats.by_type.map((item, i) => (
            <ByTypeRow
              key={item.leave_type}
              item={item}
              total={stats.total}
              last={i === stats.by_type.length - 1}
            />
          ))}
        </View>

        {/* ── My balance (my_balance API) ── */}
        <SectionLabel title="My Leave Balance" />
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.balanceScroll}
        >
          {myBalance.balances.map((b) => (
            <BalanceCard key={b.leave_type} balance={b} />
          ))}
        </ScrollView>

        {/* ── Pending approvals (pending API) ── */}
        <SectionLabel
          title="Pending Approvals"
          badge={pendingList.length}
          onAction={() =>
            Alert.alert("Coming soon", "Bulk approve coming shortly.")
          }
          actionLabel="Bulk approve"
        />
        {pendingList.length === 0 ? (
          <View style={s.emptyWrap}>
            <CheckCircleIcon size={32} color={C.green} strokeWidth={1.5} />
            <Text style={s.emptyTitle}>All caught up!</Text>
            <Text style={s.emptySub}>No pending leave requests</Text>
          </View>
        ) : (
          <View style={s.pendingList}>
            {pendingList.map((item) => (
              <PendingCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
              />
            ))}
          </View>
        )}

        {/* ── On leave today (employees_on_leave_today API) ── */}
        <SectionLabel title="Out Today" badge={onLeaveToday.total_on_leave} />
        {onLeaveToday.employees.length === 0 ? (
          <View style={s.emptyWrap}>
            <UserGroupIcon size={32} color={C.muted} strokeWidth={1.5} />
            <Text style={s.emptyTitle}>Everyone's in!</Text>
            <Text style={s.emptySub}>No employees on leave today</Text>
          </View>
        ) : (
          <View style={s.card}>
            {onLeaveToday.employees.map((emp, i) => (
              <OnLeaveTodayRow
                key={emp.id}
                item={emp}
                last={i === onLeaveToday.employees.length - 1}
              />
            ))}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// ─── Shared styles ────────────────────────────────────────────────────────────
const sh = StyleSheet.create({
  iconSquare: { alignItems: "center", justifyContent: "center", flexShrink: 0 },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 11, fontWeight: "700" },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginTop: 16,
    marginBottom: 10,
  },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.navy,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
  sectionBadge: {
    backgroundColor: C.accentLight,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sectionBadgeText: { fontSize: 11, fontWeight: "700", color: C.accent },
  sectionAction: { fontSize: 13, color: C.accent, fontWeight: "600" },
});

// ─── Screen styles ────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },

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
  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },

  section: { paddingHorizontal: 16, paddingTop: 16 },
  card: {
    marginHorizontal: 16,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },

  balanceScroll: { paddingHorizontal: 16, gap: 12, paddingBottom: 4 },

  pendingList: { paddingHorizontal: 16, gap: 12 },

  emptyWrap: {
    alignItems: "center",
    paddingVertical: 32,
    paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: C.navy, marginTop: 10 },
  emptySub: { fontSize: 13, color: C.muted, marginTop: 4, textAlign: "center" },
});

// ─── Banner styles ────────────────────────────────────────────────────────────
const st = StyleSheet.create({
  bannerContainer: { borderRadius: 18, padding: 18, gap: 16 },
  bannerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.3,
  },
  bannerSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    fontWeight: "500",
    marginTop: 2,
  },
  bannerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerPct: {
    fontSize: 16,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.5,
  },
  bannerPctLabel: {
    fontSize: 9,
    fontWeight: "600",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
  },
  bannerTiles: { flexDirection: "row", gap: 8 },
  bannerTile: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 6,
    alignItems: "center",
    gap: 5,
  },
  bannerTileNum: {
    fontSize: 22,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.5,
  },
  bannerTileLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255,255,255,0.8)",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});

// ─── Balance card styles ──────────────────────────────────────────────────────
const bc = StyleSheet.create({
  card: {
    width: 220,
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    gap: 10,
  },
  top: { flexDirection: "row", alignItems: "center" },
  type: { fontSize: 14, fontWeight: "700", color: C.navy, letterSpacing: -0.2 },
  entitled: { fontSize: 11, color: C.muted, fontWeight: "500", marginTop: 2 },
  balancePill: { alignItems: "center" },
  balanceNum: { fontSize: 22, fontWeight: "800", letterSpacing: -0.5 },
  balanceLabel: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  trackWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  track: {
    flex: 1,
    height: 5,
    backgroundColor: C.divider,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3 },
  pctText: { fontSize: 10, color: C.muted, fontWeight: "600", minWidth: 42 },
  statsRow: { flexDirection: "row" },
  statCell: { flex: 1, flexDirection: "row", alignItems: "center" },
  sep: { width: 1, height: 24, backgroundColor: C.divider },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statVal: { fontSize: 13, fontWeight: "800", color: C.navy },
});

// ─── Pending card styles ──────────────────────────────────────────────────────
const pc = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    gap: 10,
  },
  top: { flexDirection: "row", alignItems: "center" },
  name: { fontSize: 15, fontWeight: "700", color: C.navy, letterSpacing: -0.2 },
  type: { fontSize: 12, fontWeight: "600", marginTop: 2 },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  dateText: { fontSize: 13, color: C.sub, fontWeight: "500" },
  daysPill: {
    backgroundColor: C.accentLight,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  daysText: { fontSize: 11, fontWeight: "700", color: C.accent },
  reasonRow: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  reasonText: {
    fontSize: 12,
    color: C.sub,
    fontWeight: "500",
    flex: 1,
    lineHeight: 17,
  },
  balanceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceMeta: { fontSize: 12, color: C.muted, fontWeight: "500" },
  appliedAt: { fontSize: 11, color: C.muted },
  actions: { flexDirection: "row", gap: 10, paddingTop: 4 },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.red,
    backgroundColor: C.redBg,
  },
  rejectText: { fontSize: 13, fontWeight: "700", color: C.red },
  approveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: C.accent,
  },
  approveText: { fontSize: 13, fontWeight: "700", color: C.white },
});

// ─── On leave today styles ────────────────────────────────────────────────────
const ol = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", padding: 14 },
  name: { fontSize: 14, fontWeight: "700", color: C.navy },
  dept: { fontSize: 12, color: C.muted, fontWeight: "500", marginTop: 2 },
  right: { alignItems: "flex-end", gap: 4 },
  pill: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  pillText: { fontSize: 11, fontWeight: "700" },
  dates: { fontSize: 11, color: C.muted },
  divider: { height: 1, backgroundColor: C.divider, marginHorizontal: 14 },
});

// ─── By type row styles ───────────────────────────────────────────────────────
const btr = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", padding: 14 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  type: { fontSize: 13, fontWeight: "600", color: C.navy },
  count: { fontSize: 13, fontWeight: "800" },
  track: {
    height: 5,
    backgroundColor: C.divider,
    borderRadius: 3,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3 },
  divider: { height: 1, backgroundColor: C.divider, marginHorizontal: 14 },
});
