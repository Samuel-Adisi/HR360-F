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
import { Circle, G, Svg } from "react-native-svg";
import { VictoryAxis, VictoryBar, VictoryChart } from "victory";
import { monoText, sansText, serifText } from "../../../../src/theme/fonts";

// ─── Design Tokens (mirrors HR Admin dashboard exactly) ────────────────────
const ACCENT = "#0F766E";
const TEAL_MID = "#99F6E4";
const NAVY = "#0F172A";
const NAVY_MID = "#1E293B";
const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF7ED";
const BLUE = "#0A66C2";
const BLUE_LIGHT = "#EFF6FF";
const GREEN = "#059669";
const GREEN_LIGHT = "#ECFDF5";
const RED = "#DC2626";
const RED_LIGHT = "#FEF2F2";
const PURPLE = "#7C3AED";
const PURPLE_LIGHT = "#F5F3FF";
const AMBER = "#F59E0B";
const AMBER_LIGHT = "#FFFBEB";
const BORDER = "#E2E8F0";
const MUTED = "#64748B";
const SURFACE = "#FFFFFF";
const BG = "#F8FAFC";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── Mock Data ──────────────────────────────────────────────────────────────
async function fetchDashboard() {
  await new Promise((r) => setTimeout(r, 750));
  return {
    user: {
      name: "Kwame Asante",
      role: "Senior Developer",
      department: { name: "Engineering" },
      employee_id: "EMP-2024-0042",
    },
    today: {
      status: "Present",
      check_in: "08:47",
      check_out: null,
      hours_worked: 5.5,
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

// ─── Helpers ────────────────────────────────────────────────────────────────
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

const leaveMeta = (s) =>
  ({
    approved: { color: GREEN, bg: GREEN_LIGHT },
    pending: { color: AMBER, bg: AMBER_LIGHT },
    rejected: { color: RED, bg: RED_LIGHT },
  })[s?.toLowerCase()] ?? { color: MUTED, bg: BG };

const payMeta = (s) =>
  ({
    paid: { color: GREEN, bg: GREEN_LIGHT, label: "PAID" },
    pending: { color: AMBER, bg: AMBER_LIGHT, label: "PENDING" },
    approved: { color: BLUE, bg: BLUE_LIGHT, label: "APPROVED" },
    on_hold: { color: RED, bg: RED_LIGHT, label: "ON HOLD" },
  })[s?.toLowerCase()] ?? { color: MUTED, bg: BG, label: s?.toUpperCase() };

// ─── Animated Blob Rings (same as admin) ────────────────────────────────────
function BlobRings() {
  const anim1 = useRef(new Animated.Value(0)).current;
  const anim2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    pulse(anim1, 0);
    pulse(anim2, 1500);
  }, []);

  const ring = (anim, size, opacity) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    position: "absolute",
    right: -size / 2 + 60,
    top: -size / 2 + 60,
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [opacity, opacity * 0.4],
    }),
    transform: [
      {
        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }),
      },
    ],
  });

  return (
    <>
      <Animated.View style={ring(anim1, 180, 0.5)} />
      <Animated.View style={ring(anim2, 260, 0.3)} />
      <Animated.View style={ring(anim1, 340, 0.15)} />
    </>
  );
}

// ─── SVG Donut Ring KPI Chip (same as admin) ────────────────────────────────
const RING_SIZE = 70;
const STROKE = 7;
const R = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function KpiChip({
  label,
  value,
  pct,
  color,
  trackColor = "rgba(255,255,255,0.12)",
}) {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: pct,
      duration: 1100,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const dashOffset = useRef(
    animVal.interpolate({
      inputRange: [0, 1],
      outputRange: [CIRCUMFERENCE, 0],
    }),
  ).current;

  return (
    <View style={styles.kpiChip}>
      <View style={styles.kpiRingWrap}>
        <Svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        >
          <G rotation="-90" origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R}
              stroke={trackColor}
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R}
              stroke={color}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={styles.kpiRingCenter}>
          <Text style={[styles.kpiValue, monoText(), { color }]}>{value}</Text>
        </View>
      </View>
      <Text style={[styles.kpiLabel, sansText()]}>{label}</Text>
    </View>
  );
}

