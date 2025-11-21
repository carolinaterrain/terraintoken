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
    <div className="fixed top-0 left-0 right-0 z-40 transition-transform duration-300">
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

      {/* Main Header - Simplified */}
      <div className="bg-background/95 backdrop-blur-lg border-b border-primary/20">
        <div className="container mx-auto px-4">
          <div className="hidden md:block">
            <DesktopNav />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartHeader;
