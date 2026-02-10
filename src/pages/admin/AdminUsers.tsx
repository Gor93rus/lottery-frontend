import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Filter,
  Activity,
  Wallet,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { adminApiClient } from '../../lib/api/adminClient';
import type { User as ApiUser } from '../../types/api';
import './AdminUsers.css';

interface User extends ApiUser {
  ticketsCount?: number;
  avatarUrl?: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('');
  const [walletFilter, setWalletFilter] = useState<string>('');
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  useEffect(() => {
    fetchUsers();
  }, [pagination.page, pagination.limit, searchQuery, levelFilter, walletFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiClient.getUsers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        level: levelFilter || undefined,
        walletConnected: walletFilter === 'connected' ? true : walletFilter === 'not-connected' ? false : undefined,
      });
      
      if (response.success) {
        // Map API users to local User type with ticketsCount
        const mappedUsers = response.users.map(user => ({
          ...user,
          ticketsCount: user.totalTickets || 0,
          avatarUrl: user.photoUrl,
          username: user.username || user.firstName || '',
          telegramId: user.telegramId || '',
        } as User));
        setUsers(mappedUsers);
        setPagination(response.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
      setError('Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user: User) => {
    alert(`Детали пользователя:\n\nID: ${user.id}\nИмя: ${user.username}\nTelegram ID: ${user.telegramId}\nКошелек: ${user.walletAddress || 'Не подключен'}\nБаланс: ${user.balance} TON\nУровень: ${user.level || 'N/A'}\nБилеты: ${user.ticketsCount || 0}`);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  return (
    <AdminLayout>
      <div className="admin-users">
        {/* Header */}
        <div className="page-header">
          <div className="header-title">
            <Users size={28} />
            <h1>Управление пользователями</h1>
          </div>
          <div className="header-stats">
            <span>Всего: {pagination.total}</span>
          </div>
        </div>

        {/* Filters */}
        <motion.div
          className="filters-section"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Поиск по имени или Telegram ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <Filter size={20} />
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              <option value="">Все уровни</option>
              <option value="1">Уровень 1</option>
              <option value="2">Уровень 2</option>
              <option value="3">Уровень 3</option>
              <option value="4">Уровень 4</option>
              <option value="5">Уровень 5</option>
            </select>

            <select
              value={walletFilter}
              onChange={(e) => setWalletFilter(e.target.value)}
            >
              <option value="">Все кошельки</option>
              <option value="connected">С кошельком</option>
              <option value="not-connected">Без кошелька</option>
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
            <p>Загрузка пользователей...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="admin-error">
            <p>{error}</p>
            <button onClick={fetchUsers} className="retry-btn">
              Повторить попытку
            </button>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && users.length > 0 && (
          <>
            <motion.div
              className="users-table-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Пользователь</th>
                    <th>Telegram ID</th>
                    <th>Кошелек</th>
                    <th>Баланс (TON)</th>
                    <th>Уровень</th>
                    <th>Билеты</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleUserClick(user)}
                      className="user-row"
                    >
                      <td>
                        <div className="user-info">
                          <div className="user-avatar">
                            {user.avatarUrl ? (
                              <img src={user.avatarUrl || ''} alt={user.username} />
                            ) : (
                              <Users size={20} />
                            )}
                          </div>
                          <span className="user-name">{user.username}</span>
                        </div>
                      </td>
                      <td>
                        <span className="telegram-id">{user.telegramId}</span>
                      </td>
                      <td>
                        <div className="wallet-info">
                          {user.walletAddress ? (
                            <>
                              <Wallet size={16} className="wallet-icon connected" />
                              <span className="wallet-address">
                                {user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)}
                              </span>
                            </>
                          ) : (
                            <span className="wallet-not-connected">Не подключен</span>
                          )}
                        </div>
                      </td>
                      <td>
                        <span className="balance">{user.balance.toFixed(2)}</span>
                      </td>
                      <td>
                        <span className={`level-badge level-${user.level || 1}`}>
                          Уровень {user.level || 1}
                        </span>
                      </td>
                      <td>
                        <span className="tickets-count">{user.ticketsCount || 0}</span>
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
        {!loading && !error && users.length === 0 && (
          <div className="empty-state">
            <Users size={48} />
            <p>Пользователи не найдены</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
