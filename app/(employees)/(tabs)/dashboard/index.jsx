// app/(tabs)/employee/dashboard.js
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
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

import {
  EmptyState,
  InsightCard,
  LeaveBalanceBar,
  NotifBadge,
  PayslipModal,
  Toast,
  TrendBadge,
} from "../../../../src/components/DashboardComponents";
import { useDashboard } from "../../../../src/hooks/useDashboard";
import { monoText, sansText, serifText } from "../../../../src/theme/fonts";

// ─── Design Tokens ──────────────────────────────────────────────────────────
const ACCENT = "#0F766E";
const TEAL_MID = "#99F6E4";
const NAVY = "#0F172A";
const NAVY_MID = "#1E293B";
const ORANGE = "#F97316";
const BLUE = "#0A66C2";
const GREEN = "#059669";
const GREEN_LIGHT = "#ECFDF5";
const RED = "#DC2626";
const RED_LIGHT = "#FEF2F2";
const PURPLE = "#7C3AED";
const AMBER = "#F59E0B";
const AMBER_LIGHT = "#FFFBEB";
const BORDER = "#E2E8F0";
const MUTED = "#64748B";
const SURFACE = "#FFFFFF";
const BG = "#F8FAFC";
const { width: SCREEN_W } = Dimensions.get("window");

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
    paid: { color: GREEN, label: "PAID" },
    pending: { color: AMBER, label: "PENDING" },
    approved: { color: BLUE, label: "APPROVED" },
    on_hold: { color: RED, label: "ON HOLD" },
  })[s?.toLowerCase()] ?? { color: MUTED, label: s?.toUpperCase() ?? "—" };

// ─── Blob Rings ──────────────────────────────────────────────────────────────
function BlobRings() {
  const a1 = useRef(new Animated.Value(0)).current;
  const a2 = useRef(new Animated.Value(0)).current;
  const { useEffect } = require("react");
  useEffect(() => {
    const pulse = (a, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(a, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true,
          }),
          Animated.timing(a, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
          }),
        ]),
      ).start();
    pulse(a1, 0);
    pulse(a2, 1500);
  }, []);
  const ring = (a, size, op) => ({
    width: size,
    height: size,
    borderRadius: size / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    position: "absolute",
    right: -size / 2 + 60,
    top: -size / 2 + 60,
    opacity: a.interpolate({ inputRange: [0, 1], outputRange: [op, op * 0.4] }),
    transform: [
      { scale: a.interpolate({ inputRange: [0, 1], outputRange: [1, 1.08] }) },
    ],
  });
  return (
    <>
      <Animated.View style={ring(a1, 180, 0.5)} />
      <Animated.View style={ring(a2, 260, 0.3)} />
      <Animated.View style={ring(a1, 340, 0.15)} />
    </>
  );
}

// ─── KPI Chip ────────────────────────────────────────────────────────────────
const RING_SIZE = 70,
  STROKE = 7;
const R_SVG = (RING_SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R_SVG;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

function KpiChip({ label, value, pct, color }) {
  const { useEffect, useRef } = require("react");
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 1100,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [pct]);
  const dashOffset = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [CIRCUMFERENCE, 0],
  });
  return (
    <View style={s.kpiChip}>
      <View style={s.kpiRingWrap}>
        <Svg
          width={RING_SIZE}
          height={RING_SIZE}
          viewBox={`0 0 ${RING_SIZE} ${RING_SIZE}`}
        >
          <G rotation="-90" origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}>
            <Circle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R_SVG}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={R_SVG}
              stroke={color}
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
            />
          </G>
        </Svg>
        <View style={s.kpiCenter}>
          <Text style={[s.kpiVal, monoText(), { color }]}>{value}</Text>
        </View>
      </View>
      <Text style={[s.kpiLabel, sansText()]}>{label}</Text>
    </View>
  );
}

