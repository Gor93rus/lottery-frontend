/**
 * JWT Token Management Utilities
 * Handles token storage, retrieval, and expiration checking
 */

const TOKEN_KEY = 'auth_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const USER_ID_KEY = 'user_id';
const TELEGRAM_ID_KEY = 'telegram_id';

export class TokenManager {
  /**
   * Set authentication token in localStorage
   */
  static setToken(token: string, expiresAt?: number): void {
    try {
      localStorage.setItem(TOKEN_KEY, token);
      
      if (expiresAt) {
        localStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());
      } else {
        // If no expiry provided, try to extract from JWT
        const expiry = this.getTokenExpiry(token);
        if (expiry) {
          localStorage.setItem(TOKEN_EXPIRY_KEY, expiry.toString());
        }
      }
      
      // Extract and store user IDs from token for gamification API
      const payload = this.decodeToken(token);
      if (payload) {
        if (payload.userId) {
          localStorage.setItem(USER_ID_KEY, payload.userId.toString());
        }
        if (payload.telegramId) {
          localStorage.setItem(TELEGRAM_ID_KEY, payload.telegramId.toString());
        }
      }
    } catch (error) {
      console.error('Failed to set token:', error);
    }
  }

  /**
   * Get authentication token from localStorage
   */
  static getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch (error) {
      console.error('Failed to get token:', error);
      return null;
    }
  }

  /**
   * Remove authentication token from localStorage
   */
  static removeToken(): void {
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_EXPIRY_KEY);
    } catch (error) {
      console.error('Failed to remove token:', error);
    }
  }

  /**
   * Check if token exists
   */
  static hasToken(): boolean {
    return !!this.getToken();
  }

  /**
   * Check if token is expired
   */
  static isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getToken();
    
    if (!tokenToCheck) {
      return true;
    }

    try {
      // First check stored expiry
      const storedExpiry = localStorage.getItem(TOKEN_EXPIRY_KEY);
      if (storedExpiry) {
        const expiryTime = parseInt(storedExpiry, 10);
        const now = Math.floor(Date.now() / 1000);
        return now >= expiryTime;
      }

      // Fallback to JWT parsing
      const expiry = this.getTokenExpiry(tokenToCheck);
      if (expiry) {
        const now = Math.floor(Date.now() / 1000);
        return now >= expiry;
      }

      // If we can't determine expiry, consider it expired for safety
      return true;
    } catch (error) {
      console.error('Failed to check token expiration:', error);
      return true;
    }
  }

  /**
   * Extract expiry time from JWT token
   * Returns expiry timestamp in seconds, or null if not found
   */
  static getTokenExpiry(token: string): number | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      const payload = JSON.parse(atob(parts[1]));
      return payload.exp || null;
    } catch (error) {
      console.error('Failed to parse token:', error);
      return null;
    }
  }

  /**
   * Decode JWT token payload
   * Returns TokenPayload or null if decoding fails
   */
  static decodeToken(token: string): { userId?: number; telegramId?: number; iat?: number; exp?: number } | null {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) {
        return null;
      }

      return JSON.parse(atob(parts[1]));
    } catch (error) {
      console.error('Failed to decode token:', error);
      return null;
    }
  }

  /**
   * Get time until token expires (in seconds)
   * Returns null if token is expired or invalid
   */
  static getTimeUntilExpiry(token?: string): number | null {
    const tokenToCheck = token || this.getToken();
    
    if (!tokenToCheck) {
      return null;
    }

    const expiry = this.getTokenExpiry(tokenToCheck);
    if (!expiry) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const timeLeft = expiry - now;

    return timeLeft > 0 ? timeLeft : null;
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  static willExpireSoon(token?: string): boolean {
    const timeLeft = this.getTimeUntilExpiry(token);
    if (timeLeft === null) {
      return true;
    }

    const FIVE_MINUTES = 5 * 60;
    return timeLeft < FIVE_MINUTES;
  }

  /**
   * Get user ID from localStorage
   */
  static getUserId(): string | null {
    try {
      return localStorage.getItem(USER_ID_KEY);
    } catch (error) {
      console.error('Failed to get user ID:', error);
      return null;
    }
  }

  /**
   * Get Telegram ID from localStorage
   */
  static getTelegramId(): string | null {
    try {
      return localStorage.getItem(TELEGRAM_ID_KEY);
    } catch (error) {
      console.error('Failed to get telegram ID:', error);
      return null;
    }
  }

  /**
   * Set user IDs in localStorage (for manual override if needed)
   * At least one ID should be provided for this to have any effect
   */
  static setUserIds(userId?: number, telegramId?: number): void {
    try {
      if (userId) {
        localStorage.setItem(USER_ID_KEY, userId.toString());
      }
      if (telegramId) {
        localStorage.setItem(TELEGRAM_ID_KEY, telegramId.toString());
      }
    } catch (error) {
      console.error('Failed to set user IDs:', error);
    }
  }

  /**
   * Clear all auth-related data
   */
  static clearAll(): void {
    this.removeToken();
    // Clear any other auth-related items
    try {
      localStorage.removeItem(USER_ID_KEY);
      localStorage.removeItem(TELEGRAM_ID_KEY);
    } catch (error) {
      console.error('Failed to clear auth data:', error);
    }
  }
}
