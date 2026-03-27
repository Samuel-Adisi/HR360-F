import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Animated,
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
  View,
} from "react-native";
import api from "../../../src/services/api";

// ─── THEME ────────────────────────────────────────────────────
const T = {
  bg: "#F8FAFC",
  white: "#FFFFFF",
  navy: "#0F172A",
  text: "#1E293B",
  textSub: "#475569",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  blue: "#0A66C2",
  blueSoft: "#EFF6FF",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  red: "#DC2626",
  redSoft: "#FEF2F2",
};

// ─── SUCCESS TOAST ────────────────────────────────────────────
const SuccessToast = ({ visible, message }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View style={[st.toast, { opacity, transform: [{ translateY }] }]}>
      <View style={st.iconWrap}>
        <Ionicons name="checkmark" size={16} color="#fff" />
      </View>
      <Text style={st.toastTxt}>{message}</Text>
    </Animated.View>
  );
};

// ─── ERROR TOAST ──────────────────────────────────────────────
const ErrorToast = ({ visible, message }) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  React.useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: -20,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      style={[
        st.toast,
        st.toastError,
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <View style={[st.iconWrap, { backgroundColor: T.red }]}>
        <Ionicons name="close" size={16} color="#fff" />
      </View>
      <Text style={[st.toastTxt, { color: T.red }]} numberOfLines={2}>
        {message}
      </Text>
    </Animated.View>
  );
};

const st = StyleSheet.create({
  toast: {
    position: "absolute",
    top: 12,
    left: 16,
    right: 16,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: T.greenSoft,
    shadowColor: T.green,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  toastError: { borderColor: "#FECACA" },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: T.green,
    alignItems: "center",
    justifyContent: "center",
  },
  toastTxt: { flex: 1, fontSize: 13, fontWeight: "700", color: T.green },
});

