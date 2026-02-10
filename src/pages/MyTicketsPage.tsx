import { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import MyTicketsCarousel from '../components/Lottery/MyTicketsCarousel';
import { ticketApi } from '../services/ticketApi';
import './MyTicketsPage.css';

type TicketStatus = 'active' | 'won' | 'lost' | 'pending';

interface FormattedTicket {
  id: string;
  number: string;
  lotteryName: string;
  lotteryType: 'regular';
  purchaseDate: Date;
  drawDate: Date;
  numbers: number[];
  cost: number;
  transactionHash: string;
  status: TicketStatus;
  prize?: number;
  matchedNumbers?: number;
}

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const userAddress = useTonAddress();
  const [tickets, setTickets] = useState<FormattedTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userAddress) {
      loadTickets();
    } else {
      setTickets([]);
      setIsLoading(false);
    }
  }, [userAddress]);

  async function loadTickets() {
    if (!userAddress) return;

    setIsLoading(true);
    setError(null);

    try {
      const purchasedTickets = await ticketApi.getUserTickets(userAddress);
      
      // Format tickets for MyTicketsCarousel
      const formatted: FormattedTicket[] = purchasedTickets.map(ticket => ({
        id: ticket.id,
        number: ticket.id.substring(0, 8).toUpperCase(), // Use first 8 chars of ID
        lotteryName: formatLotteryName(ticket.lotterySlug),
        lotteryType: 'regular' as const,
        purchaseDate: new Date(ticket.purchasedAt || ticket.createdAt || ''),
        drawDate: getDrawDate(ticket.lotterySlug), // TODO: Get from lottery info
        numbers: ticket.numbers,
        cost: ticket.price,
        transactionHash: ticket.txHash,
        status: ticket.status as TicketStatus,
        prize: ticket.prizeAmount,
        matchedNumbers: ticket.matchedNumbers,
      }));

      setTickets(formatted);
      console.log(`📊 Loaded ${formatted.length} tickets for ${userAddress}`);
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError(err instanceof Error ? err.message : 'Failed to load tickets');
      
      // Show mock data if API fails
      setTickets(getMockTickets());
    } finally {
      setIsLoading(false);
    }
  }

  function formatLotteryName(slug: string): string {
    const names: Record<string, string> = {
      'weekend-special': 'Weekend Special',
      'mega-jackpot': 'Mega Jackpot',
      'daily-draw': 'Daily Draw',
    };
    return names[slug] || slug.split('-').map(w => 
      w.charAt(0).toUpperCase() + w.slice(1)
    ).join(' ');
  }

  function getDrawDate(_slug: string): Date {
    // TODO: Fetch from lottery API
    // For now, return next Saturday
    const date = new Date();
    const daysUntilSaturday = (6 - date.getDay() + 7) % 7 || 7;
    date.setDate(date.getDate() + daysUntilSaturday);
    date.setHours(20, 0, 0, 0);
    return date;
  }

  function getMockTickets(): FormattedTicket[] {
    return [
      {
        id: 'mock-1',
        number: 'MOCK0001',
        lotteryName: 'Weekend Special',
        lotteryType: 'regular',
        purchaseDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        drawDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        numbers: [5, 12, 23, 31, 36],
        cost: 1,
        transactionHash: '0xmock...1234',
        status: 'active',
      },
      {
        id: 'mock-2',
        number: 'MOCK0002',
        lotteryName: 'Mega Jackpot',
        lotteryType: 'regular',
        purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        drawDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        numbers: [3, 15, 22, 28, 33],
        cost: 10,
        transactionHash: '0xmock...5678',
        status: 'won',
        prize: 500,
        matchedNumbers: 4,
      },
    ];
  }

  return (
    <div className="my-tickets-page">
      <AnimatedBackground />
      
      <div className="content-wrapper">
        <Header />
        
        <main className="main-content">
          <div className="page-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Назад
            </button>
            <h1 className="page-title">🎫 Мои билеты</h1>
          </div>

          {!userAddress ? (
            <div className="connect-prompt">
              <p>Подключите кошелёк для просмотра ваших билетов</p>
            </div>
          ) : isLoading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Загрузка билетов...</p>
            </div>
          ) : error ? (
            <div className="error-state">
              <p>⚠️ {error}</p>
              <button onClick={loadTickets}>Попробовать снова</button>
            </div>
          ) : tickets.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎫</div>
              <h2>У вас пока нет билетов</h2>
              <p>Купите билет, чтобы участвовать в розыгрыше</p>
              <button 
                className="cta-btn"
                onClick={() => navigate('/')}
              >
                Купить билет
              </button>
            </div>
          ) : (
            <div className="tickets-section">
              <div className="tickets-stats">
                <div className="stat-item">
                  <span className="stat-value">{tickets.length}</span>
                  <span className="stat-label">Всего билетов</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {tickets.filter(t => t.status === 'active').length}
                  </span>
                  <span className="stat-label">Активные</span>
                </div>
                <div className="stat-item">
                  <span className="stat-value">
                    {tickets.filter(t => t.status === 'won').length}
                  </span>
                  <span className="stat-label">Выигрыши</span>
                </div>
              </div>

              <MyTicketsCarousel tickets={tickets} />

              <button 
                className="refresh-btn"
                onClick={loadTickets}
                disabled={isLoading}
              >
                🔄 Обновить
              </button>
            </div>
          )}
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
