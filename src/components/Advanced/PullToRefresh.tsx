import type { ReactNode } from 'react';
import PullToRefreshLib from 'react-simple-pull-to-refresh';
import { motion } from 'framer-motion';
import './PullToRefresh.css';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
}

const PullingContent = () => (
  <motion.div 
    className="pull-indicator"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
  >
    <div className="pull-arrow">⬇</div>
    <span className="pull-text">Потяните для обновления</span>
  </motion.div>
);

const RefreshingContent = () => (
  <motion.div 
    className="pull-indicator"
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1 }}
  >
    <div className="pull-spinner">
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
      <div className="spinner-ring"></div>
    </div>
    <span className="pull-text">Обновление...</span>
  </motion.div>
);

export const PullToRefresh = ({ onRefresh, children }: PullToRefreshProps) => {
  const handleRefresh = async () => {
    try {
      await onRefresh();
      
      const notification = document.createElement('div');
      notification.className = 'refresh-notification';
      notification.innerHTML = `
        <div class="notification-content">
          <span class="notification-icon">✓</span>
          <span class="notification-text">Обновлено!</span>
        </div>
      `;
      document.body.appendChild(notification);

      setTimeout(() => {
        notification.classList.add('refresh-notification--show');
      }, 100);

      setTimeout(() => {
        notification.classList.remove('refresh-notification--show');
        setTimeout(() => {
          document.body.removeChild(notification);
        }, 300);
      }, 2000);
    } catch (error) {
      console.error('Refresh error:', error);
    }
  };

  return (
    <PullToRefreshLib
      onRefresh={handleRefresh}
      pullingContent={<PullingContent />}
      refreshingContent={<RefreshingContent />}
      pullDownThreshold={80}
      maxPullDownDistance={120}
      resistance={2.5}
    >
      <motion.div
        className="pull-to-refresh-content"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </PullToRefreshLib>
  );
};
