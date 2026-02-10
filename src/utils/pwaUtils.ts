export const registerServiceWorker = async (): Promise<ServiceWorkerRegistration | null> => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });
      
      console.log('Service Worker registered:', registration);
      return registration;
    } catch (error) {
      console.error('Service Worker registration failed:', error);
      return null;
    }
  }
  return null;
};

export const unregisterServiceWorker = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      return await registration.unregister();
    }
  }
  return false;
};

export const checkForUpdates = async (): Promise<boolean> => {
  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.update();
      return true;
    }
  }
  return false;
};

export const isPWA = (): boolean => {
  return window.matchMedia('(display-mode: standalone)').matches ||
         (window.navigator as { standalone?: boolean }).standalone === true ||
         document.referrer.includes('android-app://');
};

export const isIOS = (): boolean => {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as { MSStream?: unknown }).MSStream;
};

export const isAndroid = (): boolean => {
  return /Android/.test(navigator.userAgent);
};

export const getInstallInstructions = (): string => {
  if (isIOS()) {
    return 'Нажмите кнопку "Поделиться" и выберите "На экран Домой"';
  }
  if (isAndroid()) {
    return 'Нажмите меню браузера и выберите "Установить приложение"';
  }
  return 'Нажмите кнопку "Установить" в адресной строке браузера';
};

export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!('Notification' in window)) {
    console.warn('Notifications not supported');
    return 'denied';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission;
  }

  return Notification.permission;
};

export const showNotification = async (
  title: string,
  options?: NotificationOptions
): Promise<void> => {
  if (Notification.permission !== 'granted') {
    return;
  }

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.getRegistration();
    if (registration) {
      await registration.showNotification(title, {
        icon: '/icon-192x192.png',
        badge: '/badge-72x72.png',
        ...options
      });
      return;
    }
  }

  new Notification(title, {
    icon: '/icon-192x192.png',
    ...options
  });
};

export const scheduleNotification = (
  title: string,
  options: NotificationOptions,
  delayMs: number
): number => {
  return window.setTimeout(() => {
    showNotification(title, options);
  }, delayMs);
};

export const clearScheduledNotification = (timeoutId: number): void => {
  clearTimeout(timeoutId);
};
