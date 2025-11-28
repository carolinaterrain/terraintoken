import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Wifi, WifiOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TRNLiveStats } from '@/components/ecosystem/TRNLiveStats';
import { BurnTracker } from '@/components/ecosystem/BurnTracker';
import { TreasuryTransparency } from '@/components/ecosystem/TreasuryTransparency';
import { SupplyDashboard } from '@/components/ecosystem/SupplyDashboard';
import { useFullEcosystemData } from '@/hooks/useCarolinaTerrainSync';

export default function TRNEcosystem() {
  const {
    liveStats,
    burns,
    treasury,
    foundation,
    rewardsPool,
    loading,
    error,
    refetch,
    isFallback,
    lastUpdated,
    source,
  } = useFullEcosystemData(60000); // Refresh every 60 seconds

  return (
    <>
      <Helmet>
        <title>TRN Ecosystem Dashboard | Terrain Token</title>
        <meta 
          name="description" 
          content="Real-time TRN token ecosystem dashboard showing live stats, burn tracker, treasury transparency, and supply metrics from Carolina Terrain integration." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link to="/">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                </Link>
                <div>
                  <h1 className="text-xl font-bold text-foreground">TRN Ecosystem</h1>
                  <p className="text-sm text-muted-foreground">
                    Live data synced from Carolina Terrain
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Connection Status */}
                <div className="flex items-center gap-2 text-sm">
                  {isFallback ? (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/50 gap-1">
                      <WifiOff className="h-3 w-3" />
                      Cached
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-primary border-primary/50 gap-1">
                      <Wifi className="h-3 w-3" />
                      Live
                    </Badge>
                  )}
                </div>

                {/* Last Updated */}
                {lastUpdated && (
                  <span className="text-xs text-muted-foreground hidden md:block">
                    Updated: {new Date(lastUpdated).toLocaleTimeString()}
                  </span>
                )}

                {/* Refresh Button */}
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={refetch}
                  disabled={loading}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <span className="hidden md:inline">Refresh</span>
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 space-y-8">
          {/* Error Banner */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-center">
              <p className="text-destructive font-medium">
                ⚠️ {error}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Showing cached data. Live sync will resume automatically.
              </p>
            </div>
          )}

          {/* Live Stats */}
          <TRNLiveStats 
            stats={liveStats} 
            loading={loading && !liveStats}
            isFallback={isFallback}
          />

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-8">
              <SupplyDashboard 
                stats={liveStats} 
                loading={loading && !liveStats}
                isFallback={isFallback}
              />
              <BurnTracker 
                burns={burns} 
                loading={loading && !burns}
                isFallback={isFallback}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              <TreasuryTransparency 
                treasury={treasury}
                foundation={foundation}
                rewardsPool={rewardsPool}
                loading={loading && !treasury}
                isFallback={isFallback}
              />
            </div>
          </div>

          {/* Footer Note */}
          <div className="text-center py-8 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Data sourced from Carolina Terrain ({source}) • Auto-refreshes every 60 seconds
            </p>
            <div className="flex justify-center gap-4 mt-4">
              <Link to="/market">
                <Button variant="outline" size="sm">View Market Data</Button>
              </Link>
              <Link to="/transparency">
                <Button variant="outline" size="sm">Full Transparency Hub</Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
