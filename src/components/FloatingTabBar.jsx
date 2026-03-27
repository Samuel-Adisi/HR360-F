import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import {
  CalendarDaysIcon,
  Cog6ToothIcon,
  HomeIcon,
  PlusIcon,
  UsersIcon,
} from "react-native-heroicons/outline";
import { Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const ICON_SIZE = 22;
const ICON_ACTIVE = "#FFFFFF";
const ICON_INACTIVE = "#64748B";
/** Teal green FAB — matches dashboard / brand accent for primary actions */
const FAB_GREEN = "#0F766E";

const ROUTE_ICONS = {
  dashboard: HomeIcon,
  employees: UsersIcon,
  attendance: CalendarDaysIcon,
  settings: Cog6ToothIcon,
};

export function FloatingTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();

  const onTabPress = (route, index) => {
    const event = navigation.emit({
      type: "tabPress",
      target: route.key,
      canPreventDefault: true,
    });
    const isFocused = state.index === index;
    if (!isFocused && !event.defaultPrevented) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      navigation.navigate(route.name);
    }
  };

  const onFabPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push("/employees/add");
  };

  return (
    <View
      pointerEvents="box-none"
      style={[styles.outer, { paddingBottom: Math.max(insets.bottom, 12) }]}
    >
      <View style={styles.row}>
        <View style={styles.pill}>
          {state.routes.map((route, index) => {
            const focused = state.index === index;
            const Icon = ROUTE_ICONS[route.name];
            if (!Icon) return null;
            return (
              <Pressable
                key={route.key}
                accessibilityRole="button"
                accessibilityState={{ selected: focused }}
                accessibilityLabel={route.name}
                onPress={() => onTabPress(route, index)}
                style={styles.tabHit}
                hitSlop={8}
              >
                <View
                  style={[styles.iconCircle, focused && styles.iconCircleActive]}
                >
                  <Icon
                    size={ICON_SIZE}
                    color={focused ? ICON_ACTIVE : ICON_INACTIVE}
                  />
                </View>
              </Pressable>
            );
          })}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Quick add"
          onPress={onFabPress}
          style={styles.fab}
        >
          <PlusIcon size={28} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  pill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingVertical: 10,
    paddingHorizontal: 6,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 12,
  },
  tabHit: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircleActive: {
    backgroundColor: "#0F172A",
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: FAB_GREEN,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 10,
  },
});
