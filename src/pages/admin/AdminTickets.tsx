import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Ticket,
  Search,
  Filter,
  Activity,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { adminApiClient } from '../../lib/api/adminClient';
import type { Lottery } from '../../types/api';
import './AdminTickets.css';

interface TicketData {
  id: string;
  ticketId: string;
  userId?: string;
  username?: string;
  lotteryId?: string;
  lotteryName?: string;
  numbers: number[];
  status: 'active' | 'won' | 'lost' | 'pending';
  prize?: number;
  purchaseDate: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminTickets() {
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'active' | 'won' | 'lost' | ''>('');
  const [selectedLottery, setSelectedLottery] = useState<string>('');
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchLotteries();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [pagination.page, pagination.limit, searchQuery, statusFilter, selectedLottery]);

  const fetchLotteries = async () => {
    try {
      const response = await adminApiClient.getLotteries();
      if (response.success) {
        setLotteries(response.lotteries);
      }
    } catch (err) {
      console.error('Failed to fetch lotteries:', err);
    }
  };

  const VALID_STATUSES = new Set(['active', 'won', 'lost']);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiClient.getTickets({
        page: pagination.page,
        limit: pagination.limit,
        ticketId: searchQuery || undefined,
        status: VALID_STATUSES.has(statusFilter) ? statusFilter as 'active' | 'won' | 'lost' : undefined,
        lotteryId: selectedLottery ? parseInt(selectedLottery) : undefined,
      });
      
      if (response.success) {
        // Map ApiTicket to TicketData
        const mappedTickets = response.tickets.map(ticket => ({
          id: ticket.id,
          ticketId: ticket.ticketNumber || ticket.id,
          userId: ticket.userId,
          username: 'User', // API doesn't provide username, we'll display generic text
          lotteryId: ticket.lotteryId,
          lotteryName: ticket.lotterySlug || 'Lottery',
          numbers: ticket.numbers,
          status: ticket.status as 'active' | 'won' | 'lost' | 'pending',
          prize: ticket.prizeAmount,
          purchaseDate: ticket.purchasedAt,
        } as TicketData));
        setTickets(mappedTickets);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch tickets:', err);
      setError('Не удалось загрузить билеты');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return '#df600c';
      case 'won':
        return '#10b981';
      case 'lost':
        return '#ef4444';
      default:
        return '#9e0ac7';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active':
        return 'Активный';
      case 'won':
        return 'Выигрыш';
      case 'lost':
        return 'Проигрыш';
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="admin-tickets">
        {/* Header */}
        <div className="page-header">
          <div className="header-title">
            <Ticket size={28} />
            <h1>Управление билетами</h1>
          </div>
          <div className="header-stats">
            <span>Всего: {pagination.total}</span>
          </div>
        </div>

        {/* Status Tabs */}
        <motion.div
          className="status-tabs"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <button
            className={`status-tab ${statusFilter === '' ? 'active' : ''}`}
            onClick={() => setStatusFilter('')}
          >
            Все билеты
          </button>
          <button
            className={`status-tab ${statusFilter === 'active' ? 'active' : ''}`}
            onClick={() => setStatusFilter('active')}
          >
            Активные
          </button>
          <button
            className={`status-tab ${statusFilter === 'won' ? 'active' : ''}`}
            onClick={() => setStatusFilter('won')}
          >
            Выигрышные
          </button>
          <button
            className={`status-tab ${statusFilter === 'lost' ? 'active' : ''}`}
            onClick={() => setStatusFilter('lost')}
          >
            Проигрышные
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          className="filters-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Поиск по ID билета..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Filter size={20} />
            <select
              value={selectedLottery}
              onChange={(e) => setSelectedLottery(e.target.value)}
            >
              <option value="">Все лотереи</option>
              {lotteries.map((lottery) => (
                <option key={lottery.id} value={lottery.id}>
                  {lottery.name}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="admin-loading">
            <motion.div
              className="loading-spinner"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Activity size={32} />
            </motion.div>
            <p>Загрузка билетов...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="admin-error">
            <p>{error}</p>
            <button onClick={fetchTickets} className="retry-btn">
              Повторить попытку
            </button>
          </div>
        )}

        {/* Tickets Table */}
        {!loading && !error && tickets.length > 0 && (
          <>
            <motion.div
              className="tickets-table-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <table className="tickets-table">
                <thead>
                  <tr>
                    <th>ID билета</th>
                    <th>Пользователь</th>
                    <th>Лотерея</th>
                    <th>Номера</th>
                    <th>Статус</th>
                    <th>Приз (TON)</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket, index) => (
                    <motion.tr
                      key={ticket.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="ticket-row"
                    >
                      <td>
                        <span className="ticket-id">{ticket.ticketId}</span>
                      </td>
                      <td>
                        <span className="username">{ticket.username}</span>
                      </td>
                      <td>
                        <div className="lottery-info">
                          <Trophy size={16} />
                          <span>{ticket.lotteryName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="ticket-numbers">
                          {ticket.numbers.map((num, idx) => (
                            <span key={idx} className="number-badge">
                              {num}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>
                        <span
                          className="status-badge"
                          style={{
                            background: `${getStatusColor(ticket.status)}20`,
                            color: getStatusColor(ticket.status),
                            border: `1px solid ${getStatusColor(ticket.status)}40`,
                          }}
                        >
                          {getStatusLabel(ticket.status)}
                        </span>
                      </td>
                      <td>
                        {ticket.status === 'won' && ticket.prize ? (
                          <span className="prize-amount">{ticket.prize.toFixed(2)}</span>
                        ) : (
                          <span className="no-prize">—</span>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </motion.div>

            {/* Pagination */}
            <motion.div
              className="pagination"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
              >
                <ChevronLeft size={20} />
                Назад
              </button>
              
              <div className="pagination-info">
                Страница {pagination.page} из {pagination.totalPages}
              </div>
              
              <button
                className="pagination-btn"
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
              >
                Вперед
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </>
        )}

        {/* Empty State */}
        {!loading && !error && tickets.length === 0 && (
          <div className="empty-state">
            <Ticket size={48} />
            <p>Билеты не найдены</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
