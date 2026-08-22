/**
 * Shared type definitions for IWAI.
 *
 * Add domain-agnostic types here that are used across
 * web, mobile, and API. Domain-specific types belong
 * closer to the feature that owns them.
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
