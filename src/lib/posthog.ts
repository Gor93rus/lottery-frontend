import posthog from 'posthog-js';

// PostHog configuration
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST || 'https://eu.posthog.com';

// Initialize PostHog
export const initPostHog = () => {
  if (!POSTHOG_KEY) {
    console.warn('PostHog key not configured');
    return;
  }

  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    // Capture pageviews manually via AnalyticsProvider
    capture_pageview: false,
    // Capture pageleaves
    capture_pageleave: true,
    // Enable session recording (optional)
    disable_session_recording: false,
    // Respect Do Not Track
    respect_dnt: true,
    // Persistence
    persistence: 'localStorage',
    // Auto capture clicks
    autocapture: true,
    // Loaded callback
    loaded: (posthog) => {
      if (import.meta.env.DEV) {
        // Disable in development
        posthog.opt_out_capturing();
        console.log('PostHog disabled in development');
      }
    },
  });

  return posthog;
};

// Identify user (call after login)
export const identifyUser = (userId: string | number, properties?: Record<string, unknown>) => {
  if (!POSTHOG_KEY) return;
  
  posthog.identify(String(userId), {
    ...properties,
    platform: 'telegram_mini_app',
  });
};

// Reset user (call on logout)
export const resetUser = () => {
  if (!POSTHOG_KEY) return;
  posthog.reset();
};

// Track custom event
export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (!POSTHOG_KEY) return;
  
  posthog.capture(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

// Pre-defined events
export const analytics = {
  // Auth events
  login: (userId: number, method: string = 'telegram') => {
    trackEvent('user_login', { userId, method });
    identifyUser(userId);
  },
  
  logout: () => {
    trackEvent('user_logout');
    resetUser();
  },

  // Lottery events
  viewLottery: (lotteryId: string, lotteryName: string) => {
    trackEvent('lottery_viewed', { lotteryId, lotteryName });
  },

  selectNumbers: (lotteryId: string, numbers: number[]) => {
    trackEvent('numbers_selected', { lotteryId, numbersCount: numbers.length });
  },

  // Purchase events
  purchaseStarted: (lotteryId: string, ticketCount: number, totalPrice: number) => {
    trackEvent('purchase_started', { lotteryId, ticketCount, totalPrice });
  },

  purchaseCompleted: (lotteryId: string, ticketCount: number, totalPrice: number, txHash: string) => {
    trackEvent('purchase_completed', { 
      lotteryId, 
      ticketCount, 
      totalPrice,
      txHash,
    });
  },

  purchaseFailed: (lotteryId: string, error: string) => {
    trackEvent('purchase_failed', { lotteryId, error });
  },

  // Wallet events
  walletConnected: (address: string) => {
    trackEvent('wallet_connected', { address: address.substring(0, 10) + '...' });
  },

  walletDisconnected: () => {
    trackEvent('wallet_disconnected');
  },

  // Draw events
  drawViewed: (drawId: string) => {
    trackEvent('draw_viewed', { drawId });
  },

  drawVerified: (drawId: string) => {
    trackEvent('draw_verified', { drawId });
  },

  // Gamification events
  achievementUnlocked: (achievementId: string, achievementName: string) => {
    trackEvent('achievement_unlocked', { achievementId, achievementName });
  },

  levelUp: (newLevel: number) => {
    trackEvent('level_up', { newLevel });
  },

  // Referral events
  referralLinkCopied: () => {
    trackEvent('referral_link_copied');
  },

  referralLinkShared: (platform: string) => {
    trackEvent('referral_link_shared', { platform });
  },

  // Page views (manual tracking)
  pageView: (pageName: string, properties?: Record<string, unknown>) => {
    trackEvent('$pageview', { pageName, ...properties });
  },

  // Feature usage
  featureUsed: (featureName: string) => {
    trackEvent('feature_used', { featureName });
  },

  // Errors
  errorOccurred: (errorType: string, errorMessage: string, context?: Record<string, unknown>) => {
    trackEvent('error_occurred', { errorType, errorMessage, ...context });
  },
};

export default posthog;
