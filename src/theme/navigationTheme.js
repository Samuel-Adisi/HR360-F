import { DefaultTheme } from "@react-navigation/native";

/** Always light — do not follow system dark mode. */
export const BRAND_TEAL = "#0F766E";
export const SCREEN_BG = "#F8FAFC";

export const AppNavigationTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: BRAND_TEAL,
    background: SCREEN_BG,
    card: "#FFFFFF",
    text: "#0F172A",
    border: "#E2E8F0",
    notification: BRAND_TEAL,
  },
};
