import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  ArrowLeft,
  Calendar,
  Camera,
  LogOut,
  Sparkles,
  Users,
} from "lucide-react-native";
import type { AttendeeEntity } from "@iwai/shared";
import { Button } from "../src/components/Button";
import { useGuestSession } from "../src/context/GuestSessionContext";
import { apiClient } from "../src/services/api";
import { colors } from "../src/theme/colors";
import { typography } from "../src/theme/typography";

export default function EventInfoScreen() {
  const router = useRouter();
  const { session, leaveEvent } = useGuestSession();

  const [attendees, setAttendees] = useState<AttendeeEntity[]>([]);
  const [isLoadingAttendees, setIsLoadingAttendees] = useState(true);

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

  const handleLeaveEvent = () => {
    Alert.alert(
      "Leave Event?",
      "You will need the 6-character event code or QR code to rejoin this event gallery.",
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
      <View style={styles.container}>
        <Text style={styles.errorText}>No active event session found.</Text>
      </View>
    );
  }

  const startDateFormatted = new Date(event.startsAt).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
      {/* Top Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <ArrowLeft size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Event Card */}
      <View style={styles.eventCard}>
        <View style={styles.codeBadge}>
          <Sparkles size={14} color={colors.accentGreen} />
          <Text style={styles.codeText}>CODE: {event.eventCode}</Text>
        </View>

        <Text style={styles.eventName}>{event.name}</Text>
        {event.description ? (
          <Text style={styles.eventDescription}>{event.description}</Text>
        ) : null}

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Calendar size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>{startDateFormatted}</Text>
          </View>
          <View style={styles.metaItem}>
            <Camera size={16} color={colors.textSecondary} />
            <Text style={styles.metaText}>
              Limit: {event.maxPhotosPerGuest} photos / guest
            </Text>
          </View>
        </View>
      </View>

      {/* Attendees Section */}
      <View style={styles.sectionHeader}>
        <Users size={20} color={colors.primary} />
        <Text style={styles.sectionTitle}>
          Guests & Hosts ({attendees.length})
        </Text>
      </View>

      {isLoadingAttendees ? (
        <ActivityIndicator size="small" color={colors.primary} style={{ marginVertical: 20 }} />
      ) : (
        <View style={styles.attendeesList}>
          {attendees.map((att) => {
            const isMe = att.id === session?.attendee?.id;
            const isHost = ["host", "co_host"].includes(att.role);

            return (
              <View key={att.id} style={styles.attendeeRow}>
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {att.nickname.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.attendeeInfo}>
                  <View style={styles.nicknameRow}>
                    <Text style={styles.attendeeNickname}>
                      {att.nickname} {isMe && "(You)"}
                    </Text>
                    {isHost && (
                      <View style={styles.hostBadge}>
                        <Text style={styles.hostBadgeText}>Host</Text>
                      </View>
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
      )}

      {/* Leave Event Action */}
      <View style={styles.footerSection}>
        <Button
          title="Leave Event"
          variant="danger"
          icon={<LogOut size={18} color="#fff" />}
          onPress={handleLeaveEvent}
          style={styles.leaveBtn}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 54,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    ...typography.h3,
    color: colors.textPrimary,
  },
  eventCard: {
    backgroundColor: colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 24,
  },
  codeBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentGreenLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  codeText: {
    ...typography.caption,
    color: colors.accentGreen,
    fontWeight: "700",
  },
  eventName: {
    ...typography.h2,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  eventDescription: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  metaRow: {
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
    paddingTop: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metaText: {
    ...typography.subtext,
    color: colors.textSecondary,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontSize: 18,
  },
  attendeesList: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.borderLight,
    overflow: "hidden",
    marginBottom: 32,
  },
  attendeeRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    ...typography.bodyBold,
    color: colors.primary,
  },
  attendeeInfo: {
    flex: 1,
  },
  nicknameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  attendeeNickname: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  hostBadge: {
    backgroundColor: colors.accentAmberLight,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  hostBadgeText: {
    ...typography.caption,
    color: colors.accentAmber,
    fontWeight: "700",
  },
  joinedTime: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  footerSection: {
    marginTop: 8,
  },
  leaveBtn: {
    width: "100%",
  },
  errorText: {
    ...typography.body,
    color: colors.accentPink,
    textAlign: "center",
    marginTop: 100,
  },
});
