import { motion } from 'framer-motion';

interface HeaderProps {
  currency: 'TON' | 'USDT';
  setCurrency: (c: 'TON' | 'USDT') => void;
}

export default function Header({ currency, setCurrency }: HeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-black/40 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl md:text-3xl font-extrabold gradient-text"
        >
          Weekend Millions
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex bg-black/60 rounded-full p-1.5 border border-white/10"
          whileHover={{ scale: 1.05 }}
        >
          <motion.button
            onClick={() => setCurrency('TON')}
            className={`px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
              currency === 'TON'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            whileTap={{ scale: 0.92 }}
          >
            TON
          </motion.button>
          <motion.button
            onClick={() => setCurrency('USDT')}
            className={`px-4 md:px-5 py-2 rounded-full text-sm md:text-base font-medium transition-all duration-300 ${
              currency === 'USDT'
                ? 'bg-gradient-to-r from-green-600 to-emerald-600 shadow-lg shadow-green-500/50 text-white'
                : 'text-gray-300 hover:text-white'
            }`}
            whileTap={{ scale: 0.92 }}
          >
            USDT
          </motion.button>
        </motion.div>
      </div>
    </header>
  );
}
