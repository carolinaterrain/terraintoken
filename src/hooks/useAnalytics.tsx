import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = () => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

const getUTMParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || undefined;
};

export const useAnalytics = () => {
  const trackPageView = useCallback((pageName: string) => {
    supabase.from("analytics_events").insert({
      session_id: getSessionId(),
      event_name: "page_view",
      page_url: window.location.href,
      event_properties: { page_name: pageName },
      user_agent: navigator.userAgent,
      referrer: document.referrer || undefined,
      utm_source: getUTMParam("utm_source"),
      utm_medium: getUTMParam("utm_medium"),
      utm_campaign: getUTMParam("utm_campaign"),
    });
  }, []);

  const trackEvent = useCallback((eventName: string, properties?: any) => {
    supabase.from("analytics_events").insert({
      session_id: getSessionId(),
      event_name: eventName,
      page_url: window.location.href,
      event_properties: properties || null,
      user_agent: navigator.userAgent,
      utm_source: getUTMParam("utm_source"),
      utm_medium: getUTMParam("utm_medium"),
      utm_campaign: getUTMParam("utm_campaign"),
    });
  }, []);

  return { trackPageView, trackEvent };
};
