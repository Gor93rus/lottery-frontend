import { motion, AnimatePresence } from 'framer-motion';
import { Home, Archive, User, Info, X } from 'lucide-react';
import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import type { Theme } from '../../context/ThemeContext';

export default function Footer() {
  const { theme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = [
    { icon: Home, label: 'Главная', action: () => {} },
    { icon: Archive, label: 'Архив', action: () => {} },
    { icon: User, label: 'Профиль', action: () => setProfileOpen(true) },
    { icon: Info, label: 'Инфо', action: () => {} },
  ];

  return (
    <>
      <footer className="fixed bottom-0 left-0 right-0 z-40 backdrop-blur-2xl bg-black/70 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-around items-center">
          {navItems.map((item, i) => (
            <motion.button
              key={i}
              whileTap={{ scale: 0.85 }}
              whileHover={{ scale: 1.1 }}
              onClick={item.action}
              className="flex flex-col items-center gap-1 text-purple-400 hover:text-purple-300 transition-colors"
            >
              <item.icon size={28} />
              <span className="text-xs">{item.label}</span>
            </motion.button>
          ))}
        </div>
      </footer>

      {/* Profile Bottom Sheet */}
      <AnimatePresence>
        {profileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setProfileOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            
            {/* Sheet */}
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-x-0 bottom-0 z-50 max-h-[85vh] bg-gradient-to-t from-black via-gray-900 to-gray-900/95 rounded-t-3xl border-t border-white/10 overflow-y-auto"
            >
              <div className="p-6 md:p-8">
                {/* Handle */}
                <div className="w-12 h-1.5 bg-gray-600 rounded-full mx-auto mb-6" />
                
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl md:text-4xl font-bold gradient-text">
                    Профиль
                  </h2>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setProfileOpen(false)} 
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  >
                    <X size={24} className="text-gray-400" />
                  </motion.button>
                </div>

                {/* Connect Wallet */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl text-lg md:text-xl font-bold mb-8 shadow-lg shadow-purple-600/40 text-white"
                >
                  🔗 Подключить кошелёк TON
                </motion.button>

                {/* Balances */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                  <motion.div 
                    className="glass-card p-5 rounded-2xl text-center"
                    whileHover={{ scale: 1.03 }}
                  >
                    <p className="text-sm text-gray-400 mb-2">Баланс TON</p>
                    <p className="text-2xl md:text-3xl font-bold text-purple-300">0.00</p>
                  </motion.div>
                  <motion.div 
                    className="glass-card p-5 rounded-2xl text-center"
                    whileHover={{ scale: 1.03 }}
                  >
                    <p className="text-sm text-gray-400 mb-2">Баланс USDT</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-300">0.00</p>
                  </motion.div>
                </div>

                {/* Theme Selector */}
                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-bold mb-4 text-white">🎨 Темы оформления</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {([
                      { key: 'default', label: '🌟 Стандарт', color: 'purple' },
                      { key: 'new-year', label: '🎄 Новый год', color: 'yellow' },
                      { key: 'halloween', label: '🎃 Хэллоуин', color: 'red' },
                    ] as const).map((t) => (
                      <motion.button
                        key={t.key}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTheme(t.key as Theme)}
                        className={`p-4 rounded-xl text-center glass-card text-sm md:text-base ${
                          theme === t.key 
                            ? 'border-2 border-purple-500 shadow-lg shadow-purple-500/30' 
                            : 'border border-white/10'
                        }`}
                      >
                        {t.label}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Withdraw Button */}
                <motion.button
                  whileHover={{ scale: 1.02, boxShadow: '0 0 30px rgba(34, 197, 94, 0.5)' }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-5 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl text-lg md:text-xl font-bold shadow-lg shadow-green-600/40 text-white"
                >
                  💰 Вывод средств
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
