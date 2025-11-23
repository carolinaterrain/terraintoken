import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useTradingHistory() {
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
    refetchInterval: 60000, // Refresh every minute
    staleTime: 50000,
  });
}
