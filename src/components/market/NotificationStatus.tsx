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

    // Check whale purchases every 30 minutes (rate limit protection)
    // Note: Purchase tracking is not yet active, so this is infrequent
    const whaleInterval = setInterval(async () => {
      try {
        await supabase.functions.invoke("check-whale-purchases");
      } catch (error) {
        // Silently handle rate limit errors - not critical
        if (error instanceof Error && !error.message.includes('429')) {
          console.error("Error checking whale purchases:", error);
        }
      }
    }, 1800000); // 30 minutes

    return () => {
      clearInterval(priceAlertInterval);
      clearInterval(whaleInterval);
    };
  }, []);
};
