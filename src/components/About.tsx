import { GlassCard } from "@/components/ui/glass-card";
import { Sprout, Shield, Brain, Wrench, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import terrainMascot from "@/assets/terrain-mascot.png";

const features = [
  {
    icon: Sprout,
    title: "Platform Access",
    description: "Optional credits for premium terrain analysis and AI features"
  },
  {
    icon: Shield,
    title: "Walletless for Users",
    description: "Homeowners never need crypto wallets—TRN operates behind the scenes"
  },
  {
    icon: Brain,
    title: "Contribution Credits",
    description: "Earn TRN by uploading terrain data. No purchase required to participate."
  },
  {
    icon: Wrench,
    title: "Service Integration",
    description: "Optional discounts on Carolina Terrain drainage services"
  }
];

const About = () => {
  return (
    <section id="about" className="py-12 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: "var(--terrain-contour)" }}
      />
      
      <div className="container mx-auto relative">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <img 
              src={terrainMascot} 
              alt="TRN mascot" 
              className="w-24 h-24 animate-float"
            />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            What is <span className="text-primary">TRN</span>?
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
            TRN is an <span className="text-primary font-semibold">optional utility access layer</span> for the Terrain ecosystem. 
            It provides credits for premium services, rewards for data contribution, and integration with real-world drainage operations.
          </p>
          <p className="font-body text-md text-muted-foreground max-w-3xl mx-auto">
            <span className="font-semibold">Homeowners never need wallets.</span> Credits can be granted administratively through service agreements.
          </p>
        </div>

        {/* What TRN Does */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <GlassCard 
                key={index}
                hover
                className="p-6"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="font-body text-muted-foreground">{feature.description}</p>
              </GlassCard>
            );
          })}
        </div>

        {/* What TRN Is NOT - Explicit Section */}
        <GlassCard className="mt-12 p-8 border-destructive/20 bg-destructive/5">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h3 className="font-display text-2xl font-bold">
              What TRN Is <span className="text-destructive">NOT</span>
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-body text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="text-destructive font-bold">✕</span>
              <p><span className="text-foreground font-semibold">Not an investment product.</span> TRN carries no expectation of profit.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-destructive font-bold">✕</span>
              <p><span className="text-foreground font-semibold">Not a promise of returns.</span> Value may decrease to zero.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-destructive font-bold">✕</span>
              <p><span className="text-foreground font-semibold">Not required to use services.</span> All core features work without TRN.</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-destructive font-bold">✕</span>
              <p><span className="text-foreground font-semibold">Not a substitute for real revenue.</span> The business operates on USD.</p>
            </div>
          </div>
        </GlassCard>

        {/* CTA to Start Contributing */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="font-display font-semibold"
            asChild
          >
            <a href="/upload-project">
              Start Contributing Data
            </a>
          </Button>
          <p className="font-body text-xs text-muted-foreground mt-2">
            No purchase required. Earn credits by uploading terrain photos.
          </p>
        </div>

        {/* How TRN Fits Into the Ecosystem */}
        <GlassCard className="mt-12 p-8">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-6 text-center">
            How TRN Fits Into the <span className="text-primary">Ecosystem</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-chart-1/20 flex items-center justify-center mx-auto mb-3">
                <Brain className="w-6 h-6 text-chart-1" />
              </div>
              <h4 className="font-display font-semibold mb-2">TerrainVision AI</h4>
              <p className="font-body text-sm text-muted-foreground">
                Free analysis for all users. TRN unlocks premium tiers and rewards data contributors.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-chart-2" />
              </div>
              <h4 className="font-display font-semibold mb-2">TerrainGuard</h4>
              <p className="font-body text-sm text-muted-foreground">
                Subscription service operates in USD. TRN provides optional loyalty discounts.
              </p>
            </div>
            <div className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-chart-3/20 flex items-center justify-center mx-auto mb-3">
                <Wrench className="w-6 h-6 text-chart-3" />
              </div>
              <h4 className="font-display font-semibold mb-2">Carolina Terrain</h4>
              <p className="font-body text-sm text-muted-foreground">
                Licensed NC contractor (CL.1872). Accepts standard payment—TRN discounts are optional.
              </p>
            </div>
          </div>
          <p className="font-body text-xs text-muted-foreground text-center mt-6">
            All transactions logged in a tamper-evident ledger. TRN is the lubricant, not the engine.
          </p>
        </GlassCard>
      </div>
    </section>
  );
};

export default About;
