import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
  Alert,
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

const AllDepartmentsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState(null);

  const [departments, setDepartments] = useState([
    {
      id: "1",
      name: "Mechanical Engg.",
      headOfDept: "Sanjay Chohan",
      phone: "+123 4567890",
      email: "test@example.com",
      totalEmp: 150,
    },
    {
      id: "2",
      name: "Civil Engg.",
      headOfDept: "Sanjana Patil",
      phone: "+123 4567890",
      email: "test@example.com",
      totalEmp: 130,
    },
    {
      id: "3",
      name: "Electrical Engg.",
      headOfDept: "Pooja Sarma",
      phone: "+123 4567890",
      email: "test@example.com",
      totalEmp: 160,
    },
    {
      id: "4",
      name: "M.C.A.",
      headOfDept: "Sanjay Chohan",
      phone: "+123 4567890",
      email: "test@example.com",
      totalEmp: 150,
    },
    {
      id: "5",
      name: "Computer Engg.",
      headOfDept: "Rajesh Malhotra",
      phone: "+123 4567890",
      email: "test@example.com",
      totalEmp: 60,
    },
    {
      id: "6",
      name: "M.B.A.",
      headOfDept: "Poonam Talati",
      phone: "+123 4567890",
      email: "test@example.com",
      totalEmp: 250,
    },
    {
      id: "7",
      name: "Mechanical Engg.",
      headOfDept: "Sanjay Chohan",
      phone: "+123 4567890",
      email: "test@example.com",
      totalEmp: 150,
    },
    {
      id: "8",
      name: "Civil Engg.",
      headOfDept: "Sanjana Patil",
      phone: "+123 4567890",
      email: "test@example.com",
      totalEmp: 130,
    },
    {
      id: "9",
      name: "Electrical Engg.",
      headOfDept: "Pooja Sarma",
      phone: "+123 4567890",
      email: "test@example.com",
      totalEmp: 160,
    },
  ]);

  // Get unique department heads
  const departmentHeads = useMemo(() => {
    const heads = [...new Set(departments.map((dept) => dept.headOfDept))];
    return heads.sort();
  }, [departments]);

  // Filtered departments
  const filteredDepartments = useMemo(() => {
    let filtered = departments;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (dept) =>
          dept.name.toLowerCase().includes(q) ||
          dept.headOfDept.toLowerCase().includes(q) ||
          dept.email.toLowerCase().includes(q) ||
          dept.phone.includes(q),
      );
    }

    return filtered;
  }, [departments, searchQuery]);

  const clearAllFilters = () => {
    setSearchQuery("");
  };

  const hasActiveFilters = searchQuery;

  const handleEdit = (department) => {
    setEditFormData({ ...department });
    setShowEditModal(true);
  };

  const handleDelete = (department) => {
    Alert.alert(
      "Delete Department",
      `Are you sure you want to delete "${department.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setDepartments((prev) =>
              prev.filter((d) => d.id !== department.id),
            );
            setSelectedDepartment(null);
          },
        },
      ],
    );
  };

  const handleSaveEdit = () => {
    if (!editFormData.name || !editFormData.headOfDept) {
      Alert.alert("Error", "Please fill all required fields");
      return;
    }

    setDepartments((prev) =>
      prev.map((d) => (d.id === editFormData.id ? editFormData : d)),
    );
    setShowEditModal(false);
    setEditFormData(null);
    Alert.alert("Success", "Department updated successfully");
  };

  const renderDepartment = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => setSelectedDepartment(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <View style={styles.deptIcon}>
            <Ionicons name="business" size={20} color="#007AFF" />
          </View>
          <View style={styles.cardHeaderInfo}>
            <Text style={styles.deptName}>{item.name}</Text>
            <Text style={styles.deptHead}>Head: {item.headOfDept}</Text>
          </View>
        </View>
        <View style={styles.empBadge}>
          <Ionicons name="people" size={14} color="#007AFF" />
          <Text style={styles.empCount}>{item.totalEmp}</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="call-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.phone}</Text>
        </View>
        <View style={styles.infoRow}>
          <Ionicons name="mail-outline" size={16} color="#666" />
          <Text style={styles.infoText}>{item.email}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleEdit(item)}
        >
          <Ionicons name="create-outline" size={18} color="#22C55E" />
          <Text style={styles.actionBtnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => handleDelete(item)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={[styles.actionBtnText, { color: "#EF4444" }]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="business-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No departments found</Text>
      <Text style={styles.emptyText}>Try adjusting your search</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>All Departments</Text>
          <Text style={styles.headerSubtitle}>
            {departments.length} departments
          </Text>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
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
            placeholder="Search by name, head, email, phone..."
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

      {/* Results Bar */}
      {hasActiveFilters && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {filteredDepartments.length}{" "}
            {filteredDepartments.length === 1 ? "result" : "results"}
          </Text>
          <TouchableOpacity onPress={clearAllFilters}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* List */}
      {filteredDepartments.length > 0 ? (
        <FlatList
          data={filteredDepartments}
          keyExtractor={(item) => item.id}
          renderItem={renderDepartment}
          contentContainerStyle={styles.list}
        />
      ) : (
        renderEmptyState()
      )}

      {/* Details Modal */}
      <Modal
        visible={!!selectedDepartment}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDepartment(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Department Details</Text>
              <TouchableOpacity onPress={() => setSelectedDepartment(null)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {selectedDepartment && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.detailSection}>
                  <View style={styles.detailIconHeader}>
                    <View style={styles.detailIconLarge}>
                      <Ionicons name="business" size={32} color="#007AFF" />
                    </View>
                    <Text style={styles.detailDeptName}>
                      {selectedDepartment.name}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>
                    Department Information
                  </Text>
                  <DetailRow
                    icon="person"
                    label="Head of Department"
                    value={selectedDepartment.headOfDept}
                  />
                  <DetailRow
                    icon="call"
                    label="Phone"
                    value={selectedDepartment.phone}
                  />
                  <DetailRow
                    icon="mail"
                    label="Email"
                    value={selectedDepartment.email}
                  />
                  <DetailRow
                    icon="people"
                    label="Total Employees"
                    value={selectedDepartment.totalEmp.toString()}
                  />
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => {
                  setSelectedDepartment(null);
                  setTimeout(() => handleDelete(selectedDepartment), 300);
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#fff" />
                <Text style={styles.actionText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.editBtn}
                onPress={() => {
                  const dept = selectedDepartment;
                  setSelectedDepartment(null);
                  setTimeout(() => handleEdit(dept), 300);
                }}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Modal */}
      <Modal
        visible={showEditModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Department</Text>
              <TouchableOpacity onPress={() => setShowEditModal(false)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            {editFormData && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Department Name *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editFormData.name}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, name: text })
                    }
                    placeholder="Enter department name"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Head of Department *</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editFormData.headOfDept}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, headOfDept: text })
                    }
                    placeholder="Enter head name"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Phone</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editFormData.phone}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, phone: text })
                    }
                    placeholder="Enter phone number"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Email</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editFormData.email}
                    onChangeText={(text) =>
                      setEditFormData({ ...editFormData, email: text })
                    }
                    placeholder="Enter email"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.formLabel}>Total Employees</Text>
                  <TextInput
                    style={styles.formInput}
                    value={editFormData.totalEmp.toString()}
                    onChangeText={(text) =>
                      setEditFormData({
                        ...editFormData,
                        totalEmp: parseInt(text) || 0,
                      })
                    }
                    placeholder="Enter total employees"
                    keyboardType="numeric"
                  />
                </View>
              </ScrollView>
            )}

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowEditModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleSaveEdit}>
                <Ionicons name="checkmark-circle" size={20} color="#fff" />
                <Text style={styles.actionText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const DetailRow = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <View style={styles.detailRowLeft}>
      <Ionicons name={icon} size={18} color="#666" />
      <Text style={styles.detailLabel}>{label}</Text>
    </View>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

export default AllDepartmentsScreen;

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
  resultsBar: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  resultsText: {
    fontSize: 13,
    color: "#666",
  },
  clearText: {
    fontSize: 13,
    color: "#007AFF",
    fontWeight: "500",
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
  deptIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  cardHeaderInfo: {
    flex: 1,
  },
  deptName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
  },
  deptHead: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  empBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#E3F2FD",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  empCount: {
    fontSize: 12,
    fontWeight: "600",
    color: "#007AFF",
  },
  cardBody: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  infoText: {
    fontSize: 13,
    color: "#666",
  },
  cardFooter: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    padding: 10,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
  },
  actionBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#22C55E",
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
  detailIconHeader: {
    alignItems: "center",
    paddingVertical: 12,
  },
  detailIconLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E3F2FD",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  detailDeptName: {
    fontSize: 20,
    fontWeight: "600",
    color: "#222",
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#222",
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailRowLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
    flex: 1,
    textAlign: "right",
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  formInput: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 12,
    fontSize: 15,
    color: "#222",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  modalFooter: {
    flexDirection: "row",
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#22C55E",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  deleteBtn: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#EF4444",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  saveBtn: {
    flex: 2,
    flexDirection: "row",
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  cancelBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
