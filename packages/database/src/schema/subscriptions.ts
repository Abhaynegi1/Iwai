import { bigint, integer, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizations } from "./organizations";

export const planTierEnum = pgEnum("plan_tier", ["free", "pro", "business"]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id")
    .notNull()
    .unique()
    .references(() => organizations.id, { onDelete: "cascade" }),
  planTier: planTierEnum("plan_tier").default("free").notNull(),
  status: varchar("status", { length: 64 }).default("active").notNull(),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true })
    .defaultNow()
    .notNull(),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  maxEvents: integer("max_events").default(1).notNull(),
  maxStorageBytes: bigint("max_storage_bytes", { mode: "number" })
    .default(5 * 1024 * 1024 * 1024)
    .notNull(), // 5 GB
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
