import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Modal, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'

const Recruitment = () => {
  const [activeTab, setActiveTab] = useState('pipeline');
  const [showAddCandidateModal, setShowAddCandidateModal] = useState(false);
  const [showOnboardingModal, setShowOnboardingModal] = useState(false);
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [candidatePhone, setCandidatePhone] = useState('');
  const [selectedPosition, setSelectedPosition] = useState('');
  const [newEmployeeName, setNewEmployeeName] = useState('');
  const [newEmployeePosition, setNewEmployeePosition] = useState('');
  const [startDate, setStartDate] = useState('');

  const positions = [
    { id: 1, title: 'Senior Software Engineer', department: 'Engineering', openings: 2, applicants: 24, icon: '💻' },
    { id: 2, title: 'Product Designer', department: 'Design', openings: 1, applicants: 18, icon: '🎨' },
    { id: 3, title: 'HR Manager', department: 'Human Resources', openings: 1, applicants: 12, icon: '👥' },
    { id: 4, title: 'Marketing Lead', department: 'Marketing', openings: 1, applicants: 31, icon: '📢' },
  ];

  const [pipelineData, setPipelineData] = useState([
    { stage: 'New Applications', count: 15, color: '#FFB800', candidates: [
      { id: 1, name: 'Sarah Johnson', position: 'Senior Software Engineer', time: '2 hours ago', avatar: '👩', email: 'sarah.j@email.com' },
      { id: 2, name: 'Michael Chen', position: 'Product Designer', time: '5 hours ago', avatar: '👨', email: 'mchen@email.com' },
      { id: 3, name: 'Emily Davis', position: 'HR Manager', time: '1 day ago', avatar: '👩', email: 'emily.d@email.com' },
    ]},
    { stage: 'Screening', count: 8, color: '#00D9A5', candidates: [
      { id: 4, name: 'James Wilson', position: 'Marketing Lead', time: '2 days ago', avatar: '👨', email: 'jwilson@email.com' },
      { id: 5, name: 'Lisa Anderson', position: 'Senior Software Engineer', time: '3 days ago', avatar: '👩', email: 'lisa.a@email.com' },
    ]},
    { stage: 'Interview', count: 12, color: '#7BA6E3', candidates: [
      { id: 6, name: 'David Martinez', position: 'Product Designer', time: '1 week ago', avatar: '👨', email: 'david.m@email.com' },
      { id: 7, name: 'Emma Thompson', position: 'HR Manager', time: '1 week ago', avatar: '👩', email: 'emma.t@email.com' },
    ]},
    { stage: 'Offer', count: 3, color: '#A78BFA', candidates: [
      { id: 8, name: 'Alex Rivera', position: 'Senior Software Engineer', time: '2 weeks ago', avatar: '👤', email: 'alex.r@email.com' },
    ]},
  ]);

  const [onboardingTasks, setOnboardingTasks] = useState([
    { id: 1, employee: 'Alex Rivera', position: 'Senior Software Engineer', startDate: 'Jan 22, 2026', progress: 75, completedTasks: 9, totalTasks: 12, icon: '👨‍💼' },
    { id: 2, employee: 'Sophia Lee', position: 'Product Designer', startDate: 'Jan 20, 2026', progress: 90, completedTasks: 11, totalTasks: 12, icon: '👩‍💼' },
    { id: 3, employee: 'Marcus Brown', position: 'Marketing Lead', startDate: 'Jan 25, 2026', progress: 25, completedTasks: 3, totalTasks: 12, icon: '👨‍💼' },
  ]);

  const handleAddCandidate = () => {
    if (!candidateName || !candidateEmail || !selectedPosition) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const newCandidate = {
      id: Date.now(),
      name: candidateName,
      position: selectedPosition,
      time: 'Just now',
      avatar: '👤',
      email: candidateEmail
    };

    setPipelineData(prev => {
      const updated = [...prev];
      updated[0] = {
        ...updated[0],
        count: updated[0].count + 1,
        candidates: [newCandidate, ...updated[0].candidates]
      };
      return updated;
    });

    Alert.alert(
      'Success',
      `${candidateName} has been added to the pipeline.`,
      [{ text: 'OK', onPress: () => {
        setShowAddCandidateModal(false);
        setCandidateName('');
        setCandidateEmail('');
        setCandidatePhone('');
        setSelectedPosition('');
      }}]
    );
  };

  const handleAddOnboarding = () => {
    if (!newEmployeeName || !newEmployeePosition || !startDate) {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }

    const newOnboarding = {
      id: Date.now(),
      employee: newEmployeeName,
      position: newEmployeePosition,
      startDate: startDate,
      progress: 0,
      completedTasks: 0,
      totalTasks: 12,
      icon: '👤'
    };

    setOnboardingTasks(prev => [...prev, newOnboarding]);

    Alert.alert(
      'Success',
      `Onboarding created for ${newEmployeeName}`,
      [{ text: 'OK', onPress: () => {
        setShowOnboardingModal(false);
        setNewEmployeeName('');
        setNewEmployeePosition('');
        setStartDate('');
      }}]
    );
  };

  const moveCandidate = (candidateId, fromStageIndex, toStageIndex) => {
    setPipelineData(prev => {
      const updated = [...prev];
      const candidate = updated[fromStageIndex].candidates.find(c => c.id === candidateId);
      
      updated[fromStageIndex] = {
        ...updated[fromStageIndex],
        count: updated[fromStageIndex].count - 1,
        candidates: updated[fromStageIndex].candidates.filter(c => c.id !== candidateId)
      };

      updated[toStageIndex] = {
        ...updated[toStageIndex],
        count: updated[toStageIndex].count + 1,
        candidates: [candidate, ...updated[toStageIndex].candidates]
      };

      return updated;
    });
  };

  const handleCandidatePress = (candidate, stageIndex) => {
    const nextStageIndex = stageIndex + 1;
    if (nextStageIndex >= pipelineData.length) {
      Alert.alert('Final Stage', 'This candidate is in the final stage');
      return;
    }

    Alert.alert(
      'Move Candidate',
      `Move ${candidate.name} to ${pipelineData[nextStageIndex].stage}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Move', 
          onPress: () => moveCandidate(candidate.id, stageIndex, nextStageIndex)
        }
      ]
    );
  };

  const updateTaskProgress = (taskId) => {
    setOnboardingTasks(prev => prev.map(task => {
      if (task.id === taskId && task.completedTasks < task.totalTasks) {
        const newCompleted = task.completedTasks + 1;
        const newProgress = Math.round((newCompleted / task.totalTasks) * 100);
        return {
          ...task,
          completedTasks: newCompleted,
          progress: newProgress
        };
      }
      return task;
    }));
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerTitle}>Talent Hub</Text>
          <Text style={styles.headerSubtitle}>Pipeline & Onboarding</Text>
        </View>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => activeTab === 'onboarding' ? setShowOnboardingModal(true) : setShowAddCandidateModal(true)}
        >
          <Text style={styles.addButtonIcon}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'pipeline' && styles.tabActive]}
          onPress={() => setActiveTab('pipeline')}
        >
          <Text style={[styles.tabText, activeTab === 'pipeline' && styles.tabTextActive]}>
            Pipeline
          </Text>
          {activeTab === 'pipeline' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'positions' && styles.tabActive]}
          onPress={() => setActiveTab('positions')}
        >
          <Text style={[styles.tabText, activeTab === 'positions' && styles.tabTextActive]}>
            Positions
          </Text>
          {activeTab === 'positions' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === 'onboarding' && styles.tabActive]}
          onPress={() => setActiveTab('onboarding')}
        >
          <Text style={[styles.tabText, activeTab === 'onboarding' && styles.tabTextActive]}>
            Onboarding
          </Text>
          {activeTab === 'onboarding' && <View style={styles.tabIndicator} />}
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.scrollContent}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Pipeline Tab */}
        {activeTab === 'pipeline' && (
          <View>
            {/* Stats Overview */}
            <View style={styles.statsRow}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>85</Text>
                <Text style={styles.statLabel}>Total</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#00D9A5' }]}>38</Text>
                <Text style={styles.statLabel}>Active</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={[styles.statNumber, { color: '#7BA6E3' }]}>12</Text>
                <Text style={styles.statLabel}>Interview</Text>
              </View>
            </View>

            {/* Pipeline Stages */}
            {pipelineData.map((stage, stageIndex) => (
              <View key={stageIndex} style={styles.stageSection}>
                <View style={styles.stageHeader}>
                  <View style={styles.stageHeaderLeft}>
                    <View style={[styles.stageDot, { backgroundColor: stage.color }]} />
                    <Text style={styles.stageTitle}>{stage.stage}</Text>
                  </View>
                  <View style={styles.countBadge}>
                    <Text style={styles.countText}>{stage.count}</Text>
                  </View>
                </View>

                <View style={styles.candidatesList}>
                  {stage.candidates.map((candidate, idx) => (
                    <TouchableOpacity 
                      key={candidate.id} 
                      style={styles.candidateCard}
                      onPress={() => handleCandidatePress(candidate, stageIndex)}
                      activeOpacity={0.7}
                    >
                      <View style={styles.candidateContent}>
                        <View style={styles.avatarCircle}>
                          <Text style={styles.avatarEmoji}>{candidate.avatar}</Text>
                        </View>
                        <View style={styles.candidateDetails}>
                          <Text style={styles.candidateName}>{candidate.name}</Text>
                          <Text style={styles.candidateRole}>{candidate.position}</Text>
                          <Text style={styles.candidateTime}>{candidate.time}</Text>
                        </View>
                      </View>
                      <Text style={styles.arrowIcon}>→</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Positions Tab */}
        {activeTab === 'positions' && (
          <View style={styles.positionsContainer}>
            {positions.map((position) => (
              <TouchableOpacity key={position.id} style={styles.positionCard} activeOpacity={0.8}>
                <View style={styles.positionTop}>
                  <View style={styles.positionIconBox}>
                    <Text style={styles.positionEmoji}>{position.icon}</Text>
                  </View>
                  <View style={styles.positionDetails}>
                    <Text style={styles.positionTitle}>{position.title}</Text>
                    <Text style={styles.positionDept}>{position.department}</Text>
                  </View>
                </View>
                
                <View style={styles.positionMetrics}>
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{position.openings}</Text>
                    <Text style={styles.metricLabel}>Open</Text>
                  </View>
                  <View style={styles.metricDivider} />
                  <View style={styles.metric}>
                    <Text style={styles.metricValue}>{position.applicants}</Text>
                    <Text style={styles.metricLabel}>Applied</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Onboarding Tab */}
        {activeTab === 'onboarding' && (
          <View>
            {onboardingTasks.map((task) => (
              <View key={task.id} style={styles.onboardingCard}>
                <View style={styles.onboardingTop}>
                  <View style={styles.employeeInfo}>
                    <View style={styles.employeeAvatar}>
                      <Text style={styles.employeeEmoji}>{task.icon}</Text>
                    </View>
                    <View style={styles.employeeDetails}>
                      <Text style={styles.employeeName}>{task.employee}</Text>
                      <Text style={styles.employeeRole}>{task.position}</Text>
                      <Text style={styles.employeeStart}>Start: {task.startDate}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.progressContainer}>
                  <View style={styles.progressTop}>
                    <Text style={styles.progressTitle}>Progress</Text>
                    <Text style={styles.progressPercent}>{task.progress}%</Text>
                  </View>
                  <View style={styles.progressTrack}>
                    <View style={[styles.progressFill, { width: `${task.progress}%` }]} />
                  </View>
                  <Text style={styles.taskCount}>{task.completedTasks}/{task.totalTasks} tasks completed</Text>
                </View>

                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => updateTaskProgress(task.id)}
                  disabled={task.completedTasks >= task.totalTasks}
                >
                  <Text style={styles.actionButtonText}>
                    {task.completedTasks >= task.totalTasks ? 'Completed ✓' : 'Complete Task'}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Add Candidate Modal */}
      <Modal
        visible={showAddCandidateModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Candidate</Text>
              <TouchableOpacity onPress={() => setShowAddCandidateModal(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Full Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter name"
                  value={candidateName}
                  onChangeText={setCandidateName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="email@example.com"
                  value={candidateEmail}
                  onChangeText={setCandidateEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Phone (Optional)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="+233 XX XXX XXXX"
                  value={candidatePhone}
                  onChangeText={setCandidatePhone}
                  keyboardType="phone-pad"
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Position</Text>
                {positions.map((pos) => (
                  <TouchableOpacity
                    key={pos.id}
                    style={[
                      styles.optionCard,
                      selectedPosition === pos.title && styles.optionCardSelected
                    ]}
                    onPress={() => setSelectedPosition(pos.title)}
                  >
                    <Text style={styles.optionEmoji}>{pos.icon}</Text>
                    <Text style={[
                      styles.optionText,
                      selectedPosition === pos.title && styles.optionTextSelected
                    ]}>
                      {pos.title}
                    </Text>
                    {selectedPosition === pos.title && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleAddCandidate}
              >
                <Text style={styles.primaryButtonText}>Add Candidate</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowAddCandidateModal(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add Onboarding Modal */}
      <Modal
        visible={showOnboardingModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Onboarding</Text>
              <TouchableOpacity onPress={() => setShowOnboardingModal(false)}>
                <Text style={styles.closeIcon}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Employee Name</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Enter employee name"
                  value={newEmployeeName}
                  onChangeText={setNewEmployeeName}
                  placeholderTextColor="#999"
                />
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Position</Text>
                {positions.map((pos) => (
                  <TouchableOpacity
                    key={pos.id}
                    style={[
                      styles.optionCard,
                      newEmployeePosition === pos.title && styles.optionCardSelected
                    ]}
                    onPress={() => setNewEmployeePosition(pos.title)}
                  >
                    <Text style={styles.optionEmoji}>{pos.icon}</Text>
                    <Text style={[
                      styles.optionText,
                      newEmployeePosition === pos.title && styles.optionTextSelected
                    ]}>
                      {pos.title}
                    </Text>
                    {newEmployeePosition === pos.title && <Text style={styles.checkmark}>✓</Text>}
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.formGroup}>
                <Text style={styles.label}>Start Date</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Jan 30, 2026"
                  value={startDate}
                  onChangeText={setStartDate}
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity 
                style={styles.primaryButton}
                onPress={handleAddOnboarding}
              >
                <Text style={styles.primaryButtonText}>Create Onboarding</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryButton}
                onPress={() => setShowOnboardingModal(false)}
              >
                <Text style={styles.secondaryButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

export default Recruitment

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#00D9A5',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00D9A5',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    // No background change, just indicator
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9CA3AF',
  },
  tabTextActive: {
    color: '#111827',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: '#00D9A5',
    borderTopLeftRadius: 2,
    borderTopRightRadius: 2,
  },
  scrollContent: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  stageSection: {
    marginBottom: 28,
  },
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stageHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  stageTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
  },
  countBadge: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  candidatesList: {
    gap: 8,
  },
  candidateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  candidateContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  candidateDetails: {
    flex: 1,
  },
  candidateName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  candidateRole: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  candidateTime: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  arrowIcon: {
    fontSize: 20,
    color: '#D1D5DB',
    marginLeft: 8,
  },
  positionsContainer: {
    gap: 12,
  },
  positionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  positionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  positionIconBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  positionEmoji: {
    fontSize: 26,
  },
  positionDetails: {
    flex: 1,
  },
  positionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  positionDept: {
    fontSize: 13,
    color: '#6B7280',
  },
  positionMetrics: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 14,
  },
  metric: {
    flex: 1,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#00D9A5',
    marginBottom: 2,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  metricDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginHorizontal: 16,
  },
  onboardingCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  onboardingTop: {
    marginBottom: 16,
  },
  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeAvatar: {
    width: 52,
    height: 52,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  employeeEmoji: {
    fontSize: 26,
  },
  employeeDetails: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 3,
  },
  employeeRole: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 3,
  },
  employeeStart: {
    fontSize: 12,
    color: '#00D9A5',
    fontWeight: '600',
  },
  progressContainer: {
    marginBottom: 14,
  },
  progressTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '600',
  },
  progressPercent: {
    fontSize: 14,
    fontWeight: '700',
    color: '#00D9A5',
  },
  progressTrack: {
    height: 6,
    backgroundColor: '#E5E7EB',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#00D9A5',
    borderRadius: 3,
  },
  taskCount: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  actionButton: {
    backgroundColor: '#F3F4F6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  closeIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    fontWeight: '300',
  },
  modalBody: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    fontSize: 15,
    color: '#111827',
  },
  optionCard: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 10,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  optionCardSelected: {
    backgroundColor: '#E8F9F5',
    borderColor: '#00D9A5',
  },
  optionEmoji: {
    fontSize: 22,
    marginRight: 12,
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    flex: 1,
  },
  optionTextSelected: {
    color: '#00D9A5',
  },
  checkmark: {
    fontSize: 18,
    color: '#00D9A5',
    fontWeight: '700',
  },
  primaryButton: {
    backgroundColor: '#00D9A5',
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryButton: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
})