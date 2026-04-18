import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "@react-navigation/native";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";

import { AppNavigationTheme } from "../src/theme/navigationTheme";

const queryClient = new QueryClient();

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const inAuth = segments[0] === "(auth)";
        if (!token && !inAuth) {
          router.replace("/login");
        }
      } catch {
        router.replace("/login");
      } finally {
        if (!cancelled) setReady(true);
      }
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [segments, router]);

  if (!ready) return null;
  return null;
}

export default function RootLayout() {
  return (
    <ThemeProvider value={AppNavigationTheme}>
      <StatusBar style="dark" />
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(employees)/(tabs)" />
          <Stack.Screen name="(admin)/(tabs)" />
          <Stack.Screen
            name="notifications"
            options={{ presentation: "modal" }}
          />
        </Stack>
        <AuthGate />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
