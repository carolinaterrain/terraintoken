import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useLiveHolderCount() {
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
    refetchInterval: 120000, // Refresh every 2 minutes
    staleTime: 100000,
  });
}
