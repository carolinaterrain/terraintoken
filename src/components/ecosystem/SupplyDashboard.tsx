import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Coins, Lock, Flame, Users, Clock } from 'lucide-react';
import { LiveStats, formatTRN, MAX_SUPPLY, calculateSupplyPercentage } from '@/lib/carolinaTerrainSync';

interface SupplyDashboardProps {
  stats: LiveStats | null;
  loading?: boolean;
  isFallback?: boolean;
}

export const SupplyDashboard = memo(({ stats, loading, isFallback }: SupplyDashboardProps) => {
  const supplyMetrics = useMemo(() => {
    if (!stats) return null;

    const totalBurned = stats.total_burned || 0;
    const circulatingSupply = stats.current_supply || MAX_SUPPLY;
    const maxSupply = stats.max_supply || MAX_SUPPLY;

    return {
      maxSupply,
      circulatingSupply,
      totalBurned,
      effectiveSupply: maxSupply - totalBurned,
      burnPercentage: calculateSupplyPercentage(totalBurned, maxSupply),
    };
  }, [stats]);

  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-primary" />
            Supply Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <PieChart className="h-5 w-5 text-primary" />
          Supply Dashboard
        </CardTitle>
        {isFallback && (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
            Cached
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Supply Overview - Live Data */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <Coins className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-xl font-bold text-foreground">
              {formatTRN(supplyMetrics?.maxSupply || MAX_SUPPLY)}
            </p>
            <p className="text-xs text-muted-foreground">Max Supply</p>
          </div>
          <div className="p-4 bg-muted/50 rounded-lg text-center">
            <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-xl font-bold text-foreground">
              {formatTRN(supplyMetrics?.circulatingSupply || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Circulating</p>
          </div>
          <div className="p-4 bg-destructive/10 rounded-lg text-center">
            <Flame className="h-6 w-6 mx-auto mb-2 text-destructive" />
            <p className="text-xl font-bold text-destructive">
              {formatTRN(supplyMetrics?.totalBurned || 0)}
            </p>
            <p className="text-xs text-muted-foreground">Burned Forever</p>
          </div>
          <div className="p-4 bg-primary/10 rounded-lg text-center">
            <Lock className="h-6 w-6 mx-auto mb-2 text-primary" />
            <p className="text-xl font-bold text-primary">
              {formatTRN(supplyMetrics?.effectiveSupply || MAX_SUPPLY)}
            </p>
            <p className="text-xs text-muted-foreground">Effective Supply</p>
          </div>
        </div>

        {/* Supply Distribution - Coming Soon for allocations */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-foreground">Supply Distribution</h4>
          <div className="space-y-3">
            {/* Burned - Live Data */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Flame className="h-3 w-3 text-destructive" /> Burned (Deflationary)
                </span>
                <span className="text-destructive font-medium">
                  {formatTRN(supplyMetrics?.totalBurned || 0)} ({supplyMetrics?.burnPercentage?.toFixed(4)}%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-destructive to-orange-500" 
                  style={{ width: `${Math.min((supplyMetrics?.burnPercentage || 0) * 10, 100)}%` }} 
                />
              </div>
            </div>

            {/* Coming Soon sections for allocations */}
            <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-dashed border-border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Allocation Breakdown</span>
                <Badge variant="outline" className="text-xs">Coming Soon</Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                Live wallet tracking for Treasury, Founder Holdings, and Community Rewards Pool is in development. 
                These metrics will show real-time balances from on-chain data.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <div className="p-2 bg-muted/50 rounded text-center">
                  <Lock className="h-4 w-4 mx-auto mb-1 text-blue-500/50" />
                  <p className="text-xs text-muted-foreground">Treasury</p>
                </div>
                <div className="p-2 bg-muted/50 rounded text-center">
                  <Lock className="h-4 w-4 mx-auto mb-1 text-purple-500/50" />
                  <p className="text-xs text-muted-foreground">Founders</p>
                </div>
                <div className="p-2 bg-muted/50 rounded text-center">
                  <span className="text-sm opacity-50">🎁</span>
                  <p className="text-xs text-muted-foreground">Rewards</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Deflationary Stats */}
        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-2 text-foreground flex items-center gap-2">
            <Flame className="h-4 w-4 text-destructive" />
            Deflationary Mechanism
          </h4>
          <p className="text-sm text-muted-foreground">
            TRN is <span className="text-destructive font-semibold">deflationary</span> - tokens are permanently burned 
            from circulation through usage fees, reducing total supply over time. This creates natural scarcity 
            and potential value appreciation for long-term holders.
          </p>
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">
              Current burn rate: <span className="text-destructive font-medium">5% of fees</span>
            </span>
            <Badge variant="outline" className="text-destructive border-destructive/50">
              Fixed Supply Cap: 1B TRN
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SupplyDashboard.displayName = 'SupplyDashboard';
