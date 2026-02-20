import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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
import api from "../src/services/api";

const EmployeeDataScreen = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPosition, setSelectedPosition] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    async function fetchEmployee() {
      try {
        const res = await api.get("/api/employees");

        if (res.status == 200) {
          console.log(res.data);
          setEmployees(res.data.employees);
        }
      } catch (error) {
        console.log("ERROR DATA:", error.response?.data);
        console.log("ERROR STATUS:", error.response?.status);
        console.log("ERROR MESSAGE:", error.message);
      }
    }

    fetchEmployee();
  }, []);

  // Get unique departments and positions
  const departments = useMemo(() => {
    const depts = [...new Set(employees.map((emp) => emp.department))];
    return depts.sort();
  }, [employees]);

  const positions = useMemo(() => {
    const pos = [...new Set(employees.map((emp) => emp.position))];
    return pos.sort();
  }, [employees]);

  // Combined filtering
  const filteredEmployees = useMemo(() => {
    let filtered = employees;

    if (selectedDepartment) {
      filtered = filtered.filter(
        (emp) => emp.department === selectedDepartment,
      );
    }

    if (selectedPosition) {
      filtered = filtered.filter((emp) => emp.position === selectedPosition);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((emp) => {
        return (
          emp.name.toLowerCase().includes(query) ||
          emp.email.toLowerCase().includes(query) ||
          emp.position.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query) ||
          emp.phone.includes(query) ||
          emp.jobHistory.some(
            (job) =>
              job.position.toLowerCase().includes(query) ||
              job.department.toLowerCase().includes(query),
          )
        );
      });
    }

    return filtered;
  }, [employees, searchQuery, selectedDepartment, selectedPosition]);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedDepartment("");
    setSelectedPosition("");
  };

  const hasActiveFilters =
    searchQuery || selectedDepartment || selectedPosition;

  const handleAddEmployee = () => {
    // Navigate to add employee screen
    router.push("./add-employee");
  };

  const handleEditEmployee = async (selectedEmployee) => {
    const employeeID = selectedEmployee.id;

    router.push({
      pathname: "./edit-employee",
      params: { employeeID },
    });

    setSelectedEmployee(null);
  };

  const toggleNode = (id) => {
    setExpandedNodes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const buildOrgTree = () => {
    const tree = {};
    employees.forEach((emp) => {
      if (!tree[emp.managerId]) tree[emp.managerId] = [];
      tree[emp.managerId].push(emp);
    });
    return tree;
  };

  const renderOrgNode = (employee, tree, level = 0) => {
    const hasChildren = tree[employee.id] && tree[employee.id].length > 0;
    const isExpanded = expandedNodes[employee.id];

    return (
      <View key={employee.id} style={styles.orgNodeContainer}>
        <View style={[styles.orgNode, { marginLeft: level * 20 }]}>
          <TouchableOpacity
            style={styles.orgNodeContent}
            onPress={() => hasChildren && toggleNode(employee.id)}
          >
            {hasChildren && (
              <Ionicons
                name={isExpanded ? "chevron-down" : "chevron-forward"}
                size={16}
                color="#666"
                style={{ marginRight: 8 }}
              />
            )}
            <View
              style={[styles.orgNodeInfo, !hasChildren && { marginLeft: 24 }]}
            >
              <Text style={styles.orgNodeName}>{employee.name}</Text>
              <Text style={styles.orgNodePosition}>{employee.position}</Text>
            </View>
          </TouchableOpacity>
        </View>
        {hasChildren &&
          isExpanded &&
          tree[employee.id].map((child) =>
            renderOrgNode(child, tree, level + 1),
          )}
      </View>
    );
  };

  const renderEmployeeCard = ({ item }) => (
    <TouchableOpacity
      style={styles.employeeCard}
      onPress={() => setSelectedEmployee(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {item.full_name?.charAt(0) || "?"}
          </Text>
        </View>
        <View style={styles.cardInfo}>
          <Text style={styles.employeeName}>{item.full_name}</Text>
          <Text style={styles.employeePosition}>{item.position}</Text>
        </View>
      </View>

      <View style={styles.cardDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.phone}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="business-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{item.department}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmployeeDetails = () => {
    if (!selectedEmployee) return null;
    setSelectedEmployee(selectedEmployee);
    return (
      <Modal
        visible={!!selectedEmployee}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Employee Details</Text>
              <TouchableOpacity onPress={() => setSelectedEmployee(null)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Name</Text>
                  <Text style={styles.infoValue}>
                    {selectedEmployee.full_name}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{selectedEmployee.email}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone</Text>
                  <Text style={styles.infoValue}>{selectedEmployee.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Hire Date</Text>
                  <Text style={styles.infoValue}>
                    {selectedEmployee.hireDate}
                  </Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Current Position</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Position</Text>
                  <Text style={styles.infoValue}>
                    {selectedEmployee.position}
                  </Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Department</Text>
                  <Text style={styles.infoValue}>
                    {selectedEmployee.department}
                  </Text>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => handleEditEmployee(selectedEmployee)}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.editButtonText}>Edit Employee</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="search-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No employees found</Text>
      <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
    </View>
  );

  const tree = buildOrgTree();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Employees</Text>
          <Text style={styles.headerSubtitle}>{employees.length} total</Text>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "employees" && styles.activeTab]}
          onPress={() => setActiveTab("employees")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "employees" && styles.activeTabText,
            ]}
          >
            List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "orgChart" && styles.activeTab]}
          onPress={() => setActiveTab("orgChart")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "orgChart" && styles.activeTabText,
            ]}
          >
            Org Chart
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "employees" && (
        <>
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
                placeholder="Search by name, email, position..."
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
                            selectedDepartment === dept &&
                              styles.chipTextActive,
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
                <Text style={styles.filterLabel}>Position</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.filterChips}>
                    {positions.map((pos) => (
                      <TouchableOpacity
                        key={pos}
                        style={[
                          styles.chip,
                          selectedPosition === pos && styles.chipActive,
                        ]}
                        onPress={() =>
                          setSelectedPosition(
                            selectedPosition === pos ? "" : pos,
                          )
                        }
                      >
                        <Text
                          style={[
                            styles.chipText,
                            selectedPosition === pos && styles.chipTextActive,
                          ]}
                        >
                          {pos}
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
                {filteredEmployees.length}{" "}
                {filteredEmployees.length === 1 ? "result" : "results"}
              </Text>
            </View>
          )}
        </>
      )}

      {activeTab === "employees" ? (
        filteredEmployees.length > 0 ? (
          <FlatList
            data={filteredEmployees}
            renderItem={renderEmployeeCard}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.list}
          />
        ) : (
          renderEmptyState()
        )
      ) : (
        <ScrollView style={styles.orgChart}>
          {tree[null] && tree[null].map((emp) => renderOrgNode(emp, tree))}
        </ScrollView>
      )}

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
  headerSubtitle: {
    fontSize: 13,
    color: "#888",
    marginTop: 2,
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
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
  employeeCard: {
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
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  cardInfo: {
    flex: 1,
  },
  employeeName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  employeePosition: {
    fontSize: 14,
    color: "#666",
  },
  cardDetails: {
    gap: 6,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 13,
    color: "#666",
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
  orgChart: {
    flex: 1,
    padding: 12,
  },
  orgNodeContainer: {
    marginBottom: 6,
  },
  orgNode: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginBottom: 4,
  },
  orgNodeContent: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  orgNodeInfo: {
    flex: 1,
  },
  orgNodeName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 2,
  },
  orgNodePosition: {
    fontSize: 13,
    color: "#666",
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
  },
  jobHistoryItem: {
    backgroundColor: "#f9f9f9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: "600",
    color: "#222",
    marginBottom: 3,
  },
  jobDepartment: {
    fontSize: 13,
    color: "#666",
    marginBottom: 4,
  },
  jobDates: {
    fontSize: 12,
    color: "#999",
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  editButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default EmployeeDataScreen;
