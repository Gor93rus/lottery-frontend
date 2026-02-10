import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, User, AlertCircle } from 'lucide-react';
import { adminLogin } from '../../lib/api/adminAuth';
import AnimatedBackground from '../../components/AnimatedBackground/AnimatedBackground';
import './AdminLogin.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [telegramId, setTelegramId] = useState('432735501');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validate input
      if (!telegramId || !password) {
        setError('Please enter both Telegram ID and password');
        setIsLoading(false);
        return;
      }

      // Attempt admin login
      await adminLogin(telegramId, password);

      // Redirect to admin dashboard on success
      navigate('/admin');
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="admin-login-root">
      <AnimatedBackground />
      
      <div className="admin-login-container">
        <motion.div
          className="admin-login-card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="admin-login-header">
            <motion.div
              className="admin-login-icon"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            >
              <Lock size={32} />
            </motion.div>
            <h1 className="admin-login-title">Admin Panel</h1>
            <p className="admin-login-subtitle">Enter your credentials to access the admin dashboard</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              className="admin-login-error"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle size={20} />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Login Form */}
          <form className="admin-login-form" onSubmit={handleSubmit}>
            <div className="admin-login-field">
              <label htmlFor="telegramId" className="admin-login-label">
                <User size={16} />
                Telegram ID
              </label>
              <input
                id="telegramId"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                className="admin-login-input"
                placeholder="Enter your Telegram ID (e.g., 432735501)"
                value={telegramId}
                onChange={(e) => setTelegramId(e.target.value.replace(/\D/g, ''))}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>

            <div className="admin-login-field">
              <label htmlFor="password" className="admin-login-label">
                <Lock size={16} />
                Password
              </label>
              <input
                id="password"
                type="password"
                className="admin-login-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                autoComplete="current-password"
              />
            </div>

            <motion.button
              type="submit"
              className="admin-login-button"
              disabled={isLoading}
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              aria-label={isLoading ? 'Logging in, please wait' : 'Login to admin panel'}
            >
              {isLoading ? (
                <span className="admin-login-loading">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ display: 'inline-block' }}
                    aria-hidden="true"
                  >
                    ⟳
                  </motion.span>
                  <span aria-live="polite">Logging in...</span>
                </span>
              ) : (
                'Login to Admin Panel'
              )}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="admin-login-footer">
            <p className="admin-login-info">
              Admin credentials are required to access this area.
              <br />
              Default admin account: Telegram ID <strong>432735501</strong>
              <br />
              If you need to reset your password, contact the system administrator.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
