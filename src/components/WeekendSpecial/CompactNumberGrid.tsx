import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHeatmap } from '../../hooks/useHeatmap';
import HeatmapToggle from './HeatmapToggle';
import './CompactNumberGrid.css';

interface CompactNumberGridProps {
  selected: number[];
  onToggle: (num: number) => void;
  maxSelection: number;
  totalNumbers?: number;
  onQuickPick?: () => void;
  onClear?: () => void;
  onAddToCart?: () => void;
  disabled?: boolean;
}

export default function CompactNumberGrid({
  selected,
  onToggle,
  maxSelection,
  totalNumbers = 36,
  onQuickPick,
  onClear,
  onAddToCart,
  disabled = false
}: CompactNumberGridProps) {
  const { t } = useTranslation();
  const [showHeatmap, setShowHeatmap] = useState(false);
  const { getHeatLevel, getHeatColor } = useHeatmap(totalNumbers);

  const handleNumberClick = (num: number) => {
    if (disabled) return;
    
    // Haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    onToggle(num);
  };

  const isSelected = (num: number) => selected.includes(num);
  const isDisabled = (num: number) => 
    disabled || (!isSelected(num) && selected.length >= maxSelection);

  const getNumberStyle = (num: number) => {
    if (!showHeatmap || isSelected(num)) return {};
    
    const heatLevel = getHeatLevel(num);
    return {
      background: getHeatColor(heatLevel),
    };
  };

  return (
    <div className="ws-compact-grid-container">
      <div className="ws-grid-header">
        <span className="ws-selected-count">
          📊 {t('selected', { defaultValue: 'Выбрано' })}: {selected.length}/{maxSelection}
        </span>
      </div>

      <div className="ws-grid-actions">
        <button
          className="ws-action-btn ws-quickpick-btn"
          onClick={onQuickPick}
          disabled={disabled}
        >
          💎 Quick Pick
        </button>
        <button
          className="ws-action-btn ws-add-ticket-btn"
          onClick={onAddToCart}
          disabled={disabled || selected.length !== maxSelection}
        >
          ➕ Add Ticket
        </button>
        <button
          className="ws-action-btn ws-clear-btn"
          onClick={onClear}
          disabled={disabled || selected.length === 0}
        >
          🗑️ Clear
        </button>
      </div>

      <HeatmapToggle 
        showHeatmap={showHeatmap} 
        onToggle={() => setShowHeatmap(!showHeatmap)} 
      />

      <div className="ws-grid">
        {Array.from({ length: totalNumbers }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`ws-number-cell ${isSelected(num) ? 'selected' : ''} ${
              isDisabled(num) ? 'disabled' : ''
            }`}
            onClick={() => handleNumberClick(num)}
            disabled={isDisabled(num)}
            style={getNumberStyle(num)}
          >
            {num}
          </button>
        ))}
      </div>

    </div>
  );
}
