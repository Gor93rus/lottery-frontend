import { useState } from 'react';
import { Wrench, X, User, Smartphone, Code } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isDevToolsEnabled } from '../../lib/utils/env';
import './DevToolsPanel.css';

export default function DevToolsPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, isAuthenticated, loginWithTelegram, logout } = useAuth();
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('desktop');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Don't show DevTools if mock auth is not enabled
  if (!isDevToolsEnabled()) return null;

  interface MockUser {
    id: number;
    first_name: string;
    last_name: string;
    username: string;
    photo_url: string;
  }

  const mockUsers: MockUser[] = [
    {
      id: 432735601,
      first_name: 'Yury',
      last_name: 'Gorbenko',
      username: 'GorbenkoYury',
      photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Yury'
    },
    {
      id: 111111111,
      first_name: 'Test',
      last_name: 'User',
      username: 'testuser',
      photo_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Test'
    }
  ];

  const handleLogin = async (mockUser: MockUser) => {
    setIsLoggingIn(true);
    setLoginError(null);
    
    try {
      const success = await loginWithTelegram({
        ...mockUser,
        auth_date: Math.floor(Date.now() / 1000),
        hash: 'mock_dev_hash_' + crypto.randomUUID()
      });
      
      if (!success) {
        setLoginError('Login failed');
      }
    } catch (error) {
      setLoginError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const changeViewport = (size: 'mobile' | 'tablet' | 'desktop') => {
    setViewport(size);
    const root = document.getElementById('root');
    if (!root) return;
    root.classList.remove('viewport-mobile', 'viewport-tablet', 'viewport-desktop');
    root.classList.add(`viewport-${size}`);
  };

  return (
    <>
      {/* Toggle Button */}
      <button 
        className="devtools-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Wrench size={20} />
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="devtools-panel">
          <div className="devtools-header">
            <h3>🔧 Dev Tools</h3>
            <button onClick={() => setIsOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Auth Section */}
          <div className="devtools-section">
            <h4><User size={16} /> Authentication</h4>
            {isAuthenticated ? (
              <div className="auth-status">
                <p>✅ Logged in as: {user?.firstName}</p>
                <button onClick={logout} className="btn-logout">
                  Logout
                </button>
              </div>
            ) : (
              <div className="mock-users">
                {mockUsers.map(mockUser => (
                  <button
                    key={mockUser.id}
                    onClick={() => handleLogin(mockUser)}
                    className="btn-login"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? 'Logging in...' : `Login as ${mockUser.username}`}
                  </button>
                ))}
                {loginError && <p className="login-error" style={{ color: 'red', marginTop: '8px' }}>{loginError}</p>}
              </div>
            )}
          </div>

          {/* Viewport Section */}
          <div className="devtools-section">
            <h4><Smartphone size={16} /> Viewport</h4>
            <div className="viewport-buttons">
              <button
                onClick={() => changeViewport('mobile')}
                className={viewport === 'mobile' ? 'active' : ''}
              >
                📱 Mobile (375px)
              </button>
              <button
                onClick={() => changeViewport('tablet')}
                className={viewport === 'tablet' ? 'active' : ''}
              >
                📲 Tablet (768px)
              </button>
              <button
                onClick={() => changeViewport('desktop')}
                className={viewport === 'desktop' ? 'active' : ''}
              >
                💻 Desktop (100%)
              </button>
            </div>
          </div>

          {/* Debug Info */}
          <div className="devtools-section">
            <h4><Code size={16} /> Debug Info</h4>
            <div className="debug-info">
              <p>Mode: {import.meta.env.MODE}</p>
              <p>API: {import.meta.env.VITE_API_URL}</p>
              <p>Auth: {isAuthenticated ? '✅' : '❌'}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
