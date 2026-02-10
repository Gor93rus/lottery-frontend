import { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeSVG } from 'qrcode.react';
import './ReferralQR.css';

interface ReferralQRProps {
  referralCode?: string;
  totalReferrals?: number;
  totalEarned?: number;
}

function ReferralQR({
  referralCode = 'REF123ABC',
  totalReferrals = 12,
  totalEarned = 150,
}: ReferralQRProps) {
  const [copied, setCopied] = useState(false);
  const showQR = true;

  const referralLink = `https://lottery.ton/ref/${referralCode}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(referralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownloadQR = () => {
    const svg = document.querySelector('.qr-code-svg') as SVGElement;
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    canvas.width = 300;
    canvas.height = 300;

    img.onload = () => {
      ctx?.drawImage(img, 0, 0, 300, 300);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = `referral-qr-${referralCode}.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Присоединяйся к Weekend Millions!',
          text: `🎰 Выигрывай TON в крипто-лотерее! Используй мой код: ${referralCode}`,
          url: referralLink,
        });
      } catch (err) {
        console.log('Share cancelled or failed:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <motion.div
      className="referral-qr"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="referral-header">
        <h3 className="referral-title">👥 Пригласи друзей</h3>
        <p className="referral-subtitle">Зарабатывай TON за каждого приглашенного друга!</p>
      </div>

      {/* Statistics */}
      <div className="referral-stats">
        <div className="stat-item">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <div className="stat-label">Приглашено друзей</div>
            <div className="stat-value">{totalReferrals}</div>
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-icon">💰</div>
          <div className="stat-content">
            <div className="stat-label">Заработано</div>
            <div className="stat-value">{totalEarned} TON</div>
          </div>
        </div>
      </div>

      {/* Referral Code */}
      <div className="referral-code-section">
        <label className="referral-label">Твой реферальный код:</label>
        <motion.div
          className="code-display"
          onClick={handleCopyCode}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="code-text">{referralCode}</span>
          <button className="copy-icon-btn" title="Копировать код">
            {copied ? '✓' : '📋'}
          </button>
        </motion.div>
      </div>

      {/* QR Code */}
      {showQR && (
        <motion.div
          className="qr-section"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
        >
          <div className="qr-wrapper">
            <motion.div
              className="qr-container"
              animate={{
                boxShadow: [
                  '0 0 20px rgba(223, 96, 12, 0.3)',
                  '0 0 40px rgba(244, 93, 166, 0.5)',
                  '0 0 20px rgba(223, 96, 12, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            >
              <QRCodeSVG
                value={referralLink}
                size={200}
                level="H"
                includeMargin={true}
                className="qr-code-svg"
                fgColor="#000000"
                bgColor="#ffffff"
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        <motion.button
          className="action-btn primary"
          onClick={handleShare}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">📤</span>
          <span className="btn-text">Поделиться</span>
        </motion.button>

        <motion.button
          className="action-btn secondary"
          onClick={handleCopyLink}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">{copied ? '✓' : '🔗'}</span>
          <span className="btn-text">{copied ? 'Скопировано!' : 'Копировать ссылку'}</span>
        </motion.button>

        <motion.button
          className="action-btn secondary"
          onClick={handleDownloadQR}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span className="btn-icon">💾</span>
          <span className="btn-text">Скачать QR</span>
        </motion.button>
      </div>

      {/* Info */}
      <div className="referral-info">
        <p className="info-text">
          💡 Получай <strong>10% от покупок</strong> каждого приглашенного друга на всех уровнях!
        </p>
      </div>

      {/* Success Animation */}
      {copied && (
        <motion.div
          className="success-overlay"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <div className="success-icon">✓</div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default ReferralQR;
