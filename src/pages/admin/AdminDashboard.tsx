import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Ticket,
  DollarSign,
  Trophy,
  TrendingUp,
  Activity,
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { adminApiClient } from '../../lib/api/adminClient';
import type { AdminStats } from '../../types/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiClient.getStats();
      if (response.success) {
        setStats(response.stats);
      }
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setError('Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Всего пользователей',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: '#df600c',
      bgGradient: 'linear-gradient(135deg, rgba(223, 96, 12, 0.2) 0%, rgba(223, 96, 12, 0.05) 100%)',
    },
    {
      title: 'Продано билетов',
      value: stats?.totalTickets || 0,
      icon: Ticket,
      color: '#f45da6',
      bgGradient: 'linear-gradient(135deg, rgba(244, 93, 166, 0.2) 0%, rgba(244, 93, 166, 0.05) 100%)',
    },
    {
      title: 'Общая выручка (TON)',
      value: stats?.totalRevenue?.toFixed(2) || '0.00',
      icon: DollarSign,
      color: '#10b981',
      bgGradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)',
    },
    {
      title: 'Активных лотерей',
      value: stats?.activeDraws || 0,
      icon: Trophy,
      color: '#9e0ac7',
      bgGradient: 'linear-gradient(135deg, rgba(158, 10, 199, 0.2) 0%, rgba(158, 10, 199, 0.05) 100%)',
    },
  ];

  return (
    <AdminLayout>
      <div className="admin-dashboard">
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
            <p>Загрузка статистики...</p>
          </div>
        )}

        {error && (
          <div className="admin-error">
            <p>{error}</p>
            <button onClick={fetchStats} className="retry-btn">
              Повторить попытку
            </button>
          </div>
        )}

        {!loading && !error && stats && (
          <>
            {/* Stats Cards */}
            <div className="stats-grid">
              {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                  <motion.div
                    key={card.title}
                    className="stat-card"
                    style={{ background: card.bgGradient }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="stat-card-header">
                      <div
                        className="stat-icon"
                        style={{ background: `${card.color}20`, color: card.color }}
                      >
                        <Icon size={24} />
                      </div>
                      <TrendingUp
                        size={16}
                        className="stat-trend"
                        style={{ color: card.color }}
                      />
                    </div>
                    <div className="stat-card-body">
                      <h3 className="stat-value">{card.value}</h3>
                      <p className="stat-title">{card.title}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Recent Activity - Currently not available in API */}
            {/* <motion.div
              className="activity-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="section-header">
                <h2 className="section-title">Последняя активность</h2>
                <Activity size={20} />
              </div>
              <div className="activity-list">
                <div className="no-activity">
                  <p>Нет последней активности</p>
                </div>
              </div>
            </motion.div> */}

            {/* Quick Actions */}
            <motion.div
              className="quick-actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h2 className="section-title">Быстрые действия</h2>
              <div className="actions-grid">
                <button className="action-btn action-primary">
                  <Trophy size={20} />
                  <span>Создать лотерею</span>
                </button>
                <button className="action-btn action-secondary">
                  <Ticket size={20} />
                  <span>Новый розыгрыш</span>
                </button>
                <button className="action-btn action-tertiary">
                  <Users size={20} />
                  <span>Управление пользователями</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
