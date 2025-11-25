import { useState, useEffect } from "react";
import { AlertTriangle, ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useUIModeStore } from "@/stores/uiModeStore";

export const RiskFooterBar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);
  const location = useLocation();
  const { mode } = useUIModeStore();

  // Hide in Ape Mode on home page (ApeLiveFooter shows risk instead)
  if (mode === 'ape' && location.pathname === '/') {
    return null;
  }

  useEffect(() => {
    const dismissed = localStorage.getItem("risk_footer_dismissed");
    if (dismissed) {
      setIsDismissed(true);
      setIsVisible(false);
    }
  }, []);

  const handleDismiss = () => {
    localStorage.setItem("risk_footer_dismissed", "true");
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[110] bg-gradient-to-r from-yellow-500/10 via-orange-500/10 to-red-500/10 backdrop-blur-md border-t border-yellow-500/30 shadow-[0_-4px_20px_rgba(234,179,8,0.15)]">
      {/* Collapsed State */}
      {!isExpanded && (
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1">
              <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0" />
              <span className="text-sm font-semibold text-foreground">
                Risk Disclosure
              </span>
              <span className="hidden sm:inline text-xs text-muted-foreground">
                TRN is speculative. Read important information.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(true)}
                className="h-8 text-xs"
              >
                Expand <ChevronUp className="ml-1 h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDismiss}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="container mx-auto px-4 py-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-6 h-6 text-yellow-500 flex-shrink-0" />
                <h3 className="font-display text-lg font-bold text-foreground">
                  Important Risk Disclosure
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 flex-shrink-0"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-sm text-muted-foreground space-y-2 pl-9">
              <p>
                <strong className="text-foreground">TRN is a speculative meme token</strong> backed by Carolina Terrain LLC, 
                a real drainage company. Token performance is <strong className="text-foreground">separate from business financials</strong>. 
                We provide full transparency about our operations, but this does not guarantee token value.
              </p>
              <div className="flex flex-wrap gap-4 text-xs">
                <span className="flex items-center gap-1">
                  ⚠️ <strong>High Volatility</strong>
                </span>
                <span className="flex items-center gap-1">
                  💸 <strong>Speculative Asset</strong>
                </span>
                <span className="flex items-center gap-1">
                  📉 <strong>Risk of Total Loss</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pl-9">
              <Button variant="outline" size="sm" asChild className="border-primary">
                <Link to="/risk-disclosure">
                  Read Full Disclosure →
                </Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDismiss}>
                I Understand
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
