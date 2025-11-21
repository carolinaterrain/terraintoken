import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAnalytics } from "@/hooks/useAnalytics";

interface AnalyticsWrapperProps {
  children: React.ReactNode;
}

export const AnalyticsWrapper = ({ children }: AnalyticsWrapperProps) => {
  const location = useLocation();
  const { trackPageView } = useAnalytics();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  return <>{children}</>;
};
