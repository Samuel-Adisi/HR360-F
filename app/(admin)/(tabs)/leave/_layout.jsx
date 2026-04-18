import { Stack } from "expo-router";

export default function LeaveStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="add" options={{ headerShown: false }} />
    </Stack>
  );
}
