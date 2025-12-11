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
 * Generate a unique trace ID for end-to-end request correlation.
 * Format: trn-{timestamp}-{random}
 */
export const generateTraceId = (): string => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `trn-${timestamp}-${random}`;
};

/**
 * Track an analytics event to the analytics_events table.
 * Automatically includes session_id, page_url, and trace_id.
 * 
 * @param eventName - Name of the event (e.g., 'waitlist_modal_opened')
 * @param properties - Optional key-value properties (no PII allowed!)
 * @returns The trace_id for correlation with backend logs
 */
export const trackEvent = async (
  eventName: string,
  properties?: Record<string, string | number | boolean>
): Promise<string> => {
  const traceId = generateTraceId();
  try {
    await supabase.from("analytics_events").insert([
      {
        event_name: eventName,
        session_id: getSessionId(),
        event_properties: properties || {},
        page_url: window.location.href,
        trace_id: traceId,
      },
    ]);
  } catch (e) {
    // Silent fail - don't break UX for tracking errors
    console.error("Tracking error:", e);
  }
  return traceId;
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
