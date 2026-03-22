import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
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
  teal: "#0891B2",
  tealSoft: "#ECFEFF",
  orange: "#F97316",
};

// ─────────────────────────────────────────────────────────────
//  COLOUR PALETTE OPTIONS
// ─────────────────────────────────────────────────────────────
const DEPT_COLORS = [
  { color: "#0A66C2", soft: "#EFF6FF", label: "Blue" },
  { color: "#3B82F6", soft: "#EFF6FF", label: "Sky" },
  { color: "#10B981", soft: "#ECFDF5", label: "Green" },
  { color: "#F97316", soft: "#FFF7ED", label: "Orange" },
  { color: "#F59E0B", soft: "#FFFBEB", label: "Amber" },
  { color: "#EC4899", soft: "#FDF2F8", label: "Pink" },
  { color: "#8B5CF6", soft: "#F5F3FF", label: "Purple" },
  { color: "#0891B2", soft: "#ECFEFF", label: "Teal" },
  { color: "#DC2626", soft: "#FEF2F2", label: "Red" },
  { color: "#0F172A", soft: "#F1F5F9", label: "Navy" },
];

const DEPT_ICONS = [
  { icon: "code-slash-outline", label: "Engineering" },
  { icon: "cash-outline", label: "Finance" },
  { icon: "people-outline", label: "HR" },
  { icon: "color-palette-outline", label: "Design" },
  { icon: "megaphone-outline", label: "Marketing" },
  { icon: "settings-outline", label: "Operations" },
  { icon: "heart-outline", label: "CS" },
  { icon: "shield-checkmark-outline", label: "Legal" },
  { icon: "bar-chart-outline", label: "Analytics" },
  { icon: "laptop-outline", label: "IT" },
  { icon: "medkit-outline", label: "Medical" },
  { icon: "school-outline", label: "Training" },
  { icon: "storefront-outline", label: "Sales" },
  { icon: "construct-outline", label: "Product" },
  { icon: "globe-outline", label: "Intl" },
  { icon: "business-outline", label: "Admin" },
];

const EMPLOYEES = [
  {
    id: "Emp-001",
    name: "Anthony Lewis",
    position: "Finance Manager",
    dept: "Finance",
    photo: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    id: "Emp-002",
    name: "Brian Villalobos",
    position: "Senior Developer",
    dept: "Engineering",
    photo: "https://randomuser.me/api/portraits/men/44.jpg",
  },
  {
    id: "Emp-003",
    name: "Harvey Smith",
    position: "Junior Developer",
    dept: "Engineering",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
  },
  {
    id: "Emp-004",
    name: "Stephan Peralt",
    position: "Ops Manager",
    dept: "Operations",
    photo: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    id: "Emp-005",
    name: "Doglas Martini",
    position: "HR Manager",
    dept: "HR",
    photo: "https://randomuser.me/api/portraits/men/22.jpg",
  },
  {
    id: "Emp-006",
    name: "Priya Sharma",
    position: "UI/UX Designer",
    dept: "Design",
    photo: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: "Emp-007",
    name: "Sofia Martinez",
    position: "Marketing Lead",
    dept: "Marketing",
    photo: "https://randomuser.me/api/portraits/women/55.jpg",
  },
  {
    id: "Emp-008",
    name: "James Okafor",
    position: "Accountant",
    dept: "Finance",
    photo: "https://randomuser.me/api/portraits/men/77.jpg",
  },
];

