import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BanknotesIcon,
  BriefcaseIcon,
  BuildingOffice2Icon,
  CalendarDaysIcon,
  DevicePhoneMobileIcon,
  EnvelopeIcon,
  ExclamationTriangleIcon,
  IdentificationIcon,
  MapPinIcon,
  PencilSquareIcon,
  PhoneIcon,
  UserCircleIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Mock data — shape mirrors EmployeeSerializer exactly ─────────────────────
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
  profile_picture:
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  employee_id: "EMP-0002",
  position: "Lead Backend Engineer",
  department: "Engineering",
  hire_date: "2021-03-08",
  employment_type: "Full-Time",
  work_location: "Hybrid",
  manager: 1,
  manager_name: "Alice Mensah",
  salary: "12500.00",
  pay_frequency: "Monthly",
  payment_method: "Bank Transfer",
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
  created_at: "2021-03-08T09:00:00Z",
  updated_at: "2024-11-20T14:32:00Z",
};

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
};

// ─── Icon color map — each field gets its own solid color ────────────────────
// mirrors the dashboard's activity feed palette
const ICON_COLORS = {
  phone: C.green,
  email: C.blue,
  dob: C.purple,
  address: C.accent,
  hireDate: C.accent,
  employmentType: C.blue,
  workLocation: C.orange,
  manager: C.purple,
  salary: C.green,
  paymentMethod: C.orange,
  bank: C.blue,
  accountName: C.accent,
  accountNumber: C.slate,
  momoNetwork: C.purple,
  momoNumber: C.green,
  emergencyName: C.red,
  emergencyPhone: C.red,
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmt(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function age(dobStr) {
  if (!dobStr) return null;
  const dob = new Date(dobStr);
  const today = new Date();
  let a = today.getFullYear() - dob.getFullYear();
  if (
    today.getMonth() < dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())
  )
    a--;
  return a;
}

function initials(emp) {
  return `${emp.first_name?.[0] ?? ""}${emp.last_name?.[0] ?? ""}`.toUpperCase();
}

function fmtSalary(raw) {
  if (!raw) return "—";
  const n = parseFloat(raw);
  if (isNaN(n)) return raw;
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
    minimumFractionDigits: 0,
  }).format(n);
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Avatar({ emp }) {
  const [err, setErr] = useState(false);
  if (emp.profile_picture && !err) {
    return (
      <Image
        source={{ uri: emp.profile_picture }}
        style={s.photo}
        contentFit="cover"
        transition={300}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <View style={[s.photo, s.avatarFallback]}>
      <Text style={s.avatarInitials}>{initials(emp)}</Text>
    </View>
  );
}

function SectionHeader({ title }) {
  return <Text style={s.sectionLabel}>{title}</Text>;
}

function InfoCard({ children }) {
  return <View style={s.card}>{children}</View>;
}

// ── Dashboard-style solid square icon wrap ────────────────────────────────────
function IconSquare({ icon: Icon, color }) {
  return (
    <View style={[s.iconSquare, { backgroundColor: color }]}>
      <Icon size={15} color="#FFFFFF" strokeWidth={2} />
    </View>
  );
}

function InfoRow({ icon: Icon, iconColor = C.accent, label, value, last }) {
  return (
    <>
      <View style={s.infoRow}>
        <IconSquare icon={Icon} color={iconColor} />
        <View style={s.infoTexts}>
          <Text style={s.infoLabel}>{label}</Text>
          <Text style={s.infoValue}>{value || "—"}</Text>
        </View>
      </View>
      {!last && <View style={s.rowDiv} />}
    </>
  );
}

function ContactRow({
  icon: Icon,
  iconColor = C.accent,
  label,
  value,
  onPress,
  last,
}) {
  return (
    <>
      <Pressable
        style={({ pressed }) => [
          s.contactRow,
          pressed && { opacity: 0.6, transform: [{ scale: 0.98 }] },
        ]}
        onPress={onPress}
      >
        <IconSquare icon={Icon} color={iconColor} />
        <View style={s.infoTexts}>
          <Text style={s.infoLabel}>{label}</Text>
          <Text style={[s.infoValue, { color: iconColor }]}>
            {value || "—"}
          </Text>
        </View>
        <Text style={s.chevron}>›</Text>
      </Pressable>
      {!last && <View style={s.rowDiv} />}
    </>
  );
}

function StatPill({ label, value, color, bg }) {
  return (
    <View style={[s.statPill, { backgroundColor: bg }]}>
      <Text style={[s.statValue, { color }]}>{value}</Text>
      <Text style={[s.statLabel, { color }]}>{label}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EmployeeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const emp = MOCK_EMPLOYEE;
  const isActive = emp.is_active;
  const empAge = age(emp.date_of_birth);
  const fullAddress = [emp.address, emp.city, emp.state, emp.zip_code]
    .filter(Boolean)
    .join(", ");
  const hasPaymentInfo =
    emp.payment_method === "Mobile Money"
      ? emp.momo_number
      : emp.bank_account_number;

  return (
    <View style={s.root}>
      {/* ── Navbar ── */}
      <SafeAreaView edges={["top"]} style={s.navbar}>
        <Pressable
          style={({ pressed }) => [s.navBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.replace("/employees")}
        >
          <Text style={s.backText}>‹</Text>
        </Pressable>

        <View style={s.navCenter}>
          <View style={s.navBadge}>
            <UserCircleIcon size={17} color={C.accent} strokeWidth={2} />
          </View>
          <Text style={s.navTitle}>Employee Profile</Text>
        </View>

        <Pressable
          style={({ pressed }) => [s.navBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.push(`/employees/edit/${id}`)}
        >
          <PencilSquareIcon size={19} color={C.accent} strokeWidth={2} />
        </Pressable>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Hero ── */}
        <View style={s.hero}>
          <Avatar emp={emp} />

          <View
            style={[
              s.statusBadge,
              { backgroundColor: isActive ? C.greenBg : C.redBg },
            ]}
          >
            <View
              style={[
                s.statusDot,
                { backgroundColor: isActive ? C.green : C.red },
              ]}
            />
            <Text
              style={[
                s.statusText,
                { color: isActive ? C.greenText : C.redText },
              ]}
            >
              {isActive ? "Active" : "Inactive"}
            </Text>
          </View>

          <Text style={s.heroName}>{emp.full_name}</Text>
          <Text style={s.heroPos}>{emp.position}</Text>

          <View style={s.heroMeta}>
            <View style={s.metaChip}>
              <BuildingOffice2Icon
                size={12}
                color={C.accent}
                strokeWidth={2.5}
              />
              <Text style={s.metaChipText}>{emp.department}</Text>
            </View>
            <View style={[s.metaChip, { backgroundColor: C.divider }]}>
              <IdentificationIcon size={12} color={C.sub} strokeWidth={2.5} />
              <Text style={[s.metaChipText, { color: C.sub }]}>
                {emp.employee_id}
              </Text>
            </View>
          </View>

          <View style={s.statsRow}>
            <StatPill
              label="Work Location"
              value={emp.work_location}
              color={C.accent}
              bg={C.accentLight}
            />
            <StatPill
              label="Type"
              value={emp.employment_type}
              color={C.slate}
              bg={C.divider}
            />
            <StatPill
              label="Pay Freq."
              value={emp.pay_frequency}
              color={C.slate}
              bg={C.divider}
            />
          </View>
        </View>

        {/* ── Contact ── */}
        <View style={s.section}>
          <SectionHeader title="CONTACT" />
          <InfoCard>
            <ContactRow
              icon={PhoneIcon}
              iconColor={ICON_COLORS.phone}
              label="Phone"
              value={emp.phone}
              onPress={() =>
                emp.phone &&
                Linking.openURL(`tel:${emp.phone.replace(/\s/g, "")}`)
              }
            />
            <ContactRow
              icon={EnvelopeIcon}
              iconColor={ICON_COLORS.email}
              label="Email"
              value={emp.email}
              onPress={() =>
                emp.email && Linking.openURL(`mailto:${emp.email}`)
              }
              last
            />
          </InfoCard>
        </View>

        {/* ── Personal Info ── */}
        <View style={s.section}>
          <SectionHeader title="PERSONAL" />
          <InfoCard>
            <InfoRow
              icon={CalendarDaysIcon}
              iconColor={ICON_COLORS.dob}
              label="Date of Birth"
              value={
                emp.date_of_birth
                  ? `${fmt(emp.date_of_birth)}  ·  Age ${empAge}`
                  : null
              }
            />
            <InfoRow
              icon={MapPinIcon}
              iconColor={ICON_COLORS.address}
              label="Address"
              value={fullAddress || null}
              last
            />
          </InfoCard>
        </View>

        {/* ── Employment ── */}
        <View style={s.section}>
          <SectionHeader title="EMPLOYMENT" />
          <InfoCard>
            <InfoRow
              icon={CalendarDaysIcon}
              iconColor={ICON_COLORS.hireDate}
              label="Hire Date"
              value={fmt(emp.hire_date)}
            />
            <InfoRow
              icon={BriefcaseIcon}
              iconColor={ICON_COLORS.employmentType}
              label="Employment Type"
              value={emp.employment_type}
            />
            <InfoRow
              icon={BuildingOffice2Icon}
              iconColor={ICON_COLORS.workLocation}
              label="Work Location"
              value={emp.work_location}
            />
            <InfoRow
              icon={UserIcon}
              iconColor={ICON_COLORS.manager}
              label="Reports To"
              value={emp.manager_name ?? "—"}
              last
            />
          </InfoCard>
        </View>

        {/* ── Compensation ── */}
        <View style={s.section}>
          <SectionHeader title="COMPENSATION" />
          <InfoCard>
            <InfoRow
              icon={BanknotesIcon}
              iconColor={ICON_COLORS.salary}
              label="Salary"
              value={`${fmtSalary(emp.salary)} / ${emp.pay_frequency ?? ""}`}
            />
            <InfoRow
              icon={IdentificationIcon}
              iconColor={ICON_COLORS.paymentMethod}
              label="Payment Method"
              value={emp.payment_method}
              last={!hasPaymentInfo}
            />

            {emp.payment_method !== "Mobile Money" && emp.bank_name && (
              <>
                <View style={s.rowDiv} />
                <InfoRow
                  icon={BuildingOffice2Icon}
                  iconColor={ICON_COLORS.bank}
                  label="Bank"
                  value={`${emp.bank_name}${emp.bank_branch ? ` · ${emp.bank_branch}` : ""}`}
                />
                <InfoRow
                  icon={IdentificationIcon}
                  iconColor={ICON_COLORS.accountName}
                  label="Account Name"
                  value={emp.bank_account_name}
                />
                <InfoRow
                  icon={IdentificationIcon}
                  iconColor={ICON_COLORS.accountNumber}
                  label="Account Number"
                  value={emp.bank_account_number}
                  last
                />
              </>
            )}

            {emp.payment_method === "Mobile Money" && emp.momo_number && (
              <>
                <View style={s.rowDiv} />
                <InfoRow
                  icon={DevicePhoneMobileIcon}
                  iconColor={ICON_COLORS.momoNetwork}
                  label="MoMo Network"
                  value={emp.momo_network}
                />
                <InfoRow
                  icon={PhoneIcon}
                  iconColor={ICON_COLORS.momoNumber}
                  label="MoMo Number"
                  value={emp.momo_number}
                  last
                />
              </>
            )}
          </InfoCard>
        </View>

        {/* ── Emergency Contact ── */}
        <View style={s.section}>
          <SectionHeader title="EMERGENCY CONTACT" />
          <InfoCard>
            <InfoRow
              icon={UserIcon}
              iconColor={ICON_COLORS.emergencyName}
              label="Contact Name"
              value={emp.emergency_contact}
            />
            <ContactRow
              icon={PhoneIcon}
              iconColor={ICON_COLORS.emergencyPhone}
              label="Contact Phone"
              value={emp.emergency_phone}
              onPress={() =>
                emp.emergency_phone &&
                Linking.openURL(`tel:${emp.emergency_phone.replace(/\s/g, "")}`)
              }
              last
            />
          </InfoCard>
        </View>

        {/* ── Notes ── */}
        {emp.notes ? (
          <View style={s.section}>
            <SectionHeader title="NOTES" />
            <View style={s.notesCard}>
              <ExclamationTriangleIcon
                size={14}
                color={C.amber}
                strokeWidth={2}
                style={{ marginBottom: 6 }}
              />
              <Text style={s.notesText}>{emp.notes}</Text>
            </View>
          </View>
        ) : null}

        {/* ── Meta ── */}
        <View style={s.metaFooter}>
          <Text style={s.metaFooterText}>
            Created {fmt(emp.created_at)} · Updated {fmt(emp.updated_at)}
          </Text>
        </View>

        <View style={{ height: 48 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const PHOTO = 100;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 40 },

  // Navbar
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 6,
    paddingBottom: 12,
    backgroundColor: C.white,
  },
  navBtn: {
    width: 38,
    height: 38,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: -10,
  },
  backText: {
    fontSize: 38, // was 30
    color: C.navy,
    fontWeight: "350", // was "300"
    lineHeight: 42,
    marginTop: -2,
    marginLeft: -10,
  },
  navCenter: { flexDirection: "row", alignItems: "center", gap: 9 },
  navBadge: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
  },

  // Hero
  hero: {
    backgroundColor: C.white,
    alignItems: "center",
    paddingTop: 28,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 20,
  },
  photoRing: {
    width: PHOTO + 8,
    height: PHOTO + 8,
    borderRadius: (PHOTO + 8) / 2,
    borderWidth: 2.5,
    borderColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: C.accent,
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: PHOTO / 2,
    backgroundColor: C.accentMid,
  },
  avatarFallback: {
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitials: {
    fontSize: 30,
    fontWeight: "800",
    color: C.accent,
    letterSpacing: -0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "800", letterSpacing: 0.3 },
  heroName: {
    fontSize: 24,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.5,
    marginBottom: 3,
  },
  heroPos: {
    fontSize: 13,
    color: C.sub,
    fontWeight: "500",
    marginBottom: 14,
  },
  heroMeta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 20,
    flexWrap: "wrap",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.accentLight,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
  },
  metaChipText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.accent,
    letterSpacing: 0.1,
  },

  // Stats row
  statsRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  statPill: {
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 12,
    minWidth: 90,
  },
  statValue: { fontSize: 13, fontWeight: "800", letterSpacing: -0.2 },
  statLabel: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
    opacity: 0.75,
    letterSpacing: 0.2,
  },

  // Sections
  section: { paddingHorizontal: 18, marginBottom: 14 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: C.muted,
    letterSpacing: 1.2,
    marginBottom: 8,
    marginLeft: 3,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  rowDiv: { height: 1, backgroundColor: C.divider, marginLeft: 62 },

  // Contact rows
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
  },
  chevron: {
    fontSize: 22,
    color: "#CBD5E1",
    fontWeight: "300",
    lineHeight: 26,
    marginLeft: 6,
  },

  // Info rows
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
  },

  // Dashboard-style solid square icon — replaces old iconWrap
  iconSquare: {
    width: 34,
    height: 34,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
    flexShrink: 0,
  },

  infoTexts: { flex: 1 },
  infoLabel: {
    fontSize: 10,
    color: C.muted,
    fontWeight: "700",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    color: C.navy,
    fontWeight: "600",
    lineHeight: 19,
  },

  // Notes
  notesCard: {
    backgroundColor: C.amberBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FDE68A",
    padding: 16,
  },
  notesText: {
    fontSize: 13,
    color: C.amberText,
    fontWeight: "500",
    lineHeight: 20,
  },

  // Footer
  metaFooter: { alignItems: "center", marginTop: 8 },
  metaFooterText: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "500",
  },
});
