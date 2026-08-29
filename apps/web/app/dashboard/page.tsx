"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Calendar,
  MapPin,
  Image as ImageIcon,
  QrCode,
  ArrowUpRight,
  Sparkles,
  Layers,
} from "lucide-react";
import type { EventEntity } from "@iwai/shared";
import { api } from "../../lib/api";
import { useAuth } from "../../lib/auth-context";
import { Button } from "../../components/ui/Button";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";

export default function DashboardPage() {
  const { user } = useAuth();
  const [events, setEvents] = useState<EventEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvents() {
      try {
        setLoading(true);
        const res = await api.events.getMyEvents(1, 50);
        if (res.success && res.data) {
          setEvents(res.data);
        }
      } catch (err: unknown) {
        setError((err as Error)?.message || "Failed to load events.");
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const activeEventsCount = events.filter((e) => e.status === "active").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Welcome back, {user?.name || "Organizer"}
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your events, guest QR codes, and live photo galleries.
          </p>
        </div>
        <Link href="/events/new">
          <Button size="md" variant="primary" className="shadow-lg shadow-brand-500/20">
            <Plus className="h-4 w-4" />
            Create Event
          </Button>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 border border-brand-500/20 text-brand-400">
            <Layers className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Total Events
            </p>
            <p className="text-2xl font-bold text-white">{events.length}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Sparkles className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Active Events
            </p>
            <p className="text-2xl font-bold text-white">{activeEventsCount}</p>
          </div>
        </Card>

        <Card className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <ImageIcon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Hosting Tier
            </p>
            <p className="text-2xl font-bold text-white">Starter Free</p>
          </div>
        </Card>
      </div>

      {/* Events List Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <h2 className="text-lg font-bold text-white">Your Events</h2>
          <span className="text-xs font-medium text-slate-400">
            Showing {events.length} event{events.length === 1 ? "" : "s"}
          </span>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate-400">
            <div className="mx-auto h-7 w-7 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
            <p className="mt-3 text-sm">Loading your events...</p>
          </div>
        ) : error ? (
          <Card className="border-rose-500/30 bg-rose-500/10 text-rose-400 text-center py-8">
            <p>{error}</p>
          </Card>
        ) : events.length === 0 ? (
          <Card className="text-center py-16 px-4 border-dashed border-slate-800">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-400 mb-4">
              <QrCode className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No events yet</h3>
            <p className="mt-1 text-sm text-slate-400 max-w-sm mx-auto">
              Create your first celebration or party event to generate a guest QR code and start gathering memories!
            </p>
            <div className="mt-6">
              <Link href="/events/new">
                <Button size="md" variant="primary">
                  <Plus className="h-4 w-4" />
                  Create Your First Event
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const startDate = new Date(event.startsAt).toLocaleDateString(
                undefined,
                {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                },
              );

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group block"
                >
                  <Card hoverable className="h-full flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-3">
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
                        <span className="font-mono text-xs font-semibold px-2 py-1 rounded bg-slate-800 text-brand-300 border border-slate-700">
                          {event.eventCode}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors line-clamp-1">
                        {event.name}
                      </h3>

                      {event.description && (
                        <p className="mt-1 text-xs text-slate-400 line-clamp-2">
                          {event.description}
                        </p>
                      )}

                      <div className="mt-4 space-y-1.5 text-xs text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-500" />
                          <span>{startDate}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-500" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                      <span>Max {event.maxPhotosPerGuest} photos / guest</span>
                      <span className="flex items-center gap-1 text-brand-400 group-hover:translate-x-0.5 transition-transform font-medium">
                        Open Workspace
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
