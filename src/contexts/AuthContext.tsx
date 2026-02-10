import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiClient } from '../lib/api/client';
import { useTelegram } from '../lib/telegram/useTelegram';
import { TokenManager } from '../lib/auth/token';
import type { User, TelegramUser } from '../types/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => Promise<void>;
  logout: () => void;
  connectWallet: (address: string) => Promise<void>;
  loginWithTelegram: (telegramUser: TelegramUser) => Promise<boolean>;
  refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: telegramUser, webApp } = useTelegram();

  // Helper function to perform Telegram login
  const performTelegramLogin = useCallback(async (tgUser: typeof telegramUser, tgWebApp: typeof webApp) => {
    if (!tgUser || !tgWebApp) {
      return null;
    }

    const response = await apiClient.loginTelegram({
      id: tgUser.id,
      first_name: tgUser.first_name,
      last_name: tgUser.last_name,
      username: tgUser.username,
      photo_url: tgUser.photo_url,
      auth_date: tgWebApp.initDataUnsafe?.auth_date,
      hash: tgWebApp.initDataUnsafe?.hash,
    });
    
    if (response.success && response.token) {
      TokenManager.setToken(response.token);
      apiClient.setToken(response.token);
      apiClient.setUser(response.user);
      setUser(response.user);
      // Ensure user IDs are stored for gamification API
      TokenManager.setUserIds(response.user.id, response.user.telegramId);
      return response.user;
    }
    
    return null;
  }, []);

  // Initialize auth state from localStorage on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = TokenManager.getToken();
      
      if (token && !TokenManager.isTokenExpired(token)) {
        // Token exists and is valid - restore user session
        apiClient.setToken(token);
        
        try {
          // Fetch user profile to restore user state
          const profile = await apiClient.getProfile();
          if (profile.success && profile.user) {
            setUser(profile.user);
            // Ensure user IDs are stored for gamification API
            TokenManager.setUserIds(profile.user.id, profile.user.telegramId);
          }
        } catch {
          // Clear invalid token
          TokenManager.clearAll();
          apiClient.clearToken();
        }
      } else if (token) {
        // Token exists but is expired
        TokenManager.clearAll();
        apiClient.clearToken();
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  // Auto-login with Telegram user when available
  useEffect(() => {
    const autoLogin = async () => {
      // Skip if already authenticated or no Telegram data
      if (user) {
        console.log('🔐 Auto-login: already authenticated');
        return;
      }
      
      if (!telegramUser || !webApp) {
        console.log('🔐 Auto-login: no Telegram data available');
        return;
      }
      
      console.log('🔐 Auto-login: starting...', { 
        userId: telegramUser.id,
        username: telegramUser.username,
        hasHash: !!webApp.initDataUnsafe?.hash,
        hasAuthDate: !!webApp.initDataUnsafe?.auth_date,
      });
      
      try {
        const response = await apiClient.loginTelegram({
          id: telegramUser.id,
          first_name: telegramUser.first_name,
          last_name: telegramUser.last_name,
          username: telegramUser.username,
          photo_url: telegramUser.photo_url,
          auth_date: webApp.initDataUnsafe?.auth_date,
          hash: webApp.initDataUnsafe?.hash,
        });
        
        if (response.success && response.token) {
          console.log('✅ Auto-login: success!', response.user.username || response.user.id);
          TokenManager.setToken(response.token);
          apiClient.setToken(response.token);
          apiClient.setUser(response.user);
          setUser(response.user);
          TokenManager.setUserIds(response.user.id, response.user.telegramId);
        } else {
          console.warn('⚠️ Auto-login: response not successful', response);
        }
      } catch (error) {
        console.error('❌ Auto-login: failed during API call', error);
        // Don't throw - just log the error
      }
    };
    
    autoLogin();
  }, [telegramUser, webApp, user]);

  const login = useCallback(async () => {
    if (!telegramUser || !webApp) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      await performTelegramLogin(telegramUser, webApp);
    } catch (error) {
      // Log errors in development mode only
      if (import.meta.env.DEV) {
        console.error('Manual login failed:', error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [telegramUser, webApp, performTelegramLogin]);

  const logout = () => {
    TokenManager.clearAll();
    apiClient.clearToken();
    setUser(null);
    localStorage.removeItem('user_id');
    localStorage.removeItem('telegram_id');
  };

  const refreshToken = useCallback(async () => {
    const currentToken = TokenManager.getToken();
    
    if (!currentToken || TokenManager.isTokenExpired(currentToken)) {
      logout();
      return;
    }

    try {
      // For now, we don't have a refresh endpoint, so just verify the token is still valid
      // In the future, this should call the /auth/refresh endpoint
      const profile = await apiClient.getProfile();
      if (profile.success && profile.user) {
        setUser(profile.user);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  }, []);

  // Monitor token expiration
  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = TokenManager.getToken();
      
      if (token && TokenManager.willExpireSoon(token)) {
        refreshToken();
      } else if (token && TokenManager.isTokenExpired(token)) {
        logout();
      }
    };

    // Check immediately
    checkTokenExpiration();

    // Check every minute
    const interval = setInterval(checkTokenExpiration, 60 * 1000);

    return () => clearInterval(interval);
  }, [refreshToken]);

  const connectWallet = useCallback(async (address: string) => {
    try {
      console.log('🔗 Connecting wallet...', address.slice(0, 8) + '...');
      console.log('🔗 apiClient baseURL:', apiClient.getBaseUrl?.() || 'unknown');
      
      // Include Telegram profile data when connecting wallet
      const telegramData = telegramUser ? {
        username: telegramUser.username,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        photo_url: telegramUser.photo_url,
      } : undefined;
      
      // Use new wallet auth endpoint (no prior auth required)
      const response = await apiClient.loginWithWallet(address, telegramData);
      
      if (response.success && response.token && response.user) {
        // Save token
        TokenManager.setToken(response.token);
        apiClient.setToken(response.token);
        
        // Set user
        setUser(response.user);
        
        // Store user IDs in localStorage
        if (response.user.id) {
          localStorage.setItem('user_id', response.user.id.toString());
        }
        if (response.user.telegramId) {
          localStorage.setItem('telegram_id', response.user.telegramId.toString());
        }
        
        // Store user IDs in TokenManager for gamification API
        TokenManager.setUserIds(response.user.id, response.user.telegramId);
        
        console.log('✅ Wallet connected and authorized!', response.isNewUser ? '(new user)' : '(existing user)');
      } else {
        console.error('❌ Wallet auth failed:', response.error);
        throw new Error(response.error || 'Wallet authentication failed');
      }
    } catch (error) {
      console.error('❌ Connect wallet failed:', error);
      console.error('❌ Error stack:', error instanceof Error ? error.stack : 'no stack');
      throw error;
    }
  }, [telegramUser]);

  const loginWithTelegram = async (telegramUser: TelegramUser): Promise<boolean> => {
    // Production: Real API call for Telegram auth
    try {
      const response = await apiClient.loginTelegram({
        id: telegramUser.id,
        first_name: telegramUser.first_name,
        last_name: telegramUser.last_name,
        username: telegramUser.username,
        photo_url: telegramUser.photo_url,
        auth_date: telegramUser.auth_date,
        hash: telegramUser.hash,
      });
      
      if (response.success && response.token) {
        TokenManager.setToken(response.token);
        apiClient.setToken(response.token);
        apiClient.setUser(response.user);
        setUser(response.user);
        // Ensure user IDs are stored for gamification API
        TokenManager.setUserIds(response.user.id, response.user.telegramId);
        return true;
      }
      
      return false;
    } catch {
      return false;
    }
  };

  
  return (
    <AuthContext.Provider
        value={{
          user,
          isAuthenticated: !!user,
          isLoading,
          login,
          logout,
          connectWallet,
          loginWithTelegram,
          refreshToken,
        }}
      >
        {children}
      </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
