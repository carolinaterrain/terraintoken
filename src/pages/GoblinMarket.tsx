import { Helmet } from "react-helmet-async";
import { useState, useEffect, lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useGoblinMarketData, useHolderProgress } from "@/hooks/useGoblinMarketData";
import { SolanaWalletProvider } from "@/providers/WalletProvider";
import { LazySection } from "@/components/ui/lazy-section";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardErrorBoundary } from "@/components/charts/DashboardErrorBoundary";

// Critical components - Load immediately
import { GoblinStatsBar } from "@/components/market/GoblinStatsBar";
import { DexScreenerChart } from "@/components/market/DexScreenerChart";
import { WalletConnect } from "@/components/market/WalletConnect";
import { LiveViewersCounter } from "@/components/market/LiveViewersCounter";
import BackToHome from "@/components/BackToHome";

// Above-the-fold components - Load on mount
import { LiveHolderTracker } from "@/components/market/LiveHolderTracker";
import { PriceAlerts } from "@/components/market/PriceAlerts";
import { PricePredictionGame } from "@/components/market/PricePredictionGame";

// Below-the-fold components - Lazy load with named export wrapping
const PredictionTournament = lazy(() => import("@/components/market/PredictionTournament").then(m => ({ default: m.PredictionTournament })));
const PredictionChallenges = lazy(() => import("@/components/market/PredictionChallenges").then(m => ({ default: m.PredictionChallenges })));
const PredictionInsightsDashboard = lazy(() => import("@/components/market/PredictionInsightsDashboard").then(m => ({ default: m.PredictionInsightsDashboard })));
const NFTBadgeDisplay = lazy(() => import("@/components/market/NFTBadgeDisplay").then(m => ({ default: m.NFTBadgeDisplay })));
const EnhancedLeaderboard = lazy(() => import("@/components/market/EnhancedLeaderboard").then(m => ({ default: m.EnhancedLeaderboard })));
const AdvancedAnalytics = lazy(() => import("@/components/market/AdvancedAnalytics").then(m => ({ default: m.AdvancedAnalytics })));
const PriceAlertNotifications = lazy(() => import("@/components/market/PriceAlertNotifications").then(m => ({ default: m.PriceAlertNotifications })));
const PortfolioTracker = lazy(() => import("@/components/market/PortfolioTracker").then(m => ({ default: m.PortfolioTracker })));
const AchievementTracker = lazy(() => import("@/components/market/AchievementTracker").then(m => ({ default: m.AchievementTracker })));
const MarketSentiment = lazy(() => import("@/components/market/MarketSentiment").then(m => ({ default: m.MarketSentiment })));
const HolderQuestBar = lazy(() => import("@/components/market/HolderQuestBar").then(m => ({ default: m.HolderQuestBar })));
const SocialChatLayer = lazy(() => import("@/components/market/SocialChatLayer").then(m => ({ default: m.SocialChatLayer })));
const TradingHistoryFeed = lazy(() => import("@/components/market/TradingHistoryFeed").then(m => ({ default: m.TradingHistoryFeed })));
const TopHoldersLeaderboard = lazy(() => import("@/components/market/TopHoldersLeaderboard").then(m => ({ default: m.TopHoldersLeaderboard })));
const PricePredictionChart = lazy(() => import("@/components/market/PricePredictionChart").then(m => ({ default: m.PricePredictionChart })));
const GovernanceVoting = lazy(() => import("@/components/market/GovernanceVoting").then(m => ({ default: m.GovernanceVoting })));
const WhaleDistributionChart = lazy(() => import("@/components/market/WhaleDistributionChart").then(m => ({ default: m.WhaleDistributionChart })));
const TRNValuationCard = lazy(() => import("@/components/market/TRNValuationCard").then(m => ({ default: m.TRNValuationCard })));
const JupiterSwap = lazy(() => import("@/components/market/JupiterSwap").then(m => ({ default: m.JupiterSwap })));
const LivePurchaseFeed = lazy(() => import("@/components/market/LivePurchaseFeed").then(m => ({ default: m.LivePurchaseFeed })));
const FiatOnRamp = lazy(() => import("@/components/market/FiatOnRamp").then(m => ({ default: m.FiatOnRamp })));
const PurchaseLeaderboard = lazy(() => import("@/components/market/PurchaseLeaderboard").then(m => ({ default: m.PurchaseLeaderboard })));
const WhaleAlerts = lazy(() => import("@/components/market/WhaleAlerts").then(m => ({ default: m.WhaleAlerts })));
const ReferralSystem = lazy(() => import("@/components/market/ReferralSystem").then(m => ({ default: m.ReferralSystem })));
const UtilityHookSection = lazy(() => import("@/components/market/UtilityHookSection").then(m => ({ default: m.UtilityHookSection })));

// Lazy load notification service
const NotificationService = lazy(() => 
  import("@/components/market/NotificationStatus").then(module => ({
    default: () => {
      module.useNotificationService();
      return null;
    }
  }))
);

const ComponentFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-goblin-gold" />
  </div>
);

