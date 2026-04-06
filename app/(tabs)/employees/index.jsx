import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
  MagnifyingGlassIcon,
  UserGroupIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  navy: "#0F172A",
  text: "#0F172A",
  sub: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  green: "#059669",
  greenBg: "#DCFCE7",
  greenText: "#15803D",
  red: "#DC2626",
  redBg: "#FEE2E2",
  redText: "#B91C1C",
};

const DEPARTMENTS = [
  "All",
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Human Resources",
  "Finance",
  "Operations",
];

const EMPLOYEES = [
  {
    id: "1",
    name: "Sarah Mitchell",
    title: "Senior Product Designer",
    department: "Design",
    status: "Active",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  },
  {
    id: "2",
    name: "James Osei",
    title: "Lead Backend Engineer",
    department: "Engineering",
    status: "Active",
    photo:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  },
  {
    id: "3",
    name: "Alice Mensah",
    title: "HR Manager",
    department: "Human Resources",
    status: "Active",
    photo:
      "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80",
  },
  {
    id: "4",
    name: "Robert Antwi",
    title: "Marketing Lead",
    department: "Marketing",
    status: "Inactive",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  },
  {
    id: "5",
    name: "Emily Boateng",
    title: "Sales Executive",
    department: "Sales",
    status: "Active",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  },
  {
    id: "6",
    name: "Michael Darko",
    title: "Frontend Engineer",
    department: "Engineering",
    status: "Active",
    photo:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80",
  },
  {
    id: "7",
    name: "Linda Asare",
    title: "UX Researcher",
    department: "Design",
    status: "Active",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  },
  {
    id: "8",
    name: "Daniel Kwame",
    title: "Finance Analyst",
    department: "Finance",
    status: "Active",
    photo:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  },
  {
    id: "9",
    name: "Grace Amponsah",
    title: "Operations Manager",
    department: "Operations",
    status: "Inactive",
    photo:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80",
  },
  {
    id: "10",
    name: "Kofi Agyeman",
    title: "DevOps Engineer",
    department: "Engineering",
    status: "Active",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&q=80",
  },
];

