import './CartPreview.css';

interface CartPreviewProps {
  ticketCount: number;
  totalCost: number;
  onOpenCart: () => void;
}

export default function CartPreview({ ticketCount, totalCost, onOpenCart }: CartPreviewProps) {
  if (ticketCount === 0) return null;

  const pluralize = (count: number) => {
    if (count === 1) return '';
    if (count >= 2 && count <= 4) return 'а';
    return 'ов';
  };

  return (
    <div className="ws-cart-preview">
      <div className="ws-cart-header">
        <span className="ws-cart-icon">🛒</span>
        <span className="ws-cart-count">
          Корзина ({ticketCount} билет{pluralize(ticketCount)})
        </span>
      </div>
      <div className="ws-cart-total">
        Итого: <strong>{totalCost.toFixed(1)} TON</strong>
      </div>
      <button className="ws-cart-open-btn" onClick={onOpenCart}>
        Открыть корзину →
      </button>
    </div>
  );
}
