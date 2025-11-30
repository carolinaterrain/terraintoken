import { Helmet } from "react-helmet-async";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SkipToContent from "@/components/SkipToContent";
import ScrollProgress from "@/components/ScrollProgress";
import SmartHeader from "@/components/SmartHeader";
import Hero from "@/components/Hero";
import { ResearchModeContent } from "@/components/ResearchModeContent";
import { useAnalytics } from "@/hooks/useAnalytics";
import { HeyGenAvatar } from "@/components/HeyGenAvatar";
import { requestIdleCallback } from "@/lib/performanceUtils";

const Index = () => {
  const { trackPageView } = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();
  const [avatarEnabled, setAvatarEnabled] = useState(false);

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  // Defer HeyGen avatar loading until page is interactive
  useEffect(() => {
    const id = requestIdleCallback(() => {
      setAvatarEnabled(true);
    });
    return () => {
      if (typeof window !== 'undefined' && 'cancelIdleCallback' in window) {
        window.cancelIdleCallback(id as number);
      }
    };
  }, []);

  // Handle navigation with tab/scroll state
  useEffect(() => {
    if (location.state) {
      const state = location.state as { activeTab?: string; scrollTo?: string };
      
      if (state.activeTab) {
        // Dispatch event to change tab
        const event = new CustomEvent('changeTab', { detail: { tab: state.activeTab } });
        window.dispatchEvent(event);
      }
      
      if (state.scrollTo) {
        setTimeout(() => {
          document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      
      // Clear state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <>
      <Helmet>
        <title>Terrain Token (TRN) - Powering Real-World Terrain Intelligence</title>
        <meta name="description" content="TRN powers platform access and sustainability within the Terrain ecosystem. Contribute terrain data, access AI analysis, participate in governance. A utility token backed by real operations." />
      </Helmet>
      
      <SkipToContent />
      <ScrollProgress />
      <SmartHeader />

      <main id="main-content">
        <Hero />
        <ResearchModeContent />
      </main>

      <HeyGenAvatar enabled={avatarEnabled} />
    </>
  );
};

export default Index;
