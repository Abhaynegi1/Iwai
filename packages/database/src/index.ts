/**
 * @iwai/database
 *
 * Database infrastructure package — Drizzle ORM + PostgreSQL.
 *
 * IMPORTANT: Only apps/api should depend on this package.
 * Web and Mobile must never access the database directly.
 *
 * Exports:
 *   - db          Drizzle client instance
 *   - Database    Type of the Drizzle client
 *   - schema      Re-exported schema (for use in query builders)
 */

export { db } from "./client.js";
export type { Database } from "./client.js";

// Re-export schema for use in the API
export * as schema from "./schema/index.js";
