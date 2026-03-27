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

import { BRAND_TEAL } from "../../src/theme/navigationTheme";

import { FloatingTabBar } from "../../src/components/FloatingTabBar";

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
        labelStyle={{ color: labelColor }}
        iconColor={{ default: labelColor, selected: tint }}
        minimizeBehavior="automatic"
        labelVisibilityMode="unlabeled"
      >
        <NativeTabs.Trigger name="dashboard">
          <Icon
            sf="house.fill"
            androidSrc={<VectorIcon family={MaterialIcons} name="home" />}
          />
          <Label hidden />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="employees">
          <Icon
            sf="person.3.fill"
            androidSrc={<VectorIcon family={MaterialIcons} name="groups" />}
          />
          <Label hidden />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="attendance">
          <Icon
            sf="calendar"
            androidSrc={
              <VectorIcon family={MaterialIcons} name="calendar-today" />
            }
          />
          <Label hidden />
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="settings">
          <Icon
            sf="gearshape.fill"
            androidSrc={<VectorIcon family={MaterialIcons} name="settings" />}
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
        <Tabs.Screen name="employees" />
        <Tabs.Screen name="attendance" />
        <Tabs.Screen name="settings" />
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
