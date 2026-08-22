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

export { db, createDbClient } from "./client";
export type { Database } from "./client";

export * as schema from "./schema/index";
export * as relations from "./relations/index";
export * from "./schema/index";
export * from "./relations/index";

