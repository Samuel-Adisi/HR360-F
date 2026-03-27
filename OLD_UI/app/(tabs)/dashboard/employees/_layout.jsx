import { Tabs } from "expo-router";

export default function EmployeeLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="add" />
      <Tabs.Screen name="[id]" />
    </Tabs>
  );
}
