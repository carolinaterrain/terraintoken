import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

export function EarlyStageDisclaimer() {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mx-4 mt-4 md:mx-auto md:max-w-4xl"
    >
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-amber-500 mb-1">Early-Stage Deployment Notice</p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            TRN is in early-stage deployment. Metrics shown reflect deployed infrastructure capabilities. 
            Active usage metrics (staking, marketplace transactions, etc.) will grow as the ecosystem matures and user adoption increases. 
            All data shown is live and accurate — we do not display fabricated numbers.
          </p>
        </div>
      </div>
    </motion.div>
  );
}
