import { useState, useEffect } from 'react';
import { useTonAddress } from '@tonconnect/ui-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import { useUserHistory, type HistoryFilters } from '../hooks/useUserHistory';
import './TransactionHistoryPage.css';

type TransactionStatus = 'completed' | 'pending' | 'paid';

export default function TransactionHistoryPage() {
  const navigate = useNavigate();
  const userAddress = useTonAddress();
  const [filterType, setFilterType] = useState<'all' | 'purchase' | 'win'>('all');
  const [page, setPage] = useState(1);
  
  // Phase 4: Use real API hook
  const filters: HistoryFilters = {
    page,
    limit: 20,
    type: filterType,
  };
  
  const { data: historyData, isLoading, error } = useUserHistory(userAddress ? filters : undefined);

  // Reset page when filter changes
  useEffect(() => {
    setPage(1);
  }, [filterType]);

  const transactions = historyData?.history || [];
  const pagination = historyData?.pagination;

  function getTypeIcon(type: 'purchase' | 'win'): string {
    const icons = {
      purchase: '🎫',
      win: '🎉',
    };
    return icons[type];
  }

  function getTypeName(type: 'purchase' | 'win'): string {
    const names = {
      purchase: 'Покупка билета',
      win: 'Выигрыш',
    };
    return names[type];
  }

  function getStatusLabel(status: TransactionStatus): string {
    const labels: Record<TransactionStatus, string> = {
      completed: '✅ Успешно',
      paid: '✅ Успешно',
      pending: '⏳ Ожидание',
    };
    return labels[status];
  }

  function getTonExplorerLink(txHash: string): string {
    return `https://tonscan.org/tx/${txHash}`;
  }

  function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Сегодня';
    if (days === 1) return 'Вчера';
    if (days < 7) return `${days} дней назад`;

    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  return (
    <div className="transaction-history-page">
      <AnimatedBackground />
      
      <div className="content-wrapper">
        <Header />
        
        <main className="main-content">
          <div className="page-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ← Назад
            </button>
            <h1 className="page-title">📜 История транзакций</h1>
          </div>

          {!userAddress ? (
            <div className="connect-prompt">
              <p>Подключите кошелёк для просмотра истории</p>
            </div>
          ) : (
            <>
              <div className="filter-tabs">
                <button
                  className={filterType === 'all' ? 'active' : ''}
                  onClick={() => setFilterType('all')}
                >
                  Все
                </button>
                <button
                  className={filterType === 'purchase' ? 'active' : ''}
                  onClick={() => setFilterType('purchase')}
                >
                  🎫 Покупки
                </button>
                <button
                  className={filterType === 'win' ? 'active' : ''}
                  onClick={() => setFilterType('win')}
                >
                  🎉 Выигрыши
                </button>
              </div>

              {isLoading ? (
                <div className="loading-state">
                  <div className="spinner"></div>
                  <p>Загрузка транзакций...</p>
                </div>
              ) : error ? (
                <div className="empty-state">
                  <div className="empty-icon">⚠️</div>
                  <h2>Ошибка загрузки</h2>
                  <p>Не удалось загрузить историю транзакций</p>
                </div>
              ) : transactions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📜</div>
                  <h2>Нет транзакций</h2>
                  <p>Ваши транзакции появятся здесь</p>
                </div>
              ) : (
                <div className="transactions-list">
                  {transactions.map((tx, index) => (
                    <motion.div
                      key={tx.id}
                      className={`transaction-item ${tx.type}`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="tx-icon">
                        {getTypeIcon(tx.type)}
                      </div>
                      
                      <div className="tx-info">
                        <div className="tx-type">
                          {getTypeName(tx.type)}
                        </div>
                        <div className="tx-description">
                          {tx.lotteryName}
                        </div>
                        <div className="tx-numbers">
                          {tx.numbers.map((num, idx) => (
                            <span key={idx} className="number-badge">{num}</span>
                          ))}
                        </div>
                        <div className="tx-date">
                          {formatDate(new Date(tx.createdAt))}
                        </div>
                      </div>

                      <div className="tx-amount">
                        <div className={`amount ${tx.type === 'win' ? 'positive' : 'negative'}`}>
                          {tx.type === 'win' ? '+' : '-'}{tx.amount.toFixed(2)} {tx.currency}
                        </div>
                        <div className="tx-status">
                          {getStatusLabel(tx.status)}
                        </div>
                      </div>

                      <a
                        href={getTonExplorerLink(tx.txHash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tx-link"
                        title="View on TON Explorer"
                      >
                        🔗
                      </a>
                    </motion.div>
                  ))}
                  
                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="pagination">
                      <button
                        disabled={page === 1}
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        className="pagination-btn"
                      >
                        ← Назад
                      </button>
                      <span className="pagination-info">
                        Страница {page} из {pagination.totalPages}
                      </span>
                      <button
                        disabled={page === pagination.totalPages}
                        onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                        className="pagination-btn"
                      >
                        Вперёд →
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </main>
        
        <Footer activeTab="history" onTabChange={(tab) => {
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
