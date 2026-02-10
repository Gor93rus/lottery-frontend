import { useEffect, useState } from 'react';
import type { UTMParams } from '@/lib/utm';
import { initUTMTracking, getStoredUTMParams, getUTMForAnalytics } from '@/lib/utm';

/**
 * React hook для работы с UTM параметрами
 */
export const useUTM = () => {
  const [utmParams, setUtmParams] = useState<UTMParams>({});
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const params = initUTMTracking();
    setUtmParams(params);
    setIsInitialized(true);
  }, []);

  return {
    utmParams,
    isInitialized,
    hasUTM: Object.keys(utmParams).length > 0,
    getForAnalytics: getUTMForAnalytics,
    refresh: () => setUtmParams(getStoredUTMParams()),
  };
};

export default useUTM;
