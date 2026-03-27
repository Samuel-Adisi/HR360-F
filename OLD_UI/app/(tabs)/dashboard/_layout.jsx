import { Stack } from "expo-router";

export default function DashboardLayout() {
  // Allows pushing nested screens within the "dashboard" tab.
  return <Stack screenOptions={{ headerShown: false }} />;
}

