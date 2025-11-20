import { useState } from "react";
import { Building2, Sparkles, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const RealWorldRoots = () => {
  const [clickCount, setClickCount] = useState(0);
  const { toast } = useToast();

  const handleCarolinaTerrainClick = () => {
    const newCount = clickCount + 1;
    setClickCount(newCount);
    
    if (newCount === 5) {
      toast({
        title: "🚰 Honorary Drainage Inspector Badge Unlocked!",
        description: "You've been certified by the pros! The goblins are impressed.",
        duration: 5000,
      });
      // Reset after achievement
      setTimeout(() => setClickCount(0), 1000);
    }
  };

  return (
    <section className="py-20 px-4 bg-background relative overflow-hidden">
      {/* Background effect */}
      <div className="absolute inset-0 bg-[url('/hero-terrain-grid.jpg')] opacity-5" />
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            🏗️ Built on <span className="text-primary">Solid Ground</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Terrain Token isn't just vibes — we're the playful face of real terrain expertise
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Carolina Terrain */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all group">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Building2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Carolina Terrain</h3>
                <p className="text-sm text-muted-foreground">Professional Landscape Installation</p>
              </div>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Licensed • Insured • Bonded
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                NDS Drainage Certified
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Keystone Hardscape Experts
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                SOX Erosion Control Masters
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Pike's Nursery Lifetime Plant Guarantee
              </li>
            </ul>

            <Button
              onClick={handleCarolinaTerrainClick}
              className="w-full group-hover:shadow-glow transition-all"
              asChild
            >
              <a 
                href="https://www.carolinaterrain.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Visit Carolina Terrain
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </Card>

          {/* Terrain Vision AI */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-all group">
            <div className="flex items-start gap-4 mb-6">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Terrain Vision AI</h3>
                <p className="text-sm text-muted-foreground">Data-Driven Landscape Intelligence</p>
              </div>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                AI-Powered Landscape Analysis
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Automated Project Planning
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Smart Drainage Solutions
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Future of Terrain Management
              </li>
              <li className="flex items-center gap-2">
                <span className="text-primary">✓</span>
                Innovation Lab for Phase 3-5
              </li>
            </ul>

            <Button
              variant="outline"
              className="w-full group-hover:bg-primary/10 transition-all"
              asChild
            >
              <a 
                href="https://terrainvision-ai.com/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Explore Terrain Vision AI
                <ExternalLink className="w-4 h-4" />
              </a>
            </Button>
          </Card>
        </div>

        {/* Bottom message */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground max-w-3xl mx-auto">
            <span className="text-lg">The goblins are here to have fun...</span><br />
            <span className="text-xl font-bold text-primary">
              But the humans are building the infrastructure for tomorrow 🌱⛏️
            </span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default RealWorldRoots;
