/**
 * Login Page
 * Displayed when user is not authenticated via Telegram
 */

import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AnimatedBackground from '../components/AnimatedBackground/AnimatedBackground';

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="login-page">
        <AnimatedBackground />
        <div className="login-container">
          <motion.div
            className="login-spinner"
            animate={{ rotate: 360 }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="url(#login-spinner-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="120 60"
              />
              <defs>
                <linearGradient id="login-spinner-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#df600c" />
                  <stop offset="50%" stopColor="#f45da6" />
                  <stop offset="100%" stopColor="#9e0ac7" />
                </linearGradient>
              </defs>
            </svg>
          </motion.div>
          <p className="login-loading-text">Подключение...</p>
        </div>
        <style>{`
          .login-page {
            position: relative;
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
          }
          .login-container {
            position: relative;
            z-index: 1;
            text-align: center;
            padding: 2rem;
          }
          .login-spinner {
            margin: 0 auto 1.5rem;
          }
          .login-loading-text {
            color: rgba(255, 255, 255, 0.8);
            font-size: 1rem;
            font-weight: 500;
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="login-page">
      <AnimatedBackground />
      <div className="login-container">
        <motion.div
          className="login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="login-icon">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="38" stroke="url(#telegram-gradient)" strokeWidth="4" />
              <path
                d="M20 40L35 55L60 25"
                stroke="url(#telegram-gradient)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="telegram-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#df600c" />
                  <stop offset="50%" stopColor="#f45da6" />
                  <stop offset="100%" stopColor="#9e0ac7" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h1 className="login-title">Открой в Telegram</h1>
          <p className="login-description">
            Это приложение доступно только через Telegram Web App.
            Пожалуйста, откройте его через Telegram бота.
          </p>
          <div className="login-info">
            <p className="login-info-text">
              <strong>Как войти:</strong>
            </p>
            <ol className="login-steps">
              <li>Откройте Telegram</li>
              <li>Найдите бота Weekend Millions</li>
              <li>Нажмите "Запустить приложение"</li>
            </ol>
          </div>
        </motion.div>
      </div>
      <style>{`
        .login-page {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .login-container {
          position: relative;
          z-index: 1;
          padding: 2rem;
          max-width: 500px;
          width: 100%;
        }
        .login-card {
          background: rgba(20, 20, 40, 0.85);
          backdrop-filter: blur(20px);
          border-radius: 24px;
          padding: 3rem 2rem;
          text-align: center;
          border: 1px solid rgba(255, 255, 255, 0.1);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
        }
        .login-icon {
          margin: 0 auto 2rem;
          width: 80px;
          height: 80px;
        }
        .login-title {
          font-size: 2rem;
          font-weight: 700;
          background: linear-gradient(135deg, #df600c 0%, #f45da6 50%, #9e0ac7 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 1rem;
        }
        .login-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 2rem;
        }
        .login-info {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 16px;
          padding: 1.5rem;
          margin-top: 2rem;
        }
        .login-info-text {
          color: rgba(255, 255, 255, 0.9);
          font-weight: 600;
          margin-bottom: 1rem;
        }
        .login-steps {
          text-align: left;
          color: rgba(255, 255, 255, 0.7);
          padding-left: 1.5rem;
          margin: 0;
        }
        .login-steps li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }
      `}</style>
    </div>
  );
}
