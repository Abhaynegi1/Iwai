import { IwaiApiClient } from "@iwai/api-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

/**
 * Shared API client instance for Web application.
 */
export const api = new IwaiApiClient({
  baseUrl: API_BASE_URL,
});

/**
 * Sync active token with the client
 */
export function setClientToken(token: string | null): void {
  if (token) {
    api.setAuthToken(token);
  } else {
    api.clearAuthToken();
  }
}
