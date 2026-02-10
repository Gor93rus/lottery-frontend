import { motion } from 'framer-motion';
import './PurchaseTicketsCompact.css';

interface Ticket {
  id: string;
  numbers: number[];
}

interface PurchaseTicketsCompactProps {
  tickets: Ticket[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCheckout: () => void;
  onClose: () => void;
}

export default function PurchaseTicketsCompact({
  tickets,
  onRemove,
  onClear,
  onCheckout,
  onClose
}: PurchaseTicketsCompactProps) {
  const TICKET_PRICE = 1; // 1 TON
  const ticketCount = tickets.length;
  const subtotal = ticketCount * TICKET_PRICE;
  const hasDiscount = ticketCount >= 5;
  const discountPercent = hasDiscount ? 0.05 : 0;
  const discountAmount = subtotal * discountPercent;
  const total = subtotal - discountAmount;

  return (
    <div className="purchase-compact">
      {/* Header */}
      <div className="purchase-header">
        <h3>🛒 Корзина ({ticketCount})</h3>
        <button className="close-btn" onClick={onClose} aria-label="Закрыть корзину">✕</button>
      </div>

      {/* Tickets List */}
      <div className="tickets-list">
        {tickets.length === 0 ? (
          <div className="empty-cart">
            <p>Корзина пуста</p>
            <span>Добавьте билеты</span>
          </div>
        ) : (
          tickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              className="ticket-item-compact"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              <div className="ticket-info">
                <span className="ticket-num">#{index + 1}</span>
                <span className="ticket-numbers">
                  {ticket.numbers.join(', ')}
                </span>
                <span className="ticket-price">{TICKET_PRICE} TON</span>
              </div>
              <button
                className="remove-btn"
                onClick={() => onRemove(ticket.id)}
                title="Удалить"
                aria-label="Удалить билет"
              >
                🗑️
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Discount Banner */}
      {hasDiscount && (
        <motion.div
          className="discount-banner"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          🎁 Скидка 5% применена!
        </motion.div>
      )}

      {/* Summary */}
      {tickets.length > 0 && (
        <div className="purchase-summary">
          <div className="summary-line">
            <span>Билетов:</span>
            <span>{ticketCount}</span>
          </div>
          <div className="summary-line">
            <span>Сумма:</span>
            <span>{subtotal.toFixed(2)} TON</span>
          </div>
          {hasDiscount && (
            <div className="summary-line discount">
              <span>Скидка 5%:</span>
              <span>-{discountAmount.toFixed(2)} TON</span>
            </div>
          )}
          <div className="summary-line total">
            <span>Итого:</span>
            <span>{total.toFixed(2)} TON</span>
          </div>
        </div>
      )}

      {/* Actions */}
      {tickets.length > 0 && (
        <div className="purchase-actions">
          <button className="delete-all-btn" onClick={onClear}>
            🗑️ Удалить всё
          </button>
          <button
            className="pay-btn"
            onClick={onCheckout}
          >
            💎 Оплатить {total.toFixed(2)} TON
          </button>
        </div>
      )}
    </div>
  );
}
