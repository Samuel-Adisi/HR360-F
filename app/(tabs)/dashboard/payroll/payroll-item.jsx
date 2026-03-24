import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// ─── DATA ────────────────────────────────────────────────────
const INITIAL_ADDITIONS = [
  {
    id: "a1",
    name: "Leave Balance Amount",
    category: "Monthly Remuneration",
    amount: 5,
    unitCalc: false,
    assignee: "No Assignee",
  },
  {
    id: "a2",
    name: "Arrears of Salary",
    category: "Additional Remuneration",
    amount: 8,
    unitCalc: true,
    assignee: "All Employees",
  },
  {
    id: "a3",
    name: "Gratuity",
    category: "Monthly Remuneration",
    amount: 20,
    unitCalc: false,
    assignee: "No Assignee",
  },
];
const INITIAL_OVERTIME = [
  { id: "o1", name: "Normal day OT 1.5x", rateType: "Hourly 1.5", rate: 15 },
  { id: "o2", name: "Public holiday OT 2x", rateType: "Hourly 2.0", rate: 20 },
  { id: "o3", name: "Rest day OT 1.5x", rateType: "Hourly 1.5", rate: 15 },
];
const INITIAL_DEDUCTIONS = [
  {
    id: "d1",
    name: "Tax Deduction",
    category: "Monthly Deduction",
    amount: 10,
    unitCalc: false,
    assignee: "All Employees",
  },
  {
    id: "d2",
    name: "Health Insurance",
    category: "Additional Deduction",
    amount: 25,
    unitCalc: false,
    assignee: "All Employees",
  },
  {
    id: "d3",
    name: "Pension Contribution",
    category: "Monthly Deduction",
    amount: 50,
    unitCalc: true,
    assignee: "Select Employee",
  },
];

const CATEGORY_OPTIONS = [
  "Monthly Remuneration",
  "Additional Remuneration",
  "Monthly Deduction",
  "Additional Deduction",
];
const RATE_TYPE_OPTIONS = [
  "Hourly 1.0",
  "Hourly 1.5",
  "Hourly 2.0",
  "Daily 1.0",
  "Daily 1.5",
];
const ASSIGNEE_OPTIONS = ["No Assignee", "All Employees", "Select Employee"];
const SORT_OPTIONS = [
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "All Time",
];

const uid = () => Math.random().toString(36).slice(2, 9);

const DEPT_COLORS = {
  "Monthly Remuneration": { bg: "#EFF6FF", text: "#1D4ED8" },
  "Additional Remuneration": { bg: "#F0FDF4", text: "#166534" },
  "Monthly Deduction": { bg: "#FEF2F2", text: "#991B1B" },
  "Additional Deduction": { bg: "#FFF7ED", text: "#9A3412" },
  "Hourly 1.0": { bg: "#F5F3FF", text: "#6D28D9" },
  "Hourly 1.5": { bg: "#FFF7ED", text: "#9A3412" },
  "Hourly 2.0": { bg: "#FEF2F2", text: "#991B1B" },
  "Daily 1.0": { bg: "#ECFDF5", text: "#065F46" },
  "Daily 1.5": { bg: "#FFFBEB", text: "#92400E" },
};

