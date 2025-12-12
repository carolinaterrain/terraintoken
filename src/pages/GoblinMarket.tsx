import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Loader2, Bug, Flame, BarChart3 } from "lucide-react";
import { useGoblinMarketData } from "@/hooks/useGoblinMarketData";
import { SolanaWalletProvider } from "@/providers/WalletProvider";
import { DashboardErrorBoundary } from "@/components/charts/DashboardErrorBoundary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { burnTRN, getTotalBurned } from "@/lib/carolinaTerrainSync";
import { useWallet } from "@solana/wallet-adapter-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Link } from "react-router-dom";

// Critical components - Load immediately
import { DexScreenerChart } from "@/components/market/DexScreenerChart";
import { WalletConnect } from "@/components/market/WalletConnect";
import { LiveViewersCounter } from "@/components/market/LiveViewersCounter";
import BackToHome from "@/components/BackToHome";
import Footer from "@/components/Footer";

// Above-the-fold components - Load on mount
import { LiveHolderTracker } from "@/components/market/LiveHolderTracker";

// Ecosystem components
import { BurnBandIndicator } from "@/components/ecosystem/BurnBandIndicator";
import { PoweredByTerrainVision } from "@/components/ecosystem/PoweredByTerrainVision";

// Phase 1.1: Bulletproof dev detection - hostname check required
const IS_DEV = import.meta.env.DEV && 
  (typeof window !== 'undefined' && 
   (window.location.hostname === 'localhost' || 
    window.location.hostname === '127.0.0.1'));

// Dev Debug Panel Component
const DevDebugPanel = () => {
  const { publicKey, connected } = useWallet();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [totalBurned, setTotalBurned] = useState<number | null>(null);

  const handleTestBurn = async () => {
    if (!connected || !publicKey) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to test burn functionality.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    console.log('[DevDebug] === TEST BURN START ===');
    console.log('[DevDebug] Wallet:', publicKey.toBase58());

    try {
      const result = await burnTRN(
        100, // Test amount
        'gamification', // Source type
        publicKey.toBase58(), // User wallet
        { 
          test: true, 
          reason: 'dev_verification',
          timestamp: new Date().toISOString()
        }
      );

      console.log('[DevDebug] Burn result:', result);

      if (result.success) {
        toast({
          title: "Test Burn Recorded",
          description: `Burn ID: ${result.burnId?.slice(0, 8)}... Amount: 100 TRN`,
        });
      } else {
        toast({
          title: "Burn Failed",
          description: result.error || "Unknown error",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('[DevDebug] Burn exception:', error);
      toast({
        title: "Burn Exception",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFetchTotalBurned = async () => {
    setIsLoading(true);
    console.log('[DevDebug] Fetching total burned...');
    
    try {
      const total = await getTotalBurned();
      console.log('[DevDebug] Total burned:', total);
      setTotalBurned(total);
      toast({
        title: "Total Burned Fetched",
        description: `${total.toLocaleString()} TRN total burned`,
      });
    } catch (error) {
      console.error('[DevDebug] Fetch error:', error);
      toast({
        title: "Fetch Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!IS_DEV) return null;

  return (
    <Card className="p-4 bg-gradient-to-br from-orange-950/50 to-red-950/50 border-orange-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Bug className="w-4 h-4 text-orange-500" />
        <h3 className="font-bold text-orange-500">Dev Debug Panel</h3>
      </div>
      
      <div className="space-y-3">
        <div className="text-xs text-muted-foreground">
          Connected: {connected ? publicKey?.toBase58().slice(0, 8) + '...' : 'No'}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleTestBurn}
            disabled={isLoading || !connected}
            className="text-xs border-orange-500/50 hover:bg-orange-500/20"
          >
            <Flame className="w-3 h-3 mr-1" />
            Test Burn (100 TRN)
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleFetchTotalBurned}
            disabled={isLoading}
            className="text-xs border-orange-500/50 hover:bg-orange-500/20"
          >
            Fetch Total Burned
          </Button>
        </div>

        {totalBurned !== null && (
          <div className="text-xs p-2 bg-background/50 rounded">
            <span className="text-muted-foreground">Total Burned: </span>
            <span className="font-mono font-bold text-orange-500">
              {totalBurned.toLocaleString()} TRN
            </span>
          </div>
        )}
      </div>
    </Card>
  );
};

const GoblinMarketContent = () => {
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
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <BackToHome />
          <div className="flex items-center gap-4">
            <LiveViewersCounter />
            {/* Phase 2.2: Improved Wallet Badge */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <BarChart3 className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground hidden sm:inline">Portfolio</span>
                    <WalletConnect />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-[220px] text-center">
                  <p className="text-xs">Track your TRN holdings & tier. For trading, use the wallet inside the DexScreener chart.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4 pb-20 space-y-6 flex-1">
        {/* Title Section */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl lg:text-6xl font-bold font-display bg-gradient-to-r from-goblin-green via-goblin-gold to-terrain-purple bg-clip-text text-transparent">
            🟢 Goblin Market
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Watch Terro the Terrain Goblin guard the TRN market. Live price data, 
            trading charts, and holder progress—all in one enchanted panel.
          </p>
          {/* Powered by TerrainVision badge */}
          <div className="flex justify-center pt-2">
            <PoweredByTerrainVision showAnalysisCount />
          </div>
        </div>

        {/* Dev Debug Panel - Only in development */}
        {IS_DEV && <DevDebugPanel />}

        {/* Main Chart - Full Width */}
        <DashboardErrorBoundary componentName="Price Chart">
          <DexScreenerChart />
        </DashboardErrorBoundary>

        {/* Burn Band Indicator */}
        <DashboardErrorBoundary componentName="Burn Band">
          <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
            <BurnBandIndicator showProgress />
          </Card>
        </DashboardErrorBoundary>

        {/* Holder Tracker */}
        <DashboardErrorBoundary componentName="Holder Tracker">
          <LiveHolderTracker />
        </DashboardErrorBoundary>

        {/* Cross-App Navigation */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button size="lg" asChild>
            <Link to="/transparency">
              View Transparency Hub →
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/#tokenomics">
              Explore Tokenomics
            </Link>
          </Button>
        </div>
      </main>

      {/* Phase 2.1: Add Footer */}
      <Footer />
    </div>
  );
};

const GoblinMarket = () => {
  return (
    <SolanaWalletProvider>
      <Helmet>
        <title>Goblin Market - Live TRN Price & Trading | Terrain Token</title>
        <meta
          name="description"
          content="Watch the Goblin Market live! Real-time TRN price, trading charts, holder stats, and market sentiment. Join the goblin horde today."
        />
      </Helmet>
      <GoblinMarketContent />
    </SolanaWalletProvider>
  );
};

export default GoblinMarket;