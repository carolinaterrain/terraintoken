import { Helmet } from "react-helmet-async";
import { Loader2 } from "lucide-react";
import { useGoblinMarketData, useHolderProgress } from "@/hooks/useGoblinMarketData";
import { GoblinStatsBar } from "@/components/market/GoblinStatsBar";
import { DexScreenerChart } from "@/components/market/DexScreenerChart";
import { HolderQuestBar } from "@/components/market/HolderQuestBar";
import { UtilityHookSection } from "@/components/market/UtilityHookSection";
import { WhaleDistributionChart } from "@/components/market/WhaleDistributionChart";
import { TRNValuationCard } from "@/components/market/TRNValuationCard";
import BackToHome from "@/components/BackToHome";

const GoblinMarket = () => {
  const { data: marketData, isLoading: isLoadingMarket } = useGoblinMarketData();
  const { data: holderData, isLoading: isLoadingHolders } = useHolderProgress();

  const isLoading = isLoadingMarket || isLoadingHolders;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-goblin-gold mx-auto" />
          <p className="text-muted-foreground">Loading Goblin Market...</p>
        </div>
      </div>
    );
  }

  if (!marketData || !holderData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-destructive">Failed to load market data</p>
          <BackToHome />
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Goblin Market - Live TRN Price & Trading | Terrain Token</title>
        <meta
          name="description"
          content="Watch the Goblin Market live! Real-time TRN price, trading charts, holder stats, and market sentiment. Join the goblin horde today."
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="container mx-auto px-4 py-6">
          <BackToHome />
        </div>

        {/* Main Content */}
        <main className="container mx-auto px-4 pb-20 space-y-6">
          {/* Title Section */}
          <div className="text-center space-y-2">
            <h1 className="text-4xl lg:text-6xl font-bold font-display bg-gradient-to-r from-goblin-green via-goblin-gold to-terrain-purple bg-clip-text text-transparent">
              🟢 Goblin Market
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Watch Terro the Terrain Goblin guard the TRN market. Live price data, 
              trading charts, and holder progress—all in one enchanted panel.
            </p>
          </div>

          {/* Stats Bar */}
          <GoblinStatsBar
            price={parseFloat(marketData.stats.priceUsd)}
            priceChange24h={marketData.stats.priceChange24h}
            marketCap={marketData.stats.marketCap}
            volume24h={marketData.stats.volume24h}
            liquidity={marketData.stats.liquidity}
          />

          {/* Chart */}
          <DexScreenerChart />

          {/* Holder Quest */}
          <HolderQuestBar
            current={holderData.current}
            target={holderData.target}
            milestones={holderData.milestones}
          />

          {/* Market Intelligence */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WhaleDistributionChart />
            <TRNValuationCard />
          </div>

          {/* Utility & Disclaimer */}
          <UtilityHookSection />
        </main>
      </div>
    </>
  );
};

export default GoblinMarket;
