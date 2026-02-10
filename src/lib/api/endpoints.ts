/**
 * API Endpoints Configuration
 * 
 * Centralized endpoint constants for all API calls.
 * This ensures consistency across the application and makes it easier to maintain API routes.
 */

export const API_ENDPOINTS = {
  /**
   * Authentication endpoints
   */
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    TELEGRAM: '/auth/telegram',
    CONNECT_WALLET: '/auth/connect-wallet',
    REFRESH: '/auth/refresh',
  },

  /**
   * Lottery endpoints
   */
  LOTTERY: {
    LIST: '/lottery/list',
    DETAILS: (slug: string) => `/lottery/${slug}`,
    INFO: (slug: string) => `/lottery/${slug}/info`,
    BUY_TICKET: (slug: string) => `/lottery/${slug}/buy-ticket`,
    MY_TICKETS: (slug: string) => `/lottery/${slug}/my-tickets`,
    CURRENT_DRAW: (slug: string) => `/lottery/${slug}/current-draw`,
  },

  /**
   * Public endpoints (no auth required)
   */
  PUBLIC: {
    LOTTERIES: '/public/lotteries',
    LOTTERY_INFO: (slug: string) => `/public/lottery/${slug}`,
    CURRENT_DRAW: (slug: string) => `/public/lottery/${slug}/current-draw`,
    EXCHANGE_RATES: (from: string, to: string) => `/public/exchange-rates/${from}/${to}`,
  },

  /**
   * Ticket endpoints
   */
  TICKETS: {
    MY_TICKETS: '/tickets/my-tickets',
    DETAILS: (id: string) => `/tickets/${id}`,
    VERIFY: (id: string) => `/tickets/${id}/verify`,
  },

  /**
   * Draw endpoints
   */
  DRAWS: {
    CURRENT: '/draws/current',
    DETAILS: (id: string) => `/draws/${id}`,
    RESULTS: (id: string) => `/draws/${id}/results`,
    VERIFY: (id: string) => `/draws/${id}/verify`,
  },

  /**
   * User endpoints
   */
  USER: {
    PROFILE: '/user/profile',
    STATS: '/user/stats',
    HISTORY: '/user/history',
    UPDATE_PROFILE: '/user/profile',
    SETTINGS: '/user/settings',
  },

  /**
   * Gamification endpoints
   */
  GAMIFICATION: {
    ACHIEVEMENTS: '/gamification/achievements',
    PROGRESS: '/gamification/progress',
    PROFILE: '/gamification/profile',
    STREAK: '/gamification/streak',
    CHECK_IN: '/gamification/check-in',
    QUESTS: '/gamification/quests',
    REWARDS: '/gamification/rewards',
    CLAIM_REWARD: (id: string) => `/gamification/rewards/${id}/claim`,
  },

  /**
   * Referral endpoints
   */
  REFERRAL: {
    STATS: '/referral/stats',
    CODE: '/referral/code',
    HISTORY: '/referral/history',
  },

  /**
   * Swap/Exchange endpoints
   */
  SWAP: {
    QUOTE: '/swap/quote',
    BUILD_TRANSACTION: '/swap/build-transaction',
    TOKENS: '/swap/tokens',
    RATE: (from: string, to: string) => `/swap/rate/${from}/${to}`,
  },

  /**
   * Admin endpoints
   */
  ADMIN: {
    LOGIN: '/admin/login',
    USERS: '/admin/users',
    LOTTERIES: '/admin/lotteries',
    DRAWS: '/admin/draws',
    TICKETS: '/admin/tickets',
    NOTIFICATIONS: '/admin/notifications',
    STATS: '/admin/stats',
  },
} as const;

/**
 * Helper function to build query string from params
 */
export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  
  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
}
