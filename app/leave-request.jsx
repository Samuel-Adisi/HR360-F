import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const LeaveRequestsScreen = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const [leaveRequests, setLeaveRequests] = useState([
    {
      id: "LR001",
      employee: "Samuel Adisi",
      type: "Annual Leave",
      from: "2024-08-01",
      to: "2024-08-05",
      days: 5,
      status: "Pending",
      reason: "Family vacation to the northern region",
      submittedDate: "2024-07-15",
    },
    {
      id: "LR002",
      employee: "Michael Obeng",
      type: "Sick Leave",
      from: "2024-07-20",
      to: "2024-07-22",
      days: 3,
      status: "Approved",
      reason: "Medical rest due to flu",
      submittedDate: "2024-07-18",
      approvedBy: "Samuel Adisi",
      approvedDate: "2024-07-19",
    },
    {
      id: "LR003",
      employee: "Emily Anani",
      type: "Casual Leave",
      from: "2024-07-18",
      to: "2024-07-18",
      days: 1,
      status: "Rejected",
      reason: "Personal matter",
      submittedDate: "2024-07-17",
      rejectedBy: "Samuel Adisi",
      rejectedDate: "2024-07-17",
      rejectionReason: "Insufficient notice period",
    },
    {
      id: "LR004",
      employee: "David Yaw",
      type: "Annual Leave",
      from: "2024-08-10",
      to: "2024-08-15",
      days: 6,
      status: "Pending",
      reason: "Wedding ceremony",
      submittedDate: "2024-07-20",
    },
    {
      id: "LR005",
      employee: "Samuel Adisi",
      type: "Emergency Leave",
      from: "2024-07-25",
      to: "2024-07-26",
      days: 2,
      status: "Approved",
      reason: "Family emergency",
      submittedDate: "2024-07-24",
      approvedBy: "Emily Anani",
      approvedDate: "2024-07-24",
    },
  ]);

  // Get unique leave types and statuses
  const leaveTypes = useMemo(() => {
    const types = [...new Set(leaveRequests.map((req) => req.type))];
    return types.sort();
  }, [leaveRequests]);

  const statuses = ["Pending", "Approved", "Rejected"];

  // Combined filtering
  const filteredRequests = useMemo(() => {
    let filtered = leaveRequests;

    // Tab filter
    if (activeTab !== "all") {
      filtered = filtered.filter(
        (r) => r.status.toLowerCase() === activeTab.toLowerCase(),
      );
    }

    // Type filter
    if (selectedType) {
      filtered = filtered.filter((r) => r.type === selectedType);
    }

    // Status filter (only when on 'all' tab)
    if (selectedStatus && activeTab === "all") {
      filtered = filtered.filter((r) => r.status === selectedStatus);
    }

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.employee.toLowerCase().includes(q) ||
          r.type.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q) ||
          r.reason.toLowerCase().includes(q),
      );
    }

    return filtered;
  }, [leaveRequests, activeTab, searchQuery, selectedType, selectedStatus]);

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

  const handleApprove = (request) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? {
              ...r,
              status: "Approved",
              approvedBy: "Current User",
              approvedDate: new Date().toISOString().split("T")[0],
            }
          : r,
      ),
    );
    setSelectedRequest(null);
  };

  const handleReject = (request) => {
    setLeaveRequests((prev) =>
      prev.map((r) =>
        r.id === request.id
          ? {
              ...r,
              status: "Rejected",
              rejectedBy: "Current User",
              rejectedDate: new Date().toISOString().split("T")[0],
              rejectionReason: "Not specified",
            }
          : r,
      ),
    );
    setSelectedRequest(null);
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
            <Text style={styles.avatarText}>{item.employee.charAt(0)}</Text>
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.employeeName}>{item.employee}</Text>
            <Text style={styles.requestId}>{item.id}</Text>
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
          <Text style={styles.leaveType}>{item.type}</Text>
        </View>

        <View style={styles.dateRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.dateText}>
            {item.from} → {item.to}
          </Text>
        </View>

        <View style={styles.daysRow}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.daysText}>
            {item.days} day{item.days > 1 ? "s" : ""}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="document-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No leave requests found</Text>
      <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Leave Requests</Text>
          <Text style={styles.headerSubtitle}>
            {leaveRequests.length} total requests
          </Text>
        </View>
      </View>

      {/* Tabs */}
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

      {/* Filter Section */}
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

      {/* Results Bar */}
      {hasActiveFilters && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {filteredRequests.length}{" "}
            {filteredRequests.length === 1 ? "result" : "results"}
          </Text>
        </View>
      )}

      {/* List */}
      {filteredRequests.length > 0 ? (
        <FlatList
          data={filteredRequests}
          keyExtractor={(item) => item.id}
          renderItem={renderRequest}
          contentContainerStyle={styles.list}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Details Modal */}
      <Modal
        visible={!!selectedRequest}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedRequest(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Leave Request Details</Text>
              <TouchableOpacity onPress={() => setSelectedRequest(null)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Body (SCROLLABLE) */}
            {selectedRequest && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Request Information</Text>
                  <Detail label="Request ID" value={selectedRequest.id} />
                  <Detail label="Employee" value={selectedRequest.employee} />
                  <Detail label="Leave Type" value={selectedRequest.type} />
                  <Detail
                    label="Submitted Date"
                    value={selectedRequest.submittedDate}
                  />
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Leave Period</Text>
                  <Detail label="Start Date" value={selectedRequest.from} />
                  <Detail label="End Date" value={selectedRequest.to} />
                  <Detail
                    label="Duration"
                    value={`${selectedRequest.days} day${selectedRequest.days > 1 ? "s" : ""}`}
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
                        value={selectedRequest.approvedBy}
                      />
                      <Detail
                        label="Approved Date"
                        value={selectedRequest.approvedDate}
                      />
                    </>
                  )}

                  {selectedRequest.status === "Rejected" && (
                    <>
                      <Detail
                        label="Rejected By"
                        value={selectedRequest.rejectedBy}
                      />
                      <Detail
                        label="Rejected Date"
                        value={selectedRequest.rejectedDate}
                      />
                      {selectedRequest.rejectionReason && (
                        <Detail
                          label="Rejection Reason"
                          value={selectedRequest.rejectionReason}
                        />
                      )}
                    </>
                  )}
                </View>
              </ScrollView>
            )}

            {/* Footer (FIXED) - Only show for pending requests */}
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
