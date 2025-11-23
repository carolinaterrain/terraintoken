import { Helmet } from "react-helmet-async";
import { Suspense, lazy } from "react";
import SkipToContent from "@/components/SkipToContent";
import ScrollProgress from "@/components/ScrollProgress";
import SmartHeader from "@/components/SmartHeader";
import Hero from "@/components/Hero";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useTabPersistence } from "@/hooks/useTabPersistence";
import { useTabAnalytics } from "@/hooks/useTabAnalytics";

const QuickStartGuide = lazy(() => import("@/components/QuickStartGuide").then(m => ({ default: m.QuickStartGuide })));
const CommunityBuzz = lazy(() => import("@/components/CommunityBuzz").then(m => ({ default: m.CommunityBuzz })));
const AnalyzeToEarnHero = lazy(() => import("@/components/AnalyzeToEarnHero"));
const HowToBuy = lazy(() => import("@/components/HowToBuy"));
const SocialProofWall = lazy(() => import("@/components/SocialProofWall").then(m => ({ default: m.SocialProofWall })));
const VibeCheck = lazy(() => import("@/components/VibeCheck").then(m => ({ default: m.VibeCheck })));
const OrganicDiscoveryCounter = lazy(() => import("@/components/OrganicDiscoveryCounter").then(m => ({ default: m.OrganicDiscoveryCounter })));
const AntiRugMeter = lazy(() => import("@/components/AntiRugMeter").then(m => ({ default: m.AntiRugMeter })));
const About = lazy(() => import("@/components/About"));
const Tokenomics = lazy(() => import("@/components/Tokenomics"));
const Roadmap = lazy(() => import("@/components/Roadmap"));
const CompetitiveEdge = lazy(() => import("@/components/CompetitiveEdge"));
const EcosystemFlow = lazy(() => import("@/components/EcosystemFlow"));
const ByTheNumbers = lazy(() => import("@/components/ByTheNumbers"));
const Transparency = lazy(() => import("@/components/Transparency"));
const Founders = lazy(() => import("@/components/Founders"));
const OriginStory = lazy(() => import("@/components/OriginStory"));
const RealWorldRoots = lazy(() => import("@/components/RealWorldRoots"));
const RealUtility = lazy(() => import("@/components/RealUtility"));
const MascotLore = lazy(() => import("@/components/MascotLore"));
const LiveProof = lazy(() => import("@/components/LiveProof"));
const Community = lazy(() => import("@/components/Community"));
const SponsorPOP = lazy(() => import("@/components/SponsorPOP"));
const VideoUpdatesHub = lazy(() => import("@/components/VideoUpdatesHub").then(m => ({ default: m.VideoUpdatesHub })));
const Vision = lazy(() => import("@/components/Vision"));
const TerrainScapeSneakPeek = lazy(() => import("@/components/TerrainScapeSneakPeek").then(m => ({ default: m.TerrainScapeSneakPeek })));
const MemeGenerator = lazy(() => import("@/components/MemeGenerator"));
const MemeHallOfFame = lazy(() => import("@/components/MemeHallOfFame"));
const MemeFeed = lazy(() => import("@/components/MemeFeed"));
const ContestRules = lazy(() => import("@/components/ContestRules"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));

const LoadingSection = () => (
  <div className="container mx-auto px-4 py-12 space-y-8">
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-64 w-full" />
  </div>
);

const Index = () => {
  const [activeTab, setActiveTab] = useTabPersistence('homepage', 'overview');
  useTabAnalytics('homepage', activeTab);

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
                  <span className="hidden sm:inline">Token Details</span>
                  <span className="sm:hidden">Token</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="community" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-4 min-h-[48px] text-sm md:text-base whitespace-nowrap"
                >
                  Community
                </TabsTrigger>
                <TabsTrigger 
                  value="resources" 
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 md:px-6 py-4 min-h-[48px] text-sm md:text-base whitespace-nowrap"
                >
                  Resources
                </TabsTrigger>
              </TabsList>
            </div>
          </Tabs>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="overview" className="mt-0 animate-in fade-in-50 duration-300">
            <Suspense fallback={<LoadingSection />}><QuickStartGuide /></Suspense>
            <Suspense fallback={<LoadingSection />}><CommunityBuzz /></Suspense>
            <Suspense fallback={<LoadingSection />}><AnalyzeToEarnHero /></Suspense>
            <Suspense fallback={<LoadingSection />}><RealUtility /></Suspense>
            <Suspense fallback={<LoadingSection />}><HowToBuy /></Suspense>
            <Suspense fallback={<LoadingSection />}><SocialProofWall /></Suspense>
            <div className="grid md:grid-cols-3 gap-6 container mx-auto px-4 py-12">
              <Suspense fallback={<Skeleton className="h-48" />}><VibeCheck /></Suspense>
              <Suspense fallback={<Skeleton className="h-48" />}><OrganicDiscoveryCounter /></Suspense>
              <Suspense fallback={<Skeleton className="h-48" />}><AntiRugMeter /></Suspense>
            </div>
          </TabsContent>

          <TabsContent value="token-details" className="mt-0 animate-in fade-in-50 duration-300">
            <Suspense fallback={<LoadingSection />}><About /></Suspense>
            <Suspense fallback={<LoadingSection />}><Tokenomics /></Suspense>
            <Suspense fallback={<LoadingSection />}><Roadmap /></Suspense>
            <Suspense fallback={<LoadingSection />}><CompetitiveEdge /></Suspense>
            <Suspense fallback={<LoadingSection />}><EcosystemFlow /></Suspense>
            <Suspense fallback={<LoadingSection />}><ByTheNumbers /></Suspense>
            <Suspense fallback={<LoadingSection />}><Transparency /></Suspense>
          </TabsContent>

          <TabsContent value="community" className="mt-0 animate-in fade-in-50 duration-300">
            <Suspense fallback={<LoadingSection />}><Founders /></Suspense>
            <Suspense fallback={<LoadingSection />}><OriginStory /></Suspense>
            <Suspense fallback={<LoadingSection />}><RealWorldRoots /></Suspense>
            <Suspense fallback={<LoadingSection />}><MascotLore /></Suspense>
            <Suspense fallback={<LoadingSection />}><LiveProof /></Suspense>
            <Suspense fallback={<LoadingSection />}><Community /></Suspense>
            <Suspense fallback={<LoadingSection />}><SponsorPOP /></Suspense>
          </TabsContent>

          <TabsContent value="resources" className="mt-0 animate-in fade-in-50 duration-300">
            <Suspense fallback={<LoadingSection />}><VideoUpdatesHub limit={6} showViewAll={true} showFilters={false} /></Suspense>
            <Suspense fallback={<LoadingSection />}><Vision /></Suspense>
            <Suspense fallback={<LoadingSection />}><TerrainScapeSneakPeek /></Suspense>
            <Suspense fallback={<LoadingSection />}><MemeGenerator /></Suspense>
            <Suspense fallback={<LoadingSection />}><MemeHallOfFame /></Suspense>
            <Suspense fallback={<LoadingSection />}><MemeFeed /></Suspense>
            <Suspense fallback={<LoadingSection />}><ContestRules /></Suspense>
            <Suspense fallback={<LoadingSection />}><FAQ /></Suspense>
          </TabsContent>
        </Tabs>
      </main>

      <Suspense fallback={<div className="h-64" />}><Footer /></Suspense>
    </>
  );
};

export default Index;
