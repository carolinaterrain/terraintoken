/**
 * ARCHIVED — May 6, 2026
 *
 * This component contained stale phase-planning copy that contradicted
 * the canonical WhatsLiveToday.tsx source of truth. Retired during the
 * terraintoken.com Phase 1.6 cleanup.
 *
 * Do not import. If a forward-looking roadmap surface is needed in the
 * future, build a new component sourced from /content/roadmap.md (parallel
 * to the WhatsLiveToday → /content/status.md pattern).
 */

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
import { Badge } from "@/components/ui/badge";

// Status-based phases - NO future promises, only current state
const phases = [
  {
    phase: "Phase 0",
    title: "Meme",
    icon: Sparkles,
    description: "Launched as a community-driven token via fair launch",
    status: "complete",
    progress: 100,
    statusLabel: "Complete",
    milestones: ["Fair community launch", "Liquidity established", "Community channels active"]
  },
  {
    phase: "Phase 1",
    title: "Community",
    icon: Users,
    description: "Building engaged community through social channels and events",
    status: "current",
    progress: 75,
    statusLabel: "In Progress",
    milestones: ["Discord active", "Whitepaper published", "Meme contests running"]
  },
  {
    phase: "Phase 2",
    title: "Data Contribution",
    icon: Gift,
    description: "Users can earn TRN by contributing terrain and yard data",
    status: "current",
    progress: 40,
    statusLabel: "In Progress",
    milestones: ["TerrainVision AI in beta", "Upload system live", "Rewards tracking active"]
  },
  {
    phase: "Phase 3",
    title: "AI Credit Unlocks",
    icon: Cpu,
    description: "Use TRN to access AI-powered terrain analysis",
    status: "planned",
    progress: 0,
    statusLabel: "Planned",
    milestones: ["Pro tier access", "Advanced features", "Mobile app"]
  },
  {
    phase: "Phase 4",
    title: "Data Marketplace",
    icon: Database,
    description: "Marketplace for terrain intelligence and data exchange",
    status: "planned",
    progress: 0,
    statusLabel: "Planned",
    milestones: ["Marketplace launch", "B2B partnerships", "Enterprise features"]
  },
  {
    phase: "Phase 5",
    title: "Robotics Integration",
    icon: Cog,
    description: "Integration with autonomous systems for terrain tasks",
    status: "planned",
    progress: 0,
    statusLabel: "Research",
    milestones: ["Robotics R&D", "IoT integration", "Autonomous collection"]
  },
  {
    phase: "Phase 6",
    title: "Terrain Academy",
    icon: Gamepad2,
    description: "Educational platform for terrain analysis training",
    status: "planned",
    progress: 0,
    statusLabel: "Research",
    milestones: ["Training platform", "Industry certs", "Multi-language"]
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

  // Calculate actual progress based on completed phases
  const completedPhases = phases.filter(p => p.status === 'complete').length;
  const currentPhases = phases.filter(p => p.status === 'current').length;
  const actualProgress = Math.round(((completedPhases + (currentPhases * 0.5)) / phases.length) * 100);

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
                <h3 className="font-display text-2xl font-bold">Current Progress</h3>
                <p className="text-sm text-muted-foreground">Based on completed milestones</p>
              </div>
              <TrendingUp className="w-8 h-8 text-primary" />
            </div>
            <Progress value={actualProgress} className="h-3" />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>0%</span>
              <span className="font-bold text-primary">{actualProgress}% Complete</span>
              <span>100%</span>
            </div>
          </GlassCard>
        </div>

        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            The <span className="text-primary">Journey</span>
          </h2>
          <p className="font-body text-lg text-muted-foreground max-w-2xl mx-auto">
            From meme to mission — our evolution into terrain intelligence
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
                const isPlanned = item.status === "planned";
                
                return (
                  <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                    <GlassCard 
                      hover
                      className={`h-[240px] p-6 relative transition-all ${
                        isCurrent ? "border-primary/60 shadow-glow" : ""
                      } ${isPlanned ? "opacity-60" : ""}`}
                    >
                      {/* Status Badge */}
                      <div className="absolute top-4 right-4">
                        {isComplete && (
                          <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Badge>
                        )}
                        {isCurrent && (
                          <Badge className="bg-primary/20 text-primary border-primary/30">
                            <Clock className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        )}
                        {isPlanned && (
                          <Badge className="bg-muted text-muted-foreground border-muted-foreground/30">
                            Planned
                          </Badge>
                        )}
                      </div>

                      <div className="flex flex-col h-full">
                        {/* Icon & Phase Number */}
                        <div className="flex items-center gap-3 mb-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            isCurrent 
                              ? "bg-primary/20 animate-glow-pulse" 
                              : isComplete
                              ? "bg-green-500/20"
                              : "bg-primary/10"
                          }`}>
                            <Icon className={`w-6 h-6 ${
                              isCurrent ? "text-primary" : 
                              isComplete ? "text-green-400" : "text-primary/70"
                            }`} />
                          </div>
                          <span className={`font-display text-sm font-semibold ${
                            isCurrent ? "text-primary" : 
                            isComplete ? "text-green-400" : "text-primary/70"
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
                    : phase.status === "complete"
                    ? "w-2 bg-green-400"
                    : phase.status === "current"
                    ? "w-2 bg-primary/60"
                    : "w-2 bg-border"
                }`}
                aria-label={`Go to ${phase.phase}`}
              />
            ))}
          </div>

          {/* Phase Counter */}
          <p className="text-center text-sm text-muted-foreground mt-4">
            {phases[current].phase} — {phases[current].title} ({phases[current].statusLabel})
          </p>
        </div>
      </div>
    </section>
  );
};

export default Roadmap;
