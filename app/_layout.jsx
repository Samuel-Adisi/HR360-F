import { Slot, Stack } from "expo-router";

export const unstable_settings = {
  anchor: '(clocking)',
};

export default function RootLayout() {
  return (
    <Stack>
      <Slot/>
      <Stack.Screen name="(clocking)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
    </Stack>

  );
}
