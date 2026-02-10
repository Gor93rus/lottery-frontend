import { motion } from 'framer-motion';
import { ShieldCheck, Zap, Lock, Scale } from 'lucide-react';

const advantages = [
  { icon: ShieldCheck, title: '100% на блокчейне', desc: 'Полная прозрачность и безопасность TON' },
  { icon: Zap, title: 'Мгновенные выплаты', desc: 'Без задержек, 24/7' },
  { icon: Lock, title: 'Честный рандом VRF', desc: 'Невозможно подделать результат' },
  { icon: Scale, title: 'Низкая цена', desc: 'Билет всего 1 TON' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { y: 60, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function Advantages() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className="py-16 md:py-20 px-4 md:px-6"
    >
      <motion.h2 
        variants={itemVariants}
        className="text-3xl md:text-5xl font-extrabold text-center mb-12 md:mb-16 gradient-text"
      >
        Наши преимущества
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 max-w-7xl mx-auto">
        {advantages.map((adv, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ scale: 1.05, boxShadow: '0 0 40px rgba(168, 85, 247, 0.5)' }}
            className="glass-card p-6 md:p-8 rounded-3xl flex flex-col items-center text-center cursor-pointer"
          >
            <motion.div 
              className="text-4xl md:text-5xl mb-4 md:mb-6 text-purple-400"
              whileHover={{ rotate: 360, scale: 1.2 }}
              transition={{ duration: 0.5 }}
            >
              <adv.icon size={48} />
            </motion.div>
            <h3 className="text-lg md:text-xl font-bold mb-2 md:mb-3 text-white">{adv.title}</h3>
            <p className="text-sm md:text-base text-gray-300">{adv.desc}</p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
