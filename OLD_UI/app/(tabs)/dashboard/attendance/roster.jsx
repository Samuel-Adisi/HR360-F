import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    Alert,
    Modal,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const SHIFTS = {
  morning: {
    label: "Morning",
    time: "08:00–16:00",
    color: "#F59E0B",
    bg: "#FEF3C7",
    textColor: "#92400E",
  },
  afternoon: {
    label: "Afternoon",
    time: "14:00–22:00",
    color: "#3B82F6",
    bg: "#DBEAFE",
    textColor: "#1E40AF",
  },
  night: {
    label: "Night",
    time: "22:00–06:00",
    color: "#8B5CF6",
    bg: "#EDE9FE",
    textColor: "#5B21B6",
  },
  off: {
    label: "Day Off",
    time: null,
    color: "#94A3B8",
    bg: "#F1F5F9",
    textColor: "#64748B",
  },
  leave: {
    label: "On Leave",
    time: null,
    color: "#EF4444",
    bg: "#FEE2E2",
    textColor: "#991B1B",
  },
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [24, 25, 26, 27, 28, 1, 2];
const TODAY_INDEX = 6; // Sunday = today (March 2)

const DEPARTMENTS = [
  "All Departments",
  "Operations",
  "Engineering",
  "Support",
  "Management",
];

const INITIAL_ROSTER = [
  {
    id: "1",
    name: "Alice Morgan",
    role: "Operations Lead",
    department: "Operations",
    initials: "AM",
    avatarColor: "#DBEAFE",
    avatarText: "#1D4ED8",
    totalHours: 40,
    status: "active",
    shifts: [
      "morning",
      "morning",
      "morning",
      "morning",
      "morning",
      "off",
      "off",
    ],
  },
  {
    id: "2",
    name: "Ben Kaur",
    role: "Support Engineer",
    department: "Support",
    initials: "BK",
    avatarColor: "#FCE7F3",
    avatarText: "#9D174D",
    totalHours: 40,
    status: "active",
    shifts: [
      "off",
      "afternoon",
      "afternoon",
      "afternoon",
      "afternoon",
      "afternoon",
      "off",
    ],
  },
  {
    id: "3",
    name: "Clara Lin",
    role: "Software Engineer",
    department: "Engineering",
    initials: "CL",
    avatarColor: "#D1FAE5",
    avatarText: "#065F46",
    totalHours: 32,
    status: "active",
    shifts: ["night", "night", "off", "night", "night", "off", "off"],
  },
  {
    id: "4",
    name: "David Reid",
    role: "Operations Manager",
    department: "Operations",
    initials: "DR",
    avatarColor: "#FEF3C7",
    avatarText: "#92400E",
    totalHours: 8,
    status: "leave",
    shifts: ["morning", "off", "off", "leave", "leave", "leave", "leave"],
  },
  {
    id: "5",
    name: "Eva Nguyen",
    role: "Support Specialist",
    department: "Support",
    initials: "EN",
    avatarColor: "#EDE9FE",
    avatarText: "#5B21B6",
    totalHours: 40,
    status: "active",
    shifts: [
      "afternoon",
      "afternoon",
      "morning",
      "morning",
      "off",
      "afternoon",
      "off",
    ],
  },
  {
    id: "6",
    name: "Frank Park",
    role: "Senior Engineer",
    department: "Engineering",
    initials: "FP",
    avatarColor: "#FCE7F3",
    avatarText: "#831843",
    totalHours: 40,
    status: "active",
    shifts: ["off", "night", "night", "night", "night", "night", "off"],
  },
  {
    id: "7",
    name: "Grace Obi",
    role: "HR Manager",
    department: "Management",
    initials: "GO",
    avatarColor: "#DCFCE7",
    avatarText: "#166534",
    totalHours: 40,
    status: "active",
    shifts: [
      "morning",
      "morning",
      "morning",
      "morning",
      "morning",
      "off",
      "off",
    ],
  },
  {
    id: "8",
    name: "Hiro Tanaka",
    role: "DevOps Engineer",
    department: "Engineering",
    initials: "HT",
    avatarColor: "#FEE2E2",
    avatarText: "#991B1B",
    totalHours: 24,
    status: "leave",
    shifts: ["off", "off", "leave", "leave", "leave", "off", "off"],
  },
];

const ShiftPill = ({ type }) => {
  const shift = SHIFTS[type] || SHIFTS.off;
  return (
    <View style={[styles.shiftPill, { backgroundColor: shift.bg }]}>
      <Text style={[styles.shiftLabel, { color: shift.textColor }]}>
        {shift.label}
      </Text>
      {shift.time && (
        <Text style={[styles.shiftTime, { color: shift.textColor }]}>
          {shift.time}
        </Text>
      )}
    </View>
  );
};

const StatCard = ({ icon, label, value, iconBg, iconColor, accent }) => (
  <View style={styles.statCard}>
    <View style={[styles.statIconWrap, { backgroundColor: iconBg }]}>
      <Ionicons name={icon} size={20} color={iconColor} />
    </View>
    <Text style={[styles.statValue, accent && { color: accent }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

export default function ShiftRosterScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDept, setSelectedDept] = useState("All Departments");
  const [selectedShift, setSelectedShift] = useState("All Shifts");
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [viewMode, setViewMode] = useState("week"); // 'week' or 'list'

  const filteredRoster = useMemo(() => {
    let data = INITIAL_ROSTER;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      data = data.filter(
        (e) =>
          e.name.toLowerCase().includes(q) || e.role.toLowerCase().includes(q),
      );
    }
    if (selectedDept !== "All Departments") {
      data = data.filter((e) => e.department === selectedDept);
    }
    if (selectedShift !== "All Shifts") {
      const shiftKey = selectedShift.toLowerCase();
      data = data.filter((e) => e.shifts.includes(shiftKey));
    }
    return data;
  }, [searchQuery, selectedDept, selectedShift]);

  const stats = {
    total: INITIAL_ROSTER.length,
    onDuty: INITIAL_ROSTER.filter((e) => e.status === "active").length,
    onLeave: INITIAL_ROSTER.filter((e) => e.status === "leave").length,
    nightShift: INITIAL_ROSTER.filter((e) => e.shifts[TODAY_INDEX] === "night")
      .length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── HEADER ── */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn}>
          <Ionicons name="arrow-back-outline" size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.logoTitle}>HR360</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => Alert.alert("Export", "Roster exported!")}
          >
            <Ionicons name="download-outline" size={22} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="print-outline" size={22} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── BREADCRUMB ── */}
      <View style={styles.breadcrumb}>
        <Ionicons name="home-outline" size={13} color="#64748B" />
        <Text style={styles.breadcrumbText}> Home › Attendance & Time › </Text>
        <Text style={styles.breadcrumbActive}>Shift Roster</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* ── PAGE TITLE + ADD BTN ── */}
        <View style={styles.pageHead}>
          <View>
            <Text style={styles.pageTitle}>Shift Roster</Text>
            <Text style={styles.pageSubtitle}>
              Week of Feb 24 – Mar 2, 2026
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => setShowAddModal(true)}
          >
            <Ionicons name="add" size={20} color="#fff" />
            <Text style={styles.addBtnText}>Add Shift</Text>
          </TouchableOpacity>
        </View>

        {/* ── STAT CARDS ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.statsScroll}
          contentContainerStyle={styles.statsRow}
        >
          <StatCard
            icon="people"
            label="Total Staff"
            value={stats.total}
            iconBg="#EFF6FF"
            iconColor="#3B82F6"
          />
          <StatCard
            icon="checkmark-circle"
            label="On Duty"
            value={stats.onDuty}
            iconBg="#DCFCE7"
            iconColor="#22C55E"
            accent="#22C55E"
          />
          <StatCard
            icon="time-outline"
            label="On Leave"
            value={stats.onLeave}
            iconBg="#FEE2E2"
            iconColor="#EF4444"
            accent="#EF4444"
          />
          <StatCard
            icon="moon-outline"
            label="Night Shift"
            value={stats.nightShift}
            iconBg="#EDE9FE"
            iconColor="#8B5CF6"
            accent="#8B5CF6"
          />
        </ScrollView>

        {/* ── WEEK NAV ── */}
        <View style={styles.weekNav}>
          <TouchableOpacity style={styles.weekNavBtn}>
            <Ionicons name="chevron-back" size={18} color="#64748B" />
          </TouchableOpacity>
          <View style={styles.weekLabelWrap}>
            <Ionicons name="calendar-outline" size={14} color="#3B82F6" />
            <Text style={styles.weekLabel}>Feb 24 – Mar 2, 2026</Text>
          </View>
          <TouchableOpacity style={styles.weekNavBtn}>
            <Ionicons name="chevron-forward" size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.todayBtn]}
            onPress={() => Alert.alert("Navigated to today")}
          >
            <Text style={styles.todayBtnText}>Today</Text>
          </TouchableOpacity>
        </View>

        {/* ── SEARCH + FILTERS ── */}
        <View style={styles.toolbarRow}>
          <View style={styles.searchBar}>
            <Ionicons name="search" size={17} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search employee..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#94A3B8"
              autoCorrect={false}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")}>
                <Ionicons name="close-circle" size={17} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.filterRow}>
          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setShowDeptModal(true)}
          >
            <Ionicons name="business-outline" size={14} color="#64748B" />
            <Text style={styles.filterChipText} numberOfLines={1}>
              {selectedDept === "All Departments" ? "Department" : selectedDept}
            </Text>
            <Ionicons name="chevron-down" size={13} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.filterChip}
            onPress={() => setShowShiftModal(true)}
          >
            <Ionicons name="time-outline" size={14} color="#64748B" />
            <Text style={styles.filterChipText}>
              {selectedShift === "All Shifts" ? "Shift Type" : selectedShift}
            </Text>
            <Ionicons name="chevron-down" size={13} color="#94A3B8" />
          </TouchableOpacity>

          <View style={styles.viewToggle}>
            <TouchableOpacity
              style={[
                styles.viewBtn,
                viewMode === "week" && styles.viewBtnActive,
              ]}
              onPress={() => setViewMode("week")}
            >
              <Ionicons
                name="grid-outline"
                size={15}
                color={viewMode === "week" ? "#3B82F6" : "#94A3B8"}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.viewBtn,
                viewMode === "list" && styles.viewBtnActive,
              ]}
              onPress={() => setViewMode("list")}
            >
              <Ionicons
                name="list-outline"
                size={15}
                color={viewMode === "list" ? "#3B82F6" : "#94A3B8"}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── RESULTS COUNT ── */}
        {(searchQuery ||
          selectedDept !== "All Departments" ||
          selectedShift !== "All Shifts") && (
          <View style={styles.resultsBar}>
            <Text style={styles.resultsText}>
              {filteredRoster.length} result
              {filteredRoster.length !== 1 ? "s" : ""} found
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSearchQuery("");
                setSelectedDept("All Departments");
                setSelectedShift("All Shifts");
              }}
            >
              <Text style={styles.clearText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── WEEK VIEW ── */}
        {viewMode === "week" && (
          <View style={styles.rosterCard}>
            {/* Day headers */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                {/* Header row */}
                <View style={styles.tableHeaderRow}>
                  <View style={styles.empColHeader}>
                    <Text style={styles.colHeaderText}>EMPLOYEE</Text>
                  </View>
                  {DAYS.map((day, i) => (
                    <View
                      key={i}
                      style={[
                        styles.dayColHeader,
                        i === TODAY_INDEX && styles.todayColHeader,
                      ]}
                    >
                      <Text
                        style={[
                          styles.dayName,
                          i === TODAY_INDEX && styles.todayDayName,
                        ]}
                      >
                        {day}
                      </Text>
                      <View
                        style={[
                          styles.dateBubble,
                          i === TODAY_INDEX && styles.todayBubble,
                        ]}
                      >
                        <Text
                          style={[
                            styles.dateNum,
                            i === TODAY_INDEX && styles.todayDateNum,
                          ]}
                        >
                          {DATES[i]}
                        </Text>
                      </View>
                    </View>
                  ))}
                  <View style={styles.hoursColHeader}>
                    <Text style={styles.colHeaderText}>HRS</Text>
                  </View>
                  <View style={styles.statusColHeader}>
                    <Text style={styles.colHeaderText}>STATUS</Text>
                  </View>
                </View>

                {/* Employee rows */}
                {filteredRoster.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Ionicons
                      name="calendar-outline"
                      size={48}
                      color="#CBD5E1"
                    />
                    <Text style={styles.emptyTitle}>No employees found</Text>
                    <Text style={styles.emptyText}>
                      Try adjusting your filters
                    </Text>
                  </View>
                ) : (
                  filteredRoster.map((emp, empIdx) => (
                    <TouchableOpacity
                      key={emp.id}
                      style={[
                        styles.tableRow,
                        empIdx % 2 === 1 && styles.tableRowAlt,
                      ]}
                      onPress={() => setSelectedEmployee(emp)}
                      activeOpacity={0.7}
                    >
                      {/* Employee cell */}
                      <View style={styles.empCell}>
                        <View
                          style={[
                            styles.avatar,
                            { backgroundColor: emp.avatarColor },
                          ]}
                        >
                          <Text
                            style={[
                              styles.avatarText,
                              { color: emp.avatarText },
                            ]}
                          >
                            {emp.initials}
                          </Text>
                        </View>
                        <View style={styles.empInfo}>
                          <Text style={styles.empName} numberOfLines={1}>
                            {emp.name}
                          </Text>
                          <Text style={styles.empRole} numberOfLines={1}>
                            {emp.role}
                          </Text>
                        </View>
                      </View>

                      {/* Shift cells */}
                      {emp.shifts.map((shift, dayIdx) => (
                        <View
                          key={dayIdx}
                          style={[
                            styles.dayCell,
                            dayIdx === TODAY_INDEX && styles.todayDayCell,
                          ]}
                        >
                          <ShiftPill type={shift} />
                        </View>
                      ))}

                      {/* Hours */}
                      <View style={styles.hoursCell}>
                        <Text style={styles.hoursText}>{emp.totalHours}h</Text>
                      </View>

                      {/* Status */}
                      <View style={styles.statusCell}>
                        {emp.status === "active" ? (
                          <View style={styles.badgeActive}>
                            <View style={styles.badgeDotGreen} />
                            <Text style={styles.badgeTextGreen}>Active</Text>
                          </View>
                        ) : (
                          <View style={styles.badgeLeave}>
                            <View style={styles.badgeDotRed} />
                            <Text style={styles.badgeTextRed}>On Leave</Text>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))
                )}
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={styles.tableFooter}>
              <Text style={styles.footerText}>
                Showing {filteredRoster.length} of {INITIAL_ROSTER.length}{" "}
                employees
              </Text>
              <View style={styles.pagination}>
                <TouchableOpacity style={styles.pageBtn}>
                  <Ionicons name="chevron-back" size={14} color="#64748B" />
                </TouchableOpacity>
                <View style={[styles.pageBtn, styles.pageBtnActive]}>
                  <Text style={styles.pageBtnActiveText}>1</Text>
                </View>
                <TouchableOpacity style={styles.pageBtn}>
                  <Text style={styles.pageBtnText}>2</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.pageBtn}>
                  <Ionicons name="chevron-forward" size={14} color="#64748B" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* ── LIST VIEW ── */}
        {viewMode === "list" && (
          <View style={styles.listContainer}>
            {filteredRoster.map((emp) => (
              <TouchableOpacity
                key={emp.id}
                style={styles.listCard}
                onPress={() => setSelectedEmployee(emp)}
                activeOpacity={0.7}
              >
                <View style={styles.listCardHeader}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: emp.avatarColor },
                    ]}
                  >
                    <Text
                      style={[styles.avatarText, { color: emp.avatarText }]}
                    >
                      {emp.initials}
                    </Text>
                  </View>
                  <View style={styles.listEmpInfo}>
                    <Text style={styles.empName}>{emp.name}</Text>
                    <Text style={styles.empRole}>
                      {emp.role} · {emp.department}
                    </Text>
                  </View>
                  <View>
                    {emp.status === "active" ? (
                      <View style={styles.badgeActive}>
                        <View style={styles.badgeDotGreen} />
                        <Text style={styles.badgeTextGreen}>Active</Text>
                      </View>
                    ) : (
                      <View style={styles.badgeLeave}>
                        <View style={styles.badgeDotRed} />
                        <Text style={styles.badgeTextRed}>On Leave</Text>
                      </View>
                    )}
                  </View>
                </View>

                <View style={styles.listShiftsRow}>
                  {DAYS.map((day, i) => (
                    <View key={i} style={styles.listDayCol}>
                      <Text
                        style={[
                          styles.listDayLabel,
                          i === TODAY_INDEX && {
                            color: "#3B82F6",
                            fontWeight: "700",
                          },
                        ]}
                      >
                        {day}
                      </Text>
                      <View
                        style={[
                          styles.listShiftDot,
                          {
                            backgroundColor:
                              SHIFTS[emp.shifts[i]]?.color || "#94A3B8",
                          },
                        ]}
                      />
                      <Text style={styles.listShiftName}>
                        {SHIFTS[emp.shifts[i]]?.label.split(" ")[0] || "Off"}
                      </Text>
                    </View>
                  ))}
                </View>

                <View style={styles.listFooter}>
                  <Ionicons name="time-outline" size={13} color="#94A3B8" />
                  <Text style={styles.listFooterText}>
                    {emp.totalHours} hours this week
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── EMPLOYEE DETAIL MODAL ── */}
      <Modal
        visible={!!selectedEmployee}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedEmployee(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Employee Schedule</Text>
              <TouchableOpacity onPress={() => setSelectedEmployee(null)}>
                <Ionicons name="close" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>

            {selectedEmployee && (
              <ScrollView
                style={styles.modalBody}
                showsVerticalScrollIndicator={false}
              >
                {/* Profile */}
                <View style={styles.modalProfile}>
                  <View
                    style={[
                      styles.modalAvatar,
                      { backgroundColor: selectedEmployee.avatarColor },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalAvatarText,
                        { color: selectedEmployee.avatarText },
                      ]}
                    >
                      {selectedEmployee.initials}
                    </Text>
                  </View>
                  <Text style={styles.modalEmpName}>
                    {selectedEmployee.name}
                  </Text>
                  <Text style={styles.modalEmpRole}>
                    {selectedEmployee.role}
                  </Text>
                  <View style={styles.modalDeptBadge}>
                    <Ionicons
                      name="business-outline"
                      size={12}
                      color="#3B82F6"
                    />
                    <Text style={styles.modalDeptText}>
                      {selectedEmployee.department}
                    </Text>
                  </View>
                </View>

                {/* This week's hours summary */}
                <View style={styles.modalSummaryRow}>
                  <View style={styles.modalSummaryItem}>
                    <Text style={styles.modalSummaryVal}>
                      {selectedEmployee.totalHours}h
                    </Text>
                    <Text style={styles.modalSummaryLabel}>Total Hours</Text>
                  </View>
                  <View style={styles.modalSumDivider} />
                  <View style={styles.modalSummaryItem}>
                    <Text style={styles.modalSummaryVal}>
                      {
                        selectedEmployee.shifts.filter(
                          (s) => s !== "off" && s !== "leave",
                        ).length
                      }
                    </Text>
                    <Text style={styles.modalSummaryLabel}>Shift Days</Text>
                  </View>
                  <View style={styles.modalSumDivider} />
                  <View style={styles.modalSummaryItem}>
                    <Text style={styles.modalSummaryVal}>
                      {
                        selectedEmployee.shifts.filter((s) => s === "off")
                          .length
                      }
                    </Text>
                    <Text style={styles.modalSummaryLabel}>Days Off</Text>
                  </View>
                </View>

                {/* Weekly breakdown */}
                <Text style={styles.modalSectionTitle}>Weekly Breakdown</Text>
                {DAYS.map((day, i) => {
                  const shift =
                    SHIFTS[selectedEmployee.shifts[i]] || SHIFTS.off;
                  return (
                    <View
                      key={i}
                      style={[
                        styles.modalDayRow,
                        i === TODAY_INDEX && styles.modalDayRowToday,
                      ]}
                    >
                      <View style={styles.modalDayLeft}>
                        <View
                          style={[
                            styles.modalDayBubble,
                            i === TODAY_INDEX && { backgroundColor: "#3B82F6" },
                          ]}
                        >
                          <Text
                            style={[
                              styles.modalDayNum,
                              i === TODAY_INDEX && { color: "#fff" },
                            ]}
                          >
                            {DATES[i]}
                          </Text>
                        </View>
                        <View>
                          <Text
                            style={[
                              styles.modalDayName,
                              i === TODAY_INDEX && {
                                color: "#3B82F6",
                                fontWeight: "700",
                              },
                            ]}
                          >
                            {day} {i === TODAY_INDEX ? "(Today)" : ""}
                          </Text>
                          {shift.time && (
                            <Text style={styles.modalDayTime}>
                              {shift.time}
                            </Text>
                          )}
                        </View>
                      </View>
                      <View
                        style={[
                          styles.modalShiftTag,
                          { backgroundColor: shift.bg },
                        ]}
                      >
                        <Text
                          style={[
                            styles.modalShiftTagText,
                            { color: shift.textColor },
                          ]}
                        >
                          {shift.label}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </ScrollView>
            )}

            <View style={styles.modalFooterBtns}>
              <TouchableOpacity
                style={styles.modalEditBtn}
                onPress={() => {
                  setSelectedEmployee(null);
                  Alert.alert(
                    "Edit",
                    `Editing schedule for ${selectedEmployee?.name}`,
                  );
                }}
              >
                <Ionicons name="create-outline" size={18} color="#fff" />
                <Text style={styles.modalBtnText}>Edit Schedule</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalDeleteBtn}
                onPress={() => {
                  setSelectedEmployee(null);
                  Alert.alert(
                    "Remove",
                    `Schedule for ${selectedEmployee?.name} removed.`,
                  );
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── ADD SHIFT MODAL ── */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Shift</Text>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={26} color="#64748B" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody}>
              {[
                {
                  label: "Employee Name *",
                  placeholder: "Enter employee name",
                  key: "name",
                },
                {
                  label: "Role",
                  placeholder: "Enter role/position",
                  key: "role",
                },
                {
                  label: "Department",
                  placeholder: "Select department",
                  key: "dept",
                },
                {
                  label: "Shift Type",
                  placeholder: "Morning / Afternoon / Night",
                  key: "shift",
                },
                {
                  label: "Start Date",
                  placeholder: "e.g. 2026-03-02",
                  key: "start",
                },
                {
                  label: "End Date",
                  placeholder: "e.g. 2026-03-08",
                  key: "end",
                },
              ].map((field) => (
                <View key={field.key} style={styles.formGroup}>
                  <Text style={styles.formLabel}>{field.label}</Text>
                  <TextInput
                    style={styles.formInput}
                    placeholder={field.placeholder}
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              ))}
            </ScrollView>
            <View style={styles.modalFooterBtns}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalEditBtn}
                onPress={() => {
                  setShowAddModal(false);
                  Alert.alert("Success", "Shift added successfully!");
                }}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={18}
                  color="#fff"
                />
                <Text style={styles.modalBtnText}>Save Shift</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── DEPARTMENT FILTER MODAL ── */}
      <Modal
        visible={showDeptModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeptModal(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowDeptModal(false)}
        >
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownTitle}>Select Department</Text>
            {DEPARTMENTS.map((dept) => (
              <TouchableOpacity
                key={dept}
                style={[
                  styles.dropdownItem,
                  selectedDept === dept && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setSelectedDept(dept);
                  setShowDeptModal(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedDept === dept && styles.dropdownItemTextActive,
                  ]}
                >
                  {dept}
                </Text>
                {selectedDept === dept && (
                  <Ionicons name="checkmark" size={16} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── SHIFT TYPE FILTER MODAL ── */}
      <Modal
        visible={showShiftModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowShiftModal(false)}
      >
        <TouchableOpacity
          style={styles.dropdownOverlay}
          activeOpacity={1}
          onPress={() => setShowShiftModal(false)}
        >
          <View style={styles.dropdownBox}>
            <Text style={styles.dropdownTitle}>Select Shift Type</Text>
            {["All Shifts", "Morning", "Afternoon", "Night"].map((s) => (
              <TouchableOpacity
                key={s}
                style={[
                  styles.dropdownItem,
                  selectedShift === s && styles.dropdownItemActive,
                ]}
                onPress={() => {
                  setSelectedShift(s);
                  setShowShiftModal(false);
                }}
              >
                <Text
                  style={[
                    styles.dropdownItemText,
                    selectedShift === s && styles.dropdownItemTextActive,
                  ]}
                >
                  {s}
                </Text>
                {selectedShift === s && (
                  <Ionicons name="checkmark" size={16} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  // HEADER
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: { padding: 6 },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 10,
  },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  logoTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "700",
    color: "#1E293B",
  },
  headerRight: { flexDirection: "row", alignItems: "center", gap: 4 },
  iconBtn: { padding: 6 },

  // BREADCRUMB
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  breadcrumbText: { fontSize: 12, color: "#64748B" },
  breadcrumbActive: { fontSize: 12, color: "#3B82F6", fontWeight: "600" },

  scroll: { flex: 1 },

  // PAGE HEAD
  pageHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  pageTitle: { fontSize: 22, fontWeight: "700", color: "#1E293B" },
  pageSubtitle: { fontSize: 12, color: "#64748B", marginTop: 2 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#3B82F6",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  addBtnText: { color: "#fff", fontWeight: "600", fontSize: 14 },

  // STATS
  statsScroll: { marginBottom: 16 },
  statsRow: { paddingHorizontal: 12, gap: 10 },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    width: 110,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: { fontSize: 22, fontWeight: "700", color: "#1E293B" },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
    textAlign: "center",
  },

  // WEEK NAV
  weekNav: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  weekNavBtn: { padding: 6, borderRadius: 8, backgroundColor: "#F8FAFC" },
  weekLabelWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  weekLabel: { fontSize: 13, fontWeight: "600", color: "#1E293B" },
  todayBtn: {
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  todayBtnText: { fontSize: 12, fontWeight: "600", color: "#3B82F6" },

  // TOOLBAR
  toolbarRow: { paddingHorizontal: 16, marginBottom: 10 },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1E293B" },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 8,
    alignItems: "center",
  },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flex: 1,
  },
  filterChipText: { fontSize: 13, color: "#475569", flex: 1 },
  viewToggle: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    padding: 3,
    gap: 2,
  },
  viewBtn: { padding: 7, borderRadius: 8 },
  viewBtnActive: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },

  // RESULTS BAR
  resultsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  resultsText: { fontSize: 12, color: "#64748B" },
  clearText: { fontSize: 12, color: "#3B82F6", fontWeight: "600" },

  // ROSTER TABLE CARD
  rosterCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    overflow: "hidden",
  },

  // TABLE HEADER
  tableHeaderRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  empColHeader: {
    width: 180,
    paddingVertical: 12,
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  dayColHeader: {
    width: 120,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  todayColHeader: { backgroundColor: "#EFF6FF" },
  hoursColHeader: { width: 55, paddingVertical: 12, alignItems: "center" },
  statusColHeader: { width: 90, paddingVertical: 12, alignItems: "center" },
  colHeaderText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 0.6,
  },
  dayName: {
    fontSize: 10,
    fontWeight: "600",
    color: "#64748B",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  todayDayName: { color: "#3B82F6" },
  dateBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  todayBubble: { backgroundColor: "#3B82F6" },
  dateNum: { fontSize: 13, fontWeight: "700", color: "#1E293B" },
  todayDateNum: { color: "#FFFFFF" },

  // TABLE ROWS
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  tableRowAlt: { backgroundColor: "#FAFBFF" },
  empCell: {
    width: 180,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 12, fontWeight: "700" },
  empInfo: { flex: 1 },
  empName: { fontSize: 13, fontWeight: "600", color: "#1E293B" },
  empRole: { fontSize: 11, color: "#94A3B8", marginTop: 1 },
  dayCell: { width: 120, padding: 6, alignItems: "center" },
  todayDayCell: { backgroundColor: "#F0F7FF" },
  hoursCell: { width: 55, alignItems: "center" },
  hoursText: { fontSize: 13, fontWeight: "700", color: "#1E293B" },
  statusCell: { width: 90, alignItems: "center" },

  // SHIFT PILL
  shiftPill: {
    borderRadius: 7,
    paddingVertical: 5,
    paddingHorizontal: 6,
    alignItems: "center",
    minWidth: 100,
  },
  shiftLabel: { fontSize: 11, fontWeight: "700" },
  shiftTime: { fontSize: 9.5, marginTop: 1.5, fontWeight: "500" },

  // STATUS BADGES
  badgeActive: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#DCFCE7",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  badgeDotGreen: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22C55E",
  },
  badgeTextGreen: { fontSize: 11, fontWeight: "600", color: "#166534" },
  badgeLeave: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEE2E2",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 4,
  },
  badgeDotRed: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EF4444",
  },
  badgeTextRed: { fontSize: 11, fontWeight: "600", color: "#991B1B" },

  // TABLE FOOTER
  tableFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    backgroundColor: "#F8FAFC",
  },
  footerText: { fontSize: 12, color: "#94A3B8" },
  pagination: { flexDirection: "row", gap: 4 },
  pageBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  pageBtnActive: { backgroundColor: "#3B82F6", borderColor: "#3B82F6" },
  pageBtnActiveText: { fontSize: 12, fontWeight: "700", color: "#FFFFFF" },
  pageBtnText: { fontSize: 12, color: "#64748B" },

  // LIST VIEW
  listContainer: { paddingHorizontal: 16, gap: 12 },
  listCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.07,
    shadowRadius: 4,
    elevation: 2,
  },
  listCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
  },
  listEmpInfo: { flex: 1 },
  listShiftsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  listDayCol: { alignItems: "center", flex: 1 },
  listDayLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "#94A3B8",
    marginBottom: 5,
  },
  listShiftDot: { width: 10, height: 10, borderRadius: 5, marginBottom: 4 },
  listShiftName: { fontSize: 9, color: "#64748B" },
  listFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  listFooterText: { fontSize: 12, color: "#94A3B8" },

  // EMPTY STATE
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginTop: 12,
    marginBottom: 6,
  },
  emptyText: { fontSize: 13, color: "#94A3B8" },

  // MODALS
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  modalSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
  },
  modalHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginTop: 10,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalTitle: { fontSize: 17, fontWeight: "700", color: "#1E293B" },
  modalBody: { padding: 16, maxHeight: "72%" },

  // PROFILE IN MODAL
  modalProfile: { alignItems: "center", paddingBottom: 20 },
  modalAvatar: {
    width: 72,
    height: 72,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  modalAvatarText: { fontSize: 22, fontWeight: "800" },
  modalEmpName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 4,
  },
  modalEmpRole: { fontSize: 13, color: "#64748B", marginBottom: 8 },
  modalDeptBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  modalDeptText: { fontSize: 12, color: "#3B82F6", fontWeight: "600" },

  // SUMMARY ROW
  modalSummaryRow: {
    flexDirection: "row",
    backgroundColor: "#F8FAFC",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  modalSummaryItem: { flex: 1, alignItems: "center" },
  modalSumDivider: { width: 1, backgroundColor: "#E2E8F0" },
  modalSummaryVal: { fontSize: 22, fontWeight: "700", color: "#1E293B" },
  modalSummaryLabel: { fontSize: 11, color: "#94A3B8", marginTop: 2 },

  // DAY BREAKDOWN
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1E293B",
    marginBottom: 12,
  },
  modalDayRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalDayRowToday: {
    backgroundColor: "#F0F7FF",
    borderRadius: 8,
    paddingHorizontal: 8,
    marginHorizontal: -8,
  },
  modalDayLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalDayBubble: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  modalDayNum: { fontSize: 13, fontWeight: "700", color: "#1E293B" },
  modalDayName: { fontSize: 14, color: "#334155", fontWeight: "500" },
  modalDayTime: { fontSize: 11, color: "#94A3B8", marginTop: 1 },
  modalShiftTag: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  modalShiftTagText: { fontSize: 12, fontWeight: "700" },

  // MODAL FOOTER BTNS
  modalFooterBtns: {
    flexDirection: "row",
    gap: 10,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  modalEditBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: "#3B82F6",
    padding: 14,
    borderRadius: 12,
  },
  modalDeleteBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBtnText: { color: "#fff", fontWeight: "700", fontSize: 15 },
  cancelBtn: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  cancelBtnText: { fontSize: 15, fontWeight: "600", color: "#64748B" },

  // FORM
  formGroup: { marginBottom: 14 },
  formLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
    marginBottom: 7,
  },
  formInput: {
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    padding: 12,
    fontSize: 14,
    color: "#1E293B",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  // DROPDOWN
  dropdownOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  dropdownBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 6,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  dropdownTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: "#94A3B8",
    paddingHorizontal: 14,
    paddingVertical: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  dropdownItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  dropdownItemActive: { backgroundColor: "#EFF6FF" },
  dropdownItemText: { fontSize: 14, color: "#334155" },
  dropdownItemTextActive: { color: "#3B82F6", fontWeight: "600" },
});
