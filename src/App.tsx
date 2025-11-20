import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SubmitMeme from "./pages/SubmitMeme";
import GoblinCave from "./pages/GoblinCave";
import MobileNav from "@/components/MobileNav";
import ExitIntent from "@/components/ExitIntent";
import PWAPrompt from "@/components/PWAPrompt";
import GoodbyeWave from "@/components/GoodbyeWave";
import PerformanceMonitor from "@/components/PerformanceMonitor";
import { useEasterEggs } from "@/hooks/useEasterEggs";

const queryClient = new QueryClient();

const AppContent = () => {
  useEasterEggs();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/submit-meme" element={<SubmitMeme />} />
        <Route path="/goblin-cave" element={<GoblinCave />} />
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
      <TooltipProvider>
        <PerformanceMonitor />
        <Toaster />
        <Sonner />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
