import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';
import './MyTicketsCarousel.css';

interface Ticket {
  id: string;
  lotteryName: string;
  ticketNumber?: string;
  number?: string;
  selectedNumbers?: number[];
  numbers?: number[];
  date?: string;
  purchaseDate?: Date;
  drawDate: string | Date;
  status: 'active' | 'win' | 'won' | 'lost' | 'pending';
  prize?: number;
  transactionHash: string;
  rules?: string;
  cost?: number;
  matchedNumbers?: number;
}

interface MyTicketsCarouselProps {
  tickets?: Ticket[];
}

type TicketTab = 'active' | 'history' | 'wins';

const mockTickets: Ticket[] = [
  {
    id: '1',
    lotteryName: 'TON Mega Lottery',
    ticketNumber: '#TL-0001234',
    selectedNumbers: [7, 14, 21, 28, 35, 42],
    date: '2024-01-15',
    drawDate: '2024-01-20 20:00',
    status: 'active',
    transactionHash: 'EQD...abc123',
    rules: 'Розыгрыш каждую субботу в 20:00. Совпадение 6 чисел - главный приз!'
  },
  {
    id: '2',
    lotteryName: 'Lucky 6',
    ticketNumber: '#TL-0001235',
    selectedNumbers: [3, 11, 19, 27, 33, 41],
    date: '2024-01-14',
    drawDate: '2024-01-19 18:00',
    status: 'win',
    prize: 50,
    transactionHash: 'EQD...def456',
    rules: 'Ежедневный розыгрыш в 18:00. Минимум 3 совпадения для выигрыша.'
  },
  {
    id: '3',
    lotteryName: 'TON Mega Lottery',
    ticketNumber: '#TL-0001236',
    selectedNumbers: [5, 12, 18, 25, 32, 39],
    date: '2024-01-13',
    drawDate: '2024-01-13 20:00',
    status: 'active',
    transactionHash: 'EQD...ghi789',
    rules: 'Розыгрыш каждую субботу в 20:00. Совпадение 6 чисел - главный приз!'
  },
  {
    id: '4',
    lotteryName: 'Daily Jackpot',
    ticketNumber: '#TL-0001237',
    selectedNumbers: [8, 16, 24, 31, 38, 45],
    date: '2024-01-12',
    drawDate: '2024-01-12 21:00',
    status: 'lost',
    transactionHash: 'EQD...jkl012',
    rules: 'Розыгрыш каждый день в 21:00. Джекпот растет до победителя!'
  },
  {
    id: '5',
    lotteryName: 'Lucky 6',
    ticketNumber: '#TL-0001238',
    selectedNumbers: [2, 9, 17, 23, 30, 37],
    date: '2024-01-11',
    drawDate: '2024-01-16 18:00',
    status: 'active',
    transactionHash: 'EQD...mno345',
    rules: 'Ежедневный розыгрыш в 18:00. Минимум 3 совпадения для выигрыша.'
  },
  {
    id: '6',
    lotteryName: 'TON Mega Lottery',
    ticketNumber: '#TL-0001239',
    selectedNumbers: [4, 13, 20, 29, 36, 43],
    date: '2024-01-10',
    drawDate: '2024-01-10 20:00',
    status: 'win',
    prize: 150,
    transactionHash: 'EQD...pqr678',
    rules: 'Розыгрыш каждую субботу в 20:00. Совпадение 6 чисел - главный приз!'
  },
  {
    id: '7',
    lotteryName: 'Daily Jackpot',
    ticketNumber: '#TL-0001240',
    selectedNumbers: [6, 15, 22, 28, 34, 40],
    date: '2024-01-09',
    drawDate: '2024-01-09 21:00',
    status: 'lost',
    transactionHash: 'EQD...stu901',
    rules: 'Розыгрыш каждый день в 21:00. Джекпот растет до победителя!'
  },
  {
    id: '8',
    lotteryName: 'Lucky 6',
    ticketNumber: '#TL-0001241',
    selectedNumbers: [1, 10, 19, 26, 33, 44],
    date: '2024-01-08',
    drawDate: '2024-01-08 18:00',
    status: 'lost',
    transactionHash: 'EQD...vwx234',
    rules: 'Ежедневный розыгрыш в 18:00. Минимум 3 совпадения для выигрыша.'
  }
];

