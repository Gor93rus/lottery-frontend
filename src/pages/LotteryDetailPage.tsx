/**
 * Lottery Detail Page
 * Shows detailed information about a specific lottery
 */

import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, Calendar, Coins } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import { useLottery } from '../hooks/useLottery';
import { SkeletonLoader } from '../components/Animations';
import './LotteryDetailPage.css';

function LotteryDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  
  const { data: lotteryData, isLoading, error } = useLottery(slug || '');

  const handleBuyTickets = () => {
    // Navigate to purchase page (currently using WeekendSpecial as placeholder)
    if (slug === 'weekend-special') {
      navigate('/weekend-special');
    } else {
      navigate('/weekend-special'); // Fallback
    }
  };

  if (isLoading) {
    return (
      <div className="app-root">
        <AnimatedBackground />
        <div className="content-wrapper">
          <Header />
          <main className="lottery-detail-page">
            <div className="lottery-detail-container">
              <SkeletonLoader type="lottery-card" count={1} />
            </div>
          </main>
          <Footer activeTab="lotteries" onTabChange={() => {}} />
        </div>
      </div>
    );
  }

  if (error || !lotteryData?.lottery) {
    return (
      <div className="app-root">
        <AnimatedBackground />
        <div className="content-wrapper">
          <Header />
          <main className="lottery-detail-page">
            <div className="lottery-detail-container">
              <motion.div
                className="lottery-detail-error"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2>Лотерея не найдена</h2>
                <p>К сожалению, мы не смогли найти эту лотерею.</p>
                <button onClick={() => navigate('/lotteries')}>
                  Вернуться к списку лотерей
                </button>
              </motion.div>
            </div>
          </main>
          <Footer activeTab="lotteries" onTabChange={() => {}} />
        </div>
      </div>
    );
  }

  const { lottery, nextDraw } = lotteryData;
  const drawDate = nextDraw?.scheduledAt 
    ? new Date(nextDraw.scheduledAt).toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Скоро';

  return (
    <div className="app-root">
      <AnimatedBackground />
      <div className="content-wrapper">
        <Header />
        
        <main className="lottery-detail-page">
          <motion.div
            className="lottery-detail-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Back Button */}
            <motion.button
              className="lottery-detail-back"
              onClick={() => navigate('/lotteries')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <ArrowLeft size={20} />
              <span>Назад</span>
            </motion.button>

            {/* Lottery Header */}
            <motion.div
              className="lottery-detail-header"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h1>{lottery.name}</h1>
              {lottery.description && (
                <p className="lottery-detail-description">{lottery.description}</p>
              )}
            </motion.div>

            {/* Prize Pool */}
            <motion.div
              className="lottery-detail-prize"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="lottery-detail-prize-icon">
                <Coins size={48} />
              </div>
              <div className="lottery-detail-prize-info">
                <p className="lottery-detail-prize-label">Джекпот</p>
                <h2 className="lottery-detail-prize-amount">
                  {lottery.currentJackpot?.toLocaleString() || '0'} {lottery.currency}
                </h2>
              </div>
            </motion.div>

            {/* Info Cards */}
            <div className="lottery-detail-info-grid">
              <motion.div
                className="lottery-detail-info-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="lottery-detail-info-icon">
                  <Calendar size={24} />
                </div>
                <div className="lottery-detail-info-content">
                  <p className="lottery-detail-info-label">Розыгрыш</p>
                  <p className="lottery-detail-info-value">{drawDate}</p>
                </div>
              </motion.div>

              <motion.div
                className="lottery-detail-info-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <div className="lottery-detail-info-icon">
                  <Coins size={24} />
                </div>
                <div className="lottery-detail-info-content">
                  <p className="lottery-detail-info-label">Цена билета</p>
                  <p className="lottery-detail-info-value">
                    {lottery.ticketPrice} {lottery.currency}
                  </p>
                </div>
              </motion.div>

              <motion.div
                className="lottery-detail-info-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="lottery-detail-info-icon">
                  <Users size={24} />
                </div>
                <div className="lottery-detail-info-content">
                  <p className="lottery-detail-info-label">Розыгрыш №</p>
                  <p className="lottery-detail-info-value">
                    {nextDraw?.drawNumber || 0}
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Rules Section */}
            {lottery.rules && (
              <motion.div
                className="lottery-detail-rules"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
              >
                <h3>Правила</h3>
                <p>{lottery.rules}</p>
              </motion.div>
            )}

            {/* Prize Structure */}
            {lottery.prizeStructure && (
              <motion.div
                className="lottery-detail-prizes"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3>Структура призов</h3>
                <div className="lottery-detail-prize-list">
                  {Object.entries(lottery.prizeStructure).map(([place, percentage]) => (
                    <div key={place} className="lottery-detail-prize-item">
                      <span className="lottery-detail-prize-place">{place}</span>
                      <span className="lottery-detail-prize-percentage">{String(percentage)}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Buy Button */}
            <motion.button
              className="lottery-detail-buy-btn"
              onClick={handleBuyTickets}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
            >
              Купить билеты
            </motion.button>
          </motion.div>
        </main>

        <Footer activeTab="lotteries" onTabChange={(tab) => navigate(`/${tab}`)} />
      </div>
    </div>
  );
}

export default LotteryDetailPage;
