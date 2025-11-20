import { useQuery } from "@tanstack/react-query";
import { fetchTRNStats, fetchMemeStats } from "@/lib/api";

export function useTokenStats() {
  return useQuery({
    queryKey: ["token-stats"],
    queryFn: fetchTRNStats,
    refetchInterval: 60000, // Refresh every 60 seconds
    staleTime: 50000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
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
