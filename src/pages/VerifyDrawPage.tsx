import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Clock, Hash, Key, Dices } from 'lucide-react';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';
import './VerifyDrawPage.css';

interface VerificationData {
  drawId: string;
  drawNumber: number;
  status: string;
  scheduledAt?: string;
  executedAt?: string;
  seedHash: string;
  seedHashPublishedAt: string;
  seed: string;
  seedRevealedAt: string;
  winningNumbers: number[];
  verified: boolean;
  proof: {
    seedHashMatches: boolean;
    numbersValid: boolean;
    seedHashPublishedBefore: boolean;
  };
  totalTickets: number;
  winners: Record<number, number>;
  totalPaid: number;
}

export default function VerifyDrawPage() {
  const { drawId } = useParams();
  const [data, setData] = useState<VerificationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadVerification();
  }, [drawId]);

  async function loadVerification() {
    try {
      setLoading(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/public/draw/${drawId}/verify`
      );
      
      if (!response.ok) throw new Error('Failed to load verification data');
      
      const result = await response.json();
      setData(result);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load verification data';
      console.error('Verification load error:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="verify-page-wrapper">
        <AnimatedBackground />
        <Header />
        <div className="verify-page loading">
          <div className="loading-spinner"></div>
          <p>Загрузка данных проверки...</p>
        </div>
        <Footer activeTab="" onTabChange={() => {}} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="verify-page-wrapper">
        <AnimatedBackground />
        <Header />
        <div className="verify-page error">
          <XCircle size={64} />
          <h2>Ошибка загрузки</h2>
          <p>{error || 'Не удалось загрузить данные проверки'}</p>
        </div>
        <Footer activeTab="" onTabChange={() => {}} />
      </div>
    );
  }

  return (
    <div className="verify-page-wrapper">
      <AnimatedBackground />
      <Header />
      
      <div className="verify-page">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          className="verify-title"
        >
          🔐 Проверка честности
        </motion.h1>

        <div className="draw-info-card">
          <h2>Тираж №{data.drawNumber}</h2>
          <div className="draw-meta">
            <span className={`status-badge ${data.status}`}>{data.status}</span>
            {data.executedAt && (
              <span className="draw-date">
                <Clock size={16} />
                Выполнен: {new Date(data.executedAt).toLocaleString('ru-RU')}
              </span>
            )}
          </div>
        </div>

        {/* Seed Hash */}
        <motion.section 
          className="verify-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="section-header">
            <Hash size={24} />
            <h3>1️⃣ Seed Hash (опубликован ДО розыгрыша)</h3>
          </div>
          <div className="hash-box">
            <code className="hash-value">{data.seedHash}</code>
            <span className="timestamp">
              <Clock size={14} />
              Опубликован: {new Date(data.seedHashPublishedAt).toLocaleString('ru-RU')}
            </span>
          </div>
        </motion.section>

        {/* Seed */}
        <motion.section 
          className="verify-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="section-header">
            <Key size={24} />
            <h3>2️⃣ Seed (раскрыт ПОСЛЕ розыгрыша)</h3>
          </div>
          <div className="hash-box">
            <code className="hash-value">{data.seed}</code>
            <span className="timestamp">
              <Clock size={14} />
              Раскрыт: {new Date(data.seedRevealedAt).toLocaleString('ru-RU')}
            </span>
          </div>
        </motion.section>

        {/* Winning Numbers */}
        <motion.section 
          className="verify-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="section-header">
            <Dices size={24} />
            <h3>3️⃣ Выигрышные числа</h3>
          </div>
          <div className="winning-numbers">
            {data.winningNumbers.map((num, idx) => (
              <motion.span 
                key={num} 
                className="number-ball"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3 + idx * 0.1 }}
              >
                {num}
              </motion.span>
            ))}
          </div>
        </motion.section>

        {/* Verification Result */}
        <motion.section 
          className="verify-result"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {data.verified ? (
            <div className="result valid">
              <CheckCircle size={64} />
              <h2>✅ Розыгрыш ЧЕСТНЫЙ!</h2>
              <ul className="proof-list">
                <li>
                  <CheckCircle size={20} />
                  Seed соответствует Hash (SHA256)
                </li>
                <li>
                  <CheckCircle size={20} />
                  Числа сгенерированы правильно из Seed
                </li>
                <li>
                  <CheckCircle size={20} />
                  Hash опубликован до розыгрыша
                </li>
              </ul>
            </div>
          ) : (
            <div className="result invalid">
              <XCircle size={64} />
              <h2>❌ ВНИМАНИЕ! Проблема с проверкой!</h2>
              <ul className="proof-list">
                {!data.proof.seedHashMatches && (
                  <li>
                    <XCircle size={20} />
                    Seed не соответствует Hash
                  </li>
                )}
                {!data.proof.numbersValid && (
                  <li>
                    <XCircle size={20} />
                    Числа не соответствуют Seed
                  </li>
                )}
                {!data.proof.seedHashPublishedBefore && (
                  <li>
                    <XCircle size={20} />
                    Hash опубликован после розыгрыша
                  </li>
                )}
              </ul>
            </div>
          )}
        </motion.section>

        {/* Winners Stats */}
        <motion.section 
          className="verify-section stats-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3>📊 Статистика</h3>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Билетов куплено:</span>
              <span className="stat-value">{data.totalTickets}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Всего победителей:</span>
              <span className="stat-value">
                {Object.values(data.winners).reduce((a, b) => a + b, 0)}
              </span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Выплачено призов:</span>
              <span className="stat-value">{data.totalPaid} TON</span>
            </div>
          </div>

          <div className="winners-breakdown">
            <h4>Победители по категориям:</h4>
            <ul>
              <li>💎 5 из 5: <strong>{data.winners[5] || 0}</strong> чел.</li>
              <li>🥇 4 из 5: <strong>{data.winners[4] || 0}</strong> чел.</li>
              <li>🥈 3 из 5: <strong>{data.winners[3] || 0}</strong> чел.</li>
              <li>🥉 2 из 5: <strong>{data.winners[2] || 0}</strong> чел.</li>
              <li>🎫 1 из 5: <strong>{data.winners[1] || 0}</strong> чел.</li>
            </ul>
          </div>
        </motion.section>

        {/* How to Verify Manually */}
        <motion.section 
          className="verify-section howto-section"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <h3>🔍 Как проверить самостоятельно</h3>
          <div className="howto-content">
            <p>Вы можете проверить честность розыгрыша самостоятельно:</p>
            <ol>
              <li>Скопируйте <code>seed</code> сверху</li>
              <li>Вычислите SHA256 hash: <code>sha256(seed)</code></li>
              <li>Сравните результат с опубликованным <code>seedHash</code></li>
              <li>Они должны совпадать!</li>
            </ol>
            <p className="howto-note">
              Используйте любой онлайн калькулятор SHA256 или библиотеку в вашем языке программирования.
            </p>
          </div>
        </motion.section>
      </div>
      
      <Footer activeTab="" onTabChange={() => {}} />
    </div>
  );
}
