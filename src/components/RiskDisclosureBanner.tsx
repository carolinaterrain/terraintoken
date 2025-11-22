import { useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useModalQueue } from "@/hooks/useModalQueue";

export const RiskDisclosureBanner = () => {
  const { activeModal, requestModal, dismissModal } = useModalQueue();
  const isVisible = activeModal === 'risk-banner';

  useEffect(() => {
    const dismissed = localStorage.getItem("trn-risk-banner-dismissed");
    if (!dismissed) {
      // Request to show banner immediately on page load (highest priority)
      requestModal('risk-banner');
    }
  }, [requestModal]);

  const handleDismiss = () => {
    dismissModal('risk-banner', true);
    localStorage.setItem("trn-risk-banner-dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-red-500/95 to-orange-500/95 backdrop-blur-lg border-b-2 border-red-400/50 shadow-2xl animate-in slide-in-from-top duration-500">
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