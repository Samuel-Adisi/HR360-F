import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal, ScrollView, TextInput, Alert, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import * as ImagePicker from 'expo-image-picker';

// Move this component OUTSIDE to prevent re-creation on every render
const ClaimFormModal = ({ visible, onClose, onSubmit, title, submitButtonText, formData, setFormData, claimTypes, categories, takePhoto, pickImage }) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent={true}
    onRequestClose={onClose}
  >
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>{title}</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close-circle" size={32} color="#666" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
          {/* Type Selector */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Type *</Text>
            <View style={styles.typeSelector}>
              {claimTypes.map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.typeButton,
                    formData.type === type && styles.typeButtonActive
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, type }))}
                >
                  <Text style={[
                    styles.typeButtonText,
                    formData.type === type && styles.typeButtonTextActive
                  ]}>
                    {type}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Category */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category</Text>
            <View style={styles.typeSelector}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category}
                  style={[
                    styles.typeButton,
                    formData.category === category && styles.typeButtonActive
                  ]}
                  onPress={() => setFormData(prev => ({ ...prev, category }))}
                >
                  <Text style={[
                    styles.typeButtonText,
                    formData.category === category && styles.typeButtonTextActive
                  ]}>
                    {category}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Amount */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Amount *</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.currencySymbol}>$</Text>
              <TextInput
                style={styles.input}
                value={formData.amount}
                onChangeText={(text) => setFormData(prev => ({ ...prev, amount: text }))}
                keyboardType="decimal-pad"
                placeholder="0.00"
              />
            </View>
          </View>

          {/* Date */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Expense Date</Text>
            <TextInput
              style={styles.inputFull}
              value={formData.date}
              onChangeText={(text) => setFormData(prev => ({ ...prev, date: text }))}
              placeholder="YYYY-MM-DD"
            />
          </View>

          {/* Description */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description *</Text>
            <TextInput
              style={[styles.inputFull, styles.textArea]}
              value={formData.description}
              onChangeText={(text) => setFormData(prev => ({ ...prev, description: text }))}
              placeholder="Enter description"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Notes */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Additional Notes</Text>
            <TextInput
              style={[styles.inputFull, styles.textArea]}
              value={formData.notes}
              onChangeText={(text) => setFormData(prev => ({ ...prev, notes: text }))}
              placeholder="Add any additional notes"
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Receipt Upload */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Receipt *</Text>
            {formData.receiptUrl ? (
              <View style={styles.receiptPreview}>
                <Image source={{ uri: formData.receiptUrl }} style={styles.receiptImage} />
                <TouchableOpacity 
                  style={styles.removeReceiptButton}
                  onPress={() => setFormData(prev => ({ ...prev, receiptUrl: null }))}
                >
                  <Ionicons name="close-circle" size={24} color="#EF5350" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.uploadButtons}>
                <TouchableOpacity style={styles.uploadButton} onPress={takePhoto}>
                  <Ionicons name="camera" size={28} color="#00D9A5" />
                  <Text style={styles.uploadButtonText}>Take Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <Ionicons name="images" size={28} color="#00D9A5" />
                  <Text style={styles.uploadButtonText}>Choose from Gallery</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={onSubmit}>
            <Text style={styles.submitButtonText}>{submitButtonText}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailRowLeft}>
      <Ionicons name={icon} size={20} color="#666" />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const Claims = () => {
  const [claims, setClaims] = useState([
    {
      id: '1',
      type: 'Travel',
      amount: 450.00,
      date: '2025-01-15',
      status: 'pending',
      description: 'Client meeting - Taxi fare',
      receiptUrl: 'https://via.placeholder.com/300x400/00D9A5/FFFFFF?text=Receipt+1',
      submittedDate: '2025-01-15',
      category: 'Transportation',
      notes: 'Uber ride from office to client site downtown'
    },
    {
      id: '2',
      type: 'Meal',
      amount: 85.50,
      date: '2025-01-14',
      status: 'approved',
      description: 'Team lunch with client',
      receiptUrl: 'https://via.placeholder.com/300x400/66BB6A/FFFFFF?text=Receipt+2',
      submittedDate: '2025-01-14',
      approvedDate: '2025-01-15',
      category: 'Meals & Entertainment',
      notes: 'Business lunch at The Capital Grille'
    },
    {
      id: '3',
      type: 'Office Supplies',
      amount: 120.00,
      date: '2025-01-10',
      status: 'rejected',
      description: 'Laptop accessories',
      receiptUrl: 'https://via.placeholder.com/300x400/EF5350/FFFFFF?text=Receipt+3',
      submittedDate: '2025-01-10',
      rejectedDate: '2025-01-12',
      rejectionReason: 'Items not pre-approved by manager',
      category: 'Office Equipment',
      notes: 'Wireless mouse and keyboard'
    },
  ]);

  const [selectedClaim, setSelectedClaim] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [newClaimModalVisible, setNewClaimModalVisible] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    type: '',
    category: '',
    amount: '',
    date: '',
    description: '',
    notes: '',
    receiptUrl: null
  });

  const claimTypes = ['Travel', 'Meal', 'Office Supplies', 'Medical', 'Training', 'Other'];
  const categories = ['Transportation', 'Meals & Entertainment', 'Office Equipment', 'Medical', 'Education', 'Miscellaneous'];

  const openClaimDetails = (claim) => {
    setSelectedClaim(claim);
    setDetailModalVisible(true);
  };

  const closeClaimDetails = () => {
    setDetailModalVisible(false);
    setTimeout(() => setSelectedClaim(null), 300);
  };

  const openReceiptModal = () => {
    setReceiptModalVisible(true);
  };

  const closeReceiptModal = () => {
    setReceiptModalVisible(false);
  };

  const openEditModal = () => {
    if (!selectedClaim) return;
    
    // Set form data first
    setFormData({
      type: selectedClaim.type,
      category: selectedClaim.category,
      amount: selectedClaim.amount.toString(),
      date: selectedClaim.date,
      description: selectedClaim.description,
      notes: selectedClaim.notes || '',
      receiptUrl: selectedClaim.receiptUrl
    });
    
    // Close detail modal and wait before opening edit modal
    setDetailModalVisible(false);
    setTimeout(() => {
      setEditModalVisible(true);
    }, 300);
  };

  const closeEditModal = () => {
    setEditModalVisible(false);
    setTimeout(() => resetForm(), 300);
  };

  const openNewClaimModal = () => {
    resetForm();
    setNewClaimModalVisible(true);
  };

  const closeNewClaimModal = () => {
    setNewClaimModalVisible(false);
    setTimeout(() => resetForm(), 300);
  };

  const resetForm = () => {
    setFormData({
      type: '',
      category: '',
      amount: '',
      date: '',
      description: '',
      notes: '',
      receiptUrl: null
    });
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow access to your photos to upload receipts.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setFormData(prev => ({ ...prev, receiptUrl: result.assets[0].uri }));
    }
  };

  const takePhoto = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    
    if (permissionResult.granted === false) {
      Alert.alert('Permission Required', 'Please allow camera access to take receipt photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.8,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      setFormData(prev => ({ ...prev, receiptUrl: result.assets[0].uri }));
    }
  };

  const handleSaveEdit = () => {
    if (!formData.type || !formData.amount || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!selectedClaim) {
      Alert.alert('Error', 'No claim selected');
      return;
    }

    const updatedClaims = claims.map(claim => 
      claim.id === selectedClaim.id 
        ? { 
            ...claim, 
            type: formData.type,
            category: formData.category,
            amount: parseFloat(formData.amount),
            date: formData.date,
            description: formData.description,
            notes: formData.notes,
            receiptUrl: formData.receiptUrl
          }
        : claim
    );

    setClaims(updatedClaims);
    setEditModalVisible(false);
    setTimeout(() => {
      resetForm();
      Alert.alert('Success', 'Claim updated successfully!');
    }, 300);
  };

  const handleSubmitNewClaim = () => {
    if (!formData.type || !formData.amount || !formData.description) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (!formData.receiptUrl) {
      Alert.alert('Error', 'Please upload a receipt');
      return;
    }

    const newClaim = {
      id: (claims.length + 1).toString(),
      type: formData.type,
      category: formData.category,
      amount: parseFloat(formData.amount),
      date: formData.date || new Date().toISOString().split('T')[0],
      status: 'pending',
      description: formData.description,
      notes: formData.notes,
      receiptUrl: formData.receiptUrl,
      submittedDate: new Date().toISOString().split('T')[0],
    };

    setClaims([newClaim, ...claims]);
    setNewClaimModalVisible(false);
    setTimeout(() => {
      resetForm();
      Alert.alert('Success', 'Claim submitted successfully!');
    }, 300);
  };

  const handleCancelClaim = () => {
    Alert.alert(
      'Cancel Claim',
      'Are you sure you want to cancel this claim?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes',
          style: 'destructive',
          onPress: () => {
            setClaims(claims.filter(claim => claim.id !== selectedClaim.id));
            closeClaimDetails();
            Alert.alert('Success', 'Claim cancelled successfully');
          }
        }
      ]
    );
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#FFA726';
      case 'approved': return '#66BB6A';
      case 'rejected': return '#EF5350';
      case 'paid': return '#42A5F5';
      default: return '#999';
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return 'time-outline';
      case 'approved': return 'checkmark-circle';
      case 'rejected': return 'close-circle';
      case 'paid': return 'wallet';
      default: return 'help-circle';
    }
  };

  const totalPending = claims
    .filter(claim => claim.status === 'pending')
    .reduce((sum, claim) => sum + claim.amount, 0);

  const totalApproved = claims
    .filter(claim => claim.status === 'approved')
    .reduce((sum, claim) => sum + claim.amount, 0);

  const renderClaimItem = ({ item }) => (
    <TouchableOpacity style={styles.claimCard} onPress={() => openClaimDetails(item)}>
      <View style={styles.claimHeader}>
        <View style={styles.claimTypeContainer}>
          <Text style={styles.claimType}>{item.type}</Text>
          <Text style={styles.claimDate}>{item.date}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
          <Ionicons name={getStatusIcon(item.status)} size={16} color={getStatusColor(item.status)} />
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Text>
        </View>
      </View>
      <Text style={styles.claimDescription}>{item.description}</Text>
      <View style={styles.claimFooter}>
        <Text style={styles.claimAmount}>${item.amount.toFixed(2)}</Text>
        <TouchableOpacity onPress={() => openClaimDetails(item)}>
          <Text style={styles.viewDetails}>View Details →</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Claims</Text>
        <TouchableOpacity style={styles.newClaimButton} onPress={openNewClaimModal}>
          <Ionicons name="add-circle" size={24} color="#00D9A5" />
          <Text style={styles.newClaimText}>New Claim</Text>
        </TouchableOpacity>
      </View>

      {/* Summary Cards */}
      <View style={styles.summaryContainer}>
        <View style={[styles.summaryCard, { backgroundColor: '#FFF3E0' }]}>
          <Ionicons name="time-outline" size={28} color="#FFA726" />
          <Text style={styles.summaryAmount}>${totalPending.toFixed(2)}</Text>
          <Text style={styles.summaryLabel}>Pending</Text>
        </View>
        <View style={[styles.summaryCard, { backgroundColor: '#E8F5E9' }]}>
          <Ionicons name="checkmark-circle" size={28} color="#66BB6A" />
          <Text style={styles.summaryAmount}>${totalApproved.toFixed(2)}</Text>
          <Text style={styles.summaryLabel}>Approved</Text>
        </View>
      </View>

      {/* Claims List */}
      <View style={styles.listHeader}>
        <Text style={styles.listTitle}>Recent Claims</Text>
        <TouchableOpacity>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={claims}
        renderItem={renderClaimItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* Claim Details Modal */}
      <Modal
        visible={detailModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={closeClaimDetails}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Claim Details</Text>
              <TouchableOpacity onPress={closeClaimDetails}>
                <Ionicons name="close-circle" size={32} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
              {selectedClaim && (
                <>
                  <View style={[styles.statusBanner, { backgroundColor: getStatusColor(selectedClaim.status) }]}>
                    <Ionicons name={getStatusIcon(selectedClaim.status)} size={32} color="#fff" />
                    <Text style={styles.statusBannerText}>
                      {selectedClaim.status.toUpperCase()}
                    </Text>
                  </View>

                  <View style={styles.amountSection}>
                    <Text style={styles.amountLabel}>Claim Amount</Text>
                    <Text style={styles.amountValue}>${selectedClaim.amount.toFixed(2)}</Text>
                  </View>

                  <View style={styles.detailsSection}>
                    <DetailRow icon="briefcase-outline" label="Type" value={selectedClaim.type} />
                    <DetailRow icon="folder-outline" label="Category" value={selectedClaim.category} />
                    <DetailRow icon="calendar-outline" label="Expense Date" value={selectedClaim.date} />
                    <DetailRow icon="time-outline" label="Submitted On" value={selectedClaim.submittedDate} />
                    
                    {selectedClaim.approvedDate && (
                      <DetailRow icon="checkmark-circle-outline" label="Approved On" value={selectedClaim.approvedDate} />
                    )}
                    
                    {selectedClaim.rejectedDate && (
                      <DetailRow icon="close-circle-outline" label="Rejected On" value={selectedClaim.rejectedDate} />
                    )}
                  </View>

                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Description</Text>
                    <Text style={styles.sectionText}>{selectedClaim.description}</Text>
                  </View>

                  {selectedClaim.notes && (
                    <View style={styles.sectionContainer}>
                      <Text style={styles.sectionTitle}>Additional Notes</Text>
                      <Text style={styles.sectionText}>{selectedClaim.notes}</Text>
                    </View>
                  )}

                  {selectedClaim.rejectionReason && (
                    <View style={[styles.sectionContainer, styles.rejectionContainer]}>
                      <Text style={styles.rejectionTitle}>Rejection Reason</Text>
                      <Text style={styles.rejectionText}>{selectedClaim.rejectionReason}</Text>
                    </View>
                  )}

                  <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Receipt</Text>
                    <TouchableOpacity style={styles.receiptButton} onPress={openReceiptModal}>
                      <Ionicons name="document-attach-outline" size={24} color="#00D9A5" />
                      <Text style={styles.receiptButtonText}>View Receipt</Text>
                    </TouchableOpacity>
                  </View>

                  {selectedClaim.status === 'pending' && (
                    <View style={styles.actionButtons}>
                      <TouchableOpacity style={styles.editButton} onPress={openEditModal}>
                        <Ionicons name="create-outline" size={20} color="#fff" />
                        <Text style={styles.editButtonText}>Edit Claim</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.cancelButton} onPress={handleCancelClaim}>
                        <Ionicons name="trash-outline" size={20} color="#EF5350" />
                        <Text style={styles.cancelButtonText}>Cancel Claim</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        visible={receiptModalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeReceiptModal}
      >
        <View style={styles.receiptModalOverlay}>
          <TouchableOpacity style={styles.receiptModalClose} onPress={closeReceiptModal}>
            <Ionicons name="close-circle" size={40} color="#fff" />
          </TouchableOpacity>
          {selectedClaim && (
            <Image 
              source={{ uri: selectedClaim.receiptUrl }} 
              style={styles.receiptFullImage}
              resizeMode="contain"
            />
          )}
        </View>
      </Modal>

      {/* Edit Claim Modal */}
      <ClaimFormModal
        visible={editModalVisible}
        onClose={closeEditModal}
        onSubmit={handleSaveEdit}
        title="Edit Claim"
        submitButtonText="Save Changes"
        formData={formData}
        setFormData={setFormData}
        claimTypes={claimTypes}
        categories={categories}
        takePhoto={takePhoto}
        pickImage={pickImage}
      />

      {/* New Claim Modal */}
      <ClaimFormModal
        visible={newClaimModalVisible}
        onClose={closeNewClaimModal}
        onSubmit={handleSubmitNewClaim}
        title="New Claim"
        submitButtonText="Submit Claim"
        formData={formData}
        setFormData={setFormData}
        claimTypes={claimTypes}
        categories={categories}
        takePhoto={takePhoto}
        pickImage={pickImage}
      />
    </View>
  );
};

export default Claims;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F7',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  newClaimButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  newClaimText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D9A5',
  },
  summaryContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 16,
  },
  summaryCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
  },
  summaryAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  filterText: {
    fontSize: 14,
    color: '#00D9A5',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  claimCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  claimHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  claimTypeContainer: {
    flex: 1,
  },
  claimType: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  claimDate: {
    fontSize: 13,
    color: '#999',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  claimDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  claimFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  claimAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00D9A5',
  },
  viewDetails: {
    fontSize: 14,
    color: '#00D9A5',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E9EB',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  modalContent: {
    padding: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 12,
  },
  statusBannerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  amountSection: {
    alignItems: 'center',
    paddingVertical: 20,
    marginBottom: 24,
    backgroundColor: '#F5F5F7',
    borderRadius: 16,
  },
  amountLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  amountValue: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#00D9A5',
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detailRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailLabel: {
    fontSize: 15,
    color: '#666',
  },
  detailValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1a1a1a',
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  rejectionContainer: {
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#EF5350',
  },
  rejectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#EF5350',
    marginBottom: 8,
  },
  rejectionText: {
    fontSize: 15,
    color: '#C62828',
    lineHeight: 22,
  },
  receiptButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#E8F5F9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00D9A5',
    borderStyle: 'dashed',
  },
  receiptButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00D9A5',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  editButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#00D9A5',
    borderRadius: 12,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  cancelButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF5350',
  },
  receiptModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  receiptModalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  receiptFullImage: {
    width: '90%',
    height: '70%',
  },
  formGroup: {
    marginBottom: 24,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: 8,
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  typeButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  typeButtonActive: {
    backgroundColor: '#00D9A5',
    borderColor: '#00D9A5',
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  typeButtonTextActive: {
    color: '#fff',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  currencySymbol: {
    fontSize: 20,
    fontWeight: '600',
    color: '#666',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 14,
    color: '#1a1a1a',
  },
  inputFull: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1a1a1a',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  uploadButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  uploadButton: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#00D9A5',
    borderStyle: 'dashed',
    backgroundColor: '#F0FDF9',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00D9A5',
    marginTop: 8,
  },
  receiptPreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  receiptImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeReceiptButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
  },
  submitButton: {
    backgroundColor: '#00D9A5',
    padding: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
});