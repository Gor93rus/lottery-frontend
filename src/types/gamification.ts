// Profile
export interface GamificationProfile {
  userId: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  totalTickets: number;
  totalWins: number;
  totalWinnings: number;
  vipStatus: 'none' | 'bronze' | 'gold' | 'diamond';
}

// Streak
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
  totalCheckIns: number;
  canCheckIn: boolean;
  nextMilestone: {
    days: number;
    reward: RewardPreview;
  } | null;
}

export interface CheckInResult {
  success: boolean;
  xpEarned: number;
  newStreak: number;
  milestoneReached: {
    days: number;
    reward: RewardPreview;
  } | null;
}

// Quests
export type QuestType = 'daily' | 'weekly' | 'monthly' | 'onetime';
export type QuestCategory = 'tickets' | 'streak' | 'social' | 'onboarding';

export interface Quest {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: QuestType;
  category: QuestCategory;
  target: number;
  rewardType: 'xp' | 'ticket' | 'badge';
  rewardValue: number;
  icon?: string;
}

export interface UserQuest {
  id: string;
  quest: Quest;
  progress: number;
  completed: boolean;
  completedAt: string | null;
  claimed: boolean;
  claimedAt: string | null;
  expiresAt: string | null;
}

// Achievements
export type AchievementTier = 'bronze' | 'gold' | 'diamond';
export type AchievementCategory = 'tickets' | 'wins' | 'streak' | 'referrals' | 'level';

export interface Achievement {
  id: string;
  slug: string;
  name: string;
  title: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: string;
  requirement: number;
  rewardXp: number;
  rewardTickets: number;
  unlockedAt: string | null; 
}

export interface UserAchievement {
  id: string;
  achievement: Achievement;
  unlockedAt: string;
  claimed: boolean;
  claimedAt: string | null;
}

export interface AchievementProgress {
  achievement: Achievement;
  currentValue: number;
  unlocked: boolean;
  userAchievement: UserAchievement | null;
}

// Rewards
export interface RewardPreview {
  type: 'xp' | 'ticket' | 'badge';
  value: number;
  description?: string;
}

export interface UserReward {
  id: string;
  source: 'quest' | 'achievement' | 'streak' | 'level' | 'referral' | 'leaderboard';
  sourceId: string | null;
  type: 'xp' | 'ticket' | 'badge';
  value: number;
  claimed: boolean;
  claimedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

// Referrals
export interface ReferralStats {
  code: string;
  totalReferrals: number;
  activeReferrals: number;
  totalXpEarned: number;
  totalTicketsEarned: number;
}

export interface ReferralUser {
  userId: string;
  username: string | null;
  status: 'registered' | 'first_purchase' | 'active';
  joinedAt: string;
  ticketsBought: number;
}

// Leaderboard
export type LeaderboardType = 'level' | 'xp' | 'tickets' | 'winnings';
export type LeaderboardPeriod = 'all' | 'month' | 'week';

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  username: string | null;
  displayName: string;
  level: number;
  value: number;
  isCurrentUser: boolean;
}

export interface LeaderboardResponse {
  type: LeaderboardType;
  period: LeaderboardPeriod;
  entries: LeaderboardEntry[];
  currentUserRank: number | null;
}
