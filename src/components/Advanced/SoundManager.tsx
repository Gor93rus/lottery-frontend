import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface SoundSettings {
  enabled: boolean;
  volume: number;
}

interface SoundContextType {
  settings: SoundSettings;
  toggleSound: () => void;
  setVolume: (volume: number) => void;
  playSound: (soundName: SoundName) => void;
}

type SoundName = 'click' | 'purchase' | 'win' | 'lose' | 'levelUp' | 'achievement';

const SoundContext = createContext<SoundContextType | undefined>(undefined);

// Simple Web Audio API sound generator
const playBeep = (frequency: number, duration: number, volume: number) => {
  const AudioContextClass = window.AudioContext || (window as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return;
  const audioContext = new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export function SoundProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SoundSettings>(() => {
    const saved = localStorage.getItem('soundSettings');
    return saved ? JSON.parse(saved) : { enabled: true, volume: 0.5 };
  });

  const toggleSound = useCallback(() => {
    setSettings((prev) => {
      const newSettings = { ...prev, enabled: !prev.enabled };
      localStorage.setItem('soundSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  const setVolume = useCallback((volume: number) => {
    setSettings((prev) => {
      const newSettings = { ...prev, volume: Math.max(0, Math.min(1, volume)) };
      localStorage.setItem('soundSettings', JSON.stringify(newSettings));
      return newSettings;
    });
  }, []);

  const playSound = useCallback(
    (soundName: SoundName) => {
      if (!settings.enabled) return;

      // Simple sound effects using Web Audio API
      const { volume } = settings;

      switch (soundName) {
        case 'click':
          playBeep(800, 0.05, volume * 0.3);
          break;
        case 'purchase':
          // Coin sound - two tones
          playBeep(1200, 0.1, volume * 0.4);
          setTimeout(() => playBeep(1400, 0.1, volume * 0.4), 80);
          break;
        case 'win':
          // Fanfare - ascending tones
          playBeep(523, 0.15, volume * 0.5);
          setTimeout(() => playBeep(659, 0.15, volume * 0.5), 100);
          setTimeout(() => playBeep(784, 0.25, volume * 0.5), 200);
          break;
        case 'lose':
          // Descending tone
          playBeep(400, 0.3, volume * 0.3);
          break;
        case 'levelUp':
          // Triumphant sound
          playBeep(523, 0.1, volume * 0.5);
          setTimeout(() => playBeep(659, 0.1, volume * 0.5), 80);
          setTimeout(() => playBeep(784, 0.1, volume * 0.5), 160);
          setTimeout(() => playBeep(1047, 0.3, volume * 0.6), 240);
          break;
        case 'achievement':
          // Bell-like sound
          playBeep(1047, 0.2, volume * 0.5);
          setTimeout(() => playBeep(1319, 0.2, volume * 0.5), 100);
          break;
      }
    },
    [settings]
  );

  return (
    <SoundContext.Provider value={{ settings, toggleSound, setVolume, playSound }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSound() {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error('useSound must be used within SoundProvider');
  }
  return context;
}
