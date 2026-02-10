import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import LotteryCard from '../components/LotteryCard/LotteryCard';
import { useLotteries, type Lottery } from '../hooks/useLotteries';
import { SkeletonLoader } from '../components/Animations';
import './LotteriesPage.css';

// Icon mapping for lottery types
const getIconForLottery = (name: string): 'ticket' | 'coins' | 'trending' | 'calendar' => {
  const nameLower = name.toLowerCase();
  if (nameLower.includes('weekend') || nameLower.includes('special')) return 'ticket';
  if (nameLower.includes('jackpot') || nameLower.includes('mega') || nameLower.includes('grand')) return 'coins';
  if (nameLower.includes('flash') || nameLower.includes('lucky')) return 'trending';
  return 'calendar';
};

function LotteriesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('lotteries');
  
  // Fetch lotteries from API
  const { data: lotteriesData, isLoading, error } = useLotteries();

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

  const handleBuyTicket = (lotteryId: string) => {
    // Navigate to lottery detail page
    const lottery = lotteriesData?.lotteries?.find((l: Lottery) => l.id === lotteryId || l.slug === lotteryId);
    if (lottery?.slug) {
      navigate(`/lottery/${lottery.slug}`);
    } else {
      // Fallback to weekend-special as placeholder
      navigate('/weekend-special');
    }
  };

  // Transform API data for display
  const displayLotteries = lotteriesData?.lotteries
    ?.filter((lottery: Lottery) => lottery.active)
    ?.map((lottery: Lottery) => {
      const prizePool = lottery.prizePool || lottery.currentJackpot || 0;
      const ticketPrice = lottery.ticketPrice || 0;
      const currency = lottery.currency || 'TON';
      
      return {
        id: lottery.id || lottery.slug,
        title: lottery.name,
        prizePool: `${prizePool.toLocaleString()} ${currency}`,
        drawDate: lottery.drawDate ? new Date(lottery.drawDate).toLocaleDateString('ru-RU') : 'Скоро',
        ticketPrice: `${ticketPrice} ${currency}`,
        participants: lottery.participants || 0,
        icon: getIconForLottery(lottery.name),
      };
    }) || [];

  return (
    <div className="app-root">
      <AnimatedBackground />
      
      <div className="content-wrapper">
        <Header />
        
        <main className="lotteries-page">
          <motion.div
            className="lotteries-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="lotteries-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              Все лотереи
            </motion.h1>
            
            <motion.p
              className="lotteries-subtitle"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
            >
              Выберите лотерею и попробуйте свою удачу!
            </motion.p>

            {isLoading ? (
              <div className="lotteries-grid">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i}>
                    <SkeletonLoader type="lottery-card" />
                  </div>
                ))}
              </div>
            ) : error ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#ff4444' }}>
                <p>Не удалось загрузить лотереи. Пожалуйста, попробуйте позже.</p>
              </div>
            ) : displayLotteries.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: '#888' }}>
                <p>В данный момент нет активных лотерей.</p>
              </div>
            ) : (
              <div className="lotteries-grid">
                {displayLotteries.map((lottery, index: number) => (
                  <motion.div
                    key={lottery.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  >
                    <LotteryCard
                      title={lottery.title}
                      prizePool={lottery.prizePool}
                      drawDate={lottery.drawDate}
                      ticketPrice={lottery.ticketPrice}
                      participants={lottery.participants}
                      icon={lottery.icon}
                      onBuyTicket={() => handleBuyTicket(lottery.id)}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </main>

        <Footer activeTab={activeTab} onTabChange={handleTabChange} />
      </div>
    </div>
  );
}

export default LotteriesPage;
