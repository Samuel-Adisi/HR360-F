import { Ionicons } from "@expo/vector-icons";
import {
  useInfiniteQuery,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { router } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Animated,
  Clipboard,
  FlatList,
  Image,
  Linking,
  Modal,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import api from "../../../../src/services/api";

const T = {
  bg: "#F8FAFC",
  card: "#FFFFFF",
  navy: "#0F172A",
  text: "#1E293B",
  textSub: "#475569",
  textMuted: "#94A3B8",
  border: "#E2E8F0",
  blue: "#0A66C2",
  blueSoft: "#EFF6FF",
  blueMid: "#DBEAFE",
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  red: "#DC2626",
  redSoft: "#FEF2F2",
};

const PALETTE = [
  { accent: "#0A66C2", soft: "#EFF6FF", text: "#1E40AF" },
  { accent: "#334155", soft: "#F1F5F9", text: "#1E293B" },
  { accent: "#0891B2", soft: "#ECFEFF", text: "#155E75" },
  { accent: "#16A34A", soft: "#DCFCE7", text: "#166534" },
  { accent: "#D97706", soft: "#FEF3C7", text: "#92400E" },
  { accent: "#7C3AED", soft: "#EDE9FE", text: "#5B21B6" },
];
const deptColor = (name = "") =>
  PALETTE[
    Math.abs([...name].reduce((a, c) => a + c.charCodeAt(0), 0)) %
      PALETTE.length
  ];

const getFullName = (emp) =>
  `${emp.first_name || ""} ${emp.last_name || ""}`.trim() ||
  emp.full_name ||
  "—";

// Only use avatar as absolute last resort
const getPhoto = (emp) => {
  const real =
    emp.photo || emp.profile_picture || emp.image || emp.avatar || emp.picture;
  if (real && real.startsWith("http")) return real;
  const name = getFullName(emp);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A66C2&color=fff&size=120`;
};

const copyTo = (v, l) => {
  Clipboard.setString(v);
  Alert.alert("Copied", `${l} copied.`);
};

const openEmail = (email) => {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ["Send Email", "Copy Email", "Cancel"], cancelButtonIndex: 2 },
      (i) => {
        if (i === 0) Linking.openURL(`mailto:${email}`);
        if (i === 1) copyTo(email, "Email");
      },
    );
  } else {
    Alert.alert("Email", email, [
      { text: "Send Email", onPress: () => Linking.openURL(`mailto:${email}`) },
      { text: "Copy", onPress: () => copyTo(email, "Email") },
      { text: "Cancel", style: "cancel" },
    ]);
  }
};

const openPhone = (phone) => {
  if (Platform.OS === "ios") {
    ActionSheetIOS.showActionSheetWithOptions(
      { options: ["Call", "Copy Number", "Cancel"], cancelButtonIndex: 2 },
      (i) => {
        if (i === 0) Linking.openURL(`tel:${phone}`);
        if (i === 1) copyTo(phone, "Phone");
      },
    );
  } else {
    Alert.alert("Phone", phone, [
      { text: "Call", onPress: () => Linking.openURL(`tel:${phone}`) },
      { text: "Copy Number", onPress: () => copyTo(phone, "Phone") },
      { text: "Cancel", style: "cancel" },
    ]);
  }
};

// ─── API FETCHERS ─────────────────────────────────────────────
const fetchEmployeePage = async ({
  pageParam = "/api/employees/",
  queryKey,
}) => {
  const [, search, deptFilter, attendTab] = queryKey;
  const params = {};
  if (search) params.search = search;
  if (deptFilter) params.department = deptFilter;
  if (attendTab !== "All")
    params.is_active = attendTab === "Active" ? true : undefined;

  const isNextUrl = pageParam !== "/api/employees/";
  const res = isNextUrl
    ? await api.get(pageParam)
    : await api.get("/api/employees/", { params });

  const data = res.data;
  return {
    results: Array.isArray(data) ? data : (data.results ?? []),
    next: data.next ?? null,
    count: data.count ?? 0,
  };
};

const fetchDepartments = async () => {
  const res = await api.get("/api/employees/department/");
  const data = res.data;
  return Array.isArray(data) ? data : (data.results ?? []);
};

const fetchStats = async () => {
  const res = await api.get("/api/employees/statistics/");
  // Log so you can see the exact shape Django returns
  console.log("📊 stats response:", JSON.stringify(res.data));
  return res.data;
};

// ─── ANIMATED RING ────────────────────────────────────────────
const RingChart = ({
  pct = 0,
  size = 58,
  stroke = 7,
  color = "#60A5FA",
  label,
  delay = 0,
}) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      duration: 950,
      delay,
      useNativeDriver: true,
    }).start();
  }, [pct]);
  const rotate = anim.interpolate({
    inputRange: [0, 1],
    outputRange: ["-270deg", `${pct * 3.6 - 90}deg`],
  });
  return (
    <View style={{ alignItems: "center", gap: 5 }}>
      <View
        style={{
          width: size,
          height: size,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderColor: "rgba(255,255,255,0.1)",
          }}
        />
        <Animated.View
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: stroke,
            borderTopColor: pct > 25 ? color : "transparent",
            borderRightColor: pct > 50 ? color : "transparent",
            borderBottomColor: pct > 75 ? color : "transparent",
            borderLeftColor: pct > 0 ? color : "transparent",
            transform: [{ rotate }],
          }}
        />
        <Text style={{ fontSize: 12, fontWeight: "800", color: "#fff" }}>
          {pct}%
        </Text>
      </View>
      {label && (
        <Text
          style={{
            fontSize: 10,
            color: "rgba(255,255,255,0.5)",
            fontWeight: "600",
          }}
        >
          {label}
        </Text>
      )}
    </View>
  );
};

// ─── STATS HERO ───────────────────────────────────────────────
const StatsHero = ({ stats, total }) => {
  // Handle every possible field name Django might return
  const active =
    stats?.active ?? stats?.active_employees ?? stats?.active_count ?? 0;
  const inactive =
    stats?.in_active ??
    stats?.inactive ??
    stats?.inactive_employees ??
    stats?.inactive_count ??
    total - active ??
    0;
  const pctA = total ? Math.round((active / total) * 100) : 0;
  const pctR = total ? Math.round(((total - inactive) / total) * 100) : 0;

  const METRICS = [
    {
      value: total,
      unit: "total",
      label: "Employees",
      trend: "+5.2%",
      up: true,
    },
    { value: active, unit: "emp", label: "Active", trend: "+2.1%", up: true },
    { value: inactive, unit: "emp", label: "Inactive", trend: "-1", up: false },
  ];

  return (
    <View style={sh.wrap}>
      <View style={sh.hero}>
        <View style={sh.blob1} />
        <View style={sh.blob2} />
        <View style={sh.inner}>
          <View style={{ flex: 1, gap: 5 }}>
            <Text style={sh.eyebrow}>WORKFORCE OVERVIEW</Text>
            <Text style={sh.heroNum}>{total ?? "—"}</Text>
            <View style={sh.trendBadge}>
              <Ionicons name="trending-up" size={11} color="#4ADE80" />
              <Text style={sh.trendTxt}>+5.2% vs last period</Text>
            </View>
            <Text style={sh.heroSub}>Total registered employees</Text>
          </View>
          <View style={{ alignItems: "center", gap: 10, paddingLeft: 12 }}>
            <RingChart
              pct={pctA}
              size={64}
              stroke={8}
              color="#60A5FA"
              label="Active"
              delay={100}
            />
            <RingChart
              pct={pctR}
              size={50}
              stroke={7}
              color="#4ADE80"
              label="On-roll"
              delay={300}
            />
          </View>
        </View>
      </View>
      <View style={sh.metricRow}>
        {METRICS.map((m) => (
          <View key={m.label} style={sh.metricCard}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
                marginBottom: 4,
              }}
            >
              <View
                style={[
                  sh.trendChip,
                  { backgroundColor: m.up ? T.greenSoft : T.redSoft },
                ]}
              >
                <Ionicons
                  name={m.up ? "arrow-up" : "arrow-down"}
                  size={9}
                  color={m.up ? T.green : T.red}
                />
                <Text
                  style={[sh.trendChipTxt, { color: m.up ? T.green : T.red }]}
                >
                  {m.trend}
                </Text>
              </View>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "baseline", gap: 2 }}
            >
              <Text style={sh.metricVal}>{m.value ?? "—"}</Text>
              <Text style={sh.metricUnit}>{m.unit}</Text>
            </View>
            <Text style={sh.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const sh = StyleSheet.create({
  wrap: { paddingHorizontal: 14, marginBottom: 14 },
  hero: {
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 20,
    marginBottom: 10,
    overflow: "hidden",
    minHeight: 130,
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  blob1: {
    position: "absolute",
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "#0A66C2",
    opacity: 0.12,
    top: -60,
    right: -40,
  },
  blob2: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#6366F1",
    opacity: 0.15,
    bottom: -30,
    left: 50,
  },
  inner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    color: "rgba(255,255,255,0.4)",
    letterSpacing: 1.4,
    marginBottom: 2,
  },
  heroNum: {
    fontSize: 46,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 50,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(74,222,128,0.15)",
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  trendTxt: { fontSize: 11, color: "#4ADE80", fontWeight: "700" },
  heroSub: { fontSize: 10, color: "rgba(255,255,255,0.35)", marginTop: 2 },
  metricRow: { flexDirection: "row", gap: 8 },
  metricCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
    shadowColor: "#94A3B8",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 2,
  },
  trendChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trendChipTxt: { fontSize: 9, fontWeight: "700" },
  metricVal: {
    fontSize: 22,
    fontWeight: "900",
    color: T.text,
    letterSpacing: -0.5,
  },
  metricUnit: { fontSize: 10, color: T.textMuted, fontWeight: "600" },
  metricLabel: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "600",
    marginTop: 1,
  },
});

// ─── DEPT FILTER ──────────────────────────────────────────────
const DeptStrip = ({ departments, selected, onSelect }) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={{
      gap: 7,
      paddingHorizontal: 14,
      marginBottom: 10,
      alignItems: "center",
    }}
  >
    <TouchableOpacity
      style={[ds.chip, !selected && ds.chipAll]}
      onPress={() => onSelect("")}
    >
      <Text
        style={[ds.chipTxt, !selected && { color: "#fff", fontWeight: "700" }]}
      >
        All Depts
      </Text>
    </TouchableOpacity>
    {departments.map((dept) => {
      const name = dept.name || String(dept);
      const key = dept.id ?? name;
      const active = selected === String(key);
      const dc = deptColor(name);
      return (
        <TouchableOpacity
          key={key}
          style={[
            ds.chip,
            active && { backgroundColor: dc.accent, borderColor: dc.accent },
          ]}
          onPress={() => onSelect(active ? "" : String(key))}
        >
          <View
            style={[ds.dot, { backgroundColor: active ? "#fff" : dc.accent }]}
          />
          <Text style={[ds.chipTxt, active && { color: "#fff" }]}>{name}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const ds = StyleSheet.create({
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.border,
  },
  chipAll: { backgroundColor: T.navy, borderColor: T.navy },
  chipTxt: { fontSize: 11, fontWeight: "600", color: T.textSub },
  dot: { width: 5, height: 5, borderRadius: 3 },
});

// ─── EMPLOYEE ROW — TikTok style ──────────────────────────────
const EmployeeRow = ({ emp, onPress }) => {
  const name = getFullName(emp);
  const deptName =
    emp.department_name || emp.department?.name || String(emp.department || "");
  const isActive = emp.is_active ?? emp.active ?? emp.status === "Active";
  const subtitle = [emp.position || emp.designation, deptName]
    .filter(Boolean)
    .join(" · ");
  const [imgErr, setImgErr] = useState(false);

  const photoUri =
    !imgErr && (emp.photo || emp.profile_picture || emp.image || emp.avatar)
      ? emp.photo || emp.profile_picture || emp.image || emp.avatar
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0A66C2&color=fff&size=120`;

  return (
    <TouchableOpacity
      style={er.row}
      onPress={() => onPress(emp)}
      activeOpacity={0.7}
    >
      <View
        style={[er.dot, { backgroundColor: isActive ? T.green : "#CBD5E1" }]}
      />
      <View style={er.textBlock}>
        <Text style={er.name} numberOfLines={1}>
          {name}
        </Text>
        {subtitle ? (
          <Text style={er.sub} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      <Image
        source={{ uri: photoUri }}
        style={er.thumb}
        onError={() => setImgErr(true)}
      />
    </TouchableOpacity>
  );
};

const er = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: T.border,
    backgroundColor: T.card,
  },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 12, flexShrink: 0 },
  textBlock: { flex: 1, marginRight: 12 },
  name: { fontSize: 14, fontWeight: "700", color: T.text, marginBottom: 2 },
  sub: { fontSize: 12, color: T.textMuted },
  thumb: {
    width: 52,
    height: 52,
    borderRadius: 6,
    backgroundColor: T.border,
    flexShrink: 0,
  },
});

