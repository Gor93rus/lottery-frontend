import { useState, useEffect, useMemo } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { TonConnectUIProvider } from '@tonconnect/ui-react';
import { motion } from 'framer-motion';
import * as Sentry from '@sentry/react';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import Hero from './components/Hero/Hero';
import LotteryCarousel from './components/LotteryCarousel/LotteryCarousel';
import AnimatedBackground from './components/AnimatedBackground/AnimatedBackground';
import DemoPage from './pages/DemoPage';
import WeekendSpecialPage from './pages/WeekendSpecialPage';
import ProfilePage from './pages/ProfilePage';
import LotteriesPage from './pages/LotteriesPage';
import LotteryDetailPage from './pages/LotteryDetailPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';
import ReferralPage from './pages/ReferralPage';
import SwapPage from './pages/SwapPage';
import AdminGuard from './components/Admin/AdminGuard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminLotteries from './pages/admin/AdminLotteries';
import AdminDraws from './pages/admin/AdminDraws';
import AdminTickets from './pages/admin/AdminTickets';
import AdminNotifications from './pages/admin/AdminNotifications';
import MyTicketsPage from './pages/MyTicketsPage';
import VerifyDrawPage from './pages/VerifyDrawPage';
import DrawResultsPage from './pages/DrawResultsPage';
import VerificationPage from './pages/VerificationPage';
import FAQPage from './pages/FAQPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import AchievementsPage from './pages/AchievementsPage';
import NewMainScreen from './pages/MainScreen';
import { AuthProvider } from './contexts/AuthContext';
import { SoundProvider } from './components/Advanced/SoundManager';
import { WalletConnectionHandler } from './components/WalletConnectionHandler';
import DevToolsPanel from './components/DevTools/DevToolsPanel';
import { useLotteries, type Lottery } from './hooks/useLotteries';
import { SkeletonLoader } from './components/Animations';
import './App.css';

declare global {
  interface Window {
    tonConnectButton?: HTMLButtonElement;
  }
}

// Icon mapping for lottery types
const getIconForLottery = (name: string): 'ticket' | 'coins' | 'trending' | 'calendar' => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('weekend') || nameLower.includes('special')) return 'ticket';
  if (nameLower.includes('jackpot') || nameLower.includes('mega') || nameLower.includes('grand')) return 'coins';
  if (nameLower.includes('flash') || nameLower.includes('lucky')) return 'trending';
  return 'calendar';
};

// Main Screen Component
function MainScreen() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCurrency, setSelectedCurrency] = useState<'TON' | 'USDT'>(() => {
    // Initialize from localStorage to match CurrencyToggleMini
    const saved = localStorage.getItem('preferredCurrency') as 'TON' | 'USDT';
    return saved || 'TON';
  });

  // Fetch lotteries from API
  const { data: lotteriesData, isLoading, error } = useLotteries();

  // Listen for currency changes from mini toggle
  useEffect(() => {
    function handleCurrencyChange(e: Event) {
      const customEvent = e as CustomEvent<{ currency: 'TON' | 'USDT' }>;
      const newCurrency = customEvent.detail.currency;
      
      setSelectedCurrency(newCurrency);
    }

    window.addEventListener('currencyChange', handleCurrencyChange);
    return () => {
      window.removeEventListener('currencyChange', handleCurrencyChange);
    };
  }, []);

  const handleBuyTicket = (lotteryId: string) => {
    navigate(`/lottery/${lotteryId}`);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    switch(tab) {
      case 'home':
        navigate('/');
        break;
      case 'lotteries':
        navigate('/lotteries');
        break;
      case 'history':
        navigate('/history');
        break;
      case 'verify':
        navigate('/verify');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'referral':
        navigate('/referral');
        break;
    }
  };

  // Map API lotteries to display format based on selected currency
  const displayLotteries = useMemo(() => {
    if (!lotteriesData?.lotteries) {
      return [];
    }

    const lotteries = lotteriesData.lotteries
      .filter((lottery: Lottery) => lottery.active)
      .map((lottery: Lottery) => {
        const prizePool = lottery.prizePool || lottery.currentJackpot || 0;
        const ticketPrice = lottery.ticketPrice || 0;
        
        return {
          id: lottery.id || lottery.slug,
          title: lottery.name,
          prizePool: `${prizePool.toLocaleString()} ${selectedCurrency}`,
          drawDate: lottery.drawDate ? new Date(lottery.drawDate).toLocaleDateString('ru-RU') : 'Скоро',
          ticketPrice: `${ticketPrice} ${selectedCurrency}`,
          participants: lottery.participants || 0,
          icon: getIconForLottery(lottery.name),
        };
      });
    
    return lotteries;
  }, [lotteriesData, selectedCurrency]);

  return (
    <div className="app-root">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Content Wrapper */}
      <div className="content-wrapper">
        {/* Header */}
        <Header />

        {/* Main Content */}
        <main className="main-content">
          {/* Hero Section */}
          <Hero />

          {/* Lottery Carousel */}
          {isLoading ? (
            <div style={{ padding: '2rem' }}>
              <SkeletonLoader type="lottery-card" count={3} />
            </div>
          ) : error ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4444' }}>
              <p>Не удалось загрузить лотереи. Пожалуйста, попробуйте позже.</p>
            </div>
          ) : (
            <LotteryCarousel
              lotteries={displayLotteries}
              onBuyTicket={handleBuyTicket}
            />
          )}
        </main>

        {/* Footer Navigation */}
        <Footer activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

