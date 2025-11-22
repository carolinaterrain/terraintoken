import { GlassCard } from "@/components/ui/glass-card";
import { Target } from "lucide-react";
import { Button } from "@/components/ui/button";

const Vision = () => {
  return (
    <section className="py-12 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{ 
          background: "radial-gradient(circle at center, hsl(142 84% 47% / 0.08), transparent)",
        }}
      />
      
      <div className="container mx-auto max-w-4xl relative">
        <GlassCard className="p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-bold">Our Vision</h2>
            </div>
            
            <h3 className="font-display text-2xl font-bold mb-4 text-primary">
              The Future is NOW: Analyze-to-Earn Goes Live
            </h3>
            
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              We're not promising utility in 2026. <span className="text-primary font-semibold">TerrainVision AI is LIVE RIGHT NOW</span>. 
              Upload photos of drainage problems, get instant AI analysis, earn TRN tokens. No roadmap promises—actual functionality.
            </p>
            
            <p className="font-body text-xl font-bold text-primary leading-relaxed mt-6">
              While other meme coins PROMISE features, TRN DELIVERS them. ⛏️
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 mb-6">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-2xl mb-2">🏗️</p>
                <p className="font-display font-semibold mb-1">For Landscaping</p>
                <p className="text-sm text-muted-foreground">We're building the Wikipedia of terrain data</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-2xl mb-2">🤖</p>
                <p className="font-display font-semibold mb-1">For AI</p>
                <p className="text-sm text-muted-foreground">We're democratizing machine learning datasets</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-2xl mb-2">💎</p>
                <p className="font-display font-semibold mb-1">For Crypto</p>
                <p className="text-sm text-muted-foreground">We're proving meme coins can have REAL utility</p>
              </div>
            </div>
            
            <p className="font-body text-lg font-bold text-foreground leading-relaxed mt-6 p-4 bg-primary/10 rounded-lg border-l-4 border-primary">
              We're not competing with DOGE or SHIB. We're creating an entirely new category: <span className="text-primary">Data Contribution Tokens</span>.
            </p>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
              <Button
                size="lg"
                className="font-display font-semibold"
                asChild
              >
                <a href="https://t.me/+s6385WFOp21lOGZh" target="_blank" rel="noopener noreferrer">
                  Join the Mission 🚀
                </a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="font-display font-semibold border-primary"
                asChild
              >
                <a href="/earn-trn">
                  View Earning Dashboard 📊
                </a>
              </Button>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default Vision;
