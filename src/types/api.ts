/**
 * API Type Definitions
 * 
 * Centralized type definitions for all API requests and responses.
 * These types ensure type safety across the application.
 */

/**
 * Generic API Response wrapper
 */
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Paginated API Response
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
  pagination: PaginationMeta;
}

/**
 * Lottery Types
 */
export interface Lottery {
  id: string;
  slug: string;
  name: string;
  description?: string;
  active: boolean;
  prizePool: number;
  ticketPrice: number;
  drawDate: string;
  participants: number;
  currency: 'TON' | 'USDT';
  numbersToSelect: number;
  numbersPool: number;
  lotteryWallet: string;
  currentJackpot: number;
  jackpot?: number;
  prizeStructure?: Record<string, number | string>;
  featured?: boolean;
  isActive?: boolean;
  rules?: string;
}

/**
 * Draw Types
 */
export interface Draw {
  id: string;
  lotteryId: string;
  drawNumber: number;
  scheduledAt: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  ticketSalesOpen: boolean;
  ticketSalesClosedAt?: string;
  dataFinalized?: boolean;
  dataFinalizedAt?: string;
  seedHash?: string;
  winningNumbers?: number[];
  totalPrizePool?: number;
  totalTickets?: number;
}

/**
 * Ticket Types
 */
export interface Ticket {
  id: string;
  ticketNumber?: string;
  numbers: number[];
  selectedNumbers?: number[];
  purchasedAt: string;
  status: 'active' | 'won' | 'lost' | 'pending';
  drawId?: string;
  drawDate?: string;
  lotteryId?: string;
  lotterySlug?: string;
  prizeAmount?: number;
  txHash?: string;
  walletAddress?: string;
  blockNumber?: number;
  blockTimestamp?: string;
  price?: number;
  currency?: string;
  userId?: string;
  matchedNumbers?: number;
  prizeWon?: number;
}

/**
 * User Types
 */
export interface User {
  id: string;
  telegramId?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  walletAddress?: string;
  balance: number;
  totalTickets: number;
  totalWins: number;
  totalWinnings?: number;
  level?: number;
  xp?: number;
  vipStatus?: 'none' | 'bronze' | 'gold' | 'diamond';
  createdAt?: string;
  lastLoginAt?: string;
}

/**
 * User Statistics
 */
export interface UserStats {
  totalTickets: number;
  totalWins: number;
  totalWinnings: number;
  activeTickets: number;
  winRate: number;
  favorableLottery?: string;
  recentWins: number;
}

/**
 * Achievement Types
 */
export interface Achievement {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress: number;
  target: number;
  category?: string;
  rarity?: 'common' | 'rare' | 'epic' | 'legendary';
  rewardXp?: number;
  unlockedAt?: string;
}

/**
 * Gamification Profile
 */
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

/**
 * Quest Types
 */
export interface Quest {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: 'daily' | 'weekly' | 'monthly' | 'onetime';
  category: 'tickets' | 'streak' | 'social' | 'onboarding';
  target: number;
  progress: number;
  rewardType: 'xp' | 'ticket' | 'badge';
  rewardValue: number;
  completed: boolean;
  expiresAt?: string;
}

/**
 * Streak Information
 */
export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastCheckIn: string | null;
  totalCheckIns: number;
  canCheckIn: boolean;
}

/**
 * Referral Statistics
 */
export interface ReferralStats {
  code: string | null;
  totalReferrals: number;
  activeReferrals: number;
  totalEarnings: number;
  earnedThisMonth: number;
  tier: string;
}

/**
 * Authentication Types
 */
export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  refreshToken?: string;
}

export interface LoginRequest {
  username?: string;
  password?: string;
  telegramId?: string;
}

export interface RegisterRequest {
  username: string;
  password?: string;
  telegramId?: string;
  email?: string;
}

export interface TelegramAuthData {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  auth_date?: number;
  hash?: string;
}

/**
 * Transaction Types
 */
export interface Transaction {
  id: string;
  type: 'ticket_purchase' | 'prize_won' | 'deposit' | 'withdrawal';
  amount: number;
  currency: 'TON' | 'USDT';
  status: 'pending' | 'completed' | 'failed';
  txHash?: string;
  createdAt: string;
  description?: string;
}

/**
 * Swap/Exchange Types
 */
export interface SwapQuote {
  from: string;
  to: string;
  amount: number;
  estimatedOutput: number;
  rate: number;
  priceImpact: number;
  fee: number;
}

export interface SwapTransaction {
  transaction: unknown;
  quote: SwapQuote;
  minOutput: string;
  estimatedGas: string;
}

/**
 * Admin Types
 */
export interface AdminStats {
  totalUsers: number;
  totalTickets: number;
  totalRevenue: number;
  activeDraws: number;
  pendingTickets: number;
}

/**
 * Error Types
 */
export interface ApiError {
  error: string;
  message: string;
  statusCode?: number;
  details?: unknown;
}

/**
 * Request Options
 */
export interface RequestOptions extends RequestInit {
  token?: string;
  timeout?: number;
}
