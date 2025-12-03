import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const QuickStartGuide = lazy(() => import("@/components/QuickStartGuide").then(m => ({ default: m.QuickStartGuide })));
const EcosystemProof = lazy(() => import("@/components/ecosystem/EcosystemProof").then(m => ({ default: m.EcosystemProof })));
const HowToBuy = lazy(() => import("@/components/HowToBuy"));
const SocialProofWall = lazy(() => import("@/components/SocialProofWall").then(m => ({ default: m.SocialProofWall })));
const RealUtility = lazy(() => import("@/components/RealUtility"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));

const LoadingSection = () => (
  <div className="container mx-auto px-4 py-12 space-y-8">
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export const ResearchModeContent = () => {
  return (
    <>
      <Suspense fallback={<LoadingSection />}><QuickStartGuide /></Suspense>
      <Suspense fallback={<LoadingSection />}><EcosystemProof /></Suspense>
      <Suspense fallback={<LoadingSection />}><RealUtility /></Suspense>
      <Suspense fallback={<LoadingSection />}><HowToBuy /></Suspense>
      <Suspense fallback={<LoadingSection />}><SocialProofWall /></Suspense>
      <Suspense fallback={<LoadingSection />}><FAQ /></Suspense>
      <Suspense fallback={<div className="h-64" />}><Footer /></Suspense>
    </>
  );
};
