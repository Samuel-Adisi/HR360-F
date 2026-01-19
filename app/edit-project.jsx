import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Image,
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

const EditProjectScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [hasChanges, setHasChanges] = useState(false);

  // Dummy project data
  const [formData, setFormData] = useState({
    name: "MarQ Angular 6",
    clientName: "Donald Trump",
    clientEmail: "donald@client.com",
    clientPhone: "+1 555-0101",
    startDate: "2019-01-15",
    deadline: "2019-03-02",
    budget: "150000",
    status: "Active",
    priority: "High",
    category: "Web Development",
    description:
      "A comprehensive Angular 6 web application for marketing automation and customer relationship management.",
    progress: 35,
    teamLeader: "John Doe",
    teamMembers: [
      {
        id: 1,
        name: "John Doe",
        image: "https://i.pravatar.cc/150?img=12",
        role: "Team Leader",
      },
      {
        id: 2,
        name: "Jane Smith",
        image: "https://i.pravatar.cc/150?img=45",
        role: "Developer",
      },
      {
        id: 3,
        name: "Mike Brown",
        image: "https://i.pravatar.cc/150?img=33",
        role: "Designer",
      },
    ],
    notes:
      "Client prefers weekly updates. Critical milestone coming up in 2 weeks.",
  });

  const [errors, setErrors] = useState({});

  const statusOptions = [
    "Active",
    "Pending",
    "On Hold",
    "Completed",
    "Cancelled",
  ];
  const priorityOptions = ["Low", "Medium", "High", "Critical"];
  const categoryOptions = [
    "Web Development",
    "Mobile App",
    "Design",
    "Marketing",
    "Consulting",
  ];

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = "Project name is required";
      if (!formData.clientName.trim())
        newErrors.clientName = "Client name is required";
      if (formData.clientEmail && !/\S+@\S+\.\S+/.test(formData.clientEmail)) {
        newErrors.clientEmail = "Invalid email format";
      }
    } else if (step === 2) {
      if (!formData.startDate.trim())
        newErrors.startDate = "Start date is required";
      if (!formData.deadline.trim())
        newErrors.deadline = "Deadline is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleUpdate = () => {
    if (validateStep(currentStep)) {
      Alert.alert("Success", "Project updated successfully!", [
        {
          text: "OK",
          onPress: () => navigation?.goBack(),
        },
      ]);
    }
  };

  const handleDeleteConfirm = () => {
    Alert.alert(
      "Delete Project",
      `Are you sure you want to delete "${formData.name}"? This action cannot be undone.`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert("Deleted", "Project has been deleted");
            navigation?.goBack();
          },
        },
      ],
    );
  };

  const handleClose = () => {
    if (hasChanges) {
      Alert.alert(
        "Unsaved Changes",
        "You have unsaved changes. Are you sure you want to close?",
        [
          {
            text: "Keep Editing",
            style: "cancel",
          },
          {
            text: "Discard",
            style: "destructive",
            onPress: () => {
              setCurrentStep(1);
              setErrors({});
              setHasChanges(false);
              navigation?.goBack();
            },
          },
        ],
      );
    } else {
      navigation?.goBack();
    }
  };

  const renderStepIndicator = () => (
    <View style={styles.stepIndicator}>
      {[1, 2, 3, 4].map((step, index) => (
        <React.Fragment key={step}>
          <TouchableOpacity
            style={styles.stepItem}
            onPress={() => setCurrentStep(step)}
            activeOpacity={0.7}
          >
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
              {["Basic", "Timeline", "Team", "Details"][index]}
            </Text>
          </TouchableOpacity>
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
          options.disabled && styles.inputDisabled,
        ]}
        value={formData[field]?.toString()}
        onChangeText={(text) => updateField(field, text)}
        placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
        keyboardType={options.keyboardType || "default"}
        autoCapitalize={options.autoCapitalize || "words"}
        autoCorrect={false}
        multiline={options.multiline}
        numberOfLines={options.numberOfLines || 1}
        textAlignVertical={options.multiline ? "top" : "center"}
        editable={!options.disabled}
      />
      {errors[field] && <Text style={styles.errorText}>{errors[field]}</Text>}
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

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#34C759";
      case "Pending":
        return "#FF9500";
      case "On Hold":
        return "#FF3B30";
      case "Completed":
        return "#007AFF";
      case "Cancelled":
        return "#8E8E93";
      default:
        return "#999";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "#FF3B30";
      case "High":
        return "#FF9500";
      case "Medium":
        return "#007AFF";
      case "Low":
        return "#34C759";
      default:
        return "#999";
    }
  };

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Basic Information</Text>
      <Text style={styles.stepSubtitle}>Project and client details</Text>

      {renderInput("Project Name", "name", {
        required: true,
        placeholder: "e.g., MarQ Angular 6",
      })}

      <View style={styles.divider} />

      <Text style={styles.subsectionTitle}>Client Information</Text>

      {renderInput("Client Name", "clientName", {
        required: true,
        placeholder: "e.g., Donald Trump",
      })}

      {renderInput("Client Email", "clientEmail", {
        keyboardType: "email-address",
        autoCapitalize: "none",
        placeholder: "client@company.com",
      })}

      {renderInput("Client Phone", "clientPhone", {
        keyboardType: "phone-pad",
        placeholder: "+1 (555) 000-0000",
      })}

      <View style={styles.divider} />

      {renderPicker("Project Category", "category", categoryOptions)}
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Timeline & Budget</Text>
      <Text style={styles.stepSubtitle}>
        Project schedule and financial details
      </Text>

      <View style={styles.row}>
        {renderInput("Start Date", "startDate", {
          required: true,
          placeholder: "YYYY-MM-DD",
          keyboardType: "numeric",
          halfWidth: true,
        })}
        {renderInput("Deadline", "deadline", {
          required: true,
          placeholder: "YYYY-MM-DD",
          keyboardType: "numeric",
          halfWidth: true,
        })}
      </View>

      {renderInput("Budget ($)", "budget", {
        keyboardType: "numeric",
        placeholder: "150000",
      })}

      <View style={styles.divider} />

      {renderPicker("Status", "status", statusOptions, true)}
      {renderPicker("Priority", "priority", priorityOptions, true)}

      <View style={styles.divider} />

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Progress</Text>
        <View style={styles.progressControl}>
          <TouchableOpacity
            style={styles.progressButton}
            onPress={() =>
              updateField("progress", Math.max(0, formData.progress - 5))
            }
          >
            <Ionicons name="remove" size={20} color="#007AFF" />
          </TouchableOpacity>
          <View style={styles.progressDisplay}>
            <Text style={styles.progressText}>{formData.progress}%</Text>
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
          <TouchableOpacity
            style={styles.progressButton}
            onPress={() =>
              updateField("progress", Math.min(100, formData.progress + 5))
            }
          >
            <Ionicons name="add" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Team Management</Text>
      <Text style={styles.stepSubtitle}>
        Assign team members to the project
      </Text>

      {renderInput("Team Leader", "teamLeader", {
        placeholder: "Enter team leader name",
      })}

      <View style={styles.divider} />

      <Text style={styles.subsectionTitle}>
        Team Members ({formData.teamMembers.length})
      </Text>

      <View style={styles.teamList}>
        {formData.teamMembers.map((member) => (
          <View key={member.id} style={styles.teamMemberCard}>
            <Image source={{ uri: member.image }} style={styles.memberAvatar} />
            <View style={styles.memberInfo}>
              <Text style={styles.memberName}>{member.name}</Text>
              <Text style={styles.memberRole}>{member.role}</Text>
            </View>
            <TouchableOpacity
              style={styles.removeMemberButton}
              onPress={() => {
                const updated = formData.teamMembers.filter(
                  (m) => m.id !== member.id,
                );
                updateField("teamMembers", updated);
              }}
            >
              <Ionicons name="close-circle" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity style={styles.addMemberButton}>
        <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
        <Text style={styles.addMemberText}>Add Team Member</Text>
      </TouchableOpacity>

      <View style={styles.infoBox}>
        <Ionicons name="information-circle" size={16} color="#007AFF" />
        <Text style={styles.infoText}>
          You can add more team members or adjust their roles after saving
        </Text>
      </View>
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Additional Details</Text>
      <Text style={styles.stepSubtitle}>Description, notes, and actions</Text>

      {renderInput("Project Description", "description", {
        multiline: true,
        numberOfLines: 4,
        placeholder: "Provide a detailed description of the project...",
      })}

      {renderInput("Notes", "notes", {
        multiline: true,
        numberOfLines: 4,
        placeholder: "Any additional notes or important information...",
      })}

      <View style={styles.divider} />

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Project Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Name:</Text>
          <Text style={styles.summaryValue}>{formData.name}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Client:</Text>
          <Text style={styles.summaryValue}>{formData.clientName}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Deadline:</Text>
          <Text style={styles.summaryValue}>{formData.deadline}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Status:</Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getStatusColor(formData.status) },
            ]}
          />
          <Text
            style={[
              styles.summaryValue,
              { color: getStatusColor(formData.status) },
            ]}
          >
            {formData.status}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Priority:</Text>
          <View
            style={[
              styles.statusDot,
              { backgroundColor: getPriorityColor(formData.priority) },
            ]}
          />
          <Text
            style={[
              styles.summaryValue,
              { color: getPriorityColor(formData.priority) },
            ]}
          >
            {formData.priority}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Team:</Text>
          <Text style={styles.summaryValue}>
            {formData.teamMembers.length} members
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDeleteConfirm}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        <Text style={styles.deleteButtonText}>Delete Project</Text>
      </TouchableOpacity>

      <Text style={styles.deleteWarning}>
        This action cannot be undone. All project data will be permanently
        removed.
      </Text>
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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Ionicons name="arrow-back" size={24} color="#222" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>Edit Project</Text>
            {hasChanges && <View style={styles.changedIndicator} />}
          </View>
          <View style={styles.placeholder} />
        </View>

        {renderStepIndicator()}

        {renderStepContent()}

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
            onPress={currentStep < 4 ? handleNext : handleUpdate}
          >
            <Text style={styles.primaryButtonText}>
              {currentStep < 4 ? "Next" : "Save Changes"}
            </Text>
            {currentStep < 4 && (
              <Ionicons name="chevron-forward" size={20} color="#fff" />
            )}
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
  closeButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  changedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF9500",
  },
  placeholder: {
    width: 28,
  },
  stepIndicator: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 16,
  },
  stepItem: {
    alignItems: "center",
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#e0e0e0",
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  stepCircleComplete: {
    backgroundColor: "#34C759",
    borderColor: "#34C759",
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: "600",
    color: "#999",
  },
  stepNumberActive: {
    color: "#fff",
  },
  stepLabel: {
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },
  stepLabelActive: {
    color: "#007AFF",
    fontWeight: "500",
  },
  stepLine: {
    height: 2,
    backgroundColor: "#e0e0e0",
    position: "absolute",
    top: 15,
    left: "50%",
    right: "-50%",
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: "#34C759",
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#222",
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: "#888",
    marginBottom: 24,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
    marginBottom: 8,
  },
  required: {
    color: "#FF3B30",
  },
  input: {
    backgroundColor: "#f8f8f8",
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#222",
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#999",
  },
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  errorText: {
    fontSize: 12,
    color: "#FF3B30",
    marginTop: 4,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginVertical: 20,
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
  progressControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  progressButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  progressDisplay: {
    flex: 1,
    gap: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
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
  teamList: {
    gap: 12,
  },
  teamMemberCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  memberAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  memberRole: {
    fontSize: 13,
    color: "#666",
  },
  removeMemberButton: {
    padding: 4,
  },
  addMemberButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderStyle: "dashed",
    gap: 8,
    marginTop: 8,
  },
  addMemberText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#007AFF",
  },
  infoBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0F9FF",
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: "#007AFF",
    lineHeight: 18,
  },
  summaryCard: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
    width: 100,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
    flex: 1,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF5F5",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FFE5E5",
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FF3B30",
  },
  deleteWarning: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginTop: 8,
    lineHeight: 16,
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
    color: "#007AFF",
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
  primaryButtonFull: {
    flex: 2,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});
