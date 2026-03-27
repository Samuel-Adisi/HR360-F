import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// ─────────────────────────────────────────────────────────────
//  THEME — restrained palette, blue + grays only
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
  {
    key: "contract",
    label: "Employment Contract",
    icon: "document-text-outline",
  },
  { key: "identification", label: "Identification", icon: "id-card-outline" },
  { key: "payslip", label: "Payslip", icon: "cash-outline" },
  { key: "tax_form", label: "Tax Form", icon: "receipt-outline" },
  { key: "loan_agreement", label: "Loan Agreement", icon: "card-outline" },
  { key: "certificate", label: "Certificate", icon: "ribbon-outline" },
  { key: "expense_receipt", label: "Expense Receipt", icon: "receipt-outline" },
  { key: "other", label: "Other", icon: "folder-outline" },
];

const ACCESS_LEVELS = [
  {
    key: "hr_only",
    label: "HR Only",
    desc: "Only HR and admins",
    icon: "shield-checkmark-outline",
  },
  {
    key: "employee",
    label: "Employee",
    desc: "Employee can view",
    icon: "person-outline",
  },
  {
    key: "all",
    label: "Everyone",
    desc: "All staff can access",
    icon: "globe-outline",
  },
];

const ACCEPTED_FORMATS = ["PDF", "JPG", "PNG", "DOCX", "XLSX", "ZIP"];

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

// ─────────────────────────────────────────────────────────────
//  FORM FIELD WRAPPER
// ─────────────────────────────────────────────────────────────
const Field = ({ label, required, error, children, hint }) => (
  <View style={f.wrapper}>
    <View style={f.labelRow}>
      <Text style={f.label}>{label}</Text>
      {required && <Text style={f.required}>*</Text>}
    </View>
    {hint && <Text style={f.hint}>{hint}</Text>}
    {children}
    {error && (
      <View style={f.errorRow}>
        <Ionicons name="alert-circle" size={12} color={T.red} />
        <Text style={f.errorTxt}>{error}</Text>
      </View>
    )}
  </View>
);

const f = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    marginBottom: 6,
  },
  label: { fontSize: 13, fontWeight: "700", color: T.text },
  required: { fontSize: 13, fontWeight: "800", color: T.red },
  hint: { fontSize: 11, color: T.textMuted, marginBottom: 8, lineHeight: 16 },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  errorTxt: { fontSize: 11, color: T.red, fontWeight: "600" },
});

// ─────────────────────────────────────────────────────────────
//  EMPLOYEE PICKER MODAL
// ─────────────────────────────────────────────────────────────
const EmployeePickerModal = ({ visible, selected, onSelect, onClose }) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={onClose}
  >
    <View style={ep.overlay}>
      <View style={ep.sheet}>
        <View style={ep.handle} />
        <View style={ep.header}>
          <Text style={ep.title}>Select Employee</Text>
          <TouchableOpacity onPress={onClose} style={ep.closeBtn}>
            <Ionicons name="close" size={18} color={T.textSub} />
          </TouchableOpacity>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, gap: 10 }}>
          {EMPLOYEES.map((emp) => {
            const isSelected = selected === emp.id;
            return (
              <TouchableOpacity
                key={emp.id}
                style={[ep.row, isSelected && ep.rowActive]}
                onPress={() => {
                  onSelect(emp.id);
                  onClose();
                }}
                activeOpacity={0.85}
              >
                <View
                  style={[
                    ep.avatar,
                    { backgroundColor: avatarColor(emp.name) },
                  ]}
                >
                  <Text style={ep.avatarTxt}>{getInitials(emp.name)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[ep.empName, isSelected && { color: T.blue }]}>
                    {emp.name}
                  </Text>
                  <Text style={ep.empSub}>
                    {emp.role} · {emp.department}
                  </Text>
                </View>
                {isSelected && (
                  <Ionicons name="checkmark-circle" size={20} color={T.blue} />
                )}
                <Text style={ep.empId}>{emp.id}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const ep = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "60%",
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: { fontSize: 16, fontWeight: "700", color: T.text },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: "#FAFAFA",
  },
  rowActive: { borderColor: T.blue, backgroundColor: T.blueSoft },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 13, fontWeight: "800", color: "#fff" },
  empName: { fontSize: 14, fontWeight: "700", color: T.text },
  empSub: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  empId: { fontSize: 10, color: T.textMuted, fontWeight: "600" },
});

