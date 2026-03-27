import { StyleSheet, Text, View } from "react-native";

import { SCREEN_BG } from "../../../../src/theme/navigationTheme";

export default function PayrollHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payroll</Text>
      <Text style={styles.body}>
        Reach this screen from Dashboard when you wire navigation (e.g. a Payroll button).
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
