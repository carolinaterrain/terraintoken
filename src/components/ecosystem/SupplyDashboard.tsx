import { memo, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { PieChart, Coins, Lock, Flame, Users } from 'lucide-react';
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
    
    // Estimated allocations (these would come from actual data in production)
    const treasuryHoldings = maxSupply * 0.20; // 20% Treasury
    const founderHoldings = maxSupply * 0.10; // 10% Founders (locked)
    const communityRewards = maxSupply * 0.05; // 5% Rewards Pool
    const publicCirculating = circulatingSupply - treasuryHoldings - founderHoldings - communityRewards;

    return {
      maxSupply,
      circulatingSupply,
      totalBurned,
      effectiveSupply: maxSupply - totalBurned,
      publicCirculating: Math.max(0, publicCirculating),
      treasuryHoldings,
      founderHoldings,
      communityRewards,
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
        {/* Supply Overview */}
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

        {/* Visual Supply Distribution */}
        <div>
          <h4 className="text-sm font-medium mb-3 text-foreground">Supply Distribution</h4>
          <div className="space-y-3">
            {/* Public Circulating */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Users className="h-3 w-3" /> Public Circulating
                </span>
                <span className="text-foreground font-medium">
                  {formatTRN(supplyMetrics?.publicCirculating || 0)} (65%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary" style={{ width: '65%' }} />
              </div>
            </div>

            {/* Treasury */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Treasury Holdings
                </span>
                <span className="text-foreground font-medium">
                  {formatTRN(supplyMetrics?.treasuryHoldings || 0)} (20%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500" style={{ width: '20%' }} />
              </div>
            </div>

            {/* Founder Holdings */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" /> Founder Holdings (Locked)
                </span>
                <span className="text-foreground font-medium">
                  {formatTRN(supplyMetrics?.founderHoldings || 0)} (10%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-purple-500" style={{ width: '10%' }} />
              </div>
            </div>

            {/* Rewards Pool */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  🎁 Community Rewards Pool
                </span>
                <span className="text-foreground font-medium">
                  {formatTRN(supplyMetrics?.communityRewards || 0)} (5%)
                </span>
              </div>
              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary/70" style={{ width: '5%' }} />
              </div>
            </div>

            {/* Burned */}
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
