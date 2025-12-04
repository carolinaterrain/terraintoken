import { motion } from "framer-motion";
import { Award, Shield, Sparkles } from "lucide-react";

export function SerialPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative max-w-sm mx-auto"
    >
      {/* Holographic glow effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-terrain-purple/30 to-primary/30 blur-xl opacity-50 animate-pulse" />
      
      {/* Certificate Card */}
      <div className="relative bg-gradient-to-br from-card via-card to-primary/5 border-2 border-primary/40 rounded-2xl p-6 overflow-hidden">
        {/* Shimmer overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent animate-shimmer"
          style={{ backgroundSize: '200% 100%' }}
        />
        
        {/* Corner decorations */}
        <div className="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-primary/50 rounded-tl-lg" />
        <div className="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-primary/50 rounded-tr-lg" />
        <div className="absolute bottom-2 left-2 w-8 h-8 border-l-2 border-b-2 border-primary/50 rounded-bl-lg" />
        <div className="absolute bottom-2 right-2 w-8 h-8 border-r-2 border-b-2 border-primary/50 rounded-br-lg" />
        
        {/* Content */}
        <div className="relative z-10 text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/40">
              <Award className="w-8 h-8 text-primary" />
            </div>
          </div>
          
          <div>
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Certificate of Authenticity</p>
            <h3 className="text-2xl font-bold text-foreground">TRN Collector Edition</h3>
          </div>
          
          {/* Serial Number Display */}
          <div className="py-4">
            <motion.div
              animate={{ 
                textShadow: [
                  "0 0 20px hsl(142 76% 39% / 0.5)",
                  "0 0 40px hsl(142 84% 47% / 0.8)",
                  "0 0 20px hsl(142 76% 39% / 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-5xl font-bold text-primary font-display"
            >
              #07 / 50
            </motion.div>
            <p className="text-xs text-muted-foreground mt-2">Your Serial Number Awaits</p>
          </div>
          
          <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Shield className="w-3 h-3 text-primary" />
              <span>Verified On-Chain</span>
            </div>
            <div className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-primary" />
              <span>Solana NFT</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
