import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, ExternalLink, TrendingDown } from 'lucide-react';
import { BurnData, formatTRN, getSolscanTxUrl, MAX_SUPPLY } from '@/lib/carolinaTerrainSync';
import { GlossaryTooltip } from '@/components/ecosystem/GlossaryTooltip';
import { PoweredByTerrainVision } from '@/components/ecosystem/PoweredByTerrainVision';

interface BurnTrackerProps {
  burns: BurnData | null;
  loading?: boolean;
  isFallback?: boolean;
}

export const BurnTracker = memo(({ burns, loading, isFallback }: BurnTrackerProps) => {
  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-destructive" />
            Burn Tracker
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const burnPercentage = burns?.total_burned 
    ? ((burns.total_burned / MAX_SUPPLY) * 100).toFixed(4) 
    : '0';

  return (
    <Card className="bg-card/50 backdrop-blur border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-destructive" />
          <GlossaryTooltip termKey="buyback_burn" showIcon>
            Burn Tracker
          </GlossaryTooltip>
        </CardTitle>
        <div className="flex items-center gap-2">
          {isFallback && (
            <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
              Cached
            </Badge>
          )}
          <PoweredByTerrainVision showAnalysisCount={false} />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Burn Summary */}
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                <GlossaryTooltip termKey="buyback_burn" showIcon={false}>
                  Total Burned
                </GlossaryTooltip>
              </p>
              <p className="text-2xl font-bold text-destructive">
                {formatTRN(burns?.total_burned || 0)}
              </p>
              <p className="text-xs text-muted-foreground">TRN</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">% of Supply</p>
              <p className="text-2xl font-bold text-destructive">
                {burnPercentage}%
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">Burn Events</p>
              <p className="text-2xl font-bold text-foreground">
                {burns?.burn_count || 0}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground">24h Velocity</p>
              <p className="text-2xl font-bold text-foreground">
                {formatTRN(burns?.burn_velocity_24h || 0)}
              </p>
            </div>
          </div>
        </div>

        {/* Burn Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Deflationary Progress</span>
            <span className="text-destructive font-medium">{burnPercentage}% burned</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-destructive to-orange-500 transition-all duration-1000"
              style={{ width: `${Math.min(parseFloat(burnPercentage) * 10, 100)}%` }}
            />
          </div>
        </div>

        {/* Burns by Type */}
        {burns?.burns_by_type && Object.keys(burns.burns_by_type).length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-2 text-foreground">Burns by Type</h4>
            <div className="flex flex-wrap gap-2">
              {Object.entries(burns.burns_by_type).map(([type, amount]) => (
                <Badge key={type} variant="secondary" className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />
                  {type}: {formatTRN(amount)}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Recent Burns */}
        {burns?.recent_burns && burns.recent_burns.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">Recent Burns</h4>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {burns.recent_burns.slice(0, 5).map((burn, index) => (
                <div 
                  key={burn.tx_signature || index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-destructive/20 rounded-full">
                      <Flame className="h-4 w-4 text-destructive" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        🔥 {formatTRN(burn.amount)} TRN
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {burn.burn_type} • {new Date(burn.confirmed_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  {burn.tx_signature && (
                    <a
                      href={getSolscanTxUrl(burn.tx_signature)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Burns State */}
        {(!burns?.recent_burns || burns.recent_burns.length === 0) && (
          <div className="text-center py-8 text-muted-foreground">
            <Flame className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No on-chain burns recorded yet</p>
            <p className="text-sm">Burns will appear when real transactions occur</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

BurnTracker.displayName = 'BurnTracker';
