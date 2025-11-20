import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('announcement-banner-dismissed');
    if (!dismissed) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem('announcement-banner-dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] bg-gradient-to-r from-primary via-green-500 to-primary text-white shadow-lg animate-slide-in-down">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl animate-bounce">🚀</span>
          <p className="font-display font-semibold text-sm md:text-base">
            <span className="font-bold">NEW:</span> Upload your yard photos on TerrainVision AI and earn up to 75 TRN per upload!
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            className="font-display font-semibold whitespace-nowrap"
            asChild
          >
            <a
              href="https://terrainvision-ai.com/analyze"
              target="_blank"
              rel="noopener noreferrer"
            >
              Analyze Now →
            </a>
          </Button>
          
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
