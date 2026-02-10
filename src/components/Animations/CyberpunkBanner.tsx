import { useEffect, useRef } from 'react';
import './CyberpunkBanner.css';

interface CyberpunkBannerProps {
  title: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  className?: string;
}

function CyberpunkBanner({ 
  title, 
  description, 
  ctaText, 
  onCtaClick,
  className = '' 
}: CyberpunkBannerProps) {
  const scanLineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scanLine = scanLineRef.current;
    if (!scanLine) return;

    let position = 0;
    let direction = 1;

    const moveScanLine = () => {
      position += direction * 0.5;
      
      if (position >= 100) {
        direction = -1;
      } else if (position <= 0) {
        direction = 1;
      }

      scanLine.style.top = `${position}%`;
    };

    const intervalId = setInterval(moveScanLine, 16);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className={`cyberpunk-banner ${className}`}>
      {/* Animated SVG Borders */}
      <svg className="cyberpunk-border" viewBox="0 0 100 100" preserveAspectRatio="none">
        <rect 
          className="border-line border-line--cyan" 
          x="0" 
          y="0" 
          width="100" 
          height="100" 
          fill="none" 
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <rect 
          className="border-line border-line--magenta" 
          x="0" 
          y="0" 
          width="100" 
          height="100" 
          fill="none" 
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
        <rect 
          className="border-line border-line--yellow" 
          x="0" 
          y="0" 
          width="100" 
          height="100" 
          fill="none" 
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Scanning line */}
      <div ref={scanLineRef} className="scan-line" />

      {/* Grain/noise texture */}
      <div className="cyberpunk-noise" />

      {/* Content */}
      <div className="cyberpunk-content">
        <h2 className="cyberpunk-title">
          {title}
        </h2>
        
        {description && (
          <p className="cyberpunk-description">
            {description}
          </p>
        )}

        {ctaText && onCtaClick && (
          <button 
            className="cyberpunk-cta"
            onClick={onCtaClick}
          >
            <span className="cyberpunk-cta__text">{ctaText}</span>
            <span className="cyberpunk-cta__glitch" aria-hidden="true">{ctaText}</span>
          </button>
        )}
      </div>

      {/* Corner accents */}
      <div className="corner-accent corner-accent--tl" />
      <div className="corner-accent corner-accent--tr" />
      <div className="corner-accent corner-accent--bl" />
      <div className="corner-accent corner-accent--br" />
    </div>
  );
}

export default CyberpunkBanner;
