import { useState } from 'react';
import { motion } from 'framer-motion';
import Header from '../components/ui/Header';
import Advantages from '../components/ui/Advantages';
import MainLotteryCard from '../components/ui/MainLotteryCard';
import Footer from '../components/ui/Footer';

export default function MainScreen() {
  const [currency, setCurrency] = useState<'TON' | 'USDT'>('TON');

  return (
    <div className="min-h-screen relative overflow-hidden text-white">
      {/* Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black/80" />
        
        {/* Floating orbs */}
        <motion.div
          className="absolute top-20 left-10 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-40 right-10 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"
          animate={{ 
            x: [0, -80, 0],
            y: [0, -60, 0],
            scale: [1, 1.3, 1]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <Header currency={currency} setCurrency={setCurrency} />

      <main className="relative z-10 pt-24 pb-32 px-4">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 gradient-text">
            Выиграй миллионы
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Первая честная лотерея на блокчейне TON. Прозрачно, безопасно, мгновенно.
          </p>
        </motion.div>

        {/* Main Lottery Card */}
        <div className="mb-16 md:mb-24">
          <MainLotteryCard currency={currency} />
        </div>

        {/* Advantages */}
        <Advantages />
      </main>

      <Footer />
    </div>
  );
}