// ─── Filter Bottom Sheet ──────────────────────────────────────────────────────
function FilterSheet({ visible, selected, onSelect, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={s.overlay} onPress={onClose}>
        <Pressable style={s.sheet} onPress={() => {}}>
          <View style={s.sheetHandle} />

          <View style={s.sheetHeaderRow}>
            <View>
              <Text style={s.sheetTitle}>Department</Text>
              <Text style={s.sheetSub}>Filter employees by team</Text>
            </View>
            <Pressable onPress={onClose} style={s.sheetCloseIcon}>
              <XMarkIcon size={18} color={C.sub} />
            </Pressable>
          </View>

          <View style={s.deptList}>
            {DEPARTMENTS.map((dept) => {
              const active = selected === dept;
              return (
                <Pressable
                  key={dept}
                  style={({ pressed }) => [
                    s.deptRow,
                    active && s.deptRowActive,
                    pressed && { opacity: 0.65 },
                  ]}
                  onPress={() => {
                    onSelect(dept);
                    onClose();
                  }}
                >
                  <Text style={[s.deptRowText, active && s.deptRowTextActive]}>
                    {dept}
                  </Text>
                  {active && (
                    <View style={s.checkCircle}>
                      <CheckIcon size={12} color={C.white} strokeWidth={3} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Employee Card ────────────────────────────────────────────────────────────
function EmployeeCard({ item, onPress }) {
  const isActive = item.status === "Active";
  return (
    <Pressable
      style={({ pressed }) => [
        s.card,
        pressed && { opacity: 0.75, transform: [{ scale: 0.982 }] },
      ]}
      onPress={() => onPress(item.id)}
    >
      {/* Avatar with status ring */}
      <View style={s.avatarWrap}>
        <Image
          source={{ uri: item.photo }}
          style={s.avatar}
          contentFit="cover"
          transition={250}
        />
        <View
          style={[s.statusRing, { borderColor: isActive ? C.green : C.red }]}
        />
        <View
          style={[s.statusDot, { backgroundColor: isActive ? C.green : C.red }]}
        />
      </View>

      {/* Info */}
      <View style={s.cardInfo}>
        <Text style={s.empName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={s.empTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <View style={s.cardMeta}>
          <View style={s.deptTag}>
            <Text style={s.deptTagText}>{item.department}</Text>
          </View>
          <Text
            style={[
              s.statusLabel,
              { color: isActive ? C.greenText : C.redText },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      {/* Chevron */}
      <View style={s.chevronWrap}>
        <Text style={s.chevron}>›</Text>
      </View>
    </Pressable>
  );
}

// ─── Screen ───────────────────────────────────────────────────────────────────
export default function EmployeesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState("All");
  const [filterVisible, setFilterVisible] = useState(false);

  const filtered = EMPLOYEES.filter((emp) => {
    const q = search.toLowerCase();
    const matchSearch =
      emp.name.toLowerCase().includes(q) || emp.title.toLowerCase().includes(q);
    const matchDept = activeDept === "All" || emp.department === activeDept;
    return matchSearch && matchDept;
  });

  const filterActive = activeDept !== "All";

  const handleCardPress = useCallback(
    (id) => router.push(`/employees/${id}`),
    [router],
  );
  const renderItem = useCallback(
    ({ item }) => <EmployeeCard item={item} onPress={handleCardPress} />,
    [handleCardPress],
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* ── Header ── */}
      <SafeAreaView edges={["top"]} style={s.header}>
        {/* Title row */}
        <View style={s.titleRow}>
          <View style={s.titleLeft}>
            <View style={s.iconBadge}>
              <UserGroupIcon size={18} color={C.accent} strokeWidth={2} />
            </View>
            <View>
              <Text style={s.title}>Employees</Text>
              <Text style={s.subtitle}>
                {filtered.length} {filtered.length === 1 ? "member" : "members"}
              </Text>
            </View>
          </View>
          <Pressable
            style={({ pressed }) => [
              s.addBtn,
              pressed && { opacity: 0.8, transform: [{ scale: 0.92 }] },
            ]}
            onPress={() => router.push("/employees/add")}
          >
            <Text style={s.addBtnText}>＋</Text>
          </Pressable>
        </View>

        {/* Search + filter */}
        <View style={s.controlRow}>
          <View style={[s.searchWrap, filterActive && s.searchWrapNarrow]}>
            <MagnifyingGlassIcon size={17} color={C.muted} strokeWidth={2.2} />
            <TextInput
              style={s.searchInput}
              placeholder="Search name or role…"
              placeholderTextColor={C.muted}
              value={search}
              onChangeText={setSearch}
              returnKeyType="search"
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} hitSlop={8}>
                <XMarkIcon size={15} color={C.muted} strokeWidth={2.5} />
              </Pressable>
            )}
          </View>

          <Pressable
            style={({ pressed }) => [
              s.filterBtn,
              filterActive && s.filterBtnActive,
              pressed && { opacity: 0.7 },
            ]}
            onPress={() => setFilterVisible(true)}
          >
            <AdjustmentsHorizontalIcon
              size={19}
              color={filterActive ? C.white : C.sub}
              strokeWidth={2}
            />
            {filterActive && <View style={s.filterDot} />}
          </Pressable>
        </View>

        {/* Active dept chip */}
        {filterActive && (
          <View style={s.chipRow}>
            <View style={s.activeChip}>
              <Text style={s.activeChipText}>{activeDept}</Text>
              <Pressable onPress={() => setActiveDept("All")} hitSlop={6}>
                <XMarkIcon size={12} color={C.accent} strokeWidth={3} />
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* ── List ── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View
            style={{ height: 1, backgroundColor: C.border, marginLeft: 86 }}
          />
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <MagnifyingGlassIcon size={32} color={C.muted} strokeWidth={1.5} />
            <Text style={s.emptyTitle}>No results found</Text>
            <Text style={s.emptySub}>Try a different name or department</Text>
          </View>
        }
      />

      <FilterSheet
        visible={filterVisible}
        selected={activeDept}
        onSelect={setActiveDept}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const AVATAR = 54;

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

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
    marginBottom: 14,
  },
  titleLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBadge: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.4,
  },
  subtitle: { fontSize: 12, color: C.muted, fontWeight: "500", marginTop: 1 },

  addBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  addBtnText: {
    fontSize: 22,
    color: C.white,
    fontWeight: "400",
    lineHeight: 26,
    marginTop: -1,
  },

  // Controls
  controlRow: { flexDirection: "row", gap: 10, alignItems: "center" },
  searchWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 11,
    paddingHorizontal: 12,
    height: 44,
    gap: 9,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: C.navy,
    height: "100%",
    fontWeight: "500",
  },
  filterBtn: {
    width: 44,
    height: 44,
    borderRadius: 11,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  filterBtnActive: { backgroundColor: C.accent, borderColor: C.accent },
  filterDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: C.white,
  },

  // Chip
  chipRow: { flexDirection: "row", marginTop: 10 },
  activeChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.accentLight,
    borderWidth: 1,
    borderColor: C.accent,
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 20,
  },
  activeChipText: { fontSize: 12, fontWeight: "700", color: C.accent },

  // List
  listContent: { backgroundColor: C.white, paddingBottom: 100 },

  // Card
  card: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: C.white,
  },
  avatarWrap: {
    position: "relative",
    width: AVATAR,
    height: AVATAR,
    marginRight: 14,
  },
  avatar: {
    width: AVATAR,
    height: AVATAR,
    borderRadius: AVATAR / 2,
    backgroundColor: "#E2E8F0",
  },
  statusRing: {
    position: "absolute",
    inset: -2,
    borderRadius: (AVATAR + 4) / 2,
    borderWidth: 2,
  },
  statusDot: {
    position: "absolute",
    bottom: 1,
    right: 1,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: C.white,
  },
  cardInfo: { flex: 1 },
  empName: {
    fontSize: 15,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.2,
    marginBottom: 2,
  },
  empTitle: { fontSize: 12, color: C.sub, fontWeight: "500", marginBottom: 7 },
  cardMeta: { flexDirection: "row", alignItems: "center", gap: 8 },
  deptTag: {
    backgroundColor: C.accentLight,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  deptTagText: { fontSize: 11, fontWeight: "700", color: C.accent },
  statusLabel: { fontSize: 11, fontWeight: "600" },
  chevronWrap: { paddingLeft: 8 },
  chevron: {
    fontSize: 22,
    color: "#CBD5E1",
    fontWeight: "300",
    lineHeight: 26,
  },

  // Empty
  empty: { alignItems: "center", paddingTop: 80, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: "700", color: C.navy, marginTop: 8 },
  emptySub: { fontSize: 13, color: C.muted },

  // Modal
  overlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.45)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 22,
    paddingBottom: 38,
    paddingTop: 12,
  },
  sheetHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 18,
  },
  sheetHeaderRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
  },
  sheetSub: { fontSize: 12, color: C.muted, marginTop: 3 },
  sheetCloseIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  deptList: { gap: 3 },
  deptRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
  },
  deptRowActive: { backgroundColor: C.accentLight },
  deptRowText: { fontSize: 14, fontWeight: "600", color: C.sub },
  deptRowTextActive: { color: C.accent },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
});
