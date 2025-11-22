import { useCallback } from "react";
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

const getUTMParam = (param: string) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param) || undefined;
};

// Environment check - don't track in development
const isDevelopment = () => {
  return window.location.hostname === 'localhost' || 
         window.location.hostname.includes('127.0.0.1') ||
         window.location.hostname.includes('lovable.app');
};

// Event queue for batching with throttling
const eventQueue: any[] = [];
let flushTimeout: NodeJS.Timeout;

// Throttle tracking - max 100 events per session per hour
const THROTTLE_KEY = 'analytics_event_count';
const THROTTLE_TIMESTAMP_KEY = 'analytics_hour_start';
const MAX_EVENTS_PER_HOUR = 100;

const checkThrottle = (): boolean => {
  if (isDevelopment()) return false; // Skip dev events
  
  const now = Date.now();
  const hourStart = parseInt(localStorage.getItem(THROTTLE_TIMESTAMP_KEY) || '0');
  const eventCount = parseInt(localStorage.getItem(THROTTLE_KEY) || '0');
  
  // Reset counter if hour has passed
  if (now - hourStart > 3600000) {
    localStorage.setItem(THROTTLE_TIMESTAMP_KEY, now.toString());
    localStorage.setItem(THROTTLE_KEY, '0');
    return false;
  }
  
  // Check if throttled
  if (eventCount >= MAX_EVENTS_PER_HOUR) {
    console.warn('Analytics throttled: Max events per hour reached');
    return true;
  }
  
  // Increment counter
  localStorage.setItem(THROTTLE_KEY, (eventCount + 1).toString());
  return false;
};

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
    // Check throttle and development environment
    if (checkThrottle()) return;
    
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
    // Check throttle and development environment
    if (checkThrottle()) return;
    
    // Sanitize properties to prevent malicious JSON
    const sanitizedProperties = properties ? 
      JSON.parse(JSON.stringify(properties).slice(0, 10000)) : null;
    
    eventQueue.push({
      session_id: getSessionId(),
      event_name: eventName,
      page_url: window.location.href,
      event_properties: sanitizedProperties,
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
