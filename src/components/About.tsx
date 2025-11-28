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
            TRN <span className="text-primary font-semibold">powers platform access and sustainability</span> within the Terrain ecosystem. 
            <span className="text-primary font-semibold"> Upload photos on TerrainVision AI, contribute terrain data, and access platform utilities.</span> Real contribution, real utility.
          </p>
          <p className="font-body text-md text-primary italic max-w-3xl mx-auto">
            TRN is used within the platform and governed by community rules—not speculation.
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
            TRN powers platform access and sustainability. Value comes from real utility—terrain data contribution, AI analysis, and community governance.
          </p>
          <p className="font-body text-lg text-primary font-semibold mt-4 italic">
            Built by licensed contractors who understand real-world operations.
          </p>
        </GlassCard>
      </div>
    </section>
  );
};

export default About;
