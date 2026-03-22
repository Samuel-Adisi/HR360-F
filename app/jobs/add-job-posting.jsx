import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../../src/services/api";

const { width } = Dimensions.get("window");

export default function AddJobPostingScreen() {
  const [formData, setFormData] = useState({
    job_title: "",
    department: "",
    location: "",
    job_type: "",
    experience_level: "",
    salary_min: "",
    salary_max: "",
    positions: "1",
    deadline: "",
    job_description: "",
    responsibilities: "",
    requirements: "",
    benefits: "",
    contact_email: "",
    contact_phone: "",
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPicker, setShowPicker] = useState({
    department: false,
    location: false,
    job_type: false,
    experience_level: false,
  });

  const departments = [
    "Engineering",
    "Sales & Marketing",
    "Human Resources",
    "Finance",
    "Operations",
    "Customer Support",
    "Product Management",
    "Design",
    "Legal",
    "Administration",
  ];

  const locations = [
    "Remote",
    "On-site",
    "Hybrid",
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
  ];

  const jobTypes = [
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Freelance",
  ];

  const experienceLevels = [
    "Entry Level",
    "Junior (1-3 years)",
    "Mid Level (3-5 years)",
    "Senior (5-10 years)",
    "Lead (10+ years)",
    "Executive",
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.job_title.trim()) {
      newErrors.job_title = "Job title is required";
    }

    if (!formData.department) {
      newErrors.department = "Department is required";
    }

    if (!formData.location) {
      newErrors.location = "Location is required";
    }

    if (!formData.job_type) {
      newErrors.job_type = "Job type is required";
    }

    if (!formData.experience_level) {
      newErrors.experience_level = "Experience level is required";
    }

    if (formData.salary_min && formData.salary_max) {
      if (parseInt(formData.salary_min) >= parseInt(formData.salary_max)) {
        newErrors.salary_max = "Max salary must be greater than min salary";
      }
    }

    if (!formData.deadline) {
      newErrors.deadline = "Application deadline is required";
    }

    if (!formData.job_description.trim()) {
      newErrors.job_description = "Job description is required";
    }

    if (!formData.responsibilities.trim()) {
      newErrors.responsibilities = "Responsibilities are required";
    }

    if (!formData.requirements.trim()) {
      newErrors.requirements = "Requirements are required";
    }

    if (
      formData.contact_email &&
      !/\S+@\S+\.\S+/.test(formData.contact_email)
    ) {
      newErrors.contact_email = "Invalid email format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleClose = () => {
    setFormData({
      job_title: "",
      department: "",
      location: "",
      job_type: "",
      experience_level: "",
      salary_min: "",
      salary_max: "",
      positions: "1",
      deadline: "",
      job_description: "",
      responsibilities: "",
      requirements: "",
      benefits: "",
      contact_email: "",
      contact_phone: "",
    });
    setErrors({});
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fill in all required fields correctly.",
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await api.post("/api/jobs-posting/", formData);

      if (res.status === 201) {
        console.log("Job posting created successfully");
        Alert.alert("Success", "Job posting created successfully!", [
          {
            text: "View Postings",
            onPress: () => router.back(),
          },
          {
            text: "Add Another",
            onPress: () => handleClose(),
          },
        ]);
      }
    } catch (error) {
      console.log("ERROR DATA:", error.response?.data);
      console.log("ERROR STATUS:", error.response?.status);
      console.log("ERROR MESSAGE:", error.message);

      // Handle specific error cases
      if (error.response?.status === 400) {
        const errorData = error.response?.data;
        if (errorData && typeof errorData === "object") {
          // Set field-specific errors
          const fieldErrors = {};
          Object.keys(errorData).forEach((key) => {
            if (Array.isArray(errorData[key])) {
              fieldErrors[key] = errorData[key][0];
            } else {
              fieldErrors[key] = errorData[key];
            }
          });
          setErrors(fieldErrors);
          Alert.alert("Validation Error", "Please check the form for errors.");
        } else {
          Alert.alert("Error", "Invalid data. Please check your input.");
        }
      } else if (error.response?.status === 401) {
        Alert.alert("Authentication Error", "Please log in to continue.");
      } else if (error.response?.status === 403) {
        Alert.alert(
          "Permission Denied",
          "You don't have permission to create job postings.",
        );
      } else if (error.response?.status >= 500) {
        Alert.alert("Server Error", "Server error. Please try again later.");
      } else {
        Alert.alert("Error", "Failed to create job posting. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const renderInput = (label, field, options = {}) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>
        {label}
        {options.required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          options.multiline && styles.textArea,
          errors[field] && styles.inputError,
        ]}
        value={formData[field]}
        onChangeText={(text) => updateField(field, text)}
        placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
        keyboardType={options.keyboardType || "default"}
        autoCapitalize={options.autoCapitalize || "sentences"}
        multiline={options.multiline}
        numberOfLines={options.numberOfLines || 1}
        textAlignVertical={options.multiline ? "top" : "center"}
        editable={!isLoading}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderPicker = (label, field, options, required = false) => {
    const isOpen = showPicker[field];
    const selectedValue = formData[field];

    return (
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        <TouchableOpacity
          style={[styles.pickerButton, errors[field] && styles.inputError]}
          onPress={() =>
            !isLoading &&
            setShowPicker((prev) => ({ ...prev, [field]: !prev[field] }))
          }
          disabled={isLoading}
        >
          <Text
            style={[
              styles.pickerButtonText,
              !selectedValue && styles.pickerPlaceholder,
            ]}
          >
            {selectedValue || `Select ${label.toLowerCase()}`}
          </Text>
          <Ionicons
            name={isOpen ? "chevron-up" : "chevron-down"}
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.pickerDropdown}>
            <ScrollView style={styles.pickerScrollView} nestedScrollEnabled>
              {options.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.pickerOption,
                    selectedValue === option && styles.pickerOptionSelected,
                  ]}
                  onPress={() => {
                    updateField(field, option);
                    setShowPicker((prev) => ({ ...prev, [field]: false }));
                  }}
                >
                  <Text
                    style={[
                      styles.pickerOptionText,
                      selectedValue === option &&
                        styles.pickerOptionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {selectedValue === option && (
                    <Ionicons name="checkmark" size={20} color="#3B82F6" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
            disabled={isLoading}
          >
            <Ionicons name="arrow-back" size={24} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Job Posting</Text>
          <View style={styles.headerRight} />
        </View>

        {/* Loading Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#3B82F6" />
              <Text style={styles.loadingText}>Creating job posting...</Text>
            </View>
          </View>
        )}

        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={!isLoading}
        >
          {/* Basic Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="briefcase-outline" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Basic Information</Text>
            </View>

            {renderInput("Job Title", "job_title", {
              required: true,
              placeholder: "e.g., Senior Software Engineer",
            })}

            {renderPicker("Department", "department", departments, true)}

            {renderPicker("Location", "location", locations, true)}

            {renderPicker("Job Type", "job_type", jobTypes, true)}

            {renderPicker(
              "Experience Level",
              "experience_level",
              experienceLevels,
              true,
            )}

            <View style={styles.row}>
              {renderInput("Min Salary ($)", "salary_min", {
                keyboardType: "numeric",
                placeholder: "50000",
              })}
              {renderInput("Max Salary ($)", "salary_max", {
                keyboardType: "numeric",
                placeholder: "80000",
              })}
            </View>

            <View style={styles.row}>
              {renderInput("Open Positions", "positions", {
                required: true,
                keyboardType: "numeric",
                placeholder: "1",
              })}
              {renderInput("Application Deadline", "deadline", {
                required: true,
                placeholder: "YYYY-MM-DD",
              })}
            </View>
          </View>

          {/* Job Details */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color="#3B82F6"
              />
              <Text style={styles.sectionTitle}>Job Details</Text>
            </View>

            {renderInput("Job Description", "job_description", {
              required: true,
              multiline: true,
              numberOfLines: 4,
              placeholder:
                "Provide a detailed description of the role, company culture, and what makes this opportunity unique...",
            })}

            {renderInput("Key Responsibilities", "responsibilities", {
              required: true,
              multiline: true,
              numberOfLines: 4,
              placeholder:
                "• Lead development of new features\n• Mentor junior developers\n• Collaborate with cross-functional teams",
            })}

            {renderInput("Requirements & Qualifications", "requirements", {
              required: true,
              multiline: true,
              numberOfLines: 4,
              placeholder:
                "• Bachelor's degree in Computer Science\n• 5+ years of experience\n• Proficiency in React Native",
            })}

            {renderInput("Benefits & Perks", "benefits", {
              multiline: true,
              numberOfLines: 3,
              placeholder:
                "• Health insurance\n• 401(k) matching\n• Remote work flexibility\n• Professional development budget",
            })}
          </View>

          {/* Contact Information */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="mail-outline" size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Contact Information</Text>
            </View>

            {renderInput("Contact Email", "contact_email", {
              keyboardType: "email-address",
              autoCapitalize: "none",
              placeholder: "hr@company.com",
            })}

            {renderInput("Contact Phone", "contact_phone", {
              keyboardType: "phone-pad",
              placeholder: "+1 (555) 000-0000",
            })}
          </View>

          {/* Preview Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Posting Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Job Title:</Text>
              <Text style={styles.summaryValue}>
                {formData.job_title || "Not set"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Department:</Text>
              <Text style={styles.summaryValue}>
                {formData.department || "Not set"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Location:</Text>
              <Text style={styles.summaryValue}>
                {formData.location || "Not set"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Salary Range:</Text>
              <Text style={styles.summaryValue}>
                {formData.salary_min && formData.salary_max
                  ? `$${formData.salary_min} - $${formData.salary_max}`
                  : "Not specified"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Deadline:</Text>
              <Text style={styles.summaryValue}>
                {formData.deadline || "Not set"}
              </Text>
            </View>
          </View>

          <View style={{ height: 20 }} />
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.secondaryButton, isLoading && styles.buttonDisabled]}
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <Text style={styles.secondaryButtonText}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.primaryButton, isLoading && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFF" />
                <Text style={styles.primaryButtonText}>Publish Job</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
    textAlign: "center",
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#334155",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: "#1E293B",
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  pickerButtonText: {
    fontSize: 14,
    color: "#1E293B",
  },
  pickerPlaceholder: {
    color: "#94A3B8",
  },
  pickerDropdown: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    marginTop: 4,
    maxHeight: 200,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  pickerScrollView: {
    maxHeight: 200,
  },
  pickerOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  pickerOptionSelected: {
    backgroundColor: "#EFF6FF",
  },
  pickerOptionText: {
    fontSize: 14,
    color: "#334155",
  },
  pickerOptionTextSelected: {
    color: "#3B82F6",
    fontWeight: "500",
  },
  summaryCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  summaryLabel: {
    fontSize: 13,
    color: "#64748B",
    width: 120,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1E293B",
    flex: 1,
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F5F9",
    paddingVertical: 14,
    borderRadius: 8,
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#475569",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#3B82F6",
    paddingVertical: 14,
    borderRadius: 8,
    gap: 6,
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  loadingContainer: {
    backgroundColor: "#FFFFFF",
    padding: 24,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
  },
});
