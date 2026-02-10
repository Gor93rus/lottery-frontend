import type { ReactNode } from 'react';
import './HolographicCard.css';

interface HolographicCardProps {
  children: ReactNode;
  intensity?: 'soft' | 'strong';
  className?: string;
}

function HolographicCard({ 
  children, 
  intensity = 'soft', 
  className = '' 
}: HolographicCardProps) {
  return (
    <div className={`holographic-card holographic-card--${intensity} ${className}`}>
      <div className="holographic-gradient" />
      <div className="holographic-shine holographic-shine--1" />
      <div className="holographic-shine holographic-shine--2" />
      <div className="holographic-noise" />
      <div className="holographic-content">
        {children}
      </div>
    </div>
  );
}

export default HolographicCard;
