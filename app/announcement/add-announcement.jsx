import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
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
  amber: "#D97706",
  amberSoft: "#FEF3C7",
  purple: "#7C3AED",
  purpleSoft: "#EDE9FE",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  "Engineering",
  "Finance",
  "Human Resources",
  "Design",
  "Marketing",
  "Operations",
  "Customer Success",
  "Legal & Compliance",
];

const EMPLOYEES = [
  { id: "Emp-001", name: "Anthony Lewis", dept: "Finance", initials: "AL" },
  {
    id: "Emp-002",
    name: "Brian Villalobos",
    dept: "Engineering",
    initials: "BV",
  },
  { id: "Emp-003", name: "Harvey Smith", dept: "Engineering", initials: "HS" },
  { id: "Emp-004", name: "Stephan Peralt", dept: "Operations", initials: "SP" },
  { id: "Emp-005", name: "Doglas Martini", dept: "HR", initials: "DM" },
  { id: "Emp-006", name: "Priya Sharma", dept: "Design", initials: "PS" },
  { id: "Emp-007", name: "Sofia Martinez", dept: "Marketing", initials: "SM" },
  { id: "Emp-008", name: "James Okafor", dept: "Finance", initials: "JO" },
];

const PRIORITY_OPTIONS = [
  {
    key: "normal",
    label: "Normal",
    icon: "remove-circle-outline",
    color: T.textMuted,
  },
  {
    key: "medium",
    label: "Medium",
    icon: "alert-circle-outline",
    color: T.amber,
  },
  { key: "urgent", label: "Urgent", icon: "warning-outline", color: T.red },
];

const AUDIENCE_OPTIONS = [
  {
    key: "all",
    label: "All Employees",
    icon: "people-outline",
    desc: "Send to everyone",
  },
  {
    key: "dept",
    label: "By Department",
    icon: "business-outline",
    desc: "Choose specific departments",
  },
  {
    key: "selected",
    label: "Selected Employees",
    icon: "person-outline",
    desc: "Pick individual employees",
  },
];

const AVATAR_COLORS = [
  "#0A66C2",
  "#7C3AED",
  "#16A34A",
  "#D97706",
  "#DC2626",
  "#0891B2",
  "#DB2777",
];
const avatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

// File type helpers
const FILE_ICONS = {
  pdf: {
    icon: "document-text-outline",
    color: T.red,
    bg: T.redSoft,
    label: "PDF",
  },
  doc: {
    icon: "document-outline",
    color: T.blue,
    bg: T.blueSoft,
    label: "DOC",
  },
  docx: {
    icon: "document-outline",
    color: T.blue,
    bg: T.blueSoft,
    label: "DOCX",
  },
  xls: { icon: "grid-outline", color: T.green, bg: T.greenSoft, label: "XLS" },
  xlsx: {
    icon: "grid-outline",
    color: T.green,
    bg: T.greenSoft,
    label: "XLSX",
  },
  img: {
    icon: "image-outline",
    color: T.purple,
    bg: T.purpleSoft,
    label: "IMG",
  },
  other: {
    icon: "attach-outline",
    color: T.textMuted,
    bg: "#F1F5F9",
    label: "FILE",
  },
};
const getFileType = (name = "") => {
  const ext = name.split(".").pop().toLowerCase();
  return (
    FILE_ICONS[ext] ||
    (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)
      ? FILE_ICONS.img
      : FILE_ICONS.other)
  );
};

// Mock file attachments (simulated since no real file system)
const MOCK_ATTACHMENTS = [
  { id: "f1", name: "Q1_Report_2026.pdf", size: "2.4 MB" },
  { id: "f2", name: "Employee_Handbook_v3.docx", size: "1.1 MB" },
  { id: "f3", name: "Company_Logo_Banner.png", size: "340 KB" },
];

