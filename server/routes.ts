import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { insertSwipeSchema, insertMessageSchema, type InsertUser } from "@shared/schema";
import { updateGlicko2 } from "./glicko2";
import { getDiscoveryProfiles } from "./discovery";

interface AuthenticatedRequest extends Express.Request {
  userId?: string;
}

// Simple auth middleware (TODO: Replace with proper Firebase token verification)
async function authMiddleware(req: any, res: any, next: any) {
  const firebaseUid = req.headers['x-firebase-uid'] as string;
  
  if (!firebaseUid) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const user = await storage.getUserByFirebaseUid(firebaseUid);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.userId = user.id;
  next();
}

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  const clients = new Map<string, WebSocket>();

  wss.on('connection', (ws: WebSocket, req) => {
    const userId = new URL(req.url!, `http://${req.headers.host}`).searchParams.get('userId');
    
    if (userId) {
      clients.set(userId, ws);
      console.log(`WebSocket connected: ${userId}`);
    }

    ws.on('message', async (data) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'chat_message' && userId) {
          // Save message to database
          const savedMessage = await storage.createMessage({
            matchId: message.matchId,
            senderId: userId,
            content: message.content,
          });

          // Get match to find recipient
          const match = await storage.getMatch(message.matchId);
          if (match) {
            const recipientId = match.user1Id === userId ? match.user2Id : match.user1Id;
            const recipientWs = clients.get(recipientId);

            // Send to recipient if online
            if (recipientWs && recipientWs.readyState === WebSocket.OPEN) {
              recipientWs.send(JSON.stringify({
                type: 'chat_message',
                message: savedMessage,
              }));
            }

            // Echo back to sender
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({
                type: 'chat_message',
                message: savedMessage,
              }));
            }
          }
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      if (userId) {
        clients.delete(userId);
        console.log(`WebSocket disconnected: ${userId}`);
      }
    });
  });

  // Auth routes
  app.post('/api/auth/register', async (req, res) => {
    try {
      const userData: InsertUser = req.body;
      const existingUser = await storage.getUserByFirebaseUid(userData.firebaseUid);
      
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }

      const user = await storage.createUser(userData);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/auth/me', authMiddleware, async (req: any, res) => {
    try {
      const user = await storage.getUserWithDetails(req.userId);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Profile routes
  app.get('/api/profiles/:id', authMiddleware, async (req: any, res) => {
    try {
      const profile = await storage.getUserWithDetails(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
      res.json(profile);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.patch('/api/profiles/me', authMiddleware, async (req: any, res) => {
    try {
      const updates = req.body;
      const user = await storage.updateUser(req.userId, updates);
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Discovery route
  app.get('/api/discovery', authMiddleware, async (req: any, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const profiles = await getDiscoveryProfiles({ userId: req.userId, limit });
      res.json(profiles);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Swipe routes
  app.post('/api/swipes', authMiddleware, async (req: any, res) => {
    try {
      const swipeData = insertSwipeSchema.parse({
        swiperId: req.userId,
        ...req.body,
      });

      const swipe = await storage.createSwipe(swipeData);

      // Update Glicko-2 rankings if it's a like
      if (swipeData.direction === 'right') {
        const swiperRanking = await storage.getUserRanking(swipeData.swiperId);
        const swipedRanking = await storage.getUserRanking(swipeData.swipedId);

        if (swiperRanking && swipedRanking) {
          // Swiper "wins" (gives like), swiped "loses" (receives like)
          const newSwiperRanking = updateGlicko2(
            {
              rating: swiperRanking.glickoRating,
              deviation: swiperRanking.glickoDeviation,
              volatility: swiperRanking.glickoVolatility,
            },
            {
              rating: swipedRanking.glickoRating,
              deviation: swipedRanking.glickoDeviation,
              volatility: swipedRanking.glickoVolatility,
            },
            1
          );
          const newSwipedRanking = updateGlicko2(
            {
              rating: swipedRanking.glickoRating,
              deviation: swipedRanking.glickoDeviation,
              volatility: swipedRanking.glickoVolatility,
            },
            {
              rating: swiperRanking.glickoRating,
              deviation: swiperRanking.glickoDeviation,
              volatility: swiperRanking.glickoVolatility,
            },
            0
          );

          await storage.updateUserRanking(swipeData.swiperId, {
            glickoRating: newSwiperRanking.rating,
            glickoDeviation: newSwiperRanking.deviation,
            glickoVolatility: newSwiperRanking.volatility,
          });
          await storage.updateUserRanking(swipeData.swipedId, {
            glickoRating: newSwipedRanking.rating,
            glickoDeviation: newSwipedRanking.deviation,
            glickoVolatility: newSwipedRanking.volatility,
          });
        }

        // Check for mutual like
        const isMutual = await storage.checkMutualLike(swipeData.swiperId, swipeData.swipedId);
        
        if (isMutual) {
          // Create match
          const match = await storage.createMatch({
            user1Id: swipeData.swiperId,
            user2Id: swipeData.swipedId,
          });

          return res.json({ swipe, match, isMatch: true });
        }
      }

      res.json({ swipe, isMatch: false });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Match routes
  app.get('/api/matches', authMiddleware, async (req: any, res) => {
    try {
      const matches = await storage.getMatchesByUserId(req.userId);
      
      // Enrich with user details
      const enrichedMatches = await Promise.all(
        matches.map(async (match) => {
          const otherUserId = match.user1Id === req.userId ? match.user2Id : match.user1Id;
          const otherUser = await storage.getUserWithDetails(otherUserId);
          return {
            ...match,
            otherUser,
          };
        })
      );

      res.json(enrichedMatches);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Message routes
  app.get('/api/matches/:matchId/messages', authMiddleware, async (req: any, res) => {
    try {
      const match = await storage.getMatch(req.params.matchId);
      
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }

      // Verify user is part of the match
      if (match.user1Id !== req.userId && match.user2Id !== req.userId) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      const messages = await storage.getMessagesByMatchId(req.params.matchId);
      res.json(messages);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Interest routes
  app.post('/api/interests', authMiddleware, async (req: any, res) => {
    try {
      const interest = await storage.addInterest({
        userId: req.userId,
        name: req.body.name,
      });
      res.json(interest);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/interests/:id', authMiddleware, async (req: any, res) => {
    try {
      await storage.deleteInterest(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Photo routes
  app.post('/api/photos', authMiddleware, async (req: any, res) => {
    try {
      const photo = await storage.addPhoto({
        userId: req.userId,
        url: req.body.url,
        order: req.body.order || 0,
      });
      res.json(photo);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.delete('/api/photos/:id', authMiddleware, async (req: any, res) => {
    try {
      await storage.deletePhoto(req.params.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return httpServer;
}
