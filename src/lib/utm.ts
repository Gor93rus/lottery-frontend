/**
 * UTM Tracking для маркетинговой аналитики
 * Отслеживает источники трафика: utm_source, utm_medium, utm_campaign, utm_content, utm_term
 */

export interface UTMParams {
  utm_source?: string;    // Источник: telegram, twitter, facebook, google
  utm_medium?: string;    // Канал: cpc, banner, email, social, referral
  utm_campaign?: string;  // Кампания: launch_2026, promo_feb, black_friday
  utm_content?: string;   // Контент: button_blue, banner_top, link_footer
  utm_term?: string;      // Ключевое слово (для поиска)
  ref?: string;           // Реферальный код
}

const UTM_STORAGE_KEY = 'utm_params';
const UTM_EXPIRY_KEY = 'utm_expiry';
const UTM_EXPIRY_DAYS = 30; // UTM параметры хранятся 30 дней

/**
 * Парсит UTM параметры из URL
 */
export const parseUTMFromURL = (): UTMParams => {
  if (typeof window === 'undefined') return {};
  
  const params = new URLSearchParams(window.location.search);
  const utmParams: UTMParams = {};

  const utmKeys: (keyof UTMParams)[] = [
    'utm_source',
    'utm_medium', 
    'utm_campaign',
    'utm_content',
    'utm_term',
    'ref'
  ];

  utmKeys.forEach(key => {
    const value = params.get(key);
    if (value) {
      utmParams[key] = value;
    }
  });

  return utmParams;
};

/**
 * Сохраняет UTM параметры в localStorage
 */
export const saveUTMParams = (params: UTMParams): void => {
  if (typeof window === 'undefined') return;
  if (Object.keys(params).length === 0) return;

  try {
    // Сохраняем параметры
    localStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(params));
    
    // Устанавливаем срок действия
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + UTM_EXPIRY_DAYS);
    localStorage.setItem(UTM_EXPIRY_KEY, expiry.toISOString());
  } catch (e) {
    console.warn('Failed to save UTM params:', e);
  }
};

/**
 * Получает сохранённые UTM параметры
 */
export const getStoredUTMParams = (): UTMParams => {
  if (typeof window === 'undefined') return {};

  try {
    // Проверяем срок действия
    const expiryStr = localStorage.getItem(UTM_EXPIRY_KEY);
    if (expiryStr) {
      const expiry = new Date(expiryStr);
      if (new Date() > expiry) {
        // Параметры истекли
        clearUTMParams();
        return {};
      }
    }

    const stored = localStorage.getItem(UTM_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (e) {
    console.warn('Failed to get UTM params:', e);
    return {};
  }
};

/**
 * Очищает UTM параметры
 */
export const clearUTMParams = (): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(UTM_STORAGE_KEY);
    localStorage.removeItem(UTM_EXPIRY_KEY);
  } catch (e) {
    console.warn('Failed to clear UTM params:', e);
  }
};

/**
 * Инициализирует UTM tracking
 * Вызывать при загрузке приложения
 */
export const initUTMTracking = (): UTMParams => {
  const urlParams = parseUTMFromURL();
  
  // Если есть новые UTM параметры в URL, сохраняем их
  if (Object.keys(urlParams).length > 0) {
    saveUTMParams(urlParams);
    return urlParams;
  }
  
  // Иначе возвращаем сохранённые
  return getStoredUTMParams();
};

/**
 * Получает все UTM параметры для отправки в analytics
 */
export const getUTMForAnalytics = (): Record<string, string> => {
  const params = getStoredUTMParams();
  const result: Record<string, string> = {};

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      result[key] = value;
    }
  });

  return result;
};

/**
 * Генерирует URL с UTM параметрами
 */
export const buildUTMUrl = (baseUrl: string, params: UTMParams): string => {
  const url = new URL(baseUrl);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

/**
 * Предустановленные UTM конфигурации для разных каналов
 */
export const UTM_PRESETS = {
  telegram_channel: {
    utm_source: 'telegram',
    utm_medium: 'social',
  },
  telegram_ads: {
    utm_source: 'telegram',
    utm_medium: 'cpc',
  },
  twitter: {
    utm_source: 'twitter',
    utm_medium: 'social',
  },
  facebook: {
    utm_source: 'facebook',
    utm_medium: 'social',
  },
  facebook_ads: {
    utm_source: 'facebook',
    utm_medium: 'cpc',
  },
  email: {
    utm_source: 'email',
    utm_medium: 'email',
  },
  referral: {
    utm_source: 'referral',
    utm_medium: 'referral',
  },
} as const;
