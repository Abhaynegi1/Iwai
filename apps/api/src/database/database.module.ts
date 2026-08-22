import { Module } from "@nestjs/common";

/**
 * DatabaseModule
 *
 * This module will provide the Drizzle ORM database connection
 * to the rest of the application via dependency injection.
 *
 * Implementation steps (when ready):
 *   1. Import @iwai/database client
 *   2. Create a DATABASE_TOKEN injection token
 *   3. Export the db provider for use in feature modules
 *
 * Example future implementation:
 *
 *   import { db } from "@iwai/database";
 *
 *   export const DATABASE_TOKEN = Symbol("DATABASE");
 *
 *   @Module({
 *     providers: [
 *       {
 *         provide: DATABASE_TOKEN,
 *         useValue: db,
 *       },
 *     ],
 *     exports: [DATABASE_TOKEN],
 *   })
 *   export class DatabaseModule {}
 */
@Module({})
export class DatabaseModule {}
