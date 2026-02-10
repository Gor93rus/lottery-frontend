import { motion } from 'framer-motion';
import { Sparkles, Clock, Ticket } from 'lucide-react';

interface Props {
  currency: 'TON' | 'USDT';
}

export default function MainLotteryCard({ currency }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 50 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="glass-card max-w-4xl mx-auto p-8 md:p-16 rounded-3xl border border-purple-500/30 relative overflow-hidden"
    >
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-pink-900/10 to-purple-900/20 animate-pulse" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            initial={{ 
              x: Math.random() * 100 + '%', 
              y: '100%',
              opacity: 0 
            }}
            animate={{ 
              y: '-100%',
              opacity: [0, 1, 0]
            }}
            transition={{ 
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <motion.h2 
          className="text-4xl md:text-7xl font-extrabold text-center mb-8 md:mb-12 gradient-text"
          animate={{ 
            textShadow: [
              '0 0 20px rgba(167, 139, 250, 0.5)',
              '0 0 40px rgba(236, 72, 153, 0.5)',
              '0 0 20px rgba(167, 139, 250, 0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Weekend Millions
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10 text-center mb-12 md:mb-16">
          <motion.div 
            className="glass-card p-6 rounded-2xl"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="mx-auto mb-3 text-yellow-400" size={32} />
            <p className="text-sm md:text-lg text-gray-400 mb-2">Призовой фонд</p>
            <p className="text-3xl md:text-5xl font-bold text-purple-300">
              {currency === 'TON' ? '1000 TON' : '3000 USDT'}
            </p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-2xl"
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="mx-auto mb-3 text-blue-400" size={32} />
            <p className="text-sm md:text-lg text-gray-400 mb-2">Розыгрыш</p>
            <p className="text-xl md:text-3xl font-semibold text-white">Воскресенье 20:00</p>
          </motion.div>
          
          <motion.div 
            className="glass-card p-6 rounded-2xl"
            whileHover={{ scale: 1.05 }}
          >
            <Ticket className="mx-auto mb-3 text-green-400" size={32} />
            <p className="text-sm md:text-lg text-gray-400 mb-2">Билет</p>
            <p className="text-3xl md:text-5xl font-bold text-green-400">1 TON</p>
          </motion.div>
        </div>

        <motion.button
          whileHover={{ 
            scale: 1.05, 
            boxShadow: '0 0 60px rgba(168, 85, 247, 0.8)' 
          }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-5 md:py-7 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 rounded-2xl text-xl md:text-3xl font-extrabold shadow-2xl shadow-purple-600/50 text-white relative overflow-hidden group"
        >
          <span className="relative z-10">🎟️ Купить билет</span>
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-pink-600"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.5 }}
          />
        </motion.button>
      </div>
    </motion.div>
  );
}
