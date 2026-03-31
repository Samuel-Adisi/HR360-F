import { useRouter } from "expo-router";
import { useState } from "react";
import { 
  FlatList, 
  Pressable, 
  StyleSheet, 
  Text, 
  TextInput, 
  View 
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MagnifyingGlassIcon, PlusIcon, ChevronRightIcon } from "react-native-heroicons/outline";
import { Image } from "expo-image";

import { monoText, sansText, serifText } from "../../../src/theme/fonts";

const ACCENT = "#0F766E";
const BG_LIGHT = "#F8FAFC";

const MOCK_EMPLOYEES = [
  { id: "1", name: "Sarah Miller", title: "Product Designer", department: "Design", uri: "https://i.pravatar.cc/150?u=1" },
  { id: "2", name: "James Chen", title: "Backend Engineer", department: "Engineering", uri: "https://i.pravatar.cc/150?u=2" },
  { id: "3", name: "Alice Johnson", title: "HR Manager", department: "Human Resources", uri: "https://i.pravatar.cc/150?u=3" },
  { id: "4", name: "Robert Fox", title: "Marketing Lead", department: "Marketing", uri: "https://i.pravatar.cc/150?u=4" },
  { id: "5", name: "Emily Davis", title: "Sales Executive", department: "Sales", uri: "https://i.pravatar.cc/150?u=5" },
];

export default function EmployeesHome() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = MOCK_EMPLOYEES.filter(emp => 
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    emp.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <Pressable
      style={({ pressed }) => [styles.employeeCard, pressed && { opacity: 0.8 }]}
      onPress={() => router.push(`/employees/${item.id}`)}
    >
      <Image
        source={{ uri: item.uri }}
        style={styles.avatar}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.employeeInfo}>
        <Text style={[styles.empName, sansText()]}>{item.name}</Text>
        <Text style={[styles.empTitle, sansText()]}>{item.title}</Text>
        <View style={styles.deptBadge}>
          <Text style={[styles.deptText, sansText()]}>{item.department}</Text>
        </View>
      </View>
      <ChevronRightIcon size={20} color="#CBD5E1" />
    </Pressable>
  );

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, serifText()]}>Directory</Text>
          <Pressable 
            style={({ pressed }) => [styles.addButton, pressed && { opacity: 0.8 }]}
            onPress={() => router.push("/employees/add")}
          >
            <PlusIcon size={20} color="#FFFFFF" />
          </Pressable>
        </View>
        
        <View style={styles.searchContainer}>
          <MagnifyingGlassIcon size={20} color="#94A3B8" style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, sansText()]}
            placeholder="Search by name or team..."
            placeholderTextColor="#94A3B8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </SafeAreaView>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, sansText()]}>No employees found.</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0F172A",
    height: "100%",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  employeeCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
    backgroundColor: "#E2E8F0",
  },
  employeeInfo: {
    flex: 1,
  },
  empName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  empTitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 2,
    marginBottom: 6,
  },
  deptBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  deptText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#475569",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 15,
    color: "#94A3B8",
  },
});
