import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useTokenStats } from "@/hooks/useTokenStats";
import { Copy, Check, ChevronUp, ChevronDown, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFeatureAnalytics } from "@/hooks/useFeatureAnalytics";
import { Link } from "react-router-dom";

const TRN_CONTRACT = "EMrpbqAmruGBfkejNXQPZVTkuFHt7pc6DUeHRfN8qSQV";

export const ApeLiveFooter = () => {
  const { data: stats } = useTokenStats();
  const { toast } = useToast();
  const { trackButtonClick } = useFeatureAnalytics();
  const [copied, setCopied] = useState(false);
  const [isRiskExpanded, setIsRiskExpanded] = useState(false);
  const [isRiskDismissed, setIsRiskDismissed] = useState(false);

  // Load dismissal state from localStorage
  useEffect(() => {
    const dismissed = localStorage.getItem('ape_risk_dismissed') === 'true';
    setIsRiskDismissed(dismissed);
  }, []);

  const copyContract = async () => {
    await navigator.clipboard.writeText(TRN_CONTRACT);
    setCopied(true);
    toast({
      title: "📋 Copied!",
      description: "Contract address copied",
    });
    trackButtonClick('ape_footer_contract_copy', 'footer');
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleRisk = () => {
    setIsRiskExpanded(!isRiskExpanded);
    if (!isRiskExpanded) {
      trackButtonClick('ape_footer_risk_expand', 'footer');
    }
  };

  const dismissRisk = () => {
    setIsRiskDismissed(true);
    localStorage.setItem('ape_risk_dismissed', 'true');
    setIsRiskExpanded(false);
    trackButtonClick('ape_footer_dismiss_risk', 'footer');
  };

  const priceChange = stats?.change24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] border-t border-border/20 bg-background/95 backdrop-blur-xl">
      {/* Collapsed/Main Bar */}
      <div className="flex items-center justify-between gap-2 px-4 py-3 md:py-2">
        {/* Live Price - Left */}
        <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full animate-pulse ${isPositive ? 'bg-chart-3' : 'bg-destructive'}`} />
          <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
            <span className="text-lg sm:text-xl font-bold whitespace-nowrap">
              ${stats?.priceUsd || "0.00000000"}
            </span>
            <span className={`text-sm sm:text-base font-semibold ${isPositive ? 'text-chart-3' : 'text-destructive'}`}>
              {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
            </span>
          </div>
        </div>

        {/* Risk + Contract - Right */}
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
          {/* Risk Disclosure */}
          {!isRiskDismissed && (
            <Button
              onClick={toggleRisk}
              variant="ghost"
              size="sm"
              className="gap-1 text-xs sm:text-sm"
            >
              <span>⚠️</span>
              <span className="hidden sm:inline">Risk</span>
              {isRiskExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </Button>
          )}

          {/* Contract Address */}
          <button
            onClick={copyContract}
            className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono hidden sm:inline">
              CA: {TRN_CONTRACT.slice(0, 4)}...{TRN_CONTRACT.slice(-4)}
            </span>
            <span className="font-mono sm:hidden">
              {TRN_CONTRACT.slice(0, 4)}...{TRN_CONTRACT.slice(-4)}
            </span>
            {copied ? (
              <Check className="w-3 h-3 text-chart-3" />
            ) : (
              <Copy className="w-3 h-3" />
            )}
          </button>
        </div>
      </div>

      {/* Expanded Risk Disclosure */}
      {isRiskExpanded && !isRiskDismissed && (
        <div className="border-t border-border/20 px-4 py-3 bg-background/80 backdrop-blur-sm animate-in slide-in-from-bottom-2 duration-200">
          <div className="flex flex-col gap-3 max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground">
              ⚠️ <strong>TRN is highly speculative.</strong> Expect extreme volatility and risk of total loss. 
              This is not financial advice. Only invest what you can afford to lose.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/risk-disclosure">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                >
                  Read Full Disclosure
                  <ExternalLink className="w-3 h-3" />
                </Button>
              </Link>
              <Button
                onClick={dismissRisk}
                size="sm"
                variant="default"
                className="gap-1 text-xs"
              >
                Got it ✓
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
