import { auth } from "./firebase";
import type { User, UserWithDetails, Match, Message, InsertSwipe } from "@shared/schema";

async function getAuthHeaders(): Promise<HeadersInit> {
  const user = auth.currentUser;
  if (!user) {
    throw new Error("Not authenticated");
  }

  return {
    'Content-Type': 'application/json',
    'x-firebase-uid': user.uid,
  };
}

export const api = {
  // Auth
  async getCurrentUser(): Promise<UserWithDetails> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/auth/me', { headers });
    if (!res.ok) throw new Error('Failed to fetch user');
    return res.json();
  },

  async registerUser(userData: any): Promise<User> {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    if (!res.ok) throw new Error('Failed to register user');
    return res.json();
  },

  // Discovery
  async getDiscoveryProfiles(limit = 20): Promise<any[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/discovery?limit=${limit}`, { headers });
    if (!res.ok) throw new Error('Failed to fetch discovery profiles');
    return res.json();
  },

  // Swipes
  async createSwipe(swipeData: Omit<InsertSwipe, 'swiperId'>): Promise<{ swipe: any; match?: Match; isMatch: boolean }> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/swipes', {
      method: 'POST',
      headers,
      body: JSON.stringify(swipeData),
    });
    if (!res.ok) throw new Error('Failed to create swipe');
    return res.json();
  },

  // Matches
  async getMatches(): Promise<any[]> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/matches', { headers });
    if (!res.ok) throw new Error('Failed to fetch matches');
    return res.json();
  },

  // Messages
  async getMessages(matchId: string): Promise<Message[]> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/matches/${matchId}/messages`, { headers });
    if (!res.ok) throw new Error('Failed to fetch messages');
    return res.json();
  },

  // Interests
  async addInterest(name: string): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/interests', {
      method: 'POST',
      headers,
      body: JSON.stringify({ name }),
    });
    if (!res.ok) throw new Error('Failed to add interest');
    return res.json();
  },

  async deleteInterest(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/interests/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Failed to delete interest');
  },

  // Photos
  async addPhoto(url: string, order: number): Promise<any> {
    const headers = await getAuthHeaders();
    const res = await fetch('/api/photos', {
      method: 'POST',
      headers,
      body: JSON.stringify({ url, order }),
    });
    if (!res.ok) throw new Error('Failed to add photo');
    return res.json();
  },

  async deletePhoto(id: string): Promise<void> {
    const headers = await getAuthHeaders();
    const res = await fetch(`/api/photos/${id}`, {
      method: 'DELETE',
      headers,
    });
    if (!res.ok) throw new Error('Failed to delete photo');
  },
};
