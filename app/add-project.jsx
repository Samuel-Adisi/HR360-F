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
import DateTimePicker from "@react-native-community/datetimepicker";
import api from "../src/services/api";

const AddProjectScreen = () => {
  const [formData, setFormData] = useState({
    name: "",
    clientName: "",
    deadline: "",
    status: "Active",
    progress: 0,
    description: "",
    budget: "",
    startDate: "",
    priority: "Medium",
    category: "",
  });

  // Date picker states (only for mobile)
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDeadlinePicker, setShowDeadlinePicker] = useState(false);

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Format date to YYYY-MM-DD for Django
  const formatDateForAPI = (date) => {
    if (!date) return "";
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Format date for display (DD-MM-YYYY)
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  // Parse DD-MM-YYYY to YYYY-MM-DD (for web input)
  const parseWebDate = (inputDate) => {
    if (!inputDate) return "";
    const parts = inputDate.split("-");
    if (parts.length === 3 && parts[0].length <= 2) {
      const [day, month, year] = parts;
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    }
    return inputDate;
  };

  // Handle date selection (mobile)
  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      const formattedDate = formatDateForAPI(selectedDate);
      updateField("startDate", formattedDate);
    }
  };

  const onDeadlineChange = (event, selectedDate) => {
    setShowDeadlinePicker(false);
    if (selectedDate) {
      const formattedDate = formatDateForAPI(selectedDate);
      updateField("deadline", formattedDate);
    }
  };

  // Handle web date input change
  const handleWebDateChange = (field, value) => {
    // Convert DD-MM-YYYY to YYYY-MM-DD if needed
    const formattedDate = parseWebDate(value);
    updateField(field, formattedDate);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#34C759";
      case "Pending":
        return "#FF9500";
      case "Closed":
        return "#FF3B30";
      case "On Hold":
        return "#8E8E93";
      default:
        return "#999";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "Active":
        return "#E8F5E9";
      case "Pending":
        return "#FFF3E0";
      case "Closed":
        return "#FFEBEE";
      case "On Hold":
        return "#F5F5F5";
      default:
        return "#f5f5f5";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "#FF3B30";
      case "Medium":
        return "#FF9500";
      case "Low":
        return "#34C759";
      default:
        return "#999";
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert("Validation Error", "Please enter a project name");
      return false;
    }
    if (!formData.clientName.trim()) {
      Alert.alert("Validation Error", "Please enter a client name");
      return false;
    }
    if (!formData.startDate.trim()) {
      Alert.alert("Validation Error", "Please select a start date");
      return false;
    }
    if (!formData.deadline.trim()) {
      Alert.alert("Validation Error", "Please select a deadline");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    const projectData = {
      name: formData.name,
      client_name: formData.clientName,
      deadline: formData.deadline,
      status: formData.status,
      progress: parseInt(formData.progress) || 0,
      description: formData.description,
      budget: formData.budget || "",
      start_date: formData.startDate,
      priority: formData.priority,
      category: formData.category || "",
    };

    try {
      console.log("Sending data:", projectData);
      const res = await api.post("/api/projects/", projectData);

      if (res.status === 201) {
        console.log("Project created successfully");
        Alert.alert("Success", "Project created successfully!", [
          {
            text: "OK",
            onPress: () => {
              setFormData({
                name: "",
                clientName: "",
                deadline: "",
                status: "Active",
                progress: 0,
                description: "",
                budget: "",
                startDate: "",
                priority: "Medium",
                category: "",
              });
            },
          },
        ]);
      }
    } catch (error) {
      console.log("ERROR DATA:", error.response?.data);
      console.log("ERROR STATUS:", error.response?.status);
      console.log("ERROR MESSAGE:", error.message);

      const errorMessage = error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : "Failed to create project. Please try again.";

      Alert.alert("Error", errorMessage);
    }
  };

  const handleCancel = () => {
    Alert.alert(
      "Discard Project",
      "Are you sure you want to discard this project?",
      [
        { text: "Keep Editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            setFormData({
              name: "",
              clientName: "",
              deadline: "",
              status: "Active",
              progress: 0,
              description: "",
              budget: "",
              startDate: "",
              priority: "Medium",
              category: "",
            });
          },
        },
      ]
    );
  };

  const renderInput = (label, field, options = {}) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
        {options.required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[styles.input, options.multiline && styles.textArea]}
        value={formData[field]?.toString()}
        onChangeText={(text) => updateField(field, text)}
        placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        keyboardType={options.keyboardType || "default"}
        multiline={options.multiline}
        numberOfLines={options.numberOfLines || 1}
      />
    </View>
  );

  // Mobile date picker (iOS/Android)
  const renderMobileDatePicker = (
    label,
    field,
    showPicker,
    setShowPicker,
    onDateChange,
    required = false
  ) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <TouchableOpacity
        style={styles.datePickerButton}
        onPress={() => setShowPicker(true)}
      >
        <Ionicons name="calendar-outline" size={20} color="#007AFF" />
        <Text
          style={[
            styles.datePickerText,
            !formData[field] && styles.datePickerPlaceholder,
          ]}
        >
          {formData[field]
            ? formatDateForDisplay(formData[field])
            : "Select date"}
        </Text>
      </TouchableOpacity>
      {showPicker && (
        <DateTimePicker
          value={formData[field] ? new Date(formData[field]) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={onDateChange}
        />
      )}
    </View>
  );

  // Web date input (using HTML5 date input)
  const renderWebDateInput = (label, field, required = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.datePickerButton}>
        <Ionicons name="calendar-outline" size={20} color="#007AFF" />
        <input
          type="date"
          value={formData[field] || ""}
          onChange={(e) => updateField(field, e.target.value)}
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            backgroundColor: "transparent",
            fontSize: 15,
            color: "#222",
            fontFamily: "inherit",
          }}
        />
      </View>
    </View>
  );

  // Platform-specific date picker
  const renderDatePicker = (
    label,
    field,
    showPicker,
    setShowPicker,
    onDateChange,
    required = false
  ) => {
    if (Platform.OS === "web") {
      return renderWebDateInput(label, field, required);
    }
    return renderMobileDatePicker(
      label,
      field,
      showPicker,
      setShowPicker,
      onDateChange,
      required
    );
  };

  const renderPicker = (label, field, options, required = false) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      <View style={styles.pickerContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.pickerOption,
              formData[field] === option && styles.pickerOptionActive,
              field === "status" &&
                formData[field] === option && {
                  backgroundColor: getStatusBgColor(option),
                  borderColor: getStatusColor(option),
                },
              field === "priority" &&
                formData[field] === option && {
                  borderColor: getPriorityColor(option),
                  borderWidth: 2,
                },
            ]}
            onPress={() => updateField(field, option)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                formData[field] === option && styles.pickerOptionTextActive,
                field === "status" &&
                  formData[field] === option && {
                    color: getStatusColor(option),
                  },
                field === "priority" &&
                  formData[field] === option && {
                    color: getPriorityColor(option),
                  },
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderProgressSlider = () => (
    <View style={styles.inputGroup}>
      <View style={styles.progressHeader}>
        <Text style={styles.inputLabel}>Initial Progress</Text>
        <Text style={styles.progressValue}>{formData.progress}%</Text>
      </View>
      <View style={styles.sliderContainer}>
        <TextInput
          style={styles.sliderInput}
          value={formData.progress?.toString()}
          onChangeText={(text) => {
            const num = parseInt(text) || 0;
            updateField("progress", Math.min(100, Math.max(0, num)));
          }}
          keyboardType="numeric"
          maxLength={3}
          placeholder="0"
          placeholderTextColor="#999"
        />
        <Text style={styles.sliderPercent}>%</Text>
      </View>
      <View style={styles.progressBarBg}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${formData.progress}%`,
              backgroundColor: getStatusColor(formData.status),
            },
          ]}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>New Project</Text>
          <View style={styles.headerButton} />
        </View>

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Information</Text>

            {renderInput("Project Name", "name", {
              placeholder: "Enter project name",
              required: true,
            })}

            {renderInput("Client Name", "clientName", {
              placeholder: "Enter client name",
              required: true,
            })}

            {renderInput("Category", "category", {
              placeholder: "e.g., Web Development, Mobile App",
            })}

            {renderPicker(
              "Status",
              "status",
              ["Active", "Pending", "On Hold", "Closed"],
              true
            )}

            {renderPicker(
              "Priority",
              "priority",
              ["High", "Medium", "Low"],
              true
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timeline & Budget</Text>

            {renderDatePicker(
              "Start Date",
              "startDate",
              showStartDatePicker,
              setShowStartDatePicker,
              onStartDateChange,
              true
            )}

            {renderDatePicker(
              "Deadline",
              "deadline",
              showDeadlinePicker,
              setShowDeadlinePicker,
              onDeadlineChange,
              true
            )}

            {renderInput("Budget", "budget", {
              placeholder: "$0.00",
              keyboardType: "numeric",
            })}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Progress</Text>
            {renderProgressSlider()}
            <Text style={styles.helperText}>
              Set the initial progress (usually 0% for new projects)
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            {renderInput("Project Description", "description", {
              multiline: true,
              numberOfLines: 5,
              placeholder:
                "Enter project description, goals, and objectives...",
            })}
          </View>

          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Fields marked with * are required
            </Text>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCancel}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryButton} onPress={handleSave}>
            <Ionicons name="checkmark" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}>Create Project</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  content: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  section: {
    backgroundColor: "#fff",
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
    fontSize: 14,
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#222",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: "top",
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  datePickerText: {
    fontSize: 15,
    color: "#222",
    flex: 1,
  },
  datePickerPlaceholder: {
    color: "#999",
  },
  pickerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  pickerOptionActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  pickerOptionTextActive: {
    color: "#fff",
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  sliderContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sliderInput: {
    flex: 1,
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: "#222",
    marginRight: 8,
  },
  sliderPercent: {
    fontSize: 15,
    color: "#666",
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 4,
  },
  helperText: {
    fontSize: 13,
    color: "#666",
    marginTop: 8,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F7FF",
    padding: 16,
    marginTop: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 10,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: "#007AFF",
    lineHeight: 20,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default AddProjectScreen;