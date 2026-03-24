import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Dimensions,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - 32;

const C = {
  bg: "#F5F6FA",
  card: "#FFFFFF",
  card2: "#FAFAFA",
  accent: "#6C63FF",
  accentSoft: "#EEF0FF",
  orange: "#FF6B35",
  orangeSoft: "#FFF0EB",
  green: "#22C55E",
  greenSoft: "#EDFBF3",
  red: "#EF4444",
  redSoft: "#FEF2F2",
  yellow: "#F59E0B",
  yellowSoft: "#FFFBEB",
  purple: "#8B5CF6",
  purpleSoft: "#F3F0FF",
  teal: "#14B8A6",
  tealSoft: "#F0FDFA",
  text: "#1E293B",
  textMuted: "#94A3B8",
  textSub: "#64748B",
  border: "#E8ECF4",
};

const OVERVIEW_STATS = [
  {
    label: "Total Employees",
    value: "2,847",
    change: "+12%",
    up: true,
    icon: "people",
    color: "#6C63FF",
    soft: "#EEF0FF",
  },
  {
    label: "Present Today",
    value: "2,458",
    change: "+3.2%",
    up: true,
    icon: "checkmark-circle",
    color: "#22C55E",
    soft: "#EDFBF3",
  },
  {
    label: "Absent Today",
    value: "124",
    change: "+1.4%",
    up: false,
    icon: "close-circle",
    color: "#EF4444",
    soft: "#FEF2F2",
  },
  {
    label: "Late Arrivals",
    value: "89",
    change: "+12%",
    up: false,
    icon: "time",
    color: "#F59E0B",
    soft: "#FFFBEB",
  },
  {
    label: "Attendance Rate",
    value: "86.3%",
    change: "+2.5%",
    up: true,
    icon: "stats-chart",
    color: "#8B5CF6",
    soft: "#F3F0FF",
  },
  {
    label: "Pending Regular.",
    value: "42",
    change: "-7%",
    up: true,
    icon: "document-text",
    color: "#14B8A6",
    soft: "#F0FDFA",
  },
];

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const TREND_DATA = [42, 22, 50, 28, 58, 90, 38, 62, 78, 35, 20, 45];

const ATTENDANCE_STATUS = [
  {
    label: "Present",
    count: 2458,
    color: "#22C55E",
    pct: 0.72,
    icon: "checkmark-circle",
  },
  {
    label: "Work From Home",
    count: 187,
    color: "#6C63FF",
    pct: 0.12,
    icon: "home",
  },
  { label: "Late", count: 89, color: "#F59E0B", pct: 0.08, icon: "time" },
  {
    label: "On Leave",
    count: 78,
    color: "#FF6B35",
    pct: 0.06,
    icon: "airplane",
  },
  {
    label: "Absent",
    count: 124,
    color: "#EF4444",
    pct: 0.02,
    icon: "close-circle",
  },
];

const LATE_ARRIVALS = [
  {
    name: "Michael Johnson",
    role: "Administration Head",
    time: "09:45 AM",
    bars: 5,
  },
  {
    name: "Emily Davis",
    role: "Frontend Developer",
    time: "09:30 AM",
    bars: 4,
  },
  {
    name: "Robert Martinez",
    role: "Finance Manager",
    time: "09:25 AM",
    bars: 4,
  },
  { name: "Megan Walker", role: "SEO Analyst", time: "09:10 AM", bars: 3 },
  { name: "James Lee", role: "Product Manager", time: "09:05 AM", bars: 3 },
];

const AVATAR_COLORS = [
  "#6C63FF",
  "#FF6B35",
  "#22C55E",
  "#8B5CF6",
  "#F59E0B",
  "#EF4444",
];

const getInitials = (name) =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function StatCard({ stat }) {
  return (
    <View style={styles.statCard}>
      <View style={[styles.statIconBox, { backgroundColor: stat.soft }]}>
        <Ionicons name={stat.icon} size={24} color={stat.color} />
      </View>
      <Text style={styles.statLabel}>{stat.label}</Text>
      <Text style={styles.statValue}>{stat.value}</Text>
      <View style={styles.changePillRow}>
        <View
          style={[
            styles.changePill,
            { backgroundColor: stat.up ? "#EDFBF3" : "#FEF2F2" },
          ]}
        >
          <Ionicons
            name={stat.up ? "arrow-up" : "arrow-down"}
            size={9}
            color={stat.up ? "#22C55E" : "#EF4444"}
          />
          <Text
            style={[
              styles.changePillText,
              { color: stat.up ? "#22C55E" : "#EF4444" },
            ]}
          >
            {stat.change}
          </Text>
        </View>
        <Text style={styles.vsText}>vs yesterday</Text>
      </View>
    </View>
  );
}

