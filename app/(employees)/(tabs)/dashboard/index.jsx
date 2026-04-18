import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect as useNavFocus } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryPie,
} from "victory-native";
import { monoText, sansText, serifText } from "../../../../src/theme/fonts";

// ─── Design tokens ────────────────────────────────────────────────────────────
const T = {
  // Brand
  teal: "#0D9488",
  tealDark: "#0F766E",
  tealLight: "#F0FDFA",
  tealMid: "#99F6E4",

  // Status
  green: "#10B981",
  greenLight: "#ECFDF5",
  red: "#F43F5E",
  redLight: "#FFF1F2",
  amber: "#F59E0B",
  amberLight: "#FFFBEB",
  blue: "#3B82F6",
  blueLight: "#EFF6FF",
  violet: "#8B5CF6",
  violetLight: "#F5F3FF",

  // Neutrals
  ink: "#0A0F1E",
  inkDark: "#111827",
  inkMid: "#374151",
  inkMute: "#6B7280",
  inkFaint: "#9CA3AF",
  bg: "#F4F6FB",
  surface: "#FFFFFF",
  surfaceAlt: "#F9FAFB",
  border: "#E5E7EB",
  borderLight: "#F3F4F6",

  // Header
  h1: "#060C1A",
  h2: "#0E1729",
};

