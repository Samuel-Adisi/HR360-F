import { Stack } from "expo-router";

import { headerTitleStyle } from "../../../src/theme/fonts";

export default function EmployeesStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#0F172A",
        headerTitleStyle: { ...headerTitleStyle, color: "#0F172A" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#F8FAFC", paddingBottom: 100 },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Employees" }} />
      <Stack.Screen
        name="add"
        options={{ title: "Add", presentation: "modal" }}
      />
    </Stack>
  );
}
