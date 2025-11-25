import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSmartPolling } from "./useSmartPolling";

export interface DashboardMetrics {
  onChain: {
    holders: {
      current: number;
      change24h: number;
      change7d: number;
    };
    transactions24h: number;
    uniqueBuyers24h: number;
    uniqueSellers24h: number;
    volume24h: number;
    isLiveData: boolean;
  };
  utility: {
    toolUsers7d: number;
    proofsSubmitted24h: number;
    rewardsIssued24h: number;
    activeUsers7d: number;
  };
  trust: {
    lockPercentage: number;
    daysSinceDevSell: string;
    multisigStatus: string;
  };
  lastUpdated: string;
}

export function useDashboardMetrics() {
  const pollingInterval = useSmartPolling(60000); // 1 minute

  return useQuery({
    queryKey: ["dashboard-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("dashboard-metrics");

      if (error) {
        console.error("Error fetching dashboard metrics:", error);
        // Return fallback data
        return {
          onChain: {
            holders: { current: 0, change24h: 0, change7d: 0 },
            transactions24h: 0,
            uniqueBuyers24h: 0,
            uniqueSellers24h: 0,
            volume24h: 0,
            isLiveData: false,
          },
          utility: {
            toolUsers7d: 0,
            proofsSubmitted24h: 0,
            rewardsIssued24h: 0,
            activeUsers7d: 0,
          },
          trust: {
            lockPercentage: 0,
            daysSinceDevSell: '∞',
            multisigStatus: 'unknown',
          },
          lastUpdated: new Date().toISOString(),
          error: error.message,
        } as DashboardMetrics & { error: string };
      }

      return data as DashboardMetrics;
    },
    refetchInterval: pollingInterval,
    staleTime: 55000, // 55 seconds
  });
}

// Helper to check if data is stale (> 5 minutes old)
export function isDataStale(lastUpdated: string): boolean {
  const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
  return new Date(lastUpdated).getTime() < fiveMinutesAgo;
}

// Format holder change with +/- sign
export function formatHolderChange(change: number): string {
  if (change === 0) return '0';
  return change > 0 ? `+${change}` : `${change}`;
}

// Format volume with K/M suffix
export function formatVolume(volume: number): string {
  if (volume >= 1_000_000) {
    return `${(volume / 1_000_000).toFixed(2)}M`;
  }
  if (volume >= 1_000) {
    return `${(volume / 1_000).toFixed(1)}K`;
  }
  return volume.toFixed(0);
}
