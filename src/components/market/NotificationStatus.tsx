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

    // Check whale purchases every 10 minutes (rate limit is 10/hour)
    const whaleInterval = setInterval(async () => {
      try {
        await supabase.functions.invoke("check-whale-purchases");
      } catch (error) {
        console.error("Error checking whale purchases:", error);
      }
    }, 600000); // 10 minutes

    return () => {
      clearInterval(priceAlertInterval);
      clearInterval(whaleInterval);
    };
  }, []);
};
