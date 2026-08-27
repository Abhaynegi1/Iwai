import React from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { X } from "lucide-react-native";
import { useGuestSession } from "../context/GuestSessionContext";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";
import { Avatar } from "./Avatar";
import { Button } from "./Button";

export interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectEvent?: (eventId: string) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  visible,
  onClose,
}) => {
  const { session, leaveEvent } = useGuestSession();

  const nickname = session?.attendee?.nickname || "Abhay Negi";
  const userHandle = `@${nickname.toLowerCase().replace(/\s+/g, "_")}`;

  const handleSignOut = () => {
    Alert.alert(
      "Leave Current Session?",
      "You will disconnect from the current active event.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Leave",
          style: "destructive",
          onPress: async () => {
            await leaveEvent();
            onClose();
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <X size={20} color={colors.textPrimary} />
            </TouchableOpacity>
          </View>

          {/* Profile Card */}
          <View style={styles.profileHero}>
            <Avatar name={nickname} size={72} />
            <Text style={styles.profileName}>{nickname}</Text>
            <Text style={styles.profileHandle}>{userHandle}</Text>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>8</Text>
                <Text style={styles.statLabel}>Events</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>356</Text>
                <Text style={styles.statLabel}>Photos</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>12</Text>
                <Text style={styles.statLabel}>Uploads</Text>
              </View>
            </View>
          </View>

          {/* Current Event Section */}
          {session?.event && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Event</Text>
              <View style={styles.activeEventCard}>
                <View style={styles.activeEventLeft}>
                  <Text style={styles.activeEventName}>{session.event.name}</Text>
                  <Text style={styles.activeEventCode}>Code: {session.event.eventCode}</Text>
                </View>
                <Button
                  title="Leave"
                  variant="outline"
                  size="sm"
                  onPress={handleSignOut}
                />
              </View>
            </View>
          )}

          {/* About Iwai */}
          <View style={styles.aboutCard}>
            <Text style={styles.aboutTitle}>About Iwai</Text>
            <Text style={styles.aboutText}>
              A quiet, collective photo memory space for weddings, gatherings, and celebrations.
            </Text>
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingTop: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerTitle: {
    ...typography.h2,
    color: colors.textPrimary,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  profileHero: {
    backgroundColor: colors.surface,
    borderRadius: radius.container,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
    alignItems: "center",
    marginBottom: 24,
  },
  profileName: {
    ...typography.h3,
    color: colors.textPrimary,
    marginTop: 12,
  },
  profileHandle: {
    ...typography.subtext,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 16,
  },
  statItem: {
    alignItems: "center",
    flex: 1,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: colors.border,
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 10,
  },
  activeEventCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
  },
  activeEventLeft: {
    flex: 1,
    marginRight: 12,
  },
  activeEventName: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  activeEventCode: {
    ...typography.caption,
    color: colors.secondary,
    marginTop: 2,
  },
  aboutCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 8,
  },
  aboutTitle: {
    ...typography.subtext,
    color: colors.textPrimary,
    fontWeight: "600",
    marginBottom: 4,
  },
  aboutText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
