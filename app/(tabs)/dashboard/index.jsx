import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect as useNavFocus } from "@react-navigation/native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Circle, G, Svg } from "react-native-svg";
import { monoText, sansText, serifText } from "../../../src/theme/fonts";

// ─── Design Tokens ─────────────────────────────────────────────────────────
const ACCENT = "#0F766E";
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
const BORDER = "#E2E8F0";
const MUTED = "#64748B";
const SURFACE = "#FFFFFF";
const BG = "#F8FAFC";

const { width: SCREEN_W } = Dimensions.get("window");

const MANAGER_AVATAR =
  "https://images.unsplash.com/photo-1560250097-0dc05a977884?w=100&h=100&fit=crop&crop=face";

// ─── Mock Data ──────────────────────────────────────────────────────────────
const KPI_DATA = [
  {
    label: "Total\nEmployees",
    value: "142",
    pct: 1.0, // 100% — full ring as baseline
    color: ACCENT,
    trackColor: "rgba(255,255,255,0.12)",
  },
  {
    label: "Present\nToday",
    value: "118",
    pct: 118 / 142, // 83%
    color: GREEN,
    trackColor: "rgba(255,255,255,0.12)",
  },
  {
    label: "On\nLeave",
    value: "9",
    pct: 9 / 142, // 6%
    color: ORANGE,
    trackColor: "rgba(255,255,255,0.12)",
  },
  {
    label: "Open\nPositions",
    value: "6",
    pct: 6 / 20, // out of 20 max headcount
    color: BLUE,
    trackColor: "rgba(255,255,255,0.12)",
  },
];

const ATTENDANCE_BARS = [
  { day: "Mon", present: 130, late: 8, absent: 4 },
  { day: "Tue", present: 125, late: 10, absent: 7 },
  { day: "Wed", present: 133, late: 5, absent: 4 },
  { day: "Thu", present: 120, late: 12, absent: 10 },
  { day: "Fri", present: 118, late: 7, absent: 17 },
];
const MAX_TOTAL = 142;

const PENDING_LEAVES = [
  {
    id: 1,
    name: "Kwame Mensah",
    type: "Annual Leave",
    dates: "Apr 7 – Apr 11",
    days: 5,
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    color: "#0A66C2",
  },
  {
    id: 2,
    name: "Abena Owusu",
    type: "Sick Leave",
    dates: "Apr 3 – Apr 4",
    days: 2,
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=100&h=100&fit=crop&crop=face",
    color: "#7C3AED",
  },
  {
    id: 3,
    name: "Kofi Asante",
    type: "Casual Leave",
    dates: "Apr 5",
    days: 1,
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    color: "#F97316",
  },
];

