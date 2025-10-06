import { sql } from "drizzle-orm";
import { pgTable, uuid, varchar, text, timestamp, boolean, integer, real, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Users table with geospatial support
export const users = pgTable("users", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  firebaseUid: varchar("firebase_uid", { length: 255 }).unique().notNull(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  birthdate: timestamp("birthdate").notNull(),
  gender: varchar("gender", { length: 50 }).notNull(),
  bio: text("bio"),
  jobTitle: varchar("job_title", { length: 100 }),
  company: varchar("company", { length: 100 }),
  education: varchar("education", { length: 200 }),
  // PostGIS geography point (longitude, latitude)
  locationLat: doublePrecision("location_lat"),
  locationLon: doublePrecision("location_lon"),
  isVerified: boolean("is_verified").default(false),
  lastActive: timestamp("last_active").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  // Preferences
  prefGender: varchar("pref_gender", { length: 50 }).array().default(sql`ARRAY['todos']`),
  prefAgeMin: integer("pref_age_min").default(18),
  prefAgeMax: integer("pref_age_max").default(55),
  prefDistanceKm: integer("pref_distance_km").default(50),
});

// User rankings for Glicko-2 algorithm
export const userRankings = pgTable("user_rankings", {
  userId: uuid("user_id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  glickoRating: real("glicko_rating").default(1500.0).notNull(),
  glickoDeviation: real("glicko_deviation").default(350.0).notNull(),
  glickoVolatility: real("glicko_volatility").default(0.06).notNull(),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Photos
export const photos = pgTable("photos", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  url: text("url").notNull(),
  order: integer("order").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Interests
export const interests = pgTable("interests", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 50 }).notNull(),
});

// Swipes
export const swipes = pgTable("swipes", {
  swiperId: uuid("swiper_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  swipedId: uuid("swiped_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  direction: varchar("direction", { length: 10 }).notNull(), // 'right' or 'left'
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: sql`PRIMARY KEY (${table.swiperId}, ${table.swipedId})`,
}));

// Matches
export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  user1Id: uuid("user1_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  user2Id: uuid("user2_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Messages
export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  matchId: uuid("match_id").references(() => matches.id, { onDelete: "cascade" }).notNull(),
  senderId: uuid("sender_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blocks
export const blocks = pgTable("blocks", {
  blockerId: uuid("blocker_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  blockedId: uuid("blocked_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
}, (table) => ({
  pk: sql`PRIMARY KEY (${table.blockerId}, ${table.blockedId})`,
}));

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  ranking: one(userRankings, {
    fields: [users.id],
    references: [userRankings.userId],
  }),
  photos: many(photos),
  interests: many(interests),
}));

export const userRankingsRelations = relations(userRankings, ({ one }) => ({
  user: one(users, {
    fields: [userRankings.userId],
    references: [users.id],
  }),
}));

export const photosRelations = relations(photos, ({ one }) => ({
  user: one(users, {
    fields: [photos.userId],
    references: [users.id],
  }),
}));

export const interestsRelations = relations(interests, ({ one }) => ({
  user: one(users, {
    fields: [interests.userId],
    references: [users.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  user1: one(users, {
    fields: [matches.user1Id],
    references: [users.id],
  }),
  user2: one(users, {
    fields: [matches.user2Id],
    references: [users.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  match: one(matches, {
    fields: [messages.matchId],
    references: [matches.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  lastActive: true,
});

export const insertPhotoSchema = createInsertSchema(photos).omit({
  id: true,
  createdAt: true,
});

export const insertInterestSchema = createInsertSchema(interests).omit({
  id: true,
});

export const insertSwipeSchema = createInsertSchema(swipes).omit({
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UserRanking = typeof userRankings.$inferSelect;
export type Photo = typeof photos.$inferSelect;
export type InsertPhoto = z.infer<typeof insertPhotoSchema>;
export type Interest = typeof interests.$inferSelect;
export type InsertInterest = z.infer<typeof insertInterestSchema>;
export type Swipe = typeof swipes.$inferSelect;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Message = typeof messages.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

// Extended types with relations
export type UserWithDetails = User & {
  photos: Photo[];
  interests: Interest[];
  ranking?: UserRanking;
};