const { width: W } = Dimensions.get("window");

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: swap with real API call:
//   const token = await AsyncStorage.getItem("access_token");
//   const res = await fetch(`${YOUR_API_BASE}/api/dashboard/`, {
//     headers: { Authorization: `Bearer ${token}` },
//   });
//   return res.json();
async function fetchDashboard(_token) {
  await new Promise((r) => setTimeout(r, 750));
  return {
    role: "employee",
    user: {
      name: "Kwame Asante",
      email: "k.asante@hr360.com",
      role: "Senior Developer",
      department: { id: 3, name: "Engineering" },
      employee_id: "EMP-2024-0042",
    },
    today: {
      status: "Present",
      check_in: "08:47",
      check_out: null,
      hours_worked: 5.5,
      is_checked_in: true,
      is_checked_out: false,
      is_on_leave: false,
    },
    attendance: {
      days_present: 18,
      days_absent: 1,
      days_late: 2,
      days_on_leave: 1,
      total_hours_worked: 142,
      attendance_rate: 87,
    },
    leave: {
      pending: 1,
      approved: 3,
      active_leave: null,
      recent: [
        {
          id: 1,
          leave_type: "Annual Leave",
          start_date: "2025-03-10",
          end_date: "2025-03-12",
          status: "Approved",
        },
        {
          id: 2,
          leave_type: "Sick Leave",
          start_date: "2025-04-01",
          end_date: "2025-04-01",
          status: "Pending",
        },
      ],
    },
    payroll: {
      latest_net_pay: 4250.0,
      latest_pay_period: "March 2025",
      latest_pay_status: "paid",
      latest_pay_date: "31 Mar 2025",
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const greeting = () => {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
};

const fmtDate = () =>
  new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());

const fmtTime = (t) => {
  if (!t) return "—";
  const [h, m] = t.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
};

const fmtCurrency = (n) =>
  n != null
    ? new Intl.NumberFormat("en-GH", {
        style: "currency",
        currency: "GHS",
        minimumFractionDigits: 2,
      }).format(n)
    : "—";

const fmtShortDate = (s) =>
  s
    ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
        new Date(s),
      )
    : "—";

const statusMeta = (s) =>
  ({
    Present: {
      color: T.green,
      bg: T.greenLight,
      icon: "checkmark-circle",
      label: "Present",
    },
    Late: { color: T.amber, bg: T.amberLight, icon: "time", label: "Late" },
    Absent: {
      color: T.red,
      bg: T.redLight,
      icon: "close-circle",
      label: "Absent",
    },
    "On Leave": {
      color: T.blue,
      bg: T.blueLight,
      icon: "calendar",
      label: "On Leave",
    },
  })[s] ?? { color: T.inkMute, bg: T.bg, icon: "ellipse", label: s };

const leaveMeta = (s) =>
  ({
    approved: { color: T.green, bg: T.greenLight },
    pending: { color: T.amber, bg: T.amberLight },
    rejected: { color: T.red, bg: T.redLight },
  })[s?.toLowerCase()] ?? { color: T.inkMute, bg: T.bg };

const payMeta = (s) =>
  ({
    paid: { color: T.green, bg: T.greenLight, label: "PAID" },
    pending: { color: T.amber, bg: T.amberLight, label: "PENDING" },
    approved: { color: T.blue, bg: T.blueLight, label: "APPROVED" },
    on_hold: { color: T.red, bg: T.redLight, label: "ON HOLD" },
  })[s?.toLowerCase()] ?? {
    color: T.inkMute,
    bg: T.bg,
    label: s?.toUpperCase(),
  };

// ─── Reusable primitives ──────────────────────────────────────────────────────

function Badge({ label, color, bg, size = "sm" }) {
  const pad =
    size === "lg"
      ? { paddingHorizontal: 10, paddingVertical: 5 }
      : { paddingHorizontal: 7, paddingVertical: 3 };
  const fs = size === "lg" ? 12 : 10;
  return (
    <View style={[s.badge, pad, { backgroundColor: bg }]}>
      <Text style={[s.badgeText, sansText(), { color, fontSize: fs }]}>
        {label}
      </Text>
    </View>
  );
}

function SectionLabel({ title, subtitle, action, onAction }) {
  return (
    <View style={s.sectionHeader}>
      <View>
        <Text style={[s.sectionTitle, sansText()]}>{title}</Text>
        {subtitle ? (
          <Text style={[s.sectionSub, sansText()]}>{subtitle}</Text>
        ) : null}
      </View>
      {action ? (
        <Pressable onPress={onAction} hitSlop={10}>
          <Text style={[s.sectionAction, sansText()]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

function Card({ children, style, onPress, noPad }) {
  const inner = [s.card, noPad && { padding: 0 }, style];
  if (!onPress) return <View style={inner}>{children}</View>;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [inner, pressed && { opacity: 0.93 }]}
    >
      {children}
    </Pressable>
  );
}

// ─── Animated count-up number ─────────────────────────────────────────────────
function CountUp({ value, style, suffix = "" }) {
  const anim = useRef(new Animated.Value(0)).current;
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    Animated.timing(anim, {
      toValue: value,
      duration: 900,
      delay: 300,
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value: v }) => setDisplay(Math.round(v)));
    return () => anim.removeListener(id);
  }, [value]);
  return (
    <Text style={style}>
      {display}
      {suffix}
    </Text>
  );
}

// ─── KPI chip ─────────────────────────────────────────────────────────────────
function KPIChip({ label, value, icon, color, bg, suffix = "" }) {
  const scale = useRef(new Animated.Value(0.88)).current;
  const op = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 14,
        stiffness: 200,
        useNativeDriver: true,
      }),
      Animated.timing(op, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);
  return (
    <Animated.View
      style={[
        s.kpiChip,
        { backgroundColor: bg, transform: [{ scale }], opacity: op },
      ]}
    >
      <View style={[s.kpiIconBox, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={14} color={color} />
      </View>
      <CountUp
        value={value}
        style={[s.kpiValue, monoText(), { color }]}
        suffix={suffix}
      />
      <Text style={[s.kpiLabel, sansText()]}>{label}</Text>
    </Animated.View>
  );
}

// ─── Quick action button ──────────────────────────────────────────────────────
function QuickAction({ label, icon, color, onPress }) {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.93,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 120,
        useNativeDriver: true,
      }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.();
  };
  return (
    <Pressable onPress={press} style={s.qaBtn}>
      <Animated.View
        style={[
          s.qaIcon,
          { backgroundColor: color + "18", borderColor: color + "35" },
          { transform: [{ scale }] },
        ]}
      >
        <Ionicons name={icon} size={20} color={color} />
      </Animated.View>
      <Text style={[s.qaLabel, sansText()]}>{label}</Text>
    </Pressable>
  );
}

