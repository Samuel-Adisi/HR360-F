import { Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { ClipboardDocumentListIcon } from "react-native-heroicons/outline";

const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  accentMid: "#CCFBF1",
  navy: "#0F172A",
  muted: "#94A3B8",
  border: "#E2E8F0",
  white: "#FFFFFF",
};

function AttendanceHeaderTitle({ date, total }) {
  return (
    <View style={h.wrap}>
      <View style={h.iconWrap}>
        <ClipboardDocumentListIcon
          size={16}
          color={C.accent}
          strokeWidth={2.5}
        />
      </View>
      <View>
        <Text style={h.title}>Attendance</Text>
        <Text style={h.sub}>{date}</Text>
      </View>
    </View>
  );
}

function AttendanceHeaderRight({ total }) {
  return (
    <View style={h.badge}>
      <Text style={h.badgeNum}>{total}</Text>
      <Text style={h.badgeLabel}>Total</Text>
    </View>
  );
}

const h = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
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
  badge: {
    backgroundColor: C.accentLight,
    borderWidth: 1,
    borderColor: C.accentMid,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 5,
    alignItems: "center",
    minWidth: 48,
  },
  badgeNum: {
    fontSize: 16,
    fontWeight: "800",
    color: C.accent,
    lineHeight: 20,
  },
  badgeLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: C.accent,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
});

export { AttendanceHeaderRight, AttendanceHeaderTitle };

export default function AttendanceStack() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#F8FAFC", paddingBottom: 5 },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="employees/[id]" />
    </Stack>
  );
}