const ACTIVITY_FEED = [
  {
    id: 1,
    icon: "person-add-outline",
    color: GREEN,
    bg: GREEN_LIGHT,
    text: "New hire onboarded",
    sub: "Ama Darko · Software Engineer",
    time: "10m ago",
  },
  {
    id: 2,
    icon: "checkmark-done-outline",
    color: BLUE,
    bg: BLUE_LIGHT,
    text: "Leave approved",
    sub: "Yaw Boateng · Annual Leave",
    time: "45m ago",
  },
  {
    id: 3,
    icon: "star-outline",
    color: PURPLE,
    bg: "#F5F3FF",
    text: "Appraisal submitted",
    sub: "Esi Asante · Q1 2026",
    time: "2h ago",
  },
  {
    id: 4,
    icon: "close-circle-outline",
    color: RED,
    bg: RED_LIGHT,
    text: "Leave rejected",
    sub: "Nana Agyeman · Casual Leave",
    time: "3h ago",
  },
  {
    id: 5,
    icon: "cash-outline",
    color: ORANGE,
    bg: ORANGE_LIGHT,
    text: "Payroll processed",
    sub: "March 2026 · 142 employees",
    time: "Yesterday",
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDate() {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

// ─── Animated Blob Rings ────────────────────────────────────────────────────
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

// ─── Main Component ─────────────────────────────────────────────────────────
export default function HRDashboard() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
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
  }, []);

  const loadUser = useCallback(async () => {
    try {
      const name = await AsyncStorage.getItem("username");
      setUsername(name || "");
    } catch {
      setUsername("");
    }
  }, []);

  useNavFocus(
    useCallback(() => {
      loadUser();
    }, [loadUser]),
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUser();
    setTimeout(() => setRefreshing(false), 800);
  }, [loadUser]);

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
        {/* ── HERO ──────────────────────────────────────────────────── */}
        <View style={styles.heroContainer}>
          <BlobRings />
          <SafeAreaView edges={["top"]} style={styles.heroSafe}>
            {/* Top row */}
            <View style={styles.heroTopRow}>
              <View style={{ flex: 1 }}>
                <View style={styles.roleBadge}>
                  <Text style={[styles.roleBadgeText, sansText()]}>
                    HR MANAGER
                  </Text>
                </View>
                <Text style={[styles.greetingText, sansText()]}>
                  {getGreeting()},
                </Text>
                <Text style={[styles.heroName, serifText()]}>
                  {username || "Manager"}
                </Text>
                <Text style={[styles.heroDate, sansText()]}>
                  {formatDate()}
                </Text>
              </View>

              <View style={styles.heroActions}>
                {/* Notification bell — Telegram frosted square */}
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
                  <View style={styles.notifBadge}>
                    <Text style={[styles.notifBadgeText, monoText()]}>3</Text>
                  </View>
                </Pressable>

                {/* Manager profile image */}
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.replace("/profile");
                  }}
                  style={({ pressed }) => [pressed && { opacity: 0.8 }]}
                >
                  <Image
                    source={{ uri: MANAGER_AVATAR }}
                    style={styles.managerAvatar}
                  />
                  <View style={styles.onlineDot} />
                </Pressable>
              </View>
            </View>

            {/* KPI chips */}
            <Animated.View
              style={[
                styles.kpiRow,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              {KPI_DATA.map((k, i) => (
                <KpiChip key={i} {...k} />
              ))}
            </Animated.View>
          </SafeAreaView>
        </View>

        {/* ── CONTENT SHEET ─────────────────────────────────────────── */}
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
              label="Add Employee"
              iconName="person-add"
              color={ACCENT}
              onPress={() => router.navigate("/employees/add")}
            />
            <QuickAction
              label="Post Job"
              iconName="briefcase"
              color={BLUE}
              onPress={() => router.push("/dashboard/recruitment")}
            />
            <QuickAction
              label="Run Payroll"
              iconName="cash"
              color={ORANGE}
              onPress={() => router.push("/payroll/run")}
            />
            <QuickAction
              label="Announce"
              iconName="megaphone"
              color={PURPLE}
              onPress={() => router.push("/dashboard/announcements")}
            />
            <QuickAction
              label="Attendance"
              iconName="calendar"
              color={GREEN}
              onPress={() => router.push("/attendance")}
            />
            <QuickAction
              label="Reports"
              iconName="bar-chart"
              color="#64748B"
              onPress={() => {}}
            />
            <QuickAction
              label="Leaves"
              iconName="document-text"
              color="#0891B2"
              onPress={() => router.push("/dashboard/leave")}
            />
            <QuickAction
              label="Settings"
              iconName="settings"
              color="#475569"
              onPress={() => router.push("/profile/settings")}
            />
            <View style={{ width: 8 }} />
          </ScrollView>

          {/* Attendance Overview */}
          <SectionLabel title="Attendance Overview" subtitle="This week" />
          <View style={styles.card}>
            <View style={styles.attendanceLegendRow}>
              <LegendDot color={ACCENT} label="Present" />
              <LegendDot color={ORANGE} label="Late" />
              <LegendDot color={RED} label="Absent" />
            </View>
            <View style={styles.barsContainer}>
              {ATTENDANCE_BARS.map((bar, i) => (
                <AttendanceBar
                  key={i}
                  {...bar}
                  maxTotal={MAX_TOTAL}
                  index={i}
                />
              ))}
            </View>
            <Pressable
              style={({ pressed }) => [
                styles.viewAllBtn,
                pressed && { opacity: 0.7 },
              ]}
              onPress={() => router.replace("/attendance")}
            >
              <Text style={[styles.viewAllText, sansText()]}>
                View full records
              </Text>
              <Ionicons name="arrow-forward" size={14} color={ACCENT} />
            </Pressable>
          </View>

          {/* Pending Leave Requests */}
          <SectionLabel
            title="Pending Leave Requests"
            badge={PENDING_LEAVES.length}
            onAction={() => router.push("/leave")}
            actionLabel="See all"
          />
          <View style={styles.card}>
            {PENDING_LEAVES.map((req, i) => (
              <View key={req.id}>
                <LeaveRequestRow
                  {...req}
                  onApprove={() =>
                    Alert.alert("Approved", `${req.name}'s leave approved.`)
                  }
                  onReject={() =>
                    Alert.alert("Rejected", `${req.name}'s leave rejected.`)
                  }
                />
                {i < PENDING_LEAVES.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>

          {/* Payroll + Recruitment */}
          <View style={styles.twoColRow}>
            <Pressable
              style={({ pressed }) => [
                styles.infoBlock,
                pressed && { opacity: 0.9 },
              ]}
              onPress={() => router.push("/payroll")}
            >
              <LinearGradient
                colors={["#0F172A", "#1E293B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoBlockGradient}
              >
                <Ionicons name="cash-outline" size={22} color="#fff" />
                <Text style={[styles.infoBlockLabel, sansText()]}>Payroll</Text>
                <Text style={[styles.infoBlockValue, monoText()]}>
                  March 2026
                </Text>
                <View style={styles.infoBlockStatusPill}>
                  <Text style={[styles.infoBlockStatusText, sansText()]}>
                    ✓ Processed
                  </Text>
                </View>
                <Text style={[styles.infoBlockSub, sansText()]}>
                  142 employees · GH₵ 1.2M
                </Text>
              </LinearGradient>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.infoBlock,
                pressed && { opacity: 0.9 },
              ]}
              onPress={() => router.push("/recruitment")}
            >
              <LinearGradient
                colors={["#0F172A", "#1E293B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.infoBlockGradient}
              >
                <Ionicons name="briefcase-outline" size={22} color="#fff" />
                <Text style={[styles.infoBlockLabel, sansText()]}>
                  Recruitment
                </Text>
                <Text style={[styles.infoBlockValue, monoText()]}>6 Open</Text>
                <View
                  style={[
                    styles.infoBlockStatusPill,
                    { backgroundColor: "rgba(255,255,255,0.2)" },
                  ]}
                >
                  <Text style={[styles.infoBlockStatusText, sansText()]}>
                    24 applicants
                  </Text>
                </View>
                <Text style={[styles.infoBlockSub, sansText()]}>
                  8 pending AI screening
                </Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Recent Activity */}
          <SectionLabel title="Recent Activity" />
          <View style={styles.card}>
            {ACTIVITY_FEED.map((item, i) => (
              <View key={item.id}>
                <ActivityRow {...item} />
                {i < ACTIVITY_FEED.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── Sub-Components ─────────────────────────────────────────────────────────

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

// ── Animated Donut Ring KPI ──────────────────────────────────────────────────
const RING_SIZE = 70; // outer diameter of the SVG canvas
const STROKE = 7; // stroke width
const R = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function KpiChip({ label, value, pct, color, trackColor }) {
  const animVal = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animVal, {
      toValue: pct,
      duration: 1100,
      delay: 200,
      useNativeDriver: false, // strokeDashoffset isn't native-driveable
    }).start();
  }, [pct]);

  // strokeDashoffset: CIRCUMFERENCE = hidden, 0 = fully shown
  const dashOffset = useRef(
    animVal.interpolate({
      inputRange: [0, 1],
      outputRange: [CIRCUMFERENCE, 0],
    }),
  ).current;

  return (
    <View style={styles.kpiChip}>
      {/* Donut ring */}
      <View style={styles.kpiRingWrap}>
        <Svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        >
          <G rotation="-90" origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}>
            {/* Track */}
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R}
              stroke={trackColor}
              strokeWidth={STROKE}
              fill="none"
            />
            {/* Animated arc */}
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
        {/* Center value */}
        <View style={styles.kpiRingCenter}>
          <Text style={[styles.kpiValue, monoText(), { color }]}>{value}</Text>
        </View>
      </View>
      <Text style={[styles.kpiLabel, sansText()]}>{label}</Text>
    </View>
  );
}

// Telegram-style: solid colored square, haptics
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

function AttendanceBar({ day, present, late, absent, maxTotal, index }) {
  const presentAnim = useRef(new Animated.Value(0)).current;
  const lateAnim = useRef(new Animated.Value(0)).current;
  const absentAnim = useRef(new Animated.Value(0)).current;
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const presentH = (present / maxTotal) * 80;
  const lateH = (late / maxTotal) * 80;
  const absentH = (absent / maxTotal) * 80;

  useEffect(() => {
    const baseDelay = index * 120;
    Animated.sequence([
      Animated.delay(baseDelay),
      Animated.stagger(60, [
        Animated.spring(absentAnim, {
          toValue: 1,
          damping: 12,
          stiffness: 180,
          useNativeDriver: true,
        }),
        Animated.spring(lateAnim, {
          toValue: 1,
          damping: 12,
          stiffness: 180,
          useNativeDriver: true,
        }),
        Animated.spring(presentAnim, {
          toValue: 1,
          damping: 12,
          stiffness: 180,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const animSeg = (anim, height, color, style = {}) => (
    <Animated.View
      style={[
        styles.barSegment,
        { height, backgroundColor: color },
        style,
        {
          transform: [{ scaleY: anim }],
          transformOrigin: "bottom", // Expo SDK 50+
        },
      ]}
    />
  );

  return (
    <Pressable
      style={styles.barCol}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setTooltipVisible((v) => !v);
      }}
    >
      {/* Tooltip */}
      {tooltipVisible && (
        <View style={styles.barTooltip}>
          <TooltipRow color={ACCENT} label="Present" value={present} />
          <TooltipRow color={ORANGE} label="Late" value={late} />
          <TooltipRow color={RED} label="Absent" value={absent} />
          <View style={styles.tooltipArrow} />
        </View>
      )}

      <View style={styles.barStack}>
        {animSeg(absentAnim, absentH, RED + "99")}
        {animSeg(lateAnim, lateH, ORANGE + "99")}
        {animSeg(presentAnim, presentH, ACCENT, {
          borderTopLeftRadius: 4,
          borderTopRightRadius: 4,
        })}
      </View>
      <Text style={[styles.barLabel, sansText()]}>{day}</Text>
    </Pressable>
  );
}

function TooltipRow({ color, label, value }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginBottom: 2,
      }}
    >
      <View
        style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: color }}
      />
      <Text style={[{ fontSize: 11, color: MUTED }, sansText()]}>{label}</Text>
      <Text
        style={[
          { fontSize: 11, fontWeight: "700", color: NAVY, marginLeft: "auto" },
          monoText(),
        ]}
      >
        {value}
      </Text>
    </View>
  );
}
function LegendDot({ color, label }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Text style={[styles.legendText, sansText()]}>{label}</Text>
    </View>
  );
}

function LeaveRequestRow({
  name,
  type,
  dates,
  days,
  avatar,
  color,
  onApprove,
  onReject,
}) {
  return (
    <View style={styles.leaveRow}>
      <Image source={{ uri: avatar }} style={styles.leaveAvatar} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[styles.leaveName, sansText()]}>{name}</Text>
        <Text style={[styles.leaveTypeText, sansText(), { color }]}>
          {type}
        </Text>
        <Text style={[styles.leaveDates, sansText()]}>
          {dates} · {days}d
        </Text>
      </View>
      <View style={styles.leaveActions}>
        <Pressable
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            onApprove();
          }}
          style={({ pressed }) => [
            styles.leaveActionCircle,
            { backgroundColor: GREEN + "15" },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="checkmark" size={18} color={GREEN} />
        </Pressable>
        <Pressable
          onPress={() => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            onReject();
          }}
          style={({ pressed }) => [
            styles.leaveActionCircle,
            { backgroundColor: RED + "15" },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="close" size={18} color={RED} />
        </Pressable>
      </View>
    </View>
  );
}

// Telegram-style: solid colored square icon, white icon inside
function ActivityRow({ icon, color, bg, text, sub, time }) {
  return (
    <View style={styles.activityRow}>
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

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },

  // Hero
  heroContainer: {
    overflow: "hidden",
    paddingBottom: 28,
  },
  heroSafe: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
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
  heroDate: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },

  // Notification — Telegram frosted square
  notifBtn: {
    position: "relative",
    alignSelf: "flex-start",
  },
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
  notifBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: RED,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: NAVY,
  },
  notifBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  // Manager avatar
  managerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.25)",
  },
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
  kpiRow: {
    flexDirection: "row",
    gap: 6,
  },
  kpiChip: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
  },
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
    fontSize: 14,
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
    paddingBottom: 16,
    backgroundColor: BG,
  },

  // Section labels
  sectionLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 8,
  },
  sectionLabelLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
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
  sectionSubtitle: {
    fontSize: 11,
    color: MUTED,
    marginTop: 1,
  },
  sectionBadge: {
    backgroundColor: ACCENT + "20",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sectionBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: ACCENT,
  },
  sectionAction: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: "600",
  },

  // Card
  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
    overflow: "hidden",
  },

  // Quick Actions
  quickActionsScroll: {
    gap: 14,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  quickActionBtn: {
    alignItems: "center",
    gap: 7,
    width: 72,
  },
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

  // Attendance chart
  attendanceLegendRow: {
    flexDirection: "row",
    gap: 16,
    padding: 14,
    paddingBottom: 8,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 11,
    color: MUTED,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    paddingHorizontal: 14,
    paddingBottom: 4,
    height: 110,
  },
  barCol: {
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  barStack: {
    width: 28,
    justifyContent: "flex-end",
    alignItems: "center",
    height: 90,
    gap: 1,
  },
  barSegment: {
    width: 28,
    borderRadius: 2,
  },
  barLabel: {
    fontSize: 11,
    color: MUTED,
    fontWeight: "600",
  },
  viewAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    marginTop: 4,
  },
  viewAllText: {
    fontSize: 13,
    color: ACCENT,
    fontWeight: "600",
  },

  // Leave requests
  leaveRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  leaveAvatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: BORDER,
  },
  leaveName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
  },
  leaveTypeText: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 2,
    marginBottom: 2,
  },
  leaveDates: {
    fontSize: 11,
    color: "#94A3B8",
  },
  leaveActions: {
    flexDirection: "row",
    gap: 8,
  },
  leaveActionCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: "center",
    justifyContent: "center",
  },

  // Two-col blocks
  twoColRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 16,
  },
  infoBlock: {
    flex: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
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
  infoBlockStatusText: {
    fontSize: 11,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  infoBlockSub: {
    fontSize: 11,
    color: "rgba(255,255,255,0.6)",
    marginTop: 6,
  },

  // Activity feed
  activityRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  activityIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  activitySub: {
    fontSize: 12,
    color: MUTED,
    marginTop: 1,
  },
  activityTime: {
    fontSize: 11,
    color: "#94A3B8",
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
    marginHorizontal: 14,
  },

  barTooltip: {
    position: "absolute",
    bottom: "100%",
    left: "50%",
    transform: [{ translateX: -52 }],
    width: 120,
    backgroundColor: SURFACE,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 10,
    zIndex: 10,
    marginBottom: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  tooltipArrow: {
    position: "absolute",
    bottom: -5,
    left: "50%",
    marginLeft: -5,
    width: 10,
    height: 10,
    backgroundColor: SURFACE,
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: BORDER,
    transform: [{ rotate: "45deg" }],
  },
});
