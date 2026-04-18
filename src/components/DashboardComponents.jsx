// src/components/DashboardComponents.js
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, StyleSheet, Text, View } from "react-native";

const ACCENT = "#0F766E";
const NAVY = "#0F172A";
const BORDER = "#E2E8F0";
const MUTED = "#64748B";
const GREEN = "#059669";
const RED = "#DC2626";
const BG = "#F8FAFC";
const SURFACE = "#FFFFFF";

// ─── Skeleton Loader ────────────────────────────────────────────────────────
export function SkeletonBlock({
  width = "100%",
  height = 16,
  radius = 8,
  style,
}) {
  const anim = useRef(new Animated.Value(0.4)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0.4,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);
  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius: radius,
          backgroundColor: "#E2E8F0",
          opacity: anim,
        },
        style,
      ]}
    />
  );
}

export function SkeletonCard() {
  return (
    <View style={[sk.card, { padding: 16, gap: 12 }]}>
      <SkeletonBlock height={14} width="40%" />
      <SkeletonBlock height={28} width="60%" />
      <SkeletonBlock height={10} width="80%" />
      <SkeletonBlock height={10} width="55%" />
    </View>
  );
}

// ─── Toast ──────────────────────────────────────────────────────────────────
export function Toast({ toast }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (toast) {
      Animated.spring(anim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
    } else {
      Animated.timing(anim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [toast]);
  if (!toast) return null;
  const isError = toast.type === "error";
  return (
    <Animated.View
      style={[
        sk.toast,
        {
          backgroundColor: isError ? "#FEF2F2" : "#ECFDF5",
          borderColor: isError ? "#FCA5A5" : "#6EE7B7",
        },
        {
          opacity: anim,
          transform: [
            {
              scale: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.9, 1],
              }),
            },
          ],
        },
      ]}
    >
      <Ionicons
        name={isError ? "alert-circle" : "checkmark-circle"}
        size={18}
        color={isError ? RED : GREEN}
      />
      <Text style={[sk.toastText, { color: isError ? RED : "#065F46" }]}>
        {toast.message}
      </Text>
    </Animated.View>
  );
}

// ─── Empty State ─────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }) {
  return (
    <View style={sk.emptyWrap}>
      <View style={sk.emptyIconBox}>
        <Ionicons name={icon} size={28} color={MUTED} />
      </View>
      <Text style={sk.emptyTitle}>{title}</Text>
      {subtitle ? <Text style={sk.emptySub}>{subtitle}</Text> : null}
    </View>
  );
}

// ─── Section Error ────────────────────────────────────────────────────────────
export function SectionError({ message, onRetry }) {
  return (
    <View style={sk.errorWrap}>
      <Ionicons name="cloud-offline-outline" size={22} color={MUTED} />
      <Text style={sk.errorText}>
        {message ?? "Failed to load this section"}
      </Text>
      {onRetry && (
        <Text onPress={onRetry} style={sk.errorRetry}>
          Retry
        </Text>
      )}
    </View>
  );
}

// ─── Notification Badge ───────────────────────────────────────────────────────
export function NotifBadge({ count }) {
  if (!count) return null;
  return (
    <View style={sk.badge}>
      <Text style={sk.badgeText}>{count > 9 ? "9+" : count}</Text>
    </View>
  );
}

// ─── Insight Card ─────────────────────────────────────────────────────────────
export function InsightCard({ icon, color, text, index }) {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 400,
      delay: index * 120,
      useNativeDriver: true,
    }).start();
  }, []);
  return (
    <Animated.View
      style={[
        sk.insightCard,
        {
          opacity: anim,
          transform: [
            {
              translateX: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [-16, 0],
              }),
            },
          ],
        },
      ]}
    >
      <View style={[sk.insightIconBox, { backgroundColor: color + "18" }]}>
        <Ionicons name={icon} size={16} color={color} />
      </View>
      <Text style={sk.insightText}>{text}</Text>
    </Animated.View>
  );
}

// ─── Leave Balance Bar ────────────────────────────────────────────────────────
export function LeaveBalanceBar({ used, total }) {
  const pct = Math.min((used ?? 0) / (total ?? 20), 1);
  const barColor = pct >= 0.9 ? RED : pct >= 0.6 ? "#F59E0B" : ACCENT;
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 900,
      delay: 200,
      useNativeDriver: false,
    }).start();
  }, [pct]);
  const w = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });
  return (
    <View style={sk.leaveBalCard}>
      <View style={sk.leaveBalRow}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Ionicons name="calendar-number-outline" size={14} color={ACCENT} />
          <Text style={sk.leaveBalLabel}>Leave Balance</Text>
        </View>
        <Text style={[sk.leaveBalNum, { color: barColor }]}>
          {used} / {total} days used
        </Text>
      </View>
      <View style={sk.leaveTrack}>
        <Animated.View
          style={[sk.leaveFill, { width: w, backgroundColor: barColor }]}
        />
      </View>
      <Text style={sk.leaveBalSub}>{total - used} days remaining</Text>
    </View>
  );
}

