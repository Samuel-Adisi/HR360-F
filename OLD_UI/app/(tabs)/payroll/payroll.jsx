import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// ─────────────────────────────────────────────────────────────
//  THEME
// ─────────────────────────────────────────────────────────────
const T = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  navy: "#0F172A",
  text: "#1E293B",
  textSub: "#475569",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  blue: "#0A66C2",
  blueSoft: "#EFF6FF",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  orange: "#0A66C2",
  orangeSoft: "#EFF6FF",
  amber: "#D97706",
  amberSoft: "#FEF3C7",
  purple: "#7C3AED",
  purpleSoft: "#EDE9FE",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA — with financeApproved & payStatus fields
// ─────────────────────────────────────────────────────────────
const INITIAL_DATA = [
  {
    id: "Emp-001",
    full_name: "Anthony Lewis",
    department: "Finance",
    position: "Finance Manager",
    salary: 40000,
    bonus: 2000,
    deductions: 1200,
    payStatus: "Paid",
    financeApproved: true,
    payDate: "28 Feb 2026",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "Emp-002",
    full_name: "Brian Villalobos",
    department: "Engineering",
    position: "Senior Developer",
    salary: 35000,
    bonus: 3000,
    deductions: 1050,
    payStatus: "Paid",
    financeApproved: true,
    payDate: "28 Feb 2026",
    photo: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: "Emp-003",
    full_name: "Harvey Smith",
    department: "Engineering",
    position: "Junior Developer",
    salary: 20000,
    bonus: 500,
    deductions: 600,
    payStatus: "Pending",
    financeApproved: false,
    payDate: "—",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: "Emp-004",
    full_name: "Stephan Peralt",
    department: "Operations",
    position: "Operations Manager",
    salary: 22000,
    bonus: 1000,
    deductions: 660,
    payStatus: "Paid",
    financeApproved: true,
    payDate: "28 Feb 2026",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: "Emp-005",
    full_name: "Doglas Martini",
    department: "HR",
    position: "HR Manager",
    salary: 25000,
    bonus: 0,
    deductions: 750,
    payStatus: "Pending",
    financeApproved: false,
    payDate: "—",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "Emp-006",
    full_name: "Priya Sharma",
    department: "Design",
    position: "UI/UX Designer",
    salary: 32000,
    bonus: 1500,
    deductions: 960,
    payStatus: "Pending",
    financeApproved: true,
    payDate: "—",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "Emp-007",
    full_name: "Sofia Martinez",
    department: "Marketing",
    position: "Marketing Lead",
    salary: 38000,
    bonus: 2500,
    deductions: 1140,
    payStatus: "Paid",
    financeApproved: true,
    payDate: "28 Feb 2026",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
  },
  {
    id: "Emp-008",
    full_name: "James Okafor",
    department: "Finance",
    position: "Accountant",
    salary: 28000,
    bonus: 1000,
    deductions: 840,
    payStatus: "Pending",
    financeApproved: false,
    payDate: "—",
    photo: "https://randomuser.me/api/portraits/men/77.jpg",
  },
];

const DEPT_COLORS = {
  Finance: { bg: "#FFF7ED", accent: T.orange, text: "#9A3412" },
  Engineering: { bg: "#EFF6FF", accent: "#3B82F6", text: "#1E40AF" },
  Operations: { bg: "#F5F3FF", accent: "#8B5CF6", text: "#5B21B6" },
  HR: { bg: "#FDF2F8", accent: "#EC4899", text: "#9D174D" },
  Design: { bg: "#ECFDF5", accent: "#10B981", text: "#065F46" },
  Marketing: { bg: "#FFFBEB", accent: "#F59E0B", text: "#92400E" },
};

const FILTER_TABS = ["All", "Paid", "Pending", "On Hold"];

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

// ─────────────────────────────────────────────────────────────
//  APPROVAL BADGE
// ─────────────────────────────────────────────────────────────
const ApprovalBadge = ({ approved }) =>
  approved ? (
    <View style={[ab.badge, ab.approved]}>
      <Ionicons name="shield-checkmark" size={10} color={T.green} />
      <Text style={[ab.txt, { color: T.green }]}>Approved by Finance</Text>
    </View>
  ) : (
    <View style={[ab.badge, ab.pending]}>
      <Ionicons name="time-outline" size={10} color={T.amber} />
      <Text style={[ab.txt, { color: T.amber }]}>
        Awaiting Finance Approval
      </Text>
    </View>
  );

