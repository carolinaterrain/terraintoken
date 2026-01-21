import { Helmet } from "react-helmet-async";
import { lazy, Suspense } from "react";
import SkipToContent from "@/components/SkipToContent";
import ScrollProgress from "@/components/ScrollProgress";
import { Skeleton } from "@/components/ui/skeleton";

// Industrial DePIN components
const SmartHeader = lazy(() => import("@/components/SmartHeader"));
const IndustrialHero = lazy(() => import("@/components/industrial/IndustrialHero"));
const DePINFlywheel = lazy(() => import("@/components/industrial/DePINFlywheel"));
const LiveIndustrialDashboard = lazy(() => import("@/components/industrial/LiveIndustrialDashboard"));
const H3BountyMap = lazy(() => import("@/components/industrial/H3BountyMap"));
const IndustrialVerification = lazy(() => import("@/components/industrial/IndustrialVerification"));
const Footer = lazy(() => import("@/components/Footer"));

const SectionSkeleton = () => (
  <div className="min-h-[50vh] bg-slate-950 flex items-center justify-center">
    <Skeleton className="w-32 h-32 rounded-full" />
  </div>
);

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Terrain Token — The First 3D Spatial Economy for Earth's Critical Assets</title>
        <meta name="description" content="Industrial DePIN bridging Carolina Terrain's physical operations with $TRN utility. Map, build, and verify infrastructure the world can't afford to ignore." />
      </Helmet>
      
      <SkipToContent />
      <ScrollProgress />
      
      <Suspense fallback={<div className="h-16 bg-slate-950 border-b border-slate-800" />}>
        <SmartHeader />
      </Suspense>

      <main id="main-content" className="bg-slate-950">
        <Suspense fallback={<SectionSkeleton />}>
          <IndustrialHero />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <DePINFlywheel />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <LiveIndustrialDashboard />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <H3BountyMap />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <IndustrialVerification />
        </Suspense>
      </main>

      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </>
  );
};

export default Index;
