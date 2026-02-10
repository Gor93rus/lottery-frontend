/**
 * Telegram Authentication Component
 * Handles Telegram Web App authentication flow
 */

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { initTelegramWebApp } from '../lib/telegram';
import { isMockAuthEnabled } from '../lib/utils/env';
import type { TelegramUser } from './TelegramLoginWidget/TelegramLoginWidget';

interface TelegramAuthProps {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

export function TelegramAuth({ onSuccess, onError }: TelegramAuthProps) {
  const { loginWithTelegram } = useAuth();
  const [status, setStatus] = useState<'idle' | 'checking' | 'authenticating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const authenticate = async () => {
      try {
        setStatus('checking');
        
        // Initialize Telegram Web App
        const telegramData = initTelegramWebApp();
        
        if (!telegramData || !telegramData.user) {
          if (isMockAuthEnabled()) {
            // In dev/mock mode, this is handled by useTelegram hook
            setStatus('idle');
            return;
          }
          
          throw new Error('Telegram data not available');
        }

        if (!telegramData.isValid) {
          throw new Error('Invalid Telegram data');
        }

        setStatus('authenticating');
        
        // Convert to TelegramUser format (with required first_name)
        // If first_name is missing, we can't authenticate
        if (!telegramData.user.first_name) {
          throw new Error('User first name is required');
        }
        
        const user: TelegramUser = {
          id: telegramData.user.id,
          first_name: telegramData.user.first_name,
          last_name: telegramData.user.last_name,
          username: telegramData.user.username,
          photo_url: telegramData.user.photo_url,
          auth_date: telegramData.user.auth_date || 0,
          hash: telegramData.user.hash || '',
        };
        
        // Login with Telegram user data
        const success = await loginWithTelegram(user);
        
        if (success) {
          setStatus('success');
          onSuccess?.();
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        const err = error as Error;
        setStatus('error');
        setErrorMessage(err.message);
        onError?.(err);
      }
    };

    authenticate();
  }, [loginWithTelegram, onSuccess, onError]);

  if (status === 'idle' || status === 'success') {
    return null;
  }

  return (
    <div className="telegram-auth">
      <motion.div
        className="telegram-auth-card"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {(status === 'checking' || status === 'authenticating') && (
          <>
            <motion.div
              className="telegram-auth-spinner"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  stroke="url(#telegram-auth-gradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="80 40"
                />
                <defs>
                  <linearGradient id="telegram-auth-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#df600c" />
                    <stop offset="50%" stopColor="#f45da6" />
                    <stop offset="100%" stopColor="#9e0ac7" />
                  </linearGradient>
                </defs>
              </svg>
            </motion.div>
            <p className="telegram-auth-text">
              {status === 'checking' ? 'Проверка данных Telegram...' : 'Вход в систему...'}
            </p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="telegram-auth-error-icon">❌</div>
            <h3 className="telegram-auth-error-title">Ошибка входа</h3>
            <p className="telegram-auth-error-message">{errorMessage}</p>
          </>
        )}
      </motion.div>
      <style>{`
        .telegram-auth {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0, 0, 0, 0.8);
          backdrop-filter: blur(10px);
          z-index: 9999;
        }
        .telegram-auth-card {
          background: rgba(20, 20, 40, 0.95);
          border-radius: 20px;
          padding: 2rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          min-width: 300px;
        }
        .telegram-auth-spinner {
          margin: 0 auto 1rem;
        }
        .telegram-auth-text {
          color: rgba(255, 255, 255, 0.8);
          font-size: 0.875rem;
          font-weight: 500;
        }
        .telegram-auth-error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .telegram-auth-error-title {
          color: #ff4444;
          font-size: 1.25rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
        }
        .telegram-auth-error-message {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.875rem;
        }
      `}</style>
    </div>
  );
}

export default TelegramAuth;
