import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useTokenStats } from "@/hooks/useTokenStats";
import { Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useFeatureAnalytics } from "@/hooks/useFeatureAnalytics";

const TRN_CONTRACT = "EMrpbqAmruGBfkejNXQPZVTkuFHt7pc6DUeHRfN8qSQV";

interface ApeHeroProps {
  onBuyClick: () => void;
  onSellClick: () => void;
}

export const ApeHero = ({ onBuyClick, onSellClick }: ApeHeroProps) => {
  const { data: stats } = useTokenStats();
  const { toast } = useToast();
  const { trackButtonClick } = useFeatureAnalytics();
  const [copied, setCopied] = useState(false);

  const copyContract = async () => {
    await navigator.clipboard.writeText(TRN_CONTRACT);
    setCopied(true);
    toast({
      title: "📋 Contract Copied!",
      description: "TRN contract address copied to clipboard",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleBuy = () => {
    trackButtonClick('ape_mode_buy', 'hero');
    onBuyClick();
  };

  const handleSell = () => {
    trackButtonClick('ape_mode_sell', 'hero');
    onSellClick();
  };

  const priceChange = stats?.change24h || 0;
  const isPositive = priceChange >= 0;

  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background -z-10" />
      
      {/* Price Ticker */}
      <div className="text-center mb-8 space-y-2">
        <div className="inline-flex items-center gap-2 bg-background/80 backdrop-blur-sm border border-border rounded-full px-6 py-3">
          <div className="w-2 h-2 bg-chart-3 rounded-full animate-pulse" />
          <span className="text-sm font-medium text-muted-foreground">LIVE PRICE</span>
        </div>
        <div className="text-4xl md:text-5xl font-bold">
          ${stats?.priceUsd || "0.00000000"}
        </div>
        <div className={`text-xl font-semibold ${isPositive ? 'text-chart-3' : 'text-destructive'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(priceChange).toFixed(2)}%
        </div>
      </div>

      {/* Giant Buy/Sell Buttons */}
      <div className="w-full max-w-2xl space-y-4">
        {/* BUY Button */}
        <Button
          onClick={handleBuy}
          size="lg"
          className="w-full h-[35vh] min-h-[200px] text-4xl md:text-6xl font-bold bg-gradient-to-br from-chart-3 to-chart-2 hover:from-chart-3/90 hover:to-chart-2/90 border-4 border-chart-3/50 shadow-2xl shadow-chart-3/30 animate-pulse hover:scale-[1.02] transition-all duration-300"
        >
          <span className="flex flex-col items-center gap-4">
            <span className="text-6xl">🟢</span>
            <span>BUY TRN NOW</span>
            <span className="text-xl md:text-2xl opacity-80">Tap to buy instantly</span>
          </span>
        </Button>

        {/* SELL Button */}
        <Button
          onClick={handleSell}
          size="lg"
          className="w-full h-[35vh] min-h-[200px] text-4xl md:text-6xl font-bold bg-gradient-to-br from-destructive to-red-700 hover:from-destructive/90 hover:to-red-700/90 border-4 border-destructive/50 shadow-2xl shadow-destructive/30 animate-pulse hover:scale-[1.02] transition-all duration-300"
        >
          <span className="flex flex-col items-center gap-4">
            <span className="text-6xl">🔴</span>
            <span>SELL TRN NOW</span>
            <span className="text-xl md:text-2xl opacity-80">Tap to sell instantly</span>
          </span>
        </Button>
      </div>

      {/* Contract Address */}
      <button
        onClick={copyContract}
        className="mt-8 flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group"
      >
        <span className="font-mono">
          Contract: {TRN_CONTRACT.slice(0, 4)}...{TRN_CONTRACT.slice(-4)}
        </span>
        {copied ? (
          <Check className="w-3 h-3 text-chart-3" />
        ) : (
          <Copy className="w-3 h-3 group-hover:text-primary transition-colors" />
        )}
      </button>
    </section>
  );
};
