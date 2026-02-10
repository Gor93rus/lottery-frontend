# 🎰 Weekend Millions - TON Blockchain Lottery

Криптовалютная лотерея на блокчейне TON с Telegram Mini App интеграцией.

## ✨ Особенности

- 🎫 **Лотереи** — участвуйте в розыгрышах и выигрывайте TON
- 🔐 **Provably Fair** — честные розыгрыши с криптографической верификацией
- 📱 **Telegram Mini App** — удобный доступ прямо из Telegram
- 💎 **TON Connect** — безопасное подключение кошелька
- 🎮 **Геймификация** — уровни, достижения, daily streaks
- 🌍 **Мультиязычность** — русский и английский интерфейс

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build
```

## 🔧 Конфигурация

Скопируйте `.env.example` в `.env.local` и настройте:

```env
VITE_API_URL="http://localhost:3001/api"
VITE_TON_NETWORK="testnet"
VITE_APP_URL="http://localhost:5173"
```

## 📦 Технологии

| Категория | Технологии |
|-----------|------------|
| Frontend | React 18, TypeScript, Vite |
| Стили | Tailwind CSS, Framer Motion |
| Web3 | TON Connect, @ton/core |
| State | TanStack Query, React Context |
| i18n | i18next |
| Мониторинг | Sentry, PostHog |

## 🏗️ Структура проекта

```
src/
├── components/     # UI компоненты
├── pages/          # Страницы приложения
├── hooks/          # React hooks
├── contexts/       # Context providers
├── services/       # API сервисы
├── lib/            # Утилиты и конфигурации
├── styles/         # CSS стили
├── types/          # TypeScript типы
└── i18n/           # Локализация
```

## 🔗 Связанные репозитории

- [lottery-backend](https://github.com/bobby-singer89/lottery-backend) — Backend API

## 📊 Analytics

Проект использует PostHog для product analytics.

### Настройка

1. Создай аккаунт на [PostHog](https://posthog.com)
2. Создай проект
3. Скопируй Project API Key
4. Добавь в `.env`:
   ```env
   VITE_POSTHOG_KEY=phc_your_key_here
   VITE_POSTHOG_HOST=https://eu.posthog.com
   ```

### Отслеживаемые события

- `user_login` / `user_logout`
- `lottery_viewed`
- `numbers_selected`
- `purchase_started` / `purchase_completed` / `purchase_failed`
- `wallet_connected` / `wallet_disconnected`
- `draw_viewed` / `draw_verified`
- `achievement_unlocked`
- `level_up`
- `referral_link_copied` / `referral_link_shared`

## 📢 Marketing & UTM Tracking

### UTM Параметры

Приложение автоматически отслеживает UTM параметры из URL:

| Параметр | Описание | Пример |
|----------|----------|--------|
| `utm_source` | Источник трафика | telegram, twitter, facebook |
| `utm_medium` | Канал | cpc, social, email, referral |
| `utm_campaign` | Название кампании | launch_2026, promo_feb |
| `utm_content` | Вариант контента | button_blue, banner_v2 |
| `utm_term` | Ключевое слово | lottery, crypto |
| `ref` | Реферальный код | abc123 |

### Примеры ссылок для кампаний

**Telegram канал:**
```
https://t.me/your_bot?start=ref_CODE&utm_source=telegram&utm_medium=social&utm_campaign=launch
```

**Telegram Ads:**
```
https://t.me/your_bot?start=ref_CODE&utm_source=telegram&utm_medium=cpc&utm_campaign=feb_promo
```

**Twitter:**
```
https://t.me/your_bot?start=ref_CODE&utm_source=twitter&utm_medium=social&utm_campaign=giveaway
```

### Конверсии

Отслеживаемые конверсии:
- `conversion_signup` — Регистрация
- `conversion_first_purchase` — Первая покупка
- `conversion_deposit` — Первый депозит
- `conversion_referral_signup` — Регистрация по реферальной ссылке

### Интеграция с PostHog

Все UTM данные автоматически отправляются в PostHog и доступны в:
- **Insights** → фильтр по `utm_source`, `utm_campaign`
- **Funnels** → анализ конверсий по каналам
- **Retention** → retention по источникам

## 📄 Документация

- [Setup Guide](./SETUP_GUIDE.md) — Инструкция по настройке
- [PWA Setup](./PWA_SETUP.md) — Настройка PWA
- [Quick Start](./QUICK_START.md) — Быстрый старт

## 📝 Лицензия

MIT License

## 📞 Контакты

- Telegram: [@weekend_millions_support](https://t.me/weekend_millions_support)
