import { Card } from "@/components/ui/card";
import { Sparkles, Users, Gift, Cpu, Database, Cog } from "lucide-react";

const phases = [
  {
    phase: "Phase 0",
    title: "Meme",
    icon: Sparkles,
    description: "Launch as a community-driven meme token with viral potential"
  },
  {
    phase: "Phase 1",
    title: "Community",
    icon: Users,
    description: "Build an engaged community through social channels and events"
  },
  {
    phase: "Phase 2",
    title: "Data Contribution Rewards",
    icon: Gift,
    description: "Earn TRN by contributing real-world terrain and yard data"
  },
  {
    phase: "Phase 3",
    title: "AI Credit Unlocks",
    icon: Cpu,
    description: "Use TRN to access AI-powered terrain analysis and insights"
  },
  {
    phase: "Phase 4",
    title: "Terrain Data Marketplace",
    icon: Database,
    description: "Global marketplace for terrain intelligence and data exchange"
  },
  {
    phase: "Phase 5",
    title: "Robotics Microtasks",
    icon: Cog,
    description: "Integration with autonomous systems for terrain-based tasks"
  }
];

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-20 px-4 bg-terrain-dark/30">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-primary">Journey</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From meme to mission — our phased evolution into terrain intelligence
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {phases.map((item, index) => {
            const Icon = item.icon;
            return (
              <Card 
                key={index}
                className="p-6 bg-card border-border hover:border-primary/50 transition-all duration-300 relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm font-semibold text-primary">{item.phase}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
