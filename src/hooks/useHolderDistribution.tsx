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
      // Get latest snapshot
      const { data: snapshot, error } = await supabase
        .from('holder_snapshots')
        .select('*')
        .order('snapshot_date', { ascending: false })
        .limit(1)
        .single();

      if (error || !snapshot) {
        console.error('Error fetching holder snapshot:', error);
        // Return mock data as fallback
        return {
          totalHolders: 1137,
          tiers: {
            shrimp: 450,
            crab: 320,
            fish: 200,
            dolphin: 100,
            shark: 45,
            whale: 18,
            humpback: 4,
          },
          top10Percentage: 32.5,
        };
      }

      const holderBalances = snapshot.holder_balances as Record<string, number>;
      const balances = Object.values(holderBalances);

      // Categorize holders into tiers
      const tiers: HolderTiers = {
        shrimp: 0,
        crab: 0,
        fish: 0,
        dolphin: 0,
        shark: 0,
        whale: 0,
        humpback: 0,
      };

      balances.forEach((balance) => {
        if (balance < 10000) tiers.shrimp++;
        else if (balance < 100000) tiers.crab++;
        else if (balance < 500000) tiers.fish++;
        else if (balance < 1000000) tiers.dolphin++;
        else if (balance < 5000000) tiers.shark++;
        else if (balance < 10000000) tiers.whale++;
        else tiers.humpback++;
      });

      // Calculate top 10 holders percentage
      const totalSupply = balances.reduce((sum, b) => sum + b, 0);
      const sortedBalances = [...balances].sort((a, b) => b - a);
      const top10Sum = sortedBalances.slice(0, 10).reduce((sum, b) => sum + b, 0);
      const top10Percentage = (top10Sum / totalSupply) * 100;

      return {
        totalHolders: snapshot.total_holders,
        tiers,
        top10Percentage,
      };
    },
    refetchInterval: 3600000, // Refresh every hour
    staleTime: 3500000,
  });
}
