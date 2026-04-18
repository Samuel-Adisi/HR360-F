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
import { monoText, sansText, serifText } from "../../../../src/theme/fonts";

// ─── Design Tokens ────────────────────────────────────────────────────────────
const ACCENT = "#0F766E";
const ACCENT_LIGHT = "#CCFBF1";
const NAVY = "#0F172A";
const NAVY_MID = "#1E293B";
const GREEN = "#059669";
const GREEN_LIGHT = "#ECFDF5";
const RED = "#DC2626";
const RED_LIGHT = "#FEF2F2";
const ORANGE = "#F97316";
const ORANGE_LIGHT = "#FFF7ED";
const BLUE = "#0A66C2";
const BLUE_LIGHT = "#EFF6FF";
const PURPLE = "#7C3AED";
const SURFACE = "#FFFFFF";
const BG = "#F8FAFC";
const BORDER = "#E2E8F0";
const MUTED = "#64748B";

const { width: SCREEN_W } = Dimensions.get("window");

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// TODO: Replace this function with your real API call when your backend is ready.
// Expected shape mirrors the real /dashboard/ endpoint response.
//
// Real implementation will look like:
//   async function fetchDashboard(token) {
//     const res = await fetch(`${YOUR_API_BASE_URL}/dashboard/`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     if (!res.ok) throw new Error("Failed to fetch dashboard");
//     return res.json();
//   }

async function fetchDashboard(_token) {
  // Simulate a small network delay so loading state is visible during dev
  await new Promise((resolve) => setTimeout(resolve, 800));

  // ── Placeholder data — swap with real API response ────────────────────────
  return {
    user: {
      name: "Kwame Asante",
      employee_id: "EMP-2024-0042",
      email: "k.asante@company.com",
      role: "Senior Developer",
      department: { name: "Engineering" },
    },
    today: {
      status: "Present", // "Present" | "Late" | "Absent" | "On Leave"
      is_checked_in: true,
      is_checked_out: false,
      is_on_leave: false,
      hours_worked: 5.5,
      check_in: "08:47", // "HH:MM" 24-hour format
      check_out: null, // null if not yet checked out
    },
    attendance: {
      days_present: 18,
      days_absent: 1,
      days_late: 2,
      days_on_leave: 1,
      total_hours_worked: 142,
      attendance_rate: 87, // percentage 0-100
    },
    leave: {
      pending: 1,
      approved: 3,
      active_leave: null, // or { leave_type: "Annual Leave" } if on leave
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
      latest_net_pay: 4250.0, // number in GHS
      latest_pay_period: "March 2025",
      latest_pay_status: "paid", // "paid" | "pending" | "approved" | "on_hold"
      latest_pay_date: "31 Mar 2025",
    },
  };
  // ── End placeholder data ──────────────────────────────────────────────────
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate() {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function formatTime(timeStr) {
  if (!timeStr) return "--:--";
  const [h, m] = timeStr.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 || 12;
  return `${h12}:${String(m).padStart(2, "0")} ${ampm}`;
}

function formatCurrency(amount) {
  if (!amount) return "—";
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 2,
  }).format(amount);
}

function getStatusColor(status) {
  switch (status) {
    case "Present":
      return GREEN;
    case "Late":
      return ORANGE;
    case "Absent":
      return RED;
    case "On Leave":
      return BLUE;
    default:
      return MUTED;
  }
}

function getStatusBg(status) {
  switch (status) {
    case "Present":
      return GREEN_LIGHT;
    case "Late":
      return ORANGE_LIGHT;
    case "Absent":
      return RED_LIGHT;
    case "On Leave":
      return BLUE_LIGHT;
    default:
      return BG;
  }
}

function getLeaveStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "approved":
      return GREEN;
    case "pending":
      return ORANGE;
    case "rejected":
      return RED;
    default:
      return MUTED;
  }
}

function getPayStatusColor(status) {
  switch (status?.toLowerCase()) {
    case "paid":
      return GREEN;
    case "pending":
      return ORANGE;
    case "approved":
      return BLUE;
    case "on_hold":
      return RED;
    default:
      return MUTED;
  }
}

