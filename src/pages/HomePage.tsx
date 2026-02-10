import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { apiClient } from '../lib/api/client';
import type { Lottery } from '../types/api';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import CheckInButton from '../components/Gamification/CheckInButton';
import { useAuth } from '../contexts/AuthContext';
import { useStreak } from '../hooks/useStreak';
import './HomePage.css';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number>(5.2);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCurrency, setSelectedCurrency] = useState<'TON' | 'USDT' | null>(null);

  // Gamification hooks
  const userId = user?.id?.toString();
  const streak = useStreak(userId);

  useEffect(() => {
    loadLotteries();
    loadExchangeRate();
  }, []);

  // Add global currency change listener
  useEffect(() => {
    function handleGlobalCurrencyChange(e: Event) {
      const customEvent = e as CustomEvent<{ currency: 'TON' | 'USDT' }>;
      const newCurrency = customEvent.detail.currency;
      
      console.log('Global currency changed to:', newCurrency);
      setSelectedCurrency(newCurrency);
      loadLotteries(newCurrency);
    }

    window.addEventListener('currencyChange', handleGlobalCurrencyChange);
    
    return () => {
      window.removeEventListener('currencyChange', handleGlobalCurrencyChange);
    };
  }, []);

  async function loadLotteries(currency?: 'TON' | 'USDT') {
    try {
      setLoading(true);
      const response = await apiClient.getLotteries();
      
      const allLotteries = response.lotteries || [];
      
      // If API returns empty, use fallback mock data
      if (allLotteries.length === 0) {
        console.warn('No lotteries from API, using fallback data');
        // Fallback will be handled by SQL migration
      }
      
      // Smart filtering: if currency specified, try to filter
      if (currency && allLotteries.length > 0) {
        const filtered = allLotteries.filter((lottery: Lottery) => lottery.currency === currency);
        
        // Only apply filter if results exist
        // Otherwise show ALL lotteries
        if (filtered.length > 0) {
          setLotteries(filtered);
        } else {
          console.warn(`No ${currency} lotteries found, showing all`);
          setLotteries(allLotteries);
        }
      } else {
        // No currency filter - show all
        setLotteries(allLotteries);
      }
      
    } catch (error) {
      console.error('Failed to load lotteries:', error);
      // Don't show empty state on error - keep previous lotteries
    } finally {
      setLoading(false);
    }
  }

  async function loadExchangeRate() {
    try {
      const response = await apiClient.getExchangeRate('TON', 'USDT');
      setExchangeRate(response.rate);
    } catch (error) {
      console.error('Failed to load exchange rate:', error);
    }
  }

  const getCurrencyIcon = (currency: string) => {
    return currency === 'TON' ? '💎' : '💵';
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
      case 'profile':
        navigate('/profile');
        break;
      case 'referral':
        navigate('/referral');
        break;
    }
  };

  if (loading) {
    return (
      <div className="app-root">
        <AnimatedBackground />
        <div className="content-wrapper">
          <Header />
          <main className="main-content">
            <div className="home-page">
              <div className="loading">Загрузка...</div>
            </div>
          </main>
          <Footer activeTab={activeTab} onTabChange={handleTabChange} />
        </div>
      </div>
    );
  }

  return (
    <div className="app-root">
      <AnimatedBackground />
      
      <div className="content-wrapper">
        <Header />
        
        <main className="main-content">
          <div className="home-page">
            {/* Header */}
            <header className="hero-section">
              <h1 className="main-title">WEEKEND MILLIONS</h1>
              <p className="subtitle">Криптовалютная лотерея нового поколения на блокчейне TON</p>
            </header>

            {/* Check-In Banner for Logged-In Users */}
            {user && userId && !streak.isLoading && streak.canCheckIn !== undefined && (
              <motion.section
                className="checkin-banner-section"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <CheckInButton
                  currentStreak={streak.currentStreak}
                  canCheckIn={streak.canCheckIn}
                  isCheckingIn={streak.isCheckingIn}
                  onCheckIn={streak.checkIn}
                  checkInResult={streak.checkInResult}
                />
              </motion.section>
            )}

            {/* Lotteries Section */}
            <section className="lotteries-section">
              <h2>Активные лотереи</h2>
              <div className="lotteries-grid">
                {lotteries.length > 0 ? (
                  lotteries.map((lottery, index) => (
                    <motion.div
                      key={lottery.id}
                      className={`lottery-card ${lottery.featured ? 'featured' : ''} ${
                        selectedCurrency && lottery.currency === selectedCurrency ? 'highlighted' : ''
                      } ${
                        selectedCurrency && lottery.currency !== selectedCurrency ? 'dimmed' : ''
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="lottery-header">
                        <h2>{lottery.name}</h2>
                        <span className="currency-badge">
                          {getCurrencyIcon(lottery.currency)} {lottery.currency}
                        </span>
                      </div>

                      <div className="jackpot">
                        <span className="label">Джекпот:</span>
                        <span className="amount">
                          {getCurrencyIcon(lottery.currency)} {(lottery.jackpot || lottery.currentJackpot || 0).toLocaleString()} {lottery.currency}
                        </span>
                        {lottery.currency === 'TON' && (
                          <span className="equivalent">
                            ≈ {((lottery.jackpot || lottery.currentJackpot || 0) * exchangeRate).toFixed(0)} USDT
                          </span>
                        )}
                      </div>

                      <div className="ticket-price">
                        Билет: {lottery.ticketPrice} {lottery.currency}
                      </div>

                      <Link to={`/lottery/${lottery.slug}`} className="play-btn">
                        🎲 Играть
                      </Link>
                    </motion.div>
                  ))
                ) : (
                  <div className="no-lotteries">
                    Нет активных лотерей
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>

        <Footer activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}
