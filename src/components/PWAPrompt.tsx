import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

const PWAPrompt = () => {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Show prompt after 30 seconds
    const timer = setTimeout(() => {
      if (!dismissed) setShowPrompt(true);
    }, 30000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
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
    setShowPrompt(false);
    localStorage.setItem("pwa-dismissed", "true");
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem("pwa-dismissed", "true");
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-sm z-50 animate-slide-in-right">
      <div className="bg-card border-2 border-primary/30 rounded-lg p-4 shadow-2xl">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4" />
        </button>
        
        <div className="flex items-start gap-3">
          <div className="text-3xl">📲</div>
          <div className="flex-1">
            <h3 className="font-bold text-foreground mb-1">
              Install TRN Token
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              Get quick access to the erosion revolution! 🌱⛏️
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleInstall}
                size="sm"
                className="bg-primary hover:bg-primary/90"
              >
                Install
              </Button>
              <Button
                onClick={handleDismiss}
                size="sm"
                variant="ghost"
              >
                Maybe later
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PWAPrompt;
