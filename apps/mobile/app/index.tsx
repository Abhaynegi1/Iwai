import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import {
  Bell,
  Info,
  Menu,
  Sparkles,
} from "lucide-react-native";
import type { EventEntity, PhotoEntity } from "@iwai/shared";
import { BottomNavigation } from "../src/components/BottomNavigation";
import type { NavTab } from "../src/components/BottomNavigation";
import { Button } from "../src/components/Button";
import { CreateEventModal } from "../src/components/CreateEventModal";
import { EmptyState } from "../src/components/EmptyState";
import { EventCard } from "../src/components/EventCard";
import { LightboxModal } from "../src/components/LightboxModal";
import { PhotoCard } from "../src/components/PhotoCard";
import { ProfileModal } from "../src/components/ProfileModal";
import { UploadBanner } from "../src/components/UploadBanner";
import { UploadModal } from "../src/components/UploadModal";
import { useGuestSession } from "../src/context/GuestSessionContext";
import { useUploadQueue } from "../src/context/UploadQueueContext";
import { apiClient } from "../src/services/api";
import { colors } from "../src/theme/colors";
import { radius } from "../src/theme/radius";
import { typography } from "../src/theme/typography";

// Featured demo events when browsing
const SAMPLE_EVENTS: Array<EventEntity & {
  photosCount: number;
  attendeesCount: number;
  sampleAttendees: Array<{ id: string; nickname: string; avatarUrl?: string | null }>;
  coverImageUrl: string;
}> = [
  {
    id: "sample-1",
    organizationId: "org-1",
    creatorId: "user-1",
    name: "Rhea & Arjun Wedding",
    slug: "rhea-arjun-wedding",
    eventCode: "IWAI-7X3K",
    description: "Celebrating our forever with close family & friends.",
    coverPhotoUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    qrCodeUrl: null,
    location: "Udaipur, India",
    timezone: "UTC",
    startsAt: "2026-08-24T18:00:00Z",
    endsAt: "2026-08-25T04:00:00Z",
    status: "active",
    maxPhotosPerGuest: 50,
    maxTotalPhotos: 1000,
    isGuestUploadEnabled: true,
    isPublicGallery: true,
    storageLimitBytes: 1073741824,
    expiresAt: null,
    coverImageUrl: "https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80",
    photosCount: 212,
    attendeesCount: 45,
    sampleAttendees: [
      { id: "a1", nickname: "Rohan" },
      { id: "a2", nickname: "Priya" },
      { id: "a3", nickname: "Aditya" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "sample-2",
    organizationId: "org-1",
    creatorId: "user-1",
    name: "College Festival 2k26",
    slug: "college-festival-2k26",
    eventCode: "FEST26",
    description: "Annual cultural night & music fest memories.",
    coverPhotoUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
    qrCodeUrl: null,
    location: "Campus Amphitheatre",
    timezone: "UTC",
    startsAt: "2026-08-10T15:00:00Z",
    endsAt: "2026-08-11T00:00:00Z",
    status: "active",
    maxPhotosPerGuest: 100,
    maxTotalPhotos: 2000,
    isGuestUploadEnabled: true,
    isPublicGallery: true,
    storageLimitBytes: 2147483648,
    expiresAt: null,
    coverImageUrl: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&auto=format&fit=crop&q=80",
    photosCount: 98,
    attendeesCount: 32,
    sampleAttendees: [
      { id: "b1", nickname: "Maya" },
      { id: "b2", nickname: "Kabir" },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

type GalleryFilter = "all" | "recent" | "popular";

export default function HomeScreen() {
  const router = useRouter();
  const { session, isLoading: isSessionLoading } = useGuestSession();
  const { queue } = useUploadQueue();

  const [activeTab, setActiveTab] = useState<NavTab>("home");
  const [photos, setPhotos] = useState<PhotoEntity[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntity | null>(null);
  const [galleryFilter, setGalleryFilter] = useState<GalleryFilter>("all");

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [userEvents, setUserEvents] = useState(SAMPLE_EVENTS);

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

  const handleTabChange = (tab: NavTab) => {
    setActiveTab(tab);
    if (tab === "uploads") {
      setShowUploadModal(true);
    } else if (tab === "profile") {
      setShowProfileModal(true);
    }
  };

  const handleCreateEvent = (created: { name: string; date: string; coverUri?: string | null }) => {
    const newEv: EventEntity & {
      photosCount: number;
      attendeesCount: number;
      sampleAttendees: Array<{ id: string; nickname: string; avatarUrl?: string | null }>;
      coverImageUrl: string;
    } = {
      id: `ev-${Date.now()}`,
      organizationId: "org-me",
      creatorId: "user-me",
      name: created.name,
      slug: created.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      eventCode: `IWAI-${Math.random().toString(36).substring(2, 6).toUpperCase()}`,
      description: "Created moments",
      coverPhotoUrl: created.coverUri || SAMPLE_EVENTS[0].coverImageUrl,
      qrCodeUrl: null,
      location: null,
      timezone: "UTC",
      startsAt: new Date().toISOString(),
      endsAt: new Date().toISOString(),
      status: "active" as const,
      maxPhotosPerGuest: 50,
      maxTotalPhotos: 1000,
      isGuestUploadEnabled: true,
      isPublicGallery: true,
      storageLimitBytes: 1073741824,
      expiresAt: null,
      coverImageUrl: created.coverUri || SAMPLE_EVENTS[0].coverImageUrl,
      photosCount: 0,
      attendeesCount: 1,
      sampleAttendees: [{ id: "me", nickname: "You" }],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setUserEvents((prev) => [newEv, ...prev]);
  };

  // ─── Loading Session Splash ───────────────────────────────────────────────
  if (isSessionLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // ─── Unauthenticated / Discovery Home ─────────────────────────────────────
  if (!session) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topIconBtn}
            onPress={() => setShowProfileModal(true)}
            activeOpacity={0.7}
          >
            <Menu size={22} color={colors.textPrimary} />
          </TouchableOpacity>

          {/* iwai brandmark */}
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>iwai</Text>
            <Sparkles size={13} color={colors.secondary} style={styles.brandSparkle} />
          </View>

          <TouchableOpacity
            style={styles.topIconBtn}
            onPress={() => setShowProfileModal(true)}
            activeOpacity={0.7}
          >
            <Bell size={20} color={colors.textPrimary} />
          </TouchableOpacity>
        </View>

        <ScrollView
          contentContainerStyle={styles.homeScrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Greeting */}
          <Text style={styles.greetingText}>Hey, Abhay 👋</Text>

          {/* Editorial Headline */}
          <Text style={styles.headline}>
            Capture. Share.{"\n"}
            <Text style={styles.headlineHighlight}>Relive.</Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.subheadline}>
            All your event memories in one beautiful place.
          </Text>

          {/* Action Row */}
          <View style={styles.actionRow}>
            <Button
              title="+ Create Event"
              onPress={() => setShowCreateModal(true)}
              variant="primary"
              style={styles.primaryActionBtn}
            />
            <Button
              title="Join Event"
              onPress={() => router.push("/join")}
              variant="secondary"
              style={styles.secondaryActionBtn}
            />
          </View>

          {/* Your Events Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Events</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.viewAllText}>View all</Text>
            </TouchableOpacity>
          </View>

          {/* Event Cards Feed */}
          {userEvents.map((ev) => (
            <EventCard
              key={ev.id}
              event={ev}
              onPress={() => router.push("/join")}
            />
          ))}

          {/* Warm Memory Banner */}
          <View style={styles.warmBanner}>
            <View style={styles.warmBannerIcon}>
              <Sparkles size={18} color={colors.secondary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.warmBannerTitle}>Memories bring us together.</Text>
              <Text style={styles.warmBannerSubtitle}>
                Iwai helps you keep them close.
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <BottomNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
          onCameraPress={() => router.push("/camera")}
        />

        {/* Modals */}
        <CreateEventModal
          visible={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onEventCreated={handleCreateEvent}
        />
        <UploadModal
          visible={showUploadModal}
          onClose={() => setShowUploadModal(false)}
          eventName="Selected Event"
        />
        <ProfileModal
          visible={showProfileModal}
          onClose={() => setShowProfileModal(false)}
        />
      </SafeAreaView>
    );
  }

  // ─── Active Joined Event Gallery Screen ───────────────────────────────────
  const event = session.event;
  const attendee = session.attendee;

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Gallery Header */}
      <View style={styles.galleryHeader}>
        <View style={styles.headerLeft}>
          <Text style={styles.galleryEventTitle} numberOfLines={1}>
            {event.name}
          </Text>
          <View style={styles.guestBadge}>
            <View style={styles.onlineDot} />
            <Text style={styles.guestNickname} numberOfLines={1}>
              {attendee.nickname} · {photos.length} photos
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.topIconBtn}
          onPress={() => router.push("/event-info")}
          activeOpacity={0.7}
        >
          <Info size={20} color={colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterChip, galleryFilter === "all" && styles.filterChipActive]}
          onPress={() => setGalleryFilter("all")}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, galleryFilter === "all" && styles.filterTextActive]}>
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, galleryFilter === "recent" && styles.filterChipActive]}
          onPress={() => setGalleryFilter("recent")}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, galleryFilter === "recent" && styles.filterTextActive]}>
            Recent
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.filterChip, galleryFilter === "popular" && styles.filterChipActive]}
          onPress={() => setGalleryFilter("popular")}
          activeOpacity={0.7}
        >
          <Text style={[styles.filterText, galleryFilter === "popular" && styles.filterTextActive]}>
            Popular
          </Text>
        </TouchableOpacity>
      </View>

      {/* Floating Upload Status Banner */}
      <UploadBanner />

      {/* Gallery Feed */}
      {isLoadingPhotos && photos.length === 0 ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : photos.length === 0 ? (
        <EmptyState
          title="No photos yet"
          subtitle="Be the first to capture a moment"
          description="Take a photo or choose from your gallery to share memories with everyone at this event."
          actionTitle="Take First Photo"
          onAction={() => router.push("/camera")}
        />
      ) : (
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.columnWrapper}
          contentContainerStyle={styles.galleryListContent}
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

      {/* Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCameraPress={() => router.push("/camera")}
      />

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        photo={selectedPhoto}
        visible={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        onPhotoDeleted={handlePhotoDeleted}
      />

      {/* Modals */}
      <CreateEventModal
        visible={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleCreateEvent}
      />
      <UploadModal
        visible={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        eventName={event.name}
      />
      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background, // Warm White
  },
  centerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 8,
  },
  topIconBtn: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  brandContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  brandText: {
    ...typography.h2,
    fontFamily: "System",
    fontWeight: "800",
    color: colors.primary, // Deep Forest
    letterSpacing: -0.5,
  },
  brandSparkle: {
    marginBottom: 8,
  },
  homeScrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  greetingText: {
    ...typography.subtext,
    color: colors.textSecondary,
    marginBottom: 6,
    fontWeight: "500",
  },
  headline: {
    ...typography.h1,
    color: colors.textPrimary,
    marginBottom: 6,
  },
  headlineHighlight: {
    color: colors.secondary, // Emerald
  },
  subheadline: {
    ...typography.body,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 28,
  },
  primaryActionBtn: {
    flex: 1,
  },
  secondaryActionBtn: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  sectionTitle: {
    ...typography.h3,
    color: colors.textPrimary,
    fontSize: 18,
  },
  viewAllText: {
    ...typography.subtext,
    color: colors.secondary,
    fontWeight: "600",
  },
  warmBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginTop: 8,
    gap: 12,
  },
  warmBannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.secondaryLight,
    alignItems: "center",
    justifyContent: "center",
  },
  warmBannerTitle: {
    ...typography.bodyBold,
    color: colors.textPrimary,
  },
  warmBannerSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 1,
  },
  // Active Event Gallery styles
  galleryHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  galleryEventTitle: {
    ...typography.h2,
    color: colors.textPrimary,
    fontSize: 20,
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
    backgroundColor: colors.accentMint,
  },
  guestNickname: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  filterRow: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 20,
    marginBottom: 12,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: radius.full,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    ...typography.caption,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  filterTextActive: {
    color: colors.surface,
  },
  galleryListContent: {
    paddingHorizontal: 16,
    paddingBottom: 110,
    paddingTop: 4,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
