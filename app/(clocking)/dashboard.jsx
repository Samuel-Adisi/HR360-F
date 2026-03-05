import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Modal,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

export default function HRDashboard() {
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({
    Dashboard: false,
    Employees: false,
    Projects: false,
    Attendance: false,
    Clients: false,
    LeaveManagement: false,
    Holidays: false,
    Accounts: false,
    Departments: false,
    Payroll: false,
    Job: false,
    Consultancy: false,
    Email: false,
    Chat: false,
    Calendar: false,
    TaskBar: false,
    Portfolio: false,
    Others: false,
  });

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoBackup, setAutoBackup] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const notificationBlink = useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    const blinkAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(notificationBlink, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(notificationBlink, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    blinkAnimation.start();
    return () => blinkAnimation.stop();
  }, []);

  const statCards = [
    {
      title: "Projects",
      value: "125",
      percentage: 34.7,
      color: "#A855F7",
      icon: "briefcase",
    },
    {
      title: "New Employees",
      value: "213",
      percentage: 5.2,
      color: "#06B6D4",
      icon: "people",
    },
    {
      title: "Running Tasks",
      value: "10,225",
      percentage: 18,
      color: "#14B8A6",
      icon: "list",
    },
    {
      title: "Earning",
      value: "$2,658",
      percentage: 83.7,
      color: "#F97316",
      icon: "cash",
    },
  ];

  const attendanceData = [
    { month: "Jan", present: 780, absent: 67 },
    { month: "Feb", present: 820, absent: 45 },
    { month: "Mar", present: 790, absent: 58 },
    { month: "Apr", present: 850, absent: 32 },
    { month: "May", present: 760, absent: 72 },
    { month: "Jun", present: 840, absent: 48 },
    { month: "Jul", present: 810, absent: 55 },
  ];

  const payrollData = [
    { month: "Jan", value: 42 },
    { month: "Feb", value: 58 },
    { month: "Mar", value: 48 },
    { month: "Apr", value: 72 },
    { month: "May", value: 65 },
    { month: "Jun", value: 88 },
    { month: "Jul", value: 95 },
  ];

  const projectDetails = [
    {
      name: "Project A",
      team: 3,
      priority: "High",
      status: 45,
      statusColor: "#EF4444",
    },
    {
      name: "Project B",
      team: 2,
      priority: "Medium",
      status: 68,
      statusColor: "#3B82F6",
    },
    {
      name: "Project C",
      team: 4,
      priority: "High",
      status: 72,
      statusColor: "#F59E0B",
    },
    {
      name: "Project D",
      team: 3,
      priority: "Low",
      status: 85,
      statusColor: "#10B981",
    },
    {
      name: "Project E",
      team: 2,
      priority: "Medium",
      status: 58,
      statusColor: "#3B82F6",
    },
    {
      name: "Project G",
      team: 4,
      priority: "Low",
      status: 92,
      statusColor: "#10B981",
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New Employee Added",
      message: "John Doe has joined the team",
      time: "5m ago",
      unread: true,
    },
    {
      id: 2,
      title: "Leave Request",
      message: "Sarah requested leave for 3 days",
      time: "1h ago",
      unread: true,
    },
    {
      id: 3,
      title: "Project Update",
      message: "Project A completed 75%",
      time: "2h ago",
      unread: false,
    },
    {
      id: 4,
      title: "Payroll Reminder",
      message: "Process payroll by end of week",
      time: "1d ago",
      unread: false,
    },
  ];

  const menuItems = [
    {
      id: "Dashboard",
      icon: "grid-outline",
      label: "Dashboard",
      hasSubmenu: true,
      submenu: ["Overview", "Analytics"],
    },
    {
      id: "Employees",
      icon: "people-outline",
      label: "Employees",
      hasSubmenu: true,
      submenu: ["All-Employees", "Add-Employee", "Organization-Chart"],
    },
    {
      id: "Recruitment",
      icon: "briefcase-outline",
      label: "Recruitment",
      hasSubmenu: true,
      submenu: [
        "Recruitment-Dashboard",
        "Job-Postings",
        "Add-Job-Posting",
        "Applications",
        "Interviews",
        "Offers",
      ],
    },
    {
      id: "Attendance",
      icon: "calendar-outline",
      label: "Attendance",
      hasSubmenu: true,
      submenu: [
        "Todays-Attendance",
        "Attendance-Report",
        "Time-Tracking",
        "Shift-Roster",
      ],
    },
    {
      id: "LeaveManagement",
      icon: "document-text-outline",
      label: "Leave Management",
      hasSubmenu: true,
      submenu: [
        "Leave-Requests",
        "Leave-Balance",
        "New-Leave-Request",
        "Leave-Calendar",
      ],
    },
    {
      id: "Performance",
      icon: "trophy-outline",
      label: "Performance",
      hasSubmenu: true,
      submenu: [
        "Performance-Dashboard",
        "Appraisals",
        "Goal-Tracking",
        "Reviews",
        "KPIs",
      ],
    },
    {
      id: "Payroll",
      icon: "cash-outline",
      label: "Payroll",
      hasSubmenu: true,
      submenu: [
        "Payroll-Dashboard",
        "Employee-Salary",
        "Payslips",
        "Process-Payroll",
        "Tax-Management",
      ],
    },
    {
      id: "Projects",
      icon: "folder-outline",
      label: "Projects",
      hasSubmenu: true,
      submenu: [
        "All-Projects",
        "Add-Project",
        "Project-Tasks",
        "Project-Timeline",
      ],
    },
    {
      id: "TimeTracking",
      icon: "time-outline",
      label: "Time Tracking",
      hasSubmenu: true,
      submenu: ["Timesheets", "Project-Hours", "Overtime", "Time-Reports"],
    },
    {
      id: "Training",
      icon: "school-outline",
      label: "Training & Development",
      hasSubmenu: true,
      submenu: [
        "Training-Programs",
        "Course-Catalog",
        "Employee-Training",
        "Certifications",
        "Skills-Matrix",
      ],
    },
    {
      id: "Expenses",
      icon: "receipt-outline",
      label: "Expenses",
      hasSubmenu: true,
      submenu: [
        "Expense-Claims",
        "Add-Expense",
        "Reimbursements",
        "Expense-Reports",
      ],
    },
    {
      id: "Assets",
      icon: "laptop-outline",
      label: "Assets Management",
      hasSubmenu: true,
      submenu: [
        "All-Assets",
        "Add-Asset",
        "Asset-Assignment",
        "Asset-Maintenance",
      ],
    },
    {
      id: "Documents",
      icon: "document-attach-outline",
      label: "Documents",
      hasSubmenu: true,
      submenu: [
        "Document-Library",
        "Employee-Documents",
        "Policies",
        "Contracts",
        "Upload-Document",
      ],
    },
    {
      id: "Departments",
      icon: "business-outline",
      label: "Departments",
      hasSubmenu: true,
      submenu: ["All-Departments", "Add-Department", "Department-Structure"],
    },
    {
      id: "Clients",
      icon: "person-outline",
      label: "Clients",
      hasSubmenu: true,
      submenu: ["All-Clients", "Add-Client", "Client-Contracts"],
    },
    {
      id: "Holidays",
      icon: "gift-outline",
      label: "Holidays",
      hasSubmenu: true,
      submenu: ["Holiday-Calendar", "Add-Holiday", "Holiday-List"],
    },
    {
      id: "Announcements",
      icon: "megaphone-outline",
      label: "Announcements",
      hasSubmenu: true,
      submenu: ["All-Announcements", "Create-Announcement", "Company-News"],
    },
    {
      id: "Approvals",
      icon: "checkmark-done-outline",
      label: "Approvals",
      hasSubmenu: true,
      submenu: [
        "Pending-Approvals",
        "Leave-Approvals",
        "Expense-Approvals",
        "Timesheet-Approvals",
      ],
    },
    {
      id: "Reports",
      icon: "bar-chart-outline",
      label: "Reports & Analytics",
      hasSubmenu: true,
      submenu: [
        "Dashboard",
        "Attendance-Reports",
        "Payroll-Reports",
        "Performance-Reports",
        "Custom-Reports",
        "Export-Data",
      ],
    },
    {
      id: "Accounts",
      icon: "wallet-outline",
      label: "Accounts",
      hasSubmenu: true,
      submenu: [
        "Account-Dashboard",
        "Transactions",
        "Invoices",
        "Budget-Management",
      ],
    },
    {
      id: "Loans",
      icon: "card-outline",
      label: "Loans & Advances",
      hasSubmenu: true,
      submenu: ["All-Loans", "Apply-Loan", "Loan-Approvals", "Loan-Repayments"],
    },
    {
      id: "Benefits",
      icon: "heart-outline",
      label: "Benefits",
      hasSubmenu: true,
      submenu: ["Benefits-Overview", "Insurance", "Health-Benefits", "Perks"],
    },
    {
      id: "ExitManagement",
      icon: "exit-outline",
      label: "Exit Management",
      hasSubmenu: true,
      submenu: [
        "Resignations",
        "Exit-Interviews",
        "Clearance",
        "Final-Settlement",
      ],
    },
    {
      id: "Compliance",
      icon: "shield-checkmark-outline",
      label: "Compliance",
      hasSubmenu: true,
      submenu: ["Labor-Laws", "Certifications", "Audits", "Policy-Compliance"],
    },
    {
      id: "Email",
      icon: "mail-outline",
      label: "Email",
      hasSubmenu: true,
      submenu: ["Inbox", "Compose", "Sent", "Templates"],
    },
    {
      id: "Chat",
      icon: "chatbubbles-outline",
      label: "Chat",
      hasSubmenu: false,
    },
    {
      id: "Calendar",
      icon: "calendar-outline",
      label: "Calendar",
      hasSubmenu: true,
      submenu: ["My-Calendar", "Team-Calendar", "Events"],
    },
    {
      id: "TaskBar",
      icon: "checkbox-outline",
      label: "Tasks",
      hasSubmenu: true,
      submenu: ["My-Tasks", "Team-Tasks", "Add-Task"],
    },
    {
      id: "Notifications",
      icon: "notifications-outline",
      label: "Notifications",
      hasSubmenu: true,
      submenu: ["All-Notifications", "Settings"],
    },
    {
      id: "Settings",
      icon: "settings-outline",
      label: "Settings",
      hasSubmenu: true,
      submenu: [
        "General-Settings",
        "Company-Profile",
        "User-Management",
        "Roles-Permissions",
        "Email-Templates",
        "System-Configuration",
        "Backup-Restore",
      ],
    },
    {
      id: "HelpSupport",
      icon: "help-circle-outline",
      label: "Help & Support",
      hasSubmenu: true,
      submenu: ["Help-Center", "FAQs", "Submit-Ticket", "Documentation"],
    },
  ];

  const toggleSidebar = () => setSidebarVisible(!sidebarVisible);
  const toggleMenu = (menuId) =>
    setExpandedMenus((prev) => ({ ...prev, [menuId]: !prev[menuId] }));
  const handleDownloadChart = (chartName) =>
    Alert.alert("Download", `${chartName} downloaded successfully!`);
  const handlePrintChart = (chartName) =>
    Alert.alert("Print", `Sending ${chartName} to printer...`);
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", onPress: () => Alert.alert("Logged out successfully") },
    ]);
  };

  const maxBarHeight = 150;

  const renderBarChart = () => {
    const maxValue = Math.max(
      ...attendanceData.map((d) => d.present + d.absent),
    );
    return (
      <View style={styles.barChartContainer}>
        <View style={styles.chartYAxis}>
          {["700", "600", "500", "400", "300", "200", "100"].map((label, i) => (
            <Text key={i} style={styles.yAxisLabel}>
              {label}
            </Text>
          ))}
        </View>
        <View style={styles.chartArea}>
          <View style={styles.chartGrid}>
            {[...Array(7)].map((_, i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>
          <View style={styles.barsContainer}>
            {attendanceData.map((data, index) => {
              const presentHeight = (data.present / maxValue) * maxBarHeight;
              const absentHeight = (data.absent / maxValue) * maxBarHeight;
              return (
                <View key={index} style={styles.barGroup}>
                  <View style={styles.barPair}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: presentHeight,
                          backgroundColor: index === 3 ? "#EF4444" : "#6366F1",
                          marginRight: 2,
                        },
                      ]}
                    />
                    <View
                      style={[
                        styles.bar,
                        { height: absentHeight, backgroundColor: "#10B981" },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{data.month}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </View>
    );
  };

  const renderAreaChart = () => {
    const maxValue = Math.max(...payrollData.map((d) => d.value));
    const chartHeight = 160;
    return (
      <View style={styles.areaChartContainer}>
        <View style={styles.chartYAxis}>
          {["120", "100", "80", "60", "40", "20"].map((label, i) => (
            <Text key={i} style={styles.yAxisLabel}>
              {label}
            </Text>
          ))}
        </View>
        <View style={styles.chartArea}>
          <View style={styles.chartGrid}>
            {[...Array(6)].map((_, i) => (
              <View key={i} style={styles.gridLine} />
            ))}
          </View>
          <View style={styles.areaChartInner}>
            {payrollData.map((data, index) => {
              const pointHeight = (data.value / maxValue) * chartHeight;
              const bottomPosition = chartHeight - pointHeight;
              return (
                <View key={index} style={styles.areaColumn}>
                  <View
                    style={[
                      styles.areaFill,
                      {
                        height: pointHeight,
                        backgroundColor:
                          index % 2 === 0 ? "#93C5FD40" : "#FCA5A540",
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.areaPoint,
                      {
                        bottom: bottomPosition,
                        backgroundColor:
                          index % 2 === 0 ? "#3B82F6" : "#EF4444",
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
          <View style={styles.xAxisLabels}>
            {payrollData.map((data, index) => (
              <Text key={index} style={styles.xAxisLabel}>
                {data.month}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <View style={styles.header}>
        <TouchableOpacity onPress={toggleSidebar} style={styles.menuButton}>
          <Ionicons name="menu-outline" size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.logoTitle}>HR360</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => setMenuVisible(!menuVisible)}
          >
            <Ionicons
              name="swap-horizontal-outline"
              size={24}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.breadcrumb}>
          <Ionicons name="home-outline" size={14} color="#64748B" />
          <Text style={styles.breadcrumbText}> Home › Dashboard</Text>
        </View>

        <View style={styles.statsContainer}>
          {statCards.map((card, index) => (
            <View
              key={index}
              style={[styles.statCard, { backgroundColor: card.color }]}
            >
              <View style={styles.statHeader}>
                <Text style={styles.statTitle}>{card.title}</Text>
                <Ionicons
                  name={card.icon}
                  size={24}
                  color="rgba(255,255,255,0.4)"
                />
              </View>
              <Text style={styles.statValue}>{card.value}</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${card.percentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.statPercentage}>{card.percentage}%</Text>
            </View>
          ))}
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Attendance Chart</Text>
            <View style={styles.chartIcons}>
              <TouchableOpacity
                onPress={() => handleDownloadChart("Attendance Chart")}
              >
                <Ionicons name="download-outline" size={18} color="#94A3B8" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePrintChart("Attendance Chart")}
              >
                <Ionicons name="print-outline" size={18} color="#94A3B8" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="share-outline" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
          {renderBarChart()}
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#6366F1" }]}
              />
              <Text style={styles.legendText}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#10B981" }]}
              />
              <Text style={styles.legendText}>Absent</Text>
            </View>
          </View>
        </View>

        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Payroll Overview</Text>
            <View style={styles.chartIcons}>
              <TouchableOpacity
                onPress={() => handleDownloadChart("Payroll Overview")}
              >
                <Ionicons name="download-outline" size={18} color="#94A3B8" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handlePrintChart("Payroll Overview")}
              >
                <Ionicons name="print-outline" size={18} color="#94A3B8" />
              </TouchableOpacity>
              <TouchableOpacity>
                <Ionicons name="share-outline" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
          {renderAreaChart()}
          <View style={styles.chartLegend}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#3B82F6" }]}
              />
              <Text style={styles.legendText}>Revenue 1</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#EF4444" }]}
              />
              <Text style={styles.legendText}>Revenue 2</Text>
            </View>
          </View>
        </View>

        <View style={styles.projectCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Project Details</Text>
            <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
          </View>
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Project</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Team</Text>
            <Text style={[styles.tableHeaderText, { flex: 1 }]}>Priority</Text>
            <Text style={[styles.tableHeaderText, { flex: 1.5 }]}>Status</Text>
          </View>
          {projectDetails.map((project, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={[styles.tableCell, { flex: 1.5 }]}>
                {project.name}
              </Text>
              <View style={[styles.tableCellTeam, { flex: 1 }]}>
                {[...Array(Math.min(project.team, 3))].map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.teamAvatar,
                      { backgroundColor: ["#EF4444", "#3B82F6", "#10B981"][i] },
                    ]}
                  />
                ))}
                {project.team > 3 && (
                  <View
                    style={[styles.teamAvatar, { backgroundColor: "#E5E7EB" }]}
                  >
                    <Text style={styles.teamCount}>+{project.team - 3}</Text>
                  </View>
                )}
              </View>
              <View style={[styles.tableCell, { flex: 1 }]}>
                <View
                  style={[
                    styles.priorityBadge,
                    {
                      backgroundColor:
                        project.priority === "High"
                          ? "#FEF3C7"
                          : project.priority === "Medium"
                            ? "#DBEAFE"
                            : "#D1FAE5",
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      {
                        color:
                          project.priority === "High"
                            ? "#92400E"
                            : project.priority === "Medium"
                              ? "#1E40AF"
                              : "#065F46",
                      },
                    ]}
                  >
                    {project.priority}
                  </Text>
                </View>
              </View>
              <View style={[styles.tableCell, { flex: 1.5 }]}>
                <View style={styles.statusBar}>
                  <View
                    style={[
                      styles.statusFill,
                      {
                        width: `${project.status}%`,
                        backgroundColor: project.statusColor,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.todoCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>TODO List</Text>
            <Ionicons name="ellipsis-vertical" size={20} color="#94A3B8" />
          </View>
          <View style={styles.todoItem}>
            <View style={styles.checkbox} />
            <Text style={styles.todoText}>Add salary details to system</Text>
          </View>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.menuDropdown}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.menuSection}>
              <View style={styles.menuSectionHeader}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color="#1E293B"
                />
                <Text style={styles.menuSectionTitle}>Notifications</Text>
                <Animated.View style={{ opacity: notificationBlink }}>
                  <View style={styles.notificationBadgeMenu} />
                </Animated.View>
              </View>
              <ScrollView style={styles.notificationsList} nestedScrollEnabled>
                {notifications.map((notif) => (
                  <TouchableOpacity
                    key={notif.id}
                    style={styles.notificationItem}
                  >
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationTitle}>
                        {notif.title}
                      </Text>
                      <Text style={styles.notificationMessage}>
                        {notif.message}
                      </Text>
                      <Text style={styles.notificationTime}>{notif.time}</Text>
                    </View>
                    {notif.unread && <View style={styles.unreadDot} />}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.profileMenuItem}
              onPress={handleLogout}
            >
              <View style={styles.profileMenuContent}>
                <Image
                  source={require("../../assets/profile/person.avif")}
                  style={styles.profileImageSmall}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.profileMenuName}>Emily Konadu</Text>
                  <Text style={styles.profileMenuRole}>Manager</Text>
                </View>
              </View>
              <Ionicons name="log-out-outline" size={20} color="#EF4444" />
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.menuSection}>
              <View style={styles.menuSectionHeader}>
                <Ionicons name="settings-outline" size={20} color="#1E293B" />
                <Text style={styles.menuSectionTitle}>Settings</Text>
              </View>
              <View style={styles.settingsContainer}>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons
                      name="notifications-outline"
                      size={18}
                      color="#64748B"
                    />
                    <Text style={styles.settingLabel}>Push Notifications</Text>
                  </View>
                  <Switch
                    value={notificationsEnabled}
                    onValueChange={setNotificationsEnabled}
                    trackColor={{ false: "#CBD5E1", true: "#3B82F6" }}
                    thumbColor="#FFFFFF"
                  />
                </View>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="mail-outline" size={18} color="#64748B" />
                    <Text style={styles.settingLabel}>Email Notifications</Text>
                  </View>
                  <Switch
                    value={emailNotifications}
                    onValueChange={setEmailNotifications}
                    trackColor={{ false: "#CBD5E1", true: "#3B82F6" }}
                    thumbColor="#FFFFFF"
                  />
                </View>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons name="moon-outline" size={18} color="#64748B" />
                    <Text style={styles.settingLabel}>Dark Mode</Text>
                  </View>
                  <Switch
                    value={darkMode}
                    onValueChange={setDarkMode}
                    trackColor={{ false: "#CBD5E1", true: "#3B82F6" }}
                    thumbColor="#FFFFFF"
                  />
                </View>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons
                      name="cloud-upload-outline"
                      size={18}
                      color="#64748B"
                    />
                    <Text style={styles.settingLabel}>Auto Backup</Text>
                  </View>
                  <Switch
                    value={autoBackup}
                    onValueChange={setAutoBackup}
                    trackColor={{ false: "#CBD5E1", true: "#3B82F6" }}
                    thumbColor="#FFFFFF"
                  />
                </View>
                <View style={styles.settingItem}>
                  <View style={styles.settingInfo}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={18}
                      color="#64748B"
                    />
                    <Text style={styles.settingLabel}>Two-Factor Auth</Text>
                  </View>
                  <Switch
                    value={twoFactorAuth}
                    onValueChange={setTwoFactorAuth}
                    trackColor={{ false: "#CBD5E1", true: "#3B82F6" }}
                    thumbColor="#FFFFFF"
                  />
                </View>
                <TouchableOpacity style={styles.settingButton}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color="#64748B"
                  />
                  <Text style={styles.settingLabel}>Change Password</Text>
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingButton}>
                  <Ionicons name="key-outline" size={18} color="#64748B" />
                  <Text style={styles.settingLabel}>Access Control</Text>
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingButton}>
                  <Ionicons
                    name="document-text-outline"
                    size={18}
                    color="#64748B"
                  />
                  <Text style={styles.settingLabel}>Data Export</Text>
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingButton}>
                  <Ionicons
                    name="help-circle-outline"
                    size={18}
                    color="#64748B"
                  />
                  <Text style={styles.settingLabel}>Help & Support</Text>
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={sidebarVisible}
        transparent
        animationType="slide"
        onRequestClose={toggleSidebar}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={toggleSidebar}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.sidebar}
            onPress={(e) => e.stopPropagation()}
          >
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.sidebarLogoSection}>
                <View style={styles.sidebarLogo}>
                  <Text style={styles.sidebarLogoText}>A</Text>
                </View>
                <Text style={styles.sidebarLogoTitle}>HR360</Text>
              </View>
              <View style={styles.profileSection}>
                <View style={styles.profileImageContainer}>
                  <Image
                    source={require("../../assets/profile/person.avif")}
                    style={styles.profileImage}
                  />
                </View>
                <Text style={styles.profileName}>Emily Konadu</Text>
                <Text style={styles.profileRole}>Manager</Text>
              </View>
              <View style={styles.divider} />
              <Text style={styles.menuLabel}>-- Main</Text>
              {menuItems.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity
                    style={[
                      styles.menuItem,
                      item.id === "Dashboard" && styles.menuItemActive,
                    ]}
                    onPress={() => item.hasSubmenu && toggleMenu(item.id)}
                  >
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={item.id === "Dashboard" ? "#3B82F6" : "#64748B"}
                    />
                    <Text
                      style={[
                        styles.menuText,
                        item.id === "Dashboard" && styles.menuTextActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                    {item.hasSubmenu && (
                      <Ionicons
                        name={
                          expandedMenus[item.id]
                            ? "remove-outline"
                            : "add-outline"
                        }
                        size={18}
                        color="#CBD5E1"
                      />
                    )}
                  </TouchableOpacity>
                  {item.hasSubmenu && expandedMenus[item.id] && (
                    <View style={styles.submenu}>
                      {item.submenu.map((sub, subIndex) => (
                        <TouchableOpacity
                          key={subIndex}
                          style={styles.submenuItem}
                          onPress={() => {
                            router.push(`../${sub.toLowerCase()}`);
                            setSidebarVisible(false);
                          }}
                        >
                          <Text style={styles.submenuText}>
                            {sub.replace("-", " ")}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>
              ))}
              <View style={{ height: 30 }} />
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
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
  menuButton: { padding: 8 },
  headerCenter: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginLeft: 12,
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
  headerRight: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconButton: { position: "relative", padding: 4 },
  scrollContent: { flex: 1 },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  breadcrumbText: { fontSize: 12, color: "#64748B" },
  statsContainer: { paddingHorizontal: 12 },
  statCard: {
    marginHorizontal: 4,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  statTitle: { fontSize: 13, fontWeight: "600", color: "#FFFFFF" },
  statValue: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 12,
  },
  progressBar: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 3,
  },
  statPercentage: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    textAlign: "right",
  },
  chartCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  chartTitle: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  chartIcons: { flexDirection: "row", gap: 12 },
  barChartContainer: { flexDirection: "row", height: 180, marginBottom: 12 },
  chartYAxis: {
    width: 30,
    justifyContent: "space-between",
    paddingRight: 8,
    paddingVertical: 4,
  },
  yAxisLabel: { fontSize: 9, color: "#94A3B8" },
  chartArea: { flex: 1, position: "relative" },
  chartGrid: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 20,
    justifyContent: "space-between",
  },
  gridLine: { height: 1, backgroundColor: "#F1F5F9" },
  barsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    height: 160,
    paddingHorizontal: 4,
  },
  barGroup: { alignItems: "center", flex: 1 },
  barPair: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  bar: { width: 12, borderTopLeftRadius: 3, borderTopRightRadius: 3 },
  barLabel: { fontSize: 9, color: "#64748B", marginTop: 6 },
  areaChartContainer: { flexDirection: "row", height: 180, marginBottom: 12 },
  areaChartInner: {
    flexDirection: "row",
    alignItems: "flex-end",
    height: 160,
    justifyContent: "space-between",
  },
  areaColumn: {
    flex: 1,
    height: 160,
    position: "relative",
    marginHorizontal: 2,
  },
  areaFill: { borderTopLeftRadius: 4, borderTopRightRadius: 4 },
  areaPoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    position: "absolute",
    left: "50%",
    marginLeft: -4,
  },
  xAxisLabels: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 4,
  },
  xAxisLabel: { fontSize: 9, color: "#64748B" },
  chartLegend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 8,
    gap: 16,
  },
  legendItem: { flexDirection: "row", alignItems: "center" },
  legendDot: { width: 10, height: 10, borderRadius: 5, marginRight: 6 },
  legendText: { fontSize: 12, color: "#64748B" },
  projectCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#1E293B" },
  tableHeader: {
    flexDirection: "row",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    marginBottom: 8,
  },
  tableHeaderText: { fontSize: 11, fontWeight: "600", color: "#64748B" },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    alignItems: "center",
  },
  tableCell: { fontSize: 12, color: "#334155" },
  tableCellTeam: { flexDirection: "row", alignItems: "center" },
  teamAvatar: {
    width: 22,
    height: 22,
    borderRadius: 11,
    marginRight: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  teamCount: { fontSize: 9, color: "#64748B", fontWeight: "600" },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
  },
  priorityText: { fontSize: 10, fontWeight: "600" },
  statusBar: {
    height: 6,
    backgroundColor: "#E2E8F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  statusFill: { height: "100%", borderRadius: 3 },
  todoCard: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  todoItem: { flexDirection: "row", alignItems: "center", paddingVertical: 8 },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#CBD5E1",
    marginRight: 12,
  },
  todoText: { fontSize: 13, color: "#475569", flex: 1 },
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  menuDropdown: {
    width: width * 0.85,
    maxHeight: height * 0.85,
    backgroundColor: "#FFFFFF",
    marginTop: 60,
    marginRight: 16,
    borderRadius: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  menuSection: { padding: 16 },
  menuSectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 8,
  },
  menuSectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    flex: 1,
  },
  notificationBadgeMenu: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },
  notificationsList: { maxHeight: 200 },
  notificationItem: {
    flexDirection: "row",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    alignItems: "center",
  },
  notificationContent: { flex: 1 },
  notificationTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  notificationMessage: { fontSize: 12, color: "#64748B", marginBottom: 4 },
  notificationTime: { fontSize: 11, color: "#94A3B8" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginLeft: 8,
  },
  divider: { height: 1, backgroundColor: "#E2E8F0", marginHorizontal: 16 },
  profileMenuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    justifyContent: "space-between",
  },
  profileMenuContent: { flexDirection: "row", alignItems: "center", flex: 1 },
  profileImageSmall: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  profileInfo: { flex: 1 },
  profileMenuName: { fontSize: 14, fontWeight: "600", color: "#1E293B" },
  profileMenuRole: { fontSize: 12, color: "#64748B" },
  settingsContainer: { gap: 4 },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  settingInfo: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  settingLabel: { fontSize: 13, color: "#334155", flex: 1 },
  settingButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    gap: 12,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-start",
  },
  sidebar: {
    width: width * 0.75,
    height: "100%",
    backgroundColor: "#FFFFFF",
    paddingTop: 20,
  },
  sidebarLogoSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sidebarLogo: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: "#F97316",
    justifyContent: "center",
    alignItems: "center",
  },
  sidebarLogoText: { color: "#FFFFFF", fontSize: 18, fontWeight: "700" },
  sidebarLogoTitle: {
    marginLeft: 10,
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  profileImageContainer: { marginBottom: 12 },
  profileImage: { width: 64, height: 64, borderRadius: 32 },
  profileName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 4,
  },
  profileRole: { fontSize: 13, color: "#64748B" },
  menuLabel: {
    fontSize: 11,
    fontWeight: "600",
    color: "#94A3B8",
    paddingHorizontal: 20,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 12,
  },
  menuItemActive: {
    backgroundColor: "#EFF6FF",
    borderLeftWidth: 3,
    borderLeftColor: "#3B82F6",
  },
  menuText: { fontSize: 14, color: "#64748B", flex: 1 },
  menuTextActive: { color: "#3B82F6", fontWeight: "600" },
  submenu: { paddingLeft: 52, backgroundColor: "#F8FAFC" },
  submenuItem: { paddingVertical: 10, paddingHorizontal: 20 },
  submenuText: { fontSize: 13, color: "#64748B" },
});
