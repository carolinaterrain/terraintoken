import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SkipToContent from "@/components/SkipToContent";
import ScrollProgress from "@/components/ScrollProgress";
import SmartHeader from "@/components/SmartHeader";
import Hero from "@/components/Hero";
import { ApeModeContent } from "@/components/ApeModeContent";
import { ResearchModeContent } from "@/components/ResearchModeContent";
import { useUIModeStore } from "@/stores/uiModeStore";
import { useAnalytics } from "@/hooks/useAnalytics";
import { HeyGenAvatar } from "@/components/HeyGenAvatar";

const Index = () => {
  const { mode } = useUIModeStore();
  const { trackPageView } = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  useEffect(() => {
    // Track UI mode on mount
    trackPageView(`${location.pathname}?mode=${mode}`);
  }, [mode, location.pathname, trackPageView]);

  // Handle navigation with tab/scroll state
  useEffect(() => {
    if (location.state) {
      const state = location.state as { activeTab?: string; scrollTo?: string };
      
      if (state.activeTab && mode === 'research') {
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
  }, [location.state, mode, navigate, location.pathname]);

  return (
    <>
      <Helmet>
        <title>Terrain Token (TRN) - Real Business Backing Real Utility</title>
        <meta name="description" content="TRN is the first memecoin backed by a profitable landscaping business." />
      </Helmet>
      
      <SkipToContent />
      <ScrollProgress />
      <SmartHeader />

      <main id="main-content">
        <Hero mode={mode} />
        
        {mode === 'ape' ? <ApeModeContent /> : <ResearchModeContent />}
      </main>

      {/* AI Avatar Assistant - Only show in Research mode */}
      <HeyGenAvatar enabled={mode === 'research'} />
    </>
  );
};

export default Index;
