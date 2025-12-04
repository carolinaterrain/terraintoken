import { motion } from "framer-motion";
import { Zap, Users, Star, Shield } from "lucide-react";

const benefits = [
  {
    icon: Zap,
    title: "Early Access",
    description: "First dibs on future collector drops",
  },
  {
    icon: Users,
    title: "Collector Discord Role",
    description: "Exclusive access to collector channels",
  },
  {
    icon: Star,
    title: "Ground Crew Recognition",
    description: "Special status in the TRN community",
  },
  {
    icon: Shield,
    title: "On-Chain Authenticity",
    description: "Verifiable proof of ownership forever",
  },
];

export function CollectorBenefits() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {benefits.map((benefit, index) => {
        const Icon = benefit.icon;
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="bg-card/30 border border-primary/20 rounded-xl p-5 text-center hover:border-primary/40 hover:bg-card/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-3 group-hover:bg-primary/30 transition-colors">
              <Icon className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-1">{benefit.title}</h4>
            <p className="text-sm text-muted-foreground">{benefit.description}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
