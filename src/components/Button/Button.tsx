import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import './Button.css';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  className?: string;
  icon?: ReactNode;
  pulse?: boolean;
}

function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  className = '',
  icon,
  pulse = false,
}: ButtonProps) {
  return (
    <motion.button
      className={`custom-btn custom-btn-${variant} custom-btn-${size} ${pulse ? 'pulse' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.03 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <span className="btn-content">
        {icon && <span className="btn-icon">{icon}</span>}
        <span className="btn-text">{children}</span>
      </span>
      <span className="btn-ripple"></span>
    </motion.button>
  );
}

export default Button;
