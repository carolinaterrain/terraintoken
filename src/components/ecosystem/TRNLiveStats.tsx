import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { TrendingUp, TrendingDown, DollarSign, Coins, Activity, Users, ExternalLink } from 'lucide-react';
import { LiveStats, formatUSD, formatTRN, getSolscanTokenUrl } from '@/lib/carolinaTerrainSync';

interface TRNLiveStatsProps {
  stats: LiveStats | null;
  loading?: boolean;
  isFallback?: boolean;
}

export const TRNLiveStats = memo(({ stats, loading, isFallback }: TRNLiveStatsProps) => {
  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Live Token Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const priceChangePositive = (stats?.price_change_24h || 0) >= 0;

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Live Token Stats
        </CardTitle>
        <div className="flex items-center gap-2">
          {isFallback && (
            <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
              Cached Data
            </Badge>
          )}
          <a
            href={getSolscanTokenUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Price USD */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              Price USD
            </p>
            <p className="text-2xl font-bold text-foreground">
              {formatUSD(stats?.price_usd || 0)}
            </p>
          </div>

          {/* 24h Change */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">24h Change</p>
            <p className={`text-2xl font-bold flex items-center gap-1 ${
              priceChangePositive ? 'text-primary' : 'text-destructive'
            }`}>
              {priceChangePositive ? (
                <TrendingUp className="h-5 w-5" />
              ) : (
                <TrendingDown className="h-5 w-5" />
              )}
              {priceChangePositive ? '+' : ''}
              {(stats?.price_change_24h || 0).toFixed(2)}%
            </p>
          </div>

          {/* Market Cap */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Market Cap</p>
            <p className="text-2xl font-bold text-foreground">
              {formatUSD(stats?.market_cap_usd || 0)}
            </p>
          </div>

          {/* 24h Volume */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">24h Volume</p>
            <p className="text-2xl font-bold text-foreground">
              {formatUSD(stats?.volume_24h_usd || 0)}
            </p>
          </div>

          {/* Circulating Supply */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Coins className="h-3 w-3" />
              Circulating Supply
            </p>
            <p className="text-xl font-semibold text-foreground">
              {formatTRN(stats?.current_supply || 0)} TRN
            </p>
          </div>

          {/* Total Burned */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total Burned</p>
            <p className="text-xl font-semibold text-destructive">
              🔥 {formatTRN(stats?.total_burned || 0)} TRN
            </p>
          </div>

          {/* Liquidity */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Liquidity</p>
            <p className="text-xl font-semibold text-foreground">
              {formatUSD(stats?.liquidity_usd || 0)}
            </p>
          </div>

          {/* Active Users */}
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-3 w-3" />
              Active Users
            </p>
            <p className="text-xl font-semibold text-foreground">
              {(stats?.active_users || 0).toLocaleString()}
            </p>
          </div>
        </div>

        {stats?.last_updated && (
          <p className="text-xs text-muted-foreground mt-4 text-right">
            Last updated: {new Date(stats.last_updated).toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
});

TRNLiveStats.displayName = 'TRNLiveStats';
