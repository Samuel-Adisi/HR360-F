import { useRouter } from "expo-router";
import { ScrollView, StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ChevronDownIcon, ArrowRightIcon } from "react-native-heroicons/outline";
import { Image } from "expo-image";

import { monoText, sansText, serifText } from "../src/theme/fonts";

const BG_LIGHT = "#F8FAFC";
const ACCENT = "#0F766E";

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    name: "Gustavo",
    eventText: ", has birthday",
    date: "Wed, 16 Feb 2023",
    uri: "https://i.pravatar.cc/150?u=g",
    badgeType: "cake",
  },
  {
    id: "2",
    name: "Alena",
    eventText: ", has a work anniversary",
    date: "2 year in Lebona Digital Agency",
    uri: "https://i.pravatar.cc/150?u=a",
    badgeType: "medal",
  },
  {
    id: "3",
    name: "Labor and Solidarity Day",
    eventText: "",
    date: "Public Holiday • Full day",
    uri: null,
    isHoliday: true,
    badgeType: "umbrella",
  },
];

export default function NotificationsScreen() {
  const router = useRouter();

  const renderBadge = (type) => {
    let emoji = "";
    let bgColor = "#E0F2FE"; // Light blue Default
    if (type === "cake") { emoji = "🎂"; bgColor = "#E0F2FE"; }
    else if (type === "medal") { emoji = "🎖️"; bgColor = "#DCFCE7"; }
    else if (type === "umbrella") { emoji = "⛱️"; bgColor = "#F3E8FF"; }

    return (
      <View style={[styles.badgeContainer, { backgroundColor: bgColor }]}>
        <Text style={styles.badgeEmoji}>{emoji}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <SafeAreaView edges={["top"]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.pageTitle, serifText()]}>Notifications</Text>
          <Pressable 
            style={({ pressed }) => [styles.closeBtn, pressed && { opacity: 0.7 }]}
            onPress={() => router.back()}
          >
            <ChevronDownIcon size={24} color="#0F172A" />
          </Pressable>
        </View>
      </SafeAreaView>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Main Inspired Card block */}
        <View style={styles.eventsCard}>
          <View style={styles.cardHeader}>
            <Text style={[styles.cardTitle, sansText()]}>Upcoming events</Text>
            <Pressable onPress={() => {}}>
              <Text style={[styles.showAllText, sansText()]}>Show All</Text>
            </Pressable>
          </View>

          <View style={styles.listContainer}>
            {MOCK_NOTIFICATIONS.map((item, index) => {
              const showDivider = index < MOCK_NOTIFICATIONS.length - 1;

              return (
                <View key={item.id}>
                  <Pressable style={({pressed}) => [styles.eventRow, pressed && {backgroundColor: "#F8FAFC"}]}>
                    <View style={styles.avatarWrap}>
                      {item.isHoliday ? (
                        <View style={styles.holidayAvatar}>
                           <Text style={{fontSize: 20}}>🌍</Text>
                        </View>
                      ) : (
                        <Image
                          source={{ uri: item.uri }}
                          style={styles.avatar}
                          contentFit="cover"
                        />
                      )}
                      
                      {renderBadge(item.badgeType)}
                    </View>

                    <View style={styles.textColumn}>
                      <Text style={[styles.primaryText, sansText()]} numberOfLines={1}>
                        <Text style={{fontWeight: "700"}}>{item.name}</Text>
                        {item.eventText}
                      </Text>
                      <Text style={[styles.secondaryText, sansText()]} numberOfLines={1}>
                        {item.date}
                      </Text>
                    </View>

                    <View style={styles.arrowCircle}>
                      <ArrowRightIcon size={16} color="#0F172A" />
                    </View>
                  </Pressable>

                  {showDivider && <View style={styles.divider} />}
                </View>
              );
            })}
          </View>

        </View>

      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_LIGHT,
  },
  header: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pageTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0F172A",
  },
  closeBtn: {
    padding: 4,
    backgroundColor: "#F1F5F9",
    borderRadius: 20,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 60,
  },
  eventsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  showAllText: {
    fontSize: 14,
    color: "#64748B",
    fontWeight: "600",
  },
  listContainer: {
    marginTop: 4,
  },
  eventRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 12,
  },
  avatarWrap: {
    position: "relative",
    marginRight: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#E2E8F0",
  },
  holidayAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4F46E5", // Deep purple/blue as in image
    alignItems: "center",
    justifyContent: "center",
  },
  badgeContainer: {
    position: "absolute",
    bottom: -2,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  badgeEmoji: {
    fontSize: 10,
  },
  textColumn: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 10,
  },
  primaryText: {
    fontSize: 15,
    color: "#0F172A",
    marginBottom: 4,
  },
  secondaryText: {
    fontSize: 13,
    color: "#64748B",
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F8FAFC",
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#F1F5F9",
    marginVertical: 4,
    marginLeft: 64, // Aligns roughly with start of text
  },
});
