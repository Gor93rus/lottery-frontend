import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import ProgressBar from '../ui/ProgressBar';
import './ProfileHeader.css';

interface ProfileHeaderProps {
  user: {
    username?: string;
    firstName?: string;
    photoUrl?: string;
  };
  level?: {
    level: number;
    name: string;
    currentXp: number;
    xpForNextLevel: number;
    totalXp: number;
  };
  loading: boolean;
}

export default function ProfileHeader({ user, level, loading }: ProfileHeaderProps) {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  const displayName = user.username ? `@${user.username}` : user.firstName || 'Пользователь';
  
  const handleWalletClick = () => {
    if (wallet) {
      tonConnectUI.disconnect();
    } else {
      tonConnectUI.openModal();
    }
  };

  return (
    <div className="profile-header">
      <div className="profile-header-top">
        {/* Avatar */}
        <div className="profile-avatar">
          {user.photoUrl ? (
            <img src={user.photoUrl} alt="Avatar" />
          ) : (
            <div className="profile-avatar-placeholder">
              {(user.firstName?.[0] || user.username?.[0] || '?').toUpperCase()}
            </div>
          )}
        </div>

        {/* Username */}
        <div className="profile-username">{displayName}</div>

        {/* Wallet button */}
        <button 
          className={`profile-wallet-btn ${wallet ? 'connected' : ''}`}
          onClick={handleWalletClick}
        >
          {wallet ? '✓💎' : '💎'}
        </button>
      </div>

      {/* Level info */}
      {loading ? (
        <div className="profile-level-skeleton" />
      ) : level ? (
        <div className="profile-level">
          <div className="profile-level-name">
            ⭐ Уровень {level.level} — {level.name}
          </div>
          <ProgressBar 
            current={level.currentXp} 
            max={level.xpForNextLevel}
            showLabel={true}
            label={`${level.currentXp.toLocaleString()} / ${level.xpForNextLevel.toLocaleString()} XP`}
          />
        </div>
      ) : null}
    </div>
  );
}
