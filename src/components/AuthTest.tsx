import { useTelegram } from '../lib/telegram/useTelegram';
import { useAuth } from '../contexts/AuthContext';

/**
 * AuthTest - Debug component to display authentication state
 * Shows real-time status of Telegram integration and auth state
 * Only visible in development mode
 */
export default function AuthTest() {
  const { user: telegramUser, webApp } = useTelegram();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      right: 0, 
      background: '#ff0000', 
      color: '#ffffff',
      padding: '10px', 
      zIndex: 9999,
      fontSize: '12px',
      fontFamily: 'monospace',
      borderRadius: '0 0 0 8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      minWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>Auth Debug</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <p style={{ margin: 0 }}>
          <strong>Telegram User:</strong> {telegramUser ? '✅ YES' : '❌ NO'}
        </p>
        <p style={{ margin: 0 }}>
          <strong>WebApp:</strong> {webApp ? '✅ YES' : '❌ NO'}
        </p>
        <p style={{ margin: 0 }}>
          <strong>User:</strong> {user ? '✅ YES' : '❌ NO'}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Authenticated:</strong> {isAuthenticated ? '✅ YES' : '❌ NO'}
        </p>
        <p style={{ margin: 0 }}>
          <strong>Loading:</strong> {isLoading ? '⏳ YES' : '✅ NO'}
        </p>
        {telegramUser && (
          <p style={{ margin: '4px 0 0 0', fontSize: '10px', opacity: 0.8 }}>
            ID: {telegramUser.id}
          </p>
        )}
      </div>
    </div>
  );
}