// ─── DROPDOWN ────────────────────────────────────────────────
const Dropdown = ({ value, options, placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={dd.wrap}>
      <TouchableOpacity
        style={dd.trigger}
        onPress={() => setOpen(!open)}
        activeOpacity={0.8}
      >
        <Text style={value ? dd.value : dd.placeholder} numberOfLines={1}>
          {value || placeholder}
        </Text>
        <Ionicons
          name={open ? "chevron-up" : "chevron-down"}
          size={14}
          color="#64748B"
        />
      </TouchableOpacity>
      {open && (
        <View style={dd.menu}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[dd.item, value === opt && dd.itemActive]}
              onPress={() => {
                onChange(opt);
                setOpen(false);
              }}
            >
              <Text style={[dd.itemText, value === opt && dd.itemTextActive]}>
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
const dd = StyleSheet.create({
  wrap: { position: "relative", zIndex: 50, marginBottom: 0 },
  trigger: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  value: { flex: 1, fontSize: 14, color: "#1E293B", fontWeight: "500" },
  placeholder: { flex: 1, fontSize: 14, color: "#94A3B8" },
  menu: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    zIndex: 9999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  item: {
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  itemActive: { backgroundColor: "#FFF7ED" },
  itemText: { fontSize: 14, color: "#334155" },
  itemTextActive: { color: "#F97316", fontWeight: "700" },
});

// ─── FIELD ───────────────────────────────────────────────────
const Field = ({ label, children }) => (
  <View style={{ marginBottom: 20 }}>
    <Text
      style={{
        fontSize: 13,
        fontWeight: "700",
        color: "#334155",
        marginBottom: 8,
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}
    >
      {label}
    </Text>
    {children}
  </View>
);

// ─── ADDITION / DEDUCTION MODAL ──────────────────────────────
const AdditionModal = ({ visible, onClose, onSave, initial, mode, type }) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [category, setCategory] = useState(initial?.category ?? "");
  const [amount, setAmount] = useState(
    initial != null ? String(initial.amount) : "",
  );
  const [unitCalc, setUnitCalc] = useState(initial?.unitCalc ?? false);
  const [assignee, setAssignee] = useState(initial?.assignee ?? "No Assignee");

  React.useEffect(() => {
    if (visible) {
      setName(initial?.name ?? "");
      setCategory(initial?.category ?? "");
      setAmount(initial != null ? String(initial.amount) : "");
      setUnitCalc(initial?.unitCalc ?? false);
      setAssignee(initial?.assignee ?? "No Assignee");
    }
  }, [visible, initial]);

  const handleSave = () => {
    if (!name.trim()) return Alert.alert("Required", "Please enter a name.");
    if (!category) return Alert.alert("Required", "Please select a category.");
    if (!amount) return Alert.alert("Required", "Please enter an amount.");
    onSave({
      ...(initial || {}),
      name: name.trim(),
      category,
      amount: parseFloat(amount) || 0,
      unitCalc,
      assignee,
    });
    onClose();
  };

  const typeLabel = type === "deduction" ? "Deduction" : "Addition";
  const isEdit = mode === "edit";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={mo.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={mo.kav}
            >
              <View style={mo.sheet}>
                {/* Handle */}
                <View style={mo.handle} />

                {/* Header */}
                <View style={mo.header}>
                  <View style={mo.headerLeft}>
                    <View
                      style={[
                        mo.headerIcon,
                        {
                          backgroundColor:
                            type === "deduction" ? "#FEF2F2" : "#ECFDF5",
                        },
                      ]}
                    >
                      <Ionicons
                        name={
                          type === "deduction" ? "remove-circle" : "add-circle"
                        }
                        size={18}
                        color={type === "deduction" ? "#EF4444" : "#10B981"}
                      />
                    </View>
                    <Text style={mo.title}>
                      {isEdit ? `Edit ${typeLabel}` : `Add ${typeLabel}`}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={onClose} style={mo.closeBtn}>
                    <Ionicons name="close" size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={mo.body}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                >
                  <Field label="Name">
                    <TextInput
                      style={mo.input}
                      placeholder="e.g. Leave Balance Amount"
                      placeholderTextColor="#94A3B8"
                      value={name}
                      onChangeText={setName}
                      returnKeyType="next"
                    />
                  </Field>

                  <Field label="Category">
                    <Dropdown
                      value={category}
                      options={CATEGORY_OPTIONS}
                      placeholder="Select a category"
                      onChange={setCategory}
                    />
                  </Field>

                  <Field label="Amount">
                    <View style={mo.amountRow}>
                      <View style={{ flex: 1 }}>
                        <TextInput
                          style={mo.input}
                          placeholder="0.00"
                          placeholderTextColor="#94A3B8"
                          value={amount}
                          onChangeText={setAmount}
                          keyboardType="decimal-pad"
                        />
                      </View>
                      <TouchableOpacity
                        style={[mo.unitToggle, unitCalc && mo.unitToggleOn]}
                        onPress={() => setUnitCalc(!unitCalc)}
                      >
                        <Switch
                          value={unitCalc}
                          onValueChange={setUnitCalc}
                          trackColor={{ false: "#E2E8F0", true: "#F97316" }}
                          thumbColor="#fff"
                          style={{
                            transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
                          }}
                        />
                        <Text
                          style={[
                            mo.unitLabel,
                            unitCalc && { color: "#F97316" },
                          ]}
                        >
                          Unit Calc
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </Field>

                  <Field label="Assign To">
                    <View style={mo.assigneeWrap}>
                      {ASSIGNEE_OPTIONS.map((opt) => (
                        <TouchableOpacity
                          key={opt}
                          style={[
                            mo.assigneeOption,
                            assignee === opt && mo.assigneeOptionActive,
                          ]}
                          onPress={() => setAssignee(opt)}
                        >
                          <View
                            style={[
                              mo.radio,
                              assignee === opt && mo.radioActive,
                            ]}
                          >
                            {assignee === opt && <View style={mo.radioDot} />}
                          </View>
                          <Text
                            style={[
                              mo.assigneeLabel,
                              assignee === opt && {
                                color: "#F97316",
                                fontWeight: "700",
                              },
                            ]}
                          >
                            {opt}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </Field>

                  <View style={{ height: 8 }} />
                </ScrollView>

                {/* Footer */}
                <View style={mo.footer}>
                  <TouchableOpacity style={mo.cancelBtn} onPress={onClose}>
                    <Text style={mo.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={mo.saveBtn} onPress={handleSave}>
                    <Text style={mo.saveText}>
                      {isEdit ? "Save Changes" : `Add ${typeLabel}`}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

// ─── OVERTIME MODAL ──────────────────────────────────────────
const OvertimeModal = ({ visible, onClose, onSave, initial, mode }) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [rateType, setRateType] = useState(initial?.rateType ?? "");
  const [rate, setRate] = useState(initial != null ? String(initial.rate) : "");

  React.useEffect(() => {
    if (visible) {
      setName(initial?.name ?? "");
      setRateType(initial?.rateType ?? "");
      setRate(initial != null ? String(initial.rate) : "");
    }
  }, [visible, initial]);

  const handleSave = () => {
    if (!name.trim()) return Alert.alert("Required", "Please enter a name.");
    if (!rateType) return Alert.alert("Required", "Please select a rate type.");
    onSave({
      ...(initial || {}),
      name: name.trim(),
      rateType,
      rate: parseFloat(rate) || 0,
    });
    onClose();
  };

  const isEdit = mode === "edit";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={mo.overlay}>
          <TouchableWithoutFeedback>
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              style={mo.kav}
            >
              <View style={mo.sheet}>
                <View style={mo.handle} />
                <View style={mo.header}>
                  <View style={mo.headerLeft}>
                    <View
                      style={[mo.headerIcon, { backgroundColor: "#FFFBEB" }]}
                    >
                      <Ionicons name="time" size={18} color="#F59E0B" />
                    </View>
                    <Text style={mo.title}>
                      {isEdit ? "Edit Overtime" : "Add Overtime"}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={onClose} style={mo.closeBtn}>
                    <Ionicons name="close" size={18} color="#64748B" />
                  </TouchableOpacity>
                </View>

                <ScrollView
                  style={mo.body}
                  showsVerticalScrollIndicator={false}
                  keyboardShouldPersistTaps="handled"
                  bounces={false}
                >
                  <Field label="Name">
                    <TextInput
                      style={mo.input}
                      placeholder="e.g. Normal day OT 1.5x"
                      placeholderTextColor="#94A3B8"
                      value={name}
                      onChangeText={setName}
                    />
                  </Field>
                  <Field label="Rate Type">
                    <Dropdown
                      value={rateType}
                      options={RATE_TYPE_OPTIONS}
                      placeholder="Select a rate type"
                      onChange={setRateType}
                    />
                  </Field>
                  <Field label="Rate (per hour)">
                    <TextInput
                      style={mo.input}
                      placeholder="0.00"
                      placeholderTextColor="#94A3B8"
                      value={rate}
                      onChangeText={setRate}
                      keyboardType="decimal-pad"
                    />
                  </Field>
                  <View style={{ height: 8 }} />
                </ScrollView>

                <View style={mo.footer}>
                  <TouchableOpacity style={mo.cancelBtn} onPress={onClose}>
                    <Text style={mo.cancelText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={mo.saveBtn} onPress={handleSave}>
                    <Text style={mo.saveText}>
                      {isEdit ? "Save Changes" : "Add Overtime"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </KeyboardAvoidingView>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const mo = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.6)",
    justifyContent: "flex-end",
  },
  kav: { width: "100%", justifyContent: "flex-end" },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingBottom: Platform.OS === "ios" ? 0 : 0,
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 6,
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
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: { fontSize: 17, fontWeight: "800", color: "#1E293B" },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  body: { paddingHorizontal: 20, paddingTop: 20, maxHeight: 440 },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1E293B",
  },
  amountRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  unitToggle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  unitToggleOn: { borderColor: "#F97316", backgroundColor: "#FFF7ED" },
  unitLabel: { fontSize: 11, color: "#64748B", fontWeight: "600" },
  assigneeWrap: { gap: 10 },
  assigneeOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 14,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
  },
  assigneeOptionActive: { borderColor: "#F97316", backgroundColor: "#FFF7ED" },
  radio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    justifyContent: "center",
  },
  radioActive: { borderColor: "#F97316" },
  radioDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: "#F97316",
  },
  assigneeLabel: { fontSize: 13, color: "#334155", fontWeight: "500" },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  cancelText: { fontSize: 14, fontWeight: "700", color: "#64748B" },
  saveBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F97316",
    alignItems: "center",
  },
  saveText: { fontSize: 14, fontWeight: "700", color: "#fff" },
});

// ─── ITEM LIST CARD ──────────────────────────────────────────
const ItemCard = ({ item, onEdit, onDelete, isOvertime }) => {
  const tagLabel = isOvertime ? item.rateType : item.category;
  const tagStyle = DEPT_COLORS[tagLabel] || { bg: "#F1F5F9", text: "#64748B" };
  const valueLabel = isOvertime ? `$${item.rate} / hr` : `$${item.amount}`;
  const valueSub = isOvertime
    ? item.rateType
    : item.unitCalc
      ? "Unit Calculation"
      : "Fixed Amount";

  return (
    <View style={ic.card}>
      {/* Left colored strip */}
      <View
        style={[
          ic.strip,
          { backgroundColor: isOvertime ? "#F59E0B" : tagStyle.text + "33" },
        ]}
      />

      <View style={ic.content}>
        {/* Top row */}
        <View style={ic.topRow}>
          <View style={ic.nameWrap}>
            <View style={[ic.iconBox, { backgroundColor: tagStyle.bg }]}>
              <Ionicons
                name={
                  isOvertime
                    ? "time-outline"
                    : item.unitCalc
                      ? "calculator-outline"
                      : "cash-outline"
                }
                size={16}
                color={tagStyle.text}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={ic.name} numberOfLines={1}>
                {item.name}
              </Text>
              <View style={[ic.pill, { backgroundColor: tagStyle.bg }]}>
                <Text
                  style={[ic.pillText, { color: tagStyle.text }]}
                  numberOfLines={1}
                >
                  {tagLabel}
                </Text>
              </View>
            </View>
          </View>

          {/* Amount */}
          <View style={ic.valueWrap}>
            <Text style={ic.value}>{valueLabel}</Text>
            <Text style={ic.valueSub}>{valueSub}</Text>
          </View>
        </View>

        {/* Bottom row — assignee + actions */}
        {!isOvertime && (
          <View style={ic.bottomRow}>
            <View style={ic.assigneeChip}>
              <Ionicons name="people-outline" size={11} color="#64748B" />
              <Text style={ic.assigneeText}>{item.assignee}</Text>
            </View>
            <View style={ic.actions}>
              <TouchableOpacity style={ic.editBtn} onPress={() => onEdit(item)}>
                <Ionicons name="create-outline" size={15} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity
                style={ic.delBtn}
                onPress={() => onDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={15} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        {isOvertime && (
          <View style={ic.bottomRow}>
            <View style={ic.assigneeChip}>
              <Ionicons name="speedometer-outline" size={11} color="#64748B" />
              <Text style={ic.assigneeText}>{item.rateType}</Text>
            </View>
            <View style={ic.actions}>
              <TouchableOpacity style={ic.editBtn} onPress={() => onEdit(item)}>
                <Ionicons name="create-outline" size={15} color="#3B82F6" />
              </TouchableOpacity>
              <TouchableOpacity
                style={ic.delBtn}
                onPress={() => onDelete(item.id)}
              >
                <Ionicons name="trash-outline" size={15} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const ic = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 10,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#F1F5F9",
  },
  strip: { width: 4 },
  content: { flex: 1, padding: 14, gap: 10 },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 10,
  },
  nameWrap: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    flex: 1,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  name: { fontSize: 14, fontWeight: "700", color: "#1E293B", marginBottom: 5 },
  pill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    alignSelf: "flex-start",
  },
  pillText: { fontSize: 10, fontWeight: "700" },
  valueWrap: { alignItems: "flex-end" },
  value: { fontSize: 16, fontWeight: "900", color: "#1E293B" },
  valueSub: { fontSize: 10, color: "#94A3B8", fontWeight: "500", marginTop: 2 },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  assigneeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#F8FAFC",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  assigneeText: { fontSize: 11, color: "#64748B", fontWeight: "500" },
  actions: { flexDirection: "row", gap: 8 },
  editBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },
  delBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
  },
});

// ─── MAIN SCREEN ─────────────────────────────────────────────
export default function PayrollItemsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("Additions");
  const [additions, setAdditions] = useState(INITIAL_ADDITIONS);
  const [overtime, setOvertime] = useState(INITIAL_OVERTIME);
  const [deductions, setDeductions] = useState(INITIAL_DEDUCTIONS);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [editItem, setEditItem] = useState(null);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("Last 7 Days");
  const [sortOpen, setSortOpen] = useState(false);

  const currentData =
    activeTab === "Additions"
      ? additions
      : activeTab === "Overtime"
        ? overtime
        : deductions;
  const setCurrentData =
    activeTab === "Additions"
      ? setAdditions
      : activeTab === "Overtime"
        ? setOvertime
        : setDeductions;

  const filtered = useMemo(() => {
    if (!search.trim()) return currentData;
    const q = search.toLowerCase();
    return currentData.filter((i) => i.name.toLowerCase().includes(q));
  }, [currentData, search]);

  const openAdd = () => {
    setModalMode("add");
    setEditItem(null);
    setModalVisible(true);
  };
  const openEdit = (item) => {
    setModalMode("edit");
    setEditItem(item);
    setModalVisible(true);
  };
  const handleDelete = (id) =>
    Alert.alert("Delete Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => setCurrentData((p) => p.filter((i) => i.id !== id)),
      },
    ]);
  const handleSave = (data) => {
    if (modalMode === "edit")
      setCurrentData((p) => p.map((i) => (i.id === data.id ? data : i)));
    else setCurrentData((p) => [...p, { ...data, id: uid() }]);
  };

  const addLabel =
    activeTab === "Additions"
      ? "Add Addition"
      : activeTab === "Overtime"
        ? "Add Overtime"
        : "Add Deduction";

  const stats = [
    {
      label: "Additions",
      count: additions.length,
      color: "#10B981",
      bg: "#ECFDF5",
      icon: "add-circle",
    },
    {
      label: "Overtime",
      count: overtime.length,
      color: "#F59E0B",
      bg: "#FFFBEB",
      icon: "time",
    },
    {
      label: "Deductions",
      count: deductions.length,
      color: "#EF4444",
      bg: "#FEF2F2",
      icon: "remove-circle",
    },
  ];

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8FAFC" />

      {/* ── FIXED HEADER ── */}
      <View style={s.header}>
        {/* Breadcrumb + Title */}
        <View style={s.headerTop}>
          <View style={s.breadcrumb}>
            <Ionicons name="home-outline" size={11} color="#94A3B8" />
            <Text style={s.breadSep}> › </Text>
            <Text style={s.breadText}>Payroll</Text>
            <Text style={s.breadSep}> › </Text>
            <Text style={s.breadActive}>Payroll Items</Text>
          </View>
          <TouchableOpacity style={s.exportBtn}>
            <Ionicons name="download-outline" size={14} color="#334155" />
            <Text style={s.exportText}>Export</Text>
            <Ionicons name="chevron-down" size={12} color="#334155" />
          </TouchableOpacity>
        </View>
        <Text style={s.pageTitle}>Payroll Items</Text>

        {/* Stats Row */}
        <View style={s.statsRow}>
          {stats.map(({ label, count, color, bg, icon }) => (
            <TouchableOpacity
              key={label}
              style={[
                s.statCard,
                activeTab === label && { borderColor: color },
              ]}
              onPress={() => {
                setActiveTab(label);
                setSearch("");
              }}
              activeOpacity={0.8}
            >
              <View style={[s.statIconBox, { backgroundColor: bg }]}>
                <Ionicons name={icon} size={18} color={color} />
              </View>
              <View>
                <Text style={s.statCount}>{count}</Text>
                <Text style={s.statLabel}>{label}</Text>
              </View>
              {activeTab === label && (
                <View style={[s.statDot, { backgroundColor: color }]} />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Bar */}
        <View style={s.tabBar}>
          {["Additions", "Overtime", "Deductions"].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeTab === tab && s.tabActive]}
              onPress={() => {
                setActiveTab(tab);
                setSearch("");
              }}
            >
              <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={s.tabUnderline} />}
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── SCROLLABLE CONTENT ── */}
      <ScrollView
        style={s.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Search + Sort */}
        <View style={s.filterRow}>
          <View style={s.searchWrap}>
            <Ionicons name="search-outline" size={15} color="#94A3B8" />
            <TextInput
              style={s.searchInput}
              placeholder={`Search ${activeTab.toLowerCase()}...`}
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
              autoCorrect={false}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={15} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <View style={{ position: "relative", zIndex: 30 }}>
            <TouchableOpacity
              style={s.sortBtn}
              onPress={() => setSortOpen(!sortOpen)}
            >
              <Ionicons name="funnel-outline" size={13} color="#64748B" />
              <Text style={s.sortBtnText}>{sortBy}</Text>
              <Ionicons
                name={sortOpen ? "chevron-up" : "chevron-down"}
                size={12}
                color="#64748B"
              />
            </TouchableOpacity>
            {sortOpen && (
              <View style={s.floatMenu}>
                {SORT_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt}
                    style={[s.floatItem, sortBy === opt && s.floatItemActive]}
                    onPress={() => {
                      setSortBy(opt);
                      setSortOpen(false);
                    }}
                  >
                    <Text
                      style={[s.floatText, sortBy === opt && s.floatTextActive]}
                    >
                      {opt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* Count */}
        <View style={s.countRow}>
          <Text style={s.countText}>
            {filtered.length} {activeTab.toLowerCase()}
          </Text>
        </View>

        {/* List */}
        <View style={s.list}>
          {filtered.length > 0 ? (
            filtered.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={openEdit}
                onDelete={handleDelete}
                isOvertime={activeTab === "Overtime"}
              />
            ))
          ) : (
            <View style={s.empty}>
              <View style={s.emptyIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={32}
                  color="#CBD5E1"
                />
              </View>
              <Text style={s.emptyTitle}>No {activeTab.toLowerCase()} yet</Text>
              <Text style={s.emptySubtitle}>
                Tap the button below to add one
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* ── FIXED ADD BUTTON AT BOTTOM ── */}
      <View style={s.fab}>
        <TouchableOpacity
          style={s.fabBtn}
          onPress={openAdd}
          activeOpacity={0.85}
        >
          <Ionicons name="add" size={20} color="#fff" />
          <Text style={s.fabText}>{addLabel}</Text>
        </TouchableOpacity>
      </View>

      {/* ── MODALS ── */}
      {activeTab !== "Overtime" ? (
        <AdditionModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          initial={modalMode === "edit" ? editItem : null}
          mode={modalMode}
          type={activeTab === "Deductions" ? "deduction" : "addition"}
        />
      ) : (
        <OvertimeModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onSave={handleSave}
          initial={modalMode === "edit" ? editItem : null}
          mode={modalMode}
        />
      )}
    </SafeAreaView>
  );
}

// ─── SCREEN STYLES ───────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  /* Fixed header */
  header: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingTop: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  breadcrumb: { flexDirection: "row", alignItems: "center" },
  breadSep: { fontSize: 11, color: "#CBD5E1" },
  breadText: { fontSize: 11, color: "#94A3B8" },
  breadActive: { fontSize: 11, color: "#F97316", fontWeight: "700" },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  exportText: { fontSize: 11, fontWeight: "600", color: "#334155" },
  pageTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: "#1E293B",
    marginBottom: 14,
  },

  /* Stats */
  statsRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  statCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  statIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  statCount: {
    fontSize: 16,
    fontWeight: "900",
    color: "#1E293B",
    lineHeight: 18,
  },
  statLabel: {
    fontSize: 9,
    color: "#64748B",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  statDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: "absolute",
    top: 8,
    right: 8,
  },

  /* Tab bar */
  tabBar: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    position: "relative",
  },
  tabActive: {},
  tabText: { fontSize: 13, fontWeight: "600", color: "#94A3B8" },
  tabTextActive: { color: "#F97316", fontWeight: "800" },
  tabUnderline: {
    position: "absolute",
    bottom: 0,
    left: "10%",
    right: "10%",
    height: 3,
    backgroundColor: "#F97316",
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },

  /* Scroll */
  scroll: { flex: 1 },

  /* Filter row */
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 4,
  },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  searchInput: { flex: 1, fontSize: 13, color: "#1E293B" },
  sortBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 42,
  },
  sortBtnText: { fontSize: 11, color: "#64748B", fontWeight: "600" },

  /* Count */
  countRow: { paddingHorizontal: 16, paddingVertical: 8 },
  countText: { fontSize: 12, color: "#94A3B8", fontWeight: "600" },

  /* List */
  list: { paddingHorizontal: 16, paddingTop: 4 },

  /* Empty */
  empty: { padding: 48, alignItems: "center", gap: 8 },
  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#64748B" },
  emptySubtitle: { fontSize: 12, color: "#94A3B8", textAlign: "center" },

  /* FAB */
  fab: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
    paddingTop: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 8,
  },
  fabBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#F97316",
    paddingVertical: 15,
    borderRadius: 14,
  },
  fabText: { fontSize: 15, fontWeight: "800", color: "#fff" },

  /* Float menus */
  floatMenu: {
    position: "absolute",
    top: 46,
    right: 0,
    minWidth: 150,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    zIndex: 999,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 10,
  },
  floatItem: {
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  floatItemActive: { backgroundColor: "#FFF7ED" },
  floatText: { fontSize: 13, color: "#334155" },
  floatTextActive: { color: "#F97316", fontWeight: "700" },
});
