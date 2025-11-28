import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface HolderTiers {
  shrimp: number;
  crab: number;
  fish: number;
  dolphin: number;
  shark: number;
  whale: number;
  humpback: number;
}

export interface HolderDistribution {
  totalHolders: number;
  tiers: HolderTiers;
  top10Percentage: number;
}

export function useHolderDistribution() {
  return useQuery({
    queryKey: ["holder-distribution"],
    queryFn: async (): Promise<HolderDistribution> => {
      // Fetch fresh data from the edge function (which has caching built in)
      const { data, error } = await supabase.functions.invoke("fetch-holder-data");

      if (error || !data) {
        console.error('Error fetching holder distribution:', error);
        // Return zero state - no fake data
        return {
          totalHolders: 0,
          tiers: {
            shrimp: 0,
            crab: 0,
            fish: 0,
            dolphin: 0,
            shark: 0,
            whale: 0,
            humpback: 0,
          },
          top10Percentage: 0,
        };
      }

      return {
        totalHolders: data.totalHolders || 0,
        tiers: data.tiers || {
          shrimp: 0,
          crab: 0,
          fish: 0,
          dolphin: 0,
          shark: 0,
          whale: 0,
          humpback: 0,
        },
        top10Percentage: data.top10Percentage || 0,
      };
    },
    refetchInterval: 600000, // Refresh every 10 minutes (matches edge function cache)
    staleTime: 540000, // Consider data stale after 9 minutes
  });
}
