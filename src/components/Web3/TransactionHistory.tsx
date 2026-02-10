import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '../../hooks/useHaptic';
import './TransactionHistory.css';

type TransactionType = 'sent' | 'received' | 'processing';
type FilterType = 'all' | 'sent' | 'received';

interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  timestamp: Date;
  hash: string;
  description: string;
  category?: 'purchase' | 'win' | 'bonus' | 'refund';
}

interface TransactionHistoryProps {
  limit?: number;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    type: 'sent',
    amount: -50,
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 30),
    hash: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    description: 'Покупка билета TON Million',
    category: 'purchase'
  },
  {
    id: '2',
    type: 'received',
    amount: 250,
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
    hash: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    description: 'Выигрыш в Daily Drop',
    category: 'win'
  },
  {
    id: '3',
    type: 'sent',
    amount: -25,
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    hash: '0x234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12',
    description: 'Покупка билета Instant Win',
    category: 'purchase'
  },
  {
    id: '4',
    type: 'received',
    amount: 100,
    status: 'completed',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    hash: '0x34567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef123',
    description: 'Реферальный бонус',
    category: 'bonus'
  },
  {
    id: '5',
    type: 'processing',
    amount: -100,
    status: 'pending',
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    hash: '0x4567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234',
    description: 'Покупка билета Mega Jackpot',
    category: 'purchase'
  }
];

