/**
 * @iwai/api-client
 *
 * Typed API client shared by Web and Mobile apps.
 *
 * Usage:
 *   import { IwaiApiClient, ApiClientError } from "@iwai/api-client";
 *
 *   const api = new IwaiApiClient({
 *     baseUrl: process.env.NEXT_PUBLIC_API_URL,
 *   });
 */

export { IwaiApiClient, ApiClientError } from "./client";
export type { ApiClientConfig, RequestOptions } from "./types";

