import { IwaiApiClient } from "@iwai/api-client";

const rawBaseUrl = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api").trim().replace(/\/$/, "");
const API_BASE_URL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

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
