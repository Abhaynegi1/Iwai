import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Modal,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ArrowLeft, Heart, Share2, Trash2 } from "lucide-react-native";
import type { PhotoEntity } from "@iwai/shared";
import { useGuestSession } from "../context/GuestSessionContext";
import { apiClient } from "../services/api";
import { colors } from "../theme/colors";
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export interface LightboxModalProps {
  photo: PhotoEntity | null;
  visible: boolean;
  onClose: () => void;
  onPhotoDeleted?: (photoId: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  visible,
  onClose,
  onPhotoDeleted,
}) => {
  const { session } = useGuestSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  // Sync like state whenever active photo changes
  React.useEffect(() => {
    if (photo) {
      setIsLiked(photo.isFavorite ?? false);
      setLikesCount(photo.isFavorite ? 1 : 0);
    }
  }, [photo]);

  if (!photo) return null;

  const getImageUrl = (): string => {
    if (photo.storageKey.startsWith("http")) {
      return photo.storageKey;
    }
    return `${apiClient.getBaseUrl()}/storage/local/${encodeURIComponent(photo.storageKey)}`;
  };

  const isUploader = session?.attendee?.id === photo.attendeeId;
  const isHost = ["host", "co_host"].includes(session?.attendee?.role ?? "");
  const canDelete = isUploader || isHost;

  const handleLike = async () => {
    const nextLiked = !isLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    setIsLiked(nextLiked);
    setLikesCount(nextCount);

    try {
      const res = await apiClient.photos.toggleLike(photo.id);
      setIsLiked(res.data.liked);
      setLikesCount(res.data.likesCount);
    } catch (err) {
      console.error("Failed to like photo in lightbox:", err);
      setIsLiked(!nextLiked);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this memory from ${session?.event?.name || "our event"}: ${getImageUrl()}`,
        url: getImageUrl(),
      });
    } catch (err) {
      console.error("Error sharing photo:", err);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Photo",
      "Are you sure you want to remove this photo from the event gallery?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            setIsDeleting(true);
            try {
              await apiClient.photos.delete(photo.id);
              onPhotoDeleted?.(photo.id);
              onClose();
            } catch (err) {
              console.error("Failed to delete photo:", err);
              Alert.alert("Error", "Could not delete photo.");
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        {/* Top bar controls */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.roundBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <ArrowLeft size={22} color="#FFFDF8" />
          </TouchableOpacity>

          <View style={styles.rightControls}>
            <TouchableOpacity
              style={styles.roundBtn}
              onPress={handleShare}
              activeOpacity={0.7}
            >
              <Share2 size={20} color="#FFFDF8" />
            </TouchableOpacity>

            {canDelete && (
              <TouchableOpacity
                style={[styles.roundBtn, styles.deleteBtn]}
                onPress={handleDelete}
                disabled={isDeleting}
                activeOpacity={0.7}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#FFFDF8" />
                ) : (
                  <Trash2 size={20} color={colors.accentPink} />
                )}
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Full Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getImageUrl() }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Bottom Bar Details */}
        <View style={styles.bottomBar}>
          <View style={styles.bottomRow}>
            <TouchableOpacity
              style={[styles.likeActionBtn, isLiked && styles.likeActionBtnActive]}
              onPress={handleLike}
              activeOpacity={0.8}
            >
              <Heart
                size={20}
                color={isLiked ? "#fff" : "#FFFDF8"}
                fill={isLiked ? colors.accentPink : "transparent"}
              />
              <Text style={styles.likeBtnText}>
                {likesCount > 0 ? `${likesCount} Likes` : "Like"}
              </Text>
            </TouchableOpacity>

            <Text style={styles.timestampText}>
              {new Date(photo.uploadedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>

          {photo.caption ? (
            <Text style={styles.captionText}>{photo.caption}</Text>
          ) : null}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 32, 0.95)",
    justifyContent: "space-between",
  },
  topBar: {
    paddingTop: 54,
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  rightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roundBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteBtn: {
    backgroundColor: "rgba(224, 83, 83, 0.2)",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.72,
  },
  image: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
    backgroundColor: "rgba(15, 23, 32, 0.8)",
  },
  bottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  likeActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "rgba(255, 255, 255, 0.12)",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radius.full,
  },
  likeActionBtnActive: {
    backgroundColor: colors.accentPink,
  },
  likeBtnText: {
    ...typography.caption,
    color: "#fff",
    fontWeight: "600",
  },
  timestampText: {
    ...typography.caption,
    color: "rgba(255, 253, 248, 0.6)",
  },
  captionText: {
    ...typography.body,
    color: colors.surface,
    marginTop: 4,
    lineHeight: 20,
  },
});
