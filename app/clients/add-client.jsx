import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

// ─────────────────────────────────────────────────────────────
//  DATA
// ─────────────────────────────────────────────────────────────

const INITIAL_CLIENTS = [
  {
    id: "1",
    name: "Meridian Holdings",
    contact: "Sarah Chen",
    email: "s.chen@meridian.co",
    phone: "+1 (415) 882-3310",
    contracts: 3,
    status: "Active",
    initials: "MH",
    avatarColor: "#3B82F6",
  },
  {
    id: "2",
    name: "Apex Ventures LLC",
    contact: "James Okafor",
    email: "j.okafor@apexv.com",
    phone: "+1 (212) 554-7821",
    contracts: 1,
    status: "Active",
    initials: "AV",
    avatarColor: "#10B981",
  },
  {
    id: "3",
    name: "Stratos Digital",
    contact: "Priya Nair",
    email: "p.nair@stratos.io",
    phone: "+1 (628) 443-9002",
    contracts: 2,
    status: "Inactive",
    initials: "SD",
    avatarColor: "#F97316",
  },
  {
    id: "4",
    name: "Lune Creative",
    contact: "Marc Dubois",
    email: "marc@lunecreative.fr",
    phone: "+33 1 42 73 8800",
    contracts: 4,
    status: "Active",
    initials: "LC",
    avatarColor: "#A855F7",
  },
  {
    id: "5",
    name: "Ironclad Systems",
    contact: "Tara Williams",
    email: "t.williams@ironclad.dev",
    phone: "+1 (510) 229-6641",
    contracts: 0,
    status: "Pending",
    initials: "IS",
    avatarColor: "#06B6D4",
  },
  {
    id: "6",
    name: "Brightfield Co.",
    contact: "Nathan Park",
    email: "nathan@brightfield.com",
    phone: "+1 (303) 817-5530",
    contracts: 2,
    status: "Active",
    initials: "BC",
    avatarColor: "#F59E0B",
  },
  {
    id: "7",
    name: "Vertex Analytics",
    contact: "Lena Müller",
    email: "l.muller@vertex.de",
    phone: "+49 30 12345678",
    contracts: 1,
    status: "Active",
    initials: "VA",
    avatarColor: "#EF4444",
  },
  {
    id: "8",
    name: "Novo Logistics",
    contact: "Carlos Reyes",
    email: "c.reyes@novolog.mx",
    phone: "+52 55 9988 7766",
    contracts: 0,
    status: "Inactive",
    initials: "NL",
    avatarColor: "#64748B",
  },
];

const INDUSTRIES = [
  "Technology",
  "Finance",
  "Healthcare",
  "Retail",
  "Manufacturing",
  "Media & Entertainment",
  "Real Estate",
  "Education",
  "Logistics",
  "Other",
];
const CLIENT_TYPES = [
  "Corporate",
  "SME",
  "Startup",
  "Non-Profit",
  "Government",
];
const AVATAR_COLORS = [
  "#3B82F6",
  "#10B981",
  "#F97316",
  "#A855F7",
  "#06B6D4",
  "#F59E0B",
  "#EF4444",
  "#64748B",
  "#EC4899",
  "#14B8A6",
];
const STATUS_CONFIG = {
  Active: { bg: "#DCFCE7", text: "#166534", dot: "#22C55E" },
  Inactive: { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" },
  Pending: { bg: "#FEF9C3", text: "#854D0E", dot: "#EAB308" },
};
const FILTER_TABS = ["All", "Active", "Inactive", "Pending"];
const EMPTY_FORM = {
  companyName: "",
  contactName: "",
  email: "",
  phone: "",
  address: "",
  industry: "",
  clientType: "",
  notes: "",
};

// ─────────────────────────────────────────────────────────────
//  HELPERS
// ─────────────────────────────────────────────────────────────

const getInitials = (contactName, companyName) => {
  const source = companyName?.trim() || contactName?.trim() || "??";
  return source
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() || "")
    .join("");
};

const randomColor = () =>
  AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)];

