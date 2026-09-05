import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from "@nestjs/common";
import { and, count, desc, eq, isNull } from "drizzle-orm";
import { randomUUID } from "crypto";
import {
  events,
  photoLikes,
  photos,
} from "@iwai/database";
import type { Database, Photo } from "@iwai/database";
import type {
  AttendeeRole,
  PaginatedResponse,
  PhotoEntity,
} from "@iwai/shared";
import type {
  ConfirmUploadInput,
  PhotoFilterInput,
  RequestUploadUrlInput,
  UpdatePhotoInput,
} from "@iwai/validation";
import { DRIZZLE_DB } from "../../database/database.module";
import { STORAGE_SERVICE } from "../storage/storage.interface";
import type { IStorageService } from "../storage/storage.interface";
import { PhotoProcessorService } from "./photo-processor.service";

@Injectable()
export class PhotosService {
  private readonly logger = new Logger(PhotosService.name);

  constructor(
    @Inject(DRIZZLE_DB) private db: Database,
    @Inject(STORAGE_SERVICE) private storageService: IStorageService,
    private photoProcessor: PhotoProcessorService,
  ) {}

  async requestUploadUrl(
    eventId: string,
    attendeeId: string,
    role: AttendeeRole,
    input: RequestUploadUrlInput,
  ): Promise<{ photoId: string; uploadUrl: string; storageKey: string }> {
    const event = await this.db.query.events.findFirst({
      where: eq(events.id, eventId),
    });

    if (!event) {
      throw new NotFoundException("Event not found");
    }

    if (event.status !== "active") {
      throw new BadRequestException("Event is not currently accepting photo uploads");
    }

    if (!event.isGuestUploadEnabled && role === "guest") {
      throw new ForbiddenException("Guest uploads have been disabled for this event");
    }

    if (
      event.validUntil &&
      new Date() > new Date(event.validUntil) &&
      role === "guest"
    ) {
      throw new ForbiddenException(
        `The upload window for this event closed on ${new Date(event.validUntil).toLocaleDateString()}. You can still view the photos!`,
      );
    }

    // Check attendee quota if role is guest
    if (role === "guest") {
      const [guestPhotoCountResult] = await this.db
        .select({ count: count() })
        .from(photos)
        .where(
          and(
            eq(photos.eventId, eventId),
            eq(photos.attendeeId, attendeeId),
            isNull(photos.deletedAt),
          ),
        );

      const guestPhotoCount = Number(guestPhotoCountResult?.count || 0);
      if (guestPhotoCount >= event.maxPhotosPerGuest) {
        throw new BadRequestException(
          `You have reached your limit of ${event.maxPhotosPerGuest} photos for this event`,
        );
      }
    }

    // Check event total photo quota
    const [totalPhotoCountResult] = await this.db
      .select({ count: count() })
      .from(photos)
      .where(and(eq(photos.eventId, eventId), isNull(photos.deletedAt)));

    const totalPhotoCount = Number(totalPhotoCountResult?.count || 0);
    if (totalPhotoCount >= event.maxTotalPhotos) {
      throw new BadRequestException(
        `This event has reached its maximum capacity of ${event.maxTotalPhotos} photos`,
      );
    }

    const photoId = randomUUID();
    const ext = input.filename.includes(".")
      ? input.filename.split(".").pop()?.toLowerCase()
      : "jpg";
    const storageKey = `events/${eventId}/photos/${photoId}.${ext}`;

    await this.db.insert(photos).values({
      id: photoId,
      eventId,
      attendeeId,
      storageKey,
      originalFilename: input.filename,
      mimeType: input.mimeType,
      fileSizeBytes: input.fileSizeBytes,
      status: "pending_upload",
      takenAt: input.takenAt ? new Date(input.takenAt) : null,
    });

    const uploadUrl = await this.storageService.getPresignedUploadUrl(
      storageKey,
      input.mimeType,
      1800,
    );

    return {
      photoId,
      uploadUrl,
      storageKey,
    };
  }

