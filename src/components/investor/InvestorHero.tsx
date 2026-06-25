import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Award, TrendingUp, Truck } from "lucide-react";
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
              <Shield className="w-4 h-4 mr-2" />
              Utility Token Tied to Real Operations
            </Badge>
          </motion.div>

          {/* Headline - More concrete */}
          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">Real Contractors.</span>
            <br />
            <span className="text-foreground">Real Work. Real Token.</span>
          </h1>

          {/* Subline - Business-focused */}
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            $TRN is the incentive layer of an ecosystem tied to <span className="text-primary font-semibold">Carolina Terrain LLC</span> — a licensed North Carolina drainage contractor. $TRN is a utility/incentive token — not an investment, not a security, no promised return.
          </p>

          {/* Key Stats Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Badge variant="outline" className="text-sm px-4 py-2 border-chart-2/50">
              <Award className="w-4 h-4 mr-2 text-chart-2" />
              NC License #CL.1872
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2 border-chart-3/50">
              <TrendingUp className="w-4 h-4 mr-2 text-chart-3" />
              $2M+ Annual Revenue
            </Badge>
            <Badge variant="outline" className="text-sm px-4 py-2 border-chart-4/50">
              <Truck className="w-4 h-4 mr-2 text-chart-4" />
              $500K+ Equipment
            </Badge>
          </motion.div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center pt-6">
            <Button 
              size="lg" 
              className="text-lg px-8"
              onClick={() => scrollToSection('business-credentials')}
            >
              Verify Our Credentials
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-lg px-8"
              onClick={() => scrollToSection('ecosystem-metrics')}
            >
              View Live Metrics
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
