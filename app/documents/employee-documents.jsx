import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useMemo, useState } from "react";
import {
    Alert,
    FlatList,
    Modal,
    RefreshControl,
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
  blueMid: "#DBEAFE",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  orange: "#D97706",
  orangeSoft: "#FEF3C7",
};

// ─────────────────────────────────────────────────────────────
//  CONSTANTS
// ─────────────────────────────────────────────────────────────
const EMPLOYEES = [
  {
    id: "EMP001",
    name: "James Rodriguez",
    department: "Marketing",
    role: "Product Marketing Manager",
  },
  {
    id: "EMP002",
    name: "Sarah Mitchell",
    department: "Engineering",
    role: "Senior React Native Developer",
  },
];

const DOC_TYPES = [
  { key: "contract", label: "Employment Contract" },
  { key: "identification", label: "Identification" },
  { key: "payslip", label: "Payslip" },
  { key: "tax_form", label: "Tax Form" },
  { key: "loan_agreement", label: "Loan Agreement" },
  { key: "certificate", label: "Certificate" },
  { key: "expense_receipt", label: "Expense Receipt" },
  { key: "other", label: "Other" },
];

// ─────────────────────────────────────────────────────────────
//  MOCK DATA — 2 employees, lean
// ─────────────────────────────────────────────────────────────
const MOCK_DOCUMENTS = [
  {
    id: "DOC001",
    emp_id: "EMP001",
    name: "Employment Contract",
    type: "contract",
    file_ext: "pdf",
    file_size: "1.2 MB",
    uploaded_by: "HR Admin",
    uploaded_at: "2021-03-15",
    expiry_date: "2026-03-14",
    status: "active",
  },
  {
    id: "DOC002",
    emp_id: "EMP001",
    name: "National ID Card",
    type: "identification",
    file_ext: "jpg",
    file_size: "340 KB",
    uploaded_by: "James Rodriguez",
    uploaded_at: "2021-03-15",
    expiry_date: "2025-04-30", // expiring soon
    status: "active",
  },
  {
    id: "DOC003",
    emp_id: "EMP001",
    name: "Payslip — March 2025",
    type: "payslip",
    file_ext: "pdf",
    file_size: "210 KB",
    uploaded_by: "System (Auto)",
    uploaded_at: "2025-03-31",
    expiry_date: null,
    status: "active",
  },
  {
    id: "DOC004",
    emp_id: "EMP001",
    name: "Tax Relief Certificate 2024",
    type: "tax_form",
    file_ext: "pdf",
    file_size: "540 KB",
    uploaded_by: "Finance",
    uploaded_at: "2025-01-10",
    expiry_date: "2025-12-31",
    status: "active",
  },
  {
    id: "DOC005",
    emp_id: "EMP001",
    name: "Q1 Expense Receipts",
    type: "expense_receipt",
    file_ext: "zip",
    file_size: "3.4 MB",
    uploaded_by: "James Rodriguez",
    uploaded_at: "2025-04-01",
    expiry_date: null,
    status: "pending_review",
  },
  {
    id: "DOC006",
    emp_id: "EMP002",
    name: "Employment Contract",
    type: "contract",
    file_ext: "pdf",
    file_size: "1.5 MB",
    uploaded_by: "HR Admin",
    uploaded_at: "2020-07-01",
    expiry_date: null,
    status: "active",
  },
  {
    id: "DOC007",
    emp_id: "EMP002",
    name: "Passport Copy",
    type: "identification",
    file_ext: "pdf",
    file_size: "1.1 MB",
    uploaded_by: "Sarah Mitchell",
    uploaded_at: "2024-06-10",
    expiry_date: "2029-06-09",
    status: "active",
  },
  {
    id: "DOC008",
    emp_id: "EMP002",
    name: "AWS Solutions Architect Certificate",
    type: "certificate",
    file_ext: "pdf",
    file_size: "650 KB",
    uploaded_by: "Sarah Mitchell",
    uploaded_at: "2025-01-20",
    expiry_date: "2028-01-20",
    status: "active",
  },
  {
    id: "DOC009",
    emp_id: "EMP002",
    name: "Payslip — March 2025",
    type: "payslip",
    file_ext: "pdf",
    file_size: "215 KB",
    uploaded_by: "System (Auto)",
    uploaded_at: "2025-03-31",
    expiry_date: null,
    status: "active",
  },
  {
    id: "DOC010",
    emp_id: "EMP002",
    name: "Withholding Tax Form 2024",
    type: "tax_form",
    file_ext: "pdf",
    file_size: "460 KB",
    uploaded_by: "Finance",
    uploaded_at: "2025-01-10",
    expiry_date: "2025-05-10", // expiring soon
    status: "active",
  },
];

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────
const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

