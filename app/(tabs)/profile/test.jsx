import { useCallback, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
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
  AdjustmentsHorizontalIcon,
  ArrowDownTrayIcon,
  ArrowPathIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  ChartBarIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  XCircleIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import {
  CheckCircleIcon as CheckCircleSolid,
  ClockIcon as ClockSolid,
  XCircleIcon as XCircleSolid,
} from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── Design tokens — exact mirror of AddEmployeeScreen ───────────────────────
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
  purple: "#7C3AED",
  orange: "#F97316",
  inputBg: "#FAFAFA",
  focusBorder: "#0F766E",
  errorBorder: "#DC2626",
  errorBg: "#FEF2F2",
};

// ─── Mock data — mirrors /leave/ API response shape ──────────────────────────
const MOCK_LEAVES = [
  {
    id: 1,
    employee: 12,
    employee_name: "Akosua Mensah",
    employee_email: "akosua.mensah@company.com",
    employee_avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=120&q=80",
    department: "Engineering",
    leave_type: "Annual Leave",
    start_date: "2026-04-14",
    end_date: "2026-04-18",
    reason:
      "Travelling for a family vacation. Will be unavailable for the entire period.",
    status: "Pending",
    total_days: 5,
    entitled: 21,
    utilized: 5,
    balance: 16,
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
    employee: 7,
    employee_name: "Kwame Asante",
    employee_email: "kwame.asante@company.com",
    employee_avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=120&q=80",
    department: "Finance",
    leave_type: "Sick Leave",
    start_date: "2026-04-13",
    end_date: "2026-04-15",
    reason: "Diagnosed with malaria. Doctor's note attached.",
    status: "Approved",
    total_days: 3,
    entitled: 10,
    utilized: 3,
    balance: 7,
    carried_forward: 0,
    approved_by: 1,
    approved_by_name: "Admin User",
    approved_at: "2026-04-12T14:05:00Z",
    rejected_by: null,
    rejected_at: null,
    rejection_reason: null,
    created_at: "2026-04-11T09:10:00Z",
    updated_at: "2026-04-12T14:05:00Z",
  },
  {
    id: 3,
    employee: 4,
    employee_name: "Efua Boateng",
    employee_email: "efua.boateng@company.com",
    employee_avatar:
      "https://images.unsplash.com/photo-1589156229687-496a31ad1d1f?w=120&q=80",
    department: "HR",
    leave_type: "Maternity Leave",
    start_date: "2026-05-01",
    end_date: "2026-08-01",
    reason:
      "Maternity leave following upcoming birth. Medical certificate submitted.",
    status: "Approved",
    total_days: 93,
    entitled: 98,
    utilized: 0,
    balance: 98,
    carried_forward: 0,
    approved_by: 1,
    approved_by_name: "Admin User",
    approved_at: "2026-04-08T10:00:00Z",
    rejected_by: null,
    rejected_at: null,
    rejection_reason: null,
    created_at: "2026-04-05T11:00:00Z",
    updated_at: "2026-04-08T10:00:00Z",
  },
  {
    id: 4,
    employee: 19,
    employee_name: "Kofi Darko",
    employee_email: "kofi.darko@company.com",
    employee_avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=80",
    department: "Sales",
    leave_type: "Casual Leave",
    start_date: "2026-04-20",
    end_date: "2026-04-21",
    reason: "Personal errand — bank and documentation processes.",
    status: "Rejected",
    total_days: 2,
    entitled: 5,
    utilized: 0,
    balance: 5,
    carried_forward: 0,
    approved_by: null,
    approved_by_name: null,
    approved_at: null,
    rejected_by: 1,
    rejected_at: "2026-04-12T16:30:00Z",
    rejection_reason: "Peak sales period. Please reschedule after April 30.",
    created_at: "2026-04-11T15:44:00Z",
    updated_at: "2026-04-12T16:30:00Z",
  },
  {
    id: 5,
    employee: 23,
    employee_name: "Abena Owusu",
    employee_email: "abena.owusu@company.com",
    employee_avatar:
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=120&q=80",
    department: "Engineering",
    leave_type: "Emergency Leave",
    start_date: "2026-04-13",
    end_date: "2026-04-14",
    reason: "Family bereavement — grandmother passed away.",
    status: "Approved",
    total_days: 2,
    entitled: 3,
    utilized: 2,
    balance: 1,
    carried_forward: 0,
    approved_by: 1,
    approved_by_name: "Admin User",
    approved_at: "2026-04-13T07:00:00Z",
    rejected_by: null,
    rejected_at: null,
    rejection_reason: null,
    created_at: "2026-04-12T23:55:00Z",
    updated_at: "2026-04-13T07:00:00Z",
  },
  {
    id: 6,
    employee: 31,
    employee_name: "Emmanuel Tetteh",
    employee_email: "e.tetteh@company.com",
    employee_avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=80",
    department: "Operations",
    leave_type: "Annual Leave",
    start_date: "2026-04-28",
    end_date: "2026-05-02",
    reason:
      "Long weekend getaway. All deliverables will be completed before departure.",
    status: "Pending",
    total_days: 5,
    entitled: 21,
    utilized: 7,
    balance: 14,
    carried_forward: 2,
    approved_by: null,
    approved_by_name: null,
    approved_at: null,
    rejected_by: null,
    rejected_at: null,
    rejection_reason: null,
    created_at: "2026-04-09T13:20:00Z",
    updated_at: "2026-04-09T13:20:00Z",
  },
  {
    id: 7,
    employee: 9,
    employee_name: "Yaa Amponsah",
    employee_email: "yaa.amponsah@company.com",
    employee_avatar:
      "https://images.unsplash.com/photo-1520813792240-56fc4a3765a7?w=120&q=80",
    department: "Marketing",
    leave_type: "Sick Leave",
    start_date: "2026-04-16",
    end_date: "2026-04-16",
    reason: "Routine medical checkup and lab tests.",
    status: "Pending",
    total_days: 1,
    entitled: 10,
    utilized: 1,
    balance: 9,
    carried_forward: 0,
    approved_by: null,
    approved_by_name: null,
    approved_at: null,
    rejected_by: null,
    rejected_at: null,
    rejection_reason: null,
    created_at: "2026-04-12T07:55:00Z",
    updated_at: "2026-04-12T07:55:00Z",
  },
  {
    id: 8,
    employee: 16,
    employee_name: "Nana Adu",
    employee_email: "nana.adu@company.com",
    employee_avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&q=80",
    department: "Finance",
    leave_type: "Paternity Leave",
    start_date: "2026-04-22",
    end_date: "2026-05-05",
    reason: "Wife expecting on April 21. Will take 2 weeks paternity leave.",
    status: "Pending",
    total_days: 14,
    entitled: 14,
    utilized: 0,
    balance: 14,
    carried_forward: 0,
    approved_by: null,
    approved_by_name: null,
    approved_at: null,
    rejected_by: null,
    rejected_at: null,
    rejection_reason: null,
    created_at: "2026-04-08T16:10:00Z",
    updated_at: "2026-04-08T16:10:00Z",
  },
];

