import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import EarnTRN from "./pages/EarnTRN";
import GoblinCave from "./pages/GoblinCave";
import Whitepaper from "./pages/Whitepaper";
import TokenMetadata from "./pages/TokenMetadata";
import Updates from "./pages/Updates";
import Team from "./pages/Team";
import SubmitMeme from "./pages/SubmitMeme";
import UploadTestimonial from "./pages/UploadTestimonial";
import UploadProject from "./pages/UploadProject";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import PressKit from "./pages/PressKit";
import VideoUpdates from "./pages/VideoUpdates";
import HowTerrainTokenStarted from "./pages/blog/how-terrain-token-started";
import WhyMemeCoinsNeedRealWorldBacking from "./pages/blog/why-meme-coins-need-real-world-backing";
import AIPoweredDrainageAnalysisFuture from "./pages/blog/ai-powered-drainage-analysis-future";
import TransparencyReportNovember2025 from "./pages/blog/transparency-report-november-2025";
import TransparencyHub from "./pages/TransparencyHub";
import MobileNav from "./components/MobileNav";
import ThemeToggle from "./components/ThemeToggle";
import AudioControl from "./components/AudioControl";
import ExitIntent from "./components/ExitIntent";
import PWAPrompt from "./components/PWAPrompt";
import SkipToContent from "./components/SkipToContent";
import GoodbyeWave from "./components/GoodbyeWave";
import ScrollToTop from "./components/ScrollToTop";
import ErrorBoundary from "./components/ErrorBoundary";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { useEasterEggs } from "./hooks/useEasterEggs";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";
import { lazy, Suspense } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  useEasterEggs();
  useKeyboardShortcuts();

  return (
    <BrowserRouter>
      <SkipToContent />
      <ThemeToggle />
      <AudioControl />
      <ScrollToTop />
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <LoadingSpinner className="w-12 h-12" />
        </div>
      }>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/submit-meme" element={<SubmitMeme />} />
          <Route path="/goblin-cave" element={<GoblinCave />} />
          <Route path="/upload-project" element={<UploadProject />} />
          <Route path="/upload-testimonial" element={<UploadTestimonial />} />
          <Route path="/earn-trn" element={<EarnTRN />} />
          <Route path="/admin" element={<AdminDashboard />} />
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
