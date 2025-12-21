import { Helmet } from "react-helmet-async";
import { useEffect, lazy, Suspense } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SkipToContent from "@/components/SkipToContent";
import ScrollProgress from "@/components/ScrollProgress";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load heavy components
const SmartHeader = lazy(() => import("@/components/SmartHeader"));
const Hero = lazy(() => import("@/components/Hero"));
const ResearchModeContent = lazy(() => import("@/components/ResearchModeContent").then(m => ({ default: m.ResearchModeContent })));
const OnboardingModal = lazy(() => import("@/components/onboarding/OnboardingModal").then(m => ({ default: m.OnboardingModal })));

// Lightweight skeleton for hero section
const HeroSkeleton = () => (
  <section className="min-h-screen pt-20 flex items-center justify-center">
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <Skeleton className="w-64 h-64 rounded-full" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-2/3" />
          <div className="flex gap-4">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>
        </div>
      </div>
    </div>
  </section>
);

const Index = () => {
  const { trackPageView } = useAnalytics();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    trackPageView(location.pathname);
  }, [location.pathname, trackPageView]);

  // Handle navigation with tab/scroll state
  useEffect(() => {
    if (location.state) {
      const state = location.state as { activeTab?: string; scrollTo?: string };
      
      if (state.activeTab) {
        const event = new CustomEvent('changeTab', { detail: { tab: state.activeTab } });
        window.dispatchEvent(event);
      }
      
      if (state.scrollTo) {
        setTimeout(() => {
          document.getElementById(state.scrollTo)?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
      
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  return (
    <>
      <Helmet>
        <title>TRN Utility Credits — Optional Access for the Terrain System</title>
        <meta name="description" content="TRN is an optional utility credit for accessing premium Terrain services. No wallet required for standard use. Not an investment product." />
      </Helmet>
      
      <SkipToContent />
      <ScrollProgress />
      
      <Suspense fallback={<div className="h-16 bg-background/95 backdrop-blur-lg border-b border-primary/20" />}>
        <SmartHeader />
      </Suspense>

      <main id="main-content">
        <Suspense fallback={<HeroSkeleton />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<div className="min-h-[50vh]" />}>
          <ResearchModeContent />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <OnboardingModal />
      </Suspense>
    </>
  );
};

export default Index;