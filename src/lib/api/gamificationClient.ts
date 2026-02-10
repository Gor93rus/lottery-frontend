import { getApiBaseUrl } from '../utils/env';

const API_BASE_URL = getApiBaseUrl();

/**
 * Gamification API Client
 * Provides methods to interact with gamification endpoints
 */

// Helper function to make API requests with userId header
async function request<T>(
  endpoint: string,
  userId?: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(userId && { 'x-user-id': userId }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || 'API request failed');
  }

  return response.json();
}

export interface UserProfile {
  userId: string;
  level: number;
  xp: number;
  totalTickets: number;
  totalWinnings: number;
  nextLevelXp: number;
}

export interface ReferralStats {
  code: string | null;
  totalReferrals: number;
  activeReferrals: number;
  totalRewards: number;
  claimedRewards: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: Date | null;
  totalCheckIns: number;
  streakBonus: number;
  canCheckIn: boolean;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  target: number;
  progress: number;
  isCompleted: boolean;
  reward: { type: string; value: number };
  rewardClaimed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  title: string;
  description: string;
  category: string;
  tier: string;
  icon?: string;
  reward: { type: string; value: number };
  unlockedAt?: Date;
  rewardClaimed?: boolean;
}

export interface Reward {
  id: string;
  type: string;
  name: string;
  description?: string;
  value: number;
  currency?: string;
  claimed: boolean;
  expiresAt?: Date;
}

export const gamificationClient = {
  // Profile
  async getProfile(userId: string) {
    return request('/gamification/profile', userId);
  },

  async getLeaderboard(type: 'level' | 'xp' | 'tickets' | 'winnings' = 'level', limit: number = 10, userId?: string) {
    return request(`/gamification/leaderboard?type=${type}&limit=${limit}`, userId);
  },

  // Referral
  async getReferralCode(userId: string) {
    return request('/gamification/referral', userId);
  },

  async applyReferralCode(userId: string, code: string) {
    return request('/gamification/referral/apply', userId, {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  },

  async getReferralStats(userId: string) {
    return request('/gamification/referral', userId);
  },

  // Quests
  async getAvailableQuests(userId: string, type?: string) {
    const url = type ? `/gamification/quests?type=${type}` : '/gamification/quests';
    return request(url, userId);
  },

  async getUserQuests(userId: string) {
    return request('/gamification/quests', userId);
  },

  async claimQuestReward(userId: string, questId: string) {
    return request(`/gamification/quests/${questId}/claim`, userId, {
      method: 'POST'
    });
  },

  // Achievements
  async getAllAchievements(userId?: string) {
    return request('/gamification/achievements', userId);
  },

  async getUserAchievements(userId: string) {
    return request('/gamification/achievements', userId);
  },

  async claimAchievementReward(userId: string, achievementId: string) {
    return request(`/gamification/achievements/${achievementId}/claim`, userId, {
      method: 'POST'
    });
  },

  // Streak - ИСПРАВЛЕННЫЕ ПУТИ
  async getCurrentStreak(userId: string) {
    return request('/gamification/streak', userId);  // было /streak/current
  },

  async checkIn(userId: string) {
    return request('/gamification/check-in', userId, {  // было /streak/checkin
      method: 'POST'
    });
  },

  // Progress/Level
  async getProgress(userId: string) {
    return request('/gamification/progress', userId);
  },

  async getMine(userId: string) {
    return request('/gamification/mine', userId);
  },

  // Rewards
  async getAvailableRewards(userId: string) {
    return request('/gamification/rewards', userId);
  },

  async getClaimedRewards(userId: string, limit: number = 20) {
    return request(`/gamification/rewards/claimed?limit=${limit}`, userId);
  },

  async claimReward(userId: string, rewardId: string) {
    return request(`/gamification/rewards/${rewardId}/claim`, userId, {
      method: 'POST'
    });
  }
};
  

export default gamificationClient;
