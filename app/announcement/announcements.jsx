import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
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

// ─────────────────────────────────────────────────────────────
//  THEME
// ─────────────────────────────────────────────────────────────
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
  green: "#16A34A",
  greenSoft: "#DCFCE7",
  red: "#DC2626",
  redSoft: "#FEF2F2",
  amber: "#D97706",
  amberSoft: "#FEF3C7",
  purple: "#7C3AED",
  purpleSoft: "#EDE9FE",
};

// ─────────────────────────────────────────────────────────────
//  MOCK DATA
// ─────────────────────────────────────────────────────────────
const ANNOUNCEMENTS = [
  {
    id: "ANN-001",
    title: "Q1 Company All-Hands Meeting",
    message:
      "We will be hosting our Q1 All-Hands meeting on March 28th at 10:00 AM in the Main Conference Hall. All employees are expected to attend. The agenda includes a review of Q1 performance, upcoming goals, and an open Q&A session with leadership. Please confirm your attendance by March 24th via the HR portal.",
    priority: "urgent",
    audience: "all",
    audienceLabel: "All Employees",
    author: "Doglas Martini",
    authorRole: "HR Manager",
    authorInitials: "DM",
    department: null,
    date: "Mar 20, 2026",
    time: "09:14 AM",
    status: "published",
    readCount: 47,
    totalAudience: 57,
    attachments: [{ name: "Q1_Meeting_Agenda.pdf", size: "1.2 MB" }],
    pinned: true,
  },
  {
    id: "ANN-002",
    title: "Updated Remote Work Policy",
    message:
      "Effective April 1st, 2026, the company will be rolling out an updated remote work policy. Employees will be permitted to work remotely up to 3 days per week, subject to manager approval. The full policy document is attached. Please review and acknowledge receipt by March 31st.",
    priority: "medium",
    audience: "all",
    audienceLabel: "All Employees",
    author: "Doglas Martini",
    authorRole: "HR Manager",
    authorInitials: "DM",
    department: null,
    date: "Mar 18, 2026",
    time: "02:30 PM",
    status: "published",
    readCount: 39,
    totalAudience: 57,
    attachments: [
      { name: "Remote_Work_Policy_2026.docx", size: "890 KB" },
      { name: "Manager_Approval_Form.pdf", size: "320 KB" },
    ],
    pinned: false,
  },
  {
    id: "ANN-003",
    title: "Engineering Sprint Review — March",
    message:
      "The Engineering team's March sprint review is scheduled for March 27th at 3:00 PM. All Engineering staff are required to prepare a brief summary of completed tasks and blockers. Attendance is mandatory. The session will also be recorded for stakeholders.",
    priority: "normal",
    audience: "dept",
    audienceLabel: "Engineering",
    author: "Brian Villalobos",
    authorRole: "Engineering Director",
    authorInitials: "BV",
    department: "Engineering",
    date: "Mar 17, 2026",
    time: "11:00 AM",
    status: "published",
    readCount: 11,
    totalAudience: 12,
    attachments: [],
    pinned: false,
  },
  {
    id: "ANN-004",
    title: "Office Closure — Public Holiday",
    message:
      "Please be informed that the office will be closed on March 25th, 2026 in observance of the public holiday. All employees are not required to report to work. Emergency contacts remain active. Enjoy the long weekend!",
    priority: "normal",
    audience: "all",
    audienceLabel: "All Employees",
    author: "Anthony Lewis",
    authorRole: "Finance Manager",
    authorInitials: "AL",
    department: null,
    date: "Mar 15, 2026",
    time: "08:45 AM",
    status: "published",
    readCount: 57,
    totalAudience: 57,
    attachments: [],
    pinned: false,
  },
  {
    id: "ANN-005",
    title: "Payroll Processing Delay — March",
    message:
      "Due to the upcoming public holiday on March 25th, payroll processing for March will be moved to March 26th instead of March 28th. All salary payments will reflect in accounts by end of business on March 26th. Apologies for any inconvenience caused.",
    priority: "medium",
    audience: "all",
    audienceLabel: "All Employees",
    author: "Anthony Lewis",
    authorRole: "Finance Manager",
    authorInitials: "AL",
    department: null,
    date: "Mar 14, 2026",
    time: "10:20 AM",
    status: "published",
    readCount: 52,
    totalAudience: 57,
    attachments: [],
    pinned: false,
  },
  {
    id: "ANN-006",
    title: "April Salary Review Cycle",
    message:
      "The annual salary review process will commence in April. Line managers are requested to submit performance evaluations for their direct reports by April 10th. HR will share the official salary review guidelines and timelines shortly. This announcement is for managers only.",
    priority: "medium",
    audience: "selected",
    audienceLabel: "Selected Employees",
    author: "Doglas Martini",
    authorRole: "HR Manager",
    authorInitials: "DM",
    department: null,
    date: "Mar 12, 2026",
    time: "03:00 PM",
    status: "draft",
    readCount: 0,
    totalAudience: 8,
    attachments: [{ name: "Salary_Review_Guidelines.pdf", size: "1.5 MB" }],
    pinned: false,
  },
  {
    id: "ANN-007",
    title: "New Employee Onboarding — March Cohort",
    message:
      "We are pleased to welcome 3 new team members joining SmartHR this month. Please join us in extending a warm welcome to Kevin Osei (Engineering), Aisha Kamara (HR), and Lena Torres (Design). An onboarding session will be held on March 24th at 9:00 AM in Room 1A.",
    priority: "normal",
    audience: "all",
    audienceLabel: "All Employees",
    author: "Doglas Martini",
    authorRole: "HR Manager",
    authorInitials: "DM",
    department: null,
    date: "Mar 10, 2026",
    time: "09:00 AM",
    status: "published",
    readCount: 44,
    totalAudience: 57,
    attachments: [],
    pinned: false,
  },
];

