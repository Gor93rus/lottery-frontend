import { motion } from 'framer-motion';
import { Trophy, Star } from 'lucide-react';
import './PlayerLevel.css';

interface PlayerLevelProps {
  level: number;
  xp: number;
  xpToNextLevel: number;
  progress: number;
}

function PlayerLevel({ level, xp, xpToNextLevel, progress }: PlayerLevelProps) {
  const levelConfig = {
    color: level >= 50 ? '#E5E4E2' : level >= 30 ? '#B9F2FF' : level >= 15 ? '#FFD700' : level >= 5 ? '#C0C0C0' : '#CD7F32',
    gradient: level >= 50 
      ? 'linear-gradient(135deg, #E5E4E2 0%, #BCC6CC 100%)'
      : level >= 30
      ? 'linear-gradient(135deg, #B9F2FF 0%, #00CED1 100%)'
      : level >= 15
      ? 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)'
      : level >= 5
      ? 'linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)'
      : 'linear-gradient(135deg, #CD7F32 0%, #A0522D 100%)',
    name: level >= 50 ? 'Platinum' : level >= 30 ? 'Diamond' : level >= 15 ? 'Gold' : level >= 5 ? 'Silver' : 'Bronze',
  };

  const progressPercent = Math.min(100, Math.max(0, progress));

  return (
    <motion.div
      className="player-level-container"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="player-level-card">
        <div className="level-header">
          <motion.div
            className="level-icon"
            style={{ background: levelConfig.gradient }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            {level >= 15 ? <Star size={32} color="white" /> : <Trophy size={32} color="white" />}
          </motion.div>
          <div className="level-info">
            <h3 className="level-name">Уровень {level}</h3>
            <p className="level-subtitle">{levelConfig.name}</p>
          </div>
        </div>

        <div className="progress-section">
          <div className="progress-label">
            <span>XP: {xp.toLocaleString()}</span>
            <span>{xpToNextLevel.toLocaleString()}</span>
          </div>
          <div className="progress-bar-container">
            <motion.div
              className="progress-bar"
              style={{ background: levelConfig.gradient }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <div className="progress-shine" />
          </div>
          <p className="progress-text">
            {Math.round(progressPercent)}% до следующего уровня
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default PlayerLevel;
