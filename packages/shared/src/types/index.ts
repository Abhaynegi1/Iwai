import type {
  AttendeeRole,
  EventStatus,
  OrgRole,
  PhotoStatus,
  PlanTier,
  UserRole,
} from "../constants/index";

/**
 * Shared type definitions for IWAI.
 */

/** Generic API response envelope */
export type ApiResponse<T> = {
  data: T;
  success: true;
};

/** Generic API error envelope */
export type ApiError = {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: unknown;
  };
};

/** Pagination metadata */
export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

/** Paginated API response */
export type PaginatedResponse<T> = ApiResponse<T[]> & {
  meta: PaginationMeta;
};

/* ─── Domain Entity Interfaces ────────────────────────────── */

export interface UserEntity {
  id: string;
  email: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationEntity {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationMemberEntity {
  id: string;
  organizationId: string;
  userId: string;
  role: OrgRole;
  createdAt: string;
}


export interface EventEntity {
  id: string;
  organizationId: string | null;
  creatorId: string;
  name: string;
  slug: string;
  description: string | null;
  coverPhotoUrl: string | null;
  eventCode: string;
  qrCodeUrl: string | null;
  location: string | null;
  timezone: string;
  startsAt: string;
  endsAt: string;
  status: EventStatus;
  maxPhotosPerGuest: number;
  maxTotalPhotos: number;
  isGuestUploadEnabled: boolean;
  isPublicGallery: boolean;
  storageLimitBytes: number;
  expiresAt: string | null;
  validUntil: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AttendeeEntity {
  id: string;
  eventId: string;
  userId: string | null;
  nickname: string;
  avatarUrl: string | null;
  role: AttendeeRole;
  lastActiveAt: string;
  createdAt: string;
}

export interface PhotoEntity {
  id: string;
  eventId: string;
  attendeeId: string;
  storageKey: string;
  thumbnailKey: string | null;
  previewKey: string | null;
  originalFilename: string;
  mimeType: string;
  fileSizeBytes: number;
  width: number | null;
  height: number | null;
  blurhash: string | null;
  caption: string | null;
  status: PhotoStatus;
  isFavorite: boolean;
  takenAt: string | null;
  uploadedAt: string;
  deletedAt: string | null;
}

export interface SubscriptionEntity {
  id: string;
  organizationId: string;
  planTier: PlanTier;
  status: string;
  currentPeriodStart: string;
  currentPeriodEnd: string;
  maxEvents: number;
  maxStorageBytes: number;
}

/* ─── Auth Tokens & Payloads ──────────────────────────────── */

export interface OrganizerJwtPayload {
  sub: string; // userId
  email: string;
  role: UserRole;
}

export interface GuestJwtPayload {
  sub: string; // attendeeId
  eventId: string;
  role: AttendeeRole;
  nickname: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
}

export interface GuestSession {
  guestToken: string;
  attendee: AttendeeEntity;
  event: EventEntity;
}

