import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import {
    Alert,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import {
    BanknotesIcon,
    BriefcaseIcon,
    CalendarDaysIcon,
    CheckCircleIcon,
    ChevronDownIcon,
    ClockIcon,
    DocumentTextIcon,
    ExclamationTriangleIcon,
    FaceSmileIcon,
    XCircleIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Design tokens (matches LeaveScreen exactly) ──────────────────────────────
const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  accentMid: "#CCFBF1",
  navy: "#0F172A",
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
  blueBg: "#EFF6FF",
  blueText: "#1D4ED8",
};

// ─── Leave types (matches backend LEAVE_TYPE_CHOICES) ─────────────────────────
const LEAVE_TYPES = [
  {
    value: "Annual",
    label: "Annual Leave",
    icon: CalendarDaysIcon,
    desc: "Planned vacation or personal time off",
  },
  {
    value: "Sick",
    label: "Sick Leave",
    icon: ExclamationTriangleIcon,
    desc: "Medical illness or health appointment",
  },
  {
    value: "Casual",
    label: "Casual Leave",
    icon: BriefcaseIcon,
    desc: "Short personal errands or urgent matters",
  },
  {
    value: "Maternity",
    label: "Maternity Leave",
    icon: FaceSmileIcon,
    desc: "Maternity rest and newborn care",
  },
  {
    value: "Paternity",
    label: "Paternity Leave",
    icon: FaceSmileIcon,
    desc: "Paternity rest and newborn care",
  },
  {
    value: "Unpaid",
    label: "Unpaid Leave",
    icon: BanknotesIcon,
    desc: "Leave without pay entitlement",
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtDate(iso) {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function calcWorkingDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  let count = 0;
  const cur = new Date(s);
  while (cur <= e) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function todayISO() {
  return new Date().toISOString().split("T")[0];
}

function addDaysISO(iso, days) {
  const d = new Date(iso);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function IconSquare({ icon: Icon, color, size = 34 }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.27,
        backgroundColor: color,
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <Icon size={size * 0.44} color="#FFFFFF" strokeWidth={2} />
    </View>
  );
}

function SectionLabel({ title }) {
  return (
    <View style={s.sectionLabelWrap}>
      <View style={s.sectionBar} />
      <Text style={s.sectionTitle}>{title}</Text>
    </View>
  );
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <View style={s.errorRow}>
      <XCircleIcon size={12} color={C.red} strokeWidth={2.5} />
      <Text style={s.errorText}>{msg}</Text>
    </View>
  );
}

// ─── Leave Type Picker ────────────────────────────────────────────────────────
function LeaveTypePicker({ value, onChange, error }) {
  const [open, setOpen] = useState(false);
  const selected = LEAVE_TYPES.find((t) => t.value === value);

  return (
    <View>
      <Pressable
        onPress={() => setOpen((v) => !v)}
        style={({ pressed }) => [
          s.pickerBtn,
          error && s.inputError,
          open && s.pickerBtnOpen,
          pressed && { opacity: 0.85 },
        ]}
      >
        {selected ? (
          <View style={s.pickerSelected}>
            <IconSquare icon={selected.icon} color={C.accent} size={32} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={s.pickerSelectedLabel}>{selected.label}</Text>
              <Text style={s.pickerSelectedDesc} numberOfLines={1}>
                {selected.desc}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={s.pickerPlaceholder}>Select leave type…</Text>
        )}
        <ChevronDownIcon
          size={18}
          color={C.muted}
          strokeWidth={2}
          style={{ transform: [{ rotate: open ? "180deg" : "0deg" }] }}
        />
      </Pressable>

      {open && (
        <View style={s.pickerDropdown}>
          {LEAVE_TYPES.map((type, i) => {
            const active = type.value === value;
            return (
              <Pressable
                key={type.value}
                onPress={() => {
                  onChange(type.value);
                  setOpen(false);
                }}
                style={({ pressed }) => [
                  s.pickerOption,
                  active && s.pickerOptionActive,
                  i < LEAVE_TYPES.length - 1 && s.pickerOptionDivider,
                  pressed && { backgroundColor: C.accentLight },
                ]}
              >
                <IconSquare
                  icon={type.icon}
                  color={active ? C.accent : C.muted}
                  size={30}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={[s.pickerOptionLabel, active && { color: C.accent }]}
                  >
                    {type.label}
                  </Text>
                  <Text style={s.pickerOptionDesc}>{type.desc}</Text>
                </View>
                {active && (
                  <CheckCircleIcon size={18} color={C.accent} strokeWidth={2} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
      <FieldError msg={error} />
    </View>
  );
}

// ─── Date Picker Row (native input via TextInput — swap for DateTimePicker) ────
function DateField({ label, value, onChange, minDate, error, hint }) {
  // In production: replace TextInput with @react-native-community/datetimepicker
  // For now: type YYYY-MM-DD manually or wire up a date picker library
  return (
    <View style={{ flex: 1 }}>
      <Text style={s.fieldLabel}>{label}</Text>
      <View
        style={[s.dateInput, error && s.inputError, value && s.dateInputFilled]}
      >
        <CalendarDaysIcon
          size={15}
          color={value ? C.accent : C.muted}
          strokeWidth={2}
        />
        <TextInput
          style={s.dateInputText}
          placeholder="YYYY-MM-DD"
          placeholderTextColor={C.muted}
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          maxLength={10}
        />
      </View>
      {hint ? <Text style={s.fieldHint}>{hint}</Text> : null}
      <FieldError msg={error} />
    </View>
  );
}

// ─── Summary Card (shown when both dates selected) ────────────────────────────
function SummaryCard({ leaveType, startDate, endDate }) {
  const days = calcWorkingDays(startDate, endDate);
  const cfg = LEAVE_TYPES.find((t) => t.value === leaveType);
  if (!cfg || !startDate || !endDate || days === 0) return null;

  return (
    <LinearGradient
      colors={["#0F172A", "#1E293B", "#243044"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={s.summaryCard}
    >
      <View style={s.summaryTop}>
        <IconSquare icon={cfg.icon} color="rgba(255,255,255,0.15)" size={38} />
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.summaryType}>{cfg.label}</Text>
          <Text style={s.summaryDates}>
            {fmtDate(startDate)} → {fmtDate(endDate)}
          </Text>
        </View>
      </View>
      <View style={s.summaryTiles}>
        {[
          { label: "WORKING DAYS", value: days },
          {
            label: "CALENDAR DAYS",
            value: calcCalendarDays(startDate, endDate),
          },
          {
            label: "WEEKENDS",
            value: calcCalendarDays(startDate, endDate) - days,
          },
        ].map((t) => (
          <View key={t.label} style={s.summaryTile}>
            <Text style={s.summaryTileNum}>{t.value}</Text>
            <Text style={s.summaryTileLabel}>{t.label}</Text>
          </View>
        ))}
      </View>
    </LinearGradient>
  );
}

function calcCalendarDays(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  if (e < s) return 0;
  return Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1;
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ApplyLeaveScreen({ navigation }) {
  const today = todayISO();

  const [form, setForm] = useState({
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key, val) => {
    setForm((f) => ({ ...f, [key]: val }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  // Auto-fill end_date to start_date when start changes and end is empty/before
  const handleStartDate = (val) => {
    set("start_date", val);
    if (form.end_date && form.end_date < val) {
      set("end_date", val);
    }
    if (!form.end_date) {
      setForm((f) => ({ ...f, start_date: val, end_date: val }));
    }
  };

  function validate() {
    const e = {};
    if (!form.leave_type) e.leave_type = "Please select a leave type.";

    if (!form.start_date) {
      e.start_date = "Start date is required.";
    } else if (form.start_date < today) {
      e.start_date = "Start date cannot be in the past.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.start_date)) {
      e.start_date = "Use format YYYY-MM-DD.";
    }

    if (!form.end_date) {
      e.end_date = "End date is required.";
    } else if (form.end_date < form.start_date) {
      e.end_date = "End date must be after start date.";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(form.end_date)) {
      e.end_date = "Use format YYYY-MM-DD.";
    }

    if (!form.reason.trim()) {
      e.reason = "Please provide a reason for your leave.";
    } else if (form.reason.trim().length < 10) {
      e.reason = "Reason must be at least 10 characters.";
    }

    return e;
  }

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    setSubmitting(true);
    try {
      // WIRE: POST /leave/ with form data
      // const res = await api.post("/leave/", form);
      await new Promise((r) => setTimeout(r, 1000)); // mock delay

      Alert.alert(
        "Request Submitted",
        "Your leave request has been submitted and is pending approval.",
        [{ text: "OK", onPress: () => navigation?.goBack() }],
      );
    } catch (err) {
      Alert.alert("Error", "Failed to submit leave request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const workingDays = calcWorkingDays(form.start_date, form.end_date);

  return (
    <View style={s.root}>
      {/* ── Header ── */}
      <SafeAreaView edges={["top"]} style={s.header}>
        <View style={s.titleRow}>
          <View style={s.titleLeft}>
            {navigation && (
              <Pressable
                onPress={() => navigation.goBack()}
                style={({ pressed }) => [
                  s.backBtn,
                  pressed && { opacity: 0.6 },
                ]}
              >
                <Text style={s.backChevron}>‹</Text>
              </Pressable>
            )}
            <View style={s.iconBadge}>
              <DocumentTextIcon size={18} color={C.accent} strokeWidth={2} />
            </View>
            <View>
              <Text style={s.title}>Apply for Leave</Text>
              <Text style={s.subtitle}>Submit a new leave request</Text>
            </View>
          </View>
        </View>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Leave Type ── */}
        <View style={s.section}>
          <SectionLabel title="Leave Type" />
          <LeaveTypePicker
            value={form.leave_type}
            onChange={(v) => set("leave_type", v)}
            error={errors.leave_type}
          />
        </View>

        {/* ── Dates ── */}
        <View style={s.section}>
          <SectionLabel title="Duration" />
          <View style={s.dateRow}>
            <DateField
              label="Start Date"
              value={form.start_date}
              onChange={handleStartDate}
              minDate={today}
              error={errors.start_date}
              hint={`Earliest: today`}
            />
            <View style={s.dateSep} />
            <DateField
              label="End Date"
              value={form.end_date}
              onChange={(v) => set("end_date", v)}
              minDate={form.start_date || today}
              error={errors.end_date}
              hint={
                workingDays > 0
                  ? `${workingDays} working day${workingDays > 1 ? "s" : ""}`
                  : null
              }
            />
          </View>
        </View>

        {/* ── Summary Card ── */}
        {form.leave_type &&
          form.start_date &&
          form.end_date &&
          workingDays > 0 && (
            <View style={s.section}>
              <SummaryCard
                leaveType={form.leave_type}
                startDate={form.start_date}
                endDate={form.end_date}
              />
            </View>
          )}

        {/* ── Reason ── */}
        <View style={s.section}>
          <SectionLabel title="Reason" />
          <View style={[s.textAreaWrap, errors.reason && s.inputError]}>
            <TextInput
              style={s.textArea}
              placeholder="Briefly describe the reason for your leave request…"
              placeholderTextColor={C.muted}
              value={form.reason}
              onChangeText={(v) => set("reason", v)}
              multiline
              numberOfLines={5}
              textAlignVertical="top"
            />
          </View>
          <View style={s.reasonFooter}>
            <FieldError msg={errors.reason} />
            <Text style={s.charCount}>{form.reason.length} chars</Text>
          </View>
        </View>

        {/* ── Notice ── */}
        <View style={s.section}>
          <View style={s.noticeCard}>
            <ClockIcon size={16} color={C.amber} strokeWidth={2} />
            <Text style={s.noticeText}>
              Your request will be reviewed by HR. You'll be notified once it's
              approved or rejected.
            </Text>
          </View>
        </View>

        {/* ── Submit ── */}
        <View style={s.section}>
          <Pressable
            onPress={handleSubmit}
            disabled={submitting}
            style={({ pressed }) => [
              s.submitBtn,
              (pressed || submitting) && { opacity: 0.8 },
            ]}
          >
            <LinearGradient
              colors={["#0F766E", "#0D9488"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={s.submitGradient}
            >
              {submitting ? (
                <Text style={s.submitText}>Submitting…</Text>
              ) : (
                <>
                  <CheckCircleIcon
                    size={18}
                    color={C.white}
                    strokeWidth={2.5}
                  />
                  <Text style={s.submitText}>
                    Submit Request
                    {workingDays > 0 ? ` · ${workingDays}d` : ""}
                  </Text>
                </>
              )}
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => navigation?.goBack()}
            style={({ pressed }) => [s.cancelBtn, pressed && { opacity: 0.6 }]}
          >
            <Text style={s.cancelText}>Cancel</Text>
          </Pressable>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },

  // Header
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 12,
  },
  titleLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  backBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: C.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  backChevron: {
    fontSize: 22,
    color: C.navy,
    marginTop: -2,
    fontWeight: "300",
  },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.4,
  },
  subtitle: { fontSize: 12, color: C.muted, fontWeight: "500", marginTop: 1 },

  // Section
  section: { paddingHorizontal: 16, paddingTop: 20 },
  sectionLabelWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 10,
  },
  sectionBar: {
    width: 3,
    height: 16,
    borderRadius: 2,
    backgroundColor: C.accent,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: C.navy,
    textTransform: "uppercase",
    letterSpacing: 0.3,
  },

  // Leave type picker
  pickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 8,
  },
  pickerBtnOpen: {
    borderColor: C.accent,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  pickerSelected: { flexDirection: "row", alignItems: "center", flex: 1 },
  pickerSelectedLabel: { fontSize: 14, fontWeight: "700", color: C.navy },
  pickerSelectedDesc: { fontSize: 12, color: C.muted, marginTop: 2 },
  pickerPlaceholder: { fontSize: 14, color: C.muted, flex: 1 },
  pickerDropdown: {
    backgroundColor: C.white,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: C.accent,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    overflow: "hidden",
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  pickerOptionActive: { backgroundColor: C.accentLight },
  pickerOptionDivider: { borderBottomWidth: 1, borderBottomColor: C.divider },
  pickerOptionLabel: { fontSize: 13, fontWeight: "700", color: C.navy },
  pickerOptionDesc: { fontSize: 11, color: C.muted, marginTop: 2 },

  // Dates
  dateRow: { flexDirection: "row", gap: 0 },
  dateSep: { width: 12 },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: C.sub,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    paddingHorizontal: 12,
    paddingVertical: 11,
  },
  dateInputFilled: { borderColor: C.accent },
  dateInputText: { flex: 1, fontSize: 14, color: C.navy, fontWeight: "600" },
  fieldHint: { fontSize: 11, color: C.accent, marginTop: 4, fontWeight: "500" },

  // Summary card
  summaryCard: { borderRadius: 16, padding: 16, gap: 14 },
  summaryTop: { flexDirection: "row", alignItems: "center" },
  summaryType: {
    fontSize: 15,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.3,
  },
  summaryDates: {
    fontSize: 11,
    color: "rgba(255,255,255,0.55)",
    marginTop: 3,
    fontWeight: "500",
  },
  summaryTiles: { flexDirection: "row", gap: 8 },
  summaryTile: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    gap: 4,
  },
  summaryTileNum: {
    fontSize: 20,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.5,
  },
  summaryTileLabel: {
    fontSize: 8,
    fontWeight: "700",
    color: "rgba(255,255,255,0.6)",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    textAlign: "center",
  },

  // Reason textarea
  textAreaWrap: {
    backgroundColor: C.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
  },
  textArea: {
    fontSize: 14,
    color: C.navy,
    lineHeight: 22,
    minHeight: 100,
  },
  reasonFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  charCount: { fontSize: 11, color: C.muted, textAlign: "right" },

  // Notice
  noticeCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    backgroundColor: C.amberBg,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#FDE68A",
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: C.amberText,
    lineHeight: 18,
    fontWeight: "500",
  },

  // Submit
  submitBtn: { borderRadius: 14, overflow: "hidden" },
  submitGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 16,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.2,
  },
  cancelBtn: { alignItems: "center", paddingVertical: 14, marginTop: 4 },
  cancelText: { fontSize: 14, color: C.muted, fontWeight: "600" },

  // Shared
  inputError: { borderColor: C.red },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 5,
  },
  errorText: { fontSize: 11, color: C.red, fontWeight: "500" },
});
