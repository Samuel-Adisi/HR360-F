import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,

    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

const EditEmployeeScreen = ({ visible, employee, onClose, onUpdate, onDelete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    employeeId: '',
    position: '',
    department: '',
    hireDate: '',
    employmentType: 'Full-time',
    workLocation: 'Office',
    managerId: '',
    salary: '',
    payFrequency: 'Bi-weekly',
    emergencyContact: '',
    emergencyPhone: '',
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load employee data when modal opens or employee changes
  useEffect(() => {
    if (employee && visible) {
      const nameParts = employee.name?.split(' ') || ['', ''];
      setFormData({
        firstName: nameParts[0] || '',
        lastName: nameParts.slice(1).join(' ') || '',
        email: employee.email || '',
        phone: employee.phone || '',
        dateOfBirth: employee.dateOfBirth || '',
        address: employee.address || '',
        city: employee.city || '',
        state: employee.state || '',
        zipCode: employee.zipCode || '',
        employeeId: employee.employeeId || '',
        position: employee.position || '',
        department: employee.department || '',
        hireDate: employee.hireDate || '',
        employmentType: employee.employmentType || 'Full-time',
        workLocation: employee.workLocation || 'Office',
        managerId: employee.managerId?.toString() || '',
        salary: employee.salary || '',
        payFrequency: employee.payFrequency || 'Bi-weekly',
        emergencyContact: employee.emergencyContact || '',
        emergencyPhone: employee.emergencyPhone || '',
        notes: employee.notes || '',
      });
      setHasChanges(false);
    }
  }, [employee, visible]);

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    } else if (step === 2) {
      if (!formData.position.trim()) newErrors.position = 'Position is required';
      if (!formData.department.trim()) newErrors.department = 'Department is required';
      if (!formData.hireDate.trim()) newErrors.hireDate = 'Hire date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleUpdate = () => {
    if (validateStep(currentStep)) {
      const updatedEmployee = {
        ...employee,
        name: `${formData.firstName} ${formData.lastName}`,
        ...formData,
        managerId: formData.managerId ? parseInt(formData.managerId) : null,
      };
      onUpdate(updatedEmployee);
      handleClose();
    }
  };

  const handleDeleteConfirm = () => {
    Alert.alert(
      'Delete Employee',
      `Are you sure you want to delete ${formData.firstName} ${formData.lastName}? This action cannot be undone.`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            onDelete(employee.id);
            handleClose();
          },
        },
      ]
    );
  };

  const handleClose = () => {
    if (hasChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to close?',
        [
          {
            text: 'Keep Editing',
            style: 'cancel',
          },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setCurrentStep(1);
              setErrors({});
              setHasChanges(false);
              onClose();
            },
          },
        ]
      );
    } else {
      setCurrentStep(1);
      setErrors({});
      onClose();
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
            <View style={[
              styles.stepCircle,
              currentStep >= step && styles.stepCircleActive,
              currentStep > step && styles.stepCircleComplete
            ]}>
              {currentStep > step ? (
                <Ionicons name="checkmark" size={16} color="#fff" />
              ) : (
                <Text style={[
                  styles.stepNumber,
                  currentStep >= step && styles.stepNumberActive
                ]}>
                  {step}
                </Text>
              )}
            </View>
            <Text style={[
              styles.stepLabel,
              currentStep >= step && styles.stepLabelActive
            ]}>
              {['Personal', 'Employment', 'Compensation', 'Additional'][index]}
            </Text>
          </TouchableOpacity>
          {step < 4 && (
            <View style={[
              styles.stepLine,
              currentStep > step && styles.stepLineActive
            ]} />
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
          options.multiline && styles.textArea
        ]}
        value={formData[field]}
        onChangeText={(text) => updateField(field, text)}
        placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
        keyboardType={options.keyboardType || 'default'}
        autoCapitalize={options.autoCapitalize || 'words'}
        autoCorrect={false}
        multiline={options.multiline}
        numberOfLines={options.numberOfLines || 1}
        textAlignVertical={options.multiline ? 'top' : 'center'}
        editable={!options.disabled}
      />
      {errors[field] && (
        <Text style={styles.errorText}>{errors[field]}</Text>
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
              formData[field] === option && styles.pickerOptionActive
            ]}
            onPress={() => updateField(field, option)}
          >
            <Text style={[
              styles.pickerOptionText,
              formData[field] === option && styles.pickerOptionTextActive
            ]}>
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderStep1 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Personal Information</Text>
      <Text style={styles.stepSubtitle}>Basic employee details</Text>
      
      <View style={styles.row}>
        {renderInput('First Name', 'firstName', { required: true, halfWidth: true })}
        {renderInput('Last Name', 'lastName', { required: true, halfWidth: true })}
      </View>
      
      {renderInput('Email Address', 'email', { 
        required: true, 
        keyboardType: 'email-address',
        autoCapitalize: 'none',
        placeholder: 'john.doe@company.com'
      })}
      
      {renderInput('Phone Number', 'phone', { 
        required: true, 
        keyboardType: 'phone-pad',
        placeholder: '+1 (555) 000-0000'
      })}
      
      {renderInput('Date of Birth', 'dateOfBirth', { 
        placeholder: 'YYYY-MM-DD',
        keyboardType: 'numeric'
      })}
      
      <View style={styles.divider} />
      
      {renderInput('Street Address', 'address', {
        placeholder: '123 Main Street'
      })}
      
      <View style={styles.row}>
        {renderInput('City', 'city', { halfWidth: true })}
        {renderInput('State', 'state', { halfWidth: true, placeholder: 'CA' })}
      </View>
      
      {renderInput('Zip Code', 'zipCode', { 
        keyboardType: 'numeric',
        placeholder: '12345'
      })}
    </ScrollView>
  );

  const renderStep2 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Employment Details</Text>
      <Text style={styles.stepSubtitle}>Job and department information</Text>
      
      {renderInput('Employee ID', 'employeeId', { 
        placeholder: 'Auto-generated or custom',
        autoCapitalize: 'characters',
        disabled: true
      })}
      
      {renderInput('Position/Job Title', 'position', { 
        required: true,
        placeholder: 'Senior Developer'
      })}
      
      {renderInput('Department', 'department', { 
        required: true,
        placeholder: 'Technology'
      })}
      
      {renderInput('Hire Date', 'hireDate', { 
        required: true,
        placeholder: 'YYYY-MM-DD',
        keyboardType: 'numeric'
      })}
      
      {renderPicker('Employment Type', 'employmentType', [
        'Full-time',
        'Part-time',
        'Contract',
        'Intern'
      ])}
      
      {renderPicker('Work Location', 'workLocation', [
        'Office',
        'Remote',
        'Hybrid'
      ])}
      
      {renderInput('Reports To (Manager ID)', 'managerId', { 
        keyboardType: 'numeric',
        placeholder: 'Optional - Enter manager ID'
      })}
    </ScrollView>
  );

  const renderStep3 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Compensation</Text>
      <Text style={styles.stepSubtitle}>Salary and payment details</Text>
      
      {renderInput('Annual Salary', 'salary', { 
        keyboardType: 'numeric',
        placeholder: '75000'
      })}
      
      {renderPicker('Pay Frequency', 'payFrequency', [
        'Weekly',
        'Bi-weekly',
        'Monthly',
        'Annual'
      ])}
      
      <View style={styles.infoBox}>
        <Ionicons name="lock-closed" size={16} color="#007AFF" />
        <Text style={styles.infoText}>
          Compensation information is confidential and securely stored
        </Text>
      </View>
    </ScrollView>
  );

  const renderStep4 = () => (
    <ScrollView style={styles.stepContent} showsVerticalScrollIndicator={false}>
      <Text style={styles.stepTitle}>Additional Information</Text>
      <Text style={styles.stepSubtitle}>Emergency contacts and notes</Text>
      
      {renderInput('Emergency Contact Name', 'emergencyContact', {
        placeholder: 'Jane Doe'
      })}
      
      {renderInput('Emergency Contact Phone', 'emergencyPhone', { 
        keyboardType: 'phone-pad',
        placeholder: '+1 (555) 000-0000'
      })}
      
      {renderInput('Additional Notes', 'notes', {
        multiline: true,
        numberOfLines: 4,
        placeholder: 'Any additional information about the employee...'
      })}
      
      <View style={styles.divider} />
      
      <TouchableOpacity 
        style={styles.deleteButton}
        onPress={handleDeleteConfirm}
      >
        <Ionicons name="trash-outline" size={20} color="#FF3B30" />
        <Text style={styles.deleteButtonText}>Delete Employee</Text>
      </TouchableOpacity>
      
      <Text style={styles.deleteWarning}>
        This action cannot be undone. All employee data will be permanently removed.
      </Text>
    </ScrollView>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1: return renderStep1();
      case 2: return renderStep2();
      case 3: return renderStep3();
      case 4: return renderStep4();
      default: return null;
    }
  };

  if (!employee) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#666" />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerTitle}>Edit Employee</Text>
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
                !hasChanges && styles.primaryButtonDisabled
              ]}
              onPress={currentStep < 4 ? handleNext : handleUpdate}
              disabled={!hasChanges && currentStep === 4}
            >
              <Text style={styles.primaryButtonText}>
                {currentStep < 4 ? 'Next' : 'Save Changes'}
              </Text>
              {currentStep < 4 && (
                <Ionicons name="chevron-forward" size={20} color="#fff" />
              )}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  closeButton: {
    padding: 4,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  changedIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF9500',
  },
  placeholder: {
    width: 36,
  },
  stepIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 16,
  },
  stepItem: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    marginBottom: 6,
  },
  stepCircleActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  stepCircleComplete: {
    backgroundColor: '#34C759',
    borderColor: '#34C759',
  },
  stepNumber: {
    fontSize: 14,
    fontWeight: '600',
    color: '#999',
  },
  stepNumberActive: {
    color: '#fff',
  },
  stepLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: '#007AFF',
    fontWeight: '500',
  },
  stepLine: {
    height: 2,
    backgroundColor: '#e0e0e0',
    position: 'absolute',
    top: 15,
    left: '50%',
    right: '-50%',
    zIndex: -1,
  },
  stepLineActive: {
    backgroundColor: '#34C759',
  },
  stepContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  halfWidth: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: '#222',
  },
  inputError: {
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 20,
  },
  pickerContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  pickerOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  pickerOptionTextActive: {
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    borderRadius: 12,
    padding: 14,
    marginTop: 8,
    gap: 10,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: '#007AFF',
    lineHeight: 18,
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  deleteWarning: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 16,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 6,
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  primaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 6,
  },
  primaryButtonFull: {
    flex: 2,
  },
  primaryButtonDisabled: {
    backgroundColor: '#B3D9FF',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default EditEmployeeScreen;