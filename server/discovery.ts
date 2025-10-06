import { db } from "./db";
import { users, swipes, matches, blocks, userRankings, type User, type UserWithDetails } from "@shared/schema";
import { eq, and, or, sql, ne, inArray, notInArray } from "drizzle-orm";

interface DiscoveryParams {
  userId: string;
  limit?: number;
}

interface ScoredProfile extends UserWithDetails {
  score: number;
  distance?: number;
}

// Calculate distance between two geographic points using Haversine formula
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Scoring weights (configurable)
const WEIGHTS = {
  ranking: 0.3,
  distance: 0.4,
  activity: 0.2,
  interests: 0.1,
};

const MAX_RATING_DIFF = 1000; // Maximum rating difference for normalization

export async function getDiscoveryProfiles({ userId, limit = 20 }: DiscoveryParams): Promise<ScoredProfile[]> {
  // Get current user data
  const [currentUser] = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!currentUser) {
    throw new Error("User not found");
  }

  const [currentUserRanking] = await db
    .select()
    .from(userRankings)
    .where(eq(userRankings.userId, userId))
    .limit(1);

  // Get users already swiped
  const swipedUsers = await db
    .select({ swipedId: swipes.swipedId })
    .from(swipes)
    .where(eq(swipes.swiperId, userId));

  const swipedIds = swipedUsers.map(s => s.swipedId);

  // Get existing matches
  const existingMatches = await db
    .select()
    .from(matches)
    .where(
      or(
        eq(matches.user1Id, userId),
        eq(matches.user2Id, userId)
      )
    );

  const matchedIds = existingMatches.flatMap(m => 
    [m.user1Id, m.user2Id].filter(id => id !== userId)
  );

  // Get blocked users
  const blockedUsers = await db
    .select({ blockedId: blocks.blockedId })
    .from(blocks)
    .where(eq(blocks.blockerId, userId));

  const blockedIds = blockedUsers.map(b => b.blockedId);

  // Combine all excluded IDs
  const excludedIds = [...swipedIds, ...matchedIds, ...blockedIds, userId];

  // Build candidate pool query with filters
  const whereConditions = [
    ne(users.id, userId),
    excludedIds.length > 0 ? notInArray(users.id, excludedIds) : undefined,
  ];

  // Apply gender preference filter
  if (currentUser.prefGender && !currentUser.prefGender.includes('todos')) {
    whereConditions.push(inArray(users.gender, currentUser.prefGender));
  }

  const candidates = await db
    .select()
    .from(users)
    .where(and(...whereConditions.filter(Boolean)))
    .limit(500);

  // Filter by age and distance, then score
  const now = new Date();
  const scoredProfiles: ScoredProfile[] = [];

  for (const candidate of candidates) {
    // Calculate age
    const age = Math.floor((now.getTime() - new Date(candidate.birthdate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
    
    // Check age preference
    const minAge = currentUser.prefAgeMin || 18;
    const maxAge = currentUser.prefAgeMax || 55;
    if (age < minAge || age > maxAge) {
      continue;
    }

    // Calculate distance if both users have locations
    let distance: number | undefined;
    if (currentUser.locationLat && currentUser.locationLon && 
        candidate.locationLat && candidate.locationLon) {
      distance = calculateDistance(
        currentUser.locationLat,
        currentUser.locationLon,
        candidate.locationLat,
        candidate.locationLon
      );

      // Check distance preference
      const maxDistance = currentUser.prefDistanceKm || 50;
      if (distance > maxDistance) {
        continue;
      }
    }

    // Get candidate's ranking and details
    const [candidateRanking] = await db
      .select()
      .from(userRankings)
      .where(eq(userRankings.userId, candidate.id))
      .limit(1);

    const candidatePhotos = await db.query.photos.findMany({
      where: (photos, { eq }) => eq(photos.userId, candidate.id),
      orderBy: (photos, { asc }) => [asc(photos.order)],
    });

    const candidateInterests = await db.query.interests.findMany({
      where: (interests, { eq }) => eq(interests.userId, candidate.id),
    });

    // Calculate composite score
    let score = 0;

    // 1. Ranking score (similarity in ratings)
    if (currentUserRanking && candidateRanking) {
      const ratingDiff = Math.abs(currentUserRanking.glickoRating - candidateRanking.glickoRating);
      const rankingScore = 1 - (ratingDiff / MAX_RATING_DIFF);
      score += WEIGHTS.ranking * Math.max(0, rankingScore);
    }

    // 2. Distance score
    if (distance !== undefined) {
      const maxDist = currentUser.prefDistanceKm || 50;
      const distanceScore = 1 - (distance / maxDist);
      score += WEIGHTS.distance * Math.max(0, distanceScore);
    }

    // 3. Activity score (recency)
    if (candidate.lastActive) {
      const hoursSinceActive = (now.getTime() - new Date(candidate.lastActive).getTime()) / (60 * 60 * 1000);
      const activityScore = Math.max(0, 1 - (hoursSinceActive / (24 * 7))); // Decay over a week
      score += WEIGHTS.activity * activityScore;
    }

    // 4. Interest overlap score
    // TODO: Implement when we have user interests loaded
    score += WEIGHTS.interests * 0.5; // Default middle score

    scoredProfiles.push({
      ...candidate,
      photos: candidatePhotos,
      interests: candidateInterests,
      ranking: candidateRanking,
      score,
      distance,
    });
  }

  // Sort by score descending and return top matches
  return scoredProfiles
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}