// ─────────────────────────────────────────────────────────────
//  REUSABLE: SECTION CARD
// ─────────────────────────────────────────────────────────────
const SectionCard = ({ icon, iconColor, iconBg, title, children }) => (
  <View style={sc.card}>
    <View style={sc.header}>
      <View style={[sc.iconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={14} color={iconColor} />
      </View>
      <Text style={sc.title}>{title}</Text>
    </View>
    <View style={sc.body}>{children}</View>
  </View>
);
const sc = StyleSheet.create({
  card: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  iconWrap: {
    width: 30,
    height: 30,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: T.text,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  body: { padding: 16, gap: 14 },
});

// ─────────────────────────────────────────────────────────────
//  REUSABLE: TEXT INPUT
// ─────────────────────────────────────────────────────────────
const FInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  required,
  error,
  icon,
  multiline,
  minHeight,
  maxLength,
  hint,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ gap: 6 }}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={inp.label}>
          {label}
          {required && <Text style={{ color: T.red }}> *</Text>}
        </Text>
        {hint && <Text style={inp.hint}>{hint}</Text>}
        {maxLength && value?.length > 0 && (
          <Text
            style={[
              inp.hint,
              value.length > maxLength * 0.9 && { color: T.amber },
            ]}
          >
            {value.length}/{maxLength}
          </Text>
        )}
      </View>
      <View
        style={[
          inp.row,
          {
            minHeight: multiline ? minHeight || 100 : 50,
            alignItems: multiline ? "flex-start" : "center",
            paddingTop: multiline ? 12 : 0,
          },
          focused && inp.focused,
          error && inp.errored,
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={15}
            color={focused ? T.blue : T.textMuted}
            style={{ marginRight: 8, marginTop: multiline ? 2 : 0 }}
          />
        )}
        <TextInput
          style={[inp.input, multiline && { textAlignVertical: "top" }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={T.textMuted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline={multiline}
          maxLength={maxLength}
        />
      </View>
      {error && (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Ionicons name="alert-circle-outline" size={12} color={T.red} />
          <Text style={inp.errorTxt}>{error}</Text>
        </View>
      )}
    </View>
  );
};
const inp = StyleSheet.create({
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  hint: { fontSize: 11, color: T.textMuted },
  row: {
    flexDirection: "row",
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 12,
  },
  focused: {
    borderColor: T.blue,
    backgroundColor: "#fff",
    shadowColor: T.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  errored: { borderColor: T.red },
  input: { flex: 1, fontSize: 14, color: T.text },
  errorTxt: { fontSize: 11, color: T.red, fontWeight: "600" },
});

// ─────────────────────────────────────────────────────────────
//  DEPARTMENT SELECTOR MODAL
// ─────────────────────────────────────────────────────────────
const DeptSelectorModal = ({ visible, selected, onDone, onClose }) => {
  const [local, setLocal] = useState(selected);
  const toggle = (d) =>
    setLocal((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={ds.overlay}>
        <View style={ds.sheet}>
          <View style={ds.handle} />
          <View style={ds.header}>
            <Text style={ds.title}>Select Departments</Text>
            <TouchableOpacity style={ds.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color={T.textMuted} />
            </TouchableOpacity>
          </View>
          <ScrollView contentContainerStyle={{ paddingVertical: 8 }}>
            {DEPARTMENTS.map((d) => {
              const isActive = local.includes(d);
              return (
                <TouchableOpacity
                  key={d}
                  style={ds.row}
                  onPress={() => toggle(d)}
                  activeOpacity={0.8}
                >
                  <View style={[ds.checkbox, isActive && ds.checkboxActive]}>
                    {isActive && (
                      <Ionicons name="checkmark" size={13} color="#fff" />
                    )}
                  </View>
                  <Text
                    style={[
                      ds.rowTxt,
                      isActive && { color: T.blue, fontWeight: "700" },
                    ]}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={ds.footer}>
            <TouchableOpacity style={ds.cancelBtn} onPress={onClose}>
              <Text style={ds.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ds.doneBtn}
              onPress={() => {
                onDone(local);
                onClose();
              }}
            >
              <Text style={ds.doneTxt}>Confirm ({local.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const ds = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "70%",
    paddingBottom: 10,
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
    borderBottomColor: T.border,
  },
  title: { fontSize: 16, fontWeight: "800", color: T.text },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: { backgroundColor: T.blue, borderColor: T.blue },
  rowTxt: { fontSize: 14, color: T.text },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: "center",
  },
  cancelTxt: { fontSize: 13, fontWeight: "700", color: T.textSub },
  doneBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: T.blue,
    alignItems: "center",
  },
  doneTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  EMPLOYEE SELECTOR MODAL
// ─────────────────────────────────────────────────────────────
const EmpSelectorModal = ({ visible, selected, onDone, onClose }) => {
  const [local, setLocal] = useState(selected);
  const [search, setSearch] = useState("");
  const toggle = (e) =>
    setLocal((prev) =>
      prev.find((x) => x.id === e.id)
        ? prev.filter((x) => x.id !== e.id)
        : [...prev, e],
    );
  const filtered = EMPLOYEES.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.dept.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={es.overlay}>
        <View style={es.sheet}>
          <View style={es.handle} />
          <View style={es.header}>
            <Text style={es.title}>Select Employees</Text>
            <TouchableOpacity style={es.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color={T.textMuted} />
            </TouchableOpacity>
          </View>
          <View style={es.searchWrap}>
            <Ionicons name="search-outline" size={15} color={T.textMuted} />
            <TextInput
              style={es.searchInput}
              placeholder="Search employees…"
              placeholderTextColor={T.textMuted}
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            {filtered.map((emp) => {
              const isActive = !!local.find((x) => x.id === emp.id);
              return (
                <TouchableOpacity
                  key={emp.id}
                  style={[es.row, isActive && es.rowActive]}
                  onPress={() => toggle(emp)}
                  activeOpacity={0.8}
                >
                  <View style={[es.checkbox, isActive && es.checkboxActive]}>
                    {isActive && (
                      <Ionicons name="checkmark" size={13} color="#fff" />
                    )}
                  </View>
                  <View
                    style={[
                      es.avatar,
                      { backgroundColor: avatarColor(emp.name) },
                    ]}
                  >
                    <Text style={es.avatarTxt}>{emp.initials}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[es.empName, isActive && { color: T.blue }]}>
                      {emp.name}
                    </Text>
                    <Text style={es.empDept}>{emp.dept}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          <View style={es.footer}>
            <TouchableOpacity style={es.cancelBtn} onPress={onClose}>
              <Text style={es.cancelTxt}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={es.doneBtn}
              onPress={() => {
                onDone(local);
                onClose();
                setSearch("");
              }}
            >
              <Text style={es.doneTxt}>Confirm ({local.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const es = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    paddingBottom: 10,
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
    borderBottomColor: T.border,
  },
  title: { fontSize: 16, fontWeight: "800", color: T.text },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    margin: 14,
    backgroundColor: T.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: T.border,
  },
  searchInput: { flex: 1, fontSize: 13, color: T.text },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  rowActive: { backgroundColor: T.blueSoft },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxActive: { backgroundColor: T.blue, borderColor: T.blue },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 11, fontWeight: "800", color: "#fff" },
  empName: { fontSize: 13, fontWeight: "700", color: T.text },
  empDept: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: T.border,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: "center",
  },
  cancelTxt: { fontSize: 13, fontWeight: "700", color: T.textSub },
  doneBtn: {
    flex: 2,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: T.blue,
    alignItems: "center",
  },
  doneTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  SUCCESS MODAL
// ─────────────────────────────────────────────────────────────
const SuccessModal = ({ visible, onClose, isDraft }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={sm.overlay}>
      <View style={sm.card}>
        <View
          style={[
            sm.iconCircle,
            { backgroundColor: isDraft ? T.amber : T.blue },
          ]}
        >
          <Ionicons
            name={isDraft ? "save-outline" : "checkmark-circle-outline"}
            size={34}
            color="#fff"
          />
        </View>
        <Text style={sm.title}>
          {isDraft ? "Saved as Draft" : "Announcement Published!"}
        </Text>
        <Text style={sm.sub}>
          {isDraft
            ? "Your announcement has been saved. You can publish it anytime from your drafts."
            : "Your announcement has been successfully sent to the selected audience."}
        </Text>
        <TouchableOpacity
          style={[sm.btn, { backgroundColor: isDraft ? T.amber : T.blue }]}
          onPress={onClose}
        >
          <Text style={sm.btnTxt}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);
const sm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 12,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: "900",
    color: T.text,
    textAlign: "center",
  },
  sub: { fontSize: 13, color: T.textSub, textAlign: "center", lineHeight: 20 },
  btn: {
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 4,
  },
  btnTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function CreateAnnouncementScreen({ navigation }) {
  // Form state
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [priority, setPriority] = useState("normal");
  const [audience, setAudience] = useState("all");
  const [selectedDepts, setSelectedDepts] = useState([]);
  const [selectedEmps, setSelectedEmps] = useState([]);
  const [attachments, setAttachments] = useState([]);

  // UI state
  const [errors, setErrors] = useState({});
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [showEmpPicker, setShowEmpPicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDraft, setIsDraft] = useState(false);

  // Simulate file picking
  const addAttachment = (mock) => {
    if (attachments.find((a) => a.id === mock.id)) return;
    setAttachments((prev) => [...prev, mock]);
  };
  const removeAttachment = (id) =>
    setAttachments((prev) => prev.filter((a) => a.id !== id));

  const validate = () => {
    const e = {};
    if (!title.trim()) e.title = "Title is required";
    if (!message.trim()) e.message = "Message is required";
    if (audience === "dept" && selectedDepts.length === 0)
      e.audience = "Please select at least one department";
    if (audience === "selected" && selectedEmps.length === 0)
      e.audience = "Please select at least one employee";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handlePublish = () => {
    if (!validate()) return;
    setIsDraft(false);
    setShowSuccess(true);
  };

  const handleDraft = () => {
    if (!title.trim()) {
      setErrors({ title: "Title is required to save as draft" });
      return;
    }
    setErrors({});
    setIsDraft(true);
    setShowSuccess(true);
  };

  const handleReset = () => {
    setTitle("");
    setMessage("");
    setPriority("normal");
    setAudience("all");
    setSelectedDepts([]);
    setSelectedEmps([]);
    setAttachments([]);
    setErrors({});
  };

  const priorityMeta = PRIORITY_OPTIONS.find((p) => p.key === priority);

  // Audience summary line
  const audienceSummary =
    audience === "all"
      ? `${EMPLOYEES.length} employees will receive this`
      : audience === "dept"
        ? selectedDepts.length > 0
          ? `${selectedDepts.join(", ")}`
          : "No departments selected"
        : selectedEmps.length > 0
          ? selectedEmps.map((e) => e.name).join(", ")
          : "No employees selected";

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Top bar ── */}
      <View style={s.topBar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={18} color={T.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={s.pageTitle}>Create Announcement</Text>
          <Text style={s.pageSub}>Compose & send to your team</Text>
        </View>
        <TouchableOpacity style={s.draftBtn} onPress={handleDraft}>
          <Ionicons name="save-outline" size={14} color={T.textSub} />
          <Text style={s.draftTxt}>Save Draft</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── 1. Content ── */}
          <SectionCard
            icon="megaphone-outline"
            iconColor={T.blue}
            iconBg={T.blueSoft}
            title="Announcement Content"
          >
            <FInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Q1 Company All-Hands Meeting"
              icon="text-outline"
              required
              error={errors.title}
              maxLength={100}
            />

            <FInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              placeholder="Write your announcement message here. Be clear and concise…"
              icon="document-text-outline"
              required
              error={errors.message}
              multiline
              minHeight={130}
              hint="Supports plain text"
            />
          </SectionCard>

          {/* ── 2. Priority ── */}
          <SectionCard
            icon="flag-outline"
            iconColor={T.amber}
            iconBg={T.amberSoft}
            title="Priority Level"
          >
            <View style={pr.row}>
              {PRIORITY_OPTIONS.map((p) => {
                const isActive = priority === p.key;
                return (
                  <TouchableOpacity
                    key={p.key}
                    style={[
                      pr.chip,
                      isActive && {
                        borderColor: p.color,
                        backgroundColor: p.color + "12",
                      },
                    ]}
                    onPress={() => setPriority(p.key)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={p.icon}
                      size={15}
                      color={isActive ? p.color : T.textMuted}
                    />
                    <Text
                      style={[
                        pr.chipTxt,
                        isActive && { color: p.color, fontWeight: "800" },
                      ]}
                    >
                      {p.label}
                    </Text>
                    {isActive && (
                      <View
                        style={[pr.activeDot, { backgroundColor: p.color }]}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View
              style={[
                pr.infoRow,
                { backgroundColor: priorityMeta.color + "10" },
              ]}
            >
              <Ionicons
                name={priorityMeta.icon}
                size={13}
                color={priorityMeta.color}
              />
              <Text style={[pr.infoTxt, { color: priorityMeta.color }]}>
                {priority === "normal" &&
                  "Standard announcement — delivered in the regular feed."}
                {priority === "medium" &&
                  "Medium priority — highlighted in the feed with an alert badge."}
                {priority === "urgent" &&
                  "Urgent — employees will receive an immediate push notification."}
              </Text>
            </View>
          </SectionCard>

          {/* ── 3. Audience ── */}
          <SectionCard
            icon="people-outline"
            iconColor={T.purple}
            iconBg={T.purpleSoft}
            title="Target Audience"
          >
            {/* Audience type options */}
            {AUDIENCE_OPTIONS.map((opt) => {
              const isActive = audience === opt.key;
              return (
                <TouchableOpacity
                  key={opt.key}
                  style={[au.option, isActive && au.optionActive]}
                  onPress={() => {
                    setAudience(opt.key);
                    setErrors((e) => ({ ...e, audience: undefined }));
                  }}
                  activeOpacity={0.85}
                >
                  <View style={[au.optIcon, isActive && au.optIconActive]}>
                    <Ionicons
                      name={opt.icon}
                      size={16}
                      color={isActive ? T.blue : T.textMuted}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[au.optLabel, isActive && { color: T.blue }]}>
                      {opt.label}
                    </Text>
                    <Text style={au.optDesc}>{opt.desc}</Text>
                  </View>
                  <View style={[au.radio, isActive && au.radioActive]}>
                    {isActive && <View style={au.radioDot} />}
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Department selector */}
            {audience === "dept" && (
              <View style={au.subSection}>
                <TouchableOpacity
                  style={au.selectorBtn}
                  onPress={() => setShowDeptPicker(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons name="business-outline" size={15} color={T.blue} />
                  <Text style={au.selectorTxt}>
                    {selectedDepts.length > 0
                      ? `${selectedDepts.length} department${selectedDepts.length > 1 ? "s" : ""} selected`
                      : "Tap to select departments"}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={T.textMuted}
                  />
                </TouchableOpacity>
                {selectedDepts.length > 0 && (
                  <View style={au.tagWrap}>
                    {selectedDepts.map((d) => (
                      <TouchableOpacity
                        key={d}
                        style={au.tag}
                        onPress={() =>
                          setSelectedDepts((prev) =>
                            prev.filter((x) => x !== d),
                          )
                        }
                      >
                        <Text style={au.tagTxt}>{d}</Text>
                        <Ionicons name="close" size={11} color={T.blue} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Employee selector */}
            {audience === "selected" && (
              <View style={au.subSection}>
                <TouchableOpacity
                  style={au.selectorBtn}
                  onPress={() => setShowEmpPicker(true)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="person-add-outline"
                    size={15}
                    color={T.blue}
                  />
                  <Text style={au.selectorTxt}>
                    {selectedEmps.length > 0
                      ? `${selectedEmps.length} employee${selectedEmps.length > 1 ? "s" : ""} selected`
                      : "Tap to select employees"}
                  </Text>
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={T.textMuted}
                  />
                </TouchableOpacity>
                {selectedEmps.length > 0 && (
                  <View style={au.tagWrap}>
                    {selectedEmps.map((e) => (
                      <TouchableOpacity
                        key={e.id}
                        style={au.tag}
                        onPress={() =>
                          setSelectedEmps((prev) =>
                            prev.filter((x) => x.id !== e.id),
                          )
                        }
                      >
                        <View
                          style={[
                            au.tagAvatar,
                            { backgroundColor: avatarColor(e.name) },
                          ]}
                        >
                          <Text style={au.tagAvatarTxt}>{e.initials}</Text>
                        </View>
                        <Text style={au.tagTxt}>{e.name.split(" ")[0]}</Text>
                        <Ionicons name="close" size={11} color={T.blue} />
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {errors.audience && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 4,
                  marginTop: -4,
                }}
              >
                <Ionicons name="alert-circle-outline" size={12} color={T.red} />
                <Text style={{ fontSize: 11, color: T.red, fontWeight: "600" }}>
                  {errors.audience}
                </Text>
              </View>
            )}

            {/* Summary strip */}
            <View style={au.summary}>
              <Ionicons
                name="information-circle-outline"
                size={14}
                color={T.blue}
              />
              <Text style={au.summaryTxt} numberOfLines={2}>
                {audienceSummary}
              </Text>
            </View>
          </SectionCard>

          {/* ── 4. Attachments ── */}
          <SectionCard
            icon="attach-outline"
            iconColor={T.green}
            iconBg={T.greenSoft}
            title="Attachments"
          >
            {/* Attachment list */}
            {attachments.length > 0 && (
              <View style={at.list}>
                {attachments.map((file) => {
                  const ft = getFileType(file.name);
                  return (
                    <View key={file.id} style={at.fileRow}>
                      <View style={[at.fileIcon, { backgroundColor: ft.bg }]}>
                        <Ionicons name={ft.icon} size={16} color={ft.color} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={at.fileName} numberOfLines={1}>
                          {file.name}
                        </Text>
                        <Text style={at.fileSize}>{file.size}</Text>
                      </View>
                      <TouchableOpacity
                        style={at.removeBtn}
                        onPress={() => removeAttachment(file.id)}
                      >
                        <Ionicons
                          name="close-circle"
                          size={18}
                          color={T.textMuted}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Upload area */}
            <View style={at.uploadArea}>
              <View style={at.uploadIcon}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={26}
                  color={T.blue}
                />
              </View>
              <Text style={at.uploadTitle}>Attach Files</Text>
              <Text style={at.uploadSub}>PDFs, Word docs, Excel, images</Text>

              {/* Mock file type buttons */}
              <View style={at.btnRow}>
                {[
                  {
                    label: "PDF / Doc",
                    icon: "document-text-outline",
                    mock: MOCK_ATTACHMENTS[0],
                  },
                  {
                    label: "Spreadsheet",
                    icon: "grid-outline",
                    mock: MOCK_ATTACHMENTS[1],
                  },
                  {
                    label: "Image",
                    icon: "image-outline",
                    mock: MOCK_ATTACHMENTS[2],
                  },
                ].map((b) => (
                  <TouchableOpacity
                    key={b.label}
                    style={[
                      at.typeBtn,
                      attachments.find((a) => a.id === b.mock.id) &&
                        at.typeBtnSelected,
                    ]}
                    onPress={() => addAttachment(b.mock)}
                    activeOpacity={0.8}
                  >
                    <Ionicons
                      name={b.icon}
                      size={14}
                      color={
                        attachments.find((a) => a.id === b.mock.id)
                          ? T.blue
                          : T.textSub
                      }
                    />
                    <Text
                      style={[
                        at.typeBtnTxt,
                        attachments.find((a) => a.id === b.mock.id) && {
                          color: T.blue,
                        },
                      ]}
                    >
                      {b.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <Text style={at.uploadNote}>Max file size: 20MB per file</Text>
            </View>
          </SectionCard>

          {/* ── 5. Preview strip ── */}
          {(title || message) && (
            <View style={pv.card}>
              <View style={pv.header}>
                <Ionicons name="eye-outline" size={13} color={T.blue} />
                <Text style={pv.headerTxt}>Preview</Text>
                <View
                  style={[
                    pv.priorityBadge,
                    { backgroundColor: priorityMeta.color + "15" },
                  ]}
                >
                  <Ionicons
                    name={priorityMeta.icon}
                    size={10}
                    color={priorityMeta.color}
                  />
                  <Text style={[pv.priorityTxt, { color: priorityMeta.color }]}>
                    {priorityMeta.label}
                  </Text>
                </View>
              </View>
              <Text style={pv.pvTitle} numberOfLines={1}>
                {title || "Announcement Title"}
              </Text>
              <Text style={pv.pvMessage} numberOfLines={3}>
                {message || "Your message will appear here…"}
              </Text>
              <View style={pv.footer}>
                <Ionicons name="people-outline" size={11} color={T.textMuted} />
                <Text style={pv.footerTxt} numberOfLines={1}>
                  {audience === "all"
                    ? "All Employees"
                    : audience === "dept"
                      ? `Depts: ${selectedDepts.join(", ") || "—"}`
                      : `${selectedEmps.length} employee(s)`}
                </Text>
                {attachments.length > 0 && (
                  <>
                    <View style={pv.dot} />
                    <Ionicons
                      name="attach-outline"
                      size={11}
                      color={T.textMuted}
                    />
                    <Text style={pv.footerTxt}>
                      {attachments.length} file
                      {attachments.length > 1 ? "s" : ""}
                    </Text>
                  </>
                )}
              </View>
            </View>
          )}

          {/* ── Actions ── */}
          <View style={s.actions}>
            <TouchableOpacity style={s.resetBtn} onPress={handleReset}>
              <Ionicons name="refresh-outline" size={15} color={T.textSub} />
              <Text style={s.resetTxt}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.publishBtn} onPress={handlePublish}>
              <Ionicons name="send-outline" size={15} color="#fff" />
              <Text style={s.publishTxt}>Publish Now</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modals */}
      <DeptSelectorModal
        visible={showDeptPicker}
        selected={selectedDepts}
        onDone={setSelectedDepts}
        onClose={() => setShowDeptPicker(false)}
      />
      <EmpSelectorModal
        visible={showEmpPicker}
        selected={selectedEmps}
        onDone={setSelectedEmps}
        onClose={() => setShowEmpPicker(false)}
      />
      <SuccessModal
        visible={showSuccess}
        isDraft={isDraft}
        onClose={() => {
          setShowSuccess(false);
          if (!isDraft) handleReset();
        }}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  PRIORITY STYLES
// ─────────────────────────────────────────────────────────────
const pr = StyleSheet.create({
  row: { flexDirection: "row", gap: 8 },
  chip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.bg,
    position: "relative",
  },
  chipTxt: { fontSize: 12, fontWeight: "700", color: T.textMuted },
  activeDot: {
    position: "absolute",
    top: 7,
    right: 7,
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    padding: 11,
    borderRadius: 10,
  },
  infoTxt: { flex: 1, fontSize: 12, fontWeight: "600", lineHeight: 17 },
});

// ─────────────────────────────────────────────────────────────
//  AUDIENCE STYLES
// ─────────────────────────────────────────────────────────────
const au = StyleSheet.create({
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.bg,
  },
  optionActive: { borderColor: T.blue, backgroundColor: T.blueSoft },
  optIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  optIconActive: { backgroundColor: T.blueSoft, borderColor: T.blue },
  optLabel: { fontSize: 13, fontWeight: "700", color: T.text },
  optDesc: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: T.blue },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: T.blue },
  subSection: { gap: 10 },
  selectorBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.blue,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  selectorTxt: { flex: 1, fontSize: 13, color: T.blue, fontWeight: "600" },
  tagWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.blueSoft,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  tagAvatar: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  tagAvatarTxt: { fontSize: 7, fontWeight: "800", color: "#fff" },
  tagTxt: { fontSize: 12, fontWeight: "700", color: T.blue },
  summary: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: T.blueSoft,
    borderRadius: 10,
    padding: 11,
  },
  summaryTxt: {
    flex: 1,
    fontSize: 12,
    color: T.blue,
    fontWeight: "600",
    lineHeight: 17,
  },
});

// ─────────────────────────────────────────────────────────────
//  ATTACHMENT STYLES
// ─────────────────────────────────────────────────────────────
const at = StyleSheet.create({
  list: { gap: 8 },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 11,
    borderWidth: 1,
    borderColor: T.border,
  },
  fileIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: { fontSize: 13, fontWeight: "600", color: T.text },
  fileSize: { fontSize: 10, color: T.textMuted, marginTop: 2 },
  removeBtn: { padding: 2 },
  uploadArea: {
    alignItems: "center",
    gap: 6,
    borderWidth: 1.5,
    borderColor: T.border,
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 22,
    backgroundColor: T.bg,
  },
  uploadIcon: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: T.blueSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  uploadTitle: { fontSize: 14, fontWeight: "800", color: T.text },
  uploadSub: { fontSize: 12, color: T.textMuted },
  btnRow: { flexDirection: "row", gap: 8, marginTop: 4 },
  typeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: "#fff",
  },
  typeBtnSelected: { borderColor: T.blue, backgroundColor: T.blueSoft },
  typeBtnTxt: { fontSize: 11, fontWeight: "700", color: T.textSub },
  uploadNote: { fontSize: 10, color: T.textMuted, marginTop: 4 },
});

// ─────────────────────────────────────────────────────────────
//  PREVIEW STYLES
// ─────────────────────────────────────────────────────────────
const pv = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 16,
    gap: 8,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  header: { flexDirection: "row", alignItems: "center", gap: 6 },
  headerTxt: {
    flex: 1,
    fontSize: 11,
    fontWeight: "700",
    color: T.blue,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  priorityTxt: { fontSize: 10, fontWeight: "700" },
  pvTitle: { fontSize: 15, fontWeight: "800", color: T.text },
  pvMessage: { fontSize: 13, color: T.textSub, lineHeight: 19 },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#F8FAFC",
  },
  footerTxt: { fontSize: 11, color: T.textMuted, flex: 1 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: T.border },
});

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 14,
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
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.bg,
    alignItems: "center",
    justifyContent: "center",
  },
  pageTitle: { fontSize: 16, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  draftBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: "#fff",
  },
  draftTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  scroll: { padding: 14, gap: 14, paddingBottom: 40 },
  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
  resetBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: "#fff",
  },
  resetTxt: { fontSize: 13, fontWeight: "700", color: T.textSub },
  publishBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    paddingVertical: 14,
    borderRadius: 13,
    backgroundColor: T.blue,
  },
  publishTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