function SectionHeader({ title, sub }) {
  return (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {sub && (
        <View style={styles.sectionChip}>
          <Ionicons name="calendar-outline" size={12} color="#94A3B8" />
          <Text style={styles.sectionChipTxt}>{sub}</Text>
        </View>
      )}
    </View>
  );
}

function MiniAvatarRow({ labels }) {
  return (
    <View style={{ flexDirection: "row" }}>
      {labels.map((s, i) => (
        <View
          key={i}
          style={[
            styles.miniAvatar,
            {
              backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
              marginLeft: i > 0 ? -8 : 0,
            },
          ]}
        >
          <Text style={styles.miniAvatarText}>{s}</Text>
        </View>
      ))}
    </View>
  );
}

function BarStripes({ count, max = 6 }) {
  return (
    <View style={{ flexDirection: "row", gap: 3 }}>
      {Array.from({ length: max }).map((_, i) => (
        <View
          key={i}
          style={{
            width: 5,
            height: 22,
            borderRadius: 3,
            backgroundColor: i < count ? "#FF6B35" : "#E8ECF4",
          }}
        />
      ))}
    </View>
  );
}

export default function AttendanceDashboard() {
  const [trendPeriod, setTrendPeriod] = useState("1Y");

  const baseChartCfg = {
    backgroundColor: "#FFFFFF",
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 0,
    color: (o = 1) => `rgba(108,99,255,${o})`,
    labelColor: () => "#94A3B8",
    propsForBackgroundLines: { stroke: "#E8ECF4", strokeDasharray: "" },
  };

  const officeRemoteData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    datasets: [
      {
        data: [220, 250, 310, 270, 340, 290],
        color: (o = 1) => `rgba(255,107,53,${o})`,
        strokeWidth: 2.5,
      },
      {
        data: [80, 120, 170, 140, 200, 220],
        color: (o = 1) => `rgba(108,99,255,${o})`,
        strokeWidth: 2.5,
      },
    ],
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F5F6FA" }}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F6FA" />

      {/* Top Nav */}
      <View style={styles.topNav}>
        <View>
          <Text style={styles.breadcrumb}>Dashboard › Attendance</Text>
          <Text style={styles.pageTitle}>Attendance Dashboard</Text>
        </View>
        <TouchableOpacity style={styles.applyBtn}>
          <Ionicons name="add-circle" size={17} color="#fff" />
          <Text style={styles.applyBtnTxt}>Apply Leave</Text>
        </TouchableOpacity>
      </View>

      {/* Info Strip */}
      <View style={styles.infoStrip}>
        <View style={styles.infoStripItem}>
          <MiniAvatarRow labels={["EF", "RG", "TH"]} />
          <View
            style={{
              width: 7,
              height: 7,
              borderRadius: 4,
              backgroundColor: "#EF4444",
            }}
          />
          <Text style={styles.infoStripTxt}>06 Total Leaves</Text>
        </View>
        <View style={styles.infoStripItem}>
          <Ionicons name="calendar-outline" size={13} color="#64748B" />
          <Text style={styles.infoStripTxt}>Mar 2026</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Overview Statistics */}
        <SectionHeader title="Overview Statistics" sub="Today" />
        <View style={styles.statsGrid}>
          {OVERVIEW_STATS.map((s, i) => (
            <StatCard key={i} stat={s} />
          ))}
        </View>

        {/* Attendance Trends */}
        <SectionHeader title="Attendance Trends" />
        <View style={styles.card}>
          <View style={styles.periodRow}>
            {["1D", "7D", "1M", "1Y"].map((p) => (
              <TouchableOpacity
                key={p}
                onPress={() => setTrendPeriod(p)}
                style={[
                  styles.periodTab,
                  trendPeriod === p && { backgroundColor: "#6C63FF" },
                ]}
              >
                <Text
                  style={[
                    styles.periodTabTxt,
                    trendPeriod === p && { color: "#fff" },
                  ]}
                >
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <BarChart
            data={{ labels: MONTHS, datasets: [{ data: TREND_DATA }] }}
            width={CARD_WIDTH - 28}
            height={180}
            chartConfig={baseChartCfg}
            fromZero
            withInnerLines
            showValuesOnTopOfBars={false}
            yAxisSuffix="%"
            style={{ borderRadius: 12, marginTop: 4 }}
          />
        </View>

        {/* Attendance Status */}
        <SectionHeader title="Attendance Status" />
        <View style={styles.card}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                backgroundColor: "#EEF0FF",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Ionicons name="pie-chart" size={20} color="#6C63FF" />
            </View>
            <View style={{ marginLeft: 12 }}>
              <Text style={{ fontSize: 11, color: "#94A3B8", marginBottom: 2 }}>
                Total Working Days
              </Text>
              <Text
                style={{ fontSize: 28, fontWeight: "900", color: "#1E293B" }}
              >
                300
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              height: 12,
              borderRadius: 6,
              overflow: "hidden",
              backgroundColor: "#E8ECF4",
            }}
          >
            {ATTENDANCE_STATUS.map((s, i) => (
              <View key={i} style={{ flex: s.pct, backgroundColor: s.color }} />
            ))}
          </View>
          <View style={{ marginTop: 14, gap: 10 }}>
            {ATTENDANCE_STATUS.map((s, i) => (
              <View
                key={i}
                style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
              >
                <View
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 10,
                    backgroundColor: s.color + "22",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Ionicons name={s.icon} size={14} color={s.color} />
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: "#64748B",
                    flex: 1,
                    fontWeight: "600",
                  }}
                >
                  {s.label}
                </Text>
                <View
                  style={{
                    width: 70,
                    height: 8,
                    backgroundColor: "#F5F6FA",
                    borderRadius: 4,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      width: `${s.pct * 100}%`,
                      height: "100%",
                      backgroundColor: s.color,
                      borderRadius: 4,
                    }}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 13,
                    color: "#1E293B",
                    fontWeight: "800",
                    width: 38,
                    textAlign: "right",
                  }}
                >
                  {s.count}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Office vs Remote */}
        <SectionHeader title="Office vs Remote" sub="Weekly" />
        <View style={styles.card}>
          <View style={{ flexDirection: "row", gap: 16, marginBottom: 4 }}>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#FF6B35",
                }}
              />
              <Text
                style={{ fontSize: 12, color: "#64748B", fontWeight: "600" }}
              >
                Office
              </Text>
            </View>
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 6 }}
            >
              <View
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: "#6C63FF",
                }}
              />
              <Text
                style={{ fontSize: 12, color: "#64748B", fontWeight: "600" }}
              >
                Remote
              </Text>
            </View>
          </View>
          <LineChart
            data={officeRemoteData}
            width={CARD_WIDTH - 28}
            height={170}
            chartConfig={{
              ...baseChartCfg,
              propsForDots: { r: "5", strokeWidth: "2", stroke: "#fff" },
            }}
            bezier
            withDots
            withInnerLines={false}
            withOuterLines={false}
            withLegend={false}
            style={{ borderRadius: 12, marginTop: 8 }}
          />
        </View>

        {/* Attendance Summary */}
        <SectionHeader title="Attendance Summary" sub="Today" />
        <View style={styles.card}>
          <Text style={{ fontSize: 12, color: "#94A3B8", marginBottom: 8 }}>
            Avg Working Hours
          </Text>
          <View
            style={{
              height: 10,
              backgroundColor: "#F5F6FA",
              borderRadius: 5,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                width: "82%",
                height: "100%",
                backgroundColor: "#6C63FF",
                borderRadius: 5,
              }}
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 3,
              backgroundColor: "#FEF2F2",
              borderRadius: 8,
              paddingHorizontal: 8,
              paddingVertical: 5,
              alignSelf: "flex-start",
              marginTop: 10,
              marginBottom: 18,
            }}
          >
            <Ionicons name="arrow-down" size={10} color="#EF4444" />
            <Text style={{ fontSize: 11, color: "#EF4444", fontWeight: "700" }}>
              3.2% Compared to yesterday
            </Text>
          </View>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            {[
              {
                value: "2,458",
                label: "Check-in\nCount",
                icon: "log-in",
                color: "#22C55E",
                soft: "#EDFBF3",
              },
              {
                value: "2,201",
                label: "Check-out\nCount",
                icon: "log-out",
                color: "#FF6B35",
                soft: "#FFF0EB",
              },
              {
                value: "9:12 AM",
                label: "Avg Check-in\nTime",
                icon: "time",
                color: "#6C63FF",
                soft: "#EEF0FF",
              },
            ].map((item, i) => (
              <View key={i} style={{ alignItems: "center", flex: 1 }}>
                <View
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    backgroundColor: item.soft,
                    justifyContent: "center",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Ionicons name={item.icon} size={18} color={item.color} />
                </View>
                <Text
                  style={{ fontSize: 14, fontWeight: "800", color: "#1E293B" }}
                >
                  {item.value}
                </Text>
                <Text
                  style={{
                    fontSize: 10,
                    color: "#94A3B8",
                    textAlign: "center",
                    marginTop: 3,
                    lineHeight: 14,
                  }}
                >
                  {item.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Alerts */}
        <SectionHeader title="Alerts & Violations" />
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
          {[
            {
              num: "22",
              label: "Frequent\nLate Arrivals",
              icon: "time",
              color: "#F59E0B",
              soft: "#FFFBEB",
              badge: "Warnings",
            },
            {
              num: "09",
              label: "Missing\nPunches",
              icon: "finger-print",
              color: "#EF4444",
              soft: "#FEF2F2",
              badge: "Critical",
            },
            {
              num: "15",
              label: "Below\n75% Rate",
              icon: "alert-circle",
              color: "#8B5CF6",
              soft: "#F3F0FF",
              badge: "Review",
            },
          ].map((item, i) => (
            <View
              key={i}
              style={{
                flex: 1,
                borderRadius: 16,
                padding: 12,
                alignItems: "center",
                backgroundColor: item.soft,
                borderWidth: 1,
                borderColor: item.color + "40",
              }}
            >
              <View
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  backgroundColor: item.color,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Ionicons name={item.icon} size={18} color="#fff" />
              </View>
              <Text
                style={{ fontSize: 24, fontWeight: "900", color: "#1E293B" }}
              >
                {item.num}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#64748B",
                  textAlign: "center",
                  fontWeight: "600",
                  marginBottom: 8,
                  lineHeight: 14,
                }}
              >
                {item.label}
              </Text>
              <View
                style={{
                  borderRadius: 8,
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  backgroundColor: item.color,
                }}
              >
                <Text style={{ fontSize: 9, color: "#fff", fontWeight: "800" }}>
                  {item.badge}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Late Arrivals */}
        <SectionHeader title="Late Arrivals & Alerts" sub="Today" />
        <View style={styles.card}>
          {LATE_ARRIVALS.map((emp, i) => (
            <View
              key={i}
              style={[
                {
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  gap: 12,
                },
                i < LATE_ARRIVALS.length - 1 && {
                  borderBottomWidth: 1,
                  borderBottomColor: "#E8ECF4",
                },
              ]}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ fontSize: 14, fontWeight: "800", color: "#fff" }}
                >
                  {getInitials(emp.name)}
                </Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{ fontSize: 13, fontWeight: "700", color: "#1E293B" }}
                >
                  {emp.name}
                </Text>
                <Text style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>
                  {emp.role}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  <Ionicons name="time-outline" size={12} color="#94A3B8" />
                  <Text style={{ fontSize: 11, color: "#94A3B8" }}>
                    Check-in:{" "}
                    <Text style={{ color: "#FF6B35", fontWeight: "700" }}>
                      {emp.time}
                    </Text>
                  </Text>
                </View>
              </View>
              <BarStripes count={emp.bars} />
            </View>
          ))}
        </View>

        <View style={{ height: 32 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  topNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF4",
  },
  breadcrumb: { fontSize: 11, color: "#94A3B8", marginBottom: 3 },
  pageTitle: { fontSize: 20, fontWeight: "800", color: "#1E293B" },
  applyBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#FF6B35",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  applyBtnTxt: { fontSize: 13, color: "#fff", fontWeight: "700" },
  infoStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8ECF4",
  },
  infoStripItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  infoStripTxt: { fontSize: 12, color: "#64748B", fontWeight: "600" },
  miniAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  miniAvatarText: { fontSize: 8, color: "#fff", fontWeight: "800" },
  scroll: { padding: 16 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    marginTop: 4,
  },
  sectionTitle: { fontSize: 16, fontWeight: "800", color: "#1E293B" },
  sectionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: "#E8ECF4",
  },
  sectionChipTxt: { fontSize: 11, color: "#94A3B8" },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    width: (SCREEN_WIDTH - 42) / 2,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    shadowColor: "#00000010",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  statLabel: { fontSize: 11, color: "#94A3B8", marginBottom: 4 },
  statValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#1E293B",
    marginBottom: 8,
  },
  changePillRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  changePillText: { fontSize: 11, fontWeight: "700" },
  vsText: { fontSize: 10, color: "#94A3B8" },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#E8ECF4",
    shadowColor: "#00000008",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  periodRow: { flexDirection: "row", gap: 6, marginBottom: 4 },
  periodTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: "#F5F6FA",
    borderWidth: 1,
    borderColor: "#E8ECF4",
  },
  periodTabTxt: { fontSize: 11, color: "#64748B", fontWeight: "700" },
});
