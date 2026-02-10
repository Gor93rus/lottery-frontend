import { useTranslation } from 'react-i18next';
import { useSound } from '../../Advanced/SoundManager';
import './NumberGrid.css';

interface NumberGridProps {
  maxNumbers: number;
  totalNumbers: number;
  selectedNumbers: number[];
  onSelectionChange: (numbers: number[]) => void;
  disabled?: boolean;
  onAddToCart?: (numbers: number[]) => void;
  showAddToCart?: boolean;
}

export default function NumberGrid({
  maxNumbers,
  totalNumbers,
  selectedNumbers,
  onSelectionChange,
  disabled = false,
  onAddToCart,
  showAddToCart = false
}: NumberGridProps) {
  const { t } = useTranslation();
  const { playSound } = useSound();

  const handleNumberClick = (num: number) => {
    if (disabled) return;

    if (selectedNumbers.includes(num)) {
      // Deselect
      onSelectionChange(selectedNumbers.filter(n => n !== num));
      playSound('click');
    } else if (selectedNumbers.length < maxNumbers) {
      // Select
      onSelectionChange([...selectedNumbers, num].sort((a, b) => a - b));
      playSound('click');
      
      // Haptic feedback on mobile
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
    } else {
      // Max reached - play warning sound
      playSound('lose');
      if (navigator.vibrate) {
        navigator.vibrate([50, 50, 50]);
      }
    }
  };

  const handleClear = () => {
    onSelectionChange([]);
    playSound('click');
  };

  const handleQuickPick = () => {
    const numbers: number[] = [];
    while (numbers.length < maxNumbers) {
      const num = Math.floor(Math.random() * totalNumbers) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    onSelectionChange(numbers.sort((a, b) => a - b));
    playSound('purchase');
  };

  const handleAddToCart = () => {
    if (selectedNumbers.length === maxNumbers && onAddToCart) {
      onAddToCart([...selectedNumbers]);
      onSelectionChange([]);
      playSound('purchase');
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([30, 10, 30]);
      }
    }
  };

  const isSelected = (num: number) => selectedNumbers.includes(num);
  const isDisabled = (num: number) => 
    disabled || (!isSelected(num) && selectedNumbers.length >= maxNumbers);

  return (
    <div className="number-grid-container">
      <div className="number-grid-header">
        <span className="selected-count">
          {t('selected', { defaultValue: 'Выбрано' })}: {selectedNumbers.length}/{maxNumbers}
        </span>
        <div className="grid-actions">
          <button
            className="grid-action-btn clear-btn"
            onClick={handleClear}
            disabled={disabled || selectedNumbers.length === 0}
          >
            {t('clear', { defaultValue: 'Очистить' })}
          </button>
          <button
            className="grid-action-btn random-btn"
            onClick={handleQuickPick}
            disabled={disabled}
          >
            🎲 {t('quickPick', { defaultValue: 'Случайный выбор' })}
          </button>
        </div>
      </div>

      <div className="number-grid">
        {Array.from({ length: totalNumbers }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`number-cell ${isSelected(num) ? 'selected' : ''} ${
              isDisabled(num) ? 'disabled' : ''
            }`}
            onClick={() => handleNumberClick(num)}
            disabled={isDisabled(num)}
          >
            {num}
          </button>
        ))}
      </div>

      {selectedNumbers.length > 0 && (
        <div className="selected-numbers-preview">
          {selectedNumbers.map((num) => (
            <div key={num} className="selected-ball">
              {num}
            </div>
          ))}
        </div>
      )}

      {showAddToCart && selectedNumbers.length === maxNumbers && onAddToCart && (
        <button
          className="add-to-cart-btn"
          onClick={handleAddToCart}
        >
          🛒 {t('addToCart', { defaultValue: 'Add to Cart' })}
        </button>
      )}
    </div>
  );
}
