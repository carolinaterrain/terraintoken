import { Helmet } from "react-helmet-async";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { EcosystemHealthDashboard } from "@/components/ecosystem/EcosystemHealthDashboard";
import { CanonicalEcosystemDashboard } from "@/components/ecosystem/CanonicalEcosystemDashboard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ExternalLink, 
  Cpu, 
  Shield, 
  HardHat, 
  ArrowRight,
  CheckCircle2,
  XCircle,
  Info,
  Activity,
  Database,
  Eye
} from "lucide-react";

const Ecosystem = () => {
  return (
    <>
      <Helmet>
        <title>TRN Ecosystem — How It Powers Terrain Services | Terrain Token</title>
        <meta 
          name="description" 
          content="Understand how TRN integrates with TerrainVision AI, TerrainGuard, and Carolina Terrain. Optional utility access, no wallet required for homeowners." 
        />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />
      
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-16">
        <BackToHome />
        
        {/* Hero Section */}
        <section className="py-20 px-4 relative overflow-hidden">
          <div 
            className="absolute inset-0"
            style={{ 
              background: "radial-gradient(circle at center, hsl(var(--primary) / 0.1), transparent)",
            }}
          />
          
          <div className="container mx-auto max-w-4xl relative z-10">
            <div className="text-center">
              <h1 className="font-display text-4xl md:text-5xl font-bold mb-6">
                How TRN Powers the <span className="text-primary">Terrain Ecosystem</span>
              </h1>
              <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                TRN is an optional utility layer that powers access and incentives across three integrated platforms. 
                Homeowners never need wallets — credits are managed administratively.
              </p>
              
              {/* Explicit Disclaimer */}
              <div className="inline-flex items-center gap-2 bg-muted/30 border border-border/50 rounded-lg px-4 py-2">
                <Info className="w-4 h-4 text-muted-foreground" />
                <p className="font-body text-sm text-muted-foreground">
                  TRN is a utility access mechanism, not an investment product.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Ecosystem Health Dashboard */}
        <section className="py-16 px-4 bg-muted/10">
          <div className="container mx-auto max-w-4xl">
            <div className="flex items-center justify-center gap-2 mb-8">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="font-display text-2xl font-bold text-center">
                Live Ecosystem Status
              </h2>
            </div>
            
            <Tabs defaultValue="canonical" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="canonical" className="flex items-center gap-2">
                  <Database className="w-4 h-4" />
                  Terrain Lifecycle (Canonical)
                </TabsTrigger>
                <TabsTrigger value="local" className="flex items-center gap-2">
                  <Eye className="w-4 h-4" />
                  TerrainToken Local
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="canonical">
                <CanonicalEcosystemDashboard />
              </TabsContent>
              
              <TabsContent value="local">
                <EcosystemHealthDashboard />
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Simplified Ecosystem Diagram - Static Text Hierarchy */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-center mb-8">
              System Architecture
            </h2>
            
            <GlassCard className="p-8">
              <div className="space-y-4 font-mono text-sm">
                <div className="text-foreground font-bold">Terrain System</div>
                <div className="pl-4 space-y-3 text-muted-foreground">
                  <div className="flex items-start gap-3">
                    <span className="text-primary">↳</span>
                    <div>
                      <span className="text-foreground font-semibold">TerrainVision</span>
                      <span className="text-muted-foreground"> — AI-powered terrain diagnostics</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary">↳</span>
                    <div>
                      <span className="text-foreground font-semibold">TerrainGuard</span>
                      <span className="text-muted-foreground"> — Property protection records</span>
                      <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">Coming Soon</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary">↳</span>
                    <div>
                      <span className="text-foreground font-semibold">StormwaterSCM</span>
                      <span className="text-muted-foreground"> — Compliance management</span>
                      <span className="ml-2 text-xs bg-muted px-1.5 py-0.5 rounded">Coming Soon</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-primary">↳</span>
                    <div>
                      <span className="text-foreground font-semibold">Carolina Terrain</span>
                      <span className="text-muted-foreground"> — Licensed contractor execution</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 pt-2 border-t border-border/50">
                    <span className="text-muted-foreground">↳</span>
                    <div>
                      <span className="text-muted-foreground font-semibold">TRN</span>
                      <span className="text-muted-foreground"> — Optional utility credit</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <p className="text-xs text-muted-foreground mt-6 pt-4 border-t border-border/50">
                TRN operates as a background utility layer. All platforms function independently of TRN.
              </p>
            </GlassCard>
          </div>
        </section>

        {/* User Protections */}
        <section className="py-16 px-4 bg-muted/20">
          <div className="container mx-auto max-w-4xl">
            <h2 className="font-display text-2xl font-bold text-center mb-8">
              User Protections
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="font-display font-bold">TRN is Optional</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  All core platform functionality works without TRN. Users can choose whether to participate in the token ecosystem.
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="font-display font-bold">Walletless for Homeowners</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Homeowners never need to create crypto wallets. Credits are granted and managed administratively within each platform.
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="font-display font-bold">Tamper-Evident Logging</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  All token transactions are logged on-chain. Users can verify any claimed transaction via public blockchain explorers.
                </p>
              </GlassCard>

              <GlassCard className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <h3 className="font-display font-bold">Platform Controls Usage</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Terrain AI LLC manages internal token allocation. Users receive credits based on contribution quality, not speculation.
                </p>
              </GlassCard>
            </div>
          </div>
        </section>

        {/* What TRN Is NOT */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-3xl">
            <h2 className="font-display text-2xl font-bold text-center mb-8">
              What TRN Is <span className="text-destructive">NOT</span>
            </h2>
            
            <GlassCard className="p-8 bg-destructive/5 border-destructive/20">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Not an investment product.</strong> TRN does not promise returns, appreciation, or yield.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Not required to use services.</strong> All platforms work without TRN. It's purely optional.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Not redeemable for cash.</strong> TRN credits have no guaranteed monetary value.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <strong className="text-foreground">Not equity or ownership.</strong> TRN does not represent any stake in Terrain AI LLC or its subsidiaries.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </section>

        {/* Call to Action - Links Out */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl text-center">
            <h2 className="font-display text-2xl font-bold mb-4">
              Ready to Explore?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              TRN powers optional access across the Terrain ecosystem. Choose where you'd like to go:
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" variant="outline" asChild>
                <a href="https://terrainvision-ai.com" target="_blank" rel="noopener noreferrer">
                  TerrainVision AI <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://www.carolinaterrain.com/" target="_blank" rel="noopener noreferrer">
                  Carolina Terrain <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
              <Button size="lg" asChild>
                <a href="/whitepaper">
                  Read Whitepaper <ArrowRight className="ml-2 w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Ecosystem;
