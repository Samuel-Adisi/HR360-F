import { useRouter } from "expo-router";
import { useCallback, useRef, useState } from "react";
import {
  Animated,
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
  UserGroupIcon,
  UserIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Design tokens ────────────────────────────────────────────────────────────
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

// ─── Choices (mirror serializer/model exactly) ────────────────────────────────
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

// ─── Initial form state — matches serializer write fields exactly ─────────────
const INITIAL_FORM = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  date_of_birth: "",
  address: "",
  city: "",
  state: "",
  zip_code: "",
  position: "",
  department: "",
  hire_date: "",
  employment_type: "Full-time",
  work_location: "Office",
  manager: "", // FK — store manager id as string; wire lookup later
  salary: "",
  pay_frequency: "Monthly",
  payment_method: "bank",
  bank_name: "",
  bank_account_number: "",
  bank_account_name: "",
  bank_branch: "",
  momo_network: "mtn",
  momo_number: "",
  emergency_contact: "",
  emergency_phone: "",
  notes: "",
  is_active: true,
};

// ─── Validation — mirrors serializer validators ───────────────────────────────
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
    errs.phone = "Enter a valid phone number (E.164 format)";
  }
  if (!form.position.trim()) errs.position = "Position is required";
  if (!form.department.trim()) errs.department = "Department is required";
  if (!form.hire_date.trim()) {
    errs.hire_date = "Hire date is required";
  } else {
    const d = new Date(form.hire_date);
    if (isNaN(d.getTime())) {
      errs.hire_date = "Enter a valid date (YYYY-MM-DD)";
    } else if (d > new Date()) {
      errs.hire_date = "Hire date cannot be in the future";
    }
  }
  if (form.date_of_birth) {
    const dob = new Date(form.date_of_birth);
    if (isNaN(dob.getTime())) {
      errs.date_of_birth = "Enter a valid date (YYYY-MM-DD)";
    } else {
      const today = new Date();
      const age =
        today.getFullYear() -
        dob.getFullYear() -
        ((today.getMonth(), today.getDate()) < (dob.getMonth(), dob.getDate())
          ? 1
          : 0);
      if (age < 16)
        errs.date_of_birth = "Employee must be at least 16 years old";
    }
  }
  if (form.salary && isNaN(parseFloat(form.salary))) {
    errs.salary = "Salary must be a valid number";
  }
  return errs;
}

// ─── Toast ────────────────────────────────────────────────────────────────────
function Toast({ message, type, visible }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useState(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const isSuccess = type === "success";
  const bgColor = isSuccess ? C.green : C.red;

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        ts.toast,
        { backgroundColor: bgColor, opacity, transform: [{ translateY }] },
      ]}
    >
      {isSuccess ? (
        <CheckCircleIcon size={18} color="#fff" strokeWidth={2.5} />
      ) : (
        <ExclamationTriangleIcon size={18} color="#fff" strokeWidth={2.5} />
      )}
      <Text style={ts.toastText}>{message}</Text>
    </Animated.View>
  );
}

// ─── Loading Overlay ──────────────────────────────────────────────────────────
function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <View style={ts.overlay}>
      <View style={ts.spinnerCard}>
        <Spinner />
        <Text style={ts.spinnerLabel}>Saving employee…</Text>
      </View>
    </View>
  );
}

