import { useState, useEffect, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { syncFromCarolinaTerrain, SyncResponse, SyncMode } from '@/lib/carolinaTerrainSync';

interface UseCarolinaTerrainSyncOptions {
  mode?: SyncMode;
  refreshInterval?: number;
  enabled?: boolean;
}

export function useCarolinaTerrainSync(options: UseCarolinaTerrainSyncOptions = {}) {
  const {
    mode = 'full',
    refreshInterval = 60000, // 60 seconds default
    enabled = true,
  } = options;

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['carolina-terrain-sync', mode],
    queryFn: () => syncFromCarolinaTerrain(mode),
    enabled,
    refetchInterval: refreshInterval,
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['carolina-terrain-sync', mode] });
  }, [queryClient, mode]);

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error?.message || (query.data?.error),
    isStale: query.isStale,
    isFetching: query.isFetching,
    refetch,
    lastUpdated: query.data?.timestamp,
    source: query.data?.source || 'unknown',
    isFallback: query.data?.fallback || false,
  };
}

// Specialized hooks for specific data types
export function useLiveStats(refreshInterval = 60000) {
  const { data, loading, error, refetch, isFallback } = useCarolinaTerrainSync({
    mode: 'stats',
    refreshInterval,
  });

  return {
    stats: data?.data?.liveStats || null,
    loading,
    error,
    refetch,
    isFallback,
  };
}

export function useBurnStats(refreshInterval = 120000) {
  const { data, loading, error, refetch, isFallback } = useCarolinaTerrainSync({
    mode: 'burns',
    refreshInterval,
  });

  return {
    burns: data?.data?.burns || null,
    loading,
    error,
    refetch,
    isFallback,
  };
}

export function useTreasuryStats(refreshInterval = 180000) {
  const { data, loading, error, refetch, isFallback } = useCarolinaTerrainSync({
    mode: 'treasury',
    refreshInterval,
  });

  return {
    treasury: data?.data?.treasury || null,
    foundation: data?.data?.foundation || null,
    rewardsPool: data?.data?.rewardsPool || null,
    loading,
    error,
    refetch,
    isFallback,
  };
}

export function useRewardStats(refreshInterval = 120000) {
  const { data, loading, error, refetch, isFallback } = useCarolinaTerrainSync({
    mode: 'rewards',
    refreshInterval,
  });

  return {
    rewards: data?.data?.rewardStats || null,
    loading,
    error,
    refetch,
    isFallback,
  };
}

export function useFullEcosystemData(refreshInterval = 60000) {
  const { data, loading, error, refetch, isFallback, lastUpdated, source } = useCarolinaTerrainSync({
    mode: 'full',
    refreshInterval,
  });

  return {
    liveStats: data?.data?.liveStats || null,
    burns: data?.data?.burns || null,
    treasury: data?.data?.treasury || null,
    foundation: data?.data?.foundation || null,
    rewardsPool: data?.data?.rewardsPool || null,
    rewardStats: data?.data?.rewardStats || null,
    loading,
    error,
    refetch,
    isFallback,
    lastUpdated,
    source,
  };
}
