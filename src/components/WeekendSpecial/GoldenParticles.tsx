import './GoldenParticles.css';

interface GoldenParticlesProps {
  count?: number;
  enabled?: boolean;
}

export default function GoldenParticles({ count = 20, enabled = true }: GoldenParticlesProps) {
  if (!enabled) return null;

  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    delay: Math.random() * 5,
    duration: 4 + Math.random() * 3,
    x: Math.random() * 100,
    size: 10 + Math.random() * 2, // Reduced from 8-16px to 10-12px
  }));

  return (
    <div className="ws-golden-particles">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="ws-particle"
          style={{
            left: `${particle.x}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
