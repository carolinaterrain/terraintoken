import { useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";

const getSessionId = () => {
  let sessionId = sessionStorage.getItem("analytics_session_id");
  if (!sessionId) {
    sessionId = `session_${crypto.randomUUID()}`;
    sessionStorage.setItem("analytics_session_id", sessionId);
  }
  return sessionId;
};

export const HeatMapTracker = () => {
  const trackedElementsRef = useRef(new Set<string>());

  useEffect(() => {
    const sessionId = getSessionId();
    const pageUrl = window.location.pathname;

    // Track clicks
    const handleClick = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementId = target.id || '';
      const elementClass = target.className || '';
      
      await supabase.from('heat_map_events').insert({
        session_id: sessionId,
        page_url: pageUrl,
        event_type: 'click',
        x_position: e.clientX,
        y_position: e.clientY,
        element_id: elementId,
        element_class: elementClass,
        viewport_width: window.innerWidth,
        viewport_height: window.innerHeight,
      });
    };

    // Track scrolls (throttled)
    let scrollTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(async () => {
        await supabase.from('heat_map_events').insert({
          session_id: sessionId,
          page_url: pageUrl,
          event_type: 'scroll',
          y_position: window.scrollY,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
        });
      }, 1000);
    };

    // Track hovers on important elements (CTAs, buttons)
    const handleMouseEnter = async (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const elementId = target.id || '';
      
      // Only track important elements
      if (!elementId || trackedElementsRef.current.has(elementId)) return;
      
      const isImportant = 
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.classList.contains('btn') ||
        target.classList.contains('cta');

      if (isImportant) {
        trackedElementsRef.current.add(elementId);
        
        await supabase.from('heat_map_events').insert({
          session_id: sessionId,
          page_url: pageUrl,
          event_type: 'hover',
          element_id: elementId,
          element_class: target.className,
          viewport_width: window.innerWidth,
          viewport_height: window.innerHeight,
        });
      }
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('scroll', handleScroll);
    document.addEventListener('mouseenter', handleMouseEnter, true);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mouseenter', handleMouseEnter, true);
      clearTimeout(scrollTimeout);
    };
  }, []);

  return null; // This is an invisible tracker component
};
