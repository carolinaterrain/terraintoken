import { ArrowDownRight, ArrowUpRight, Clock } from "lucide-react";
import { useTradingHistory } from "@/hooks/useTradingHistory";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDistanceToNow } from "date-fns";

export const TradingHistoryFeed = () => {
  const { data, isLoading } = useTradingHistory();

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-64" />
      </Card>
    );
  }

  const transactions = data?.transactions || [];

  return (
    <Card className="p-6 bg-gradient-to-br from-terrain-dark via-terrain-shadow to-terrain-deep border-2 border-goblin-gold/60">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <Clock className="w-5 h-5 text-goblin-gold" />
          Recent Trading Activity
        </h3>
        <span className="text-xs text-muted-foreground">
          Live updates
        </span>
      </div>

      {transactions.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No recent transactions
        </p>
      ) : (
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {transactions.map((tx: any) => (
            <div
              key={tx.signature}
              className="flex items-center justify-between p-3 bg-terrain-shadow rounded-lg hover:bg-terrain-shadow/80 transition-colors"
            >
              <div className="flex items-center gap-3">
                {tx.type === "buy" ? (
                  <ArrowUpRight className="w-5 h-5 text-goblin-green" />
                ) : (
                  <ArrowDownRight className="w-5 h-5 text-destructive" />
                )}
                <div>
                  <p className="text-sm font-semibold">
                    {tx.type === "buy" ? "Buy" : tx.type === "sell" ? "Sell" : "Transfer"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(tx.timestamp), { addSuffix: true })}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-mono">
                  {(tx.amount / 1000000).toFixed(2)} TRN
                </p>
                <p className="text-xs text-muted-foreground">
                  {tx.fromAddress} → {tx.toAddress}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          Data provided by Helius API • Updated every minute
        </p>
      </div>
    </Card>
  );
};
