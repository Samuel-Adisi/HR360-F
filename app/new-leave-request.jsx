import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const AddLeaveRequestScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    reason: "",
  });

  const [errors, setErrors] = useState({});
  const [showLeaveTypePicker, setShowLeaveTypePicker] = useState(false);

  const leaveTypes = [
    { id: "1", name: "Annual Leave", icon: "calendar", color: "#007AFF" },
    { id: "2", name: "Sick Leave", icon: "medical", color: "#EF4444" },
    { id: "3", name: "Casual Leave", icon: "time", color: "#F59E0B" },
    {
      id: "4",
      name: "Emergency Leave",
      icon: "alert-circle",
      color: "#EF4444",
    },
    { id: "5", name: "Maternity Leave", icon: "heart", color: "#EC4899" },
    { id: "6", name: "Paternity Leave", icon: "people", color: "#8B5CF6" },
  ];

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.leaveType) {
      newErrors.leaveType = "Please select a leave type";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      if (end < start) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    if (!formData.reason || formData.reason.trim().length < 10) {
      newErrors.reason = "Please provide a reason (minimum 10 characters)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const days = calculateDays();
      Alert.alert(
        "Success",
        `Leave request submitted successfully!\n\nType: ${formData.leaveType}\nDuration: ${days} day${days > 1 ? "s" : ""}`,
        [
          {
            text: "OK",
            onPress: () => {
              // Reset form
              setFormData({
                leaveType: "",
                startDate: "",
                endDate: "",
                reason: "",
              });
              // Navigate back or to leave requests list
              // navigation.goBack();
            },
          },
        ],
      );
    }
  };

  const renderLeaveTypeOption = (type) => (
    <TouchableOpacity
      key={type.id}
      style={[
        styles.leaveTypeOption,
        formData.leaveType === type.name && styles.leaveTypeOptionSelected,
      ]}
      onPress={() => {
        updateFormData("leaveType", type.name);
        setShowLeaveTypePicker(false);
      }}
    >
      <View
        style={[styles.leaveTypeIcon, { backgroundColor: type.color + "20" }]}
      >
        <Ionicons name={type.icon} size={24} color={type.color} />
      </View>
      <Text
        style={[
          styles.leaveTypeOptionText,
          formData.leaveType === type.name &&
            styles.leaveTypeOptionTextSelected,
        ]}
      >
        {type.name}
      </Text>
      {formData.leaveType === type.name && (
        <Ionicons name="checkmark-circle" size={24} color={type.color} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation?.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Leave Request</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Leave Type Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leave Type *</Text>
            <TouchableOpacity
              style={[
                styles.selectButton,
                errors.leaveType && styles.inputError,
              ]}
              onPress={() => setShowLeaveTypePicker(!showLeaveTypePicker)}
            >
              <View style={styles.selectButtonContent}>
                {formData.leaveType ? (
                  <>
                    <Ionicons
                      name={
                        leaveTypes.find((t) => t.name === formData.leaveType)
                          ?.icon || "document"
                      }
                      size={20}
                      color="#007AFF"
                    />
                    <Text style={styles.selectButtonText}>
                      {formData.leaveType}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.selectButtonPlaceholder}>
                    Select leave type
                  </Text>
                )}
              </View>
              <Ionicons
                name={showLeaveTypePicker ? "chevron-up" : "chevron-down"}
                size={20}
                color="#666"
              />
            </TouchableOpacity>
            {errors.leaveType && (
              <Text style={styles.errorText}>{errors.leaveType}</Text>
            )}

            {/* Leave Type Options */}
            {showLeaveTypePicker && (
              <View style={styles.leaveTypeOptions}>
                {leaveTypes.map(renderLeaveTypeOption)}
              </View>
            )}
          </View>

          {/* Date Range Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leave Period *</Text>

            <View style={styles.dateRow}>
              <View style={styles.dateField}>
                <Text style={styles.label}>Start Date</Text>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    errors.startDate && styles.inputError,
                  ]}
                  onPress={() => {
                    // In a real app, open date picker here
                    updateFormData("startDate", "2024-08-01");
                  }}
                >
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <Text
                    style={[
                      styles.dateInputText,
                      !formData.startDate && styles.placeholderText,
                    ]}
                  >
                    {formData.startDate || "Select date"}
                  </Text>
                </TouchableOpacity>
                {errors.startDate && (
                  <Text style={styles.errorText}>{errors.startDate}</Text>
                )}
              </View>

              <View style={styles.dateField}>
                <Text style={styles.label}>End Date</Text>
                <TouchableOpacity
                  style={[
                    styles.dateInput,
                    errors.endDate && styles.inputError,
                  ]}
                  onPress={() => {
                    // In a real app, open date picker here
                    updateFormData("endDate", "2024-08-05");
                  }}
                >
                  <Ionicons name="calendar-outline" size={20} color="#666" />
                  <Text
                    style={[
                      styles.dateInputText,
                      !formData.endDate && styles.placeholderText,
                    ]}
                  >
                    {formData.endDate || "Select date"}
                  </Text>
                </TouchableOpacity>
                {errors.endDate && (
                  <Text style={styles.errorText}>{errors.endDate}</Text>
                )}
              </View>
            </View>

            {/* Duration Display */}
            {formData.startDate && formData.endDate && calculateDays() > 0 && (
              <View style={styles.durationCard}>
                <Ionicons name="time-outline" size={20} color="#007AFF" />
                <Text style={styles.durationText}>
                  Duration: {calculateDays()} day
                  {calculateDays() > 1 ? "s" : ""}
                </Text>
              </View>
            )}
          </View>

          {/* Reason Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Reason *</Text>
            <TextInput
              style={[styles.textArea, errors.reason && styles.inputError]}
              placeholder="Provide a detailed reason for your leave request..."
              value={formData.reason}
              onChangeText={(text) => updateFormData("reason", text)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
              maxLength={500}
            />
            <View style={styles.textAreaFooter}>
              {errors.reason && (
                <Text style={styles.errorText}>{errors.reason}</Text>
              )}
              <Text style={styles.characterCount}>
                {formData.reason.length}/500
              </Text>
            </View>
          </View>

          {/* Info Card */}
          <View style={styles.infoCard}>
            <Ionicons name="information-circle" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Your leave request will be sent to your manager for approval.
              You'll receive a notification once it's reviewed.
            </Text>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation?.goBack()}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.submitButtonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddLeaveRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  placeholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
  },
  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  selectButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  selectButtonText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  selectButtonPlaceholder: {
    fontSize: 15,
    color: "#999",
  },
  leaveTypeOptions: {
    marginTop: 12,
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  leaveTypeOption: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  leaveTypeOptionSelected: {
    backgroundColor: "#f0f9ff",
  },
  leaveTypeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  leaveTypeOptionText: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  leaveTypeOptionTextSelected: {
    color: "#007AFF",
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    gap: 12,
  },
  dateField: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
    fontWeight: "500",
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateInputText: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
  },
  placeholderText: {
    color: "#999",
    fontWeight: "400",
  },
  durationCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#f0f9ff",
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
  },
  durationText: {
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
  textArea: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    color: "#222",
    minHeight: 120,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textAreaFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  characterCount: {
    fontSize: 12,
    color: "#999",
    marginLeft: "auto",
  },
  inputError: {
    borderColor: "#EF4444",
    borderWidth: 1.5,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 6,
  },
  infoCard: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#f0f9ff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 80,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#007AFF",
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  cancelButton: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    gap: 8,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
