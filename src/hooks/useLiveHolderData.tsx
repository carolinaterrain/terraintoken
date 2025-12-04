import { useLiveHolderCount } from "@/hooks/useLiveHolderCount";

interface HolderData {
  address: string;
  balance: number;
  percentage: number;
}

interface HolderDistribution {
  totalHolders: number;
  holders: HolderData[];
}

// Uses the unified holder data source for consistency
export function useLiveHolderData() {
  const { data, isLoading, error, refetch } = useLiveHolderCount();
  
  // Transform unified data to legacy format
  const holderData: HolderDistribution | undefined = data ? {
    totalHolders: data.totalHolders || data.holderCount || 0,
    holders: data.holders || [],
  } : undefined;

  return {
    data: holderData,
    isLoading,
    error,
    refetch,
  };
}
