import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = () => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    // Use crypto.randomUUID for secure session IDs
    sessionId = `session_${crypto.randomUUID()}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

const selectVariant = (trafficSplit: Record<string, number>): string => {
  const random = Math.random() * 100;
  let cumulative = 0;
  
  for (const [variant, percentage] of Object.entries(trafficSplit)) {
    cumulative += percentage;
    if (random <= cumulative) {
      return variant;
    }
  }
  
  return Object.keys(trafficSplit)[0];
};

export const useABTest = (testName: string) => {
  const [variant, setVariant] = useState<string>("A");
  const [isLoading, setIsLoading] = useState(true);
  const [testId, setTestId] = useState<string | null>(null);

  useEffect(() => {
    assignVariant();
  }, [testName]);

  const assignVariant = async () => {
    try {
      const sessionId = getSessionId();

      // Get active test
      const { data: testData, error: testError } = await supabase
        .from("ab_tests")
        .select("id, variants, traffic_split")
        .eq("name", testName)
        .eq("status", "active")
        .maybeSingle();

      if (testError || !testData) {
        console.warn(`A/B test "${testName}" not found or not active`);
        setIsLoading(false);
        return;
      }

      setTestId(testData.id);

      // Get existing assignment or create a new one (validated on the server)
      const proposedVariant = selectVariant(testData.traffic_split as Record<string, number>);
      const { data: assignedVariant } = await supabase.rpc("get_or_assign_ab_variant", {
        p_test_id: testData.id,
        p_session_id: sessionId,
        p_variant: proposedVariant,
      });

      const finalVariant = (assignedVariant as string | null) || proposedVariant;
      setVariant(finalVariant);

      // Auto-track view event
      await supabase.from("ab_test_events").insert({
        test_id: testData.id,
        session_id: sessionId,
        variant: finalVariant,
        event_type: "view",
        event_data: null,
      });
    } catch (error) {
      console.error("Error assigning A/B test variant:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const trackEvent = async (
    eventType: "view" | "click" | "conversion",
    data?: any
  ) => {
    if (!testId) return;

    try {
      await supabase.from("ab_test_events").insert({
        test_id: testId,
        session_id: getSessionId(),
        variant,
        event_type: eventType,
        event_data: data || null,
      });
    } catch (error) {
      console.error("Error tracking A/B test event:", error);
    }
  };

  return { variant, isLoading, trackEvent };
};
