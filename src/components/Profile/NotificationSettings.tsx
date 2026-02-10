import { useState } from 'react';
import { updateNotificationSettings } from '../../lib/api/userSettings';
import SettingsToggle from '../ui/SettingsToggle';
import './NotificationSettings.css';

interface NotificationSettingsData {
  drawReminder: boolean;
  drawResults: boolean;
  referrals: boolean;
}

interface NotificationSettingsProps {
  settings?: NotificationSettingsData;
  onChange: (settings: NotificationSettingsData) => void;
  loading: boolean;
}

export default function NotificationSettings({ settings, onChange, loading }: NotificationSettingsProps) {
  const [saving, setSaving] = useState(false);

  if (loading || !settings) {
    return <div className="notifications-skeleton">Загрузка...</div>;
  }

  async function handleToggle(key: keyof NotificationSettingsData, value: boolean) {
    if (!settings) return;
    
    // Optimistic update
    const newSettings: NotificationSettingsData = { ...settings, [key]: value };
    onChange(newSettings);

    setSaving(true);
    try {
      await updateNotificationSettings({ [key]: value });
    } catch (error) {
      // Revert on error
      onChange(settings);
      console.error('Failed to update settings:', error);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="notification-settings">
      <SettingsToggle
        icon="🎰"
        title="Напоминания о розыгрышах"
        description="За 1 час до начала"
        value={settings.drawReminder}
        onChange={(v) => handleToggle('drawReminder', v)}
        disabled={saving}
      />
      <SettingsToggle
        icon="🏆"
        title="Результаты розыгрышей"
        description="Выигрыш и проигрыш"
        value={settings.drawResults}
        onChange={(v) => handleToggle('drawResults', v)}
        disabled={saving}
      />
      <SettingsToggle
        icon="👥"
        title="Рефералы"
        description="Новые друзья и бонусы"
        value={settings.referrals}
        onChange={(v) => handleToggle('referrals', v)}
        disabled={saving}
      />
    </div>
  );
}
