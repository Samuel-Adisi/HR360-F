import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

import api from "../../src/services/api";

export default function AddEmployeeScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    employeeId: "",
    position: "",
    department: "",
    hireDate: "",
    employmentType: "Full-time",
    workLocation: "Office",
    managerId: "",
    salary: "",
    payFrequency: "Bi-weekly",
    emergencyContact: "",
    emergencyPhone: "",
    notes: "",
  });

  const [errors, setErrors] = useState({});

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.firstName.trim())
        newErrors.firstName = "First name is required";
      if (!formData.lastName.trim())
        newErrors.lastName = "Last name is required";
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    } else if (step === 2) {
      if (!formData.position.trim())
        newErrors.position = "Position is required";
      if (!formData.department.trim())
        newErrors.department = "Department is required";
      if (!formData.hireDate.trim())
        newErrors.hireDate = "Hire date is required";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (validateStep(currentStep)) {
      try {
        const employeeData = {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          date_of_birth: formData.dateOfBirth || null,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zip_code: formData.zipCode,
          employee_id: formData.employeeId,
          position: formData.position,
          department: formData.department,
          hire_date: formData.hireDate,
          employment_type: formData.employmentType,
          work_location: formData.workLocation,
          manager: formData.managerId || null,
          salary: formData.salary || null,
          pay_frequency: formData.payFrequency,
          emergency_contact: formData.emergencyContact,
          emergency_phone: formData.emergencyPhone,
          notes: formData.notes,
        };

        const res = await api.post("/api/addEmployee", employeeData);
        if (res.status === 201) {
          Alert.alert("Success", "Employee created successfully!", [
            { text: "OK", onPress: () => router.push("./all-employees") },
          ]);
        }
      } catch (error) {
        const errorMessage = error.response?.data?.errors
          ? JSON.stringify(error.response.data.errors)
          : error.response?.data?.message || "Failed to create employee";
        Alert.alert("Error", errorMessage);
      }
    }
  };

  // ── Date picker ──
  // Called on every slide/change event — always commit the date immediately
  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "dismissed") return;
    }
    if (selectedDate) {
      setDatePickerDate(selectedDate);
      const formatted = selectedDate.toISOString().split("T")[0];
      updateField("dateOfBirth", formatted);
    }
  };

  const confirmIOSDate = () => setShowDatePicker(false);

  // ─────────────────────────────────────────────────────────────
  //  STEP INDICATOR
  // ─────────────────────────────────────────────────────────────

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step, index) => (
        <React.Fragment key={step}>
          <View style={styles.stepItem}>
            <View
              style={[
                styles.stepCircle,
                currentStep >= step && styles.stepCircleActive,
                currentStep > step && styles.stepCircleComplete,
              ]}
            >
              {currentStep > step ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : (
                <Text
                  style={[
                    styles.stepNumber,
                    currentStep >= step && styles.stepNumberActive,
                  ]}
                >
                  {step}
                </Text>
              )}
            </View>
            <Text
              style={[
                styles.stepLabel,
                currentStep >= step && styles.stepLabelActive,
              ]}
            >
              {["Personal", "Employment", "Compensation", "Additional"][index]}
            </Text>
          </View>
          {step < 4 && (
            <View
              style={[
                styles.stepLine,
                currentStep > step && styles.stepLineActive,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  // ─────────────────────────────────────────────────────────────
  //  FIELD RENDERERS
  // ─────────────────────────────────────────────────────────────

  const renderInput = (label, field, options = {}) => (
    <View style={[styles.inputGroup, options.halfWidth && styles.halfWidth]}>
      <Text style={styles.inputLabel}>
        {label}
        {options.required && <Text style={styles.required}> *</Text>}
      </Text>
      <TextInput
        style={[
          styles.input,
          errors[field] && styles.inputError,
          options.multiline && styles.textArea,
        ]}
        value={formData[field]}
        onChangeText={(text) => updateField(field, text)}
        placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
        keyboardType={options.keyboardType || "default"}
        autoCapitalize={options.autoCapitalize || "words"}
        autoCorrect={false}
        multiline={options.multiline}
        numberOfLines={options.numberOfLines || 1}
        textAlignVertical={options.multiline ? "top" : "center"}
        placeholderTextColor="#94A3B8"
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
    </View>
  );

  const renderDOBField = () => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>Date of Birth</Text>
      <TouchableOpacity
        style={styles.datePickerBtn}
        onPress={() => {
          Keyboard.dismiss();
          setShowDatePicker(true);
        }}
        activeOpacity={0.7}
      >
        <Ionicons
          name="calendar-outline"
          size={18}
          color="#007AFF"
          style={{ marginRight: 8 }}
        />
        <Text
          style={[
            styles.datePickerText,
            !formData.dateOfBirth && styles.datePickerPlaceholder,
          ]}
        >
          {formData.dateOfBirth || "Select date of birth"}
        </Text>
        <Ionicons name="chevron-down" size={16} color="#94A3B8" />
      </TouchableOpacity>

      {/* iOS inline picker */}
      {showDatePicker && Platform.OS === "ios" && (
        <View style={styles.iosPickerCard}>
          <DateTimePicker
            value={datePickerDate}
            mode="date"
            display="spinner"
            onChange={onDateChange}
            maximumDate={new Date()}
            style={styles.iosPicker}
            textColor="#1E293B"
          />
          <TouchableOpacity
            style={styles.iosPickerDone}
            onPress={confirmIOSDate}
          >
            <Text style={styles.iosPickerDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Android native dialog */}
      {showDatePicker && Platform.OS === "android" && (
        <DateTimePicker
          value={datePickerDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}
    </View>
  );

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
            ]}
            onPress={() => updateField(field, option)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                formData[field] === option && styles.pickerOptionTextActive,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // ─────────────────────────────────────────────────────────────
  //  STEP SCREENS
  // ─────────────────────────────────────────────────────────────

  const renderStep1 = () => (
    <ScrollView
      style={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={Keyboard.dismiss}
    >
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Basic employee details</Text>

      <View style={styles.row}>
        {renderInput("First Name", "firstName", {
          required: true,
          halfWidth: true,
        })}
        {renderInput("Last Name", "lastName", {
          required: true,
          halfWidth: true,
        })}
      </View>

      {renderInput("Email Address", "email", {
        required: true,
        keyboardType: "email-address",
        autoCapitalize: "none",
        placeholder: "john.doe@company.com",
      })}

      {renderInput("Phone Number", "phone", {
        required: true,
        keyboardType: "phone-pad",
        placeholder: "+1 (555) 000-0000",
      })}

      {renderDOBField()}

      <View style={styles.divider} />

      {renderInput("Street Address", "address", {
        placeholder: "123 Main Street",
      })}

      <View style={styles.row}>
        {renderInput("City", "city", { halfWidth: true })}
        {renderInput("State", "state", { halfWidth: true, placeholder: "CA" })}
      </View>

      {renderInput("Zip Code", "zipCode", {
        keyboardType: "numeric",
        placeholder: "12345",
      })}

      <View style={{ height: 32 }} />
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView
      style={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={Keyboard.dismiss}
    >
      <Text style={styles.stepTitle}>Employment Details</Text>
      <Text style={styles.stepSubtitle}>Job and department information</Text>

      {renderInput("Employee ID", "employeeId", {
        placeholder: "Auto-generated or custom",
        autoCapitalize: "characters",
      })}
      {renderInput("Position / Job Title", "position", {
        required: true,
        placeholder: "Senior Developer",
      })}
      {renderInput("Department", "department", {
        required: true,
        placeholder: "Technology",
      })}
      {renderInput("Hire Date", "hireDate", {
        required: true,
        placeholder: "YYYY-MM-DD",
        keyboardType: "numeric",
      })}
      {renderPicker("Employment Type", "employmentType", [
        "Full-time",
        "Part-time",
        "Contract",
        "Intern",
      ])}
      {renderPicker("Work Location", "workLocation", [
        "Office",
        "Remote",
        "Hybrid",
      ])}
      {renderInput("Reports To (Manager ID)", "managerId", {
        keyboardType: "numeric",
        placeholder: "Optional — Enter manager ID",
      })}

      <View style={{ height: 32 }} />
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView
      style={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={Keyboard.dismiss}
    >
      <Text style={styles.stepTitle}>Compensation</Text>
      <Text style={styles.stepSubtitle}>Salary and payment details</Text>

      {renderInput("Annual Salary", "salary", {
        keyboardType: "numeric",
        placeholder: "75000",
      })}
      {renderPicker("Pay Frequency", "payFrequency", [
        "Weekly",
        "Bi-weekly",
        "Monthly",
        "Annual",
      ])}

      <View style={styles.infoBox}>
        <Ionicons name="lock-closed" size={16} color="#007AFF" />
        <Text style={styles.infoText}>
          Compensation information is confidential and securely stored
        </Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView
      style={styles.stepContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
      onScrollBeginDrag={Keyboard.dismiss}
    >
      <Text style={styles.stepTitle}>Additional Information</Text>
      <Text style={styles.stepSubtitle}>Emergency contacts and notes</Text>

      {renderInput("Emergency Contact Name", "emergencyContact", {
        placeholder: "Jane Doe",
      })}
      {renderInput("Emergency Contact Phone", "emergencyPhone", {
        keyboardType: "phone-pad",
        placeholder: "+1 (555) 000-0000",
      })}
      {renderInput("Additional Notes", "notes", {
        multiline: true,
        numberOfLines: 4,
        placeholder: "Any additional information about the employee...",
      })}

      <View style={styles.infoBox}>
        <Ionicons name="checkmark-circle" size={16} color="#10B981" />
        <Text style={[styles.infoText, { color: "#065F46" }]}>
          Review all information before submitting
        </Text>
      </View>

      <View style={{ height: 32 }} />
    </ScrollView>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return null;
    }
  };

  // ─────────────────────────────────────────────────────────────
  //  RENDER
  // ─────────────────────────────────────────────────────────────

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Navbar (matches all-employees style) ── */}
      <View style={styles.navbar}>
        <TouchableOpacity
          style={styles.navBackBtn}
          onPress={() => router.push("./all-employees")}
        >
          <Ionicons name="chevron-back" size={22} color="#334155" />
        </TouchableOpacity>
        <View
          style={styles.navLogo}
          styles={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.logoCircle}>
            <Ionicons name="person-add" size={18} color="#007AFF" />
          </View>
          <Text style={styles.logoText}>Add Employee</Text>
        </View>
      </View>

      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.flex}
        >
          {renderStepIndicator()}
          {renderStepContent()}

          {/* ── Footer ── */}
          <View style={styles.footer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleBack}
              >
                <Ionicons name="chevron-back" size={20} color="#007AFF" />
                <Text style={styles.secondaryButtonText}>Back</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={[
                styles.primaryButton,
                currentStep === 1 && styles.primaryButtonFull,
              ]}
              onPress={currentStep < 4 ? handleNext : handleSubmit}
            >
              <Text style={styles.primaryButtonText}>
                {currentStep < 4 ? "Next" : "Submit"}
              </Text>
              {currentStep < 4 && (
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  flex: { flex: 1 },

  // ── Navbar ──
  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  navBackBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  navLogo: { flexDirection: "row", alignItems: "center", gap: 8 },
  logoCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { fontSize: 15, fontWeight: "800", color: "#1E293B" },
  navAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#E2E8F0",
  },

  // ── Step Indicator ──
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  stepItem: { alignItems: "center", flex: 1 },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    marginBottom: 6,
  },
  stepCircleActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  stepCircleComplete: { backgroundColor: "#10B981", borderColor: "#10B981" },
  stepNumber: { fontSize: 14, fontWeight: "600", color: "#94A3B8" },
  stepNumberActive: { color: "#fff" },
  stepLabel: { fontSize: 11, color: "#94A3B8", textAlign: "center" },
  stepLabelActive: { color: "#007AFF", fontWeight: "600" },
  stepLine: {
    height: 2,
    backgroundColor: "#E2E8F0",
    position: "absolute",
    top: 15,
    left: "50%",
    right: "-50%",
    zIndex: -1,
  },
  stepLineActive: { backgroundColor: "#10B981" },

  // ── Form ──
  stepContent: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  stepTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 4,
  },
  stepSubtitle: { fontSize: 13, color: "#94A3B8", marginBottom: 24 },
  inputGroup: { marginBottom: 18 },
  halfWidth: { flex: 1 },
  inputLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 7,
  },
  required: { color: "#EF4444" },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: "#1E293B",
  },
  inputError: { borderColor: "#EF4444", backgroundColor: "#FFF5F5" },
  textArea: { minHeight: 100, paddingTop: 13 },
  errorText: { fontSize: 12, color: "#EF4444", marginTop: 4 },
  row: { flexDirection: "row", gap: 12 },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 18 },

  // ── Date Picker ──
  datePickerBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
  },
  datePickerText: { flex: 1, fontSize: 14, color: "#1E293B" },
  datePickerPlaceholder: { color: "#94A3B8" },
  iosPickerCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginTop: 8,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
  },
  iosPicker: { height: 200 },
  iosPickerDone: {
    alignItems: "flex-end",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
  },
  iosPickerDoneText: { fontSize: 15, fontWeight: "700", color: "#007AFF" },

  // ── Picker Chips ──
  pickerContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pickerOptionActive: { backgroundColor: "#007AFF", borderColor: "#007AFF" },
  pickerOptionText: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  pickerOptionTextActive: { color: "#fff" },

  // ── Info Box ──
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 10,
  },
  infoText: { flex: 1, fontSize: 13, color: "#1D4ED8", lineHeight: 18 },

  // ── Footer ──
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#fff",
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#EFF6FF",
    paddingVertical: 15,
    borderRadius: 12,
    gap: 6,
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  secondaryButtonText: { fontSize: 15, fontWeight: "700", color: "#007AFF" },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    borderRadius: 12,
    gap: 6,
  },
  primaryButtonFull: { flex: 2 },
  primaryButtonText: { fontSize: 15, fontWeight: "700", color: "#fff" },
});
