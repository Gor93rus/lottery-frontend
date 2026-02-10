/**
 * Enhanced Telegram Web App initialization utilities
 */

import { isAuthDataRecent } from './auth/validation';

/**
 * Telegram Web App user data (from window.Telegram.WebApp)
 * Note: first_name may be optional in raw Telegram data
 */
export interface TelegramWebAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  photo_url?: string;
  language_code?: string;
  auth_date?: number;
  hash?: string;
}

export interface TelegramWebAppData {
  user: TelegramWebAppUser | null;
  authDate: number | null;
  hash: string | null;
  isValid: boolean;
  queryId?: string;
}

/**
 * Initialize Telegram Web App and extract user data
 */
export function initTelegramWebApp(): TelegramWebAppData | null {
  const tg = window.Telegram?.WebApp;

  if (!tg) {
    console.log('ℹ️ Telegram WebApp not available (running in browser)');
    return null;
  }

  try {
    // Initialize the WebApp
    tg.ready();
    tg.expand();

    console.log('✅ Telegram WebApp initialized');

    // Extract user data
    const rawUser = tg.initDataUnsafe?.user;
    const authDate = tg.initDataUnsafe?.auth_date;
    const hash = tg.initDataUnsafe?.hash;
    const queryId = tg.initDataUnsafe?.query_id;

    if (!rawUser) {
      console.warn('⚠️ No user data in Telegram WebApp');
      return {
        user: null,
        authDate: null,
        hash: null,
        isValid: false,
      };
    }

    // Build user object with auth data
    const user: TelegramWebAppUser | null = rawUser ? {
      ...rawUser,
      auth_date: authDate,
      hash: hash,
    } : null;

    // Validate user data - for our auth type, first_name is required
    const isValidUser = user ? (
      typeof user.id === 'number' && 
      typeof user.first_name === 'string' && 
      user.first_name.length > 0
    ) : false;
    
    const isRecentAuth = authDate ? isAuthDataRecent(authDate) : false;

    const isValid = isValidUser && isRecentAuth && !!hash;

    if (!isValid) {
      if (!isValidUser) console.warn('⚠️ Invalid user data');
      if (!isRecentAuth) console.warn('⚠️ Auth data is not recent (>24 hours)');
      if (!hash) console.warn('⚠️ Missing hash');
    } else {
      console.log('✅ Valid Telegram user data:', user?.username || user?.first_name);
    }

    return {
      user,
      authDate: authDate || null,
      hash: hash || null,
      queryId,
      isValid,
    };
  } catch (error) {
    console.error('Failed to initialize Telegram WebApp:', error);
    return null;
  }
}

/**
 * Show Telegram WebApp main button
 */
export function showMainButton(text: string, onClick: () => void): void {
  const tg = window.Telegram?.WebApp;
  
  if (!tg?.MainButton) {
    return;
  }

  tg.MainButton.setText(text);
  tg.MainButton.show();
  tg.MainButton.onClick(onClick);
}

/**
 * Hide Telegram WebApp main button
 */
export function hideMainButton(): void {
  const tg = window.Telegram?.WebApp;
  
  if (!tg?.MainButton) {
    return;
  }

  tg.MainButton.hide();
}

/**
 * Show Telegram WebApp back button
 */
export function showBackButton(onClick: () => void): void {
  const tg = window.Telegram?.WebApp;
  
  if (!tg?.BackButton) {
    return;
  }

  tg.BackButton.show();
  tg.BackButton.onClick(onClick);
}

/**
 * Hide Telegram WebApp back button
 */
export function hideBackButton(): void {
  const tg = window.Telegram?.WebApp;
  
  if (!tg?.BackButton) {
    return;
  }

  tg.BackButton.hide();
}

/**
 * Close Telegram WebApp
 */
export function closeTelegramWebApp(): void {
  const tg = window.Telegram?.WebApp;
  
  if (!tg) {
    return;
  }

  tg.close();
}

/**
 * Send haptic feedback
 */
export function sendHapticFeedback(
  type: 'impact' | 'notification' | 'selection',
  style?: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft' | 'error' | 'success' | 'warning'
): void {
  const tg = window.Telegram?.WebApp;
  
  if (!tg?.HapticFeedback) {
    return;
  }

  if (type === 'impact' && style && ['light', 'medium', 'heavy', 'rigid', 'soft'].includes(style)) {
    tg.HapticFeedback.impactOccurred(style as 'light' | 'medium' | 'heavy' | 'rigid' | 'soft');
  } else if (type === 'notification' && style && ['error', 'success', 'warning'].includes(style)) {
    tg.HapticFeedback.notificationOccurred(style as 'error' | 'success' | 'warning');
  } else if (type === 'selection') {
    tg.HapticFeedback.selectionChanged();
  }
}

/**
 * Check if running in Telegram WebApp
 */
export function isTelegramWebApp(): boolean {
  return !!window.Telegram?.WebApp;
}

/**
 * Get Telegram WebApp version
 */
export function getTelegramWebAppVersion(): string | null {
  const tg = window.Telegram?.WebApp;
  return tg ? (tg as { version?: string }).version || null : null;
}

/**
 * Check if feature is available in current Telegram version
 */
export function isTelegramFeatureAvailable(feature: string): boolean {
  const tg = window.Telegram?.WebApp;
  if (!tg) {
    return false;
  }

  // Check for specific features
  switch (feature) {
    case 'MainButton':
      return !!tg.MainButton;
    case 'BackButton':
      return !!tg.BackButton;
    case 'HapticFeedback':
      return !!tg.HapticFeedback;
    default:
      return false;
  }
}
