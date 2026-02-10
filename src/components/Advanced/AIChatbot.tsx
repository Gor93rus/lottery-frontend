import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHaptic } from '../../hooks/useHaptic';
import './AIChatbot.css';

interface Message {
  id: string;
  text: string;
  sender: 'bot' | 'user';
  timestamp: Date;
}

interface FAQItem {
  question: string;
  answer: string;
  keywords: string[];
}

const FAQ_DATA: FAQItem[] = [
  {
    question: 'Как купить билет?',
    answer: 'Чтобы купить билет:\n1. Выберите лотерею на главной странице\n2. Нажмите "Выбрать числа" или "Быстрый выбор"\n3. Подключите TON кошелек\n4. Подтвердите транзакцию\n\nВаш билет появится в разделе "Мои билеты"!',
    keywords: ['купить', 'билет', 'как приобрести', 'покупка']
  },
  {
    question: 'Когда следующий розыгрыш?',
    answer: 'Розыгрыши проводятся:\n• TON Million - каждую среду в 20:00 UTC\n• Daily Drop - ежедневно в 18:00 UTC\n• Mega Jackpot - по воскресеньям в 21:00 UTC\n\nТочное время до следующего розыгрыша указано на карточке лотереи.',
    keywords: ['розыгрыш', 'когда', 'время', 'дата']
  },
  {
    question: 'Как пригласить друга?',
    answer: 'Реферальная программа:\n1. Перейдите в раздел "Друзья"\n2. Скопируйте вашу реферальную ссылку\n3. Поделитесь с друзьями\n4. Получайте 10% от их покупок!\n\nБонусы начисляются автоматически при покупке билетов вашими друзьями.',
    keywords: ['пригласить', 'друг', 'реферал', 'бонус']
  },
  {
    question: 'Где мои билеты?',
    answer: 'Ваши билеты находятся:\n1. Раздел "Мои билеты" в меню\n2. На главной странице - блок "Активные билеты"\n3. В вашем профиле\n\nВсе билеты хранятся в блокчейне TON и привязаны к вашему кошельку.',
    keywords: ['билеты', 'где', 'найти', 'мои']
  },
  {
    question: 'Как работают уровни?',
    answer: 'Система уровней:\n• Покупайте билеты и получайте XP\n• Выполняйте ежедневные задания (+50 XP)\n• Приглашайте друзей (+100 XP)\n• Участвуйте в розыгрышах (+25 XP)\n\nКаждый новый уровень дает скидки на билеты и эксклюзивные бонусы!',
    keywords: ['уровень', 'опыт', 'xp', 'прогресс']
  }
];

const QUICK_ACTIONS = [
  '💳 Купить билет',
  '🎫 Мои билеты',
  '⏰ Когда розыгрыш?',
  '👥 Пригласить друга',
  '📊 Мои уровни'
];

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [hasNewTips, setHasNewTips] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { light, medium } = useHaptic();

  useEffect(() => {
    const savedMessages = localStorage.getItem('chatbot_messages');
    if (savedMessages) {
      const parsed = JSON.parse(savedMessages) as Array<{
        id: string;
        text: string;
        sender: 'bot' | 'user';
        timestamp: string;
      }>;
      setMessages(parsed.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    } else {
      setMessages([{
        id: '1',
        text: 'Привет! 👋 Я помогу вам разобраться с лотереей. Задавайте любые вопросы!',
        sender: 'bot',
        timestamp: new Date()
      }]);
    }
  }, []);

  useEffect(() => {
    if (messages.length > 1) {
      const toSave = messages.slice(-10);
      localStorage.setItem('chatbot_messages', JSON.stringify(toSave));
    }
  }, [messages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const findAnswer = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    for (const faq of FAQ_DATA) {
      if (faq.keywords.some(keyword => lowerMessage.includes(keyword))) {
        return faq.answer;
      }
    }

    return 'Извините, я не совсем понял ваш вопрос. 🤔\n\nПопробуйте выбрать один из быстрых вопросов ниже или переформулируйте вопрос.';
  };

  const typeMessage = async (text: string) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const botMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'bot',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);
    light();
  };

  const handleSendMessage = async (text?: string) => {
    const messageText = text || inputValue.trim();
    if (!messageText) return;

    medium();
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');

    const answer = findAnswer(messageText);
    await typeMessage(answer);
  };

  const handleQuickAction = (action: string) => {
    let question = '';
    
    switch (action) {
      case '💳 Купить билет':
        question = 'Как купить билет?';
        break;
      case '🎫 Мои билеты':
        question = 'Где мои билеты?';
        break;
      case '⏰ Когда розыгрыш?':
        question = 'Когда следующий розыгрыш?';
        break;
      case '👥 Пригласить друга':
        question = 'Как пригласить друга?';
        break;
      case '📊 Мои уровни':
        question = 'Как работают уровни?';
        break;
    }

    if (question) {
      handleSendMessage(question);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    setHasNewTips(false);
    medium();
  };

  const handleClose = () => {
    setIsOpen(false);
    light();
  };

  return (
    <>
      <motion.button
        className="chatbot-fab"
        onClick={handleOpen}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { scale: 0 } : { scale: 1 }}
      >
        <span className="chatbot-fab-icon">💬</span>
        {hasNewTips && <span className="chatbot-badge">!</span>}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="chatbot-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              className="chatbot-window"
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="chatbot-header">
                <div className="chatbot-header-info">
                  <div className="chatbot-avatar">🤖</div>
                  <div>
                    <h3 className="chatbot-title">Помощник</h3>
                    <p className="chatbot-status">
                      <span className="status-dot"></span>
                      Онлайн
                    </p>
                  </div>
                </div>
                <button className="chatbot-close" onClick={handleClose}>✕</button>
              </div>

              <div className="chatbot-messages">
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    className={`message message--${message.sender}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="message-bubble">
                      {message.text.split('\n').map((line, i) => (
                        <p key={i}>{line}</p>
                      ))}
                    </div>
                    <span className="message-time">
                      {message.timestamp.toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    className="message message--bot"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="message-bubble typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </motion.div>
                )}
                
                <div ref={messagesEndRef} />
              </div>

              <div className="chatbot-quick-actions">
                {QUICK_ACTIONS.map((action) => (
                  <button
                    key={action}
                    className="quick-action-btn"
                    onClick={() => handleQuickAction(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>

              <div className="chatbot-input-wrapper">
                <input
                  type="text"
                  className="chatbot-input"
                  placeholder="Задайте вопрос..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  className="chatbot-send"
                  onClick={() => handleSendMessage()}
                  disabled={!inputValue.trim()}
                >
                  <span className="send-icon">➤</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
