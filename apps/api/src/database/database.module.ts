import { Global, Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { createDbClient, db as defaultDb } from "@iwai/database";
import type { Database } from "@iwai/database";

export const DRIZZLE_DB = "DRIZZLE_DB";
export type DrizzleDb = Database;

@Global()
@Module({
  providers: [
    {
      provide: DRIZZLE_DB,
      useFactory: (config: ConfigService): Database => {
        const dbUrl = config.get<string>("DATABASE_URL");
        if (dbUrl) {
          return createDbClient(dbUrl);
        }
        return defaultDb;
      },
      inject: [ConfigService],
    },
  ],
  exports: [DRIZZLE_DB],
})
export class DatabaseModule {}