// ─── Animated Hero Rings ──────────────────────────────────────────────────────
function HeroRings() {
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const pulse = (anim, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(anim, {
            toValue: 1,
            duration: 3200,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 3200,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    pulse(a1, 0);
    pulse(a2, 1600);
  }, []);

  const ring = (anim, size, opacity) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    position: "absolute",
    right: -size / 2 + 50,
    top: -size / 2 + 70,
    opacity: anim.interpolate({
      inputRange: [0, 1],
      outputRange: [opacity, opacity * 0.3],
    }),
    transform: [
      {
        scale: anim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }),
      },
    ],
  });

  return (
    <>
      <Animated.View style={ring(a1, 160, 0.5)} />
      <Animated.View style={ring(a2, 240, 0.3)} />
      <Animated.View style={ring(a1, 320, 0.15)} />
    </>
  );
}

// ─── Check-in Ring ────────────────────────────────────────────────────────────
function CheckInRing({ hoursWorked, targetHours = 8 }) {
  const animVal = useRef(new Animated.Value(0)).current;
  const pct = Math.min(hoursWorked / targetHours, 1);

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: pct,
      duration: 1200,
      delay: 300,
      useNativeDriver: false,
    }).start();
  }, [pct]);

  const ringColor = pct >= 1 ? GREEN : pct > 0.5 ? ACCENT : ORANGE;

  return (
    <View style={[styles.checkInRingOuter, { borderColor: ringColor + "30" }]}>
      <View style={[styles.checkInRingInner, { borderColor: ringColor }]}>
        <Text style={[styles.checkInHours, monoText(), { color: ringColor }]}>
          {hoursWorked.toFixed(1)}h
        </Text>
        <Text style={[styles.checkInHoursLabel, sansText()]}>worked</Text>
      </View>
    </View>
  );
}

// ─── Section Label ────────────────────────────────────────────────────────────
function SectionLabel({ title, subtitle, onAction, actionLabel }) {
  return (
    <View style={styles.sectionLabelRow}>
      <View style={styles.sectionLabelLeft}>
        <View style={styles.sectionBarAccent} />
        <Text style={[styles.sectionTitle, sansText()]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.sectionSubtitle, sansText()]}>{subtitle}</Text>
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

// ─── Stat Pill ─────────────────────────────────────────────────────────────
function StatPill({ label, value, color, bg, icon }) {
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      damping: 14,
      stiffness: 200,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.statPill,
        { backgroundColor: bg, transform: [{ scale: scaleAnim }] },
      ]}
    >
      <View style={[styles.statPillIcon, { backgroundColor: color + "20" }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={[styles.statPillValue, monoText(), { color }]}>{value}</Text>
      <Text style={[styles.statPillLabel, sansText()]}>{label}</Text>
    </Animated.View>
  );
}

// ─── Quick Action ─────────────────────────────────────────────────────────────
function QuickAction({ label, iconName, color, onPress }) {
  return (
    <Pressable
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.();
      }}
      style={({ pressed }) => [
        styles.quickActionBtn,
        pressed && { opacity: 0.85, transform: [{ scale: 0.95 }] },
      ]}
    >
      <View style={[styles.quickActionIcon, { backgroundColor: color }]}>
        <Ionicons name={iconName} size={22} color="#FFFFFF" />
      </View>
      <Text style={[styles.quickActionLabel, sansText()]}>{label}</Text>
    </Pressable>
  );
}

