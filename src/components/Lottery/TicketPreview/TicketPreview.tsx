import { useTranslation } from 'react-i18next';
import './TicketPreview.css';

interface TicketPreviewProps {
  lotteryName: string;
  selectedNumbers: number[];
  ticketPrice: number;
  drawDate?: string;
  onEdit?: () => void;
}

export default function TicketPreview({
  lotteryName,
  selectedNumbers,
  ticketPrice,
  drawDate,
  onEdit
}: TicketPreviewProps) {
  const { t, i18n } = useTranslation();

  if (selectedNumbers.length === 0) {
    return null;
  }

  return (
    <div className="ticket-preview-container">
      <div className="ticket-card">
        <div className="ticket-header">
          <div className="lottery-logo">🎰</div>
          <div className="lottery-info">
            <h3 className="lottery-name">{lotteryName}</h3>
            <p className="ticket-format">5 из 36</p>
          </div>
        </div>

        <div className="ticket-divider"></div>

        <div className="ticket-numbers">
          <label className="numbers-label">
            {t('yourNumbers', { defaultValue: 'Ваши числа' })}
          </label>
          <div className="numbers-display">
            {selectedNumbers.map((num) => (
              <div key={num} className="ticket-ball">
                {num}
              </div>
            ))}
          </div>
        </div>

        <div className="ticket-details">
          <div className="detail-row">
            <span className="detail-label">
              {t('price', { defaultValue: 'Цена' })}
            </span>
            <span className="detail-value price-value">{ticketPrice} TON</span>
          </div>
          {drawDate && (
            <div className="detail-row">
              <span className="detail-label">
                {t('drawDate', { defaultValue: 'Дата розыгрыша' })}
              </span>
              <span className="detail-value">
                {new Date(drawDate).toLocaleDateString(i18n.language === 'en' ? 'en-US' : 'ru-RU', {
                  day: 'numeric',
                  month: 'long',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}
        </div>

        {onEdit && (
          <button className="edit-numbers-btn" onClick={onEdit}>
            {t('editNumbers', { defaultValue: 'Изменить числа' })}
          </button>
        )}
      </div>
    </div>
  );
}
