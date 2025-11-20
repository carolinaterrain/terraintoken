import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles, Users, Gift, Cpu, Database, Cog, CheckCircle } from "lucide-react";
import terrainMascot from "@/assets/terrain-mascot.png";

const phases = [
  {
    phase: "Phase 0",
    title: "Meme",
    icon: Sparkles,
    description: "Launch as a community-driven meme token with viral potential",
    status: "complete"
  },
  {
    phase: "Phase 1",
    title: "Community",
    icon: Users,
    description: "Build an engaged community through social channels and events",
    status: "current"
  },
  {
    phase: "Phase 2",
    title: "Data Contribution Rewards",
    icon: Gift,
    description: "Earn TRN by contributing real-world terrain and yard data",
    status: "future"
  },
  {
    phase: "Phase 3",
    title: "AI Credit Unlocks",
    icon: Cpu,
    description: "Use TRN to access AI-powered terrain analysis and insights",
    status: "future"
  },
  {
    phase: "Phase 4",
    title: "Terrain Data Marketplace",
    icon: Database,
    description: "Global marketplace for terrain intelligence and data exchange",
    status: "future"
  },
  {
    phase: "Phase 5",
    title: "Robotics Microtasks",
    icon: Cog,
    description: "Integration with autonomous systems for terrain-based tasks",
    status: "future"
  }
];

const Roadmap = () => {
  return (
    <section id="roadmap" className="py-16 px-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: "var(--terrain-grid)" }}
      />
      
      <div className="container mx-auto relative">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-primary">Journey</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            From meme to mission — our phased evolution into terrain intelligence
          </p>
        </div>
        
        {/* Horizontal Scroll Timeline */}
        <div className="relative">
          {/* Walking Goblin */}
          <div className="absolute left-[16.66%] top-[-60px] z-10 animate-float">
            <img 
              src={terrainMascot} 
              alt="Goblin Walking" 
              className="w-12 h-12 transform -scale-x-100"
            />
          </div>

          {/* Timeline Container */}
          <div className="overflow-x-auto pb-8 scrollbar-hide">
            <div className="flex gap-6 min-w-max px-4">
              {phases.map((item, index) => {
                const Icon = item.icon;
                const isComplete = item.status === "complete";
                const isCurrent = item.status === "current";
                
                return (
                  <div key={index} className="relative">
                    {/* Connection Line */}
                    {index < phases.length - 1 && (
                      <div 
                        className={`absolute top-24 left-full w-6 h-0.5 ${
                          isComplete ? "bg-primary" : "bg-border"
                        }`}
                      />
                    )}

                    {/* Phase Card */}
                    <GlassCard 
                      hover
                      className={`min-w-[280px] w-[280px] h-[240px] p-6 relative transition-all ${
                        isCurrent ? "border-primary/60 shadow-glow" : ""
                      } ${item.status === "future" ? "opacity-70" : ""}`}
                    >
                      {/* Checkmark for completed */}
                      {isComplete && (
                        <div className="absolute top-4 right-4">
                          <CheckCircle className="w-6 h-6 text-primary" />
                        </div>
                      )}

                      <div className="flex flex-col h-full">
                        {/* Icon & Phase Number */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isCurrent 
                              ? "bg-primary/20 animate-glow-pulse" 
                              : "bg-primary/10"
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              isCurrent ? "text-primary" : "text-primary/70"
                            }`} />
                          </div>
                          <span className={`font-display text-sm font-semibold ${
                            isCurrent ? "text-primary" : "text-primary/70"
                          }`}>
                            {item.phase}
                          </span>
                        </div>
                        
                        {/* Title */}
                        <h3 className="font-display text-xl font-bold mb-3">
                          {item.title}
                        </h3>
                        
                        {/* Description */}
                        <p className="font-body text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center gap-2 mt-6">
            {phases.map((phase, index) => (
              <div
                key={index}
                className={`h-1 w-8 rounded-full transition-all ${
                  phase.status === "complete"
                    ? "bg-primary"
                    : phase.status === "current"
                    ? "bg-primary/50"
                    : "bg-border"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
