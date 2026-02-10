import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Plus,
  Edit,
  Power,
  DollarSign,
  Calendar,
  Activity,
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { adminApiClient } from '../../lib/api/adminClient';
import type { Lottery } from '../../types/api';
import './AdminLotteries.css';

export default function AdminLotteries() {
  const [lotteries, setLotteries] = useState<Lottery[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLotteries();
  }, []);

  const fetchLotteries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiClient.getLotteries();
      if (response.success) {
        setLotteries(response.lotteries);
      }
    } catch (err) {
      console.error('Failed to fetch lotteries:', err);
      setError('Не удалось загрузить лотереи');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleLottery = async (lottery: Lottery) => {
    try {
      const response = await adminApiClient.updateLottery(parseInt(lottery.id), {
        active: !lottery.active,
      });
      
      if (response.success) {
        setLotteries(prev => 
          prev.map(l => 
            l.id === lottery.id ? { ...l, active: !l.active } : l
          )
        );
      }
    } catch (err) {
      console.error('Failed to toggle lottery:', err);
      alert('Не удалось изменить статус лотереи');
    }
  };

  const handleEditLottery = (lottery: Lottery) => {
    alert(`Редактирование лотереи:\n\nID: ${lottery.id}\nНазвание: ${lottery.name}\nЦена билета: ${lottery.ticketPrice} TON\nДжекпот: ${lottery.currentJackpot} TON\nСледующий розыгрыш: ${new Date(lottery.drawDate).toLocaleString('ru-RU')}`);
  };

  const handleCreateLottery = () => {
    alert('Создание новой лотереи...\n\nЭта функция будет доступна в следующей версии.');
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

  return (
    <AdminLayout>
      <div className="admin-lotteries">
        {/* Header */}
        <div className="page-header">
          <div className="header-title">
            <Trophy size={28} />
            <h1>Управление лотереями</h1>
          </div>
          <button className="create-btn" onClick={handleCreateLottery}>
            <Plus size={20} />
            Создать лотерею
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
            <p>Загрузка лотерей...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="admin-error">
            <p>{error}</p>
            <button onClick={fetchLotteries} className="retry-btn">
              Повторить попытку
            </button>
          </div>
        )}

        {/* Lotteries Grid */}
        {!loading && !error && lotteries.length > 0 && (
          <motion.div
            className="lotteries-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {lotteries.map((lottery, index) => (
              <motion.div
                key={lottery.id}
                className={`lottery-card ${lottery.active ? 'active' : 'inactive'}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="lottery-card-header">
                  <div className="lottery-icon">
                    <Trophy size={24} />
                  </div>
                  <div className={`lottery-status ${lottery.active ? 'active' : 'inactive'}`}>
                    {lottery.active ? 'Активна' : 'Неактивна'}
                  </div>
                </div>

                <div className="lottery-card-body">
                  <h3 className="lottery-name">{lottery.name}</h3>
                  <p className="lottery-description">{lottery.description}</p>

                  <div className="lottery-info">
                    <div className="info-item">
                      <DollarSign size={16} />
                      <div className="info-content">
                        <span className="info-label">Цена билета</span>
                        <span className="info-value">{lottery.ticketPrice} TON</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <Trophy size={16} className="icon-jackpot" />
                      <div className="info-content">
                        <span className="info-label">Джекпот</span>
                        <span className="info-value jackpot">{lottery.currentJackpot} TON</span>
                      </div>
                    </div>

                    <div className="info-item">
                      <Calendar size={16} />
                      <div className="info-content">
                        <span className="info-label">Следующий розыгрыш</span>
                        <span className="info-value">{formatDate(lottery.drawDate)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="lottery-numbers">
                    Выбрать {lottery.numbersToSelect} из {lottery.numbersPool} чисел
                  </div>
                </div>

                <div className="lottery-card-footer">
                  <button
                    className="edit-btn"
                    onClick={() => handleEditLottery(lottery)}
                  >
                    <Edit size={16} />
                    Редактировать
                  </button>
                  <button
                    className={`toggle-btn ${lottery.active ? 'active' : 'inactive'}`}
                    onClick={() => handleToggleLottery(lottery)}
                  >
                    <Power size={16} />
                    {lottery.active ? 'Отключить' : 'Включить'}
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && lotteries.length === 0 && (
          <div className="empty-state">
            <Trophy size={48} />
            <p>Лотереи не найдены</p>
            <button className="create-btn" onClick={handleCreateLottery}>
              <Plus size={20} />
              Создать первую лотерею
            </button>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
