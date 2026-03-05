import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../src/services/api";

export default function FaceRegisterScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [hasFaceAuth, setHasFaceAuth] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(true);

  useEffect(() => {
    initializeScreen();
  }, []);

  const initializeScreen = async () => {
    try {
      // Get camera permission
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");

      // Get user info from AsyncStorage
      const userData = await AsyncStorage.getItem("user");
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        // Check face auth status after getting user
        await checkFaceStatus();
      } else {
        Alert.alert("Error", "User not found. Please login again.", [
          { text: "OK", onPress: () => router.replace("/login") },
        ]);
      }
    } catch (error) {
      console.error("Initialization error:", error);
      Alert.alert("Error", "Failed to initialize. Please try again.");
    } finally {
      setCheckingStatus(false);
    }
  };

  const checkFaceStatus = async () => {
    try {
      const response = await api.get("/api/face/status/");
      setHasFaceAuth(response.data.has_face_auth);
    } catch (error) {
      console.error("Check face status error:", error.response?.data);
      // Don't show error alert, just assume no face auth
      setHasFaceAuth(false);
    }
  };

  const takePhoto = async () => {
    try {
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to take photo");
      console.error(error);
    }
  };

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick image");
      console.error(error);
    }
  };

  const handleRegister = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please take a photo or select an image first");
      return;
    }

    if (!user?.username) {
      Alert.alert("Error", "User information not found. Please login again.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
      return;
    }

    setLoading(true);

    try {
      // Create FormData
      const formData = new FormData();
      formData.append("username", user.username);

      // Extract filename and type from URI
      const filename = imageUri.split("/").pop();
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : "image/jpeg";

      // Append image to FormData
      formData.append("image", {
        uri: imageUri,
        name: filename,
        type: type,
      });

      // Make API call
      const response = await api.post("/api/face/register/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Success
      Alert.alert(
        "Success",
        response.data.message || "Face registered successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              setHasFaceAuth(true);
              setImageUri(null);
            },
          },
        ],
      );
    } catch (error) {
      console.error("Face registration error:", error.response?.data);

      // Handle different error responses
      let errorMessage = "Failed to register face. Please try again.";

      if (error.response?.data) {
        if (error.response.data.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data.image) {
          // Handle image validation errors
          errorMessage = Array.isArray(error.response.data.image)
            ? error.response.data.image[0]
            : error.response.data.image;
        } else if (error.response.data.username) {
          errorMessage = error.response.data.username;
        }
      }

      Alert.alert("Registration Failed", errorMessage, [{ text: "OK" }]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      "Delete Face Registration",
      "Are you sure you want to delete your face authentication?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setLoading(true);

            try {
              const response = await api.delete("/api/face/delete/", {
                data: { confirm: true },
              });

              Alert.alert(
                "Success",
                response.data.message || "Face registration deleted",
              );
              setHasFaceAuth(false);
              setImageUri(null);
            } catch (error) {
              console.error("Face deletion error:", error.response?.data);
              Alert.alert(
                "Error",
                error.response?.data?.error ||
                  "Failed to delete face registration",
              );
            } finally {
              setLoading(false);
            }
          },
        },
      ],
    );
  };

  // Loading state while checking permissions and status
  if (checkingStatus || hasPermission === null) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // No camera permission
  if (hasPermission === false) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>📷</Text>
        <Text style={styles.errorTitle}>Camera Permission Required</Text>
        <Text style={styles.errorMessage}>
          Please enable camera access in your device settings to register your
          face.
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
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Face Registration</Text>
        <Text style={styles.subtitle}>
          {hasFaceAuth
            ? "You already have face authentication enabled"
            : "Register your face for quick login"}
        </Text>

        {/* Status Badge */}
        {hasFaceAuth && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>✅ Face Auth Enabled</Text>
          </View>
        )}

        {/* Image Preview */}
        {imageUri && (
          <View style={styles.previewContainer}>
            <Image source={{ uri: imageUri }} style={styles.preview} />
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => setImageUri(null)}
              disabled={loading}
            >
              <Text style={styles.removeButtonText}>✕ Remove</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Camera/Gallery Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={takePhoto}
            disabled={loading}
          >
            <Text style={styles.buttonIcon}>📷</Text>
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={pickImage}
            disabled={loading}
          >
            <Text style={styles.buttonIcon}>🖼️</Text>
            <Text style={styles.buttonText}>Choose Photo</Text>
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        {imageUri && !hasFaceAuth && (
          <TouchableOpacity
            style={[styles.registerButton, loading && styles.buttonDisabled]}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.registerButtonText}>Register Face</Text>
            )}
          </TouchableOpacity>
        )}

        {/* Delete Button */}
        {hasFaceAuth && (
          <TouchableOpacity
            style={[styles.deleteButton, loading && styles.buttonDisabled]}
            onPress={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.deleteButtonText}>
                Delete Face Registration
              </Text>
            )}
          </TouchableOpacity>
        )}

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>📝 Tips for best results:</Text>
          <Text style={styles.tipText}>• Use good lighting</Text>
          <Text style={styles.tipText}>• Face the camera directly</Text>
          <Text style={styles.tipText}>• Remove glasses if possible</Text>
          <Text style={styles.tipText}>• Keep a neutral expression</Text>
          <Text style={styles.tipText}>• Ensure only one face is visible</Text>
          <Text style={styles.tipText}>• Image size: max 5MB</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  centered: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#000",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 20,
    textAlign: "center",
  },
  statusBadge: {
    backgroundColor: "#34C759",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: "center",
    marginBottom: 20,
  },
  statusBadgeText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  previewContainer: {
    marginBottom: 20,
  },
  preview: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    resizeMode: "cover",
  },
  removeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#FF3B30",
    borderRadius: 8,
    alignItems: "center",
  },
  removeButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  button: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonIcon: {
    fontSize: 24,
    marginBottom: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  registerButton: {
    backgroundColor: "#007AFF",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  registerButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  deleteButton: {
    backgroundColor: "#FF3B30",
    padding: 18,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  tipsContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  tipsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#000",
  },
  tipText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 48,
    marginBottom: 10,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
    textAlign: "center",
  },
  errorMessage: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
