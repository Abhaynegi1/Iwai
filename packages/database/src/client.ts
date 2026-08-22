import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index";

/**
 * Create a Drizzle database client.
 *
 * Reads DATABASE_URL from environment or an explicit connection string.
 *
 * Only apps/api should import this package.
 * Web and Mobile must never access the database directly.
 */

export function createDbClient(connectionString?: string) {
  const url = connectionString ?? process.env["DATABASE_URL"];

  if (!url) {
    throw new Error(
      "DATABASE_URL environment variable is not set. " +
        "Please configure DATABASE_URL in your .env file.",
    );
  }

  const queryClient = postgres(url, {
    // Disable prepared statements for connection poolers (e.g. Neon, PgBouncer, Supabase)
    prepare: false,
  });

  return drizzle(queryClient, { schema });
}

// Default client instance for standard usage
export const db = createDbClient(process.env["DATABASE_URL"] || "postgresql://placeholder:placeholder@localhost:5432/placeholder");

export type Database = ReturnType<typeof createDbClient>;

