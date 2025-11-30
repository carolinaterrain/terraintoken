import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Wallet, ArrowUpRight, ArrowDownRight, ExternalLink, PiggyBank, Heart } from 'lucide-react';
import { TreasuryData, FoundationData, RewardsPoolData, formatTRN, getSolscanTxUrl, FEE_ALLOCATION } from '@/lib/carolinaTerrainSync';
import { useTreasuryBalance } from '@/hooks/useTreasuryBalance';

interface TreasuryTransparencyProps {
  treasury: TreasuryData | null;
  foundation: FoundationData | null;
  rewardsPool: RewardsPoolData | null;
  loading?: boolean;
  isFallback?: boolean;
}

export const TreasuryTransparency = memo(({ 
  treasury, 
  foundation, 
  rewardsPool, 
  loading, 
  isFallback 
}: TreasuryTransparencyProps) => {
  const { treasuryBalance, loading: treasuryBalanceLoading, isLive: treasuryIsLive } = useTreasuryBalance();
  
  if (loading) {
    return (
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="h-5 w-5 text-primary" />
            Treasury Transparency
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
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
          <Wallet className="h-5 w-5 text-primary" />
          Treasury Transparency
        </CardTitle>
        {isFallback && (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
            Cached
          </Badge>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Fee Allocation Model */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
          <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-foreground">
            <PiggyBank className="h-4 w-4 text-primary" />
            Fee Allocation Model
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-destructive">{FEE_ALLOCATION.BURN * 100}%</p>
              <p className="text-xs text-muted-foreground">🔥 Burn</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-pink-500">{FEE_ALLOCATION.FOUNDATION * 100}%</p>
              <p className="text-xs text-muted-foreground">❤️ Foundation</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-primary">{FEE_ALLOCATION.REWARDS * 100}%</p>
              <p className="text-xs text-muted-foreground">🎁 Rewards</p>
            </div>
            <div className="p-3 bg-background/50 rounded-lg">
              <p className="text-2xl font-bold text-blue-500">{FEE_ALLOCATION.TREASURY * 100}%</p>
              <p className="text-xs text-muted-foreground">🏦 Treasury</p>
            </div>
          </div>
        </div>

        {/* Live Treasury Balance */}
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-foreground">🏦 On-Chain Treasury</h4>
            {treasuryBalanceLoading ? (
              <Skeleton className="h-5 w-12" />
            ) : treasuryIsLive ? (
              <Badge className="bg-primary/20 text-primary border-primary/30 text-xs">
                Live from Helius
              </Badge>
            ) : (
              <Badge variant="outline" className="text-yellow-500 border-yellow-500/50 text-xs">
                Cached
              </Badge>
            )}
          </div>
          
          {treasuryBalanceLoading ? (
            <Skeleton className="h-10 w-48" />
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-primary">
                  {treasuryBalance.balanceFormatted} TRN
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {treasuryBalance.balance.toLocaleString()} TRN
                </p>
              </div>
              <a
                href={`https://solscan.io/account/${treasuryBalance.walletAddress}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-3 py-2 bg-primary/10 hover:bg-primary/20 rounded-lg text-sm text-primary transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Verify on Solscan
              </a>
            </div>
          )}
        </div>

        {/* Legacy Treasury Stats (if available from database) */}
        {treasury && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <ArrowUpRight className="h-3 w-3 text-primary" />
                Total Income (Recorded)
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatTRN(treasury.total_income)} TRN
              </p>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg text-center">
              <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                <ArrowDownRight className="h-3 w-3 text-destructive" />
                Total Expenses (Recorded)
              </p>
              <p className="text-2xl font-bold text-destructive">
                {formatTRN(treasury.total_expenses)} TRN
              </p>
            </div>
          </div>
        )}

        {/* Rewards Pool */}
        {rewardsPool && (
          <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <h4 className="text-sm font-medium mb-3 text-foreground">🎁 Rewards Pool</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-foreground">
                  {formatTRN(rewardsPool.current_balance)}
                </p>
                <p className="text-xs text-muted-foreground">Available</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  {formatTRN(rewardsPool.total_deposited)}
                </p>
                <p className="text-xs text-muted-foreground">Total Deposited</p>
              </div>
              <div>
                <p className="text-lg font-bold text-muted-foreground">
                  {formatTRN(rewardsPool.total_distributed)}
                </p>
                <p className="text-xs text-muted-foreground">Distributed</p>
              </div>
            </div>
          </div>
        )}

        {/* Foundation Stats */}
        {foundation && (
          <div className="p-4 bg-pink-500/5 border border-pink-500/20 rounded-lg">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2 text-foreground">
              <Heart className="h-4 w-4 text-pink-500" />
              Community Foundation
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-foreground">
                  {formatTRN(foundation.total_allocated)}
                </p>
                <p className="text-xs text-muted-foreground">Allocated</p>
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">
                  {foundation.grant_stats.total_proposals}
                </p>
                <p className="text-xs text-muted-foreground">Proposals</p>
              </div>
              <div>
                <p className="text-lg font-bold text-primary">
                  {foundation.grant_stats.funded}
                </p>
                <p className="text-xs text-muted-foreground">Funded</p>
              </div>
              <div>
                <p className="text-lg font-bold text-yellow-500">
                  {foundation.grant_stats.pending}
                </p>
                <p className="text-xs text-muted-foreground">Pending</p>
              </div>
            </div>
          </div>
        )}

        {/* Recent Transactions */}
        {treasury?.recent_transactions && treasury.recent_transactions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-3 text-foreground">Recent Transactions</h4>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {treasury.recent_transactions.slice(0, 5).map((tx, index) => (
                <div 
                  key={tx.tx_signature || index}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      tx.type === 'income' ? 'bg-primary/20' : 'bg-destructive/20'
                    }`}>
                      {tx.type === 'income' ? (
                        <ArrowUpRight className="h-4 w-4 text-primary" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-destructive" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">
                        {tx.type === 'income' ? '+' : '-'}{formatTRN(tx.amount)} TRN
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {tx.description}
                      </p>
                    </div>
                  </div>
                  {tx.tx_signature && (
                    <a
                      href={getSolscanTxUrl(tx.tx_signature)}
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

        {/* No Data State */}
        {!treasury && !foundation && !rewardsPool && (
          <div className="text-center py-8 text-muted-foreground">
            <Wallet className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Treasury data not available</p>
            <Badge variant="outline" className="mt-2">Coming Soon</Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
});

TreasuryTransparency.displayName = 'TreasuryTransparency';
