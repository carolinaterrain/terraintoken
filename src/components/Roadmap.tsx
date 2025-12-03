import { GlassCard } from "@/components/ui/glass-card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Users, Gift, Cpu, Database, Cog, CheckCircle, Clock, TrendingUp, Gamepad2 } from "lucide-react";
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
    status: "complete",
    progress: 100,
    timeline: "Q2 2025",
    milestones: ["Fair launch on Pump.fun", "Liquidity locked", "Community channels established"]
  },
  {
    phase: "Phase 1",
    title: "Community",
    icon: Users,
    description: "Build an engaged community through social channels and events",
    status: "current",
    progress: 75,
    timeline: "Q3-Q4 2025",
    milestones: ["1000+ Discord members", "Whitepaper released", "Meme contests", "First partnerships"]
  },
  {
    phase: "Phase 2",
    title: "Data Contribution Rewards",
    icon: Gift,
    description: "Earn TRN by contributing real-world terrain and yard data",
    status: "current",
    progress: 40,
    timeline: "Q4 2025",
    milestones: ["TerrainVision AI beta", "Upload & earn system", "First 10k photos analyzed", "Community dashboard"]
  },
  {
    phase: "Phase 3",
    title: "AI Credit Unlocks",
    icon: Cpu,
    description: "Use TRN to access AI-powered terrain analysis and insights",
    status: "future",
    progress: 0,
    timeline: "Q1-Q2 2026",
    milestones: ["Pro tier access", "Advanced analysis features", "Mobile app launch", "API access"]
  },
  {
    phase: "Phase 4",
    title: "Terrain Data Marketplace",
    icon: Database,
    description: "Global marketplace for terrain intelligence and data exchange",
    status: "future",
    progress: 0,
    timeline: "Q3-Q4 2026",
    milestones: ["Data marketplace launch", "B2B partnerships", "Enterprise features", "DAO governance"]
  },
  {
    phase: "Phase 5",
    title: "Robotics Microtasks",
    icon: Cog,
    description: "Integration with autonomous systems for terrain-based tasks",
    status: "future",
    progress: 0,
    timeline: "2027+",
    milestones: ["Robotics partnerships", "IoT integration", "Autonomous data collection", "Global expansion"]
  },
  {
    phase: "Phase 6",
    title: "Terrain Academy",
    icon: Gamepad2,
    description: "Launch educational platform for terrain analysis training and certification",
    status: "future",
    progress: 0,
    timeline: "2026+",
    milestones: ["Training platform launch", "Industry certifications", "Mobile app (10 languages)", "100k+ active users"]
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
        {/* Progress Overview */}
        <div className="mb-12">
          <GlassCard className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-display text-2xl font-bold">Overall Progress</h3>
                <p className="text-sm text-muted-foreground">Journey to terrain intelligence</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <Progress value={36} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0% Complete</span>
              <span className="font-bold text-primary">36% Complete</span>
              <span>100% Complete</span>
            </div>
          </GlassCard>
        </div>

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
