import { Stack } from "expo-router";

import { headerTitleStyle } from "../../../src/theme/fonts";

export default function ProfileStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Profile",
        headerStyle: { backgroundColor: "#FFFFFF" },
        headerTintColor: "#0F172A",
        headerTitleStyle: { ...headerTitleStyle, color: "#0F172A" },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#F8FAFC", paddingBottom: 100 },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Profile", headerShown: false }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
