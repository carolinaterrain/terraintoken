import { GlassCard } from "@/components/ui/glass-card";
import { Target } from "lucide-react";

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
            
            <p className="font-body text-lg text-muted-foreground leading-relaxed">
              Terrain Token begins as a fun community-driven meme coin but evolves into the world's 
              first terrain-data reward token. Users will earn <span className="text-primary font-semibold">TRN</span> for 
              contributing real-world yard, drainage, erosion, and terrain data. 
            </p>
            
            <p className="font-body text-lg text-muted-foreground leading-relaxed mt-4">
              <span className="text-primary font-semibold">TRN</span> will unlock AI-powered tools, 
              premium analysis, and eventually a global terrain intelligence network. From memes to 
              meaningful data — we're building the future of ground-level intelligence.
            </p>
            
            <p className="font-body text-md text-primary font-semibold italic leading-relaxed mt-6">
              We're not here to compete with DOGE. We're here to REPLACE the entire concept of what a meme coin can be. 
              From memeing to utility. From jokes to JOBS. From pumps to PUMPS (water pumps, that is). 🚰⛏️
            </p>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default Vision;
