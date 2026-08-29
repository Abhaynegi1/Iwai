"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Calendar, Sliders } from "lucide-react";
import { api } from "../../../lib/api";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import { Card } from "../../../components/ui/Card";

export default function NewEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states with sensible defaults
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  
  // Default start to today, end to tomorrow
  const now = new Date();
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  
  const formatDateForInput = (d: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };

  const [startsAt, setStartsAt] = useState(formatDateForInput(now));
  const [endsAt, setEndsAt] = useState(formatDateForInput(tomorrow));
  const [maxPhotosPerGuest, setMaxPhotosPerGuest] = useState(50);
  const [maxTotalPhotos, setMaxTotalPhotos] = useState(250);
  const [isGuestUploadEnabled, setIsGuestUploadEnabled] = useState(true);
  const [isPublicGallery, setIsPublicGallery] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const startDate = new Date(startsAt);
    const endDate = new Date(endsAt);

    if (endDate <= startDate) {
      setError("Event end time must be after the start time.");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        name: name.trim(),
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC",
        startsAt: startDate.toISOString(),
        endsAt: endDate.toISOString(),
        maxPhotosPerGuest: Number(maxPhotosPerGuest),
        maxTotalPhotos: Number(maxTotalPhotos),
        isGuestUploadEnabled,
        isPublicGallery,
      };

      const res = await api.events.create(payload);
      if (res.success && res.data) {
        router.push(`/events/${res.data.id}`);
      }
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to create event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-6 space-y-6">
      {/* Back button */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="border-b border-slate-800 pb-5">
        <h1 className="text-3xl font-extrabold tracking-tight text-white">
          Create a New Event
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Configure your event details and photo limits. You will immediately receive a unique 6-character code and printable QR poster.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-400">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Event Details */}
        <Card className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sparkles className="h-5 w-5 text-brand-400" />
            <h2 className="text-base font-bold text-white">Event Information</h2>
          </div>

          <Input
            label="Event Name"
            required
            placeholder="e.g. Sarah & David's Wedding Celebration"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="A short note for your guests, welcome message, or event instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-slate-900/80 border border-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition duration-150 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
          </div>

          <Input
            label="Venue or Location (Optional)"
            placeholder="e.g. Grand Vista Resort, Napa Valley"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </Card>

        {/* Schedule */}
        <Card className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Calendar className="h-5 w-5 text-indigo-400" />
            <h2 className="text-base font-bold text-white">Date & Schedule</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Event Starts At"
              type="datetime-local"
              required
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
            />
            <Input
              label="Event Ends At"
              type="datetime-local"
              required
              value={endsAt}
              onChange={(e) => setEndsAt(e.target.value)}
            />
          </div>
        </Card>

        {/* Quotas & Gallery Controls */}
        <Card className="space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Sliders className="h-5 w-5 text-amber-400" />
            <h2 className="text-base font-bold text-white">Photo Quotas & Controls</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Input
              label="Max Photos Per Guest"
              type="number"
              min={1}
              max={500}
              required
              value={maxPhotosPerGuest}
              onChange={(e) => setMaxPhotosPerGuest(Number(e.target.value))}
              hint="Cap how many photos each guest can upload"
            />
            <Input
              label="Total Event Photo Quota"
              type="number"
              min={10}
              max={5000}
              required
              value={maxTotalPhotos}
              onChange={(e) => setMaxTotalPhotos(Number(e.target.value))}
              hint="Maximum total photos stored for this event"
            />
          </div>

          <div className="pt-3 border-t border-slate-800/80 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isGuestUploadEnabled}
                onChange={(e) => setIsGuestUploadEnabled(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
              />
              <div>
                <p className="text-sm font-medium text-white">
                  Allow Guest Uploads
                </p>
                <p className="text-xs text-slate-400">
                  Guests with the QR code or link can immediately upload photos from their devices.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublicGallery}
                onChange={(e) => setIsPublicGallery(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-slate-700 bg-slate-900 text-brand-500 focus:ring-brand-500"
              />
              <div>
                <p className="text-sm font-medium text-white">
                  Shared Public Gallery
                </p>
                <p className="text-xs text-slate-400">
                  Guests can view the live gallery feed and relive memories uploaded by others.
                </p>
              </div>
            </label>
          </div>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Link href="/dashboard">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            variant="primary"
            size="lg"
            type="submit"
            isLoading={loading}
          >
            Create Event & Generate QR
          </Button>
        </div>
      </form>
    </div>
  );
}
