import { index, pgEnum, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import { events } from "./events";
import { users } from "./users";

export const attendeeRoleEnum = pgEnum("attendee_role", [
  "host",
  "co_host",
  "guest",
  "photographer",
]);

export const attendees = pgTable(
  "attendees",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
    nickname: varchar("nickname", { length: 100 }).notNull(),
    avatarUrl: text("avatar_url"),
    role: attendeeRoleEnum("role").default("guest").notNull(),
    pinCode: varchar("pin_code", { length: 6 }),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("attendee_event_idx").on(table.eventId),
    index("attendee_user_idx").on(table.userId),
    uniqueIndex("attendee_event_nickname_idx").on(table.eventId, table.nickname),
  ],
);

export type Attendee = typeof attendees.$inferSelect;
export type NewAttendee = typeof attendees.$inferInsert;
