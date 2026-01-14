import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  MapPin, 
  Lock, 
  Eye, 
  Shield,
  Layers,
  ArrowDown,
  Check
} from "lucide-react";
import proofPrinciples from "@/content/proofPrinciples.json";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  Lock,
  Eye,
  Shield
};

interface EvidenceChainDiagramProps {
  className?: string;
}

export function EvidenceChainDiagram({ className }: EvidenceChainDiagramProps) {
  const { evidenceChain } = proofPrinciples;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">{evidenceChain.title}</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">{evidenceChain.description}</p>
      </div>

      <div className="relative max-w-3xl mx-auto">
        {evidenceChain.layers.map((layer, index) => (
          <motion.div
            key={layer.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className={cn(
              "border rounded-lg p-6 bg-card",
              index > 0 && "mt-4"
            )}>
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-primary/10 flex-shrink-0">
                  <Layers className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="font-semibold">{layer.name}</h4>
                  <p className="text-sm text-muted-foreground">{layer.description}</p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    {layer.examples.map((example, i) => (
                      <Tooltip key={i}>
                        <TooltipTrigger asChild>
                          <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground cursor-help">
                            {example}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="max-w-xs text-sm">Example of data at this layer</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {index < evidenceChain.layers.length - 1 && (
              <div className="flex justify-center py-2">
                <ArrowDown className="h-5 w-5 text-muted-foreground" />
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

interface AuditPacketPreviewProps {
  className?: string;
}

export function AuditPacketPreview({ className }: AuditPacketPreviewProps) {
  const { auditPacket } = proofPrinciples;

  return (
    <div className={cn("space-y-6", className)}>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold">{auditPacket.title}</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">{auditPacket.description}</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-xl mx-auto"
      >
        <div className="bg-card border rounded-xl overflow-hidden shadow-lg">
          {/* Fake document header */}
          <div className="bg-muted/50 border-b px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="h-3 w-3 rounded-full bg-yellow-500" />
              <div className="h-3 w-3 rounded-full bg-green-500" />
            </div>
            <span className="text-xs font-mono text-muted-foreground">audit-packet-2025-01.pdf</span>
          </div>

          {/* Document contents preview */}
          <div className="p-6 space-y-4">
            {auditPacket.contents.map((item, index) => (
              <motion.div
                key={item.item}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-sm">{item.item}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Verification badge */}
          <div className="bg-primary/5 border-t px-6 py-4">
            <div className="flex items-center gap-2 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Cryptographically verifiable</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

interface ProofPrinciplesGridProps {
  className?: string;
}

export function ProofPrinciplesGrid({ className }: ProofPrinciplesGridProps) {
  const { principles } = proofPrinciples;

  return (
    <div className={cn("grid md:grid-cols-2 gap-6", className)}>
      {principles.map((principle, index) => {
        const Icon = iconMap[principle.icon] || Shield;
        
        return (
          <motion.div
            key={principle.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="bg-card border rounded-xl p-6 space-y-4 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <div className="space-y-1">
                <h3 className="font-semibold text-lg">{principle.title}</h3>
                <p className="text-sm text-muted-foreground">{principle.description}</p>
              </div>
            </div>

            <ul className="grid grid-cols-2 gap-2">
              {principle.details.map((detail, i) => (
                <li key={i} className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Check className="h-3 w-3 text-primary" />
                  {detail}
                </li>
              ))}
            </ul>

            <div className="p-3 rounded-lg bg-muted/30 text-xs text-muted-foreground italic">
              "{principle.example}"
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