// ─────────────────────────────────────────────────────────────
//  STATUS BADGE
// ─────────────────────────────────────────────────────────────

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Inactive;
  return (
    <View style={[bs.wrap, { backgroundColor: cfg.bg }]}>
      <View style={[bs.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[bs.text, { color: cfg.text }]}>{status}</Text>
    </View>
  );
};
const bs = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 5,
  },
  dot: { width: 6, height: 6, borderRadius: 3 },
  text: { fontSize: 11, fontWeight: "600" },
});

// ─────────────────────────────────────────────────────────────
//  ADD CLIENT MODAL
// ─────────────────────────────────────────────────────────────

const AddClientModal = ({ visible, onClose, onAdd }) => {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showIndustryPicker, setShowIndustryPicker] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);

  const updateField = (field, value) => {
    setFormData((p) => ({ ...p, [field]: value }));
    if (errors[field]) setErrors((p) => ({ ...p, [field]: null }));
  };

  const validateForm = () => {
    const e = {};
    if (!formData.contactName.trim())
      e.contactName = "Contact person is required";
    if (!formData.email.trim()) {
      e.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      e.email = "Please enter a valid email address";
    }
    if (formData.phone && !/^\+?[\d\s\-()]{7,}$/.test(formData.phone))
      e.phone = "Please enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 900));
      const displayName =
        formData.companyName.trim() || formData.contactName.trim();
      onAdd({
        id: String(Date.now()),
        name: displayName,
        contact: formData.contactName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || "—",
        contracts: 0,
        status: "Active",
        initials: getInitials(formData.contactName, formData.companyName),
        avatarColor: randomColor(),
      });
      setFormData(EMPTY_FORM);
      setErrors({});
      onClose();
    } catch {
      Alert.alert("Error", "Failed to add client. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (isSubmitting) return;
    const hasData = Object.values(formData).some((v) => v.trim() !== "");
    if (hasData) {
      Alert.alert("Discard Changes?", "Your form data will be lost.", [
        { text: "Keep Editing", style: "cancel" },
        {
          text: "Discard",
          style: "destructive",
          onPress: () => {
            setFormData(EMPTY_FORM);
            setErrors({});
            onClose();
          },
        },
      ]);
    } else {
      onClose();
    }
  };

  // ── Reusable input ────────────────────────────────────────

  const InputField = ({
    label,
    fieldKey,
    placeholder,
    icon,
    keyboardType = "default",
    autoCapitalize = "words",
    required = false,
    multiline = false,
  }) => (
    <View style={ms.formGroup}>
      <Text style={ms.label}>
        {label}
        {required && <Text style={ms.req}> *</Text>}
      </Text>
      <View
        style={[
          ms.inputRow,
          multiline && ms.inputMultiline,
          errors[fieldKey] && ms.inputError,
          !errors[fieldKey] && formData[fieldKey].length > 0 && ms.inputSuccess,
        ]}
      >
        <Ionicons
          name={icon}
          size={17}
          color={errors[fieldKey] ? "#EF4444" : "#94A3B8"}
          style={ms.inputIcon}
        />
        <TextInput
          style={[ms.input, multiline && ms.inputTextMulti]}
          value={formData[fieldKey]}
          onChangeText={(t) => updateField(fieldKey, t)}
          placeholder={placeholder}
          placeholderTextColor="#CBD5E1"
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={false}
          editable={!isSubmitting}
          multiline={multiline}
          numberOfLines={multiline ? 3 : 1}
          textAlignVertical={multiline ? "top" : "center"}
        />
        {!multiline && formData[fieldKey].length > 0 && !errors[fieldKey] && (
          <Ionicons name="checkmark-circle" size={15} color="#22C55E" />
        )}
      </View>
      {errors[fieldKey] && (
        <View style={ms.errorRow}>
          <Ionicons name="alert-circle" size={12} color="#EF4444" />
          <Text style={ms.errorText}>{errors[fieldKey]}</Text>
        </View>
      )}
    </View>
  );

  const PickerField = ({
    label,
    fieldKey,
    options,
    icon,
    placeholder,
    visible,
    setVisible,
    otherSet,
  }) => (
    <View style={ms.formGroup}>
      <Text style={ms.label}>{label}</Text>
      <TouchableOpacity
        style={[ms.inputRow, errors[fieldKey] && ms.inputError]}
        onPress={() => {
          otherSet(false);
          setVisible(!visible);
        }}
        activeOpacity={0.7}
        disabled={isSubmitting}
      >
        <Ionicons name={icon} size={17} color="#94A3B8" style={ms.inputIcon} />
        <Text
          style={[
            ms.input,
            ms.pickerText,
            !formData[fieldKey] && ms.placeholder,
          ]}
        >
          {formData[fieldKey] || placeholder}
        </Text>
        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={15}
          color="#94A3B8"
        />
      </TouchableOpacity>
      {visible && (
        <View style={ms.dropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                ms.dropdownItem,
                formData[fieldKey] === opt && ms.dropdownItemActive,
              ]}
              onPress={() => {
                updateField(fieldKey, opt);
                setVisible(false);
              }}
            >
              <Text
                style={[
                  ms.dropdownText,
                  formData[fieldKey] === opt && ms.dropdownTextActive,
                ]}
              >
                {opt}
              </Text>
              {formData[fieldKey] === opt && (
                <Ionicons name="checkmark" size={15} color="#3B82F6" />
              )}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={ms.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ justifyContent: "flex-end" }}
        >
          <View style={ms.sheet}>
            {/* Handle bar */}
            <View style={ms.handle} />

            {/* Header */}
            <View style={ms.modalHeader}>
              <View style={ms.modalHeaderLeft}>
                <View style={ms.modalIconCircle}>
                  <Ionicons name="person-add" size={18} color="#3B82F6" />
                </View>
                <View>
                  <Text style={ms.modalTitle}>Add New Client</Text>
                  <Text style={ms.modalSubtitle}>
                    Fill in the client details below
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                disabled={isSubmitting}
                style={ms.closeBtn}
              >
                <Ionicons name="close" size={22} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={ms.divider} />

            {/* Scrollable form */}
            <ScrollView
              style={ms.formScroll}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              {/* ── Company (optional) ── */}
              <View style={ms.section}>
                <View style={ms.sectionTitleRow}>
                  <View
                    style={[ms.sectionBar, { backgroundColor: "#3B82F6" }]}
                  />
                  <Text style={ms.sectionTitle}>Company Information</Text>
                  <Text style={ms.sectionOptional}>(optional)</Text>
                </View>
                <InputField
                  label="Company Name"
                  fieldKey="companyName"
                  placeholder="e.g. Meridian Holdings"
                  icon="business-outline"
                />
                <InputField
                  label="Address"
                  fieldKey="address"
                  placeholder="Street, City, Country"
                  icon="location-outline"
                />
                <PickerField
                  label="Industry"
                  fieldKey="industry"
                  options={INDUSTRIES}
                  icon="layers-outline"
                  placeholder="Select industry…"
                  visible={showIndustryPicker}
                  setVisible={setShowIndustryPicker}
                  otherSet={setShowTypePicker}
                />
                <PickerField
                  label="Client Type"
                  fieldKey="clientType"
                  options={CLIENT_TYPES}
                  icon="briefcase-outline"
                  placeholder="Select client type…"
                  visible={showTypePicker}
                  setVisible={setShowTypePicker}
                  otherSet={setShowIndustryPicker}
                />
              </View>

              {/* ── Primary Contact (required) ── */}
              <View style={ms.section}>
                <View style={ms.sectionTitleRow}>
                  <View
                    style={[ms.sectionBar, { backgroundColor: "#10B981" }]}
                  />
                  <Text style={ms.sectionTitle}>Primary Contact</Text>
                </View>
                <InputField
                  label="Contact Person"
                  fieldKey="contactName"
                  placeholder="e.g. Sarah Chen"
                  icon="person-outline"
                  required
                />
                <InputField
                  label="Email Address"
                  fieldKey="email"
                  placeholder="contact@company.com"
                  icon="mail-outline"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  required
                />
                <InputField
                  label="Phone Number"
                  fieldKey="phone"
                  placeholder="+1 (555) 000-0000"
                  icon="call-outline"
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                />
              </View>

              {/* ── Notes (optional) ── */}
              <View style={ms.section}>
                <View style={ms.sectionTitleRow}>
                  <View
                    style={[ms.sectionBar, { backgroundColor: "#F97316" }]}
                  />
                  <Text style={ms.sectionTitle}>Notes</Text>
                  <Text style={ms.sectionOptional}>(optional)</Text>
                </View>
                <InputField
                  label="Additional Notes"
                  fieldKey="notes"
                  placeholder="Any relevant details about this client…"
                  icon="document-text-outline"
                  multiline
                  autoCapitalize="sentences"
                />
              </View>

              {/* Info box */}
              <View style={ms.infoBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={15}
                  color="#3B82F6"
                />
                <Text style={ms.infoText}>
                  Fields marked <Text style={ms.req}>*</Text> are required.
                  Company name is optional — if left blank the contact name will
                  be used.
                </Text>
              </View>
            </ScrollView>

            {/* Footer */}
            <View style={ms.footer}>
              <TouchableOpacity
                style={[ms.cancelBtn, isSubmitting && ms.disabledBtn]}
                onPress={handleClose}
                disabled={isSubmitting}
              >
                <Text style={ms.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[ms.submitBtn, isSubmitting && ms.submittingBtn]}
                onPress={handleSubmit}
                disabled={isSubmitting}
                activeOpacity={0.85}
              >
                {isSubmitting ? (
                  <>
                    <ActivityIndicator size="small" color="#fff" />
                    <Text style={ms.submitBtnText}>Adding…</Text>
                  </>
                ) : (
                  <>
                    <Ionicons name="checkmark-circle" size={17} color="#fff" />
                    <Text style={ms.submitBtnText}>Add Client</Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────

export default function AllClientsScreen({ navigation }) {
  const [clients, setClients] = useState(INITIAL_CLIENTS);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [modalVisible, setModalVisible] = useState(false);

  const filtered = clients.filter((c) => {
    const matchFilter = activeFilter === "All" || c.status === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      c.name.toLowerCase().includes(q) ||
      c.contact.toLowerCase().includes(q) ||
      c.email.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const counts = {
    All: clients.length,
    Active: clients.filter((c) => c.status === "Active").length,
    Inactive: clients.filter((c) => c.status === "Inactive").length,
    Pending: clients.filter((c) => c.status === "Pending").length,
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back-outline" size={22} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>A</Text>
          </View>
          <Text style={styles.logoTitle}>HR360</Text>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* ── Breadcrumb ── */}
      <View style={styles.breadcrumb}>
        <Ionicons name="home-outline" size={13} color="#64748B" />
        <Text style={styles.breadcrumbText}> Home › Clients › </Text>
        <Text style={styles.breadcrumbActive}>All Clients</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Page Head */}
        <View style={styles.pageHead}>
          <View>
            <Text style={styles.pageTitle}>All Clients</Text>
            <Text style={styles.pageSubtitle}>
              {clients.length} clients registered
            </Text>
          </View>
          <TouchableOpacity style={styles.exportBtn}>
            <Ionicons name="download-outline" size={16} color="#3B82F6" />
            <Text style={styles.exportBtnText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* Stat Strip */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statRow}
          style={styles.statScroll}
        >
          {[
            {
              label: "Total",
              value: clients.length,
              color: "#3B82F6",
              bg: "#EFF6FF",
              icon: "people",
            },
            {
              label: "Active",
              value: counts.Active,
              color: "#22C55E",
              bg: "#DCFCE7",
              icon: "checkmark-circle",
            },
            {
              label: "Inactive",
              value: counts.Inactive,
              color: "#94A3B8",
              bg: "#F1F5F9",
              icon: "pause-circle",
            },
            {
              label: "Pending",
              value: counts.Pending,
              color: "#EAB308",
              bg: "#FEF9C3",
              icon: "time",
            },
          ].map((s) => (
            <View
              key={s.label}
              style={[styles.statCard, { backgroundColor: s.bg }]}
            >
              <View
                style={[
                  styles.statIconWrap,
                  { backgroundColor: s.color + "22" },
                ]}
              >
                <Ionicons name={s.icon} size={18} color={s.color} />
              </View>
              <Text style={[styles.statValue, { color: s.color }]}>
                {s.value}
              </Text>
              <Text style={styles.statLabel}>{s.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Search */}
        <View style={styles.searchWrap}>
          <Ionicons name="search-outline" size={16} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name, contact or email…"
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterRow}
        >
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.filterTab,
                activeFilter === tab && styles.filterTabActive,
              ]}
              onPress={() => setActiveFilter(tab)}
            >
              <Text
                style={[
                  styles.filterTabText,
                  activeFilter === tab && styles.filterTabTextActive,
                ]}
              >
                {tab}
              </Text>
              <View
                style={[
                  styles.filterCount,
                  activeFilter === tab && styles.filterCountActive,
                ]}
              >
                <Text
                  style={[
                    styles.filterCountText,
                    activeFilter === tab && styles.filterCountTextActive,
                  ]}
                >
                  {counts[tab]}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Client Cards */}
        <View style={styles.cardList}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={52} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No clients found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filter
              </Text>
            </View>
          ) : (
            filtered.map((client) => (
              <TouchableOpacity
                key={client.id}
                style={styles.clientCard}
                activeOpacity={0.75}
              >
                <View style={styles.cardHeader}>
                  <View
                    style={[
                      styles.avatar,
                      { backgroundColor: client.avatarColor },
                    ]}
                  >
                    <Text style={styles.avatarText}>{client.initials}</Text>
                  </View>
                  <View style={styles.cardInfo}>
                    <Text style={styles.clientName}>{client.name}</Text>
                    <Text style={styles.contactName}>{client.contact}</Text>
                  </View>
                  <StatusBadge status={client.status} />
                </View>

                <View style={styles.cardDivider} />

                <View style={styles.cardDetails}>
                  <View style={styles.detailRow}>
                    <Ionicons name="mail-outline" size={14} color="#94A3B8" />
                    <Text style={styles.detailText} numberOfLines={1}>
                      {client.email}
                    </Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Ionicons name="call-outline" size={14} color="#94A3B8" />
                    <Text style={styles.detailText}>{client.phone}</Text>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View style={styles.contractBadge}>
                    <Ionicons
                      name="document-text-outline"
                      size={13}
                      color="#3B82F6"
                    />
                    <Text style={styles.contractText}>
                      {client.contracts}{" "}
                      {client.contracts === 1 ? "Contract" : "Contracts"}
                    </Text>
                  </View>
                  <TouchableOpacity style={styles.viewBtn}>
                    <Text style={styles.viewBtnText}>View</Text>
                    <Ionicons
                      name="chevron-forward"
                      size={13}
                      color="#3B82F6"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── Add Client Bottom Sheet Modal ── */}
      <AddClientModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={(newClient) => setClients((p) => [newClient, ...p])}
      />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  MODAL STYLES
// ─────────────────────────────────────────────────────────────

const ms = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.52)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "91%",
    paddingBottom: Platform.OS === "ios" ? 28 : 16,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E2E8F0",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },

  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  modalHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  modalIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#EFF6FF",
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: { fontSize: 17, fontWeight: "700", color: "#1E293B" },
  modalSubtitle: { fontSize: 12, color: "#94A3B8", marginTop: 1 },
  closeBtn: { padding: 4 },
  divider: { height: 1, backgroundColor: "#F1F5F9" },

  formScroll: { paddingHorizontal: 20 },
  section: { paddingTop: 18, paddingBottom: 4 },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionBar: { width: 4, height: 16, borderRadius: 2 },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: "#1E293B" },
  sectionOptional: { fontSize: 11, color: "#94A3B8", fontWeight: "500" },

  formGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: "600", color: "#334155", marginBottom: 6 },
  req: { color: "#EF4444" },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    paddingHorizontal: 11,
    minHeight: 46,
  },
  inputMultiline: { alignItems: "flex-start", paddingTop: 11, minHeight: 88 },
  inputError: { borderColor: "#FCA5A5", backgroundColor: "#FEF2F2" },
  inputSuccess: { borderColor: "#BBF7D0" },
  inputIcon: { marginRight: 8 },
  input: { flex: 1, fontSize: 14, color: "#1E293B", paddingVertical: 0 },
  inputTextMulti: { paddingTop: 0, textAlignVertical: "top", minHeight: 66 },
  placeholder: { color: "#CBD5E1" },
  pickerText: { paddingVertical: 13 },

  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 4,
  },
  errorText: { fontSize: 12, color: "#EF4444", flex: 1 },

  dropdown: {
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 11,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  dropdownItemActive: { backgroundColor: "#EFF6FF" },
  dropdownText: { fontSize: 14, color: "#334155" },
  dropdownTextActive: { color: "#3B82F6", fontWeight: "600" },

  infoBox: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: "#EFF6FF",
    padding: 12,
    borderRadius: 10,
    gap: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginTop: 4,
  },
  infoText: { flex: 1, fontSize: 12, color: "#1D4ED8", lineHeight: 18 },

  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 14,
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  cancelBtnText: { fontSize: 15, fontWeight: "600", color: "#64748B" },
  submitBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "#3B82F6",
    gap: 6,
    shadowColor: "#3B82F6",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.28,
    shadowRadius: 8,
    elevation: 4,
  },
  submittingBtn: { backgroundColor: "#1D4ED8" },
  submitBtnText: { fontSize: 15, fontWeight: "700", color: "#FFFFFF" },
  disabledBtn: { opacity: 0.5 },
});

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────

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
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#3B82F6",
    justifyContent: "center",
    alignItems: "center",
  },

  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  breadcrumbText: { fontSize: 12, color: "#64748B" },
  breadcrumbActive: { fontSize: 12, color: "#3B82F6", fontWeight: "600" },

  scroll: { flex: 1 },
  pageHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    marginBottom: 14,
  },
  pageTitle: { fontSize: 22, fontWeight: "700", color: "#1E293B" },
  pageSubtitle: { fontSize: 12, color: "#64748B", marginTop: 2 },
  exportBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    backgroundColor: "#EFF6FF",
  },
  exportBtnText: { fontSize: 13, fontWeight: "600", color: "#3B82F6" },

  statScroll: { marginBottom: 14 },
  statRow: { paddingHorizontal: 12, gap: 10 },
  statCard: {
    width: 110,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    gap: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },
  statValue: { fontSize: 22, fontWeight: "700" },
  statLabel: { fontSize: 11, color: "#64748B", fontWeight: "500" },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    gap: 8,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  searchInput: { flex: 1, fontSize: 14, color: "#1E293B" },

  filterRow: { paddingHorizontal: 12, gap: 8, marginBottom: 14 },
  filterTab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: "#E2E8F0",
    backgroundColor: "#FFFFFF",
  },
  filterTabActive: { backgroundColor: "#EFF6FF", borderColor: "#3B82F6" },
  filterTabText: { fontSize: 13, fontWeight: "500", color: "#64748B" },
  filterTabTextActive: { color: "#3B82F6", fontWeight: "700" },
  filterCount: {
    backgroundColor: "#F1F5F9",
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  filterCountActive: { backgroundColor: "#BFDBFE" },
  filterCountText: { fontSize: 11, fontWeight: "700", color: "#64748B" },
  filterCountTextActive: { color: "#1D4ED8" },

  cardList: { paddingHorizontal: 16, gap: 12 },
  clientCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  avatarText: { fontSize: 14, fontWeight: "800", color: "#FFFFFF" },
  cardInfo: { flex: 1 },
  clientName: { fontSize: 15, fontWeight: "700", color: "#1E293B" },
  contactName: { fontSize: 12, color: "#64748B", marginTop: 2 },
  cardDivider: { height: 1, backgroundColor: "#F1F5F9", marginBottom: 12 },
  cardDetails: { gap: 8, marginBottom: 12 },
  detailRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  detailText: { fontSize: 13, color: "#475569", flex: 1 },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contractBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "#EFF6FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  contractText: { fontSize: 12, fontWeight: "600", color: "#3B82F6" },
  viewBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  viewBtnText: { fontSize: 13, fontWeight: "600", color: "#3B82F6" },
  emptyState: { alignItems: "center", paddingVertical: 48 },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: { fontSize: 13, color: "#94A3B8" },
});
