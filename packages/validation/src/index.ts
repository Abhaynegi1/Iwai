import { z } from "zod";
import {
  EVENT_STATUS,
  PHOTO_STATUS,
  QUOTAS,
} from "@iwai/shared";

export { z } from "zod";
export type { ZodSchema, ZodError } from "zod";

/* ─── Common Primitives ───────────────────────────────────── */

export const uuidSchema = z.string().uuid("Invalid UUID format");

export const isoDateSchema = z.string().datetime({ message: "Invalid ISO 8601 datetime" });

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/* ─── Auth Schemas ────────────────────────────────────────── */

export const registerSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(128, "Password too long"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
export type LoginInput = z.infer<typeof loginSchema>;

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>;

/* ─── Event Schemas ───────────────────────────────────────── */

const baseEventObject = {
  name: z.string().trim().min(2, "Event name must be at least 2 characters").max(100),
  description: z.string().max(1000).optional(),
  location: z.string().max(255).optional(),
  timezone: z.string().default("UTC"),
  startsAt: z.string().datetime(),
  endsAt: z.string().datetime(),
  maxPhotosPerGuest: z.number().int().positive().max(500).default(50),
  maxTotalPhotos: z.number().int().positive().max(5000).default(250),
  isGuestUploadEnabled: z.boolean().default(true),
  isPublicGallery: z.boolean().default(true),
};

export const createEventSchema = z
  .object(baseEventObject)
  .refine((data) => new Date(data.endsAt) > new Date(data.startsAt), {
    message: "Event end time must be after start time",
    path: ["endsAt"],
  });
export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = z
  .object(baseEventObject)
  .partial()
  .extend({
    status: z
      .enum([
        EVENT_STATUS.DRAFT,
        EVENT_STATUS.ACTIVE,
        EVENT_STATUS.LOCKED,
        EVENT_STATUS.ARCHIVED,
      ])
      .optional(),
  });
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

export const joinEventByCodeSchema = z.object({
  eventCode: z
    .string()
    .trim()
    .toUpperCase()
    .length(QUOTAS.EVENT_CODE_LENGTH, `Event code must be ${QUOTAS.EVENT_CODE_LENGTH} characters`),
  nickname: z
    .string()
    .trim()
    .min(1, "Nickname is required")
    .max(50, "Nickname cannot exceed 50 characters"),
  pinCode: z.string().length(6).optional(),
});
export type JoinEventByCodeInput = z.infer<typeof joinEventByCodeSchema>;

/* ─── Attendee Schemas ────────────────────────────────────── */

export const updateAttendeeProfileSchema = z.object({
  nickname: z.string().trim().min(1).max(50).optional(),
  avatarUrl: z.string().url("Invalid avatar URL").optional().nullable(),
});
export type UpdateAttendeeProfileInput = z.infer<typeof updateAttendeeProfileSchema>;

/* ─── Photo & Upload Schemas ──────────────────────────────── */

export const requestUploadUrlSchema = z.object({
  filename: z.string().min(1, "Filename is required").max(255),
  mimeType: z.string().refine(
    (mime) =>
      (QUOTAS.ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(mime),
    {
      message: `Invalid image format. Allowed: ${QUOTAS.ALLOWED_IMAGE_MIME_TYPES.join(", ")}`,
    },
  ),
  fileSizeBytes: z
    .number()
    .int()
    .positive()
    .max(
      QUOTAS.MAX_PHOTO_SIZE_BYTES,
      `Max file size is ${QUOTAS.MAX_PHOTO_SIZE_BYTES / (1024 * 1024)} MB`,
    ),
  takenAt: z.string().datetime().optional(),
});
export type RequestUploadUrlInput = z.infer<typeof requestUploadUrlSchema>;

export const confirmUploadSchema = z.object({
  photoId: uuidSchema,
  storageKey: z.string().min(1, "Storage key is required"),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
  blurhash: z.string().max(64).optional(),
  caption: z.string().max(500).optional(),
});
export type ConfirmUploadInput = z.infer<typeof confirmUploadSchema>;

export const updatePhotoSchema = z.object({
  caption: z.string().max(500).optional().nullable(),
  isFavorite: z.boolean().optional(),
});
export type UpdatePhotoInput = z.infer<typeof updatePhotoSchema>;

export const photoFilterSchema = paginationSchema.extend({
  status: z
    .enum([
      PHOTO_STATUS.PENDING_UPLOAD,
      PHOTO_STATUS.PROCESSING,
      PHOTO_STATUS.READY,
      PHOTO_STATUS.FLAGGED,
      PHOTO_STATUS.DELETED,
    ])
    .default(PHOTO_STATUS.READY),
  uploaderId: uuidSchema.optional(),
  favoritesOnly: z.coerce.boolean().default(false),
});
export type PhotoFilterInput = z.infer<typeof photoFilterSchema>;
