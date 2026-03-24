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
  borderFocus: "#0A66C2",
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
  orange: "#F97316",
  orangeSoft: "#FFF7ED",
};

// ─────────────────────────────────────────────────────────────
//  MOCK EMPLOYEE LIST (for picker)
// ─────────────────────────────────────────────────────────────
const EMPLOYEES = [
  {
    id: "Emp-001",
    name: "Anthony Lewis",
    department: "Finance",
    position: "Finance Manager",
  },
  {
    id: "Emp-002",
    name: "Brian Villalobos",
    department: "Engineering",
    position: "Senior Developer",
  },
  {
    id: "Emp-003",
    name: "Harvey Smith",
    department: "Engineering",
    position: "Junior Developer",
  },
  {
    id: "Emp-004",
    name: "Stephan Peralt",
    department: "Operations",
    position: "Operations Manager",
  },
  {
    id: "Emp-005",
    name: "Doglas Martini",
    department: "HR",
    position: "HR Manager",
  },
  {
    id: "Emp-006",
    name: "Priya Sharma",
    department: "Design",
    position: "UI/UX Designer",
  },
  {
    id: "Emp-007",
    name: "Sofia Martinez",
    department: "Marketing",
    position: "Marketing Lead",
  },
  {
    id: "Emp-008",
    name: "James Okafor",
    department: "Finance",
    position: "Accountant",
  },
];

const DEPT_COLORS = {
  Finance: { bg: "#FFF7ED", accent: "#F97316", text: "#9A3412" },
  Engineering: { bg: "#EFF6FF", accent: "#3B82F6", text: "#1E40AF" },
  Operations: { bg: "#F5F3FF", accent: "#8B5CF6", text: "#5B21B6" },
  HR: { bg: "#FDF2F8", accent: "#EC4899", text: "#9D174D" },
  Design: { bg: "#ECFDF5", accent: "#10B981", text: "#065F46" },
  Marketing: { bg: "#FFFBEB", accent: "#F59E0B", text: "#92400E" },
};

const PAY_FREQUENCIES = ["Monthly", "Bi-Weekly", "Weekly", "Annual"];
const PAY_GRADES = ["Grade A", "Grade B", "Grade C", "Grade D", "Grade E"];
const CURRENCIES = ["USD ($)", "GHS (₵)", "GBP (£)", "EUR (€)", "NGN (₦)"];

const getInitials = (name = "") =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

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

// ─────────────────────────────────────────────────────────────
//  FIELD INPUT
// ─────────────────────────────────────────────────────────────
const FieldInput = ({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = "default",
  prefix,
  suffix,
  required,
  error,
  hint,
  icon,
  editable = true,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fi.wrap}>
      <View style={fi.labelRow}>
        <Text style={fi.label}>
          {label}
          {required && <Text style={fi.req}> *</Text>}
        </Text>
        {hint && <Text style={fi.hint}>{hint}</Text>}
      </View>
      <View
        style={[
          fi.inputRow,
          focused && fi.inputFocused,
          error && fi.inputError,
          !editable && fi.inputDisabled,
        ]}
      >
        {icon && (
          <View style={fi.iconWrap}>
            <Ionicons
              name={icon}
              size={15}
              color={focused ? T.blue : T.textMuted}
            />
          </View>
        )}
        {prefix && <Text style={fi.prefix}>{prefix}</Text>}
        <TextInput
          style={fi.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={T.textMuted}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
        />
        {suffix && <Text style={fi.suffix}>{suffix}</Text>}
      </View>
      {error && (
        <View style={fi.errorRow}>
          <Ionicons name="alert-circle-outline" size={12} color={T.red} />
          <Text style={fi.errorTxt}>{error}</Text>
        </View>
      )}
    </View>
  );
};