const MyTicketsCarousel: React.FC<MyTicketsCarouselProps> = ({ tickets: propTickets }) => {
  const [activeTab, setActiveTab] = useState<TicketTab>('active');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flippedTickets, setFlippedTickets] = useState<Set<string>>(new Set());

  // Use provided tickets or fall back to mock data
  const ticketsData = propTickets && propTickets.length > 0 ? propTickets : mockTickets;

  const filteredTickets = ticketsData.filter(ticket => {
    if (activeTab === 'active') return ticket.status === 'active';
    if (activeTab === 'wins') return ticket.status === 'win' || ticket.status === 'won';
    if (activeTab === 'history') return ticket.status === 'lost' || ticket.status === 'win' || ticket.status === 'won';
    return true;
  });

  const handleSwipe = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < filteredTickets.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
      }
    },
    trackMouse: true
  });

  const toggleFlip = (ticketId: string) => {
    setFlippedTickets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(ticketId)) {
        newSet.delete(ticketId);
      } else {
        newSet.add(ticketId);
      }
      return newSet;
    });
  };

  const getStatusGradient = (status: Ticket['status']) => {
    switch (status) {
      case 'active':
      case 'pending':
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'win':
      case 'won':
        return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'lost':
        return 'linear-gradient(135deg, #4b5563 0%, #374151 100%)';
      default:
        return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  const getStatusLabel = (status: Ticket['status']) => {
    switch (status) {
      case 'active':
        return '🎯 Активный';
      case 'pending':
        return '⏳ Ожидание';
      case 'win':
      case 'won':
        return '🎉 Выигрыш';
      case 'lost':
        return '❌ Проигрыш';
      default:
        return '';
    }
  };

  return (
    <div className="my-tickets-carousel">
      <div className="tickets-header">
        <h2>🎫 Мои билеты</h2>
        <div className="tickets-tabs">
          <button
            className={`tab-btn ${activeTab === 'active' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('active');
              setCurrentIndex(0);
            }}
          >
            Активные
          </button>
          <button
            className={`tab-btn ${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('history');
              setCurrentIndex(0);
            }}
          >
            История
          </button>
          <button
            className={`tab-btn ${activeTab === 'wins' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('wins');
              setCurrentIndex(0);
            }}
          >
            Выигрыши
          </button>
        </div>
      </div>

      {filteredTickets.length === 0 ? (
        <div className="no-tickets">
          <p>📭 Билеты не найдены</p>
        </div>
      ) : (
        <>
          <div className="carousel-container" {...handleSwipe}>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${activeTab}-${currentIndex}`}
                className="ticket-wrapper"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`ticket-card ${flippedTickets.has(filteredTickets[currentIndex].id) ? 'flipped' : ''} ${
                    filteredTickets[currentIndex].status === 'win' || filteredTickets[currentIndex].status === 'won' ? 'winning' : ''
                  }`}
                  onClick={() => toggleFlip(filteredTickets[currentIndex].id)}
                >
                  <div className="ticket-inner">
                    <div
                      className="ticket-front"
                      style={{ background: getStatusGradient(filteredTickets[currentIndex].status) }}
                    >
                      <div className="ticket-front-content">
                        <div className="ticket-header-content">
                          <div className="lottery-logo">🎰</div>
                          <div className="ticket-info">
                            <h3>{filteredTickets[currentIndex].lotteryName}</h3>
                            <p className="ticket-number">{filteredTickets[currentIndex].ticketNumber || filteredTickets[currentIndex].number || '—'}</p>
                          </div>
                          <div className={`status-badge ${filteredTickets[currentIndex].status}`}>
                            {getStatusLabel(filteredTickets[currentIndex].status)}
                          </div>
                        </div>

                        <div className="selected-numbers">
                          <p className="numbers-label">Выбранные числа:</p>
                          <div className="numbers-grid">
                            {(filteredTickets[currentIndex].selectedNumbers || filteredTickets[currentIndex].numbers || []).map((num, idx) => (
                              <motion.div
                                key={idx}
                                className="number-ball"
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: idx * 0.05 }}
                              >
                                {num}
                              </motion.div>
                            ))}
                          </div>
                        </div>

                        <div className="ticket-footer-content">
                          <div className="ticket-date">
                            <span>📅 Куплен: {
                              filteredTickets[currentIndex].date || 
                              (filteredTickets[currentIndex].purchaseDate ? 
                                filteredTickets[currentIndex].purchaseDate instanceof Date ? 
                                  filteredTickets[currentIndex].purchaseDate.toLocaleDateString('ru-RU') : 
                                  new Date(filteredTickets[currentIndex].purchaseDate!).toLocaleDateString('ru-RU') : 
                                '—')
                            }</span>
                          </div>
                          {filteredTickets[currentIndex].prize && (
                            <div className="prize-amount">
                              💰 +{filteredTickets[currentIndex].prize} TON
                            </div>
                          )}
                        </div>

                        <div className="flip-hint">👆 Нажмите для деталей</div>
                      </div>
                    </div>

                    <div
                      className="ticket-back"
                      style={{ background: getStatusGradient(filteredTickets[currentIndex].status) }}
                    >
                      <div className="ticket-back-content">
                        <h3>📋 Детали билета</h3>

                        {filteredTickets[currentIndex].rules && (
                          <div className="back-info-section">
                            <p className="info-label">Правила розыгрыша:</p>
                            <p className="info-text">{filteredTickets[currentIndex].rules}</p>
                          </div>
                        )}

                        <div className="back-info-section">
                          <p className="info-label">🎯 Дата розыгрыша:</p>
                          <p className="info-text">{
                            typeof filteredTickets[currentIndex].drawDate === 'string' ? 
                              filteredTickets[currentIndex].drawDate : 
                              (filteredTickets[currentIndex].drawDate as Date).toLocaleDateString('ru-RU', { 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })
                          }</p>
                        </div>

                        <div className="back-info-section">
                          <p className="info-label">🔗 Транзакция:</p>
                          <p className="info-text hash">{filteredTickets[currentIndex].transactionHash}</p>
                        </div>

                        <div className="flip-hint">👆 Нажмите чтобы вернуться</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="carousel-navigation">
            <button
              className="nav-btn"
              onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
              disabled={currentIndex === 0}
            >
              ‹
            </button>
            <div className="carousel-dots">
              {filteredTickets.map((_, idx) => (
                <button
                  key={idx}
                  className={`dot ${idx === currentIndex ? 'active' : ''}`}
                  onClick={() => setCurrentIndex(idx)}
                />
              ))}
            </div>
            <button
              className="nav-btn"
              onClick={() => setCurrentIndex(Math.min(filteredTickets.length - 1, currentIndex + 1))}
              disabled={currentIndex === filteredTickets.length - 1}
            >
              ›
            </button>
          </div>

          <div className="ticket-counter">
            {currentIndex + 1} / {filteredTickets.length}
          </div>
        </>
      )}
    </div>
  );
};

export default MyTicketsCarousel;
