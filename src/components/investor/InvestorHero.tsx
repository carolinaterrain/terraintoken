import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Cpu, Leaf } from "lucide-react";
import { motion } from "framer-motion";

export const InvestorHero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden py-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
      
      <div className="container relative z-10 mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-5xl mx-auto space-y-8"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge variant="secondary" className="mb-4 text-sm px-4 py-2">
              <Database className="w-4 h-4 mr-2" />
              First Ground-Truth Oracle for the Physical World
            </Badge>
          </motion.div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent leading-tight">
            The Data–Compute–Energy Nexus of Web3
          </h1>

          {/* Subline */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            TRN powers terrain intelligence at the convergence of <span className="text-primary font-semibold">real-world data</span>, <span className="text-chart-2 font-semibold">distributed compute</span>, and <span className="text-chart-3 font-semibold">clean energy infrastructure</span> — the physical stack that makes AI useful.
          </p>

          {/* Category Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 justify-center"
          >
            <Badge variant="outline" className="text-sm px-3 py-1 border-chart-1/50 text-chart-1">
              <Database className="w-3 h-3 mr-1" />
              DePIN
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1 border-chart-3/50 text-chart-3">
              <Leaf className="w-3 h-3 mr-1" />
              ReFi
            </Badge>
            <Badge variant="outline" className="text-sm px-3 py-1 border-chart-2/50 text-chart-2">
              <Cpu className="w-3 h-3 mr-1" />
              DeSci
            </Badge>
          </motion.div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => scrollToSection('protocol-comparison')}
            >
              See Protocol Positioning
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => scrollToSection('value-generation')}
            >
              View Value Engine
            </Button>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8"
              onClick={() => scrollToSection('investor-form')}
            >
              Request Investor Brief
            </Button>
          </div>

        </motion.div>
      </div>
    </section>
  );
};
