import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Plane, Lock, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ADMIN_WALLET } from "@/lib/airdropConstants";

export function AdminAirdropButton() {
  const { publicKey, connected } = useWallet();
  const [isHovered, setIsHovered] = useState(false);
  
  const isAdmin = connected && publicKey?.toBase58() === ADMIN_WALLET;

  // Don't render anything if not admin
  if (!isAdmin) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                asChild
                variant="outline"
                size="lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="relative overflow-hidden border-amber-500/50 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 hover:border-amber-500 transition-all duration-300"
              >
                <Link to="/admin/airdrop" className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-amber-500" />
                  <span className="font-semibold text-amber-500">Admin</span>
                  <Badge variant="outline" className="ml-1 border-amber-500/50 text-amber-500 text-xs">
                    <Plane className="w-3 h-3 mr-1" />
                    Airdrop
                  </Badge>
                  <motion.div
                    animate={{ x: isHovered ? 5 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="w-4 h-4 text-amber-500" />
                  </motion.div>
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="bg-amber-950 border-amber-500/30">
              <div className="flex items-center gap-2">
                <Lock className="w-3 h-3 text-amber-500" />
                <span className="text-xs">Admin-only: Token distribution dashboard</span>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </motion.div>
    </AnimatePresence>
  );
}
