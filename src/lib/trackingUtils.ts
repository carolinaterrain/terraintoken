import { supabase } from "@/integrations/supabase/client";

/**
 * Get or create a stable session ID for analytics tracking.
 * Persists in sessionStorage for the duration of the browser session.
 */
export const getSessionId = (): string => {
  const STORAGE_KEY = "trn-session-id";
  let id = sessionStorage.getItem(STORAGE_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(STORAGE_KEY, id);
  }
  return id;
};

/**
 * Track an analytics event to the analytics_events table.
 * Automatically includes session_id and page_url.
 * 
 * @param eventName - Name of the event (e.g., 'waitlist_modal_opened')
 * @param properties - Optional key-value properties (no PII allowed!)
 */
export const trackEvent = async (
  eventName: string,
  properties?: Record<string, string | number | boolean>
): Promise<void> => {
  try {
    await supabase.from("analytics_events").insert([
      {
        event_name: eventName,
        session_id: getSessionId(),
        event_properties: properties || {},
        page_url: window.location.href,
      },
    ]);
  } catch (e) {
    // Silent fail - don't break UX for tracking errors
    console.error("Tracking error:", e);
  }
};

/**
 * Check if an event has already been tracked this session.
 * Useful for "fire once" events like floating_cta_shown.
 */
export const hasEventFiredThisSession = (eventKey: string): boolean => {
  return sessionStorage.getItem(eventKey) === "true";
};

/**
 * Mark an event as fired for this session.
 */
export const markEventFired = (eventKey: string): void => {
  sessionStorage.setItem(eventKey, "true");
};