function Spinner() {
  const rotation = useRef(new Animated.Value(0)).current;
  useState(() => {
    Animated.loop(
      Animated.timing(rotation, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ).start();
  }, []);
  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });
  return (
    <Animated.View style={[ts.spinner, { transform: [{ rotate: spin }] }]} />
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
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

function Field({
  icon: Icon,
  iconColor = C.accent,
  label,
  error,
  required,
  hint,
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

function PillSelector({
  label,
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
                <CheckCircleIcon size={13} color="#fff" strokeWidth={2.5} />
              ) : null}
              <Text style={[s.pillText, selected && { color: "#fff" }]}>
                {optLabel}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

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

function FormCard({ children }) {
  return <View style={s.formCard}>{children}</View>;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AddEmployeeScreen() {
  const router = useRouter();
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3200);
  }, []);

  const set = (key) => (val) => {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const handleSave = async () => {
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      showToast("Please fix the highlighted fields.", "error");
      return;
    }

    setSaving(true);

    // ── PLACEHOLDER: replace with your API call ──────────────────────────────
    // const payload = {
    //   first_name: form.first_name,
    //   last_name: form.last_name,
    //   email: form.email,
    //   phone: form.phone,
    //   date_of_birth: form.date_of_birth || null,
    //   address: form.address,
    //   city: form.city,
    //   state: form.state,
    //   zip_code: form.zip_code,
    //   position: form.position,
    //   department: form.department,
    //   hire_date: form.hire_date,
    //   employment_type: form.employment_type,
    //   work_location: form.work_location,
    //   manager: form.manager ? parseInt(form.manager) : null,
    //   salary: form.salary ? parseFloat(form.salary) : null,
    //   pay_frequency: form.pay_frequency,
    //   payment_method: form.payment_method,
    //   bank_name: form.bank_name || null,
    //   bank_account_number: form.bank_account_number || null,
    //   bank_account_name: form.bank_account_name || null,
    //   bank_branch: form.bank_branch || null,
    //   momo_network: form.momo_network || null,
    //   momo_number: form.momo_number || null,
    //   emergency_contact: form.emergency_contact,
    //   emergency_phone: form.emergency_phone,
    //   notes: form.notes,
    //   is_active: form.is_active,
    // };
    // await api.post('/employees/', payload);
    // ────────────────────────────────────────────────────────────────────────

    setTimeout(() => {
      setSaving(false);
      showToast("Employee added successfully!", "success");
      setTimeout(() => router.back(), 1400);
    }, 1200);
  };

  const isMomo = form.payment_method === "momo";

  return (
    <View style={s.root}>
      {/* ── Toast ── */}
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />

      {/* ── Loading overlay ── */}
      <LoadingOverlay visible={saving} />

      {/* ── Navbar ── */}
      <SafeAreaView edges={["top"]} style={s.navbar}>
        <Pressable
          style={({ pressed }) => [s.navBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.push('/employees')}
        >
          <XMarkIcon size={20} color={C.navy} strokeWidth={2.2} />
        </Pressable>

        <View style={s.navCenter}>
          <View style={s.navBadge}>
            <UserGroupIcon size={16} color={C.accent} strokeWidth={2.5} />
          </View>
          <View>
            <Text style={s.navTitle}>New Employee</Text>
            <Text style={s.navSub}>Fill in all required fields</Text>
          </View>
        </View>

        <Pressable
          onPress={handleSave}
          disabled={saving}
          style={({ pressed }) => [
            s.saveBtn,
            pressed && { opacity: 0.8 },
            saving && { opacity: 0.5 },
          ]}
        >
          <Text style={s.saveBtnText}>Add</Text>
        </Pressable>
      </SafeAreaView>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Progress hint banner ── */}
          <View style={s.hintBanner}>
            <View style={s.hintDot} />
            <Text style={s.hintText}>
              Fields marked{" "}
              <Text style={{ color: C.red, fontWeight: "700" }}>*</Text> are
              required.{" "}
              <Text style={{ color: C.accent, fontWeight: "700" }}>
                employee_id
              </Text>{" "}
              is auto-generated by the server.
            </Text>
          </View>

          {/* ───────────────── 1. PERSONAL INFO ───────────────────────────── */}
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
                hint="E.164 format"
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

          {/* ───────────────── 2. ADDRESS ─────────────────────────────────── */}
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
                returnKeyType="done"
              />
            </FormCard>
          </View>

          {/* ───────────────── 3. EMPLOYMENT ──────────────────────────────── */}
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

              {/* manager FK — plain text ID field; wire lookup/dropdown later */}
              <Field
                icon={UserGroupIcon}
                iconColor={C.sub}
                label="Manager ID"
                value={form.manager}
                onChangeText={set("manager")}
                placeholder="Employee ID of manager (optional)"
                error={errors.manager}
                keyboardType="numeric"
                returnKeyType="next"
                hint="Wire to a picker when ready"
              />

              <PillSelector
                iconColor={C.blue}
                label="Employment Type"
                required
                options={EMPLOYMENT_TYPES}
                value={form.employment_type}
                onChange={set("employment_type")}
              />

              <PillSelector
                iconColor={C.orange}
                label="Work Location"
                options={WORK_LOCATIONS}
                value={form.work_location}
                onChange={set("work_location")}
              />

              <View style={s.toggleCard}>
                <ToggleRow
                  icon={CheckCircleIcon}
                  iconColor={form.is_active ? C.green : C.muted}
                  label="Employee Status"
                  subtitle={
                    form.is_active
                      ? "Active on creation"
                      : "Inactive on creation"
                  }
                  value={form.is_active}
                  onChange={set("is_active")}
                />
              </View>
            </FormCard>
          </View>

          {/* ───────────────── 4. COMPENSATION ───────────────────────────── */}
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
                hint="Gross amount"
              />
              <PillSelector
                iconColor={C.accent}
                label="Pay Frequency"
                options={PAY_FREQUENCIES}
                value={form.pay_frequency}
                onChange={set("pay_frequency")}
              />
            </FormCard>
          </View>

          {/* ───────────────── 5. PAYMENT METHOD ─────────────────────────── */}
          <View style={s.section}>
            <SectionHeader
              title="Payment Method"
              subtitle="How this employee gets paid"
            />
            <FormCard>
              <PillSelector
                iconColor={C.orange}
                label="Payment Method"
                options={PAYMENT_METHODS}
                value={form.payment_method}
                onChange={set("payment_method")}
              />

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

          {/* ───────────────── 6. EMERGENCY CONTACT ──────────────────────── */}
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

          {/* ───────────────── 7. NOTES ───────────────────────────────────── */}
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
                <View style={s.notesInputWrap}>
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

          {/* ── Bottom CTA ── */}
          <View style={s.bottomCTA}>
            <Pressable
              onPress={() => router.replace("/dashboard")}
              style={({ pressed }) => [
                s.cancelBtn,
                pressed && { opacity: 0.7 },
              ]}
            >
              <Text style={s.cancelBtnText}>Cancel</Text>
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
              <CheckCircleIcon size={18} color="#fff" strokeWidth={2.5} />
              <Text style={s.saveBtnLargeText}>
                {saving ? "Adding Employee…" : "Add Employee"}
              </Text>
            </Pressable>
          </View>

          <View style={{ height: 48 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Toast & Spinner styles ───────────────────────────────────────────────────
const ts = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15,23,42,0.45)",
    zIndex: 998,
    alignItems: "center",
    justifyContent: "center",
  },
  spinnerCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    paddingHorizontal: 36,
    paddingVertical: 28,
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  spinner: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 3.5,
    borderColor: "#E2E8F0",
    borderTopColor: "#0F766E",
  },
  spinnerLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.2,
  },
});