const LOCATIONS = [
  "Floor 1, Block A",
  "Floor 1, Block B",
  "Floor 2, Block A",
  "Floor 2, Block B",
  "Floor 3, Block A",
  "Floor 3, Block C",
  "Floor 4, Block A",
  "Floor 5, Block B",
  "Remote",
];

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
  required,
  error,
  icon,
  prefix,
  hint,
  editable = true,
  multiline = false,
}) => {
  const [focused, setFocused] = useState(false);
  return (
    <View style={fi.wrap}>
      <View style={fi.labelRow}>
        <Text style={fi.label}>
          {label}
          {required && <Text style={{ color: T.red }}> *</Text>}
        </Text>
        {hint && <Text style={fi.hint}>{hint}</Text>}
      </View>
      <View
        style={[
          fi.row,
          focused && fi.focused,
          error && fi.errored,
          !editable && fi.disabled,
          multiline && { height: 80, alignItems: "flex-start", paddingTop: 12 },
        ]}
      >
        {icon && (
          <Ionicons
            name={icon}
            size={15}
            color={focused ? T.blue : T.textMuted}
            style={fi.icon}
          />
        )}
        {prefix && <Text style={fi.prefix}>{prefix}</Text>}
        <TextInput
          style={[fi.input, multiline && { textAlignVertical: "top" }]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={T.textMuted}
          keyboardType={keyboardType}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          editable={editable}
          multiline={multiline}
        />
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
  labelRow: { flexDirection: "row", justifyContent: "space-between" },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  hint: { fontSize: 10, color: T.textMuted },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    paddingHorizontal: 12,
    height: 50,
  },
  focused: {
    borderColor: T.blue,
    shadowColor: T.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  errored: { borderColor: T.red },
  disabled: { backgroundColor: T.bg },
  icon: { marginRight: 8 },
  prefix: {
    fontSize: 14,
    fontWeight: "700",
    color: T.textMuted,
    marginRight: 6,
  },
  input: { flex: 1, fontSize: 14, color: T.text },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  errorTxt: { fontSize: 11, color: T.red, fontWeight: "600" },
});

// ─────────────────────────────────────────────────────────────
//  SECTION CARD
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
//  EMPLOYEE PICKER MODAL
// ─────────────────────────────────────────────────────────────
const EmployeePicker = ({ selected, onSelect, label, required }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const filtered = EMPLOYEES.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.position.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={ep.wrap}>
      <Text style={ep.label}>
        {label}
        {required && <Text style={{ color: T.red }}> *</Text>}
      </Text>
      {selected ? (
        <TouchableOpacity
          style={ep.selectedCard}
          onPress={() => setOpen(true)}
          activeOpacity={0.85}
        >
          {selected.photo ? (
            <Image source={{ uri: selected.photo }} style={ep.avatar} />
          ) : (
            <View
              style={[
                ep.avatarFb,
                { backgroundColor: avatarColor(selected.name) },
              ]}
            >
              <Text style={ep.avatarTxt}>{getInitials(selected.name)}</Text>
            </View>
          )}
          <View style={{ flex: 1 }}>
            <Text style={ep.selectedName}>{selected.name}</Text>
            <Text style={ep.selectedRole}>{selected.position}</Text>
          </View>
          <Ionicons name="chevron-down" size={14} color={T.textMuted} />
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
            <View style={ep.handle} />
            <View style={ep.sheetHeader}>
              <Text style={ep.sheetTitle}>{label}</Text>
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
                placeholder="Search employees…"
                placeholderTextColor={T.textMuted}
                value={search}
                onChangeText={setSearch}
                autoCorrect={false}
              />
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              {filtered.map((emp) => {
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
                    {emp.photo ? (
                      <Image source={{ uri: emp.photo }} style={ep.empPhoto} />
                    ) : (
                      <View
                        style={[
                          ep.empPhotoFb,
                          { backgroundColor: avatarColor(emp.name) },
                        ]}
                      >
                        <Text style={ep.empPhotoTxt}>
                          {getInitials(emp.name)}
                        </Text>
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={ep.empName}>{emp.name}</Text>
                      <Text style={ep.empRole}>
                        {emp.position} · {emp.dept}
                      </Text>
                    </View>
                    {isActive && (
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={T.blue}
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
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  avatarFb: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 11, fontWeight: "800", color: "#fff" },
  selectedName: { fontSize: 13, fontWeight: "700", color: T.text },
  selectedRole: { fontSize: 10, color: T.textMuted, marginTop: 1 },
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
    paddingBottom: 30,
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
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  sheetTitle: { fontSize: 16, fontWeight: "800", color: T.text },
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
  empPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  empPhotoFb: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  empPhotoTxt: { fontSize: 12, fontWeight: "800", color: "#fff" },
  empName: { fontSize: 13, fontWeight: "700", color: T.text },
  empRole: { fontSize: 10, color: T.textMuted, marginTop: 2 },
});

// ─────────────────────────────────────────────────────────────
//  PICKER FIELD (generic dropdown)
// ─────────────────────────────────────────────────────────────
const PickerField = ({
  label,
  value,
  options,
  onSelect,
  icon,
  required,
  placeholder = "Select…",
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
            <View style={pf.dropHeader}>
              <Text style={pf.dropTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <Ionicons name="close" size={18} color={T.textMuted} />
              </TouchableOpacity>
            </View>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ maxHeight: 300 }}
            >
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
    maxHeight: 380,
  },
  dropHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  dropTitle: { fontSize: 15, fontWeight: "800", color: T.text },
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
//  LIVE PREVIEW CARD
// ─────────────────────────────────────────────────────────────
const LivePreview = ({ name, code, icon, color, soft, head, employees }) => {
  const hasContent = name || code || head;
  if (!hasContent) return null;

  return (
    <View style={lp.wrap}>
      <View style={lp.labelRow}>
        <Ionicons name="eye-outline" size={13} color={T.blue} />
        <Text style={lp.label}>Live Preview</Text>
      </View>
      <View style={lp.card}>
        <View style={[lp.bar, { backgroundColor: color }]} />
        <View style={lp.inner}>
          <View style={lp.topRow}>
            <View style={[lp.iconWrap, { backgroundColor: soft }]}>
              <Ionicons name={icon} size={18} color={color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={lp.name}>{name || "Department Name"}</Text>
              <View style={lp.codeRow}>
                <View style={[lp.codePill, { backgroundColor: soft }]}>
                  <Text style={[lp.codeTxt, { color }]}>{code || "CODE"}</Text>
                </View>
                <View style={lp.activeDot} />
                <Text style={lp.activeLabel}>Active</Text>
              </View>
            </View>
          </View>
          {head && (
            <View style={lp.headRow}>
              <View
                style={[
                  lp.headAvatar,
                  { backgroundColor: avatarColor(head.name || "") },
                ]}
              >
                {head.photo ? (
                  <Image
                    source={{ uri: head.photo }}
                    style={{ width: 28, height: 28, borderRadius: 14 }}
                  />
                ) : (
                  <Text style={lp.headAvatarTxt}>
                    {getInitials(head.name || "")}
                  </Text>
                )}
              </View>
              <View>
                <Text style={lp.headName}>{head.name}</Text>
                <Text style={lp.headRole}>{head.position}</Text>
              </View>
              <View style={lp.headBadge}>
                <Text style={lp.headBadgeTxt}>Head</Text>
              </View>
            </View>
          )}
          <View style={lp.statRow}>
            {[
              { val: employees || "0", label: "Members", color: color },
              { val: "0", label: "On Leave", color: T.amber },
              { val: "0", label: "Open Roles", color: T.blue },
            ].map((s, i) => (
              <React.Fragment key={s.label}>
                {i > 0 && <View style={lp.sep} />}
                <View style={lp.statCell}>
                  <Text style={[lp.statVal, { color: s.color }]}>{s.val}</Text>
                  <Text style={lp.statLabel}>{s.label}</Text>
                </View>
              </React.Fragment>
            ))}
          </View>
        </View>
      </View>
    </View>
  );
};
const lp = StyleSheet.create({
  wrap: { gap: 8 },
  labelRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: T.blue,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: T.blue,
    shadowColor: T.blue,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bar: { width: 4 },
  inner: { flex: 1, padding: 12, gap: 9 },
  topRow: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 14, fontWeight: "800", color: T.text, marginBottom: 4 },
  codeRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  codePill: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  codeTxt: { fontSize: 10, fontWeight: "800", letterSpacing: 0.5 },
  activeDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: T.green },
  activeLabel: { fontSize: 10, color: T.textMuted, fontWeight: "600" },
  headRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: T.bg,
    borderRadius: 10,
    padding: 8,
  },
  headAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headAvatarTxt: { fontSize: 9, fontWeight: "800", color: "#fff" },
  headName: { fontSize: 11, fontWeight: "700", color: T.text },
  headRole: { fontSize: 9, color: T.textMuted },
  headBadge: {
    marginLeft: "auto",
    backgroundColor: T.blueSoft,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 20,
  },
  headBadgeTxt: { fontSize: 9, fontWeight: "700", color: T.blue },
  statRow: {
    flexDirection: "row",
    backgroundColor: T.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: T.border,
  },
  sep: { width: 1, backgroundColor: T.border },
  statCell: { flex: 1, alignItems: "center", paddingVertical: 8 },
  statVal: { fontSize: 15, fontWeight: "900" },
  statLabel: {
    fontSize: 8,
    color: T.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },
});

// ─────────────────────────────────────────────────────────────
//  SUCCESS MODAL
// ─────────────────────────────────────────────────────────────
const SuccessModal = ({ visible, name, color, icon, soft, onClose }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <View style={sm.overlay}>
      <View style={sm.card}>
        <View style={[sm.iconCircle, { backgroundColor: color }]}>
          <Ionicons name={icon} size={32} color="#fff" />
        </View>
        <Text style={sm.title}>Department Created!</Text>
        <Text style={sm.sub}>
          <Text style={{ fontWeight: "800", color: T.text }}>{name}</Text> has
          been successfully added to your organization.
        </Text>
        <View style={[sm.deptChip, { backgroundColor: soft }]}>
          <Ionicons name={icon} size={14} color={color} />
          <Text style={[sm.deptChipTxt, { color }]}>{name}</Text>
        </View>
        <TouchableOpacity
          style={[sm.btn, { backgroundColor: color }]}
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
  title: { fontSize: 20, fontWeight: "900", color: T.text },
  sub: { fontSize: 13, color: T.textSub, textAlign: "center", lineHeight: 20 },
  deptChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  deptChipTxt: { fontSize: 14, fontWeight: "800" },
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
export default function AddDepartmentScreen({ navigation }) {
  // Basic
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  // Appearance
  const [selectedColor, setSelectedColor] = useState(DEPT_COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(DEPT_ICONS[0]);

  // People
  const [head, setHead] = useState(null);
  const [budgetTarget, setBudgetTarget] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // UI
  const [errors, setErrors] = useState({});
  const [showSuccess, setShowSuccess] = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Department name is required";
    if (!code.trim()) e.code = "Department code is required";
    if (!head) e.head = "Please assign a department head";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;
    setShowSuccess(true);
  };

  const handleReset = () => {
    setName("");
    setCode("");
    setDescription("");
    setLocation("");
    setSelectedColor(DEPT_COLORS[0]);
    setSelectedIcon(DEPT_ICONS[0]);
    setHead(null);
    setBudgetTarget("");
    setEmail("");
    setPhone("");
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
          <Text style={s.pageTitle}>Add Department</Text>
          <Text style={s.pageSub}>Departments · Add New</Text>
        </View>
        <TouchableOpacity style={s.resetBtn} onPress={handleReset}>
          <Ionicons name="refresh-outline" size={16} color={T.textMuted} />
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
          {/* Live preview */}
          <LivePreview
            name={name}
            code={code}
            icon={selectedIcon.icon}
            color={selectedColor.color}
            soft={selectedColor.soft}
            head={head}
            employees={0}
          />

          {/* ── Basic Info ── */}
          <SectionCard
            icon="information-circle-outline"
            iconColor={T.blue}
            iconBg={T.blueSoft}
            title="Basic Information"
          >
            <FieldInput
              label="Department Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Engineering"
              icon="business-outline"
              required
              error={errors.name}
            />
            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Dept. Code"
                  value={code}
                  onChangeText={(v) => setCode(v.toUpperCase())}
                  placeholder="e.g. ENG"
                  icon="code-outline"
                  required
                  error={errors.code}
                  hint="3–5 chars"
                />
              </View>
              <View style={{ flex: 1 }}>
                <PickerField
                  label="Office Location"
                  value={location}
                  options={LOCATIONS}
                  onSelect={setLocation}
                  icon="location-outline"
                />
              </View>
            </View>
            <FieldInput
              label="Description"
              value={description}
              onChangeText={setDescription}
              placeholder="Briefly describe this department's purpose and responsibilities…"
              multiline
            />
          </SectionCard>

          {/* ── Appearance ── */}
          <SectionCard
            icon="color-palette-outline"
            iconColor={T.purple}
            iconBg={T.purpleSoft}
            title="Appearance"
          >
            {/* Color picker */}
            <View style={ap.section}>
              <Text style={ap.sublabel}>Department Colour</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={ap.colorRow}
              >
                {DEPT_COLORS.map((c) => {
                  const isActive = selectedColor.color === c.color;
                  return (
                    <TouchableOpacity
                      key={c.color}
                      style={[
                        ap.colorSwatch,
                        { backgroundColor: c.color },
                        isActive && ap.colorSwatchActive,
                      ]}
                      onPress={() => setSelectedColor(c)}
                    >
                      {isActive && (
                        <Ionicons name="checkmark" size={14} color="#fff" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              <View
                style={[ap.preview, { backgroundColor: selectedColor.soft }]}
              >
                <View
                  style={[
                    ap.previewBar,
                    { backgroundColor: selectedColor.color },
                  ]}
                />
                <Text style={[ap.previewTxt, { color: selectedColor.color }]}>
                  {selectedColor.label} selected
                </Text>
              </View>
            </View>

            {/* Icon picker */}
            <View style={ap.section}>
              <Text style={ap.sublabel}>Department Icon</Text>
              <View style={ap.iconGrid}>
                {DEPT_ICONS.map((ic) => {
                  const isActive = selectedIcon.icon === ic.icon;
                  return (
                    <TouchableOpacity
                      key={ic.icon}
                      style={[
                        ap.iconCell,
                        isActive && {
                          backgroundColor: selectedColor.soft,
                          borderColor: selectedColor.color,
                        },
                      ]}
                      onPress={() => setSelectedIcon(ic)}
                    >
                      <Ionicons
                        name={ic.icon}
                        size={20}
                        color={isActive ? selectedColor.color : T.textMuted}
                      />
                      <Text
                        style={[
                          ap.iconLabel,
                          isActive && { color: selectedColor.color },
                        ]}
                      >
                        {ic.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </SectionCard>

          {/* ── People ── */}
          <SectionCard
            icon="people-outline"
            iconColor={T.green}
            iconBg={T.greenSoft}
            title="People & Leadership"
          >
            <EmployeePicker
              label="Department Head"
              selected={head}
              onSelect={setHead}
              required
            />
            {errors.head && (
              <View style={s.errorRow}>
                <Ionicons name="alert-circle-outline" size={12} color={T.red} />
                <Text style={s.errorTxt}>{errors.head}</Text>
              </View>
            )}
          </SectionCard>

          {/* ── Budget & Contact ── */}
          <SectionCard
            icon="cash-outline"
            iconColor={T.amber}
            iconBg={T.amberSoft}
            title="Budget & Contact"
          >
            <FieldInput
              label="Annual Budget Target"
              value={budgetTarget}
              onChangeText={setBudgetTarget}
              placeholder="0.00"
              keyboardType="numeric"
              prefix="$"
              icon="wallet-outline"
              hint="Optional"
            />
            <View style={s.row2}>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="dept@company.com"
                  icon="mail-outline"
                  keyboardType="email-address"
                />
              </View>
              <View style={{ flex: 1 }}>
                <FieldInput
                  label="Phone"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+1 (555)…"
                  icon="call-outline"
                  keyboardType="phone-pad"
                />
              </View>
            </View>
          </SectionCard>

          {/* Actions */}
          <View style={s.actions}>
            <TouchableOpacity style={s.cancelBtn} onPress={handleReset}>
              <Text style={s.cancelTxt}>Reset</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[s.saveBtn, { backgroundColor: selectedColor.color }]}
              onPress={handleSave}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={16}
                color="#fff"
              />
              <Text style={s.saveTxt}>Create Department</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        name={name}
        color={selectedColor.color}
        soft={selectedColor.soft}
        icon={selectedIcon.icon}
        onClose={() => {
          setShowSuccess(false);
          handleReset();
        }}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  APPEARANCE STYLES
// ─────────────────────────────────────────────────────────────
const ap = StyleSheet.create({
  section: { gap: 8 },
  sublabel: {
    fontSize: 11,
    fontWeight: "700",
    color: T.textSub,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  colorRow: { gap: 10, paddingVertical: 4 },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  colorSwatchActive: {
    borderWidth: 3,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  preview: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  previewBar: { width: 3, height: 18, borderRadius: 2 },
  previewTxt: { fontSize: 12, fontWeight: "700" },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  iconCell: {
    width: "22%",
    aspectRatio: 1,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.bg,
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
  },
  iconLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: T.textMuted,
    textAlign: "center",
  },
});

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
  scroll: { padding: 14, gap: 14, paddingBottom: 40 },
  row2: { flexDirection: "row", gap: 10 },
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
    paddingVertical: 15,
    borderRadius: 13,
  },
  saveTxt: { fontSize: 14, fontWeight: "700", color: "#fff" },
});