// ─────────────────────────────────────────────────────────────
//  UPLOAD ZONE
// ─────────────────────────────────────────────────────────────
const UploadZone = ({ file, onPickFile, onRemoveFile, error }) => {
  if (file) {
    return (
      <View style={[uz.fileCard, error && { borderColor: T.red }]}>
        <View style={uz.fileIconWrap}>
          <Ionicons name="document-outline" size={26} color={T.blue} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={uz.fileName} numberOfLines={1}>
            {file.name}
          </Text>
          <View style={uz.fileMeta}>
            <Text style={uz.fileSize}>{file.size}</Text>
            <View style={uz.fileDot} />
            <View style={uz.extPill}>
              <Text style={uz.extTxt}>{file.ext.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        <TouchableOpacity style={uz.removeBtn} onPress={onRemoveFile}>
          <Ionicons name="close-circle" size={20} color={T.textMuted} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <TouchableOpacity
      style={[
        uz.zone,
        error && { borderColor: T.red, backgroundColor: T.redSoft },
      ]}
      onPress={onPickFile}
      activeOpacity={0.8}
    >
      <View style={uz.iconRing}>
        <Ionicons name="cloud-upload-outline" size={28} color={T.blue} />
      </View>
      <Text style={uz.zoneTitle}>Tap to select a file</Text>
      <Text style={uz.zoneSub}>or drag and drop here</Text>
      <View style={uz.formatsRow}>
        {ACCEPTED_FORMATS.map((fmt) => (
          <View key={fmt} style={uz.fmtChip}>
            <Text style={uz.fmtTxt}>{fmt}</Text>
          </View>
        ))}
      </View>
      <Text style={uz.sizeLimit}>Maximum file size: 25 MB</Text>
    </TouchableOpacity>
  );
};

const uz = StyleSheet.create({
  zone: {
    borderWidth: 1.5,
    borderColor: T.blueMid,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    gap: 6,
    backgroundColor: T.blueSoft,
  },
  iconRing: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.blueMid,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  zoneTitle: { fontSize: 15, fontWeight: "700", color: T.text },
  zoneSub: { fontSize: 12, color: T.textMuted },
  formatsRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  fmtChip: {
    backgroundColor: "#fff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: T.border,
  },
  fmtTxt: { fontSize: 10, fontWeight: "700", color: T.textSub },
  sizeLimit: { fontSize: 10, color: T.textMuted, marginTop: 2 },

  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: T.blueSoft,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: T.blueMid,
    padding: 14,
  },
  fileIconWrap: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  fileName: { fontSize: 14, fontWeight: "700", color: T.text },
  fileMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
  },
  fileSize: { fontSize: 11, color: T.textMuted },
  fileDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: T.border,
  },
  extPill: {
    backgroundColor: T.blue,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
  extTxt: { fontSize: 9, fontWeight: "900", color: "#fff" },
  removeBtn: { padding: 4 },
});

