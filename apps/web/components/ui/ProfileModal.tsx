"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  User,
  Mail,
  Camera,
  Check,
  Sparkles,
  Link as LinkIcon,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../../lib/auth-context";
import { Button } from "./Button";

// Handpicked stylish avatar presets matching IWAI's festive vibe
const AVATAR_PRESETS = [
  {
    name: "Golden Sparkle",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=sparkles&backgroundColor=ffb86c",
  },
  {
    name: "Botanical Jade",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=celebration&backgroundColor=c4dfd4",
  },
  {
    name: "Festive Bloom",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=bloom&backgroundColor=ffd2bf",
  },
  {
    name: "Sunset Party",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=party&backgroundColor=e1efe9",
  },
  {
    name: "Ivory Minimal",
    url: "https://api.dicebear.com/7.x/notionists/svg?seed=organizer&backgroundColor=f4f3ee",
  },
];

export function ProfileModal() {
  const { user, isProfileModalOpen, closeProfileModal, updateProfile } = useAuth();

  const [name, setName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isCustomUrlOpen, setIsCustomUrlOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever user or modal opens
  useEffect(() => {
    if (user && isProfileModalOpen) {
      setName(user.name || "");
      setAvatarUrl(user.avatarUrl || "");
      setSuccess(false);
      setError(null);
    }
  }, [user, isProfileModalOpen]);

  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isProfileModalOpen) {
        closeProfileModal();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isProfileModalOpen, closeProfileModal]);

  if (!isProfileModalOpen || !user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await updateProfile({
        name: name.trim(),
        avatarUrl: avatarUrl.trim() || undefined,
      });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        closeProfileModal();
      }, 1200);
    } catch (err: unknown) {
      setError((err as Error)?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const initials = (name || user.name || "Organizer")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="profile-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-200"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm transition-opacity"
        onClick={closeProfileModal}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-warm-300 bg-surface shadow-[0_20px_50px_rgba(18,60,53,0.15)] z-10 animate-in zoom-in-95 duration-200">
        {/* Header Ribbon / Banner */}
        <div className="relative bg-gradient-to-r from-forest via-[#164e44] to-emerald px-6 pt-6 pb-12 text-surface">
          <button
            type="button"
            onClick={closeProfileModal}
            aria-label="Close modal"
            className="absolute top-4 right-4 rounded-full p-1.5 text-surface/80 hover:text-surface hover:bg-white/10 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2 text-apricot text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-4 w-4" />
            <span>Welcome to IWAI</span>
          </div>
          <h2 id="profile-modal-title" className="mt-1 text-2xl font-bold font-serif text-white">
            Your Organizer Profile
          </h2>
          <p className="mt-1 text-xs text-surface/80 max-w-sm">
            Customize how you appear across your celebrations, invitations, and guest galleries.
          </p>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="px-6 pb-6 pt-0 -mt-8 space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <div className="relative group">
              <div className="h-20 w-20 rounded-full border-4 border-surface bg-warm-200 overflow-hidden shadow-md flex items-center justify-center text-forest font-bold text-xl">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={name || "Avatar"}
                    className="h-full w-full object-cover"
                    onError={() => setAvatarUrl("")}
                  />
                ) : (
                  <span>{initials}</span>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 rounded-full bg-forest text-white p-1.5 shadow-sm">
                <Camera className="h-3 w-3" />
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h3 className="text-sm font-semibold text-ink">Choose Avatar</h3>
                <button
                  type="button"
                  onClick={() => setIsCustomUrlOpen(!isCustomUrlOpen)}
                  className="text-xs text-forest hover:underline flex items-center gap-1 font-medium"
                >
                  <LinkIcon className="h-3 w-3" />
                  {isCustomUrlOpen ? "Presets" : "Custom URL"}
                </button>
              </div>

              {/* Avatar Presets or URL Input */}
              {!isCustomUrlOpen ? (
                <div className="mt-2 flex items-center justify-center sm:justify-start gap-2">
                  {AVATAR_PRESETS.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setAvatarUrl(preset.url)}
                      title={preset.name}
                      className={`h-9 w-9 rounded-full overflow-hidden border-2 transition-all duration-150 hover:scale-105 ${
                        avatarUrl === preset.url
                          ? "border-forest ring-2 ring-forest/20 scale-105"
                          : "border-warm-300 hover:border-forest/40"
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                  {avatarUrl && (
                    <button
                      type="button"
                      onClick={() => setAvatarUrl("")}
                      className="text-[11px] text-ink-muted hover:text-coral transition-colors ml-1"
                      title="Clear custom avatar"
                    >
                      Reset
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-2">
                  <input
                    type="url"
                    placeholder="https://example.com/avatar.jpg"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-xl border border-warm-300 bg-white focus:outline-none focus:ring-1 focus:ring-forest text-ink"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Feedback Banners */}
          {success && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-emerald/10 border border-emerald/20 text-emerald text-xs font-medium animate-in fade-in">
              <Check className="h-4 w-4 shrink-0" />
              <span>Profile updated successfully! Welcome aboard.</span>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-2xl bg-coral/10 border border-coral/20 text-coral text-xs font-medium">
              {error}
            </div>
          )}

          {/* Input Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="profile-name" className="block text-xs font-semibold text-ink mb-1.5">
                Display / Organizer Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="profile-name"
                  type="text"
                  required
                  maxLength={60}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Maya & Arjun"
                  className="w-full rounded-2xl border border-warm-300 bg-white pl-10 pr-4 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-forest focus:outline-none focus:ring-1 focus:ring-forest transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-ink mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-ink-muted">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full rounded-2xl border border-warm-300/80 bg-warm-100/60 pl-10 pr-24 py-2.5 text-sm text-ink-secondary cursor-not-allowed"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald/10 text-emerald">
                    <ShieldCheck className="h-3 w-3" />
                    Verified
                  </span>
                </div>
              </div>
              <p className="mt-1 text-[11px] text-ink-muted">
                Your login email is managed via your authentication provider.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-warm-300">
            <button
              type="button"
              onClick={closeProfileModal}
              className="px-4 py-2 text-xs font-semibold text-ink-secondary hover:text-ink transition-colors"
            >
              Continue to Dashboard
            </button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={saving}
              className="rounded-2xl px-6 shadow-sm"
            >
              <Check className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
