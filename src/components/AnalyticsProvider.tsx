import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '@/lib/posthog';

interface AnalyticsProviderProps {
  children: React.ReactNode;
}

export const AnalyticsProvider: React.FC<AnalyticsProviderProps> = ({ children }) => {
  const location = useLocation();

  // Track page views on route change
  useEffect(() => {
    analytics.pageView(location.pathname, {
      search: location.search,
      hash: location.hash,
    });
  }, [location]);

  return <>{children}</>;
};

export default AnalyticsProvider;
