import { fontSans } from "./fonts";

export const lightStackScreenOptions = {
  headerShown: true,
  headerBackTitle: "Back",
  headerStyle: { backgroundColor: "#FFFFFF" },
  headerTintColor: "#0F172A",
  headerTitleStyle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#0F172A",
    ...(fontSans ? { fontFamily: fontSans } : {}),
  },
  headerShadowVisible: false,
  contentStyle: { backgroundColor: "#F8FAFC", paddingBottom: 100 },
};