// ─── Status card ──────────────────────────────────────────────────────────────
function StatusCard({ today, fadeIn, slideIn }) {
  const status = today.is_on_leave ? "On Leave" : (today.status ?? "Absent");
  const sm = statusMeta(status);
  const pct = Math.min((today.hours_worked ?? 0) / 8, 1);

  // Simple segmented arc using border trick
  const arcColor = pct >= 1 ? T.green : pct > 0.5 ? T.teal : T.amber;
  const SIZE = 80;

  return (
    <Animated.View
      style={{ opacity: fadeIn, transform: [{ translateY: slideIn }] }}
    >
      <Card style={s.statusCard}>
        {/* Top row */}
        <View style={s.statusTop}>
          <View
            style={[
              s.statusBadge,
              {
                backgroundColor: sm.color + "15",
                borderColor: sm.color + "30",
              },
            ]}
          >
            <Ionicons name={sm.icon} size={13} color={sm.color} />
            <Text style={[s.statusBadgeText, sansText(), { color: sm.color }]}>
              {sm.label}
            </Text>
          </View>
          <Text style={[s.statusDate, sansText()]}>Today</Text>
        </View>

        {/* Body */}
        <View style={s.statusBody}>
          {/* Arc ring */}
          <View
            style={{
              width: SIZE,
              height: SIZE,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View
              style={[
                s.arcOuter,
                {
                  borderTopColor: arcColor,
                  borderRightColor: pct > 0.25 ? arcColor : T.border,
                  borderBottomColor: pct > 0.5 ? arcColor : T.border,
                  borderLeftColor: pct > 0.75 ? arcColor : T.border,
                  transform: [{ rotate: "-90deg" }],
                },
              ]}
            />
            <View style={s.arcInner}>
              <Text style={[s.arcValue, monoText(), { color: arcColor }]}>
                {(today.hours_worked ?? 0).toFixed(1)}
              </Text>
              <Text style={[s.arcUnit, sansText()]}>hrs</Text>
            </View>
          </View>

          {/* Timings */}
          <View style={s.timingsCol}>
            <View style={s.timingItem}>
              <View style={[s.timingDot, { backgroundColor: T.greenLight }]}>
                <Ionicons name="enter-outline" size={12} color={T.green} />
              </View>
              <View>
                <Text style={[s.timingLabel, sansText()]}>Clock in</Text>
                <Text style={[s.timingValue, monoText()]}>
                  {fmtTime(today.check_in)}
                </Text>
              </View>
            </View>
            <View style={[s.timingSep]} />
            <View style={s.timingItem}>
              <View style={[s.timingDot, { backgroundColor: T.redLight }]}>
                <Ionicons name="exit-outline" size={12} color={T.red} />
              </View>
              <View>
                <Text style={[s.timingLabel, sansText()]}>Clock out</Text>
                <Text style={[s.timingValue, monoText()]}>
                  {fmtTime(today.check_out)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Progress bar */}
        <View style={s.hoursBar}>
          <Text style={[s.hoursBarLabel, sansText()]}>
            {(today.hours_worked ?? 0).toFixed(1)} of 8 hrs
          </Text>
          <View style={s.hoursBarTrack}>
            <Animated.View
              style={[
                s.hoursBarFill,
                {
                  width: `${Math.round(pct * 100)}%`,
                  backgroundColor: arcColor,
                },
              ]}
            />
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

// ─── Attendance chart ─────────────────────────────────────────────────────────
function AttendanceChart({ attendance }) {
  const chartData = [
    { x: "Present", y: attendance.days_present ?? 0, fill: T.teal },
    { x: "Absent", y: attendance.days_absent ?? 0, fill: T.red },
    { x: "Late", y: attendance.days_late ?? 0, fill: T.amber },
    { x: "Leave", y: attendance.days_on_leave ?? 0, fill: T.blue },
  ];

  return (
    <Card noPad style={{ overflow: "hidden" }}>
      <View style={s.chartHeader}>
        <View>
          <Text style={[s.chartTitle, sansText()]}>Attendance breakdown</Text>
          <Text style={[s.chartSub, sansText()]}>Last 30 days</Text>
        </View>
        <View style={s.chartLegend}>
          {chartData.map((d) => (
            <View key={d.x} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: d.fill }]} />
              <Text style={[s.legendText, sansText()]}>{d.x}</Text>
            </View>
          ))}
        </View>
      </View>

      <VictoryChart
        width={W - 32}
        height={200}
        domainPadding={{ x: 28, y: 10 }}
        padding={{ top: 10, bottom: 36, left: 32, right: 20 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: T.border },
            tickLabels: {
              fontSize: 10,
              fill: T.inkFaint,
              fontFamily: "System",
            },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: {
              fontSize: 10,
              fill: T.inkFaint,
              fontFamily: "System",
            },
            grid: { stroke: T.borderLight, strokeDasharray: "4,4" },
          }}
          tickFormat={(t) => Math.round(t)}
        />
        <VictoryBar
          data={chartData}
          style={{
            data: { fill: ({ datum }) => datum.fill, width: 28, rx: 6 },
          }}
          animate={{ duration: 600, onLoad: { duration: 600 } }}
          cornerRadius={{ top: 5 }}
        />
      </VictoryChart>
    </Card>
  );
}

