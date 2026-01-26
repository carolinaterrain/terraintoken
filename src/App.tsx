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

// Core pages
const Ecosystem = lazy(() => import("./pages/Ecosystem"));
const TransparencyHub = lazy(() => import("./pages/TransparencyHub"));
const GoblinMarket = lazy(() => import("./pages/GoblinMarket"));
const TRNDashboard = lazy(() => import("./pages/TRNDashboard"));
const Team = lazy(() => import("./pages/Team"));
const Investors = lazy(() => import("./pages/Investors"));
const Updates = lazy(() => import("./pages/Updates"));
const TokenMetadata = lazy(() => import("./pages/TokenMetadata"));

// Legal pages
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const Terms = lazy(() => import("./pages/Terms"));
const RiskDisclosure = lazy(() => import("./pages/RiskDisclosure"));

// Blog pages
const BlogHowTerrainStarted = lazy(() => import("./pages/blog/how-terrain-token-started"));
const BlogWhyMemeCoins = lazy(() => import("./pages/blog/why-meme-coins-need-real-world-backing"));
const BlogAIDrainage = lazy(() => import("./pages/blog/ai-powered-drainage-analysis-future"));
const BlogTransparencyReport = lazy(() => import("./pages/blog/transparency-report-november-2025"));

// Shop & Drops
const Shop = lazy(() => import("./pages/Shop"));
const Drops = lazy(() => import("./pages/Drops"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const RedeemTRN = lazy(() => import("./pages/RedeemTRN"));

// Community pages
const GoblinCave = lazy(() => import("./pages/GoblinCave"));
const SubmitMeme = lazy(() => import("./pages/SubmitMeme"));
const PhilanthropicFund = lazy(() => import("./pages/PhilanthropicFund"));
const UploadProject = lazy(() => import("./pages/UploadProject"));
const PressKit = lazy(() => import("./pages/PressKit"));
const Whitepaper = lazy(() => import("./pages/Whitepaper"));

// Admin pages
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const UnifiedAdminDashboard = lazy(() => import("./pages/UnifiedAdminDashboard"));
const EcosystemAdmin = lazy(() => import("./pages/EcosystemAdmin"));
const AnalyticsDashboard = lazy(() => import("./pages/AnalyticsDashboard"));
const FunnelAnalytics = lazy(() => import("./pages/FunnelAnalytics"));
const ABTestsDashboard = lazy(() => import("./pages/ABTestsDashboard"));
const AirdropDashboard = lazy(() => import("./pages/AirdropDashboard"));
const AdminRoute = lazy(() => import("./components/AdminRoute").then(m => ({ default: m.AdminRoute })));
const NotFound = lazy(() => import("./pages/NotFound"));

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
          <Route path="/about" element={<AboutPage />} />
          <Route path="/legal" element={<LegalPage />} />
          <Route path="/press" element={<PressPage />} />
          
          {/* Core Pages */}
          <Route path="/ecosystem" element={<Ecosystem />} />
          <Route path="/transparency" element={<TransparencyHub />} />
          <Route path="/market" element={<GoblinMarket />} />
          <Route path="/dashboard" element={<TRNDashboard />} />
          <Route path="/team" element={<Team />} />
          <Route path="/investors" element={<Investors />} />
          <Route path="/updates" element={<Updates />} />
          <Route path="/token-metadata" element={<TokenMetadata />} />
          <Route path="/whitepaper" element={<WhitepaperPage />} />
          
          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/risk-disclosure" element={<RiskDisclosure />} />
          
          {/* Blog */}
          <Route path="/blog/how-terrain-token-started" element={<BlogHowTerrainStarted />} />
          <Route path="/blog/why-meme-coins-need-real-world-backing" element={<BlogWhyMemeCoins />} />
          <Route path="/blog/ai-powered-drainage-analysis-future" element={<BlogAIDrainage />} />
          <Route path="/blog/transparency-report-november-2025" element={<BlogTransparencyReport />} />
          
          {/* Shop & Drops */}
          <Route path="/shop" element={<Shop />} />
          <Route path="/drops" element={<Drops />} />
          <Route path="/drops/:productId" element={<ProductDetail />} />
          <Route path="/redeem" element={<RedeemTRN />} />
          
          {/* Community */}
          <Route path="/goblin-cave" element={<GoblinCave />} />
          <Route path="/submit-meme" element={<SubmitMeme />} />
          <Route path="/philanthropic-fund" element={<PhilanthropicFund />} />
          <Route path="/upload-project" element={<UploadProject />} />
          <Route path="/press-kit" element={<PressKit />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/unified" element={<AdminRoute><UnifiedAdminDashboard /></AdminRoute>} />
          <Route path="/admin/ecosystem" element={<AdminRoute><EcosystemAdmin /></AdminRoute>} />
          <Route path="/admin/analytics" element={<AdminRoute><AnalyticsDashboard /></AdminRoute>} />
          <Route path="/admin/funnel" element={<AdminRoute><FunnelAnalytics /></AdminRoute>} />
          <Route path="/admin/ab-tests" element={<AdminRoute><ABTestsDashboard /></AdminRoute>} />
          <Route path="/admin/airdrop" element={<AirdropDashboard />} />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

// Import wallet provider for Solana integration
import { SolanaWalletProvider } from "./providers/WalletProvider";

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <SolanaWalletProvider>
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
          </SolanaWalletProvider>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;