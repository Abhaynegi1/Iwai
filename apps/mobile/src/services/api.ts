import { IwaiApiClient } from "@iwai/api-client";

/**
 * Default API URL:
 * Reads from EXPO_PUBLIC_API_URL or falls back to localhost:4000.
 */
const DEFAULT_API_URL =
  process.env.EXPO_PUBLIC_API_URL || "http://localhost:4000";

/**
 * Shared singleton API client instance for mobile.
 */
export const apiClient = new IwaiApiClient({
  baseUrl: DEFAULT_API_URL,
  timeoutMs: 30_000,
});

/**
 * Helper to update auth token on the singleton client.
 */
export function setGuestAuthToken(token: string | null) {
  if (token) {
    apiClient.setAuthToken(token);
  } else {
    apiClient.clearAuthToken();
  }
}
