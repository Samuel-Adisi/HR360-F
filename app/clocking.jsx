import { CameraView, useCameraPermissions } from "expo-camera";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../src/services/api";
const Clocking = () => {
  const [time, setTime] = useState(new Date());
  const [isClockedIn, setIsClockedIn] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);
  const [clocked, setClock] = useState();

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeString = time.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const [clock, meridiem] = timeString.split(" ");

  const handleClockIn = async () => {
    // Request camera permission
    if (!permission) {
      return;
    }

    if (!permission.granted) {
      const result = await requestPermission();
      if (!result.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow camera access to clock in with face verification.",
          [{ text: "OK" }],
        );
        return;
      }
    }

    // Open camera modal
    setShowCamera(true);
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.7,
          base64: true,
        });

        console.log("Photo taken:", photo.uri);

        // Close camera
        setShowCamera(false);

        // TODO: Send photo to your backend for face verification
        // await verifyFaceWithBackend(photo.base64);
        try {
          const res = await api.post("/api/face_registeration", {
            image: photo.uri,
          });

          if (res.status === 200) {
            setIsClockedIn(true);
            console.log(res.data.message);
            Alert.alert(
              "✅ Success!",
              `Face verified! Clocked in at ${timeString}`,
              [{ text: "OK" }],
            );
          }
        } catch (error) {
          console.log("ERROR DATA:", error.response?.data);
          console.log("ERROR STATUS:", error.response?.status);
          console.log("ERROR MESSAGE:", error.message);
        }
      } catch (error) {
        console.error("Error taking picture:", error);
        Alert.alert("Error", "Failed to take picture. Please try again.");
      }
    }
  };

  const cancelCamera = () => {
    setShowCamera(false);
  };

  const menuItems = [
    { id: 1, icon: "📋", label: "Claims", color: "#E3F2FD" },
    { id: 2, icon: "✈️", label: "Leave", color: "#E8F5E9" },
    { id: 3, icon: "📅", label: "Events", color: "#FFF3E0" },
    { id: 4, icon: "📊", label: "Reports", color: "#F3E5F5" },
  ];

  return (
    <>
      <ScrollView
        style={styles.screenContainer}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Section */}
        <View style={styles.headerContainer}>
          <View style={styles.textContainer}>
            <Text style={styles.greeting}>Good morning, 👋</Text>
            <Text style={styles.name}>Rachael.</Text>
            <Text style={styles.subtitle}>
              Begin another great day by clocking in.
            </Text>
          </View>
          <Image
            source={require("../assets/profile/person.avif")}
            style={styles.profile}
          />
        </View>

        {/* Clock Card */}
        <View style={styles.clockCard}>
          <Text style={styles.date}>
            {new Date()
              .toLocaleDateString("en-US", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })
              .toUpperCase()}
          </Text>

          <View style={styles.timeContainer}>
            <Text style={styles.timeText}>{clock}</Text>
            <Text style={styles.meridiem}>{meridiem}</Text>
          </View>

          <Text
            style={[styles.onTimeText, isClockedIn && styles.clockedInText]}
          >
            {isClockedIn ? `✅ Clocked In @${timeString}` : "On time"}
          </Text>

          {/* Timeline */}
          <View style={styles.timelineContainer}>
            <View style={styles.timeline}>
              <View style={styles.timelineBar} />
              <View style={styles.currentTimeMarker} />
            </View>
            <View style={styles.timeLabels}>
              <Text style={styles.timeLabel}>AM</Text>
              <Text style={styles.timeLabel}>9 AM</Text>
              <Text style={styles.timeLabel}>10 AM</Text>
              <Text style={styles.timeLabel}>11 AM</Text>
              <Text style={styles.timeLabel}>12 AM</Text>
              <Text style={styles.timeLabel}>1 PM</Text>
              <Text style={styles.timeLabel}>2 PM</Text>
              <Text style={styles.timeLabel}>3 PM</Text>
              <Text style={styles.timeLabel}>4 PM</Text>
            </View>
          </View>

          {/* Working Hours */}
          <View style={styles.workingHoursContainer}>
            <Text style={styles.workingHoursTitle}>WORKING HOURS</Text>
            <Text style={styles.workingHoursText}>
              Starts <Text style={styles.boldText}>9:00AM-10:00AM</Text> & Ends{" "}
              <Text style={styles.boldText}>6:00PM-7:00PM</Text>
            </Text>
          </View>

          {/* Clock In Button */}
          <TouchableOpacity
            style={[
              styles.clockInButton,
              isClockedIn && styles.clockedInButton,
            ]}
            activeOpacity={0.8}
            onPress={handleClockIn}
            disabled={isClockedIn}
          >
            <Text style={styles.clockInText}>
              {isClockedIn
                ? "✅ Clocked In"
                : "📸 Clock in with Face Verification"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Grid Pills Section */}
        <View style={styles.gridContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.gridItem, { backgroundColor: item.color }]}
              activeOpacity={0.7}
              onPress={() => {
                router.push(`/${item.label.toLowerCase()}`);
              }}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>{item.icon}</Text>
              </View>
              <Text style={styles.gridLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Camera Modal */}
      <Modal visible={showCamera} animationType="slide" transparent={false}>
        <View style={styles.cameraContainer}>
          <CameraView ref={cameraRef} style={styles.camera} facing="front">
            <View style={styles.cameraOverlay}>
              <View style={styles.cameraHeader}>
                <Text style={styles.cameraTitle}>
                  Position your face in the frame
                </Text>
                <Text style={styles.cameraSubtitle}>
                  Make sure your face is clearly visible
                </Text>
              </View>

              {/* Face outline guide */}
              <View style={styles.faceGuide}>
                <View style={styles.faceOutline} />
              </View>

              <View style={styles.cameraButtons}>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={cancelCamera}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.captureButton}
                  onPress={takePicture}
                >
                  <View style={styles.captureButtonInner} />
                </TouchableOpacity>

                <View style={styles.placeholderButton} />
              </View>
            </View>
          </CameraView>
        </View>
      </Modal>
    </>
  );
};

