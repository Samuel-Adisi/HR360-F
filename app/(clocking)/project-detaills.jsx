import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
    Alert,
    Image,
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

const ProjectDetailScreen = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [currentTab, setCurrentTab] = useState('overview');
  
  // Dummy project data - always visible
  const dummyProject = {
    id: 1,
    name: 'E-Commerce Website Redesign',
    clientName: 'TechCorp Solutions',
    deadline: '15-02-2025',
    status: 'Active',
    progress: 65,
    description: 'Complete redesign of the company\'s e-commerce platform with focus on user experience, mobile responsiveness, and conversion optimization. The project includes new payment gateway integration, inventory management system, and customer analytics dashboard.',
    budget: '$45,000',
    startDate: '01-12-2024',
    priority: 'High',
    category: 'Web Development',
    teamCount: 6,
    teamMembers: [
      { id: 1, name: 'Sarah Chen', role: 'Project Manager', image: 'https://i.pravatar.cc/150?img=1' },
      { id: 2, name: 'Marcus Johnson', role: 'Lead Developer', image: 'https://i.pravatar.cc/150?img=13' },
      { id: 3, name: 'Emily Rodriguez', role: 'UI/UX Designer', image: 'https://i.pravatar.cc/150?img=5' },
    ]
  };

  const [formData, setFormData] = useState({
    name: dummyProject.name,
    clientName: dummyProject.clientName,
    deadline: dummyProject.deadline,
    status: dummyProject.status,
    progress: dummyProject.progress,
    description: dummyProject.description,
    budget: dummyProject.budget,
    startDate: dummyProject.startDate,
    priority: dummyProject.priority,
    category: dummyProject.category,
  });

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
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

  const handleSave = () => {
    setHasChanges(false);
    setIsEditing(false);
    Alert.alert('Success', 'Project updated successfully');
  };

  const handleCancel = () => {
    if (hasChanges) {
      Alert.alert(
        'Discard Changes',
        'Are you sure you want to discard your changes?',
        [
          { text: 'Keep Editing', style: 'cancel' },
          {
            text: 'Discard',
            style: 'destructive',
            onPress: () => {
              setFormData({
                name: dummyProject.name,
                clientName: dummyProject.clientName,
                deadline: dummyProject.deadline,
                status: dummyProject.status,
                progress: dummyProject.progress,
                description: dummyProject.description,
                budget: dummyProject.budget,
                startDate: dummyProject.startDate,
                priority: dummyProject.priority,
                category: dummyProject.category,
              });
              setHasChanges(false);
              setIsEditing(false);
            },
          },
        ]
      );
    } else {
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Project',
      `Are you sure you want to delete "${formData.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Deleted', 'Project has been deleted');
          },
        },
      ]
    );
  };

  const renderInput = (label, field, options = {}) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      {isEditing ? (
        <TextInput
          style={[
            styles.input,
            options.multiline && styles.textArea
          ]}
          value={formData[field]?.toString()}
          onChangeText={(text) => updateField(field, text)}
          placeholder={options.placeholder || `Enter ${label.toLowerCase()}`}
          keyboardType={options.keyboardType || 'default'}
          multiline={options.multiline}
          numberOfLines={options.numberOfLines || 1}
          editable={isEditing}
        />
      ) : (
        <Text style={styles.inputValue}>
          {formData[field] || 'Not set'}
        </Text>
      )}
    </View>
  );

  const renderPicker = (label, field, options) => (
    <View style={styles.inputGroup}>
      <Text style={styles.inputLabel}>{label}</Text>
      {isEditing ? (
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
                }
              ]}
              onPress={() => updateField(field, option)}
            >
              <Text style={[
                styles.pickerOptionText,
                formData[field] === option && styles.pickerOptionTextActive,
                field === 'status' && formData[field] === option && {
                  color: getStatusColor(option),
                }
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <View style={[
          styles.badge,
          field === 'status' && { backgroundColor: getStatusBgColor(formData[field]) }
        ]}>
          <Text style={[
            styles.badgeText,
            field === 'status' && { color: getStatusColor(formData[field]) },
            field === 'priority' && { color: getPriorityColor(formData[field]) }
          ]}>
            {formData[field]}
          </Text>
        </View>
      )}
    </View>
  );

  const renderProgressSlider = () => (
    <View style={styles.inputGroup}>
      <View style={styles.progressHeader}>
        <Text style={styles.inputLabel}>Progress</Text>
        <Text style={styles.progressValue}>{formData.progress}%</Text>
      </View>
      {isEditing ? (
        <>
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
        </>
      ) : (
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
      )}
    </View>
  );

  const renderOverviewTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Information</Text>
        
        {renderInput('Project Name', 'name', { placeholder: 'Enter project name' })}
        {renderInput('Client Name', 'clientName', { placeholder: 'Enter client name' })}
        {renderInput('Category', 'category', { placeholder: 'e.g., Web Development, Mobile App' })}
        {renderPicker('Status', 'status', ['Active', 'Pending', 'On Hold', 'Closed'])}
        {renderPicker('Priority', 'priority', ['High', 'Medium', 'Low'])}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Timeline & Budget</Text>
        
        {renderInput('Start Date', 'startDate', { 
          placeholder: 'DD-MM-YYYY',
          keyboardType: 'numeric'
        })}
        {renderInput('Deadline', 'deadline', { 
          placeholder: 'DD-MM-YYYY',
          keyboardType: 'numeric'
        })}
        {renderInput('Budget', 'budget', { 
          placeholder: '$0.00',
          keyboardType: 'numeric'
        })}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Progress</Text>
        {renderProgressSlider()}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Description</Text>
        {renderInput('Project Description', 'description', {
          multiline: true,
          numberOfLines: 5,
          placeholder: 'Enter project description, goals, and objectives...'
        })}
      </View>

      {isEditing && (
        <View style={styles.section}>
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            <Text style={styles.deleteButtonText}>Delete Project</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );

  const renderTeamTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Team Members</Text>
          <Text style={styles.sectionSubtitle}>{dummyProject.teamCount} members</Text>
        </View>

        <View style={styles.teamGrid}>
          {dummyProject.teamMembers.map(member => (
            <TouchableOpacity key={member.id} style={styles.teamCard}>
              <Image
                source={{ uri: member.image }}
                style={styles.teamImage}
              />
              <Text style={styles.teamName}>{member.name}</Text>
              <Text style={styles.teamRole}>{member.role}</Text>
            </TouchableOpacity>
          ))}
          
          <TouchableOpacity style={styles.teamCard}>
            <View style={styles.teamImageMore}>
              <Text style={styles.teamImageMoreText}>
                +{dummyProject.teamCount - 3}
              </Text>
            </View>
            <Text style={styles.teamName}>More</Text>
            <Text style={styles.teamRole}>View all members</Text>
          </TouchableOpacity>
        </View>

        {isEditing && (
          <TouchableOpacity style={styles.addTeamButton}>
            <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
            <Text style={styles.addTeamText}>Add Team Member</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );

  const renderTasksTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tasks</Text>
          {isEditing && (
            <TouchableOpacity style={styles.addIconButton}>
              <Ionicons name="add" size={24} color="#007AFF" />
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.taskList}>
          <TouchableOpacity style={styles.taskItem}>
            <Ionicons name="checkmark-circle" size={24} color="#34C759" />
            <View style={styles.taskInfo}>
              <Text style={[styles.taskTitle, styles.taskCompleted]}>Design mockups</Text>
              <Text style={styles.taskDate}>Completed on 15-12-2024</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskItem}>
            <Ionicons name="ellipse-outline" size={24} color="#999" />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Develop frontend</Text>
              <Text style={styles.taskDate}>Due: 20-01-2025</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskItem}>
            <Ionicons name="ellipse-outline" size={24} color="#999" />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Backend API integration</Text>
              <Text style={styles.taskDate}>Due: 25-01-2025</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.taskItem}>
            <Ionicons name="ellipse-outline" size={24} color="#999" />
            <View style={styles.taskInfo}>
              <Text style={styles.taskTitle}>Testing & QA</Text>
              <Text style={styles.taskDate}>Due: 30-01-2025</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );

  const renderTimelineTab = () => (
    <ScrollView style={styles.tabContent} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Project Timeline</Text>

        <View style={styles.timeline}>
          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Project Started</Text>
              <Text style={styles.timelineDate}>{formData.startDate}</Text>
              <Text style={styles.timelineDescription}>
                Project kickoff meeting completed
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={[styles.timelineDot, styles.timelineDotActive]} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Design Phase</Text>
              <Text style={styles.timelineDate}>05-01-2025</Text>
              <Text style={styles.timelineDescription}>
                Wireframes and mockups approved
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Development Phase</Text>
              <Text style={styles.timelineDate}>15-01-2025</Text>
              <Text style={styles.timelineDescription}>
                In progress
              </Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Testing</Text>
              <Text style={styles.timelineDate}>30-01-2025</Text>
              <Text style={styles.timelineDescription}>
                Upcoming
              </Text>
            </View>
          </View>

          <View style={[styles.timelineItem, styles.timelineItemLast]}>
            <View style={styles.timelineDot} />
            <View style={styles.timelineContent}>
              <Text style={styles.timelineTitle}>Project Delivery</Text>
              <Text style={styles.timelineDate}>{formData.deadline}</Text>
              <Text style={styles.timelineDescription}>
                Final deadline
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderTabContent = () => {
    switch (currentTab) {
      case 'overview': return renderOverviewTab();
      case 'team': return renderTeamTab();
      case 'tasks': return renderTasksTab();
      case 'timeline': return renderTimelineTab();
      default: return renderOverviewTab();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="close" size={28} color="#666" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Text style={styles.headerTitle}>
              {isEditing ? 'Edit Project' : 'Project Details'}
            </Text>
            {hasChanges && <View style={styles.changedIndicator} />}
          </View>
          <View style={styles.headerButton} />
        </View>

        <View style={styles.tabs}>
          <TouchableOpacity
            style={[styles.tab, currentTab === 'overview' && styles.activeTab]}
            onPress={() => setCurrentTab('overview')}
          >
            <Ionicons
              name="document-text-outline"
              size={20}
              color={currentTab === 'overview' ? '#007AFF' : '#999'}
            />
            <Text style={[styles.tabText, currentTab === 'overview' && styles.activeTabText]}>
              Overview
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentTab === 'team' && styles.activeTab]}
            onPress={() => setCurrentTab('team')}
          >
            <Ionicons
              name="people-outline"
              size={20}
              color={currentTab === 'team' ? '#007AFF' : '#999'}
            />
            <Text style={[styles.tabText, currentTab === 'team' && styles.activeTabText]}>
              Team
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentTab === 'tasks' && styles.activeTab]}
            onPress={() => setCurrentTab('tasks')}
          >
            <Ionicons
              name="checkbox-outline"
              size={20}
              color={currentTab === 'tasks' ? '#007AFF' : '#999'}
            />
            <Text style={[styles.tabText, currentTab === 'tasks' && styles.activeTabText]}>
              Tasks
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, currentTab === 'timeline' && styles.activeTab]}
            onPress={() => setCurrentTab('timeline')}
          >
            <Ionicons
              name="time-outline"
              size={20}
              color={currentTab === 'timeline' ? '#007AFF' : '#999'}
            />
            <Text style={[styles.tabText, currentTab === 'timeline' && styles.activeTabText]}>
              Timeline
            </Text>
          </TouchableOpacity>
        </View>

        {renderTabContent()}

        <View style={styles.footer}>
          {isEditing ? (
            <>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={handleCancel}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  !hasChanges && styles.primaryButtonDisabled
                ]}
                onPress={handleSave}
                disabled={!hasChanges}
              >
                <Ionicons name="checkmark" size={20} color="#fff" />
                <Text style={styles.primaryButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              style={[styles.primaryButton, { flex: 1 }]}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}>Edit Project</Text>
            </TouchableOpacity>
          )}
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
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 4,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 11,
    color: '#999',
  },
  activeTabText: {
    color: '#007AFF',
    fontWeight: '500',
  },
  tabContent: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  section: {
    backgroundColor: '#fff',
    padding: 16,
    marginTop: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#222',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
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
  inputValue: {
    fontSize: 15,
    color: '#222',
    paddingVertical: 8,
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
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: '#f0f0f0',
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF5F5',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFE5E5',
    gap: 8,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  teamGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  teamCard: {
    alignItems: 'center',
    width: '30%',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
  },
  teamImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginBottom: 8,
  },
  teamImageMore: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamImageMoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  teamName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#222',
    textAlign: 'center',
    marginBottom: 2,
  },
  teamRole: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
  },
  addTeamButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#007AFF',
    borderRadius: 10,
    borderStyle: 'dashed',
    gap: 8,
  },
  addTeamText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#007AFF',
  },
  addIconButton: {
    padding: 4,
  },
  taskList: {
    gap: 12,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    gap: 12,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#222',
    marginBottom: 4,
  },
  taskCompleted: {
    color: '#999',
    textDecorationLine: 'line-through',
  },
  taskDate: {
    fontSize: 13,
    color: '#666',
  },
  timeline: {
    paddingLeft: 20,
  },
  timelineItem: {
    flexDirection: 'row',
    paddingBottom: 24,
    position: 'relative',
  },
  timelineItemLast: {
    paddingBottom: 0,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#e0e0e0',
    marginRight: 16,
    marginTop: 4,
    zIndex: 1,
  },
  timelineDotActive: {
    backgroundColor: '#007AFF',
  },
  timelineContent: {
    flex: 1,
    paddingBottom: 8,
  },
  timelineTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 13,
    color: '#007AFF',
    marginBottom: 6,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#666',
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
  primaryButtonDisabled: {
    backgroundColor: '#B3D9FF',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default ProjectDetailScreen;