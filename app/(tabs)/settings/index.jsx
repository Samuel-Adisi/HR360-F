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
  LockClosedIcon,
  MoonIcon,
  QuestionMarkCircleIcon,
  UserIcon,
} from "react-native-heroicons/outline";

import { ProfileAvatar } from "../../../src/components/ProfileAvatar";
import { monoText, sansText, serifText } from "../../../src/theme/fonts";

const ACCENT = "#0F766E";
const RED_ACCENT = "#E11D48";
const BG_LIGHT = "#F8FAFC";

export default function SettingsHome() {
  const [username, setUsername] = useState("");
  const [avatarUri, setAvatarUri] = useState(null);
  const [emailHint, setEmailHint] = useState("");

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
      {/* Custom Safe Area Header handled via padding in ScrollView */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Profile Hero Section */}
        <View style={styles.profileSection}>
          <Text style={[styles.pageTitle, serifText()]}>Settings</Text>
          <View style={styles.avatarWrap}>
             <ProfileAvatar
              uri={avatarUri}
              nameHint={username}
              outerSize={80}
              onPress={() => {}}
            />
          </View>
          <Text style={[styles.userName, serifText()]}>{username}</Text>
          <Text style={[styles.userEmail, sansText()]}>{emailHint}</Text>
          
          <Pressable 
            style={({pressed}) => [styles.editProfileBtn, pressed && {opacity: 0.8}]}
            onPress={() => handleMockPress("Edit Profile")}
          >
            <Text style={[styles.editProfileText, sansText()]}>Edit Profile</Text>
          </Pressable>
        </View>

        {/* Account Options */}
        <View style={styles.optionsGroup}>
          <Text style={[styles.groupTitle, sansText()]}>Preferences</Text>
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
            <View style={styles.divider} />
            <OptionRow 
              title="Appearance" 
              icon={<MoonIcon size={20} color={ACCENT} />} 
              onPress={() => handleMockPress("Theme Selection")}
            />
          </View>
        </View>

        {/* Security Options */}
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

        {/* Other */}
        <View style={styles.optionsGroup}>
          <Text style={[styles.groupTitle, sansText()]}>Support</Text>
          <View style={styles.card}>
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
            style={({ pressed }) => [
              styles.logoutButton,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={[styles.logoutText, sansText()]}>Sign Out</Text>
          </Pressable>
        </View>

        <View style={{ height: 60 }} />
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
    paddingTop: 60,
  },
  pageTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0F172A",
    alignSelf: "flex-start",
    marginBottom: 24,
  },
  profileSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarWrap: {
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0F172A",
  },
  userEmail: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 4,
  },
  editProfileBtn: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: "#F1F5F9",
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
    fontSize: 13,
    fontWeight: "600",
    color: "#94A3B8",
    textTransform: "uppercase",
    letterSpacing: 0.5,
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
    padding: 16,
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F0FDF4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#1E293B",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginLeft: 66,
  },
  logoutWrap: {
    marginTop: 16,
  },
  logoutButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: RED_ACCENT,
    padding: 16,
    alignItems: "center",
  },
  logoutText: {
    color: RED_ACCENT,
    fontSize: 16,
    fontWeight: "600",
  },
});
