import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import api from "../src/services/api";

export default function JobPostingsScreen() {
  const [jobPostings, setJobPostings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState({
    department: "All",
    location: "All",
    jobType: "All",
    experienceLevel: "All",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [statistics, setStatistics] = useState(null);
  const [totalCount, setTotalCount] = useState(0);

  // Filter options
  const departments = [
    "All",
    "Engineering",
    "Sales & Marketing",
    "Human Resources",
    "Finance",
    "Operations",
    "Customer Support",
    "Product Management",
    "Design",
    "Legal",
    "Administration",
  ];

  const locations = [
    "All",
    "Remote",
    "On-site",
    "Hybrid",
    "New York, NY",
    "San Francisco, CA",
    "Los Angeles, CA",
    "Chicago, IL",
    "Austin, TX",
    "Seattle, WA",
    "Boston, MA",
  ];

  const jobTypes = [
    "All",
    "Full-time",
    "Part-time",
    "Contract",
    "Temporary",
    "Internship",
    "Freelance",
  ];

  const experienceLevels = [
    "All",
    "Entry Level",
    "Junior (1-3 years)",
    "Mid Level (3-5 years)",
    "Senior (5-10 years)",
    "Lead (10+ years)",
    "Executive",
  ];

  useEffect(() => {
    fetchJobPostings();
    fetchStatistics();
  }, []);

  useEffect(() => {
    // Fetch from backend whenever search or filters change
    fetchJobPostings();
  }, [searchQuery, selectedFilters]);

  const fetchJobPostings = async () => {
    try {
      setIsLoading(true);

      // Build query parameters
      const params = new URLSearchParams();

      // Add search query
      if (searchQuery.trim()) {
        params.append("search", searchQuery);
      }

      // Add filters (only if not "All")
      if (selectedFilters.department !== "All") {
        params.append("department", selectedFilters.department);
      }

      if (selectedFilters.location !== "All") {
        params.append("location", selectedFilters.location);
      }

      if (selectedFilters.jobType !== "All") {
        params.append("job_type", selectedFilters.jobType);
      }

      if (selectedFilters.experienceLevel !== "All") {
        params.append("experience_level", selectedFilters.experienceLevel);
      }

      const queryString = params.toString();
      const url = `/api/jobs-posting/${queryString ? "?" + queryString : ""}`;

      console.log("Fetching with URL:", url); // Debug log

      const res = await api.get(url);

      if (res.status === 200) {
        // Handle both paginated and non-paginated responses
        const data = res.data.results || res.data;
        const count = res.data.count || data.length;

        setJobPostings(data);
        setTotalCount(count);
      }
    } catch (error) {
      console.log("ERROR:", error.response?.data);
      Alert.alert("Error", "Failed to load job postings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const res = await api.get("/api/jobs-posting/statistics/");
      if (res.status === 200) {
        setStatistics(res.data);
      }
    } catch (error) {
      console.log("Stats error:", error);
    }
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchJobPostings();
    await fetchStatistics();
    setIsRefreshing(false);
  }, []);

  const clearFilters = () => {
    setSelectedFilters({
      department: "All",
      location: "All",
      jobType: "All",
      experienceLevel: "All",
    });
    setSearchQuery("");
  };

  const handleDeleteJob = async (jobId) => {
    Alert.alert(
      "Delete Job Posting",
      "Are you sure you want to delete this job posting?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await api.delete(`/api/jobs-posting/${jobId}/`);
              if (res.status === 204) {
                Alert.alert("Success", "Job posting deleted successfully");
                fetchJobPostings();
              }
            } catch (error) {
              console.log("Delete error:", error);
              Alert.alert("Error", "Failed to delete job posting");
            }
          },
        },
      ],
    );
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not specified";
    if (min && max)
      return `$${Number(min).toLocaleString()} - $${Number(max).toLocaleString()}`;
    if (min) return `From $${Number(min).toLocaleString()}`;
    if (max) return `Up to $${Number(max).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "#10B981";
      case "closed":
        return "#6B7280";
      case "filled":
        return "#3B82F6";
      case "draft":
        return "#F59E0B";
      default:
        return "#6B7280";
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => router.push(`/job-details/${item.id}`)}
      activeOpacity={0.7}
    >
      {/* Header */}
      <View style={styles.jobCardHeader}>
        <View style={styles.jobCardTitleContainer}>
          <Text style={styles.jobTitle} numberOfLines={2}>
            {item.job_title}
          </Text>
          <Text style={styles.department}>{item.department}</Text>
        </View>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(item.status) },
          ]}
        >
          <Text style={styles.statusText}>{getStatusLabel(item.status)}</Text>
        </View>
      </View>

      {/* Details */}
      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Ionicons name="location-outline" size={16} color="#64748B" />
          <Text style={styles.detailText}>{item.location}</Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="briefcase-outline" size={16} color="#64748B" />
          <Text style={styles.detailText}>
            {item.job_type
              ?.split("-")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join("-")}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <Ionicons name="school-outline" size={16} color="#64748B" />
          <Text style={styles.detailText}>
            {item.experience_level?.charAt(0).toUpperCase() +
              item.experience_level?.slice(1)}
          </Text>
        </View>
      </View>

      {/* Salary */}
      <View style={styles.salaryContainer}>
        <Ionicons name="cash-outline" size={16} color="#3B82F6" />
        <Text style={styles.salaryText}>
          {formatSalary(item.salary_min, item.salary_max)}
        </Text>
      </View>

      {/* Footer */}
      <View style={styles.jobCardFooter}>
        <View style={styles.footerLeft}>
          <View style={styles.statsItem}>
            <Ionicons name="eye-outline" size={14} color="#64748B" />
            <Text style={styles.statsText}>{item.views_count || 0} views</Text>
          </View>
          <View style={styles.statsItem}>
            <Ionicons name="document-outline" size={14} color="#64748B" />
            <Text style={styles.statsText}>
              {item.applications_count || 0} applications
            </Text>
          </View>
        </View>
        <Text style={styles.deadlineText}>
          Deadline: {formatDate(item.deadline)}
        </Text>
      </View>

      {/* Action buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push(`/edit-job-posting/${item.id}`)}
        >
          <Ionicons name="create-outline" size={18} color="#3B82F6" />
          <Text style={styles.actionButtonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={() => handleDeleteJob(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color="#EF4444" />
          <Text style={[styles.actionButtonText, styles.deleteButtonText]}>
            Delete
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderFilterChip = (label, value, filterKey) => (
    <TouchableOpacity
      key={value}
      style={[
        styles.filterChip,
        selectedFilters[filterKey] === value && styles.filterChipActive,
      ]}
      onPress={() =>
        setSelectedFilters((prev) => ({ ...prev, [filterKey]: value }))
      }
    >
      <Text
        style={[
          styles.filterChipText,
          selectedFilters[filterKey] === value && styles.filterChipTextActive,
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Ionicons name="briefcase-outline" size={64} color="#CBD5E1" />
      <Text style={styles.emptyStateTitle}>No Job Postings Found</Text>
      <Text style={styles.emptyStateText}>
        {searchQuery || selectedFilters.department !== "All"
          ? "Try adjusting your filters"
          : "Get started by creating your first job posting"}
      </Text>
      {!searchQuery && selectedFilters.department === "All" && (
        <TouchableOpacity
          style={styles.emptyStateButton}
          onPress={() => router.push("/add-job-posting")}
        >
          <Ionicons name="add" size={20} color="#FFF" />
          <Text style={styles.emptyStateButtonText}>Create Job Posting</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Job Postings</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading job postings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Postings</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => router.push("/add-job-posting")}
        >
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      {/* Statistics */}
      {statistics && (
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{statistics.total_postings}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#10B981" }]}>
              {statistics.active_postings}
            </Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: "#3B82F6" }]}>
              {statistics.total_applications}
            </Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
        </View>
      )}

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#64748B" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search job postings..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color="#64748B" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name={showFilters ? "filter" : "filter-outline"}
            size={20}
            color="#3B82F6"
          />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      {showFilters && (
        <ScrollView
          style={styles.filtersContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Department Filter */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Department</Text>
              {selectedFilters.department !== "All" && (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      department: "All",
                    }))
                  }
                >
                  <Text style={styles.clearFilterText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipsContainer}
            >
              {departments.map((dept) =>
                renderFilterChip(dept, dept, "department"),
              )}
            </ScrollView>
          </View>

          {/* Location Filter */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Location</Text>
              {selectedFilters.location !== "All" && (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedFilters((prev) => ({ ...prev, location: "All" }))
                  }
                >
                  <Text style={styles.clearFilterText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipsContainer}
            >
              {locations.map((loc) => renderFilterChip(loc, loc, "location"))}
            </ScrollView>
          </View>

          {/* Job Type Filter */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Job Type</Text>
              {selectedFilters.jobType !== "All" && (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedFilters((prev) => ({ ...prev, jobType: "All" }))
                  }
                >
                  <Text style={styles.clearFilterText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipsContainer}
            >
              {jobTypes.map((type) => renderFilterChip(type, type, "jobType"))}
            </ScrollView>
          </View>

          {/* Experience Level Filter */}
          <View style={styles.filterSection}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Experience Level</Text>
              {selectedFilters.experienceLevel !== "All" && (
                <TouchableOpacity
                  onPress={() =>
                    setSelectedFilters((prev) => ({
                      ...prev,
                      experienceLevel: "All",
                    }))
                  }
                >
                  <Text style={styles.clearFilterText}>Clear</Text>
                </TouchableOpacity>
              )}
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterChipsContainer}
            >
              {experienceLevels.map((level) =>
                renderFilterChip(level, level, "experienceLevel"),
              )}
            </ScrollView>
          </View>

          {/* Clear All Filters */}
          <TouchableOpacity
            style={styles.clearAllButton}
            onPress={clearFilters}
          >
            <Text style={styles.clearAllButtonText}>Clear All Filters</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Results Count */}
      <View style={styles.resultsContainer}>
        <Text style={styles.resultsText}>
          {totalCount} {totalCount === 1 ? "posting" : "postings"} found
        </Text>
      </View>

      {/* Job Listings */}
      <FlatList
        data={jobPostings}
        renderItem={renderJobCard}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={["#3B82F6"]}
            tintColor="#3B82F6"
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },
  addButton: {
    backgroundColor: "#3B82F6",
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  statsContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  statCard: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E293B",
  },
  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },
  searchContainer: {
    flexDirection: "row",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    backgroundColor: "#FFFFFF",
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 8,
    paddingHorizontal: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: "#1E293B",
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  filtersContainer: {
    maxHeight: 300,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  filterSection: {
    paddingVertical: 12,
  },
  filterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },
  clearFilterText: {
    fontSize: 12,
    color: "#3B82F6",
    fontWeight: "500",
  },
  filterChipsContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  filterChipActive: {
    backgroundColor: "#3B82F6",
    borderColor: "#3B82F6",
  },
  filterChipText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  filterChipTextActive: {
    color: "#FFFFFF",
  },
  clearAllButton: {
    marginHorizontal: 16,
    marginVertical: 12,
    paddingVertical: 12,
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    alignItems: "center",
  },
  clearAllButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#475569",
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "#FFFFFF",
  },
  resultsText: {
    fontSize: 13,
    color: "#64748B",
    fontWeight: "500",
  },
  listContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  jobCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  jobCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  jobCardTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  department: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "500",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#FFFFFF",
    textTransform: "uppercase",
  },
  jobDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: "#64748B",
  },
  salaryContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    marginBottom: 12,
  },
  salaryText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  jobCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    marginBottom: 12,
  },
  footerLeft: {
    flexDirection: "row",
    gap: 16,
  },
  statsItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    color: "#64748B",
  },
  deadlineText: {
    fontSize: 12,
    color: "#64748B",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#EFF6FF",
    borderRadius: 8,
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3B82F6",
  },
  deleteButton: {
    backgroundColor: "#FEF2F2",
  },
  deleteButtonText: {
    color: "#EF4444",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 64,
    paddingHorizontal: 32,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginBottom: 24,
  },
  emptyStateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#3B82F6",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  emptyStateButtonText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },
});
