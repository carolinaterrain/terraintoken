import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { useGoblinMarketData, useHolderProgress } from "@/hooks/useGoblinMarketData";
import { GoblinStatsBar } from "@/components/market/GoblinStatsBar";
import { DexScreenerChart } from "@/components/market/DexScreenerChart";
import { HolderQuestBar } from "@/components/market/HolderQuestBar";
import { UtilityHookSection } from "@/components/market/UtilityHookSection";
import { WhaleDistributionChart } from "@/components/market/WhaleDistributionChart";
import { TRNValuationCard } from "@/components/market/TRNValuationCard";
import { LiveHolderTracker } from "@/components/market/LiveHolderTracker";
import { PriceAlerts } from "@/components/market/PriceAlerts";
import { MarketSentiment } from "@/components/market/MarketSentiment";
import { TradingHistoryFeed } from "@/components/market/TradingHistoryFeed";
import { TopHoldersLeaderboard } from "@/components/market/TopHoldersLeaderboard";
import { PricePredictionChart } from "@/components/market/PricePredictionChart";
import { GovernanceVoting } from "@/components/market/GovernanceVoting";
import { WalletConnect } from "@/components/market/WalletConnect";
import { PricePredictionGame } from "@/components/market/PricePredictionGame";
import { LiveViewersCounter } from "@/components/market/LiveViewersCounter";
import BackToHome from "@/components/BackToHome";

const GoblinMarket = () => {
  const { data: marketData, isLoading: isLoadingMarket } = useGoblinMarketData();
  const { data: holderData, isLoading: isLoadingHolders } = useHolderProgress();
  const [walletAddress, setWalletAddress] = useState<string | null>(
    localStorage.getItem("connectedWallet")
  );

  const isLoading = isLoadingMarket || isLoadingHolders;

  // Use fallback data if API fails
  const marketStats = marketData?.stats || {
    priceUsd: "0.00001149",
    priceChange24h: 5.2,
    volume24h: 45000,
    marketCap: 11560000,
    liquidity: 85000,
    holders: 1137,
  };

  const holderProgress = holderData || {
    current: 1137,
    target: 5000,
    milestones: [500, 1000, 2500, 5000],
  };

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
          <div className="flex items-center justify-between">
            <BackToHome />
            <div className="flex items-center gap-4">
              <LiveViewersCounter />
              <WalletConnect />
            </div>
          </div>
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
            price={parseFloat(marketStats.priceUsd)}
            priceChange24h={marketStats.priceChange24h}
            marketCap={marketStats.marketCap}
            volume24h={marketStats.volume24h}
            liquidity={marketStats.liquidity}
          />

          {/* Chart */}
          <DexScreenerChart />

          {/* Engagement Features Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <LiveHolderTracker />
            <PriceAlerts currentPrice={parseFloat(marketStats.priceUsd)} />
            <PricePredictionGame 
              currentPrice={parseFloat(marketStats.priceUsd)}
              walletAddress={walletAddress || undefined}
            />
          </div>

          {/* Market Sentiment & Holder Quest */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MarketSentiment
              priceChange24h={marketStats.priceChange24h}
              volume24h={marketStats.volume24h}
              holders={holderProgress.current}
            />
            <div>
              <HolderQuestBar
                current={holderProgress.current}
                target={holderProgress.target}
                milestones={holderProgress.milestones}
              />
            </div>
          </div>

          {/* Trading History */}
          <TradingHistoryFeed />

          {/* Advanced Analytics Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopHoldersLeaderboard />
            <PricePredictionChart />
          </div>

          {/* Governance Section */}
          <GovernanceVoting />

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
