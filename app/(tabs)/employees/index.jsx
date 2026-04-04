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
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Design tokens ────────────────────────────────────────────────────────────
const C = {
  accent: "#0F766E",
  accentMid: "#14b8a6",
  accentLight: "#F0FDFA",
  navy: "#0F172A",
  slate: "#1E293B",
  text: "#0F172A",
  sub: "#64748B",
  border: "#E2E8F0",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  green: "#059669",
  red: "#DC2626",
};

// ─── Data ─────────────────────────────────────────────────────────────────────
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

// ─── Filter Modal ─────────────────────────────────────────────────────────────
function FilterModal({ visible, selected, onSelect, onClose }) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <Pressable style={styles.modalSheet} onPress={() => {}}>
          {/* Handle bar */}
          <View style={styles.sheetHandle} />

          <Text style={styles.sheetTitle}>Filter by Department</Text>
          <Text style={styles.sheetSub}>
            Select a department to filter employees
          </Text>

          <View style={styles.deptList}>
            {DEPARTMENTS.map((dept) => {
              const active = selected === dept;
              return (
                <Pressable
                  key={dept}
                  style={({ pressed }) => [
                    styles.deptRow,
                    active && styles.deptRowActive,
                    pressed && { opacity: 0.7 },
                  ]}
                  onPress={() => {
                    onSelect(dept);
                    onClose();
                  }}
                >
                  <View
                    style={[styles.deptDot, active && styles.deptDotActive]}
                  />
                  <Text
                    style={[
                      styles.deptRowText,
                      active && styles.deptRowTextActive,
                    ]}
                  >
                    {dept}
                  </Text>
                  {active && (
                    <View style={styles.deptCheck}>
                      <Text style={styles.deptCheckMark}>✓</Text>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>

          <Pressable style={styles.sheetClose} onPress={onClose}>
            <Text style={styles.sheetCloseText}>Done</Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

// ─── Employee Card ─────────────────────────────────────────────────────────────
function EmployeeCard({ item, onPress }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.82, transform: [{ scale: 0.985 }] },
      ]}
      onPress={() => onPress(item.id)}
    >
      <Image
        source={{ uri: item.photo }}
        style={styles.photo}
        contentFit="cover"
        transition={300}
      />

      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.empName} numberOfLines={1}>
            {item.name}
          </Text>
          <View
            style={[
              styles.statusPill,
              {
                backgroundColor:
                  item.status === "Active" ? "#DCFCE7" : "#FEE2E2",
              },
            ]}
          >
            <View
              style={[
                styles.statusDot,
                { backgroundColor: item.status === "Active" ? C.green : C.red },
              ]}
            />
            <Text
              style={[
                styles.statusText,
                { color: item.status === "Active" ? "#15803D" : "#B91C1C" },
              ]}
            >
              {item.status}
            </Text>
          </View>
        </View>

        <Text style={styles.empTitle} numberOfLines={1}>
          {item.title}
        </Text>

        <View style={styles.cardFooter}>
          <View style={styles.deptTag}>
            <Text style={styles.deptTagText}>{item.department}</Text>
          </View>
          <View style={styles.arrowCircle}>
            <Text style={styles.arrowText}>→</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function EmployeesScreen() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [activeDept, setActiveDept] = useState("All");
  const [filterVisible, setFilterVisible] = useState(false);

  const filtered = EMPLOYEES.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(search.toLowerCase()) ||
      emp.title.toLowerCase().includes(search.toLowerCase());
    const matchDept = activeDept === "All" || emp.department === activeDept;
    return matchSearch && matchDept;
  });

  const handleCardPress = useCallback(
    (id) => router.push(`/employees/${id}`),
    [router],
  );

  const renderItem = useCallback(
    ({ item }) => <EmployeeCard item={item} onPress={handleCardPress} />,
    [handleCardPress],
  );

  const filterLabel = activeDept === "All" ? "All Departments" : activeDept;
  const filterActive = activeDept !== "All";

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={C.white} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerInner}>
          <View>
            <Text style={styles.headerTitle}>Employees</Text>
            <Text style={styles.headerCount}>
              {filtered.length} {filtered.length === 1 ? "member" : "members"}
            </Text>
          </View>
          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              pressed && { opacity: 0.8, transform: [{ scale: 0.93 }] },
            ]}
            onPress={() => router.push("/employees/add")}
          >
            <Text style={styles.addBtnText}>+</Text>
          </Pressable>
        </View>

        {/* Search + Filter row */}
        <View style={styles.controlRow}>
          {/* Search */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>⌕</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name or role…"
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")} style={styles.clearBtn}>
                <Text style={styles.clearText}>✕</Text>
              </Pressable>
            )}
          </View>

          {/* Filter button */}
          <Pressable
            style={({ pressed }) => [
              styles.filterBtn,
              filterActive && styles.filterBtnActive,
              pressed && { opacity: 0.75 },
            ]}
            onPress={() => setFilterVisible(true)}
          >
            <Text
              style={[styles.filterIcon, filterActive && { color: C.white }]}
            >
              ⊟
            </Text>
          </Pressable>
        </View>

        {/* Active filter label */}
        {filterActive && (
          <View style={styles.activeFilterRow}>
            <View style={styles.activeFilterChip}>
              <Text style={styles.activeFilterText}>{activeDept}</Text>
              <Pressable
                onPress={() => setActiveDept("All")}
                style={styles.removeFilter}
              >
                <Text style={styles.removeFilterText}>✕</Text>
              </Pressable>
            </View>
          </View>
        )}
      </SafeAreaView>

      {/* ── List ───────────────────────────────────────────────────────── */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No employees found</Text>
            <Text style={styles.emptySub}>
              Try adjusting your search or filter
            </Text>
          </View>
        }
      />

      {/* ── Filter Modal ────────────────────────────────────────────────── */}
      <FilterModal
        visible={filterVisible}
        selected={activeDept}
        onSelect={setActiveDept}
        onClose={() => setFilterVisible(false)}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: C.bg,
  },

  // Header
  header: {
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 10,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.5,
  },
  headerCount: {
    fontSize: 13,
    color: C.sub,
    fontWeight: "500",
    marginTop: 2,
  },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: C.accent,
    shadowOpacity: 0.35,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addBtnText: {
    fontSize: 24,
    color: C.white,
    fontWeight: "300",
    lineHeight: 28,
    marginTop: -1,
  },

  // Controls
  controlRow: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    gap: 8,
  },
  searchIcon: {
    fontSize: 20,
    color: "#94A3B8",
    lineHeight: 24,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: C.navy,
    height: "100%",
  },
  clearBtn: {
    padding: 4,
  },
  clearText: {
    fontSize: 12,
    color: "#94A3B8",
    fontWeight: "600",
  },
  filterBtn: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.border,
  },
  filterBtnActive: {
    backgroundColor: C.accent,
    borderColor: C.accent,
  },
  filterIcon: {
    fontSize: 20,
    color: C.sub,
    lineHeight: 24,
  },

  // Active filter
  activeFilterRow: {
    flexDirection: "row",
    marginTop: 10,
  },
  activeFilterChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.accentLight,
    borderWidth: 1.5,
    borderColor: C.accent,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 8,
  },
  activeFilterText: {
    fontSize: 12,
    fontWeight: "700",
    color: C.accent,
  },
  removeFilter: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  removeFilterText: {
    fontSize: 9,
    color: C.white,
    fontWeight: "700",
  },

  // List
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },

  // Card
  card: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    shadowColor: "#0F172A",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  photo: {
    width: 80,
    height: 90,
    backgroundColor: "#E2E8F0",
  },
  cardBody: {
    flex: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    justifyContent: "space-between",
  },
  cardTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  empName: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: C.navy,
    letterSpacing: -0.2,
  },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  empTitle: {
    fontSize: 12,
    color: C.sub,
    marginTop: 2,
    fontWeight: "500",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  deptTag: {
    backgroundColor: C.accentLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deptTagText: {
    fontSize: 11,
    fontWeight: "700",
    color: C.accent,
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    fontSize: 14,
    color: C.sub,
    fontWeight: "600",
  },

  // Empty
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    gap: 8,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: 4,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: C.navy,
  },
  emptySub: {
    fontSize: 13,
    color: C.sub,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 14,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    backgroundColor: "#E2E8F0",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 20,
  },
  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  sheetSub: {
    fontSize: 13,
    color: C.sub,
    marginBottom: 20,
  },
  deptList: {
    gap: 4,
  },
  deptRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 14,
    backgroundColor: "#F8FAFC",
    gap: 12,
  },
  deptRowActive: {
    backgroundColor: C.accentLight,
  },
  deptDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#CBD5E1",
  },
  deptDotActive: {
    backgroundColor: C.accent,
  },
  deptRowText: {
    flex: 1,
    fontSize: 15,
    fontWeight: "600",
    color: C.sub,
  },
  deptRowTextActive: {
    color: C.accent,
  },
  deptCheck: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  deptCheckMark: {
    fontSize: 12,
    color: C.white,
    fontWeight: "700",
  },
  sheetClose: {
    marginTop: 20,
    height: 52,
    borderRadius: 14,
    backgroundColor: C.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetCloseText: {
    fontSize: 16,
    fontWeight: "700",
    color: C.white,
  },
});
