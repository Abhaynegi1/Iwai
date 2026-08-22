import {
  bigint,
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { attendees } from "./attendees";
import { events } from "./events";

export const photoStatusEnum = pgEnum("photo_status", [
  "pending_upload",
  "processing",
  "ready",
  "flagged",
  "deleted",
]);

export const photos = pgTable(
  "photos",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    attendeeId: uuid("attendee_id")
      .notNull()
      .references(() => attendees.id, { onDelete: "cascade" }),
    storageKey: varchar("storage_key", { length: 512 }).notNull().unique(),
    thumbnailKey: varchar("thumbnail_key", { length: 512 }),
    previewKey: varchar("preview_key", { length: 512 }),
    originalFilename: varchar("original_filename", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 128 }).notNull(),
    fileSizeBytes: bigint("file_size_bytes", { mode: "number" }).notNull(),
    width: integer("width"),
    height: integer("height"),
    blurhash: varchar("blurhash", { length: 64 }),
    caption: text("caption"),
    status: photoStatusEnum("status").default("pending_upload").notNull(),
    isFavorite: boolean("is_favorite").default(false).notNull(),
    takenAt: timestamp("taken_at", { withTimezone: true }),
    uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
    deletedAt: timestamp("deleted_at", { withTimezone: true }),
  },
  (table) => [
    index("photo_event_status_idx").on(table.eventId, table.status),
    index("photo_attendee_idx").on(table.attendeeId),
  ],
);

export const photoLikes = pgTable(
  "photo_likes",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    photoId: uuid("photo_id")
      .notNull()
      .references(() => photos.id, { onDelete: "cascade" }),
    attendeeId: uuid("attendee_id")
      .notNull()
      .references(() => attendees.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("photo_attendee_like_idx").on(table.photoId, table.attendeeId),
    index("photo_likes_photo_idx").on(table.photoId),
  ],
);

export type Photo = typeof photos.$inferSelect;
export type NewPhoto = typeof photos.$inferInsert;
export type PhotoLike = typeof photoLikes.$inferSelect;
export type NewPhotoLike = typeof photoLikes.$inferInsert;
