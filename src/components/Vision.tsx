import { Card } from "@/components/ui/card";
import { Target } from "lucide-react";

const Vision = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-terrain-dark/20">
      <div className="container mx-auto max-w-4xl">
        <Card className="p-8 md:p-12 bg-card border-primary/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32" />
          
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold">Our Vision</h2>
            </div>
            
            <p className="text-lg text-muted-foreground leading-relaxed">
              Terrain Token begins as a fun community-driven meme coin but evolves into the world's 
              first terrain-data reward token. Users will earn <span className="text-primary font-semibold">TRN</span> for 
              contributing real-world yard, drainage, erosion, and terrain data. 
            </p>
            
            <p className="text-lg text-muted-foreground leading-relaxed mt-4">
              <span className="text-primary font-semibold">TRN</span> will unlock AI-powered tools, 
              premium analysis, and eventually a global terrain intelligence network. From memes to 
              meaningful data — we're building the future of ground-level intelligence.
            </p>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Vision;
