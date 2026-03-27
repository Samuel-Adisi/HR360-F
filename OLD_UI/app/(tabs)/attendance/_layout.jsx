import { Stack } from "expo-router";

export default function AttendanceLayout() {
  // Native tabs require a stack root for push-style navigation.
  return <Stack screenOptions={{ headerShown: false }} />;
}