const GoblinMarket = () => {
  const { data: marketData, isLoading: isLoadingMarket } = useGoblinMarketData();
  const { data: holderData, isLoading: isLoadingHolders } = useHolderProgress();
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [solBalance, setSOLBalance] = useState<number>(0);

  // Listen for wallet connection changes
  useEffect(() => {
    const handleWalletChange = (event: CustomEvent) => {
      const address = event.detail;
      setWalletAddress(address);
      
      if (event.detail && typeof event.detail === 'object' && 'solBalance' in event.detail) {
        setSOLBalance(event.detail.solBalance);
      }
    };

    window.addEventListener("walletChanged", handleWalletChange as EventListener);
    return () => {
      window.removeEventListener("walletChanged", handleWalletChange as EventListener);
    };
  }, []);

  const isLoading = isLoadingMarket || isLoadingHolders;

  const marketStats = marketData?.stats || {
    priceUsd: "0",
    priceChange24h: 0,
    volume24h: 0,
    marketCap: 0,
    liquidity: 0,
    holders: 0,
  };

  const holderProgress = holderData || {
    current: 0,
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
    <SolanaWalletProvider>
      <Helmet>
        <title>Goblin Market - Live TRN Price & Trading | Terrain Token</title>
        <meta
          name="description"
          content="Watch the Goblin Market live! Real-time TRN price, trading charts, holder stats, and market sentiment. Join the goblin horde today."
        />
      </Helmet>

      {/* Load notification service in background */}
      <Suspense fallback={null}>
        <NotificationService />
      </Suspense>

      <div className="min-h-screen bg-background">
        {/* Header - Always visible */}
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

          {/* Critical Above-the-Fold Content - Load immediately */}
          <DashboardErrorBoundary componentName="Market Stats">
            <GoblinStatsBar
              price={parseFloat(marketStats.priceUsd)}
              priceChange24h={marketStats.priceChange24h}
              marketCap={marketStats.marketCap}
              volume24h={marketStats.volume24h}
              liquidity={marketStats.liquidity}
            />
          </DashboardErrorBoundary>

          <DashboardErrorBoundary componentName="Price Chart">
            <DexScreenerChart />
          </DashboardErrorBoundary>

          {/* Primary Engagement Features - Load immediately */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <DashboardErrorBoundary componentName="Holder Tracker">
              <LiveHolderTracker />
            </DashboardErrorBoundary>
            <DashboardErrorBoundary componentName="Price Alerts">
              <PriceAlerts currentPrice={parseFloat(marketStats.priceUsd)} />
            </DashboardErrorBoundary>
            <DashboardErrorBoundary componentName="Price Prediction">
              <PricePredictionGame 
                currentPrice={parseFloat(marketStats.priceUsd)}
                walletAddress={walletAddress || undefined}
              />
            </DashboardErrorBoundary>
          </div>

          {/* Prediction Features - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PredictionTournament walletAddress={walletAddress || undefined} />
                <PredictionChallenges walletAddress={walletAddress || undefined} />
              </div>
            </Suspense>
          </LazySection>

          {/* Prediction Insights & NFT Badges - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PredictionInsightsDashboard walletAddress={walletAddress || undefined} />
                <NFTBadgeDisplay walletAddress={walletAddress || undefined} />
              </div>
            </Suspense>
          </LazySection>

          {/* Enhanced Leaderboard - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <EnhancedLeaderboard />
            </Suspense>
          </LazySection>

          {/* Advanced Analytics - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <AdvancedAnalytics walletAddress={walletAddress || undefined} />
            </Suspense>
          </LazySection>

          {/* Price Alert Notifications - Lazy load */}
          <LazySection fallback={null}>
            <Suspense fallback={null}>
              <PriceAlertNotifications />
            </Suspense>
          </LazySection>

          {/* Portfolio & Achievements - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <PortfolioTracker 
                  walletAddress={walletAddress || undefined}
                  currentPrice={parseFloat(marketStats.priceUsd)}
                />
                <AchievementTracker walletAddress={walletAddress || undefined} />
              </div>
            </Suspense>
          </LazySection>

          {/* Social Features - Lazy load */}
          <LazySection fallback={<Skeleton className="h-64" />}>
            <Suspense fallback={<ComponentFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                <SocialChatLayer walletAddress={walletAddress || undefined} />
              </div>
            </Suspense>
          </LazySection>

          {/* Trading History - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <TradingHistoryFeed />
            </Suspense>
          </LazySection>

          {/* Analytics Row - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopHoldersLeaderboard />
                <PricePredictionChart />
              </div>
            </Suspense>
          </LazySection>

          {/* Governance - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <GovernanceVoting />
            </Suspense>
          </LazySection>

          {/* Market Intelligence - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WhaleDistributionChart />
                <TRNValuationCard />
              </div>
            </Suspense>
          </LazySection>

          {/* Trading Features - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <JupiterSwap />
                <LivePurchaseFeed />
              </div>
            </Suspense>
          </LazySection>

          {/* Fiat On-Ramp - Lazy load */}
          <LazySection fallback={null}>
            <Suspense fallback={null}>
              <FiatOnRamp walletAddress={walletAddress || undefined} solBalance={solBalance} />
            </Suspense>
          </LazySection>

          {/* Purchase Leaderboard - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <PurchaseLeaderboard />
            </Suspense>
          </LazySection>

          {/* Whale Alerts & Referrals - Lazy load */}
          <LazySection fallback={<Skeleton className="h-64" />}>
            <Suspense fallback={<ComponentFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <WhaleAlerts />
                <ReferralSystem walletAddress={walletAddress || undefined} />
              </div>
            </Suspense>
          </LazySection>

          {/* Utility Section - Lazy load */}
          <LazySection fallback={<Skeleton className="h-48" />}>
            <Suspense fallback={<ComponentFallback />}>
              <UtilityHookSection />
            </Suspense>
          </LazySection>
        </main>
      </div>
    </SolanaWalletProvider>
  );
};

export default GoblinMarket;
