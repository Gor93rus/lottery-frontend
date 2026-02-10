/**
 * Marketing Analytics - интеграция UTM с PostHog
 */

import { trackEvent, identifyUser } from './posthog';
import { getUTMForAnalytics } from './utm';

/**
 * Отправляет UTM данные в analytics при первом визите
 */
export const trackMarketingAttribution = () => {
  const utmParams = getUTMForAnalytics();
  
  if (Object.keys(utmParams).length > 0) {
    trackEvent('marketing_attribution', {
      ...utmParams,
      landing_page: window.location.pathname,
      referrer: document.referrer || 'direct',
      timestamp: new Date().toISOString(),
    });
  }
};

/**
 * Трекает конверсию с attribution
 */
export const trackConversion = (
  conversionType: 'signup' | 'first_purchase' | 'deposit' | 'referral_signup',
  value?: number,
  additionalProps?: Record<string, unknown>
) => {
  const utmParams = getUTMForAnalytics();

  trackEvent(`conversion_${conversionType}`, {
    ...utmParams,
    conversion_value: value,
    ...additionalProps,
  });
};

/**
 * Трекает campaign performance
 */
export const trackCampaignEvent = (
  eventName: string,
  campaignId?: string,
  props?: Record<string, unknown>
) => {
  const utmParams = getUTMForAnalytics();

  trackEvent(eventName, {
    ...utmParams,
    campaign_id: campaignId || utmParams.utm_campaign,
    ...props,
  });
};

/**
 * Идентифицирует пользователя с marketing данными
 */
export const identifyWithMarketing = (
  userId: string | number,
  userProps?: Record<string, unknown>
) => {
  const utmParams = getUTMForAnalytics();

  identifyUser(userId, {
    ...userProps,
    // First touch attribution
    first_utm_source: utmParams.utm_source,
    first_utm_medium: utmParams.utm_medium,
    first_utm_campaign: utmParams.utm_campaign,
    acquisition_channel: utmParams.utm_source || 'organic',
  });
};

/**
 * Marketing events для разных воронок
 */
export const marketing = {
  // Acquisition funnel
  landingPageView: () => {
    trackCampaignEvent('landing_page_view');
  },

  signupStarted: () => {
    trackCampaignEvent('signup_started');
  },

  signupCompleted: (userId: string | number) => {
    trackConversion('signup');
    identifyWithMarketing(userId);
  },

  // Activation funnel
  walletConnected: () => {
    trackCampaignEvent('activation_wallet_connected');
  },

  firstDepositStarted: (amount: number) => {
    trackCampaignEvent('activation_deposit_started', undefined, { amount });
  },

  firstDepositCompleted: (amount: number) => {
    trackConversion('deposit', amount);
    trackCampaignEvent('activation_deposit_completed', undefined, { amount });
  },

  firstPurchase: (amount: number, lotteryId: string) => {
    trackConversion('first_purchase', amount, { lotteryId });
  },

  // Referral tracking
  referralLinkGenerated: (referralCode: string) => {
    trackCampaignEvent('referral_link_generated', undefined, { referralCode });
  },

  referralSignup: (referrerCode: string) => {
    trackConversion('referral_signup', undefined, { referrerCode });
  },

  // Ad tracking helpers
  adClicked: (adId: string, adPlatform: string) => {
    trackCampaignEvent('ad_clicked', undefined, { adId, adPlatform });
  },

  adImpression: (adId: string, adPlatform: string) => {
    trackCampaignEvent('ad_impression', undefined, { adId, adPlatform });
  },
};

export default marketing;
