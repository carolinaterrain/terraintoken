import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook to detect if the page is visible (user is actively viewing)
 */
export const usePageVisibility = () => {
  const [isVisible, setIsVisible] = useState(!document.hidden);

  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return isVisible;
};

/**
 * Hook to detect if user has been inactive
 */
export const useUserActivity = (timeoutMs = 30000) => {
  const [isActive, setIsActive] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());

  useEffect(() => {
    const handleActivity = () => {
      setLastActivity(Date.now());
      setIsActive(true);
    };

    const events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart"];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity);
    });

    const checkActivity = setInterval(() => {
      if (Date.now() - lastActivity > timeoutMs) {
        setIsActive(false);
      }
    }, 5000);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity);
      });
      clearInterval(checkActivity);
    };
  }, [lastActivity, timeoutMs]);

  return isActive;
};

/**
 * Hook to detect network speed
 */
export const useNetworkSpeed = () => {
  const [speed, setSpeed] = useState<"slow" | "medium" | "fast">("fast");

  useEffect(() => {
    const connection = (navigator as any).connection || 
                       (navigator as any).mozConnection || 
                       (navigator as any).webkitConnection;

    if (connection) {
      const updateSpeed = () => {
        const effectiveType = connection.effectiveType;
        if (effectiveType === "slow-2g" || effectiveType === "2g") {
          setSpeed("slow");
        } else if (effectiveType === "3g") {
          setSpeed("medium");
        } else {
          setSpeed("fast");
        }
      };

      updateSpeed();
      connection.addEventListener("change", updateSpeed);

      return () => {
        connection.removeEventListener("change", updateSpeed);
      };
    }
  }, []);

  return speed;
};

/**
 * Hook for adaptive polling based on user context
 * 
 * @param baseInterval - Base polling interval in milliseconds
 * @returns Adaptive polling interval (or false to stop polling)
 * 
 * @example
 * const { data } = useQuery({
 *   queryKey: ['token-stats'],
 *   queryFn: fetchTokenStats,
 *   refetchInterval: useSmartPolling(60000)
 * });
 */
export const useSmartPolling = (baseInterval: number): number | false => {
  const isPageVisible = usePageVisibility();
  const isUserActive = useUserActivity();
  const networkSpeed = useNetworkSpeed();
  const queryClient = useQueryClient();

  const interval = useMemo(() => {
    // Stop polling if page is hidden
    if (!isPageVisible) {
      return false;
    }

    // Slow down significantly if user is inactive
    if (!isUserActive) {
      return baseInterval * 4; // 4x slower
    }

    // Adjust based on network speed
    if (networkSpeed === "slow") {
      return baseInterval * 2; // 2x slower on slow connections
    }

    if (networkSpeed === "medium") {
      return baseInterval * 1.5; // 1.5x slower on medium connections
    }

    return baseInterval;
  }, [isPageVisible, isUserActive, networkSpeed, baseInterval]);

  // When page becomes visible again, invalidate queries to get fresh data
  useEffect(() => {
    if (isPageVisible) {
      queryClient.invalidateQueries();
    }
  }, [isPageVisible, queryClient]);

  return interval;
};
