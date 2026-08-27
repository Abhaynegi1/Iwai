import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Camera,
  Info,
  QrCode,
  Sparkles,
  Users,
} from "lucide-react-native";
import type { PhotoEntity } from "@iwai/shared";
import { LightboxModal } from "../src/components/LightboxModal";
import { PhotoCard } from "../src/components/PhotoCard";
import { UploadBanner } from "../src/components/UploadBanner";
import { useGuestSession } from "../src/context/GuestSessionContext";
import { useUploadQueue } from "../src/context/UploadQueueContext";
import { apiClient } from "../src/services/api";
import { colors } from "../src/theme/colors";
import { typography } from "../src/theme/typography";

export default function HomeScreen() {
  const router = useRouter();
  const { session, isLoading: isSessionLoading } = useGuestSession();
  const { queue } = useUploadQueue();

  const [photos, setPhotos] = useState<PhotoEntity[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntity | null>(null);

  // Fetch photos for the active event
  const fetchPhotos = useCallback(async () => {
    if (!session?.event?.id) return;
    try {
      const response = await apiClient.photos.getEventPhotos(session.event.id, {
        limit: 50,
      });
      setPhotos(response.data);
    } catch (err) {
      console.error("Failed to fetch gallery photos:", err);
    }
  }, [session?.event?.id]);

  useEffect(() => {
    if (session?.event?.id) {
      setIsLoadingPhotos(true);
      fetchPhotos().finally(() => setIsLoadingPhotos(false));
    }
  }, [session?.event?.id, fetchPhotos]);

  // Re-fetch when an upload completes
  useEffect(() => {
    const hasJustCompleted = queue.some((item) => item.status === "completed");
    if (hasJustCompleted) {
      fetchPhotos();
    }
  }, [queue, fetchPhotos]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPhotos();
    setIsRefreshing(false);
  };

  const handlePhotoDeleted = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  // ─── Loading Session Splash ───────────────────────────────────────────────
  if (isSessionLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ─── Unauthenticated / Join Hero ──────────────────────────────────────────
  if (!session) {
    return (
      <SafeAreaView style={styles.heroContainer}>
        <View style={styles.heroContent}>
          {/* Logo mark */}
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>I</Text>
          </View>

          {/* Title & Tagline */}
          <Text style={styles.heroTitle}>IWAI</Text>
          <Text style={styles.heroSubtitle}>Shared Event Memories</Text>
          <Text style={styles.heroDescription}>
            Capture and share photos from weddings, birthdays, and parties in one private, shared gallery.
          </Text>

          {/* Feature highlights */}
          <View style={styles.featureCards}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Sparkles size={18} color={colors.accentGreen} />
              </View>
              <Text style={styles.featureText}>Zero signup friction</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Camera size={18} color={colors.primary} />
              </View>
              <Text style={styles.featureText}>Instant camera sharing</Text>
            </View>

            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Users size={18} color={colors.accentAmber} />
              </View>
              <Text style={styles.featureText}>Live collective gallery</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actionSection}>
            <TouchableOpacity
              style={styles.primaryJoinBtn}
              onPress={() => router.push("/join")}
              activeOpacity={0.85}
            >
              <QrCode size={20} color="#fff" />
              <Text style={styles.primaryJoinBtnText}>Scan QR / Enter Code</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // ─── Active Event Gallery Feed ────────────────────────────────────────────
  const event = session.event;
  const attendee = session.attendee;

  return (
    <SafeAreaView style={styles.galleryContainer}>
      {/* Top Gallery Header */}
      <View style={styles.galleryHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.eventTitle} numberOfLines={1}>
            {event.name}
          </Text>
          <View style={styles.guestBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.guestNickname} numberOfLines={1}>
              {attendee.nickname}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.infoBtn}
          onPress={() => router.push("/event-info")}
          activeOpacity={0.7}
        >
          <Info size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Floating Upload Status Banner */}
      <UploadBanner />

      {/* Photo Grid Feed */}
      {isLoadingPhotos && photos.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : photos.length === 0 ? (
        <View style={styles.emptyGallery}>
          <View style={styles.emptyIconCircle}>
            <Camera size={36} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No photos yet</Text>
          <Text style={styles.emptySubtitle}>
            Be the first guest to capture a moment and share it with everyone here!
          </Text>
          <TouchableOpacity
            style={styles.emptySnapBtn}
            onPress={() => router.push("/camera")}
            activeOpacity={0.8}
          >
            <Camera size={18} color="#fff" />
            <Text style={styles.emptySnapBtnText}>Take First Photo</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
            />
          }
          renderItem={({ item }) => (
            <PhotoCard
              photo={item}
              onPress={(photo) => setSelectedPhoto(photo)}
            />
          )}
        />
      )}

      {/* Floating Bottom Snap Shutter Bar */}
      <View style={styles.floatingBottomBar}>
        <TouchableOpacity
          style={styles.snapFab}
          onPress={() => router.push("/camera")}
          activeOpacity={0.88}
        >
          <Camera size={26} color="#fff" />
          <Text style={styles.snapFabText}>Take Photo</Text>
        </TouchableOpacity>
      </View>

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        photo={selectedPhoto}
        visible={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        onPhotoDeleted={handlePhotoDeleted}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  heroContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  heroContent: {
    flex: 1,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "800",
    color: "#fff",
  },
  heroTitle: {
    ...typography.h1,
    fontSize: 38,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  heroSubtitle: {
    ...typography.h3,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  heroDescription: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  featureCards: {
    width: "100%",
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.borderLight,
    padding: 16,
    gap: 12,
    marginBottom: 36,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "rgba(255, 255, 255, 0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: {
    ...typography.body,
    color: colors.textPrimary,
    fontSize: 15,
  },
  actionSection: {
    width: "100%",
  },
  primaryJoinBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    backgroundColor: colors.primary,
    paddingVertical: 18,
    borderRadius: 16,
    width: "100%",
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryJoinBtnText: {
    ...typography.button,
    color: "#fff",
    fontSize: 17,
  },
  galleryContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  galleryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  eventTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontSize: 22,
  },
  guestBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accentGreen,
  },
  guestNickname: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  infoBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 8,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  emptyGallery: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  emptyIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.primaryLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    marginBottom: 8,
  },
  emptySubtitle: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  emptySnapBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
  },
  emptySnapBtnText: {
    ...typography.button,
    color: "#fff",
  },
  floatingBottomBar: {
    position: "absolute",
    bottom: 28,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 20,
  },
  snapFab: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: colors.primary,
    paddingHorizontal: 28,
    paddingVertical: 16,
    borderRadius: 32,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  snapFabText: {
    ...typography.button,
    color: "#fff",
    fontSize: 16,
  },
});
