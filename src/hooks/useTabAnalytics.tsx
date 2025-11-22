import { useEffect, useRef } from 'react';
import { useAnalytics } from './useAnalytics';

export const useTabAnalytics = (page: string, activeTab: string) => {
  const { trackEvent } = useAnalytics();
  const previousTab = useRef<string>('');
  const startTime = useRef<number>(Date.now());

  useEffect(() => {
    // Track tab view
    trackEvent('tab_view', {
      page,
      tab_name: activeTab,
      timestamp: Date.now()
    });

    // Track tab switch if not initial load
    if (previousTab.current && previousTab.current !== activeTab) {
      const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
      trackEvent('tab_switch', {
        page,
        from_tab: previousTab.current,
        to_tab: activeTab,
        time_spent: timeSpent
      });
    }

    previousTab.current = activeTab;
    startTime.current = Date.now();
  }, [activeTab, page, trackEvent]);

  // Track time spent on unmount
  useEffect(() => {
    return () => {
      if (previousTab.current) {
        const timeSpent = Math.round((Date.now() - startTime.current) / 1000);
        trackEvent('tab_exit', {
          page,
          tab_name: previousTab.current,
          time_spent: timeSpent
        });
      }
    };
  }, [page, trackEvent]);
};
