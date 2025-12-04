import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const quotes = [
  {
    text: "This is insane. I've never seen a drop like this in Solana.",
    author: "@SolanaCollector",
  },
  {
    text: "Drop #0 is a must-own if you're early to TRN.",
    author: "@GroundCrewOG",
  },
  {
    text: "The 1/1 NFT certificates make this feel truly collectible.",
    author: "@NFTenthusiast",
  },
];

export function SocialProofQuotes() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {quotes.map((quote, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 }}
          className="relative bg-card/50 border border-primary/20 rounded-xl p-6 hover:border-primary/40 transition-colors"
        >
          <Quote className="w-6 h-6 text-primary/40 absolute top-4 right-4" />
          <p className="text-foreground font-medium mb-4 italic">"{quote.text}"</p>
          <p className="text-sm text-primary font-semibold">{quote.author}</p>
        </motion.div>
      ))}
    </div>
  );
}
