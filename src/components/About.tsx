import { GlassCard } from "@/components/ui/glass-card";
import { Sprout, TrendingUp, Brain, Bot } from "lucide-react";
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
    title: "AI Integration",
    description: "Unlock AI-powered terrain analysis and premium intelligence tools"
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
              alt="Terrain Mascot" 
              className="w-24 h-24 animate-float"
            />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            What is <span className="text-primary">TRN</span>?
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-3xl mx-auto mb-3">
            Terrain Token begins as a fun, community-driven meme coin but evolves into the world's 
            first terrain-data reward ecosystem. Combining internet culture with cutting-edge technology.
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
      </div>
    </section>
  );
};

export default About;
