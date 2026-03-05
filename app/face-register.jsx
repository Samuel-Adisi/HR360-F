import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import faceAuthService from "../src/services/faceAuthService";

const { width } = Dimensions.get("window");

export default function FaceRegisterScreen() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasFaceAuth, setHasFaceAuth] = useState(false);
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    initializeScreen();
  }, []);

  useEffect(() => {
    // Animate screen entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const initializeScreen = async () => {
    try {
      // Request camera permissions
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      // Get user info from storage
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        
        // Check face status after getting user data
        await checkFaceStatus();
      } else {
        Alert.alert(
          "Authentication Required",
          "Please login to access face registration",
          [
            {
              text: "Go to Login",
              onPress: () => router.replace("/login"),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Initialization error:", error);
      Alert.alert("Error", "Failed to initialize. Please try again.");
    }
  };

  const checkFaceStatus = async () => {
    try {
      const result = await faceAuthService.checkFaceStatus();
      if (result.success) {
        setHasFaceAuth(result.data.has_face_auth);
      }
    } catch (error) {
      console.error("Face status check error:", error);
    }
  };

  const takePhoto = async () => {
    if (loading) return;

    try {
      // Request camera permissions if not already granted
      const { status } = await Camera.requestCameraPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Camera access is needed to take your photo",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                // Open app settings (platform-specific implementation needed)
                Alert.alert("Info", "Please enable camera permission in your device settings");
              },
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Take photo error:", error);
      Alert.alert("Error", "Failed to take photo. Please try again.");
    }
  };

  const pickImage = async () => {
    if (loading) return;

    try {
      // Request media library permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Photo library access is needed to select an image",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                Alert.alert("Info", "Please enable photo library permission in your device settings");
              },
            },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        exif: false,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Pick image error:", error);
      Alert.alert("Error", "Failed to pick image. Please try again.");
    }
  };

  const handleRegister = async () => {
    if (!imageUri) {
      Alert.alert("No Image", "Please take a photo or select an image first");
      return;
    }

    if (!user?.username) {
      Alert.alert(
        "Authentication Error",
        "User information not found. Please login again.",
        [
          {
            text: "Go to Login",
            onPress: () => router.replace("/login"),
          },
        ]
      );
      return;
    }

    setLoading(true);

    try {
      const result = await faceAuthService.registerFace(user.username, imageUri);

      if (result.success) {
        // Update local face auth status
        setHasFaceAuth(true);
        
        Alert.alert(
          "Success! 🎉",
          result.message || "Your face has been registered successfully. You can now use face authentication to login.",
          [
            {
              text: "Great!",
              onPress: () => {
                // Optionally navigate back or to home
                router.back();
              },
            },
          ]
        );
      } else {
        // Handle specific error messages from API
        const errorMessage = result.error || "Failed to register face. Please try again.";
        
        Alert.alert(
          "Registration Failed",
          errorMessage,
          [
            { text: "Try Again" },
          ]
        );
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle network errors
      if (error.message?.includes("Network")) {
        Alert.alert(
          "Network Error",
          "Please check your internet connection and try again."
        );
      } else {
        Alert.alert(
          "Error",
          "An unexpected error occurred. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Face Registration",
      "Are you sure you want to remove your face authentication? You'll need to register again to use face login.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);
            
            try {
              const result = await faceAuthService.deleteFace();

              if (result.success) {
                setHasFaceAuth(false);
                setImageUri(null);
                
                Alert.alert(
                  "Deleted",
                  "Face registration has been removed successfully"
                );
              } else {
                Alert.alert(
                  "Error",
                  result.error || "Failed to delete face registration"
                );
              }
            } catch (error) {
              console.error("Delete error:", error);
              Alert.alert("Error", "An unexpected error occurred");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const clearSelectedImage = () => {
    setImageUri(null);
  };

  // Loading state
  if (hasPermission === null || !user) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // Permission denied state
  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="camera-off" size={64} color="#FF3B30" />
        <Text style={styles.errorTitle}>Camera Access Required</Text>
        <Text style={styles.errorText}>
          Please grant camera permission in your device settings to use face registration
        </Text>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => router.back()}
        >
          <Text style={styles.primaryButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="scan-circle" size={64} color="#007AFF" />
          </View>
          <Text style={styles.title}>Face Registration</Text>
          <Text style={styles.subtitle}>
            {hasFaceAuth
              ? "Your face authentication is active"
              : "Set up face authentication for quick & secure login"}
          </Text>
        </View>

        {/* Status Badge */}
        {hasFaceAuth && (
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={20} color="#34C759" />
            <Text style={styles.statusText}>Face Auth Enabled</Text>
          </View>
        )}

        {/* Image Preview */}
        {imageUri && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <TouchableOpacity
              style={styles.clearButton}
              onPress={clearSelectedImage}
              disabled={loading}
            >
              <Ionicons name="close-circle" size={32} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}

        {/* Action Buttons */}
        {!hasFaceAuth && (
          <View style={styles.actionContainer}>
            <TouchableOpacity
              style={[styles.actionButton, loading && styles.buttonDisabled]}
              onPress={takePhoto}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name="camera" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.actionButton, loading && styles.buttonDisabled]}
              onPress={pickImage}
              disabled={loading}
              activeOpacity={0.7}
            >
              <Ionicons name="images" size={24} color="#007AFF" />
              <Text style={styles.actionButtonText}>Choose from Gallery</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Register/Delete Button */}
        {imageUri && !hasFaceAuth && (
          <TouchableOpacity
            style={[styles.primaryButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="shield-checkmark" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Register Face</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {hasFaceAuth && (
          <TouchableOpacity
            style={[styles.deleteButton, loading && styles.buttonDisabled]}
            onPress={handleDelete}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="trash" size={20} color="#fff" />
                <Text style={styles.deleteButtonText}>Remove Face Registration</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb" size={20} color="#FF9500" />
            <Text style={styles.tipsTitle}>Tips for Best Results</Text>
          </View>
          
          <View style={styles.tipsList}>
            <TipItem icon="sunny" text="Use good, even lighting" />
            <TipItem icon="eye" text="Face the camera directly" />
            <TipItem icon="glasses" text="Remove glasses if possible" />
            <TipItem icon="happy" text="Keep a neutral expression" />
            <TipItem icon="person" text="Ensure only one face is visible" />
            <TipItem icon="resize" text="Fill the frame with your face" />
          </View>
        </View>

        {/* Security Notice */}
        <View style={styles.securityNotice}>
          <Ionicons name="lock-closed" size={16} color="#8E8E93" />
          <Text style={styles.securityText}>
            Your face data is encrypted and stored securely. Only you can access your account using face authentication.
          </Text>
        </View>
      </Animated.View>
    </ScrollView>
  );
}

// Tip Item Component
const TipItem = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.tipItem}>
    <Ionicons name={icon as any} size={16} color="#007AFF" />
    <Text style={styles.tipText}>{text}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    padding: 20,
  },
  content: {
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#8E8E93",
  },
  
  // Header
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    paddingHorizontal: 20,
  },
  
  // Status Badge
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E8F5E9",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  statusText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#34C759",
  },
  
  // Image Preview
  previewContainer: {
    position: "relative",
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#fff",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  preview: {
    width: "100%",
    height: width - 40,
    resizeMode: "cover",
  },
  clearButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  
  // Action Buttons
  actionContainer: {
    gap: 12,
    marginBottom: 20,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#007AFF",
    ...Platform.select({
      ios: {
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  
  // Primary Button
  primaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 12,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#007AFF",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  
  // Delete Button
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF3B30",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 14,
    marginBottom: 24,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: "#FF3B30",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "700",
  },
  
  buttonDisabled: {
    opacity: 0.5,
  },
  
  // Tips Container
  tipsContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
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
  tipsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
  },
  tipsList: {
    gap: 12,
  },
  tipItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  tipText: {
    fontSize: 15,
    color: "#3C3C43",
    flex: 1,
  },
  
  // Security Notice
  securityNotice: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 12,
    gap: 10,
  },
  securityText: {
    fontSize: 13,
    color: "#8E8E93",
    lineHeight: 18,
    flex: 1,
  },
  
  // Error State
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#000",
    marginTop: 16,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
});