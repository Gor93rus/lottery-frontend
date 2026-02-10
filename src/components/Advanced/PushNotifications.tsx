import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '../../hooks/useHaptic';
import { 
  requestNotificationPermission, 
  showNotification, 
  scheduleNotification,
  clearScheduledNotification 
} from '../../utils/pwaUtils';
import './PushNotifications.css';

type NotificationType = 'draw' | 'win' | 'new_lottery' | 'streak' | 'daily_quest';

interface NotificationSettings {
  enabled: boolean;
  types: {
    draw: boolean;
    win: boolean;
    new_lottery: boolean;
    streak: boolean;
    daily_quest: boolean;
  };
  quietHours: {
    enabled: boolean;
    start: string;
    end: string;
  };
}

interface PushNotificationsProps {
  showModalOnMount?: boolean;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  enabled: false,
  types: {
    draw: true,
    win: true,
    new_lottery: true,
    streak: true,
    daily_quest: true
  },
  quietHours: {
    enabled: false,
    start: '22:00',
    end: '08:00'
  }
};

const NOTIFICATION_MESSAGES = {
  draw: {
    title: '⏰ Напоминание о розыгрыше',
    body: 'Розыгрыш TON Million начнется через 1 час!',
    icon: '🎰'
  },
  win: {
    title: '🎉 Поздравляем с выигрышем!',
    body: 'Вы выиграли 100 TON! Проверьте свой билет.',
    icon: '🏆'
  },
  new_lottery: {
    title: '🆕 Новая лотерея!',
    body: 'Mega Jackpot с призовым фондом 10,000 TON уже доступен!',
    icon: '💎'
  },
  streak: {
    title: '🔥 Внимание! Streak в опасности',
    body: 'Купите билет сегодня, чтобы сохранить серию в 7 дней!',
    icon: '⚠️'
  },
  daily_quest: {
    title: '✨ Ежедневное задание',
    body: 'Новые задания доступны! Заработайте 50 XP.',
    icon: '🎯'
  }
};

