import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    ScrollView,
    StatusBar,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

export default function SettingsScreen() {
  // Notification States
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);

  // Appearance States
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState("Medium");
  const [language, setLanguage] = useState("English (US)");

  // Data & Storage States
  const [autoBackup, setAutoBackup] = useState(true);
  const [autoSync, setAutoSync] = useState(true);
  const [offlineMode, setOfflineMode] = useState(false);
  const [storageUsed, setStorageUsed] = useState(2.3);

  // Security States
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [biometricAuth, setBiometricAuth] = useState(true);

  // Company Settings States
  const [workingHoursStart, setWorkingHoursStart] = useState("9:00 AM");
  const [workingHoursEnd, setWorkingHoursEnd] = useState("5:00 PM");

  // Integration States
  const [slackConnected, setSlackConnected] = useState(true);
  const [googleConnected, setGoogleConnected] = useState(false);

  // Modal States
  const [fontSizeModal, setFontSizeModal] = useState(false);
  const [languageModal, setLanguageModal] = useState(false);
  const [workingHoursModal, setWorkingHoursModal] = useState(false);

  const backgroundColor = darkMode ? "#1E293B" : "#F8FAFC";
  const cardBackground = darkMode ? "#334155" : "#FFFFFF";
  const textPrimary = darkMode ? "#F1F5F9" : "#1E293B";
  const textSecondary = darkMode ? "#94A3B8" : "#64748B";
  const textTertiary = darkMode ? "#64748B" : "#94A3B8";
  const borderColor = darkMode ? "#475569" : "#E2E8F0";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: () => {
          Alert.alert("Success", "Logged out successfully");
        },
        style: "destructive",
      },
    ]);
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This action cannot be undone. All your data will be permanently deleted.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => {
            Alert.alert(
              "Account Deleted",
              "Your account has been scheduled for deletion",
            );
          },
          style: "destructive",
        },
      ],
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      "Clear Cache",
      "This will free up storage space on your device.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          onPress: () => {
            setStorageUsed(0.8);
            Alert.alert("Success", "Cache cleared successfully! Freed 1.5 GB");
          },
        },
      ],
    );
  };

  const handleDataExport = () => {
    Alert.alert("Export Data", "Choose export format:", [
      {
        text: "CSV",
        onPress: () => Alert.alert("Success", "Data exported to CSV format"),
      },
      {
        text: "PDF",
        onPress: () => Alert.alert("Success", "Data exported to PDF format"),
      },
      { text: "Cancel", style: "cancel" },
    ]);
  };

  const handleToggleSlack = () => {
    setSlackConnected(!slackConnected);
    Alert.alert(
      "Slack Integration",
      slackConnected
        ? "Disconnected from Slack"
        : "Connected to Slack successfully",
    );
  };

  const handleToggleGoogle = () => {
    setGoogleConnected(!googleConnected);
    Alert.alert(
      "Google Workspace",
      googleConnected
        ? "Disconnected from Google Workspace"
        : "Connected to Google Workspace successfully",
    );
  };

  const handleCheckUpdates = () => {
    setTimeout(() => {
      Alert.alert("You're up to date!", "You have the latest version (4.5.2)");
    }, 1000);
  };

  const settingSections = [
    {
      title: "ACCOUNT",
      items: [
        {
          icon: "person-outline",
          label: "Profile Information",
          type: "nav",
          onPress: () =>
            Alert.alert("Profile", "Navigate to Profile Information"),
        },
        {
          icon: "lock-closed-outline",
          label: "Change Password",
          type: "nav",
          onPress: () => Alert.alert("Security", "Navigate to Change Password"),
        },
        {
          icon: "mail-outline",
          label: "Email Preferences",
          type: "nav",
          onPress: () => Alert.alert("Email", "Navigate to Email Preferences"),
        },
        {
          icon: "call-outline",
          label: "Phone Number",
          type: "nav",
          subtitle: "+1 (555) 123-4567",
          onPress: () => Alert.alert("Phone", "Update your phone number"),
        },
      ],
    },
    {
      title: "NOTIFICATIONS",
      items: [
        {
          icon: "notifications-outline",
          label: "Push Notifications",
          type: "toggle",
          value: notificationsEnabled,
          onToggle: setNotificationsEnabled,
        },
        {
          icon: "mail-outline",
          label: "Email Notifications",
          type: "toggle",
          value: emailNotifications,
          onToggle: setEmailNotifications,
        },
        {
          icon: "chatbox-outline",
          label: "SMS Notifications",
          type: "toggle",
          value: smsNotifications,
          onToggle: setSmsNotifications,
        },
        {
          icon: "time-outline",
          label: "Notification Schedule",
          type: "nav",
          onPress: () =>
            Alert.alert(
              "Schedule",
              "Configure notification schedule (8 AM - 6 PM)",
            ),
        },
      ],
    },
    {
      title: "SECURITY & PRIVACY",
      items: [
        {
          icon: "shield-checkmark-outline",
          label: "Two-Factor Authentication",
          type: "toggle",
          value: twoFactorAuth,
          onToggle: (value) => {
            setTwoFactorAuth(value);
            Alert.alert(
              value ? "2FA Enabled" : "2FA Disabled",
              value
                ? "Two-factor authentication is now active"
                : "Two-factor authentication is now disabled",
            );
          },
        },
        {
          icon: "finger-print-outline",
          label: "Biometric Authentication",
          type: "toggle",
          value: biometricAuth,
          onToggle: (value) => {
            setBiometricAuth(value);
            Alert.alert(
              value ? "Biometric Enabled" : "Biometric Disabled",
              value
                ? "Fingerprint/Face ID authentication enabled"
                : "Biometric authentication disabled",
            );
          },
        },
        {
          icon: "key-outline",
          label: "Access Control",
          type: "nav",
          onPress: () =>
            Alert.alert("Access Control", "Manage user roles and permissions"),
        },
        {
          icon: "eye-off-outline",
          label: "Privacy Settings",
          type: "nav",
          onPress: () =>
            Alert.alert("Privacy", "Manage your privacy preferences"),
        },
        {
          icon: "document-lock-outline",
          label: "Data Permissions",
          type: "nav",
          onPress: () => Alert.alert("Permissions", "Manage app permissions"),
        },
      ],
    },
    {
      title: "APPEARANCE",
      items: [
        {
          icon: "moon-outline",
          label: "Dark Mode",
          type: "toggle",
          value: darkMode,
          onToggle: setDarkMode,
        },
        {
          icon: "color-palette-outline",
          label: "Theme Customization",
          type: "nav",
          onPress: () =>
            Alert.alert("Themes", "Choose from 12 available themes"),
        },
        {
          icon: "text-outline",
          label: "Font Size",
          type: "nav",
          subtitle: fontSize,
          onPress: () => setFontSizeModal(true),
        },
        {
          icon: "language-outline",
          label: "Language",
          type: "nav",
          subtitle: language,
          onPress: () => setLanguageModal(true),
        },
      ],
    },
    {
      title: "DATA & STORAGE",
      items: [
        {
          icon: "cloud-upload-outline",
          label: "Auto Backup",
          type: "toggle",
          value: autoBackup,
          onToggle: (value) => {
            setAutoBackup(value);
            Alert.alert(
              value ? "Auto Backup On" : "Auto Backup Off",
              value
                ? "Your data will be backed up daily"
                : "Auto backup disabled",
            );
          },
        },
        {
          icon: "sync-outline",
          label: "Auto Sync",
          type: "toggle",
          value: autoSync,
          onToggle: (value) => {
            setAutoSync(value);
            Alert.alert(
              value ? "Auto Sync On" : "Auto Sync Off",
              value ? "Data will sync automatically" : "Auto sync disabled",
            );
          },
        },
        {
          icon: "cloud-offline-outline",
          label: "Offline Mode",
          type: "toggle",
          value: offlineMode,
          onToggle: (value) => {
            setOfflineMode(value);
            Alert.alert(
              value ? "Offline Mode On" : "Offline Mode Off",
              value ? "You can now work offline" : "Offline mode disabled",
            );
          },
        },
        {
          icon: "document-text-outline",
          label: "Data Export",
          type: "nav",
          onPress: handleDataExport,
        },
        {
          icon: "server-outline",
          label: "Storage Usage",
          type: "nav",
          subtitle: `${storageUsed.toFixed(1)} GB / 10 GB`,
          onPress: () =>
            Alert.alert(
              "Storage",
              `Using ${storageUsed.toFixed(1)} GB of 10 GB\n\nDocuments: 1.2 GB\nImages: 0.8 GB\nCache: 0.3 GB`,
            ),
        },
        {
          icon: "trash-outline",
          label: "Clear Cache",
          type: "nav",
          onPress: handleClearCache,
        },
      ],
    },
    {
      title: "COMPANY SETTINGS",
      items: [
        {
          icon: "business-outline",
          label: "Company Profile",
          type: "nav",
          onPress: () => Alert.alert("Company", "Manage company information"),
        },
        {
          icon: "people-outline",
          label: "Department Management",
          type: "nav",
          onPress: () =>
            Alert.alert("Departments", "Manage departments and teams"),
        },
        {
          icon: "calendar-outline",
          label: "Working Hours",
          type: "nav",
          subtitle: `${workingHoursStart} - ${workingHoursEnd}`,
          onPress: () => setWorkingHoursModal(true),
        },
        {
          icon: "location-outline",
          label: "Office Locations",
          type: "nav",
          onPress: () =>
            Alert.alert("Locations", "Manage office locations (3 offices)"),
        },
        {
          icon: "settings-outline",
          label: "Payroll Settings",
          type: "nav",
          onPress: () => Alert.alert("Payroll", "Configure payroll settings"),
        },
      ],
    },
    {
      title: "INTEGRATIONS",
      items: [
        {
          icon: "link-outline",
          label: "Connected Apps",
          type: "nav",
          onPress: () =>
            Alert.alert(
              "Connected Apps",
              "Manage connected applications (2 active)",
            ),
        },
        {
          icon: "logo-slack",
          label: "Slack Integration",
          type: "nav",
          subtitle: slackConnected ? "Connected" : "Not Connected",
          onPress: handleToggleSlack,
        },
        {
          icon: "logo-google",
          label: "Google Workspace",
          type: "nav",
          subtitle: googleConnected ? "Connected" : "Not Connected",
          onPress: handleToggleGoogle,
        },
        {
          icon: "git-branch-outline",
          label: "API Access",
          type: "nav",
          onPress: () => Alert.alert("API", "Manage API keys and webhooks"),
        },
      ],
    },
    {
      title: "SUPPORT & FEEDBACK",
      items: [
        {
          icon: "help-circle-outline",
          label: "Help Center",
          type: "nav",
          onPress: () => Alert.alert("Help", "Access FAQs and documentation"),
        },
        {
          icon: "chatbubble-ellipses-outline",
          label: "Contact Support",
          type: "nav",
          onPress: () =>
            Alert.alert(
              "Support",
              "Email: support@hr360.com\nPhone: 1-800-HR360",
            ),
        },
        {
          icon: "star-outline",
          label: "Rate App",
          type: "nav",
          onPress: () =>
            Alert.alert("Thank you!", "Your feedback helps us improve"),
        },
        {
          icon: "megaphone-outline",
          label: "Send Feedback",
          type: "nav",
          onPress: () => Alert.alert("Feedback", "Tell us how we can improve"),
        },
        {
          icon: "bug-outline",
          label: "Report a Bug",
          type: "nav",
          onPress: () =>
            Alert.alert("Bug Report", "Describe the issue you encountered"),
        },
      ],
    },
    {
      title: "LEGAL & COMPLIANCE",
      items: [
        {
          icon: "document-text-outline",
          label: "Terms of Service",
          type: "nav",
          onPress: () => Alert.alert("Terms", "Last updated: January 2026"),
        },
        {
          icon: "shield-outline",
          label: "Privacy Policy",
          type: "nav",
          onPress: () => Alert.alert("Privacy", "View our privacy policy"),
        },
        {
          icon: "reader-outline",
          label: "Licenses",
          type: "nav",
          onPress: () => Alert.alert("Licenses", "View open source licenses"),
        },
        {
          icon: "checkmark-circle-outline",
          label: "Compliance Center",
          type: "nav",
          onPress: () => Alert.alert("Compliance", "GDPR, CCPA compliant"),
        },
      ],
    },
    {
      title: "ABOUT",
      items: [
        {
          icon: "information-circle-outline",
          label: "App Version",
          type: "info",
          subtitle: "4.5.2 (Build 1023)",
        },
        {
          icon: "code-slash-outline",
          label: "System Info",
          type: "nav",
          onPress: () =>
            Alert.alert(
              "System",
              "Device: iPhone 14 Pro\nOS: iOS 17.2\nRAM: 6GB",
            ),
        },
        {
          icon: "refresh-outline",
          label: "Check for Updates",
          type: "nav",
          onPress: handleCheckUpdates,
        },
      ],
    },
  ];

  const renderSettingItem = (item, index) => {
    if (item.type === "toggle") {
      return (
        <View
          key={index}
          style={[styles.settingItem, { backgroundColor: cardBackground }]}
        >
          <View style={styles.settingLeft}>
            <Ionicons name={item.icon} size={22} color={textSecondary} />
            <Text style={[styles.settingLabel, { color: textPrimary }]}>
              {item.label}
            </Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.onToggle}
            trackColor={{ false: "#CBD5E1", true: "#3B82F6" }}
            thumbColor="#FFFFFF"
          />
        </View>
      );
    }

    if (item.type === "info") {
      return (
        <View
          key={index}
          style={[styles.settingItem, { backgroundColor: cardBackground }]}
        >
          <View style={styles.settingLeft}>
            <Ionicons name={item.icon} size={22} color={textSecondary} />
            <View style={styles.settingTextContainer}>
              <Text style={[styles.settingLabel, { color: textPrimary }]}>
                {item.label}
              </Text>
              {item.subtitle && (
                <Text style={[styles.settingSubtitle, { color: textTertiary }]}>
                  {item.subtitle}
                </Text>
              )}
            </View>
          </View>
        </View>
      );
    }

    return (
      <TouchableOpacity
        key={index}
        style={[styles.settingItem, { backgroundColor: cardBackground }]}
        onPress={item.onPress}
      >
        <View style={styles.settingLeft}>
          <Ionicons name={item.icon} size={22} color={textSecondary} />
          <View style={styles.settingTextContainer}>
            <Text style={[styles.settingLabel, { color: textPrimary }]}>
              {item.label}
            </Text>
            {item.subtitle && (
              <Text style={[styles.settingSubtitle, { color: textTertiary }]}>
                {item.subtitle}
              </Text>
            )}
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor }]}
      edges={["top"]}
    >
      <StatusBar
        barStyle={darkMode ? "light-content" : "dark-content"}
        backgroundColor={cardBackground}
      />

      <View
        style={[
          styles.header,
          { backgroundColor: cardBackground, borderBottomColor: borderColor },
        ]}
      >
        <TouchableOpacity style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: textPrimary }]}>
          Settings
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.profileCard, { backgroundColor: cardBackground }]}>
          <Image
            source={require("../../assets/profile/person.avif")}
            style={styles.profileImage}
          />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: textPrimary }]}>
              Emily Konadu
            </Text>
            <Text style={[styles.profileRole, { color: textSecondary }]}>
              Manager • HR Department
            </Text>
            <Text style={[styles.profileEmail, { color: textTertiary }]}>
              emily.konadu@hr360.com
            </Text>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Ionicons name="create-outline" size={20} color="#3B82F6" />
          </TouchableOpacity>
        </View>

        {settingSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={[styles.sectionTitle, { color: textTertiary }]}>
              {section.title}
            </Text>
            <View
              style={[styles.settingsCard, { backgroundColor: cardBackground }]}
            >
              {section.items.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  {renderSettingItem(item, itemIndex)}
                  {itemIndex < section.items.length - 1 && (
                    <View
                      style={[
                        styles.divider,
                        { backgroundColor: darkMode ? "#475569" : "#F1F5F9" },
                      ]}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.dangerZone}>
          <Text style={[styles.sectionTitle, { color: textTertiary }]}>
            DANGER ZONE
          </Text>
          <View
            style={[styles.settingsCard, { backgroundColor: cardBackground }]}
          >
            <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
              <View style={styles.settingLeft}>
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                <Text style={[styles.settingLabel, styles.dangerText]}>
                  Logout
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
            <View
              style={[
                styles.divider,
                { backgroundColor: darkMode ? "#475569" : "#F1F5F9" },
              ]}
            />
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleDeleteAccount}
            >
              <View style={styles.settingLeft}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
                <Text style={[styles.settingLabel, styles.dangerText]}>
                  Delete Account
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: textTertiary }]}>
            HR360 © 2026
          </Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Font Size Modal */}
      <Modal
        visible={fontSizeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setFontSizeModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setFontSizeModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: cardBackground }]}
          >
            <Text style={[styles.modalTitle, { color: textPrimary }]}>
              Font Size
            </Text>
            {["Small", "Medium", "Large", "Extra Large"].map((size) => (
              <TouchableOpacity
                key={size}
                style={styles.modalOption}
                onPress={() => {
                  setFontSize(size);
                  setFontSizeModal(false);
                  Alert.alert("Font Size Updated", `Font size set to ${size}`);
                }}
              >
                <Text style={[styles.modalOptionText, { color: textPrimary }]}>
                  {size}
                </Text>
                {fontSize === size && (
                  <Ionicons name="checkmark" size={24} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Language Modal */}
      <Modal
        visible={languageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setLanguageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setLanguageModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: cardBackground }]}
          >
            <Text style={[styles.modalTitle, { color: textPrimary }]}>
              Language
            </Text>
            {[
              "English (US)",
              "English (UK)",
              "Spanish",
              "French",
              "German",
              "Chinese",
            ].map((lang) => (
              <TouchableOpacity
                key={lang}
                style={styles.modalOption}
                onPress={() => {
                  setLanguage(lang);
                  setLanguageModal(false);
                  Alert.alert("Language Updated", `Language set to ${lang}`);
                }}
              >
                <Text style={[styles.modalOptionText, { color: textPrimary }]}>
                  {lang}
                </Text>
                {language === lang && (
                  <Ionicons name="checkmark" size={24} color="#3B82F6" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Working Hours Modal */}
      <Modal
        visible={workingHoursModal}
        transparent
        animationType="fade"
        onRequestClose={() => setWorkingHoursModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setWorkingHoursModal(false)}
        >
          <View
            style={[styles.modalContent, { backgroundColor: cardBackground }]}
          >
            <Text style={[styles.modalTitle, { color: textPrimary }]}>
              Working Hours
            </Text>
            {[
              { start: "8:00 AM", end: "4:00 PM" },
              { start: "9:00 AM", end: "5:00 PM" },
              { start: "10:00 AM", end: "6:00 PM" },
              { start: "7:00 AM", end: "3:00 PM" },
            ].map((hours, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.modalOption}
                onPress={() => {
                  setWorkingHoursStart(hours.start);
                  setWorkingHoursEnd(hours.end);
                  setWorkingHoursModal(false);
                  Alert.alert(
                    "Working Hours Updated",
                    `Set to ${hours.start} - ${hours.end}`,
                  );
                }}
              >
                <Text style={[styles.modalOptionText, { color: textPrimary }]}>
                  {hours.start} - {hours.end}
                </Text>
                {workingHoursStart === hours.start && (
                  <Ionicons name="checkmark" size={24} color="#3B82F6" />
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
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
    width: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerRight: {
    width: 40,
  },
  scrollContent: {
    flex: 1,
  },
  profileCard: {
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 13,
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
  },
  editButton: {
    padding: 8,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "700",
    paddingHorizontal: 16,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  settingsCard: {
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  settingTextContainer: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 14,
    fontWeight: "500",
  },
  settingSubtitle: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    marginLeft: 50,
  },
  dangerZone: {
    marginTop: 24,
  },
  dangerText: {
    color: "#EF4444",
  },
  footer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  footerText: {
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: width * 0.8,
    borderRadius: 12,
    padding: 20,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  modalOptionText: {
    fontSize: 15,
    fontWeight: "500",
  },
});
