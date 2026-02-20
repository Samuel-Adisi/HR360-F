import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import api from "../src/services/api";

const LeaveBalanceScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLeaveType, setSelectedLeaveType] = useState("");
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLeaveBalances = async () => {
    try {
      const res = await api.get("/api/leave-balance");
      console.log("Leave Balance Response:", res.data);

      if (res.status === 200) {
        // Handle different response formats
        const data = res.data.data || res.data;
        const balances = Array.isArray(data) ? data : [];
        setLeaveBalances(balances);
      }
    } catch (error) {
      console.log("ERROR DATA:", error.response?.data);
      console.log("ERROR STATUS:", error.response?.status);
      console.log("ERROR MESSAGE:", error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchLeaveBalances();
  };

  // Get unique leave types
  const leaveTypes = useMemo(() => {
    const types = [...new Set(leaveBalances.map((item) => item.leave_type))];
    return types.filter(Boolean).sort();
  }, [leaveBalances]);

  // Combined filtering
  const filteredBalances = useMemo(() => {
    let filtered = leaveBalances;

    // Leave Type filter
    if (selectedLeaveType) {
      filtered = filtered.filter(
        (item) => item.leave_type === selectedLeaveType,
      );
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name?.toLowerCase().includes(q) ||
          item.emp_id?.toLowerCase().includes(q) ||
          item.leave_type?.toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [leaveBalances, searchQuery, selectedLeaveType]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedLeaveType("");
  };

  const hasActiveFilters = searchQuery || selectedLeaveType;

  const renderBalanceItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.name?.charAt(0)?.toUpperCase() || "?"}
            </Text>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.employeeName}>{item.name || "N/A"}</Text>
            <Text style={styles.empId}>ID: {item.emp_id || "N/A"}</Text>
          </View>
        </View>
        <View style={styles.leaveTypeBadge}>
          <Text style={styles.leaveTypeText}>{item.leave_type || "N/A"}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoLabel}>DOJ:</Text>
          <Text style={styles.infoValue}>{item.doj || "N/A"}</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Entitled</Text>
            <Text style={styles.statValue}>{item.entitled || 0}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Utilized</Text>
            <Text style={[styles.statValue, { color: "#EF4444" }]}>
              {item.utilized || 0}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Balanced</Text>
            <Text style={[styles.statValue, { color: "#22C55E" }]}>
              {item.balanced || 0}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Carried Fwd</Text>
            <Text style={[styles.statValue, { color: "#F59E0B" }]}>
              {item.carried_forward || 0}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="calendar-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No leave balances found</Text>
      <Text style={styles.emptyText}>
        {hasActiveFilters
          ? "Try adjusting your search or filters"
          : "No leave balance data available"}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Leave Balance</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading leave balances...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Leave Balance</Text>
          <Text style={styles.headerSubtitle}>
            {leaveBalances.length}{" "}
            {leaveBalances.length === 1 ? "employee" : "employees"}
          </Text>
        </View>
      </View>

      {/* Search and Filter */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={20}
            color="#999"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, ID, leave type..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#999" />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.filterButton,
            showFilters && styles.filterButtonActive,
          ]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name={showFilters ? "options" : "options-outline"}
            size={20}
            color={showFilters ? "#007AFF" : "#666"}
          />
        </TouchableOpacity>
      </View>

      {/* Filter Section */}
      {showFilters && (
        <View style={styles.filterSection}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Leave Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {leaveTypes.length > 0 ? (
                  leaveTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.chip,
                        selectedLeaveType === type && styles.chipActive,
                      ]}
                      onPress={() =>
                        setSelectedLeaveType(
                          selectedLeaveType === type ? "" : type,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedLeaveType === type && styles.chipTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))
                ) : (
                  <Text style={styles.noFiltersText}>
                    No leave types available
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>

          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearFilters}
              onPress={clearAllFilters}
            >
              <Text style={styles.clearFiltersText}>Clear all filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results Bar */}
      {hasActiveFilters && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {filteredBalances.length}{" "}
            {filteredBalances.length === 1 ? "result" : "results"}
          </Text>
        </View>
      )}

      {/* List */}
      {filteredBalances.length > 0 ? (
        <FlatList
          data={filteredBalances}
          keyExtractor={(item, index) =>
            item.id?.toString() || index.toString()
          }
          renderItem={renderBalanceItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]}
              tintColor="#007AFF"
            />
          }
        />
      ) : (
        <ScrollView
          contentContainerStyle={styles.emptyStateContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#007AFF"]}
              tintColor="#007AFF"
            />
          }
        >
          {renderEmptyState()}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default LeaveBalanceScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: "#222",
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  searchSection: {
    flexDirection: "row",
    padding: 12,
    backgroundColor: "#fff",
    gap: 8,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#222",
  },
  filterButton: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  filterButtonActive: {
    backgroundColor: "#E3F2FD",
  },
  filterSection: {
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  filterGroup: {
    marginBottom: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  filterChips: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  chipActive: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  chipText: {
    fontSize: 13,
    color: "#666",
  },
  chipTextActive: {
    color: "#fff",
    fontWeight: "500",
  },
  noFiltersText: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
  },
  clearFilters: {
    paddingVertical: 8,
    alignItems: "center",
  },
  clearFiltersText: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
  },
  resultsBar: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  resultsText: {
    fontSize: 13,
    color: "#666",
  },
  list: {
    padding: 12,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  avatarText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cardHeaderInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  empId: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  leaveTypeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#E3F2FD",
  },
  leaveTypeText: {
    color: "#007AFF",
    fontSize: 12,
    fontWeight: "500",
  },
  cardBody: {
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: "#666",
    marginLeft: 2,
  },
  infoValue: {
    fontSize: 13,
    color: "#222",
    fontWeight: "500",
  },
  statsGrid: {
    flexDirection: "row",
    gap: 8,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    marginBottom: 4,
    textAlign: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  emptyStateContainer: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
    marginTop: 16,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
  },
});