// ─── Section Label ───────────────────────────────────────────────────────────
function SectionLabel({ title, subtitle, badge, actionLabel, onAction }) {
  return (
    <View style={s.sectionRow}>
      <View style={s.sectionLeft}>
        <View style={s.sectionBar} />
        <Text style={[s.sectionTitle, sansText()]}>{title}</Text>
        {subtitle ? (
          <Text style={[s.sectionSub, sansText()]}>{subtitle}</Text>
        ) : null}
        {badge != null ? (
          <View style={s.sectionBadge}>
            <Text style={[s.sectionBadgeText, monoText()]}>{badge}</Text>
          </View>
        ) : null}
      </View>
      {onAction ? (
        <Pressable
          onPress={onAction}
          style={({ pressed }) => [pressed && { opacity: 0.7 }]}
        >
          <Text style={[s.sectionAction, sansText()]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

// ─── Quick Action ────────────────────────────────────────────────────────────
function QuickAction({
  label,
  iconName,
  color,
  onPress,
  disabled,
  loading: qaLoading,
  badge,
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const onPressIn = () =>
    Animated.spring(scale, { toValue: 0.92, useNativeDriver: true }).start();
  const onPressOut = () =>
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  return (
    <Pressable
      onPress={() => {
        if (!disabled && !qaLoading) {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          onPress?.();
        }
      }}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      style={({ pressed }) => [
        s.qaBtn,
        (disabled || qaLoading) && { opacity: 0.55 },
      ]}
    >
      <Animated.View style={{ transform: [{ scale }] }}>
        <View style={[s.qaIcon, { backgroundColor: color }]}>
          {qaLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Ionicons name={iconName} size={24} color="#FFFFFF" />
          )}
          {badge ? (
            <View style={s.qaBadge}>
              <Text style={s.qaBadgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
      </Animated.View>
      <Text style={[s.qaLabel, sansText()]}>{label}</Text>
    </Pressable>
  );
}

// ─── Count Up ─────────────────────────────────────────────────────────────────
function CountUp({ value, style, suffix = "" }) {
  const { useEffect, useRef, useState } = require("react");
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

// ─── Active Leave Banner ──────────────────────────────────────────────────────
function ActiveLeaveBanner({ activeLeave }) {
  if (!activeLeave?.leave_type) return null;
  return (
    <View style={s.activeLeaveBanner}>
      <View style={[s.activeLeaveIconBox, { backgroundColor: BLUE + "20" }]}>
        <Ionicons name="umbrella-outline" size={18} color={BLUE} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[s.activeLeaveTitle, sansText()]}>
          Currently on {activeLeave.leave_type}
        </Text>
        <Text style={[s.activeLeaveEnd, sansText()]}>
          Returns {fmtShortDate(activeLeave.end_date)}
        </Text>
      </View>
      <View
        style={[
          s.activeLeavePill,
          { backgroundColor: BLUE + "15", borderColor: BLUE + "30" },
        ]}
      >
        <Text style={[s.activeLeavePillText, sansText(), { color: BLUE }]}>
          ACTIVE
        </Text>
      </View>
    </View>
  );
}

// ─── Today Status Card ────────────────────────────────────────────────────────
function TodayStatusCard({ today }) {
  const pct = Math.min((today.hours_worked ?? 0) / 8, 1);
  const arcColor = pct >= 1 ? GREEN : pct > 0.5 ? ACCENT : AMBER;
  const ARC_R = 33,
    ARC_CIRC = 2 * Math.PI * ARC_R;
  return (
    <View style={[s.card, { padding: 16 }]}>
      <View style={s.todayTopRow}>
        <View
          style={[
            s.statusPill,
            {
              backgroundColor: (today.is_on_leave ? BLUE : GREEN) + "15",
              borderColor: (today.is_on_leave ? BLUE : GREEN) + "30",
            },
          ]}
        >
          <Ionicons
            name={today.is_on_leave ? "umbrella-outline" : "checkmark-circle"}
            size={13}
            color={today.is_on_leave ? BLUE : GREEN}
          />
          <Text
            style={[
              s.statusPillText,
              sansText(),
              { color: today.is_on_leave ? BLUE : GREEN },
            ]}
          >
            {today.is_on_leave ? "On Leave" : (today.status ?? "Absent")}
          </Text>
        </View>
        <Text style={[s.statusDateLabel, sansText()]}>Today</Text>
      </View>
      <View style={s.todayBody}>
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
                r={ARC_R}
                stroke={BORDER}
                strokeWidth={7}
                fill="none"
              />
              <Circle
                cx={40}
                cy={40}
                r={ARC_R}
                stroke={arcColor}
                strokeWidth={7}
                fill="none"
                strokeDasharray={ARC_CIRC}
                strokeDashoffset={ARC_CIRC * (1 - pct)}
                strokeLinecap="round"
              />
            </G>
          </Svg>
          <View style={{ position: "absolute", alignItems: "center" }}>
            <Text
              style={[
                { fontSize: 15, fontWeight: "700", color: arcColor },
                monoText(),
              ]}
            >
              {(today.hours_worked ?? 0).toFixed(1)}
            </Text>
            <Text style={[{ fontSize: 9, color: MUTED }, sansText()]}>hrs</Text>
          </View>
        </View>
        <View style={{ flex: 1, gap: 10 }}>
          <View style={s.timingRow}>
            <View style={[s.timingDot, { backgroundColor: GREEN_LIGHT }]}>
              <Ionicons name="enter-outline" size={12} color={GREEN} />
            </View>
            <View>
              <Text style={[s.timingLabel, sansText()]}>Clock in</Text>
              <Text style={[s.timingValue, monoText()]}>
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
          <View style={s.timingRow}>
            <View style={[s.timingDot, { backgroundColor: RED_LIGHT }]}>
              <Ionicons name="exit-outline" size={12} color={RED} />
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
      <View
        style={{
          marginTop: 14,
          paddingTop: 14,
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: BORDER,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 6,
          }}
        >
          <Text style={[{ fontSize: 11, color: MUTED }, sansText()]}>
            Daily progress
          </Text>
          <Text
            style={[
              { fontSize: 11, fontWeight: "700", color: arcColor },
              monoText(),
            ]}
          >
            {(today.hours_worked ?? 0).toFixed(1)} / 8 hrs
          </Text>
        </View>
        <View
          style={{
            height: 6,
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

// ─── Attendance Chart ─────────────────────────────────────────────────────────
function AttendanceChart({ attendance }) {
  const chartData = [
    { x: "Present", y: attendance.days_present ?? 0, fill: ACCENT },
    { x: "Absent", y: attendance.days_absent ?? 0, fill: RED },
    { x: "Late", y: attendance.days_late ?? 0, fill: AMBER },
    { x: "Leave", y: attendance.days_on_leave ?? 0, fill: BLUE },
  ];
  return (
    <View style={s.card}>
      <View style={s.chartHeaderRow}>
        <View style={s.chartLegendRow}>
          {chartData.map((d) => (
            <View key={d.x} style={s.legendItem}>
              <View style={[s.legendDot, { backgroundColor: d.fill }]} />
              <Text style={[s.legendText, sansText()]}>{d.x}</Text>
            </View>
          ))}
        </View>
        <TrendBadge
          current={attendance.attendance_rate ?? 0}
          previous={attendance.last_month_rate ?? 0}
        />
      </View>
      <VictoryChart
        width={SCREEN_W - 64}
        height={175}
        domainPadding={{ x: 30, y: 10 }}
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
      <View style={s.chartFooter}>
        <Ionicons name="hourglass-outline" size={14} color={ACCENT} />
        <Text style={[s.chartFooterText, sansText()]}>
          <Text style={[{ fontWeight: "700", color: NAVY }, monoText()]}>
            {attendance.total_hours_worked ?? 0} hrs{" "}
          </Text>
          total worked this month
        </Text>
      </View>
    </View>
  );
}

// ─── Stat Row ─────────────────────────────────────────────────────────────────
function StatRow({ icon, iconColor, iconBg, label, value, last }) {
  return (
    <View
      style={[
        s.statRow,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: BORDER,
        },
      ]}
    >
      <View style={[s.statIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={14} color={iconColor} />
      </View>
      <Text style={[s.statLabel, sansText()]}>{label}</Text>
      <Text style={[s.statValue, monoText()]}>{value}</Text>
    </View>
  );
}

// ─── Leave Row ────────────────────────────────────────────────────────────────
function LeaveRow({ item, last }) {
  const { color, bg } = leaveMeta(item.status);
  return (
    <View
      style={[
        s.leaveRow,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: BORDER,
        },
      ]}
    >
      <View style={[s.leaveIconBox, { backgroundColor: bg }]}>
        <Ionicons name="calendar-outline" size={14} color={color} />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[s.leaveName, sansText()]}>{item.leave_type}</Text>
        <Text style={[s.leaveDates, sansText()]}>
          {fmtShortDate(item.start_date)} – {fmtShortDate(item.end_date)}
        </Text>
      </View>
      <View style={[s.leavePill, { backgroundColor: bg }]}>
        <Text style={[s.leavePillText, sansText(), { color }]}>
          {item.status}
        </Text>
      </View>
    </View>
  );
}

// ─── Activity Row ─────────────────────────────────────────────────────────────
function ActivityRow({ icon, color, text, sub, time, last }) {
  return (
    <View
      style={[
        s.activityRow,
        !last && {
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: BORDER,
        },
      ]}
    >
      <View style={[s.activityIcon, { backgroundColor: color }]}>
        <Ionicons name={icon} size={17} color="#FFFFFF" />
      </View>
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={[s.activityText, sansText()]}>{text}</Text>
        <Text style={[s.activitySub, sansText()]}>{sub}</Text>
      </View>
      <Text style={[s.activityTime, sansText()]}>{time}</Text>
    </View>
  );
}

// ─── Payroll Card ─────────────────────────────────────────────────────────────
function PayrollCard({ payroll, onPress, onViewPayslip }) {
  const pm = payMeta(payroll?.latest_pay_status);
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [s.payrollCard, pressed && { opacity: 0.92 }]}
    >
      <LinearGradient
        colors={["#0C1628", "#142240", "#0F2030"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={s.payrollGradient}
      >
        <View style={s.payBlob1} />
        <View style={s.payBlob2} />
        <View style={s.payRow1}>
          <View style={s.payIconBox}>
            <Ionicons name="cash-outline" size={22} color={TEAL_MID} />
          </View>
          <View
            style={[
              s.payStatusPill,
              {
                backgroundColor: pm.color + "25",
                borderColor: pm.color + "50",
              },
            ]}
          >
            <View
              style={{
                width: 7,
                height: 7,
                borderRadius: 4,
                backgroundColor: pm.color,
              }}
            />
            <Text style={[s.payStatusText, sansText(), { color: pm.color }]}>
              {pm.label}
            </Text>
          </View>
        </View>
        <View style={s.payRow2}>
          <Text style={[s.payMicroLabel, sansText()]}>NET PAY</Text>
          <Text style={[s.payAmount, monoText()]}>
            {fmtCurrency(payroll?.latest_net_pay)}
          </Text>
        </View>
        <View style={s.payDivider} />
        <View style={s.payRow3}>
          <View style={{ flex: 1 }}>
            <Text style={[s.payMetaLabel, sansText()]}>Pay Period</Text>
            <Text style={[s.payMetaValue, sansText()]}>
              {payroll?.latest_pay_period ?? "—"}
            </Text>
          </View>
          <View style={s.payMetaSep} />
          <View style={{ flex: 1, alignItems: "flex-end" }}>
            <Text style={[s.payMetaLabel, sansText()]}>Pay Date</Text>
            <Text style={[s.payMetaValue, sansText()]}>
              {payroll?.latest_pay_date ?? "—"}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", gap: 10 }}>
          <Pressable
            onPress={onViewPayslip}
            style={({ pressed }) => [
              s.payCtaRow,
              { flex: 1 },
              pressed && { opacity: 0.8 },
            ]}
          >
            <Ionicons name="document-text-outline" size={16} color={TEAL_MID} />
            <Text style={[s.payCtaText, sansText()]}>View Payslip</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [s.payCtaRow, pressed && { opacity: 0.8 }]}
          >
            <Ionicons name="download-outline" size={16} color={TEAL_MID} />
          </Pressable>
        </View>
      </LinearGradient>
    </Pressable>
  );
}

// ─── MAIN SCREEN ─────────────────────────────────────────────────────────────
export default function EmployeeDashboard() {
  const router = useRouter();
  const {
    data,
    loading,
    refreshing,
    onRefresh,
    sectionErrors,
    clockLoading,
    handleClock,
    toast,
    insights,
    notifications,
    unreadCount,
  } = useDashboard();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const [payslipVisible, setPayslipVisible] = useState(false);

  const { useEffect } = require("react");
  useEffect(() => {
    if (!loading && data) {
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
    }
  }, [loading, data]);

  if (loading) {
    return (
      <LinearGradient colors={[NAVY, NAVY_MID, "#243044"]} style={s.loadScreen}>
        <ActivityIndicator color={TEAL_MID} size="large" />
        <Text style={[s.loadText, sansText()]}>Loading your workspace…</Text>
      </LinearGradient>
    );
  }

  if (sectionErrors.dashboard && !data) {
    return (
      <View style={[s.loadScreen, { backgroundColor: BG }]}>
        <Ionicons name="wifi-outline" size={44} color={MUTED} />
        <Text
          style={[
            { color: MUTED, fontSize: 15, marginTop: 14, textAlign: "center" },
            sansText(),
          ]}
        >
          {sectionErrors.dashboard}
        </Text>
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
  const isClockedIn = today.is_clocked_in ?? false;
  const initials = (user.name ?? "—")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const kpiChips = [
    {
      label: "Present\nDays",
      value: String(attendance.days_present ?? 0),
      pct: (attendance.days_present ?? 0) / 22,
      color: GREEN,
    },
    {
      label: "Late\nDays",
      value: String(attendance.days_late ?? 0),
      pct: (attendance.days_late ?? 0) / 22,
      color: AMBER,
    },
    {
      label: "On\nLeave",
      value: String(attendance.days_on_leave ?? 0),
      pct: (attendance.days_on_leave ?? 0) / 22,
      color: BLUE,
    },
    {
      label: "Attend.\nRate",
      value: `${rate}%`,
      pct: rate / 100,
      color: rateColor,
    },
  ];

  const activityFeed = [
    today.check_in && {
      id: "ci",
      icon: "enter-outline",
      color: GREEN,
      text: "Clocked in",
      sub: `Today at ${fmtTime(today.check_in)}`,
      time: "Today",
    },
    ...(leave.recent ?? []).map((l) => ({
      id: "l" + l.id,
      icon: "calendar-outline",
      color: BLUE,
      text: l.leave_type + " request",
      sub: `${fmtShortDate(l.start_date)} – ${fmtShortDate(l.end_date)}`,
      time: l.status,
    })),
    payroll.latest_pay_period && {
      id: "pay",
      icon: "cash-outline",
      color: PURPLE,
      text: "Payslip available",
      sub: payroll.latest_pay_period,
      time: pm.label,
    },
  ].filter(Boolean);

  return (
    <LinearGradient
      colors={[NAVY, NAVY_MID, "#243044"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 0.6 }}
      style={s.screen}
    >
      {/* Toast */}
      <Toast toast={toast} />

      {/* Payslip Modal */}
      <PayslipModal
        visible={payslipVisible}
        onClose={() => setPayslipVisible(false)}
        payroll={payroll}
        fmtCurrency={fmtCurrency}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
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
        <View style={s.heroContainer}>
          <BlobRings />
          <SafeAreaView edges={["top"]} style={s.heroSafe}>
            <View style={s.heroTopRow}>
              <View style={{ flex: 1 }}>
                <View style={s.roleBadge}>
                  <Text style={[s.roleBadgeText, sansText()]}>EMPLOYEE</Text>
                </View>
                <Text style={[s.greetingText, sansText()]}>{greeting()},</Text>
                <Text style={[s.heroName, serifText()]}>
                  {user.name ?? "Employee"}
                </Text>
                {user.department?.name ? (
                  <View style={s.deptChip}>
                    <Ionicons
                      name="business-outline"
                      size={10}
                      color="rgba(255,255,255,0.5)"
                    />
                    <Text style={[s.deptChipText, sansText()]}>
                      {user.department.name}
                    </Text>
                    {user.employee_id ? (
                      <>
                        <View style={s.deptSep} />
                        <Text style={[s.deptChipText, monoText()]}>
                          {user.employee_id}
                        </Text>
                      </>
                    ) : null}
                  </View>
                ) : null}
                <Text style={[s.heroDate, sansText()]}>{fmtDate()}</Text>
              </View>
              <View style={s.heroActions}>
                <Pressable
                  onPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    router.push("/notifications");
                  }}
                  style={({ pressed }) => [
                    s.notifBtn,
                    pressed && { opacity: 0.7 },
                  ]}
                >
                  <View style={s.notifIconWrap}>
                    <Ionicons
                      name="notifications-outline"
                      size={21}
                      color="#FFFFFF"
                    />
                    <NotifBadge count={unreadCount} />
                  </View>
                </Pressable>
                <Pressable
                  onPress={() => router.push("/profile")}
                  style={({ pressed }) => [pressed && { opacity: 0.8 }]}
                >
                  <View style={s.heroAvatar}>
                    <Text style={[s.heroAvatarText, monoText()]}>
                      {initials}
                    </Text>
                  </View>
                  <View style={s.onlineDot} />
                </Pressable>
              </View>
            </View>
            <Animated.View
              style={[
                s.kpiRow,
                { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
              ]}
            >
              {kpiChips.map((k, i) => (
                <KpiChip key={i} {...k} />
              ))}
            </Animated.View>
          </SafeAreaView>
        </View>

        {/* ══ SHEET ════════════════════════════════════════════════════════ */}
        <Animated.View
          style={[
            s.sheet,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <ActiveLeaveBanner activeLeave={leave.active_leave} />

          {/* Quick Actions */}
          <SectionLabel title="Quick Actions" />
          <ScrollView
            horizontal
            nestedScrollEnabled
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={86}
            contentContainerStyle={s.qaScroll}
            style={{ marginBottom: 20, marginHorizontal: -16 }}
          >
            <View style={{ width: 16 }} />
            <QuickAction
              label={isClockedIn ? "Clock Out" : "Clock In"}
              iconName={isClockedIn ? "exit-outline" : "finger-print"}
              color={isClockedIn ? RED : ACCENT}
              onPress={handleClock}
              loading={clockLoading}
              disabled={clockLoading}
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
              label="Notices"
              iconName="megaphone"
              color={ORANGE}
              onPress={() => router.push("/announcements")}
              badge={unreadCount > 0 ? unreadCount : null}
            />
            <View style={{ width: 8 }} />
          </ScrollView>

          {/* Today's Status */}
          <SectionLabel title="Today's Status" subtitle={fmtDate()} />
          <TodayStatusCard today={today} />

          {/* Insights */}
          {insights.length > 0 && (
            <>
              <SectionLabel title="Smart Insights" />
              <View style={s.card}>
                {insights.map((ins, i) => (
                  <InsightCard
                    key={i}
                    {...ins}
                    index={i}
                    last={i === insights.length - 1}
                  />
                ))}
              </View>
            </>
          )}

          {/* Attendance Summary */}
          <SectionLabel
            title="Attendance Summary"
            subtitle="Last 30 days"
            actionLabel="Full history"
            onAction={() => router.push("/attendance")}
          />
          <AttendanceChart attendance={attendance} />

          {/* Attendance Rate */}
          <SectionLabel title="Attendance Rate" />
          <Pressable
            onPress={() => router.push("/attendance")}
            style={({ pressed }) => [
              s.card,
              s.rateCard,
              pressed && { opacity: 0.92 },
            ]}
          >
            <View style={{ flex: 1 }}>
              <Text style={[s.rateCaption, sansText()]}>
                Overall this month
              </Text>
              <CountUp
                value={rate}
                style={[s.rateValue, monoText(), { color: rateColor }]}
                suffix="%"
              />
              <TrendBadge
                current={rate}
                previous={attendance.last_month_rate ?? 0}
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
              <Text
                style={[
                  { fontSize: 12, color: MUTED, marginTop: 6 },
                  sansText(),
                ]}
              >
                {rate >= 80
                  ? "Excellent — keep it up 🎉"
                  : rate >= 60
                    ? "Room for improvement"
                    : "Needs attention — contact HR"}
              </Text>
            </View>
            <View style={[s.rateArrow, { backgroundColor: ACCENT + "20" }]}>
              <Ionicons name="chevron-forward" size={15} color={ACCENT} />
            </View>
          </Pressable>

          <View style={[s.card, { marginTop: -8 }]}>
            <StatRow
              icon="checkmark-circle-outline"
              iconColor={GREEN}
              iconBg={GREEN_LIGHT}
              label="Days present"
              value={`${attendance.days_present ?? 0} days`}
            />
            <StatRow
              icon="close-circle-outline"
              iconColor={RED}
              iconBg={RED_LIGHT}
              label="Days absent"
              value={`${attendance.days_absent ?? 0} days`}
            />
            <StatRow
              icon="time-outline"
              iconColor={AMBER}
              iconBg={AMBER_LIGHT}
              label="Late arrivals"
              value={`${attendance.days_late ?? 0} days`}
            />
            <StatRow
              icon="hourglass-outline"
              iconColor={ACCENT}
              iconBg={GREEN_LIGHT}
              label="Hours worked"
              value={`${attendance.total_hours_worked ?? 0} hrs`}
              last
            />
          </View>

          {/* Leave Overview */}
          <SectionLabel
            title="Leave Overview"
            badge={leave.pending}
            actionLabel="See all"
            onAction={() => router.push("/leave")}
          />
          <LeaveBalanceBar used={leave.used_days} total={leave.total_days} />
          <View style={s.twoCol}>
            <Pressable
              onPress={() => router.push("/leave/apply")}
              style={({ pressed }) => [
                s.infoBlock,
                pressed && { opacity: 0.9 },
              ]}
            >
              <LinearGradient
                colors={["#0F172A", "#1E293B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.infoGradient}
              >
                <Ionicons name="calendar-outline" size={22} color="#fff" />
                <Text style={[s.infoLabel, sansText()]}>Pending</Text>
                <Text style={[s.infoValue, monoText()]}>
                  {leave.pending ?? 0}
                </Text>
                <View style={[s.infoPill, { backgroundColor: AMBER + "30" }]}>
                  <Text style={[s.infoPillText, sansText(), { color: AMBER }]}>
                    Awaiting review
                  </Text>
                </View>
                <Text style={[s.infoSub, sansText()]}>
                  Tap to request leave
                </Text>
              </LinearGradient>
            </Pressable>
            <Pressable
              onPress={() => router.push("/leave")}
              style={({ pressed }) => [
                s.infoBlock,
                pressed && { opacity: 0.9 },
              ]}
            >
              <LinearGradient
                colors={["#0F172A", "#1E293B"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={s.infoGradient}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={22}
                  color="#fff"
                />
                <Text style={[s.infoLabel, sansText()]}>Approved</Text>
                <Text style={[s.infoValue, monoText()]}>
                  {leave.approved ?? 0}
                </Text>
                <View style={[s.infoPill, { backgroundColor: GREEN + "30" }]}>
                  <Text style={[s.infoPillText, sansText(), { color: GREEN }]}>
                    ✓ Confirmed
                  </Text>
                </View>
                <Text style={[s.infoSub, sansText()]}>View leave history</Text>
              </LinearGradient>
            </Pressable>
          </View>

          {/* Recent Leave Requests */}
          <SectionLabel title="Recent Requests" />
          <View style={s.card}>
            {(leave.recent?.length ?? 0) === 0 ? (
              <EmptyState
                icon="calendar-outline"
                title="No leave requests yet"
                subtitle="Your leave history will appear here"
              />
            ) : (
              leave.recent.map((item, i) => (
                <LeaveRow
                  key={item.id ?? i}
                  item={item}
                  last={i === leave.recent.length - 1}
                />
              ))
            )}
          </View>

          {/* Payroll */}
          <SectionLabel
            title="Latest Payroll"
            actionLabel="All payslips"
            onAction={() => router.push("/payslips")}
          />
          {payroll.latest_net_pay == null ? (
            <View style={s.card}>
              <EmptyState
                icon="cash-outline"
                title="No payroll data available"
                subtitle="Your payslip will appear here once processed"
              />
            </View>
          ) : (
            <PayrollCard
              payroll={payroll}
              onPress={() => router.push("/payslips")}
              onViewPayslip={() => setPayslipVisible(true)}
            />
          )}

          {/* Activity Feed */}
          <SectionLabel title="Recent Activity" />
          <View style={s.card}>
            {activityFeed.length === 0 ? (
              <EmptyState
                icon="pulse-outline"
                title="No recent activity"
                subtitle="Your actions will appear here"
              />
            ) : (
              activityFeed.map((item, i) => (
                <ActivityRow
                  key={item.id}
                  {...item}
                  last={i === activityFeed.length - 1}
                />
              ))
            )}
          </View>

          {/* Profile */}
          <SectionLabel title="My Profile" />
          <Pressable
            onPress={() => router.push("/profile")}
            style={({ pressed }) => [
              s.profileRow,
              pressed && { opacity: 0.92 },
            ]}
          >
            <View style={s.profileAvatar}>
              <Text style={[s.profileAvatarText, monoText()]}>{initials}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={[s.profileName, sansText()]}>
                {user.name ?? "—"}
              </Text>
              <Text style={[s.profileMeta, sansText()]}>
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
        </Animated.View>
      </ScrollView>
    </LinearGradient>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen: { flex: 1 },
  scrollContent: { flexGrow: 1, paddingBottom: 80 },
  loadScreen: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadText: { color: "rgba(255,255,255,0.5)", fontSize: 13 },
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
    marginBottom: 6,
  },
  deptChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: "flex-start",
    marginBottom: 6,
  },
  deptChipText: {
    fontSize: 10,
    color: "rgba(255,255,255,0.55)",
    fontWeight: "600",
    letterSpacing: 0.4,
  },
  deptSep: { width: 1, height: 10, backgroundColor: "rgba(255,255,255,0.2)" },
  heroDate: { fontSize: 12, color: "rgba(255,255,255,0.4)" },
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
  kpiRow: { flexDirection: "row", gap: 6 },
  kpiChip: { flex: 1, paddingVertical: 8, alignItems: "center" },
  kpiRingWrap: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  kpiCenter: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  kpiVal: {
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
  sheet: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 0,
    backgroundColor: BG,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
    marginTop: 8,
  },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionBar: {
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
  sectionSub: { fontSize: 11, color: MUTED },
  sectionBadge: {
    backgroundColor: ACCENT + "20",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  sectionBadgeText: { fontSize: 11, fontWeight: "700", color: ACCENT },
  sectionAction: { fontSize: 13, color: ACCENT, fontWeight: "600" },
  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
    overflow: "hidden",
  },
  activeLeaveBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: BLUE + "10",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BLUE + "25",
    padding: 14,
    marginBottom: 8,
  },
  activeLeaveIconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeLeaveTitle: { fontSize: 14, fontWeight: "700", color: NAVY },
  activeLeaveEnd: { fontSize: 12, color: MUTED, marginTop: 2 },
  activeLeavePill: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  activeLeavePillText: { fontSize: 10, fontWeight: "700", letterSpacing: 0.5 },
  qaScroll: { gap: 14, flexDirection: "row", alignItems: "flex-start" },
  qaBtn: { alignItems: "center", gap: 7, width: 72 },
  qaIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  qaLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#334155",
    textAlign: "center",
  },
  qaBadge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: RED,
    borderRadius: 9,
    minWidth: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  qaBadgeText: { fontSize: 9, fontWeight: "700", color: "#fff" },
  todayTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
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
  statusDateLabel: { fontSize: 11, color: MUTED, fontWeight: "600" },
  todayBody: { flexDirection: "row", alignItems: "center", gap: 20 },
  timingRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  timingDot: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  timingLabel: { fontSize: 10, color: MUTED, marginBottom: 1 },
  timingValue: { fontSize: 14, fontWeight: "700", color: NAVY },
  chartHeaderRow: {
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 4,
    gap: 8,
  },
  chartLegendRow: { flexDirection: "row", gap: 16 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  legendDot: { width: 8, height: 8, borderRadius: 4 },
  legendText: { fontSize: 11, color: MUTED },
  chartFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: BORDER,
  },
  chartFooterText: { fontSize: 12, color: MUTED },
  statRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statLabel: { flex: 1, fontSize: 13, color: MUTED },
  statValue: { fontSize: 14, fontWeight: "700", color: NAVY },
  rateCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginBottom: 8,
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
  rateTrack: {
    height: 6,
    backgroundColor: BORDER,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 8,
  },
  rateFill: { height: "100%", borderRadius: 3 },
  rateArrow: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 12,
  },
  twoCol: { flexDirection: "row", gap: 10, marginBottom: 16 },
  infoBlock: { flex: 1, borderRadius: 16, overflow: "hidden" },
  infoGradient: {
    padding: 16,
    minHeight: 168,
    justifyContent: "space-between",
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginTop: 10,
  },
  infoValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 2,
  },
  infoPill: {
    alignSelf: "flex-start",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginTop: 6,
  },
  infoPillText: { fontSize: 11, fontWeight: "600" },
  infoSub: { fontSize: 11, color: "rgba(255,255,255,0.5)", marginTop: 4 },
  leaveRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  leaveIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  leaveName: { fontSize: 13, fontWeight: "700", color: NAVY },
  leaveDates: { fontSize: 11, color: MUTED, marginTop: 2 },
  leavePill: { borderRadius: 6, paddingHorizontal: 7, paddingVertical: 3 },
  leavePillText: { fontSize: 10, fontWeight: "700" },
  payrollCard: { borderRadius: 18, overflow: "hidden", marginBottom: 16 },
  payrollGradient: { padding: 24 },
  payBlob1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: ACCENT + "0C",
    top: -70,
    right: -50,
  },
  payBlob2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: PURPLE + "0A",
    bottom: -30,
    right: 80,
  },
  payRow1: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  payIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  payStatusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  payStatusText: { fontSize: 12, fontWeight: "700", letterSpacing: 0.4 },
  payRow2: { marginBottom: 20 },
  payMicroLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  payAmount: {
    fontSize: 34,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.5,
  },
  payDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "rgba(255,255,255,0.10)",
    marginBottom: 20,
  },
  payRow3: { flexDirection: "row", alignItems: "center", marginBottom: 22 },
  payMetaSep: {
    width: StyleSheet.hairlineWidth,
    height: 34,
    backgroundColor: "rgba(255,255,255,0.12)",
    marginHorizontal: 16,
  },
  payMetaLabel: {
    fontSize: 10,
    color: "rgba(255,255,255,0.35)",
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 5,
  },
  payMetaValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "rgba(255,255,255,0.85)",
  },
  payCtaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.07)",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.10)",
  },
  payCtaText: { fontSize: 13, color: TEAL_MID, fontWeight: "600" },
  activityRow: { flexDirection: "row", alignItems: "center", padding: 14 },
  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  activityText: { fontSize: 14, fontWeight: "600", color: NAVY },
  activitySub: { fontSize: 12, color: MUTED, marginTop: 1 },
  activityTime: { fontSize: 11, color: "#94A3B8" },
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
  profileName: { fontSize: 15, fontWeight: "700", color: NAVY },
  profileMeta: { fontSize: 12, color: MUTED, marginTop: 2 },
});
