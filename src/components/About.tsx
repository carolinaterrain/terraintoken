import { GlassCard } from "@/components/ui/glass-card";
import { Sprout, TrendingUp, Brain, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import terrainMascot from "@/assets/terrain-mascot.png";

const features = [
  {
    icon: Sprout,
    title: "Meme Origin",
    description: "Born from eco-tech humor and the community spirit of crypto culture"
  },
  {
    icon: TrendingUp,
    title: "Utility Evolution",
    description: "Transforming from pure meme to real-world terrain data rewards"
  },
  {
    icon: Brain,
    title: "Analyze-to-Earn (LIVE)",
    description: "Upload terrain photos on TerrainVision AI. Get instant AI analysis. Earn TRN rewards. The future is here."
  },
  {
    icon: Bot,
    title: "Robotics Ready",
    description: "Future integration with autonomous systems and terrain robotics"
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
            Terrain Token <span className="text-primary font-semibold">has evolved</span> into the world's 
            first terrain-data reward ecosystem. <span className="text-primary font-semibold">Right now, you can upload photos on TerrainVision AI and earn TRN tokens while training our AI.</span> No speculation. Just contribution.
          </p>
          <p className="font-body text-md text-primary italic max-w-3xl mx-auto">
            While DOGE tweets and SHIB hopes, TRN BUILDS. We're the evolution of meme coins — from hot air to HARD ASSETS.
          </p>
        </div>
        
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

        {/* CTA to Start Earning */}
        <div className="text-center mt-12">
          <Button
            size="lg"
            className="font-display font-semibold"
            asChild
          >
            <a href="/upload-project">
              🚀 Start Earning TRN Now
            </a>
          </Button>
        </div>

        {/* Our Mission Section */}
        <GlassCard className="mt-12 p-8 text-center">
          <h3 className="font-display text-2xl md:text-3xl font-bold mb-4">
            Our <span className="text-primary">Mission</span>
          </h3>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto mb-4">
            To prove that digital currencies can be rooted in the physical world — not abstract speculation.
          </p>
          <p className="font-body text-md text-muted-foreground max-w-3xl mx-auto">
            TerrainToken ties blockchain incentives to real work, real soil health, real stormwater improvements, and transparent land data.
          </p>
          <p className="font-body text-lg text-primary font-semibold mt-4 italic">
            This is what happens when a drainage contractor builds a crypto project that actually means something.
          </p>
        </GlassCard>
      </div>
    </section>
  );
};

export default About;
