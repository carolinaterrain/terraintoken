import { DataBadge } from "./DataBadge";
import { memo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

export const DexScreenerChart = memo(() => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRetry = () => {
    setHasError(false);
    setIsLoaded(false);
    // Force iframe reload by remounting
    const iframe = document.querySelector('iframe[title="TRN Trading Chart"]') as HTMLIFrameElement;
    if (iframe) {
      iframe.src = iframe.src;
    }
  };

  return (
    <div className="bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60 rounded-2xl p-4 shadow-[0_0_30px_rgba(251,191,36,0.3)] relative overflow-hidden">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-xl font-bold text-goblin-gold flex items-center gap-2">
            📈 Live Trading Chart
          </h3>
          <DataBadge type="live" />
        </div>
        <div className="text-xs text-muted-foreground">
          Powered by DexScreener
        </div>
      </div>

      {/* Embed Container */}
      <div className="relative w-full dex-embed-container">
        <style>{`
          .dex-embed-container {
            padding-bottom: 125%;
          }
          @media(min-width:1400px) {
            .dex-embed-container {
              padding-bottom: 65%;
            }
          }
        `}</style>
        
        {/* Loading Skeleton */}
        {!isLoaded && !hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-terrain-dark rounded-lg">
            <Skeleton className="w-full h-full absolute inset-0" />
            <div className="relative z-20 text-center space-y-3">
              <RefreshCw className="w-8 h-8 animate-spin text-goblin-gold mx-auto" />
              <p className="text-sm text-muted-foreground">Loading chart...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-terrain-dark rounded-lg">
            <div className="text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
              <p className="text-sm text-muted-foreground">Chart failed to load</p>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRetry}
                className="gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Retry
              </Button>
            </div>
          </div>
        )}

        <iframe
          src="https://dexscreener.com/solana/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump?embed=1&loadChartSettings=0&chartLeftToolbar=0&chartTheme=dark&theme=dark&chartStyle=0&chartType=usd&interval=15"
          className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
          title="TRN Trading Chart"
          onLoad={() => setIsLoaded(true)}
          onError={() => setHasError(true)}
        />
      </div>

      {/* Terro mascot overlay */}
      <div className="absolute bottom-6 right-6 w-12 h-12 opacity-40 hover:opacity-100 transition-opacity pointer-events-none z-10">
        <img
          src="/terrain-mascot.png"
          alt="Terro watching the market"
          className="w-full h-full object-contain drop-shadow-lg"
        />
      </div>
    </div>
  );
});

DexScreenerChart.displayName = 'DexScreenerChart';