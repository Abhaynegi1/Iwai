import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Heart, Trash2, X } from "lucide-react-native";
import type { PhotoEntity } from "@iwai/shared";
import { useGuestSession } from "../context/GuestSessionContext";
import { apiClient } from "../services/api";
import { colors } from "../theme/colors";
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

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);

    try {
      await apiClient.photos.delete(photo.id);
      onPhotoDeleted?.(photo.id);
      onClose();
    } catch (err) {
      console.error("Failed to delete photo:", err);
      setIsDeleting(false);
    }
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
            style={styles.controlBtn}
            onPress={onClose}
            activeOpacity={0.7}
          >
            <X size={24} color="#fff" />
          </TouchableOpacity>

          <View style={styles.rightControls}>
            {canDelete && (
              <TouchableOpacity
                style={[styles.controlBtn, styles.deleteBtn]}
                onPress={handleDelete}
                disabled={isDeleting}
                activeOpacity={0.7}
              >
                {isDeleting ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Trash2 size={20} color={colors.accentPink} />
                )}
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.controlBtn, isLiked && styles.likedBtn]}
              onPress={handleLike}
              activeOpacity={0.7}
            >
              <Heart
                size={22}
                color={isLiked ? "#fff" : "#fff"}
                fill={isLiked ? colors.accentPink : "transparent"}
              />
              {likesCount > 0 && (
                <Text style={styles.likeCountText}>{likesCount}</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Center full image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: getImageUrl() }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        {/* Bottom details card */}
        {photo.caption || photo.uploadedAt ? (
          <View style={styles.bottomSheet}>
            {photo.caption ? (
              <Text style={styles.captionText}>{photo.caption}</Text>
            ) : null}
            <Text style={styles.timestampText}>
              Shared on {new Date(photo.uploadedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </Text>
          </View>
        ) : null}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.94)",
    justifyContent: "space-between",
  },
  topBar: {
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  rightControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  controlBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
  },
  deleteBtn: {
    backgroundColor: "rgba(244, 63, 94, 0.18)",
  },
  likedBtn: {
    backgroundColor: colors.accentPink,
    paddingHorizontal: 12,
    width: "auto",
  },
  likeCountText: {
    ...typography.caption,
    color: "#fff",
    fontWeight: "700",
  },
  imageContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  image: {
    width: SCREEN_WIDTH,
    height: "100%",
  },
  bottomSheet: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 16,
    backgroundColor: "rgba(15, 13, 35, 0.8)",
  },
  captionText: {
    ...typography.body,
    color: "#fff",
    marginBottom: 6,
  },
  timestampText: {
    ...typography.caption,
    color: colors.textSecondary,
  },
});
