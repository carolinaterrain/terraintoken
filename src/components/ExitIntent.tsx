import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useModalQueue } from "@/hooks/useModalQueue";

const ExitIntent = () => {
  const { activeModal, requestModal, dismissModal } = useModalQueue();
  const showModal = activeModal === 'exit-intent';

  useEffect(() => {
    const dismissed = localStorage.getItem("exit-intent-dismissed");
    if (dismissed) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !dismissed) {
        requestModal('exit-intent');
        localStorage.setItem("exit-intent-dismissed", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [requestModal]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      dismissModal('exit-intent', false);
    }
  };

  return (
    <Dialog open={showModal} onOpenChange={(open) => !open && dismissModal('exit-intent', false)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl text-center">
            <div className="text-5xl mb-2">🥺</div>
            Leaving so soon?
          </DialogTitle>
          <DialogDescription className="text-center">
            Don't miss out on the erosion revolution!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3">
          <Button
            onClick={() => scrollToSection("contest")}
            className="w-full"
            variant="default"
          >
            🏆 Join the Meme Contest
          </Button>
          
          <Button
            onClick={() => scrollToSection("how-to-buy")}
            className="w-full"
            variant="outline"
          >
            💰 Buy TRN Now
          </Button>
          
          <Button
            onClick={() => window.open("https://x.com/carolinaterrain", "_blank")}
            className="w-full"
            variant="outline"
          >
            🐦 Follow on X
          </Button>
          
          <Button
            onClick={() => dismissModal('exit-intent', false)}
            className="w-full"
            variant="ghost"
          >
            Take me back! 🌱
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntent;
