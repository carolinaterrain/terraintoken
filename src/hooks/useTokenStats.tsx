import { useQuery } from "@tanstack/react-query";
import { fetchTRNStats, fetchMemeStats } from "@/lib/api";

export function useTokenStats() {
  return useQuery({
    queryKey: ["token-stats"],
    queryFn: fetchTRNStats,
    refetchInterval: 60000, // Refresh every 1 minute (optimized from 30s)
    staleTime: 55000, // Consider data stale after 55 seconds
    gcTime: 600000, // Keep in cache for 10 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus to reduce API calls
    refetchOnMount: false, // Don't refetch on mount if data exists
    retry: 2, // Reduce retries from 3 to 2
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useMemeStats() {
  return useQuery({
    queryKey: ["meme-stats"],
    queryFn: fetchMemeStats,
    refetchInterval: 300000, // Refresh every 5 minutes
    staleTime: 240000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
