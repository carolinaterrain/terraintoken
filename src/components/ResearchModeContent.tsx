import { Suspense, lazy, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useTabPersistence } from "@/hooks/useTabPersistence";
import { useTabAnalytics } from "@/hooks/useTabAnalytics";

const QuickStartGuide = lazy(() => import("@/components/QuickStartGuide").then(m => ({ default: m.QuickStartGuide })));
const EcosystemProof = lazy(() => import("@/components/ecosystem/EcosystemProof").then(m => ({ default: m.EcosystemProof })));
const HowToBuy = lazy(() => import("@/components/HowToBuy"));
const SocialProofWall = lazy(() => import("@/components/SocialProofWall").then(m => ({ default: m.SocialProofWall })));
const TrustDashboard = lazy(() => import("@/components/TrustDashboard").then(m => ({ default: m.TrustDashboard })));
const About = lazy(() => import("@/components/About"));
const Tokenomics = lazy(() => import("@/components/Tokenomics"));
const Roadmap = lazy(() => import("@/components/Roadmap"));
const Transparency = lazy(() => import("@/components/Transparency"));
const RealUtility = lazy(() => import("@/components/RealUtility"));
const Founders = lazy(() => import("@/components/Founders"));
const OriginStory = lazy(() => import("@/components/OriginStory"));
const RealWorldRoots = lazy(() => import("@/components/RealWorldRoots"));
const MascotLore = lazy(() => import("@/components/MascotLore"));
const LiveProof = lazy(() => import("@/components/LiveProof"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));

const LoadingSection = () => (
  <div className="container mx-auto px-4 py-12 space-y-8">
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export const ResearchModeContent = () => {
  const [activeTab, setActiveTab] = useTabPersistence('homepage', 'overview');
  useTabAnalytics('homepage', activeTab);

  // Listen for tab change events from navigation
  useEffect(() => {
    const handleChangeTab = (event: CustomEvent) => {
      if (event.detail?.tab) {
        setActiveTab(event.detail.tab);
      }
    };
    
    window.addEventListener('changeTab', handleChangeTab as EventListener);
    return () => window.removeEventListener('changeTab', handleChangeTab as EventListener);
  }, [setActiveTab]);

  return (
    <>
      <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-xl border-b">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="container mx-auto overflow-x-auto scrollbar-hide">
            <TabsList className="w-max min-w-full justify-start h-auto p-0 bg-transparent border-0 rounded-none">
              <TabsTrigger 
                value="overview" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-4 min-h-[48px] text-sm md:text-base whitespace-nowrap"
              >
                <span className="hidden sm:inline">Overview</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger 
                value="token-details" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-4 min-h-[48px] text-sm md:text-base whitespace-nowrap"
              >
                <span className="hidden sm:inline">Token & Trust</span>
                <span className="sm:hidden">Token</span>
              </TabsTrigger>
              <TabsTrigger 
                value="community" 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-4 min-h-[48px] text-sm md:text-base whitespace-nowrap"
              >
                Community
              </TabsTrigger>
            </TabsList>
          </div>
        </Tabs>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsContent value="overview" className="mt-0 animate-in fade-in-50 duration-300">
          <Suspense fallback={<LoadingSection />}><QuickStartGuide /></Suspense>
          <Suspense fallback={<LoadingSection />}><EcosystemProof /></Suspense>
          <Suspense fallback={<LoadingSection />}><RealUtility /></Suspense>
          <Suspense fallback={<LoadingSection />}><HowToBuy /></Suspense>
          <Suspense fallback={<LoadingSection />}><SocialProofWall /></Suspense>
          <Suspense fallback={<LoadingSection />}><FAQ /></Suspense>
        </TabsContent>

        <TabsContent value="token-details" className="mt-0 animate-in fade-in-50 duration-300">
          <Suspense fallback={<LoadingSection />}><About /></Suspense>
          <Suspense fallback={<LoadingSection />}><Tokenomics /></Suspense>
          <Suspense fallback={<LoadingSection />}><TrustDashboard /></Suspense>
          <Suspense fallback={<LoadingSection />}><Roadmap /></Suspense>
          <Suspense fallback={<LoadingSection />}><Transparency /></Suspense>
        </TabsContent>

        <TabsContent value="community" className="mt-0 animate-in fade-in-50 duration-300">
          <Suspense fallback={<LoadingSection />}><Founders /></Suspense>
          <Suspense fallback={<LoadingSection />}><OriginStory /></Suspense>
          <Suspense fallback={<LoadingSection />}><RealWorldRoots /></Suspense>
          <Suspense fallback={<LoadingSection />}><MascotLore /></Suspense>
          <Suspense fallback={<LoadingSection />}><LiveProof /></Suspense>
        </TabsContent>
      </Tabs>

      <Suspense fallback={<div className="h-64" />}><Footer /></Suspense>
    </>
  );
};
