interface Props {
  count: number;
  onClick: () => void;
}

export default function NotificationBadge({ count, onClick }: Props) {
  return (
    <button 
      className="notification-badge"
      onClick={onClick}
      aria-label={`Notifications${count > 0 ? ` (${count} unread)` : ''}`}
    >
      <span className="bell-icon">🔔</span>
      {count > 0 && (
        <span className="badge-count">{count > 99 ? '99+' : count}</span>
      )}
    </button>
  );
}
