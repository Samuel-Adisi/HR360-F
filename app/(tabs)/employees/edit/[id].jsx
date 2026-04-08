import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    BanknotesIcon,
    BriefcaseIcon,
    BuildingOffice2Icon,
    CalendarDaysIcon,
    CheckCircleIcon,
    DevicePhoneMobileIcon,
    DocumentTextIcon,
    EnvelopeIcon,
    ExclamationTriangleIcon,
    GlobeAltIcon,
    HashtagIcon,
    HomeIcon,
    IdentificationIcon,
    MapPinIcon,
    PhoneIcon,
    UserIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Mock — mirrors MOCK_EMPLOYEE from detail screen ─────────────────────────
const MOCK_EMPLOYEE = {
  id: 2,
  first_name: "James",
  last_name: "Osei",
  full_name: "James Osei",
  email: "james.osei@hr360.io",
  phone: "+233 24 567 8901",
  date_of_birth: "1991-07-14",
  address: "12 Ring Road East",
  city: "Accra",
  state: "Greater Accra",
  zip_code: "GA-123",
  profile_picture: null,
  employee_id: "EMP-0002",
  position: "Lead Backend Engineer",
  department: "Engineering",
  hire_date: "2021-03-08",
  employment_type: "Full-time",
  work_location: "Hybrid",
  manager: 1,
  manager_name: "Alice Mensah",
  salary: "12500.00",
  pay_frequency: "Monthly",
  payment_method: "bank",
  bank_name: "GCB Bank",
  bank_account_number: "****4821",
  bank_account_name: "James Kofi Osei",
  bank_branch: "Accra Main",
  momo_network: null,
  momo_number: null,
  emergency_contact: "Abena Osei",
  emergency_phone: "+233 20 111 2233",
  notes: "Strong performer. Led the migration to DRF 3.15 in Q1.",
  is_active: true,
};

// ─── Design tokens (same as detail screen) ───────────────────────────────────
const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  accentMid: "#CCFBF1",
  navy: "#0F172A",
  slate: "#1E293B",
  sub: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  divider: "#F1F5F9",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  green: "#059669",
  greenBg: "#DCFCE7",
  greenText: "#15803D",
  red: "#DC2626",
  redBg: "#FEE2E2",
  redText: "#B91C1C",
  amber: "#D97706",
  amberBg: "#FEF3C7",
  amberText: "#92400E",
  blue: "#0A66C2",
  purple: "#7C3AED",
  orange: "#F97316",
  inputBg: "#FAFAFA",
  focusBorder: "#0F766E",
  errorBorder: "#DC2626",
  errorBg: "#FEF2F2",
};

// ─── Choice constants — mirrors model choices exactly ────────────────────────
const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Intern"];
const WORK_LOCATIONS = ["Office", "Remote", "Hybrid"];
const PAY_FREQUENCIES = ["Weekly", "Bi-weekly", "Monthly", "Annual"];
const PAYMENT_METHODS = [
  { value: "bank", label: "Bank Transfer" },
  { value: "momo", label: "Mobile Money" },
];
const MOMO_NETWORKS = [
  { value: "mtn", label: "MTN" },
  { value: "vodafone", label: "Vodafone" },
  { value: "airteltigo", label: "AirtelTigo" },
];

// ─── Field validation ─────────────────────────────────────────────────────────
function validate(form) {
  const errs = {};
  if (!form.first_name.trim()) errs.first_name = "First name is required";
  if (!form.last_name.trim()) errs.last_name = "Last name is required";
  if (!form.email.trim()) {
    errs.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errs.email = "Enter a valid email address";
  }
  if (!form.phone.trim()) {
    errs.phone = "Phone is required";
  } else if (!/^\+?\d{9,15}$/.test(form.phone.replace(/\s/g, ""))) {
    errs.phone = "Enter a valid phone number";
  }
  if (!form.position.trim()) errs.position = "Position is required";
  if (!form.department.trim()) errs.department = "Department is required";
  if (!form.hire_date.trim()) errs.hire_date = "Hire date is required";
  if (form.salary && isNaN(parseFloat(form.salary))) {
    errs.salary = "Salary must be a valid number";
  }
  return errs;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Dashboard-style solid-colored square icon, white icon inside */
function IconSquare({ icon: Icon, color, size = 34 }) {
  return (
    <View
      style={[
        s.iconSquare,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size * 0.27,
        },
      ]}
    >
      <Icon size={15} color="#FFFFFF" strokeWidth={2} />
    </View>
  );
}

