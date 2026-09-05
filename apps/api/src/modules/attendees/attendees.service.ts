import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { and, desc, eq } from "drizzle-orm";
import { attendees, events } from "@iwai/database";
import type { Attendee, Database, Event } from "@iwai/database";
import type {
  AttendeeEntity,
  AttendeeRole,
  EventEntity,
  GuestSession,
} from "@iwai/shared";
import type {
  JoinEventByCodeInput,
  UpdateAttendeeProfileInput,
} from "@iwai/validation";
import { DRIZZLE_DB } from "../../database/database.module";
import { AuthService } from "../auth/auth.service";

@Injectable()
export class AttendeesService {
  constructor(
    @Inject(DRIZZLE_DB) private db: Database,
    private authService: AuthService,
  ) {}

  async joinEvent(
    input: JoinEventByCodeInput,
    userId?: string,
  ): Promise<GuestSession> {
    const event = await this.db.query.events.findFirst({
      where: eq(events.eventCode, input.eventCode.toUpperCase().trim()),
    });

    if (!event) {
      throw new NotFoundException("Event not found with this code");
    }

    if (event.status === "archived" || event.status === "expired") {
      throw new BadRequestException("This event has ended and is no longer accessible");
    }

    // Check if attendee with this nickname already exists for this event
    let attendee = await this.db.query.attendees.findFirst({
      where: and(
        eq(attendees.eventId, event.id),
        eq(attendees.nickname, input.nickname.trim()),
      ),
    });

    if (!attendee) {
      const [newAttendee] = await this.db
        .insert(attendees)
        .values({
          eventId: event.id,
          userId: userId ?? null,
          nickname: input.nickname.trim(),
          pinCode: input.pinCode,
          role: "guest",
        })
        .returning();
      attendee = newAttendee;
    } else {
      // Update last active timestamp
      const [updated] = await this.db
        .update(attendees)
        .set({ lastActiveAt: new Date() })
        .where(eq(attendees.id, attendee.id))
        .returning();
      attendee = updated;
    }

    const guestToken = await this.authService.generateGuestToken(
      attendee,
      event.id,
    );

    return {
      guestToken,
      attendee: this.toAttendeeEntity(attendee),
      event: this.toEventEntity(event),
    };
  }

  async getAttendeesForEvent(eventId: string): Promise<AttendeeEntity[]> {
    const list = await this.db.query.attendees.findMany({
      where: eq(attendees.eventId, eventId),
      orderBy: [desc(attendees.createdAt)],
    });

    return list.map((a: Attendee) => this.toAttendeeEntity(a));
  }

  async updateMyProfile(
    attendeeId: string,
    input: UpdateAttendeeProfileInput,
  ): Promise<AttendeeEntity> {
    const attendee = await this.db.query.attendees.findFirst({
      where: eq(attendees.id, attendeeId),
    });

    if (!attendee) {
      throw new NotFoundException("Attendee not found");
    }

    const [updated] = await this.db
      .update(attendees)
      .set({
        ...(input.nickname ? { nickname: input.nickname.trim() } : {}),
        ...(input.avatarUrl !== undefined ? { avatarUrl: input.avatarUrl } : {}),
        lastActiveAt: new Date(),
      })
      .where(eq(attendees.id, attendeeId))
      .returning();

    return this.toAttendeeEntity(updated);
  }

  async updateAttendeeRole(
    eventId: string,
    hostUserId: string,
    targetAttendeeId: string,
    newRole: AttendeeRole,
  ): Promise<AttendeeEntity> {
    const event = await this.db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (event.creatorId !== hostUserId) {
      throw new ForbiddenException("Only the event host can change attendee roles");
    }

    const [updated] = await this.db
      .update(attendees)
      .set({ role: newRole })
      .where(and(eq(attendees.id, targetAttendeeId), eq(attendees.eventId, eventId)))
      .returning();

    if (!updated) {
      throw new NotFoundException("Attendee not found in this event");
    }

    return this.toAttendeeEntity(updated);
  }

  private toAttendeeEntity(a: Attendee): AttendeeEntity {
    return {
      id: a.id,
      eventId: a.eventId,
      userId: a.userId,
      nickname: a.nickname,
      avatarUrl: a.avatarUrl,
      role: a.role,
      lastActiveAt: a.lastActiveAt.toISOString(),
      createdAt: a.createdAt.toISOString(),
    };
  }

  private toEventEntity(event: Event): EventEntity {
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
