import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Linking,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../src/services/api";

const { width } = Dimensions.get("window");

export default function ApplicationDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [application, setApplication] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchApplicationDetails();
  }, [id]);

  const fetchApplicationDetails = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/api/application/${id}/`);

      if (res.status === 200) {
        setApplication(res.data);
      }
    } catch (error) {
      console.log("ERROR:", error.response?.data);
      Alert.alert("Error", "Failed to load application details.");
      router.back();
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    try {
      setIsUpdating(true);
      const res = await api.patch(`/api/application/${id}/`, {
        status: newStatus,
      });

      if (res.status === 200) {
        setApplication(res.data);
        Alert.alert("Success", "Application status updated successfully!");
      }
    } catch (error) {
      console.log("ERROR:", error.response?.data);
      Alert.alert("Error", "Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteApplication = () => {
    Alert.alert(
      "Delete Application",
      "Are you sure you want to delete this application? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await api.delete(`/api/application/${id}/`);
              if (res.status === 204 || res.status === 200) {
                Alert.alert("Success", "Application deleted successfully!");
                router.back();
              }
            } catch (error) {
              console.log("ERROR:", error.response?.data);
              Alert.alert("Error", "Failed to delete application.");
            }
          },
        },
      ],
    );
  };

  const showStatusMenu = () => {
    const statusOptions = [
      {
        value: "pending",
        label: "Pending",
        icon: "time-outline",
        color: "#F59E0B",
      },
      {
        value: "under_review",
        label: "Under Review",
        icon: "eye-outline",
        color: "#3B82F6",
      },
      {
        value: "shortlisted",
        label: "Shortlisted",
        icon: "star-outline",
        color: "#8B5CF6",
      },
      {
        value: "interview",
        label: "Interview",
        icon: "people-outline",
        color: "#06B6D4",
      },
      {
        value: "rejected",
        label: "Rejected",
        icon: "close-circle-outline",
        color: "#EF4444",
      },
      {
        value: "accepted",
        label: "Accepted",
        icon: "checkmark-circle-outline",
        color: "#10B981",
      },
    ];

    Alert.alert("Update Application Status", "Select new status:", [
      ...statusOptions.map((status) => ({
        text: status.label,
        onPress: () => handleStatusChange(status.value),
      })),
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleCall = () => {
    if (application?.phone) {
      Linking.openURL(`tel:${application.phone}`);
    }
  };

  const handleEmail = () => {
    if (application?.applicant_email) {
      Linking.openURL(`mailto:${application.applicant_email}`);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#F59E0B",
      under_review: "#3B82F6",
      shortlisted: "#8B5CF6",
      interview: "#06B6D4",
      rejected: "#EF4444",
      accepted: "#10B981",
    };
    return colors[status] || "#64748B";
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "time-outline",
      under_review: "eye-outline",
      shortlisted: "star-outline",
      interview: "people-outline",
      rejected: "close-circle-outline",
      accepted: "checkmark-circle-outline",
    };
    return icons[status] || "document-outline";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDateShort = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getTimeSinceApplication = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading details...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!application) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Application Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={80} color="#EF4444" />
          <Text style={styles.errorTitle}>Application Not Found</Text>
          <TouchableOpacity
            style={styles.errorButton}
            onPress={() => router.back()}
          >
            <Text style={styles.errorButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const statusColor = getStatusColor(application.status);
  const statusLabel = application.status
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Details</Text>
        <TouchableOpacity
          onPress={handleDeleteApplication}
          style={styles.deleteButton}
        >
          <Ionicons name="trash-outline" size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Applicant Card */}
        <View style={styles.card}>
          <View style={styles.applicantHeader}>
            <View style={styles.avatarLarge}>
              <Text style={styles.avatarTextLarge}>
                {application.applicant_name
                  ?.split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2) || "NA"}
              </Text>
            </View>
            <View style={styles.applicantMainInfo}>
              <Text style={styles.applicantNameLarge}>
                {application.applicant_name}
              </Text>
              <Text style={styles.applicantEmailLarge}>
                {application.applicant_email}
              </Text>
            </View>
          </View>

          {/* Status Badge */}
          <View style={styles.statusSection}>
            <Text style={styles.sectionLabel}>Current Status</Text>
            <View
              style={[
                styles.statusBadgeLarge,
                { backgroundColor: `${statusColor}15` },
              ]}
            >
              <Ionicons
                name={getStatusIcon(application.status)}
                size={20}
                color={statusColor}
              />
              <Text style={[styles.statusTextLarge, { color: statusColor }]}>
                {statusLabel}
              </Text>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.quickActions}>
            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleCall}
              disabled={!application.phone}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: "#10B98115" },
                ]}
              >
                <Ionicons name="call-outline" size={24} color="#10B981" />
              </View>
              <Text style={styles.quickActionLabel}>Call</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleEmail}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: "#3B82F615" },
                ]}
              >
                <Ionicons name="mail-outline" size={24} color="#3B82F6" />
              </View>
              <Text style={styles.quickActionLabel}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={showStatusMenu}
              disabled={isUpdating}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: "#8B5CF615" },
                ]}
              >
                {isUpdating ? (
                  <ActivityIndicator size="small" color="#8B5CF6" />
                ) : (
                  <Ionicons name="create-outline" size={24} color="#8B5CF6" />
                )}
              </View>
              <Text style={styles.quickActionLabel}>Update</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Position Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Position Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="briefcase-outline" size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Job Title</Text>
                <Text style={styles.infoValue}>
                  {application.job_title || "Not specified"}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="business-outline" size={20} color="#10B981" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Position</Text>
                <Text style={styles.infoValue}>
                  {application.position || "Not specified"}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="time-outline" size={20} color="#F59E0B" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Experience</Text>
                <Text style={styles.infoValue}>
                  {application.experience_years !== null &&
                  application.experience_years !== undefined
                    ? `${application.experience_years} years`
                    : "Not specified"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Contact Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="mail-outline" size={20} color="#3B82F6" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Email Address</Text>
                <Text style={styles.infoValue}>
                  {application.applicant_email}
                </Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconContainer}>
                <Ionicons name="call-outline" size={20} color="#10B981" />
              </View>
              <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>Phone Number</Text>
                <Text style={styles.infoValue}>
                  {application.phone || "Not provided"}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Timeline Information */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Application Timeline</Text>
          <View style={styles.timeline}>
            <View style={styles.timelineItem}>
              <View
                style={[styles.timelineDot, { backgroundColor: "#3B82F6" }]}
              />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Applied</Text>
                <Text style={styles.timelineDate}>
                  {formatDate(application.applied_date)}
                </Text>
                <Text style={styles.timelineRelative}>
                  {getTimeSinceApplication(application.applied_date)}
                </Text>
              </View>
            </View>

            <View style={styles.timelineItem}>
              <View
                style={[styles.timelineDot, { backgroundColor: "#10B981" }]}
              />
              <View style={styles.timelineContent}>
                <Text style={styles.timelineLabel}>Last Updated</Text>
                <Text style={styles.timelineDate}>
                  {formatDate(application.updated_at)}
                </Text>
                <Text style={styles.timelineRelative}>
                  {getTimeSinceApplication(application.updated_at)}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsContainer}>
          <TouchableOpacity
            style={[styles.actionButtonLarge, styles.updateButton]}
            onPress={showStatusMenu}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Ionicons name="create-outline" size={20} color="#FFFFFF" />
                <Text style={styles.actionButtonTextLarge}>Update Status</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButtonLarge, styles.deleteButtonLarge]}
            onPress={handleDeleteApplication}
          >
            <Ionicons name="trash-outline" size={20} color="#FFFFFF" />
            <Text style={styles.actionButtonTextLarge}>Delete Application</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  deleteButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  applicantHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3B82F6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  avatarTextLarge: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  applicantMainInfo: {
    alignItems: "center",
  },
  applicantNameLarge: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  applicantEmailLarge: {
    fontSize: 15,
    color: "#64748B",
  },
  statusSection: {
    alignItems: "center",
    marginBottom: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  statusBadgeLarge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 8,
  },
  statusTextLarge: {
    fontSize: 16,
    fontWeight: "700",
  },
  quickActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  quickActionButton: {
    alignItems: "center",
    gap: 8,
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 16,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  infoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },
  timeline: {
    gap: 20,
  },
  timelineItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 2,
  },
  timelineRelative: {
    fontSize: 12,
    color: "#94A3B8",
    fontStyle: "italic",
  },
  actionButtonsContainer: {
    gap: 12,
  },
  actionButtonLarge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 8,
  },
  updateButton: {
    backgroundColor: "#3B82F6",
  },
  deleteButtonLarge: {
    backgroundColor: "#EF4444",
  },
  actionButtonTextLarge: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#64748B",
  },
  errorContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 24,
  },
  errorButton: {
    backgroundColor: "#3B82F6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  errorButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});
