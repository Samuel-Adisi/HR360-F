import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  BellIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  LockClosedIcon,
  PencilSquareIcon,
  QuestionMarkCircleIcon,
  UserIcon,
} from "react-native-heroicons/outline";

import { ProfileAvatar } from "../../../src/components/ProfileAvatar";
import { monoText, sansText, serifText } from "../../../src/theme/fonts";

const ACCENT = "#0F766E";
const RED_ACCENT = "#E11D48";
const BG_LIGHT = "#F8FAFC";

export default function ProfileHome() {
  const [username, setUsername] = useState("");
  const [avatarUri, setAvatarUri] = useState(null);
  const [emailHint, setEmailHint] = useState("");
  const [role, setRole] = useState("");

  const loadUser = useCallback(async () => {
    try {
      const name = await AsyncStorage.getItem("username");
      setUsername(name || "User");
      const raw = await AsyncStorage.getItem("user");
      if (raw) {
        try {
          const u = JSON.parse(raw);
          const pic = u.avatar || u.photo || u.profile_picture || null;
          setAvatarUri(typeof pic === "string" && pic.length ? pic : null);
          setEmailHint(u.email || "user@company.com");
          setRole(u.role || u.position || "");
        } catch {
          setEmailHint("user@company.com");
        }
      } else {
        setEmailHint("user@company.com");
      }
    } catch {
      setUsername("User");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadUser();
    }, [loadUser])
  );

  const confirmSignOut = () => {
    Alert.alert("Sign out", "Are you sure you want to end your session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign out",
        style: "destructive",
        onPress: async () => {
          await AsyncStorage.multiRemove([
            "access_token",
            "refresh_token",
            "username",
            "user",
          ]);
          router.replace("/login");
        },
      },
    ]);
  };

  const handleMockPress = (action) => {
    Alert.alert("Coming soon", `${action} will be available shortly.`);
  };

  const OptionRow = ({ icon, title, isDestructive = false, onPress }) => (
    <View>
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [styles.optionRow, pressed && { backgroundColor: "#F1F5F9" }]}
      >
        <View style={styles.optionLeft}>
          <View style={[styles.iconBox, isDestructive && { backgroundColor: "#FFF1F2" }]}>
            {icon}
          </View>
          <Text style={[styles.optionTitle, sansText(), isDestructive && { color: RED_ACCENT }]}>
            {title}
          </Text>
        </View>
        {!isDestructive && <ChevronRightIcon size={20} color="#CBD5E1" />}
      </Pressable>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Profile Hero Section */}
        <View style={styles.profileSection}>
          <View style={styles.avatarWrap}>
            <ProfileAvatar
              uri={avatarUri}
              nameHint={username}
              outerSize={88}
              onPress={() => handleMockPress("Change photo")}
            />
            <Pressable
              style={styles.editPhotoBtn}
              onPress={() => handleMockPress("Change photo")}
            >
              <PencilSquareIcon size={14} color="#FFFFFF" />
            </Pressable>
          </View>
          <Text style={[styles.userName, serifText()]}>{username}</Text>
          {!!role && (
            <Text style={[styles.userRole, sansText()]}>{role}</Text>
          )}
          <Text style={[styles.userEmail, sansText()]}>{emailHint}</Text>

          <Pressable
            style={({ pressed }) => [styles.editProfileBtn, pressed && { opacity: 0.8 }]}
            onPress={() => handleMockPress("Edit Profile")}
          >
            <Text style={[styles.editProfileText, sansText()]}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Account */}
        <View style={styles.optionsGroup}>
          <Text style={[styles.groupTitle, sansText()]}>Account</Text>
          <View style={styles.card}>
            <OptionRow
              title="Personal Information"
              icon={<UserIcon size={20} color={ACCENT} />}
              onPress={() => handleMockPress("Personal Info")}
            />
            <View style={styles.divider} />
            <OptionRow
              title="Push Notifications"
              icon={<BellIcon size={20} color={ACCENT} />}
              onPress={() => handleMockPress("Notifications")}
            />
          </View>
        </View>

        {/* Security */}
        <View style={styles.optionsGroup}>
          <Text style={[styles.groupTitle, sansText()]}>Security</Text>
          <View style={styles.card}>
            <OptionRow
              title="Change Password"
              icon={<LockClosedIcon size={20} color={ACCENT} />}
              onPress={() => handleMockPress("Change Password")}
            />
          </View>
        </View>

        {/* App Settings — navigates into the settings sub-screen */}
        <View style={styles.optionsGroup}>
          <Text style={[styles.groupTitle, sansText()]}>App</Text>
          <View style={styles.card}>
            <OptionRow
              title="Settings"
              icon={<Cog6ToothIcon size={20} color={ACCENT} />}
              onPress={() => router.push("/profile/settings")}
            />
            <View style={styles.divider} />
            <OptionRow
              title="Help Center"
              icon={<QuestionMarkCircleIcon size={20} color={ACCENT} />}
              onPress={() => handleMockPress("Help Center")}
            />
          </View>
        </View>

        {/* Sign Out */}
        <View style={styles.logoutWrap}>
          <Pressable
            onPress={confirmSignOut}
            style={({ pressed }) => [styles.logoutButton, pressed && { opacity: 0.8 }]}
          >
            <Text style={[styles.logoutText, sansText()]}>Sign Out</Text>
          </Pressable>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 72,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarWrap: {
    marginBottom: 14,
    position: "relative",
  },
  editPhotoBtn: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: ACCENT,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  userRole: {
    fontSize: 13,
    fontWeight: "600",
    color: ACCENT,
    marginTop: 3,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  userEmail: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  editProfileBtn: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  editProfileText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#0F172A",
  },
  optionsGroup: {
    marginBottom: 24,
  },
  groupTitle: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
    marginLeft: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  optionTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1E293B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 62,
  },
  logoutWrap: {
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RED_ACCENT,
    padding: 15,
    alignItems: "center",
  },
  logoutText: {
    color: RED_ACCENT,
    fontSize: 15,
    fontWeight: "600",
  },
});
