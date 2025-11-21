import { useState, useEffect } from "react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useTokenStats } from "@/hooks/useTokenStats";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import AnnouncementBanner from "./AnnouncementBanner";
import DesktopNav from "./DesktopNav";

const SmartHeader = () => {
  const scrollDirection = useScrollDirection();
  const { data: tokenStats } = useTokenStats();
  const [bannerDismissed, setBannerDismissed] = useState(false);

  // Check if banner was previously dismissed
  useEffect(() => {
    const dismissed = localStorage.getItem('announcementBannerDismissed');
    if (dismissed) {
      setBannerDismissed(true);
    }
  }, []);

  const handleDismissBanner = () => {
    setBannerDismissed(true);
    localStorage.setItem('announcementBannerDismissed', 'true');
  };

  const isMinimized = scrollDirection === 'down';
  const isAtTop = scrollDirection === 'top';

  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-transform duration-300">
      {/* Announcement Banner - Dismissible */}
      {!bannerDismissed && (
        <div
          className={cn(
            "transition-all duration-300",
            isAtTop ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 h-0"
          )}
        >
          <AnnouncementBanner onDismiss={handleDismissBanner} />
        </div>
      )}

      {/* Main Header */}
      <div
        className={cn(
          "bg-background/95 backdrop-blur-lg border-b border-primary/20 transition-all duration-300",
          isMinimized ? "py-2" : "py-3"
        )}
      >
        <div className="container mx-auto px-4">
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <DesktopNav />
          </div>

          {/* Token Stats Ticker - Integrated */}
          <div
            className={cn(
              "transition-all duration-300 overflow-hidden",
              isMinimized ? "max-h-0 opacity-0" : "max-h-20 opacity-100 mt-3"
            )}
          >
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Price:</span>
                <span className="font-bold text-foreground">${tokenStats?.priceUsd || '0.00'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">24h:</span>
                <span
                  className={cn(
                    "font-bold flex items-center gap-1",
                    (tokenStats?.change24h || 0) >= 0 ? "text-green-500" : "text-red-500"
                  )}
                >
                  {(tokenStats?.change24h || 0) >= 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {tokenStats?.change24h || '0.00'}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Volume:</span>
                <span className="font-bold text-foreground">{tokenStats?.volume24h || '$0'}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">Market Cap:</span>
                <span className="font-bold text-foreground">{tokenStats?.marketCap || '$0'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartHeader;
