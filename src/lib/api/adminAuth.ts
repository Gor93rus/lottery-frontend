import { getApiBaseUrl } from '../utils/env';

const API_BASE_URL = getApiBaseUrl();

export interface AdminLoginRequest {
  telegramId: string;
  password: string;
}

export interface AdminLoginResponse {
  success: boolean;
  token: string;
  user: {
    id: number;
    telegramId: number;
    username?: string;
    firstName?: string;
    lastName?: string;
    photoUrl?: string;
    isAdmin: boolean;
    role: string;
  };
}

/**
 * Admin login function with password authentication
 * 
 * Calls the new /admin/auth/login endpoint that validates passwords
 */
export async function adminLogin(telegramId: string, password: string): Promise<AdminLoginResponse> {
  try {
    // Validate telegramId format (must be numeric)
    if (!/^\d+$/.test(telegramId)) {
      throw new Error('Telegram ID must be a numeric value');
    }

    // Validate password
    // Note: We accept any non-empty password during login since we're validating
    // against existing passwords that may have been set with different rules.
    // The 8-character minimum only applies when setting new passwords.
    if (!password || password.length < 1) {
      throw new Error('Password is required');
    }

    // Call the new admin auth endpoint with password
    const authResponse = await fetch(`${API_BASE_URL}/admin/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        telegramId,
        password,
      }),
    });

    if (!authResponse.ok) {
      const error = await authResponse.json().catch(() => ({ error: 'Authentication failed' }));
      
      // Handle specific error messages
      if (authResponse.status === 401) {
        throw new Error('Invalid Telegram ID or password');
      } else if (authResponse.status === 403) {
        throw new Error('Admin account is disabled');
      } else if (authResponse.status === 429) {
        throw new Error('Too many login attempts. Please wait a few minutes.');
      }
      
      throw new Error(error.error || error.message || 'Authentication failed');
    }

    const data = await authResponse.json();

    if (!data.success) {
      throw new Error(data.error || 'Login failed');
    }

    // Store token
    localStorage.setItem('auth_token', data.token);

    return {
      success: true,
      token: data.token,
      user: {
        ...data.user,
        isAdmin: true,
        role: data.admin?.role || 'admin',
      },
    };
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
}

/**
 * Admin logout function
 */
export function adminLogout(): void {
  localStorage.removeItem('auth_token');
}

/**
 * Check if user is currently logged in as admin
 */
export function isAdminLoggedIn(): boolean {
  return !!localStorage.getItem('auth_token');
}

/**
 * Set or change admin password
 * Requires being logged in as admin
 * 
 * @param currentPassword - Current password for verification, or null for initial password setup
 * @param newPassword - New password to set (must be at least 8 characters)
 */
export async function setAdminPassword(currentPassword: string | null, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    const token = localStorage.getItem('auth_token');
    
    if (!token) {
      throw new Error('Not authenticated');
    }

    if (!newPassword || newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }

    const response = await fetch(`${API_BASE_URL}/admin/auth/set-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        currentPassword,
        newPassword,
      }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Failed to set password' }));
      throw new Error(error.error || error.message || 'Failed to set password');
    }

    const data = await response.json();
    return {
      success: true,
      message: data.message || 'Password updated successfully',
    };
  } catch (error) {
    console.error('Set password error:', error);
    throw error;
  }
}
