import './ProgressBar.css';

interface ProgressBarProps {
  current: number;
  max: number;
  showLabel?: boolean;
  label?: string;
}

export default function ProgressBar({ current, max, showLabel = false, label }: ProgressBarProps) {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="progress-bar-container">
      <div className="progress-bar">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${percentage}%` }}
        />
      </div>
      {showLabel && (
        <div className="progress-bar-label">
          {label || `${current} / ${max}`}
        </div>
      )}
    </div>
  );
}
