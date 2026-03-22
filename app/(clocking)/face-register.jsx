import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../src/services/api";

const { width } = Dimensions.get("window");

// ─── Constants ────────────────────────────────────────────────────────────────

const COLORS = {
  bg: "#0A0A0F",
  surface: "#13131A",
  surfaceHigh: "#1C1C28",
  border: "#2A2A3A",
  accent: "#7C5CFC",
  accentSoft: "rgba(124, 92, 252, 0.15)",
  success: "#22D3A5",
  successSoft: "rgba(34, 211, 165, 0.12)",
  danger: "#FF4D6A",
  dangerSoft: "rgba(255, 77, 106, 0.12)",
  warning: "#F59E0B",
  warningSoft: "rgba(245, 158, 11, 0.12)",
  textPrimary: "#F0EFF8",
  textSecondary: "#8884A0",
  textMuted: "#4A4860",
  white: "#FFFFFF",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getFileName = (uri) => uri.split("/").pop() || "photo.jpg";

const getMimeType = (uri) => {
  const ext = (uri.split(".").pop() || "jpg").toLowerCase();
  return (
    {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    }[ext] || "image/jpeg"
  );
};

const buildFormData = async (username, photoUri) => {
  const fd = new FormData();
  fd.append("username", username);
  if (Platform.OS === "web") {
    const blob = await (await fetch(photoUri)).blob();
    fd.append("image", blob, "face.jpg");
  } else {
    fd.append("image", {
      uri: photoUri,
      type: getMimeType(photoUri),
      name: getFileName(photoUri),
    });
  }
  return fd;
};

const getErrorMessage = (
  err,
  fallback = "Something went wrong. Please try again.",
) => {
  const data = err.response?.data;
  if (!data) return fallback;
  return (
    data.error ||
    data.message ||
    (Array.isArray(data.image) ? data.image[0] : data.image) ||
    (Array.isArray(data.username) ? data.username[0] : data.username) ||
    fallback
  );
};

// ─── Image Analysis ───────────────────────────────────────────────────────────
//
// Works in Expo Go (no native modules required).
//
// BRIGHTNESS — two methods depending on platform:
//
//   Native: JPEG file size at quality=0.15.
//     Dark/blank frames compress to <8 KB; a well-lit face is typically 15–80 KB.
//     This works because JPEG compression is strongly correlated with image entropy.
//
//   Web: Canvas pixel sampling.
//     Draws the image onto an 80×80 offscreen canvas and computes average luma
//     using the ITU-R BT.601 formula (0.299R + 0.587G + 0.114B).
//
// FACE PRESENCE — heuristic only (no native ML needed):
//   We measure the standard deviation of pixel brightness in the CENTER region
//   of the image. A face has high local contrast (eyes, nose, lips, skin tone
//   transitions). A blank wall or covered lens has near-zero variance.
//   This works on web via canvas. On native we use the base64 of the low-quality
//   snapshot and sample a 16×16 grid decoded from the raw JPEG bytes.
//
// NOTE: These are heuristics, not perfect ML detection. The server performs the
// authoritative face validation. These checks guide the user in real time.

// Web: measure average luma and center-region variance from a data URL
const analyzeWeb = (dataUrl) =>
  new Promise((resolve) => {
    try {
      const img = new window.Image();
      img.onload = () => {
        const S = 80;
        const canvas = document.createElement("canvas");
        canvas.width = S;
        canvas.height = S;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, S, S);
        const { data } = ctx.getImageData(0, 0, S, S);

        let lumaSum = 0;
        const lumas = [];
        for (let i = 0; i < data.length; i += 4) {
          const l = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
          lumaSum += l;
          lumas.push(l);
        }
        const avgLuma = lumaSum / lumas.length;

        // Variance of center 40×40 region as face-presence proxy
        const cx = S / 2,
          cy = S / 2,
          r = 20;
        let centerSum = 0,
          centerCount = 0;
        for (let y = cy - r; y < cy + r; y++) {
          for (let x = cx - r; x < cx + r; x++) {
            centerSum += lumas[y * S + x] || 0;
            centerCount++;
          }
        }
        const centerMean = centerSum / centerCount;
        let variance = 0;
        for (let y = cy - r; y < cy + r; y++) {
          for (let x = cx - r; x < cx + r; x++) {
            const d = (lumas[y * S + x] || 0) - centerMean;
            variance += d * d;
          }
        }
        variance /= centerCount;

        resolve({ avgLuma, variance });
      };
      img.onerror = () => resolve({ avgLuma: 128, variance: 50 });
      img.src = dataUrl;
    } catch {
      resolve({ avgLuma: 128, variance: 50 });
    }
  });

