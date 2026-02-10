/**
 * Authentication API functions
 * Handles login, logout, and token refresh operations
 */

import { getApiBaseUrl } from '../utils/env';
import type { TelegramUser, AuthResponse } from '../../types/auth';
import { TokenManager } from './token';

const API_BASE_URL = getApiBaseUrl();

/**
 * Login with Telegram user data
 * Note: API expects 'id' as a string, so we convert the number to string
 */
export async function loginWithTelegram(telegramUser: TelegramUser): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/telegram`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: telegramUser.id.toString(), // API expects string
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name,
      username: telegramUser.username,
      photo_url: telegramUser.photo_url,
      auth_date: telegramUser.auth_date,
      hash: telegramUser.hash,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Login failed');
  }

  const data = await response.json();
  
  if (!data.success || !data.token) {
    throw new Error('Invalid response from server');
  }

  return data;
}

/**
 * Refresh authentication token
 */
export async function refreshToken(): Promise<AuthResponse> {
  const currentToken = TokenManager.getToken();
  
  if (!currentToken) {
    throw new Error('No token to refresh');
  }

  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${currentToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || 'Token refresh failed');
  }

  const data = await response.json();
  
  if (!data.success || !data.token) {
    throw new Error('Invalid response from server');
  }

  return data;
}

/**
 * Logout and invalidate token
 */
export async function logout(): Promise<void> {
  const token = TokenManager.getToken();
  
  if (token) {
    try {
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
    } catch (error) {
      // Even if logout fails on server, clear local token
      console.error('Logout request failed:', error);
    }
  }

  // Always clear local token
  TokenManager.clearAll();
}

/**
 * Verify current token is valid
 */
export async function verifyToken(): Promise<boolean> {
  const token = TokenManager.getToken();
  
  if (!token || TokenManager.isTokenExpired(token)) {
    return false;
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/verify`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return response.ok;
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}
