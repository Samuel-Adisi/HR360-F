import { StyleSheet, Text, View } from "react-native";

import { sansText, serifText } from "../../../src/theme/fonts";
import { SCREEN_BG } from "../../../src/theme/navigationTheme";

export default function AttendanceHome() {
  return (
    <View style={styles.container}>
      <Text style={[styles.title, serifText()]}>Attendance</Text>
      <Text style={[styles.body, sansText()]}>
        Schedules and time tracking will live here as we build the new UI.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    backgroundColor: SCREEN_BG,
  },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 8 },
  body: { fontSize: 15, color: "#555", lineHeight: 22 },
});
