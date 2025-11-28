import { Helmet } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { Loader2 } from "lucide-react";
import { useGoblinMarketData } from "@/hooks/useGoblinMarketData";
import { SolanaWalletProvider } from "@/providers/WalletProvider";
import { LazySection } from "@/components/ui/lazy-section";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardErrorBoundary } from "@/components/charts/DashboardErrorBoundary";

// Critical components - Load immediately
import { DexScreenerChart } from "@/components/market/DexScreenerChart";
import { WalletConnect } from "@/components/market/WalletConnect";
import { LiveViewersCounter } from "@/components/market/LiveViewersCounter";
import BackToHome from "@/components/BackToHome";

// Above-the-fold components - Load on mount
import { LiveHolderTracker } from "@/components/market/LiveHolderTracker";
import { PriceAlerts } from "@/components/market/PriceAlerts";

// Below-the-fold components - Lazy load
const TopHoldersLeaderboard = lazy(() => import("@/components/market/TopHoldersLeaderboard").then(m => ({ default: m.TopHoldersLeaderboard })));
const WhaleDistributionChart = lazy(() => import("@/components/market/WhaleDistributionChart").then(m => ({ default: m.WhaleDistributionChart })));
const JupiterSwap = lazy(() => import("@/components/market/JupiterSwap").then(m => ({ default: m.JupiterSwap })));

const ComponentFallback = () => (
  <div className="flex items-center justify-center p-8">
    <Loader2 className="w-6 h-6 animate-spin text-goblin-gold" />
  </div>
);

const GoblinMarket = () => {
  const { data: marketData, isLoading } = useGoblinMarketData();

  const marketStats = marketData?.stats || {
    priceUsd: "0",
    priceChange24h: 0,
    volume24h: 0,
    marketCap: 0,
    liquidity: 0,
    holders: 0,
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

          {/* Main Chart - Full Width */}
          <DashboardErrorBoundary componentName="Price Chart">
            <DexScreenerChart />
          </DashboardErrorBoundary>

          {/* Holder Tracker & Price Alerts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <DashboardErrorBoundary componentName="Holder Tracker">
              <LiveHolderTracker />
            </DashboardErrorBoundary>
            <DashboardErrorBoundary componentName="Price Alerts">
              <PriceAlerts currentPrice={parseFloat(marketStats.priceUsd)} />
            </DashboardErrorBoundary>
          </div>

          {/* Holder Analytics - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopHoldersLeaderboard />
                <WhaleDistributionChart />
              </div>
            </Suspense>
          </LazySection>

          {/* Jupiter Swap - Lazy load */}
          <LazySection fallback={<Skeleton className="h-96" />}>
            <Suspense fallback={<ComponentFallback />}>
              <JupiterSwap />
            </Suspense>
          </LazySection>
        </main>
      </div>
    </SolanaWalletProvider>
  );
};

export default GoblinMarket;
