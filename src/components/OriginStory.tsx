import { GlassCard } from "@/components/ui/glass-card";
import { Droplets, Globe, Link as LinkIcon } from "lucide-react";
import terrainMascot from "@/assets/terrain-mascot.png";

const OriginStory = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/95 via-background to-background/95" />
      
      <div className="container mx-auto relative z-10">
        <GlassCard className="p-8 md:p-12 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
              Origin <span className="text-primary">Story</span>
            </h2>
            <p className="font-body text-lg text-muted-foreground">
              Where Engineering Meets Innovation
            </p>
          </div>

          {/* Mascot Icon */}
          <div className="flex justify-center mb-8">
            <img 
              src={terrainMascot} 
              alt="TRN mascot" 
              className="w-20 h-20 animate-float"
            />
          </div>

          {/* Main Narrative */}
          <div className="space-y-6 font-body text-lg text-muted-foreground">
            <p className="text-center">
              TerrainToken began as a spark from Alex — an intersection of engineering, AI, and blockchain.
            </p>

            {/* First Quote */}
            <div className="border-l-4 border-primary bg-primary/5 pl-6 py-4 rounded-r my-6">
              <p className="italic text-foreground">
                "After years of fixing land failures, erosion, and stormwater problems, I recognized a simple truth..."
              </p>
            </div>

            {/* Three Truths */}
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Droplets className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Crypto had energy.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground">Stormwater had consequences.</p>
              </div>
              
              <div className="flex flex-col items-center text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <LinkIcon className="w-6 h-6 text-primary" />
                </div>
                <p className="font-semibold text-foreground">No one had fused them into something real.</p>
              </div>
            </div>

            {/* Second Quote */}
            <div className="border-l-4 border-primary bg-primary/5 pl-6 py-4 rounded-r my-6">
              <p className="italic text-foreground">
                "What if a token could be backed by real measurable land data, real work, and real environmental outcomes?"
              </p>
            </div>

            {/* Conclusion */}
            <p className="text-center text-lg">
              That question became the foundation of TerrainToken — a digital ecosystem built from the ground up <span className="italic">(literally)</span>, integrating AI models, decentralized incentives, and authentic field data.
            </p>

            {/* Final Statement */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-center text-xl font-semibold text-primary">
                This is what happens when a drainage contractor builds a crypto project that actually means something.
              </p>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default OriginStory;
