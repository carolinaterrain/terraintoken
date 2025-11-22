import { useState, useEffect } from "react";
import { Download, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export const PWAInstallBadge = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const dismissed = localStorage.getItem("pwa_badge_dismissed");
      if (!dismissed) {
        setDeferredPrompt(e);
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      console.log("PWA installed");
    }

    setDeferredPrompt(null);
    setIsVisible(false);
    localStorage.setItem("pwa_badge_dismissed", "true");
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa_badge_dismissed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-20 right-4 z-[80] md:bottom-6 md:right-6 animate-in slide-in-from-bottom-5 duration-500">
      <div className="relative group">
        {/* Pulse animation */}
        <div className="absolute inset-0 bg-primary/20 rounded-lg animate-pulse" />
        
        {/* Badge content */}
        <div className="relative bg-gradient-to-br from-background to-primary/5 border-2 border-primary/40 rounded-lg shadow-glow p-3 md:p-4 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-background border border-border shadow-sm"
          >
            <X className="h-3 w-3" />
          </Button>

          <button
            onClick={handleInstall}
            className="flex flex-col items-center gap-2 text-center hover:scale-105 transition-transform"
          >
            <div className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/20 border border-primary/40">
              <Download className="w-5 h-5 md:w-6 md:h-6 text-primary" />
            </div>
            <div className="space-y-1">
              <div className="text-xs md:text-sm font-bold text-foreground whitespace-nowrap">
                Install App
              </div>
              <div className="hidden md:block text-xs text-muted-foreground">
                Quick Access
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
