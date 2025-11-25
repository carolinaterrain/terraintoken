import { useState, useEffect } from "react";
import { useScrollDirection } from "@/hooks/useScrollDirection";
import { useTokenStats } from "@/hooks/useTokenStats";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Rocket, Microscope } from "lucide-react";
import AnnouncementBanner from "./AnnouncementBanner";
import DesktopNav from "./DesktopNav";
import { UIModeToggle } from "./UIModeToggle";
import { useUIModeStore } from "@/stores/uiModeStore";

const SmartHeader = () => {
  const scrollDirection = useScrollDirection();
  const { data: tokenStats } = useTokenStats();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const { mode } = useUIModeStore();

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
    <div className="fixed top-0 left-0 right-0 z-[100] transition-transform duration-300">
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

      {/* Main Header - Simplified with Mode Indicator */}
      <div className={cn(
        "bg-background/95 backdrop-blur-lg border-b transition-colors duration-300",
        mode === 'ape' ? "border-chart-3/30" : "border-primary/20"
      )}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Mode Indicator (left side on mobile, hidden on desktop) */}
            <div className="flex items-center gap-2 md:hidden">
              {mode === 'ape' ? (
                <>
                  <Rocket className="w-4 h-4 text-chart-3" />
                  <span className="text-xs font-semibold text-chart-3">APE</span>
                </>
              ) : (
                <>
                  <Microscope className="w-4 h-4 text-primary" />
                  <span className="text-xs font-semibold text-primary">RESEARCH</span>
                </>
              )}
            </div>

            <div className="hidden md:block flex-1">
              <DesktopNav />
            </div>
            
            <div className="flex items-center gap-3">
              {/* Mode Indicator (desktop only) */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border">
                {mode === 'ape' ? (
                  <>
                    <Rocket className="w-4 h-4 text-chart-3" />
                    <span className="text-sm font-semibold text-chart-3">Ape Mode</span>
                  </>
                ) : (
                  <>
                    <Microscope className="w-4 h-4 text-primary" />
                    <span className="text-sm font-semibold text-primary">Research Mode</span>
                  </>
                )}
              </div>
              <UIModeToggle />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartHeader;
