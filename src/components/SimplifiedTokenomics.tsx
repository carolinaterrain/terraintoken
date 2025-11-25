import { GlassCard } from "@/components/ui/glass-card";
import { Coins, Shield, Rocket, Gift, ExternalLink, AlertCircle } from "lucide-react";
import { useTokenSupply, formatSupply } from "@/hooks/useTokenSupply";
import { Skeleton } from "@/components/ui/skeleton";

const staticStats = [
  {
    icon: Shield,
    label: "Taxes",
    value: "0%",
  },
  {
    icon: Rocket,
    label: "Distribution",
    value: "100% Fair",
  },
  {
    icon: Gift,
    label: "Earn Per Upload",
    value: "10-75 TRN",
  },
];

export const SimplifiedTokenomics = () => {
  const { data: supplyData, isLoading } = useTokenSupply();
  
  return (
    <section className="py-8 px-4">
      <div className="container mx-auto">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-center">
          <span className="text-primary">Key Numbers</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {/* Live Supply Data */}
          <GlassCard className="p-4 text-center">
            <Coins className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-xs text-muted-foreground mb-1">Total Supply</p>
            {isLoading ? (
              <Skeleton className="h-7 w-24 mx-auto" />
            ) : (
              <>
                <p className="font-display text-lg md:text-xl font-bold text-primary">
                  {supplyData ? formatSupply(supplyData.totalSupply, supplyData.decimals) : '—'} TRN
                </p>
                {supplyData?.isStale && (
                  <AlertCircle className="w-3 h-3 text-yellow-500 mx-auto mt-1" />
                )}
                <a
                  href="https://solscan.io/token/2L1xfpJ56tjevGzqzDCqxvuAgU4pDZL166hKQSeKpump"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10px] text-muted-foreground hover:text-primary mt-1"
                >
                  Verify <ExternalLink className="w-2 h-2" />
                </a>
              </>
            )}
          </GlassCard>

          {/* Static Stats */}
          {staticStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <GlassCard 
                key={index}
                className="p-4 text-center"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-2" />
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className="font-display text-lg md:text-xl font-bold text-primary">{stat.value}</p>
              </GlassCard>
            );
          })}
        </div>
        
        {supplyData && !isLoading && (
          <p className="text-center text-[10px] text-muted-foreground mt-3">
            Last updated: {new Date(supplyData.lastUpdated).toLocaleString()}
          </p>
        )}
      </div>
    </section>
  );
};
