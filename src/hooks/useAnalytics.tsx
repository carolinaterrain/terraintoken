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

// Event queue for batching
const eventQueue: any[] = [];
let flushTimeout: NodeJS.Timeout;

const flushEvents = async () => {
  if (eventQueue.length === 0) return;
  
  const events = [...eventQueue];
  eventQueue.length = 0;
  
  try {
    await supabase.from('analytics_events').insert(events);
  } catch (error) {
    console.error('Failed to flush analytics events:', error);
  }
};

// Flush on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', flushEvents);
}

export const useAnalytics = () => {
  const trackPageView = useCallback((pageName: string) => {
    eventQueue.push({
      session_id: getSessionId(),
      event_name: "page_view",
      page_url: window.location.href,
      event_properties: { page_name: pageName },
      user_agent: navigator.userAgent,
      referrer: document.referrer || undefined,
      utm_source: getUTMParam("utm_source"),
      utm_medium: getUTMParam("utm_medium"),
      utm_campaign: getUTMParam("utm_campaign"),
      created_at: new Date().toISOString(),
    });

    // Flush after 5 seconds or 10 events
    clearTimeout(flushTimeout);
    if (eventQueue.length >= 10) {
      flushEvents();
    } else {
      flushTimeout = setTimeout(flushEvents, 5000);
    }
  }, []);

  const trackEvent = useCallback((eventName: string, properties?: any) => {
    eventQueue.push({
      session_id: getSessionId(),
      event_name: eventName,
      page_url: window.location.href,
      event_properties: properties || null,
      user_agent: navigator.userAgent,
      utm_source: getUTMParam("utm_source"),
      utm_medium: getUTMParam("utm_medium"),
      utm_campaign: getUTMParam("utm_campaign"),
      created_at: new Date().toISOString(),
    });

    // Flush after 5 seconds or 10 events
    clearTimeout(flushTimeout);
    if (eventQueue.length >= 10) {
      flushEvents();
    } else {
      flushTimeout = setTimeout(flushEvents, 5000);
    }
  }, []);

  return { trackPageView, trackEvent };
};