const FILTER_TABS = ["All", "Published", "Draft", "Pinned"];
const PRIORITY_META = {
  urgent: {
    label: "Urgent",
    icon: "warning-outline",
    color: T.red,
    soft: T.redSoft,
  },
  medium: {
    label: "Medium",
    icon: "alert-circle-outline",
    color: T.amber,
    soft: T.amberSoft,
  },
  normal: {
    label: "Normal",
    icon: "remove-circle-outline",
    color: T.textMuted,
    soft: "#F1F5F9",
  },
};

const AVATAR_COLORS = [
  "#0A66C2",
  "#7C3AED",
  "#16A34A",
  "#D97706",
  "#DC2626",
  "#0891B2",
  "#DB2777",
];
const avatarColor = (name) =>
  AVATAR_COLORS[(name?.charCodeAt(0) || 0) % AVATAR_COLORS.length];

const getFileIcon = (name = "") => {
  const ext = name.split(".").pop().toLowerCase();
  if (ext === "pdf") return { icon: "document-text-outline", color: T.red };
  if (["doc", "docx"].includes(ext))
    return { icon: "document-outline", color: T.blue };
  if (["xls", "xlsx"].includes(ext))
    return { icon: "grid-outline", color: T.green };
  if (["jpg", "jpeg", "png", "gif"].includes(ext))
    return { icon: "image-outline", color: T.purple };
  return { icon: "attach-outline", color: T.textMuted };
};

const readPct = (r, t) => (t > 0 ? Math.round((r / t) * 100) : 0);

