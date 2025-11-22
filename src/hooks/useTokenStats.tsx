import { useQuery } from "@tanstack/react-query";
import { fetchTRNStats, fetchMemeStats } from "@/lib/api";

export function useTokenStats() {
  return useQuery({
    queryKey: ["token-stats"],
    queryFn: fetchTRNStats,
    refetchInterval: 30000, // Refresh every 30 seconds (reduced from 5s for performance)
    staleTime: 25000,
    gcTime: 300000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: 3,
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
