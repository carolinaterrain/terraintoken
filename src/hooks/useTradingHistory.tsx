import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSmartPolling } from "@/hooks/useSmartPolling";

export function useTradingHistory() {
  const pollingInterval = useSmartPolling(60000);
  
  return useQuery({
    queryKey: ["trading-history"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("fetch-trn-transactions");
      
      if (error) {
        console.error("Error fetching trading history:", error);
        return { transactions: [], lastUpdated: new Date().toISOString() };
      }

      return data;
    },
    refetchInterval: pollingInterval,
    staleTime: 50000,
  });
}
