import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { ArrowRight, Upload, Coins, Lock, Zap, DollarSign, TrendingDown, Vote } from "lucide-react";

export const ValueGeneration = () => {
  const flywheelSteps = [
    { 
      icon: Upload, 
      title: "Contribute Data", 
      description: "Users upload yard photos, site data, and drainage info",
      color: "hsl(var(--chart-1))"
    },
    { 
      icon: Coins, 
      title: "Earn TRN", 
      description: "Receive TRN rewards for quality data contributions",
      color: "hsl(var(--chart-2))"
    },
    { 
      icon: Lock, 
      title: "Stake Tokens", 
      description: "Lock TRN to unlock discounts and premium features",
      color: "hsl(var(--chart-3))"
    },
    { 
      icon: Zap, 
      title: "Access Services", 
      description: "Use TRN to pay for analyses, tools, and marketplace items",
      color: "hsl(var(--chart-4))"
    },
    { 
      icon: DollarSign, 
      title: "Generate Revenue", 
      description: "Platform earns from subscriptions, fees, and marketplace",
      color: "hsl(var(--chart-5))"
    },
    { 
      icon: TrendingDown, 
      title: "Buyback & Burn", 
      description: "Revenue funds strategic buybacks to reduce supply",
      color: "hsl(var(--primary))"
    }
  ];

  const demandDrivers = [
    {
      icon: DollarSign,
      title: "Payment Currency",
      description: "TRN required for premium analyses, marketplace purchases, and advanced features",
      examples: ["Pay-per-use analyses", "Data marketplace transactions", "Enterprise API calls"]
    },
    {
      icon: Lock,
      title: "Staking for Discounts",
      description: "Lock TRN to unlock 10% subscription discounts and bonus API credits",
      examples: ["Subscriber tier benefits", "Priority data access", "Early feature access"]
    },
    {
      icon: Zap,
      title: "Access Privileges",
      description: "Token-gated features and community perks for holders",
      examples: ["Beta tool access", "Exclusive webinars", "Priority support"]
    },
    {
      icon: Vote,
      title: "Governance Rights",
      description: "Vote on platform features, AI training priorities, and ecosystem direction",
      examples: ["Feature proposals", "Marketplace policies", "Revenue allocation"]
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-secondary/5">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Token Value Generation Engine
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            TRN derives value from <span className="font-bold text-primary">adoption, not speculation</span>. 
            A flywheel of utility, rewards, and sustainable tokenomics.
          </p>
        </motion.div>

        {/* Value Flywheel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8">The TRN Utility Flywheel</h3>
          <div className="relative">
            {/* Desktop circular layout */}
            <div className="hidden lg:block">
              <div className="relative w-full mx-auto px-8 py-12" style={{ minHeight: '800px' }}>
                {/* SVG for connecting arrows */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 800 800" preserveAspectRatio="xMidYMid meet" style={{ zIndex: 0 }}>
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="10"
                      refX="9"
                      refY="3"
                      orient="auto"
                      className="fill-primary/40"
                    >
                      <polygon points="0 0, 10 3, 0 6" />
                    </marker>
                  </defs>
                  {flywheelSteps.map((_, index) => {
                    const angle1 = (index / flywheelSteps.length) * 2 * Math.PI - Math.PI / 2;
                    const angle2 = ((index + 1) / flywheelSteps.length) * 2 * Math.PI - Math.PI / 2;
                    const radius = 300;
                    const centerX = 400;
                    const centerY = 400;
                    
                    const x1 = centerX + radius * Math.cos(angle1);
                    const y1 = centerY + radius * Math.sin(angle1);
                    const x2 = centerX + radius * Math.cos(angle2);
                    const y2 = centerY + radius * Math.sin(angle2);
                    
                    // Calculate control point for curved arrow
                    const midAngle = (angle1 + angle2) / 2;
                    const controlRadius = radius + 60;
                    const cx = centerX + controlRadius * Math.cos(midAngle);
                    const cy = centerY + controlRadius * Math.sin(midAngle);
                    
                    return (
                      <path
                        key={index}
                        d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`}
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        fill="none"
                        strokeOpacity="0.3"
                        markerEnd="url(#arrowhead)"
                        className="animate-pulse"
                        style={{ animationDelay: `${index * 0.3}s`, animationDuration: '3s' }}
                      />
                    );
                  })}
                </svg>

                <div className="relative w-full h-full" style={{ aspectRatio: '1/1', maxWidth: '800px', margin: '0 auto' }}>
                  {flywheelSteps.map((step, index) => {
                    const Icon = step.icon;
                    const angle = (index / flywheelSteps.length) * 2 * Math.PI - Math.PI / 2;
                    const radius = 37.5; // percentage of container
                    const x = 50 + radius * Math.cos(angle);
                    const y = 50 + radius * Math.sin(angle);
                    
                    return (
                      <motion.div
                        key={step.title}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.15 }}
                        className="absolute"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                          zIndex: 10
                        }}
                      >
                        <GlassCard className="p-5 w-40 text-center hover:scale-105 hover:shadow-glow transition-all duration-300 group">
                          {/* Step number badge */}
                          <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shadow-lg z-10">
                            {index + 1}
                          </div>
                          
                          <div 
                            className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform"
                            style={{ backgroundColor: step.color + '20' }}
                          >
                            <Icon className="w-6 h-6" style={{ color: step.color }} />
                          </div>
                          <h4 className="font-bold text-sm mb-2">{step.title}</h4>
                          <p className="text-xs text-muted-foreground leading-tight">{step.description}</p>
                        </GlassCard>
                      </motion.div>
                    );
                  })}
                  
                  {/* Center message */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <GlassCard className="p-6 bg-gradient-to-br from-primary/20 to-chart-2/20 text-center shadow-glow w-40">
                      <div className="text-3xl font-bold mb-2">♻️</div>
                      <div className="font-bold text-base text-primary">Self-Sustaining</div>
                      <div className="text-xs text-muted-foreground">Value Loop</div>
                    </GlassCard>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile linear layout */}
            <div className="lg:hidden grid grid-cols-1 gap-4">
              {flywheelSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <GlassCard className="p-6">
                      <div className="flex items-center gap-4">
                        <div 
                          className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: step.color + '20' }}
                        >
                          <Icon className="w-6 h-6" style={{ color: step.color }} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold mb-1">{step.title}</h4>
                          <p className="text-sm text-muted-foreground">{step.description}</p>
                        </div>
                        {index < flywheelSteps.length - 1 && (
                          <ArrowRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                        )}
                      </div>
                    </GlassCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Demand Drivers */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <h3 className="text-3xl font-bold text-center mb-8">Four Demand Drivers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {demandDrivers.map((driver, index) => {
              const Icon = driver.icon;
              return (
                <motion.div
                  key={driver.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <GlassCard className="p-6 h-full">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2">{driver.title}</h4>
                        <p className="text-sm text-muted-foreground mb-4">{driver.description}</p>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <div className="text-xs font-semibold text-muted-foreground mb-2">EXAMPLES:</div>
                      <ul className="space-y-1">
                        {driver.examples.map((example, i) => (
                          <li key={i} className="text-sm flex items-start">
                            <span className="text-chart-3 mr-2">✓</span>
                            <span>{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Burn-and-Mint Mechanism */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 bg-gradient-to-br from-primary/10 to-chart-2/10">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🔥</div>
              <h3 className="text-2xl font-bold mb-4">Burn-and-Mint Economics</h3>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Inspired by Helium's model: tokens are <span className="font-semibold text-primary">committed to burn when accessing services</span> and 
                <span className="font-semibold text-chart-2"> minted only to reward contributions</span>.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="text-center">
                <TrendingDown className="w-10 h-10 text-chart-1 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Burn = Use</h4>
                <p className="text-sm text-muted-foreground">
                  Every AI analysis, marketplace purchase, and premium feature allocates TRN for burn
                </p>
              </div>
              <div className="text-center">
                <Coins className="w-10 h-10 text-chart-2 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Mint = Earn</h4>
                <p className="text-sm text-muted-foreground">
                  New TRN only minted to reward data uploads, tool usage proofs, and community contributions
                </p>
              </div>
              <div className="text-center">
                <DollarSign className="w-10 h-10 text-chart-3 mx-auto mb-3" />
                <h4 className="font-semibold mb-2">Buyback = Support</h4>
                <p className="text-sm text-muted-foreground">
                  10% of revenue allocated to strategic buybacks and burns to reduce supply
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <GlassCard className="p-6 inline-block bg-muted/30">
                <p className="text-sm font-semibold text-primary">
                  🎯 Result: Token value grows with platform adoption, not speculation
                </p>
              </GlassCard>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};