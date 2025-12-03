import { Button } from "@/components/ui/button";

const EarnHero = () => {
  return (
    <section className="py-20 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0"
        style={{ 
          background: "radial-gradient(circle at center, hsl(var(--primary) / 0.1), transparent)",
        }}
      />
      
      <div className="container mx-auto max-w-4xl relative z-10">
        <div className="text-center">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
            Turn Your Yard Disasters Into <span className="text-primary">TRN Rewards</span>
          </h1>
          <p className="font-body text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Upload terrain photos. Train our AI. Earn TRN. It's that simple.
          </p>
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
