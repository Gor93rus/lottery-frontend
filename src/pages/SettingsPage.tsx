import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Settings, Globe, Bell, Shield, User, ChevronRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import './SettingsPage.css';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'ru');
  const [notifications, setNotifications] = useState(() => 
    localStorage.getItem('notifications') !== 'false'
  );

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    // TODO: Integrate with i18n when needed
  };

  const handleNotificationsToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('notifications', String(newValue));
  };

  return (
    <div className="settings-page">
      <AnimatedBackground />
      
      <div className="content-wrapper">
        <Header />
        
        <main className="main-content">
          <div className="page-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Назад
            </button>
            <h1 className="page-title">
              <Settings size={28} />
              Настройки
            </h1>
          </div>

          <motion.div
            className="settings-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Profile Section */}
            <div className="settings-section">
              <h2 className="section-title">
                <User size={20} />
                Профиль
              </h2>
              <div className="settings-list">
                <button 
                  className="setting-item"
                  onClick={() => navigate('/profile')}
                >
                  <div className="setting-info">
                    <div className="setting-label">Мой профиль</div>
                    <div className="setting-description">
                      {user?.firstName || user?.username || 'Гость'}
                    </div>
                  </div>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* Language Section */}
            <div className="settings-section">
              <h2 className="section-title">
                <Globe size={20} />
                Язык
              </h2>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">Язык интерфейса</div>
                    <div className="setting-description">Выберите язык приложения</div>
                  </div>
                  <select 
                    className="language-select"
                    value={language}
                    onChange={(e) => handleLanguageChange(e.target.value)}
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications Section */}
            <div className="settings-section">
              <h2 className="section-title">
                <Bell size={20} />
                Уведомления
              </h2>
              <div className="settings-list">
                <div className="setting-item">
                  <div className="setting-info">
                    <div className="setting-label">Push-уведомления</div>
                    <div className="setting-description">
                      Получать уведомления о розыгрышах и выигрышах
                    </div>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={notifications}
                      onChange={handleNotificationsToggle}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy Section */}
            <div className="settings-section">
              <h2 className="section-title">
                <Shield size={20} />
                Конфиденциальность
              </h2>
              <div className="settings-list">
                <button 
                  className="setting-item"
                  onClick={() => navigate('/faq')}
                >
                  <div className="setting-info">
                    <div className="setting-label">Политика конфиденциальности</div>
                    <div className="setting-description">Как мы используем ваши данные</div>
                  </div>
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            {/* App Info */}
            <div className="app-info">
              <p>Weekend Millions v1.0.0</p>
              <p>© 2026 Weekend Millions. Все права защищены.</p>
            </div>
          </motion.div>
        </main>
        
        <Footer activeTab="profile" onTabChange={(tab) => {
          if (tab === 'home') navigate('/');
          else if (tab === 'lotteries') navigate('/lotteries');
          else if (tab === 'history') navigate('/history');
          else if (tab === 'profile') navigate('/profile');
          else if (tab === 'referral') navigate('/referral');
        }} />
      </div>
    </div>
  );
}