// ─────────────────────────────────────────────────────────────
//  SUCCESS MODAL
// ─────────────────────────────────────────────────────────────
const SuccessModal = ({ visible, doc, onClose, onUploadAnother }) => (
  <Modal visible={visible} animationType="fade" transparent>
    <View style={sm.overlay}>
      <View style={sm.card}>
        <View style={sm.iconWrap}>
          <Ionicons name="checkmark-circle" size={48} color={T.green} />
        </View>
        <Text style={sm.title}>Document Uploaded</Text>
        <Text style={sm.sub}>The document has been saved successfully.</Text>

        {doc && (
          <View style={sm.docRow}>
            <Ionicons name="document-outline" size={16} color={T.blue} />
            <View style={{ flex: 1 }}>
              <Text style={sm.docName}>{doc.name}</Text>
              <Text style={sm.docMeta}>
                {doc.type} · {doc.emp}
              </Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={sm.primaryBtn} onPress={onClose}>
          <Text style={sm.primaryBtnTxt}>Done</Text>
        </TouchableOpacity>
        <TouchableOpacity style={sm.secondaryBtn} onPress={onUploadAnother}>
          <Ionicons name="add-circle-outline" size={15} color={T.blue} />
          <Text style={sm.secondaryBtnTxt}>Upload Another</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

const sm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 28,
    alignItems: "center",
    gap: 8,
    width: "100%",
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: T.greenSoft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: { fontSize: 20, fontWeight: "800", color: T.text },
  sub: {
    fontSize: 13,
    color: T.textMuted,
    textAlign: "center",
    marginBottom: 4,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: T.blueSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: T.blueMid,
    width: "100%",
    marginBottom: 4,
  },
  docName: { fontSize: 13, fontWeight: "700", color: T.text },
  docMeta: {
    fontSize: 11,
    color: T.textMuted,
    marginTop: 2,
    textTransform: "capitalize",
  },
  primaryBtn: {
    backgroundColor: T.blue,
    borderRadius: 12,
    paddingVertical: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 8,
  },
  primaryBtnTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
  },
  secondaryBtnTxt: { fontSize: 14, fontWeight: "700", color: T.blue },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
const INITIAL_FORM = {
  emp_id: "",
  doc_type: "",
  doc_name: "",
  access: "hr_only",
  expiry_date: "",
  notes: "",
  tags: "",
  version: "v1",
};

export default function UploadDocumentScreen() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [file, setFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  const [showEmpPicker, setShowEmpPicker] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  // Simulate file pick
  const handlePickFile = () => {
    const mockFiles = [
      { name: "employment_contract_2025.pdf", size: "1.2 MB", ext: "pdf" },
      { name: "national_id_scan.jpg", size: "340 KB", ext: "jpg" },
      { name: "tax_relief_cert.pdf", size: "540 KB", ext: "pdf" },
      { name: "expense_receipts_q1.zip", size: "3.4 MB", ext: "zip" },
    ];
    const picked = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    setFile(picked);
    if (errors.file) setErrors((p) => ({ ...p, file: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.emp_id) e.emp_id = "Please select an employee.";
    if (!form.doc_type) e.doc_type = "Please select a document type.";
    if (!form.doc_name.trim()) e.doc_name = "Document name is required.";
    if (!file) e.file = "Please select a file to upload.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleUpload = () => {
    if (!validate()) return;
    setUploading(true);
    setUploadProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setUploading(false);
          setShowSuccess(true);
          return 100;
        }
        return p + Math.floor(Math.random() * 18) + 8;
      });
    }, 180);
  };

  const handleReset = () => {
    setForm(INITIAL_FORM);
    setFile(null);
    setErrors({});
    setUploadProgress(0);
    setShowSuccess(false);
  };

  const selectedEmp = EMPLOYEES.find((e) => e.id === form.emp_id);
  const selectedType = DOC_TYPES.find((t) => t.key === form.doc_type);
  const isFormDirty = form.emp_id || form.doc_type || form.doc_name || file;
  const completedFields = [
    form.emp_id,
    form.doc_type,
    form.doc_name.trim(),
    file,
    form.access,
  ].filter(Boolean).length;
  const totalRequired = 4; // emp, type, name, file
  const progress = Math.min((completedFields / totalRequired) * 100, 100);

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <View style={s.headerLeft}>
            <Text style={s.pageTitle}>Upload Document</Text>
            <Text style={s.pageSub}>
              Add a document to an employee&apos;s record
            </Text>
          </View>
          {isFormDirty && (
            <TouchableOpacity style={s.clearBtn} onPress={handleReset}>
              <Ionicons name="refresh-outline" size={14} color={T.textMuted} />
              <Text style={s.clearBtnTxt}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ── Progress bar ── */}
        <View style={s.progressCard}>
          <View style={s.progressTop}>
            <Text style={s.progressLabel}>Form Completion</Text>
            <Text style={s.progressPct}>{Math.round(progress)}%</Text>
          </View>
          <View style={s.progressTrack}>
            <View style={[s.progressFill, { width: `${progress}%` }]} />
          </View>
          <View style={s.progressSteps}>
            {[
              { label: "Employee", done: !!form.emp_id },
              { label: "Doc Type", done: !!form.doc_type },
              { label: "Name", done: !!form.doc_name.trim() },
              { label: "File", done: !!file },
            ].map((step) => (
              <View key={step.label} style={s.progressStep}>
                <View style={[s.stepDot, step.done && s.stepDotDone]}>
                  {step.done && (
                    <Ionicons name="checkmark" size={9} color="#fff" />
                  )}
                </View>
                <Text
                  style={[
                    s.stepLabel,
                    step.done && { color: T.blue, fontWeight: "700" },
                  ]}
                >
                  {step.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── Section 1: Employee ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionNum}>
              <Text style={s.sectionNumTxt}>1</Text>
            </View>
            <Text style={s.sectionTitle}>Employee</Text>
          </View>

          <Field label="Select Employee" required error={errors.emp_id}>
            <TouchableOpacity
              style={[
                s.pickerBtn,
                errors.emp_id && s.inputError,
                form.emp_id && s.pickerBtnFilled,
              ]}
              onPress={() => setShowEmpPicker(true)}
            >
              {selectedEmp ? (
                <View style={s.selectedEmpRow}>
                  <View
                    style={[
                      s.empAvatar,
                      { backgroundColor: avatarColor(selectedEmp.name) },
                    ]}
                  >
                    <Text style={s.empAvatarTxt}>
                      {getInitials(selectedEmp.name)}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={s.selectedEmpName}>{selectedEmp.name}</Text>
                    <Text style={s.selectedEmpSub}>
                      {selectedEmp.department} · {selectedEmp.id}
                    </Text>
                  </View>
                  <Ionicons name="chevron-down" size={16} color={T.textMuted} />
                </View>
              ) : (
                <View style={s.pickerPlaceholder}>
                  <Ionicons
                    name="person-outline"
                    size={16}
                    color={T.textMuted}
                  />
                  <Text style={s.pickerPlaceholderTxt}>
                    Choose an employee…
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={T.textMuted} />
                </View>
              )}
            </TouchableOpacity>
          </Field>
        </View>

        {/* ── Section 2: Document Info ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionNum}>
              <Text style={s.sectionNumTxt}>2</Text>
            </View>
            <Text style={s.sectionTitle}>Document Info</Text>
          </View>

          {/* Doc type grid */}
          <Field label="Document Type" required error={errors.doc_type}>
            <View style={s.typeGrid}>
              {DOC_TYPES.map((type) => {
                const isActive = form.doc_type === type.key;
                return (
                  <TouchableOpacity
                    key={type.key}
                    style={[s.typeCell, isActive && s.typeCellActive]}
                    onPress={() => set("doc_type", type.key)}
                  >
                    <Ionicons
                      name={type.icon}
                      size={18}
                      color={isActive ? T.blue : T.textMuted}
                    />
                    <Text
                      style={[s.typeCellTxt, isActive && s.typeCellTxtActive]}
                    >
                      {type.label}
                    </Text>
                    {isActive && (
                      <View style={s.typeCellCheck}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Field>

          {/* Document name */}
          <Field
            label="Document Name"
            required
            error={errors.doc_name}
            hint="Give this document a clear, descriptive name."
          >
            <TextInput
              style={[s.input, errors.doc_name && s.inputError]}
              value={form.doc_name}
              onChangeText={(v) => set("doc_name", v)}
              placeholder={
                selectedType
                  ? `e.g. ${selectedType.label} — ${new Date().getFullYear()}`
                  : "e.g. Employment Contract 2025"
              }
              placeholderTextColor={T.textMuted}
            />
          </Field>

          {/* Version */}
          <Field label="Version" hint="Track document revisions (e.g. v1, v2).">
            <View style={s.versionRow}>
              {["v1", "v2", "v3", "v4"].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={[
                    s.versionChip,
                    form.version === v && s.versionChipActive,
                  ]}
                  onPress={() => set("version", v)}
                >
                  <Text
                    style={[
                      s.versionTxt,
                      form.version === v && s.versionTxtActive,
                    ]}
                  >
                    {v}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </Field>
        </View>

        {/* ── Section 3: File Upload ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionNum}>
              <Text style={s.sectionNumTxt}>3</Text>
            </View>
            <Text style={s.sectionTitle}>File</Text>
          </View>

          <Field label="Upload File" required error={errors.file}>
            <UploadZone
              file={file}
              onPickFile={handlePickFile}
              onRemoveFile={() => setFile(null)}
              error={errors.file}
            />
          </Field>

          {/* Upload progress (while uploading) */}
          {uploading && (
            <View style={s.uploadProgressCard}>
              <View style={s.uploadProgressTop}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={16}
                  color={T.blue}
                />
                <Text style={s.uploadProgressTxt}>
                  Uploading… {uploadProgress}%
                </Text>
              </View>
              <View style={s.uploadTrack}>
                <View
                  style={[
                    s.uploadFill,
                    { width: `${Math.min(uploadProgress, 100)}%` },
                  ]}
                />
              </View>
            </View>
          )}
        </View>

        {/* ── Section 4: Access & Expiry ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionNum}>
              <Text style={s.sectionNumTxt}>4</Text>
            </View>
            <Text style={s.sectionTitle}>Access & Validity</Text>
          </View>

          {/* Access level */}
          <Field label="Access Level" hint="Who can view this document?">
            <View style={s.accessGrid}>
              {ACCESS_LEVELS.map((lvl) => {
                const isActive = form.access === lvl.key;
                return (
                  <TouchableOpacity
                    key={lvl.key}
                    style={[s.accessCell, isActive && s.accessCellActive]}
                    onPress={() => set("access", lvl.key)}
                  >
                    <Ionicons
                      name={lvl.icon}
                      size={18}
                      color={isActive ? T.blue : T.textMuted}
                    />
                    <Text
                      style={[s.accessCellLabel, isActive && { color: T.blue }]}
                    >
                      {lvl.label}
                    </Text>
                    <Text style={s.accessCellDesc}>{lvl.desc}</Text>
                    {isActive && (
                      <View style={s.accessCheck}>
                        <Ionicons name="checkmark" size={10} color="#fff" />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </Field>

          {/* Expiry date */}
          <Field
            label="Expiry Date"
            hint="Leave blank if this document does not expire."
          >
            <View style={s.dateInputWrap}>
              <Ionicons
                name="calendar-outline"
                size={16}
                color={T.textMuted}
                style={{ marginLeft: 14 }}
              />
              <TextInput
                style={s.dateInput}
                value={form.expiry_date}
                onChangeText={(v) => set("expiry_date", v)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={T.textMuted}
                keyboardType="numeric"
              />
            </View>
          </Field>
        </View>

        {/* ── Section 5: Extra Details ── */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <View style={s.sectionNum}>
              <Text style={s.sectionNumTxt}>5</Text>
            </View>
            <Text style={s.sectionTitle}>Extra Details</Text>
          </View>

          {/* Tags */}
          <Field
            label="Tags"
            hint="Comma-separated labels for easy search (e.g. legal, onboarding, 2025)."
          >
            <View style={s.tagInputWrap}>
              <Ionicons
                name="pricetag-outline"
                size={15}
                color={T.textMuted}
                style={{ marginLeft: 14 }}
              />
              <TextInput
                style={s.tagInput}
                value={form.tags}
                onChangeText={(v) => set("tags", v)}
                placeholder="e.g. legal, onboarding, 2025"
                placeholderTextColor={T.textMuted}
                autoCapitalize="none"
              />
            </View>
            {/* Tag preview */}
            {form.tags.trim() && (
              <View style={s.tagPreview}>
                {form.tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .map((tag) => (
                    <View key={tag} style={s.tagPreviewChip}>
                      <Text style={s.tagPreviewTxt}>#{tag}</Text>
                    </View>
                  ))}
              </View>
            )}
          </Field>

          {/* Notes */}
          <Field label="Notes" hint="Optional context for HR or the employee.">
            <TextInput
              style={[s.input, s.textarea]}
              value={form.notes}
              onChangeText={(v) => set("notes", v)}
              placeholder="Any additional context about this document…"
              placeholderTextColor={T.textMuted}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </Field>
        </View>

        {/* ── Summary card (shown when form is filled) ── */}
        {form.emp_id && form.doc_type && form.doc_name && file && (
          <View style={s.summaryCard}>
            <Text style={s.summaryTitle}>Review Before Upload</Text>
            {[
              {
                label: "Employee",
                val: selectedEmp?.name || "—",
                icon: "person-outline",
              },
              {
                label: "Type",
                val: selectedType?.label || "—",
                icon: "document-text-outline",
              },
              { label: "Name", val: form.doc_name, icon: "text-outline" },
              { label: "File", val: file?.name || "—", icon: "attach-outline" },
              {
                label: "Access",
                val:
                  ACCESS_LEVELS.find((a) => a.key === form.access)?.label ||
                  "—",
                icon: "shield-outline",
              },
              {
                label: "Version",
                val: form.version,
                icon: "git-branch-outline",
              },
              {
                label: "Expires",
                val: form.expiry_date || "No expiry",
                icon: "calendar-outline",
              },
            ].map((row, i) => (
              <View
                key={row.label}
                style={[s.summaryRow, i < 6 && s.summaryRowBorder]}
              >
                <View style={s.summaryIcon}>
                  <Ionicons name={row.icon} size={13} color={T.textMuted} />
                </View>
                <Text style={s.summaryLabel}>{row.label}</Text>
                <Text style={s.summaryVal} numberOfLines={1}>
                  {row.val}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Submit button ── */}
        <TouchableOpacity
          style={[s.submitBtn, uploading && s.submitBtnDisabled]}
          onPress={handleUpload}
          disabled={uploading}
          activeOpacity={0.85}
        >
          {uploading ? (
            <View style={s.submitInner}>
              <View style={s.uploadingDots}>
                {[0, 1, 2].map((i) => (
                  <View key={i} style={s.uploadingDot} />
                ))}
              </View>
              <Text style={s.submitTxt}>Uploading…</Text>
            </View>
          ) : (
            <View style={s.submitInner}>
              <Ionicons name="cloud-upload-outline" size={18} color="#fff" />
              <Text style={s.submitTxt}>Upload Document</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Error summary */}
        {Object.keys(errors).length > 0 && (
          <View style={s.errorSummary}>
            <Ionicons name="alert-circle" size={16} color={T.red} />
            <Text style={s.errorSummaryTxt}>
              Please fix {Object.keys(errors).length} error
              {Object.keys(errors).length > 1 ? "s" : ""} before uploading.
            </Text>
          </View>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* Modals */}
      <EmployeePickerModal
        visible={showEmpPicker}
        selected={form.emp_id}
        onSelect={(id) => set("emp_id", id)}
        onClose={() => setShowEmpPicker(false)}
      />

      <SuccessModal
        visible={showSuccess}
        doc={{
          name: form.doc_name,
          type: selectedType?.label,
          emp: selectedEmp?.name,
        }}
        onClose={handleReset}
        onUploadAnother={handleReset}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  scrollContent: { paddingBottom: 20 },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  headerLeft: { gap: 3 },
  pageTitle: { fontSize: 22, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 12, color: T.textMuted },
  clearBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
  },
  clearBtnTxt: { fontSize: 12, color: T.textMuted, fontWeight: "600" },

  // Progress card
  progressCard: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  progressLabel: { fontSize: 12, fontWeight: "700", color: T.textSub },
  progressPct: { fontSize: 13, fontWeight: "900", color: T.blue },
  progressTrack: {
    height: 6,
    backgroundColor: T.border,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 12,
  },
  progressFill: { height: "100%", backgroundColor: T.blue, borderRadius: 3 },
  progressSteps: { flexDirection: "row", justifyContent: "space-between" },
  progressStep: { alignItems: "center", gap: 4 },
  stepDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  stepDotDone: { backgroundColor: T.blue },
  stepLabel: {
    fontSize: 9,
    color: T.textMuted,
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  // Section
  section: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: T.border,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 18,
  },
  sectionNum: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: T.navy,
    alignItems: "center",
    justifyContent: "center",
  },
  sectionNumTxt: { fontSize: 12, fontWeight: "900", color: "#fff" },
  sectionTitle: { fontSize: 15, fontWeight: "800", color: T.text },

  // Input
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
  textarea: { minHeight: 90, textAlignVertical: "top", paddingTop: 12 },
  inputError: { borderColor: T.red, backgroundColor: T.redSoft },

  // Picker button
  pickerBtn: {
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    overflow: "hidden",
  },
  pickerBtnFilled: { borderColor: T.blue, backgroundColor: T.blueSoft },
  pickerPlaceholder: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  pickerPlaceholderTxt: { flex: 1, fontSize: 14, color: T.textMuted },
  selectedEmpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
  },
  empAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  empAvatarTxt: { fontSize: 12, fontWeight: "800", color: "#fff" },
  selectedEmpName: { fontSize: 14, fontWeight: "700", color: T.text },
  selectedEmpSub: { fontSize: 11, color: T.textMuted, marginTop: 1 },

  // Doc type grid
  typeGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  typeCell: {
    width: "47%",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 11,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.bg,
    position: "relative",
  },
  typeCellActive: { borderColor: T.blue, backgroundColor: T.blueSoft },
  typeCellTxt: { fontSize: 11, fontWeight: "600", color: T.textSub, flex: 1 },
  typeCellTxtActive: { color: T.blue, fontWeight: "700" },
  typeCellCheck: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: T.blue,
    alignItems: "center",
    justifyContent: "center",
  },

  // Version chips
  versionRow: { flexDirection: "row", gap: 8 },
  versionChip: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: T.bg,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  versionChipActive: { backgroundColor: T.blue, borderColor: T.blue },
  versionTxt: { fontSize: 13, fontWeight: "700", color: T.textSub },
  versionTxtActive: { color: "#fff" },

  // Upload progress
  uploadProgressCard: {
    backgroundColor: T.blueSoft,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: T.blueMid,
    gap: 8,
  },
  uploadProgressTop: { flexDirection: "row", alignItems: "center", gap: 8 },
  uploadProgressTxt: { fontSize: 13, fontWeight: "700", color: T.blue },
  uploadTrack: {
    height: 5,
    backgroundColor: T.blueMid,
    borderRadius: 3,
    overflow: "hidden",
  },
  uploadFill: { height: "100%", backgroundColor: T.blue, borderRadius: 3 },

  // Access grid
  accessGrid: { flexDirection: "row", gap: 8 },
  accessCell: {
    flex: 1,
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    backgroundColor: T.bg,
    gap: 4,
    position: "relative",
  },
  accessCellActive: { borderColor: T.blue, backgroundColor: T.blueSoft },
  accessCellLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: T.textSub,
    textAlign: "center",
  },
  accessCellDesc: {
    fontSize: 9,
    color: T.textMuted,
    textAlign: "center",
    lineHeight: 13,
  },
  accessCheck: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: T.blue,
    alignItems: "center",
    justifyContent: "center",
  },

  // Date input
  dateInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  dateInput: {
    flex: 1,
    fontSize: 14,
    color: T.text,
    paddingHorizontal: 10,
    paddingVertical: 13,
  },

  // Tag input
  tagInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: T.bg,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  tagInput: {
    flex: 1,
    fontSize: 14,
    color: T.text,
    paddingHorizontal: 10,
    paddingVertical: 13,
  },
  tagPreview: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 8 },
  tagPreviewChip: {
    backgroundColor: T.blueSoft,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.blueMid,
  },
  tagPreviewTxt: { fontSize: 11, fontWeight: "700", color: T.blue },

  // Summary card
  summaryCard: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: T.border,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
  },
  summaryRowBorder: { borderBottomWidth: 1, borderBottomColor: "#F8FAFC" },
  summaryIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: T.bg,
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  summaryLabel: { flex: 1, fontSize: 12, color: T.textSub, fontWeight: "600" },
  summaryVal: { fontSize: 13, fontWeight: "700", color: T.text, maxWidth: 180 },

  // Submit
  submitBtn: {
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: T.blue,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: T.blue,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  submitBtnDisabled: { opacity: 0.7 },
  submitInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  submitTxt: { fontSize: 16, fontWeight: "800", color: "#fff" },
  uploadingDots: { flexDirection: "row", gap: 4 },
  uploadingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.6)",
  },

  // Error summary
  errorSummary: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    backgroundColor: T.redSoft,
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#FECACA",
  },
  errorSummaryTxt: { fontSize: 13, color: T.red, fontWeight: "600" },
});
