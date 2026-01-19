import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
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

const AllProjectsScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [sortBy, setSortBy] = useState("name"); // name, deadline, status

  const [projects, setProjects] = useState([
    {
      id: 1,
      name: "MarQ Angular 6",
      clientName: "Donald",
      deadline: "02-03-2019",
      teamMembers: [
        { id: 1, name: "John Doe", image: "https://i.pravatar.cc/150?img=12" },
        {
          id: 2,
          name: "Jane Smith",
          image: "https://i.pravatar.cc/150?img=45",
        },
        {
          id: 3,
          name: "Mike Brown",
          image: "https://i.pravatar.cc/150?img=33",
        },
      ],
      teamCount: 14,
      status: "Pending",
      progress: 35,
    },
    {
      id: 2,
      name: "Redstar Hospital",
      clientName: "Rajesh",
      deadline: "11-10-2018",
      teamMembers: [
        { id: 4, name: "Sarah Lee", image: "https://i.pravatar.cc/150?img=47" },
        {
          id: 5,
          name: "Tom Wilson",
          image: "https://i.pravatar.cc/150?img=15",
        },
        { id: 6, name: "Lisa Chen", image: "https://i.pravatar.cc/150?img=32" },
      ],
      teamCount: 12,
      status: "Active",
      progress: 65,
    },
    {
      id: 3,
      name: "Smart University",
      clientName: "John Wick",
      deadline: "22-07-2019",
      teamMembers: [
        {
          id: 7,
          name: "Alex Johnson",
          image: "https://i.pravatar.cc/150?img=13",
        },
        {
          id: 8,
          name: "Emma Davis",
          image: "https://i.pravatar.cc/150?img=44",
        },
        {
          id: 9,
          name: "Chris Martin",
          image: "https://i.pravatar.cc/150?img=17",
        },
      ],
      teamCount: 13,
      status: "Closed",
      progress: 100,
    },
    {
      id: 4,
      name: "Smile Admin",
      clientName: "Sarah Smith",
      deadline: "18-12-2018",
      teamMembers: [
        {
          id: 10,
          name: "Robert Green",
          image: "https://i.pravatar.cc/150?img=11",
        },
        {
          id: 11,
          name: "Nina White",
          image: "https://i.pravatar.cc/150?img=48",
        },
        {
          id: 12,
          name: "Kevin Black",
          image: "https://i.pravatar.cc/150?img=59",
        },
      ],
      teamCount: 17,
      status: "Active",
      progress: 78,
    },
    {
      id: 5,
      name: "SpinzHR Admin",
      clientName: "Sarah Smith",
      deadline: "18-12-2018",
      teamMembers: [
        {
          id: 13,
          name: "David Lee",
          image: "https://i.pravatar.cc/150?img=68",
        },
        {
          id: 14,
          name: "Maria Garcia",
          image: "https://i.pravatar.cc/150?img=27",
        },
        {
          id: 15,
          name: "James Taylor",
          image: "https://i.pravatar.cc/150?img=51",
        },
      ],
      teamCount: 17,
      status: "Active",
      progress: 82,
    },
    {
      id: 6,
      name: "Sunray Hospital",
      clientName: "John Wick",
      deadline: "22-07-2019",
      teamMembers: [
        {
          id: 16,
          name: "Anna Brown",
          image: "https://i.pravatar.cc/150?img=31",
        },
        {
          id: 17,
          name: "Peter Clark",
          image: "https://i.pravatar.cc/150?img=60",
        },
        {
          id: 18,
          name: "Sophie Turner",
          image: "https://i.pravatar.cc/150?img=25",
        },
      ],
      teamCount: 13,
      status: "Closed",
      progress: 100,
    },
    {
      id: 7,
      name: "Xyz Website",
      clientName: "Rajesh",
      deadline: "11-10-2018",
      teamMembers: [
        {
          id: 19,
          name: "Oliver King",
          image: "https://i.pravatar.cc/150?img=56",
        },
        {
          id: 20,
          name: "Emily Scott",
          image: "https://i.pravatar.cc/150?img=49",
        },
        {
          id: 21,
          name: "Lucas Hill",
          image: "https://i.pravatar.cc/150?img=14",
        },
      ],
      teamCount: 12,
      status: "Active",
      progress: 45,
    },
  ]);

  const statuses = ["All", "Active", "Pending", "Closed"];

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
        return "#34C759";
      case "Pending":
        return "#FF9500";
      case "Closed":
        return "#FF3B30";
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
      default:
        return "#f5f5f5";
    }
  };

  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects;

    // Apply status filter
    if (selectedStatus && selectedStatus !== "All") {
      filtered = filtered.filter((proj) => proj.status === selectedStatus);
    }

    // Apply search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((proj) => {
        return (
          proj.name.toLowerCase().includes(query) ||
          proj.clientName.toLowerCase().includes(query) ||
          proj.status.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "deadline") {
        return (
          new Date(a.deadline.split("-").reverse().join("-")) -
          new Date(b.deadline.split("-").reverse().join("-"))
        );
      } else if (sortBy === "status") {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return sorted;
  }, [projects, searchQuery, selectedStatus, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
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
            <Text style={styles.clientName}>{item.clientName}</Text>
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
          <Text style={styles.infoText}>Deadline: {item.deadline}</Text>
        </View>

        <View style={styles.teamSection}>
          <View style={styles.avatarGroup}>
            {item.teamMembers.slice(0, 3).map((member, index) => (
              <Image
                key={member.id}
                source={{ uri: member.image }}
                style={[styles.avatar, index > 0 && { marginLeft: -8 }]}
              />
            ))}
            {item.teamCount > 3 && (
              <View
                style={[styles.avatar, styles.avatarMore, { marginLeft: -8 }]}
              >
                <Text style={styles.avatarMoreText}>+{item.teamCount - 3}</Text>
              </View>
            )}
          </View>
          <Text style={styles.teamCount}>{item.teamCount} members</Text>
        </View>

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
                    {selectedProject.clientName}
                  </Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Deadline</Text>
                  <Text style={styles.detailValue}>
                    {selectedProject.deadline}
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
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>
                  Team Members ({selectedProject.teamCount})
                </Text>
                <View style={styles.teamGrid}>
                  {selectedProject.teamMembers.map((member) => (
                    <View key={member.id} style={styles.teamMemberItem}>
                      <Image
                        source={{ uri: member.image }}
                        style={styles.teamAvatar}
                      />
                      <Text style={styles.teamMemberName}>{member.name}</Text>
                    </View>
                  ))}
                  {selectedProject.teamCount > 3 && (
                    <View style={styles.teamMemberItem}>
                      <View style={[styles.teamAvatar, styles.teamAvatarMore]}>
                        <Text style={styles.teamAvatarMoreText}>
                          +{selectedProject.teamCount - 3}
                        </Text>
                      </View>
                      <Text style={styles.teamMemberName}>More</Text>
                    </View>
                  )}
                </View>
              </View>

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
                  // Navigate to project details
                  console.log("Navigate to project:", selectedProject.id);
                }}
              >
                <Ionicons name="open-outline" size={20} color="#fff" />
                <Text style={styles.viewButtonText}>View Full Project</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="folder-open-outline" size={64} color="#ccc" />
      <Text style={styles.emptyTitle}>No projects found</Text>
      <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>All Projects</Text>
          <Text style={styles.headerSubtitle}>
            {projects.length} total projects
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
                    onPress={() =>
                      setSelectedStatus(status === "All" ? "" : status)
                    }
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
                  { key: "name", label: "Name" },
                  { key: "deadline", label: "Deadline" },
                  { key: "status", label: "Status" },
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

      {hasActiveFilters && (
        <View style={styles.resultsBar}>
          <Text style={styles.resultsText}>
            {filteredAndSortedProjects.length}{" "}
            {filteredAndSortedProjects.length === 1 ? "result" : "results"}
          </Text>
        </View>
      )}

      {filteredAndSortedProjects.length > 0 ? (
        <FlatList
          data={filteredAndSortedProjects}
          renderItem={renderProjectCard}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
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
  teamSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatarGroup: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#fff",
  },
  avatarMore: {
    backgroundColor: "#f5f5f5",
    borderColor: "#e0e0e0",
  },
  avatarMoreText: {
    color: "#666",
    fontSize: 11,
    fontWeight: "600",
  },
  teamCount: {
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
  teamGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  teamMemberItem: {
    alignItems: "center",
    width: 70,
  },
  teamAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 6,
  },
  teamAvatarMore: {
    backgroundColor: "#f5f5f5",
  },
  teamAvatarMoreText: {
    color: "#666",
    fontSize: 14,
    fontWeight: "600",
  },
  teamMemberName: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
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