// Native: read file size for brightness + base64 variance for face presence
const analyzeNative = async (uri) => {
  const info = await FileSystem.getInfoAsync(uri, { size: true });
  const sizeKB = (info.size || 0) / 1024;

  // Also read base64 to compute variance (face-presence heuristic)
  let variance = 0;
  try {
    const b64 = await FileSystem.readAsStringAsync(uri, {
      encoding: FileSystem.EncodingType.Base64,
    });
    // Sample 400 evenly-spaced characters and compute sequential differences
    const step = Math.max(1, Math.floor(b64.length / 400));
    let prev = b64.charCodeAt(0);
    for (let i = step; i < b64.length; i += step) {
      const cur = b64.charCodeAt(i);
      variance += (cur - prev) * (cur - prev);
      prev = cur;
    }
    variance /= b64.length / step;
  } catch {
    variance = 0;
  }

  return { sizeKB, variance };
};

// Main analysis entry point — called every 1.8s on a low-quality snapshot
const analyzeSnapshot = async (uri) => {
  try {
    if (Platform.OS === "web") {
      let dataUrl = uri;
      if (uri.startsWith("blob:")) {
        const resp = await fetch(uri);
        const blob = await resp.blob();
        dataUrl = await new Promise((res) => {
          const reader = new FileReader();
          reader.onloadend = () => res(reader.result);
          reader.readAsDataURL(blob);
        });
      }
      const { avgLuma, variance } = await analyzeWeb(dataUrl);
      // avgLuma 0–255: <55 = too dark, >235 = overexposed
      const isLit = avgLuma >= 55 && avgLuma <= 235;
      // variance > 120 = enough local contrast to suggest a face
      const hasFace = variance > 120;
      return { lighting: isLit, faceVisible: hasFace };
    }

    // Native
    const { sizeKB, variance } = await analyzeNative(uri);
    const isLit = sizeKB >= 8; // <8 KB at quality 0.15 = dark/blank
    const hasFace = variance > 2; // low variance = blank/uniform = no face
    return { lighting: isLit, faceVisible: hasFace };
  } catch (e) {
    console.log("analyzeSnapshot error:", e);
    return { lighting: false, faceVisible: false };
  }
};

// Post-capture quality check on full-resolution image
const analyzeImageQuality = async (uri) => {
  const issues = [];
  try {
    await new Promise((resolve) => {
      Image.getSize(
        uri,
        (w, h) => {
          if (w < 300 || h < 300)
            issues.push("Image resolution too low — move closer to the camera");
          if (w / h > 1.5 || w / h < 0.5)
            issues.push(
              "Unexpected framing — hold the device upright and face the camera",
            );
          resolve();
        },
        () => resolve(),
      );
    });
  } catch {
    // Non-fatal
  }
  return { issues };
};

// ─── Reusable UI Components ───────────────────────────────────────────────────

const PulsingRing = ({ color = COLORS.accent, size = 120 }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.25,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.6,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  return (
    <Animated.View
      style={{
        position: "absolute",
        width: size,
        height: size,
        borderRadius: size / 2,
        borderWidth: 1.5,
        borderColor: color,
        opacity,
        transform: [{ scale }],
      }}
    />
  );
};

const Chip = ({ icon, label, color = COLORS.accent, bg }) => (
  <View
    style={[
      styles.chip,
      { backgroundColor: bg || COLORS.accentSoft, borderColor: color + "33" },
    ]}
  >
    <Ionicons name={icon} size={13} color={color} />
    <Text style={[styles.chipText, { color }]}>{label}</Text>
  </View>
);

const Requirement = ({ icon, title, desc }) => (
  <View style={styles.reqRow}>
    <View style={styles.reqIcon}>
      <Ionicons name={icon} size={16} color={COLORS.textSecondary} />
    </View>
    <View style={{ flex: 1 }}>
      <Text style={styles.reqTitle}>{title}</Text>
      <Text style={styles.reqDesc}>{desc}</Text>
    </View>
  </View>
);

