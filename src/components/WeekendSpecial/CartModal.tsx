import './CartModal.css';

export interface CartTicket {
  id: string;
  numbers: number[];
  price?: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: CartTicket[];
  onRemove: (ticketId: string) => void;
  onClear: () => void;
  onCheckout: () => void;
  total: number;
  discount?: number;
  discountPercent?: number;
  subtotal: number;
}

export default function CartModal({
  isOpen,
  onClose,
  tickets,
  onRemove,
  onClear,
  onCheckout,
  total,
  discount = 0,
  discountPercent = 0,
  subtotal
}: CartModalProps) {
  if (!isOpen) return null;

  const pluralize = (count: number) => {
    if (count === 1) return '';
    if (count >= 2 && count <= 4) return 'а';
    return 'ов';
  };

  const hasDiscount = discount > 0;

  return (
    <div className="ws-cart-modal-overlay" onClick={onClose}>
      <div className="ws-cart-modal" onClick={(e) => e.stopPropagation()}>
        <div className="ws-cart-modal-header">
          <button className="ws-cart-back-btn" onClick={onClose}>
            ←
          </button>
          <h2 className="ws-cart-title">Корзина</h2>
          <button className="ws-cart-close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="ws-cart-modal-content">
          {tickets.length === 0 ? (
            <div className="ws-cart-empty">
              <div className="ws-cart-empty-icon">🛒</div>
              <p>Корзина пуста</p>
              <p className="ws-cart-empty-hint">Добавьте билеты, выбрав числа ниже</p>
            </div>
          ) : (
            <>
              <div className="ws-cart-tickets">
                {tickets.map((ticket, index) => (
                  <div key={ticket.id} className="ws-cart-ticket">
                    <div className="ws-cart-ticket-info">
                      <div className="ws-cart-ticket-label">Билет #{index + 1}</div>
                      <div className="ws-cart-ticket-numbers">
                        Числа: {ticket.numbers.sort((a, b) => a - b).join(', ')}
                      </div>
                      <div className="ws-cart-ticket-price">
                        {ticket.price || 1} TON
                      </div>
                    </div>
                    <button
                      className="ws-cart-ticket-remove"
                      onClick={() => onRemove(ticket.id)}
                      aria-label="Удалить билет"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>

              <div className="ws-cart-summary">
                <div className="ws-cart-summary-row">
                  <span>Итого: {tickets.length} билет{pluralize(tickets.length)}</span>
                  <span>{subtotal.toFixed(1)} TON</span>
                </div>
                
                {hasDiscount && (
                  <div className="ws-cart-summary-row ws-discount-row">
                    <span className="ws-discount-label">
                      Скидка {discountPercent}% (от 5 билетов)
                    </span>
                    <span className="ws-discount-amount">
                      -{discount.toFixed(2)} TON
                    </span>
                  </div>
                )}
                
                <div className="ws-cart-summary-row ws-cart-total-row">
                  <span>Сумма:</span>
                  <strong className="ws-final-cost">{total.toFixed(1)} TON</strong>
                </div>
              </div>
            </>
          )}
        </div>

        {tickets.length > 0 && (
          <div className="ws-cart-modal-footer">
            <button className="ws-cart-clear-btn" onClick={onClear}>
              🗑️ Очистить всё
            </button>
            <button className="ws-cart-checkout-btn" onClick={onCheckout}>
              💎 ОПЛАТИТЬ - {total.toFixed(1)} TON
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
