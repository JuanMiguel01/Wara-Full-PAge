import { 
  users, 
  userRankings,
  photos,
  interests,
  swipes,
  matches,
  messages,
  type User, 
  type InsertUser,
  type UserRanking,
  type Photo,
  type InsertPhoto,
  type Interest,
  type InsertInterest,
  type Swipe,
  type InsertSwipe,
  type Match,
  type InsertMatch,
  type Message,
  type InsertMessage,
  type UserWithDetails,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, desc, sql } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getUserWithDetails(id: string): Promise<UserWithDetails | undefined>;

  // User Rankings
  getUserRanking(userId: string): Promise<UserRanking | undefined>;
  createUserRanking(userId: string): Promise<UserRanking>;
  updateUserRanking(userId: string, updates: Partial<UserRanking>): Promise<UserRanking | undefined>;

  // Photos
  getPhotosByUserId(userId: string): Promise<Photo[]>;
  addPhoto(photo: InsertPhoto): Promise<Photo>;
  deletePhoto(id: string): Promise<void>;

  // Interests
  getInterestsByUserId(userId: string): Promise<Interest[]>;
  addInterest(interest: InsertInterest): Promise<Interest>;
  deleteInterest(id: string): Promise<void>;

  // Swipes
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  getSwipe(swiperId: string, swipedId: string): Promise<Swipe | undefined>;
  checkMutualLike(user1Id: string, user2Id: string): Promise<boolean>;

  // Matches
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesByUserId(userId: string): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;

  // Messages
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByMatchId(matchId: string): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    
    // Create initial ranking
    await this.createUserRanking(user.id);
    
    return user;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...updates, lastActive: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getUserWithDetails(id: string): Promise<UserWithDetails | undefined> {
    const user = await this.getUser(id);
    if (!user) return undefined;

    const userPhotos = await this.getPhotosByUserId(id);
    const userInterests = await this.getInterestsByUserId(id);
    const ranking = await this.getUserRanking(id);

    return {
      ...user,
      photos: userPhotos,
      interests: userInterests,
      ranking,
    };
  }

  // User Rankings
  async getUserRanking(userId: string): Promise<UserRanking | undefined> {
    const [ranking] = await db.select().from(userRankings).where(eq(userRankings.userId, userId));
    return ranking || undefined;
  }

  async createUserRanking(userId: string): Promise<UserRanking> {
    const [ranking] = await db
      .insert(userRankings)
      .values({ userId })
      .returning();
    return ranking;
  }

  async updateUserRanking(userId: string, updates: Partial<UserRanking>): Promise<UserRanking | undefined> {
    const [ranking] = await db
      .update(userRankings)
      .set({ ...updates, lastUpdated: new Date() })
      .where(eq(userRankings.userId, userId))
      .returning();
    return ranking || undefined;
  }

  // Photos
  async getPhotosByUserId(userId: string): Promise<Photo[]> {
    return await db
      .select()
      .from(photos)
      .where(eq(photos.userId, userId))
      .orderBy(photos.order);
  }

  async addPhoto(photo: InsertPhoto): Promise<Photo> {
    const [newPhoto] = await db.insert(photos).values(photo).returning();
    return newPhoto;
  }

  async deletePhoto(id: string): Promise<void> {
    await db.delete(photos).where(eq(photos.id, id));
  }

  // Interests
  async getInterestsByUserId(userId: string): Promise<Interest[]> {
    return await db.select().from(interests).where(eq(interests.userId, userId));
  }

  async addInterest(interest: InsertInterest): Promise<Interest> {
    const [newInterest] = await db.insert(interests).values(interest).returning();
    return newInterest;
  }

  async deleteInterest(id: string): Promise<void> {
    await db.delete(interests).where(eq(interests.id, id));
  }

  // Swipes
  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const [newSwipe] = await db.insert(swipes).values(swipe).returning();
    return newSwipe;
  }

  async getSwipe(swiperId: string, swipedId: string): Promise<Swipe | undefined> {
    const [swipe] = await db
      .select()
      .from(swipes)
      .where(and(eq(swipes.swiperId, swiperId), eq(swipes.swipedId, swipedId)));
    return swipe || undefined;
  }

  async checkMutualLike(user1Id: string, user2Id: string): Promise<boolean> {
    const swipe1 = await this.getSwipe(user1Id, user2Id);
    const swipe2 = await this.getSwipe(user2Id, user1Id);
    
    return swipe1?.direction === 'right' && swipe2?.direction === 'right';
  }

  // Matches
  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db.insert(matches).values(match).returning();
    return newMatch;
  }

  async getMatchesByUserId(userId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(or(eq(matches.user1Id, userId), eq(matches.user2Id, userId)))
      .orderBy(desc(matches.createdAt));
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const [match] = await db.select().from(matches).where(eq(matches.id, id));
    return match || undefined;
  }

  // Messages
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async getMessagesByMatchId(matchId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.matchId, matchId))
      .orderBy(messages.createdAt);
  }
}

export const storage = new DatabaseStorage();
