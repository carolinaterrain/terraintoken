import { useTokenData } from '@/providers/TokenDataProvider';

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

/**
 * Uses the unified TokenDataProvider for holder distribution data.
 * Ensures consistency across all holder-related components.
 */
export function useHolderDistribution() {
  const { data, holderCount, isLoading, dataSource, lastUpdated, refetch } = useTokenData();
  
  const distribution: HolderDistribution | undefined = holderCount ? {
    totalHolders: holderCount.holderCount,
    tiers: holderCount.tiers,
    top10Percentage: holderCount.top10Percentage,
  } : undefined;

  return {
    data: distribution,
    isLoading,
    error: null,
    refetch,
    dataSource,
    lastUpdated,
  };
}
