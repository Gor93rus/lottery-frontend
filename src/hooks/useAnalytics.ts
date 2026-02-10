import { useCallback } from 'react';
import { analytics, trackEvent } from '@/lib/posthog';
import { marketing } from '@/lib/marketing';
import { useUTM } from './useUTM';

export const useAnalytics = () => {
  const { utmParams, getForAnalytics } = useUTM();

  const track = useCallback((eventName: string, properties?: Record<string, unknown>) => {
    // Automatically add UTM parameters to each event
    trackEvent(eventName, {
      ...getForAnalytics(),
      ...properties,
    });
  }, [getForAnalytics]);

  return {
    track,
    utmParams,
    ...analytics,
    marketing,
  };
};

export default useAnalytics;
