import { NativeTabs } from "expo-router/unstable-native-tabs";
import { GlassView } from "expo-glass-effect";
import { DynamicColorIOS, StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";

export const unstable_settings = {
  // Must match the `NativeTabs.Trigger name` values below.
  initialRouteName: "employees",
};

export default function TabsLayout() {
  useEffect(() => {
    // #region agent log
    fetch(
      "http://127.0.0.1:7435/ingest/573e11c3-4929-47fe-8a5b-0b9558470170",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "021120",
        },
        body: JSON.stringify({
          sessionId: "021120",
          location: "app/(tabs)/_layout.jsx:TabsLayoutMount",
          message: "NativeTabs layout mounted; configured triggers",
          hypothesisId: "H1_tabsLayoutMountAndTriggerNames",
          data: {
            initialRouteName: unstable_settings.initialRouteName,
            tabTriggers: [
              "dashboard/index",
              "employees",
              "payroll/index",
              "settings/index",
            ],
          },
          timestamp: Date.now(),
        }),
      },
    ).catch(() => {});
    // #endregion
  }, []);

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={["#0B1220", "#0A66C2", "#0B1220"]}
        style={StyleSheet.absoluteFill}
      />

      {/* Glass overlay to give the "Liquid Glass" vibe behind content */}
      <GlassView
        pointerEvents="none"
        style={styles.glassBg}
        glassEffectStyle="regular"
        tintColor={DynamicColorIOS({ dark: "rgba(255,255,255,0.22)", light: "rgba(0,0,0,0.12)" })}
      />

      <NativeTabs
        labelStyle={{
          color: DynamicColorIOS({ dark: "#FFFFFF", light: "#0F172A" }),
        }}
        tintColor={DynamicColorIOS({ dark: "#FFFFFF", light: "#0A66C2" })}
      >
        <NativeTabs.Trigger name="dashboard">
          <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
          <NativeTabs.Trigger.Label>Dashboard</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="employees">
          <NativeTabs.Trigger.Icon sf="person.3.fill" md="people" />
          <NativeTabs.Trigger.Label>Employees</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="payroll">
          <NativeTabs.Trigger.Icon sf="creditcard.fill" md="paid" />
          <NativeTabs.Trigger.Label>Payroll</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>

        <NativeTabs.Trigger name="settings">
          <NativeTabs.Trigger.Icon sf="gearshape.fill" md="settings" />
          <NativeTabs.Trigger.Label>Settings</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
      </NativeTabs>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  glassBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
