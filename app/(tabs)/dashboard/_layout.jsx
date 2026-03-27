import { Stack } from "expo-router";

import { headerTitleStyle } from "../../../src/theme/fonts";

export default function DashboardStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#0F172A",
        headerTitleStyle: { ...headerTitleStyle, color: "#0F172A" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#F8FAFC", paddingBottom: 100 },
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="payroll/index" options={{ title: "Payroll" }} />
    </Stack>
  );
}
