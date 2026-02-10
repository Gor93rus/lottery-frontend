import { useMemo } from 'react';
import { motion } from 'framer-motion';
import './AnimatedBackground.css';

function AnimatedBackground() {
  // Generate random particles once and memoize
  const particles = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 10 + Math.random() * 10,
      })),
    // Empty deps array is intentional - we only want to generate particles once
    []
  );

  return (
    <div className="animated-background">
      {/* Gradient orbs */}
      <div className="gradient-orbs">
        <motion.div
          className="gradient-orb orb-1"
          animate={{
            x: [0, 100, 50, 0],
            y: [0, -50, 50, 0],
            scale: [1, 1.2, 0.8, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="gradient-orb orb-2"
          animate={{
            x: [0, -80, -40, 0],
            y: [0, 60, -30, 0],
            scale: [1, 0.8, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="gradient-orb orb-3"
          animate={{
            x: [0, 60, -20, 0],
            y: [0, -80, 40, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="gradient-orb orb-4"
          animate={{
            x: [0, -70, 30, 0],
            y: [0, 50, -60, 0],
            scale: [1, 0.9, 1.2, 1],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Grid pattern */}
      <div className="grid-pattern"></div>

      {/* Falling particles */}
      <div className="particles">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="particle"
            style={{
              left: `${particle.left}%`,
            }}
            animate={{
              y: ['0vh', '100vh'],
              opacity: [0, 1, 1, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      {/* Light rays */}
      <div className="light-rays">
        <motion.div
          className="light-ray ray-1"
          animate={{
            opacity: [0.1, 0.3, 0.1],
            scaleY: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="light-ray ray-2"
          animate={{
            opacity: [0.1, 0.25, 0.1],
            scaleY: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            delay: 1,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>
    </div>
  );
}

export default AnimatedBackground;
