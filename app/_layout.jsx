import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

const queryClient = new QueryClient();

function AuthGate() {
  const router = useRouter();
  const segments = useSegments();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("access_token");
        const inAuthGroup = segments[0] === "(auth)";

        if (!token && !inAuthGroup) {
          router.replace("/login");
        }
      } catch (e) {
        router.replace("/login");
      } finally {
        setIsReady(true);
      }
    };

    checkAuth();
  }, [segments]);

  if (!isReady) return null;

  return null;
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
      <AuthGate />
    </QueryClientProvider>
  );
}