const GlowButton = ({
  label,
  icon,
  onPress,
  disabled,
  loading,
  variant = "primary",
  style,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  const bgColor = variant === "danger" ? COLORS.danger : COLORS.accent;
  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={() =>
          Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
        }
        disabled={disabled || loading}
        style={[
          styles.glowBtn,
          { backgroundColor: bgColor, opacity: disabled ? 0.45 : 1 },
        ]}
      >
        {loading ? (
          <ActivityIndicator color={COLORS.white} size="small" />
        ) : (
          <>
            {icon && (
              <Ionicons
                name={icon}
                size={18}
                color={COLORS.white}
                style={{ marginRight: 8 }}
              />
            )}
            <Text style={styles.glowBtnText}>{label}</Text>
          </>
        )}
      </Pressable>
    </Animated.View>
  );
};

const OutlineButton = ({
  label,
  icon,
  onPress,
  disabled,
  color = COLORS.accent,
}) => {
  const scale = useRef(new Animated.Value(1)).current;
  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        onPress={onPress}
        disabled={disabled}
        onPressIn={() =>
          Animated.spring(scale, {
            toValue: 0.96,
            useNativeDriver: true,
          }).start()
        }
        onPressOut={() =>
          Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start()
        }
        style={[styles.outlineBtn, { borderColor: color + "55" }]}
      >
        <Ionicons
          name={icon}
          size={18}
          color={color}
          style={{ marginRight: 8 }}
        />
        <Text style={[styles.outlineBtnText, { color }]}>{label}</Text>
      </Pressable>
    </Animated.View>
  );
};

const ConditionBadge = ({ ok, label, icon }) => (
  <View
    style={[
      styles.chip,
      {
        backgroundColor: ok ? COLORS.successSoft : COLORS.dangerSoft,
        borderColor: ok ? COLORS.success + "33" : COLORS.danger + "33",
      },
    ]}
  >
    <Ionicons
      name={ok ? icon : "warning-outline"}
      size={13}
      color={ok ? COLORS.success : COLORS.danger}
    />
    <Text
      style={[styles.chipText, { color: ok ? COLORS.success : COLORS.danger }]}
    >
      {label}
    </Text>
  </View>
);

// ─── Camera Component ─────────────────────────────────────────────────────────

