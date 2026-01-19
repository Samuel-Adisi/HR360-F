import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Image,
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const AttendanceScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedShift, setSelectedShift] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [attendanceData, setAttendanceData] = useState([
    {
      id: 1,
      name: "Brown",
      employeeId: "1001",
      department: "Development",
      checkIn: "10:28",
      checkOut: "18:30",
      shift: "Shift 1",
      status: "Present",
      image: "https://i.pravatar.cc/150?img=12",
    },
    {
      id: 2,
      name: "John Deo",
      employeeId: "1002",
      department: "Finance",
      checkIn: "10:35",
      checkOut: "18:45",
      shift: "Shift 1",
      status: "Present",
      image: "https://i.pravatar.cc/150?img=45",
    },
    {
      id: 3,
      name: "Sarah Smith",
      employeeId: "1003",
      department: "Transport",
      checkIn: "-",
      checkOut: "-",
      shift: "Shift 1",
      status: "Leave",
      image: "https://i.pravatar.cc/150?img=47",
    },
    {
      id: 4,
      name: "Mark Sina",
      employeeId: "1004",
      department: "Development",
      checkIn: "10:30",
      checkOut: "-",
      shift: "Shift 2",
      status: "Present",
      image: "https://i.pravatar.cc/150?img=33",
    },
    {
      id: 5,
      name: "Jay Soni",
      employeeId: "1005",
      department: "Testing",
      checkIn: "-",
      checkOut: "-",
      shift: "Shift 2",
      status: "Leave",
      image: "https://i.pravatar.cc/150?img=15",
    },
    {
      id: 6,
      name: "Megha Trivedi",
      employeeId: "1006",
      department: "Account",
      checkIn: "10:25",
      checkOut: "18:20",
      shift: "Shift 1",
      status: "Present",
      image: "https://i.pravatar.cc/150?img=32",
    },
    {
      id: 7,
      name: "Pooja Patel",
      employeeId: "1007",
      department: "Testing",
      checkIn: "10:32",
      checkOut: "-",
      shift: "Shift 1",
      status: "Present",
      image: "https://i.pravatar.cc/150?img=44",
    },
    {
      id: 8,
      name: "Alex Johnson",
      employeeId: "1008",
      department: "Development",
      checkIn: "10:15",
      checkOut: "18:10",
      shift: "Shift 1",
      status: "Present",
      image: "https://i.pravatar.cc/150?img=13",
    },
    {
      id: 9,
      name: "Emma Davis",
      employeeId: "1009",
      department: "Finance",
      checkIn: "-",
      checkOut: "-",
      shift: "Shift 2",
      status: "Absent",
      image: "https://i.pravatar.cc/150?img=17",
    },
    {
      id: 10,
      name: "Chris Martin",
      employeeId: "1010",
      department: "Transport",
      checkIn: "10:45",
      checkOut: "19:00",
      shift: "Shift 1",
      status: "Late",
      image: "https://i.pravatar.cc/150?img=11",
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Present":
        return "#10B981";
      case "Leave":
        return "#F59E0B";
      case "Absent":
        return "#EF4444";
      case "Late":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "Present":
        return "#D1FAE5";
      case "Leave":
        return "#FEF3C7";
      case "Absent":
        return "#FEE2E2";
      case "Late":
        return "#EDE9FE";
      default:
        return "#F3F4F6";
    }
  };

  // Get unique values for filters
  const departments = useMemo(() => {
    const depts = [...new Set(attendanceData.map((emp) => emp.department))];
    return depts.sort();
  }, [attendanceData]);

  const shifts = useMemo(() => {
    const shiftList = [...new Set(attendanceData.map((emp) => emp.shift))];
    return shiftList.sort();
  }, [attendanceData]);

  const statuses = ["Present", "Absent", "Leave", "Late"];

  // Combined filtering
  const filteredData = useMemo(() => {
    let filtered = attendanceData;

    if (selectedDepartment) {
      filtered = filtered.filter(
        (emp) => emp.department === selectedDepartment,
      );
    }

    if (selectedShift) {
      filtered = filtered.filter((emp) => emp.shift === selectedShift);
    }

    if (selectedStatus) {
      filtered = filtered.filter((emp) => emp.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((item) => {
        return (
          item.name.toLowerCase().includes(query) ||
          item.employeeId.toLowerCase().includes(query) ||
          item.department.toLowerCase().includes(query) ||
          item.status.toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [
    attendanceData,
    searchQuery,
    selectedDepartment,
    selectedShift,
    selectedStatus,
  ]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("");
    setSelectedShift("");
    setSelectedStatus("");
  };

  const hasActiveFilters =
    searchQuery || selectedDepartment || selectedShift || selectedStatus;

  const renderAttendanceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedEmployee(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardLeft}>
          <Image source={{ uri: item.image }} style={styles.cardAvatar} />
          <View style={styles.cardInfo}>
            <Text style={styles.cardName}>{item.name}</Text>
            <Text style={styles.cardSubtext}>ID: {item.employeeId}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusPill,
            { backgroundColor: getStatusBgColor(item.status) },
          ]}
        >
          <Text
            style={[
              styles.statusPillText,
              { color: getStatusColor(item.status) },
            ]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardDivider} />

      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="business-outline" size={18} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Department</Text>
            <Text style={styles.detailText}>{item.department}</Text>
          </View>
        </View>

        <View style={styles.detailRow}>
          <View style={styles.detailItem}>
            <Ionicons name="log-in-outline" size={18} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Check In</Text>
              <Text
                style={[
                  styles.detailText,
                  item.checkIn === "-" ? styles.absentText : styles.checkInText,
                ]}
              >
                {item.checkIn === "-" ? "N/A" : item.checkIn}
              </Text>
            </View>
          </View>

          <View style={styles.detailItem}>
            <Ionicons name="log-out-outline" size={18} color="#666" />
            <View style={styles.detailContent}>
              <Text style={styles.detailLabel}>Check Out</Text>
              <Text
                style={[
                  styles.detailText,
                  item.checkOut === "-"
                    ? styles.pendingText
                    : styles.checkOutText,
                ]}
              >
                {item.checkOut === "-" ? "N/A" : item.checkOut}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={18} color="#666" />
          <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>Shift</Text>
            <Text style={styles.detailText}>{item.shift}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmployeeDetails = () => {
    if (!selectedEmployee) return null;

    return (
      <Modal
        visible={!!selectedEmployee}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Attendance Details</Text>
              <TouchableOpacity onPress={() => setSelectedEmployee(null)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView
              style={styles.modalBody}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.employeeProfile}>
                <Image
                  source={{ uri: selectedEmployee.image }}
                  style={styles.profileAvatar}
                />
                <Text style={styles.profileName}>{selectedEmployee.name}</Text>
                <Text style={styles.profileId}>
                  ID: {selectedEmployee.employeeId}
                </Text>
                <View
                  style={[
                    styles.profileStatusBadge,
                    {
                      backgroundColor: getStatusBgColor(
                        selectedEmployee.status,
                      ),
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.profileStatusText,
                      { color: getStatusColor(selectedEmployee.status) },
                    ]}
                  >
                    {selectedEmployee.status}
                  </Text>
                </View>
              </View>

              <View style={styles.infoSection}>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Department</Text>
                    <Text style={styles.infoValue}>
                      {selectedEmployee.department}
                    </Text>
                  </View>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Shift</Text>
                    <Text style={styles.infoValue}>
                      {selectedEmployee.shift}
                    </Text>
                  </View>
                </View>
                <View style={styles.infoRow}>
                  <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Check In Time</Text>
                    <Text
                      style={[
                        styles.infoValue,
                        selectedEmployee.checkIn !== "-" && styles.checkInText,
                      ]}
                    >
                      {selectedEmployee.checkIn === "-"
                        ? "Not checked in"
                        : selectedEmployee.checkIn}
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No attendance records found</Text>
      <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Today's Attendance</Text>
          <Text style={styles.headerDate}>
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </Text>
        </View>
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
            placeholder="Search by name, ID, department..."
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
            <Text style={styles.filterLabel}>Department</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {departments.map((dept) => (
                  <TouchableOpacity
                    key={dept}
                    style={[
                      styles.chip,
                      selectedDepartment === dept && styles.chipActive,
                    ]}
                    onPress={() =>
                      setSelectedDepartment(
                        selectedDepartment === dept ? "" : dept,
                      )
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedDepartment === dept && styles.chipTextActive,
                      ]}
                    >
                      {dept}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Shift</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {shifts.map((shift) => (
                  <TouchableOpacity
                    key={shift}
                    style={[
                      styles.chip,
                      selectedShift === shift && styles.chipActive,
                    ]}
                    onPress={() =>
                      setSelectedShift(selectedShift === shift ? "" : shift)
                    }
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedShift === shift && styles.chipTextActive,
                      ]}
                    >
                      {shift}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

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
                      setSelectedStatus(selectedStatus === status ? "" : status)
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
            {filteredData.length}{" "}
            {filteredData.length === 1 ? "result" : "results"}
          </Text>
        </View>
      )}

      <FlatList
        data={filteredData}
        renderItem={renderAttendanceCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState()}
      />

      {renderEmployeeDetails()}
    </SafeAreaView>
  );
};

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
  headerDate: {
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
  listContainer: {
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
  cardLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  cardSubtext: {
    fontSize: 13,
    color: "#888",
  },
  statusPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusPillText: {
    fontSize: 12,
    fontWeight: "700",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginBottom: 12,
  },
  cardDetails: {
    gap: 10,
  },
  detailRow: {
    flexDirection: "row",
    gap: 10,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  detailContent: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 2,
  },
  detailText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#222",
  },
  checkInText: {
    color: "#10B981",
  },
  checkOutText: {
    color: "#3B82F6",
  },
  pendingText: {
    color: "#F59E0B",
  },
  absentText: {
    color: "#EF4444",
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
    maxHeight: "80%",
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
  },
  employeeProfile: {
    alignItems: "center",
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    marginBottom: 4,
  },
  profileId: {
    fontSize: 14,
    color: "#888",
    marginBottom: 12,
  },
  profileStatusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  profileStatusText: {
    fontSize: 14,
    fontWeight: "700",
  },
  infoSection: {
    paddingVertical: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
    gap: 12,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: "#888",
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
  },
});

export default AttendanceScreen;
