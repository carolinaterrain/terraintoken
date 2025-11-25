import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

interface AnnouncementBannerProps {
  onDismiss?: () => void;
}

const AnnouncementBanner = ({ onDismiss }: AnnouncementBannerProps) => {
  return (
    <div className="bg-primary/10 backdrop-blur-sm border-b border-primary/20 py-2 px-4 animate-fade-in relative">
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm pr-8">
        <Sparkles className="w-4 h-4 text-primary animate-pulse" />
        <p className="text-foreground font-medium">
          🚀 NEW: Ape Mode is LIVE! Giant BUY/SELL buttons, zero distractions. Just vibes.
        </p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            window.location.hash = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="text-primary hover:text-primary/80"
        >
          Try Ape Mode →
        </Button>
      </div>
      {onDismiss && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss announcement"
        >
          ×
        </Button>
      )}
    </div>
  );
};

export default AnnouncementBanner;
