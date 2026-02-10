import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dice6,
  Plus,
  Play,
  Trophy,
  Calendar,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { adminApiClient } from '../../lib/api/adminClient';
import type { Draw } from '../../types/api';
import type { WinnerInfo } from '../../lib/api/adminClient';
import './AdminDraws.css';

interface DrawWithExtras extends Draw {
  lotteryName?: string;
  drawDate?: string;
  winnersCount?: number;
  winners?: WinnerInfo[];
}

export default function AdminDraws() {
  const [draws, setDraws] = useState<DrawWithExtras[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedDrawId, setExpandedDrawId] = useState<string | null>(null);

  useEffect(() => {
    fetchDraws();
  }, []);

  const fetchDraws = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiClient.getDraws();
      if (response.success) {
        setDraws(response.draws);
      }
    } catch (err) {
      console.error('Failed to fetch draws:', err);
      setError('Не удалось загрузить розыгрыши');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDraw = () => {
    alert('Создание нового розыгрыша...\n\nЭта функция будет доступна в следующей версии.');
  };

  const handleExecuteDraw = async (draw: DrawWithExtras) => {
    if (!confirm(`Выполнить розыгрыш #${draw.id} для лотереи "${draw.lotteryName || 'Unknown'}"?`)) {
      return;
    }

    try {
      const response = await adminApiClient.executeDraw(Number(draw.id));
      if (response.success) {
        alert(`Розыгрыш выполнен успешно!\n\nВыигрышные номера: ${response.draw.winningNumbers?.join(', ') || 'N/A'}\nПобедители: ${response.winners.length}`);
        fetchDraws();
      }
    } catch (err) {
      console.error('Failed to execute draw:', err);
      alert('Не удалось выполнить розыгрыш');
    }
  };

  const toggleDrawDetails = (drawId: string) => {
    setExpandedDrawId(expandedDrawId === drawId ? null : drawId);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return '#df600c';
      case 'completed':
        return '#10b981';
      case 'cancelled':
        return '#ef4444';
      default:
        return '#9e0ac7';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'Запланирован';
      case 'completed':
        return 'Завершен';
      case 'cancelled':
        return 'Отменен';
      default:
        return status;
    }
  };

  return (
    <AdminLayout>
      <div className="admin-draws">
        {/* Header */}
        <div className="page-header">
          <div className="header-title">
            <Dice6 size={28} />
            <h1>Управление розыгрышами</h1>
          </div>
          <button className="create-btn" onClick={handleCreateDraw}>
            <Plus size={20} />
            Создать розыгрыш
          </button>
        </div>

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
            <p>Загрузка розыгрышей...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="admin-error">
            <p>{error}</p>
            <button onClick={fetchDraws} className="retry-btn">
              Повторить попытку
            </button>
          </div>
        )}

        {/* Draws Table */}
        {!loading && !error && draws.length > 0 && (
          <motion.div
            className="draws-table-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <table className="draws-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Лотерея</th>
                  <th>Дата розыгрыша</th>
                  <th>Статус</th>
                  <th>Победители</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {draws.map((draw, index) => (
                  <React.Fragment key={draw.id}>
                    <motion.tr
                      className="draw-row"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <td>
                        <span className="draw-id">#{draw.id}</span>
                      </td>
                      <td>
                        <div className="lottery-info">
                          <Trophy size={16} />
                          <span>{draw.lotteryName || 'Unknown'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          <Calendar size={16} />
                          <span>{formatDate(draw.drawDate || draw.scheduledAt)}</span>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ 
                            background: `${getStatusColor(draw.status)}20`,
                            color: getStatusColor(draw.status),
                            border: `1px solid ${getStatusColor(draw.status)}40`
                          }}
                        >
                          {getStatusLabel(draw.status)}
                        </span>
                      </td>
                      <td>
                        <span className="winners-count">
                          {draw.status === 'completed' ? draw.winnersCount || 0 : '—'}
                        </span>
                      </td>
                      <td>
                        <div className="draw-actions">
                          {draw.status === 'pending' && (
                            <button
                              className="execute-btn"
                              onClick={() => handleExecuteDraw(draw)}
                            >
                              <Play size={16} />
                              Выполнить
                            </button>
                          )}
                          {draw.status === 'completed' && (
                            <button
                              className="details-btn"
                              onClick={() => toggleDrawDetails(draw.id)}
                            >
                              {expandedDrawId === draw.id ? (
                                <>
                                  <ChevronUp size={16} />
                                  Свернуть
                                </>
                              ) : (
                                <>
                                  <ChevronDown size={16} />
                                  Детали
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                    {expandedDrawId === draw.id && draw.status === 'completed' && (
                      <motion.tr
                        className="draw-details-row"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        <td colSpan={6}>
                          <div className="draw-details">
                            <div className="details-section">
                              <h4>Выигрышные номера</h4>
                              <div className="winning-numbers">
                                {draw.winningNumbers?.map((num, idx) => (
                                  <div key={idx} className="number-ball">
                                    {num}
                                  </div>
                                ))}
                              </div>
                            </div>
                            {draw.winners && draw.winners.length > 0 && (
                              <div className="details-section">
                                <h4>Победители ({draw.winners.length})</h4>
                                <div className="winners-list">
                                  {draw.winners.map((winner: WinnerInfo, idx: number) => (
                                    <div key={idx} className="winner-item">
                                      <span className="winner-name">{winner.userId}</span>
                                      <span className="winner-prize">{winner.prize} TON</span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && draws.length === 0 && (
          <div className="empty-state">
            <Dice6 size={48} />
            <p>Розыгрыши не найдены</p>
            <button className="create-btn" onClick={handleCreateDraw}>
              <Plus size={20} />
              Создать первый розыгрыш
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
