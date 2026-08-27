import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Heart } from "lucide-react-native";
import type { PhotoEntity } from "@iwai/shared";
import { apiClient } from "../services/api";
import { colors } from "../theme/colors";
import { typography } from "../theme/typography";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_WIDTH = (SCREEN_WIDTH - 32 - 12) / 2; // 2 column grid with padding & gap

export interface PhotoCardProps {
  photo: PhotoEntity;
  onPress: (photo: PhotoEntity) => void;
  onLikeToggle?: (photoId: string, isLiked: boolean, count: number) => void;
}

export const PhotoCard: React.FC<PhotoCardProps> = ({
  photo,
  onPress,
  onLikeToggle,
}) => {
  const [isLiked, setIsLiked] = useState(photo.isFavorite ?? false);
  const [likesCount, setLikesCount] = useState(photo.isFavorite ? 1 : 0);
  const [isLiking, setIsLiking] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const getImageUrl = (): string => {
    if (photo.storageKey.startsWith("http")) {
      return photo.storageKey;
    }
    return `${apiClient.getBaseUrl()}/storage/local/${encodeURIComponent(photo.storageKey)}`;
  };

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);

    const nextLiked = !isLiked;
    const nextCount = nextLiked ? likesCount + 1 : Math.max(0, likesCount - 1);

    // Optimistic UI update
    setIsLiked(nextLiked);
    setLikesCount(nextCount);
    onLikeToggle?.(photo.id, nextLiked, nextCount);

    try {
      const response = await apiClient.photos.toggleLike(photo.id);
      setIsLiked(response.data.liked);
      setLikesCount(response.data.likesCount);
      onLikeToggle?.(photo.id, response.data.liked, response.data.likesCount);
    } catch (err) {
      console.error("Failed to toggle like:", err);
      // Revert on error
      setIsLiked(!nextLiked);
      setLikesCount(likesCount);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.88}
      style={styles.card}
      onPress={() => onPress(photo)}
    >
      <View style={styles.imageContainer}>
        {!imageLoaded && (
          <View style={styles.placeholder}>
            <ActivityIndicator size="small" color={colors.textSecondary} />
          </View>
        )}
        <Image
          source={{ uri: getImageUrl() }}
          style={styles.image}
          resizeMode="cover"
          onLoad={() => setImageLoaded(true)}
        />

        {/* Floating Like button */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.likeButton, isLiked && styles.likeButtonActive]}
          onPress={handleLike}
        >
          <Heart
            size={14}
            color={isLiked ? "#fff" : colors.textSecondary}
            fill={isLiked ? colors.accentPink : "transparent"}
          />
          {likesCount > 0 && (
            <Text style={[styles.likeCount, isLiked && styles.likeCountActive]}>
              {likesCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Caption footer if exists */}
      {photo.caption ? (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText} numberOfLines={2}>
            {photo.caption}
          </Text>
        </View>
      ) : null}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: COLUMN_WIDTH,
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  imageContainer: {
    width: "100%",
    height: COLUMN_WIDTH * 1.25, // 4:5 aspect ratio
    backgroundColor: colors.backgroundSecondary,
    position: "relative",
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.backgroundSecondary,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  likeButton: {
    position: "absolute",
    bottom: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 4,
  },
  likeButtonActive: {
    backgroundColor: colors.accentPink,
  },
  likeCount: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "700",
  },
  likeCountActive: {
    color: "#fff",
  },
  captionContainer: {
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  captionText: {
    ...typography.caption,
    color: colors.textPrimary,
    lineHeight: 16,
  },
});
