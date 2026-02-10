import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './QuickPick.css';

interface Combination {
  id: string;
  name: string;
  numbers: number[];
}

interface NumberStats {
  number: number;
  frequency: number;
}

const mockNumberStats: NumberStats[] = Array.from({ length: 45 }, (_, i) => ({
  number: i + 1,
  frequency: Math.floor(Math.random() * 100)
}));

const QuickPick: React.FC = () => {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [favorites, setFavorites] = useState<Combination[]>([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [newCombinationName, setNewCombinationName] = useState('');
  const [showHeatmap, setShowHeatmap] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('lottery-favorites');
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading favorites:', error);
      }
    }
  }, []);

  const saveFavorites = (newFavorites: Combination[]) => {
    try {
      localStorage.setItem('lottery-favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  const generateRandomNumbers = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedNumbers([]);

    const numbers: number[] = [];
    while (numbers.length < 6) {
      const num = Math.floor(Math.random() * 45) + 1;
      if (!numbers.includes(num)) {
        numbers.push(num);
      }
    }
    numbers.sort((a, b) => a - b);

    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex < numbers.length) {
        setSelectedNumbers(prev => [...prev, numbers[currentIndex]]);
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsSpinning(false);
      }
    }, 200);
  };

  const handleSaveCombination = () => {
    if (!newCombinationName.trim() || selectedNumbers.length !== 6) return;
    if (favorites.length >= 5) {
      alert('Максимум 5 избранных комбинаций!');
      return;
    }

    const newCombination: Combination = {
      id: Date.now().toString(),
      name: newCombinationName.trim(),
      numbers: selectedNumbers
    };

    saveFavorites([...favorites, newCombination]);
    setNewCombinationName('');
    setShowSaveDialog(false);
  };

  const deleteFavorite = (id: string) => {
    saveFavorites(favorites.filter(f => f.id !== id));
  };

  const loadFavorite = (numbers: number[]) => {
    setSelectedNumbers(numbers);
  };

  const getHeatColor = (frequency: number) => {
    const maxFreq = Math.max(...mockNumberStats.map(s => s.frequency));
    const minFreq = Math.min(...mockNumberStats.map(s => s.frequency));
    const normalized = (frequency - minFreq) / (maxFreq - minFreq);

    if (normalized > 0.7) {
      return `rgba(244, 93, 166, ${0.3 + normalized * 0.7})`;
    } else if (normalized > 0.4) {
      return `rgba(223, 96, 12, ${0.3 + normalized * 0.5})`;
    } else {
      return `rgba(103, 126, 234, ${0.3 + normalized * 0.5})`;
    }
  };

  const getHeatLabel = (frequency: number) => {
    const maxFreq = Math.max(...mockNumberStats.map(s => s.frequency));
    const minFreq = Math.min(...mockNumberStats.map(s => s.frequency));
    const normalized = (frequency - minFreq) / (maxFreq - minFreq);

    if (normalized > 0.7) return '🔥 Горячее';
    if (normalized > 0.4) return '🌡️ Теплое';
    return '❄️ Холодное';
  };

  return (
    <div className="quick-pick">
      <div className="quick-pick-header">
        <h2>🎲 Быстрый выбор</h2>
      </div>

      <div className="quick-pick-main">
        <motion.button
          className="lucky-button"
          onClick={generateRandomNumbers}
          disabled={isSpinning}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="lucky-icon">🎲</span>
          <span className="lucky-text">
            {isSpinning ? 'Генерация...' : 'Мне повезет!'}
          </span>
        </motion.button>

        <div className="selected-numbers-display">
          <AnimatePresence mode="popLayout">
            {selectedNumbers.map((num, index) => (
              <motion.div
                key={`${num}-${index}`}
                className="number-bubble"
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                exit={{ scale: 0, rotate: 180, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                {num}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {selectedNumbers.length === 6 && !isSpinning && (
          <motion.button
            className="save-combination-btn"
            onClick={() => setShowSaveDialog(true)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            ⭐ Сохранить комбинацию
          </motion.button>
        )}
      </div>

      <AnimatePresence>
        {showSaveDialog && (
          <motion.div
            className="save-dialog-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSaveDialog(false)}
          >
            <motion.div
              className="save-dialog"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h3>💾 Сохранить комбинацию</h3>
              <input
                type="text"
                placeholder="Название комбинации..."
                value={newCombinationName}
                onChange={(e) => setNewCombinationName(e.target.value)}
                maxLength={20}
                autoFocus
              />
              <div className="dialog-buttons">
                <button className="cancel-btn" onClick={() => setShowSaveDialog(false)}>
                  Отмена
                </button>
                <button className="confirm-btn" onClick={handleSaveCombination}>
                  Сохранить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {favorites.length > 0 && (
        <div className="favorites-section">
          <h3>⭐ Избранные комбинации</h3>
          <div className="favorites-list">
            {favorites.map((combo) => (
              <motion.div
                key={combo.id}
                className="favorite-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="favorite-header">
                  <span className="favorite-name">{combo.name}</span>
                  <button
                    className="delete-favorite-btn"
                    onClick={() => deleteFavorite(combo.id)}
                  >
                    🗑️
                  </button>
                </div>
                <div className="favorite-numbers">
                  {combo.numbers.map((num, idx) => (
                    <span key={idx} className="favorite-number">
                      {num}
                    </span>
                  ))}
                </div>
                <button
                  className="load-favorite-btn"
                  onClick={() => loadFavorite(combo.numbers)}
                >
                  Загрузить
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      <div className="stats-section">
        <div className="stats-header">
          <h3>📊 Статистика чисел</h3>
          <button
            className="toggle-heatmap-btn"
            onClick={() => setShowHeatmap(!showHeatmap)}
          >
            {showHeatmap ? '📋 Скрыть' : '🔥 Показать тепловую карту'}
          </button>
        </div>

        <AnimatePresence>
          {showHeatmap && (
            <motion.div
              className="heatmap-container"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="heatmap-legend">
                <div className="legend-item">
                  <span className="legend-color hot"></span>
                  <span>🔥 Горячие</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color warm"></span>
                  <span>🌡️ Теплые</span>
                </div>
                <div className="legend-item">
                  <span className="legend-color cold"></span>
                  <span>❄️ Холодные</span>
                </div>
              </div>

              <div className="heatmap-grid">
                {mockNumberStats.map((stat, index) => (
                  <motion.div
                    key={stat.number}
                    className="heatmap-cell"
                    style={{ backgroundColor: getHeatColor(stat.frequency) }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: index * 0.01 }}
                    title={`${stat.number}: ${getHeatLabel(stat.frequency)} (${stat.frequency})`}
                  >
                    <span className="cell-number">{stat.number}</span>
                    <span className="cell-frequency">{stat.frequency}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default QuickPick;