// ─── Section Label (same as admin) ──────────────────────────────────────────
function SectionLabel({ title, subtitle, badge, onAction, actionLabel }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLabelLeft}>
        <View style={styles.sectionBarAccent} />
        <Text style={[styles.sectionTitle, sansText()]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.sectionSubtitle, sansText()]}>{subtitle}</Text>
        )}
        {badge != null && (
          <View style={styles.sectionBadge}>
            <Text style={[styles.sectionBadgeText, monoText()]}>{badge}</Text>
          </View>
        )}
      </View>
      {onAction && (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <Text style={[styles.sectionAction, sansText()]}>{actionLabel}</Text>
        </Pressable>
      )}
    </View>
  );
}

// ─── Quick Action (Telegram-style solid square, same as admin) ───────────────
function QuickAction({ label, iconName, color, onPress }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.quickActionBtn,
        pressed && { opacity: 0.85, transform: [{ scale: 0.96 }] },
      ]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={iconName} size={24} color="#FFFFFF" />
      </View>
      <Text style={[styles.quickActionLabel, sansText()]}>{label}</Text>
    </Pressable>
  );
}

// ─── Animated Count-Up ───────────────────────────────────────────────────────
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

// ─── Today Status Card ────────────────────────────────────────────────────────
function TodayStatusCard({ today }) {
  const pct = Math.min((today.hours_worked ?? 0) / 8, 1);
  const arcColor = pct >= 1 ? GREEN : pct > 0.5 ? ACCENT : AMBER;

  return (
    <View style={styles.card}>
      <View style={styles.statusTopRow}>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: GREEN + "15", borderColor: GREEN + "30" },
          ]}
        >
          <Ionicons name="checkmark-circle" size={13} color={GREEN} />
          <Text style={[styles.statusPillText, sansText(), { color: GREEN }]}>
            {today.is_on_leave ? "On Leave" : (today.status ?? "Absent")}
          </Text>
        </View>
        <Text style={[styles.statusDateText, sansText()]}>Today</Text>
      </View>

      <View style={styles.statusBody}>
        {/* Arc ring */}
        <View
          style={{
            width: 80,
            height: 80,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Svg width={80} height={80} viewBox="0 0 80 80">
            <G rotation="-90" origin="40, 40">
              <Circle
                cx={40}
                cy={40}
                r={33}
                stroke={BORDER}
                strokeWidth={7}
                fill="none"
              />
              <Circle
                cx={40}
                cy={40}
                r={33}
                stroke={arcColor}
                strokeWidth={7}
                fill="none"
                strokeDasharray={2 * Math.PI * 33}
                strokeDashoffset={2 * Math.PI * 33 * (1 - pct)}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          <View style={{ position: "absolute", alignItems: "center" }}>
            <Text
              style={[
                { fontSize: 16, fontWeight: "700", color: arcColor },
                monoText(),
              ]}
            >
              {(today.hours_worked ?? 0).toFixed(1)}
            </Text>
            <Text style={[{ fontSize: 10, color: MUTED }, sansText()]}>
              hrs
            </Text>
          </View>
        </View>

        {/* Clock in / out */}
        <View style={{ flex: 1, gap: 10 }}>
          <View style={styles.timingRow}>
            <View style={[styles.timingDot, { backgroundColor: GREEN_LIGHT }]}>
              <Ionicons name="enter-outline" size={12} color={GREEN} />
            </View>
            <View>
              <Text style={[styles.timingLabel, sansText()]}>Clock in</Text>
              <Text style={[styles.timingValue, monoText()]}>
                {fmtTime(today.check_in)}
              </Text>
            </View>
          </View>
          <View
            style={{
              height: StyleSheet.hairlineWidth,
              backgroundColor: BORDER,
            }}
          />
          <View style={styles.timingRow}>
            <View style={[styles.timingDot, { backgroundColor: RED_LIGHT }]}>
              <Ionicons name="exit-outline" size={12} color={RED} />
            </View>
            <View>
              <Text style={[styles.timingLabel, sansText()]}>Clock out</Text>
              <Text style={[styles.timingValue, monoText()]}>
                {fmtTime(today.check_out)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Progress bar */}
      <View
        style={{
          marginTop: 14,
          paddingTop: 12,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: BORDER,
        }}
      >
        <Text
          style={[{ fontSize: 11, color: MUTED, marginBottom: 6 }, sansText()]}
        >
          {(today.hours_worked ?? 0).toFixed(1)} of 8 hrs worked
        </Text>
        <View
          style={{
            height: 5,
            backgroundColor: BORDER,
            borderRadius: 3,
            overflow: "hidden",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${Math.round(pct * 100)}%`,
              backgroundColor: arcColor,
              borderRadius: 3,
            }}
          />
        </View>
      </View>
    </View>
  );
}

// ─── Attendance Bar Chart ────────────────────────────────────────────────────
function AttendanceChart({ attendance }) {
  const chartData = [
    { x: "Present", y: attendance.days_present ?? 0, fill: ACCENT },
    { x: "Absent", y: attendance.days_absent ?? 0, fill: RED },
    { x: "Late", y: attendance.days_late ?? 0, fill: AMBER },
    { x: "Leave", y: attendance.days_on_leave ?? 0, fill: BLUE },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.attendanceLegendRow}>
        {chartData.map((d) => (
          <View key={d.x} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: d.fill }]} />
            <Text style={[styles.legendText, sansText()]}>{d.x}</Text>
          </View>
        ))}
      </View>
      <VictoryChart
        width={SCREEN_W - 64}
        height={180}
        domainPadding={{ x: 28, y: 10 }}
        padding={{ top: 8, bottom: 32, left: 28, right: 16 }}
      >
        <VictoryAxis
          style={{
            axis: { stroke: BORDER },
            tickLabels: { fontSize: 10, fill: MUTED, fontFamily: "System" },
            grid: { stroke: "transparent" },
          }}
        />
        <VictoryAxis
          dependentAxis
          style={{
            axis: { stroke: "transparent" },
            tickLabels: { fontSize: 10, fill: MUTED, fontFamily: "System" },
            grid: { stroke: BORDER, strokeDasharray: "4,4" },
          }}
          tickFormat={(t) => Math.round(t)}
        />
        <VictoryBar
          data={chartData}
          style={{ data: { fill: ({ datum }) => datum.fill, width: 26 } }}
          animate={{ duration: 600, onLoad: { duration: 600 } }}
          cornerRadius={{ top: 5 }}
        />
      </VictoryChart>
    </View>
  );
}

// ─── Leave Row ───────────────────────────────────────────────────────────────
function LeaveRow({ item, last }) {
  const { color, bg } = leaveMeta(item.status);
  return (
    <View
      style={[
        styles.leaveRow,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: BORDER,
        },
      ]}
    >
      <View style={[styles.leaveIconBox, { backgroundColor: bg }]}>
        <Ionicons name="calendar-outline" size={14} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.leaveName, sansText()]}>{item.leave_type}</Text>
        <Text style={[styles.leaveDates, sansText()]}>
          {fmtShortDate(item.start_date)} – {fmtShortDate(item.end_date)}
        </Text>
      </View>
      <View style={[styles.leaveBadge, { backgroundColor: bg }]}>
        <Text style={[styles.leaveBadgeText, sansText(), { color }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );
}

// ─── Activity Row (Telegram-style solid icon, same as admin) ─────────────────
function ActivityRow({ icon, color, text, sub, time, last }) {
  return (
    <View
      style={[
        styles.activityRow,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: BORDER,
        },
      ]}
    >
      <View style={[styles.activityIconWrap, { backgroundColor: color }]}>
        <Ionicons name={icon} size={17} color="#FFFFFF" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.activityText, sansText()]}>{text}</Text>
        <Text style={[styles.activitySub, sansText()]}>{sub}</Text>
      </View>
      <Text style={[styles.activityTime, sansText()]}>{time}</Text>
    </View>
  );
}

// ─── Main Screen ─────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);
      const result = await fetchDashboard();
      setData(result);
      setError(null);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]).start();
    } catch {
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
      <LinearGradient
        colors={[NAVY, NAVY_MID, "#243044"]}
        style={styles.loadScreen}
      >
        <ActivityIndicator color={TEAL_MID} size="large" />
        <Text style={[styles.loadText, sansText()]}>
          Loading your workspace…
        </Text>
      </LinearGradient>
    );
  }

  if (error) {
    return (
      <View style={[styles.loadScreen, { backgroundColor: BG }]}>
        <Ionicons name="wifi-outline" size={44} color={MUTED} />
        <Text
          style={[{ color: MUTED, fontSize: 15, marginTop: 14 }, sansText()]}
        >
          {error}
        </Text>
        <Pressable onPress={() => load()} style={styles.retryBtn}>
          <Text style={[{ color: ACCENT, fontWeight: "600" }, sansText()]}>
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
  const rate = attendance.attendance_rate ?? 0;
  const rateColor = rate >= 80 ? GREEN : rate >= 60 ? AMBER : RED;

  const initials = (user.name ?? "—")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // KPI chips — same structure as admin
  const kpiChips = [
    {
      label: "Present\nDays",
      value: String(attendance.days_present ?? 0),
      pct: (attendance.days_present ?? 0) / 22,
      color: GREEN,
    },
    {
      label: "Absent\nDays",
      value: String(attendance.days_absent ?? 0),
      pct: (attendance.days_absent ?? 0) / 22,
      color: RED,
    },
    {
      label: "Late\nDays",
      value: String(attendance.days_late ?? 0),
      pct: (attendance.days_late ?? 0) / 22,
      color: AMBER,
    },
    {
      label: "Attend.\nRate",
      value: `${rate}%`,
      pct: rate / 100,
      color: rateColor,
    },
  ];

  // Activity feed
  const activityFeed = [
    {
      id: "a1",
      icon: "enter-outline",
      color: GREEN,
      text: "Clocked in",
      sub: `Today at ${fmtTime(today.check_in)}`,
      time: "Now",
    },
    ...(leave.recent ?? []).map((l) => ({
      id: "l" + l.id,
      icon: "calendar-outline",
      color: BLUE,
      text: l.leave_type + " request",
      sub: `${fmtShortDate(l.start_date)} – ${fmtShortDate(l.end_date)}`,
      time: l.status,
    })),
    {
      id: "p1",
      icon: "cash-outline",
      color: PURPLE,
      text: "Payslip available",
      sub: payroll.latest_pay_period ?? "—",
      time: pm.label,
    },
  ];

  return (
    <LinearGradient
      colors={[NAVY, NAVY_MID, "#243044"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.6 }}
      style={styles.screen}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#FFFFFF"
            colors={["#FFFFFF"]}
            progressBackgroundColor={NAVY}
          />
        }
      >
        {/* ══ HERO ══════════════════════════════════════════════════════════ */}
        <View style={styles.heroContainer}>
          <BlobRings />
          <SafeAreaView edges={["top"]} style={styles.heroSafe}>
            {/* Top row */}
            <View style={styles.heroTopRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.roleBadge}>
                  <Text style={[styles.roleBadgeText, sansText()]}>
                    EMPLOYEE
                  </Text>
                </View>
                <Text style={[styles.greetingText, sansText()]}>
                  {greeting()},
                </Text>
                <Text style={[styles.heroName, serifText()]}>
                  {user.name ?? "Employee"}
                </Text>
                <Text style={[styles.heroDate, sansText()]}>{fmtDate()}</Text>
              </View>

              <View style={styles.heroActions}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/notifications");
                  }}
                  style={({ pressed }) => [
                    styles.notifBtn,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <View style={styles.notifIconWrap}>
                    <Ionicons
                      name="notifications-outline"
                      size={21}
                      color="#FFFFFF"
                    />
                  </View>
                </Pressable>

                {/* Avatar initials circle */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/profile");
                  }}
                  style={({ pressed }) => [pressed && { opacity: 0.8 }]}
                >
                  <View style={styles.heroAvatar}>
                    <Text style={[styles.heroAvatarText, monoText()]}>
                      {initials}
                    </Text>
                  </View>
                  <View style={styles.onlineDot} />
                </Pressable>
              </View>
            </View>

            {/* KPI Donut Chips */}
            <Animated.View
              style={[
                styles.kpiRow,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              {kpiChips.map((k, i) => (
                <KpiChip key={i} {...k} />
              ))}
            </Animated.View>
          </SafeAreaView>
        </View>

        {/* ══ CONTENT SHEET ════════════════════════════════════════════════ */}
        <View style={styles.sheet}>
          {/* Quick Actions */}
          <SectionLabel title="Quick Actions" />
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={86}
            contentContainerStyle={styles.quickActionsScroll}
            style={{ marginBottom: 20, marginHorizontal: -16 }}
          >
            <View style={{ width: 16 }} />
            <QuickAction
              label="Clock In/Out"
              iconName="finger-print"
              color={ACCENT}
              onPress={() => router.push("/attendance/checkin")}
            />
            <QuickAction
              label="Request Leave"
              iconName="calendar"
              color={PURPLE}
              onPress={() => router.push("/leave/apply")}
            />
            <QuickAction
              label="My Payslips"
              iconName="document-text"
              color={BLUE}
              onPress={() => router.push("/payslips")}
            />
            <QuickAction
              label="Attendance"
              iconName="time"
              color={AMBER}
              onPress={() => router.push("/attendance")}
            />
            <QuickAction
              label="My Profile"
              iconName="person"
              color={GREEN}
              onPress={() => router.push("/profile")}
            />
            <QuickAction
              label="Announcements"
              iconName="megaphone"
              color={ORANGE}
              onPress={() => router.push("/announcements")}
            />
            <View style={{ width: 8 }} />
          </ScrollView>

          {/* Today Status */}
          <SectionLabel title="Today's Status" subtitle={fmtDate()} />
          <TodayStatusCard today={today} />

          {/* Attendance Summary */}
          <SectionLabel
            title="Attendance Summary"
            subtitle="Last 30 days"
            actionLabel="Full history"
            onAction={() => router.push("/attendance")}
          />
          <AttendanceChart attendance={attendance} />

          {/* Attendance Rate Card */}
          <SectionLabel title="Attendance Rate" />
          <Pressable
            onPress={() => router.push("/attendance")}
            style={({ pressed }) => [
              styles.card,
              styles.rateCard,
              pressed && { opacity: 0.92 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[styles.rateCaption, sansText()]}>
                Overall this month
              </Text>
              <CountUp
                value={rate}
                style={[styles.rateValue, monoText(), { color: rateColor }]}
                suffix="%"
              />
              <View
                style={{
                  height: 5,
                  backgroundColor: BORDER,
                  borderRadius: 3,
                  overflow: "hidden",
                  marginTop: 8,
                }}
              >
                <View
                  style={{
                    height: "100%",
                    width: `${Math.min(rate, 100)}%`,
                    backgroundColor: rateColor,
                    borderRadius: 3,
                  }}
                />
              </View>
              <Text
                style={[
                  { fontSize: 12, color: MUTED, marginTop: 6 },
                  sansText(),
                ]}
              >
                {rate >= 80
                  ? "Excellent — keep it up"
                  : rate >= 60
                    ? "Room for improvement"
                    : "Needs attention"}
              </Text>
            </View>
            <View
              style={[styles.rateArrowBox, { backgroundColor: ACCENT + "20" }]}
            >
              <Ionicons name="chevron-forward" size={15} color={ACCENT} />
            </View>
          </Pressable>

          {/* Leave Overview */}
          <SectionLabel
            title="Leave Overview"
            badge={leave.pending}
            actionLabel="See all"
            onAction={() => router.push("/leave")}
          />

          {/* Leave stats two-col blocks (same as admin payroll/recruitment blocks) */}
          <View style={styles.twoColRow}>
            <Pressable
              onPress={() => router.push("/leave/apply")}
              style={({ pressed }) => [
                styles.infoBlock,
                pressed && { opacity: 0.9 },
              ]}
            >
              <LinearGradient
                colors={["#0F172A", "#1E293B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoBlockGradient}
              >
                <Ionicons name="calendar-outline" size={22} color="#fff" />
                <Text style={[styles.infoBlockLabel, sansText()]}>Pending</Text>
                <Text style={[styles.infoBlockValue, monoText()]}>
                  {leave.pending ?? 0}
                </Text>
                <View
                  style={[
                    styles.infoBlockStatusPill,
                    { backgroundColor: AMBER + "33" },
                  ]}
                >
                  <Text
                    style={[
                      styles.infoBlockStatusText,
                      sansText(),
                      { color: AMBER },
                    ]}
                  >
                    Awaiting review
                  </Text>
                </View>
                <Text style={[styles.infoBlockSub, sansText()]}>
                  Tap to request leave
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              onPress={() => router.push("/leave")}
              style={({ pressed }) => [
                styles.infoBlock,
                pressed && { opacity: 0.9 },
              ]}
            >
              <LinearGradient
                colors={["#0F172A", "#1E293B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoBlockGradient}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#fff"
                />
                <Text style={[styles.infoBlockLabel, sansText()]}>
                  Approved
                </Text>
                <Text style={[styles.infoBlockValue, monoText()]}>
                  {leave.approved ?? 0}
                </Text>
                <View
                  style={[
                    styles.infoBlockStatusPill,
                    { backgroundColor: GREEN + "33" },
                  ]}
                >
                  <Text
                    style={[
                      styles.infoBlockStatusText,
                      sansText(),
                      { color: GREEN },
                    ]}
                  >
                    ✓ Confirmed
                  </Text>
                </View>
                <Text style={[styles.infoBlockSub, sansText()]}>
                  View all leave history
                </Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Recent Leave Requests */}
          {(leave.recent?.length ?? 0) > 0 && (
            <>
              <SectionLabel title="Recent Requests" />
              <View style={styles.card}>
                {leave.recent.map((item, i) => (
                  <LeaveRow
                    key={item.id ?? i}
                    item={item}
                    last={i === leave.recent.length - 1}
                  />
                ))}
              </View>
            </>
          )}

          {/* Payroll Card */}
          <SectionLabel
            title="Latest Payroll"
            actionLabel="All payslips"
            onAction={() => router.push("/payslips")}
          />
          <Pressable
            onPress={() => router.push("/payslips")}
            style={({ pressed }) => [
              styles.infoBlock,
              { marginBottom: 16 },
              pressed && { opacity: 0.9 },
            ]}
          >
            <LinearGradient
              colors={["#0F172A", "#1E293B"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[styles.infoBlockGradient, { minHeight: 140 }]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <View>
                  <Ionicons name="cash-outline" size={22} color="#fff" />
                  <Text
                    style={[
                      styles.infoBlockLabel,
                      sansText(),
                      { marginTop: 10 },
                    ]}
                  >
                    Net Pay
                  </Text>
                  <Text
                    style={[
                      {
                        fontSize: 24,
                        fontWeight: "700",
                        color: "#FFFFFF",
                        letterSpacing: -0.5,
                      },
                      monoText(),
                    ]}
                  >
                    {fmtCurrency(payroll.latest_net_pay)}
                  </Text>
                </View>
                <View
                  style={[
                    styles.infoBlockStatusPill,
                    { backgroundColor: GREEN + "33", alignSelf: "flex-start" },
                  ]}
                >
                  <Text
                    style={[
                      styles.infoBlockStatusText,
                      sansText(),
                      { color: GREEN },
                    ]}
                  >
                    {pm.label}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 12,
                }}
              >
                <Text style={[styles.infoBlockSub, sansText()]}>
                  Period: {payroll.latest_pay_period ?? "—"}
                </Text>
                <Text style={[styles.infoBlockSub, sansText()]}>
                  Paid: {payroll.latest_pay_date ?? "—"}
                </Text>
              </View>
              <View style={[styles.viewAllBtn, { marginTop: 12 }]}>
                <Text style={[styles.viewAllText, sansText()]}>
                  View payslip
                </Text>
                <Ionicons name="arrow-forward" size={14} color={ACCENT} />
              </View>
            </LinearGradient>
          </Pressable>

          {/* Recent Activity */}
          <SectionLabel title="Recent Activity" />
          <View style={styles.card}>
            {activityFeed.map((item, i) => (
              <ActivityRow
                key={item.id}
                {...item}
                last={i === activityFeed.length - 1}
              />
            ))}
          </View>

          {/* Profile Row */}
          <SectionLabel title="My Profile" />
          <Pressable
            onPress={() => router.push("/profile")}
            style={({ pressed }) => [
              styles.profileRow,
              pressed && { opacity: 0.92 },
            ]}
          >
            <View style={styles.profileAvatar}>
              <Text style={[styles.profileAvatarText, monoText()]}>
                {initials}
              </Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[styles.profileName, sansText()]}>
                {user.name ?? "—"}
              </Text>
              <Text style={[styles.profileMeta, sansText()]}>
                {user.role ?? "Employee"} · {user.department?.name ?? "—"}
              </Text>
              <Text
                style={[
                  { fontSize: 10, color: MUTED, marginTop: 2 },
                  monoText(),
                ]}
              >
                {user.employee_id ?? "—"}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={MUTED} />
          </Pressable>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { flexGrow: 1 },
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
    borderColor: ACCENT,
  },

  // Hero
  heroContainer: { overflow: "hidden", paddingBottom: 28 },
  heroSafe: { paddingHorizontal: 20, paddingTop: 8 },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "flex-start",
  },
  roleBadge: {
    alignSelf: "flex-start",
    backgroundColor: ACCENT + "33",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: ACCENT + "55",
  },
  roleBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#5EEAD4",
    letterSpacing: 1.2,
  },
  greetingText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 2,
  },
  heroName: {
    fontSize: 26,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  heroDate: { fontSize: 13, color: "rgba(255,255,255,0.5)" },

  notifBtn: { position: "relative", alignSelf: "flex-start" },
  notifIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },
  heroAvatarText: { fontSize: 15, fontWeight: "700", color: "#fff" },
  onlineDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: GREEN,
    borderWidth: 2,
    borderColor: NAVY,
  },

  // KPI
  kpiRow: { flexDirection: "row", gap: 6 },
  kpiChip: { flex: 1, paddingVertical: 8, alignItems: "center" },
  kpiRingWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  kpiRingCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  kpiValue: {
    fontSize: 13,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  kpiLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    lineHeight: 13,
  },

  // Sheet
  sheet: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 32,
    backgroundColor: BG,
  },

  // Section labels (mirrors admin exactly)
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 8,
  },
  sectionLabelLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionBarAccent: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: ACCENT,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  sectionSubtitle: { fontSize: 11, color: MUTED, marginTop: 1 },
  sectionBadge: {
    backgroundColor: ACCENT + "20",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sectionBadgeText: { fontSize: 11, fontWeight: "700", color: ACCENT },
  sectionAction: { fontSize: 13, color: ACCENT, fontWeight: "600" },

  // Card
  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
    overflow: "hidden",
  },

  // Quick actions (mirrors admin)
  quickActionsScroll: {
    gap: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  quickActionBtn: { alignItems: "center", gap: 7, width: 72 },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },

  // Today status card
  statusTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    paddingBottom: 12,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  statusPillText: { fontSize: 12, fontWeight: "700" },
  statusDateText: { fontSize: 11, color: MUTED, fontWeight: "600" },
  statusBody: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  timingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  timingDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  timingLabel: { fontSize: 10, color: MUTED, marginBottom: 1 },
  timingValue: { fontSize: 14, fontWeight: "700", color: "#0F172A" },

  // Attendance chart
  attendanceLegendRow: {
    flexDirection: "row",
    gap: 16,
    padding: 14,
    paddingBottom: 4,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: MUTED },

  // Attendance rate
  rateCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 16,
  },
  rateCaption: {
    fontSize: 10,
    color: MUTED,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  rateValue: { fontSize: 36, fontWeight: "700", letterSpacing: -1 },
  rateArrowBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },

  // Leave
  leaveRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  leaveIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveName: { fontSize: 13, fontWeight: "700", color: "#0F172A" },
  leaveDates: { fontSize: 11, color: MUTED, marginTop: 2 },
  leaveBadge: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  leaveBadgeText: { fontSize: 10, fontWeight: "700" },

  // Two-col blocks (mirrors admin exactly)
  twoColRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  infoBlock: { flex: 1, borderRadius: 16, overflow: "hidden" },
  infoBlockGradient: {
    padding: 16,
    minHeight: 160,
    justifyContent: "space-between",
  },
  infoBlockLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.7)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 10,
  },
  infoBlockValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  infoBlockStatusPill: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  infoBlockStatusText: { fontSize: 11, color: "#FFFFFF", fontWeight: "600" },
  infoBlockSub: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 6 },

  viewAllBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  viewAllText: { fontSize: 13, color: ACCENT, fontWeight: "600" },

  // Activity (mirrors admin)
  activityRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  activityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityText: { fontSize: 14, fontWeight: "600", color: "#0F172A" },
  activitySub: { fontSize: 12, color: MUTED, marginTop: 1 },
  activityTime: { fontSize: 11, color: "#94A3B8" },

  // Profile
  profileRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 16,
    marginBottom: 16,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  profileAvatarText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  profileName: { fontSize: 15, fontWeight: "700", color: "#0F172A" },
  profileMeta: { fontSize: 12, color: MUTED, marginTop: 2 },
});
