import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema/index.js";

/**
 * Create a Drizzle database client.
 *
 * Reads DATABASE_URL from environment. The URL must be set before
 * importing this module (e.g., loaded via dotenv in the API bootstrap).
 *
 * Only the API should import this module.
 * Web and Mobile must never access the database directly.
 */

const DATABASE_URL = process.env["DATABASE_URL"];

if (!DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. " +
      "Please copy .env.example to .env.local and configure your database connection.",
  );
}

const queryClient = postgres(DATABASE_URL, {
  // Disable prepared statements for better compatibility with connection poolers (e.g. PgBouncer)
  prepare: false,
});

export const db = drizzle(queryClient, { schema });

export type Database = typeof db;