export const TransactionHistory = ({ limit = 20 }: TransactionHistoryProps) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const { light, medium } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem('transactions');
    if (saved) {
      const parsed = JSON.parse(saved) as Array<Omit<Transaction, 'timestamp'> & { timestamp: string }>;
      setTransactions(parsed.map((tx) => ({
        ...tx,
        timestamp: new Date(tx.timestamp)
      })));
    } else {
      setTransactions(MOCK_TRANSACTIONS);
      localStorage.setItem('transactions', JSON.stringify(MOCK_TRANSACTIONS));
    }
  }, []);

  const filteredTransactions = transactions
    .filter(tx => {
      if (filter === 'all') return true;
      if (filter === 'sent') return tx.type === 'sent';
      if (filter === 'received') return tx.type === 'received';
      return true;
    })
    .slice(0, limit);

  const groupedTransactions = groupByDate(filteredTransactions);

  const handleTransactionClick = (tx: Transaction) => {
    setSelectedTx(tx);
    setShowDetailModal(true);
    medium();
  };

  const handleCloseDetail = () => {
    setShowDetailModal(false);
    setSelectedTx(null);
    light();
  };

  const exportToCSV = () => {
    const headers = ['Дата', 'Тип', 'Сумма', 'Статус', 'Хеш', 'Описание'];
    const rows = transactions.map(tx => [
      tx.timestamp.toISOString(),
      tx.type,
      tx.amount,
      tx.status,
      tx.hash,
      tx.description
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `transactions_${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    light();
  };

  const copyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      light();
      
      const toast = document.createElement('div');
      toast.className = 'hash-toast';
      toast.textContent = 'Хеш скопирован!';
      document.body.appendChild(toast);
      
      setTimeout(() => toast.classList.add('hash-toast--show'), 100);
      setTimeout(() => {
        toast.classList.remove('hash-toast--show');
        setTimeout(() => document.body.removeChild(toast), 300);
      }, 2000);
    } catch (error) {
      console.error('Copy error:', error);
    }
  };

  return (
    <div className="transaction-history">
      <div className="transaction-header">
        <h2>История транзакций</h2>
        <button className="export-btn" onClick={exportToCSV}>
          📊 Экспорт CSV
        </button>
      </div>

      <div className="transaction-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'filter-btn--active' : ''}`}
          onClick={() => { setFilter('all'); light(); }}
        >
          Все
        </button>
        <button
          className={`filter-btn ${filter === 'sent' ? 'filter-btn--active' : ''}`}
          onClick={() => { setFilter('sent'); light(); }}
        >
          Отправлено
        </button>
        <button
          className={`filter-btn ${filter === 'received' ? 'filter-btn--active' : ''}`}
          onClick={() => { setFilter('received'); light(); }}
        >
          Получено
        </button>
      </div>

      <div className="transaction-list">
        {Object.entries(groupedTransactions).map(([group, txs]) => (
          <div key={group} className="transaction-group">
            <h3 className="group-title">{group}</h3>
            {txs.map((tx) => (
              <motion.div
                key={tx.id}
                className="transaction-item"
                onClick={() => handleTransactionClick(tx)}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <div className="transaction-icon">
                  {getTransactionIcon(tx)}
                </div>
                
                <div className="transaction-info">
                  <h4>{tx.description}</h4>
                  <div className="transaction-meta">
                    <span className="transaction-time">
                      {tx.timestamp.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                    <span className={`transaction-status transaction-status--${tx.status}`}>
                      {getStatusText(tx.status)}
                    </span>
                  </div>
                </div>

                <div className={`transaction-amount ${tx.amount > 0 ? 'transaction-amount--positive' : 'transaction-amount--negative'}`}>
                  {tx.amount > 0 ? '+' : ''}{tx.amount} TON
                </div>
              </motion.div>
            ))}
          </div>
        ))}

        {filteredTransactions.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p>Нет транзакций</p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDetailModal && selectedTx && (
          <motion.div
            className="transaction-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleCloseDetail}
          >
            <motion.div
              className="transaction-modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>Детали транзакции</h3>
                <button className="modal-close" onClick={handleCloseDetail}>✕</button>
              </div>

              <div className="modal-body">
                <div className="detail-icon-large">
                  {getTransactionIcon(selectedTx)}
                </div>

                <div className={`detail-amount ${selectedTx.amount > 0 ? 'detail-amount--positive' : 'detail-amount--negative'}`}>
                  {selectedTx.amount > 0 ? '+' : ''}{selectedTx.amount} TON
                </div>

                <p className="detail-description">{selectedTx.description}</p>

                <div className="detail-info">
                  <div className="detail-row">
                    <span className="detail-label">Статус</span>
                    <span className={`detail-value detail-status--${selectedTx.status}`}>
                      {getStatusText(selectedTx.status)}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Дата и время</span>
                    <span className="detail-value">
                      {selectedTx.timestamp.toLocaleString('ru-RU')}
                    </span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Тип</span>
                    <span className="detail-value">{getTypeText(selectedTx.type)}</span>
                  </div>
                  {selectedTx.category && (
                    <div className="detail-row">
                      <span className="detail-label">Категория</span>
                      <span className="detail-value">{getCategoryText(selectedTx.category)}</span>
                    </div>
                  )}
                </div>

                <div className="hash-section">
                  <label>Хеш транзакции</label>
                  <div className="hash-box" onClick={() => copyHash(selectedTx.hash)}>
                    <span className="hash-text">{selectedTx.hash}</span>
                    <span className="hash-copy">📋</span>
                  </div>
                  <a
                    href={`https://tonscan.org/tx/${selectedTx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="explorer-link"
                  >
                    Посмотреть в Explorer →
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function groupByDate(transactions: Transaction[]): Record<string, Transaction[]> {
  const groups: Record<string, Transaction[]> = {};
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  transactions.forEach(tx => {
    const txDate = new Date(tx.timestamp);
    const txDay = new Date(txDate.getFullYear(), txDate.getMonth(), txDate.getDate());

    let group: string;
    if (txDay.getTime() === today.getTime()) {
      group = 'Сегодня';
    } else if (txDay.getTime() === yesterday.getTime()) {
      group = 'Вчера';
    } else if (txDay >= weekAgo) {
      group = 'Эта неделя';
    } else {
      group = txDay.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
    }

    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(tx);
  });

  return groups;
}

function getTransactionIcon(tx: Transaction): string {
  if (tx.type === 'processing') return '⏳';
  if (tx.category === 'win') return '🏆';
  if (tx.category === 'bonus') return '🎁';
  if (tx.category === 'purchase') return '🎫';
  if (tx.type === 'received') return '📥';
  return '📤';
}

function getStatusText(status: string): string {
  switch (status) {
    case 'completed': return 'Завершено';
    case 'pending': return 'В обработке';
    case 'failed': return 'Ошибка';
    default: return status;
  }
}

function getTypeText(type: string): string {
  switch (type) {
    case 'sent': return 'Отправлено';
    case 'received': return 'Получено';
    case 'processing': return 'В обработке';
    default: return type;
  }
}

function getCategoryText(category: string): string {
  switch (category) {
    case 'purchase': return 'Покупка';
    case 'win': return 'Выигрыш';
    case 'bonus': return 'Бонус';
    case 'refund': return 'Возврат';
    default: return category;
  }
}