// ─── Attendance Trend Badge ────────────────────────────────────────────────────
export function TrendBadge({ current, previous, suffix = "%" }) {
  const diff = current - previous;
  if (diff === 0) return null;
  const up = diff > 0;
  return (
    <View
      style={[sk.trendBadge, { backgroundColor: (up ? GREEN : RED) + "15" }]}
    >
      <Ionicons
        name={up ? "arrow-up" : "arrow-down"}
        size={11}
        color={up ? GREEN : RED}
      />
      <Text style={[sk.trendText, { color: up ? GREEN : RED }]}>
        {Math.abs(diff)}
        {suffix} vs last month
      </Text>
    </View>
  );
}

// ─── Payslip Modal ─────────────────────────────────────────────────────────────
import { Modal, Pressable } from "react-native";

export function PayslipModal({ visible, onClose, payroll, fmtCurrency }) {
  const slideAnim = useRef(new Animated.Value(300)).current;
  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: visible ? 0 : 300,
      useNativeDriver: true,
      tension: 80,
      friction: 12,
    }).start();
  }, [visible]);

  const rows = [
    {
      label: "Basic Salary",
      value: fmtCurrency(payroll?.basic_salary),
      color: "#059669",
    },
    { label: "Tax", value: `- ${fmtCurrency(payroll?.tax)}`, color: "#DC2626" },
    {
      label: "Deductions",
      value: `- ${fmtCurrency(payroll?.deductions)}`,
      color: "#DC2626",
    },
    {
      label: "Net Pay",
      value: fmtCurrency(payroll?.latest_net_pay),
      color: NAVY,
      bold: true,
    },
  ];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <Pressable style={sk.modalBackdrop} onPress={onClose}>
        <Animated.View
          style={[sk.modalSheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <Pressable>
            <View style={sk.modalHandle} />
            <Text style={sk.modalTitle}>
              Payslip — {payroll?.latest_pay_period ?? "—"}
            </Text>
            <Text style={sk.modalSub}>
              Pay Date: {payroll?.latest_pay_date ?? "—"}
            </Text>
            <View style={sk.modalDivider} />
            {rows.map((r) => (
              <View key={r.label} style={sk.modalRow}>
                <Text
                  style={[
                    sk.modalRowLabel,
                    r.bold && { fontWeight: "700", color: NAVY },
                  ]}
                >
                  {r.label}
                </Text>
                <Text
                  style={[
                    sk.modalRowValue,
                    { color: r.color },
                    r.bold && { fontWeight: "700", fontSize: 17 },
                  ]}
                >
                  {r.value}
                </Text>
              </View>
            ))}
            <View style={sk.modalDivider} />
            <Pressable
              style={({ pressed }) => [
                sk.downloadBtn,
                pressed && { opacity: 0.8 },
              ]}
              onPress={() => {}}
            >
              <Ionicons name="download-outline" size={16} color="#fff" />
              <Text style={sk.downloadText}>Download Payslip (PDF)</Text>
            </Pressable>
            <Pressable onPress={onClose} style={sk.closeBtn}>
              <Text style={sk.closeBtnText}>Close</Text>
            </Pressable>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  );
}

const sk = StyleSheet.create({
  card: {
    backgroundColor: SURFACE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 16,
  },
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  toastText: { flex: 1, fontSize: 13, fontWeight: "600" },
  emptyWrap: {
    alignItems: "center",
    paddingVertical: 28,
    paddingHorizontal: 20,
  },
  emptyIconBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BG,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  emptyTitle: { fontSize: 14, fontWeight: "700", color: NAVY, marginBottom: 4 },
  emptySub: { fontSize: 12, color: MUTED, textAlign: "center" },
  errorWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    marginBottom: 16,
  },
  errorText: { flex: 1, fontSize: 12, color: "#B91C1C" },
  errorRetry: { fontSize: 12, fontWeight: "700", color: ACCENT },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: RED,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
  },
  badgeText: { fontSize: 10, fontWeight: "700", color: "#fff" },
  insightCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },
  insightIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  insightText: { flex: 1, fontSize: 13, color: NAVY, lineHeight: 19 },
  leaveBalCard: {
    backgroundColor: SURFACE,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: BORDER,
    padding: 14,
    marginBottom: 16,
  },
  leaveBalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  leaveBalLabel: { fontSize: 13, fontWeight: "600", color: NAVY },
  leaveBalNum: { fontSize: 12, fontWeight: "700" },
  leaveTrack: {
    height: 8,
    backgroundColor: BORDER,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 6,
  },
  leaveFill: { height: "100%", borderRadius: 4 },
  leaveBalSub: { fontSize: 11, color: MUTED },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 3,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  trendText: { fontSize: 11, fontWeight: "600" },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: SURFACE,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: BORDER,
    alignSelf: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: "700", color: NAVY, marginBottom: 4 },
  modalSub: { fontSize: 12, color: MUTED, marginBottom: 16 },
  modalDivider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: BORDER,
    marginVertical: 12,
  },
  modalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  modalRowLabel: { fontSize: 14, color: MUTED },
  modalRowValue: { fontSize: 14, fontWeight: "600" },
  downloadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: ACCENT,
    borderRadius: 12,
    padding: 14,
    justifyContent: "center",
    marginTop: 16,
  },
  downloadText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  closeBtn: { padding: 14, alignItems: "center", marginTop: 8 },
  closeBtnText: { fontSize: 14, color: MUTED, fontWeight: "600" },
});