// ─── Leave donut chart ────────────────────────────────────────────────────────
function LeaveDonut({ pending, approved }) {
  const total = (pending ?? 0) + (approved ?? 0) || 1;
  const data = [
    { x: "Pending", y: pending ?? 0, color: T.amber },
    { x: "Approved", y: approved ?? 0, color: T.green },
  ];

  return (
    <View style={s.donutWrap}>
      <VictoryPie
        data={data}
        width={140}
        height={140}
        innerRadius={44}
        padAngle={3}
        colorScale={data.map((d) => d.color)}
        style={{ labels: { display: "none" } }}
        animate={{ duration: 700 }}
      />
      {/* Center label */}
      <View style={s.donutCenter} pointerEvents="none">
        <Text style={[s.donutTotal, monoText()]}>{pending + approved}</Text>
        <Text style={[s.donutTotalLabel, sansText()]}>total</Text>
      </View>
    </View>
  );
}

// ─── Leave row ────────────────────────────────────────────────────────────────
function LeaveRow({ item, last }) {
  const { color, bg } = leaveMeta(item.status);
  return (
    <View
      style={[
        s.leaveRow,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: T.border,
        },
      ]}
    >
      <View style={[s.leaveIcon, { backgroundColor: bg }]}>
        <Ionicons name="calendar-outline" size={13} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[s.leaveType, sansText()]}>{item.leave_type}</Text>
        <Text style={[s.leaveDates, sansText()]}>
          {fmtShortDate(item.start_date)} – {fmtShortDate(item.end_date)}
        </Text>
      </View>
      <Badge label={item.status} color={color} bg={bg} />
    </View>
  );
}