  async confirmUpload(
    photoId: string,
    attendeeId: string,
    input: ConfirmUploadInput,
  ): Promise<
    PhotoEntity & {
      publicUrl: string;
      thumbnailUrl: string;
      previewUrl: string;
    }
  > {
    const photo = await this.db.query.photos.findFirst({
      where: eq(photos.id, photoId),
    });

    if (!photo) {
      throw new NotFoundException("Photo not found");
    }

    if (photo.attendeeId !== attendeeId) {
      throw new ForbiddenException("Only the uploader can confirm this photo");
    }

    // Process photo to generate responsive WebP thumbnail, preview, and extract dimensions
    let thumbnailKey: string | null = null;
    let previewKey: string | null = null;
    let width = input.width || null;
    let height = input.height || null;

    try {
      const processed = await this.photoProcessor.processPhoto(
        photo.storageKey,
        photo.eventId,
        photo.id,
      );
      thumbnailKey = processed.thumbnailKey;
      previewKey = processed.previewKey;
      width = processed.width || width;
      height = processed.height || height;
    } catch (procErr: unknown) {
      this.logger.warn(
        `Failed to generate thumbnail/preview for photo ${photoId}, fallback to original: ${(procErr as Error).message}`,
      );
    }

    const [updated] = await this.db
      .update(photos)
      .set({
        status: "ready",
        ...(thumbnailKey ? { thumbnailKey } : {}),
        ...(previewKey ? { previewKey } : {}),
        ...(width ? { width } : {}),
        ...(height ? { height } : {}),
        ...(input.blurhash ? { blurhash: input.blurhash } : {}),
        ...(input.caption ? { caption: input.caption } : {}),
        uploadedAt: new Date(),
      })
      .where(eq(photos.id, photoId))
      .returning();

    return this.toEntityWithUrls(updated);
  }