const fi = StyleSheet.create({
  wrap: { gap: 6 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  req: { color: T.red },
  hint: { fontSize: 10, color: T.textMuted },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 12,
    height: 50,
  },
  inputFocused: {
    borderColor: T.blue,
    shadowColor: T.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  inputError: { borderColor: T.red },
  inputDisabled: { backgroundColor: T.bg },
  iconWrap: { marginRight: 8 },
  prefix: {
    fontSize: 14,
    fontWeight: "700",
    color: T.textMuted,
    marginRight: 6,
  },
  suffix: { fontSize: 12, color: T.textMuted, marginLeft: 4 },
  input: { flex: 1, fontSize: 14, color: T.text },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  errorTxt: { fontSize: 11, color: T.red, fontWeight: "600" },
});

// ─────────────────────────────────────────────────────────────
//  PICKER FIELD
// ─────────────────────────────────────────────────────────────
const PickerField = ({
  label,
  value,
  options,
  onSelect,
  icon,
  required,
  placeholder = "Select...",
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={pf.wrap}>
      <Text style={pf.label}>
        {label}
        {required && <Text style={{ color: T.red }}> *</Text>}
      </Text>
      <TouchableOpacity
        style={[pf.trigger, open && pf.triggerOpen]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={15}
            color={value ? T.blue : T.textMuted}
            style={{ marginRight: 8 }}
          />
        )}
        <Text style={[pf.triggerTxt, !value && { color: T.textMuted }]}>
          {value || placeholder}
        </Text>
        <Ionicons name="chevron-down" size={14} color={T.textMuted} />
      </TouchableOpacity>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={pf.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={pf.dropdown}>
            <View style={pf.dropdownHeader}>
              <Text style={pf.dropdownTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={18} color={T.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {options.map((opt) => {
                const isActive = value === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[pf.option, isActive && pf.optionActive]}
                    onPress={() => {
                      onSelect(opt);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[pf.optionTxt, isActive && pf.optionTxtActive]}
                    >
                      {opt}
                    </Text>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={16}
                        color={T.blue}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const pf = StyleSheet.create({
  wrap: { gap: 6 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 12,
    height: 50,
  },
  triggerOpen: { borderColor: T.blue },
  triggerTxt: { flex: 1, fontSize: 14, color: T.text },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 24,
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 18,
    overflow: "hidden",
    maxHeight: 360,
  },
  dropdownHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  dropdownTitle: { fontSize: 15, fontWeight: "800", color: T.text },
  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  optionActive: { backgroundColor: T.blueSoft },
  optionTxt: { fontSize: 14, color: T.text },
  optionTxtActive: { color: T.blue, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────
//  EMPLOYEE PICKER MODAL
// ─────────────────────────────────────────────────────────────
const EmployeePicker = ({ selected, onSelect }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filtered = EMPLOYEES.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase()) ||
      e.department.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={ep.wrap}>
      <Text style={ep.label}>
        Employee <Text style={{ color: T.red }}>*</Text>
      </Text>

      {selected ? (
        <TouchableOpacity
          style={ep.selectedCard}
          onPress={() => setOpen(true)}
          activeOpacity={0.85}
        >
          <View
            style={[ep.avatar, { backgroundColor: avatarColor(selected.name) }]}
          >
            <Text style={ep.avatarTxt}>{getInitials(selected.name)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={ep.empName}>{selected.name}</Text>
            <Text style={ep.empMeta}>
              {selected.id} · {selected.department}
            </Text>
          </View>
          <View
            style={[
              ep.deptBadge,
              { backgroundColor: DEPT_COLORS[selected.department]?.bg || T.bg },
            ]}
          >
            <Text
              style={[
                ep.deptBadgeTxt,
                { color: DEPT_COLORS[selected.department]?.text || T.textSub },
              ]}
            >
              {selected.position}
            </Text>
          </View>
          <Ionicons
            name="chevron-down"
            size={14}
            color={T.textMuted}
            style={{ marginLeft: 6 }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={ep.trigger}
          onPress={() => setOpen(true)}
          activeOpacity={0.8}
        >
          <Ionicons name="person-outline" size={15} color={T.textMuted} />
          <Text style={ep.triggerTxt}>Select employee…</Text>
          <Ionicons name="chevron-down" size={14} color={T.textMuted} />
        </TouchableOpacity>
      )}

      <Modal
        visible={open}
        transparent
        animationType="slide"
        onRequestClose={() => setOpen(false)}
      >
        <View style={ep.overlay}>
          <View style={ep.sheet}>
            <View style={ep.sheetHandle} />
            <View style={ep.sheetHeader}>
              <Text style={ep.sheetTitle}>Select Employee</Text>
              <TouchableOpacity
                onPress={() => setOpen(false)}
                style={ep.closeBtn}
              >
                <Ionicons name="close" size={18} color={T.textMuted} />
              </TouchableOpacity>
            </View>
            <View style={ep.searchWrap}>
              <Ionicons name="search-outline" size={15} color={T.textMuted} />
              <TextInput
                style={ep.searchInput}
                placeholder="Search name, ID, department…"
                placeholderTextColor={T.textMuted}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
              {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch("")}>
                  <Ionicons name="close-circle" size={15} color={T.textMuted} />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1 }}
            >
              {filtered.map((emp) => {
                const dept = DEPT_COLORS[emp.department] || {
                  bg: T.bg,
                  accent: T.textMuted,
                  text: T.textSub,
                };
                const isActive = selected?.id === emp.id;
                return (
                  <TouchableOpacity
                    key={emp.id}
                    style={[ep.empRow, isActive && ep.empRowActive]}
                    onPress={() => {
                      onSelect(emp);
                      setOpen(false);
                      setSearch("");
                    }}
                  >
                    <View
                      style={[
                        ep.empAvatar,
                        { backgroundColor: avatarColor(emp.name) },
                      ]}
                    >
                      <Text style={ep.empAvatarTxt}>
                        {getInitials(emp.name)}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={ep.empRowName}>{emp.name}</Text>
                      <Text style={ep.empRowMeta}>
                        {emp.id} · {emp.position}
                      </Text>
                    </View>
                    <View style={[ep.empDeptTag, { backgroundColor: dept.bg }]}>
                      <View
                        style={[
                          ep.empDeptDot,
                          { backgroundColor: dept.accent },
                        ]}
                      />
                      <Text style={[ep.empDeptTxt, { color: dept.text }]}>
                        {emp.department}
                      </Text>
                    </View>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={T.blue}
                        style={{ marginLeft: 6 }}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const ep = StyleSheet.create({
  wrap: { gap: 6 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 12,
    height: 50,
  },
  triggerTxt: { flex: 1, fontSize: 14, color: T.textMuted },
  selectedCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: T.blueSoft,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.blue,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 12, fontWeight: "800", color: "#fff" },
  empName: { fontSize: 13, fontWeight: "700", color: T.text },
  empMeta: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  deptBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  deptBadgeTxt: { fontSize: 10, fontWeight: "700" },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "80%",
    paddingBottom: 30,
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  sheetTitle: { fontSize: 17, fontWeight: "800", color: T.text },
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
    margin: 16,
    backgroundColor: T.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1,
    borderColor: T.border,
  },
  searchInput: { flex: 1, fontSize: 13, color: T.text },
  empRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  empRowActive: { backgroundColor: T.blueSoft },
  empAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  empAvatarTxt: { fontSize: 12, fontWeight: "800", color: "#fff" },
  empRowName: { fontSize: 13, fontWeight: "700", color: T.text },
  empRowMeta: { fontSize: 10, color: T.textMuted, marginTop: 2 },
  empDeptTag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  empDeptDot: { width: 5, height: 5, borderRadius: 2.5 },
  empDeptTxt: { fontSize: 10, fontWeight: "700" },
});

// ─────────────────────────────────────────────────────────────
//  SECTION CARD WRAPPER
// ─────────────────────────────────────────────────────────────
const SectionCard = ({ icon, title, color = T.blue, children }) => (
  <View style={sc.card}>
    <View style={sc.header}>
      <View style={[sc.iconWrap, { backgroundColor: color + "18" }]}>
        <Ionicons name={icon} size={15} color={color} />
      </View>
      <Text style={sc.title}>{title}</Text>
    </View>
    <View style={sc.body}>{children}</View>
  </View>
);

const sc = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
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
//  NET PAY PREVIEW
// ─────────────────────────────────────────────────────────────
const NetPayPreview = ({
  basic,
  housing,
  transport,
  medical,
  bonus,
  tax,
  pension,
  other,
}) => {
  const additions = [basic, housing, transport, medical, bonus].map(
    (v) => parseFloat(v) || 0,
  );
  const deductions = [tax, pension, other].map((v) => parseFloat(v) || 0);
  const grossPay = additions.reduce((a, b) => a + b, 0);
  const totalDeductions = deductions.reduce((a, b) => a + b, 0);
  const netPay = grossPay - totalDeductions;

  return (
    <View style={np.card}>
      <View style={np.hero}>
        <View style={np.blob} />
        <View>
          <Text style={np.eyebrow}>NET PAY PREVIEW</Text>
          <Text style={np.amount}>
            $
            {netPay.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </Text>
          <Text style={np.sub}>Calculated automatically</Text>
        </View>
        <View style={np.ring}>
          <Text style={np.ringNum}>
            {grossPay > 0 ? Math.round((netPay / grossPay) * 100) : 0}%
          </Text>
          <Text style={np.ringLbl}>of gross</Text>
        </View>
      </View>
      <View style={np.breakdown}>
        <View style={np.breakRow}>
          <View style={np.breakLeft}>
            <View style={[np.breakDot, { backgroundColor: T.green }]} />
            <Text style={np.breakLabel}>Gross Pay</Text>
          </View>
          <Text style={[np.breakVal, { color: T.green }]}>
            ${grossPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={np.breakRow}>
          <View style={np.breakLeft}>
            <View style={[np.breakDot, { backgroundColor: T.red }]} />
            <Text style={np.breakLabel}>Total Deductions</Text>
          </View>
          <Text style={[np.breakVal, { color: T.red }]}>
            -$
            {totalDeductions.toLocaleString("en-US", {
              minimumFractionDigits: 2,
            })}
          </Text>
        </View>
        <View style={np.divider} />
        <View style={np.breakRow}>
          <Text style={np.netLabel}>Net Pay</Text>
          <Text style={np.netVal}>
            ${netPay.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>
    </View>
  );
};

const np = StyleSheet.create({
  card: {
    backgroundColor: T.navy,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 0,
  },
  hero: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    position: "relative",
  },
  blob: {
    position: "absolute",
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: T.blue,
    opacity: 0.12,
    top: -50,
    right: -30,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  amount: { fontSize: 28, fontWeight: "900", color: "#fff", letterSpacing: -1 },
  sub: { fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 3 },
  ring: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  ringNum: { fontSize: 16, fontWeight: "900", color: "#fff" },
  ringLbl: { fontSize: 7, color: "rgba(255,255,255,0.4)", fontWeight: "700" },
  breakdown: {
    backgroundColor: "rgba(255,255,255,0.06)",
    margin: 12,
    marginTop: 0,
    borderRadius: 12,
    padding: 14,
    gap: 2,
  },
  breakRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  breakLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  breakDot: { width: 7, height: 7, borderRadius: 3.5 },
  breakLabel: { fontSize: 12, color: "rgba(255,255,255,0.6)" },
  breakVal: { fontSize: 13, fontWeight: "700" },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.1)",
    marginVertical: 4,
  },
  netLabel: { fontSize: 13, fontWeight: "800", color: "#fff" },
  netVal: { fontSize: 18, fontWeight: "900", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  SUCCESS MODAL
// ─────────────────────────────────────────────────────────────
const SuccessModal = ({ visible, employee, netPay, onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={sm.overlay}>
      <View style={sm.card}>
        <View style={sm.iconCircle}>
          <Ionicons name="checkmark" size={32} color="#fff" />
        </View>
        <Text style={sm.title}>Salary Added!</Text>
        <Text style={sm.sub}>
          Salary record for{" "}
          <Text style={{ fontWeight: "800", color: T.text }}>{employee}</Text>{" "}
          has been saved successfully.
        </Text>
        <View style={sm.netBox}>
          <Text style={sm.netLabel}>Net Pay</Text>
          <Text style={sm.netVal}>${netPay}</Text>
        </View>
        <TouchableOpacity style={sm.btn} onPress={onClose}>
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
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: T.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: "900", color: T.text },
  sub: { fontSize: 13, color: T.textSub, textAlign: "center", lineHeight: 20 },
  netBox: {
    backgroundColor: T.greenSoft,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 12,
    alignItems: "center",
    width: "100%",
  },
  netLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: T.green,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  netVal: { fontSize: 26, fontWeight: "900", color: T.green, marginTop: 2 },
  btn: {
    backgroundColor: T.blue,
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
export default function AddEmployeeSalaryScreen({ navigation }) {
  // Employee
  const [employee, setEmployee] = useState(null);

  // Basic info
  const [payGrade, setPayGrade] = useState("");
  const [currency, setCurrency] = useState("USD ($)");
  const [payFrequency, setPayFrequency] = useState("Monthly");
  const [effectiveDate, setEffectiveDate] = useState("");

  // Earnings
  const [basicSalary, setBasicSalary] = useState("");
  const [housingAllowance, setHousingAllowance] = useState("");
  const [transportAllowance, setTransportAllowance] = useState("");
  const [medicalAllowance, setMedicalAllowance] = useState("");
  const [bonus, setBonus] = useState("");

  // Deductions
  const [taxDeduction, setTaxDeduction] = useState("");
  const [pensionDeduction, setPensionDeduction] = useState("");
  const [otherDeduction, setOtherDeduction] = useState("");

  // Bank
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [sortCode, setSortCode] = useState("");

  // Notes
  const [notes, setNotes] = useState("");

  // UI state
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const netPay = (() => {
    const gross = [
      basicSalary,
      housingAllowance,
      transportAllowance,
      medicalAllowance,
      bonus,
    ]
      .map((v) => parseFloat(v) || 0)
      .reduce((a, b) => a + b, 0);
    const deductions = [taxDeduction, pensionDeduction, otherDeduction]
      .map((v) => parseFloat(v) || 0)
      .reduce((a, b) => a + b, 0);
    return (gross - deductions).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  })();

  const validate = () => {
    const e = {};
    if (!employee) e.employee = "Please select an employee";
    if (!basicSalary) e.basicSalary = "Basic salary is required";
    if (basicSalary && isNaN(parseFloat(basicSalary)))
      e.basicSalary = "Must be a valid number";
    if (!effectiveDate) e.effectiveDate = "Effective date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setShowSuccess(true);
  };

  const handleReset = () => {
    setEmployee(null);
    setPayGrade("");
    setCurrency("USD ($)");
    setPayFrequency("Monthly");
    setEffectiveDate("");
    setBasicSalary("");
    setHousingAllowance("");
    setTransportAllowance("");
    setMedicalAllowance("");
    setBonus("");
    setTaxDeduction("");
    setPensionDeduction("");
    setOtherDeduction("");
    setBankName("");
    setAccountNumber("");
    setAccountName("");
    setSortCode("");
    setNotes("");
    setErrors({});
  };

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top bar */}
      <View style={s.topBar}>
        <TouchableOpacity
          style={s.backBtn}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={18} color={T.text} />
        </TouchableOpacity>
        <View style={s.topCenter}>
          <Text style={s.pageTitle}>Add Employee Salary</Text>
          <Text style={s.pageSub}>Payroll · Employee Salary</Text>
        </View>
        <TouchableOpacity style={s.resetBtn} onPress={handleReset}>
          <Ionicons name="refresh-outline" size={15} color={T.textMuted} />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={s.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Net Pay Preview */}
          <NetPayPreview
            basic={basicSalary}
            housing={housingAllowance}
            transport={transportAllowance}
            medical={medicalAllowance}
            bonus={bonus}
            tax={taxDeduction}
            pension={pensionDeduction}
            other={otherDeduction}
          />

          {/* ── SECTION 1: Employee Info ── */}
          <SectionCard
            icon="person-circle-outline"
            title="Employee Information"
            color={T.blue}
          >
            <EmployeePicker selected={employee} onSelect={setEmployee} />
            {errors.employee && (
              <View style={s.errorRow}>
                <Ionicons name="alert-circle-outline" size={12} color={T.red} />
                <Text style={s.errorTxt}>{errors.employee}</Text>
              </View>
            )}
            {employee && (
              <View style={s.empInfoGrid}>
                {[
                  { label: "Employee ID", value: employee.id },
                  { label: "Department", value: employee.department },
                  { label: "Position", value: employee.position },
                ].map((r) => (
                  <View key={r.label} style={s.infoCell}>
                    <Text style={s.infoCellLabel}>{r.label}</Text>
                    <Text style={s.infoCellVal}>{r.value}</Text>
                  </View>
                ))}
              </View>
            )}
          </SectionCard>

          {/* ── SECTION 2: Salary Configuration ── */}
          <SectionCard
            icon="settings-outline"
            title="Salary Configuration"
            color={T.purple}
          >
            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <PickerField
                  label="Pay Grade"
                  value={payGrade}
                  options={PAY_GRADES}
                  onSelect={setPayGrade}
                  icon="ribbon-outline"
                  placeholder="Select grade"
                />
              </View>
              <View style={{ flex: 1 }}>
                <PickerField
                  label="Currency"
                  value={currency}
                  options={CURRENCIES}
                  onSelect={setCurrency}
                  icon="cash-outline"
                  required
                />
              </View>
            </View>
            <PickerField
              label="Pay Frequency"
              value={payFrequency}
              options={PAY_FREQUENCIES}
              onSelect={setPayFrequency}
              icon="repeat-outline"
              required
            />
            <FieldInput
              label="Effective Date"
              value={effectiveDate}
              onChangeText={setEffectiveDate}
              placeholder="e.g. 01 Mar 2026"
              icon="calendar-outline"
              required
              error={errors.effectiveDate}
            />
          </SectionCard>

          {/* ── SECTION 3: Earnings ── */}
          <SectionCard
            icon="trending-up-outline"
            title="Earnings & Allowances"
            color={T.green}
          >
            <FieldInput
              label="Basic Salary"
              value={basicSalary}
              onChangeText={setBasicSalary}
              placeholder="0.00"
              keyboardType="numeric"
              prefix="$"
              required
              hint="Per pay period"
              error={errors.basicSalary}
              icon="wallet-outline"
            />
            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Housing"
                  value={housingAllowance}
                  onChangeText={setHousingAllowance}
                  placeholder="0.00"
                  keyboardType="numeric"
                  prefix="$"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Transport"
                  value={transportAllowance}
                  onChangeText={setTransportAllowance}
                  placeholder="0.00"
                  keyboardType="numeric"
                  prefix="$"
                />
              </View>
            </View>
            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Medical"
                  value={medicalAllowance}
                  onChangeText={setMedicalAllowance}
                  placeholder="0.00"
                  keyboardType="numeric"
                  prefix="$"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Bonus"
                  value={bonus}
                  onChangeText={setBonus}
                  placeholder="0.00"
                  keyboardType="numeric"
                  prefix="$"
                />
              </View>
            </View>
            {/* Gross summary */}
            {basicSalary ? (
              <View style={s.grossBar}>
                <Ionicons name="calculator-outline" size={13} color={T.green} />
                <Text style={s.grossLabel}>Gross Pay</Text>
                <Text style={s.grossVal}>
                  $
                  {[
                    basicSalary,
                    housingAllowance,
                    transportAllowance,
                    medicalAllowance,
                    bonus,
                  ]
                    .map((v) => parseFloat(v) || 0)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Text>
              </View>
            ) : null}
          </SectionCard>

          {/* ── SECTION 4: Deductions ── */}
          <SectionCard
            icon="remove-circle-outline"
            title="Deductions"
            color={T.red}
          >
            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Tax"
                  value={taxDeduction}
                  onChangeText={setTaxDeduction}
                  placeholder="0.00"
                  keyboardType="numeric"
                  prefix="$"
                  hint="Income tax"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Pension"
                  value={pensionDeduction}
                  onChangeText={setPensionDeduction}
                  placeholder="0.00"
                  keyboardType="numeric"
                  prefix="$"
                />
              </View>
            </View>
            <FieldInput
              label="Other Deductions"
              value={otherDeduction}
              onChangeText={setOtherDeduction}
              placeholder="0.00"
              keyboardType="numeric"
              prefix="$"
              hint="Loans, advances, etc."
            />
            {taxDeduction || pensionDeduction || otherDeduction ? (
              <View style={[s.grossBar, { backgroundColor: T.redSoft }]}>
                <Ionicons name="calculator-outline" size={13} color={T.red} />
                <Text style={[s.grossLabel, { color: T.red }]}>
                  Total Deductions
                </Text>
                <Text style={[s.grossVal, { color: T.red }]}>
                  -$
                  {[taxDeduction, pensionDeduction, otherDeduction]
                    .map((v) => parseFloat(v) || 0)
                    .reduce((a, b) => a + b, 0)
                    .toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </Text>
              </View>
            ) : null}
          </SectionCard>

          {/* ── SECTION 5: Bank Details ── */}
          <SectionCard icon="card-outline" title="Bank Details" color={T.amber}>
            <FieldInput
              label="Bank Name"
              value={bankName}
              onChangeText={setBankName}
              placeholder="e.g. Barclays Bank"
              icon="business-outline"
            />
            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Account Number"
                  value={accountNumber}
                  onChangeText={setAccountNumber}
                  placeholder="XXXX XXXX"
                  keyboardType="numeric"
                  icon="keypad-outline"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Sort Code"
                  value={sortCode}
                  onChangeText={setSortCode}
                  placeholder="XX-XX-XX"
                  icon="git-branch-outline"
                />
              </View>
            </View>
            <FieldInput
              label="Account Name"
              value={accountName}
              onChangeText={setAccountName}
              placeholder="Name on account"
              icon="person-outline"
            />
          </SectionCard>

          {/* ── SECTION 6: Notes ── */}
          <SectionCard
            icon="document-text-outline"
            title="Notes"
            color={T.textMuted}
          >
            <View style={s.notesWrap}>
              <TextInput
                style={s.notesInput}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any additional notes or remarks about this salary entry…"
                placeholderTextColor={T.textMuted}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </SectionCard>

          {/* ── ACTION BUTTONS ── */}
          <View style={s.actions}>
            <TouchableOpacity style={s.cancelBtn} onPress={handleReset}>
              <Text style={s.cancelTxt}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.saveBtn} onPress={handleSave}>
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#fff"
              />
              <Text style={s.saveTxt}>Save Salary</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        employee={employee?.name || ""}
        netPay={netPay}
        onClose={() => {
          setShowSuccess(false);
          handleReset();
        }}
      />
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
  topCenter: { flex: 1 },
  pageTitle: { fontSize: 16, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  resetBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: T.bg,
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: { padding: 16, gap: 14, paddingBottom: 40 },

  row2: { flexDirection: "row", gap: 10 },

  empInfoGrid: {
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: T.border,
  },
  infoCell: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoCellLabel: { fontSize: 11, color: T.textMuted, fontWeight: "500" },
  infoCellVal: { fontSize: 12, color: T.text, fontWeight: "700" },

  grossBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: T.greenSoft,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  grossLabel: { flex: 1, fontSize: 12, fontWeight: "700", color: T.green },
  grossVal: { fontSize: 14, fontWeight: "900", color: T.green },

  notesWrap: {
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    padding: 12,
    minHeight: 90,
  },
  notesInput: { fontSize: 13, color: T.text, lineHeight: 20 },

  errorRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  errorTxt: { fontSize: 11, color: T.red, fontWeight: "600" },

  actions: { flexDirection: "row", gap: 10, marginTop: 4 },
  cancelBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  cancelTxt: { fontSize: 14, fontWeight: "700", color: T.textSub },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    backgroundColor: T.blue,
    paddingVertical: 15,
    borderRadius: 13,
  },
  saveTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
