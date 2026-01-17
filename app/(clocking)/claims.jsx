import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native'
import React, { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

const Claims = () => {
  const [claims, setClaims] = useState([
    {
      id: '1',
      type: 'Travel',
      amount: 450.00,
      date: '2025-01-15',
      status: 'pending',
      description: 'Client meeting - Taxi fare'
    },
    {
      id: '2',
      type: 'Meal',
      amount: 85.50,
      date: '2025-01-14',
      status: 'approved',
      description: 'Team lunch with client'
    },
    {
      id: '3',
      type: 'Office Supplies',
      amount: 120.00,
      date: '2025-01-10',
      status: 'rejected',
      description: 'Laptop accessories'
    },
  ]);

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
    <TouchableOpacity style={styles.claimCard}>
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
        <TouchableOpacity>
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
        <TouchableOpacity style={styles.newClaimButton}>
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
});