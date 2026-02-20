import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
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
import api from "../src/services/api";

const AddDepartmentScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    name: "",
    headOfDept: "",
    phone: "",
    email: "",
    totalEmp: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = "Department name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Department name must be at least 2 characters";
    }

    if (!formData.headOfDept.trim()) {
      newErrors.headOfDept = "Head of department is required";
    } else if (formData.headOfDept.trim().length < 2) {
      newErrors.headOfDept = "Name must be at least 2 characters";
    }

    // Optional but validated fields
    if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number (min 10 digits)";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.totalEmp) {
      const empCount = parseInt(formData.totalEmp);
      if (isNaN(empCount) || empCount < 0) {
        newErrors.totalEmp = "Total employees must be a positive number";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate form first
    if (!validateForm()) {
      Alert.alert(
        "Validation Error",
        "Please fix the errors in the form before submitting.",
      );
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare data for API
      const departmentData = {
        department_name: formData.name.trim(),
        head_of_department: formData.headOfDept.trim(),
        phone: formData.phone.trim() || null,
        email: formData.email.trim() || null,
        total_employees: formData.totalEmp ? parseInt(formData.totalEmp) : 0,
      };

      // Make API call
      const res = await api.post("/api/department/", departmentData);

      // Check response status
      if (res.status === 200 || res.status === 201) {
        // Show success message
        Alert.alert("Success! 🎉", "Department has been added successfully.", [
          {
            text: "OK",
            onPress: () => {
              // Navigate to all departments screen
              navigation.navigate("AllDepartments", { refresh: true });
              // Or if you want to go back:
              // navigation.goBack();
            },
          },
        ]);
      } else {
        // Unexpected success status
        throw new Error("Unexpected response from server");
      }
    } catch (error) {
      console.error("Error adding department:", error);

      // Handle different types of errors
      let errorMessage = "Failed to add department. Please try again.";

      if (error.response) {
        // Server responded with error
        if (error.response.status === 400) {
          // Validation error from backend
          const backendErrors = error.response.data;
          if (typeof backendErrors === "object") {
            // Map backend errors to form fields
            const mappedErrors = {};
            if (backendErrors.department_name) {
              mappedErrors.name = backendErrors.department_name[0];
            }
            if (backendErrors.head_of_department) {
              mappedErrors.headOfDept = backendErrors.head_of_department[0];
            }
            if (backendErrors.phone) {
              mappedErrors.phone = backendErrors.phone[0];
            }
            if (backendErrors.email) {
              mappedErrors.email = backendErrors.email[0];
            }
            if (backendErrors.total_employees) {
              mappedErrors.totalEmp = backendErrors.total_employees[0];
            }
            setErrors(mappedErrors);
            errorMessage = "Please fix the validation errors.";
          } else {
            errorMessage =
              backendErrors.message || backendErrors.detail || errorMessage;
          }
        } else if (error.response.status === 401) {
          errorMessage = "You are not authorized. Please log in again.";
        } else if (error.response.status === 403) {
          errorMessage = "You don't have permission to add departments.";
        } else if (error.response.status === 409) {
          errorMessage = "A department with this name already exists.";
        } else if (error.response.status >= 500) {
          errorMessage = "Server error. Please try again later.";
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = "Network error. Please check your connection.";
      }

      Alert.alert("Error", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    Alert.alert("Reset Form", "Are you sure you want to clear all fields?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Reset",
        style: "destructive",
        onPress: () => {
          setFormData({
            name: "",
            headOfDept: "",
            phone: "",
            email: "",
            totalEmp: "",
          });
          setErrors({});
        },
      },
    ]);
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors({ ...errors, [field]: null });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation?.goBack()}
            disabled={isSubmitting}
          >
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Add Department</Text>
            <Text style={styles.headerSubtitle}>Create a new department</Text>
          </View>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Icon Header */}
          <View style={styles.iconHeader}>
            <View style={styles.iconCircle}>
              <Ionicons name="business" size={48} color="#007AFF" />
            </View>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Department Information</Text>

            {/* Department Name */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Department Name <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.name && styles.inputError,
                ]}
              >
                <Ionicons
                  name="business-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.formInput}
                  value={formData.name}
                  onChangeText={(text) => updateField("name", text)}
                  placeholder="e.g., Computer Engineering"
                  placeholderTextColor="#999"
                  editable={!isSubmitting}
                />
              </View>
              {errors.name && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.name}</Text>
                </View>
              )}
            </View>

            {/* Head of Department */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>
                Head of Department <Text style={styles.required}>*</Text>
              </Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.headOfDept && styles.inputError,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.formInput}
                  value={formData.headOfDept}
                  onChangeText={(text) => updateField("headOfDept", text)}
                  placeholder="e.g., Dr. John Smith"
                  placeholderTextColor="#999"
                  editable={!isSubmitting}
                />
              </View>
              {errors.headOfDept && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.headOfDept}</Text>
                </View>
              )}
            </View>

            {/* Phone */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Phone Number</Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.phone && styles.inputError,
                ]}
              >
                <Ionicons
                  name="call-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.formInput}
                  value={formData.phone}
                  onChangeText={(text) => updateField("phone", text)}
                  placeholder="+123 4567890"
                  placeholderTextColor="#999"
                  keyboardType="phone-pad"
                  editable={!isSubmitting}
                />
              </View>
              {errors.phone && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.phone}</Text>
                </View>
              )}
            </View>

            {/* Email */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Email Address</Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.email && styles.inputError,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.formInput}
                  value={formData.email}
                  onChangeText={(text) => updateField("email", text)}
                  placeholder="department@example.com"
                  placeholderTextColor="#999"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  editable={!isSubmitting}
                />
              </View>
              {errors.email && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.email}</Text>
                </View>
              )}
            </View>

            {/* Total Employees */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Total Employees</Text>
              <View
                style={[
                  styles.inputContainer,
                  errors.totalEmp && styles.inputError,
                ]}
              >
                <Ionicons
                  name="people-outline"
                  size={20}
                  color="#666"
                  style={styles.inputIcon}
                />
                <TextInput
                  style={styles.formInput}
                  value={formData.totalEmp}
                  onChangeText={(text) => updateField("totalEmp", text)}
                  placeholder="0"
                  placeholderTextColor="#999"
                  keyboardType="numeric"
                  editable={!isSubmitting}
                />
              </View>
              {errors.totalEmp && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{errors.totalEmp}</Text>
                </View>
              )}
            </View>
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons name="information-circle" size={20} color="#007AFF" />
            <Text style={styles.infoText}>
              Fields marked with <Text style={styles.required}>*</Text> are
              required
            </Text>
          </View>
        </ScrollView>

        {/* Footer Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.resetButton, isSubmitting && styles.disabledButton]}
            onPress={handleReset}
            activeOpacity={0.7}
            disabled={isSubmitting}
          >
            <Ionicons
              name="refresh-outline"
              size={20}
              color={isSubmitting ? "#ccc" : "#666"}
            />
            <Text
              style={[
                styles.resetButtonText,
                isSubmitting && styles.disabledButtonText,
              ]}
            >
              Reset
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && styles.submittingButton,
            ]}
            onPress={handleSubmit}
            activeOpacity={0.7}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <ActivityIndicator size="small" color="#fff" />
                <Text style={styles.submitButtonText}>Adding...</Text>
              </>
            ) : (
              <>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.submitButtonText}>Add Department</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddDepartmentScreen;

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
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitleContainer: {
    flex: 1,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  headerSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  iconHeader: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: "#fff",
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
  },
  formSection: {
    backgroundColor: "#fff",
    marginTop: 12,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
    marginBottom: 8,
  },
  required: {
    color: "#EF4444",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 12,
  },
  inputError: {
    borderColor: "#EF4444",
    backgroundColor: "#FEF2F2",
  },
  inputIcon: {
    marginRight: 8,
  },
  formInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 15,
    color: "#222",
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
    marginLeft: 4,
    gap: 4,
  },
  errorText: {
    fontSize: 12,
    color: "#EF4444",
    flex: 1,
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E3F2FD",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#1976D2",
  },
  footer: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    gap: 6,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  submitButton: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    gap: 6,
  },
  submittingButton: {
    backgroundColor: "#0056b3",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
  disabledButton: {
    opacity: 0.5,
  },
  disabledButtonText: {
    color: "#ccc",
  },
});
