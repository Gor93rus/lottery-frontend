import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import html2canvas from 'html2canvas';
import './ShareWin.css';

interface ShareWinProps {
  amount: number;
  lotteryName: string;
  username?: string;
  referralCode?: string;
}

function ShareWin({
  amount,
  lotteryName,
  username = 'Player',
  referralCode = 'REF123ABC',
}: ShareWinProps) {
  const [copied, setCopied] = useState(false);
  const showPreview = false;
  const previewRef = useRef<HTMLDivElement>(null);

  const referralLink = `https://lottery.ton/ref/${referralCode}`;
  const shareText = `🎰 Я только что выиграл ${amount.toLocaleString('ru-RU')} TON в ${lotteryName}! 🎉\nПрисоединяйся и ты! 🚀\n${referralLink}`;

  const handleTwitterShare = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
      shareText
    )}&url=${encodeURIComponent(referralLink)}`;
    window.open(tweetUrl, '_blank');
    triggerConfetti();
  };

  const handleTelegramShare = () => {
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(
      referralLink
    )}&text=${encodeURIComponent(shareText)}`;
    window.open(telegramUrl, '_blank');
    triggerConfetti();
  };

  const handleCopyText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      triggerConfetti();
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadImage = async () => {
    if (!previewRef.current) return;

    try {
      const canvas = await html2canvas(previewRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      });

      const link = document.createElement('a');
      link.download = `win-${amount}-ton.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      triggerConfetti();
    } catch (err) {
      console.error('Failed to generate image:', err);
    }
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#df600c', '#f45da6', '#00ff88', '#4a9eff'],
    });
  };

  return (
    <motion.div
      className="share-win"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="share-header">
        <h3 className="share-title">🎉 Поделись выигрышем!</h3>
        <p className="share-subtitle">Покажи всем свою удачу и получи больше рефералов</p>
      </div>

      {/* Win Preview Card (hidden element for screenshot) */}
      <div
        ref={previewRef}
        className="win-preview-card"
        style={{
          position: showPreview ? 'relative' : 'absolute',
          left: showPreview ? '0' : '-9999px',
        }}
      >
        <div className="preview-background">
          <div className="preview-gradient" />
          <div className="preview-pattern" />
        </div>
        <div className="preview-content">
          <div className="preview-emoji">🎰</div>
          <div className="preview-title">ВЫИГРЫШ!</div>
          <div className="preview-amount">{amount.toLocaleString('ru-RU')} TON</div>
          <div className="preview-lottery">{lotteryName}</div>
          <div className="preview-user">@{username}</div>
          <div className="preview-footer">
            <div className="preview-logo">💎 Weekend Millions</div>
            <div className="preview-cta">Играй сейчас! 🚀</div>
          </div>
        </div>
      </div>

      {/* Share Buttons */}
      <div className="share-buttons">
        <motion.button
          className="share-btn twitter"
          onClick={handleTwitterShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">🐦</span>
          <span className="btn-text">Twitter</span>
        </motion.button>

        <motion.button
          className="share-btn telegram"
          onClick={handleTelegramShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">✈️</span>
          <span className="btn-text">Telegram</span>
        </motion.button>

        <motion.button
          className="share-btn copy"
          onClick={handleCopyText}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">{copied ? '✓' : '📋'}</span>
          <span className="btn-text">{copied ? 'Скопировано!' : 'Копировать'}</span>
        </motion.button>

        <motion.button
          className="share-btn download"
          onClick={handleDownloadImage}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">📸</span>
          <span className="btn-text">Скачать фото</span>
        </motion.button>
      </div>

      {/* Share Text Preview */}
      <div className="share-text-preview">
        <div className="preview-label">Текст для публикации:</div>
        <div className="preview-text-box">
          <pre className="preview-text">{shareText}</pre>
        </div>
      </div>

      {/* Info */}
      <div className="share-info">
        <p className="info-text">
          💡 Получай <strong>+10% бонус</strong> за каждого приглашенного друга!
        </p>
      </div>
    </motion.div>
  );
}

export default ShareWin;