export default Clocking;

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: "#E8E9EB",
  },
  contentContainer: {
    paddingTop: 50,
    paddingBottom: 100,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  textContainer: {
    flex: 1,
    marginRight: 15,
  },
  greeting: {
    fontSize: 28,
    color: "#1a1a1a",
    marginBottom: 0,
    fontWeight: "400",
  },
  name: {
    fontWeight: "bold",
    fontSize: 36,
    color: "#1a1a1a",
    marginBottom: 8,
    marginTop: -4,
  },
  subtitle: {
    fontSize: 15,
    color: "#1a1a1a",
    lineHeight: 22,
  },
  profile: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  clockCard: {
    marginHorizontal: 20,
    backgroundColor: "#F5F5F7",
    borderRadius: 24,
    padding: 28,
    paddingTop: 32,
    marginBottom: 24,
  },
  date: {
    fontSize: 13,
    color: "#6B6B6B",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 12,
  },
  timeText: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#1a1a1a",
    letterSpacing: -3,
    lineHeight: 72,
  },
  meridiem: {
    fontSize: 36,
    fontWeight: "600",
    color: "#1a1a1a",
    marginLeft: 4,
    marginBottom: 8,
  },
  onTimeText: {
    fontSize: 16,
    color: "#00C896",
    fontWeight: "600",
    marginBottom: 24,
  },
  clockedInText: {
    color: "#4CAF50",
  },
  timelineContainer: {
    marginBottom: 28,
  },
  timeline: {
    height: 8,
    backgroundColor: "#D9E3F0",
    borderRadius: 4,
    marginBottom: 8,
    position: "relative",
  },
  timelineBar: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: "15%",
    backgroundColor: "#7BA6E3",
    borderRadius: 4,
  },
  currentTimeMarker: {
    position: "absolute",
    left: "15%",
    top: -6,
    width: 20,
    height: 20,
    backgroundColor: "#4A4A4A",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#F5F5F7",
  },
  timeLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 2,
  },
  timeLabel: {
    fontSize: 11,
    color: "#999",
    fontWeight: "500",
  },
  workingHoursContainer: {
    marginBottom: 24,
  },
  workingHoursTitle: {
    fontSize: 12,
    color: "#6B6B6B",
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  workingHoursText: {
    fontSize: 14,
    color: "#6B6B6B",
    lineHeight: 20,
  },
  boldText: {
    fontWeight: "700",
    color: "#1a1a1a",
  },
  clockInButton: {
    backgroundColor: "#00D9A5",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#00D9A5",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  clockedInButton: {
    backgroundColor: "#6B7280",
    opacity: 0.7,
  },
  clockInText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#fff",
    letterSpacing: 0.3,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    gap: 16,
  },
  gridItem: {
    width: "47%",
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 12,
  },
  icon: {
    fontSize: 48,
  },
  gridLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    textAlign: "center",
  },
  // Camera Styles
  cameraContainer: {
    flex: 1,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
  },
  cameraHeader: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  cameraTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 8,
    textAlign: "center",
  },
  cameraSubtitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.8,
    textAlign: "center",
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
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 4,
    borderColor: "#00D9A5",
  },
  captureButtonInner: {
    width: 65,
    height: 65,
    borderRadius: 32.5,
    backgroundColor: "#00D9A5",
  },
  placeholderButton: {
    width: 80,
  },
});
