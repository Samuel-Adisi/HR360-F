import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
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

const LeaveRequestsScreen = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [leaveRequests, setLeaveRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [statistics, setStatistics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  // Available leave types (you can also fetch this from API if needed)
  const leaveTypes = [
    "Annual Leave",
    "Sick Leave",
    "Casual Leave",
    "Emergency Leave",
    "Maternity Leave",
    "Paternity Leave",
  ];

  const statuses = ["Pending", "Approved", "Rejected"];

  // Fetch leave requests from API
  const fetchLeaveRequests = useCallback(async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams();

      // Status filter from tab
      if (activeTab !== "all") {
        params.append(
          "status",
          activeTab.charAt(0).toUpperCase() + activeTab.slice(1),
        );
      }

      // Additional status filter (when on 'all' tab)
      if (selectedStatus && activeTab === "all") {
        params.append("status", selectedStatus);
      }

      // Leave type filter
      if (selectedType) {
        params.append("leave_type", selectedType);
      }

      // Search query
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim());
      }

      // Ordering (most recent first)
      params.append("ordering", "-created_at");

      const queryString = params.toString();
      const url = `/api/leave-requests/${queryString ? `?${queryString}` : ""}`;

      const res = await api.get(url);

      if (res.status === 200) {
        setLeaveRequests(res.data);
        console.log(res.data);
      }
    } catch (error) {
      console.log(
        "Error fetching leave requests:",
        error.response?.data || error,
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [activeTab, searchQuery, selectedType, selectedStatus]);

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      const res = await api.get("/api/leave-requests/statistics/");
      if (res.status === 200) {
        setStatistics({
          total: res.data.total || 0,
          pending: res.data.pending || 0,
          approved: res.data.approved || 0,
          rejected: res.data.rejected || 0,
        });
      }
    } catch (error) {
      console.log("Error fetching statistics:", error.response?.data || error);
    }
  };

  // Initial load
  useEffect(() => {
    fetchLeaveRequests();
    fetchStatistics();
  }, []);

  // Reload when filters change
  useEffect(() => {
    fetchLeaveRequests();
  }, [fetchLeaveRequests]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchLeaveRequests();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchLeaveRequests();
    fetchStatistics();
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedType("");
    setSelectedStatus("");
  };

  const hasActiveFilters = searchQuery || selectedType || selectedStatus;

  const statusColor = (status) => {
    switch (status) {
      case "Approved":
        return "#22C55E";
      case "Rejected":
        return "#EF4444";
      default:
        return "#F59E0B";
    }
  };

  const handleLeaveBalance = async (request) => {
    try {
      const res = await api.post(`/api/leave-balance/${request.id}/`);

      if (res.status === 200) {
        console.log(res.data);
      }
    } catch (error) {
      console.log(
        "Error processing leave balance:",
        error.response?.data || error,
      );
    }
  };

  const handleApprove = async (request) => {
    try {
      const res = await api.post(`/api/approve-leave/${request.id}/`);

      if (res.status === 200) {
        setSelectedRequest(null);
        fetchLeaveRequests();
        fetchStatistics();
        handleLeaveBalance(request);
      }
    } catch (error) {
      console.log("Error approving request:", error.response?.data || error);
      alert("Failed to approve request. Please try again.");
    }
  };

  const handleReject = async (request) => {
    try {
      const res = await api.post(`/api/reject-leave/${request.id}/`, {
        status: "Rejected",
        rejection_reason: "Not specified",
      });

      if (res.status === 200) {
        setSelectedRequest(null);
        fetchLeaveRequests();
        fetchStatistics();
      }
    } catch (error) {
      console.log("Error rejecting request:", error.response?.data || error);
      alert("Failed to reject request. Please try again.");
    }
  };

  const renderRequest = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedRequest(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.employee_name ? item.employee_name.charAt(0) : "U"}
            </Text>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.employeeName}>
              {item.employee_name || "Unknown"}
            </Text>
            <Text style={styles.requestId}>{`#${item.id}`}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: statusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.typeRow}>
          <Ionicons name="document-text-outline" size={16} color="#666" />
          <Text style={styles.leaveType}>{item.leave_type}</Text>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateText}>
            {item.start_date} → {item.end_date}
          </Text>
        </View>

        <View style={styles.daysRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.daysText}>
            {item.total_days} day{item.total_days > 1 ? "s" : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No leave requests found</Text>
      <Text style={styles.emptyText}>
        {hasActiveFilters
          ? "Try adjusting your search or filters"
          : "No leave requests available"}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Leave Requests</Text>
          <Text style={styles.headerSubtitle}>
            {statistics.total} total requests
          </Text>
        </View>
      </View>

      <View style={styles.tabs}>
        {[
          { key: "all", label: "All" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.activeTab]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab.key && styles.activeTabText,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

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
            placeholder="Search by employee, type, ID..."
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

      {showFilters && (
        <View style={styles.filterSection}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Leave Type</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {leaveTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.chip,
                      selectedType === type && styles.chipActive,
                    ]}
                    onPress={() =>
                      setSelectedType(selectedType === type ? "" : type)
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedType === type && styles.chipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {activeTab === "all" && (
            <View style={styles.filterGroup}>
              <Text style={styles.filterLabel}>Status</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={styles.filterChips}>
                  {statuses.map((status) => (
                    <TouchableOpacity
                      key={status}
                      style={[
                        styles.chip,
                        selectedStatus === status && styles.chipActive,
                      ]}
                      onPress={() =>
                        setSelectedStatus(
                          selectedStatus === status ? "" : status,
                        )
                      }
                    >
                      <Text
                        style={[
                          styles.chipText,
                          selectedStatus === status && styles.chipTextActive,
                        ]}
                      >
                        {status}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>
          )}

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

      {hasActiveFilters && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {leaveRequests.length}{" "}
            {leaveRequests.length === 1 ? "result" : "results"}
          </Text>
        </View>
      )}

      {isLoading && !isRefreshing ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : leaveRequests.length > 0 ? (
        <FlatList
          data={leaveRequests}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderRequest}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        renderEmptyState()
      )}

      <Modal
        visible={!!selectedRequest}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRequest(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Leave Request Details</Text>
              <TouchableOpacity onPress={() => setSelectedRequest(null)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedRequest && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Request Information</Text>
                  <Detail label="Request ID" value={`#${selectedRequest.id}`} />
                  <Detail
                    label="Employee"
                    value={selectedRequest.employee_name || "Unknown"}
                  />
                  <Detail
                    label="Leave Type"
                    value={selectedRequest.leave_type}
                  />
                  <Detail
                    label="Submitted Date"
                    value={selectedRequest.created_at?.split("T")[0] || "N/A"}
                  />
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Leave Period</Text>
                  <Detail
                    label="Start Date"
                    value={selectedRequest.start_date}
                  />
                  <Detail label="End Date" value={selectedRequest.end_date} />
                  <Detail
                    label="Duration"
                    value={`${selectedRequest.total_days} day${selectedRequest.total_days > 1 ? "s" : ""}`}
                  />
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Reason</Text>
                  <Text style={styles.reasonText}>
                    {selectedRequest.reason}
                  </Text>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Status</Text>
                  <View
                    style={[
                      styles.statusBadgeLarge,
                      { backgroundColor: statusColor(selectedRequest.status) },
                    ]}
                  >
                    <Text style={styles.statusTextLarge}>
                      {selectedRequest.status}
                    </Text>
                  </View>

                  {selectedRequest.status === "Approved" && (
                    <>
                      <Detail
                        label="Approved By"
                        value={selectedRequest.approved_by_name || "N/A"}
                      />
                      <Detail
                        label="Approved Date"
                        value={
                          selectedRequest.approved_at?.split("T")[0] || "N/A"
                        }
                      />
                    </>
                  )}

                  {selectedRequest.status === "Rejected" && (
                    <>
                      <Detail
                        label="Rejected By"
                        value={selectedRequest.rejected_by || "N/A"}
                      />
                      <Detail
                        label="Rejected Date"
                        value={
                          selectedRequest.rejected_at?.split("T")[0] || "N/A"
                        }
                      />
                      {selectedRequest.rejection_reason && (
                        <Detail
                          label="Rejection Reason"
                          value={selectedRequest.rejection_reason}
                        />
                      )}
                    </>
                  )}
                </View>
              </ScrollView>
            )}

            {selectedRequest?.status === "Pending" && (
              <View style={styles.modalFooter}>
                <TouchableOpacity
                  style={styles.rejectBtn}
                  onPress={() => handleReject(selectedRequest)}
                >
                  <Ionicons
                    name="close-circle-outline"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.actionText}>Reject</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.approveBtn}
                  onPress={() => handleApprove(selectedRequest)}
                >
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={20}
                    color="#fff"
                  />
                  <Text style={styles.actionText}>Approve</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const Detail = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

export default LeaveRequestsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
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
  tabs: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  tabText: {
    fontSize: 15,
    color: "#888",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "500",
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  requestId: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  cardBody: {
    gap: 6,
  },
  typeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  leaveType: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dateText: {
    color: "#666",
    fontSize: 13,
  },
  daysRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  daysText: {
    color: "#666",
    fontSize: 13,
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
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "90%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#222",
  },
  modalBody: {
    padding: 16,
    maxHeight: "70%",
  },
  detailSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
  },
  infoValue: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  reasonText: {
    fontSize: 14,
    color: "#222",
    lineHeight: 20,
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
  },
  statusBadgeLarge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  statusTextLarge: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  approveBtn: {
    flex: 1,
    backgroundColor: "#22C55E",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