// ─── Screen styles (mirrored from EditEmployeeScreen) ─────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },

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
  saveBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  hintBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 14,
    marginBottom: 4,
    backgroundColor: C.accentLight,
    borderWidth: 1,
    borderColor: C.accentMid,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  hintDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.accent,
    marginTop: 5,
    flexShrink: 0,
  },
  hintText: {
    flex: 1,
    fontSize: 12,
    color: C.sub,
    fontWeight: "500",
    lineHeight: 18,
  },

  section: { paddingHorizontal: 16, marginBottom: 16, marginTop: 10 },
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

  formCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingTop: 8,
    paddingBottom: 4,
  },
  twoCol: { flexDirection: "row", gap: 10 },

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

  iconSquare: { alignItems: "center", justifyContent: "center", flexShrink: 0 },

  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 2 },
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
  pillText: { fontSize: 13, fontWeight: "600", color: C.sub },

  toggleCard: {
    borderTopWidth: 1,
    borderTopColor: C.divider,
    marginTop: 8,
    paddingTop: 12,
    paddingBottom: 4,
  },
  toggleRow: { flexDirection: "row", alignItems: "center" },
  toggleLabel: { fontSize: 14, fontWeight: "700", color: C.navy },
  toggleSubtitle: {
    fontSize: 11,
    color: C.muted,
    marginTop: 2,
    fontWeight: "500",
  },

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
  cancelBtnText: { fontSize: 14, fontWeight: "700", color: C.sub },
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
    color: "#fff",
    letterSpacing: -0.2,
  },
});
