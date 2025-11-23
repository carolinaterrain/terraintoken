import { useAnalytics } from './useAnalytics';

/**
 * Hook for tracking key feature interactions
 * Tracks only high-value user actions to understand feature usage
 */
export const useFeatureAnalytics = () => {
  const { trackEvent } = useAnalytics();

  const trackButtonClick = (buttonName: string, context?: string) => {
    trackEvent('button_click', {
      button: buttonName,
      context: context || 'unknown',
      timestamp: Date.now()
    });
  };

  const trackWaitlistJoin = (source: string, referralCode?: string) => {
    trackEvent('waitlist_join', {
      source,
      has_referral: !!referralCode,
      timestamp: Date.now()
    });
  };

  const trackTRNAction = (action: 'earn' | 'redeem' | 'claim', metadata?: any) => {
    trackEvent('trn_action', {
      action,
      ...metadata,
      timestamp: Date.now()
    });
  };

  const trackSocialShare = (platform: string, content: string) => {
    trackEvent('social_share', {
      platform,
      content_type: content,
      timestamp: Date.now()
    });
  };

  const trackVideoWatch = (videoId: string, duration?: number) => {
    trackEvent('video_watch', {
      video_id: videoId,
      duration,
      timestamp: Date.now()
    });
  };

  const trackNavigation = (from: string, to: string) => {
    trackEvent('navigation', {
      from,
      to,
      timestamp: Date.now()
    });
  };

  return {
    trackButtonClick,
    trackWaitlistJoin,
    trackTRNAction,
    trackSocialShare,
    trackVideoWatch,
    trackNavigation
  };
};
