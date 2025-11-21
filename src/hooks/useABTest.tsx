import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = () => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
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

      // Check if already assigned
      const { data: existingAssignment } = await supabase
        .from("ab_test_assignments")
        .select("variant")
        .eq("test_id", testData.id)
        .eq("session_id", sessionId)
        .maybeSingle();

      if (existingAssignment) {
        setVariant(existingAssignment.variant);
      } else {
        // Assign new variant
        const newVariant = selectVariant(testData.traffic_split as Record<string, number>);
        
        await supabase.from("ab_test_assignments").insert({
          test_id: testData.id,
          session_id: sessionId,
          variant: newVariant,
        });

        setVariant(newVariant);
      }
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
