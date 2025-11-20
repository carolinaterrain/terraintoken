import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SubmitMeme from "./pages/SubmitMeme";
import GoblinCave from "./pages/GoblinCave";
import UploadProject from "./pages/UploadProject";
import UploadTestimonial from "./pages/UploadTestimonial";
import EarnTRN from "./pages/EarnTRN";
import AdminDashboard from "./pages/AdminDashboard";
import MobileNav from "@/components/MobileNav";
import ExitIntent from "@/components/ExitIntent";
import PWAPrompt from "@/components/PWAPrompt";
import GoodbyeWave from "@/components/GoodbyeWave";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { useEasterEggs } from "@/hooks/useEasterEggs";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const queryClient = new QueryClient();

const AppContent = () => {
  useEasterEggs();
  useKeyboardShortcuts();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/submit-meme" element={<SubmitMeme />} />
        <Route path="/goblin-cave" element={<GoblinCave />} />
        <Route path="/upload-project" element={<UploadProject />} />
        <Route path="/upload-testimonial" element={<UploadTestimonial />} />
        <Route path="/earn-trn" element={<EarnTRN />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <MobileNav />
      <ExitIntent />
      <PWAPrompt />
      <GoodbyeWave />
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <PerformanceMonitor />
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
};

export default App;
