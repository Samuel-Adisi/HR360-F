import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { GlassView } from "expo-glass-effect";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import {
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import { Platform, StyleSheet, View } from "react-native";

import { FloatingTabBar } from "../../../src/components/FloatingTabBar";
import { BRAND_TEAL } from "../../../src/theme/navigationTheme";

export const unstable_settings = {
  initialRouteName: "dashboard",
};

function NativeShell() {
  const labelColor = "#0F172A";
  const tint = BRAND_TEAL;
  const glassTint = "rgba(0,0,0,0.08)";

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#ECFDF5", "#D1FAE5", "#F8FAFC"]}
        style={StyleSheet.absoluteFill}
      />
      <GlassView
        pointerEvents="none"
        style={styles.glassFill}
        glassEffectStyle="regular"
        tintColor={glassTint}
      />
      <NativeTabs
        blurEffect="systemChromeMaterial"
        tintColor={tint}
        labelStyle={{ color: labelColor, fontSize: 10 }}
        iconColor={{ default: labelColor, selected: tint }}
        minimizeBehavior="automatic"
        labelVisibilityMode="unlabeled"
        style={{ height: 50 }}
      >
        <NativeTabs.Trigger name="dashboard">
          <Icon
            sf="house.fill"
            symbolScale="small"
            androidSrc={<VectorIcon family={MaterialIcons} name="home" />}
          />
          <Label hidden />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="attendance">
          <Icon
            sf="clock.fill"
            symbolScale="small"
            androidSrc={
              <VectorIcon family={MaterialIcons} name="access-time" />
            }
          />
          <Label hidden />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="leave">
          <Icon
            sf="calendar.badge.clock"
            symbolScale="small"
            androidSrc={
              <VectorIcon family={MaterialIcons} name="event-available" />
            }
          />
          <Label hidden />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="payslips">
          <Icon
            sf="doc.text.fill"
            symbolScale="small"
            androidSrc={<VectorIcon family={MaterialIcons} name="receipt" />}
          />
          <Label hidden />
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="profile">
          <Icon
            sf="person.crop.circle.fill"
            symbolScale="small"
            androidSrc={
              <VectorIcon family={MaterialIcons} name="account-circle" />
            }
          />
          <Label hidden />
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}

function WebTabs() {
  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#F1F5F9", "#E2E8F0", "#F8FAFC"]}
        style={StyleSheet.absoluteFill}
      />
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} />}
        screenOptions={{
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: {
            position: "absolute",
            backgroundColor: "transparent",
            borderTopWidth: 0,
            boxShadow: "none",
          },
        }}
      >
        <Tabs.Screen name="dashboard" />
        <Tabs.Screen name="attendance" />
        <Tabs.Screen name="leave" />
        <Tabs.Screen name="payslips" />
        <Tabs.Screen name="profile" />
      </Tabs>
    </View>
  );
}

export default function TabsLayout() {
  if (Platform.OS === "web") {
    return <WebTabs />;
  }
  return <NativeShell />;
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  glassFill: {
    ...StyleSheet.absoluteFillObject,
  },
});
