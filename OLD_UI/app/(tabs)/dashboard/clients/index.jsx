import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const CLIENTS = [
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

const STATUS_CONFIG = {
  Active: { bg: "#DCFCE7", text: "#166534", dot: "#22C55E" },
  Inactive: { bg: "#F1F5F9", text: "#475569", dot: "#94A3B8" },
  Pending: { bg: "#FEF9C3", text: "#854D0E", dot: "#EAB308" },
};

const FILTER_TABS = ["All", "Active", "Inactive", "Pending"];

const StatusBadge = ({ status }) => {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Inactive;
  return (
    <View style={[badgeStyles.wrap, { backgroundColor: cfg.bg }]}>
      <View style={[badgeStyles.dot, { backgroundColor: cfg.dot }]} />
      <Text style={[badgeStyles.text, { color: cfg.text }]}>{status}</Text>
    </View>
  );
};

const badgeStyles = StyleSheet.create({
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

export default function AllClientsScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = CLIENTS.filter((c) => {
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
    All: CLIENTS.length,
    Active: CLIENTS.filter((c) => c.status === "Active").length,
    Inactive: CLIENTS.filter((c) => c.status === "Inactive").length,
    Pending: CLIENTS.filter((c) => c.status === "Pending").length,
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
          onPress={() => navigation?.navigate("AddClient")}
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
        {/* ── Page Title ── */}
        <View style={styles.pageHead}>
          <View>
            <Text style={styles.pageTitle}>All Clients</Text>
            <Text style={styles.pageSubtitle}>
              {CLIENTS.length} clients registered
            </Text>
          </View>
          <TouchableOpacity style={styles.exportBtn} onPress={() => {}}>
            <Ionicons name="download-outline" size={16} color="#3B82F6" />
            <Text style={styles.exportBtnText}>Export</Text>
          </TouchableOpacity>
        </View>

        {/* ── Stat Strip ── */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.statRow}
          style={styles.statScroll}
        >
          {[
            {
              label: "Total",
              value: CLIENTS.length,
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

        {/* ── Search ── */}
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

        {/* ── Filter Tabs ── */}
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

        {/* ── Client Cards ── */}
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
                onPress={() => {}}
              >
                {/* Card Header */}
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

                {/* Divider */}
                <View style={styles.cardDivider} />

                {/* Card Details */}
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

                {/* Card Footer */}
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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },

  /* Header */
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

  /* Breadcrumb */
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  breadcrumbText: { fontSize: 12, color: "#64748B" },
  breadcrumbActive: { fontSize: 12, color: "#3B82F6", fontWeight: "600" },

  scroll: { flex: 1 },

  /* Page Head */
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

  /* Stats */
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

  /* Search */
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

  /* Filter Tabs */
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

  /* Client Cards */
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
  viewBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  viewBtnText: { fontSize: 13, fontWeight: "600", color: "#3B82F6" },

  /* Empty */
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: { fontSize: 13, color: "#94A3B8" },
});
