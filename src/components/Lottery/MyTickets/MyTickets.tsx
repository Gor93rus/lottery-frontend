import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { lotteryClient, type Ticket } from '../../../lib/api/lotteryClient';
import './MyTickets.css';

interface MyTicketsProps {
  lotterySlug: string;
  refreshTrigger?: number;
}

export default function MyTickets({ lotterySlug, refreshTrigger }: MyTicketsProps) {
  const { t, i18n } = useTranslation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await lotteryClient.getMyTickets(lotterySlug);
      setTickets(response.tickets);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('ticketsLoadError', { defaultValue: 'Ошибка загрузки билетов' }));
    } finally {
      setIsLoading(false);
    }
  }, [lotterySlug, t]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets, refreshTrigger]);

  if (isLoading) {
    return (
      <div className="my-tickets-container">
        <h2 className="tickets-title">
          🎫 {t('myTickets', { defaultValue: 'Мои билеты' })}
        </h2>
        <div className="tickets-loading">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ticket-skeleton" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-tickets-container">
        <h2 className="tickets-title">
          🎫 {t('myTickets', { defaultValue: 'Мои билеты' })}
        </h2>
        <div className="tickets-error">
          ⚠️ {error}
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="my-tickets-container">
        <h2 className="tickets-title">
          🎫 {t('myTickets', { defaultValue: 'Мои билеты' })}
        </h2>
        <div className="tickets-empty">
          <div className="empty-icon">🎟️</div>
          <p className="empty-text">
            {t('noTickets', { defaultValue: 'У вас пока нет билетов' })}
          </p>
        </div>
      </div>
    );
  }

  const getStatusBadge = (status: Ticket['status']) => {
    const badges = {
      active: { text: t('active', { defaultValue: 'Активен' }), class: 'status-active' },
      pending: { text: t('pending', { defaultValue: 'Ожидание' }), class: 'status-pending' },
      won: { text: t('won', { defaultValue: 'Выигрыш' }), class: 'status-won' },
      lost: { text: t('lost', { defaultValue: 'Проигрыш' }), class: 'status-lost' }
    };
    return badges[status] || badges.active;
  };

  return (
    <div className="my-tickets-container">
      <h2 className="tickets-title">
        🎫 {t('myTickets', { defaultValue: 'Мои билеты' })} ({tickets.length})
      </h2>

      <div className="tickets-grid">
        {tickets.map((ticket) => {
          const statusBadge = getStatusBadge(ticket.status);
          
          return (
            <div key={ticket.id} className="ticket-item">
              <div className="ticket-item-header">
                {ticket.ticketNumber && (
                  <span className="ticket-number">#{ticket.ticketNumber}</span>
                )}
                <span className={`ticket-status ${statusBadge.class}`}>
                  {statusBadge.text}
                </span>
              </div>

              <div className="ticket-item-numbers">
                {ticket.numbers.map((num, idx) => (
                  <div key={idx} className="ticket-item-ball">
                    {num}
                  </div>
                ))}
              </div>

              <div className="ticket-item-details">
                <div className="ticket-detail">
                  <span className="detail-label">
                    {t('purchased', { defaultValue: 'Куплен' })}
                  </span>
                  <span className="detail-value">
                    {new Date(ticket.purchasedAt).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'ru-RU', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>

                {ticket.drawDate && (
                  <div className="ticket-detail">
                    <span className="detail-label">
                      {t('draw', { defaultValue: 'Розыгрыш' })}
                    </span>
                    <span className="detail-value">
                      {new Date(ticket.drawDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                )}

                {ticket.prizeAmount && ticket.prizeAmount > 0 && (
                  <div className="ticket-detail prize-detail">
                    <span className="detail-label">
                      {t('prize', { defaultValue: 'Приз' })}
                    </span>
                    <span className="detail-value prize-value">
                      🏆 {ticket.prizeAmount} TON
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