// ─── Leave Request Row ────────────────────────────────────────────────────────
function LeaveRow({ item }) {
  const color = getLeaveStatusColor(item.status);
  const startDate = item.start_date
    ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
        new Date(item.start_date),
      )
    : "—";
  const endDate = item.end_date
    ? new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(
        new Date(item.end_date),
      )
    : "—";

  return (
    <View style={styles.leaveRow}>
      <View style={[styles.leaveTypeTag, { backgroundColor: color + "15" }]}>
        <Ionicons name="calendar-outline" size={14} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.leaveType, sansText()]}>{item.leave_type}</Text>
        <Text style={[styles.leaveDates, sansText()]}>
          {startDate} – {endDate}
        </Text>
      </View>
      <View
        style={[styles.leaveStatusBadge, { backgroundColor: color + "15" }]}
      >
        <Text style={[styles.leaveStatusText, sansText(), { color }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  const load = useCallback(async (isRefresh = false) => {
    try {
      if (!isRefresh) setLoading(true);

      // TODO: Uncomment the line below and remove the mock call once backend is ready.
      // const token = await AsyncStorage.getItem("access_token");
      // if (!token) { router.replace("/login"); return; }

      const token = "mock-token"; // placeholder — remove when backend is connected
      const result = await fetchDashboard(token);
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

  // ── Derived data ────────────────────────────────────────────────────────────
  const user = data?.user ?? {};
  const today = data?.today ?? {};
  const attendance = data?.attendance ?? {};
  const leave = data?.leave ?? {};
  const payroll = data?.payroll ?? {};

  const todayStatus = today.status ?? "Absent";
  const isCheckedIn = today.is_checked_in ?? false;
  const isCheckedOut = today.is_checked_out ?? false;
  const isOnLeave = today.is_on_leave ?? false;
  const hoursWorked = today.hours_worked ?? 0;
  const checkIn = formatTime(today.check_in);
  const checkOut = formatTime(today.check_out);

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <LinearGradient
        colors={[NAVY, NAVY_MID, "#243044"]}
        style={styles.loadingScreen}
      >
        <ActivityIndicator color="#FFFFFF" size="large" />
        <Text style={[styles.loadingText, sansText()]}>
          Loading your dashboard…
        </Text>
      </LinearGradient>
    );
  }

  // ── Error ───────────────────────────────────────────────────────────────────
  if (error) {
    return (
      <LinearGradient colors={[NAVY, NAVY_MID]} style={styles.loadingScreen}>
        <Ionicons
          name="cloud-offline-outline"
          size={48}
          color="rgba(255,255,255,0.4)"
        />
        <Text style={[styles.errorText, sansText()]}>{error}</Text>
        <Pressable onPress={() => load()} style={styles.retryBtn}>
          <Text style={[styles.retryText, sansText()]}>Try again</Text>
        </Pressable>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient
      colors={[NAVY, NAVY_MID, "#243044"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.55 }}
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
        {/* ── HERO ──────────────────────────────────────────────────────────── */}
        <View style={styles.heroContainer}>
          <HeroRings />
          <SafeAreaView edges={["top"]} style={styles.heroSafe}>
            {/* Top bar */}
            <View style={styles.heroTopRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.deptBadge}>
                  <Text style={[styles.deptBadgeText, sansText()]}>
                    {user.department?.name?.toUpperCase() ?? "EMPLOYEE"}
                  </Text>
                </View>
                <Text style={[styles.greetingText, sansText()]}>
                  {getGreeting()},
                </Text>
                <Text style={[styles.heroName, serifText()]}>
                  {user.name || "Employee"}
                </Text>
                <Text style={[styles.heroDate, sansText()]}>
                  {formatDate()}
                </Text>
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
                      size={20}
                      color="#FFFFFF"
                    />
                  </View>
                </Pressable>

                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/profile");
                  }}
                  style={({ pressed }) => [
                    styles.avatarCircle,
                    pressed && { opacity: 0.8 },
                  ]}
                >
                  <Text style={[styles.avatarInitial, monoText()]}>
                    {(user.name ?? "E").charAt(0).toUpperCase()}
                  </Text>
                  <View style={styles.onlineDot} />
                </Pressable>
              </View>
            </View>

            {/* ── TODAY CARD ────────────────────────────────────────────────── */}
            <Animated.View
              style={[
                styles.todayCard,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              <View style={styles.todayCardHeader}>
                <View
                  style={[
                    styles.statusPill,
                    {
                      backgroundColor: getStatusColor(todayStatus) + "25",
                      borderColor: getStatusColor(todayStatus) + "50",
                    },
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      { backgroundColor: getStatusColor(todayStatus) },
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      sansText(),
                      { color: getStatusColor(todayStatus) },
                    ]}
                  >
                    {isOnLeave ? "On Leave" : todayStatus}
                  </Text>
                </View>
                <Text style={[styles.todayLabel, sansText()]}>Today</Text>
              </View>

              <View style={styles.todayBody}>
                <CheckInRing hoursWorked={hoursWorked} />

                <View style={styles.todayTimings}>
                  <View style={styles.timingRow}>
                    <View
                      style={[
                        styles.timingIcon,
                        { backgroundColor: GREEN + "20" },
                      ]}
                    >
                      <Ionicons name="log-in-outline" size={14} color={GREEN} />
                    </View>
                    <View>
                      <Text style={[styles.timingLabel, sansText()]}>
                        Check In
                      </Text>
                      <Text style={[styles.timingValue, monoText()]}>
                        {checkIn}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.timingDivider} />

                  <View style={styles.timingRow}>
                    <View
                      style={[
                        styles.timingIcon,
                        { backgroundColor: RED + "20" },
                      ]}
                    >
                      <Ionicons name="log-out-outline" size={14} color={RED} />
                    </View>
                    <View>
                      <Text style={[styles.timingLabel, sansText()]}>
                        Check Out
                      </Text>
                      <Text style={[styles.timingValue, monoText()]}>
                        {checkOut}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              <View style={styles.empIdRow}>
                <Ionicons
                  name="id-card-outline"
                  size={12}
                  color="rgba(255,255,255,0.4)"
                />
                <Text style={[styles.empId, monoText()]}>
                  {user.employee_id ?? "—"}
                </Text>
              </View>
            </Animated.View>
          </SafeAreaView>
        </View>

        {/* ── CONTENT SHEET ─────────────────────────────────────────────────── */}
        <View style={styles.sheet}>
          {/* ── ATTENDANCE STATS ──────────────────────────────────────────── */}
          <SectionLabel title="This Month" subtitle="Last 30 days" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.statsScroll}
            style={{ marginHorizontal: -16, marginBottom: 20 }}
          >
            <View style={{ width: 16 }} />
            <StatPill
              label="Present"
              value={attendance.days_present ?? 0}
              color={GREEN}
              bg={GREEN_LIGHT}
              icon="checkmark-circle-outline"
            />
            <StatPill
              label="Absent"
              value={attendance.days_absent ?? 0}
              color={RED}
              bg={RED_LIGHT}
              icon="close-circle-outline"
            />
            <StatPill
              label="Late"
              value={attendance.days_late ?? 0}
              color={ORANGE}
              bg={ORANGE_LIGHT}
              icon="time-outline"
            />
            <StatPill
              label="On Leave"
              value={attendance.days_on_leave ?? 0}
              color={BLUE}
              bg={BLUE_LIGHT}
              icon="calendar-outline"
            />
            <StatPill
              label="Hours"
              value={`${attendance.total_hours_worked ?? 0}h`}
              color={ACCENT}
              bg={ACCENT_LIGHT}
              icon="hourglass-outline"
            />
            <View style={{ width: 8 }} />
          </ScrollView>

          {/* ── ATTENDANCE RATE ───────────────────────────────────────────── */}
          <View style={[styles.card, styles.rateCard]}>
            <View style={styles.rateLeft}>
              <Text style={[styles.rateLabel, sansText()]}>
                Attendance Rate
              </Text>
              <Text style={[styles.rateValue, monoText()]}>
                {attendance.attendance_rate ?? 0}%
              </Text>
              <View style={styles.rateBarTrack}>
                <View
                  style={[
                    styles.rateBarFill,
                    {
                      width: `${Math.min(attendance.attendance_rate ?? 0, 100)}%`,
                      backgroundColor:
                        (attendance.attendance_rate ?? 0) >= 80
                          ? GREEN
                          : (attendance.attendance_rate ?? 0) >= 60
                            ? ORANGE
                            : RED,
                    },
                  ]}
                />
              </View>
              <Text style={[styles.rateSubtext, sansText()]}>
                {(attendance.attendance_rate ?? 0) >= 80
                  ? "Great consistency 🎯"
                  : (attendance.attendance_rate ?? 0) >= 60
                    ? "Room to improve"
                    : "Needs attention"}
              </Text>
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.rateBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => router.push("/attendance")}
            >
              <Ionicons name="arrow-forward" size={18} color={ACCENT} />
            </Pressable>
          </View>

          {/* ── QUICK ACTIONS ─────────────────────────────────────────────── */}
          <SectionLabel title="Quick Actions" />
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsScroll}
            style={{ marginHorizontal: -16, marginBottom: 20 }}
          >
            <View style={{ width: 16 }} />
            <QuickAction
              label="Apply Leave"
              iconName="calendar"
              color={ACCENT}
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
              color={GREEN}
              onPress={() => router.push("/attendance")}
            />
            <QuickAction
              label="Profile"
              iconName="person"
              color={PURPLE}
              onPress={() => router.push("/profile")}
            />
            <View style={{ width: 8 }} />
          </ScrollView>

          {/* ── LEAVE + PAYROLL ───────────────────────────────────────────── */}
          <View style={styles.twoColRow}>
            <Pressable
              style={({ pressed }) => [
                styles.infoBlock,
                pressed && { opacity: 0.92 },
              ]}
              onPress={() => router.push("/leave")}
            >
              <LinearGradient
                colors={[NAVY, NAVY_MID]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoBlockGradient}
              >
                <Ionicons name="calendar-outline" size={20} color="#fff" />
                <Text style={[styles.infoBlockLabel, sansText()]}>Leave</Text>

                <View style={styles.infoBlockRow}>
                  <View style={styles.infoBlockStat}>
                    <Text
                      style={[
                        styles.infoBlockStatValue,
                        monoText(),
                        { color: ORANGE },
                      ]}
                    >
                      {leave.pending ?? 0}
                    </Text>
                    <Text style={[styles.infoBlockStatLabel, sansText()]}>
                      Pending
                    </Text>
                  </View>
                  <View style={styles.infoBlockVertDivider} />
                  <View style={styles.infoBlockStat}>
                    <Text
                      style={[
                        styles.infoBlockStatValue,
                        monoText(),
                        { color: GREEN },
                      ]}
                    >
                      {leave.approved ?? 0}
                    </Text>
                    <Text style={[styles.infoBlockStatLabel, sansText()]}>
                      Approved
                    </Text>
                  </View>
                </View>

                {leave.active_leave ? (
                  <View style={styles.activeLeavePill}>
                    <View
                      style={[
                        styles.activeLeaveDot,
                        { backgroundColor: GREEN },
                      ]}
                    />
                    <Text style={[styles.activeLeaveText, sansText()]}>
                      On {leave.active_leave.leave_type}
                    </Text>
                  </View>
                ) : (
                  <Text style={[styles.infoBlockSub, sansText()]}>
                    No active leave
                  </Text>
                )}
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.infoBlock,
                pressed && { opacity: 0.92 },
              ]}
              onPress={() => router.push("/payslips")}
            >
              <LinearGradient
                colors={[NAVY, NAVY_MID]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoBlockGradient}
              >
                <Ionicons name="cash-outline" size={20} color="#fff" />
                <Text style={[styles.infoBlockLabel, sansText()]}>
                  Latest Pay
                </Text>

                <Text style={[styles.infoBlockBigValue, monoText()]}>
                  {formatCurrency(payroll.latest_net_pay)}
                </Text>

                {payroll.latest_pay_period && (
                  <Text style={[styles.infoBlockPeriod, sansText()]}>
                    {payroll.latest_pay_period}
                  </Text>
                )}

                {payroll.latest_pay_status && (
                  <View
                    style={[
                      styles.payStatusPill,
                      {
                        backgroundColor:
                          getPayStatusColor(payroll.latest_pay_status) + "25",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.payStatusText,
                        sansText(),
                        { color: getPayStatusColor(payroll.latest_pay_status) },
                      ]}
                    >
                      {payroll.latest_pay_status?.toUpperCase()}
                    </Text>
                  </View>
                )}

                {payroll.latest_pay_date && (
                  <Text style={[styles.infoBlockSub, sansText()]}>
                    Paid {payroll.latest_pay_date}
                  </Text>
                )}
              </LinearGradient>
            </Pressable>
          </View>

          {/* ── RECENT LEAVE REQUESTS ─────────────────────────────────────── */}
          {(leave.recent?.length ?? 0) > 0 && (
            <>
              <SectionLabel
                title="Recent Leave Requests"
                onAction={() => router.push("/leave")}
                actionLabel="See all"
              />
              <View style={styles.card}>
                {leave.recent.map((item, i) => (
                  <View key={item.id ?? i}>
                    <LeaveRow item={item} />
                    {i < leave.recent.length - 1 && (
                      <View style={styles.divider} />
                    )}
                  </View>
                ))}
              </View>
            </>
          )}

          {/* ── MY PROFILE CARD ───────────────────────────────────────────── */}
          <SectionLabel title="My Profile" />
          <Pressable
            style={({ pressed }) => [pressed && { opacity: 0.95 }]}
            onPress={() => router.push("/profile")}
          >
            <LinearGradient
              colors={[ACCENT, "#0D9488", "#0F766E"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.idCard}
            >
              <View style={styles.idCardCircle1} />
              <View style={styles.idCardCircle2} />

              <View style={styles.idCardContent}>
                <View style={styles.idCardLeft}>
                  <View style={styles.idCardAvatar}>
                    <Text style={[styles.idCardAvatarText, monoText()]}>
                      {(user.name ?? "E").charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ marginLeft: 14 }}>
                    <Text style={[styles.idCardName, serifText()]}>
                      {user.name ?? "—"}
                    </Text>
                    <Text style={[styles.idCardRole, sansText()]}>
                      {user.role ?? "Employee"}
                    </Text>
                    <Text style={[styles.idCardDept, sansText()]}>
                      {user.department?.name ?? "—"}
                    </Text>
                  </View>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color="rgba(255,255,255,0.6)"
                />
              </View>

              <View style={styles.idCardFooter}>
                <View>
                  <Text style={[styles.idCardFooterLabel, sansText()]}>
                    Employee ID
                  </Text>
                  <Text style={[styles.idCardFooterId, monoText()]}>
                    {user.employee_id ?? "—"}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.idCardFooterLabel, sansText()]}>
                    Email
                  </Text>
                  <Text
                    style={[styles.idCardFooterId, monoText()]}
                    numberOfLines={1}
                  >
                    {user.email ?? "—"}
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </Pressable>

          <View style={{ height: 32 }} />
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { flexGrow: 1 },

  loadingScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  loadingText: { color: "rgba(255,255,255,0.6)", fontSize: 14 },
  errorText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 15,
    marginTop: 12,
    textAlign: "center",
  },
  retryBtn: {
    marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.12)",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryText: { color: "#FFFFFF", fontSize: 14, fontWeight: "600" },

  heroContainer: { overflow: "hidden", paddingBottom: 24 },
  heroSafe: { paddingHorizontal: 20, paddingTop: 8 },
  heroTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  heroActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    alignSelf: "flex-start",
  },
  deptBadge: {
    alignSelf: "flex-start",
    backgroundColor: ACCENT + "33",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: ACCENT + "55",
  },
  deptBadgeText: {
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
  notifBtn: { position: "relative" },
  notifIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: ACCENT,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { fontSize: 17, fontWeight: "700", color: "#FFFFFF" },
  onlineDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: GREEN,
    borderWidth: 2,
    borderColor: NAVY,
  },

  todayCard: {
    backgroundColor: "rgba(255,255,255,0.09)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.14)",
    padding: 18,
  },
  todayCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
  },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  statusPillText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.3 },
  todayLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  todayBody: { flexDirection: "row", alignItems: "center", gap: 20 },

  checkInRingOuter: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  checkInRingInner: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },
  checkInHours: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  checkInHoursLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    marginTop: 1,
  },

  todayTimings: { flex: 1, gap: 12 },
  timingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  timingIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  timingLabel: {
    fontSize: 11,
    color: "rgba(255,255,255,0.5)",
    marginBottom: 1,
  },
  timingValue: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  timingDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    marginLeft: 40,
  },
  empIdRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  empId: { fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: 0.5 },

  sheet: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    backgroundColor: BG,
  },

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
    color: NAVY,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  sectionSubtitle: { fontSize: 11, color: MUTED },
  sectionAction: { fontSize: 13, color: ACCENT, fontWeight: "600" },

  statsScroll: { flexDirection: "row", gap: 10, alignItems: "stretch" },
  statPill: {
    width: 90,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 10,
    alignItems: "center",
    gap: 6,
  },
  statPillIcon: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statPillValue: { fontSize: 20, fontWeight: "700", letterSpacing: -0.5 },
  statPillLabel: {
    fontSize: 10,
    color: MUTED,
    fontWeight: "600",
    textAlign: "center",
  },

  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
    overflow: "hidden",
  },
  rateCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 12,
  },
  rateLeft: { flex: 1 },
  rateLabel: {
    fontSize: 12,
    color: MUTED,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  rateValue: {
    fontSize: 28,
    fontWeight: "700",
    color: NAVY,
    letterSpacing: -1,
    marginBottom: 8,
  },
  rateBarTrack: {
    height: 6,
    backgroundColor: BORDER,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 6,
  },
  rateBarFill: { height: "100%", borderRadius: 3 },
  rateSubtext: { fontSize: 12, color: MUTED },
  rateBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: ACCENT + "15",
    alignItems: "center",
    justifyContent: "center",
  },

  quickActionsScroll: {
    flexDirection: "row",
    gap: 16,
    alignItems: "flex-start",
  },
  quickActionBtn: { alignItems: "center", gap: 7, width: 72 },
  quickActionIcon: {
    width: 54,
    height: 54,
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

  twoColRow: { flexDirection: "row", gap: 10, marginBottom: 16 },
  infoBlock: { flex: 1, borderRadius: 16, overflow: "hidden" },
  infoBlockGradient: { padding: 16, minHeight: 170 },
  infoBlockLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 10,
    marginBottom: 12,
  },
  infoBlockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  infoBlockStat: { flex: 1, alignItems: "center" },
  infoBlockStatValue: { fontSize: 22, fontWeight: "700", letterSpacing: -0.5 },
  infoBlockStatLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    marginTop: 2,
  },
  infoBlockVertDivider: {
    width: 1,
    height: 36,
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  activeLeavePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(5,150,105,0.2)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  activeLeaveDot: { width: 6, height: 6, borderRadius: 3 },
  activeLeaveText: { fontSize: 11, color: "#FFFFFF", fontWeight: "600" },
  infoBlockBigValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  infoBlockPeriod: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    marginBottom: 8,
  },
  payStatusPill: {
    alignSelf: "flex-start",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginBottom: 6,
  },
  payStatusText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  infoBlockSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.4)",
    marginTop: "auto",
  },

  leaveRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  leaveTypeTag: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveType: { fontSize: 14, fontWeight: "700", color: NAVY },
  leaveDates: { fontSize: 11, color: MUTED, marginTop: 2 },
  leaveStatusBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  leaveStatusText: { fontSize: 11, fontWeight: "700" },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
    marginHorizontal: 14,
  },

  idCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    padding: 18,
  },
  idCardCircle1: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.06)",
    right: -40,
    top: -40,
  },
  idCardCircle2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.06)",
    right: 40,
    bottom: -20,
  },
  idCardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  idCardLeft: { flexDirection: "row", alignItems: "center" },
  idCardAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.3)",
  },
  idCardAvatarText: { fontSize: 20, fontWeight: "700", color: "#FFFFFF" },
  idCardName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.3,
  },
  idCardRole: { fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  idCardDept: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 1 },
  idCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.15)",
  },
  idCardFooterLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.5)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 3,
  },
  idCardFooterId: {
    fontSize: 13,
    fontWeight: "600",
    color: "#FFFFFF",
    maxWidth: 160,
  },
});