const DEPARTMENTS = [
  "All",
  "Engineering",
  "Finance",
  "HR",
  "Sales",
  "Marketing",
  "Operations",
];
const STATUS_TABS = ["All", "Pending", "Approved", "Rejected"];
const LEAVE_TYPES = [
  "All Types",
  "Annual Leave",
  "Sick Leave",
  "Casual Leave",
  "Emergency Leave",
  "Maternity Leave",
  "Paternity Leave",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateShort(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  Pending: {
    color: C.amber,
    bg: C.amberBg,
    text: C.amberText,
    Icon: ClockSolid,
    label: "Pending",
  },
  Approved: {
    color: C.green,
    bg: C.greenBg,
    text: C.greenText,
    Icon: CheckCircleSolid,
    label: "Approved",
  },
  Rejected: {
    color: C.red,
    bg: C.redBg,
    text: C.redText,
    Icon: XCircleSolid,
    label: "Rejected",
  },
  Cancelled: {
    color: C.sub,
    bg: C.divider,
    text: C.sub,
    Icon: XCircleSolid,
    label: "Cancelled",
  },
  Completed: {
    color: C.blue,
    bg: "#EFF6FF",
    text: C.blue,
    Icon: CheckCircleSolid,
    label: "Completed",
  },
};

const LEAVE_TYPE_COLORS = {
  "Annual Leave": C.blue,
  "Sick Leave": C.red,
  "Casual Leave": C.orange,
  "Emergency Leave": "#DC2626",
  "Maternity Leave": C.purple,
  "Paternity Leave": C.accent,
};

// ─── Shared sub-components (mirrors AddEmployeeScreen) ────────────────────────
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

function SectionHeader({ title, subtitle }) {
  return (
    <View style={sh.sectionHeaderRow}>
      <View style={sh.sectionBarAccent} />
      <View>
        <Text style={sh.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={sh.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useState(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        ts.toast,
        {
          backgroundColor:
            type === "success" ? C.green : type === "error" ? C.red : C.amber,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {type === "success" ? (
        <CheckCircleIcon size={18} color="#fff" strokeWidth={2.5} />
      ) : type === "error" ? (
        <ExclamationTriangleIcon size={18} color="#fff" strokeWidth={2.5} />
      ) : (
        <ClockIcon size={18} color="#fff" strokeWidth={2.5} />
      )}
      <Text style={ts.toastText}>{message}</Text>
    </Animated.View>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, iconColor, bg }) {
  return (
    <View style={[sc.card, { borderLeftColor: iconColor }]}>
      <View style={[sc.iconWrap, { backgroundColor: bg }]}>
        <Icon size={16} color={iconColor} strokeWidth={2.2} />
      </View>
      <Text style={sc.value}>{value}</Text>
      <Text style={sc.label}>{label}</Text>
    </View>
  );
}

// ─── Filter Chip ──────────────────────────────────────────────────────────────
function FilterChip({ label, active, onPress, color = C.accent }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        fc.chip,
        active && { backgroundColor: color, borderColor: color },
        pressed && { opacity: 0.75 },
      ]}
    >
      <Text style={[fc.chipText, active && { color: "#fff" }]}>{label}</Text>
    </Pressable>
  );
}

// ─── Leave Card ───────────────────────────────────────────────────────────────
function LeaveCard({ item, onApprove, onReject, onPress }) {
  const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.Pending;
  const typeColor = LEAVE_TYPE_COLORS[item.leave_type] || C.accent;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () =>
    Animated.spring(scaleAnim, {
      toValue: 0.984,
      useNativeDriver: true,
      speed: 40,
    }).start();
  const handlePressOut = () =>
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 40,
    }).start();

  return (
    <Pressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
    >
      <Animated.View style={[lc.card, { transform: [{ scale: scaleAnim }] }]}>
        {/* ── Header row ── */}
        <View style={lc.header}>
          <Image source={{ uri: item.employee_avatar }} style={lc.avatar} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={lc.empName} numberOfLines={1}>
              {item.employee_name}
            </Text>
            <View style={lc.metaRow}>
              <BuildingOffice2Icon size={11} color={C.muted} strokeWidth={2} />
              <Text style={lc.metaText}>{item.department}</Text>
              <View style={lc.dot} />
              <Text style={lc.metaText}>{timeAgo(item.created_at)}</Text>
            </View>
          </View>
          {/* Status badge */}
          <View style={[lc.statusBadge, { backgroundColor: sc.bg }]}>
            <sc.Icon size={11} color={sc.color} />
            <Text style={[lc.statusText, { color: sc.text }]}>{sc.label}</Text>
          </View>
        </View>

        {/* ── Leave type + dates ── */}
        <View style={lc.typeRow}>
          <View
            style={[
              lc.typeChip,
              {
                backgroundColor: typeColor + "14",
                borderColor: typeColor + "30",
              },
            ]}
          >
            <BriefcaseIcon size={11} color={typeColor} strokeWidth={2.2} />
            <Text style={[lc.typeText, { color: typeColor }]}>
              {item.leave_type}
            </Text>
          </View>
          <View style={lc.datesRow}>
            <CalendarDaysIcon size={12} color={C.muted} strokeWidth={2} />
            <Text style={lc.datesText}>
              {formatDateShort(item.start_date)} →{" "}
              {formatDateShort(item.end_date)}
            </Text>
            <View style={lc.daysBadge}>
              <Text style={lc.daysText}>{item.total_days}d</Text>
            </View>
          </View>
        </View>

        {/* ── Reason ── */}
        <View style={lc.reasonRow}>
          <DocumentTextIcon size={12} color={C.muted} strokeWidth={2} />
          <Text style={lc.reasonText} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>

        {/* ── Balance bar ── */}
        <View style={lc.balanceWrap}>
          <View style={lc.balanceRow}>
            <Text style={lc.balanceLabel}>Leave Balance</Text>
            <Text style={lc.balanceVal}>
              <Text style={{ color: C.accent, fontWeight: "800" }}>
                {item.balance}
              </Text>
              <Text style={{ color: C.muted }}> / {item.entitled} days</Text>
            </Text>
          </View>
          <View style={lc.progressTrack}>
            <View
              style={[
                lc.progressFill,
                {
                  width:
                    item.entitled > 0
                      ? `${Math.min((item.balance / item.entitled) * 100, 100)}%`
                      : "0%",
                  backgroundColor:
                    item.balance / item.entitled > 0.4 ? C.accent : C.amber,
                },
              ]}
            />
          </View>
        </View>

        {/* ── Rejection reason ── */}
        {item.rejection_reason ? (
          <View style={lc.rejectionBox}>
            <ExclamationTriangleIcon size={12} color={C.red} strokeWidth={2} />
            <Text style={lc.rejectionText} numberOfLines={2}>
              {item.rejection_reason}
            </Text>
          </View>
        ) : null}

        {/* ── Approved by ── */}
        {item.approved_by_name ? (
          <View style={lc.approvedRow}>
            <CheckCircleIcon size={12} color={C.green} strokeWidth={2} />
            <Text style={lc.approvedText}>
              Approved by{" "}
              <Text style={{ fontWeight: "700" }}>{item.approved_by_name}</Text>
              {" · "}
              {formatDate(item.approved_at)}
            </Text>
          </View>
        ) : null}

        {/* ── Action buttons (only for Pending) ── */}
        {item.status === "Pending" && (
          <View style={lc.actions}>
            <Pressable
              onPress={() => onReject(item)}
              style={({ pressed }) => [
                lc.rejectBtn,
                pressed && { opacity: 0.75 },
              ]}
            >
              <XCircleIcon size={15} color={C.red} strokeWidth={2.2} />
              <Text style={lc.rejectBtnText}>Reject</Text>
            </Pressable>
            <Pressable
              onPress={() => onApprove(item)}
              style={({ pressed }) => [
                lc.approveBtn,
                pressed && { opacity: 0.8 },
              ]}
            >
              <CheckCircleIcon size={15} color="#fff" strokeWidth={2.2} />
              <Text style={lc.approveBtnText}>Approve</Text>
            </Pressable>
          </View>
        )}
      </Animated.View>
    </Pressable>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────
function DetailModal({ item, visible, onClose, onApprove, onReject }) {
  const translateY = useRef(new Animated.Value(600)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useState(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          bounciness: 4,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 600,
          duration: 280,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!item) return null;

  const sc = STATUS_CONFIG[item.status] || STATUS_CONFIG.Pending;
  const typeColor = LEAVE_TYPE_COLORS[item.leave_type] || C.accent;

  return (
    <View style={dm.rootOverlay} pointerEvents={visible ? "auto" : "none"}>
      <Animated.View style={[dm.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={{ flex: 1 }} onPress={onClose} />
      </Animated.View>
      <Animated.View style={[dm.sheet, { transform: [{ translateY }] }]}>
        {/* Handle */}
        <View style={dm.handle} />

        {/* Header */}
        <View style={dm.sheetHeader}>
          <View>
            <Text style={dm.sheetTitle}>Leave Request #{item.id}</Text>
            <Text style={dm.sheetSub}>Full details & balance</Text>
          </View>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [dm.closeBtn, pressed && { opacity: 0.6 }]}
          >
            <XMarkIcon size={18} color={C.navy} strokeWidth={2.2} />
          </Pressable>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Employee profile */}
          <View style={dm.profileRow}>
            <Image source={{ uri: item.employee_avatar }} style={dm.avatar} />
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={dm.empName}>{item.employee_name}</Text>
              <Text style={dm.empEmail}>{item.employee_email}</Text>
              <View style={dm.deptRow}>
                <BuildingOffice2Icon
                  size={12}
                  color={C.muted}
                  strokeWidth={2}
                />
                <Text style={dm.deptText}>{item.department}</Text>
              </View>
            </View>
            <View style={[dm.statusBig, { backgroundColor: sc.bg }]}>
              <sc.Icon size={14} color={sc.color} />
              <Text style={[dm.statusBigText, { color: sc.text }]}>
                {sc.label}
              </Text>
            </View>
          </View>

          {/* Leave info grid */}
          <View style={dm.infoGrid}>
            <View style={dm.infoCell}>
              <IconSquare icon={BriefcaseIcon} color={typeColor} size={30} />
              <Text style={dm.infoCellLabel}>Type</Text>
              <Text style={dm.infoCellVal}>{item.leave_type}</Text>
            </View>
            <View style={dm.infoCellDivider} />
            <View style={dm.infoCell}>
              <IconSquare icon={CalendarDaysIcon} color={C.blue} size={30} />
              <Text style={dm.infoCellLabel}>Duration</Text>
              <Text style={dm.infoCellVal}>{item.total_days} days</Text>
            </View>
            <View style={dm.infoCellDivider} />
            <View style={dm.infoCell}>
              <IconSquare icon={ChartBarIcon} color={C.accent} size={30} />
              <Text style={dm.infoCellLabel}>Balance</Text>
              <Text style={dm.infoCellVal}>
                {item.balance} / {item.entitled}
              </Text>
            </View>
          </View>

          {/* Dates */}
          <View style={dm.section}>
            <SectionHeader title="Leave Period" subtitle="Start & end dates" />
            <View style={dm.card}>
              <View style={dm.dateRow}>
                <View style={dm.dateBlock}>
                  <Text style={dm.dateBlockLabel}>Start Date</Text>
                  <Text style={dm.dateBlockVal}>
                    {formatDate(item.start_date)}
                  </Text>
                </View>
                <View style={dm.dateDivider} />
                <ArrowPathIcon size={16} color={C.muted} strokeWidth={2} />
                <View style={dm.dateDivider} />
                <View style={dm.dateBlock}>
                  <Text style={dm.dateBlockLabel}>End Date</Text>
                  <Text style={dm.dateBlockVal}>
                    {formatDate(item.end_date)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Balance breakdown */}
          <View style={dm.section}>
            <SectionHeader
              title="Leave Balance"
              subtitle="Entitlement breakdown"
            />
            <View style={dm.card}>
              {[
                { label: "Entitled", val: item.entitled, color: C.blue },
                { label: "Utilized", val: item.utilized, color: C.amber },
                { label: "Balance", val: item.balance, color: C.accent },
                {
                  label: "Carried Forward",
                  val: item.carried_forward,
                  color: C.purple,
                },
              ].map((row, i) => (
                <View
                  key={row.label}
                  style={[dm.balRow, i > 0 && dm.balRowBorder]}
                >
                  <View style={[dm.balDot, { backgroundColor: row.color }]} />
                  <Text style={dm.balLabel}>{row.label}</Text>
                  <Text style={[dm.balVal, { color: row.color }]}>
                    {row.val} days
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Reason */}
          <View style={dm.section}>
            <SectionHeader title="Reason" subtitle="Employee's stated reason" />
            <View style={dm.card}>
              <View style={dm.reasonBox}>
                <DocumentTextIcon size={14} color={C.sub} strokeWidth={2} />
                <Text style={dm.reasonFullText}>{item.reason}</Text>
              </View>
            </View>
          </View>

          {/* Rejection reason */}
          {item.rejection_reason ? (
            <View style={dm.section}>
              <SectionHeader title="Rejection Reason" />
              <View style={[dm.card, dm.rejCard]}>
                <ExclamationTriangleIcon
                  size={14}
                  color={C.red}
                  strokeWidth={2}
                />
                <Text style={dm.rejText}>{item.rejection_reason}</Text>
              </View>
            </View>
          ) : null}

          {/* Timeline */}
          <View style={dm.section}>
            <SectionHeader title="Timeline" subtitle="Request history" />
            <View style={dm.card}>
              <View style={dm.timelineItem}>
                <View style={[dm.tlDot, { backgroundColor: C.blue }]} />
                <View style={{ flex: 1 }}>
                  <Text style={dm.tlAction}>Request Submitted</Text>
                  <Text style={dm.tlTime}>{formatDate(item.created_at)}</Text>
                </View>
              </View>
              {item.approved_at ? (
                <View style={dm.timelineItem}>
                  <View style={[dm.tlDot, { backgroundColor: C.green }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={dm.tlAction}>
                      Approved by {item.approved_by_name}
                    </Text>
                    <Text style={dm.tlTime}>
                      {formatDate(item.approved_at)}
                    </Text>
                  </View>
                </View>
              ) : null}
              {item.rejected_at ? (
                <View style={dm.timelineItem}>
                  <View style={[dm.tlDot, { backgroundColor: C.red }]} />
                  <View style={{ flex: 1 }}>
                    <Text style={dm.tlAction}>Request Rejected</Text>
                    <Text style={dm.tlTime}>
                      {formatDate(item.rejected_at)}
                    </Text>
                  </View>
                </View>
              ) : null}
            </View>
          </View>

          {/* Action buttons */}
          {item.status === "Pending" && (
            <View style={dm.actions}>
              <Pressable
                onPress={() => {
                  onReject(item);
                  onClose();
                }}
                style={({ pressed }) => [
                  dm.rejectBtn,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <XCircleIcon size={17} color={C.red} strokeWidth={2.2} />
                <Text style={dm.rejectBtnText}>Reject Request</Text>
              </Pressable>
              <Pressable
                onPress={() => {
                  onApprove(item);
                  onClose();
                }}
                style={({ pressed }) => [
                  dm.approveBtn,
                  pressed && { opacity: 0.8 },
                ]}
              >
                <CheckCircleIcon size={17} color="#fff" strokeWidth={2.2} />
                <Text style={dm.approveBtnText}>Approve Request</Text>
              </Pressable>
            </View>
          )}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ activeStatus, activeType }) {
  return (
    <View style={es.wrap}>
      <View style={es.iconWrap}>
        <CalendarDaysIcon size={32} color={C.muted} strokeWidth={1.5} />
      </View>
      <Text style={es.title}>No leave requests found</Text>
      <Text style={es.sub}>
        {activeStatus !== "All" || activeType !== "All Types"
          ? "Try adjusting your filters"
          : "All leave requests will appear here"}
      </Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function LeaveManagementScreen() {
  const [leaves, setLeaves] = useState(MOCK_LEAVES);
  const [search, setSearch] = useState("");
  const [activeStatus, setActiveStatus] = useState("All");
  const [activeType, setActiveType] = useState("All Types");
  const [activeDept, setActiveDept] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const filterHeight = useRef(new Animated.Value(0)).current;

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const toggleFilters = () => {
    const toVal = showFilters ? 0 : 160;
    setShowFilters(!showFilters);
    Animated.spring(filterHeight, {
      toValue: toVal,
      useNativeDriver: false,
      speed: 14,
    }).start();
  };

  const handleApprove = useCallback(
    (item) => {
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === item.id
            ? {
                ...l,
                status: "Approved",
                approved_by: 1,
                approved_by_name: "Admin User",
                approved_at: new Date().toISOString(),
              }
            : l,
        ),
      );
      showToast(
        `Approved ${item.employee_name}'s ${item.leave_type}`,
        "success",
      );
    },
    [showToast],
  );

  const handleReject = useCallback(
    (item) => {
      setLeaves((prev) =>
        prev.map((l) =>
          l.id === item.id
            ? {
                ...l,
                status: "Rejected",
                rejected_at: new Date().toISOString(),
                rejection_reason: "Rejected by HR.",
              }
            : l,
        ),
      );
      showToast(`Rejected ${item.employee_name}'s request`, "error");
    },
    [showToast],
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1200);
  }, []);

  // Stats
  const stats = {
    total: leaves.length,
    pending: leaves.filter((l) => l.status === "Pending").length,
    approved: leaves.filter((l) => l.status === "Approved").length,
    rejected: leaves.filter((l) => l.status === "Rejected").length,
  };

  // Filter logic
  const filtered = leaves.filter((l) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      l.employee_name.toLowerCase().includes(q) ||
      l.leave_type.toLowerCase().includes(q) ||
      l.department.toLowerCase().includes(q) ||
      l.reason.toLowerCase().includes(q);
    const matchStatus = activeStatus === "All" || l.status === activeStatus;
    const matchType = activeType === "All Types" || l.leave_type === activeType;
    const matchDept = activeDept === "All" || l.department === activeDept;
    return matchSearch && matchStatus && matchType && matchDept;
  });

  const hasActiveFilters =
    activeStatus !== "All" ||
    activeType !== "All Types" ||
    activeDept !== "All";

  return (
    <View style={s.root}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />

      {/* ── Navbar ── */}
      <SafeAreaView edges={["top"]} style={s.navbar}>
        <View style={s.navLeft}>
          <View style={s.navBadge}>
            <CalendarDaysIcon size={16} color={C.accent} strokeWidth={2.5} />
          </View>
          <View>
            <Text style={s.navTitle}>Leave Requests</Text>
            <Text style={s.navSub}>
              {stats.pending} pending · {stats.total} total
            </Text>
          </View>
        </View>
        <View style={s.navRight}>
          <Pressable
            style={({ pressed }) => [s.navBtn, pressed && { opacity: 0.6 }]}
            onPress={() => showToast("CSV export triggered", "success")}
          >
            <ArrowDownTrayIcon size={17} color={C.sub} strokeWidth={2.2} />
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              s.navBtn,
              hasActiveFilters && {
                backgroundColor: C.accentLight,
                borderColor: C.accentMid,
              },
              pressed && { opacity: 0.6 },
            ]}
            onPress={toggleFilters}
          >
            <AdjustmentsHorizontalIcon
              size={17}
              color={hasActiveFilters ? C.accent : C.sub}
              strokeWidth={2.2}
            />
            {hasActiveFilters ? <View style={s.filterDot} /> : null}
          </Pressable>
        </View>
      </SafeAreaView>

      {/* ── Search bar ── */}
      <View style={s.searchWrap}>
        <View style={s.searchRow}>
          <MagnifyingGlassIcon size={16} color={C.muted} strokeWidth={2} />
          <TextInput
            style={s.searchInput}
            placeholder="Search by name, type, department…"
            placeholderTextColor={C.muted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            returnKeyType="search"
          />
          {search ? (
            <Pressable onPress={() => setSearch("")}>
              <XMarkIcon size={16} color={C.muted} strokeWidth={2} />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* ── Status tabs ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabsContainer}
        style={s.tabsScroll}
      >
        {STATUS_TABS.map((tab) => {
          const count =
            tab === "All"
              ? stats.total
              : tab === "Pending"
                ? stats.pending
                : tab === "Approved"
                  ? stats.approved
                  : stats.rejected;
          const isActive = activeStatus === tab;
          const tabColor =
            tab === "Approved"
              ? C.green
              : tab === "Rejected"
                ? C.red
                : tab === "Pending"
                  ? C.amber
                  : C.accent;
          return (
            <Pressable
              key={tab}
              onPress={() => setActiveStatus(tab)}
              style={({ pressed }) => [
                s.tab,
                isActive && {
                  backgroundColor: tabColor,
                  borderColor: tabColor,
                },
                pressed && { opacity: 0.75 },
              ]}
            >
              <Text style={[s.tabText, isActive && { color: "#fff" }]}>
                {tab}
              </Text>
              <View
                style={[
                  s.tabBadge,
                  isActive && { backgroundColor: "rgba(255,255,255,0.25)" },
                ]}
              >
                <Text style={[s.tabBadgeText, isActive && { color: "#fff" }]}>
                  {count}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* ── Expandable filters ── */}
      <Animated.View
        style={[s.filterPanel, { maxHeight: filterHeight, overflow: "hidden" }]}
      >
        <View style={s.filterBlock}>
          <View style={s.filterTitleRow}>
            <FunnelIcon size={12} color={C.sub} strokeWidth={2} />
            <Text style={s.filterTitle}>Department</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.chipsRow}
          >
            {DEPARTMENTS.map((d) => (
              <FilterChip
                key={d}
                label={d}
                active={activeDept === d}
                onPress={() => setActiveDept(d)}
              />
            ))}
          </ScrollView>
        </View>
        <View
          style={[
            s.filterBlock,
            { borderTopWidth: 1, borderTopColor: C.divider },
          ]}
        >
          <View style={s.filterTitleRow}>
            <BriefcaseIcon size={12} color={C.sub} strokeWidth={2} />
            <Text style={s.filterTitle}>Leave Type</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.chipsRow}
          >
            {LEAVE_TYPES.map((t) => (
              <FilterChip
                key={t}
                label={t}
                active={activeType === t}
                onPress={() => setActiveType(t)}
                color={LEAVE_TYPE_COLORS[t] || C.accent}
              />
            ))}
          </ScrollView>
        </View>
      </Animated.View>

      {/* ── Stats strip ── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.statsRow}
        style={{ flexShrink: 0 }}
      >
        <StatCard
          label="Total"
          value={stats.total}
          icon={UserGroupIcon}
          iconColor={C.blue}
          bg="#EFF6FF"
        />
        <StatCard
          label="Pending"
          value={stats.pending}
          icon={ClockIcon}
          iconColor={C.amber}
          bg={C.amberBg}
        />
        <StatCard
          label="Approved"
          value={stats.approved}
          icon={CheckCircleIcon}
          iconColor={C.green}
          bg={C.greenBg}
        />
        <StatCard
          label="Rejected"
          value={stats.rejected}
          icon={XCircleIcon}
          iconColor={C.red}
          bg={C.redBg}
        />
      </ScrollView>

      {/* ── List ── */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={C.accent}
            colors={[C.accent]}
          />
        }
      >
        {filtered.length === 0 ? (
          <EmptyState activeStatus={activeStatus} activeType={activeType} />
        ) : (
          <>
            <View style={s.resultsHeader}>
              <Text style={s.resultsCount}>
                {filtered.length}{" "}
                {filtered.length === 1 ? "request" : "requests"}
                {hasActiveFilters || search ? " · filtered" : ""}
              </Text>
              {(hasActiveFilters || search) && (
                <Pressable
                  onPress={() => {
                    setSearch("");
                    setActiveStatus("All");
                    setActiveType("All Types");
                    setActiveDept("All");
                    setShowFilters(false);
                    Animated.spring(filterHeight, {
                      toValue: 0,
                      useNativeDriver: false,
                    }).start();
                  }}
                >
                  <Text style={s.clearAll}>Clear all</Text>
                </Pressable>
              )}
            </View>
            {filtered.map((item) => (
              <LeaveCard
                key={item.id}
                item={item}
                onApprove={handleApprove}
                onReject={handleReject}
                onPress={() => setSelectedLeave(item)}
              />
            ))}
          </>
        )}
        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Detail Modal ── */}
      {selectedLeave && (
        <DetailModal
          item={leaves.find((l) => l.id === selectedLeave.id) || selectedLeave}
          visible={!!selectedLeave}
          onClose={() => setSelectedLeave(null)}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

// Shared
const sh = StyleSheet.create({
  iconSquare: { alignItems: "center", justifyContent: "center", flexShrink: 0 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionBarAccent: {
    width: 3,
    height: 30,
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: C.muted,
    marginTop: 1,
    fontWeight: "500",  
  },
});

// Toast
const ts = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  toastText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: "#fff",
    letterSpacing: -0.1,
  },
});

// Stat card
const sc = StyleSheet.create({
  card: {
    width: 90,
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    borderLeftWidth: 3,
    padding: 12,
    marginRight: 10,
    alignItems: "flex-start",
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  value: {
    fontSize: 22,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.5,
  },
  label: {
    fontSize: 10,
    fontWeight: "600",
    color: C.muted,
    marginTop: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
});

// Filter chip
const fc = StyleSheet.create({
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.inputBg,
    marginRight: 7,
  },
  chipText: { fontSize: 12, fontWeight: "600", color: C.sub },
});

// Leave card
const lc = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 14,
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  header: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: C.border,
  },
  empName: {
    fontSize: 14,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.2,
  },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 2 },
  metaText: { fontSize: 11, color: C.muted, fontWeight: "500" },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: C.muted },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: "700" },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  typeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
  },
  typeText: { fontSize: 11, fontWeight: "700" },
  datesRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  datesText: { fontSize: 11, color: C.sub, fontWeight: "600" },
  daysBadge: {
    backgroundColor: C.accentLight,
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 2,
  },
  daysText: { fontSize: 10, fontWeight: "800", color: C.accent },
  reasonRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginBottom: 10,
  },
  reasonText: {
    flex: 1,
    fontSize: 12,
    color: C.sub,
    fontWeight: "500",
    lineHeight: 17,
  },
  balanceWrap: { marginBottom: 2 },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  balanceLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  balanceVal: { fontSize: 11 },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: C.divider,
    overflow: "hidden",
  },
  progressFill: { height: 4, borderRadius: 2 },
  rejectionBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 6,
    marginTop: 8,
    backgroundColor: C.redBg,
    borderRadius: 8,
    padding: 9,
  },
  rejectionText: {
    flex: 1,
    fontSize: 11,
    color: C.redText,
    fontWeight: "600",
    lineHeight: 16,
  },
  approvedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 7,
  },
  approvedText: { fontSize: 11, color: C.sub, fontWeight: "500" },
  actions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: C.divider,
    paddingTop: 12,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#FECACA",
    backgroundColor: C.redBg,
  },
  rejectBtnText: { fontSize: 13, fontWeight: "700", color: C.red },
  approveBtn: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    backgroundColor: C.accent,
  },
  approveBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