const ab = StyleSheet.create({
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  approved: { backgroundColor: T.greenSoft },
  pending: { backgroundColor: T.amberSoft },
  txt: { fontSize: 10, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────
//  PAYROLL CARD
// ─────────────────────────────────────────────────────────────
const PayrollCard = ({
  item,
  onPress,
  selectionMode,
  isSelected,
  onToggleSelect,
  onApprove,
  onPay,
}) => {
  const dept = DEPT_COLORS[item.department] || {
    bg: "#F1F5F9",
    accent: "#64748B",
    text: "#334155",
  };
  const net = item.salary + item.bonus - item.deductions;
  const isPending = item.payStatus === "Pending";
  const canPay = isPending && item.financeApproved;

  return (
    <TouchableOpacity
      style={[pc.card, isSelected && pc.cardSelected]}
      onPress={() => (selectionMode ? onToggleSelect(item.id) : onPress(item))}
      onLongPress={() => !selectionMode && onToggleSelect(item.id)}
      activeOpacity={0.85}
    >
      <View style={[pc.accentBar, { backgroundColor: dept.accent }]} />
      <View style={pc.inner}>
        {/* Selection checkbox */}
        {selectionMode && (
          <View style={[pc.checkbox, isSelected && pc.checkboxActive]}>
            {isSelected && <Ionicons name="checkmark" size={12} color="#fff" />}
          </View>
        )}

        {/* Top row */}
        <View style={pc.topRow}>
          {item.photo ? (
            <Image source={{ uri: item.photo }} style={pc.avatar} />
          ) : (
            <View style={[pc.avatarFallback, { backgroundColor: dept.accent }]}>
              <Text style={pc.avatarTxt}>{getInitials(item.full_name)}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={pc.name} numberOfLines={1}>
              {item.full_name}
            </Text>
            <Text style={pc.position} numberOfLines={1}>
              {item.position}
            </Text>
          </View>
          {/* Pay status pill */}
          {item.payStatus === "Paid" ? (
            <View style={[pc.statusPill, { backgroundColor: T.greenSoft }]}>
              <Ionicons name="checkmark-circle" size={11} color={T.green} />
              <Text style={[pc.statusTxt, { color: T.green }]}>Paid</Text>
            </View>
          ) : item.payStatus === "On Hold" ? (
            <View style={[pc.statusPill, { backgroundColor: T.redSoft }]}>
              <Ionicons name="pause-circle" size={11} color={T.red} />
              <Text style={[pc.statusTxt, { color: T.red }]}>On Hold</Text>
            </View>
          ) : (
            <View style={[pc.statusPill, { backgroundColor: T.amberSoft }]}>
              <Ionicons name="time-outline" size={11} color={T.amber} />
              <Text style={[pc.statusTxt, { color: T.amber }]}>Pending</Text>
            </View>
          )}
        </View>

        {/* Dept tag */}
        <View style={[pc.deptTag, { backgroundColor: dept.bg }]}>
          <View style={[pc.deptDot, { backgroundColor: dept.accent }]} />
          <Text style={[pc.deptTxt, { color: dept.text }]}>
            {item.department}
          </Text>
        </View>

        {/* Salary grid */}
        <View style={pc.salaryBox}>
          {[
            {
              label: "Base",
              val: `$${(item.salary / 1000).toFixed(0)}k`,
              color: T.text,
            },
            {
              label: "Bonus",
              val: `+$${item.bonus.toLocaleString()}`,
              color: T.green,
            },
            {
              label: "Deduct",
              val: `-$${item.deductions.toLocaleString()}`,
              color: T.red,
            },
          ].map((s, i) => (
            <React.Fragment key={s.label}>
              {i > 0 && <View style={pc.sep} />}
              <View style={pc.salaryItem}>
                <Text style={pc.salaryMeta}>{s.label}</Text>
                <Text style={[pc.salaryVal, { color: s.color }]}>{s.val}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        {/* Net + approval badge */}
        <View style={pc.netRow}>
          <View>
            <Text style={pc.netMeta}>Net Pay</Text>
            <Text style={pc.netVal}>${net.toLocaleString()}</Text>
          </View>
          {isPending && <ApprovalBadge approved={item.financeApproved} />}
          {item.payStatus === "Paid" && (
            <View style={[pc.paidDateChip]}>
              <Ionicons name="calendar-outline" size={11} color={T.green} />
              <Text style={pc.paidDateTxt}>{item.payDate}</Text>
            </View>
          )}
        </View>

        {/* Action buttons — only for pending items */}
        {isPending && !selectionMode && (
          <View style={pc.actionsRow}>
            <TouchableOpacity
              style={[pc.payBtn, !canPay && pc.payBtnDisabled]}
              onPress={() => canPay && onPay([item.id])}
              disabled={!canPay}
              activeOpacity={canPay ? 0.8 : 1}
            >
              <Ionicons
                name="cash-outline"
                size={13}
                color={canPay ? "#fff" : T.textMuted}
              />
              <Text style={[pc.payTxt, !canPay && pc.payTxtDisabled]}>
                {canPay ? "Pay Now" : "Pay (Locked)"}
              </Text>
              {!canPay && (
                <Ionicons name="lock-closed" size={11} color={T.textMuted} />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const pc = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: T.border,
    position: "relative",
  },
  cardSelected: {
    borderColor: T.blue,
    borderWidth: 2,
    backgroundColor: "#F0F7FF",
  },
  accentBar: { width: 5 },
  inner: { flex: 1, padding: 13, gap: 9 },
  checkbox: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: T.border,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  checkboxActive: { backgroundColor: T.blue, borderColor: T.blue },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: T.border,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 13, fontWeight: "800", color: "#fff" },
  name: { fontSize: 14, fontWeight: "700", color: T.text },
  position: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusTxt: { fontSize: 10, fontWeight: "700" },
  deptTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  deptDot: { width: 6, height: 6, borderRadius: 3 },
  deptTxt: { fontSize: 11, fontWeight: "700" },
  salaryBox: {
    flexDirection: "row",
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: T.border,
  },
  salaryItem: { flex: 1, alignItems: "center" },
  salaryMeta: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "500",
    marginBottom: 3,
  },
  salaryVal: { fontSize: 13, fontWeight: "800" },
  sep: { width: 1, backgroundColor: T.border, marginHorizontal: 4 },
  netRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  netMeta: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "500",
    marginBottom: 2,
  },
  netVal: { fontSize: 20, fontWeight: "900", color: T.text },
  paidDateChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.greenSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },
  paidDateTxt: { fontSize: 11, fontWeight: "600", color: T.green },
  actionsRow: { flexDirection: "row", gap: 8 },
  approveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: T.blueSoft,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: T.blue,
  },
  approveTxt: { fontSize: 12, fontWeight: "700", color: T.blue },
  payBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: T.orange,
    paddingVertical: 10,
    borderRadius: 10,
  },
  payBtnDisabled: { backgroundColor: "#F1F5F9" },
  payTxt: { fontSize: 12, fontWeight: "700", color: "#fff" },
  payTxtDisabled: { color: T.textMuted },
});

// ─────────────────────────────────────────────────────────────
//  DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const PayrollModal = ({ item, onClose, onApprove, onPay }) => {
  if (!item) return null;
  const dept = DEPT_COLORS[item.department] || {
    bg: "#F1F5F9",
    accent: "#64748B",
    text: "#334155",
  };
  const net = item.salary + item.bonus - item.deductions;
  const isPending = item.payStatus === "Pending";
  const canPay = isPending && item.financeApproved;

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={pm.overlay}>
        <View style={pm.sheet}>
          <View style={pm.handle} />
          <View style={pm.header}>
            <Text style={pm.title}>Payroll Details</Text>
            <TouchableOpacity onPress={onClose} style={pm.closeBtn}>
              <Ionicons name="close" size={18} color={T.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View style={[pm.hero, { backgroundColor: dept.bg }]}>
              {item.photo ? (
                <Image source={{ uri: item.photo }} style={pm.heroPhoto} />
              ) : (
                <View
                  style={[
                    pm.heroAvatarFallback,
                    { backgroundColor: dept.accent },
                  ]}
                >
                  <Text style={pm.heroInitials}>
                    {getInitials(item.full_name)}
                  </Text>
                </View>
              )}
              <Text style={pm.heroName}>{item.full_name}</Text>
              <Text style={[pm.heroRole, { color: dept.text }]}>
                {item.position}
              </Text>
              <ApprovalBadge approved={item.financeApproved} />
            </View>

            <View style={pm.breakdownCard}>
              <Text style={pm.breakdownTitle}>Salary Breakdown</Text>
              {[
                {
                  label: "Base Salary",
                  val: `$${item.salary.toLocaleString()}`,
                  color: T.text,
                },
                {
                  label: "Bonus",
                  val: `+$${item.bonus.toLocaleString()}`,
                  color: T.green,
                },
                {
                  label: "Deductions",
                  val: `-$${item.deductions.toLocaleString()}`,
                  color: T.red,
                },
              ].map(({ label, val, color }) => (
                <View key={label} style={pm.breakRow}>
                  <Text style={pm.breakLabel}>{label}</Text>
                  <Text style={[pm.breakVal, { color }]}>{val}</Text>
                </View>
              ))}
              <View style={pm.divider} />
              <View style={pm.breakRow}>
                <Text style={pm.netLabel}>Net Pay</Text>
                <Text style={pm.netVal}>${net.toLocaleString()}</Text>
              </View>
            </View>

            <View style={pm.infoSection}>
              {[
                {
                  icon: "id-card-outline",
                  label: "Employee ID",
                  value: item.id,
                },
                {
                  icon: "business-outline",
                  label: "Department",
                  value: item.department,
                },
                {
                  icon: "calendar-outline",
                  label: "Pay Date",
                  value: item.payDate,
                },
                {
                  icon: "wallet-outline",
                  label: "Pay Status",
                  value: item.payStatus,
                },
              ].map(({ icon, label, value }) => (
                <View key={label} style={pm.infoRow}>
                  <View style={pm.infoIconBox}>
                    <Ionicons name={icon} size={15} color={T.textMuted} />
                  </View>
                  <View>
                    <Text style={pm.infoLabel}>{label}</Text>
                    <Text style={pm.infoValue}>{value}</Text>
                  </View>
                </View>
              ))}
            </View>
            <View style={{ height: 8 }} />
          </ScrollView>

          <View style={pm.footer}>
            {isPending && (
              <TouchableOpacity
                style={[pm.payBtn, !canPay && pm.payBtnDisabled]}
                onPress={() => {
                  if (canPay) {
                    onPay([item.id]);
                    onClose();
                  }
                }}
                disabled={!canPay}
              >
                <Ionicons
                  name="cash-outline"
                  size={15}
                  color={canPay ? "#fff" : T.textMuted}
                />
                <Text style={[pm.payBtnTxt, !canPay && { color: T.textMuted }]}>
                  {canPay ? "Pay Now" : "Locked"}
                </Text>
                {!canPay && (
                  <Ionicons name="lock-closed" size={12} color={T.textMuted} />
                )}
              </TouchableOpacity>
            )}
            <TouchableOpacity style={pm.closeFooterBtn} onPress={onClose}>
              <Text style={pm.closeFooterTxt}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const pm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: "92%",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: { fontSize: 17, fontWeight: "800", color: T.text },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  hero: {
    margin: 16,
    borderRadius: 18,
    padding: 24,
    alignItems: "center",
    gap: 6,
  },
  heroPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
    marginBottom: 6,
  },
  heroAvatarFallback: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  heroInitials: { fontSize: 26, fontWeight: "900", color: "#fff" },
  heroName: { fontSize: 19, fontWeight: "800", color: T.text },
  heroRole: { fontSize: 13, fontWeight: "500" },
  breakdownCard: {
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: T.bg,
    borderRadius: 14,
    padding: 16,
    gap: 2,
  },
  breakdownTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 10,
  },
  breakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
  },
  breakLabel: { fontSize: 13, color: T.textSub },
  breakVal: { fontSize: 13, fontWeight: "700" },
  divider: { height: 1, backgroundColor: T.border, marginVertical: 4 },
  netLabel: { fontSize: 14, fontWeight: "800", color: T.text },
  netVal: { fontSize: 20, fontWeight: "900", color: T.text },
  infoSection: { paddingHorizontal: 16, gap: 2 },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: { fontSize: 13, color: T.text, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  approveBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: T.blueSoft,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.blue,
  },
  approveBtnTxt: { fontSize: 13, fontWeight: "700", color: T.blue },
  payBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    backgroundColor: T.orange,
    paddingVertical: 13,
    borderRadius: 12,
  },
  payBtnDisabled: { backgroundColor: "#F1F5F9" },
  payBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
  closeFooterBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: "center",
  },
  closeFooterTxt: { fontSize: 13, fontWeight: "700", color: T.textSub },
});

