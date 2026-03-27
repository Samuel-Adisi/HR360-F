import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import {
  ArrowRightIcon,
  BanknotesIcon,
  CalendarDaysIcon,
  ChartBarSquareIcon,
  ClockIcon,
  UsersIcon,
} from "react-native-heroicons/outline";

const ACCENT = "#0F766E";
const ACCENT_DARK = "#0D5C56";

function formatDate() {
  return new Intl.DateTimeFormat("en", {
    weekday: "long",
    month: "long",
    day: "numeric",
  }).format(new Date());
}

export default function DashboardHome() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const loadUser = useCallback(async () => {
    try {
      const name = await AsyncStorage.getItem("username");
      setUsername(name || "");
    } catch {
      setUsername("");
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadUser();
    setRefreshing(false);
  }, [loadUser]);

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <LinearGradient
          colors={["#ECFDF5", "#F0FDF4", "#F8FAFC"]}
          style={styles.heroGradient}
        >
          <SafeAreaView edges={["top"]} style={styles.heroSafe}>
            <Text style={styles.kicker}>Today</Text>
            <Text style={styles.heroTitle}>
              {username ? `Hi, ${username}` : "Welcome back"}
            </Text>
            <Text style={styles.heroSubtitle}>{formatDate()}</Text>
          </SafeAreaView>
        </LinearGradient>

        <View style={styles.sheet}>
          <View style={styles.statsRow}>
            <StatCard
              label="Present"
              value="—"
              hint="Today"
              icon={<UsersIcon size={20} color={ACCENT} />}
            />
            <StatCard
              label="On leave"
              value="—"
              hint="This week"
              icon={<CalendarDaysIcon size={20} color={ACCENT} />}
            />
            <StatCard
              label="Pending"
              value="—"
              hint="Actions"
              icon={<ClockIcon size={20} color={ACCENT} />}
            />
          </View>

          <Text style={styles.sectionTitle}>Quick actions</Text>
          <View style={styles.actionsGrid}>
            <ActionTile
              title="Employees"
              subtitle="Directory & profiles"
              icon={<UsersIcon size={22} color="#FFFFFF" />}
              onPress={() => router.push("/employees")}
            />
            <ActionTile
              title="Attendance"
              subtitle="Roster & time"
              icon={<CalendarDaysIcon size={22} color="#FFFFFF" />}
              onPress={() => router.push("/attendance")}
            />
            <ActionTile
              title="Payroll"
              subtitle="Runs & payslips"
              icon={<BanknotesIcon size={22} color="#FFFFFF" />}
              onPress={() => router.push("/dashboard/payroll")}
            />
            <ActionTile
              title="Reports"
              subtitle="Coming soon"
              muted
              icon={<ChartBarSquareIcon size={22} color="#94A3B8" />}
              onPress={() => {}}
            />
          </View>

          <Text style={styles.sectionTitle}>Reminders</Text>
          <View style={styles.card}>
            <ReminderRow title="Connect your calendar" onPress={() => {}} />
            <View style={styles.divider} />
            <ReminderRow
              title="Review pending approvals"
              onPress={() => router.push("/employees")}
            />
          </View>

          <View style={styles.bottomPad} />
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({ label, value, hint, icon }) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIconWrap}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statHint}>{hint}</Text>
    </View>
  );
}

function ActionTile({ title, subtitle, icon, onPress, muted = false }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={muted}
      style={({ pressed }) => [
        styles.actionTile,
        muted && styles.actionTileMuted,
        pressed && !muted && styles.actionPressed,
      ]}
    >
      <LinearGradient
        colors={
          muted ? ["#F1F5F9", "#E2E8F0"] : [ACCENT, ACCENT_DARK]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.actionIconCircle}
      >
        {icon}
      </LinearGradient>
      <Text style={[styles.actionTitle, muted && styles.actionTitleMuted]}>
        {title}
      </Text>
      <Text style={[styles.actionSub, muted && styles.actionSubMuted]}>
        {subtitle}
      </Text>
    </Pressable>
  );
}

function ReminderRow({ title, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.reminderRow, pressed && { opacity: 0.85 }]}
    >
      <Text style={styles.reminderText}>{title}</Text>
      <ArrowRightIcon size={18} color="#64748B" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  scrollContent: {
    flexGrow: 1,
  },
  heroGradient: {
    paddingBottom: 20,
  },
  heroSafe: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  kicker: {
    fontSize: 13,
    fontWeight: "600",
    color: ACCENT,
    letterSpacing: 0.3,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 6,
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: -8,
    marginBottom: 8,
  },
  statIconWrap: {
    marginBottom: 6,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#0F172A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
    marginTop: 4,
  },
  statHint: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 2,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 20,
    marginBottom: 12,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 12,
    marginBottom: 8,
  },
  actionIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  actionTile: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  actionTileMuted: {
    opacity: 0.85,
  },
  actionPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0F172A",
  },
  actionTitleMuted: {
    color: "#64748B",
  },
  actionSub: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  actionSubMuted: {
    color: "#94A3B8",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E2E8F0",
  },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 4,
  },
  reminderText: {
    fontSize: 15,
    color: "#334155",
    flex: 1,
    paddingRight: 8,
  },
  bottomPad: {
    height: 100,
  },
});
