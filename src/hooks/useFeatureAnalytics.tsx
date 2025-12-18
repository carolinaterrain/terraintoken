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

  const trackTRNAction = (action: 'earn' | 'redeem' | 'claim', metadata?: Record<string, unknown>) => {
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

  // NEW: Whitepaper download tracking
  const trackWhitepaperDownload = (action: 'download' | 'view', source?: string) => {
    trackEvent('whitepaper_download', {
      action,
      source: source || 'whitepaper_page',
      timestamp: Date.now()
    });
  };

  // NEW: Buy button click tracking
  const trackBuyButtonClick = (exchange: string, source: string) => {
    trackEvent('buy_button_click', {
      exchange,
      source,
      timestamp: Date.now()
    });
  };

  // NEW: Wallet connection tracking
  const trackWalletConnect = (
    status: 'attempt' | 'success' | 'failure', 
    walletType?: string,
    errorMessage?: string
  ) => {
    trackEvent('wallet_connect', {
      status,
      wallet_type: walletType || 'unknown',
      error: errorMessage,
      timestamp: Date.now()
    });
  };

  // NEW: Investor interest tracking
  const trackInvestorInterest = (action: 'page_view' | 'form_start' | 'form_submit' | 'cta_click', metadata?: Record<string, unknown>) => {
    trackEvent('investor_interest', {
      action,
      ...metadata,
      timestamp: Date.now()
    });
  };

  // NEW: Shop/cart tracking
  const trackShopAction = (action: 'add_to_cart' | 'remove_from_cart' | 'checkout_start' | 'checkout_complete', productId?: string, value?: number) => {
    trackEvent('shop_action', {
      action,
      product_id: productId,
      value,
      timestamp: Date.now()
    });
  };

  return {
    trackButtonClick,
    trackWaitlistJoin,
    trackTRNAction,
    trackSocialShare,
    trackVideoWatch,
    trackNavigation,
    // New conversion events
    trackWhitepaperDownload,
    trackBuyButtonClick,
    trackWalletConnect,
    trackInvestorInterest,
    trackShopAction,
  };
};