const AVATAR_COLORS = ["#0A66C2", "#7C3AED", "#16A34A", "#D97706"];
const avatarColor = (name) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const formatDate = (str) => {
  if (!str) return "—";
  return new Date(str).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const daysUntil = (str) => {
  if (!str) return null;
  return Math.ceil((new Date(str) - new Date()) / 86400000);
};

const isExpiringSoon = (str) => {
  if (!str) return false;
  const d = daysUntil(str);
  return d !== null && d > 0 && d <= 90;
};
const isExpired = (str) => {
  if (!str) return false;
  return daysUntil(str) !== null && daysUntil(str) <= 0;
};

const STATUS_META = {
  active: { label: "Active", color: T.green, bg: T.greenSoft },
  pending_review: {
    label: "Pending Review",
    color: T.orange,
    bg: T.orangeSoft,
  },
  expired: { label: "Expired", color: T.red, bg: T.redSoft },
};

// ─────────────────────────────────────────────────────────────
//  STATS WIDGET
// ─────────────────────────────────────────────────────────────
const StatsWidget = ({ docs }) => {
  const total = docs.length;
  const active = docs.filter((d) => d.status === "active").length;
  const pending = docs.filter((d) => d.status === "pending_review").length;
  const expiring = docs.filter((d) => isExpiringSoon(d.expiry_date)).length;

  return (
    <View style={sw.wrapper}>
      <View style={sw.hero}>
        <View style={sw.blob1} />
        <View style={sw.blob2} />
        <View style={sw.heroRow}>
          <View style={sw.heroLeft}>
            <Text style={sw.eyebrow}>EMPLOYEE DOCUMENTS</Text>
            <Text style={sw.heroNum}>{total}</Text>
            <View style={sw.badges}>
              <View style={sw.badge}>
                <Ionicons name="checkmark-circle" size={10} color="#4ADE80" />
                <Text style={sw.badgeTxt}>{active} active</Text>
              </View>
              {expiring > 0 && (
                <View
                  style={[
                    sw.badge,
                    { backgroundColor: "rgba(251,191,36,0.15)" },
                  ]}
                >
                  <Ionicons name="alert-circle" size={10} color="#FBBF24" />
                  <Text style={[sw.badgeTxt, { color: "#FBBF24" }]}>
                    {expiring} expiring
                  </Text>
                </View>
              )}
            </View>
            <Text style={sw.heroSub}>
              Total files · {EMPLOYEES.length} employees
            </Text>
          </View>
          <View style={sw.spotCard}>
            <Text style={sw.spotNum}>{pending}</Text>
            <Text style={sw.spotLabel}>Pending</Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sw.tiles}
      >
        {[
          {
            label: "Total",
            val: total,
            icon: "documents-outline",
            color: T.blue,
          },
          {
            label: "Active",
            val: active,
            icon: "checkmark-circle",
            color: T.green,
          },
          {
            label: "Pending",
            val: pending,
            icon: "time-outline",
            color: T.orange,
          },
          {
            label: "Expiring",
            val: expiring,
            icon: "alert-circle-outline",
            color: T.red,
          },
        ].map((t) => (
          <View key={t.label} style={sw.tile}>
            <View style={[sw.tileIcon, { backgroundColor: t.color + "18" }]}>
              <Ionicons name={t.icon} size={14} color={t.color} />
            </View>
            <Text style={sw.tileVal}>{t.val}</Text>
            <Text style={sw.tileLbl}>{t.label}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const sw = StyleSheet.create({
  wrapper: { paddingHorizontal: 14, marginBottom: 10 },
  hero: {
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  blob1: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#0A66C2",
    opacity: 0.1,
    top: -60,
    right: -40,
  },
  blob2: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#7C3AED",
    opacity: 0.07,
    bottom: -40,
    left: 30,
  },
  heroRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  heroLeft: { flex: 1, gap: 6 },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1.5,
  },
  heroNum: {
    fontSize: 50,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 54,
  },
  badges: { flexDirection: "row", gap: 7, flexWrap: "wrap" },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(74,222,128,0.12)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  badgeTxt: { fontSize: 10, color: "#4ADE80", fontWeight: "700" },
  heroSub: { fontSize: 10, color: "rgba(255,255,255,0.35)", fontWeight: "500" },
  spotCard: {
    width: 68,
    height: 68,
    borderRadius: 16,
    marginLeft: 16,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.15)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  spotNum: { fontSize: 26, fontWeight: "900", color: "#fff" },
  spotLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  tiles: { gap: 8, paddingRight: 4 },
  tile: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    alignItems: "center",
    gap: 4,
    minWidth: 74,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  tileIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  tileVal: {
    fontSize: 20,
    fontWeight: "900",
    color: T.text,
    letterSpacing: -0.5,
  },
  tileLbl: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

// ─────────────────────────────────────────────────────────────
//  DOCUMENT CARD — clean, no rainbow, no action buttons
// ─────────────────────────────────────────────────────────────
const DocumentCard = ({ doc, onPress }) => {
  const emp = EMPLOYEES.find((e) => e.id === doc.emp_id);
  const sm = STATUS_META[doc.status] || STATUS_META.active;
  const expiring = isExpiringSoon(doc.expiry_date);
  const expired = isExpired(doc.expiry_date);
  const days = daysUntil(doc.expiry_date);
  const typeLabel =
    DOC_TYPES.find((t) => t.key === doc.type)?.label || "Document";

  return (
    <TouchableOpacity
      style={dc.card}
      onPress={() => onPress(doc)}
      activeOpacity={0.87}
    >
      <View style={dc.inner}>
        {/* Top row */}
        <View style={dc.topRow}>
          {/* File icon */}
          <View style={dc.fileWrap}>
            <Ionicons name="document-outline" size={20} color={T.blue} />
            <View style={dc.extPill}>
              <Text style={dc.extTxt}>{doc.file_ext.toUpperCase()}</Text>
            </View>
          </View>

          {/* Name + employee */}
          <View style={dc.info}>
            <Text style={dc.docName} numberOfLines={1}>
              {doc.name}
            </Text>
            <View style={dc.empRow}>
              <View
                style={[
                  dc.avatar,
                  { backgroundColor: avatarColor(emp?.name || "") },
                ]}
              >
                <Text style={dc.avatarTxt}>{getInitials(emp?.name || "")}</Text>
              </View>
              <Text style={dc.empName}>{emp?.name}</Text>
              <View style={dc.dot} />
              <Text style={dc.dept}>{emp?.department}</Text>
            </View>
          </View>

          {/* Status */}
          <View style={[dc.statusBadge, { backgroundColor: sm.bg }]}>
            <Text style={[dc.statusTxt, { color: sm.color }]}>{sm.label}</Text>
          </View>
        </View>

        {/* Meta row */}
        <View style={dc.metaRow}>
          {/* Type tag */}
          <View style={dc.metaTag}>
            <Text style={dc.metaTagTxt}>{typeLabel}</Text>
          </View>
          {/* File size */}
          <View style={dc.metaTag}>
            <Ionicons name="cloud-outline" size={10} color={T.textMuted} />
            <Text style={dc.metaTagTxt}>{doc.file_size}</Text>
          </View>
          {/* Uploaded */}
          <Text style={dc.uploadedTxt}>
            Uploaded {formatDate(doc.uploaded_at)}
          </Text>
        </View>

        {/* Expiry row — only shown if relevant */}
        {doc.expiry_date && (
          <View
            style={[
              dc.expiryRow,
              expiring && { backgroundColor: T.orangeSoft },
              expired && { backgroundColor: T.redSoft },
            ]}
          >
            <Ionicons
              name="hourglass-outline"
              size={12}
              color={expired ? T.red : expiring ? T.orange : T.textMuted}
            />
            <Text
              style={[
                dc.expiryTxt,
                expiring && { color: T.orange, fontWeight: "700" },
                expired && { color: T.red, fontWeight: "700" },
              ]}
            >
              {expired
                ? `Expired ${formatDate(doc.expiry_date)}`
                : expiring
                  ? `Expires in ${days} days — ${formatDate(doc.expiry_date)}`
                  : `Expires ${formatDate(doc.expiry_date)}`}
            </Text>
          </View>
        )}

        {/* Chevron hint */}
        <View style={dc.footer}>
          <Text style={dc.viewTxt}>Tap to view details</Text>
          <Ionicons name="chevron-forward" size={13} color={T.textMuted} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const dc = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  inner: { padding: 14, gap: 10 },

  topRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  fileWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: T.blueSoft,
    borderWidth: 1,
    borderColor: T.blueMid,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  extPill: {
    position: "absolute",
    bottom: -3,
    right: -4,
    backgroundColor: T.blue,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  extTxt: { fontSize: 7, fontWeight: "900", color: "#fff" },
  info: { flex: 1 },
  docName: { fontSize: 14, fontWeight: "700", color: T.text, marginBottom: 5 },
  empRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  avatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 7, fontWeight: "900", color: "#fff" },
  empName: { fontSize: 11, color: T.textSub, fontWeight: "600" },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: T.border },
  dept: { fontSize: 11, color: T.textMuted },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 20 },
  statusTxt: { fontSize: 10, fontWeight: "700" },

  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    flexWrap: "wrap",
  },
  metaTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: T.bg,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: T.border,
  },
  metaTagTxt: { fontSize: 10, fontWeight: "600", color: T.textSub },
  uploadedTxt: { fontSize: 10, color: T.textMuted, marginLeft: "auto" },

  expiryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: T.bg,
  },
  expiryTxt: { fontSize: 11, color: T.textMuted },

  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 8,
  },
  viewTxt: { fontSize: 11, color: T.textMuted, fontWeight: "600" },
});

