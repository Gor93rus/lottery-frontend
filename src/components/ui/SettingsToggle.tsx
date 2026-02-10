import './SettingsToggle.css';

interface SettingsToggleProps {
  icon: string;
  title: string;
  description: string;
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}

export default function SettingsToggle({
  icon,
  title,
  description,
  value,
  onChange,
  disabled = false
}: SettingsToggleProps) {
  return (
    <div className={`settings-toggle ${disabled ? 'disabled' : ''}`}>
      <span className="settings-toggle-icon">{icon}</span>
      <div className="settings-toggle-content">
        <div className="settings-toggle-title">{title}</div>
        <div className="settings-toggle-description">{description}</div>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={value}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
        />
        <span className="toggle-slider"></span>
      </label>
    </div>
  );
}
