import { useLiveHolderCount, UnifiedHolderData } from "@/hooks/useLiveHolderCount";

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

// Uses the unified holder data source for consistency
export function useHolderDistribution() {
  const { data, isLoading, error, refetch } = useLiveHolderCount();
  
  // Transform unified data to HolderDistribution format
  const distribution: HolderDistribution | undefined = data ? {
    totalHolders: data.totalHolders || data.holderCount || 0,
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
  } : undefined;

  return {
    data: distribution,
    isLoading,
    error,
    refetch,
  };
}
