import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSmartPolling } from "@/hooks/useSmartPolling";

export function useLiveHolderCount() {
  const pollingInterval = useSmartPolling(120000);
  
  return useQuery({
    queryKey: ["live-holder-count"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-trn-holders");
      
      if (error) {
        console.error("Error fetching holder count:", error);
        return { holderCount: 1137, lastUpdated: new Date().toISOString() };
      }

      return data;
    },
    refetchInterval: pollingInterval,
    staleTime: 100000,
  });
}
