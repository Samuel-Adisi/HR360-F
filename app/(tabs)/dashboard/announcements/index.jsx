import { useCallback, useRef, useState } from "react";
import {
  Animated,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  BellIcon,
  ChatBubbleLeftIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon,
  ExclamationTriangleIcon,
  MegaphoneIcon,
  PencilSquareIcon,
  PlusIcon,
  TrashIcon,
  UserGroupIcon,
  XMarkIcon,
} from "react-native-heroicons/outline";
import { MegaphoneIcon as MegaphoneSolid } from "react-native-heroicons/solid";
import { SafeAreaView } from "react-native-safe-area-context";

// ─── Design tokens (matches AddEmployeeScreen) ────────────────────────────────
const C = {
  accent: "#0F766E",
  accentLight: "#F0FDFA",
  accentMid: "#CCFBF1",
  navy: "#0F172A",
  slate: "#1E293B",
  sub: "#64748B",
  muted: "#94A3B8",
  border: "#E2E8F0",
  divider: "#F1F5F9",
  bg: "#F8FAFC",
  white: "#FFFFFF",
  green: "#059669",
  greenBg: "#DCFCE7",
  red: "#DC2626",
  redBg: "#FEE2E2",
  redText: "#B91C1C",
  amber: "#D97706",
  amberBg: "#FEF3C7",
  amberText: "#92400E",
  blue: "#0A66C2",
  purple: "#7C3AED",
  inputBg: "#FAFAFA",
  focusBorder: "#0F766E",
  errorBorder: "#DC2626",
  errorBg: "#FEF2F2",
  msgBg: "#E7F8F5",
  replyBg: "#F1F5F9",
};

// ─── Mock data ────────────────────────────────────────────────────────────────
const MOCK_USER = { id: 1, name: "Sarah Mensah", role: "hr", initials: "SM" };

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Public Holiday — Friday 18 April",
    body: "The office will be closed on Friday 18 April in observance of Good Friday. All staff should ensure tasks are completed by end of day Thursday. Have a restful long weekend!",
    sender: "Sarah Mensah",
    senderInitials: "SM",
    timestamp: "Today, 9:41 AM",
    type: "announcement",
    replies: [
      {
        id: 101,
        sender: "Kofi Asante",
        initials: "KA",
        text: "Thank you for the heads up!",
        timestamp: "9:55 AM",
      },
      {
        id: 102,
        sender: "Ama Owusu",
        initials: "AO",
        text: "Noted. Enjoy the holiday everyone 🎉",
        timestamp: "10:02 AM",
      },
    ],
  },
  {
    id: 2,
    title: "Q2 Payroll Processing",
    body: "Payroll for Q2 will be processed on 30 April. Please ensure all timesheets and leave records are submitted to HR by 25 April. Late submissions may result in delayed payment.",
    sender: "Sarah Mensah",
    senderInitials: "SM",
    timestamp: "Yesterday, 2:15 PM",
    type: "payroll",
    replies: [],
  },
  {
    id: 3,
    title: "New Remote Work Policy",
    body: "Starting May 1st, all employees are eligible for up to 2 remote work days per week. Please discuss arrangements with your line manager. Full policy document has been shared on the company drive.",
    sender: "Sarah Mensah",
    senderInitials: "SM",
    timestamp: "Mon, 3:30 PM",
    type: "announcement",
    replies: [
      {
        id: 201,
        sender: "Kwame Boateng",
        initials: "KB",
        text: "Great news! Thanks for sharing.",
        timestamp: "4:00 PM",
      },
    ],
  },
];

const TYPE_META = {
  announcement: { color: C.accent, bg: C.accentLight, label: "Announcement" },
  payroll: { color: C.purple, bg: "#F5F3FF", label: "Payroll" },
  leave_approved: { color: C.green, bg: C.greenBg, label: "Leave" },
  general: { color: C.blue, bg: "#EFF6FF", label: "General" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function IconSquare({ icon: Icon, color, size = 34 }) {
  return (
    <View
      style={[
        s.iconSquare,
        {
          backgroundColor: color,
          width: size,
          height: size,
          borderRadius: size * 0.27,
        },
      ]}
    >
      <Icon size={15} color="#FFFFFF" strokeWidth={2} />
    </View>
  );
}

function Avatar({ initials, color = C.accent, size = 36 }) {
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: color + "22",
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1.5,
        borderColor: color + "44",
      }}
    >
      <Text style={{ fontSize: size * 0.33, fontWeight: "700", color }}>
        {initials}
      </Text>
    </View>
  );
}

