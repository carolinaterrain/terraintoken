import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ClipboardList, 
  Hammer, 
  Eye, 
  FileCheck, 
  GraduationCap, 
  Coins,
  ArrowRight
} from "lucide-react";
import { cn } from "@/lib/utils";

interface FlywheelStep {
  id: string;
  step: number;
  title: string;
  icon: React.ReactNode;
  color: string;
  tool: string;
  description: string;
  outputs: string[];
}

const flywheelSteps: FlywheelStep[] = [
  {
    id: "plan",
    step: 1,
    title: "Plan",
    icon: <ClipboardList className="h-6 w-6" />,
    color: "from-blue-500 to-blue-600",
    tool: "Terrain Vision AI",
    description: "AI-powered site analysis and drainage design using geo-verified evidence",
    outputs: ["Site assessments", "Drainage plans", "Risk scores", "Scope packages"]
  },
  {
    id: "build",
    step: 2,
    title: "Build",
    icon: <Hammer className="h-6 w-6" />,
    color: "from-amber-500 to-amber-600",
    tool: "Carolina Terrain Field Ops",
    description: "Licensed contractor execution with GPS-tagged proof of work",
    outputs: ["Installed infrastructure", "As-built documentation", "GPS coordinates", "Photo evidence"]
  },
  {
    id: "monitor",
    step: 3,
    title: "Monitor",
    icon: <Eye className="h-6 w-6" />,
    color: "from-emerald-500 to-emerald-600",
    tool: "Stormwater SCM",
    description: "Continuous infrastructure monitoring with IoT sensors and inspections",
    outputs: ["Inspection logs", "Sensor data", "Alert notifications", "Performance metrics"]
  },
  {
    id: "comply",
    step: 4,
    title: "Comply",
    icon: <FileCheck className="h-6 w-6" />,
    color: "from-purple-500 to-purple-600",
    tool: "Audit Packet Generator",
    description: "Automated compliance documentation for regulatory requirements",
    outputs: ["Audit packets", "Compliance reports", "Regulatory filings", "Chain of custody"]
  },
  {
    id: "train",
    step: 5,
    title: "Train",
    icon: <GraduationCap className="h-6 w-6" />,
    color: "from-pink-500 to-pink-600",
    tool: "Drainage Academy",
    description: "Certification programs and knowledge transfer for industry professionals",
    outputs: ["Certifications", "Training records", "Best practices", "Standards updates"]
  },
  {
    id: "incentivize",
    step: 6,
    title: "Incentivize",
    icon: <Coins className="h-6 w-6" />,
    color: "from-safety-green to-emerald-500",
    tool: "$TRN Surge Pricing",
    description: "Optional token layer rewarding verified contributions to ecosystem quality",
    outputs: ["TRN rewards", "Bounty completions", "Reputation scores", "Revenue share"]
  }
];

export function DePINFlywheel() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const activeData = flywheelSteps.find(s => s.id === activeStep);

  return (
    <section className="py-24 bg-slate-950 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, hsl(142 76% 39%) 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="container relative z-10">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-4"
          >
            The <span className="text-safety-green">Terrain Flywheel</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-muted-foreground max-w-2xl mx-auto font-mono"
          >
            Ground Truth to Token Utility — A closed-loop lifecycle that transforms 
            physical infrastructure data into verifiable, tradeable assets.
          </motion.p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Flywheel visualization */}
          <div className="relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              {/* Center circle */}
              <div className="absolute inset-1/4 rounded-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-safety-green font-bold text-lg font-mono">TRN</div>
                  <div className="text-xs text-muted-foreground">Utility Layer</div>
                </div>
              </div>

              {/* Steps arranged in a circle */}
              {flywheelSteps.map((step, index) => {
                const angle = (index * 60 - 90) * (Math.PI / 180);
                const radius = 42; // percentage from center
                const x = 50 + radius * Math.cos(angle);
                const y = 50 + radius * Math.sin(angle);

                return (
                  <motion.button
                    key={step.id}
                    className={cn(
                      "absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-xl",
                      "flex items-center justify-center cursor-pointer",
                      "border-2 transition-all duration-300",
                      "bg-gradient-to-br",
                      step.color,
                      activeStep === step.id 
                        ? "scale-110 border-white shadow-lg shadow-white/20" 
                        : "border-transparent hover:scale-105"
                    )}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    onMouseEnter={() => setActiveStep(step.id)}
                    onMouseLeave={() => setActiveStep(null)}
                    onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="text-white">
                      {step.icon}
                    </div>
                    <span className="absolute -bottom-6 text-xs font-mono font-semibold whitespace-nowrap">
                      {step.title}
                    </span>
                  </motion.button>
                );
              })}

              {/* Connection arrows */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100">
                <defs>
                  <marker
                    id="arrowhead"
                    markerWidth="6"
                    markerHeight="6"
                    refX="3"
                    refY="3"
                    orient="auto"
                  >
                    <path d="M0,0 L0,6 L6,3 z" fill="hsl(142 76% 39% / 0.5)" />
                  </marker>
                </defs>
                <circle 
                  cx="50" 
                  cy="50" 
                  r="38" 
                  fill="none" 
                  stroke="hsl(142 76% 39% / 0.2)" 
                  strokeWidth="0.5"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>
          </div>

          {/* Detail panel */}
          <div className="min-h-[300px]">
            <AnimatePresence mode="wait">
              {activeData ? (
                <motion.div
                  key={activeData.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 backdrop-blur-sm"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br",
                      activeData.color
                    )}>
                      <div className="text-white">{activeData.icon}</div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">
                        Step {activeData.step}: {activeData.title}
                      </h3>
                      <p className="text-sm text-safety-green font-mono">{activeData.tool}</p>
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-6">{activeData.description}</p>

                  <div>
                    <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <ArrowRight className="h-4 w-4 text-safety-green" />
                      Outputs
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {activeData.outputs.map((output) => (
                        <div 
                          key={output}
                          className="bg-slate-800/50 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono"
                        >
                          {output}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-slate-900/30 border border-slate-800/50 border-dashed rounded-xl p-8 text-center"
                >
                  <p className="text-muted-foreground font-mono">
                    Hover over a step to explore the flywheel lifecycle
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DePINFlywheel;
