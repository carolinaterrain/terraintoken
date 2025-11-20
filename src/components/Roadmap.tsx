import { GlassCard } from "@/components/ui/glass-card";
import { Sparkles, Users, Gift, Cpu, Database, Cog, CheckCircle } from "lucide-react";
import terrainMascot from "@/assets/terrain-mascot.png";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useState, useEffect } from "react";

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
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

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
        
        {/* Carousel Timeline */}
        <div className="relative">
          {/* Walking Goblin - Dynamically positioned */}
          <div 
            className="absolute top-[-60px] z-10 animate-float transition-all duration-700 ease-out"
            style={{
              left: `${(current / (phases.length - 1)) * 100}%`,
              transform: "translateX(-50%)",
            }}
          >
            <img 
              src={terrainMascot} 
              alt="Goblin Walking" 
              className="w-12 h-12 transform -scale-x-100"
            />
          </div>

          {/* Carousel */}
          <Carousel
            setApi={setApi}
            opts={{
              align: "start",
              loop: false,
            }}
            className="w-full max-w-6xl mx-auto"
          >
            <CarouselContent className="-ml-4">
              {phases.map((item, index) => {
                const Icon = item.icon;
                const isComplete = item.status === "complete";
                const isCurrent = item.status === "current";
                
                return (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <GlassCard 
                      hover
                      className={`h-[240px] p-6 relative transition-all ${
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
                  </CarouselItem>
                );
              })}
            </CarouselContent>
            
            {/* Navigation Buttons */}
            <CarouselPrevious className="hidden md:flex -left-12" />
            <CarouselNext className="hidden md:flex -right-12" />
          </Carousel>

          {/* Progress Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {phases.map((phase, index) => (
              <button
                key={index}
                onClick={() => api?.scrollTo(index)}
                className={`h-2 rounded-full transition-all ${
                  current === index
                    ? "w-8 bg-primary"
                    : "w-2 bg-border hover:bg-border/60"
                }`}
                aria-label={`Go to ${phase.phase}`}
              />
            ))}
          </div>

          {/* Phase Counter */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {phases[current].phase} of {phases.length} — {phases[current].title}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
