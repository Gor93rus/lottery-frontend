import { useEffect, useState } from 'react';
import './GlitchText.css';

interface GlitchTextProps {
  text: string;
  trigger?: 'hover' | 'auto' | 'on-update';
  intensity?: 'soft' | 'strong';
  className?: string;
}

function GlitchText({ 
  text, 
  trigger = 'auto', 
  intensity = 'soft',
  className = '' 
}: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(false);
  const [prevText, setPrevText] = useState(text);

  useEffect(() => {
    if (trigger === 'on-update' && text !== prevText) {
      setPrevText(text);
      setIsGlitching(true);
      const duration = intensity === 'strong' ? 2000 : 1000;
      const timer = setTimeout(() => setIsGlitching(false), duration);
      return () => clearTimeout(timer);
    }
  }, [text, trigger, intensity, prevText]);

  useEffect(() => {
    if (trigger === 'auto') {
      const glitchInterval = setInterval(() => {
        setIsGlitching(true);
        const duration = intensity === 'strong' ? 1500 : 800;
        setTimeout(() => setIsGlitching(false), duration);
      }, 8000 + Math.random() * 4000);

      return () => clearInterval(glitchInterval);
    }
  }, [trigger, intensity]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      setIsGlitching(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      setIsGlitching(false);
    }
  };

  return (
    <div 
      className={`glitch-text ${isGlitching ? 'glitch-text--active' : ''} glitch-text--${intensity} ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="glitch-text__main" data-text={text}>
        {text}
      </div>
      <div className="glitch-text__layer glitch-text__layer--red" data-text={text} aria-hidden="true">
        {text}
      </div>
      <div className="glitch-text__layer glitch-text__layer--cyan" data-text={text} aria-hidden="true">
        {text}
      </div>
    </div>
  );
}

export default GlitchText;
