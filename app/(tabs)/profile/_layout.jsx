import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { UserCircleIcon } from "react-native-heroicons/outline";
import { headerTitleStyle } from "../../../src/theme/fonts";

const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  accentMid: "#CCFBF1",
  navy: "#0F172A",
  muted: "#94A3B8",
  border: "#E2E8F0",
  white: "#FFFFFF",
};

export function ProfileHeaderTitle({ name, role }) {
  return (
    <View style={h.wrap}>
      <View style={h.iconWrap}>
        <UserCircleIcon size={16} color={C.accent} strokeWidth={2.5} />
      </View>
      <View>
        <Text style={h.title}>Profile</Text>
        {role ? <Text style={h.sub}>{role}</Text> : null}
      </View>
    </View>
  );
}

const h = StyleSheet.create({
  wrap: { flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: C.accentLight,
    borderWidth: 1,
    borderColor: C.accentMid,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
  },
  sub: {
    fontSize: 11,
    color: C.muted,
    fontWeight: "500",
    marginTop: 1,
  },
});

export default function ProfileStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerBackTitle: "Back",
        headerStyle: { backgroundColor: C.white },
        headerTintColor: C.navy,
        headerTitleStyle: { ...headerTitleStyle, color: C.navy },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: "#F8FAFC", paddingBottom: 100 },
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          headerTitle: () => <ProfileHeaderTitle name="" role="" />,
        }}
      />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
    </Stack>
  );
}