function Toast({ message, type, visible }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;

  useState(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(opacity, {
          toValue: 1,
          useNativeDriver: true,
          speed: 20,
        }),
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          speed: 20,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        s.toast,
        {
          backgroundColor: type === "success" ? C.green : C.red,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    >
      {type === "success" ? (
        <CheckCircleIcon size={16} color="#fff" strokeWidth={2.5} />
      ) : (
        <ExclamationTriangleIcon size={16} color="#fff" strokeWidth={2.5} />
      )}
      <Text style={s.toastText}>{message}</Text>
    </Animated.View>
  );
}

// ─── Reply Sheet ──────────────────────────────────────────────────────────────
function ReplySheet({ announcement, visible, onClose, onSend, isHR }) {
  const [text, setText] = useState("");

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(announcement.id, text.trim());
    setText("");
  };

  if (!announcement) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        {/* Header */}
        <View style={s.sheetHeader}>
          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              s.sheetCloseBtn,
              pressed && { opacity: 0.6 },
            ]}
          >
            <XMarkIcon size={20} color={C.navy} strokeWidth={2.2} />
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.sheetTitle} numberOfLines={1}>
              {announcement.title}
            </Text>
            <Text style={s.sheetSub}>
              {announcement.replies.length}{" "}
              {announcement.replies.length === 1 ? "reply" : "replies"}
            </Text>
          </View>
        </View>

        {/* Original announcement snippet */}
        <View style={s.originalSnippet}>
          <View style={[s.snippetAccent, { backgroundColor: C.accent }]} />
          <View style={{ flex: 1 }}>
            <Text style={s.snippetSender}>{announcement.sender}</Text>
            <Text style={s.snippetBody} numberOfLines={2}>
              {announcement.body}
            </Text>
          </View>
        </View>

        {/* Replies list */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          showsVerticalScrollIndicator={false}
        >
          {announcement.replies.length === 0 && (
            <View style={s.emptyReplies}>
              <ChatBubbleLeftIcon size={28} color={C.muted} strokeWidth={1.5} />
              <Text style={s.emptyRepliesText}>
                No replies yet. Be the first to respond.
              </Text>
            </View>
          )}
          {announcement.replies.map((reply) => (
            <View key={reply.id} style={s.replyBubble}>
              <Avatar initials={reply.initials} color={C.purple} size={32} />
              <View style={s.replyContent}>
                <View style={s.replyHeader}>
                  <Text style={s.replySender}>{reply.sender}</Text>
                  <Text style={s.replyTime}>{reply.timestamp}</Text>
                </View>
                <Text style={s.replyText}>{reply.text}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Reply input — employees & HR can reply */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={s.replyInputWrap}>
            <Avatar initials={MOCK_USER.initials} color={C.accent} size={32} />
            <TextInput
              style={s.replyInput}
              placeholder="Write a reply…"
              placeholderTextColor={C.muted}
              value={text}
              onChangeText={setText}
              multiline
              returnKeyType="send"
              onSubmitEditing={handleSend}
            />
            <Pressable
              onPress={handleSend}
              style={({ pressed }) => [
                s.sendBtn,
                !text.trim() && s.sendBtnDisabled,
                pressed && { opacity: 0.7 },
              ]}
              disabled={!text.trim()}
            >
              <CheckCircleIcon
                size={20}
                color={text.trim() ? C.accent : C.muted}
                strokeWidth={2.5}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Compose Modal ────────────────────────────────────────────────────────────
function ComposeModal({ visible, onClose, onSend, initial = null }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [body, setBody] = useState(initial?.body || "");
  const [titleFocused, setTitleFocused] = useState(false);
  const [bodyFocused, setBodyFocused] = useState(false);
  const isEdit = !!initial;

  const handleSend = () => {
    if (!title.trim() || !body.trim()) return;
    onSend(
      { title: title.trim(), body: body.trim() },
      isEdit ? initial.id : null,
    );
    setTitle("");
    setBody("");
  };

  const resetAndClose = () => {
    if (!isEdit) {
      setTitle("");
      setBody("");
    }
    onClose();
  };

  // Sync fields when editing a different announcement
  useState(() => {
    setTitle(initial?.title || "");
    setBody(initial?.body || "");
  }, [initial]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={resetAndClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={s.sheetHeader}>
          <Pressable
            onPress={resetAndClose}
            style={({ pressed }) => [
              s.sheetCloseBtn,
              pressed && { opacity: 0.6 },
            ]}
          >
            <XMarkIcon size={20} color={C.navy} strokeWidth={2.2} />
          </Pressable>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={s.sheetTitle}>
              {isEdit ? "Edit Announcement" : "New Announcement"}
            </Text>
            <Text style={s.sheetSub}>
              Sent to all employees as a push notification
            </Text>
          </View>
          <Pressable
            onPress={handleSend}
            disabled={!title.trim() || !body.trim()}
            style={({ pressed }) => [
              s.sendAnnBtn,
              (!title.trim() || !body.trim()) && { opacity: 0.4 },
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={s.sendAnnBtnText}>{isEdit ? "Update" : "Send"}</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <ScrollView
            contentContainerStyle={{ padding: 16, gap: 16 }}
            keyboardShouldPersistTaps="handled"
          >
            {/* Title field */}
            <View style={s.composeField}>
              <Text style={s.composeLabel}>
                TITLE <Text style={{ color: C.red }}>*</Text>
              </Text>
              <View
                style={[
                  s.composeInputWrap,
                  {
                    borderColor: titleFocused ? C.focusBorder : C.border,
                    backgroundColor: titleFocused ? C.accentLight : C.inputBg,
                  },
                ]}
              >
                <IconSquare icon={MegaphoneIcon} color={C.accent} size={32} />
                <TextInput
                  style={s.composeInput}
                  placeholder="e.g. Office closed Friday"
                  placeholderTextColor={C.muted}
                  value={title}
                  onChangeText={setTitle}
                  onFocus={() => setTitleFocused(true)}
                  onBlur={() => setTitleFocused(false)}
                  returnKeyType="next"
                  maxLength={120}
                />
              </View>
            </View>

            {/* Body field */}
            <View style={s.composeField}>
              <Text style={s.composeLabel}>
                MESSAGE <Text style={{ color: C.red }}>*</Text>
              </Text>
              <View
                style={[
                  s.composeTextAreaWrap,
                  {
                    borderColor: bodyFocused ? C.focusBorder : C.border,
                    backgroundColor: bodyFocused ? C.accentLight : C.inputBg,
                  },
                ]}
              >
                <TextInput
                  style={s.composeTextArea}
                  placeholder="Write your announcement here…"
                  placeholderTextColor={C.muted}
                  value={body}
                  onChangeText={setBody}
                  onFocus={() => setBodyFocused(true)}
                  onBlur={() => setBodyFocused(false)}
                  multiline
                  numberOfLines={6}
                  textAlignVertical="top"
                />
              </View>
              <Text style={s.charCount}>{body.length} characters</Text>
            </View>

            {/* Info banner */}
            <View style={s.infoBanner}>
              <BellIcon size={14} color={C.amber} strokeWidth={2} />
              <Text style={s.infoBannerText}>
                This will send a push notification to all active employees and
                save to their notification inbox.
              </Text>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

// ─── Announcement Card ────────────────────────────────────────────────────────
function AnnouncementCard({ item, isHR, onReply, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const meta = TYPE_META[item.type] || TYPE_META.general;

  return (
    <View style={s.card}>
      {/* Card header */}
      <View style={s.cardHeader}>
        <Avatar initials={item.senderInitials} color={C.accent} size={38} />
        <View style={{ flex: 1, marginLeft: 10 }}>
          <Text style={s.cardSender}>{item.sender}</Text>
          <Text style={s.cardTime}>{item.timestamp}</Text>
        </View>
        {/* Type badge */}
        <View style={[s.typeBadge, { backgroundColor: meta.bg }]}>
          <Text style={[s.typeBadgeText, { color: meta.color }]}>
            {meta.label}
          </Text>
        </View>
        {/* HR menu */}
        {isHR && (
          <View style={{ marginLeft: 8 }}>
            <Pressable
              onPress={() => setMenuOpen(true)}
              style={({ pressed }) => [s.menuBtn, pressed && { opacity: 0.6 }]}
            >
              <EllipsisHorizontalIcon size={20} color={C.sub} strokeWidth={2} />
            </Pressable>

            <Modal
              visible={menuOpen}
              transparent
              animationType="fade"
              onRequestClose={() => setMenuOpen(false)}
            >
              <Pressable
                style={s.menuOverlay}
                onPress={() => setMenuOpen(false)}
              >
                <View style={s.menuSheet}>
                  <Pressable
                    style={({ pressed }) => [
                      s.menuItem,
                      pressed && { backgroundColor: C.divider },
                    ]}
                    onPress={() => {
                      setMenuOpen(false);
                      onEdit(item);
                    }}
                  >
                    <IconSquare
                      icon={PencilSquareIcon}
                      color={C.accent}
                      size={30}
                    />
                    <Text style={s.menuItemText}>Edit Announcement</Text>
                  </Pressable>
                  <View style={s.menuDivider} />
                  <Pressable
                    style={({ pressed }) => [
                      s.menuItem,
                      pressed && { backgroundColor: C.redBg },
                    ]}
                    onPress={() => {
                      setMenuOpen(false);
                      onDelete(item.id);
                    }}
                  >
                    <IconSquare icon={TrashIcon} color={C.red} size={30} />
                    <Text style={[s.menuItemText, { color: C.red }]}>
                      Delete Announcement
                    </Text>
                  </Pressable>
                </View>
              </Pressable>
            </Modal>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={s.cardTitle}>{item.title}</Text>

      {/* Body */}
      <Text style={s.cardBody}>{item.body}</Text>

      {/* Reply strip */}
      <Pressable
        onPress={() => onReply(item)}
        style={({ pressed }) => [
          s.replyStrip,
          pressed && { backgroundColor: C.accentMid },
        ]}
      >
        <ChatBubbleLeftIcon size={14} color={C.accent} strokeWidth={2} />
        <Text style={s.replyStripText}>
          {item.replies.length > 0
            ? `${item.replies.length} ${item.replies.length === 1 ? "reply" : "replies"} · Tap to view`
            : "Reply"}
        </Text>
        {item.replies.length > 0 && (
          <View style={s.replyAvatarRow}>
            {item.replies.slice(0, 3).map((r, i) => (
              <View
                key={r.id}
                style={[
                  s.replyAvatarMini,
                  { marginLeft: i === 0 ? 4 : -6, zIndex: 3 - i },
                ]}
              >
                <Text style={s.replyAvatarMiniText}>{r.initials[0]}</Text>
              </View>
            ))}
          </View>
        )}
        <ChevronDownIcon
          size={13}
          color={C.accent}
          strokeWidth={2.5}
          style={{ marginLeft: "auto" }}
        />
      </Pressable>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function AnnouncementsScreen() {
  const isHR = MOCK_USER.role === "hr";

  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [replyTarget, setReplyTarget] = useState(null);
  const [replyVisible, setReplyVisible] = useState(false);
  const [composeVisible, setComposeVisible] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [toast, setToast] = useState({
    visible: false,
    message: "",
    type: "success",
  });

  const showToast = useCallback((message, type = "success") => {
    setToast({ visible: true, message, type });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const handleReply = (item) => {
    setReplyTarget(item);
    setReplyVisible(true);
  };

  const handleSendReply = (announcementId, text) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.id === announcementId
          ? {
              ...a,
              replies: [
                ...a.replies,
                {
                  id: Date.now(),
                  sender: MOCK_USER.name,
                  initials: MOCK_USER.initials,
                  text,
                  timestamp: "Just now",
                },
              ],
            }
          : a,
      ),
    );
    // Sync replyTarget so the sheet reflects new reply immediately
    setReplyTarget((prev) =>
      prev?.id === announcementId
        ? {
            ...prev,
            replies: [
              ...prev.replies,
              {
                id: Date.now(),
                sender: MOCK_USER.name,
                initials: MOCK_USER.initials,
                text,
                timestamp: "Just now",
              },
            ],
          }
        : prev,
    );
    showToast("Reply sent");
  };

  const handleEdit = (item) => {
    setEditTarget(item);
    setComposeVisible(true);
  };

  const handleDelete = (id) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast("Announcement deleted", "error");
  };

  const handleSendAnnouncement = ({ title, body }, editId) => {
    if (editId) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === editId ? { ...a, title, body } : a)),
      );
      showToast("Announcement updated");
    } else {
      setAnnouncements((prev) => [
        {
          id: Date.now(),
          title,
          body,
          sender: MOCK_USER.name,
          senderInitials: MOCK_USER.initials,
          timestamp: "Just now",
          type: "announcement",
          replies: [],
        },
        ...prev,
      ]);
      showToast("Announcement sent to all employees");
    }
    setComposeVisible(false);
    setEditTarget(null);
  };

  return (
    <View style={s.root}>
      <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
      />

      {/* ── Navbar ── */}
      <SafeAreaView edges={["top"]} style={s.navbar}>
        <View style={s.navLeft}>
          <View style={s.navBadge}>
            <MegaphoneSolid size={16} color={C.accent} />
          </View>
          <View>
            <Text style={s.navTitle}>Announcements</Text>
            <Text style={s.navSub}>
              {isHR ? "HR · Admin channel" : "View only · Replies allowed"}
            </Text>
          </View>
        </View>

        {isHR && (
          <Pressable
            onPress={() => {
              setEditTarget(null);
              setComposeVisible(true);
            }}
            style={({ pressed }) => [s.composeBtn, pressed && { opacity: 0.8 }]}
          >
            <PlusIcon size={15} color="#fff" strokeWidth={2.5} />
            <Text style={s.composeBtnText}>New</Text>
          </Pressable>
        )}
      </SafeAreaView>

      {/* ── Info banner (WhatsApp-style) ── */}
      <View style={s.channelBanner}>
        <UserGroupIcon size={13} color={C.sub} strokeWidth={2} />
        <Text style={s.channelBannerText}>
          {isHR
            ? "You can send, edit, and delete announcements. Employees can reply."
            : "Only admins can send announcements. You can reply to them."}
        </Text>
      </View>

      {/* ── Feed ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={s.feed}
      >
        {announcements.length === 0 && (
          <View style={s.emptyState}>
            <View style={[s.emptyIcon, { backgroundColor: C.accentLight }]}>
              <MegaphoneIcon size={32} color={C.accent} strokeWidth={1.5} />
            </View>
            <Text style={s.emptyTitle}>No announcements yet</Text>
            <Text style={s.emptyBody}>
              {isHR
                ? "Tap New to send your first announcement to all employees."
                : "HR announcements will appear here."}
            </Text>
          </View>
        )}

        {announcements.map((item) => (
          <AnnouncementCard
            key={item.id}
            item={item}
            isHR={isHR}
            onReply={handleReply}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        <View style={{ height: 32 }} />
      </ScrollView>

      {/* ── Modals ── */}
      <ReplySheet
        announcement={replyTarget}
        visible={replyVisible}
        onClose={() => setReplyVisible(false)}
        onSend={handleSendReply}
        isHR={isHR}
      />

      <ComposeModal
        visible={composeVisible}
        onClose={() => {
          setComposeVisible(false);
          setEditTarget(null);
        }}
        onSend={handleSendAnnouncement}
        initial={editTarget}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },

  toast: {
    position: "absolute",
    top: 60,
    left: 20,
    right: 20,
    zIndex: 999,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 10,
  },
  toastText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: -0.1,
  },

  navbar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 4,
    paddingBottom: 12,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  navLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  navBadge: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: C.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.3,
  },
  navSub: { fontSize: 11, color: C.muted, fontWeight: "600", marginTop: 1 },
  composeBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: C.accent,
  },
  composeBtnText: { fontSize: 13, fontWeight: "700", color: "#fff" },

  channelBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 4,
    backgroundColor: C.divider,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  channelBannerText: {
    flex: 1,
    fontSize: 11,
    color: C.sub,
    fontWeight: "500",
    lineHeight: 16,
  },

  feed: { paddingHorizontal: 16, paddingTop: 12 },

  card: {
    backgroundColor: C.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  cardSender: { fontSize: 13, fontWeight: "700", color: C.navy },
  cardTime: { fontSize: 11, color: C.muted, marginTop: 1, fontWeight: "500" },
  typeBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: 20 },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  menuBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: C.divider,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 6,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.2,
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    color: C.slate,
    lineHeight: 21,
    fontWeight: "400",
    marginBottom: 12,
  },

  replyStrip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.accentLight,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: C.accentMid,
  },
  replyStripText: { fontSize: 12, fontWeight: "600", color: C.accent, flex: 1 },
  replyAvatarRow: { flexDirection: "row", alignItems: "center" },
  replyAvatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: C.accentMid,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: C.white,
  },
  replyAvatarMiniText: { fontSize: 8, fontWeight: "700", color: C.accent },

  iconSquare: { alignItems: "center", justifyContent: "center", flexShrink: 0 },

  // Empty state
  emptyState: { alignItems: "center", paddingTop: 60, paddingHorizontal: 32 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: C.navy,
    marginBottom: 6,
    textAlign: "center",
  },
  emptyBody: {
    fontSize: 14,
    color: C.muted,
    textAlign: "center",
    lineHeight: 20,
    fontWeight: "500",
  },

  // Sheet shared
  sheetHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
    backgroundColor: C.white,
    borderBottomWidth: 1,
    borderBottomColor: C.border,
  },
  sheetCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: C.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  sheetTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: C.navy,
    letterSpacing: -0.2,
  },
  sheetSub: { fontSize: 11, color: C.muted, fontWeight: "500", marginTop: 1 },
  sendAnnBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: C.accent,
  },
  sendAnnBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },

  // Reply sheet
  originalSnippet: {
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    margin: 16,
    padding: 12,
    backgroundColor: C.replyBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
  },
  snippetAccent: {
    width: 3,
    borderRadius: 2,
    alignSelf: "stretch",
    minHeight: 30,
  },
  snippetSender: {
    fontSize: 12,
    fontWeight: "700",
    color: C.accent,
    marginBottom: 2,
  },
  snippetBody: { fontSize: 13, color: C.sub, lineHeight: 18 },

  emptyReplies: { alignItems: "center", paddingTop: 40, gap: 10 },
  emptyRepliesText: {
    fontSize: 13,
    color: C.muted,
    fontWeight: "500",
    textAlign: "center",
  },

  replyBubble: { flexDirection: "row", gap: 10, alignItems: "flex-start" },
  replyContent: {
    flex: 1,
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 10,
  },
  replyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  replySender: { fontSize: 12, fontWeight: "700", color: C.navy },
  replyTime: { fontSize: 11, color: C.muted, fontWeight: "500" },
  replyText: { fontSize: 13, color: C.slate, lineHeight: 18 },

  replyInputWrap: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: C.white,
    borderTopWidth: 1,
    borderTopColor: C.border,
  },
  replyInput: {
    flex: 1,
    fontSize: 14,
    color: C.navy,
    fontWeight: "500",
    backgroundColor: C.inputBg,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.border,
    paddingHorizontal: 14,
    paddingVertical: 10,
    maxHeight: 100,
  },
  sendBtn: { paddingBottom: 4 },
  sendBtnDisabled: { opacity: 0.4 },

  // Compose modal
  composeField: { gap: 6 },
  composeLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.sub,
    textTransform: "uppercase",
    letterSpacing: 0.6,
  },
  composeInputWrap: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderWidth: 1.5,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 9,
  },
  composeInput: { flex: 1, fontSize: 14, color: C.navy, fontWeight: "600" },
  composeTextAreaWrap: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 12,
    minHeight: 130,
  },
  composeTextArea: {
    fontSize: 14,
    color: C.navy,
    lineHeight: 22,
    minHeight: 100,
  },
  charCount: {
    fontSize: 11,
    color: C.muted,
    textAlign: "right",
    fontWeight: "500",
  },

  infoBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: C.amberBg,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: C.amberText,
    fontWeight: "500",
    lineHeight: 18,
  },

  // Menu
  menuOverlay: {
    flex: 1,
    backgroundColor: "rgba(15,23,42,0.35)",
    justifyContent: "flex-end",
  },
  menuSheet: {
    backgroundColor: C.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 36,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderRadius: 12,
  },
  menuItemText: { fontSize: 15, fontWeight: "600", color: C.navy },
  menuDivider: { height: 1, backgroundColor: C.border, marginVertical: 4 },
});
