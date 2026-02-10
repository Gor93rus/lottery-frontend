import { useEffect, useState } from 'react';

interface TelegramUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
}

interface TelegramWebApp {
  initData: string;
  initDataUnsafe: {
    user?: TelegramUser;
    query_id?: string;
    auth_date?: number;
    hash?: string;
  };
  ready: () => void;
  expand: () => void;
  close: () => void;
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isActive: boolean;
    show: () => void;
    hide: () => void;
    enable: () => void;
    disable: () => void;
    setText: (text: string) => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  BackButton: {
    isVisible: boolean;
    show: () => void;
    hide: () => void;
    onClick: (callback: () => void) => void;
    offClick: (callback: () => void) => void;
  };
  HapticFeedback: {
    impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
    notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
    selectionChanged: () => void;
  };
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp;
    };
  }
}

export function useTelegram() {
  const [webApp, setWebApp] = useState<TelegramWebApp | null>(null);
  const [user, setUser] = useState<TelegramUser | null>(null);

  useEffect(() => {
    const tg = window.Telegram?.WebApp;
    
    if (tg) {
      console.log('📱 Telegram WebApp detected');
      
      // Initialize WebApp
      tg.ready();
      tg.expand();
      
      setWebApp(tg);
      
      // Get user from initDataUnsafe
      const telegramUser = tg.initDataUnsafe?.user;
      
      if (telegramUser) {
        console.log('✅ Telegram user found:', {
          id: telegramUser.id,
          username: telegramUser.username,
          firstName: telegramUser.first_name,
        });
        setUser(telegramUser);
      } else {
        console.warn('⚠️ Telegram WebApp available but no user in initDataUnsafe');
        setUser(null);
      }
      
      // Log full initDataUnsafe for debugging
      console.log('📋 initDataUnsafe:', {
        hasUser: !!tg.initDataUnsafe?.user,
        hasHash: !!tg.initDataUnsafe?.hash,
        hasAuthDate: !!tg.initDataUnsafe?.auth_date,
        authDate: tg.initDataUnsafe?.auth_date,
      });
      
      // Log raw initData length only (avoid exposing tokens in production)
      if (tg.initData) {
        console.log('📋 initData length:', tg.initData.length);
      } else {
        console.warn('⚠️ initData is empty');
      }
    } else {
      console.log('🌐 Not running in Telegram WebApp (browser mode)');
      setWebApp(null);
      setUser(null);
    }
  }, []);

  return {
    webApp,
    user,
    isReady: !!webApp,
  };
}
