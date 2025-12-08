import { useTokenData } from '@/providers/TokenDataProvider';

// Re-export from TokenDataProvider for backwards compatibility
export interface UnifiedHolderData {
  holderCount: number;
  totalHolders: number;
  tiers: {
    shrimp: number;
    crab: number;
    fish: number;
    dolphin: number;
    shark: number;
    whale: number;
    humpback: number;
  };
  top10Percentage: number;
  holders: Array<{ address: string; balance: number; percentage: number }>;
  source: string;
  lastUpdated: string;
  error?: string;
}

/**
 * Single source of truth for all holder data.
 * Now uses the unified TokenDataProvider to ensure consistency across the app.
 */
export function useLiveHolderCount() {
  const { data, holderCount, isLoading, dataSource, lastUpdated, refetch } = useTokenData();
  
  // Transform to UnifiedHolderData format for backwards compatibility
  const transformedData: UnifiedHolderData | undefined = data ? {
    holderCount: data.holderCount,
    totalHolders: data.holderCount,
    tiers: data.holderTiers,
    top10Percentage: data.top10Percentage,
    holders: [], // Top holders fetched separately by TopHoldersLeaderboard
    source: dataSource,
    lastUpdated: lastUpdated || new Date().toISOString(),
  } : undefined;
  
  return {
    data: transformedData,
    isLoading,
    error: null,
    refetch,
    dataSource,
    lastUpdated,
  };
}

// Export type for consumers
export type { UnifiedHolderData as HolderData };
