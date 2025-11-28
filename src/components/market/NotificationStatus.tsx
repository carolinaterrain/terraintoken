import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

// Background service to check price alerts periodically
export const useNotificationService = () => {
  useEffect(() => {
    // Check price alerts every 2 minutes
    const priceAlertInterval = setInterval(async () => {
      try {
        await supabase.functions.invoke("check-price-alerts");
      } catch (error) {
        console.error("Error checking price alerts:", error);
      }
    }, 120000); // 2 minutes

    // NOTE: Whale purchase polling is DISABLED until purchase tracking feature is active
    // This was causing 429 rate limit errors. Re-enable when ready with 30+ minute intervals.

    return () => {
      clearInterval(priceAlertInterval);
    };
  }, []);
};