  async getEventPhotos(
    eventId: string,
    filters: PhotoFilterInput,
  ): Promise<
    PaginatedResponse<
      PhotoEntity & {
        publicUrl: string;
        thumbnailUrl: string;
        previewUrl: string;
      }
    >
  > {
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 20;
    const offset = (page - 1) * limit;

    const conditions = [
      eq(photos.eventId, eventId),
      eq(photos.status, filters.status || "ready"),
      isNull(photos.deletedAt),
    ];

    if (filters.uploaderId) {
      conditions.push(eq(photos.attendeeId, filters.uploaderId));
    }
    if (filters.favoritesOnly) {
      conditions.push(eq(photos.isFavorite, true));
    }

    const [photoList, totalResult] = await Promise.all([
      this.db.query.photos.findMany({
        where: and(...conditions),
        orderBy: [desc(photos.uploadedAt)],
        limit,
        offset,
        with: {
          uploader: true,
        },
      }),
      this.db
        .select({ count: count() })
        .from(photos)
        .where(and(...conditions)),
    ]);

    const total = Number(totalResult[0]?.count || 0);

    return {
      success: true,
      data: photoList.map((p: Photo) => this.toEntityWithUrls(p)),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit) || 1,
      },
    };
  }

  async getPhotoById(
    photoId: string,
  ): Promise<
    PhotoEntity & {
      publicUrl: string;
      thumbnailUrl: string;
      previewUrl: string;
      likeCount: number;
    }
  > {
    const photo = await this.db.query.photos.findFirst({
      where: and(eq(photos.id, photoId), isNull(photos.deletedAt)),
      with: {
        uploader: true,
      },
    });

    if (!photo) {
      throw new NotFoundException("Photo not found");
    }

    const [likeCountRow] = await this.db
      .select({ count: count() })
      .from(photoLikes)
      .where(eq(photoLikes.photoId, photoId));

    return {
      ...this.toEntityWithUrls(photo),
      likeCount: Number(likeCountRow?.count || 0),
    };
  }

  async updatePhoto(
    photoId: string,
    attendeeId: string,
    isHost: boolean,
    input: UpdatePhotoInput,
  ): Promise<
    PhotoEntity & {
      publicUrl: string;
      thumbnailUrl: string;
      previewUrl: string;
    }
  > {
    const photo = await this.db.query.photos.findFirst({
      where: and(eq(photos.id, photoId), isNull(photos.deletedAt)),
    });

    if (!photo) {
      throw new NotFoundException("Photo not found");
    }

    if (photo.attendeeId !== attendeeId && !isHost) {
      throw new ForbiddenException("Only the uploader or host can update this photo");
    }

    const [updated] = await this.db
      .update(photos)
      .set({
        ...(input.caption !== undefined ? { caption: input.caption } : {}),
        ...(input.isFavorite !== undefined ? { isFavorite: input.isFavorite } : {}),
      })
      .where(eq(photos.id, photoId))
      .returning();

    return this.toEntityWithUrls(updated);
  }

  async toggleLike(
    photoId: string,
    attendeeId: string,
  ): Promise<{ liked: boolean; likeCount: number }> {
    const existingLike = await this.db.query.photoLikes.findFirst({
      where: and(
        eq(photoLikes.photoId, photoId),
        eq(photoLikes.attendeeId, attendeeId),
      ),
    });

    let liked = false;
    if (existingLike) {
      await this.db
        .delete(photoLikes)
        .where(
          and(
            eq(photoLikes.photoId, photoId),
            eq(photoLikes.attendeeId, attendeeId),
          ),
        );
      liked = false;
    } else {
      await this.db.insert(photoLikes).values({
        photoId,
        attendeeId,
      });
      liked = true;
    }

    const [likeCountRow] = await this.db
      .select({ count: count() })
      .from(photoLikes)
      .where(eq(photoLikes.photoId, photoId));

    return {
      liked,
      likeCount: Number(likeCountRow?.count || 0),
    };
  }

  async deletePhoto(
    photoId: string,
    attendeeId?: string,
    isHost?: boolean,
    organizerUserId?: string,
  ): Promise<void> {
    const photo = await this.db.query.photos.findFirst({
      where: and(eq(photos.id, photoId), isNull(photos.deletedAt)),
    });

    if (!photo) {
      throw new NotFoundException("Photo not found");
    }

    if (organizerUserId) {
      const event = await this.db.query.events.findFirst({
        where: eq(events.id, photo.eventId),
      });
      if (!event || event.creatorId !== organizerUserId) {
        throw new ForbiddenException(
          "Only the event organizer or host can delete this photo",
        );
      }
    } else {
      if (photo.attendeeId !== attendeeId && !isHost) {
        throw new ForbiddenException(
          "Only the uploader or host can delete this photo",
        );
      }
    }

    await this.db
      .update(photos)
      .set({
        status: "deleted",
        deletedAt: new Date(),
      })
      .where(eq(photos.id, photoId));
  }

  private toEntityWithUrls(photo: Photo): PhotoEntity & {
    publicUrl: string;
    thumbnailUrl: string;
    previewUrl: string;
  } {
    const publicUrl = this.storageService.getPublicUrl(photo.storageKey);
    const thumbnailUrl = photo.thumbnailKey
      ? this.storageService.getPublicUrl(photo.thumbnailKey)
      : publicUrl;
    const previewUrl = photo.previewKey
      ? this.storageService.getPublicUrl(photo.previewKey)
      : publicUrl;

    return {
      id: photo.id,
      eventId: photo.eventId,
      attendeeId: photo.attendeeId,
      storageKey: photo.storageKey,
      thumbnailKey: photo.thumbnailKey,
      previewKey: photo.previewKey,
      originalFilename: photo.originalFilename,
      mimeType: photo.mimeType,
      fileSizeBytes: Number(photo.fileSizeBytes),
      width: photo.width,
      height: photo.height,
      blurhash: photo.blurhash,
      caption: photo.caption,
      status: photo.status,
      isFavorite: photo.isFavorite,
      takenAt: photo.takenAt ? photo.takenAt.toISOString() : null,
      uploadedAt: photo.uploadedAt.toISOString(),
      deletedAt: photo.deletedAt ? photo.deletedAt.toISOString() : null,
      publicUrl,
      thumbnailUrl,
      previewUrl,
    };
  }
}
