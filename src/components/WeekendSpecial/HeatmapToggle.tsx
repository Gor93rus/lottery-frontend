import './HeatmapToggle.css';

interface HeatmapToggleProps {
  showHeatmap: boolean;
  onToggle: () => void;
}

export default function HeatmapToggle({ showHeatmap, onToggle }: HeatmapToggleProps) {
  return (
    <div className="ws-heatmap-controls">
      <button 
        className={`ws-heatmap-btn ${showHeatmap ? 'active' : ''}`}
        onClick={onToggle}
      >
        🔥 Тепловая карта
      </button>

      {showHeatmap && (
        <div className="ws-heatmap-legend">
          <div className="ws-legend-item">
            <div className="ws-legend-color ws-legend-hot"></div>
            <span>Горячие</span>
          </div>
          <div className="ws-legend-item">
            <div className="ws-legend-color ws-legend-warm"></div>
            <span>Тёплые</span>
          </div>
          <div className="ws-legend-item">
            <div className="ws-legend-color ws-legend-cold"></div>
            <span>Холодные</span>
          </div>
        </div>
      )}
    </div>
  );
}
