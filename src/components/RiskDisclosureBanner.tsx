import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalQueue } from "@/hooks/useModalQueue";

export const RiskDisclosureBanner = () => {
  const { activeModal, requestModal, dismissModal } = useModalQueue();
  const isVisible = activeModal === 'risk-banner';
  const [bannerHeight, setBannerHeight] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem("trn-risk-banner-dismissed");
    if (!dismissed) {
      requestModal('risk-banner');
    }
  }, [requestModal]);

  useEffect(() => {
    if (isVisible) {
      const bannerEl = document.getElementById('risk-banner');
      if (bannerEl) {
        setBannerHeight(bannerEl.offsetHeight);
        document.body.style.paddingTop = `${bannerEl.offsetHeight}px`;
      }
    } else {
      document.body.style.paddingTop = '0';
    }
    return () => {
      document.body.style.paddingTop = '0';
    };
  }, [isVisible]);

  const handleDismiss = () => {
    dismissModal('risk-banner', true);
    localStorage.setItem("trn-risk-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div 
      id="risk-banner"
      className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-red-500/95 to-orange-500/95 backdrop-blur-lg border-b-2 border-red-400/50 shadow-2xl animate-slide-in-from-top"
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-start md:items-center gap-3 justify-between">
          <div className="flex items-start gap-3 flex-1">
            <AlertTriangle className="w-5 h-5 md:w-6 md:h-6 text-white flex-shrink-0 mt-0.5 md:mt-0 animate-pulse" />
            <div className="flex-1">
              <h3 className="font-bold text-white text-sm md:text-base mb-1">
                Important Risk Disclosure
              </h3>
              <p className="text-white/95 text-xs md:text-sm leading-relaxed">
                <span className="font-semibold">TRN is a speculative meme token.</span> The financial 
                data displayed on this site pertains to <span className="font-semibold">Carolina Terrain LLC</span>, 
                the real-world business backing the community. <span className="font-semibold">TRN token performance 
                is separate from business financials</span> and subject to extreme volatility. Only invest what you 
                can afford to lose. Not financial advice.
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="text-white hover:bg-white/20 flex-shrink-0 h-8 w-8 md:h-10 md:w-10"
            aria-label="Dismiss risk disclosure"
          >
            <X className="w-4 h-4 md:w-5 md:h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};