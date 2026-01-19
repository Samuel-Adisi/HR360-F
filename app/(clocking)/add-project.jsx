import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
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
} from 'react-native';

const AddProjectScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    clientName: '',
    deadline: '',
    status: 'Active',
    progress: 0,
    description: '',
    budget: '',
    startDate: '',
    priority: 'Medium',
    category: '',
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active': return '#34C759';
      case 'Pending': return '#FF9500';
      case 'Closed': return '#FF3B30';
      case 'On Hold': return '#8E8E93';
      default: return '#999';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case 'Active': return '#E8F5E9';
      case 'Pending': return '#FFF3E0';
      case 'Closed': return '#FFEBEE';
      case 'On Hold': return '#F5F5F5';
      default: return '#f5f5f5';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#FF3B30';
      case 'Medium': return '#FF9500';
      case 'Low': return '#34C759';
      default: return '#999';
    }
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      Alert.alert('Validation Error', 'Please enter a project name');
      return false;
    }
    if (!formData.clientName.trim()) {
      Alert.alert('Validation Error', 'Please enter a client name');
      return false;
    }
    if (!formData.startDate.trim()) {
      Alert.alert('Validation Error', 'Please enter a start date');
      return false;
    }
    if (!formData.deadline.trim()) {
      Alert.alert('Validation Error', 'Please enter a deadline');
      return false;
    }
    return true;
  };

  const handleSave = () => {
    if (validateForm()) {
      Alert.alert(
        'Success',
        'Project created successfully!',
        [
          {
            text: 'OK',
            onPress: () => {
              // Reset form
              setFormData({
                name: '',
                clientName: '',
                deadline: '',
                status: 'Active',
                progress: 0,
                description: '',
                budget: '',
                startDate: '',
                priority: 'Medium',
                category: '',
              });
            },
          },
        ]
      );
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Discard Project',
      'Are you sure you want to discard this project?',
      [
        { text: 'Keep Editing', style: 'cancel' },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: () => {
            setFormData({
              name: '',
              clientName: '',
              deadline: '',
              status: 'Active',
              progress: 0,
              description: '',
              budget: '',
              startDate: '',
              priority: 'Medium',
              category: '',
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
        style={[
          styles.input,
          options.multiline && styles.textArea
        ]}
        value={formData[field]?.toString()}
        onChangeText={(text) => updateField(field, text)}
        placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
        placeholderTextColor="#999"
        keyboardType={options.keyboardType || 'default'}
        multiline={options.multiline}
        numberOfLines={options.numberOfLines || 1}
      />
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
              field === 'status' && formData[field] === option && {
                backgroundColor: getStatusBgColor(option),
                borderColor: getStatusColor(option),
              },
              field === 'priority' && formData[field] === option && {
                borderColor: getPriorityColor(option),
                borderWidth: 2,
              }
            ]}
            onPress={() => updateField(field, option)}
          >
            <Text style={[
              styles.pickerOptionText,
              formData[field] === option && styles.pickerOptionTextActive,
              field === 'status' && formData[field] === option && {
                color: getStatusColor(option),
              },
              field === 'priority' && formData[field] === option && {
                color: getPriorityColor(option),
              }
            ]}>
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
            updateField('progress', Math.min(100, Math.max(0, num)));
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
              backgroundColor: getStatusColor(formData.status)
            }
          ]}
        />
      </View>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Project Information</Text>
            
            {renderInput('Project Name', 'name', { 
              placeholder: 'Enter project name',
              required: true 
            })}
            
            {renderInput('Client Name', 'clientName', { 
              placeholder: 'Enter client name',
              required: true 
            })}
            
            {renderInput('Category', 'category', { 
              placeholder: 'e.g., Web Development, Mobile App' 
            })}
            
            {renderPicker('Status', 'status', ['Active', 'Pending', 'On Hold', 'Closed'], true)}
            
            {renderPicker('Priority', 'priority', ['High', 'Medium', 'Low'], true)}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Timeline & Budget</Text>
            
            {renderInput('Start Date', 'startDate', { 
              placeholder: 'DD-MM-YYYY',
              keyboardType: 'numeric',
              required: true
            })}
            
            {renderInput('Deadline', 'deadline', { 
              placeholder: 'DD-MM-YYYY',
              keyboardType: 'numeric',
              required: true
            })}
            
            {renderInput('Budget', 'budget', { 
              placeholder: '$0.00',
              keyboardType: 'numeric'
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
            {renderInput('Project Description', 'description', {
              multiline: true,
              numberOfLines: 5,
              placeholder: 'Enter project description, goals, and objectives...'
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
          
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleSave}
          >
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
  headerButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  content: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#444',
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
    fontSize: 14,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
  },
  textArea: {
    minHeight: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
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
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sliderInput: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#222',
    marginRight: 8,
  },
  sliderPercent: {
    fontSize: 15,
    color: '#666',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  helperText: {
    fontSize: 13,
    color: '#666',
    marginTop: 8,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F7FF',
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
    color: '#007AFF',
    lineHeight: 20,
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
    color: '#666',
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
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default AddProjectScreen;