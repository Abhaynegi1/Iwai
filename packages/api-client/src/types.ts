import type { ApiError, ApiResponse, PaginatedResponse } from "@iwai/shared";


export type { ApiError, ApiResponse, PaginatedResponse };

/**
 * Configuration options for the IWAI API client.
 */
export type ApiClientConfig = {
  /** Base URL of the IWAI API (e.g. "https://api.iwai.app" or "http://localhost:3001") */
  baseUrl: string;
  /** Optional default headers added to every request */
  headers?: Record<string, string>;
  /** Optional timeout in milliseconds (default: 30000) */
  timeoutMs?: number;
};

/**
 * Options for individual API requests.
 */
export type RequestOptions = {
  /** Additional headers for this specific request */
  headers?: Record<string, string>;
  /** Request signal for cancellation */
  signal?: AbortSignal;
};
