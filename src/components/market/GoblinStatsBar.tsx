import { ArrowUpRight, ArrowDownRight, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { DataBadge } from "./DataBadge";

interface GoblinStatsBarProps {
  price: number;
  priceChange24h: number;
  marketCap: number;
  volume24h: number;
  liquidity: number;
}

export const GoblinStatsBar = ({
  price,
  priceChange24h,
  marketCap,
  volume24h,
  liquidity,
}: GoblinStatsBarProps) => {
  const isPositive = priceChange24h >= 0;
  
  return (
    <div className="w-full bg-gradient-to-r from-terrain-dark via-terrain-shadow to-terrain-dark border-2 border-goblin-gold/60 rounded-2xl px-6 py-4 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Price Section */}
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <div className="text-xs uppercase tracking-[0.2em] text-goblin-gold/70 font-display">
              Terrain Token · TRN
            </div>
            <DataBadge type="live" className="scale-90" />
          </div>
          <div className="flex items-end gap-3">
            <span className="text-4xl lg:text-5xl font-bold text-goblin-gold font-display">
              ${price.toFixed(8)}
            </span>
            <div className={cn(
              "flex items-center gap-1 text-lg font-semibold mb-1",
              isPositive ? "text-goblin-green" : "text-destructive"
            )}>
              {isPositive ? (
                <ArrowUpRight className="w-5 h-5" />
              ) : (
                <ArrowDownRight className="w-5 h-5" />
              )}
              <span>
                {isPositive ? "+" : ""}
                {priceChange24h.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          <StatItem label="Market Cap" value={formatCurrency(marketCap)} />
          <StatItem label="24h Volume" value={formatCurrency(volume24h)} />
          <StatItem label="Liquidity" value={formatCurrency(liquidity)} />
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-2">
          <a
            href="https://pump.fun/GwXzGeZFF4jK1PqzVd17MHioY7pqSET7r6UY7RS1pump"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-goblin-green hover:bg-goblin-green/80 text-terrain-dark shadow-lg shadow-goblin-green/40 transition-all hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>Buy TRN</span>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://dexscreener.com/solana/GwXzGeZFF4jK1PqzVd17MHioY7pqSET7r6UY7RS1pump"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 text-sm font-semibold rounded-xl bg-terrain-purple hover:bg-terrain-purple/80 text-foreground shadow-lg shadow-terrain-purple/40 transition-all hover:scale-105 flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <span>View Chart</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
      
      <p className="text-[10px] text-muted-foreground mt-3 text-center">
        For education + entertainment. Not financial advice. Crypto is highly volatile.
      </p>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
    <div className="text-base lg:text-lg font-semibold text-foreground">{value}</div>
  </div>
);

function formatCurrency(value: number): string {
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  if (value >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
  return `$${value.toFixed(0)}`;
}
