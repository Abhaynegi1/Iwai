/**
 * Shared constants for IWAI.
 *
 * Only add constants that are genuinely needed on multiple platforms.
 * Avoid adding secrets, environment-specific values, or server-only constants here.
 */

export const APP_NAME = "IWAI" as const;
export const APP_VERSION = "0.1.0" as const;

/** User system roles */
export const USER_ROLE = {
  USER: "user",
  ADMIN: "admin",
} as const;
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];

/** Organization membership roles */
export const ORG_ROLE = {
  OWNER: "owner",
  ADMIN: "admin",
  MEMBER: "member",
} as const;
export type OrgRole = (typeof ORG_ROLE)[keyof typeof ORG_ROLE];

/** Event lifecycle states */
export const EVENT_STATUS = {
  DRAFT: "draft",
  ACTIVE: "active",
  LOCKED: "locked",
  ARCHIVED: "archived",
  EXPIRED: "expired",
} as const;
export type EventStatus = (typeof EVENT_STATUS)[keyof typeof EVENT_STATUS];

/** Attendee roles within an event */
export const ATTENDEE_ROLE = {
  HOST: "host",
  CO_HOST: "co_host",
  GUEST: "guest",
  PHOTOGRAPHER: "photographer",
} as const;
export type AttendeeRole = (typeof ATTENDEE_ROLE)[keyof typeof ATTENDEE_ROLE];

/** Photo processing and visibility states */
export const PHOTO_STATUS = {
  PENDING_UPLOAD: "pending_upload",
  PROCESSING: "processing",
  READY: "ready",
  FLAGGED: "flagged",
  DELETED: "deleted",
} as const;
export type PhotoStatus = (typeof PHOTO_STATUS)[keyof typeof PHOTO_STATUS];

/** Subscription plan tiers */
export const PLAN_TIER = {
  FREE: "free",
  PRO: "pro",
  BUSINESS: "business",
} as const;
export type PlanTier = (typeof PLAN_TIER)[keyof typeof PLAN_TIER];

/** Storage & Photo Quota Defaults */
export const QUOTAS = {
  MAX_PHOTO_SIZE_BYTES: 25 * 1024 * 1024, // 25 MB
  ALLOWED_IMAGE_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/heic",
    "image/heif",
  ] as const,
  EVENT_CODE_LENGTH: 6,
  DEFAULT_FREE_MAX_PHOTOS_PER_GUEST: 50,
  DEFAULT_FREE_MAX_TOTAL_PHOTOS: 250,
  UPLOAD_URL_EXPIRY_SECONDS: 1800, // 30 mins
} as const;

/** Default pagination limits */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

/** HTTP status codes used across the application */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

