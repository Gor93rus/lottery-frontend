import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePWA } from '../../hooks/usePWA';
import { useHaptic } from '../../hooks/useHaptic';
import { getInstallInstructions, isIOS } from '../../utils/pwaUtils';
import './InstallPrompt.css';

interface InstallPromptProps {
  position?: 'top' | 'bottom';
  showAfterAction?: boolean;
}

export const InstallPrompt = ({ 
  position = 'bottom',
  showAfterAction = true 
}: InstallPromptProps) => {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const { isInstallable, isInstalled, install } = usePWA();
  const { medium, light } = useHaptic();

  useEffect(() => {
    const isDismissed = localStorage.getItem('install_prompt_dismissed') === 'true';
    setDismissed(isDismissed);

    if (showAfterAction) {
      const hasInteracted = localStorage.getItem('user_has_interacted');
      if (hasInteracted && !isDismissed && (isInstallable || isIOS())) {
        setTimeout(() => setShow(true), 2000);
      }
    } else if (!isDismissed && (isInstallable || isIOS())) {
      setTimeout(() => setShow(true), 5000);
    }
  }, [isInstallable, showAfterAction]);

  useEffect(() => {
    if (isInstalled) {
      setShow(false);
    }
  }, [isInstalled]);

  const handleInstall = async () => {
    medium();
    
    if (isIOS()) {
      const modal = document.createElement('div');
      modal.className = 'ios-install-modal';
      modal.innerHTML = `
        <div class="ios-install-content">
          <div class="ios-install-header">
            <h3>Установка приложения</h3>
            <button class="ios-install-close" onclick="this.closest('.ios-install-modal').remove()">✕</button>
          </div>
          <div class="ios-install-body">
            <p>${getInstallInstructions()}</p>
            <div class="ios-install-steps">
              <div class="install-step">
                <span class="step-number">1</span>
                <p>Нажмите кнопку "Поделиться" <span style="font-size: 20px;">⎙</span></p>
              </div>
              <div class="install-step">
                <span class="step-number">2</span>
                <p>Выберите "На экран Домой"</p>
              </div>
              <div class="install-step">
                <span class="step-number">3</span>
                <p>Нажмите "Добавить"</p>
              </div>
            </div>
          </div>
        </div>
      `;
      document.body.appendChild(modal);
      
      setTimeout(() => {
        modal.classList.add('ios-install-modal--show');
      }, 100);
      
      return;
    }

    const success = await install();
    if (success) {
      setShow(false);
      localStorage.setItem('install_prompt_dismissed', 'true');
    }
  };

  const handleLater = () => {
    light();
    setShow(false);
  };

  const handleDismiss = () => {
    light();
    setShow(false);
    setDismissed(true);
    localStorage.setItem('install_prompt_dismissed', 'true');
  };

  if (!show || dismissed || isInstalled) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className={`install-prompt install-prompt--${position}`}
        initial={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: position === 'top' ? -100 : 100, opacity: 0 }}
        transition={{ 
          type: 'spring',
          damping: 20,
          stiffness: 300
        }}
      >
        <div className="install-prompt-content">
          <div className="install-prompt-icon">📱</div>
          <div className="install-prompt-text">
            <h4>Установите приложение</h4>
            <p>Для быстрого доступа к лотерее</p>
          </div>
        </div>
        
        <div className="install-prompt-actions">
          <button 
            className="install-btn install-btn--primary"
            onClick={handleInstall}
          >
            Установить
          </button>
          <button 
            className="install-btn install-btn--secondary"
            onClick={handleLater}
          >
            Позже
          </button>
          <button 
            className="install-btn install-btn--close"
            onClick={handleDismiss}
          >
            ✕
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const triggerInstallPrompt = () => {
  localStorage.setItem('user_has_interacted', 'true');
  window.dispatchEvent(new Event('user_interaction'));
};
