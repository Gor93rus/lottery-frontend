import * as Sentry from '@sentry/react';

export function initSentry() {
  const dsn = import.meta.env.VITE_SENTRY_DSN;
  
  // Только инициализируем если есть DSN
  if (!dsn) {
    console.log('Sentry DSN not configured, skipping initialization');
    return;
  }

  Sentry.init({
    dsn,
    environment: import.meta.env.MODE, // 'development' или 'production'
    
    // Performance Monitoring
    tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0, // 10% в prod, 100% в dev
    
    // Session Replay (только в production, 10% сессий)
    replaysSessionSampleRate: import.meta.env.PROD ? 0.1 : 0,
    replaysOnErrorSampleRate: 1.0, // 100% при ошибках
    
    // Интеграции
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    
    // Фильтрация
    beforeSend(event) {
      // Не отправлять в development
      if (import.meta.env.DEV) {
        console.log('Sentry event (dev mode, not sent):', event);
        return null;
      }
      return event;
    },
    
    // Игнорировать некоторые ошибки
    ignoreErrors: [
      // Игнорируем ошибки расширений браузера
      'ResizeObserver loop limit exceeded',
      'ResizeObserver loop completed with undelivered notifications',
      // Игнорируем отмененные запросы
      'AbortError',
      'cancelled',
    ],
  });

  console.log('✅ Sentry initialized');
}

// Экспорт для использования в компонентах
export { Sentry };
