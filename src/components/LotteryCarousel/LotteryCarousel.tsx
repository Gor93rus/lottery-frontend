import { useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import LotteryCard from '../LotteryCard/LotteryCard';
import './LotteryCarousel.css';

interface Lottery {
  id: string;
  title: string;
  prizePool: string;
  drawDate: string;
  ticketPrice: string;
  participants?: number;
  icon?: 'ticket' | 'coins' | 'trending' | 'calendar';
}

interface LotteryCarouselProps {
  lotteries: Lottery[];
  onBuyTicket?: (lotteryId: string) => void;
}

function LotteryCarousel({ lotteries, onBuyTicket }: LotteryCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollXProgress } = useScroll({ container: containerRef });
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const handleScroll = (direction: 'left' | 'right') => {
    if (containerRef.current) {
      const scrollAmount = containerRef.current.clientWidth * 0.8;
      containerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="lottery-carousel-wrapper" ref={ref}>
      <motion.div
        className="carousel-header"
        initial={{ opacity: 0, y: -20 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="carousel-title">Активные лотереи</h2>
        <p className="carousel-subtitle">Выберите лотерею и попытайте удачу</p>
      </motion.div>

      <div className="lottery-carousel-container">
        <motion.button
          className="carousel-nav-btn carousel-nav-left"
          onClick={() => handleScroll('left')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={24} />
        </motion.button>

        <motion.div
          ref={containerRef}
          className="lottery-carousel-track"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {lotteries.map((lottery, index) => (
            <motion.div
              key={`${lottery.id}-${lottery.prizePool}`}
              className="lottery-carousel-item"
              initial={{ opacity: 0, x: 50 }}
              animate={inView ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
              transition={{ duration: 0.5, delay: Math.min(index * 0.1, 0.4) }}
            >
              <LotteryCard
                {...lottery}
                onBuyTicket={() => onBuyTicket?.(lottery.id)}
              />
            </motion.div>
          ))}
        </motion.div>

        <motion.button
          className="carousel-nav-btn carousel-nav-right"
          onClick={() => handleScroll('right')}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      <div className="carousel-progress">
        <motion.div
          className="carousel-progress-bar"
          style={{ scaleX: scrollXProgress }}
        />
      </div>
    </div>
  );
}

export default LotteryCarousel;
