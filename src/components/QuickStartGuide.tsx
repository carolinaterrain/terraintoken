import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Lightbulb, Shield, Zap } from "lucide-react";
import { useState } from "react";

export const QuickStartGuide = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const steps = [
    {
      icon: Lightbulb,
      title: "What is TRN?",
      color: "text-yellow-500",
      bgColor: "bg-yellow-500/10",
      borderColor: "border-yellow-500/20",
      description: "A utility/incentive token",
      details: "TRN powers platform access within the Terrain Token ecosystem. Built by Carolina Terrain, a licensed NC drainage contractor. $TRN is not an investment or security and carries no promise of profit, yield, or return."
    },
    {
      icon: Shield,
      title: "Why Transparency Matters",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
      description: "Verifiable, not speculative",
      details: "TRN publishes on-chain data, equipment inventories, and operational status. The token is tied to a licensed contracting business with established operations — but business performance does not guarantee token value."
    },
    {
      icon: Zap,
      title: "How to Participate",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
      description: "Get started in 3 ways",
      details: "1) Buy TRN on Raydium/Jupiter 2) Earn TRN by contributing project photos to Terrain Vision AI 3) Join the community on X/Discord and participate in meme contests"
    }
  ];

  return (
    <section className="py-12 md:py-16 px-6 bg-gradient-to-b from-background/50 to-background relative overflow-hidden">
      {/* Background decoration */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      />

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 border-primary/40">
            👋 New Here? Start Here
          </Badge>
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Quick Start Guide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Understand TRN in 60 seconds
          </p>
        </div>

        {/* Flow diagram on desktop */}
        <div className="hidden lg:flex items-center justify-center gap-4 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="flex items-center">
                <div 
                  className={`flex flex-col items-center cursor-pointer transition-all hover:scale-105 ${
                    activeStep === index ? 'scale-110' : ''
                  }`}
                  onMouseEnter={() => setActiveStep(index)}
                  onMouseLeave={() => setActiveStep(null)}
                >
                  <div className={`p-4 rounded-full ${step.bgColor} ${step.color} mb-2 transition-all ${
                    activeStep === index ? 'ring-4 ring-primary/20' : ''
                  }`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-bold ${step.color} mb-1`}>
                      Step {index + 1}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {step.title}
                    </div>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <ArrowRight className="w-6 h-6 text-muted-foreground mx-4" />
                )}
              </div>
            );
          })}
        </div>

        {/* Step cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isActive = activeStep === index;
            
            return (
              <Card 
                key={index}
                className={`p-6 border-2 transition-all hover:scale-105 cursor-pointer ${step.borderColor} ${
                  isActive ? `${step.bgColor} shadow-xl` : 'bg-card/50'
                }`}
                onMouseEnter={() => setActiveStep(index)}
                onMouseLeave={() => setActiveStep(null)}
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${step.bgColor} ${step.color} flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className={`text-xs font-bold ${step.color} mb-1`}>
                      Step {index + 1}
                    </div>
                    <h3 className="font-display text-xl font-bold mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
                
                <p className={`text-sm leading-relaxed transition-all ${
                  isActive ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.details}
                </p>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button 
            size="lg" 
            className="group gap-2 min-w-[200px]"
            onClick={() => {
              const buySection = document.getElementById('how-to-buy');
              buySection?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            <Zap className="w-5 h-5" />
            Buy TRN Now
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="gap-2 min-w-[200px]"
            onClick={() => {
              const realUtility = document.getElementById('real-utility');
              realUtility?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Learn More
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </section>
  );
};