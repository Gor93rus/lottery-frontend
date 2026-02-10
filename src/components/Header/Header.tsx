import { useNavigate } from 'react-router-dom';
import { useTonAddress } from '@tonconnect/ui-react';
import { motion } from 'framer-motion';
import { LogOut, User, ShieldCheck, Ticket } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useTelegram } from '../../lib/telegram/useTelegram';
import { adminApiClient } from '../../lib/api/adminClient';
import CurrencyToggleMini from '../CurrencyToggleMini/CurrencyToggleMini';
import WalletBalance from '../WalletBalance/WalletBalance';
import NotificationCenter from '../Notifications/NotificationCenter';
import ProfileModal from '../Profile/ProfileModal';
import './Header.css';

function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { user: telegramUser } = useTelegram();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const tonAddress = useTonAddress();

  // Check admin status when user is authenticated
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (isAuthenticated && user) {
        try {
          const response = await adminApiClient.checkAdminStatus();
          setIsAdmin(response.success && response.isAdmin);
        } catch (error) {
          console.error('Failed to check admin status:', error);
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [isAuthenticated, user]);

  const handleLogout = useCallback(() => {
    logout();
    setIsAdmin(false);
  }, [logout]);

  return (
    <motion.header
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      <div className="header-container">
        {/* Left: Logo */}
        <div className="header-left">
          <div className="header-logo" onClick={() => navigate('/')}>
            WEEKEND MILLIONS
          </div>
        </div>

        {/* Center: Action Buttons + Currency Toggle */}
        <div className="header-center">
          <button 
            className="action-btn demo-btn" 
            onClick={() => navigate('/demo')}
          >
            <span>💎</span>
            <span className="action-btn-text">Демо</span>
          </button>
          
          <button 
            className="action-btn swap-btn" 
            onClick={() => navigate('/swap')}
          >
            <span>🔄</span>
            <span className="action-btn-text">Обмен</span>
          </button>

          {tonAddress && (
            <button 
              className="action-btn tickets-btn" 
              onClick={() => navigate('/my-tickets')}
            >
              <Ticket size={16} />
              <span className="action-btn-text">Мои билеты</span>
            </button>
          )}

          {isAdmin && (
            <button 
              className="action-btn admin-btn" 
              onClick={() => navigate('/admin')}
            >
              <ShieldCheck size={16} />
              <span className="action-btn-text">Админ-панель</span>
            </button>
          )}
          
          <CurrencyToggleMini />
        </div>

        {/* Right: Balance + User Info + Connect */}
        <div className="header-right">
          {isAuthenticated && (
            <motion.div
              className="user-menu"
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="user-info" onClick={() => setIsProfileModalOpen(true)} style={{ cursor: 'pointer' }}>
                {(user?.photoUrl || telegramUser?.photo_url) ? (
                  <img 
                    src={user?.photoUrl || telegramUser?.photo_url} 
                    alt="Profile" 
                    className="user-avatar"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <User size={18} />
                )}
                <span>{user?.firstName || user?.username || telegramUser?.first_name || telegramUser?.username || 'User'}</span>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={16} />
              </button>
            </motion.div>
          )}

          <NotificationCenter />
          {tonAddress && <WalletBalance variant="compact" />}
        </div>
      </div>
      <div className="header-gradient"></div>

      {/* Profile Modal */}
      {isAuthenticated && user && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          user={{
            telegramId: user.id?.toString() || telegramUser?.id?.toString() || '',
            username: user.username || telegramUser?.username,
            firstName: user.firstName || telegramUser?.first_name,
            photoUrl: user.photoUrl || telegramUser?.photo_url
          }}
        />
      )}
    </motion.header>
  );
}

export default Header;
