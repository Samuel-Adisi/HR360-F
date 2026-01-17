import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';

const Leave = () => {
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [leaveType, setLeaveType] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const leaveBalances = [
    { type: 'Annual Leave', used: 8, total: 20, color: '#00D9A5', icon: '🌴' },
    { type: 'Sick Leave', used: 2, total: 10, color: '#FF6B6B', icon: '🏥' },
    { type: 'Personal Leave', used: 1, total: 5, color: '#FFB800', icon: '🏠' },
    { type: 'Maternity/Paternity', used: 0, total: 90, color: '#A78BFA', icon: '👶' },
  ];

  const leaveHistory = [
    { id: 1, type: 'Annual Leave', dates: 'Dec 20-22, 2024', days: 3, status: 'Approved', color: '#00D9A5' },
    { id: 2, type: 'Sick Leave', dates: 'Dec 15, 2024', days: 1, status: 'Approved', color: '#00D9A5' },
    { id: 3, type: 'Annual Leave', dates: 'Jan 25-29, 2025', days: 5, status: 'Pending', color: '#FFB800' },
  ];

  const leaveTypeOptions = [
    { label: 'Annual Leave', value: 'annual', icon: '🌴' },
    { label: 'Sick Leave', value: 'sick', icon: '🏥' },
    { label: 'Personal Leave', value: 'personal', icon: '🏠' },
    { label: 'Maternity/Paternity', value: 'maternity', icon: '👶' },
  ];

  const handleSubmitRequest = () => {
    if (!leaveType || !startDate || !endDate || !reason) {
      Alert.alert('Missing Information', 'Please fill in all fields');
      return;
    }

    Alert.alert(
      'Request Submitted',
      'Your leave request has been submitted for approval.',
      [{ text: 'OK', onPress: () => {
        setShowRequestModal(false);
        setLeaveType('');
        setStartDate('');
        setEndDate('');
        setReason('');
      }}]
    );
  };

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Leave Management</Text>
          <Text style={styles.headerSubtitle}>Track and manage your time off</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Days Remaining</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>11</Text>
            <Text style={styles.statLabel}>Days Used</Text>
          </View>
        </View>

        {/* Request Leave Button */}
        <TouchableOpacity 
          style={styles.requestButton}
          activeOpacity={0.8}
          onPress={() => setShowRequestModal(true)}
        >
          <Text style={styles.requestButtonText}>➕ Request Leave</Text>
        </TouchableOpacity>

        {/* Leave Balances */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leave Balance</Text>
          {leaveBalances.map((leave, index) => {
            const percentage = (leave.used / leave.total) * 100;
            const remaining = leave.total - leave.used;
            
            return (
              <View key={index} style={styles.balanceCard}>
                <View style={styles.balanceHeader}>
                  <View style={styles.balanceLeft}>
                    <Text style={styles.balanceIcon}>{leave.icon}</Text>
                    <View>
                      <Text style={styles.balanceType}>{leave.type}</Text>
                      <Text style={styles.balanceSubtext}>
                        {remaining} of {leave.total} days remaining
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.balanceDays}>{remaining}</Text>
                </View>
                
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View 
                      style={[
                        styles.progressBarFill, 
                        { width: `${percentage}%`, backgroundColor: leave.color }
                      ]} 
                    />
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* Leave History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Requests</Text>
          {leaveHistory.map((leave) => (
            <View key={leave.id} style={styles.historyCard}>
              <View style={styles.historyLeft}>
                <View style={styles.historyIconContainer}>
                  <Text style={styles.historyIcon}>📅</Text>
                </View>
                <View style={styles.historyDetails}>
                  <Text style={styles.historyType}>{leave.type}</Text>
                  <Text style={styles.historyDates}>{leave.dates}</Text>
                  <Text style={styles.historyDays}>{leave.days} {leave.days === 1 ? 'day' : 'days'}</Text>
                </View>
              </View>
              <View style={[
                styles.statusBadge,
                { backgroundColor: leave.status === 'Approved' ? '#E8F5E9' : '#FFF9E6' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: leave.status === 'Approved' ? '#4CAF50' : '#FFB800' }
                ]}>
                  {leave.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Request Leave Modal */}
      <Modal
        visible={showRequestModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Request Leave</Text>
              <TouchableOpacity onPress={() => setShowRequestModal(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              {/* Leave Type Selection */}
              <Text style={styles.inputLabel}>Leave Type</Text>
              <View style={styles.leaveTypeGrid}>
                {leaveTypeOptions.map((option) => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.leaveTypeOption,
                      leaveType === option.value && styles.leaveTypeSelected
                    ]}
                    onPress={() => setLeaveType(option.value)}
                  >
                    <Text style={styles.leaveTypeIcon}>{option.icon}</Text>
                    <Text style={[
                      styles.leaveTypeLabel,
                      leaveType === option.value && styles.leaveTypeLabelSelected
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Date Inputs */}
              <Text style={styles.inputLabel}>Start Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                value={startDate}
                onChangeText={setStartDate}
                placeholderTextColor="#999"
              />

              <Text style={styles.inputLabel}>End Date</Text>
              <TextInput
                style={styles.input}
                placeholder="MM/DD/YYYY"
                value={endDate}
                onChangeText={setEndDate}
                placeholderTextColor="#999"
              />

              {/* Reason */}
              <Text style={styles.inputLabel}>Reason</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Enter reason for leave..."
                value={reason}
                onChangeText={setReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                placeholderTextColor="#999"
              />

              {/* Submit Button */}
              <TouchableOpacity 
                style={styles.submitButton}
                onPress={handleSubmitRequest}
                activeOpacity={0.8}
              >
                <Text style={styles.submitButtonText}>Submit Request</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setShowRequestModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

export default Leave;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8E9EB',
  },
  contentContainer: {
    paddingTop: 60,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 15,
    color: '#6B6B6B',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginBottom: 20,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#00D9A5',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#6B6B6B',
    fontWeight: '600',
  },
  requestButton: {
    marginHorizontal: 20,
    backgroundColor: '#00D9A5',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: '#00D9A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  requestButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 16,
  },
  balanceCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  balanceIcon: {
    fontSize: 28,
    marginRight: 12,
  },
  balanceType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  balanceSubtext: {
    fontSize: 13,
    color: '#6B6B6B',
  },
  balanceDays: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  progressBarContainer: {
    width: '100%',
  },
  progressBarBg: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  historyCard: {
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  historyIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  historyIcon: {
    fontSize: 24,
  },
  historyDetails: {
    flex: 1,
  },
  historyType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 3,
  },
  historyDates: {
    fontSize: 13,
    color: '#6B6B6B',
    marginBottom: 2,
  },
  historyDays: {
    fontSize: 12,
    color: '#999',
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  closeButton: {
    fontSize: 28,
    color: '#6B6B6B',
    fontWeight: '300',
  },
  modalBody: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 24,
  },
  inputLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 10,
    marginTop: 8,
  },
  leaveTypeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  leaveTypeOption: {
    width: '47%',
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  leaveTypeSelected: {
    backgroundColor: '#E8F9F5',
    borderColor: '#00D9A5',
  },
  leaveTypeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  leaveTypeLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6B6B6B',
    textAlign: 'center',
  },
  leaveTypeLabelSelected: {
    color: '#00D9A5',
  },
  input: {
    backgroundColor: '#F5F5F7',
    borderRadius: 12,
    padding: 16,
    fontSize: 15,
    color: '#1a1a1a',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  textArea: {
    height: 100,
    paddingTop: 16,
  },
  submitButton: {
    backgroundColor: '#00D9A5',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 12,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#fff',
  },
  cancelModalButton: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B6B6B',
  },
});