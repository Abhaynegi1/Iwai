import type { ApiClientConfig, RequestOptions } from "./types";
import type {
  AttendeeEntity,
  EventEntity,
  GuestSession,
  PaginatedResponse,
  PhotoEntity,
  ApiResponse,
  ApiError,
} from "@iwai/shared";
import type {
  ConfirmUploadInput,
  JoinEventByCodeInput,
  PhotoFilterInput,
  RequestUploadUrlInput,
  UpdateAttendeeProfileInput,
} from "@iwai/validation";

/**
 * Typed error thrown by the API client when a request fails.
 */
export class ApiClientError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "ApiClientError";
  }
}

/**
 * IWAI API Client
 *
 * A typed, fetch-based client for the IWAI REST API.
 * Shared between the Web app and Mobile app.
 */
export class IwaiApiClient {
  private readonly baseUrl: string;
  private readonly defaultHeaders: Record<string, string>;
  private readonly timeoutMs: number;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, ""); // strip trailing slash
    this.defaultHeaders = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...config.headers,
    };
    this.timeoutMs = config.timeoutMs ?? 30_000;
  }

  /**
   * Set an authorization token for subsequent requests.
   * Call this after successful authentication.
   */
  setAuthToken(token: string): void {
    this.defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  /**
   * Clear the authorization token (e.g., on logout).
   */
  clearAuthToken(): void {
    delete this.defaultHeaders["Authorization"];
  }

  /**
   * Get the current base URL.
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }

  // ─── Resource Namespaces ──────────────────────────────────────────────────

  /**
   * Event API endpoints
   */
  public readonly events = {
    /** Lookup event by 6-char public code */
    getByCode: (code: string, options?: RequestOptions): Promise<ApiResponse<EventEntity>> => {
      return this.get<EventEntity>(`/events/code/${encodeURIComponent(code)}`, options);
    },
    /** Get event by ID */
    getById: (id: string, options?: RequestOptions): Promise<ApiResponse<EventEntity>> => {
      return this.get<EventEntity>(`/events/${encodeURIComponent(id)}`, options);
    },
  };

  /**
   * Attendee & Guest Join API endpoints
   */
  public readonly attendees = {
    /** Join event by code with a nickname to obtain GuestSession */
    join: (input: JoinEventByCodeInput, options?: RequestOptions): Promise<ApiResponse<GuestSession>> => {
      return this.post<GuestSession>("/attendees/join", input, options);
    },
    /** Get attendees for an event */
    getEventAttendees: (
      eventId: string,
      options?: RequestOptions,
    ): Promise<ApiResponse<AttendeeEntity[]>> => {
      return this.get<AttendeeEntity[]>(`/attendees/events/${encodeURIComponent(eventId)}`, options);
    },
    /** Update active attendee profile (nickname, avatar) */
    updateMyProfile: (
      input: UpdateAttendeeProfileInput,
      options?: RequestOptions,
    ): Promise<ApiResponse<AttendeeEntity>> => {
      return this.patch<AttendeeEntity>("/attendees/me", input, options);
    },
  };

  /**
   * Photo & Gallery API endpoints
   */
  public readonly photos = {
    /** Request a signed upload URL + initial photo ID */
    requestUploadUrl: (
      eventId: string,
      input: RequestUploadUrlInput,
      options?: RequestOptions,
    ): Promise<ApiResponse<{ photoId: string; uploadUrl: string; storageKey: string }>> => {
      return this.post<{ photoId: string; uploadUrl: string; storageKey: string }>(
        `/events/${encodeURIComponent(eventId)}/photos/upload-url`,
        input,
        options,
      );
    },
    /** Confirm photo has been uploaded to storage */
    confirmUpload: (
      eventId: string,
      input: ConfirmUploadInput,
      options?: RequestOptions,
    ): Promise<ApiResponse<PhotoEntity>> => {
      return this.post<PhotoEntity>(
        `/events/${encodeURIComponent(eventId)}/photos/confirm`,
        input,
        options,
      );
    },
    /** List photos for an event (paginated) */
    getEventPhotos: (
      eventId: string,
      query?: Partial<PhotoFilterInput>,
      options?: RequestOptions,
    ): Promise<PaginatedResponse<PhotoEntity>> => {
      const params = new URLSearchParams();
      if (query?.page) params.append("page", String(query.page));
      if (query?.limit) params.append("limit", String(query.limit));
      if (query?.status) params.append("status", query.status);
      if (query?.uploaderId) params.append("uploaderId", query.uploaderId);
      if (query?.favoritesOnly) params.append("favoritesOnly", String(query.favoritesOnly));

      const queryString = params.toString();
      const path = `/events/${encodeURIComponent(eventId)}/photos${queryString ? `?${queryString}` : ""}`;
      return this.get<PhotoEntity[]>(path, options) as Promise<PaginatedResponse<PhotoEntity>>;
    },
    /** Get photo detail by ID */
    getById: (photoId: string, options?: RequestOptions): Promise<ApiResponse<PhotoEntity>> => {
      return this.get<PhotoEntity>(`/photos/${encodeURIComponent(photoId)}`, options);
    },
    /** Like or unlike a photo */
    toggleLike: (
      photoId: string,
      options?: RequestOptions,
    ): Promise<ApiResponse<{ liked: boolean; likesCount: number }>> => {
      return this.post<{ liked: boolean; likesCount: number }>(
        `/photos/${encodeURIComponent(photoId)}/like`,
        undefined,
        options,
      );
    },
    /** Delete a photo */
    delete: (photoId: string, options?: RequestOptions): Promise<ApiResponse<void>> => {
      return this.delete<void>(`/photos/${encodeURIComponent(photoId)}`, options);
    },
  };

  /**
   * Direct binary PUT upload helper for storage backends (Local storage or Cloudflare R2).
   */
  async uploadBinary(
    uploadUrl: string,
    fileData: Blob | ArrayBuffer | Uint8Array,
    contentType: string,
    options?: RequestOptions,
  ): Promise<void> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    const signal = options?.signal
      ? this.mergeSignals(options.signal, controller.signal)
      : controller.signal;

    try {
      const targetUrl = uploadUrl.startsWith("http")
        ? uploadUrl
        : `${this.baseUrl}${uploadUrl.startsWith("/") ? "" : "/"}${uploadUrl}`;

      const response = await fetch(targetUrl, {
        method: "PUT",
        headers: {
          "Content-Type": contentType,
          ...options?.headers,
        },
        body: fileData as BodyInit,
        signal,
      });

      if (!response.ok) {
        throw new ApiClientError(
          `Binary upload failed with HTTP status ${response.status}`,
          "UPLOAD_FAILED",
          response.status,
        );
      }
    } finally {
      clearTimeout(timeout);
    }
  }

  // ─── Core HTTP methods ────────────────────────────────────────────────────

  async get<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("GET", path, undefined, options);
  }

  async post<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("POST", path, body, options);
  }

  async patch<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("PATCH", path, body, options);
  }

  async put<T>(path: string, body?: unknown, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("PUT", path, body, options);
  }

  async delete<T>(path: string, options?: RequestOptions): Promise<ApiResponse<T>> {
    return this.request<T>("DELETE", path, undefined, options);
  }

  // ─── Internal ────────────────────────────────────────────────────────────

  private async request<T>(
    method: string,
    path: string,
    body?: unknown,
    options?: RequestOptions,
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${path.startsWith("/") ? "" : "/"}${path}`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    const signal = options?.signal
      ? this.mergeSignals(options.signal, controller.signal)
      : controller.signal;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          ...this.defaultHeaders,
          ...options?.headers,
        },
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      });

      const json = (await response.json()) as ApiResponse<T> | ApiError;

      if (!response.ok) {
        const error = json as ApiError;
        throw new ApiClientError(
          error.error?.message ?? `Request failed with status ${response.status}`,
          error.error?.code ?? "UNKNOWN_ERROR",
          response.status,
        );
      }

      return json as ApiResponse<T>;
    } finally {
      clearTimeout(timeout);
    }
  }

  private mergeSignals(...signals: AbortSignal[]): AbortSignal {
    const controller = new AbortController();
    for (const signal of signals) {
      if (signal.aborted) {
        controller.abort(signal.reason);
        break;
      }
      signal.addEventListener("abort", () => controller.abort(signal.reason), { once: true });
    }
    return controller.signal;
  }
}
