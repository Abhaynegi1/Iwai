import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  LogOut,
  Share2,
  Users,
} from "lucide-react-native";
import type { AttendeeEntity } from "@iwai/shared";
import { Avatar } from "../src/components/Avatar";
import { Badge } from "../src/components/Badge";
import { Button } from "../src/components/Button";
import { useGuestSession } from "../src/context/GuestSessionContext";
import { apiClient } from "../src/services/api";
import { colors } from "../src/theme/colors";
import { radius } from "../src/theme/radius";
import { typography } from "../src/theme/typography";

export default function EventInfoScreen() {
  const router = useRouter();
  const { session, leaveEvent } = useGuestSession();

  const [attendees, setAttendees] = useState<AttendeeEntity[]>([]);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(true);
  const [activeTab, setActiveTab] = useState<"photos" | "members">("members");

  const event = session?.event;

  useEffect(() => {
    async function fetchAttendees() {
      if (!event?.id) return;
      try {
        const response = await apiClient.attendees.getEventAttendees(event.id);
        setAttendees(response.data);
      } catch (err) {
        console.error("Failed to load attendees:", err);
      } finally {
        setIsLoadingAttendees(false);
      }
    }

    fetchAttendees();
  }, [event?.id]);

  const handleShareEvent = async () => {
    if (!event) return;
    try {
      await Share.share({
        message: `Join our photo memory gallery for ${event.name}!\nEnter Event Code: ${event.eventCode}`,
      });
    } catch (err) {
      console.error("Share error:", err);
    }
  };

  const handleLeaveEvent = () => {
    Alert.alert(
      "Leave Event?",
      "You will need the event code or QR code to rejoin this event gallery.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave Event",
          style: "destructive",
          onPress: async () => {
            await leaveEvent();
            router.replace("/");
          },
        },
      ],
    );
  };

  if (!event) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.errorText}>No active event session found.</Text>
      </View>
    );
  }

  const startDateFormatted = new Date(event.startsAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const heroUri = "https://images.unsplash.com/photo-1519741497674-611481863552?w=1000&auto=format&fit=crop&q=80";

  return (
    <View style={styles.container}>
      {/* Top Hero Photo */}
      <View style={styles.heroContainer}>
        <Image source={{ uri: heroUri }} style={styles.heroImage} resizeMode="cover" />
        <View style={styles.heroOverlay} />

        {/* Hero Top Buttons */}
        <View style={styles.heroTopBar}>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color="#FFFDF8" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.heroBtn}
            onPress={handleShareEvent}
            activeOpacity={0.7}
          >
            <Share2 size={20} color="#FFFDF8" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Details Sheet */}
      <ScrollView
        style={styles.sheetContainer}
        contentContainerStyle={styles.sheetContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Floating Center Avatar Circle */}
        <View style={styles.avatarPillWrapper}>
          <View style={styles.avatarCircle}>
            <Users size={28} color={colors.primary} />
          </View>
        </View>

        {/* Title & Date */}
        <Text style={styles.eventName}>{event.name}</Text>
        <Text style={styles.eventDate}>{startDateFormatted}</Text>

        {/* Stat Pills */}
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <Text style={styles.statNumber}>212</Text>
            <Text style={styles.statLabel}>Photos</Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{attendees.length || 45}</Text>
            <Text style={styles.statLabel}>Members</Text>
          </View>

          <View style={styles.statPill}>
            <Text style={styles.statNumber}>{event.maxPhotosPerGuest}</Text>
            <Text style={styles.statLabel}>Photo Limit</Text>
          </View>
        </View>

        {/* Event Code Box */}
        <TouchableOpacity
          style={styles.eventCodeBox}
          onPress={handleShareEvent}
          activeOpacity={0.85}
        >
          <Text style={styles.eventCodeLabel}>Event Code</Text>
          <Text style={styles.eventCodeValue}>{event.eventCode}</Text>
          <Text style={styles.eventCodeHint}>Tap to copy and share</Text>
        </TouchableOpacity>

        {/* Share Button */}
        <Button
          title="Share Event"
          onPress={handleShareEvent}
          variant="primary"
          size="lg"
          icon={<Share2 size={18} color="#FFFDF8" />}
          style={styles.shareBtn}
        />

        {/* Segmented Tabs: Photos | Members */}
        <View style={styles.tabsRow}>
          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "photos" && styles.tabBtnActive]}
            onPress={() => setActiveTab("photos")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === "photos" && styles.tabTextActive]}>
              Photos
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabBtn, activeTab === "members" && styles.tabBtnActive]}
            onPress={() => setActiveTab("members")}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === "members" && styles.tabTextActive]}>
              Members ({attendees.length})
            </Text>
          </TouchableOpacity>
        </View>

        {/* Members List */}
        {activeTab === "members" ? (
          isLoadingAttendees ? (
            <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.attendeesList}>
              {attendees.map((att) => {
                const isMe = att.id === session?.attendee?.id;
                const isHost = ["host", "co_host"].includes(att.role);

                return (
                  <View key={att.id} style={styles.attendeeRow}>
                    <Avatar name={att.nickname} size={40} />
                    <View style={styles.attendeeInfo}>
                      <View style={styles.nicknameRow}>
                        <Text style={styles.attendeeNickname}>
                          {att.nickname} {isMe && "(You)"}
                        </Text>
                        {isHost && (
                          <Badge label="Host" variant="emerald" dot />
                        )}
                      </View>
                      <Text style={styles.joinedTime}>
                        Joined {new Date(att.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )
        ) : (
          <View style={styles.photosPlaceholder}>
            <Text style={styles.photosPlaceholderText}>
              All photos taken in this event are live in your gallery.
            </Text>
            <Button
              title="Open Gallery"
              onPress={() => router.back()}
              variant="outline"
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {/* Leave Event Action */}
        <TouchableOpacity
          style={styles.leaveAction}
          onPress={handleLeaveEvent}
          activeOpacity={0.7}
        >
          <LogOut size={16} color={colors.accentPink} />
          <Text style={styles.leaveText}>Leave Event</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  errorText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  heroContainer: {
    width: "100%",
    height: 240,
    position: "relative",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 32, 0.25)",
  },
  heroTopBar: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  heroBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 32, 0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  sheetContainer: {
    flex: 1,
    marginTop: -28,
    backgroundColor: colors.background,
    borderTopLeftRadius: radius.container,
    borderTopRightRadius: radius.container,
  },
  sheetContent: {
    paddingHorizontal: 24,
    paddingTop: 0,
    paddingBottom: 40,
    alignItems: "center",
  },
  avatarPillWrapper: {
    marginTop: -26,
    marginBottom: 12,
  },
  avatarCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0F1720",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  eventName: {
    ...typography.h2,
    color: colors.textPrimary,
    textAlign: "center",
    marginBottom: 4,
  },
  eventDate: {
    ...typography.subtext,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginBottom: 20,
  },
  statPill: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    alignItems: "center",
  },
  statNumber: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  eventCodeBox: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  eventCodeLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 2,
  },
  eventCodeValue: {
    ...typography.h2,
    color: colors.primary,
    letterSpacing: 2,
  },
  eventCodeHint: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: 2,
  },
  shareBtn: {
    width: "100%",
    marginBottom: 24,
  },
  tabsRow: {
    flexDirection: "row",
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 16,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  tabBtnActive: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    ...typography.body,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  tabTextActive: {
    color: colors.primary,
    fontWeight: "700",
  },
  attendeesList: {
    width: "100%",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 24,
  },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  attendeeInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nicknameRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  attendeeNickname: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  joinedTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  photosPlaceholder: {
    padding: 24,
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    width: "100%",
    marginBottom: 24,
  },
  photosPlaceholderText: {
    ...typography.subtext,
    color: colors.textSecondary,
    textAlign: "center",
  },
  leaveAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  leaveText: {
    ...typography.caption,
    color: colors.accentPink,
    fontWeight: "600",
  },
});
