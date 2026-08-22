import { relations } from "drizzle-orm";
import {
  attendees,
  events,
  organizationMembers,
  organizations,
  photoLikes,
  photos,
  subscriptions,
  users,
} from "../schema/index";

/**
 * Drizzle ORM Relational Mapping
 * Enables queries using the db.query.* API
 */

export const usersRelations = relations(users, ({ many }) => ({
  organizationsOwned: many(organizations),
  organizationMemberships: many(organizationMembers),
  eventsCreated: many(events),
  attendeeProfiles: many(attendees),
}));

export const organizationsRelations = relations(organizations, ({ one, many }) => ({
  owner: one(users, {
    fields: [organizations.ownerId],
    references: [users.id],
  }),
  members: many(organizationMembers),
  events: many(events),
  subscription: one(subscriptions),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [organizationMembers.userId],
    references: [users.id],
  }),
}));

export const eventsRelations = relations(events, ({ one, many }) => ({
  creator: one(users, {
    fields: [events.creatorId],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [events.organizationId],
    references: [organizations.id],
  }),
  attendees: many(attendees),
  photos: many(photos),
}));

export const attendeesRelations = relations(attendees, ({ one, many }) => ({
  event: one(events, {
    fields: [attendees.eventId],
    references: [events.id],
  }),
  user: one(users, {
    fields: [attendees.userId],
    references: [users.id],
  }),
  photosUploaded: many(photos),
  likes: many(photoLikes),
}));

export const photosRelations = relations(photos, ({ one, many }) => ({
  event: one(events, {
    fields: [photos.eventId],
    references: [events.id],
  }),
  uploader: one(attendees, {
    fields: [photos.attendeeId],
    references: [attendees.id],
  }),
  likes: many(photoLikes),
}));

export const photoLikesRelations = relations(photoLikes, ({ one }) => ({
  photo: one(photos, {
    fields: [photoLikes.photoId],
    references: [photos.id],
  }),
  attendee: one(attendees, {
    fields: [photoLikes.attendeeId],
    references: [attendees.id],
  }),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
}));
