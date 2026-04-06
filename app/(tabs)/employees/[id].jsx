import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Linking,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ArrowLeftIcon,
  BuildingOfficeIcon,
  CalendarDaysIcon,
  EnvelopeIcon,
  IdentificationIcon,
  PencilSquareIcon,
  PhoneIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
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
};

const EMPLOYEES = {
  1: {
    name: "Sarah Mitchell",
    title: "Senior Product Designer",
    department: "Design",
    status: "Active",
    email: "sarah.mitchell@hr360.com",
    phone: "+233 24 000 1111",
    manager: "Alice Mensah",
    joined: "Mar 14, 2021",
    employeeId: "EMP-0001",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80",
  },
  2: {
    name: "James Osei",
    title: "Lead Backend Engineer",
    department: "Engineering",
    status: "Active",
    email: "james.osei@hr360.com",
    phone: "+233 24 000 2222",
    manager: "Kofi Agyeman",
    joined: "Jul 03, 2020",
    employeeId: "EMP-0002",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80",
  },
  3: {
    name: "Alice Mensah",
    title: "HR Manager",
    department: "Human Resources",
    status: "Active",
    email: "alice.mensah@hr360.com",
    phone: "+233 24 000 3333",
    manager: "—",
    joined: "Jan 09, 2019",
    employeeId: "EMP-0003",
    photo:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80",
  },
  4: {
    name: "Robert Antwi",
    title: "Marketing Lead",
    department: "Marketing",
    status: "Inactive",
    email: "robert.antwi@hr360.com",
    phone: "+233 24 000 4444",
    manager: "Alice Mensah",
    joined: "Sep 22, 2022",
    employeeId: "EMP-0004",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80",
  },
  5: {
    name: "Emily Boateng",
    title: "Sales Executive",
    department: "Sales",
    status: "Active",
    email: "emily.boateng@hr360.com",
    phone: "+233 24 000 5555",
    manager: "Robert Antwi",
    joined: "Feb 11, 2023",
    employeeId: "EMP-0005",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80",
  },
  6: {
    name: "Michael Darko",
    title: "Frontend Engineer",
    department: "Engineering",
    status: "Active",
    email: "michael.darko@hr360.com",
    phone: "+233 24 000 6666",
    manager: "James Osei",
    joined: "Nov 30, 2022",
    employeeId: "EMP-0006",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80",
  },
  7: {
    name: "Linda Asare",
    title: "UX Researcher",
    department: "Design",
    status: "Active",
    email: "linda.asare@hr360.com",
    phone: "+233 24 000 7777",
    manager: "Sarah Mitchell",
    joined: "Apr 18, 2023",
    employeeId: "EMP-0007",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80",
  },
  8: {
    name: "Daniel Kwame",
    title: "Finance Analyst",
    department: "Finance",
    status: "Active",
    email: "daniel.kwame@hr360.com",
    phone: "+233 24 000 8888",
    manager: "Alice Mensah",
    joined: "Jun 05, 2021",
    employeeId: "EMP-0008",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80",
  },
  9: {
    name: "Grace Amponsah",
    title: "Operations Manager",
    department: "Operations",
    status: "Inactive",
    email: "grace.amponsah@hr360.com",
    phone: "+233 24 000 9999",
    manager: "Alice Mensah",
    joined: "Aug 14, 2020",
    employeeId: "EMP-0009",
    photo:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&q=80",
  },
  10: {
    name: "Kofi Agyeman",
    title: "DevOps Engineer",
    department: "Engineering",
    status: "Active",
    email: "kofi.agyeman@hr360.com",
    phone: "+233 24 000 1010",
    manager: "James Osei",
    joined: "Oct 01, 2019",
    employeeId: "EMP-0010",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&q=80",
  },
};

// ─── Tappable contact action ──────────────────────────────────────────────────
function ContactAction({ icon: Icon, label, value, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        s.contactAction,
        pressed && { opacity: 0.65, transform: [{ scale: 0.97 }] },
      ]}
      onPress={onPress}
    >
      <View style={s.contactIconWrap}>
        <Icon size={18} color={C.accent} strokeWidth={2} />
      </View>
      <View style={s.contactText}>
        <Text style={s.contactLabel}>{label}</Text>
        <Text style={s.contactValue} numberOfLines={1}>
          {value}
        </Text>
      </View>
      <View style={s.contactArrow}>
        <Text style={s.contactArrowText}>›</Text>
      </View>
    </Pressable>
  );
}

