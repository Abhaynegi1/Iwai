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
import { radius } from "../theme/radius";
import { typography } from "../theme/typography";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const COLUMN_WIDTH = (SCREEN_WIDTH - 32 - 10) / 2; // 2 column grid with padding & gap

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
      activeOpacity={0.9}
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
            size={13}
            color={isLiked ? "#fff" : "rgba(255, 255, 255, 0.9)"}
            fill={isLiked ? colors.accentPink : "transparent"}
          />
          {likesCount > 0 && (
            <Text style={styles.likeCount}>
              {likesCount}
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Caption footer if exists */}
      {photo.caption ? (
        <View style={styles.captionContainer}>
          <Text style={styles.captionText} numberOfLines={1}>
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
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    overflow: "hidden",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  imageContainer: {
    width: "100%",
    height: COLUMN_WIDTH * 1.28, // Natural 3:4 photographic ratio
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
    bottom: 6,
    right: 6,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(15, 23, 32, 0.55)",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: radius.full,
    gap: 4,
  },
  likeButtonActive: {
    backgroundColor: colors.accentPink,
  },
  likeCount: {
    ...typography.caption,
    fontSize: 11,
    color: "#fff",
    fontWeight: "700",
  },
  captionContainer: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: colors.surface,
  },
  captionText: {
    ...typography.caption,
    color: colors.textPrimary,
    fontSize: 11,
  },
});