// Age Gate Component
function AgeGate({ onConfirm }: { onConfirm: () => void }) {
  return (
    <div className="age-overlay">
      <motion.div
        className="age-card"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      >
        <h2 className="age-title">Вход в Weekend Millions</h2>
        <p className="age-text">
          Подтвердите, что вам уже <strong>18 лет</strong>, чтобы продолжить.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="pill-btn pill-solid"
          onClick={onConfirm}
        >
          Мне 18+
        </motion.button>
        <p className="age-subtext">Если вам нет 18 лет, покиньте приложение.</p>
      </motion.div>
    </div>
  );
}

function App() {
  const [ageConfirmed, setAgeConfirmed] = useState(() => {
    return localStorage.getItem('ageConfirmed') === 'true';
  });

  const handleAgeConfirm = () => {
    localStorage.setItem('ageConfirmed', 'true');
    setAgeConfirmed(true);
  };

  return (
    <TonConnectUIProvider manifestUrl="https://raw.githubusercontent.com/bobby-singer89/lottery-frontend/main/public/tonconnect-manifest.json">
      <AuthProvider>
        <WalletConnectionHandler />
        <SoundProvider>
          <Sentry.ErrorBoundary
            fallback={({ resetError }) => (
              <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0a0a0f',
                color: 'white',
                padding: '20px',
                textAlign: 'center'
              }}>
                <h1 style={{ fontSize: '24px', marginBottom: '16px' }}>😕 Что-то пошло не так</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', marginBottom: '24px' }}>
                  Произошла непредвиденная ошибка. Мы уже работаем над её исправлением.
                </p>
                <button
                  onClick={resetError}
                  style={{
                    background: 'linear-gradient(135deg, #df600c, #f45da6)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '12px 24px',
                    color: 'white',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Попробовать снова
                </button>
              </div>
            )}
            onError={(error) => {
              console.error('Caught by Sentry ErrorBoundary:', error);
            }}
          >
            {!ageConfirmed && <AgeGate onConfirm={handleAgeConfirm} />}
            {ageConfirmed && (
              <Routes>
                <Route path="/" element={<MainScreen />} />
                <Route path="/new-design" element={<NewMainScreen />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/demo" element={<DemoPage />} />
                <Route path="/weekend-special" element={<WeekendSpecialPage />} />
                <Route path="/lottery/:slug" element={<LotteryDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/lotteries" element={<LotteriesPage />} />
                <Route path="/history" element={<TransactionHistoryPage />} />
                <Route path="/referral" element={<ReferralPage />} />
                <Route path="/swap" element={<SwapPage />} />
                <Route path="/my-tickets" element={<MyTicketsPage />} />
                <Route path="/verify-draw/:drawId" element={<VerifyDrawPage />} />
                <Route path="/verify/:ticketId?" element={<VerificationPage />} />
                <Route path="/draw/:drawId/results" element={<DrawResultsPage />} />
                <Route path="/faq" element={<FAQPage />} />
                <Route path="/terms" element={<TermsPage />} />
                <Route path="/privacy" element={<PrivacyPage />} />
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />
                <Route path="/admin/users" element={<AdminGuard><AdminUsers /></AdminGuard>} />
                <Route path="/admin/lotteries" element={<AdminGuard><AdminLotteries /></AdminGuard>} />
                <Route path="/admin/draws" element={<AdminGuard><AdminDraws /></AdminGuard>} />
                <Route path="/admin/tickets" element={<AdminGuard><AdminTickets /></AdminGuard>} />
                <Route path="/admin/notifications" element={<AdminGuard><AdminNotifications /></AdminGuard>} />
              </Routes>
            )}
          </Sentry.ErrorBoundary>
          {/* DevTools Panel - Only in Development */}
          <DevToolsPanel />
        </SoundProvider>
      </AuthProvider>
    </TonConnectUIProvider>
  );
}

export default App;
