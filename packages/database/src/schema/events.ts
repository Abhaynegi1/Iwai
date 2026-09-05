import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { organizations } from "./organizations";
import { users } from "./users";

export const eventStatusEnum = pgEnum("event_status", [
  "draft",
  "active",
  "locked",
  "archived",
  "expired",
]);

export const events = pgTable(
  "events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    organizationId: uuid("organization_id").references(() => organizations.id, {
      onDelete: "set null",
    }),
    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull().unique(),
    description: text("description"),
    coverPhotoUrl: text("cover_photo_url"),
    eventCode: varchar("event_code", { length: 16 }).notNull().unique(),
    qrCodeUrl: text("qr_code_url"),
    location: varchar("location", { length: 255 }),
    timezone: varchar("timezone", { length: 64 }).default("UTC").notNull(),
    startsAt: timestamp("starts_at", { withTimezone: true }).notNull(),
    endsAt: timestamp("ends_at", { withTimezone: true }).notNull(),
    status: eventStatusEnum("status").default("draft").notNull(),
    maxPhotosPerGuest: integer("max_photos_per_guest").default(50).notNull(),
    maxTotalPhotos: integer("max_total_photos").default(250).notNull(),
    isGuestUploadEnabled: boolean("is_guest_upload_enabled").default(true).notNull(),
    isPublicGallery: boolean("is_public_gallery").default(true).notNull(),
    storageLimitBytes: bigint("storage_limit_bytes", { mode: "number" })
      .default(5 * 1024 * 1024 * 1024)
      .notNull(), // 5 GB
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("event_code_idx").on(table.eventCode),
    index("event_status_idx").on(table.status),
    index("event_creator_idx").on(table.creatorId),
  ],
);

export type Event = typeof events.$inferSelect;
export type NewEvent = typeof events.$inferInsert;