// Detail modal
const dm = StyleSheet.create({
  rootOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 900,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.5)",
  },
  sheet: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: C.bg,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: C.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
    marginBottom: 4,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
  },
  sheetSub: { fontSize: 11, color: C.muted, fontWeight: "500", marginTop: 2 },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
    marginBottom: 4,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: C.border,
  },
  empName: {
    fontSize: 17,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
  },
  empEmail: { fontSize: 12, color: C.sub, fontWeight: "500", marginTop: 2 },
  deptRow: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  deptText: { fontSize: 11, color: C.muted, fontWeight: "600" },
  statusBig: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 12,
  },
  statusBigText: { fontSize: 12, fontWeight: "800" },
  infoGrid: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    marginVertical: 10,
    padding: 14,
    alignItems: "center",
  },
  infoCell: { flex: 1, alignItems: "center", gap: 4 },
  infoCellDivider: { width: 1, height: 44, backgroundColor: C.divider },
  infoCellLabel: {
    fontSize: 10,
    color: C.muted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  infoCellVal: { fontSize: 12, fontWeight: "800", color: C.navy },
  section: { marginTop: 10 },
  card: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dateBlock: { flex: 1, alignItems: "center" },
  dateDivider: { width: 12 },
  dateBlockLabel: {
    fontSize: 10,
    color: C.muted,
    fontWeight: "600",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  dateBlockVal: { fontSize: 14, fontWeight: "800", color: C.navy },
  balRow: { flexDirection: "row", alignItems: "center", paddingVertical: 9 },
  balRowBorder: { borderTopWidth: 1, borderTopColor: C.divider },
  balDot: { width: 8, height: 8, borderRadius: 4, marginRight: 10 },
  balLabel: { flex: 1, fontSize: 13, color: C.slate, fontWeight: "600" },
  balVal: { fontSize: 13, fontWeight: "800" },
  reasonBox: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  reasonFullText: {
    flex: 1,
    fontSize: 13,
    color: C.slate,
    fontWeight: "500",
    lineHeight: 20,
  },
  rejCard: {
    flexDirection: "row",
    gap: 8,
    alignItems: "flex-start",
    backgroundColor: C.redBg,
    borderColor: "#FECACA",
  },
  rejText: {
    flex: 1,
    fontSize: 13,
    color: C.redText,
    fontWeight: "600",
    lineHeight: 19,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  tlDot: { width: 10, height: 10, borderRadius: 5, marginTop: 3 },
  tlAction: { fontSize: 13, fontWeight: "700", color: C.navy },
  tlTime: { fontSize: 11, color: C.muted, fontWeight: "500", marginTop: 2 },
  actions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    marginBottom: 8,
  },
  rejectBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#FECACA",
    backgroundColor: C.redBg,
  },
  rejectBtnText: { fontSize: 14, fontWeight: "700", color: C.red },
  approveBtn: {
    flex: 1.5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: C.accent,
  },
  approveBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

// Empty state
const es = StyleSheet.create({
  wrap: { alignItems: "center", paddingVertical: 48, paddingHorizontal: 32 },
  iconWrap: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: C.divider,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 15, fontWeight: "800", color: C.navy, marginBottom: 6 },
  sub: {
    fontSize: 13,
    color: C.muted,
    fontWeight: "500",
    textAlign: "center",
    lineHeight: 19,
  },
});

// Screen
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  navLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  navRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  navBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
  },
  navSub: { fontSize: 11, color: C.muted, fontWeight: "600", marginTop: 1 },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.divider,
    borderWidth: 1,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
  },
  filterDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: C.accent,
  },

  searchWrap: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.inputBg,
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: C.navy,
    fontWeight: "600",
    paddingVertical: 0,
  },

  tabsScroll: {
    flexShrink: 0,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  tabsContainer: { paddingHorizontal: 16, paddingVertical: 10, gap: 8 },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.inputBg,
  },
  tabText: { fontSize: 12, fontWeight: "700", color: C.sub },
  tabBadge: {
    backgroundColor: C.divider,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tabBadgeText: { fontSize: 10, fontWeight: "800", color: C.muted },

  filterPanel: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.divider,
  },
  filterBlock: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 },
  filterTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 0.7,
  },
  chipsRow: { paddingBottom: 4 },

  statsRow: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexShrink: 0,
  },

  listContent: { paddingTop: 4, paddingBottom: 20 },
  resultsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  resultsCount: {
    fontSize: 11,
    fontWeight: "700",
    color: C.muted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  clearAll: { fontSize: 12, fontWeight: "700", color: C.accent },
});
