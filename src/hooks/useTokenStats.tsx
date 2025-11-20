import { useQuery } from "@tanstack/react-query";
import { fetchTRNStats, fetchMemeStats } from "@/lib/api";

export function useTokenStats() {
  return useQuery({
    queryKey: ["token-stats"],
    queryFn: fetchTRNStats,
    refetchInterval: 15000, // Refresh every 15 seconds
    staleTime: 10000,
  });
}

export function useMemeStats() {
  return useQuery({
    queryKey: ["meme-stats"],
    queryFn: fetchMemeStats,
    refetchInterval: 30000, // Refresh every 30 seconds
    staleTime: 20000,
  });
}
