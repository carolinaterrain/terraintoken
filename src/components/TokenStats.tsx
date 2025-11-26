import { useState, memo, useCallback } from "react";
import { TrendingUp, TrendingDown, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTokenData } from "@/providers/TokenDataProvider";
import { useMemeStats } from "@/hooks/useTokenStats";
import { Skeleton } from "@/components/ui/skeleton";
import { DataBadge } from "@/components/market/DataBadge";

const TokenStats = memo(() => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const { toast } = useToast();
  const { stats, isLoading, holderCount, dataSource } = useTokenData();
  const { data: memeStats } = useMemeStats();

  const handleCopy = useCallback((value: string, label: string, index: number) => {
    navigator.clipboard.writeText(value);
    setCopiedIndex(index);
    toast({
      title: "Copied!",
      description: `${label}: ${value}`,
    });
    setTimeout(() => setCopiedIndex(null), 2000);
  }, [toast]);

  if (isLoading || !stats) {
    return (
      <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-12 w-32" />)}
          </div>
        </div>
      </div>
    );
  }

  const statsArray = [
    { label: "Market Cap", value: stats.marketCap, change: stats.change24h, source: dataSource.stats },
    { label: "Price", value: `$${stats.priceUsd}`, change: stats.change24h, source: dataSource.stats },
    { label: "24h Vol", value: stats.volume24h, change: 0, source: dataSource.stats },
    { label: "Holders", value: holderCount?.holderCount?.toLocaleString() || "N/A", change: 0, source: dataSource.holders },
  ];

  const goblinMood = stats.change24h > 0 ? "🎉" : stats.change24h < -5 ? "😱" : "🏄‍♂️";

  return (
    <div className="sticky top-0 z-40 bg-background/80 backdrop-blur-md border-b border-primary/20 shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-8 min-w-max">
            {statsArray.map((stat, index) => (
              <button
                key={index}
                onClick={() => handleCopy(stat.value, stat.label, index)}
                className="flex items-center gap-2 hover:bg-primary/10 px-3 py-2 rounded-lg transition-colors group"
              >
                <div className="text-left">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    {stat.label}
                    <DataBadge type={stat.source} className="scale-75" />
                  </div>
                  <div className="text-sm font-bold flex items-center gap-1">
                    {stat.value}
                    {stat.change !== 0 && (
                      <span className={`flex items-center text-xs ${stat.change > 0 ? "text-green-500" : "text-red-500"}`}>
                        {stat.change > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {Math.abs(stat.change).toFixed(1)}%
                      </span>
                    )}
                  </div>
                </div>
                {copiedIndex === index ? (
                  <Check className="w-3 h-3 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                ) : (
                  <Copy className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                )}
              </button>
            ))}
          </div>
          <div className="ml-4 text-2xl animate-slide-right pointer-events-none">{goblinMood}</div>
        </div>
      </div>
      
      {/* Meme Terrain Report */}
      {memeStats && memeStats.length > 0 && (
        <div className="bg-primary/5 border-t border-primary/10 overflow-hidden">
          <div className="animate-scroll-left whitespace-nowrap py-2 px-4 flex gap-8">
            {[...memeStats, ...memeStats].map((meme, i) => (
              <span key={i} className="text-xs">
                <strong>{meme.symbol}</strong> {meme.price} 
                <span className={meme.change24h > 0 ? "text-green-500" : "text-red-500"}>
                  {meme.change24h > 0 ? "↑" : "↓"}{Math.abs(meme.change24h).toFixed(1)}%
                </span>
                <span className="text-muted-foreground ml-2">{meme.commentary}</span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

TokenStats.displayName = 'TokenStats';

export default TokenStats;
