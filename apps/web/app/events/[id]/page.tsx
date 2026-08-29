"use client";

import React, { useEffect, useState, useCallback, use, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Calendar,
  Camera,
  Check,
  Copy,
  Image as ImageIcon,
  MapPin,
  Printer,
  QrCode,
  Settings,
  Trash2,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import type {
  AttendeeEntity,
  AttendeeRole,
  EventEntity,
  PhotoEntity,
} from "@iwai/shared";
import type { UpdateEventInput } from "@iwai/validation";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/Button";
import { Card } from "../../../components/ui/Card";
import { Badge } from "../../../components/ui/Badge";
import { Input } from "../../../components/ui/Input";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function EventWorkspacePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;
  const router = useRouter();

  const [event, setEvent] = useState<
    (EventEntity & { stats?: { attendeeCount: number; photoCount: number } }) | null
  >(null);
  const [photos, setPhotos] = useState<PhotoEntity[]>([]);
  const [attendees, setAttendees] = useState<AttendeeEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active tab
  const [activeTab, setActiveTab] = useState<
    "overview" | "qr" | "gallery" | "attendees" | "settings"
  >("overview");

  // Copy state
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Lightbox
  const [selectedPhoto, setSelectedPhoto] = useState<PhotoEntity | null>(null);

  // Printable poster modal
  const [showPosterModal, setShowPosterModal] = useState(false);

  // Settings form state
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editLocation, setEditLocation] = useState("");
  const [editMaxPhotosPerGuest, setEditMaxPhotosPerGuest] = useState(50);
  const [editMaxTotalPhotos, setEditMaxTotalPhotos] = useState(250);
  const [editIsGuestUploadEnabled, setEditIsGuestUploadEnabled] = useState(true);
  const [editStatus, setEditStatus] = useState<string>("active");
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSuccess, setSettingsSuccess] = useState(false);

  const printAreaRef = useRef<HTMLDivElement>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [eventRes, photosRes, attendeesRes] = await Promise.all([
        api.events.getById(eventId),
        api.photos.getEventPhotos(eventId, { limit: 100 }),
        api.attendees.getEventAttendees(eventId),
      ]);

      if (eventRes.success && eventRes.data) {
        setEvent(eventRes.data);
        setEditName(eventRes.data.name);
        setEditDesc(eventRes.data.description || "");
        setEditLocation(eventRes.data.location || "");
        setEditMaxPhotosPerGuest(eventRes.data.maxPhotosPerGuest);
        setEditMaxTotalPhotos(eventRes.data.maxTotalPhotos);
        setEditIsGuestUploadEnabled(eventRes.data.isGuestUploadEnabled);
        setEditStatus(eventRes.data.status);
      }

      if (photosRes.success && photosRes.data) {
        setPhotos(photosRes.data);
      }

      if (attendeesRes.success && attendeesRes.data) {
        setAttendees(attendeesRes.data);
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to load event data.");
    } finally {
      setLoading(false);
    }
  }, [eventId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Copy helpers
  const handleCopyCode = () => {
    if (!event) return;
    navigator.clipboard.writeText(event.eventCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const getJoinUrl = () => {
    if (!event) return "";
    if (typeof window !== "undefined") {
      return `${window.location.origin}/join/${event.eventCode}`;
    }
    return `https://iwai.app/join/${event.eventCode}`;
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(getJoinUrl());
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Delete photo
  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm("Are you sure you want to remove this photo from the shared gallery?")) {
      return;
    }

    try {
      await api.photos.delete(photoId);
      setPhotos((prev) => prev.filter((p) => p.id !== photoId));
      if (selectedPhoto?.id === photoId) {
        setSelectedPhoto(null);
      }
    } catch (err: unknown) {
      alert((err as Error)?.message || "Failed to delete photo.");
    }
  };

  // Role update
  const handleRoleChange = async (attendeeId: string, newRole: AttendeeRole) => {
    try {
      await api.attendees.updateRole(eventId, attendeeId, newRole);
      setAttendees((prev) =>
        prev.map((a) => (a.id === attendeeId ? { ...a, role: newRole } : a)),
      );
    } catch (err: unknown) {
      alert((err as Error)?.message || "Failed to update attendee role.");
    }
  };

  // Save settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsSuccess(false);

    try {
      const res = await api.events.update(eventId, {
        name: editName.trim(),
        description: editDesc.trim() || undefined,
        location: editLocation.trim() || undefined,
        maxPhotosPerGuest: Number(editMaxPhotosPerGuest),
        maxTotalPhotos: Number(editMaxTotalPhotos),
        isGuestUploadEnabled: editIsGuestUploadEnabled,
        status: editStatus as UpdateEventInput["status"],
      });

      if (res.success && res.data) {
        setEvent((prev) => (prev ? { ...prev, ...res.data } : null));
        setSettingsSuccess(true);
        setTimeout(() => setSettingsSuccess(false), 3000);
      }
    } catch (err: unknown) {
      alert((err as Error)?.message || "Failed to update event settings.");
    } finally {
      setSavingSettings(false);
    }
  };

  // Delete Event
  const handleDeleteEvent = async () => {
    if (
      !confirm(
        `Are you sure you want to permanently delete "${event?.name}"? All photos and guest data will be removed.`,
      )
    ) {
      return;
    }

    try {
      await api.events.delete(eventId);
      router.push("/dashboard");
    } catch (err: unknown) {
      alert((err as Error)?.message || "Failed to delete event.");
    }
  };

  // Print poster
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-ink-secondary">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-forest border-t-transparent" />
        <p className="mt-3 text-sm">Loading event workspace...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <div className="rounded-xl border border-coral/30 bg-coral/10 p-4 text-coral text-sm">
          {error || "Event not found."}
        </div>
        <Link href="/dashboard">
          <Button variant="secondary">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  const photoCount = photos.length;
  const quotaPercent = Math.min(
    100,
    Math.round((photoCount / event.maxTotalPhotos) * 100),
  );

  return (
    <div className="space-y-8">
      {/* Back to dashboard */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {/* Event Header Banner */}
      <div className="rounded-3xl border border-warm-300 bg-surface p-6 sm:p-8 shadow-[0_8px_30px_rgba(18,60,53,0.06)] relative overflow-hidden">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                variant={
                  event.status === "active"
                    ? "emerald"
                    : event.status === "draft"
                    ? "neutral"
                    : "warning"
                }
              >
                {event.status.toUpperCase()}
              </Badge>
              {event.location && (
                <span className="flex items-center gap-1 text-xs text-ink-secondary">
                  <MapPin className="h-3 w-3 text-ink-muted" />
                  {event.location}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-ink font-serif">
              {event.name}
            </h1>

            {event.description && (
              <p className="text-sm text-ink-secondary max-w-2xl">
                {event.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-ink-secondary pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-forest" />
                {new Date(event.startsAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-emerald" />
                {attendees.length} Joined Guest{attendees.length === 1 ? "" : "s"}
              </span>
              <span className="flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-[#B86B14]" />
                {photoCount} / {event.maxTotalPhotos} Photos
              </span>
            </div>
          </div>

          {/* Event Code Pill & Fast Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-warm-300 bg-warm-50 px-4 py-2.5">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-ink-secondary">
                  Event Code
                </p>
                <p className="font-mono text-xl font-bold tracking-wider text-forest">
                  {event.eventCode}
                </p>
              </div>
              <button
                onClick={handleCopyCode}
                className="rounded-xl bg-surface border border-warm-300 p-2 text-ink-secondary hover:bg-warm-200 hover:text-ink transition-colors"
                title="Copy code"
              >
                {copiedCode ? (
                  <Check className="h-4 w-4 text-emerald" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setShowPosterModal(true)}
              className="gap-2 shadow-sm"
            >
              <Printer className="h-4 w-4" />
              Print QR Flyer
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-warm-300 pb-px overflow-x-auto">
        {[
          { id: "overview", label: "Overview & QR", icon: QrCode },
          {
            id: "gallery",
            label: `Gallery (${photoCount})`,
            icon: ImageIcon,
          },
          {
            id: "attendees",
            label: `Guests (${attendees.length})`,
            icon: Users,
          },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() =>
                setActiveTab(
                  tab.id as
                    | "overview"
                    | "qr"
                    | "gallery"
                    | "attendees"
                    | "settings",
                )
              }
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all duration-150 whitespace-nowrap ${
                isActive
                  ? "border-forest text-forest font-semibold"
                  : "border-transparent text-ink-secondary hover:text-ink hover:border-warm-300"
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & QR */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Metrics & Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quota Progress */}
            <Card className="space-y-4 bg-surface">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-forest" />
                  <h3 className="font-bold text-ink font-serif">Event Storage Quota</h3>
                </div>
                <span className="text-xs font-semibold text-ink-secondary">
                  {photoCount} of {event.maxTotalPhotos} photos used ({quotaPercent}%)
                </span>
              </div>
              <div className="w-full bg-warm-200 rounded-full h-3 overflow-hidden p-0.5 border border-warm-300">
                <div
                  className="bg-forest h-full rounded-full transition-all duration-500"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-ink-secondary">
                <span>Guest Limit: {event.maxPhotosPerGuest} photos / guest</span>
                <span>
                  Guest Uploads:{" "}
                  <strong className={event.isGuestUploadEnabled ? "text-emerald" : "text-coral"}>
                    {event.isGuestUploadEnabled ? "Enabled" : "Disabled"}
                  </strong>
                </span>
              </div>
            </Card>

            {/* Quick Share Link */}
            <Card className="space-y-4 bg-surface">
              <h3 className="font-bold text-ink font-serif">Direct Guest Join Link</h3>
              <p className="text-xs text-ink-secondary">
                Guests can click this link on mobile or scan the QR code to open IWAI instantly without an app store download.
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={getJoinUrl()}
                  className="flex-1 rounded-xl bg-warm-50 border border-warm-300 px-3.5 py-2.5 text-xs font-mono text-ink select-all"
                />
                <Button size="sm" variant="secondary" onClick={handleCopyLink}>
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 text-emerald" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Recent Uploads Preview */}
            <Card className="space-y-4 bg-surface">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-ink font-serif">Recent Uploads</h3>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className="text-xs text-forest hover:text-forest-hover font-semibold underline underline-offset-2"
                >
                  View all ({photoCount})
                </button>
              </div>

              {photos.length === 0 ? (
                <div className="py-8 text-center text-ink-muted text-xs">
                  No photos uploaded yet. Scan the QR code to take your first photo!
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
                  {photos.slice(0, 6).map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setActiveTab("gallery");
                      }}
                      className="aspect-square rounded-xl overflow-hidden bg-warm-200 border border-warm-300 relative group cursor-pointer"
                    >
                      <img
                        src={
                          (photo as PhotoEntity & { publicUrl?: string })
                            .publicUrl || "/placeholder.png"
                        }
                        alt={photo.caption || "Guest upload"}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Col: Live QR Card */}
          <div className="space-y-6">
            <Card className="flex flex-col items-center text-center p-8 space-y-6 bg-surface border-warm-300 shadow-md">
              <div>
                <Badge variant="brand" className="mb-2">
                  GUEST ACCESS QR
                </Badge>
                <h3 className="text-lg font-bold text-ink font-serif">
                  Scan to Share Photos
                </h3>
                <p className="text-xs text-ink-secondary mt-1">
                  Point any smartphone camera at this code
                </p>
              </div>

              {/* QR Container on crisp white */}
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-warm-300">
                <QRCodeSVG
                  value={getJoinUrl()}
                  size={200}
                  level="H"
                  fgColor="#123C35"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest text-ink-secondary">
                  Event Code
                </p>
                <p className="font-mono text-2xl font-black text-forest tracking-wider">
                  {event.eventCode}
                </p>
              </div>

              <div className="w-full pt-2 flex flex-col gap-2.5">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full gap-2"
                  onClick={() => setShowPosterModal(true)}
                >
                  <Printer className="h-4 w-4" />
                  Print Venue Flyer
                </Button>
                <Button
                  variant="secondary"
                  size="md"
                  className="w-full gap-2"
                  onClick={handleCopyLink}
                >
                  <Copy className="h-4 w-4" />
                  Copy Direct Link
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: GALLERY & MODERATION */}
      {activeTab === "gallery" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-ink font-serif">Event Gallery</h2>
              <p className="text-xs text-ink-secondary">
                Live stream of all photos uploaded by attendees. Organizers can view, download, or moderate photos.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={loadData}
                className="gap-1.5"
              >
                Refresh Gallery
              </Button>
            </div>
          </div>

          {photos.length === 0 ? (
            <Card className="text-center py-16 bg-surface">
              <ImageIcon className="mx-auto h-12 w-12 text-ink-muted mb-3" />
              <h3 className="text-base font-bold text-ink font-serif">No photos captured yet</h3>
              <p className="text-xs text-ink-secondary max-w-sm mx-auto mt-1">
                Once guests scan your QR code and snap photos, they will appear in this shared gallery in real-time.
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {photos.map((photo) => {
                const photoUrl =
                  (photo as PhotoEntity & { publicUrl?: string }).publicUrl ||
                  "";
                const uploadTime = new Date(photo.uploadedAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div
                    key={photo.id}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-warm-200 border border-warm-300 shadow-sm cursor-pointer hover:border-forest/40 transition-all duration-200"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photoUrl}
                      alt={photo.caption || "Guest photo"}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3" />

                    {/* Top overlay action */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id);
                        }}
                        className="p-2 rounded-xl bg-coral text-white hover:bg-rose-700 shadow-md transition-colors"
                        title="Delete photo"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {/* Bottom overlay info */}
                    <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 text-white">
                      {photo.caption && (
                        <p className="text-xs font-medium line-clamp-1 mb-0.5">
                          {photo.caption}
                        </p>
                      )}
                      <p className="text-[10px] text-warm-300">
                        {uploadTime}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ATTENDEES ROSTER */}
      {activeTab === "attendees" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-ink font-serif">Guest Roster</h2>
              <p className="text-xs text-ink-secondary">
                Attendees who joined via QR flyer or event code.
              </p>
            </div>
            <Badge variant="brand">{attendees.length} Joined</Badge>
          </div>

          <Card className="p-0 overflow-hidden bg-surface">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-warm-300 bg-warm-50 text-xs uppercase font-semibold text-ink-secondary">
                  <tr>
                    <th className="px-6 py-3.5">Guest Nickname</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Joined At</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warm-300">
                  {attendees.map((attendee) => {
                    const joinDate = new Date(attendee.createdAt).toLocaleDateString(
                      undefined,
                      {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    );

                    const isHost = attendee.role === "host";

                    return (
                      <tr key={attendee.id} className="hover:bg-warm-50/50">
                        <td className="px-6 py-4 font-medium text-ink flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-forest text-surface flex items-center justify-center font-bold text-xs">
                            {attendee.nickname.slice(0, 2).toUpperCase()}
                          </div>
                          {attendee.nickname}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            variant={
                              attendee.role === "host"
                                ? "brand"
                                : attendee.role === "co_host"
                                ? "apricot"
                                : "neutral"
                            }
                          >
                            {attendee.role.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs text-ink-secondary">
                          {joinDate}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {!isHost && (
                            <select
                              value={attendee.role}
                              onChange={(e) =>
                                handleRoleChange(
                                  attendee.id,
                                  e.target.value as AttendeeRole,
                                )
                              }
                              className="rounded-lg bg-surface border border-warm-300 px-2.5 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest"
                            >
                              <option value="guest">Guest</option>
                              <option value="co_host">Co-Host</option>
                              <option value="vip">VIP</option>
                            </select>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: SETTINGS */}
      {activeTab === "settings" && (
        <div className="max-w-2xl space-y-8">
          <form onSubmit={handleSaveSettings} className="space-y-6">
            <Card className="space-y-5 bg-surface">
              <h3 className="font-bold text-ink text-base border-b border-warm-300 pb-3 font-serif">
                General Celebration Settings
              </h3>

              {settingsSuccess && (
                <div className="rounded-xl border border-emerald/30 bg-emerald/10 p-3 text-xs text-emerald font-medium">
                  Settings saved successfully!
                </div>
              )}

              <Input
                label="Event Name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
              />

              <div className="w-full flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl bg-surface border border-warm-300 px-3.5 py-2.5 text-sm text-ink placeholder-ink-muted focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                />
              </div>

              <Input
                label="Location"
                value={editLocation}
                onChange={(e) => setEditLocation(e.target.value)}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Max Photos Per Guest"
                  type="number"
                  value={editMaxPhotosPerGuest}
                  onChange={(e) => setEditMaxPhotosPerGuest(Number(e.target.value))}
                />
                <Input
                  label="Total Photo Quota"
                  type="number"
                  value={editMaxTotalPhotos}
                  onChange={(e) => setEditMaxTotalPhotos(Number(e.target.value))}
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
                  Event Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-xl bg-surface border border-warm-300 px-3.5 py-2.5 text-sm text-ink focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
                >
                  <option value="active">Active (Ongoing & Open)</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived (Ended)</option>
                </select>
              </div>

              <div className="pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editIsGuestUploadEnabled}
                    onChange={(e) => setEditIsGuestUploadEnabled(e.target.checked)}
                    className="h-4 w-4 rounded border-warm-300 text-forest focus:ring-forest"
                  />
                  <span className="text-sm font-medium text-ink">
                    Allow Guest Uploads
                  </span>
                </label>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={savingSettings}
              >
                Save Changes
              </Button>
            </Card>
          </form>

          {/* Danger Zone */}
          <Card className="border-coral/30 bg-coral/5 space-y-4">
            <h3 className="font-bold text-coral text-base font-serif">Danger Zone</h3>
            <p className="text-xs text-ink-secondary">
              Permanently delete this event and all associated photos and attendee records. This action cannot be reversed.
            </p>
            <Button variant="danger" size="md" onClick={handleDeleteEvent}>
              Delete Event Permanently
            </Button>
          </Card>
        </div>
      )}

      {/* PHOTO LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div
            className="relative max-w-4xl max-h-[90vh] w-full flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-6 w-6" />
            </button>

            <img
              src={
                (selectedPhoto as PhotoEntity & { publicUrl?: string })
                  .publicUrl || ""
              }
              alt={selectedPhoto.caption || "Full size photo"}
              className="max-h-[75vh] w-auto rounded-2xl object-contain shadow-2xl border border-white/10"
            />

            <div className="mt-4 w-full flex items-center justify-between text-white text-xs px-2">
              <div>
                <p className="font-medium text-sm">
                  {selectedPhoto.caption || "Event Photo"}
                </p>
                <p className="text-warm-300">
                  Uploaded {new Date(selectedPhoto.uploadedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDeletePhoto(selectedPhoto.id)}
                  className="gap-1.5"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE QR FLYER MODAL */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-surface border border-warm-300 rounded-3xl p-6 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-warm-300 pb-3">
              <h3 className="text-lg font-bold text-ink font-serif">
                Printable Venue Flyer
              </h3>
              <button
                onClick={() => setShowPosterModal(false)}
                className="text-ink-secondary hover:text-ink"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Printable Area - Warm Stationery look */}
            <div
              ref={printAreaRef}
              className="bg-[#FFFDF8] text-[#0F1720] p-10 rounded-2xl border-2 border-forest shadow-md flex flex-col items-center text-center space-y-5"
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-bold tracking-tight text-forest font-serif uppercase">
                  {event.name}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-emerald">
                  Scan & Share Your Photos
                </p>
              </div>

              {/* High-res QR */}
              <div className="p-4 bg-white rounded-2xl border-2 border-warm-300 shadow-sm">
                <QRCodeSVG
                  value={getJoinUrl()}
                  size={240}
                  level="H"
                  fgColor="#123C35"
                  includeMargin={true}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-semibold text-ink-secondary uppercase tracking-widest">
                  Event Code
                </p>
                <p className="font-mono text-3xl font-black tracking-widest text-forest">
                  {event.eventCode}
                </p>
              </div>

              <div className="border-t border-warm-300 pt-3 text-[11px] text-ink-secondary space-y-0.5">
                <p>No app install required. Point any smartphone camera to join.</p>
                <p className="font-semibold text-forest font-serif">iwai.app</p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="ghost"
                onClick={() => setShowPosterModal(false)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={handlePrint}
                className="gap-2"
              >
                <Printer className="h-4 w-4" />
                Print Flyer Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
