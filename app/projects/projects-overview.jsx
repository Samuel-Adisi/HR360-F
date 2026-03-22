import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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
import api from "../../src/services/api";

const AllProjectsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sortBy, setSortBy] = useState("-created_at"); // Django ordering format
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const statuses = ["All", "Active", "Pending", "On Hold", "Closed"];

  // Fetch projects from API
  const fetchProjects = useCallback(
    async (isRefreshing = false) => {
      try {
        if (isRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();

        // Add search query
        if (searchQuery.trim()) {
          params.append("search", searchQuery.trim());
        }

        // Add status filter
        if (selectedStatus && selectedStatus !== "All") {
          params.append("status", selectedStatus);
        }

        // Add ordering
        if (sortBy) {
          params.append("ordering", sortBy);
        }

        const queryString = params.toString();
        console.log(queryString);
        const url = `/api/projects/${queryString ? `?${queryString}` : ""}`;

        console.log("Fetching projects from:", url);
        const response = await api.get(url);

        setProjects(response.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(err.response?.data?.detail || "Failed to load projects");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [searchQuery, selectedStatus, sortBy],
  );

  // Initial fetch
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery !== undefined) {
        fetchProjects();
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const onRefresh = () => {
    fetchProjects(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#34C759";
      case "Pending":
        return "#FF9500";
      case "Closed":
        return "#FF3B30";
      case "On Hold":
        return "#8E8E93";
      default:
        return "#999";
    }
  };

  const getStatusBgColor = (status) => {
    switch (status) {
      case "Active":
        return "#E8F5E9";
      case "Pending":
        return "#FFF3E0";
      case "Closed":
        return "#FFEBEE";
      case "On Hold":
        return "#F5F5F5";
      default:
        return "#f5f5f5";
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setSortBy("-created_at");
  };

  const hasActiveFilters =
    searchQuery || (selectedStatus && selectedStatus !== "All");

  const renderProjectCard = ({ item }) => (
    <TouchableOpacity
      style={styles.projectCard}
      onPress={() => setSelectedProject(item)}
      activeOpacity={0.7}
    >
      <View style={styles.cardHeader}>
        <View style={styles.projectInfo}>
          <Text style={styles.projectName}>{item.name}</Text>
          <View style={styles.clientRow}>
            <Ionicons name="person-outline" size={14} color="#666" />
            <Text style={styles.clientName}>{item.client_name}</Text>
          </View>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusBgColor(item.status) },
          ]}
        >
          <Text
            style={[styles.statusText, { color: getStatusColor(item.status) }]}
          >
            {item.status}
          </Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.infoText}>
            Deadline: {formatDate(item.deadline)}
          </Text>
        </View>

        {item.category && (
          <View style={styles.infoRow}>
            <Ionicons name="folder-outline" size={16} color="#666" />
            <Text style={styles.infoText}>{item.category}</Text>
          </View>
        )}

        <View style={styles.progressSection}>
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Progress</Text>
            <Text style={styles.progressPercent}>{item.progress}%</Text>
          </View>
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {
                  width: `${item.progress}%`,
                  backgroundColor: getStatusColor(item.status),
                },
              ]}
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderProjectDetails = () => {
    if (!selectedProject) return null;

    return (
      <Modal
        visible={!!selectedProject}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Project Details</Text>
              <TouchableOpacity onPress={() => setSelectedProject(null)}>
                <Ionicons name="close" size={28} color="#666" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Project Information</Text>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Project Name</Text>
                  <Text style={styles.detailValue}>{selectedProject.name}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Client</Text>
                  <Text style={styles.detailValue}>
                    {selectedProject.client_name}
                  </Text>
                </View>

                {selectedProject.category && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Category</Text>
                    <Text style={styles.detailValue}>
                      {selectedProject.category}
                    </Text>
                  </View>
                )}

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Start Date</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedProject.start_date)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Deadline</Text>
                  <Text style={styles.detailValue}>
                    {formatDate(selectedProject.deadline)}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: getStatusBgColor(
                          selectedProject.status,
                        ),
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(selectedProject.status) },
                      ]}
                    >
                      {selectedProject.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Priority</Text>
                  <Text style={styles.detailValue}>
                    {selectedProject.priority}
                  </Text>
                </View>

                {selectedProject.budget && (
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Budget</Text>
                    <Text style={styles.detailValue}>
                      ${selectedProject.budget}
                    </Text>
                  </View>
                )}
              </View>

              {selectedProject.description && (
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>Description</Text>
                  <Text style={styles.descriptionText}>
                    {selectedProject.description}
                  </Text>
                </View>
              )}

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>Progress</Text>
                <View style={styles.progressSection}>
                  <View style={styles.progressHeader}>
                    <Text style={styles.progressPercent}>
                      {selectedProject.progress}%
                    </Text>
                  </View>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        {
                          width: `${selectedProject.progress}%`,
                          backgroundColor: getStatusColor(
                            selectedProject.status,
                          ),
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>

            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={styles.viewButton}
                onPress={() => {
                  setSelectedProject(null);
                  router.push(`/edit-project/${selectedProject.id}`);
                }}
              >
                <Ionicons name="create-outline" size={20} color="#fff" />
                <Text style={styles.viewButtonText}>Edit Project</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderEmptyState = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
          <Text style={styles.loadingText}>Loading projects...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle-outline" size={64} color="#FF3B30" />
          <Text style={styles.emptyTitle}>Error Loading Projects</Text>
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={() => fetchProjects()}
          >
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <Ionicons name="folder-open-outline" size={64} color="#ccc" />
        <Text style={styles.emptyTitle}>No projects found</Text>
        <Text style={styles.emptyText}>
          {hasActiveFilters
            ? "Try adjusting your search or filters"
            : "Create your first project to get started"}
        </Text>
        {!hasActiveFilters && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => router.push("./add-project")}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.createButtonText}>Create Project</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>All Projects</Text>
          <Text style={styles.headerSubtitle}>
            {projects.length} {projects.length === 1 ? "project" : "projects"}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("./add-project")}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
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
            placeholder="Search projects..."
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
            <Text style={styles.filterLabel}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {statuses.map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={[
                      styles.chip,
                      (selectedStatus === status ||
                        (status === "All" && !selectedStatus)) &&
                        styles.chipActive,
                    ]}
                    onPress={() => {
                      const newStatus = status === "All" ? "" : status;
                      setSelectedStatus(newStatus);
                    }}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        (selectedStatus === status ||
                          (status === "All" && !selectedStatus)) &&
                          styles.chipTextActive,
                      ]}
                    >
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterLabel}>Sort by</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {[
                  { key: "name", label: "Name A-Z" },
                  { key: "-name", label: "Name Z-A" },
                  { key: "deadline", label: "Deadline (Soon)" },
                  { key: "-deadline", label: "Deadline (Late)" },
                  { key: "-created_at", label: "Newest First" },
                  { key: "created_at", label: "Oldest First" },
                  { key: "-progress", label: "Progress (High)" },
                  { key: "progress", label: "Progress (Low)" },
                ].map((sort) => (
                  <TouchableOpacity
                    key={sort.key}
                    style={[
                      styles.chip,
                      sortBy === sort.key && styles.chipActive,
                    ]}
                    onPress={() => setSortBy(sort.key)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        sortBy === sort.key && styles.chipTextActive,
                      ]}
                    >
                      {sort.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {hasActiveFilters && (
            <TouchableOpacity
              style={styles.clearFilters}
              onPress={clearFilters}
            >
              <Text style={styles.clearFiltersText}>Clear filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {hasActiveFilters && !loading && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {projects.length} {projects.length === 1 ? "result" : "results"}
          </Text>
        </View>
      )}

      {projects.length > 0 ? (
        <FlatList
          data={projects}
          renderItem={renderProjectCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
      ) : (
        renderEmptyState()
      )}

      {renderProjectDetails()}
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
  projectCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  projectInfo: {
    flex: 1,
    marginRight: 12,
  },
  projectName: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
    marginBottom: 6,
  },
  clientRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  clientName: {
    fontSize: 14,
    color: "#666",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600",
  },
  cardBody: {
    gap: 12,
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
  progressSection: {
    gap: 6,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressLabel: {
    fontSize: 13,
    color: "#666",
    fontWeight: "500",
  },
  progressPercent: {
    fontSize: 13,
    color: "#222",
    fontWeight: "600",
  },
  progressBarBg: {
    height: 6,
    backgroundColor: "#f0f0f0",
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 32,
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
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  createButton: {
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  createButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
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
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  detailLabel: {
    fontSize: 14,
    color: "#666",
  },
  detailValue: {
    fontSize: 14,
    color: "#222",
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  viewButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  viewButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
  },
});

export default AllProjectsScreen;
