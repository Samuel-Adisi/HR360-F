import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckCircleIcon, ClockIcon } from "react-native-heroicons/outline";
import * as Location from "expo-location";
import { useCameraPermissions } from "expo-camera";

import { monoText, sansText, serifText } from "../../../src/theme/fonts";

const ACCENT = "#0F766E";
const RED_ACCENT = "#E11D48";
const BG_LIGHT = "#F8FAFC";

// Mock History Data
const MOCK_HISTORY = [
  { id: 1, date: "Today", in: "08:52 AM", out: "--:-- --", status: "Active" },
  { id: 2, date: "Yesterday", in: "08:45 AM", out: "05:10 PM", status: "Present" },
  { id: 3, date: "Wednesday", in: "09:05 AM", out: "05:00 PM", status: "Late" },
];

export default function AttendanceHome() {
  const [isClockedIn, setIsClockedIn] = useState(true);
  const [loading, setLoading] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();

  const handleToggleClock = async () => {
    setLoading(true);
    let { status: locStatus } = await Location.requestForegroundPermissionsAsync();
    
    if (locStatus !== "granted") {
      Alert.alert("Permission denied", "Location permission is required.");
      setLoading(false);
      return;
    }

    if (!cameraPermission?.granted) {
      const camStatus = await requestCameraPermission();
      if (!camStatus.granted) {
        Alert.alert("Permission denied", "Camera permission is required.");
        setLoading(false);
        return;
      }
    }

    // Mock processing delay
    setTimeout(() => {
      setIsClockedIn(!isClockedIn);
      setLoading(false);
      Alert.alert("Success", isClockedIn ? "Clocked out successfully." : "Clocked in successfully.");
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <Text style={[styles.title, serifText()]}>Attendance</Text>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Main Clock Action Area */}
        <View style={styles.clockCard}>
          <Text style={[styles.clockCardTitle, sansText()]}>
            Current Status
          </Text>
          <View style={styles.statusBadge}>
            <View style={[styles.statusDot, isClockedIn ? styles.dotActive : styles.dotInactive]} />
            <Text style={[styles.statusText, sansText()]}>
              {isClockedIn ? "Checked In" : "Checked Out"}
            </Text>
          </View>
          
          <Text style={[styles.timeDisplay, monoText()]}>
            {isClockedIn ? "08:52 AM" : "--:--"}
          </Text>

          <Pressable 
            onPress={handleToggleClock}
            disabled={loading}
            style={({pressed}) => [
              styles.actionButton,
              isClockedIn ? styles.actionButtonOut : styles.actionButtonIn,
              pressed && { opacity: 0.8 },
              loading && { opacity: 0.5 }
            ]}
          >
            <Text style={[styles.actionButtonText, sansText()]}>
              {loading 
                ? "Verifying..." 
                : isClockedIn ? "Clock Out" : "Clock In"}
            </Text>
          </Pressable>
        </View>

        {/* Weekly Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={[styles.statBoxLabel, sansText()]}>Total Hours</Text>
            <Text style={[styles.statBoxValue, monoText()]}>32.5<Text style={styles.statBoxUnit}>h</Text></Text>
          </View>
          <View style={styles.statBox}>
            <Text style={[styles.statBoxLabel, sansText()]}>Overtime</Text>
            <Text style={[styles.statBoxValue, monoText()]}>2.0<Text style={styles.statBoxUnit}>h</Text></Text>
          </View>
        </View>

        {/* Recent Logs List */}
        <Text style={[styles.sectionTitle, serifText()]}>Recent Activity</Text>
        <View style={styles.listContainer}>
          {MOCK_HISTORY.map((item, index) => (
            <View key={item.id}>
              <View style={styles.listItem}>
                <View style={styles.listLeft}>
                  <LinearGradient 
                    colors={item.status === "Late" ? ["#FFFBEB", "#FEF3C7"] : ["#F0FDF4", "#DCFCE7"]}
                    style={styles.iconCircle}
                  >
                     <ClockIcon size={20} color={item.status === "Late" ? "#D97706" : "#16A34A"} />
                  </LinearGradient>
                  <View>
                    <Text style={[styles.itemDate, sansText()]}>{item.date}</Text>
                    <Text style={[styles.itemStatus, sansText(), item.status === "Late" && {color: "#D97706"}]}>
                      {item.status}
                    </Text>
                  </View>
                </View>
                <View style={styles.listRight}>
                  <Text style={[styles.itemTime, monoText()]}>IN: {item.in}</Text>
                  <Text style={[styles.itemTime, monoText()]}>OUT: {item.out}</Text>
                </View>
              </View>
              {index < MOCK_HISTORY.length - 1 && <View style={styles.divider} />}
            </View>
          ))}
        </View>

        <View style={{ height: 100 }} />
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
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
  },
  scrollContent: {
    padding: 20,
  },
  clockCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  clockCardTitle: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginTop: 12,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  dotActive: {
    backgroundColor: "#10B981",
  },
  dotInactive: {
    backgroundColor: "#94A3B8",
  },
  statusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
  },
  timeDisplay: {
    fontSize: 48,
    fontWeight: "700",
    color: "#0F172A",
    marginVertical: 16,
  },
  actionButton: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  actionButtonIn: {
    backgroundColor: ACCENT,
  },
  actionButtonOut: {
    backgroundColor: RED_ACCENT,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 24,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statBoxLabel: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "600",
  },
  statBoxValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
    marginTop: 4,
  },
  statBoxUnit: {
    fontSize: 14,
    color: "#64748B",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 12,
  },
  listContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  listLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  itemDate: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  itemStatus: {
    fontSize: 13,
    color: "#16A34A",
    fontWeight: "500",
    marginTop: 2,
  },
  listRight: {
    alignItems: "flex-end",
  },
  itemTime: {
    fontSize: 13,
    color: "#475569",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginHorizontal: 16,
  },
});
