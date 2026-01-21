import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "next-themes";
import { lazy, Suspense } from "react";
import { LoadingSpinner } from "./components/ui/loading-spinner";
import ErrorBoundary from "./components/ErrorBoundary";
import { TokenDataProvider } from "./providers/TokenDataProvider";

// Lazy load toast systems
const Toaster = lazy(() => import("@/components/ui/toaster").then(m => ({ default: m.Toaster })));
const Sonner = lazy(() => import("@/components/ui/sonner").then(m => ({ default: m.Toaster })));

// Main landing page (Industrial DePIN)
const Index = lazy(() => import("./pages/Index"));

// Institutional pages
const HomePage = lazy(() => import("./pages/institutional/HomePage"));
const FlywheelPage = lazy(() => import("./pages/institutional/FlywheelPage"));
const ProductsPage = lazy(() => import("./pages/institutional/ProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/institutional/ProductDetailPage"));
const ProofPage = lazy(() => import("./pages/institutional/ProofPage"));
const RoadmapPage = lazy(() => import("./pages/institutional/RoadmapPage"));
const ContributePage = lazy(() => import("./pages/institutional/ContributePage"));
const TokenPage = lazy(() => import("./pages/institutional/TokenPage"));
const PricingPage = lazy(() => import("./pages/institutional/PricingPage"));
const WhitepaperPage = lazy(() => import("./pages/institutional/WhitepaperPage"));
const AboutPage = lazy(() => import("./pages/institutional/AboutPage"));
const LegalPage = lazy(() => import("./pages/institutional/LegalPage"));
const PressPage = lazy(() => import("./pages/institutional/PressPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Shop & Drops
const Shop = lazy(() => import("./pages/Shop"));
const Drops = lazy(() => import("./pages/Drops"));

// Admin pages (keep existing)
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UnifiedAdminDashboard = lazy(() => import("./pages/UnifiedAdminDashboard"));
const AdminRoute = lazy(() => import("./components/AdminRoute").then(m => ({ default: m.AdminRoute })));

const queryClient = new QueryClient();

const AppContent = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <LoadingSpinner className="w-12 h-12" />
        </div>
      }>
        <Routes>
          {/* Main Landing Page - Industrial DePIN */}
          <Route path="/" element={<Index />} />
          
          {/* Institutional Routes */}
          <Route path="/institutional" element={<HomePage />} />
          <Route path="/flywheel" element={<FlywheelPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/proof" element={<ProofPage />} />
          <Route path="/roadmap" element={<RoadmapPage />} />
          <Route path="/contribute" element={<ContributePage />} />
          <Route path="/token" element={<TokenPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/whitepaper" element={<WhitepaperPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/press" element={<PressPage />} />
          
          {/* Shop & Drops */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/drops" element={<Drops />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/unified" element={<AdminRoute><UnifiedAdminDashboard /></AdminRoute>} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <TokenDataProvider>
            <HelmetProvider>
              <TooltipProvider>
                <Suspense fallback={null}>
                  <Toaster />
                  <Sonner />
                </Suspense>
                <AppContent />
              </TooltipProvider>
            </HelmetProvider>
          </TokenDataProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