// ─────────────────────────────────────────────────────────────
//  BULK CONFIRM MODAL
// ─────────────────────────────────────────────────────────────
const BulkConfirmModal = ({
  visible,
  selectedItems,
  allData,
  onConfirm,
  onCancel,
}) => {
  const items = allData.filter((d) => selectedItems.includes(d.id));
  const approved = items.filter((i) => i.financeApproved);
  const notApproved = items.filter((i) => !i.financeApproved);
  const totalNet = approved.reduce(
    (s, i) => s + i.salary + i.bonus - i.deductions,
    0,
  );
  const canProceed = approved.length > 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onCancel}
    >
      <View style={bm.overlay}>
        <View style={bm.sheet}>
          <View style={bm.headerRow}>
            <View style={bm.iconWrap}>
              <Ionicons name="cash" size={22} color={T.orange} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={bm.title}>Confirm Bulk Payment</Text>
              <Text style={bm.sub}>
                {approved.length} of {items.length} selected employees eligible
              </Text>
            </View>
            <TouchableOpacity onPress={onCancel} style={bm.closeBtn}>
              <Ionicons name="close" size={16} color={T.textMuted} />
            </TouchableOpacity>
          </View>

          {/* Summary */}
          <View style={bm.summaryBox}>
            <View style={bm.summaryRow}>
              <Text style={bm.summaryLabel}>Eligible Employees</Text>
              <Text style={[bm.summaryVal, { color: T.green }]}>
                {approved.length}
              </Text>
            </View>
            <View style={bm.summaryRow}>
              <Text style={bm.summaryLabel}>Skipped (Not Approved)</Text>
              <Text style={[bm.summaryVal, { color: T.amber }]}>
                {notApproved.length}
              </Text>
            </View>
            <View style={bm.divider} />
            <View style={bm.summaryRow}>
              <Text style={bm.totalLabel}>Total Payout</Text>
              <Text style={bm.totalVal}>${totalNet.toLocaleString()}</Text>
            </View>
          </View>

          {/* Employee list */}
          <ScrollView
            style={{ maxHeight: 200 }}
            showsVerticalScrollIndicator={false}
          >
            {items.map((item) => {
              const net = item.salary + item.bonus - item.deductions;
              return (
                <View key={item.id} style={bm.empRow}>
                  <View
                    style={[
                      bm.empDot,
                      {
                        backgroundColor: item.financeApproved
                          ? T.green
                          : T.amber,
                      },
                    ]}
                  />
                  <Text style={bm.empName} numberOfLines={1}>
                    {item.full_name}
                  </Text>
                  <View
                    style={[
                      bm.empBadge,
                      {
                        backgroundColor: item.financeApproved
                          ? T.greenSoft
                          : T.amberSoft,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        bm.empBadgeTxt,
                        { color: item.financeApproved ? T.green : T.amber },
                      ]}
                    >
                      {item.financeApproved ? "Approved" : "Awaiting"}
                    </Text>
                  </View>
                  <Text
                    style={[
                      bm.empNet,
                      { color: item.financeApproved ? T.text : T.textMuted },
                    ]}
                  >
                    ${net.toLocaleString()}
                  </Text>
                </View>
              );
            })}
          </ScrollView>

          {notApproved.length > 0 && (
            <View style={bm.warningBox}>
              <Ionicons name="warning-outline" size={14} color={T.amber} />
              <Text style={bm.warningTxt}>
                {notApproved.length} employee{notApproved.length > 1 ? "s" : ""}{" "}
                without Finance approval will be skipped.
              </Text>
            </View>
          )}

          <View style={bm.footer}>
            <TouchableOpacity style={bm.cancelBtn} onPress={onCancel}>
              <Text style={bm.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[bm.confirmBtn, !canProceed && bm.confirmBtnDisabled]}
              onPress={() => canProceed && onConfirm(approved.map((i) => i.id))}
              disabled={!canProceed}
            >
              <Ionicons
                name="flash"
                size={15}
                color={canProceed ? "#fff" : T.textMuted}
              />
              <Text
                style={[bm.confirmTxt, !canProceed && { color: T.textMuted }]}
              >
                Pay {approved.length} Employee{approved.length !== 1 ? "s" : ""}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const bm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 20,
  },
  sheet: { backgroundColor: "#fff", borderRadius: 22, padding: 20, gap: 14 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: T.orangeSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 16, fontWeight: "800", color: T.text },
  sub: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  closeBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  summaryBox: {
    backgroundColor: T.bg,
    borderRadius: 14,
    padding: 14,
    gap: 2,
    borderWidth: 1,
    borderColor: T.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  summaryLabel: { fontSize: 13, color: T.textSub },
  summaryVal: { fontSize: 13, fontWeight: "700" },
  divider: { height: 1, backgroundColor: T.border, marginVertical: 4 },
  totalLabel: { fontSize: 14, fontWeight: "800", color: T.text },
  totalVal: { fontSize: 18, fontWeight: "900", color: T.text },
  empRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  empDot: { width: 8, height: 8, borderRadius: 4 },
  empName: { flex: 1, fontSize: 12, fontWeight: "600", color: T.text },
  empBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 20 },
  empBadgeTxt: { fontSize: 9, fontWeight: "700" },
  empNet: { fontSize: 12, fontWeight: "800", width: 64, textAlign: "right" },
  warningBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: T.amberSoft,
    borderRadius: 10,
    padding: 10,
  },
  warningTxt: { flex: 1, fontSize: 11, color: T.amber, fontWeight: "600" },
  footer: { flexDirection: "row", gap: 10 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: "center",
  },
  cancelTxt: { fontSize: 13, fontWeight: "700", color: T.textSub },
  confirmBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: T.orange,
    paddingVertical: 13,
    borderRadius: 12,
  },
  confirmBtnDisabled: { backgroundColor: "#F1F5F9" },
  confirmTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  SUCCESS TOAST