// ─── Activity row ─────────────────────────────────────────────────────────────
function ActivityRow({ icon, iconColor, iconBg, title, subtitle, meta, last }) {
  return (
    <View
      style={[
        s.activityRow,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: T.border,
        },
      ]}
    >
      <View style={[s.activityIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={14} color={iconColor} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[s.activityTitle, sansText()]}>{title}</Text>
        <Text style={[s.activitySub, sansText()]}>{subtitle}</Text>
      </View>
      <Text style={[s.activityMeta, sansText()]}>{meta}</Text>
    </View>
  );
}

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fadeIn = useRef(new Animated.Value(0)).current;
  const slideIn = useRef(new Animated.Value(20)).current;

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      // Real API integration point:
      // const token = await AsyncStorage.getItem("access_token");
      // if (!token) { router.replace("/login"); return; }
      const result = await fetchDashboard("mock");
      setData(result);
      setError(null);
      Animated.parallel([
        Animated.timing(fadeIn, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideIn, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } catch (e) {
      setError("Could not load dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useNavFocus(
    useCallback(() => {
      load();
    }, [load]),
  );
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    load(true);
  }, [load]);

  if (loading) {
    return (
      <LinearGradient colors={[T.h1, T.h2, "#1a2744"]} style={s.loadScreen}>
        <ActivityIndicator color={T.tealMid} size="large" />
        <Text style={[s.loadText, sansText()]}>Loading your workspace…</Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <View style={[s.loadScreen, { backgroundColor: T.bg }]}>
        <Ionicons name="wifi-outline" size={44} color={T.inkFaint} />
        <Text
          style={[
            {
              color: T.inkMid,
              fontSize: 15,
              marginTop: 14,
              textAlign: "center",
            },
            sansText(),
          ]}
        >
          {error}
        </Text>
        <Pressable onPress={() => load()} style={s.retryBtn}>
          <Text
            style={[
              { color: T.teal, fontSize: 14, fontWeight: "600" },
              sansText(),
            ]}
          >
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  const {
    user = {},
    today = {},
    attendance = {},
    leave = {},
    payroll = {},
  } = data ?? {};
  const pm = payMeta(payroll.latest_pay_status);
  const initials = (user.name ?? "—")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const rate = attendance.attendance_rate ?? 0;
  const rateColor = rate >= 80 ? T.green : rate >= 60 ? T.amber : T.red;

  // Build activity feed from available data
  const activityFeed = [
    {
      id: "a1",
      icon: "enter-outline",
      iconColor: T.green,
      iconBg: T.greenLight,
      title: "Clocked in",
      subtitle: "Today at " + fmtTime(today.check_in),
      meta: "Now",
    },
    ...(leave.recent ?? []).map((l) => ({
      id: "l" + l.id,
      icon: "calendar-outline",
      iconColor: T.blue,
      iconBg: T.blueLight,
      title: l.leave_type + " request",
      subtitle: fmtShortDate(l.start_date) + " – " + fmtShortDate(l.end_date),
      meta: l.status,
    })),
    {
      id: "p1",
      icon: "cash-outline",
      iconColor: T.violet,
      iconBg: T.violetLight,
      title: "Payslip available",
      subtitle: payroll.latest_pay_period ?? "—",
      meta: pm.label,
    },
  ];

  return (
    <View style={s.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 48 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={T.tealMid}
            colors={[T.teal]}
          />
        }
      >
        {/* ══ HERO HEADER ══════════════════════════════════════════════════════ */}
        <LinearGradient
          colors={[T.h1, T.h2, "#182236"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.4, y: 1 }}
          style={s.hero}
        >
          {/* Decorative accent circle */}
          <View style={s.heroBubble} />

          <SafeAreaView edges={["top"]}>
            {/* Top bar */}
            <View style={s.heroBar}>
              <View style={{ flex: 1 }}>
                <Text style={[s.heroGreeting, sansText()]}>{greeting()}</Text>
                <Text style={[s.heroName, serifText()]} numberOfLines={1}>
                  {user.name ?? "Employee"}
                </Text>
                <View style={s.heroMeta}>
                  <View style={s.heroDeptChip}>
                    <Ionicons
                      name="business-outline"
                      size={10}
                      color="rgba(255,255,255,0.5)"
                    />
                    <Text style={[s.heroDeptText, sansText()]}>
                      {user.department?.name ?? "—"}
                    </Text>
                  </View>
                  <Text style={[s.heroDate, sansText()]}>{fmtDate()}</Text>
                </View>
              </View>

              <View style={s.heroActions}>
                <Pressable
                  onPress={() => router.push("/notifications")}
                  style={({ pressed }) => [
                    s.heroIconBtn,
                    pressed && { opacity: 0.6 },
                  ]}
                >
                  <Ionicons
                    name="notifications-outline"
                    size={18}
                    color="rgba(255,255,255,0.8)"
                  />
                </Pressable>
                <Pressable
                  onPress={() => router.push("/profile")}
                  style={({ pressed }) => [
                    s.heroAvatar,
                    pressed && { opacity: 0.85 },
                  ]}
                >
                  <Text style={[s.heroAvatarText, monoText()]}>{initials}</Text>
                </Pressable>
              </View>
            </View>

            {/* ── KPI CHIPS ─────────────────────────────────────────────────── */}
            <Animated.View
              style={{ opacity: fadeIn, transform: [{ translateY: slideIn }] }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={s.kpiRow}
              >
                <KPIChip
                  label="Present"
                  value={attendance.days_present ?? 0}
                  icon="checkmark-circle-outline"
                  color={T.green}
                  bg="#0D1F18"
                />
                <KPIChip
                  label="Absent"
                  value={attendance.days_absent ?? 0}
                  icon="close-circle-outline"
                  color={T.red}
                  bg="#1F0D11"
                />
                <KPIChip
                  label="Late days"
                  value={attendance.days_late ?? 0}
                  icon="time-outline"
                  color={T.amber}
                  bg="#1F190D"
                />
                <KPIChip
                  label="Rate"
                  value={rate}
                  icon="trending-up-outline"
                  color={rateColor}
                  bg="#0D131F"
                  suffix="%"
                />
                <KPIChip
                  label="Hrs worked"
                  value={attendance.total_hours_worked ?? 0}
                  icon="hourglass-outline"
                  color={T.tealMid}
                  bg="#0D1A18"
                />
              </ScrollView>
            </Animated.View>
          </SafeAreaView>
        </LinearGradient>

        {/* ══ CONTENT ══════════════════════════════════════════════════════════ */}
        <Animated.View
          style={[
            s.content,
            { opacity: fadeIn, transform: [{ translateY: slideIn }] },
          ]}
        >
          {/* ── TODAY STATUS CARD ─────────────────────────────────────────── */}
          <View style={s.section}>
            <StatusCard today={today} fadeIn={fadeIn} slideIn={slideIn} />
          </View>

          {/* ── QUICK ACTIONS ─────────────────────────────────────────────── */}
          <View style={s.section}>
            <SectionLabel title="Quick actions" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={s.qaRow}
            >
              <QuickAction
                label="Clock in/out"
                icon="finger-print-outline"
                color={T.teal}
                onPress={() => router.push("/attendance/checkin")}
              />
              <QuickAction
                label="Request leave"
                icon="calendar-outline"
                color={T.violet}
                onPress={() => router.push("/leave/apply")}
              />
              <QuickAction
                label="My payslips"
                icon="document-text-outline"
                color={T.blue}
                onPress={() => router.push("/payslips")}
              />
              <QuickAction
                label="Attendance"
                icon="time-outline"
                color={T.amber}
                onPress={() => router.push("/attendance")}
              />
              <QuickAction
                label="My profile"
                icon="person-outline"
                color={T.green}
                onPress={() => router.push("/profile")}
              />
            </ScrollView>
          </View>

          {/* ── ATTENDANCE CHART ──────────────────────────────────────────── */}
          <View style={s.section}>
            <SectionLabel
              title="Attendance summary"
              subtitle="Last 30 days"
              action="Full history"
              onAction={() => router.push("/attendance")}
            />
            <AttendanceChart attendance={attendance} />
          </View>

          {/* ── ATTENDANCE RATE ───────────────────────────────────────────── */}
          <View style={s.section}>
            <Card onPress={() => router.push("/attendance")}>
              <View style={s.rateRow}>
                <View style={{ flex: 1 }}>
                  <Text style={[s.cardMicrolabel, sansText()]}>
                    Attendance rate
                  </Text>
                  <CountUp
                    value={rate}
                    style={[s.rateValue, monoText()]}
                    suffix="%"
                  />
                  <View style={s.rateTrack}>
                    <View
                      style={[
                        s.rateFill,
                        {
                          width: `${Math.min(rate, 100)}%`,
                          backgroundColor: rateColor,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[s.rateCaption, sansText()]}>
                    {rate >= 80
                      ? "Excellent — keep it up"
                      : rate >= 60
                        ? "Room for improvement"
                        : "Needs attention"}
                  </Text>
                </View>
                <View
                  style={[s.rateArrowBox, { backgroundColor: T.tealLight }]}
                >
                  <Ionicons name="chevron-forward" size={15} color={T.teal} />
                </View>
              </View>
            </Card>
          </View>

          {/* ── LEAVE SECTION ─────────────────────────────────────────────── */}
          <View style={s.section}>
            <SectionLabel
              title="Leave overview"
              action="See all"
              onAction={() => router.push("/leave")}
            />

            {/* Donut + stats side by side */}
            <Card
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 12,
              }}
            >
              <LeaveDonut pending={leave.pending} approved={leave.approved} />
              <View style={{ flex: 1, marginLeft: 16 }}>
                <View style={s.leaveStatRow}>
                  <View
                    style={[s.leaveStatDot, { backgroundColor: T.amber }]}
                  />
                  <View>
                    <Text
                      style={[s.leaveStatNum, monoText(), { color: T.amber }]}
                    >
                      {leave.pending ?? 0}
                    </Text>
                    <Text style={[s.leaveStatLabel, sansText()]}>Pending</Text>
                  </View>
                </View>
                <View style={[s.leaveStatDivider]} />
                <View style={s.leaveStatRow}>
                  <View
                    style={[s.leaveStatDot, { backgroundColor: T.green }]}
                  />
                  <View>
                    <Text
                      style={[s.leaveStatNum, monoText(), { color: T.green }]}
                    >
                      {leave.approved ?? 0}
                    </Text>
                    <Text style={[s.leaveStatLabel, sansText()]}>Approved</Text>
                  </View>
                </View>
                {leave.active_leave && (
                  <View style={[s.activeLeaveBadge, { marginTop: 12 }]}>
                    <View style={[s.activeDot, { backgroundColor: T.green }]} />
                    <Text style={[s.activeLeaveText, sansText()]}>
                      On {leave.active_leave.leave_type}
                    </Text>
                  </View>
                )}
              </View>
            </Card>

            {/* Recent leave list */}
            {(leave.recent?.length ?? 0) > 0 && (
              <Card noPad>
                {leave.recent.map((item, i) => (
                  <LeaveRow
                    key={item.id ?? i}
                    item={item}
                    last={i === leave.recent.length - 1}
                  />
                ))}
              </Card>
            )}
          </View>

          {/* ── PAYROLL CARD ──────────────────────────────────────────────── */}
          <View style={s.section}>
            <SectionLabel
              title="Latest payroll"
              action="All payslips"
              onAction={() => router.push("/payslips")}
            />
            <LinearGradient
              colors={["#0A0F1E", "#151E35"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={s.payCard}
            >
              {/* Decorative */}
              <View style={s.payBubble1} />
              <View style={s.payBubble2} />

              <View style={s.payTop}>
                <View>
                  <Text style={[s.payMicrolabel, sansText()]}>Net pay</Text>
                  <Text style={[s.payAmount, monoText()]}>
                    {fmtCurrency(payroll.latest_net_pay)}
                  </Text>
                </View>
                <View
                  style={[
                    s.payStatusBadge,
                    {
                      backgroundColor: pm.color + "22",
                      borderColor: pm.color + "40",
                    },
                  ]}
                >
                  <Text
                    style={[s.payStatusText, sansText(), { color: pm.color }]}
                  >
                    {pm.label}
                  </Text>
                </View>
              </View>

              <View style={s.payDivider} />

              <View style={s.payMeta}>
                <View>
                  <Text style={[s.payMetaLabel, sansText()]}>Period</Text>
                  <Text style={[s.payMetaValue, sansText()]}>
                    {payroll.latest_pay_period ?? "—"}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[s.payMetaLabel, sansText()]}>Pay date</Text>
                  <Text style={[s.payMetaValue, sansText()]}>
                    {payroll.latest_pay_date ?? "—"}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => router.push("/payslips")}
                style={({ pressed }) => [
                  s.payBtn,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <Text style={[s.payBtnText, sansText()]}>View payslip</Text>
                <Ionicons name="arrow-forward" size={14} color={T.teal} />
              </Pressable>
            </LinearGradient>
          </View>

          {/* ── RECENT ACTIVITY ───────────────────────────────────────────── */}
          <View style={s.section}>
            <SectionLabel title="Recent activity" />
            <Card noPad>
              {activityFeed.map((item, i) => (
                <ActivityRow
                  key={item.id}
                  icon={item.icon}
                  iconColor={item.iconColor}
                  iconBg={item.iconBg}
                  title={item.title}
                  subtitle={item.subtitle}
                  meta={item.meta}
                  last={i === activityFeed.length - 1}
                />
              ))}
            </Card>
          </View>

          {/* ── PROFILE ROW ───────────────────────────────────────────────── */}
          <View style={s.section}>
            <Pressable
              onPress={() => router.push("/profile")}
              style={({ pressed }) => [
                s.profileRow,
                pressed && { opacity: 0.92 },
              ]}
            >
              <View style={s.profileAvatar}>
                <Text style={[s.profileAvatarText, monoText()]}>
                  {initials}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={[s.profileName, sansText()]}>
                  {user.name ?? "—"}
                </Text>
                <Text style={[s.profileMeta, sansText()]}>
                  {user.role ?? "Employee"} · {user.department?.name ?? "—"}
                </Text>
                <Text style={[s.profileId, monoText()]}>
                  {user.employee_id ?? "—"}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={T.inkFaint} />
            </Pressable>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: T.bg },
  loadScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadText: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
  retryBtn: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.teal,
  },

  // ── Hero
  hero: { paddingBottom: 20 },
  heroBubble: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: T.teal + "08",
    top: -80,
    right: -80,
  },
  heroBar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    marginBottom: 20,
  },
  heroGreeting: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  heroName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  heroMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  heroDeptChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  heroDeptText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  heroDate: { fontSize: 11, color: "rgba(255,255,255,0.3)" },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 4,
  },
  heroIconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.06)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: T.teal,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: T.tealDark,
  },
  heroAvatarText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  // ── KPI chips
  kpiRow: { paddingHorizontal: 20, gap: 8, paddingBottom: 4 },
  kpiChip: {
    width: 88,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 6,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  kpiIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: { fontSize: 20, fontWeight: "700" },
  kpiLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },

  // ── Content area
  content: { paddingTop: 4 },
  section: { paddingHorizontal: 16, marginTop: 20 },

  // ── Section header
  sectionHeader: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: T.ink,
    letterSpacing: -0.1,
  },
  sectionSub: { fontSize: 11, color: T.inkFaint, marginTop: 1 },
  sectionAction: { fontSize: 13, color: T.teal, fontWeight: "600" },

  // ── Card
  card: {
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    marginBottom: 0,
  },
  cardMicrolabel: {
    fontSize: 10,
    color: T.inkMute,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },

  // ── Status card
  statusCard: {
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
  },
  statusTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusBadgeText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.2 },
  statusDate: { fontSize: 11, color: T.inkFaint, fontWeight: "600" },
  statusBody: { flexDirection: "row", alignItems: "center", gap: 20 },

  // Arc ring
  arcOuter: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: 38,
    borderWidth: 7,
    borderColor: T.border,
  },
  arcInner: { alignItems: "center" },
  arcValue: { fontSize: 20, fontWeight: "700" },
  arcUnit: { fontSize: 10, color: T.inkMute, marginTop: -1 },

  // Timings
  timingsCol: { flex: 1, gap: 10 },
  timingItem: { flexDirection: "row", alignItems: "center", gap: 10 },
  timingDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  timingLabel: { fontSize: 10, color: T.inkFaint, marginBottom: 1 },
  timingValue: { fontSize: 14, fontWeight: "700", color: T.ink },
  timingSep: { height: StyleSheet.hairlineWidth, backgroundColor: T.border },

  hoursBar: {
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: T.border,
  },
  hoursBarLabel: { fontSize: 11, color: T.inkMute, marginBottom: 6 },
  hoursBarTrack: {
    height: 5,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
  },
  hoursBarFill: { height: "100%", borderRadius: 3 },

  // ── Quick actions
  qaRow: { gap: 14, paddingBottom: 4 },
  qaBtn: { alignItems: "center", gap: 6 },
  qaIcon: {
    width: 54,
    height: 54,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  qaLabel: {
    fontSize: 10,
    color: T.inkMid,
    fontWeight: "600",
    textAlign: "center",
    maxWidth: 58,
  },

  // ── Chart
  chartHeader: { padding: 16, paddingBottom: 0 },
  chartTitle: { fontSize: 14, fontWeight: "700", color: T.ink },
  chartSub: { fontSize: 11, color: T.inkFaint, marginTop: 2, marginBottom: 10 },
  chartLegend: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 6, height: 6, borderRadius: 3 },
  legendText: { fontSize: 10, color: T.inkMute },

  // ── Attendance rate
  rateRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  rateValue: {
    fontSize: 32,
    fontWeight: "700",
    color: T.ink,
    letterSpacing: -1,
    marginBottom: 8,
  },
  rateTrack: {
    height: 5,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  rateFill: { height: "100%", borderRadius: 3 },
  rateCaption: { fontSize: 12, color: T.inkMute },
  rateArrowBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },

  // ── Leave
  donutWrap: {
    width: 140,
    height: 140,
    alignItems: "center",
    justifyContent: "center",
  },
  donutCenter: { position: "absolute", alignItems: "center" },
  donutTotal: { fontSize: 22, fontWeight: "700", color: T.ink },
  donutTotalLabel: { fontSize: 10, color: T.inkMute },

  leaveStatRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  leaveStatDot: { width: 8, height: 8, borderRadius: 4 },
  leaveStatNum: { fontSize: 22, fontWeight: "700" },
  leaveStatLabel: {
    fontSize: 10,
    color: T.inkMute,
    fontWeight: "600",
    marginTop: 1,
  },
  leaveStatDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: T.border,
    marginVertical: 12,
  },

  activeLeaveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.greenLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  activeLeaveText: { fontSize: 11, color: T.green, fontWeight: "600" },

  leaveRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  leaveIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveType: { fontSize: 13, fontWeight: "700", color: T.ink },
  leaveDates: { fontSize: 11, color: T.inkMute, marginTop: 1 },

  badge: { borderRadius: 6 },
  badgeText: { fontWeight: "700", letterSpacing: 0.3 },

  // ── Payroll
  payCard: { borderRadius: 18, padding: 20, overflow: "hidden" },
  payBubble1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: T.teal + "0A",
    top: -60,
    right: -40,
  },
  payBubble2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: T.violet + "0A",
    bottom: -20,
    right: 60,
  },
  payTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  payMicrolabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  payAmount: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  payStatusBadge: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  payStatusText: { fontSize: 11, fontWeight: "700", letterSpacing: 0.4 },
  payDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginBottom: 16,
  },
  payMeta: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  payMetaLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.35)",
    marginBottom: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  payMetaValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.8)",
  },
  payBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: T.teal + "22",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  payBtnText: { fontSize: 13, color: T.tealMid, fontWeight: "600" },

  // ── Activity
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityTitle: { fontSize: 13, fontWeight: "700", color: T.ink },
  activitySub: { fontSize: 11, color: T.inkMute, marginTop: 1 },
  activityMeta: { fontSize: 11, color: T.inkFaint, fontWeight: "600" },

  // ── Profile row
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: T.teal,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  profileName: { fontSize: 15, fontWeight: "700", color: T.ink },
  profileMeta: { fontSize: 12, color: T.inkMid, marginTop: 2 },
  profileId: { fontSize: 10, color: T.inkFaint, marginTop: 2 },
});
