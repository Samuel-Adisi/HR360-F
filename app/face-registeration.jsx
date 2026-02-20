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

const FaceRegistrationScreen = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [showCamera, setShowCamera] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  const [capturedPhotos, setCapturedPhotos] = useState({
    front: null,
    left: null,
    right: null,
  });

  const [currentAngle, setCurrentAngle] = useState("front");

  // Your backend URL - UPDATE THIS
  const API_URL = Platform.select({
    web: "http://localhost:8000",
    default: "http://192.168.1.100:8000", // Change to your computer's IP
  });

  const instructions = {
    front: {
      title: "Face Forward",
      subtitle: "Look directly at the camera",
      icon: "scan-outline",
    },
    left: {
      title: "Turn Left",
      subtitle: "Turn your head slightly to the left",
      icon: "arrow-back-circle-outline",
    },
    right: {
      title: "Turn Right",
      subtitle: "Turn your head slightly to the right",
      icon: "arrow-forward-circle-outline",
    },
  };

  const handleStartRegistration = async () => {
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access to register your face.",
        );
        return;
      }
    }

    setCurrentStep(2);
    setCurrentAngle("front");
    setCameraReady(false);
    setShowCamera(true);
  };

  const handleCameraReady = () => {
    console.log("✓ Camera ready");
    setCameraReady(true);
  };

  const takePicture = async () => {
    if (!cameraReady) {
      Alert.alert("Please Wait", "Camera is still loading...");
      return;
    }

    if (!cameraRef.current) {
      Alert.alert("Error", "Camera not available");
      return;
    }

    try {
      console.log(`Taking ${currentAngle} photo...`);

      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        skipProcessing: false,
      });

      console.log(`✓ ${currentAngle} photo captured:`, photo.uri);

      setCapturedPhotos((prev) => ({
        ...prev,
        [currentAngle]: photo.uri,
      }));

      // Move to next angle
      if (currentAngle === "front") {
        setCurrentAngle("left");
      } else if (currentAngle === "left") {
        setCurrentAngle("right");
      } else {
        // All photos captured
        setShowCamera(false);
        setCurrentStep(3);
      }
    } catch (error) {
      console.error("Error taking picture:", error);
      Alert.alert("Error", "Failed to take picture. Please try again.");
    }
  };

  const retakePhoto = (angle) => {
    setCapturedPhotos((prev) => ({
      ...prev,
      [angle]: null,
    }));
    setCurrentAngle(angle);
    setCameraReady(false);
    setShowCamera(true);
    setCurrentStep(2);
  };

  const handleRegister = async () => {
    setLoading(true);

    try {
      // Validate all photos exist
      if (
        !capturedPhotos.front ||
        !capturedPhotos.left ||
        !capturedPhotos.right
      ) {
        Alert.alert("Error", "Please capture all 3 photos");
        setLoading(false);
        return;
      }

      console.log("Creating FormData...");
      const formData = new FormData();

      const getFileName = (uri) => uri.split("/").pop() || "photo.jpg";

      // Helper function to convert URI to Blob for web
      const uriToBlob = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();
        return blob;
      };

      // Append images for both web and native
      if (Platform.OS === "web") {
        console.log("Processing images for web...");
        
        // Convert data URIs to blobs
        const blob1 = await uriToBlob(capturedPhotos.front);
        const blob2 = await uriToBlob(capturedPhotos.left);
        const blob3 = await uriToBlob(capturedPhotos.right);

        console.log("Blob sizes:", blob1.size, blob2.size, blob3.size);

        formData.append("image1", blob1, "front.jpg");
        formData.append("image2", blob2, "left.jpg");
        formData.append("image3", blob3, "right.jpg");
      } else {
        console.log("Processing images for native...");
        
        // For native, append as file objects
        formData.append("image1", {
          uri: capturedPhotos.front,
          type: "image/jpeg",
          name: getFileName(capturedPhotos.front),
        });

        formData.append("image2", {
          uri: capturedPhotos.left,
          type: "image/jpeg",
          name: getFileName(capturedPhotos.left),
        });

        formData.append("image3", {
          uri: capturedPhotos.right,
          type: "image/jpeg",
          name: getFileName(capturedPhotos.right),
        });
      }

      console.log("Getting access token...");
      let token = await AsyncStorage.getItem("access_token");

      if (!token) {
        Alert.alert("Error", "No access token found. Please login again.");
        setLoading(false);
        return;
      }

      console.log("Sending request to:", `${API_URL}/api/face_registration`);

      // First attempt
      let response = await fetch(`${API_URL}/api/face_registration`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      console.log("Response status:", response.status);

      // Handle token refresh
      if (response.status === 401) {
        console.log("Token expired, refreshing...");

        const refreshToken = await AsyncStorage.getItem("refresh_token");

        if (!refreshToken) {
          setLoading(false);
          Alert.alert("Session Expired", "Please login again.");
          return;
        }

        const refreshResponse = await fetch(`${API_URL}/api/token/refresh`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            refresh: refreshToken,
          }),
        });

        if (!refreshResponse.ok) {
          await AsyncStorage.multiRemove(["access_token", "refresh_token"]);
          setLoading(false);
          Alert.alert("Session Expired", "Please login again.");
          return;
        }

        const refreshData = await refreshResponse.json();
        await AsyncStorage.setItem("access_token", refreshData.access);
        token = refreshData.access;

        console.log("Token refreshed, retrying...");

        // Retry with new token
        response = await fetch(`${API_URL}/api/face_registration`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      const data = await response.json();
      console.log("Response data:", data);
      setLoading(false);

      if (response.ok) {
        Alert.alert("Success!", "Your face has been registered successfully.", [
          {
            text: "OK",
            onPress: () => {
              // Reset and navigate back
              setCapturedPhotos({ front: null, left: null, right: null });
              setCurrentStep(1);
              if (router.canGoBack()) {
                router.back();
              }
            },
          },
        ]);
      } else {
        let errorMessage = "Failed to register face. Please try again.";

        if (data.error) {
          errorMessage = data.error;
        } else if (data.image1 || data.image2 || data.image3) {
          const firstError = data.image1 || data.image2 || data.image3;
          errorMessage = Array.isArray(firstError) ? firstError[0] : firstError;
        }

        Alert.alert("Registration Failed", errorMessage);
      }
    } catch (error) {
      setLoading(false);
      console.error("Registration error:", error);
      Alert.alert(
        "Network Error",
        "Failed to connect to server. Please check your connection and try again.",
      );
    }
  };

  const cancelCamera = () => {
    setShowCamera(false);
    setCameraReady(false);
    setCurrentStep(1);
  };

  const renderStep1 = () => (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            }
          }}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Face Registration</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.heroSection}>
        <View style={styles.faceIconContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#00D9A5" />
        </View>
        <Text style={styles.title}>Register Your Face</Text>
        <Text style={styles.description}>
          We'll capture your face from three angles to ensure accurate
          recognition for attendance tracking
        </Text>
      </View>

      <View style={styles.stepsContainer}>
        {[
          {
            num: 1,
            title: "Face Forward",
            desc: "Look directly at the camera",
            icon: "happy-outline",
          },
          {
            num: 2,
            title: "Turn Left",
            desc: "Slightly turn your head to the left",
            icon: "arrow-back-circle-outline",
          },
          {
            num: 3,
            title: "Turn Right",
            desc: "Slightly turn your head to the right",
            icon: "arrow-forward-circle-outline",
          },
        ].map((step) => (
          <View key={step.num} style={styles.stepCard}>
            <View style={styles.stepNumber}>
              <Text style={styles.stepNumberText}>{step.num}</Text>
            </View>
            <View style={styles.stepContent}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.desc}</Text>
            </View>
            <Ionicons name={step.icon} size={32} color="#00D9A5" />
          </View>
        ))}
      </View>

      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>Tips for Best Results</Text>
        {[
          { icon: "sunny", text: "Ensure good lighting on your face" },
          { icon: "glasses-outline", text: "Remove glasses or face coverings" },
          { icon: "happy-outline", text: "Keep a neutral expression" },
          { icon: "locate-outline", text: "Position yourself in the center" },
        ].map((tip, idx) => (
          <View key={idx} style={styles.tipItem}>
            <Ionicons name={tip.icon} size={20} color="#00D9A5" />
            <Text style={styles.tipText}>{tip.text}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        style={styles.startButton}
        onPress={handleStartRegistration}
        activeOpacity={0.8}
      >
        <Ionicons name="camera" size={20} color="#fff" />
        <Text style={styles.startButtonText}>Start Registration</Text>
      </TouchableOpacity>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => setCurrentStep(1)}
        >
          <Ionicons name="arrow-back" size={24} color="#1a1a1a" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Review Photos</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.reviewSection}>
        <Text style={styles.reviewTitle}>Review Your Photos</Text>
        <Text style={styles.reviewSubtitle}>
          Make sure all photos are clear and well-lit
        </Text>

        <View style={styles.photosGrid}>
          {[
            { key: "front", label: "Front View", icon: "person-outline" },
            {
              key: "left",
              label: "Left Profile",
              icon: "arrow-back-circle-outline",
            },
            {
              key: "right",
              label: "Right Profile",
              icon: "arrow-forward-circle-outline",
            },
          ].map((photo) => (
            <View key={photo.key} style={styles.photoCard}>
              <View style={styles.photoLabelRow}>
                <Ionicons name={photo.icon} size={20} color="#00D9A5" />
                <Text style={styles.photoLabel}>{photo.label}</Text>
              </View>
              {capturedPhotos[photo.key] ? (
                <>
                  <Image
                    source={{ uri: capturedPhotos[photo.key] }}
                    style={styles.photoPreview}
                  />
                  <TouchableOpacity
                    style={styles.retakeButton}
                    onPress={() => retakePhoto(photo.key)}
                  >
                    <Ionicons name="camera-reverse" size={16} color="#007AFF" />
                    <Text style={styles.retakeText}>Retake</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View style={styles.photoPlaceholder}>
                  <Ionicons name="camera-outline" size={40} color="#ccc" />
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.infoBox}>
          <Ionicons name="shield-checkmark" size={24} color="#007AFF" />
          <Text style={styles.infoText}>
            These photos will be securely stored and used only for attendance
            verification
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
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.registerButtonText}>
                Complete Registration
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      {currentStep === 1 && renderStep1()}
      {currentStep === 3 && renderStep3()}

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
                <View style={styles.progressContainer}>
                  <View
                    style={[
                      styles.progressDot,
                      capturedPhotos.front && styles.progressDotActive,
                    ]}
                  />
                  <View style={styles.progressLine} />
                  <View
                    style={[
                      styles.progressDot,
                      capturedPhotos.left && styles.progressDotActive,
                    ]}
                  />
                  <View style={styles.progressLine} />
                  <View
                    style={[
                      styles.progressDot,
                      capturedPhotos.right && styles.progressDotActive,
                    ]}
                  />
                </View>

                <Text style={styles.cameraTitle}>
                  {instructions[currentAngle].title}
                </Text>
                <Text style={styles.cameraSubtitle}>
                  {instructions[currentAngle].subtitle}
                </Text>
                <Ionicons
                  name={instructions[currentAngle].icon}
                  size={50}
                  color="#00D9A5"
                  style={styles.angleIcon}
                />

                {!cameraReady && (
                  <View style={styles.cameraLoadingContainer}>
                    <ActivityIndicator color="#00D9A5" />
                    <Text style={styles.cameraLoadingText}>
                      Initializing camera...
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.faceGuide}>
                <View style={styles.faceOutline}>
                  <Ionicons
                    name="person-outline"
                    size={100}
                    color="#00D9A5"
                    style={styles.faceGuideIcon}
                  />
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

      {/* Loading Modal */}
      {loading && (
        <Modal visible={loading} transparent animationType="fade">
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#00D9A5" />
              <Text style={styles.loadingText}>Registering your face...</Text>
              <Text style={styles.loadingSubtext}>Please wait</Text>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

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
    paddingTop: 60,
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
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  faceIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#F0FDF9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
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
    fontSize: 15,
    color: "#666",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  stepsContainer: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  stepCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    alignItems: "center",
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
  stepNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#00D9A5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  stepNumberText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 4,
  },
  stepDescription: {
    fontSize: 14,
    color: "#666",
  },
  tipsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 24,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 12,
    flex: 1,
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
    paddingTop: 20,
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
  photosGrid: {
    marginBottom: 16,
  },
  photoCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
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
  photoLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  photoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 8,
  },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
  },
  photoPlaceholder: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
  },
  retakeButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  retakeText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
    marginLeft: 6,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
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
    opacity: 0.7,
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
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    justifyContent: "space-between",
  },
  cameraHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 2,
    borderColor: "#fff",
  },
  progressDotActive: {
    backgroundColor: "#00D9A5",
    borderColor: "#00D9A5",
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  cameraTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  cameraSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
    textAlign: "center",
    marginBottom: 16,
  },
  angleIcon: {
    marginTop: 8,
  },
  cameraLoadingContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  cameraLoadingText: {
    color: "#fff",
    fontSize: 14,
    marginTop: 8,
  },
  faceGuide: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  faceOutline: {
    width: 250,
    height: 320,
    borderRadius: 125,
    borderWidth: 3,
    borderColor: "#00D9A5",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 217, 165, 0.1)",
  },
  faceGuideIcon: {
    opacity: 0.5,
  },
  cameraButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 30,
    paddingBottom: 50,
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
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
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
  },
  loadingSubtext: {
    fontSize: 14,
    color: "#666",
    marginTop: 8,
  },
});

export default FaceRegistrationScreen;