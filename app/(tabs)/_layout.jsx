import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false, tabBarShowLabel: false }}>
      <Tabs.Screen name="dashboard" options={{ headerShown: false }} />
      <Tabs.Screen name="attendance" options={{ headerShown: false }} />
      <Tabs.Screen name="employees" options={{ headerShown: false }} />
      <Tabs.Screen name="payroll" options={{ headerShown: false }} />
      <Tabs.Screen name="settings" options={{ headerShown: false }} />
    </Tabs>
  );
}
