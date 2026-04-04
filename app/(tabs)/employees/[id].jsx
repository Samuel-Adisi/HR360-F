import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import {
  ChevronLeftIcon,
  EnvelopeIcon,
  PhoneIcon,
} from "react-native-heroicons/outline";
import { SafeAreaView } from "react-native-safe-area-context";

import { monoText, sansText, serifText } from "../../../src/theme/fonts";

const ACCENT = "#0F766E";
const BG_LIGHT = "#F8FAFC";

// Same Mock data lookup for presentation
const MOCK_EMPLOYEES = {
  1: {
    name: "Sarah Miller",
    title: "Product Designer",
    department: "Design",
    uri: "https://i.pravatar.cc/150?u=1",
    email: "sarah.m@company.com",
    phone: "+1 (555) 123-4567",
  },
  2: {
    name: "James Chen",
    title: "Backend Engineer",
    department: "Engineering",
    uri: "https://i.pravatar.cc/150?u=2",
    email: "james.c@company.com",
    phone: "+1 (555) 987-6543",
  },
  3: {
    name: "Alice Johnson",
    title: "HR Manager",
    department: "Human Resources",
    uri: "https://i.pravatar.cc/150?u=3",
    email: "alice.j@company.com",
    phone: "+1 (555) 456-7890",
  },
  4: {
    name: "Robert Fox",
    title: "Marketing Lead",
    department: "Marketing",
    uri: "https://i.pravatar.cc/150?u=4",
    email: "robert.f@company.com",
    phone: "+1 (555) 321-0987",
  },
  5: {
    name: "Emily Davis",
    title: "Sales Executive",
    department: "Sales",
    uri: "https://i.pravatar.cc/150?u=5",
    email: "emily.d@company.com",
    phone: "+1 (555) 654-3210",
  },
};

export default function EmployeeProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const emp = MOCK_EMPLOYEES[id] || MOCK_EMPLOYEES["1"]; // fallback

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <Pressable
          style={({ pressed }) => [styles.backBtn, pressed && { opacity: 0.7 }]}
          onPress={() => router.back()}
        >
          <ChevronLeftIcon size={24} color="#0F172A" />
        </Pressable>
        <Text style={[styles.headerTitle, sansText()]}>Profile</Text>
        <View style={{ width: 24 }} />
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.profileHero}>
          <Image
            source={{ uri: emp.uri }}
            style={styles.largeAvatar}
            contentFit="cover"
          />
          <Text style={[styles.empName, serifText()]}>{emp.name}</Text>
          <Text style={[styles.empTitle, sansText()]}>{emp.title}</Text>
          <View style={styles.deptBadge}>
            <Text style={[styles.deptText, sansText()]}>{emp.department}</Text>
          </View>
        </View>

        {/* Contact Info */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, serifText()]}>
            Contact Information
          </Text>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <EnvelopeIcon size={20} color={ACCENT} />
            </View>
            <View>
              <Text style={[styles.infoLabel, sansText()]}>Email</Text>
              <Text style={[styles.infoValue, sansText()]}>{emp.email}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <PhoneIcon size={20} color={ACCENT} />
            </View>
            <View>
              <Text style={[styles.infoLabel, sansText()]}>Phone</Text>
              <Text style={[styles.infoValue, monoText()]}>{emp.phone}</Text>
            </View>
          </View>
        </View>

        {/* Work Details Mock */}
        <View style={styles.card}>
          <Text style={[styles.cardTitle, serifText()]}>Work Details</Text>
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, sansText()]}>Employee ID</Text>
            <Text style={[styles.detailValue, monoText()]}>
              EMP-{id.padStart(4, "0")}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, sansText()]}>Manager</Text>
            <Text style={[styles.detailValue, sansText()]}>Sarah Miller</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, sansText()]}>Join Date</Text>
            <Text style={[styles.detailValue, sansText()]}>Oct 12, 2023</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: {
    padding: 4,
    marginLeft: -4,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0F172A",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  profileHero: {
    alignItems: "center",
    marginBottom: 24,
  },
  largeAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E2E8F0",
    marginBottom: 16,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  empName: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 4,
  },
  empTitle: {
    fontSize: 15,
    color: "#64748B",
    marginBottom: 12,
  },
  deptBadge: {
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  deptText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748B",
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "500",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: "#64748B",
  },
  detailValue: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "600",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
  },
});
