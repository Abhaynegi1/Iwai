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
      <div className="py-24 text-center text-slate-400">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
        <p className="mt-3 text-sm">Loading event workspace...</p>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="py-12 max-w-xl mx-auto text-center space-y-4">
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-400 text-sm">
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
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Dashboard
        </Link>
      </div>

      {/* Event Header Banner */}
      <div className="rounded-3xl border border-slate-800 bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40 p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-brand-500/10 blur-3xl pointer-events-none" />

        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <Badge
                variant={
                  event.status === "active"
                    ? "success"
                    : event.status === "draft"
                    ? "neutral"
                    : "warning"
                }
              >
                {event.status.toUpperCase()}
              </Badge>
              {event.location && (
                <span className="flex items-center gap-1 text-xs text-slate-400">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  {event.location}
                </span>
              )}
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              {event.name}
            </h1>

            {event.description && (
              <p className="text-sm text-slate-400 max-w-2xl">
                {event.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-brand-400" />
                {new Date(event.startsAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-indigo-400" />
                {attendees.length} Joined Guest{attendees.length === 1 ? "" : "s"}
              </span>
              <span className="flex items-center gap-1.5">
                <Camera className="h-3.5 w-3.5 text-emerald-400" />
                {photoCount} / {event.maxTotalPhotos} Photos
              </span>
            </div>
          </div>

          {/* Event Code Pill & Fast Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-800 bg-slate-950/80 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                  Event Code
                </p>
                <p className="font-mono text-xl font-bold tracking-wider text-brand-300">
                  {event.eventCode}
                </p>
              </div>
              <button
                onClick={handleCopyCode}
                className="rounded-xl bg-slate-800 p-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                title="Copy code"
              >
                {copiedCode ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
            </div>

            <Button
              variant="primary"
              size="md"
              onClick={() => setShowPosterModal(true)}
              className="gap-2 shadow-lg shadow-brand-500/20"
            >
              <Printer className="h-4 w-4" />
              Print QR Flyer
            </Button>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800/80 pb-px overflow-x-auto">
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
                  ? "border-brand-500 text-white font-semibold"
                  : "border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700"
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
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UploadCloud className="h-5 w-5 text-brand-400" />
                  <h3 className="font-bold text-white">Event Storage Quota</h3>
                </div>
                <span className="text-xs font-semibold text-slate-400">
                  {photoCount} of {event.maxTotalPhotos} photos used ({quotaPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 overflow-hidden p-0.5 border border-slate-700">
                <div
                  className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${quotaPercent}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>Guest Limit: {event.maxPhotosPerGuest} photos / guest</span>
                <span>
                  Guest Uploads:{" "}
                  <strong className={event.isGuestUploadEnabled ? "text-emerald-400" : "text-rose-400"}>
                    {event.isGuestUploadEnabled ? "Enabled" : "Disabled"}
                  </strong>
                </span>
              </div>
            </Card>

            {/* Quick Share Link */}
            <Card className="space-y-4">
              <h3 className="font-bold text-white">Direct Guest Join Link</h3>
              <p className="text-xs text-slate-400">
                Guests can click this link on mobile or scan the QR code to open IWAI instantly without an app store download.
              </p>
              <div className="flex items-center gap-2">
                <input
                  readOnly
                  value={getJoinUrl()}
                  className="flex-1 rounded-xl bg-slate-950 border border-slate-800 px-3.5 py-2.5 text-xs font-mono text-slate-200 select-all"
                />
                <Button size="sm" variant="secondary" onClick={handleCopyLink}>
                  {copiedLink ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-400" />
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
            <Card className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-white">Recent Uploads</h3>
                <button
                  onClick={() => setActiveTab("gallery")}
                  className="text-xs text-brand-400 hover:text-brand-300 font-medium"
                >
                  View all ({photoCount})
                </button>
              </div>

              {photos.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs">
                  No photos uploaded yet. Scan the QR code to take your first photo!
                </div>
              ) : (
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {photos.slice(0, 6).map((photo) => (
                    <div
                      key={photo.id}
                      onClick={() => {
                        setSelectedPhoto(photo);
                        setActiveTab("gallery");
                      }}
                      className="aspect-square rounded-xl overflow-hidden bg-slate-800 border border-slate-700 relative group cursor-pointer"
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
            <Card className="flex flex-col items-center text-center p-8 space-y-6 border-brand-500/20 bg-gradient-to-b from-slate-900 via-slate-900 to-brand-950/20">
              <div>
                <Badge variant="brand" className="mb-2">
                  GUEST ACCESS QR
                </Badge>
                <h3 className="text-lg font-bold text-white">
                  Scan to Share Photos
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Point any phone camera at this QR code
                </p>
              </div>

              {/* QR Container */}
              <div className="p-4 bg-white rounded-2xl shadow-2xl border border-slate-200">
                <QRCodeSVG
                  value={getJoinUrl()}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs uppercase font-bold tracking-widest text-slate-400">
                  Event Code
                </p>
                <p className="font-mono text-2xl font-black text-brand-300 tracking-wider">
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
                  Print Event Flyer
                </Button>
                <Button
                  variant="outline"
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
              <h2 className="text-xl font-bold text-white">Event Gallery</h2>
              <p className="text-xs text-slate-400">
                Live feed of all photos uploaded by attendees. Organizers can view, download, or moderate photos.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={loadData}
                className="gap-1.5"
              >
                Refresh
              </Button>
            </div>
          </div>

          {photos.length === 0 ? (
            <Card className="text-center py-16">
              <ImageIcon className="mx-auto h-12 w-12 text-slate-600 mb-3" />
              <h3 className="text-base font-bold text-white">No photos captured yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
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
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-md cursor-pointer hover:border-slate-600 transition-all duration-200"
                    onClick={() => setSelectedPhoto(photo)}
                  >
                    <img
                      src={photoUrl}
                      alt={photo.caption || "Guest photo"}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3" />

                    {/* Top overlay action */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1.5 z-10">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeletePhoto(photo.id);
                        }}
                        className="p-2 rounded-xl bg-rose-600/90 text-white hover:bg-rose-600 shadow-md transition-colors"
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
                      <p className="text-[10px] text-slate-300">
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
              <h2 className="text-xl font-bold text-white">Guest Roster</h2>
              <p className="text-xs text-slate-400">
                Attendees who joined via QR code or event code.
              </p>
            </div>
            <Badge variant="brand">{attendees.length} Joined</Badge>
          </div>

          <Card className="p-0 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-800 bg-slate-950/50 text-xs uppercase font-semibold text-slate-400">
                  <tr>
                    <th className="px-6 py-3.5">Guest Nickname</th>
                    <th className="px-6 py-3.5">Role</th>
                    <th className="px-6 py-3.5">Joined At</th>
                    <th className="px-6 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
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
                      <tr key={attendee.id} className="hover:bg-slate-900/40">
                        <td className="px-6 py-4 font-medium text-white flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
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
                                ? "warning"
                                : "neutral"
                            }
                          >
                            {attendee.role.toUpperCase()}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-xs text-slate-400">
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
                              className="rounded-lg bg-slate-900 border border-slate-700 px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
            <Card className="space-y-5">
              <h3 className="font-bold text-white text-base border-b border-slate-800 pb-3">
                General Settings
              </h3>

              {settingsSuccess && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
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
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="w-full rounded-xl bg-slate-900/80 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Event Status
                </label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="w-full rounded-xl bg-slate-900 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
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
                    className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-sm font-medium text-white">
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
          <Card className="border-rose-500/30 bg-rose-950/10 space-y-4">
            <h3 className="font-bold text-rose-400 text-base">Danger Zone</h3>
            <p className="text-xs text-slate-400">
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
                <p className="text-slate-400">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">
                Printable Venue Flyer
              </h3>
              <button
                onClick={() => setShowPosterModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Printable Area */}
            <div
              ref={printAreaRef}
              className="bg-white text-slate-950 p-8 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-5"
            >
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 uppercase">
                  {event.name}
                </h2>
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-600">
                  Scan & Share Your Memories
                </p>
              </div>

              {/* High-res QR */}
              <div className="p-3 bg-white rounded-2xl border-4 border-slate-950">
                <QRCodeSVG
                  value={getJoinUrl()}
                  size={240}
                  level="H"
                  includeMargin={true}
                />
              </div>

              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Event Code
                </p>
                <p className="font-mono text-3xl font-black tracking-widest text-slate-950">
                  {event.eventCode}
                </p>
              </div>

              <div className="border-t border-slate-200 pt-3 text-[11px] text-slate-500 space-y-0.5">
                <p>No app install required. Works on all smartphone cameras.</p>
                <p className="font-medium text-slate-700">iwai.app</p>
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
