import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import type { EventEntity } from "@iwai/shared";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";
import { AvatarStack } from "./AvatarStack";

export interface EventCardProps {
  event: EventEntity & {
    photosCount?: number;
    attendeesCount?: number;
    sampleAttendees?: Array<{ id: string; nickname: string; avatarUrl?: string | null }>;
    coverImageUrl?: string | null;
  };
  onPress: () => void;
  variant?: "hero" | "compact";
}

// Fallback high-quality atmospheric event photos
const DEFAULT_COVERS = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop&q=80",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
];

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onPress,
  variant = "hero",
}) => {
  const coverUri =
    event.coverImageUrl ||
    DEFAULT_COVERS[Math.abs(event.name.length) % DEFAULT_COVERS.length];

  const dateFormatted = new Date(event.startsAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const photoCount = event.photosCount ?? 0;

  if (variant === "compact") {
    return (
      <TouchableOpacity
        activeOpacity={0.88}
        onPress={onPress}
        style={styles.compactCard}
      >
        <Image source={{ uri: coverUri }} style={styles.compactImage} resizeMode="cover" />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>
            {event.name}
          </Text>
          <Text style={styles.compactMeta}>
            {dateFormatted} · {photoCount} photos
          </Text>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: coverUri }} style={styles.image} resizeMode="cover" />
        <View style={styles.overlayGradient} />
      </View>

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text style={styles.title} numberOfLines={1}>
              {event.name}
            </Text>
            <Text style={styles.meta}>
              {dateFormatted} · {photoCount} photos
            </Text>
          </View>

          {event.sampleAttendees && event.sampleAttendees.length > 0 && (
            <AvatarStack
              attendees={event.sampleAttendees}
              totalCount={event.attendeesCount}
              avatarSize={26}
            />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface, // Ivory
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    marginBottom: 16,
    shadowColor: "#0F1720",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  imageContainer: {
    width: "100%",
    height: 180,
    backgroundColor: colors.backgroundSecondary,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlayGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(15, 23, 32, 0.08)",
  },
  content: {
    padding: 14,
    backgroundColor: colors.surface,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  title: {
    ...typography.h4,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  meta: {
    ...typography.subtext,
    color: colors.textSecondary,
  },
  // Compact style
  compactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
    marginBottom: 10,
  },
  compactImage: {
    width: 52,
    height: 52,
    borderRadius: radius.control,
    marginRight: 12,
    backgroundColor: colors.backgroundSecondary,
  },
  compactContent: {
    flex: 1,
  },
  compactTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  compactMeta: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