// ─────────────────────────────────────────────────────────────
const SuccessToast = ({ msg }) => (
  <View style={st.wrap}>
    <Ionicons name="checkmark-circle" size={18} color="#fff" />
    <Text style={st.txt}>{msg}</Text>
  </View>
);

const st = StyleSheet.create({
  wrap: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: T.navy,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
    zIndex: 999,
  },
  txt: { fontSize: 13, fontWeight: "700", color: "#fff", flex: 1 },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function PayrollScreen() {
  useEffect(() => {
    // #region agent log
    fetch(
      "http://127.0.0.1:7435/ingest/573e11c3-4929-47fe-8a5b-0b9558470170",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "021120",
        },
        body: JSON.stringify({
          sessionId: "021120",
          location: "app/(tabs)/payroll/payroll.jsx:PayrollScreenMount",
          message: "Payroll screen mounted",
          hypothesisId: "H5_payrollScreenMounted",
          data: { routeKey: "payroll/index" },
          timestamp: Date.now(),
        }),
      },
    ).catch(() => {});
    // #endregion
  }, []);

  const [data, setData] = useState(INITIAL_DATA);
  const [selected, setSelected] = useState(null); // detail modal
  const [activeFilter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2800);
  };

  // ── Finance Approve
  const handleApprove = useCallback((empId) => {
    setData((prev) =>
      prev.map((e) => (e.id === empId ? { ...e, financeApproved: true } : e)),
    );
    showToast("Finance approval granted ✓");
  }, []);

  // ── Pay (single or bulk)
  const handlePay = useCallback((empIds) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    setData((prev) =>
      prev.map((e) =>
        empIds.includes(e.id) && e.financeApproved
          ? { ...e, payStatus: "Paid", payDate: dateStr }
          : e,
      ),
    );
    setSelectedIds([]);
    setSelectionMode(false);
    setShowBulkModal(false);
    const count = empIds.length;
    showToast(`${count} employee${count > 1 ? "s" : ""} paid successfully 🎉`);
  }, []);

  // ── Toggle select
  const toggleSelect = useCallback(
    (id) => {
      const emp = data.find((e) => e.id === id);
      if (!emp || emp.payStatus !== "Pending") return;
      if (!selectionMode) setSelectionMode(true);
      setSelectedIds((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    },
    [data, selectionMode],
  );

  const exitSelection = () => {
    setSelectionMode(false);
    setSelectedIds([]);
  };

  // ── Filtered list
  const filtered = useMemo(() => {
    let list = [...data];
    if (activeFilter !== "All")
      list = list.filter((e) => e.payStatus === activeFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.full_name.toLowerCase().includes(q) ||
          e.department.toLowerCase().includes(q) ||
          e.id.toLowerCase().includes(q),
      );
    }
    return list;
  }, [data, activeFilter, search]);

  const totalPayroll = data.reduce(
    (s, e) => s + e.salary + e.bonus - e.deductions,
    0,
  );
  const paidCount = data.filter((e) => e.payStatus === "Paid").length;
  const pendingCount = data.filter((e) => e.payStatus === "Pending").length;
  const awaitingApproval = data.filter(
    (e) => e.payStatus === "Pending" && !e.financeApproved,
  ).length;

  const selectedData = data.filter((e) => selectedIds.includes(e.id));
  const allSelectedApproved =
    selectedIds.length > 0 && selectedData.every((e) => e.financeApproved);
  const someApproved = selectedData.some((e) => e.financeApproved);

  const renderItem = useCallback(
    ({ item }) => (
      <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <PayrollCard
          item={item}
          onPress={setSelected}
          selectionMode={selectionMode}
          isSelected={selectedIds.includes(item.id)}
          onToggleSelect={toggleSelect}
          onPay={handlePay}
        />
      </View>
    ),
    [selectionMode, selectedIds, toggleSelect, handleApprove, handlePay],
  );

  const ListHeader = () => (
    <View>
      {/* Hero Banner */}
      <View style={s.heroBanner}>
        <View style={s.heroBlob1} />
        <View style={s.heroBlob2} />
        <View style={s.heroContent}>
          <View>
            <Text style={s.heroEyebrow}>TOTAL PAYROLL · MARCH 2026</Text>
            <Text style={s.heroAmount}>${totalPayroll.toLocaleString()}</Text>
            <View style={s.heroBadge}>
              <Ionicons name="trending-up" size={11} color="#4ADE80" />
              <Text style={s.heroBadgeTxt}>↑ 12.4% vs last month</Text>
            </View>
          </View>
          <View style={s.heroRingWrap}>
            <Text style={s.heroRingNum}>{paidCount}</Text>
            <Text style={s.heroRingLbl}>Paid</Text>
          </View>
        </View>
      </View>

      {/* Mini stats */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.statsRow}
      >
        {[
          {
            val: paidCount,
            label: "Paid",
            color: T.green,
            bg: T.greenSoft,
            icon: "checkmark-circle-outline",
          },
          {
            val: pendingCount,
            label: "Pending",
            color: T.amber,
            bg: T.amberSoft,
            icon: "time-outline",
          },
          {
            val: awaitingApproval,
            label: "Needs Approval",
            color: T.blue,
            bg: T.blueSoft,
            icon: "shield-outline",
          },
          {
            val: data.length,
            label: "Total",
            color: T.purple,
            bg: T.purpleSoft,
            icon: "people-outline",
          },
        ].map((s2) => (
          <View key={s2.label} style={[s.statTile, { backgroundColor: s2.bg }]}>
            <View style={[s.statIcon, { backgroundColor: s2.color + "20" }]}>
              <Ionicons name={s2.icon} size={13} color={s2.color} />
            </View>
            <Text style={[s.statVal, { color: s2.color }]}>{s2.val}</Text>
            <Text style={[s.statLbl, { color: s2.color }]}>{s2.label}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Section header */}
      <View style={s.sectionRow}>
        <View style={s.sectionLeft}>
          <View style={s.sectionDot} />
          <Text style={s.sectionTitle}>Employee Salary List</Text>
        </View>
        <TouchableOpacity
          style={[s.bulkBtn, selectionMode && s.bulkBtnActive]}
          onPress={() =>
            selectionMode ? exitSelection() : setSelectionMode(true)
          }
        >
          <Ionicons
            name={selectionMode ? "close" : "checkmark-done-outline"}
            size={13}
            color={selectionMode ? "#fff" : T.blue}
          />
          <Text style={[s.bulkBtnTxt, selectionMode && { color: "#fff" }]}>
            {selectionMode ? "Cancel" : "Bulk Pay"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={s.searchWrap}>
        <Ionicons name="search-outline" size={16} color={T.textMuted} />
        <TextInput
          style={s.searchInput}
          placeholder="Search name, department, ID…"
          placeholderTextColor={T.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={16} color={T.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.tabsRow}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, activeFilter === tab && s.tabActive]}
            onPress={() => setFilter(tab)}
          >
            <Text style={[s.tabTxt, activeFilter === tab && s.tabTxtActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bulk action bar */}
      {selectionMode && (
        <View style={s.bulkBar}>
          <View style={s.bulkBarLeft}>
            <View style={s.bulkCountWrap}>
              <Text style={s.bulkCount}>{selectedIds.length}</Text>
            </View>
            <Text style={s.bulkBarTxt}>
              {selectedIds.length === 0
                ? "Tap pending items to select"
                : `employee${selectedIds.length !== 1 ? "s" : ""} selected`}
            </Text>
          </View>
          <TouchableOpacity
            style={[s.payAllBtn, !someApproved && s.payAllBtnDisabled]}
            onPress={() => someApproved && setShowBulkModal(true)}
            disabled={!someApproved || selectedIds.length === 0}
          >
            {!allSelectedApproved && selectedIds.length > 0 && (
              <Ionicons
                name="lock-closed"
                size={12}
                color={someApproved ? "#fff" : T.textMuted}
              />
            )}
            <Ionicons
              name="flash"
              size={13}
              color={
                someApproved && selectedIds.length > 0 ? "#fff" : T.textMuted
              }
            />
            <Text
              style={[
                s.payAllTxt,
                (!someApproved || selectedIds.length === 0) && {
                  color: T.textMuted,
                },
              ]}
            >
              Pay All
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      {/* Top bar */}
      <View style={s.topBar}>
        <Text style={s.pageTitle}>Payroll</Text>
        <View style={s.topActions}>
          <TouchableOpacity style={s.exportBtn}>
            <Ionicons name="download-outline" size={14} color={T.textSub} />
            <Text style={s.exportTxt}>Export</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.addBtn}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={s.addBtnTxt}>Add Salary</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 60 }}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="cash-outline" size={48} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No records found</Text>
            <Text style={s.emptySub}>Try adjusting your search or filter</Text>
          </View>
        }
      />

      {/* Modals */}
      <PayrollModal
        item={selected}
        onClose={() => setSelected(null)}
        onPay={handlePay}
      />

      <BulkConfirmModal
        visible={showBulkModal}
        selectedItems={selectedIds}
        allData={data}
        onConfirm={handlePay}
        onCancel={() => setShowBulkModal(false)}
      />

      {toast && <SuccessToast msg={toast} />}
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pageTitle: { fontSize: 22, fontWeight: "900", color: T.text },
  topActions: { flexDirection: "row", gap: 8, alignItems: "center" },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#fff",
  },
  exportTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: T.orange,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  addBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },

  heroBanner: {
    margin: 16,
    marginBottom: 10,
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 22,
    overflow: "hidden",
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  heroBlob1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: T.orange,
    opacity: 0.08,
    top: -60,
    right: -40,
  },
  heroBlob2: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: T.blue,
    opacity: 0.1,
    bottom: -50,
    left: 30,
  },
  heroContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroEyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  heroAmount: {
    fontSize: 32,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -1,
  },
  heroBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 6,
  },
  heroBadgeTxt: { fontSize: 11, color: "#4ADE80", fontWeight: "700" },
  heroRingWrap: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  heroRingNum: { fontSize: 24, fontWeight: "900", color: "#fff" },
  heroRingLbl: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    textTransform: "uppercase",
  },

  statsRow: { paddingHorizontal: 16, gap: 8, marginBottom: 14 },
  statTile: {
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
    minWidth: 82,
  },
  statIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  statVal: { fontSize: 18, fontWeight: "900", letterSpacing: -0.5 },
  statLbl: {
    fontSize: 9,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    textAlign: "center",
  },

  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  sectionLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionDot: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: T.orange,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: T.text },
  bulkBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: T.blue,
    backgroundColor: T.blueSoft,
  },
  bulkBtnActive: { backgroundColor: T.navy, borderColor: T.navy },
  bulkBtnTxt: { fontSize: 12, fontWeight: "700", color: T.blue },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 16,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: T.text },

  tabsRow: { paddingHorizontal: 16, gap: 8, marginBottom: 12 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.border,
  },
  tabActive: { backgroundColor: T.orange, borderColor: T.orange },
  tabTxt: { fontSize: 12, fontWeight: "700", color: T.textSub },
  tabTxtActive: { color: "#fff" },

  bulkBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: T.navy,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  bulkBarLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  bulkCountWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  bulkCount: { fontSize: 13, fontWeight: "900", color: "#fff" },
  bulkBarTxt: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  payAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.orange,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 10,
  },
  payAllBtnDisabled: { backgroundColor: "rgba(255,255,255,0.12)" },
  payAllTxt: { fontSize: 13, fontWeight: "800", color: "#fff" },

  empty: { padding: 56, alignItems: "center", gap: 10 },
  emptyTxt: { fontSize: 15, color: T.textMuted, fontWeight: "700" },
  emptySub: { fontSize: 12, color: "#CBD5E1" },
});
