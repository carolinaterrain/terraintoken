import { useQuery } from "@tanstack/react-query";
import { fetchTRNStats, fetchMemeStats } from "@/lib/api";
import { useSmartPolling } from "@/hooks/useSmartPolling";

export function useTokenStats() {
  const pollingInterval = useSmartPolling(60000);
  
  return useQuery({
    queryKey: ["token-stats"],
    queryFn: fetchTRNStats,
    refetchInterval: pollingInterval,
    staleTime: 55000,
    gcTime: 600000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function useMemeStats() {
  const pollingInterval = useSmartPolling(300000);
  
  return useQuery({
    queryKey: ["meme-stats"],
    queryFn: fetchMemeStats,
    refetchInterval: pollingInterval,
    staleTime: 240000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
}
