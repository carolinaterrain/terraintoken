import { Suspense, lazy } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { StickyBuyButton } from "@/components/StickyBuyButton";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const HowToBuy = lazy(() => import("@/components/HowToBuy"));
const SocialProofWall = lazy(() => import("@/components/SocialProofWall").then(m => ({ default: m.SocialProofWall })));
const VibeCheck = lazy(() => import("@/components/VibeCheck").then(m => ({ default: m.VibeCheck })));
const OrganicDiscoveryCounter = lazy(() => import("@/components/OrganicDiscoveryCounter").then(m => ({ default: m.OrganicDiscoveryCounter })));
const AntiRugMeter = lazy(() => import("@/components/AntiRugMeter").then(m => ({ default: m.AntiRugMeter })));
const CommunityBuzz = lazy(() => import("@/components/CommunityBuzz").then(m => ({ default: m.CommunityBuzz })));
const RealUtility = lazy(() => import("@/components/RealUtility"));
const About = lazy(() => import("@/components/About"));
const Tokenomics = lazy(() => import("@/components/Tokenomics"));
const Founders = lazy(() => import("@/components/Founders"));
const Transparency = lazy(() => import("@/components/Transparency"));
const Roadmap = lazy(() => import("@/components/Roadmap"));
const FAQ = lazy(() => import("@/components/FAQ"));
const Footer = lazy(() => import("@/components/Footer"));

const LoadingSection = () => (
  <div className="container mx-auto px-4 py-12 space-y-8">
    <Skeleton className="h-12 w-3/4 mx-auto" />
    <Skeleton className="h-64 w-full" />
  </div>
);

export const ApeModeContent = () => {
  return (
    <>
      {/* Anti-Rug Trust Signals */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            🛡️ Why This Won't Rug You
          </h2>
          <p className="text-muted-foreground">
            Unlike 99% of meme coins, TRN is backed by real business
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <Suspense fallback={<Skeleton className="h-48" />}><VibeCheck /></Suspense>
          <Suspense fallback={<Skeleton className="h-48" />}><OrganicDiscoveryCounter /></Suspense>
          <Suspense fallback={<Skeleton className="h-48" />}><AntiRugMeter /></Suspense>
        </div>
      </section>

      {/* Social Proof Wall */}
      <Suspense fallback={<LoadingSection />}><SocialProofWall /></Suspense>

      {/* How to Buy */}
      <Suspense fallback={<LoadingSection />}><HowToBuy /></Suspense>

      {/* Community Buzz */}
      <Suspense fallback={<LoadingSection />}><CommunityBuzz /></Suspense>

      {/* Quick Utility Pitch */}
      <Suspense fallback={<LoadingSection />}><RealUtility /></Suspense>

      {/* Optional Depth Sections - Collapsed by default */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            📚 Want to Learn More?
          </h2>
          <p className="text-muted-foreground">
            Expand any section to dive deeper
          </p>
        </div>

        <Accordion type="single" collapsible className="max-w-4xl mx-auto space-y-4">
          <AccordionItem value="about" className="border border-border rounded-lg px-6">
            <AccordionTrigger className="text-xl font-semibold hover:text-primary">
              ▶ About TRN & Our Mission
            </AccordionTrigger>
            <AccordionContent>
              <Suspense fallback={<Skeleton className="h-64" />}>
                <About />
              </Suspense>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="tokenomics" className="border border-border rounded-lg px-6">
            <AccordionTrigger className="text-xl font-semibold hover:text-primary">
              ▶ Tokenomics & Distribution
            </AccordionTrigger>
            <AccordionContent>
              <Suspense fallback={<Skeleton className="h-64" />}>
                <Tokenomics />
              </Suspense>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="founders" className="border border-border rounded-lg px-6">
            <AccordionTrigger className="text-xl font-semibold hover:text-primary">
              ▶ Meet the Founders
            </AccordionTrigger>
            <AccordionContent>
              <Suspense fallback={<Skeleton className="h-64" />}>
                <Founders />
              </Suspense>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="transparency" className="border border-border rounded-lg px-6">
            <AccordionTrigger className="text-xl font-semibold hover:text-primary">
              ▶ Transparency Report (November 2025)
            </AccordionTrigger>
            <AccordionContent>
              <Suspense fallback={<Skeleton className="h-64" />}>
                <Transparency />
              </Suspense>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="roadmap" className="border border-border rounded-lg px-6">
            <AccordionTrigger className="text-xl font-semibold hover:text-primary">
              ▶ Roadmap & Future Plans
            </AccordionTrigger>
            <AccordionContent>
              <Suspense fallback={<Skeleton className="h-64" />}>
                <Roadmap />
              </Suspense>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      {/* FAQ */}
      <Suspense fallback={<LoadingSection />}><FAQ /></Suspense>

      {/* Footer */}
      <Suspense fallback={<div className="h-64" />}><Footer /></Suspense>

      {/* Sticky Buy Button (Mobile Only) */}
      <StickyBuyButton />
    </>
  );
};
