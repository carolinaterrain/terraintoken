import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSmartPolling } from "@/hooks/useSmartPolling";

interface UnifiedHolderData {
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

// Single source of truth for all holder data
export function useLiveHolderCount() {
  const pollingInterval = useSmartPolling(120000);
  
  return useQuery({
    queryKey: ["unified-holder-data"],
    queryFn: async (): Promise<UnifiedHolderData> => {
      const { data, error } = await supabase.functions.invoke("fetch-holder-data");
      
      if (error) {
        console.error("Error fetching unified holder data:", error);
        return { 
          holderCount: 0, 
          totalHolders: 0,
          tiers: { shrimp: 0, crab: 0, fish: 0, dolphin: 0, shark: 0, whale: 0, humpback: 0 },
          top10Percentage: 0,
          holders: [],
          lastUpdated: new Date().toISOString(), 
          source: 'error' 
        };
      }

      return data;
    },
    refetchInterval: pollingInterval,
    staleTime: 100000,
  });
}

// Export type for consumers
export type { UnifiedHolderData };
