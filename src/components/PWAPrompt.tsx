import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useModalQueue } from "@/hooks/useModalQueue";

const PWAPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const { activeModal, requestModal, dismissModal } = useModalQueue();
  const showPrompt = activeModal === 'pwa-prompt';

  useEffect(() => {
    const dismissed = localStorage.getItem("pwa-dismissed");
    if (dismissed) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);

    // Request to show prompt after 30 seconds
    const timer = setTimeout(() => {
      if (!dismissed) requestModal('pwa-prompt');
    }, 30000);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      clearTimeout(timer);
    };
  }, [requestModal]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      console.log("PWA installed");
    }
    
    setDeferredPrompt(null);
    dismissModal('pwa-prompt', true);
    localStorage.setItem("pwa-dismissed", "true");
  };

  const handleDismiss = () => {
    dismissModal('pwa-prompt', true);
    localStorage.setItem("pwa-dismissed", "true");
  };

  return (
    <Dialog open={showPrompt} onOpenChange={(open) => !open && handleDismiss()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <span className="text-3xl">📲</span>
            Install TRN Token
          </DialogTitle>
          <DialogDescription>
            Get quick access to the erosion revolution! 🌱⛏️
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 mt-4">
          <Button
            onClick={handleInstall}
            size="lg"
            className="w-full"
          >
            Install Now
          </Button>
          <Button
            onClick={handleDismiss}
            size="lg"
            variant="outline"
            className="w-full"
          >
            Maybe Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PWAPrompt;
