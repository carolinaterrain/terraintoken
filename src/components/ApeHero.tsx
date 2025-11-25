import { Button } from "@/components/ui/button";
import { useFeatureAnalytics } from "@/hooks/useFeatureAnalytics";

interface ApeHeroProps {
  onBuyClick: () => void;
  onSellClick: () => void;
}

export const ApeHero = ({ onBuyClick, onSellClick }: ApeHeroProps) => {
  const { trackButtonClick } = useFeatureAnalytics();

  const handleBuy = () => {
    trackButtonClick('ape_mode_buy', 'hero');
    onBuyClick();
  };

  const handleSell = () => {
    trackButtonClick('ape_mode_sell', 'hero');
    onSellClick();
  };

  return (
    <section className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/95 to-background -z-10" />

      {/* Giant Buy/Sell Buttons */}
      <div className="w-full max-w-2xl space-y-4">
        {/* BUY Button */}
        <Button
          onClick={handleBuy}
          size="lg"
          className="w-full h-[42vh] min-h-[250px] text-4xl md:text-6xl font-bold bg-gradient-to-br from-chart-3 to-chart-2 hover:from-chart-3/90 hover:to-chart-2/90 border-4 border-chart-3/50 shadow-2xl shadow-chart-3/30 animate-pulse hover:scale-[1.02] transition-all duration-300"
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
          className="w-full h-[42vh] min-h-[250px] text-4xl md:text-6xl font-bold bg-gradient-to-br from-destructive to-red-700 hover:from-destructive/90 hover:to-red-700/90 border-4 border-destructive/50 shadow-2xl shadow-destructive/30 animate-pulse hover:scale-[1.02] transition-all duration-300"
        >
          <span className="flex flex-col items-center gap-4">
            <span className="text-6xl">🔴</span>
            <span>SELL TRN NOW</span>
            <span className="text-xl md:text-2xl opacity-80">Tap to sell instantly</span>
          </span>
        </Button>
      </div>
    </section>
  );
};