// ─── Info row inside a section card ──────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, last }) {
  return (
    <>
      <View style={s.infoRow}>
        <View style={s.infoIconWrap}>
          <Icon size={15} color={C.accent} strokeWidth={2} />
        </View>
        <View style={s.infoTexts}>
          <Text style={s.infoLabel}>{label}</Text>
          <Text style={s.infoValue}>{value}</Text>
        </View>
      </View>
      {!last && <View style={s.rowDivider} />}
    </>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function EmployeeDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const emp = EMPLOYEES[id] ?? EMPLOYEES["1"];
  const isActive = emp.status === "Active";

  const callPhone = () =>
    Linking.openURL(`tel:${emp.phone.replace(/\s/g, "")}`);
  const openEmail = () => Linking.openURL(`mailto:${emp.email}`);

  return (
    <View style={s.root}>
      {/* ── Nav bar ── */}
      <SafeAreaView edges={["top"]} style={s.navbar}>
        <Pressable
          style={({ pressed }) => [s.navBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.back()}
        >
          <ArrowLeftIcon size={20} color={C.navy} strokeWidth={2.2} />
        </Pressable>

        <Text style={s.navTitle}>Profile</Text>

        <Pressable
          style={({ pressed }) => [s.navBtn, pressed && { opacity: 0.6 }]}
          onPress={() => router.push(`/employees/${id}/edit`)}
        >
          <PencilSquareIcon size={20} color={C.accent} strokeWidth={2} />
        </Pressable>
      </SafeAreaView>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
      >
        {/* ── Hero ── */}
        <View style={s.hero}>
          {/* Photo */}
          <View style={s.photoRing}>
            <Image
              source={{ uri: emp.photo }}
              style={s.photo}
              contentFit="cover"
              transition={300}
            />
          </View>

          {/* Status badge */}
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
              {emp.status}
            </Text>
          </View>

          <Text style={s.heroName}>{emp.name}</Text>
          <Text style={s.heroTitle}>{emp.title}</Text>

          {/* Dept pill */}
          <View style={s.deptPill}>
            <BuildingOfficeIcon size={12} color={C.accent} strokeWidth={2.5} />
            <Text style={s.deptPillText}>{emp.department}</Text>
          </View>
        </View>

        {/* ── Contact ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Contact</Text>
          <View style={s.card}>
            <ContactAction
              icon={PhoneIcon}
              label="Phone"
              value={emp.phone}
              onPress={callPhone}
            />
            <View style={s.rowDivider} />
            <ContactAction
              icon={EnvelopeIcon}
              label="Email"
              value={emp.email}
              onPress={openEmail}
            />
          </View>
        </View>

        {/* ── Work details ── */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Employment</Text>
          <View style={s.card}>
            <InfoRow
              icon={IdentificationIcon}
              label="Employee ID"
              value={emp.employeeId}
            />
            <InfoRow
              icon={BuildingOfficeIcon}
              label="Department"
              value={emp.department}
            />
            <InfoRow icon={UserIcon} label="Reports to" value={emp.manager} />
            <InfoRow
              icon={CalendarDaysIcon}
              label="Date Joined"
              value={emp.joined}
              last
            />
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const PHOTO = 96;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 40 },

  // Navbar
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  navBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.2,
  },

  // Hero
  hero: {
    backgroundColor: C.white,
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 28,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    marginBottom: 24,
  },
  photoRing: {
    width: PHOTO + 6,
    height: PHOTO + 6,
    borderRadius: (PHOTO + 6) / 2,
    borderWidth: 2,
    borderColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
  },
  photo: {
    width: PHOTO,
    height: PHOTO,
    borderRadius: PHOTO / 2,
    backgroundColor: "#E2E8F0",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3 },
  statusText: { fontSize: 11, fontWeight: "700" },
  heroName: {
    fontSize: 22,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.4,
    marginBottom: 4,
  },
  heroTitle: {
    fontSize: 13,
    color: C.sub,
    fontWeight: "500",
    marginBottom: 14,
  },
  deptPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.accentLight,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  deptPillText: { fontSize: 12, fontWeight: "700", color: C.accent },

  // Sections
  section: { paddingHorizontal: 20, marginBottom: 16 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 2,
  },
  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
  },
  rowDivider: { height: 1, backgroundColor: C.divider, marginLeft: 52 },

  // Contact action row
  contactAction: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  contactIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  contactText: { flex: 1 },
  contactLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  contactValue: { fontSize: 14, color: C.navy, fontWeight: "600" },
  contactArrow: { paddingLeft: 8 },
  contactArrowText: { fontSize: 22, color: "#CBD5E1", lineHeight: 26 },

  // Info row
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
  },
  infoIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  infoTexts: { flex: 1 },
  infoLabel: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "600",
    marginBottom: 2,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  infoValue: { fontSize: 14, color: C.navy, fontWeight: "600" },
});
