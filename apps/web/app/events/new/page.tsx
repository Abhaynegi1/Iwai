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
          className="inline-flex items-center gap-1.5 text-sm text-ink-secondary hover:text-ink transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="border-b border-warm-300 pb-5">
        <h1 className="text-3xl font-bold tracking-tight text-ink font-serif">
          Create a New Celebration
        </h1>
        <p className="mt-1 text-sm text-ink-secondary">
          Configure your event details and photo limits. You will immediately receive a unique 6-character code and printable QR flyer.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-coral/30 bg-coral/10 p-4 text-sm text-coral">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Event Details */}
        <Card className="space-y-5 bg-surface">
          <div className="flex items-center gap-2 border-b border-warm-300 pb-3">
            <Sparkles className="h-5 w-5 text-forest" />
            <h2 className="text-base font-bold text-ink font-serif">Event Information</h2>
          </div>

          <Input
            label="Event Name"
            required
            placeholder="e.g. Sarah & David's Wedding Celebration"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="w-full flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-ink-secondary">
              Description (Optional)
            </label>
            <textarea
              rows={3}
              placeholder="A short note for your guests, welcome message, or event instructions..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl bg-surface border border-warm-300 px-3.5 py-2.5 text-sm text-ink placeholder-ink-muted transition duration-150 focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest"
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
        <Card className="space-y-5 bg-surface">
          <div className="flex items-center gap-2 border-b border-warm-300 pb-3">
            <Calendar className="h-5 w-5 text-emerald" />
            <h2 className="text-base font-bold text-ink font-serif">Date & Schedule</h2>
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
        <Card className="space-y-5 bg-surface">
          <div className="flex items-center gap-2 border-b border-warm-300 pb-3">
            <Sliders className="h-5 w-5 text-[#B86B14]" />
            <h2 className="text-base font-bold text-ink font-serif">Photo Quotas & Controls</h2>
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

          <div className="pt-3 border-t border-warm-300 space-y-4">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isGuestUploadEnabled}
                onChange={(e) => setIsGuestUploadEnabled(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-warm-300 text-forest focus:ring-forest"
              />
              <div>
                <p className="text-sm font-medium text-ink">
                  Allow Guest Uploads
                </p>
                <p className="text-xs text-ink-secondary">
                  Guests with the QR code or link can immediately upload photos from their devices.
                </p>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublicGallery}
                onChange={(e) => setIsPublicGallery(e.target.checked)}
                className="mt-1 h-4 w-4 rounded border-warm-300 text-forest focus:ring-forest"
              />
              <div>
                <p className="text-sm font-medium text-ink">
                  Shared Public Gallery
                </p>
                <p className="text-xs text-ink-secondary">
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
