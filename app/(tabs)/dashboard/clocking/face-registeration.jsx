import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../../../src/services/api"; // ← your axios instance

const FaceRegistrationScreen = () => {
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [username, setUsername] = useState("");

  React.useEffect(() => {
    loadUsername();
  }, []);

  const loadUsername = async () => {
    try {
      const storedUsername = await AsyncStorage.getItem("username");
      if (storedUsername) setUsername(storedUsername);
    } catch (error) {
      console.error("Error loading username:", error);
    }
  };

  const handleStartRegistration = async () => {
    if (!permission) {
      Alert.alert("Error", "Camera permissions not available");
      return;
    }
    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access to register your face for attendance tracking.",
          [{ text: "Cancel", style: "cancel" }, { text: "Open Settings" }],
        );
        return;
      }
    }
    setCameraReady(false);
    setShowCamera(true);
  };

  const handleCameraReady = () => {
    console.log("✓ Camera ready");
    setCameraReady(true);
  };

  const takePicture = async () => {
    if (!cameraReady) {
      Alert.alert("Please Wait", "Camera is still initializing...");
      return;
    }
    if (!cameraRef.current) {
      Alert.alert("Error", "Camera not available");
      return;
    }
    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
        skipProcessing: false,
        exif: false,
      });
      console.log("✓ Photo captured:", photo.uri);
      setCapturedPhoto(photo.uri);
      setShowCamera(false);
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Camera Error", "Failed to capture photo. Please try again.");
    }
  };

  const retakePhoto = () => {
    setCapturedPhoto(null);
    setCameraReady(false);
    setShowCamera(true);
  };

  const cancelCamera = () => {
    setShowCamera(false);
    setCameraReady(false);
  };

  // ─── Helper functions ────────────────────────────────────────
  const getFileName = (uri) => {
    const parts = uri.split("/");
    return parts[parts.length - 1] || "photo.jpg";
  };

  const getFileExtension = (uri) => {
    const filename = getFileName(uri);
    const parts = filename.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toLowerCase() : "jpg";
  };

  const getMimeType = (uri) => {
    const ext = getFileExtension(uri);
    const mimeTypes = {
      jpg: "image/jpeg",
      jpeg: "image/jpeg",
      png: "image/png",
      webp: "image/webp",
    };
    return mimeTypes[ext] || "image/jpeg";
  };

  // ─── Build FormData ──────────────────────────────────────────
  const buildFormData = async (photoUri) => {
    const formData = new FormData();
    formData.append("username", username);

    if (Platform.OS === "web") {
      // Web: convert URI to blob
      const response = await fetch(photoUri);
      const blob = await response.blob();
      formData.append("image", blob, "face.jpg");
    } else {
      // Native: append as file object
      formData.append("image", {
        uri: photoUri,
        type: getMimeType(photoUri),
        name: getFileName(photoUri),
      });
    }

    return formData;
  };

  // ─── Main register handler ───────────────────────────────────
  const handleRegister = async () => {
    if (!capturedPhoto) {
      Alert.alert("Error", "Please capture a photo first");
      return;
    }
    if (!username) {
      Alert.alert("Error", "Username not found. Please login again.");
      return;
    }

    setLoading(true);

    try {
      const formData = await buildFormData(capturedPhoto);

      // POST to backend using axios instance
      const response = await api.post("/api/face/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);
      console.log("✓ Registration response:", response.data);

      Alert.alert(
        "Success! 🎉",
        "Your face has been registered successfully. You can now use face recognition for attendance.",
        [
          {
            text: "OK",
            onPress: () => {
              setCapturedPhoto(null);
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            },
          },
        ],
      );
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
      handleRegistrationError(error);
    }
  };

  // ─── Error handler ───────────────────────────────────────────
  // Axios puts the response inside error.response
  const handleRegistrationError = (error) => {
    // Network error (no response at all)
    if (!error.response) {
      Alert.alert(
        "Network Error",
        "Cannot connect to server. Please check:\n\n" +
          "1. Server is running\n" +
          "2. Your device is on the same network\n" +
          "3. Firewall allows connections",
        [{ text: "OK" }],
      );
      return;
    }

    const { status, data } = error.response;
    let title = "Registration Failed";
    let message = "An error occurred. Please try again.";

    switch (status) {
      case 400:
        if (data.error) {
          message = data.error;
        } else if (data.image) {
          message = Array.isArray(data.image) ? data.image[0] : data.image;
        } else if (data.username) {
          message = Array.isArray(data.username)
            ? data.username[0]
            : data.username;
        } else {
          message =
            "Invalid data. Please ensure your photo is clear and meets requirements.";
        }
        break;
      case 401:
        title = "Session Expired";
        message = "Please login again.";
        router.replace("/login");
        break;
      case 403:
        title = "Permission Denied";
        message = data.error || "You can only register your own face.";
        break;
      case 413:
        title = "File Too Large";
        message = "Image file is too large. Please use a smaller photo.";
        break;
      case 500:
        title = "Server Error";
        message =
          data.error ||
          "Server error occurred. Please try again or contact support.";
        break;
      default:
        message = data.error || data.message || "Please try again.";
    }

    Alert.alert(title, message, [{ text: "OK" }]);
  };

  // ─── Render ──────────────────────────────────────────────────
  const renderIntroduction = () => (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.canGoBack() && router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Face Registration</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.heroSection}>
        <View style={styles.faceIconContainer}>
          <Ionicons name="scan-circle-outline" size={80} color="#00D9A5" />
        </View>
        <Text style={styles.title}>Register Your Face</Text>
        <Text style={styles.description}>
          Set up facial recognition for quick and secure attendance tracking
        </Text>
      </View>

      <View style={styles.requirementsCard}>
        <View style={styles.requirementsHeader}>
          <Ionicons name="information-circle" size={24} color="#00D9A5" />
          <Text style={styles.requirementsTitle}>Photo Requirements</Text>
        </View>
        {[
          {
            icon: "sunny-outline",
            text: "Good lighting",
            desc: "Ensure your face is well-lit",
          },
          {
            icon: "person-outline",
            text: "Face the camera",
            desc: "Look directly at the camera",
          },
          {
            icon: "glasses-outline",
            text: "No accessories",
            desc: "Remove glasses, masks, or hats",
          },
          {
            icon: "image-outline",
            text: "Clear background",
            desc: "Stand against a plain background",
          },
        ].map((req, idx) => (
          <View key={idx} style={styles.requirementItem}>
            <Ionicons name={req.icon} size={24} color="#00D9A5" />
            <View style={styles.requirementText}>
              <Text style={styles.requirementTitle}>{req.text}</Text>
              <Text style={styles.requirementDesc}>{req.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.securityNote}>
        <Ionicons name="shield-checkmark-outline" size={20} color="#007AFF" />
        <Text style={styles.securityText}>
          Your photo is encrypted and stored securely. It will only be used for
          attendance verification.
        </Text>
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartRegistration}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={20} color="#fff" />
        <Text style={styles.startButtonText}>Open Camera</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderReview = () => (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCapturedPhoto(null)}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Photo</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Verify Your Photo</Text>
        <Text style={styles.reviewSubtitle}>
          Make sure your face is clearly visible
        </Text>

        <View style={styles.photoContainer}>
          <Image source={{ uri: capturedPhoto }} style={styles.photoPreview} />
          <View style={styles.photoOverlay}>
            <View style={styles.checklistOverlay}>
              {[
                "Face is centered",
                "Good lighting",
                "Clear image",
                "No obstructions",
              ].map((item, idx) => (
                <View key={idx} style={styles.checklistItem}>
                  <Ionicons name="checkmark-circle" size={18} color="#00D9A5" />
                  <Text style={styles.checklistText}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <TouchableOpacity style={styles.retakeButton} onPress={retakePhoto}>
          <Ionicons name="camera-reverse-outline" size={20} color="#007AFF" />
          <Text style={styles.retakeText}>Retake Photo</Text>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons name="information-circle" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            This photo will be securely stored and used only for attendance
            verification purposes.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.registerButton, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? (
            <>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={styles.registerButtonText}>Registering...</Text>
            </>
          ) : (
            <>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#fff"
              />
              <Text style={styles.registerButtonText}>Register Face</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {!capturedPhoto ? renderIntroduction() : renderReview()}

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide" transparent={false}>
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="front"
            onCameraReady={handleCameraReady}
          >
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraHeader}>
                <Text style={styles.cameraTitle}>Position Your Face</Text>
                <Text style={styles.cameraSubtitle}>
                  Center your face in the oval guide
                </Text>
                {!cameraReady && (
                  <View style={styles.cameraLoadingContainer}>
                    <ActivityIndicator color="#00D9A5" size="large" />
                    <Text style={styles.cameraLoadingText}>
                      Preparing camera...
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.faceGuideContainer}>
                <View style={styles.faceGuide}>
                  <View style={styles.faceOutline} />
                  {cameraReady && (
                    <View style={styles.guideInstructions}>
                      {["Face centered", "Good lighting"].map((label, idx) => (
                        <View key={idx} style={styles.guideInstruction}>
                          <Ionicons
                            name="checkmark-circle"
                            size={16}
                            color="#00D9A5"
                          />
                          <Text style={styles.guideInstructionText}>
                            {label}
                          </Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              </View>

              <View style={styles.cameraButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelCamera}
                >
                  <Ionicons name="close-circle" size={28} color="#fff" />
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.captureButton,
                    !cameraReady && styles.captureButtonDisabled,
                  ]}
                  onPress={takePicture}
                  disabled={!cameraReady}
                >
                  <View style={styles.captureButtonInner}>
                    <Ionicons name="camera" size={32} color="#fff" />
                  </View>
                </TouchableOpacity>
                <View style={styles.placeholderButton} />
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>

      {/* Loading Overlay */}
      {loading && (
        <Modal visible={loading} transparent animationType="fade">
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00D9A5" />
              <Text style={styles.loadingText}>Registering your face...</Text>
              <Text style={styles.loadingSubtext}>
                This may take a few seconds
              </Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

// styles unchanged — paste your original styles here

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  contentContainer: {
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
  },
  placeholder: {
    width: 40,
  },
  heroSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 40,
    alignItems: "center",
  },
  faceIconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#F0FDF9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 3,
    borderColor: "#00D9A5",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 12,
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  requirementsCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 24,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  requirementsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  requirementsTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 12,
  },
  requirementItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  requirementText: {
    flex: 1,
    marginLeft: 12,
  },
  requirementTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  requirementDesc: {
    fontSize: 13,
    color: "#666",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 20,
    marginTop: 24,
  },
  securityText: {
    flex: 1,
    fontSize: 13,
    color: "#007AFF",
    lineHeight: 18,
    marginLeft: 12,
  },
  startButton: {
    flexDirection: "row",
    backgroundColor: "#00D9A5",
    marginHorizontal: 20,
    marginTop: 32,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#00D9A5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  startButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  reviewSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  reviewTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1a1a1a",
    marginBottom: 8,
  },
  reviewSubtitle: {
    fontSize: 15,
    color: "#666",
    marginBottom: 24,
  },
  photoContainer: {
    position: "relative",
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#000",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  photoPreview: {
    width: "100%",
    height: 480,
    resizeMode: "cover",
  },
  photoOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
  },
  checklistOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: 16,
  },
  checklistItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  checklistText: {
    fontSize: 14,
    color: "#fff",
    marginLeft: 8,
    fontWeight: "500",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  retakeText: {
    fontSize: 16,
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 8,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#007AFF",
    lineHeight: 18,
    marginLeft: 12,
  },
  registerButton: {
    flexDirection: "row",
    backgroundColor: "#00D9A5",
    marginTop: 24,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#00D9A5",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  registerButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    marginLeft: 8,
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "space-between",
  },
  cameraHeader: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cameraTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  cameraSubtitle: {
    fontSize: 15,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
  },
  cameraLoadingContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  cameraLoadingText: {
    color: "#fff",
    fontSize: 15,
    marginTop: 12,
    fontWeight: "500",
  },
  faceGuideContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  faceGuide: {
    alignItems: "center",
  },
  faceOutline: {
    width: 280,
    height: 360,
    borderRadius: 180,
    borderWidth: 3,
    borderColor: "#00D9A5",
    borderStyle: "dashed",
    backgroundColor: "rgba(0, 217, 165, 0.1)",
  },
  guideInstructions: {
    marginTop: 24,
    alignItems: "center",
  },
  guideInstruction: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 217, 165, 0.2)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 8,
  },
  guideInstructionText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 8,
  },
  cameraButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: Platform.OS === "ios" ? 50 : 30,
  },
  cancelButton: {
    width: 80,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginTop: 4,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#fff",
  },
  captureButtonDisabled: {
    opacity: 0.4,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#00D9A5",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderButton: {
    width: 80,
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 40,
    alignItems: "center",
    minWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  loadingText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginTop: 20,
    textAlign: "center",
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
    textAlign: "center",
  },
});

export default FaceRegistrationScreen;
