import { Platform } from "react-native";

/**
 * Mirrors modern CSS font stacks (Tailwind / system-ui): luxury, professional, no bundled fonts.
 * - Web: full stacks (comma-separated) — RN Web passes them through to the browser.
 * - iOS: Sans = SF Pro (omit fontFamily). Serif = Georgia. Mono = Menlo.
 * - Android: Generic families → Roboto / Noto Serif / monospace.
 */

export const fontSans =
  Platform.OS === "web"
    ? [
        "ui-sans-serif",
        "system-ui",
        "sans-serif",
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
        '"Noto Color Emoji"',
      ].join(", ")
    : Platform.OS === "android"
      ? "sans-serif"
      : undefined;

/** Editorial / headline serif — web stack matches CSS `ui-serif`; native uses humanist serifs. */
export const fontSerif =
  Platform.OS === "web"
    ? [
        "ui-serif",
        "Georgia",
        "Cambria",
        '"Times New Roman"',
        "Times",
        "serif",
      ].join(", ")
    : Platform.OS === "android"
      ? "serif"
      : "Georgia";

export const fontMono =
  Platform.OS === "web"
    ? [
        "ui-monospace",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        '"Liberation Mono"',
        '"Courier New"',
        "monospace",
      ].join(", ")
    : Platform.OS === "android"
      ? "monospace"
      : "Menlo";

/** Body / UI copy — system sans everywhere appropriate */
export function sansText(extra = {}) {
  return fontSans ? { fontFamily: fontSans, ...extra } : extra;
}

/** Headlines, hero titles, brand wordmarks */
export function serifText(extra = {}) {
  return { fontFamily: fontSerif, ...extra };
}

/** Figures, codes, ID fields */
export function monoText(extra = {}) {
  return fontMono ? { fontFamily: fontMono, ...extra } : extra;
}

/** Stack header titles — prefers UI sans stack */
export const headerTitleStyle = {
  ...sansText(),
  fontWeight: "600",
  fontSize: 17,
};
