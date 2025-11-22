import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEasterEggs } from "./hooks/useEasterEggs";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

// Lazy load all pages for optimal code splitting
const Index = lazy(() => import("./pages/Index"));
const EarnTRN = lazy(() => import("./pages/EarnTRN"));
const GoblinCave = lazy(() => import("./pages/GoblinCave"));
const Whitepaper = lazy(() => import("./pages/Whitepaper"));
const TokenMetadata = lazy(() => import("./pages/TokenMetadata"));
const Updates = lazy(() => import("./pages/Updates"));
const Team = lazy(() => import("./pages/Team"));
const SubmitMeme = lazy(() => import("./pages/SubmitMeme"));
const UploadTestimonial = lazy(() => import("./pages/UploadTestimonial"));
const UploadProject = lazy(() => import("./pages/UploadProject"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const WaitlistDashboard = lazy(() => import("./pages/WaitlistDashboard"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const ABTestsDashboard = lazy(() => import("./pages/ABTestsDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const PressKit = lazy(() => import("./pages/PressKit"));
const VideoUpdates = lazy(() => import("./pages/VideoUpdates"));
const TransparencyHub = lazy(() => import("./pages/TransparencyHub"));
const HowTerrainTokenStarted = lazy(() => import("./pages/blog/how-terrain-token-started"));
const WhyMemeCoinsNeedRealWorldBacking = lazy(() => import("./pages/blog/why-meme-coins-need-real-world-backing"));
const AIPoweredDrainageAnalysisFuture = lazy(() => import("./pages/blog/ai-powered-drainage-analysis-future"));
const TransparencyReportNovember2025 = lazy(() => import("./pages/blog/transparency-report-november-2025"));

// Lazy load components
const AdminRoute = lazy(() => import("./components/AdminRoute").then(m => ({ default: m.AdminRoute })));
const AnalyticsWrapper = lazy(() => import("./components/AnalyticsWrapper").then(m => ({ default: m.AnalyticsWrapper })));
const MobileNav = lazy(() => import("./components/MobileNav"));
const ThemeToggle = lazy(() => import("./components/ThemeToggle"));
const AudioControl = lazy(() => import("./components/AudioControl"));
const ExitIntent = lazy(() => import("./components/ExitIntent"));
const PWAPrompt = lazy(() => import("./components/PWAPrompt"));
const SkipToContent = lazy(() => import("./components/SkipToContent"));
const GoodbyeWave = lazy(() => import("./components/GoodbyeWave"));
const ScrollToTop = lazy(() => import("./components/ScrollToTop"));
const PerformanceMonitor = lazy(() => import("./components/PerformanceMonitor"));
const KeyboardNav = lazy(() => import("./components/KeyboardNav").then(m => ({ default: m.KeyboardNav })));
const LiveAnnouncer = lazy(() => import("./components/LiveAnnouncer").then(m => ({ default: m.LiveAnnouncer })));

const queryClient = new QueryClient();

const AppContent = () => {
  useEasterEggs();
  useKeyboardShortcuts();

  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <LoadingSpinner className="w-12 h-12" />
        </div>
      }>
        <AnalyticsWrapper>
          <SkipToContent />
          <KeyboardNav />
          <LiveAnnouncer />
          <ThemeToggle />
          <AudioControl />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/submit-meme" element={<SubmitMeme />} />
            <Route path="/goblin-cave" element={<GoblinCave />} />
            <Route path="/upload-project" element={<UploadProject />} />
            <Route path="/upload-testimonial" element={<UploadTestimonial />} />
            <Route path="/earn-trn" element={<EarnTRN />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/waitlist" element={<AdminRoute><WaitlistDashboard /></AdminRoute>} />
            <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
            <Route path="/admin/ab-tests" element={<AdminRoute><ABTestsDashboard /></AdminRoute>} />
            <Route path="/whitepaper" element={<Whitepaper />} />
            <Route path="/updates" element={<Updates />} />
            <Route path="/team" element={<Team />} />
            <Route path="/press" element={<PressKit />} />
            <Route path="/token-metadata" element={<TokenMetadata />} />
            <Route path="/video-updates" element={<VideoUpdates />} />
            <Route path="/blog/how-terrain-token-started" element={<HowTerrainTokenStarted />} />
            <Route path="/blog/why-meme-coins-need-real-world-backing" element={<WhyMemeCoinsNeedRealWorldBacking />} />
            <Route path="/blog/ai-powered-drainage-analysis-future" element={<AIPoweredDrainageAnalysisFuture />} />
            <Route path="/blog/transparency-report-november-2025" element={<TransparencyReportNovember2025 />} />
            <Route path="/transparency" element={<TransparencyHub />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <MobileNav />
          <ExitIntent />
          <PWAPrompt />
          <GoodbyeWave />
        </AnalyticsWrapper>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <HelmetProvider>
          <TooltipProvider>
            <Suspense fallback={null}>
              <PerformanceMonitor />
            </Suspense>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </HelmetProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
