import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnalytics } from "@/hooks/useAnalytics";

export const StickyBuyButton = () => {
  const { trackEvent } = useAnalytics();

  const handleClick = () => {
    trackEvent('sticky_buy_button_click', {
      source: 'mobile_sticky',
      timestamp: Date.now()
    });
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      <div className="bg-background/95 backdrop-blur-lg border-t border-primary/20 p-4">
        <Button
          onClick={handleClick}
          asChild
          size="lg"
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
        >
          <a
            href="https://pump.fun/coin/2LixFp7EJT3AfeAWu98o87gJTpYXupxHmv4puump7jQm"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <span>BUY TRN NOW</span>
            <ExternalLink className="w-5 h-5" />
          </a>
        </Button>
      </div>
    </div>
  );
};
