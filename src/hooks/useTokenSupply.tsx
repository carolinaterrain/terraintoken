import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSmartPolling } from "@/hooks/useSmartPolling";

interface TokenSupply {
  totalSupply: number;
  circulatingSupply: number;
  decimals: number;
  lastUpdated: string;
  error?: string;
  isStale?: boolean;
}

export function useTokenSupply() {
  const pollingInterval = useSmartPolling(300000); // 5 minutes (supply rarely changes)
  
  return useQuery({
    queryKey: ["token-supply"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-token-supply");
      
      if (error) {
        console.error("Error fetching token supply:", error);
        // Return fallback data
        return {
          totalSupply: 1006699550,
          circulatingSupply: 550000000,
          decimals: 2,
          lastUpdated: new Date().toISOString(),
          isStale: true,
        } as TokenSupply;
      }

      return data as TokenSupply;
    },
    refetchInterval: pollingInterval,
    staleTime: 240000, // 4 minutes
  });
}

export function formatSupply(supply: number, decimals: number): string {
  const value = supply / Math.pow(10, decimals);
  
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  } else if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(2)}M`;
  } else if (value >= 1_000) {
    return `${(value / 1_000).toFixed(2)}K`;
  }
  
  return value.toLocaleString();
}
