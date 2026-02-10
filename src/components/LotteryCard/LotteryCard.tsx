import { motion } from 'framer-motion';
import { Calendar, Coins, Ticket, TrendingUp } from 'lucide-react';
import Button from '../Button/Button';
import './LotteryCard.css';

interface LotteryCardProps {
  title: string;
  prizePool: string;
  drawDate: string;
  ticketPrice: string;
  participants?: number;
  icon?: 'ticket' | 'coins' | 'trending' | 'calendar';
  onBuyTicket?: () => void;
}

const iconMap = {
  ticket: Ticket,
  coins: Coins,
  trending: TrendingUp,
  calendar: Calendar,
};

function LotteryCard({
  title,
  prizePool,
  drawDate,
  ticketPrice,
  participants = 0,
  icon = 'ticket',
  onBuyTicket,
}: LotteryCardProps) {
  const IconComponent = iconMap[icon];

  return (
    <motion.div
      className="lottery-card"
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <div className="lottery-card-glow"></div>
      
      <div className="lottery-card-header">
        <div className="lottery-icon">
          <IconComponent size={32} />
        </div>
        <h3 className="lottery-title">{title}</h3>
      </div>

      <div className="lottery-card-body">
        <div className="lottery-prize">
          <div className="prize-label">Призовой фонд</div>
          <div className="prize-amount">{prizePool}</div>
        </div>

        <div className="lottery-details">
          <div className="lottery-detail-item">
            <Calendar size={16} />
            <span>{drawDate}</span>
          </div>
          <div className="lottery-detail-item">
            <Coins size={16} />
            <span>{ticketPrice}</span>
          </div>
          {participants > 0 && (
            <div className="lottery-detail-item">
              <TrendingUp size={16} />
              <span>{participants} участников</span>
            </div>
          )}
        </div>
      </div>

      <div className="lottery-card-footer">
        <Button onClick={onBuyTicket} pulse={true} size="medium">
          Купить билет
        </Button>
      </div>

      <motion.div
        className="lottery-card-hover-info"
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <div className="hover-info-text">Нажмите для участия</div>
      </motion.div>
    </motion.div>
  );
}

export default LotteryCard;