// ─── EMPLOYEE MODAL ───────────────────────────────────────────
const EmployeeModal = ({ employee: emp, onClose, onDelete }) => {
  if (!emp) return null;
  const name = getFullName(emp);
  const deptName =
    emp.department_name || emp.department?.name || String(emp.department || "");
  const dc = deptColor(deptName);
  const isActive = emp.is_active ?? emp.active ?? emp.status === "Active";

  const confirmDelete = () =>
    Alert.alert("Delete Employee", `Remove ${name}? This cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          onDelete?.(emp.id);
          onClose();
        },
      },
    ]);

  const rows = [
    {
      icon: "id-card-outline",
      label: "Employee ID",
      value: emp.employee_id || String(emp.id),
      type: "plain",
    },
    {
      icon: "business-outline",
      label: "Department",
      value: deptName || "—",
      type: "plain",
    },
    {
      icon: "briefcase-outline",
      label: "Position",
      value: emp.position || "—",
      type: "plain",
    },
    {
      icon: "layers-outline",
      label: "Job Type",
      value: (emp.employment_type || "—").replace(/_/g, " "),
      type: "plain",
    },
    {
      icon: "mail-outline",
      label: "Email",
      value: emp.email || "—",
      type: "email",
    },
    {
      icon: "call-outline",
      label: "Phone",
      value: emp.phone || "—",
      type: "phone",
    },
    {
      icon: "calendar-outline",
      label: "Hire Date",
      value: emp.hire_date || emp.date_joined || "—",
      type: "plain",
    },
  ];

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={mo.overlay}>
        <View style={mo.sheet}>
          <View style={mo.handle} />
          <View style={mo.header}>
            <Text style={mo.title}>Employee Details</Text>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <TouchableOpacity onPress={confirmDelete} style={mo.delBtn}>
                <Ionicons name="trash-outline" size={17} color={T.red} />
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={mo.closeBtn}>
                <Ionicons name="close" size={18} color={T.textSub} />
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={[mo.heroCard, { backgroundColor: dc.soft }]}>
              <View style={mo.photoWrap}>
                <Image source={{ uri: getPhoto(emp) }} style={mo.photo} />
                <View
                  style={[
                    mo.onlineDot,
                    { backgroundColor: isActive ? T.green : T.red },
                  ]}
                />
              </View>
              <Text style={mo.heroName}>{name}</Text>
              <Text style={[mo.heroRole, { color: dc.text }]}>
                {emp.position || "—"}
              </Text>
              <View style={mo.badgeRow}>
                <View
                  style={[
                    mo.badge,
                    { backgroundColor: isActive ? T.greenSoft : T.redSoft },
                  ]}
                >
                  <View
                    style={[
                      mo.badgeDot,
                      { backgroundColor: isActive ? T.green : T.red },
                    ]}
                  />
                  <Text
                    style={[
                      mo.badgeTxt,
                      { color: isActive ? "#166534" : "#991B1B" },
                    ]}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </Text>
                </View>
                {emp.employment_type && (
                  <View style={[mo.badge, { backgroundColor: T.blueSoft }]}>
                    <Text style={[mo.badgeTxt, { color: T.blue }]}>
                      {emp.employment_type.replace(/_/g, " ")}
                    </Text>
                  </View>
                )}
              </View>
            </View>
            <View style={{ paddingHorizontal: 20 }}>
              {rows.map(({ icon, label, value, type }) => {
                const ia = type === "email" || type === "phone";
                return (
                  <TouchableOpacity
                    key={label}
                    style={mo.infoRow}
                    onPress={
                      ia
                        ? () =>
                            type === "email"
                              ? openEmail(value)
                              : openPhone(value)
                        : undefined
                    }
                    onLongPress={ia ? () => copyTo(value, label) : undefined}
                    activeOpacity={ia ? 0.6 : 1}
                    delayLongPress={400}
                  >
                    <View
                      style={[
                        mo.infoIcon,
                        type === "email" && { backgroundColor: T.blueSoft },
                        type === "phone" && { backgroundColor: T.greenSoft },
                      ]}
                    >
                      <Ionicons
                        name={icon}
                        size={15}
                        color={
                          type === "email"
                            ? T.blue
                            : type === "phone"
                              ? T.green
                              : T.textMuted
                        }
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={mo.infoLabel}>{label}</Text>
                      <Text
                        style={[
                          mo.infoValue,
                          type === "email" && { color: T.blue },
                          type === "phone" && { color: T.green },
                        ]}
                      >
                        {value}
                      </Text>
                    </View>
                    {ia && (
                      <Ionicons
                        name={
                          type === "email" ? "open-outline" : "call-outline"
                        }
                        size={13}
                        color="#CBD5E1"
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{ height: 8 }} />
          </ScrollView>
          <View style={mo.footer}>
            <TouchableOpacity style={mo.editBtn} onPress={onClose}>
              <Ionicons name="create-outline" size={16} color="#fff" />
              <Text style={mo.editBtnTxt}>Edit Employee</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={mo.chatBtn}
              onPress={() => Alert.alert("Chat", `Opening chat with ${name}…`)}
            >
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={16}
                color="#fff"
              />
              <Text style={mo.chatBtnTxt}>Chat</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const mo = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "92%",
    paddingBottom: 24,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  title: { fontSize: 17, fontWeight: "700", color: T.text },
  delBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: T.redSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  heroCard: {
    margin: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    gap: 6,
  },
  photoWrap: { position: "relative", marginBottom: 4 },
  photo: {
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 3,
    borderColor: "#fff",
  },
  onlineDot: {
    position: "absolute",
    bottom: 3,
    right: 3,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2.5,
    borderColor: "#fff",
  },
  heroName: { fontSize: 18, fontWeight: "800", color: T.text },
  heroRole: { fontSize: 13, fontWeight: "500" },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 4,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  badgeDot: { width: 4, height: 4, borderRadius: 2 },
  badgeTxt: { fontSize: 11, fontWeight: "700" },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F8FAFC",
  },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 11,
    color: T.textMuted,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoValue: { fontSize: 13, color: T.text, fontWeight: "600" },
  footer: {
    paddingHorizontal: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    flexDirection: "row",
    gap: 10,
  },
  editBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: T.blue,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  editBtnTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
  chatBtn: {
    flex: 0.52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: T.navy,
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  chatBtnTxt: { fontSize: 15, fontWeight: "700", color: "#fff" },
});

// ─── MAIN SCREEN ──────────────────────────────────────────────
const ATTEND_TABS = ["All", "Active", "Inactive"];

export default function EmployeeScreen() {
  const queryClient = useQueryClient();
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [attendTab, setAttendTab] = useState("All");
  const [sfocus, setSfocus] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const searchTimer = useRef(null);

  useEffect(() => {
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => setSearch(searchInput), 350);
    return () => clearTimeout(searchTimer.current);
  }, [searchInput]);

  const {
    data: empPages,
    isLoading: empLoading,
    isFetching: empFetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ["employees", search, deptFilter, attendTab],
    queryFn: fetchEmployeePage,
    getNextPageParam: (lastPage) => lastPage.next ?? undefined,
    staleTime: 2 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    keepPreviousData: true,
  });

  const { data: departments = [] } = useQuery({
    queryKey: ["departments"],
    queryFn: fetchDepartments,
    staleTime: 10 * 60 * 1000,
    cacheTime: 30 * 60 * 1000,
  });

  const { data: stats } = useQuery({
    queryKey: ["employee-stats"],
    queryFn: fetchStats,
    staleTime: 2 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const employees = empPages?.pages.flatMap((p) => p.results) ?? [];
  const total =
    stats?.total_employees ??
    stats?.total ??
    stats?.count ??
    empPages?.pages[0]?.count ??
    0;

  // ONE spinner condition: loading with no data yet
  const isLoading = empLoading && employees.length === 0;
  // Refining: fetching but old data visible — only shows small indicator in search bar
  const isRefining = empFetching && !isFetchingNextPage && employees.length > 0;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["employees"] }),
      queryClient.invalidateQueries({ queryKey: ["employee-stats"] }),
    ]);
    setRefreshing(false);
  }, [queryClient]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await api.delete(`/api/employees/${id}/`);
        queryClient.setQueriesData({ queryKey: ["employees"] }, (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              results: page.results.filter((e) => e.id !== id),
            })),
          };
        });
        queryClient.invalidateQueries({ queryKey: ["employee-stats"] });
      } catch {
        Alert.alert("Error", "Could not delete employee.");
      }
    },
    [queryClient],
  );

  const renderItem = useCallback(
    ({ item }) => <EmployeeRow emp={item} onPress={setSelectedEmp} />,
    [],
  );
  const keyExtractor = useCallback((item) => String(item.id), []);
  const hasFilters = Boolean(search || deptFilter || attendTab !== "All");

  const ListHeader = (
    <>
      <View style={s.titleRow}>
        <View>
          <Text style={s.pageTitle}>Employees</Text>
          <Text style={s.pageSub}>{total} total members</Text>
        </View>
        <TouchableOpacity
          style={s.addBtn}
          onPress={() => router.push("./add-employee")}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={s.addBtnTxt}>Add</Text>
        </TouchableOpacity>
      </View>

      <StatsHero stats={stats} total={total} />

      {/* Search — no icon */}
      <View style={[s.searchWrap, sfocus && s.searchFocus]}>
        <TextInput
          style={s.searchInput}
          placeholder="Search employees…"
          placeholderTextColor={T.textMuted}
          value={searchInput}
          onChangeText={setSearchInput}
          onFocus={() => setSfocus(true)}
          onBlur={() => setSfocus(false)}
          autoCorrect={false}
          returnKeyType="search"
        />
        {/* Small spinner inside search bar while refining — NOT a second full spinner */}
        {isRefining ? (
          <ActivityIndicator size="small" color={T.blue} />
        ) : searchInput.length > 0 ? (
          <TouchableOpacity
            onPress={() => {
              setSearchInput("");
              setSearch("");
            }}
          >
            <Ionicons name="close-circle" size={16} color={T.textMuted} />
          </TouchableOpacity>
        ) : null}
      </View>

      {departments.length > 0 && (
        <DeptStrip
          departments={departments}
          selected={deptFilter}
          onSelect={setDeptFilter}
        />
      )}

      <View style={s.filterRow}>
        {ATTEND_TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[s.tab, attendTab === tab && s.tabActive]}
            onPress={() => setAttendTab(tab)}
          >
            <Text style={[s.tabTxt, attendTab === tab && s.tabTxtActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={s.exportBtn}>
          <Ionicons name="download-outline" size={14} color={T.textSub} />
          <Text style={s.exportTxt}>Export</Text>
        </TouchableOpacity>
      </View>

      {hasFilters && employees.length > 0 && (
        <Text style={s.resultsLabel}>
          {employees.length} result{employees.length !== 1 ? "s" : ""}
        </Text>
      )}
    </>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor={T.bg} />

      <FlatList
        data={employees}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={s.listContent}
        ListHeaderComponent={ListHeader}
        // ONE spinner — only when truly no data yet, sits below filters
        ListEmptyComponent={
          isLoading ? (
            <View style={s.listSpinner}>
              <ActivityIndicator size="large" color={T.blue} />
              <Text style={s.listSpinnerTxt}>Loading employees…</Text>
            </View>
          ) : !isRefining ? (
            <View style={s.empty}>
              <Ionicons name="people-outline" size={48} color="#CBD5E1" />
              <Text style={s.emptyTxt}>No employees found</Text>
              <Text style={s.emptySub}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={s.moreSpinner}>
              <ActivityIndicator size="small" color={T.blue} />
            </View>
          ) : null
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) fetchNextPage();
        }}
        onEndReachedThreshold={0.35}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={T.blue}
            colors={[T.blue]}
          />
        }
      />

      <EmployeeModal
        employee={selectedEmp}
        onClose={() => setSelectedEmp(null)}
        onDelete={handleDelete}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  listContent: { paddingBottom: 40 },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 12, color: T.textMuted, marginTop: 2 },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: T.blue,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    shadowColor: T.blue,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    marginHorizontal: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  searchFocus: { borderColor: T.blue },
  searchInput: { flex: 1, fontSize: 13.5, color: T.text },
  filterRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
    marginBottom: 6,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
  },
  tabActive: { backgroundColor: T.blue, borderColor: T.blue },
  tabTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  tabTxtActive: { color: "#fff" },
  exportBtn: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: T.border,
    backgroundColor: "#fff",
  },
  exportTxt: { fontSize: 12, fontWeight: "600", color: T.textSub },
  resultsLabel: {
    fontSize: 12,
    color: T.textMuted,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  listSpinner: { paddingVertical: 60, alignItems: "center", gap: 12 },
  listSpinnerTxt: { fontSize: 13, color: T.textMuted, fontWeight: "600" },
  moreSpinner: { paddingVertical: 20, alignItems: "center" },
  empty: { padding: 48, alignItems: "center", gap: 8 },
  emptyTxt: { fontSize: 14, color: T.textMuted, fontWeight: "700" },
  emptySub: { fontSize: 12, color: "#CBD5E1", textAlign: "center" },
});
