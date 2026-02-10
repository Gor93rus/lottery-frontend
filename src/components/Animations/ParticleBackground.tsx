import { useEffect, useRef } from 'react';
import './ParticleBackground.css';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedY: number;
  speedX: number;
  opacity: number;
  type: 'coin' | 'star' | 'sparkle';
}

interface ParticleBackgroundProps {
  particleCount?: number;
  enabled?: boolean;
}

function ParticleBackground({ particleCount = 30, enabled = true }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize particles
    const createParticle = (): Particle => {
      const types: Array<'coin' | 'star' | 'sparkle'> = ['coin', 'star', 'sparkle'];
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        size: Math.random() * 20 + 10,
        speedY: Math.random() * 1 + 0.5,
        speedX: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.3,
        type: types[Math.floor(Math.random() * types.length)],
      };
    };

    particlesRef.current = Array.from({ length: particleCount }, createParticle);

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.y += particle.speedY;
        particle.x += particle.speedX;

        // Reset particle if it goes off screen
        if (particle.y > canvas.height) {
          particlesRef.current[index] = createParticle();
          return;
        }

        // Draw particle based on type
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.translate(particle.x, particle.y);

        if (particle.type === 'coin') {
          // Draw TON coin
          ctx.fillStyle = '#0098ea';
          ctx.beginPath();
          ctx.arc(0, 0, particle.size / 2, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.fillStyle = '#ffffff';
          ctx.font = `${particle.size * 0.6}px Arial`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('T', 0, 0);
        } else if (particle.type === 'star') {
          // Draw star
          ctx.fillStyle = '#fbbf24';
          const spikes = 5;
          const outerRadius = particle.size / 2;
          const innerRadius = outerRadius / 2;
          
          ctx.beginPath();
          for (let i = 0; i < spikes * 2; i++) {
            const radius = i % 2 === 0 ? outerRadius : innerRadius;
            const angle = (i * Math.PI) / spikes;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            
            if (i === 0) {
              ctx.moveTo(x, y);
            } else {
              ctx.lineTo(x, y);
            }
          }
          ctx.closePath();
          ctx.fill();
        } else {
          // Draw sparkle
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(-particle.size / 4, -particle.size / 2, particle.size / 2, particle.size);
          ctx.fillRect(-particle.size / 2, -particle.size / 4, particle.size, particle.size / 2);
        }

        ctx.restore();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [particleCount, enabled]);

  if (!enabled) return null;

  return <canvas ref={canvasRef} className="particle-background" />;
}

export default ParticleBackground;
