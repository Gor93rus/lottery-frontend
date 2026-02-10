import { useNavigate } from 'react-router-dom';
import type { Notification } from '../../types/notification';
import { NOTIFICATION_CONFIG } from '../../types/notification';
import { notificationService } from '../../services/notificationService';

interface Props {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function NotificationItem({ notification, onMarkAsRead, onDelete }: Props) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (!notification.read) {
      onMarkAsRead(notification.id);
    }
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(notification.id);
  };

  const config = NOTIFICATION_CONFIG[notification.type];

  return (
    <div 
      className={`notification-item ${notification.read ? 'read' : 'unread'} ${notification.type}`}
      onClick={handleClick}
      style={{ backgroundImage: config.bgGradient }}
    >
      <div className="notification-icon" style={{ color: config.color }}>
        {config.icon}
      </div>
      
      <div className="notification-content">
        <div className="notification-header">
          <h4 className="notification-title">{notification.title}</h4>
          <span className="notification-time">
            {notificationService.formatTimestamp(notification.timestamp)}
          </span>
        </div>
        <p className="notification-message">{notification.message}</p>
        
        {notification.metadata && (
          <div className="notification-metadata">
            {notification.metadata.amount && (
              <span className="metadata-item">
                {notification.metadata.amount} {notification.metadata.currency}
              </span>
            )}
            {notification.metadata.lotteryName && (
              <span className="metadata-item">
                {notification.metadata.lotteryName}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="notification-actions">
        {!notification.read && (
          <button
            className="action-btn mark-read"
            onClick={(e) => {
              e.stopPropagation();
              onMarkAsRead(notification.id);
            }}
            aria-label="Mark as read"
          >
            ✓
          </button>
        )}
        <button
          className="action-btn delete"
          onClick={handleDelete}
          aria-label="Delete notification"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
