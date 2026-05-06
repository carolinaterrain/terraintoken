import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useTokenStats } from "@/hooks/useTokenStats";
import { getCumulativeEquipmentValue } from "@/lib/equipmentData";
import { calculateMetrics } from "@/lib/financialData";

interface ValuationData {
  monthlyRevenue: number;
  equipmentValue: number;
  holderCount: number;
  waitlistSize: number;
  circulatingSupply: number;
  marketPrice: number;
  isSupplyLive: boolean;
}

export function TRNValuationCard() {
  const { data: tokenStats } = useTokenStats();
  
  const { data: valuation, isLoading } = useQuery({
    queryKey: ["trn-valuation"],
    queryFn: async () => {
      // Fetch real data in parallel
      const [waitlistResult, snapshotResult, supplyResult] = await Promise.all([
        supabase.from("terrainscape_waitlist").select("*", { count: "exact", head: true }),
        supabase.from("holder_snapshots").select("total_holders").order("snapshot_date", { ascending: false }).limit(1).maybeSingle(),
        supabase.functions.invoke("fetch-token-supply"),
      ]);

      // Get real business data
      const equipmentData = getCumulativeEquipmentValue();
      const financialData = calculateMetrics();
      
      // Use live supply if available, otherwise use fallback
      const liveSupply = supplyResult.data?.circulatingSupply;
      const isSupplyLive = !supplyResult.error && liveSupply && !supplyResult.data?.isStale;
      
      const data: ValuationData = {
        monthlyRevenue: financialData.avgMonthlyRevenue,
        equipmentValue: equipmentData.totalCurrentValue,
        holderCount: snapshotResult.data?.total_holders || 0,
        waitlistSize: waitlistResult.count || 0,
        circulatingSupply: liveSupply || 1000000000, // Fallback to 1B if API fails
        marketPrice: tokenStats?.priceUsd ? parseFloat(tokenStats.priceUsd.replace(/[^0-9.]/g, '')) : 0,
        isSupplyLive: !!isSupplyLive,
      };

      return data;
    },
    refetchInterval: 300000, // Refresh every 5 minutes
  });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-goblin-gold" />
        </div>
      </Card>
    );
  }

  if (!valuation) return null;

  // Calculate fair value
  const annualizedRevenue = valuation.monthlyRevenue * 12;
  const revenueValue = annualizedRevenue * 0.15; // 15% revenue multiplier
  const assetValue = valuation.equipmentValue;
  const networkValue = valuation.holderCount * 50; // $50 per holder
  const growthPremium = valuation.waitlistSize * 10; // $10 per waitlist user

  const totalEcosystemValue = revenueValue + assetValue + networkValue + growthPremium;
  const fairValue = totalEcosystemValue / valuation.circulatingSupply;

  const mispricing = ((fairValue - valuation.marketPrice) / valuation.marketPrice) * 100;

  return (
    <Card className="p-6 border-terrain-purple/30">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        🔮 TRN Intrinsic Value Calculator
        {!valuation.isSupplyLive && (
          <Badge variant="outline" className="text-yellow-500 border-yellow-500/50 text-xs">
            Estimated Supply
          </Badge>
        )}
      </h3>

      {/* Fair Value vs Market Price */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <div className="text-sm text-muted-foreground">Fair Value (Model)</div>
          <div className="text-3xl font-bold text-goblin-green">${fairValue.toFixed(8)}</div>
        </div>
        <div>
          <div className="text-sm text-muted-foreground">Market Price</div>
          <div className="text-3xl font-bold">${valuation.marketPrice.toFixed(8)}</div>
        </div>
      </div>

      {/* Mispricing Indicator */}
      <div className="mb-6">
        <div className="text-sm text-muted-foreground mb-2">Valuation Gap</div>
        <Badge
          variant={mispricing > 0 ? "default" : "destructive"}
          className={mispricing > 0 ? "bg-goblin-green text-black" : ""}
        >
          {mispricing > 0 ? "Undervalued" : "Overvalued"} by {Math.abs(mispricing).toFixed(1)}%
        </Badge>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Annual Revenue × 15%</span>
          <span className="font-medium">${revenueValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Equipment Assets</span>
          <span className="font-medium">${assetValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Network Value ({valuation.holderCount} holders × $50)</span>
          <span className="font-medium">${networkValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Growth Premium ({valuation.waitlistSize} waitlist × $10)</span>
          <span className="font-medium">${growthPremium.toLocaleString()}</span>
        </div>
        <Separator className="my-2" />
        <div className="flex justify-between items-center font-bold text-base">
          <span>Total Ecosystem Value</span>
          <span className="text-goblin-gold">${totalEcosystemValue.toLocaleString()}</span>
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>Circulating Supply</span>
          <span>{(valuation.circulatingSupply / 1000000000).toFixed(3)}B TRN</span>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted/20 rounded-lg">
        <p className="text-xs text-muted-foreground leading-relaxed">
          <strong>How this works:</strong> Unlike pure community tokens, TRN is backed by real business assets and revenue.
          This model calculates fair value based on Carolina Terrain's equipment, service income, community growth, and network effects.
          Market price may differ due to speculation, but fundamentals anchor long-term value.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          * Not financial advice. Markets may misprice assets. Always DYOR.
        </p>
      </div>
    </Card>
  );
}
