import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { Upload, Database, Wallet, FolderOpen } from "lucide-react";

const EarnHero = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{ 
          background: "radial-gradient(circle at center, hsl(var(--primary) / 0.1), transparent)",
        }}
      />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Turn Your Yard Disasters Into <span className="text-primary">TRN Rewards</span>
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto">
            Upload terrain photos. Train our AI. Earn TRN. It's that simple.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <GlassCard className="p-6 text-center">
            <Upload className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="font-display text-2xl font-bold text-primary mb-1">10 TRN</div>
            <div className="font-body text-sm text-muted-foreground">Upload Photo</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <Database className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="font-display text-2xl font-bold text-primary mb-1">+50 TRN</div>
            <div className="font-body text-sm text-muted-foreground">Allow AI Training</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <Wallet className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="font-display text-2xl font-bold text-primary mb-1">+5 TRN</div>
            <div className="font-body text-sm text-muted-foreground">Connect Wallet</div>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <FolderOpen className="w-8 h-8 text-primary mx-auto mb-3" />
            <div className="font-display text-2xl font-bold text-primary mb-1">+10 TRN</div>
            <div className="font-body text-sm text-muted-foreground">Select Category</div>
          </GlassCard>
        </div>

        <div className="text-center">
          <Button size="lg" className="font-display" asChild>
            <a href="/upload-project">Start Earning Now</a>
          </Button>
          <p className="font-body text-sm text-muted-foreground mt-4">
            Up to 75 TRN per upload • No purchase required
          </p>
        </div>
      </div>
    </section>
  );
};

export default EarnHero;
