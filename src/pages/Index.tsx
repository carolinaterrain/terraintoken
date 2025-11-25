import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import SkipToContent from "@/components/SkipToContent";
import ScrollProgress from "@/components/ScrollProgress";
import SmartHeader from "@/components/SmartHeader";
import Hero from "@/components/Hero";
import { ApeModeContent } from "@/components/ApeModeContent";
import { ResearchModeContent } from "@/components/ResearchModeContent";
import { useUIModeStore } from "@/stores/uiModeStore";
import { useAnalytics } from "@/hooks/useAnalytics";

const Index = () => {
  const { mode } = useUIModeStore();
  const { trackPageView } = useAnalytics();
  const location = useLocation();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  useEffect(() => {
    // Track UI mode on mount
    trackPageView(`${location.pathname}?mode=${mode}`);
  }, [mode, location.pathname, trackPageView]);

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
        <Hero />
        
        {mode === 'ape' ? <ApeModeContent /> : <ResearchModeContent />}
      </main>
    </>
  );
};

export default Index;
