/**
 * @iwai/validation
 *
 * Shared Zod validation schemas used across web, mobile, and API.
 *
 * Structure (to be populated as features are built):
 *   src/
 *   ├── schemas/
 *   │   ├── auth.ts        - Login, signup, token schemas
 *   │   ├── events.ts      - Event creation, update schemas
 *   │   ├── photos.ts      - Photo upload, metadata schemas
 *   │   ├── attendees.ts   - Attendee join schemas
 *   │   └── pagination.ts  - Shared pagination schemas
 *   └── index.ts
 */

export { z } from "zod";
export type { ZodSchema, ZodError } from "zod";

// ─── Common Schemas ───────────────────────────────────────────────────────────

import { z } from "zod";

/** UUID v4 string */
export const uuidSchema = z.string().uuid();

/** ISO 8601 datetime string */
export const isoDateSchema = z.string().datetime();

/** Pagination query params */
export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;
