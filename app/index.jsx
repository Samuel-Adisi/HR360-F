import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const check = async () => {
      try {
        const rolee = await AsyncStorage.setItem("user_role", "employee");
        const token = await AsyncStorage.getItem("access_token");
        const role = await AsyncStorage.getItem("user_role");

        if (!token) {
          router.replace("/login");
          return;
        }

        if (role === "employee") {
          router.replace("/(employees)/(tabs)/dashboard");
        } else {
          router.replace("/(employees)/(tabs)/dashboard");
        }
      } catch {
        router.replace("/login");
      } finally {
        setReady(true);
      }
    };
    check();
  }, [router]);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator />
      </View>
    );
  }

  return null;
}
