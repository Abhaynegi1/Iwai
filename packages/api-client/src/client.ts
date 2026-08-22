import type { ApiClientConfig, RequestOptions } from "./types";
import type { ApiError, ApiResponse } from "@iwai/shared";

/**
 * IWAI API Client
 *
 * A typed, fetch-based client for the IWAI REST API.
 * Shared between the Web app and Mobile app.
 *
 * Usage:
 *   const client = new IwaiApiClient({ baseUrl: process.env.NEXT_PUBLIC_API_URL });
 *   const response = await client.get<HealthResponse>("/health");
 *
 * API endpoints will be added as typed methods as features are built.
 * The structure is intentionally minimal at initialization — extend it
 * by adding resource-specific methods (e.g. events.list(), photos.upload()).
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
    const url = `${this.baseUrl}${path}`;
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