// ─── MAIN SCREEN ──────────────────────────────────────────────
export default function AddEmployeeScreen() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successVisible, setSuccessVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

  const showSuccess = (msg = "Employee created successfully!") => {
    setSuccessVisible(true);
    setTimeout(() => {
      setSuccessVisible(false);
      setTimeout(() => router.replace("employees"), 300);
    }, 3000);
  };

  const showError = (msg) => {
    setErrorMessage(msg);
    setErrorVisible(true);
    setTimeout(() => setErrorVisible(false), 3500);
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step) => {
    const e = {};
    if (step === 1) {
      if (!formData.firstName.trim()) e.firstName = "First name is required";
      if (!formData.lastName.trim()) e.lastName = "Last name is required";
      if (!formData.email.trim()) {
        e.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        e.email = "Invalid email format";
      }
      if (!formData.phone.trim()) e.phone = "Phone is required";
    } else if (step === 2) {
      if (!formData.position.trim()) e.position = "Position is required";
      if (!formData.department.trim()) e.department = "Department is required";
      if (!formData.hireDate.trim()) e.hireDate = "Hire date is required";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep((p) => p + 1);
  };

  const handleBack = () => setCurrentStep((p) => p - 1);

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;
    setIsSubmitting(true);
    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        date_of_birth: formData.dateOfBirth || null,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        employee_id: formData.employeeId || undefined,
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

      await api.post("/api/employees/", payload);
      showSuccess("Employee added successfully!");
    } catch (err) {
      const data = err.response?.data;
      let msg = "Failed to create employee. Please try again.";
      if (data) {
        if (typeof data === "string") {
          msg = data;
        } else if (data.detail) {
          msg = data.detail;
        } else {
          const fieldErrors = Object.entries(data)
            .map(([k, v]) => `${k}: ${Array.isArray(v) ? v[0] : v}`)
            .join("\n");
          if (fieldErrors) msg = fieldErrors;
        }
      }
      showError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const onDateChange = (event, selectedDate) => {
    if (Platform.OS === "android") {
      setShowDatePicker(false);
      if (event.type === "dismissed") return;
    }
    if (selectedDate) {
      setDatePickerDate(selectedDate);
      updateField("dateOfBirth", selectedDate.toISOString().split("T")[0]);
    }
  };

  // ── Step indicator ─────────────────────────────────────────
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

  // ── Field helpers ──────────────────────────────────────────
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
        onChangeText={(t) => updateField(field, t)}
        placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor="#94A3B8"
        keyboardType={options.keyboardType || "default"}
        autoCapitalize={options.autoCapitalize || "words"}
        autoCorrect={false}
        multiline={options.multiline}
        numberOfLines={options.numberOfLines || 1}
        textAlignVertical={options.multiline ? "top" : "center"}
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
          color={T.blue}
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
      {showDatePicker && Platform.OS === "ios" && (
        <View style={styles.iosPickerCard}>
          <DateTimePicker
            value={datePickerDate}
            mode="date"
            display="spinner"
            onChange={onDateChange}
            maximumDate={new Date()}
            style={styles.iosPicker}
            textColor={T.text}
          />
          <TouchableOpacity
            style={styles.iosPickerDone}
            onPress={() => setShowDatePicker(false)}
          >
            <Text style={styles.iosPickerDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
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
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={[
              styles.pickerOption,
              formData[field] === opt && styles.pickerOptionActive,
            ]}
            onPress={() => updateField(field, opt)}
          >
            <Text
              style={[
                styles.pickerOptionText,
                formData[field] === opt && styles.pickerOptionTextActive,
              ]}
            >
              {opt}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  // ── Steps ──────────────────────────────────────────────────
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
        <Ionicons name="lock-closed" size={16} color={T.blue} />
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
        placeholder: "Any additional information...",
      })}
      <View
        style={[
          styles.infoBox,
          { borderColor: T.greenSoft, backgroundColor: T.greenSoft },
        ]}
      >
        <Ionicons name="checkmark-circle" size={16} color={T.green} />
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

  // ── Render ─────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <SuccessToast
        visible={successVisible}
        message="Employee added successfully! 🎉"
      />
      <ErrorToast visible={errorVisible} message={errorMessage} />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={T.textSub} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.headerIcon}>
            <Ionicons name="person-add" size={16} color={T.blue} />
          </View>
          <Text style={styles.headerTitle}>Add Employee</Text>
        </View>
        <View style={{ width: 36 }} />
      </View>

      {/* ✅ TouchableWithoutFeedback removed — was blocking keyboard */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {renderStepIndicator()}
        {renderStepContent()}

        <View style={styles.footer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.secondaryBtn}
              onPress={handleBack}
              disabled={isSubmitting}
            >
              <Ionicons name="chevron-back" size={20} color={T.blue} />
              <Text style={styles.secondaryBtnTxt}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[
              styles.primaryBtn,
              currentStep === 1 && styles.primaryBtnFull,
              isSubmitting && { opacity: 0.7 },
            ]}
            onPress={currentStep < 4 ? handleNext : handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <View style={styles.spinnerRing} />
                <Text style={styles.primaryBtnTxt}>Saving…</Text>
              </View>
            ) : (
              <>
                <Text style={styles.primaryBtnTxt}>
                  {currentStep < 4 ? "Next" : "Submit"}
                </Text>
                {currentStep < 4 && (
                  <Ionicons name="chevron-forward" size={20} color="#fff" />
                )}
              </>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  headerCenter: { flexDirection: "row", alignItems: "center", gap: 8 },
  headerIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 16, fontWeight: "800", color: "#1E293B" },
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
  stepCircleActive: { backgroundColor: "#0A66C2", borderColor: "#0A66C2" },
  stepCircleComplete: { backgroundColor: "#16A34A", borderColor: "#16A34A" },
  stepNumber: { fontSize: 14, fontWeight: "600", color: "#94A3B8" },
  stepNumberActive: { color: "#fff" },
  stepLabel: { fontSize: 11, color: "#94A3B8", textAlign: "center" },
  stepLabelActive: { color: "#0A66C2", fontWeight: "600" },
  stepLine: {
    height: 2,
    backgroundColor: "#E2E8F0",
    position: "absolute",
    top: 15,
    left: "50%",
    right: "-50%",
    zIndex: -1,
  },
  stepLineActive: { backgroundColor: "#16A34A" },
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
  iosPickerDoneText: { fontSize: 15, fontWeight: "700", color: "#0A66C2" },
  pickerContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  pickerOptionActive: { backgroundColor: "#0A66C2", borderColor: "#0A66C2" },
  pickerOptionText: { fontSize: 13, color: "#64748B", fontWeight: "600" },
  pickerOptionTextActive: { color: "#fff" },
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
  footer: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#fff",
  },
  secondaryBtn: {
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
  secondaryBtnTxt: { fontSize: 15, fontWeight: "700", color: "#0A66C2" },
  primaryBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0A66C2",
    paddingVertical: 15,
    borderRadius: 12,
    gap: 6,
  },
  primaryBtnFull: { flex: 2 },
  primaryBtnTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
  spinnerRing: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.35)",
    borderTopColor: "#fff",
  },
});
