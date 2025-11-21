import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import SkipToContent from "@/components/SkipToContent";
import SoundToggle from "@/components/SoundToggle";
import ThemeToggle from "@/components/ThemeToggle";
import { useEasterEggs } from "@/hooks/useEasterEggs";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Lazy load pages for better performance
const NotFound = lazy(() => import("./pages/NotFound"));
const SubmitMeme = lazy(() => import("./pages/SubmitMeme"));
const GoblinCave = lazy(() => import("./pages/GoblinCave"));
const UploadProject = lazy(() => import("./pages/UploadProject"));
const UploadTestimonial = lazy(() => import("./pages/UploadTestimonial"));
const EarnTRN = lazy(() => import("./pages/EarnTRN"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const Whitepaper = lazy(() => import("./pages/Whitepaper"));
const Updates = lazy(() => import("./pages/Updates"));
const Team = lazy(() => import("./pages/Team"));
const PressKit = lazy(() => import("./pages/PressKit"));
const TokenMetadata = lazy(() => import("./pages/TokenMetadata"));
const MobileNav = lazy(() => import("@/components/MobileNav"));
const ExitIntent = lazy(() => import("@/components/ExitIntent"));
const PWAPrompt = lazy(() => import("@/components/PWAPrompt"));
const GoodbyeWave = lazy(() => import("@/components/GoodbyeWave"));
const PerformanceMonitor = lazy(() => import("@/components/PerformanceMonitor"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
    
    // Handle state-based scrolling (from DesktopNav)
    if (location.state?.scrollTo) {
      setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  return null;
};

const AppContent = () => {
  useEasterEggs();
  useKeyboardShortcuts();

  return (
    <BrowserRouter>
      <SkipToContent />
      <ThemeToggle />
      <SoundToggle />
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
  );
};

export default App;
