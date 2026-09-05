import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, count, desc, eq } from "drizzle-orm";
import { customAlphabet } from "nanoid";
import {
  attendees,
  events,
  organizationMembers,
  photos,
  users,
} from "@iwai/database";
import type { Database, Event } from "@iwai/database";
import type { EventEntity, PaginatedResponse } from "@iwai/shared";
import type { CreateEventInput, UpdateEventInput } from "@iwai/validation";
import { DRIZZLE_DB } from "../../database/database.module";

// Exclude ambiguous characters (0, O, 1, I, L) for readable event codes
const generateEventCode = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 6);

@Injectable()
export class EventsService {
  constructor(@Inject(DRIZZLE_DB) private db: Database) {}

  async createEvent(
    userId: string,
    input: CreateEventInput,
  ): Promise<EventEntity> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      throw new NotFoundException("User not found");
    }

    // Find user's primary organization
    const membership = await this.db.query.organizationMembers.findFirst({
      where: eq(organizationMembers.userId, userId),
    });

    // Generate unique slug and event code
    const slugBase = input.name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 30);
    const slug = `${slugBase}-${Math.random().toString(36).substring(2, 7)}`;
    const eventCode = generateEventCode();

    const [newEvent] = await this.db
      .insert(events)
      .values({
        organizationId: membership?.organizationId ?? null,
        creatorId: userId,
        name: input.name,
        slug,
        description: input.description,
        location: input.location,
        timezone: input.timezone || "UTC",
        eventCode,
        startsAt: new Date(input.startsAt),
        endsAt: new Date(input.endsAt),
        validUntil: input.validUntil ? new Date(input.validUntil) : null,
        status: "active",
        maxPhotosPerGuest: input.maxPhotosPerGuest ?? 50,
        maxTotalPhotos: input.maxTotalPhotos ?? 250,
        isGuestUploadEnabled: input.isGuestUploadEnabled ?? true,
        isPublicGallery: input.isPublicGallery ?? true,
      })
      .returning();

    // Automatically create host attendee record for organizer
    await this.db.insert(attendees).values({
      eventId: newEvent.id,
      userId,
      nickname: user.name,
      avatarUrl: user.avatarUrl,
      role: "host",
    });

    return this.toEntity(newEvent);
  }

  async getMyEvents(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<PaginatedResponse<EventEntity>> {
    const offset = (page - 1) * limit;

    const [eventList, totalResult] = await Promise.all([
      this.db.query.events.findMany({
        where: eq(events.creatorId, userId),
        orderBy: [desc(events.createdAt)],
        limit,
        offset,
      }),
      this.db
        .select({ count: count() })
        .from(events)
        .where(eq(events.creatorId, userId)),
    ]);

    const total = Number(totalResult[0]?.count || 0);

    return {
      success: true,
      data: eventList.map((e: Event) => this.toEntity(e)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getEventById(
    eventId: string,
    _userId?: string,
  ): Promise<
    EventEntity & { stats: { attendeeCount: number; photoCount: number } }
  > {
    const event = await this.db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    const [attendeeCountResult, photoCountResult] = await Promise.all([
      this.db
        .select({ count: count() })
        .from(attendees)
        .where(eq(attendees.eventId, eventId)),
      this.db
        .select({ count: count() })
        .from(photos)
        .where(and(eq(photos.eventId, eventId), eq(photos.status, "ready"))),
    ]);

    return {
      ...this.toEntity(event),
      stats: {
        attendeeCount: Number(attendeeCountResult[0]?.count || 0),
        photoCount: Number(photoCountResult[0]?.count || 0),
      },
    };
  }

  async getEventByCode(eventCode: string): Promise<Partial<EventEntity>> {
    const event = await this.db.query.events.findFirst({
      where: eq(events.eventCode, eventCode.toUpperCase().trim()),
    });

    if (!event) {
      throw new NotFoundException("Invalid event code");
    }

    if (event.status === "archived" || event.status === "expired") {
      throw new BadRequestException("This event has ended and is no longer accessible");
    }

    return {
      id: event.id,
      name: event.name,
      description: event.description,
      coverPhotoUrl: event.coverPhotoUrl,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt.toISOString(),
      validUntil: event.validUntil ? event.validUntil.toISOString() : null,
      status: event.status,
      isGuestUploadEnabled: event.isGuestUploadEnabled,
      isPublicGallery: event.isPublicGallery,
    };
  }

  async updateEvent(
    eventId: string,
    userId: string,
    input: UpdateEventInput,
  ): Promise<EventEntity> {
    const event = await this.db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException("Only the event creator can update this event");
    }

    const [updated] = await this.db
      .update(events)
      .set({
        ...(input.name ? { name: input.name } : {}),
        ...(input.description !== undefined ? { description: input.description } : {}),
        ...(input.location !== undefined ? { location: input.location } : {}),
        ...(input.startsAt ? { startsAt: new Date(input.startsAt) } : {}),
        ...(input.endsAt ? { endsAt: new Date(input.endsAt) } : {}),
        ...(input.validUntil !== undefined
          ? { validUntil: input.validUntil ? new Date(input.validUntil) : null }
          : {}),
        ...(input.status ? { status: input.status } : {}),
        ...(input.maxPhotosPerGuest ? { maxPhotosPerGuest: input.maxPhotosPerGuest } : {}),
        ...(input.maxTotalPhotos ? { maxTotalPhotos: input.maxTotalPhotos } : {}),
        ...(input.isGuestUploadEnabled !== undefined
          ? { isGuestUploadEnabled: input.isGuestUploadEnabled }
          : {}),
        ...(input.isPublicGallery !== undefined
          ? { isPublicGallery: input.isPublicGallery }
          : {}),
        updatedAt: new Date(),
      })
      .where(eq(events.id, eventId))
      .returning();

    return this.toEntity(updated);
  }

  async deleteEvent(eventId: string, userId: string): Promise<void> {
    const event = await this.db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (event.creatorId !== userId) {
      throw new ForbiddenException("Only the event creator can delete this event");
    }

    await this.db.delete(events).where(eq(events.id, eventId));
  }

  private toEntity(event: Event): EventEntity {
    return {
      id: event.id,
      organizationId: event.organizationId,
      creatorId: event.creatorId,
      name: event.name,
      slug: event.slug,
      description: event.description,
      coverPhotoUrl: event.coverPhotoUrl,
      eventCode: event.eventCode,
      qrCodeUrl: event.qrCodeUrl,
      location: event.location,
      timezone: event.timezone,
      startsAt: event.startsAt.toISOString(),
      endsAt: event.endsAt.toISOString(),
      status: event.status,
      maxPhotosPerGuest: event.maxPhotosPerGuest,
      maxTotalPhotos: event.maxTotalPhotos,
      isGuestUploadEnabled: event.isGuestUploadEnabled,
      isPublicGallery: event.isPublicGallery,
      storageLimitBytes: Number(event.storageLimitBytes),
      expiresAt: event.expiresAt ? event.expiresAt.toISOString() : null,
      validUntil: event.validUntil ? event.validUntil.toISOString() : null,
      createdAt: event.createdAt.toISOString(),
      updatedAt: event.updatedAt.toISOString(),
    };
  }
}
