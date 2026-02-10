import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api/client';
import { useAuth } from '../contexts/AuthContext';
import { useLotteryTransaction } from '../lib/ton/useTonConnect';
import { useTelegram } from '../lib/telegram/useTelegram';
import type { Lottery, Draw } from '../types/api';

export default function WeekendSpecial() {
  const { user, isAuthenticated } = useAuth();
  const { buyTicket: sendTonTransaction } = useLotteryTransaction();
  const { webApp } = useTelegram();
  
  const [lottery, setLottery] = useState<Lottery | null>(null);
  const [nextDraw, setNextDraw] = useState<Draw | null>(null);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [myTickets, setMyTickets] = useState<Array<{
    id: string;
    numbers: number[];
    purchasedAt: string;
  }>>([]);

  useEffect(() => {
    loadLotteryInfo();
    if (isAuthenticated) {
      loadMyTickets();
    }
  }, [isAuthenticated]);

  const loadLotteryInfo = async () => {
    try {
      const response = await apiClient.getLotteryInfo('weekend-special');
      setLottery(response.lottery);
      setNextDraw(response.nextDraw);
    } catch (error) {
      console.error('Failed to load lottery:', error);
    }
  };

  const loadMyTickets = async () => {
    try {
      const response = await apiClient.getMyTickets('weekend-special');
      setMyTickets(response.tickets);
    } catch (error) {
      console.error('Failed to load tickets:', error);
    }
  };

  const toggleNumber = (num: number) => {
    if (!lottery) return;

    webApp?.HapticFeedback.selectionChanged();

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < lottery.numbersToSelect) {
      setSelectedNumbers([...selectedNumbers, num].sort((a, b) => a - b));
    } else {
      webApp?.HapticFeedback.notificationOccurred('warning');
    }
  };

  const handleBuyTicket = async () => {
    if (!lottery || !user) return;

    if (selectedNumbers.length !== lottery.numbersToSelect) {
      alert(`Выберите ${lottery.numbersToSelect} чисел`);
      return;
    }

    if (!user.tonWallet) {
      alert('Подключите TON кошелёк');
      return;
    }

    try {
      setIsLoading(true);
      webApp?.HapticFeedback.impactOccurred('medium');

      // 1. Отправляем TON транзакцию
      const txHash = await sendTonTransaction(
        lottery.lotteryWallet || import.meta.env.VITE_LOTTERY_WALLET,
        lottery.ticketPrice.toString(),
        selectedNumbers
      );

      // 2. Регистрируем билет на backend
      await apiClient.buyTicket(
        'weekend-special',
        selectedNumbers,
        txHash
      );

      webApp?.HapticFeedback.notificationOccurred('success');
      alert('Билет успешно куплен! 🎉');

      // 3. Обновляем список билетов
      setSelectedNumbers([]);
      await loadMyTickets();
    } catch (error: unknown) {
      console.error('Buy ticket failed:', error);
      webApp?.HapticFeedback.notificationOccurred('error');
      alert('Ошибка покупки билета: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsLoading(false);
    }
  };

  if (!lottery) {
    return <div className="p-4">Загрузка...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          {lottery.name}
        </h1>
        <p className="text-purple-200">{lottery.description}</p>
        <div className="mt-4 text-yellow-300 text-2xl font-bold">
          💰 Джекпот: {lottery.currentJackpot} TON
        </div>
      </div>

      {/* Next Draw Info */}
      {nextDraw && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 text-white">
          <div className="text-sm text-purple-200">Следующий розыгрыш:</div>
          <div className="text-xl font-bold">
            {new Date(nextDraw.scheduledAt).toLocaleString('ru-RU')}
          </div>
        </div>
      )}

      {/* Number Selection */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
        <h2 className="text-white text-xl font-bold mb-4">
          Выберите {lottery.numbersToSelect} чисел из {lottery.numbersPool}
        </h2>
        
        <div className="grid grid-cols-6 gap-2 mb-4">
          {Array.from({ length: lottery.numbersPool }, (_, i) => i + 1).map((num) => (
            <button
              key={num}
              onClick={() => toggleNumber(num)}
              disabled={isLoading}
              className={`
                aspect-square rounded-lg font-bold text-lg transition-all
                ${selectedNumbers.includes(num)
                  ? 'bg-yellow-400 text-purple-900 scale-110 shadow-lg'
                  : 'bg-white/20 text-white hover:bg-white/30'
                }
                ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
              `}
            >
              {num}
            </button>
          ))}
        </div>

        <div className="text-white text-center mb-4">
          Выбрано: {selectedNumbers.length} / {lottery.numbersToSelect}
        </div>

        {selectedNumbers.length > 0 && (
          <div className="flex gap-2 justify-center mb-4">
            {selectedNumbers.map((num) => (
              <div
                key={num}
                className="w-12 h-12 bg-yellow-400 text-purple-900 rounded-full flex items-center justify-center font-bold text-lg"
              >
                {num}
              </div>
            ))}
          </div>
        )}

        <button
          onClick={handleBuyTicket}
          disabled={
            isLoading ||
            selectedNumbers.length !== lottery.numbersToSelect ||
            !isAuthenticated
          }
          className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-purple-900 font-bold py-4 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
        >
          {isLoading
            ? '⏳ Покупка...'
            : `🎫 Купить билет за ${lottery.ticketPrice} TON`}
        </button>
      </div>

      {/* Prize Structure */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 mb-6">
        <h2 className="text-white text-xl font-bold mb-4">💎 Призы</h2>
        <div className="space-y-2">
          {lottery.prizeStructure && Object.entries(lottery.prizeStructure)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([matches, prize]) => (
              <div
                key={matches}
                className="flex justify-between items-center text-white bg-white/5 rounded-lg p-3"
              >
                <span>
                  {matches === '5' && '💎'} {matches} из 5 совпадений
                </span>
                <span className="font-bold text-yellow-300">
                  {typeof prize === 'number' ? `${prize} TON` : '🎫 Бесплатный билет'}
                </span>
              </div>
            ))}
        </div>
      </div>

      {/* My Tickets */}
      {isAuthenticated && myTickets.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6">
          <h2 className="text-white text-xl font-bold mb-4">
            🎫 Мои билеты ({myTickets.length})
          </h2>
          <div className="space-y-3">
            {myTickets.map((ticket) => (
              <div
                key={ticket.id}
                className="bg-white/5 rounded-lg p-4"
              >
                <div className="flex gap-2 mb-2">
                  {ticket.numbers.map((num: number, idx: number) => (
                    <div
                      key={idx}
                      className="w-10 h-10 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold"
                    >
                      {num}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-purple-200">
                  {new Date(ticket.purchasedAt).toLocaleString('ru-RU')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
