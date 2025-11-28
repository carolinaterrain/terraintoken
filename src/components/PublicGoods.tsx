import { GlassCard } from "@/components/ui/glass-card";
import { Heart, Globe, Droplets, TreePine } from "lucide-react";

const initiatives = [
  {
    icon: Droplets,
    title: "Stormwater Education",
    description: "Funding community programs that teach proper drainage techniques and flood prevention"
  },
  {
    icon: TreePine,
    title: "Erosion Prevention",
    description: "Supporting reforestation and soil stabilization projects in vulnerable areas"
  },
  {
    icon: Globe,
    title: "Climate Resilience",
    description: "Research grants for sustainable land management practices"
  }
];

const PublicGoods = () => {
  return (
    <section id="public-goods" className="py-16 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: "var(--terrain-grid)" }}
      />
      
      <div className="container mx-auto relative max-w-5xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Heart className="w-8 h-8 text-primary" />
            <h2 className="font-display text-4xl md:text-5xl font-bold">
              Public <span className="text-primary">Goods</span>
            </h2>
          </div>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            A portion of platform usage supports real-world terrain and environmental initiatives
          </p>
          <p className="font-body text-sm text-muted-foreground max-w-2xl mx-auto">
            Through the Foundation allocation, platform activity funds grants for climate resilience, 
            erosion prevention, and stormwater education—not promises, just measurable impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {initiatives.map((item, index) => {
            const Icon = item.icon;
            return (
              <GlassCard key={index} hover className="p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="font-body text-sm text-muted-foreground">{item.description}</p>
              </GlassCard>
            );
          })}
        </div>

        <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-primary/5">
          <div className="text-center">
            <h3 className="font-display text-2xl font-bold mb-4">
              How It Works
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="font-display font-bold text-primary mb-2">Step 1</p>
                <p className="text-muted-foreground">Platform usage generates activity fees</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="font-display font-bold text-primary mb-2">Step 2</p>
                <p className="text-muted-foreground">Foundation allocation funds grant pool</p>
              </div>
              <div className="p-4 bg-background/50 rounded-lg">
                <p className="font-display font-bold text-primary mb-2">Step 3</p>
                <p className="text-muted-foreground">Transparent disbursements to verified projects</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-6 italic">
              All grants are tracked publicly. No promises—just verifiable impact.
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default PublicGoods;
