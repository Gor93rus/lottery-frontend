import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Clock, Ticket, Trophy, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import './HistoryPage.css';

// Placeholder ticket history data
const placeholderTickets = [
  {
    id: '1',
    lottery: 'Weekend Special',
    numbers: [7, 14, 21, 28, 35],
    purchaseDate: '2026-01-20',
    drawDate: '2026-01-26',
    ticketPrice: '5 TON',
    status: 'pending',
  },
  {
    id: '2',
    lottery: 'Daily Draw',
    numbers: [3, 12, 19, 24, 31],
    purchaseDate: '2026-01-19',
    drawDate: '2026-01-24',
    ticketPrice: '2 TON',
    status: 'won',
    prize: '50 TON',
  },
  {
    id: '3',
    lottery: 'Mega Jackpot',
    numbers: [5, 11, 17, 23, 29],
    purchaseDate: '2026-01-18',
    drawDate: '2026-01-25',
    ticketPrice: '10 TON',
    status: 'pending',
  },
  {
    id: '4',
    lottery: 'Daily Draw',
    numbers: [8, 15, 22, 27, 34],
    purchaseDate: '2026-01-17',
    drawDate: '2026-01-21',
    ticketPrice: '2 TON',
    status: 'lost',
  },
  {
    id: '5',
    lottery: 'Weekend Special',
    numbers: [2, 9, 16, 25, 32],
    purchaseDate: '2026-01-15',
    drawDate: '2026-01-19',
    ticketPrice: '5 TON',
    status: 'lost',
  },
];

function HistoryPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');


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

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'won':
        return <Trophy className="status-icon won" size={20} />;
      case 'lost':
        return <XCircle className="status-icon lost" size={20} />;
      case 'pending':
        return <Clock className="status-icon pending" size={20} />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'won':
        return 'Выигрыш';
      case 'lost':
        return 'Проигрыш';
      case 'pending':
        return 'Ожидание';
      default:
        return status;
    }
  };

  return (
    <div className="app-root">
      <AnimatedBackground />
      
      <div className="content-wrapper">
        <Header />
        
        <main className="history-page">
          <motion.div
            className="history-container"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.h1
              className="history-title"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              История билетов
            </motion.h1>

            {!isAuthenticated ? (
              <motion.div
                className="history-placeholder"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <div className="placeholder-icon">
                  <Ticket size={48} />
                </div>
                <h2 className="placeholder-title">Войдите, чтобы увидеть историю</h2>
                <p className="placeholder-text">
                  Подключите кошелёк, чтобы просмотреть историю ваших билетов
                </p>
              </motion.div>
            ) : (
              <div className="tickets-list">
                {placeholderTickets.map((ticket, index) => (
                  <motion.div
                    key={ticket.id}
                    className={`ticket-card ${ticket.status}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <div className="ticket-header">
                      <div className="ticket-lottery">
                        <Ticket size={20} />
                        <span>{ticket.lottery}</span>
                      </div>
                      <div className={`ticket-status ${ticket.status}`}>
                        {getStatusIcon(ticket.status)}
                        <span>{getStatusText(ticket.status)}</span>
                      </div>
                    </div>

                    <div className="ticket-numbers">
                      {ticket.numbers.map((num, i) => (
                        <div key={i} className="number-ball">
                          {num}
                        </div>
                      ))}
                    </div>

                    <div className="ticket-details">
                      <div className="ticket-detail">
                        <span className="detail-label">Куплен:</span>
                        <span className="detail-value">
                          {new Date(ticket.purchaseDate).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <div className="ticket-detail">
                        <span className="detail-label">Розыгрыш:</span>
                        <span className="detail-value">
                          {new Date(ticket.drawDate).toLocaleDateString('ru-RU')}
                        </span>
                      </div>
                      <div className="ticket-detail">
                        <span className="detail-label">Цена:</span>
                        <span className="detail-value">{ticket.ticketPrice}</span>
                      </div>
                      {ticket.prize && (
                        <div className="ticket-detail prize">
                          <span className="detail-label">Выигрыш:</span>
                          <span className="detail-value prize-value">{ticket.prize}</span>
                        </div>
                      )}
                    </div>
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

export default HistoryPage;