// ─────────────────────────────────────────────────────────────
//  DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const DetailModal = ({ doc, onClose, onDelete }) => {
  if (!doc) return null;
  const emp = EMPLOYEES.find((e) => e.id === doc.emp_id);
  const sm = STATUS_META[doc.status] || STATUS_META.active;
  const expiring = isExpiringSoon(doc.expiry_date);
  const expired = isExpired(doc.expiry_date);
  const typeLabel =
    DOC_TYPES.find((t) => t.key === doc.type)?.label || "Document";

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={dm.overlay}>
        <View style={dm.sheet}>
          <View style={dm.handle} />

          {/* Header */}
          <View style={dm.header}>
            <TouchableOpacity style={dm.closeBtn} onPress={onClose}>
              <Ionicons name="arrow-back" size={18} color={T.textSub} />
            </TouchableOpacity>
            <Text style={dm.headerTitle}>Document Details</Text>
            <View style={[dm.statusPill, { backgroundColor: sm.bg }]}>
              <Text style={[dm.statusPillTxt, { color: sm.color }]}>
                {sm.label}
              </Text>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Hero */}
            <View style={dm.hero}>
              <View style={dm.heroIcon}>
                <Ionicons name="document-outline" size={36} color={T.blue} />
              </View>
              <Text style={dm.heroName}>{doc.name}</Text>
              <Text style={dm.heroType}>{typeLabel}</Text>
            </View>

            {/* Expiry warning */}
            {(expiring || expired) && (
              <View style={dm.section}>
                <View
                  style={[
                    dm.warningCard,
                    {
                      backgroundColor: expired ? T.redSoft : T.orangeSoft,
                      borderColor: expired ? "#FECACA" : "#FDE68A",
                    },
                  ]}
                >
                  <Ionicons
                    name="alert-circle"
                    size={18}
                    color={expired ? T.red : T.orange}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[
                        dm.warningTitle,
                        { color: expired ? T.red : T.orange },
                      ]}
                    >
                      {expired ? "Document Expired" : "Expiring Soon"}
                    </Text>
                    <Text style={dm.warningSub}>
                      {expired
                        ? "This document has expired. Please renew immediately."
                        : `Expires in ${daysUntil(doc.expiry_date)} days. Please arrange renewal.`}
                    </Text>
                  </View>
                </View>
              </View>
            )}

            {/* Employee */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Employee</Text>
              <View style={dm.empCard}>
                <View
                  style={[
                    dm.empAvatar,
                    { backgroundColor: avatarColor(emp?.name || "") },
                  ]}
                >
                  <Text style={dm.empAvatarTxt}>
                    {getInitials(emp?.name || "")}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={dm.empName}>{emp?.name}</Text>
                  <Text style={dm.empRole}>
                    {emp?.role} · {emp?.department}
                  </Text>
                </View>
                <Text style={dm.empId}>{doc.emp_id}</Text>
              </View>
            </View>

            {/* Document info */}
            <View style={dm.section}>
              <Text style={dm.sectionTitle}>Document Info</Text>
              <View style={dm.infoCard}>
                {[
                  {
                    label: "Document Type",
                    val: typeLabel,
                    icon: "document-text-outline",
                  },
                  {
                    label: "File",
                    val: `${doc.file_ext.toUpperCase()} · ${doc.file_size}`,
                    icon: "attach-outline",
                  },
                  {
                    label: "Uploaded By",
                    val: doc.uploaded_by,
                    icon: "person-add-outline",
                  },
                  {
                    label: "Upload Date",
                    val: formatDate(doc.uploaded_at),
                    icon: "cloud-upload-outline",
                  },
                  {
                    label: "Expiry Date",
                    val: formatDate(doc.expiry_date),
                    icon: "hourglass-outline",
                  },
                ].map((row, i) => (
                  <View
                    key={row.label}
                    style={[
                      dm.infoRow,
                      i < 4 && {
                        borderBottomWidth: 1,
                        borderBottomColor: "#F1F5F9",
                      },
                    ]}
                  >
                    <View style={dm.infoIconWrap}>
                      <Ionicons name={row.icon} size={14} color={T.textMuted} />
                    </View>
                    <Text style={dm.infoLabel}>{row.label}</Text>
                    <Text
                      style={[
                        dm.infoVal,
                        row.label === "Expiry Date" &&
                          expired && { color: T.red },
                        row.label === "Expiry Date" &&
                          expiring && { color: T.orange },
                      ]}
                    >
                      {row.val}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={{ height: 20 }} />
          </ScrollView>

          {/* Footer actions */}
          <View style={dm.footer}>
            <TouchableOpacity style={dm.footerBtn}>
              <Ionicons name="cloud-download-outline" size={16} color="#fff" />
              <Text style={dm.footerBtnTxt}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[dm.footerBtn, { backgroundColor: T.green }]}
            >
              <Ionicons name="share-social-outline" size={16} color="#fff" />
              <Text style={dm.footerBtnTxt}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[dm.iconBtn, { backgroundColor: T.redSoft }]}
              onPress={() => {
                onDelete(doc.id);
                onClose();
              }}
            >
              <Ionicons name="trash-outline" size={18} color={T.red} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const dm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    paddingBottom: 0,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: T.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  statusPill: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  statusPillTxt: { fontSize: 11, fontWeight: "700" },

  hero: { alignItems: "center", padding: 24, gap: 6 },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: T.blueSoft,
    borderWidth: 1,
    borderColor: T.blueMid,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  heroName: {
    fontSize: 18,
    fontWeight: "800",
    color: T.text,
    textAlign: "center",
  },
  heroType: { fontSize: 13, color: T.textMuted },

  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 10,
  },

  warningCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    padding: 13,
    borderRadius: 12,
    borderWidth: 1,
  },
  warningTitle: { fontSize: 13, fontWeight: "800", marginBottom: 2 },
  warningSub: { fontSize: 11, color: T.textSub, lineHeight: 16 },

  empCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  empAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  empAvatarTxt: { fontSize: 13, fontWeight: "800", color: "#fff" },
  empName: { fontSize: 14, fontWeight: "700", color: T.text },
  empRole: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  empId: { fontSize: 11, color: T.textMuted, fontWeight: "600" },

  infoCard: {
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12 },
  infoIconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: { flex: 1, fontSize: 12, color: T.textSub, fontWeight: "600" },
  infoVal: { fontSize: 13, fontWeight: "700", color: T.text },

  footer: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  footerBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: T.blue,
  },
  footerBtnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
  iconBtn: {
    width: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─────────────────────────────────────────────────────────────
//  UPLOAD MODAL
// ─────────────────────────────────────────────────────────────
const MOCK_FILES = [
  { name: "employment_contract_2025.pdf", size: "1.2 MB", ext: "pdf" },
  { name: "national_id_scan.jpg", size: "340 KB", ext: "jpg" },
  { name: "tax_relief_cert.pdf", size: "540 KB", ext: "pdf" },
  { name: "expense_receipts_q1.zip", size: "3.4 MB", ext: "zip" },
];

const INITIAL_FORM = {
  emp_id: "",
  doc_type: "",
  doc_name: "",
  expiry_date: "",
};

const UploadModal = ({ visible, onClose, onUploaded }) => {
  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [done, setDone] = useState(false);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  const handlePickFile = () => {
    const f = MOCK_FILES[Math.floor(Math.random() * MOCK_FILES.length)];
    setFile(f);
    setErrors((p) => ({ ...p, file: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.emp_id) e.emp_id = "Select an employee";
    if (!form.doc_type) e.doc_type = "Select a document type";
    if (!form.doc_name.trim()) e.doc_name = "Enter a document name";
    if (!file) e.file = "Select a file";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleUpload = () => {
    if (!validate()) return;
    setUploading(true);
    setProgress(0);
    const iv = setInterval(() => {
      setProgress((p) => {
        const next = p + Math.floor(Math.random() * 20) + 10;
        if (next >= 100) {
          clearInterval(iv);
          setUploading(false);
          setDone(true);
          return 100;
        }
        return next;
      });
    }, 160);
  };

  const handleClose = () => {
    if (done) onUploaded({ ...form, file });
    setForm(INITIAL_FORM);
    setFile(null);
    setErrors({});
    setUploading(false);
    setProgress(0);
    setDone(false);
    onClose();
  };

  // ── Done state ──
  if (done) {
    return (
      <Modal
        visible={visible}
        animationType="fade"
        transparent
        onRequestClose={handleClose}
      >
        <View style={um.overlay}>
          <View style={um.doneCard}>
            <View style={um.doneIcon}>
              <Ionicons name="checkmark-circle" size={48} color={T.green} />
            </View>
            <Text style={um.doneTitle}>Uploaded Successfully</Text>
            <Text style={um.doneSub}>
              Document has been saved to the employee record.
            </Text>
            <View style={um.doneDoc}>
              <Ionicons name="document-outline" size={15} color={T.blue} />
              <View style={{ flex: 1 }}>
                <Text style={um.doneDocName}>{form.doc_name}</Text>
                <Text style={um.doneDocMeta}>
                  {DOC_TYPES.find((t) => t.key === form.doc_type)?.label} ·{" "}
                  {EMPLOYEES.find((e) => e.id === form.emp_id)?.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={um.doneBtn} onPress={handleClose}>
              <Text style={um.doneBtnTxt}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleClose}
    >
      <View style={um.overlay}>
        <View style={um.sheet}>
          <View style={um.handle} />
          <View style={um.header}>
            <TouchableOpacity style={um.closeBtn} onPress={handleClose}>
              <Ionicons name="close" size={18} color={T.textSub} />
            </TouchableOpacity>
            <Text style={um.headerTitle}>Upload Document</Text>
            <View style={{ width: 32 }} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={um.body}
            keyboardShouldPersistTaps="handled"
          >
            {/* Employee */}
            <View style={um.field}>
              <Text style={um.label}>
                Employee <Text style={um.req}>*</Text>
              </Text>
              <View style={um.segRow}>
                {EMPLOYEES.map((e) => {
                  const active = form.emp_id === e.id;
                  return (
                    <TouchableOpacity
                      key={e.id}
                      style={[um.empChip, active && um.empChipActive]}
                      onPress={() => set("emp_id", e.id)}
                    >
                      <View
                        style={[
                          um.empAvatar,
                          { backgroundColor: avatarColor(e.name) },
                        ]}
                      >
                        <Text style={um.empAvatarTxt}>
                          {getInitials(e.name)}
                        </Text>
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[um.empChipName, active && { color: T.blue }]}
                        >
                          {e.name}
                        </Text>
                        <Text style={um.empChipSub}>{e.department}</Text>
                      </View>
                      {active && (
                        <Ionicons
                          name="checkmark-circle"
                          size={18}
                          color={T.blue}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.emp_id && <Text style={um.err}>{errors.emp_id}</Text>}
            </View>

            {/* Document type */}
            <View style={um.field}>
              <Text style={um.label}>
                Document Type <Text style={um.req}>*</Text>
              </Text>
              <View style={um.typeGrid}>
                {DOC_TYPES.map((t) => {
                  const active = form.doc_type === t.key;
                  return (
                    <TouchableOpacity
                      key={t.key}
                      style={[um.typeChip, active && um.typeChipActive]}
                      onPress={() => set("doc_type", t.key)}
                    >
                      <Text
                        style={[um.typeChipTxt, active && um.typeChipTxtActive]}
                      >
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.doc_type && <Text style={um.err}>{errors.doc_type}</Text>}
            </View>

            {/* Document name */}
            <View style={um.field}>
              <Text style={um.label}>
                Document Name <Text style={um.req}>*</Text>
              </Text>
              <TextInput
                style={[um.input, errors.doc_name && um.inputErr]}
                value={form.doc_name}
                onChangeText={(v) => set("doc_name", v)}
                placeholder="e.g. Employment Contract 2025"
                placeholderTextColor={T.textMuted}
              />
              {errors.doc_name && <Text style={um.err}>{errors.doc_name}</Text>}
            </View>

            {/* Expiry date */}
            <View style={um.field}>
              <Text style={um.label}>
                Expiry Date <Text style={um.optional}>(optional)</Text>
              </Text>
              <View style={um.dateRow}>
                <Ionicons
                  name="calendar-outline"
                  size={16}
                  color={T.textMuted}
                />
                <TextInput
                  style={um.dateInput}
                  value={form.expiry_date}
                  onChangeText={(v) => set("expiry_date", v)}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={T.textMuted}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* File upload */}
            <View style={um.field}>
              <Text style={um.label}>
                File <Text style={um.req}>*</Text>
              </Text>
              {file ? (
                <View style={[um.fileCard, errors.file && um.inputErr]}>
                  <View style={um.fileIcon}>
                    <Ionicons
                      name="document-outline"
                      size={20}
                      color={T.blue}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={um.fileName} numberOfLines={1}>
                      {file.name}
                    </Text>
                    <Text style={um.fileMeta}>
                      {file.size} · {file.ext.toUpperCase()}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => setFile(null)}>
                    <Ionicons
                      name="close-circle"
                      size={20}
                      color={T.textMuted}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  style={[um.uploadZone, errors.file && { borderColor: T.red }]}
                  onPress={handlePickFile}
                >
                  <View style={um.uploadIconRing}>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={24}
                      color={T.blue}
                    />
                  </View>
                  <Text style={um.uploadTitle}>Tap to select a file</Text>
                  <Text style={um.uploadSub}>
                    PDF, JPG, PNG, DOCX, ZIP · Max 25 MB
                  </Text>
                </TouchableOpacity>
              )}
              {errors.file && <Text style={um.err}>{errors.file}</Text>}
            </View>

            {/* Upload progress */}
            {uploading && (
              <View style={um.progressCard}>
                <View style={um.progressTop}>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={14}
                    color={T.blue}
                  />
                  <Text style={um.progressTxt}>
                    Uploading… {Math.min(progress, 100)}%
                  </Text>
                </View>
                <View style={um.progressTrack}>
                  <View
                    style={[
                      um.progressFill,
                      { width: `${Math.min(progress, 100)}%` },
                    ]}
                  />
                </View>
              </View>
            )}

            <View style={{ height: 16 }} />
          </ScrollView>

          {/* Submit */}
          <View style={um.footer}>
            <TouchableOpacity
              style={[um.submitBtn, uploading && { opacity: 0.7 }]}
              onPress={handleUpload}
              disabled={uploading}
            >
              <Ionicons name="cloud-upload-outline" size={17} color="#fff" />
              <Text style={um.submitTxt}>
                {uploading ? "Uploading…" : "Upload Document"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const um = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerTitle: { fontSize: 16, fontWeight: "700", color: T.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { padding: 20, gap: 4 },

  field: { marginBottom: 18 },
  label: { fontSize: 13, fontWeight: "700", color: T.text, marginBottom: 8 },
  req: { color: T.red },
  optional: { fontSize: 11, color: T.textMuted, fontWeight: "400" },
  err: { fontSize: 11, color: T.red, fontWeight: "600", marginTop: 5 },

  segRow: { gap: 8 },
  empChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.bg,
  },
  empChipActive: { borderColor: T.blue, backgroundColor: T.blueSoft },
  empAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  empAvatarTxt: { fontSize: 11, fontWeight: "800", color: "#fff" },
  empChipName: { fontSize: 13, fontWeight: "700", color: T.text },
  empChipSub: { fontSize: 11, color: T.textMuted, marginTop: 1 },

  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  typeChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: T.bg,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  typeChipActive: { backgroundColor: T.blue, borderColor: T.blue },
  typeChipTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  typeChipTxtActive: { color: "#fff", fontWeight: "700" },

  input: {
    backgroundColor: T.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: T.text,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  inputErr: { borderColor: T.red },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  dateInput: { flex: 1, fontSize: 14, color: T.text, paddingVertical: 13 },

  uploadZone: {
    borderWidth: 1.5,
    borderColor: T.blueMid,
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 24,
    alignItems: "center",
    gap: 6,
    backgroundColor: T.blueSoft,
  },
  uploadIconRing: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.blueMid,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  uploadTitle: { fontSize: 14, fontWeight: "700", color: T.text },
  uploadSub: { fontSize: 11, color: T.textMuted },

  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: T.blueSoft,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.blueMid,
    padding: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: { fontSize: 13, fontWeight: "700", color: T.text },
  fileMeta: { fontSize: 11, color: T.textMuted, marginTop: 2 },

  progressCard: {
    backgroundColor: T.blueSoft,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: T.blueMid,
  },
  progressTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  progressTxt: { fontSize: 13, fontWeight: "700", color: T.blue },
  progressTrack: {
    height: 5,
    backgroundColor: T.blueMid,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: { height: "100%", backgroundColor: T.blue, borderRadius: 3 },

  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  submitBtn: {
    backgroundColor: T.blue,
    borderRadius: 14,
    paddingVertical: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    shadowColor: T.blue,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  submitTxt: { fontSize: 15, fontWeight: "800", color: "#fff" },

  // Done state
  doneCard: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    margin: 24,
    alignItems: "center",
    gap: 10,
  },
  doneIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.greenSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  doneTitle: { fontSize: 20, fontWeight: "800", color: T.text },
  doneSub: { fontSize: 13, color: T.textMuted, textAlign: "center" },
  doneDoc: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: T.blueSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: T.blueMid,
    width: "100%",
    marginTop: 4,
  },
  doneDocName: { fontSize: 13, fontWeight: "700", color: T.text },
  doneDocMeta: {
    fontSize: 11,
    color: T.textMuted,
    marginTop: 2,
    textTransform: "capitalize",
  },
  doneBtn: {
    backgroundColor: T.blue,
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  doneBtnTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
const TYPE_TABS = [{ key: "all", label: "All" }, ...DOC_TYPES];

export default function EmployeeDocumentsScreen() {
  const [documents, setDocuments] = useState(MOCK_DOCUMENTS);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [typeFilter, setTypeFilter] = useState("all");
  const [empFilter, setEmpFilter] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 600);
  }, []);

  const handleDelete = useCallback((id) => {
    Alert.alert("Delete Document", "Are you sure? This cannot be undone.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setDocuments((p) => p.filter((d) => d.id !== id)),
      },
    ]);
  }, []);

  const handleUploaded = useCallback((formData) => {
    const newDoc = {
      id: `DOC${Date.now()}`,
      emp_id: formData.emp_id,
      name: formData.doc_name,
      type: formData.doc_type,
      file_ext: formData.file?.ext || "pdf",
      file_size: formData.file?.size || "—",
      uploaded_by: "HR Admin",
      uploaded_at: new Date().toISOString().split("T")[0],
      expiry_date: formData.expiry_date || null,
      status: "active",
    };
    setDocuments((p) => [newDoc, ...p]);
  }, []);

  const filtered = useMemo(() => {
    let d = [...documents];
    if (typeFilter !== "all") d = d.filter((x) => x.type === typeFilter);
    if (empFilter) d = d.filter((x) => x.emp_id === empFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(
        (x) =>
          x.name.toLowerCase().includes(q) ||
          DOC_TYPES.find((t) => t.key === x.type)
            ?.label.toLowerCase()
            .includes(q) ||
          EMPLOYEES.find((e) => e.id === x.emp_id)
            ?.name.toLowerCase()
            .includes(q),
      );
    }
    return d.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));
  }, [documents, typeFilter, empFilter, search]);

  const hasFilters = typeFilter !== "all" || empFilter || search;
  const typeCounts = useMemo(() => {
    const map = { all: documents.length };
    DOC_TYPES.forEach((t) => {
      map[t.key] = documents.filter((d) => d.type === t.key).length;
    });
    return map;
  }, [documents]);

  const ListHeader = () => (
    <>
      {/* Title */}
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Documents</Text>
          <Text style={s.pageSub}>
            {documents.length} files · {EMPLOYEES.length} employees
          </Text>
        </View>
        <TouchableOpacity
          style={s.uploadBtn}
          onPress={() => setShowUpload(true)}
        >
          <Ionicons name="cloud-upload-outline" size={15} color="#fff" />
          <Text style={s.uploadBtnTxt}>Upload</Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <StatsWidget docs={documents} />

      {/* Search */}
      <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
        <Ionicons
          name="search-outline"
          size={15}
          color={searchFocused ? T.blue : T.textMuted}
        />
        <TextInput
          style={s.searchInput}
          placeholder="Search name, type, employee…"
          placeholderTextColor={T.textMuted}
          value={search}
          onChangeText={setSearch}
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
          autoCorrect={false}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Ionicons name="close-circle" size={15} color={T.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {/* Employee filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.empStrip}
      >
        <TouchableOpacity
          style={[s.empChip, !empFilter && s.empChipActive]}
          onPress={() => setEmpFilter("")}
        >
          <Text style={[s.empChipTxt, !empFilter && s.empChipTxtActive]}>
            All Employees
          </Text>
        </TouchableOpacity>
        {EMPLOYEES.map((e) => {
          const active = empFilter === e.id;
          return (
            <TouchableOpacity
              key={e.id}
              style={[s.empChip, active && s.empChipActive]}
              onPress={() => setEmpFilter(active ? "" : e.id)}
            >
              <View
                style={[s.empDot, { backgroundColor: avatarColor(e.name) }]}
              />
              <Text style={[s.empChipTxt, active && s.empChipTxtActive]}>
                {e.name.split(" ")[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Type tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.typeTabs}
      >
        {TYPE_TABS.map((tab) => {
          const active = typeFilter === tab.key;
          const count = typeCounts[tab.key] || 0;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[s.typeTab, active && s.typeTabActive]}
              onPress={() => setTypeFilter(tab.key)}
            >
              <Text style={[s.typeTabTxt, active && s.typeTabTxtActive]}>
                {tab.label}
              </Text>
              {count > 0 && (
                <View style={[s.typeCount, active && s.typeCountActive]}>
                  <Text
                    style={[s.typeCountTxt, active && s.typeCountTxtActive]}
                  >
                    {count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Results bar */}
      {hasFilters && (
        <View style={s.resultsBar}>
          <Text style={s.resultsTxt}>
            {filtered.length} result{filtered.length !== 1 ? "s" : ""}
          </Text>
          <TouchableOpacity
            onPress={() => {
              setTypeFilter("all");
              setEmpFilter("");
              setSearch("");
            }}
          >
            <Text style={s.clearTxt}>Clear filters</Text>
          </TouchableOpacity>
        </View>
      )}
    </>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <DocumentCard doc={item} onPress={setSelectedDoc} />
        )}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[T.blue]}
            tintColor={T.blue}
          />
        }
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
        ListEmptyComponent={
          <View style={s.empty}>
            <Ionicons name="documents-outline" size={48} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No documents found</Text>
            <Text style={s.emptySub}>
              {hasFilters
                ? "Try a different filter."
                : "Upload a document to get started."}
            </Text>
          </View>
        }
      />

      <DetailModal
        doc={selectedDoc}
        onClose={() => setSelectedDoc(null)}
        onDelete={handleDelete}
      />

      <UploadModal
        visible={showUpload}
        onClose={() => setShowUpload(false)}
        onUploaded={handleUploaded}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  listContent: { padding: 14, paddingTop: 0, paddingBottom: 40 },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 14,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  uploadBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: T.blue,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  uploadBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 13,
    height: 46,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  searchFocused: { borderColor: T.blue },
  searchInput: { flex: 1, fontSize: 14, color: T.text },

  empStrip: { gap: 7, marginBottom: 10, alignItems: "center" },
  empChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.border,
  },
  empChipActive: { backgroundColor: T.navy, borderColor: T.navy },
  empChipTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  empChipTxtActive: { color: "#fff", fontWeight: "700" },
  empDot: { width: 8, height: 8, borderRadius: 4 },

  typeTabs: { gap: 7, marginBottom: 10, alignItems: "center" },
  typeTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.border,
  },
  typeTabActive: { backgroundColor: T.blue, borderColor: T.blue },
  typeTabTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  typeTabTxtActive: { color: "#fff", fontWeight: "700" },
  typeCount: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    minWidth: 18,
    alignItems: "center",
  },
  typeCountActive: { backgroundColor: "rgba(255,255,255,0.25)" },
  typeCountTxt: { fontSize: 9, fontWeight: "800", color: T.textMuted },
  typeCountTxtActive: { color: "#fff" },

  resultsBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: T.blueSoft,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 10,
  },
  resultsTxt: { fontSize: 12, color: T.blue, fontWeight: "700" },
  clearTxt: {
    fontSize: 12,
    color: T.blue,
    fontWeight: "600",
    textDecorationLine: "underline",
  },

  empty: { paddingVertical: 48, alignItems: "center", gap: 10 },
  emptyTxt: { fontSize: 15, color: T.textMuted, fontWeight: "700" },
  emptySub: { fontSize: 13, color: "#CBD5E1", textAlign: "center" },
});
