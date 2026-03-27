import { Platform } from "react-native";

/**
 * RN Web warns that shadow* props are deprecated; use `boxShadow` there.
 * iOS: shadowColor / shadowOffset / shadowOpacity / shadowRadius
 * Android: elevation (Material)
 */
function platformCard({ web, ios, androidElevation }) {
  if (Platform.OS === "web") {
    return { boxShadow: web };
  }
  if (Platform.OS === "android") {
    return { elevation: androidElevation };
  }
  return ios;
}

export const shadows = {
  statCard: platformCard({
    web: "0px 4px 8px rgba(15, 23, 42, 0.06)",
    ios: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
    },
    androidElevation: 2,
  }),

  floatingTabPill: platformCard({
    web: "0px 8px 20px rgba(0, 0, 0, 0.12)",
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.12,
      shadowRadius: 20,
    },
    androidElevation: 12,
  }),

  floatingFab: platformCard({
    web: "0px 6px 12px rgba(0, 0, 0, 0.18)",
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.18,
      shadowRadius: 12,
    },
    androidElevation: 10,
  }),

  loginCard: platformCard({
    web: "0px 2px 12px rgba(0, 0, 0, 0.06)",
    ios: {
      shadowColor: "#000000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 12,
    },
    androidElevation: 2,
  }),

  profileRing: platformCard({
    web: "0px 3px 8px rgba(15, 23, 42, 0.1)",
    ios: {
      shadowColor: "#0F172A",
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
    },
    androidElevation: 4,
  }),
};
