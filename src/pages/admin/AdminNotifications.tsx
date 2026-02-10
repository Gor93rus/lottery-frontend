import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  Send,
  Activity,
  CheckCircle,
  AlertCircle,
  Users,
  User,
} from 'lucide-react';
import AdminLayout from '../../components/Admin/AdminLayout';
import { adminApiClient } from '../../lib/api/adminClient';
import './AdminNotifications.css';

interface NotificationHistory {
  id: string;
  message: string;
  recipient?: string;
  recipientType: 'all' | 'user';
  status: 'sent' | 'failed';
  createdAt: string;
}

const notificationTemplates = [
  { id: 1, label: 'Новый розыгрыш', message: '🎉 Внимание! Скоро состоится новый розыгрыш! Успейте купить билеты!' },
  { id: 2, label: 'Победитель определен', message: '🏆 Розыгрыш завершен! Проверьте свои билеты - возможно, вы стали победителем!' },
  { id: 3, label: 'Увеличение джекпота', message: '💰 Джекпот увеличился! Не упустите шанс выиграть крупную сумму!' },
  { id: 4, label: 'Напоминание', message: '⏰ Не забудьте проверить свои билеты! Розыгрыш состоится совсем скоро!' },
  { id: 5, label: 'Новая лотерея', message: '🎲 Новая лотерея доступна! Попробуйте свою удачу!' },
];

export default function AdminNotifications() {
  const [recipientType, setRecipientType] = useState<'all' | 'user'>('all');
  const [userId, setUserId] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<NotificationHistory[]>([]);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminApiClient.getNotifications({ limit: 20 });
      if (response.success) {
        // Cast NotificationData to NotificationHistory with proper mapping
        const mapped = response.notifications.map(notif => ({
          id: notif.id,
          message: notif.message,
          recipient: notif.userId?.toString() || undefined,
          recipientType: notif.broadcast ? 'all' as const : 'user' as const,
          status: notif.status === 'sent' ? 'sent' as const : 'failed' as const,
          createdAt: notif.createdAt,
        }));
        setNotifications(mapped);
      }
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
      setError('Не удалось загрузить историю уведомлений');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (template: typeof notificationTemplates[0]) => {
    setMessage(template.message);
  };

  const handleSendNotification = async () => {
    if (!message.trim()) {
      setError('Пожалуйста, введите сообщение');
      return;
    }

    if (recipientType === 'user') {
      const userIdNum = parseInt(userId);
      if (!userId.trim() || isNaN(userIdNum) || userIdNum <= 0) {
        setError('Пожалуйста, введите корректный ID пользователя');
        return;
      }
    }

    try {
      setSending(true);
      setError(null);
      setSuccess(null);

      const response = await adminApiClient.sendNotification({
        message: message.trim(),
        broadcast: recipientType === 'all',
        userId: recipientType === 'user' ? parseInt(userId) : undefined,
      });

      if (response.success) {
        setSuccess(
          recipientType === 'all'
            ? 'Уведомление успешно отправлено всем пользователям'
            : `Уведомление успешно отправлено пользователю #${userId}`
        );
        setMessage('');
        setUserId('');
        fetchNotifications();
      }
    } catch (err) {
      console.error('Failed to send notification:', err);
      setError('Не удалось отправить уведомление');
    } finally {
      setSending(false);
    }
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
      <div className="admin-notifications">
        {/* Header */}
        <div className="page-header">
          <div className="header-title">
            <Bell size={28} />
            <h1>Управление уведомлениями</h1>
          </div>
        </div>

        <div className="notifications-layout">
          {/* Send Notification Form */}
          <motion.div
            className="notification-form-section"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="section-card">
              <h2 className="section-title">Отправить уведомление</h2>

              {/* Recipient Type */}
              <div className="form-group">
                <label className="form-label">Получатели</label>
                <div className="recipient-options">
                  <button
                    className={`recipient-btn ${recipientType === 'all' ? 'active' : ''}`}
                    onClick={() => setRecipientType('all')}
                  >
                    <Users size={20} />
                    <span>Всем пользователям</span>
                  </button>
                  <button
                    className={`recipient-btn ${recipientType === 'user' ? 'active' : ''}`}
                    onClick={() => setRecipientType('user')}
                  >
                    <User size={20} />
                    <span>Конкретному пользователю</span>
                  </button>
                </div>
              </div>

              {/* User ID Input */}
              {recipientType === 'user' && (
                <motion.div
                  className="form-group"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                >
                  <label className="form-label" htmlFor="userId">
                    ID пользователя
                  </label>
                  <input
                    id="userId"
                    type="number"
                    className="form-input"
                    placeholder="Введите ID пользователя..."
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </motion.div>
              )}

              {/* Templates */}
              <div className="form-group">
                <label className="form-label">Шаблоны сообщений</label>
                <div className="templates-grid">
                  {notificationTemplates.map((template) => (
                    <button
                      key={template.id}
                      className="template-btn"
                      onClick={() => handleTemplateSelect(template)}
                    >
                      {template.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div className="form-group">
                <label className="form-label" htmlFor="message">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  className="form-textarea"
                  placeholder="Введите текст уведомления..."
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <div className="character-count">
                  {message.length} символов
                </div>
              </div>

              {/* Success Message */}
              {success && (
                <motion.div
                  className="success-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <CheckCircle size={20} />
                  <span>{success}</span>
                </motion.div>
              )}

              {/* Error Message */}
              {error && (
                <motion.div
                  className="error-message"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <AlertCircle size={20} />
                  <span>{error}</span>
                </motion.div>
              )}

              {/* Send Button */}
              <button
                className="send-btn"
                onClick={handleSendNotification}
                disabled={sending}
              >
                {sending ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: 'linear',
                      }}
                    >
                      <Activity size={20} />
                    </motion.div>
                    Отправка...
                  </>
                ) : (
                  <>
                    <Send size={20} />
                    Отправить уведомление
                  </>
                )}
              </button>
            </div>
          </motion.div>

          {/* Notification History */}
          <motion.div
            className="notification-history-section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="section-card">
              <h2 className="section-title">История уведомлений</h2>

              {loading && (
                <div className="history-loading">
                  <motion.div
                    className="loading-spinner"
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: 'linear',
                    }}
                  >
                    <Activity size={24} />
                  </motion.div>
                  <p>Загрузка...</p>
                </div>
              )}

              {!loading && notifications.length > 0 && (
                <div className="history-list">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      className="history-item"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="history-item-header">
                        <div className="history-date">
                          {formatDate(notification.createdAt)}
                        </div>
                        <div className={`history-status ${notification.status}`}>
                          {notification.status === 'sent' ? (
                            <>
                              <CheckCircle size={14} />
                              Отправлено
                            </>
                          ) : (
                            <>
                              <AlertCircle size={14} />
                              Ошибка
                            </>
                          )}
                        </div>
                      </div>
                      <div className="history-message">{notification.message}</div>
                      <div className="history-recipient">
                        {notification.recipientType === 'all' ? (
                          <>
                            <Users size={14} />
                            Всем пользователям
                          </>
                        ) : (
                          <>
                            <User size={14} />
                            {notification.recipient}
                          </>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div className="history-empty">
                  <Bell size={48} />
                  <p>История уведомлений пуста</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
}