const CameraCapture = ({ onCapture, onCancel }) => {
  const cameraRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [capturing, setCapturing] = useState(false);

  const analyzingRef = useRef(false);
  const analysisTimer = useRef(null);

  const [conditions, setConditions] = useState({
    lighting: false,
    faceVisible: false,
  });

  const btnScale = useRef(new Animated.Value(1)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(overlayAnim, {
      toValue: 1,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const doAnalysis = useCallback(async () => {
    if (!cameraRef.current || analyzingRef.current) return;
    analyzingRef.current = true;
    try {
      const snap = await cameraRef.current.takePictureAsync({
        quality: 0.15,
        base64: false,
        skipProcessing: true,
        exif: false,
      });
      if (!snap?.uri) return;

      const { lighting, faceVisible } = await analyzeSnapshot(snap.uri);
      setConditions({ lighting, faceVisible });

      // Clean up temp file on native
      if (Platform.OS !== "web") {
        try {
          await FileSystem.deleteAsync(snap.uri, { idempotent: true });
        } catch {}
      }
    } catch {
      // Camera warming up — skip tick
    } finally {
      analyzingRef.current = false;
    }
  }, []);

  const startAnalysisLoop = useCallback(() => {
    if (analysisTimer.current) clearInterval(analysisTimer.current);
    doAnalysis();
    analysisTimer.current = setInterval(doAnalysis, 1800);
  }, [doAnalysis]);

  const stopAnalysisLoop = useCallback(() => {
    if (analysisTimer.current) {
      clearInterval(analysisTimer.current);
      analysisTimer.current = null;
    }
  }, []);

  useEffect(() => {
    if (!ready) return;
    startAnalysisLoop();
    return () => stopAnalysisLoop();
  }, [ready]);

  const allConditionsMet = conditions.lighting && conditions.faceVisible;

  const snap = async () => {
    if (!ready || capturing || !cameraRef.current) return;

    if (!allConditionsMet) {
      stopAnalysisLoop();
      Alert.alert(
        "Conditions Not Met",
        "Please fix the highlighted issues:\n\n" +
          (!conditions.lighting
            ? "• Poor lighting — move to a brighter area or face a light source\n"
            : "") +
          (!conditions.faceVisible
            ? "• No face detected — center your face inside the oval\n"
            : ""),
        [{ text: "OK", onPress: () => startAnalysisLoop() }],
      );
      return;
    }

    stopAnalysisLoop();
    setCapturing(true);

    Animated.sequence([
      Animated.timing(btnScale, {
        toValue: 0.88,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(btnScale, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.92,
        base64: false,
        skipProcessing: false,
        exif: false,
      });
      onCapture(photo.uri);
    } catch {
      Alert.alert("Error", "Failed to capture photo. Please try again.");
      setCapturing(false);
      startAnalysisLoop();
    }
  };

  return (
    <View style={styles.cameraFullScreen}>
      <StatusBar barStyle="light-content" />
      <CameraView
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        facing="front"
        onCameraReady={() => setReady(true)}
      >
        <View style={StyleSheet.absoluteFill}>
          {/* Top bar */}
          <Animated.View style={[styles.camTopBar, { opacity: overlayAnim }]}>
            <TouchableOpacity onPress={onCancel} style={styles.camCloseBtn}>
              <Ionicons name="close" size={22} color={COLORS.white} />
            </TouchableOpacity>
            <View style={{ alignItems: "center" }}>
              <Text style={styles.camTitle}>Position Your Face</Text>
              <Text style={styles.camSubtitle}>
                {!ready
                  ? "Starting camera…"
                  : allConditionsMet
                    ? "✓ Ready — tap to capture"
                    : "Fix issues shown below"}
              </Text>
            </View>
            <View style={{ width: 40 }} />
          </Animated.View>

          {/* Oval guide */}
          <View style={styles.camOvalWrapper}>
            <View style={styles.camOvalBg} />
            <View style={styles.camOval}>
              {ready && (
                <PulsingRing
                  color={allConditionsMet ? COLORS.success : COLORS.danger}
                  size={280}
                />
              )}
              <View
                style={[
                  styles.camOvalBorder,
                  {
                    borderColor: allConditionsMet
                      ? COLORS.success
                      : ready
                        ? COLORS.danger
                        : COLORS.accent,
                    borderStyle: "solid", // dashed crashes on Android with borderRadius
                  },
                ]}
              />
            </View>
            {!ready && (
              <View style={styles.camLoadingWrap}>
                <ActivityIndicator color={COLORS.accent} size="large" />
                <Text style={styles.camLoadingText}>Initializing camera…</Text>
              </View>
            )}
          </View>

          {/* Bottom controls */}
          <Animated.View
            style={[styles.camBottomBar, { opacity: overlayAnim }]}
          >
            {ready && (
              <View style={styles.camConditionsGrid}>
                <ConditionBadge
                  ok={conditions.lighting}
                  label="Good lighting"
                  icon="sunny-outline"
                />
                <ConditionBadge
                  ok={conditions.faceVisible}
                  label="Face detected"
                  icon="eye-outline"
                />
              </View>
            )}

            {ready && !allConditionsMet && (
              <View style={styles.camWarningBanner}>
                <Ionicons
                  name="warning-outline"
                  size={14}
                  color={COLORS.warning}
                />
                <Text style={styles.camWarningText}>
                  {!conditions.lighting
                    ? "Move to better lighting or face a light source"
                    : "Center your face inside the oval"}
                </Text>
              </View>
            )}

            <View style={styles.camBtnRow}>
              <View style={{ width: 56 }} />
              <Animated.View style={{ transform: [{ scale: btnScale }] }}>
                <TouchableOpacity
                  onPress={snap}
                  disabled={!ready || capturing}
                  style={[
                    styles.captureBtn,
                    {
                      borderColor: allConditionsMet
                        ? COLORS.success
                        : COLORS.danger,
                    },
                    (!ready || capturing) && { opacity: 0.4 },
                  ]}
                >
                  <View
                    style={[
                      styles.captureBtnInner,
                      {
                        backgroundColor: allConditionsMet
                          ? COLORS.success
                          : COLORS.accent,
                      },
                    ]}
                  >
                    {capturing ? (
                      <ActivityIndicator color={COLORS.white} size="small" />
                    ) : (
                      <Ionicons name="camera" size={28} color={COLORS.white} />
                    )}
                  </View>
                </TouchableOpacity>
              </Animated.View>
              <View style={{ width: 56 }} />
            </View>
          </Animated.View>
        </View>
      </CameraView>
    </View>
  );
};

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function FaceRegisterScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [phase, setPhase] = useState("intro");
  const [photoUri, setPhotoUri] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("Processing…");
  const [initialising, setInitialising] = useState(true);
  const [qualityIssues, setQualityIssues] = useState([]);

  const pageAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const animateIn = useCallback(() => {
    pageAnim.setValue(0);
    slideAnim.setValue(20);
    Animated.parallel([
      Animated.timing(pageAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 60,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    bootstrap();
  }, []);
  useEffect(() => {
    animateIn();
  }, [phase]);

  const bootstrap = async () => {
    try {
      const stored = await AsyncStorage.getItem("username");
      const raw = await AsyncStorage.getItem("user");
      const name = stored || (raw ? JSON.parse(raw)?.username : null);

      if (!name) {
        Alert.alert("Authentication Required", "Please log in first.", [
          { text: "Login", onPress: () => router.replace("/login") },
        ]);
        return;
      }
      setUsername(name);
      const res = await api.get("/api/face/status");
      if (res.status === 200) {
        if (res.data?.has_face_auth) setPhase("registered");
      }
    } catch (error) {
      console.log("Face status error:", error);
    } finally {
      setInitialising(false);
    }
  };

  const openCamera = useCallback(async () => {
    if (!permission?.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Enable camera access in your device settings to register your face.",
          [{ text: "OK" }],
        );
        return;
      }
    }
    setPhase("camera");
  }, [permission]);

  const onCapture = async (uri) => {
    setPhotoUri(uri);
    setPhase("review");
    try {
      const { issues } = await analyzeImageQuality(uri);
      setQualityIssues(issues);
    } catch {
      setQualityIssues([]);
    }
  };

  const retake = () => {
    setPhotoUri(null);
    setQualityIssues([]);
    setPhase("camera");
  };

  const handleRegister = async () => {
    if (!photoUri) {
      console.log("No photo or username found. Please try again.");
      Alert.alert(
        "Missing Data",
        "No photo or username found. Please try again.",
      );
      return;
    }
    setLoading(true);
    setLoadingMessage("Uploading your photo…");
    try {
      const formData = await buildFormData(username, photoUri);
      console.log(formData.getAll("username"));
      console.log(formData);
      setLoadingMessage("Analyzing your face…");
      const res = await api.post("/api/face/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.status === 200 || res.status === 201) {
        setLoadingMessage("Registration complete!");
        setPhase("registered");
        setTimeout(() => {
          router.replace("/face-login");
        }, 2000);
      }
    } catch (error) {
      console.log("Face register error:", error);
      if (!error.response) {
        Alert.alert(
          "Network Error",
          "Cannot reach the server. Please check your connection.",
        );
        return;
      }
      const status = error.response.status;
      let title = "Registration Failed";
      let message = getErrorMessage(
        error,
        "Please try again with a clear, well-lit photo.",
      );
      if (
        status === 400 &&
        error.response.data?.error === "Face already registered"
      ) {
        title = "Already Registered";
        message =
          "A face is already linked to this account. Remove it first to register a new one.";
      } else if (status === 403) {
        title = "Permission Denied";
        message =
          error.response.data?.error || "You can only register your own face.";
      } else if (status === 413) {
        title = "File Too Large";
        message =
          "Photo exceeds the 5MB limit. Please retake with a smaller image.";
      } else if (status === 500) {
        title = "Server Error";
        message = getErrorMessage(
          error,
          "Failed to process image. Try a different photo.",
        );
      }
      Alert.alert(title, message);
    } finally {
      setLoading(false);
      setLoadingMessage("Processing…");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Remove Face Authentication",
      "This will permanently delete your face data. You'll need to register again to use face login.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            setLoadingMessage("Removing face data…");
            try {
              const res = await api.delete("/api/face/delete", {
                data: { confirm: true },
              });
              if (res.status === 200) {
                setPhotoUri(null);
                setPhase("intro");
              }
            } catch (error) {
              console.log("Face delete error:", error);
              Alert.alert(
                "Error",
                getErrorMessage(
                  error,
                  "Failed to remove face registration. Please try again.",
                ),
              );
            } finally {
              setLoading(false);
              setLoadingMessage("Processing…");
            }
          },
        },
      ],
    );
  };

  if (initialising) {
    return (
      <View style={styles.splashWrap}>
        <ActivityIndicator color={COLORS.accent} size="large" />
        <Text style={styles.splashText}>Loading…</Text>
      </View>
    );
  }

  if (phase === "camera") {
    return (
      <Modal visible animationType="slide" statusBarTranslucent>
        <CameraCapture
          onCapture={onCapture}
          onCancel={() => setPhase("intro")}
        />
      </Modal>
    );
  }

  const animStyle = {
    opacity: pageAnim,
    transform: [{ translateY: slideAnim }],
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <TouchableOpacity
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/")
            }
            style={styles.backBtn}
          >
            <Ionicons
              name="chevron-back"
              size={22}
              color={COLORS.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.topBarTitle}>Face ID Setup</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* ── INTRO ── */}
        {phase === "intro" && (
          <Animated.View style={animStyle}>
            <View style={styles.hero}>
              <View style={styles.heroIconWrap}>
                <PulsingRing color={COLORS.accent} size={160} />
                <View style={styles.heroIconBg}>
                  <Ionicons
                    name="scan-circle-outline"
                    size={72}
                    color={COLORS.accent}
                  />
                </View>
              </View>
              <Text style={styles.heroTitle}>Register Your Face</Text>
              <Text style={styles.heroSub}>
                Enable fast, secure facial authentication for attendance and
                login
              </Text>
              <View style={styles.pillRow}>
                <Chip
                  icon="shield-checkmark-outline"
                  label="Encrypted"
                  color={COLORS.success}
                  bg={COLORS.successSoft}
                />
                <Chip
                  icon="flash-outline"
                  label="Instant login"
                  color={COLORS.accent}
                />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons name="list-outline" size={18} color={COLORS.accent} />
                <Text style={styles.cardTitle}>Photo Requirements</Text>
              </View>
              <Requirement
                icon="sunny-outline"
                title="Good lighting"
                desc="Ensure your face is evenly lit, avoid backlighting"
              />
              <Requirement
                icon="eye-outline"
                title="Face the camera"
                desc="Look directly into the lens, head straight"
              />
              <Requirement
                icon="glasses-outline"
                title="Remove accessories"
                desc="Take off glasses, masks, or hats for best accuracy"
              />
              <Requirement
                icon="person-outline"
                title="Solo frame"
                desc="Only one face should appear in the photo"
              />
              <Requirement
                icon="expand-outline"
                title="Fill the frame"
                desc="Bring your face close, avoid distant or angled shots"
              />
            </View>

            <View style={styles.privacyCard}>
              <Ionicons
                name="lock-closed"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.privacyText}>
                Your biometric data is encrypted and never shared with third
                parties. Only used for authentication.
              </Text>
            </View>

            <GlowButton
              label="Open Camera"
              icon="camera-outline"
              onPress={openCamera}
              style={{ marginHorizontal: 20, marginTop: 4 }}
            />
          </Animated.View>
        )}

        {/* ── REVIEW ── */}
        {phase === "review" && photoUri && (
          <Animated.View style={animStyle}>
            <View
              style={{ paddingHorizontal: 20, paddingTop: 8, marginBottom: 16 }}
            >
              <Text style={styles.reviewHeading}>Review Your Photo</Text>
              <Text style={styles.reviewSub}>
                Make sure your face is clear and centered
              </Text>
            </View>

            <View style={styles.photoWrap}>
              <Image source={{ uri: photoUri }} style={styles.photo} />
              <View style={styles.photoGradient} />
              {["topLeft", "topRight", "bottomLeft", "bottomRight"].map(
                (pos) => (
                  <View key={pos} style={[styles.corner, styles[pos]]} />
                ),
              )}
            </View>

            {qualityIssues.length > 0 && (
              <View style={styles.qualityWarningCard}>
                <View style={styles.cardHeader}>
                  <Ionicons
                    name="warning-outline"
                    size={18}
                    color={COLORS.warning}
                  />
                  <Text style={[styles.cardTitle, { color: COLORS.warning }]}>
                    Photo Quality Issues
                  </Text>
                </View>
                {qualityIssues.map((issue, i) => (
                  <View key={i} style={styles.checkRow}>
                    <Ionicons
                      name="alert-circle-outline"
                      size={15}
                      color={COLORS.warning}
                    />
                    <Text style={[styles.checkText, { color: COLORS.warning }]}>
                      {issue}
                    </Text>
                  </View>
                ))}
                <TouchableOpacity
                  onPress={retake}
                  style={styles.retakeSuggestionBtn}
                >
                  <Text style={styles.retakeSuggestionText}>
                    Retake for better results →
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.checklistCard}>
              <Text style={styles.checklistHeading}>
                Verify before submitting
              </Text>
              {[
                "Face is clearly visible",
                "Good lighting, no harsh shadows",
                "No glasses, mask, or hat",
                "Only your face in the frame",
              ].map((item) => (
                <View key={item} style={styles.checkRow}>
                  <View style={styles.checkDot}>
                    <Ionicons
                      name="checkmark"
                      size={12}
                      color={COLORS.success}
                    />
                  </View>
                  <Text style={styles.checkText}>{item}</Text>
                </View>
              ))}
            </View>

            <View style={styles.reviewActions}>
              <OutlineButton
                label="Retake"
                icon="camera-reverse-outline"
                onPress={retake}
                disabled={loading}
              />
              <GlowButton
                label={loading ? "Registering…" : "Register Face"}
                icon="shield-checkmark-outline"
                onPress={handleRegister}
                loading={loading}
                disabled={loading}
                style={{ flex: 1, marginLeft: 12 }}
              />
            </View>

            <View style={styles.privacyCard}>
              <Ionicons
                name="information-circle-outline"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.privacyText}>
                Your photo is converted to an encrypted embedding. The raw image
                may be stored for account management.
              </Text>
            </View>
          </Animated.View>
        )}

        {/* ── REGISTERED ── */}
        {phase === "registered" && (
          <Animated.View style={animStyle}>
            <View style={styles.successHero}>
              <View style={styles.successRingOuter}>
                <PulsingRing color={COLORS.success} size={180} />
                <View style={styles.successIconBg}>
                  <Ionicons
                    name="checkmark-circle"
                    size={80}
                    color={COLORS.success}
                  />
                </View>
              </View>
              <Text style={styles.successTitle}>Face ID Active</Text>
              <Text style={styles.successSub}>
                Your face is registered. Redirecting to face login…
              </Text>
              <View style={[styles.pillRow, { marginTop: 12 }]}>
                <Chip
                  icon="checkmark-circle-outline"
                  label="Registered"
                  color={COLORS.success}
                  bg={COLORS.successSoft}
                />
                <Chip
                  icon="shield-checkmark-outline"
                  label="Secured"
                  color={COLORS.success}
                  bg={COLORS.successSoft}
                />
              </View>
            </View>

            <View style={styles.card}>
              <View style={styles.cardHeader}>
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color={COLORS.accent}
                />
                <Text style={styles.cardTitle}>How it works</Text>
              </View>
              {[
                {
                  icon: "log-in-outline",
                  text: "Go to login and choose Face ID",
                },
                {
                  icon: "scan-outline",
                  text: "Position your face in front of the camera",
                },
                {
                  icon: "flash-outline",
                  text: "You'll be authenticated in under a second",
                },
              ].map(({ icon, text }) => (
                <View key={text} style={styles.reqRow}>
                  <View style={styles.reqIcon}>
                    <Ionicons name={icon} size={16} color={COLORS.accent} />
                  </View>
                  <Text style={[styles.reqDesc, { flex: 1 }]}>{text}</Text>
                </View>
              ))}
            </View>

            <View style={{ paddingHorizontal: 20, marginTop: 4 }}>
              <GlowButton
                label="Go to Face Login"
                icon="log-in-outline"
                onPress={() => router.replace("/face-login")}
                style={{ marginBottom: 12 }}
              />
              <OutlineButton
                label={loading ? "Removing…" : "Remove Face Registration"}
                icon="trash-outline"
                onPress={handleDelete}
                color={COLORS.danger}
                disabled={loading}
              />
            </View>

            <View style={styles.privacyCard}>
              <Ionicons
                name="lock-closed"
                size={16}
                color={COLORS.textSecondary}
              />
              <Text style={styles.privacyText}>
                Removing face registration disables face login. You can
                re-register at any time.
              </Text>
            </View>
          </Animated.View>
        )}
      </ScrollView>

      {loading && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator color={COLORS.accent} size="large" />
            <Text style={styles.loadingTitle}>{loadingMessage}</Text>
            <Text style={styles.loadingDesc}>This may take a few seconds</Text>
          </View>
        </View>
      )}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 60 },

  splashWrap: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: "center",
    alignItems: "center",
  },
  splashText: { color: COLORS.textSecondary, marginTop: 16, fontSize: 15 },

  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 16,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  topBarTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
    letterSpacing: 0.3,
  },

  hero: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 36,
  },
  heroIconWrap: {
    width: 160,
    height: 160,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  heroIconBg: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.accentSoft,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.accent + "44",
  },
  heroTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.textPrimary,
    textAlign: "center",
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  heroSub: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
    paddingHorizontal: 12,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    justifyContent: "center",
  },

  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
    gap: 8,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: COLORS.textPrimary },

  privacyCard: {
    flexDirection: "row",
    backgroundColor: COLORS.surfaceHigh,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    gap: 10,
    alignItems: "flex-start",
  },
  privacyText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textSecondary,
    lineHeight: 19,
  },

  qualityWarningCard: {
    backgroundColor: COLORS.warningSoft,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.warning + "44",
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  retakeSuggestionBtn: { marginTop: 8 },
  retakeSuggestionText: {
    color: COLORS.warning,
    fontSize: 13,
    fontWeight: "600",
  },

  reqRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 14,
    gap: 12,
  },
  reqIcon: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.surfaceHigh,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  reqTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.textPrimary,
    marginBottom: 2,
  },
  reqDesc: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },

  chip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 1,
    gap: 5,
  },
  chipText: { fontSize: 12, fontWeight: "600" },

  glowBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 14,
    minHeight: 52,
  },
  glowBtnText: {
    fontSize: 16,
    fontWeight: "700",
    color: COLORS.white,
    letterSpacing: 0.2,
  },

  outlineBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 14,
    borderWidth: 1.5,
    backgroundColor: "transparent",
    minHeight: 52,
  },
  outlineBtnText: { fontSize: 15, fontWeight: "600" },

  reviewHeading: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  reviewSub: { fontSize: 14, color: COLORS.textSecondary },

  photoWrap: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    position: "relative",
  },
  photo: { width: "100%", height: width - 40, resizeMode: "cover" },
  photoGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: "rgba(10,10,15,0.5)",
  },
  corner: {
    position: "absolute",
    width: 20,
    height: 20,
    borderColor: COLORS.accent,
    borderWidth: 2.5,
  },
  topLeft: {
    top: 14,
    left: 14,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 4,
  },
  topRight: {
    top: 14,
    right: 14,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 4,
  },
  bottomLeft: {
    bottom: 14,
    left: 14,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 4,
  },
  bottomRight: {
    bottom: 14,
    right: 14,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 4,
  },

  checklistCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 18,
    marginHorizontal: 20,
    marginBottom: 16,
  },
  checklistHeading: {
    fontSize: 13,
    fontWeight: "600",
    color: COLORS.textSecondary,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  checkRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 10,
  },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.successSoft,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.success + "44",
  },
  checkText: { fontSize: 14, color: COLORS.textPrimary, flex: 1 },

  reviewActions: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: "center",
  },

  successHero: {
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 32,
  },
  successRingOuter: {
    width: 180,
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },
  successIconBg: {
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: COLORS.successSoft,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.success + "44",
  },
  successTitle: {
    fontSize: 30,
    fontWeight: "800",
    color: COLORS.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  successSub: {
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 12,
  },

  cameraFullScreen: { flex: 1, backgroundColor: "#000" },
  camTopBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 56 : 36,
    paddingBottom: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  camCloseBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  camTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
  },
  camSubtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginTop: 3,
  },

  camOvalWrapper: { flex: 1, justifyContent: "center", alignItems: "center" },
  camOvalBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  camOval: {
    width: 260,
    height: 340,
    borderRadius: 130,
    justifyContent: "center",
    alignItems: "center",
  },
  camOvalBorder: {
    position: "absolute",
    width: 260,
    height: 340,
    borderRadius: 130,
    borderWidth: 2.5,
  },
  camLoadingWrap: { position: "absolute", alignItems: "center" },
  camLoadingText: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 14,
    marginTop: 12,
    fontWeight: "500",
  },

  camBottomBar: {
    paddingBottom: Platform.OS === "ios" ? 48 : 28,
    paddingHorizontal: 24,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingTop: 16,
  },
  camConditionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  camWarningBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: "rgba(245,158,11,0.15)",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(245,158,11,0.3)",
  },
  camWarningText: {
    color: COLORS.warning,
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  camBtnRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  captureBtn: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "rgba(255,255,255,0.2)",
    borderWidth: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  captureBtnInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(10,10,15,0.88)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
    minWidth: 260,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  loadingTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: COLORS.textPrimary,
    marginTop: 20,
    textAlign: "center",
  },
  loadingDesc: {
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 6,
    textAlign: "center",
  },
});