function SectionHeader({ title, subtitle }) {
  return (
    <View style={s.sectionHeaderRow}>
      <View style={s.sectionBarAccent} />
      <View>
        <Text style={s.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={s.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

/** Animated text input field */
function Field({
  icon: Icon,
  iconColor = C.accent,
  label,
  error,
  required,
  hint,
  inputRef,
  ...inputProps
}) {
  const [focused, setFocused] = useState(false);
  const borderColor = error
    ? C.errorBorder
    : focused
      ? C.focusBorder
      : C.border;
  const bgColor = error ? C.errorBg : focused ? C.accentLight : C.inputBg;

  return (
    <View style={s.fieldWrap}>
      <View style={s.fieldLabelRow}>
        <Text style={s.fieldLabel}>
          {label}
          {required ? <Text style={{ color: C.red }}> *</Text> : null}
        </Text>
        {hint ? <Text style={s.fieldHint}>{hint}</Text> : null}
      </View>
      <View style={[s.inputRow, { borderColor, backgroundColor: bgColor }]}>
        <IconSquare icon={Icon} color={iconColor} size={32} />
        <TextInput
          ref={inputRef}
          style={s.textInput}
          placeholderTextColor={C.muted}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...inputProps}
        />
      </View>
      {error ? (
        <View style={s.errorRow}>
          <ExclamationTriangleIcon size={11} color={C.red} strokeWidth={2} />
          <Text style={s.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
}

/** Pill-style option selector */
function PillSelector({
  label,
  icon: Icon,
  iconColor = C.accent,
  options,
  value,
  onChange,
  required,
}) {
  return (
    <View style={s.fieldWrap}>
      <View style={s.fieldLabelRow}>
        <Text style={s.fieldLabel}>
          {label}
          {required ? <Text style={{ color: C.red }}> *</Text> : null}
        </Text>
      </View>
      <View style={s.pillRow}>
        {options.map((opt) => {
          const optVal = typeof opt === "object" ? opt.value : opt;
          const optLabel = typeof opt === "object" ? opt.label : opt;
          const selected = value === optVal;
          return (
            <Pressable
              key={optVal}
              onPress={() => onChange(optVal)}
              style={({ pressed }) => [
                s.pill,
                selected && {
                  backgroundColor: iconColor,
                  borderColor: iconColor,
                },
                pressed && { opacity: 0.8 },
              ]}
            >
              {selected ? (
                <CheckCircleIcon size={13} color="#FFFFFF" strokeWidth={2.5} />
              ) : null}
              <Text style={[s.pillText, selected && { color: "#FFFFFF" }]}>
                {optLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

/** Boolean toggle row */
function ToggleRow({
  icon: Icon,
  iconColor,
  label,
  subtitle,
  value,
  onChange,
}) {
  return (
    <View style={s.toggleRow}>
      <IconSquare icon={Icon} color={iconColor} size={36} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text style={s.toggleLabel}>{label}</Text>
        {subtitle ? <Text style={s.toggleSubtitle}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: C.border, true: C.accentMid }}
        thumbColor={value ? C.accent : C.muted}
        ios_backgroundColor={C.border}
      />
    </View>
  );
}

/** Collapsible section card */
function FormCard({ children }) {
  return <View style={s.formCard}>{children}</View>;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EditEmployeeScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Wire to API: replace with useFetch / useQuery result
  const emp = MOCK_EMPLOYEE;

  // ── Form state — matches serializer fields exactly ─────────────────────────
  const [form, setForm] = useState({
    // Personal
    first_name: emp.first_name ?? "",
    last_name: emp.last_name ?? "",
    email: emp.email ?? "",
    phone: emp.phone ?? "",
    date_of_birth: emp.date_of_birth ?? "",
    address: emp.address ?? "",
    city: emp.city ?? "",
    state: emp.state ?? "",
    zip_code: emp.zip_code ?? "",

    // Employment
    position: emp.position ?? "",
    department: emp.department ?? "",
    hire_date: emp.hire_date ?? "",
    employment_type: emp.employment_type ?? "Full-time",
    work_location: emp.work_location ?? "Office",

    // Compensation
    salary: emp.salary ? String(emp.salary) : "",
    pay_frequency: emp.pay_frequency ?? "Monthly",
    payment_method: emp.payment_method ?? "bank",

    // Bank
    bank_name: emp.bank_name ?? "",
    bank_account_number: emp.bank_account_number ?? "",
    bank_account_name: emp.bank_account_name ?? "",
    bank_branch: emp.bank_branch ?? "",

    // MoMo
    momo_network: emp.momo_network ?? "",
    momo_number: emp.momo_number ?? "",

    // Emergency
    emergency_contact: emp.emergency_contact ?? "",
    emergency_phone: emp.emergency_phone ?? "",

    // Notes & status
    notes: emp.notes ?? "",
    is_active: emp.is_active ?? true,
  });

  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      Alert.alert(
        "Validation Error",
        "Please fix the highlighted fields before saving.",
      );
      return;
    }
    setSaving(true);
    // ── Replace with: await api.patch(`/employees/${id}/`, payload) ──
    setTimeout(() => {
      setSaving(false);
      Alert.alert("Saved", "Employee updated successfully.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }, 900);
  };

  const isMomo = form.payment_method === "momo";

  return (
    <View style={s.root}>
      {/* ── Navbar ── */}
      <SafeAreaView edges={["top"]} style={s.navbar}>
        <Pressable
          style={({ pressed }) => [s.navBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.back()}
        >
          <Text style={s.backText}>‹</Text>
        </Pressable>

        <View style={s.navCenter}>
          <View style={s.navBadge}>
            <UserIcon size={16} color={C.accent} strokeWidth={2.5} />
          </View>
          <View>
            <Text style={s.navTitle}>Edit Employee</Text>
            <Text style={s.navSub}>{emp.employee_id}</Text>
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [
            s.saveBtn,
            pressed && { opacity: 0.8 },
            saving && { opacity: 0.6 },
          ]}
        >
          <Text style={s.saveBtnText}>{saving ? "Saving…" : "Save"}</Text>
        </Pressable>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Read-only identity banner ── */}
          <View style={s.identityBanner}>
            <View style={s.identityLeft}>
              <View style={s.avatarCircle}>
                <Text style={s.avatarInitials}>
                  {(emp.first_name?.[0] ?? "") + (emp.last_name?.[0] ?? "")}
                </Text>
              </View>
              <View>
                <Text style={s.identityName}>{emp.full_name}</Text>
                <Text style={s.identityMeta}>
                  {emp.employee_id} · {emp.department}
                </Text>
              </View>
            </View>
            <View
              style={[
                s.activeBadge,
                { backgroundColor: emp.is_active ? C.greenBg : C.redBg },
              ]}
            >
              <View
                style={[
                  s.activeDot,
                  { backgroundColor: emp.is_active ? C.green : C.red },
                ]}
              />
              <Text
                style={[
                  s.activeText,
                  { color: emp.is_active ? C.greenText : C.redText },
                ]}
              >
                {emp.is_active ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          {/* ─────────────────────────── 1. PERSONAL INFO ──────────────────────────── */}
          <View style={s.section}>
            <SectionHeader
              title="Personal Information"
              subtitle="Basic identity & contact details"
            />
            <FormCard>
              <View style={s.twoCol}>
                <View style={{ flex: 1 }}>
                  <Field
                    icon={UserIcon}
                    iconColor={C.accent}
                    label="First Name"
                    required
                    value={form.first_name}
                    onChangeText={set("first_name")}
                    placeholder="First name"
                    error={errors.first_name}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Field
                    icon={UserIcon}
                    iconColor={C.purple}
                    label="Last Name"
                    required
                    value={form.last_name}
                    onChangeText={set("last_name")}
                    placeholder="Last name"
                    error={errors.last_name}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              </View>

              <Field
                icon={EnvelopeIcon}
                iconColor={C.blue}
                label="Email Address"
                required
                value={form.email}
                onChangeText={set("email")}
                placeholder="name@company.com"
                error={errors.email}
                keyboardType="email-address"
                autoCapitalize="none"
                returnKeyType="next"
              />

              <Field
                icon={PhoneIcon}
                iconColor={C.green}
                label="Phone Number"
                required
                value={form.phone}
                onChangeText={set("phone")}
                placeholder="+233 24 000 0000"
                error={errors.phone}
                keyboardType="phone-pad"
                returnKeyType="next"
                hint="E.164 format preferred"
              />

              <Field
                icon={CalendarDaysIcon}
                iconColor={C.purple}
                label="Date of Birth"
                value={form.date_of_birth}
                onChangeText={set("date_of_birth")}
                placeholder="YYYY-MM-DD"
                error={errors.date_of_birth}
                keyboardType="numeric"
                returnKeyType="next"
                hint="Must be 16+ years old"
              />
            </FormCard>
          </View>

          {/* ─────────────────────────── 2. ADDRESS ───────────────────────────────── */}
          <View style={s.section}>
            <SectionHeader title="Address" subtitle="Residential location" />
            <FormCard>
              <Field
                icon={HomeIcon}
                iconColor={C.accent}
                label="Street Address"
                value={form.address}
                onChangeText={set("address")}
                placeholder="12 Ring Road East"
                error={errors.address}
                autoCapitalize="words"
                returnKeyType="next"
              />
              <View style={s.twoCol}>
                <View style={{ flex: 1 }}>
                  <Field
                    icon={MapPinIcon}
                    iconColor={C.orange}
                    label="City"
                    value={form.city}
                    onChangeText={set("city")}
                    placeholder="Accra"
                    error={errors.city}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Field
                    icon={GlobeAltIcon}
                    iconColor={C.blue}
                    label="State / Region"
                    value={form.state}
                    onChangeText={set("state")}
                    placeholder="Greater Accra"
                    error={errors.state}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                </View>
              </View>
              <Field
                icon={HashtagIcon}
                iconColor={C.slate}
                label="ZIP / Postal Code"
                value={form.zip_code}
                onChangeText={set("zip_code")}
                placeholder="GA-123"
                error={errors.zip_code}
                keyboardType="default"
                returnKeyType="done"
              />
            </FormCard>
          </View>

          {/* ─────────────────────────── 3. EMPLOYMENT ────────────────────────────── */}
          <View style={s.section}>
            <SectionHeader
              title="Employment Details"
              subtitle="Role, department & scheduling"
            />
            <FormCard>
              <Field
                icon={BriefcaseIcon}
                iconColor={C.blue}
                label="Position / Job Title"
                required
                value={form.position}
                onChangeText={set("position")}
                placeholder="e.g. Lead Backend Engineer"
                error={errors.position}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Field
                icon={BuildingOffice2Icon}
                iconColor={C.accent}
                label="Department"
                required
                value={form.department}
                onChangeText={set("department")}
                placeholder="e.g. Engineering"
                error={errors.department}
                autoCapitalize="words"
                returnKeyType="next"
              />

              <Field
                icon={CalendarDaysIcon}
                iconColor={C.accent}
                label="Hire Date"
                required
                value={form.hire_date}
                onChangeText={set("hire_date")}
                placeholder="YYYY-MM-DD"
                error={errors.hire_date}
                keyboardType="numeric"
                returnKeyType="next"
                hint="Cannot be a future date"
              />

              <PillSelector
                icon={BriefcaseIcon}
                iconColor={C.blue}
                label="Employment Type"
                required
                options={EMPLOYMENT_TYPES}
                value={form.employment_type}
                onChange={set("employment_type")}
              />

              <PillSelector
                icon={BuildingOffice2Icon}
                iconColor={C.orange}
                label="Work Location"
                options={WORK_LOCATIONS}
                value={form.work_location}
                onChange={set("work_location")}
              />

              {/* Status toggle */}
              <View style={s.toggleCard}>
                <ToggleRow
                  icon={CheckCircleIcon}
                  iconColor={form.is_active ? C.green : C.muted}
                  label="Employee Status"
                  subtitle={
                    form.is_active ? "Currently active" : "Currently inactive"
                  }
                  value={form.is_active}
                  onChange={set("is_active")}
                />
              </View>
            </FormCard>
          </View>

          {/* ─────────────────────────── 4. COMPENSATION ──────────────────────────── */}
          <View style={s.section}>
            <SectionHeader
              title="Compensation"
              subtitle="Salary & payment schedule"
            />
            <FormCard>
              <Field
                icon={BanknotesIcon}
                iconColor={C.green}
                label="Salary (GHS)"
                value={form.salary}
                onChangeText={set("salary")}
                placeholder="e.g. 12500.00"
                error={errors.salary}
                keyboardType="decimal-pad"
                returnKeyType="next"
                hint="Gross monthly / as per frequency"
              />

              <PillSelector
                icon={CalendarDaysIcon}
                iconColor={C.accent}
                label="Pay Frequency"
                options={PAY_FREQUENCIES}
                value={form.pay_frequency}
                onChange={set("pay_frequency")}
              />
            </FormCard>
          </View>

          {/* ─────────────────────────── 5. PAYMENT METHOD ────────────────────────── */}
          <View style={s.section}>
            <SectionHeader
              title="Payment Method"
              subtitle="How this employee gets paid"
            />
            <FormCard>
              <PillSelector
                icon={IdentificationIcon}
                iconColor={C.orange}
                label="Payment Method"
                options={PAYMENT_METHODS}
                value={form.payment_method}
                onChange={set("payment_method")}
              />

              {/* ── Bank fields — shown when payment_method === 'bank' ── */}
              {!isMomo && (
                <>
                  <View style={s.subSectionDivider}>
                    <BuildingOffice2Icon
                      size={13}
                      color={C.blue}
                      strokeWidth={2}
                    />
                    <Text style={s.subSectionLabel}>Bank Transfer Details</Text>
                  </View>

                  <Field
                    icon={BuildingOffice2Icon}
                    iconColor={C.blue}
                    label="Bank Name"
                    value={form.bank_name}
                    onChangeText={set("bank_name")}
                    placeholder="e.g. GCB Bank"
                    error={errors.bank_name}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                  <Field
                    icon={IdentificationIcon}
                    iconColor={C.accent}
                    label="Account Name"
                    value={form.bank_account_name}
                    onChangeText={set("bank_account_name")}
                    placeholder="Full name on account"
                    error={errors.bank_account_name}
                    autoCapitalize="words"
                    returnKeyType="next"
                  />
                  <Field
                    icon={HashtagIcon}
                    iconColor={C.slate}
                    label="Account Number"
                    value={form.bank_account_number}
                    onChangeText={set("bank_account_number")}
                    placeholder="Account number"
                    error={errors.bank_account_number}
                    keyboardType="numeric"
                    returnKeyType="next"
                  />
                  <Field
                    icon={MapPinIcon}
                    iconColor={C.purple}
                    label="Bank Branch"
                    value={form.bank_branch}
                    onChangeText={set("bank_branch")}
                    placeholder="e.g. Accra Main"
                    error={errors.bank_branch}
                    autoCapitalize="words"
                    returnKeyType="done"
                  />
                </>
              )}

              {/* ── MoMo fields — shown when payment_method === 'momo' ── */}
              {isMomo && (
                <>
                  <View style={s.subSectionDivider}>
                    <DevicePhoneMobileIcon
                      size={13}
                      color={C.purple}
                      strokeWidth={2}
                    />
                    <Text style={[s.subSectionLabel, { color: C.purple }]}>
                      Mobile Money Details
                    </Text>
                  </View>

                  <PillSelector
                    icon={DevicePhoneMobileIcon}
                    iconColor={C.purple}
                    label="MoMo Network"
                    options={MOMO_NETWORKS}
                    value={form.momo_network}
                    onChange={set("momo_network")}
                  />
                  <Field
                    icon={PhoneIcon}
                    iconColor={C.green}
                    label="MoMo Number"
                    value={form.momo_number}
                    onChangeText={set("momo_number")}
                    placeholder="+233 24 000 0000"
                    error={errors.momo_number}
                    keyboardType="phone-pad"
                    returnKeyType="done"
                  />
                </>
              )}
            </FormCard>
          </View>

          {/* ─────────────────────────── 6. EMERGENCY CONTACT ─────────────────────── */}
          <View style={s.section}>
            <SectionHeader
              title="Emergency Contact"
              subtitle="Next of kin or trusted contact"
            />
            <FormCard>
              <Field
                icon={UserIcon}
                iconColor={C.red}
                label="Contact Name"
                value={form.emergency_contact}
                onChangeText={set("emergency_contact")}
                placeholder="Full name"
                error={errors.emergency_contact}
                autoCapitalize="words"
                returnKeyType="next"
              />
              <Field
                icon={PhoneIcon}
                iconColor={C.red}
                label="Contact Phone"
                value={form.emergency_phone}
                onChangeText={set("emergency_phone")}
                placeholder="+233 20 000 0000"
                error={errors.emergency_phone}
                keyboardType="phone-pad"
                returnKeyType="done"
              />
            </FormCard>
          </View>

          {/* ─────────────────────────── 7. NOTES ─────────────────────────────────── */}
          <View style={s.section}>
            <SectionHeader
              title="Notes"
              subtitle="Internal HR notes — not visible to employee"
            />
            <View style={s.formCard}>
              <View style={s.fieldWrap}>
                <View style={s.fieldLabelRow}>
                  <Text style={s.fieldLabel}>Notes</Text>
                  <Text style={s.fieldHint}>Optional</Text>
                </View>
                <View style={[s.notesInputWrap]}>
                  <View style={{ marginBottom: 8 }}>
                    <IconSquare
                      icon={DocumentTextIcon}
                      color={C.amber}
                      size={32}
                    />
                  </View>
                  <TextInput
                    style={s.notesInput}
                    value={form.notes}
                    onChangeText={set("notes")}
                    placeholder="Add internal notes about this employee…"
                    placeholderTextColor={C.muted}
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </View>
          </View>

          {/* ── Bottom save CTA ── */}
          <View style={s.bottomCTA}>
            <Pressable
              onPress={() => router.back()}
              style={({ pressed }) => [
                s.cancelBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={s.cancelBtnText}>Discard Changes</Text>
            </Pressable>
            <Pressable
              onPress={handleSave}
              disabled={saving}
              style={({ pressed }) => [
                s.saveBtnLarge,
                pressed && { opacity: 0.85 },
                saving && { opacity: 0.6 },
              ]}
            >
              <CheckCircleIcon size={18} color="#FFFFFF" strokeWidth={2.5} />
              <Text style={s.saveBtnLargeText}>
                {saving ? "Saving Changes…" : "Save Changes"}
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 48 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },

  // Navbar
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  backText: {
    fontSize: 30,
    color: C.navy,
    fontWeight: "300",
    lineHeight: 34,
    marginTop: -2,
  },
  navCenter: { flexDirection: "row", alignItems: "center", gap: 10 },
  navBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
  },
  navSub: { fontSize: 11, color: C.muted, fontWeight: "600", marginTop: 1 },
  saveBtn: {
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: C.accent,
  },
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#FFFFFF" },

  // Identity banner
  identityBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.white,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 20,
  },
  identityLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.accentMid,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.accent,
  },
  avatarInitials: {
    fontSize: 16,
    fontWeight: "800",
    color: C.accent,
    letterSpacing: -0.3,
  },
  identityName: {
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.2,
  },
  identityMeta: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
    fontWeight: "500",
  },
  activeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  activeDot: { width: 6, height: 6, borderRadius: 3 },
  activeText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.2 },

  // Section
  section: { paddingHorizontal: 16, marginBottom: 16 },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
    marginTop: 4,
  },
  sectionBarAccent: {
    width: 3,
    height: 32,
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.2,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: C.muted,
    marginTop: 1,
    fontWeight: "500",
  },

  // Form card
  formCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },

  // Two-column layout
  twoCol: {
    flexDirection: "row",
    gap: 10,
  },

  // Field
  fieldWrap: { marginVertical: 8 },
  fieldLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  fieldHint: { fontSize: 10, color: C.muted, fontWeight: "500" },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: C.navy,
    fontWeight: "600",
    paddingVertical: 0,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 4,
  },
  errorText: { fontSize: 11, color: C.red, fontWeight: "600" },

  // Icon square — dashboard style
  iconSquare: {
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  // Pill selector
  pillRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.inputBg,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "600",
    color: C.sub,
  },

  // Toggle
  toggleCard: {
    borderTopWidth: 1,
    borderTopColor: C.divider,
    marginTop: 8,
    paddingTop: 12,
    paddingBottom: 4,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: C.navy,
  },
  toggleSubtitle: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
    fontWeight: "500",
  },

  // Sub-section divider inside payment card
  subSectionDivider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: C.divider,
    marginTop: 4,
  },
  subSectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.blue,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },

  // Notes
  notesInputWrap: {
    borderWidth: 1.5,
    borderColor: C.border,
    borderRadius: 12,
    backgroundColor: C.inputBg,
    padding: 12,
    minHeight: 110,
  },
  notesInput: {
    fontSize: 14,
    color: C.navy,
    fontWeight: "500",
    lineHeight: 21,
    minHeight: 72,
  },

  // Bottom CTA
  bottomCTA: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: C.sub,
  },
  saveBtnLarge: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
    borderRadius: 14,
    backgroundColor: C.accent,
  },
  saveBtnLargeText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
});