// ─────────────────────────────────────────────────────────────
//  HERO WIDGET
// ─────────────────────────────────────────────────────────────
const HeroWidget = ({ announcements }) => {
  const published = announcements.filter(
    (a) => a.status === "published",
  ).length;
  const drafts = announcements.filter((a) => a.status === "draft").length;
  const urgent = announcements.filter(
    (a) => a.priority === "urgent" && a.status === "published",
  ).length;

  return (
    <View style={hw.hero}>
      <View style={hw.blob1} />
      <View style={hw.blob2} />

      <View style={hw.topRow}>
        <View>
          <Text style={hw.eyebrow}>ANNOUNCEMENTS</Text>
          <Text style={hw.bigNum}>{announcements.length}</Text>
          <Text style={hw.bigLabel}>Total Announcements</Text>
        </View>
        <View style={hw.ring}>
          <Text style={hw.ringNum}>{published}</Text>
          <Text style={hw.ringLabel}>Published</Text>
        </View>
      </View>

      <View style={hw.metricsRow}>
        {[
          {
            val: published,
            label: "Published",
            color: "#4ADE80",
            icon: "checkmark-circle-outline",
          },
          {
            val: drafts,
            label: "Drafts",
            color: "#FBBF24",
            icon: "save-outline",
          },
          {
            val: urgent,
            label: "Urgent",
            color: "#F87171",
            icon: "warning-outline",
          },
        ].map((m, i) => (
          <React.Fragment key={m.label}>
            {i > 0 && <View style={hw.sep} />}
            <View style={hw.metricCell}>
              <Ionicons
                name={m.icon}
                size={13}
                color={m.color}
                style={{ marginBottom: 4 }}
              />
              <Text style={[hw.metricVal, { color: m.color }]}>{m.val}</Text>
              <Text style={hw.metricLabel}>{m.label}</Text>
            </View>
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};
const hw = StyleSheet.create({
  hero: {
    backgroundColor: T.navy,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 14,
    marginBottom: 14,
    overflow: "hidden",
    shadowColor: T.navy,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 20,
    elevation: 10,
  },
  blob1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: T.blue,
    opacity: 0.08,
    top: -70,
    right: -50,
  },
  blob2: {
    position: "absolute",
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: T.purple,
    opacity: 0.08,
    bottom: -50,
    left: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 9,
    fontWeight: "800",
    color: "rgba(255,255,255,0.35)",
    letterSpacing: 1.8,
    marginBottom: 4,
  },
  bigNum: {
    fontSize: 52,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: -2,
    lineHeight: 56,
  },
  bigLabel: { fontSize: 12, color: "rgba(255,255,255,0.4)", fontWeight: "600" },
  ring: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  ringNum: { fontSize: 22, fontWeight: "900", color: "#fff" },
  ringLabel: {
    fontSize: 8,
    color: "rgba(255,255,255,0.4)",
    fontWeight: "700",
    textTransform: "uppercase",
  },
  metricsRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.07)",
  },
  sep: { width: 1, backgroundColor: "rgba(255,255,255,0.08)" },
  metricCell: { flex: 1, alignItems: "center" },
  metricVal: { fontSize: 18, fontWeight: "900" },
  metricLabel: {
    fontSize: 9,
    color: "rgba(255,255,255,0.35)",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.4,
    marginTop: 2,
  },
});

// ─────────────────────────────────────────────────────────────
//  ANNOUNCEMENT CARD
// ─────────────────────────────────────────────────────────────
const AnnouncementCard = ({ item, onPress }) => {
  const pm = PRIORITY_META[item.priority];
  const rPct = readPct(item.readCount, item.totalAudience);
  const isDraft = item.status === "draft";

  return (
    <TouchableOpacity
      style={[ac.card, isDraft && ac.cardDraft]}
      onPress={() => onPress(item)}
      activeOpacity={0.85}
    >
      {/* Pinned banner */}
      {item.pinned && (
        <View style={ac.pinnedBanner}>
          <Ionicons name="pin" size={10} color={T.blue} />
          <Text style={ac.pinnedTxt}>Pinned</Text>
        </View>
      )}

      {/* Top row: author + priority + draft badge */}
      <View style={ac.topRow}>
        {/* Author avatar */}
        <View
          style={[ac.avatar, { backgroundColor: avatarColor(item.author) }]}
        >
          <Text style={ac.avatarTxt}>{item.authorInitials}</Text>
        </View>

        <View style={{ flex: 1 }}>
          <Text style={ac.authorName}>{item.author}</Text>
          <Text style={ac.authorRole}>{item.authorRole}</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          {isDraft && (
            <View style={ac.draftBadge}>
              <Text style={ac.draftBadgeTxt}>Draft</Text>
            </View>
          )}
          <View style={[ac.priorityBadge, { backgroundColor: pm.soft }]}>
            <Ionicons name={pm.icon} size={10} color={pm.color} />
            <Text style={[ac.priorityTxt, { color: pm.color }]}>
              {pm.label}
            </Text>
          </View>
        </View>
      </View>

      {/* Title + message */}
      <Text style={ac.title}>{item.title}</Text>
      <Text style={ac.message} numberOfLines={2}>
        {item.message}
      </Text>

      {/* Attachments row */}
      {item.attachments.length > 0 && (
        <View style={ac.attachRow}>
          <Ionicons name="attach-outline" size={12} color={T.textMuted} />
          <Text style={ac.attachTxt}>
            {item.attachments.length} attachment
            {item.attachments.length > 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Footer */}
      <View style={ac.footer}>
        {/* Audience chip */}
        <View style={ac.audienceChip}>
          <Ionicons
            name={
              item.audience === "all"
                ? "people-outline"
                : item.audience === "dept"
                  ? "business-outline"
                  : "person-outline"
            }
            size={10}
            color={T.blue}
          />
          <Text style={ac.audienceTxt}>{item.audienceLabel}</Text>
        </View>

        {/* Date */}
        <View style={ac.dateRow}>
          <Ionicons name="time-outline" size={10} color={T.textMuted} />
          <Text style={ac.dateTxt}>{item.date}</Text>
        </View>

        {/* Read rate — only for published */}
        {!isDraft && (
          <View style={ac.readRow}>
            <Ionicons name="eye-outline" size={10} color={T.textMuted} />
            <Text style={ac.readTxt}>
              {item.readCount}/{item.totalAudience}
            </Text>
          </View>
        )}
      </View>

      {/* Read progress bar — published only */}
      {!isDraft && (
        <View style={ac.progressTrack}>
          <View
            style={[
              ac.progressFill,
              {
                width: `${rPct}%`,
                backgroundColor:
                  rPct === 100 ? T.green : rPct >= 70 ? T.blue : T.amber,
              },
            ]}
          />
        </View>
      )}
    </TouchableOpacity>
  );
};

const ac = StyleSheet.create({
  card: {
    backgroundColor: T.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: T.border,
    padding: 14,
    gap: 10,
    shadowColor: "#64748B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 2,
  },
  cardDraft: { backgroundColor: "#FEFCE8", borderColor: "#FDE68A" },
  pinnedBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.blueSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  pinnedTxt: { fontSize: 10, fontWeight: "800", color: T.blue },
  topRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarTxt: { fontSize: 12, fontWeight: "800", color: "#fff" },
  authorName: { fontSize: 12, fontWeight: "700", color: T.text },
  authorRole: { fontSize: 10, color: T.textMuted, marginTop: 1 },
  draftBadge: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 20,
  },
  draftBadgeTxt: { fontSize: 9, fontWeight: "800", color: T.amber },
  priorityBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  priorityTxt: { fontSize: 10, fontWeight: "700" },
  title: { fontSize: 14, fontWeight: "800", color: T.text, lineHeight: 20 },
  message: { fontSize: 12, color: T.textSub, lineHeight: 18 },
  attachRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  attachTxt: { fontSize: 11, color: T.textMuted, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flexWrap: "wrap",
  },
  audienceChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: T.blueSoft,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  audienceTxt: { fontSize: 10, fontWeight: "700", color: T.blue },
  dateRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  dateTxt: { fontSize: 10, color: T.textMuted },
  readRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginLeft: "auto",
  },
  readTxt: { fontSize: 10, color: T.textMuted, fontWeight: "600" },
  progressTrack: {
    height: 4,
    backgroundColor: T.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressFill: { height: "100%", borderRadius: 2 },
});

// ─────────────────────────────────────────────────────────────
//  DETAIL MODAL
// ─────────────────────────────────────────────────────────────
const DetailModal = ({ item, onClose }) => {
  if (!item) return null;
  const pm = PRIORITY_META[item.priority];
  const rPct = readPct(item.readCount, item.totalAudience);

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <View style={dm.overlay}>
        <View style={dm.sheet}>
          <View style={dm.handle} />

          {/* Header */}
          <View style={dm.header}>
            <View style={[dm.headerIcon, { backgroundColor: pm.soft }]}>
              <Ionicons name="megaphone-outline" size={18} color={pm.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={dm.headerTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <View style={[dm.priorityPill, { backgroundColor: pm.soft }]}>
                <Ionicons name={pm.icon} size={10} color={pm.color} />
                <Text style={[dm.priorityPillTxt, { color: pm.color }]}>
                  {pm.label} Priority
                </Text>
              </View>
            </View>
            <TouchableOpacity style={dm.closeBtn} onPress={onClose}>
              <Ionicons name="close" size={18} color={T.textMuted} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Author band */}
            <View style={dm.authorBand}>
              <View
                style={[
                  dm.authorAvatar,
                  { backgroundColor: avatarColor(item.author) },
                ]}
              >
                <Text style={dm.authorAvatarTxt}>{item.authorInitials}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={dm.authorName}>{item.author}</Text>
                <Text style={dm.authorRole}>{item.authorRole}</Text>
              </View>
              <View style={dm.metaStack}>
                <View style={dm.metaRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={10}
                    color={T.textMuted}
                  />
                  <Text style={dm.metaTxt}>{item.date}</Text>
                </View>
                <View style={dm.metaRow}>
                  <Ionicons name="time-outline" size={10} color={T.textMuted} />
                  <Text style={dm.metaTxt}>{item.time}</Text>
                </View>
              </View>
            </View>

            {/* Message body */}
            <View style={dm.section}>
              <Text style={dm.sectionLabel}>Message</Text>
              <Text style={dm.messageBody}>{item.message}</Text>
            </View>

            {/* Audience & reach */}
            <View style={dm.section}>
              <Text style={dm.sectionLabel}>Audience & Reach</Text>
              <View style={dm.infoCard}>
                <View style={dm.infoRow}>
                  <View style={dm.infoIcon}>
                    <Ionicons
                      name={
                        item.audience === "all"
                          ? "people-outline"
                          : item.audience === "dept"
                            ? "business-outline"
                            : "person-outline"
                      }
                      size={14}
                      color={T.textMuted}
                    />
                  </View>
                  <View>
                    <Text style={dm.infoLabel}>Target Audience</Text>
                    <Text style={dm.infoVal}>{item.audienceLabel}</Text>
                  </View>
                </View>

                {item.status === "published" && (
                  <>
                    <View style={dm.divider} />
                    <View style={dm.readSection}>
                      <View style={dm.readTop}>
                        <Text style={dm.readLabel}>Read by</Text>
                        <Text
                          style={[
                            dm.readPct,
                            {
                              color:
                                rPct === 100
                                  ? T.green
                                  : rPct >= 70
                                    ? T.blue
                                    : T.amber,
                            },
                          ]}
                        >
                          {rPct}%
                        </Text>
                      </View>
                      <View style={dm.readTrack}>
                        <View
                          style={[
                            dm.readFill,
                            {
                              width: `${rPct}%`,
                              backgroundColor:
                                rPct === 100
                                  ? T.green
                                  : rPct >= 70
                                    ? T.blue
                                    : T.amber,
                            },
                          ]}
                        />
                      </View>
                      <Text style={dm.readSub}>
                        {item.readCount} of {item.totalAudience} employees have
                        read this
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>

            {/* Attachments */}
            {item.attachments.length > 0 && (
              <View style={dm.section}>
                <Text style={dm.sectionLabel}>
                  Attachments ({item.attachments.length})
                </Text>
                <View style={dm.attachList}>
                  {item.attachments.map((f, i) => {
                    const fi = getFileIcon(f.name);
                    return (
                      <TouchableOpacity
                        key={i}
                        style={dm.attachRow}
                        activeOpacity={0.8}
                      >
                        <View
                          style={[
                            dm.attachIcon,
                            { backgroundColor: fi.color + "15" },
                          ]}
                        >
                          <Ionicons name={fi.icon} size={16} color={fi.color} />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={dm.attachName} numberOfLines={1}>
                            {f.name}
                          </Text>
                          <Text style={dm.attachSize}>{f.size}</Text>
                        </View>
                        <View style={dm.downloadBtn}>
                          <Ionicons
                            name="download-outline"
                            size={14}
                            color={T.blue}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            <View style={{ height: 8 }} />
          </ScrollView>

          {/* Footer actions */}
          <View style={dm.footer}>
            <TouchableOpacity style={dm.closeFooter} onPress={onClose}>
              <Text style={dm.closeFooterTxt}>Close</Text>
            </TouchableOpacity>
            {item.status === "draft" ? (
              <TouchableOpacity style={dm.publishBtn}>
                <Ionicons name="send-outline" size={14} color="#fff" />
                <Text style={dm.publishTxt}>Publish Now</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={dm.editBtn}>
                <Ionicons name="create-outline" size={14} color="#fff" />
                <Text style={dm.editTxt}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const dm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: "93%",
  },
  handle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: T.border,
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  headerIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 15, fontWeight: "800", color: T.text },
  priorityPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 20,
    marginTop: 3,
  },
  priorityPillTxt: { fontSize: 10, fontWeight: "700" },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  authorBand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    margin: 16,
    backgroundColor: T.bg,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: T.border,
  },
  authorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
  authorAvatarTxt: { fontSize: 14, fontWeight: "800", color: "#fff" },
  authorName: { fontSize: 14, fontWeight: "700", color: T.text },
  authorRole: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  metaStack: { alignItems: "flex-end", gap: 4 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaTxt: { fontSize: 10, color: T.textMuted },
  section: { paddingHorizontal: 16, marginBottom: 14 },
  sectionLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: T.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.7,
    marginBottom: 10,
  },
  messageBody: { fontSize: 14, color: T.textSub, lineHeight: 22 },
  infoCard: {
    backgroundColor: T.bg,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: T.border,
    overflow: "hidden",
  },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 10, padding: 14 },
  infoIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: T.border,
    alignItems: "center",
    justifyContent: "center",
  },
  infoLabel: {
    fontSize: 10,
    color: T.textMuted,
    fontWeight: "500",
    marginBottom: 2,
  },
  infoVal: { fontSize: 13, color: T.text, fontWeight: "700" },
  divider: { height: 1, backgroundColor: T.border },
  readSection: { padding: 14, gap: 8 },
  readTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  readLabel: { fontSize: 12, color: T.textSub, fontWeight: "600" },
  readPct: { fontSize: 18, fontWeight: "900" },
  readTrack: {
    height: 8,
    backgroundColor: T.border,
    borderRadius: 4,
    overflow: "hidden",
  },
  readFill: { height: "100%", borderRadius: 4 },
  readSub: { fontSize: 11, color: T.textMuted },
  attachList: { gap: 8 },
  attachRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: T.bg,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: T.border,
  },
  attachIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  attachName: { fontSize: 13, fontWeight: "600", color: T.text },
  attachSize: { fontSize: 10, color: T.textMuted, marginTop: 2 },
  downloadBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: T.blueSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
  },
  closeFooter: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: T.border,
    alignItems: "center",
  },
  closeFooterTxt: { fontSize: 13, fontWeight: "700", color: T.textSub },
  publishBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: T.blue,
    paddingVertical: 13,
    borderRadius: 12,
  },
  publishTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
  editBtn: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    backgroundColor: T.navy,
    paddingVertical: 13,
    borderRadius: 12,
  },
  editTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
});

// ─────────────────────────────────────────────────────────────
//  MAIN SCREEN
// ─────────────────────────────────────────────────────────────
export default function AnnouncementsScreen({ navigation }) {
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  const [selected, setSelected] = useState(null);

  const filtered = useMemo(() => {
    let list = [...ANNOUNCEMENTS];

    // Pinned always float to top
    list.sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0));

    if (activeFilter === "Published")
      list = list.filter((a) => a.status === "published");
    else if (activeFilter === "Draft")
      list = list.filter((a) => a.status === "draft");
    else if (activeFilter === "Pinned") list = list.filter((a) => a.pinned);

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.message.toLowerCase().includes(q) ||
          a.author.toLowerCase().includes(q) ||
          a.audienceLabel.toLowerCase().includes(q),
      );
    }

    return list;
  }, [search, activeFilter]);

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Top bar */}
      <View style={s.topBar}>
        <View>
          <Text style={s.pageTitle}>Announcements</Text>
          <Text style={s.pageSub}>
            {ANNOUNCEMENTS.length} total ·{" "}
            {ANNOUNCEMENTS.filter((a) => a.status === "published").length}{" "}
            published
          </Text>
        </View>
        <TouchableOpacity
          style={s.newBtn}
          onPress={() => navigation?.navigate("CreateAnnouncement")}
        >
          <Ionicons name="add" size={16} color="#fff" />
          <Text style={s.newBtnTxt}>New</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero */}
        <HeroWidget announcements={ANNOUNCEMENTS} />

        {/* Search */}
        <View style={[s.searchWrap, searchFocused && s.searchFocused]}>
          <Ionicons
            name="search-outline"
            size={16}
            color={searchFocused ? T.blue : T.textMuted}
          />
          <TextInput
            style={s.searchInput}
            placeholder="Search announcements…"
            placeholderTextColor={T.textMuted}
            value={search}
            onChangeText={setSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            autoCorrect={false}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color={T.textMuted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.tabsRow}
        >
          {FILTER_TABS.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[s.tab, activeFilter === tab && s.tabActive]}
              onPress={() => setActiveFilter(tab)}
            >
              <Text style={[s.tabTxt, activeFilter === tab && s.tabTxtActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Section header */}
        <View style={s.sectionRow}>
          <View style={s.sectionBar} />
          <Text style={s.sectionTitle}>
            {activeFilter === "All" ? "All Announcements" : activeFilter}
          </Text>
          <View style={s.countPill}>
            <Text style={s.countTxt}>{filtered.length}</Text>
          </View>
        </View>

        {/* List */}
        {filtered.length === 0 ? (
          <View style={s.empty}>
            <Ionicons name="megaphone-outline" size={52} color="#CBD5E1" />
            <Text style={s.emptyTxt}>No announcements found</Text>
            <Text style={s.emptySub}>
              Try a different filter or search term
            </Text>
          </View>
        ) : (
          <View style={s.list}>
            {filtered.map((item) => (
              <AnnouncementCard
                key={item.id}
                item={item}
                onPress={setSelected}
              />
            ))}
          </View>
        )}
      </ScrollView>

      <DetailModal item={selected} onClose={() => setSelected(null)} />
    </SafeAreaView>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCREEN STYLES
// ─────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: T.bg },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  pageTitle: { fontSize: 22, fontWeight: "800", color: T.text },
  pageSub: { fontSize: 11, color: T.textMuted, marginTop: 2 },
  newBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: T.blue,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
  },
  newBtnTxt: { fontSize: 13, fontWeight: "700", color: "#fff" },
  scroll: { padding: 14, gap: 12, paddingBottom: 50 },
  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    borderWidth: 1.5,
    borderColor: T.border,
  },
  searchFocused: {
    borderColor: T.blue,
    shadowColor: T.blue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  searchInput: { flex: 1, fontSize: 13.5, color: T.text },
  tabsRow: { gap: 8 },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1.5,
    borderColor: T.border,
  },
  tabActive: { backgroundColor: T.navy, borderColor: T.navy },
  tabTxt: { fontSize: 12, fontWeight: "700", color: T.textSub },
  tabTxtActive: { color: "#fff" },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  sectionBar: {
    width: 4,
    height: 18,
    borderRadius: 2,
    backgroundColor: T.blue,
  },
  sectionTitle: { flex: 1, fontSize: 14, fontWeight: "800", color: T.text },
  countPill: {
    backgroundColor: T.blue,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 20,
  },
  countTxt: { fontSize: 11, fontWeight: "900", color: "#fff" },
  list: { gap: 10 },
  empty: { paddingTop: 60, alignItems: "center", gap: 10 },
  emptyTxt: { fontSize: 15, color: T.textMuted, fontWeight: "700" },
  emptySub: { fontSize: 12, color: "#CBD5E1" },
});
