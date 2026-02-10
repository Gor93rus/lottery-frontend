/**
 * Telegram data validation utilities
 */

import type { TelegramUser } from '../../types/auth';

/**
 * Validate Telegram user data
 */
export function validateTelegramUser(user: TelegramUser): boolean {
  if (!user || typeof user !== 'object') {
    return false;
  }

  // ID is required
  if (!user.id || typeof user.id !== 'number') {
    return false;
  }

  // Optional fields should have correct types if present
  if (user.first_name !== undefined && typeof user.first_name !== 'string') {
    return false;
  }

  if (user.last_name !== undefined && typeof user.last_name !== 'string') {
    return false;
  }

  if (user.username !== undefined && typeof user.username !== 'string') {
    return false;
  }

  if (user.photo_url !== undefined && typeof user.photo_url !== 'string') {
    return false;
  }

  return true;
}

/**
 * Validate Telegram Web App init data
 * Note: This is a basic validation. Full validation should be done on the backend
 * using the bot token hash verification.
 */
export function validateInitData(initData: string): boolean {
  if (!initData || typeof initData !== 'string') {
    return false;
  }

  // Check if it contains required parameters
  const params = new URLSearchParams(initData);
  
  // Must have at least user or query_id
  const hasUser = params.has('user');
  const hasQueryId = params.has('query_id');
  const hasHash = params.has('hash');
  const hasAuthDate = params.has('auth_date');

  return (hasUser || hasQueryId) && hasHash && hasAuthDate;
}

/**
 * Parse Telegram user from init data
 */
export function parseTelegramUser(initData: string): TelegramUser | null {
  try {
    const params = new URLSearchParams(initData);
    const userParam = params.get('user');
    
    if (!userParam) {
      return null;
    }

    const user = JSON.parse(decodeURIComponent(userParam));
    const authDate = params.get('auth_date');
    const hash = params.get('hash');

    if (!validateTelegramUser(user)) {
      return null;
    }

    return {
      ...user,
      auth_date: authDate ? parseInt(authDate, 10) : undefined,
      hash: hash || undefined,
    };
  } catch (error) {
    console.error('Failed to parse Telegram user:', error);
    return null;
  }
}

/**
 * Check if auth data is recent (within 24 hours)
 */
export function isAuthDataRecent(authDate?: number): boolean {
  if (!authDate) {
    return false;
  }

  const now = Math.floor(Date.now() / 1000);
  const oneDay = 24 * 60 * 60;

  return (now - authDate) < oneDay;
}

/**
 * Sanitize user display name
 */
export function sanitizeDisplayName(user: TelegramUser): string {
  if (user.username) {
    return user.username;
  }

  const parts = [];
  if (user.first_name) {
    parts.push(user.first_name);
  }
  if (user.last_name) {
    parts.push(user.last_name);
  }

  return parts.join(' ') || 'User';
}
