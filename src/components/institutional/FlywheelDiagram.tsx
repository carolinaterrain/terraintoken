import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import * as LucideIcons from "lucide-react";
import flywheelSteps from "@/content/flywheelSteps.json";
import { OptionalBadge } from "./StatusBadge";
import { ArrowRight, FileText, CheckCircle } from "lucide-react";

interface FlywheelDiagramProps {
  activeStep?: string | null;
  onStepClick?: (stepId: string) => void;
  className?: string;
  compact?: boolean;
}

export function FlywheelDiagram({ activeStep, onStepClick, className, compact = false }: FlywheelDiagramProps) {
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);

  const getIcon = (iconName: string) => {
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[iconName] || LucideIcons.Circle;
  };

  const radius = compact ? 100 : 140;
  const centerX = compact ? 150 : 200;
  const centerY = compact ? 150 : 200;

  return (
    <div className={cn("relative", className)}>
      <svg 
        viewBox={compact ? "0 0 300 300" : "0 0 400 400"} 
        className="w-full max-w-md mx-auto"
      >
        {/* Outer ring */}
        <circle
          cx={centerX}
          cy={centerY}
          r={radius + 20}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth="1"
          strokeDasharray="4 4"
        />
        
        {/* Connection arrows */}
        {flywheelSteps.map((_, index) => {
          const angle = (index * 60 - 90) * (Math.PI / 180);
          const nextAngle = ((index + 1) * 60 - 90) * (Math.PI / 180);
          const midAngle = (angle + nextAngle) / 2;
          
          const arrowX = centerX + (radius + 30) * Math.cos(midAngle);
          const arrowY = centerY + (radius + 30) * Math.sin(midAngle);
          const arrowRotation = (index * 60 + 30);
          
          return (
            <g key={`arrow-${index}`} transform={`translate(${arrowX}, ${arrowY}) rotate(${arrowRotation})`}>
              <path
                d="M-4,0 L4,0 L0,-6 Z"
                fill="hsl(var(--muted-foreground))"
                opacity={0.4}
              />
            </g>
          );
        })}

        {/* Step nodes */}
        {flywheelSteps.map((step, index) => {
          const angle = (index * 60 - 90) * (Math.PI / 180);
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const isActive = activeStep === step.id;
          const isHovered = hoveredStep === step.id;
          const Icon = getIcon(step.icon);
          const nodeSize = compact ? 28 : 36;

          return (
            <g
              key={step.id}
              onClick={() => onStepClick?.(step.id)}
              onMouseEnter={() => setHoveredStep(step.id)}
              onMouseLeave={() => setHoveredStep(null)}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              aria-label={`${step.title} - ${step.purpose}`}
            >
              <motion.circle
                cx={x}
                cy={y}
                r={nodeSize}
                fill={isActive || isHovered ? "hsl(var(--primary))" : "hsl(var(--card))"}
                stroke={isActive ? "hsl(var(--primary))" : "hsl(var(--border))"}
                strokeWidth={isActive ? 3 : 2}
                initial={false}
                animate={{
                  scale: isActive || isHovered ? 1.1 : 1,
                }}
                transition={{ duration: 0.2 }}
              />
              <foreignObject
                x={x - nodeSize / 2}
                y={y - nodeSize / 2}
                width={nodeSize}
                height={nodeSize}
                className="pointer-events-none"
              >
                <div className="w-full h-full flex items-center justify-center">
                  <Icon className={cn(
                    compact ? "h-4 w-4" : "h-5 w-5",
                    isActive || isHovered ? "text-primary-foreground" : "text-foreground"
                  )} />
                </div>
              </foreignObject>
              
              {/* Step label */}
              <text
                x={x}
                y={y + nodeSize + 16}
                textAnchor="middle"
                className={cn(
                  "fill-current font-medium",
                  compact ? "text-[10px]" : "text-xs",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {step.title}
              </text>
              
              {/* Optional indicator */}
              {step.optional && (
                <circle
                  cx={x + nodeSize - 4}
                  cy={y - nodeSize + 4}
                  r={6}
                  fill="hsl(var(--chart-4))"
                />
              )}
            </g>
          );
        })}

        {/* Center text */}
        <text
          x={centerX}
          y={centerY - 8}
          textAnchor="middle"
          className="fill-current text-lg font-bold text-foreground"
        >
          Terrain
        </text>
        <text
          x={centerX}
          y={centerY + 12}
          textAnchor="middle"
          className="fill-current text-xs text-muted-foreground"
        >
          Flywheel
        </text>
      </svg>
    </div>
  );
}

interface FlywheelStepCardProps {
  stepId: string;
  className?: string;
}

export function FlywheelStepCard({ stepId, className }: FlywheelStepCardProps) {
  const step = flywheelSteps.find(s => s.id === stepId);
  
  if (!step) return null;

  const getIcon = (iconName: string) => {
    const icons = LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>;
    return icons[iconName] || LucideIcons.Circle;
  };

  const Icon = getIcon(step.icon);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn("bg-card border rounded-xl p-6 space-y-6", className)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-lg bg-primary/10">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Step {step.step}</span>
              {step.optional && <OptionalBadge />}
            </div>
            <h3 className="text-2xl font-bold">{step.title}</h3>
          </div>
        </div>
      </div>

      <p className="text-muted-foreground">{step.purpose}</p>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <ArrowRight className="h-4 w-4 text-primary" />
            Inputs
          </h4>
          <ul className="space-y-2">
            {step.inputs.map((input, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {input}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-primary" />
            Outputs
          </h4>
          <ul className="space-y-2">
            {step.outputs.map((output, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {output}
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-semibold flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            Evidence
          </h4>
          <ul className="space-y-2">
            {step.evidence.map((item, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </motion.div>
  );
}

interface FlywheelInteractiveProps {
  className?: string;
}

export function FlywheelInteractive({ className }: FlywheelInteractiveProps) {
  const [activeStep, setActiveStep] = useState<string>("plan");

  return (
    <div className={cn("grid lg:grid-cols-2 gap-8 items-start", className)}>
      <div className="lg:sticky lg:top-24">
        <FlywheelDiagram
          activeStep={activeStep}
          onStepClick={setActiveStep}
        />
        <p className="text-center text-sm text-muted-foreground mt-4">
          Click any step to explore details
        </p>
      </div>
      
      <AnimatePresence mode="wait">
        <FlywheelStepCard key={activeStep} stepId={activeStep} />
      </AnimatePresence>
    </div>
  );
}
