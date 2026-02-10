import { useState, useEffect } from 'react';

interface NumberFrequency {
  [key: number]: number;
}

export function useHeatmap(totalNumbers: number = 36) {
  const [numberFrequency, setNumberFrequency] = useState<NumberFrequency>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call - in production, this would fetch from backend
    // GET /api/lottery/weekend-special/heatmap
    const fetchHeatmapData = async () => {
      setIsLoading(true);
      try {
        // Simulated data - replace with actual API call
        const mockFrequency: NumberFrequency = {};
        for (let i = 1; i <= totalNumbers; i++) {
          mockFrequency[i] = Math.floor(Math.random() * 50);
        }
        setNumberFrequency(mockFrequency);
      } catch (error) {
        console.error('Failed to fetch heatmap data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHeatmapData();
  }, [totalNumbers]);

  const getHeatLevel = (number: number): number => {
    const freq = numberFrequency[number] || 0;
    const maxFreq = Math.max(...Object.values(numberFrequency), 1);
    return freq / maxFreq;
  };

  const getHeatColor = (level: number): string => {
    if (level > 0.7) return 'rgba(255, 0, 0, 0.4)';    // 🔥 Hot
    if (level > 0.4) return 'rgba(255, 165, 0, 0.4)'; // 🟠 Warm  
    if (level > 0.2) return 'rgba(255, 255, 0, 0.3)'; // 🟡 Neutral
    return 'rgba(100, 200, 255, 0.3)';                 // 🧊 Cold
  };

  return {
    numberFrequency,
    isLoading,
    getHeatLevel,
    getHeatColor,
  };
}
