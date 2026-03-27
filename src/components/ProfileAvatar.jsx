import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { sansText } from "../theme/fonts";
import { shadows } from "../theme/shadows";

function initialsFromLabel(label) {
  if (!label?.trim()) return "?";
  const parts = label.trim().split(/[\s._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  const w = parts[0];
  return w.slice(0, Math.min(2, w.length)).toUpperCase();
}

/**
 * Profile photo with white ring + soft shadow. Image URL optional; otherwise shows initials.
 * @param {string} [uri]
 * @param {string} [nameHint] username or full name for fallback initials
 * @param {number} [outerSize] total diameter including ring (default 56)
 */
export function ProfileAvatar({ uri, nameHint, outerSize = 56, onPress }) {
  const ring = 2;
  const inner = outerSize - ring * 2;
  const innerRadius = inner / 2;
  const initials = initialsFromLabel(nameHint || "");

  const face = uri?.trim() ? (
    <Image
      source={{ uri: uri.trim() }}
      style={{ width: inner, height: inner }}
      contentFit="cover"
      transition={180}
    />
  ) : (
    <View
      style={[
        styles.fallback,
        { width: inner, height: inner, borderRadius: innerRadius },
      ]}
    >
      <Text
        style={[
          sansText(),
          styles.initials,
          { fontSize: Math.round(inner * 0.34) },
        ]}
      >
        {initials}
      </Text>
    </View>
  );

  const bubble = (
    <View
      style={[
        styles.outer,
        {
          width: outerSize,
          height: outerSize,
          borderRadius: outerSize / 2,
        },
      ]}
    >
      <View
        style={[
          styles.clip,
          {
            width: inner,
            height: inner,
            borderRadius: innerRadius,
          },
        ]}
      >
        {face}
      </View>
    </View>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel="Profile and settings"
        style={({ pressed }) => [pressed && styles.pressed]}
      >
        {bubble}
      </Pressable>
    );
  }

  return bubble;
}

const styles = StyleSheet.create({
  outer: {
    backgroundColor: "#FFFFFF",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    ...shadows.profileRing,
  },
  clip: {
    overflow: "hidden",
    backgroundColor: "#F1F5F9",
  },
  fallback: {
    backgroundColor: "#CCFBF1",
    alignItems: "center",
    justifyContent: "center",
  },
  initials: {
    fontWeight: "700",
    color: "#0F766E",
  },
  pressed: {
    opacity: 0.88,
    transform: [{ scale: 0.97 }],
  },
});
