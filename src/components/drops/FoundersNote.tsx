import { motion } from "framer-motion";
import { MessageSquare } from "lucide-react";

export function FoundersNote() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="max-w-2xl mx-auto"
    >
      <div className="relative bg-gradient-to-br from-card via-card to-primary/5 border border-primary/30 rounded-2xl p-8 md:p-10">
        {/* Quote icon */}
        <div className="absolute -top-4 left-8">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <MessageSquare className="w-4 h-4 text-primary-foreground" />
          </div>
        </div>
        
        <div className="space-y-4 text-muted-foreground leading-relaxed">
          <p className="text-lg">
            "I built this drop overnight immediately after the community chose our winning logo. 
            It felt important to give everyone a way to own a piece of TRN history — something real, 
            limited, and collectible.
          </p>
          <p className="text-lg">
            This is Drop #0. Once these 50 items are gone, they're gone forever.
          </p>
          <p className="text-lg">
            Thank you for helping build Terrain Token."
          </p>
        </div>
        
        <div className="mt-6 pt-6 border-t border-primary/20">
          <p className="font-bold text-foreground">— Alex</p>
          <p className="text-sm text-primary">Founder, Terrain Token</p>
        </div>
      </div>
    </motion.div>
  );
}