export const PushNotifications = ({ showModalOnMount = false }: PushNotificationsProps) => {
  const [showPermissionModal, setShowPermissionModal] = useState(showModalOnMount);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const { medium, light } = useHaptic();

  useEffect(() => {
    const saved = localStorage.getItem('notification_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }

    const firstPurchase = localStorage.getItem('first_purchase_made');
    const alreadyAsked = localStorage.getItem('notification_permission_asked');
    
    if (firstPurchase && !alreadyAsked && 'Notification' in window && Notification.permission === 'default') {
      setTimeout(() => {
        setShowPermissionModal(true);
      }, 1000);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('notification_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (!settings.enabled) return;

    const scheduledIds: number[] = [];

    if (settings.types.draw) {
      const id = scheduleNotification(
        NOTIFICATION_MESSAGES.draw.title,
        { body: NOTIFICATION_MESSAGES.draw.body },
        60000
      );
      scheduledIds.push(id);
    }

    if (settings.types.daily_quest) {
      const id = scheduleNotification(
        NOTIFICATION_MESSAGES.daily_quest.title,
        { body: NOTIFICATION_MESSAGES.daily_quest.body },
        120000
      );
      scheduledIds.push(id);
    }

    return () => {
      scheduledIds.forEach(id => clearScheduledNotification(id));
    };
  }, [settings]);

  const isQuietHours = (): boolean => {
    if (!settings.quietHours.enabled) return false;

    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const { start, end } = settings.quietHours;

    if (start < end) {
      return currentTime >= start && currentTime <= end;
    } else {
      return currentTime >= start || currentTime <= end;
    }
  };

  const handleEnableNotifications = async () => {
    medium();
    const perm = await requestNotificationPermission();
    
    if (perm === 'granted') {
      setSettings(prev => ({ ...prev, enabled: true }));
      setShowPermissionModal(false);
      localStorage.setItem('notification_permission_asked', 'true');
      
      void showNotification('🎉 Уведомления включены!', {
        body: 'Теперь вы не пропустите важные события',
        tag: 'notifications_enabled'
      });
    }
  };

  const handleDismissPermission = () => {
    light();
    setShowPermissionModal(false);
    localStorage.setItem('notification_permission_asked', 'true');
  };

  const handleToggleType = (type: NotificationType) => {
    light();
    setSettings(prev => ({
      ...prev,
      types: {
        ...prev.types,
        [type]: !prev.types[type]
      }
    }));
  };

  const handleToggleQuietHours = () => {
    light();
    setSettings(prev => ({
      ...prev,
      quietHours: {
        ...prev.quietHours,
        enabled: !prev.quietHours.enabled
      }
    }));
  };

  const sendTestNotification = async (type: NotificationType) => {
    if (!settings.enabled || isQuietHours()) return;
    
    medium();
    const msg = NOTIFICATION_MESSAGES[type];
    await showNotification(msg.title, { 
      body: msg.body,
      tag: `test_${type}`
    });
  };

  return (
    <>
      <button
        className="notification-settings-trigger"
        onClick={() => setShowSettingsModal(true)}
      >
        🔔
        {settings.enabled && <span className="notification-badge"></span>}
      </button>

      <AnimatePresence>
        {showPermissionModal && (
          <motion.div
            className="notification-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismissPermission}
          >
            <motion.div
              className="notification-modal-content"
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="notification-icon-large">🔔</div>
              
              <h2>Включить уведомления?</h2>
              
              <p className="notification-description">
                Получайте важные уведомления о:
              </p>

              <ul className="notification-features">
                <li>
                  <span className="feature-icon">⏰</span>
                  <span>Предстоящих розыгрышах</span>
                </li>
                <li>
                  <span className="feature-icon">🏆</span>
                  <span>Ваших выигрышах</span>
                </li>
                <li>
                  <span className="feature-icon">🆕</span>
                  <span>Новых лотереях</span>
                </li>
                <li>
                  <span className="feature-icon">🔥</span>
                  <span>Streak и заданиях</span>
                </li>
              </ul>

              <div className="notification-modal-actions">
                <button
                  className="notification-btn notification-btn--primary"
                  onClick={handleEnableNotifications}
                >
                  Включить
                </button>
                <button
                  className="notification-btn notification-btn--secondary"
                  onClick={handleDismissPermission}
                >
                  Не сейчас
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showSettingsModal && (
          <motion.div
            className="notification-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettingsModal(false)}
          >
            <motion.div
              className="notification-modal-content notification-settings-panel"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="settings-header">
                <h3>Настройки уведомлений</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowSettingsModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="settings-body">
                <div className="setting-item">
                  <div className="setting-info">
                    <h4>Уведомления</h4>
                    <p>Включить push-уведомления</p>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={settings.enabled}
                      onChange={(e) => setSettings(prev => ({ ...prev, enabled: e.target.checked }))}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>

                {settings.enabled && (
                  <>
                    <div className="settings-section">
                      <h4 className="section-title">Типы уведомлений</h4>
                      
                      {Object.entries(NOTIFICATION_MESSAGES).map(([type, msg]) => (
                        <div key={type} className="setting-item">
                          <div className="setting-info">
                            <div className="setting-label">
                              <span className="setting-icon">{msg.icon}</span>
                              <span>{msg.title}</span>
                            </div>
                            <p className="setting-description">{msg.body}</p>
                          </div>
                          <div className="setting-controls">
                            <label className="toggle-switch toggle-switch--small">
                              <input
                                type="checkbox"
                                checked={settings.types[type as NotificationType]}
                                onChange={() => handleToggleType(type as NotificationType)}
                              />
                              <span className="toggle-slider"></span>
                            </label>
                            <button
                              className="test-btn"
                              onClick={() => sendTestNotification(type as NotificationType)}
                              disabled={!settings.types[type as NotificationType]}
                            >
                              Test
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="settings-section">
                      <h4 className="section-title">Тихие часы</h4>
                      
                      <div className="setting-item">
                        <div className="setting-info">
                          <h4>Не беспокоить</h4>
                          <p>Не получать уведомления в указанное время</p>
                        </div>
                        <label className="toggle-switch">
                          <input
                            type="checkbox"
                            checked={settings.quietHours.enabled}
                            onChange={handleToggleQuietHours}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      {settings.quietHours.enabled && (
                        <div className="quiet-hours-inputs">
                          <div className="time-input-group">
                            <label>С</label>
                            <input
                              type="time"
                              value={settings.quietHours.start}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                quietHours: { ...prev.quietHours, start: e.target.value }
                              }))}
                            />
                          </div>
                          <div className="time-input-group">
                            <label>До</label>
                            <input
                              type="time"
                              value={settings.quietHours.end}
                              onChange={(e) => setSettings(prev => ({
                                ...prev,
                                quietHours: { ...prev.quietHours, end: e.target.value }
                              }))}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export const triggerFirstPurchaseNotification = () => {
  localStorage.setItem('first_purchase_made', 'true');
};
