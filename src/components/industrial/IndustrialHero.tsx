import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, FileText, Hexagon, Database, Shield } from "lucide-react";
import { Link } from "react-router-dom";

export function IndustrialHero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950">
      {/* Animated grid background */}
      <div className="absolute inset-0 opacity-20">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `
              linear-gradient(to right, hsl(142 76% 39% / 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, hsl(142 76% 39% / 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Animated hex overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/50 to-slate-950" />
      </div>

      {/* Floating hexagons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute opacity-10"
            initial={{ 
              x: `${20 + i * 15}%`, 
              y: `${10 + i * 12}%`,
              rotate: 0 
            }}
            animate={{ 
              y: [`${10 + i * 12}%`, `${15 + i * 12}%`, `${10 + i * 12}%`],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              duration: 6 + i, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Hexagon 
              className="text-safety-green" 
              size={60 + i * 20} 
              strokeWidth={1}
            />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="container relative z-10 px-4 py-20 md:py-32">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge 
              variant="outline" 
              className="px-4 py-2 text-sm font-mono border-safety-green/30 text-safety-green bg-safety-green/5"
            >
              <span className="mr-2 inline-block w-2 h-2 bg-safety-green rounded-full animate-pulse" />
              Industrial DePIN • Live on Solana
            </Badge>
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight"
          >
            <span className="text-foreground">The First </span>
            <span className="text-safety-green">3D Spatial Economy</span>
            <br />
            <span className="text-foreground">for Earth's Critical Assets</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-mono"
          >
            Bridging Carolina Terrain's physical operations with $TRN utility. 
            We map, build, and verify the infrastructure the world can't afford to ignore.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
          >
            <Link to="/ecosystem">
              <Button 
                size="lg" 
                className="bg-safety-green hover:bg-safety-green/90 text-slate-950 font-semibold gap-2 px-8"
              >
                <Globe className="h-5 w-5" />
                View Global Bounties
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/whitepaper">
              <Button 
                size="lg" 
                variant="outline" 
                className="border-solana-purple/50 text-solana-purple hover:bg-solana-purple/10 font-semibold gap-2"
              >
                <FileText className="h-5 w-5" />
                Read the 2026 Whitepaper
              </Button>
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto"
          >
            <StatCard 
              icon={<Hexagon className="h-5 w-5 text-safety-green" />}
              value="52,402"
              label="H3 Hexes Mapped"
            />
            <StatCard 
              icon={<Database className="h-5 w-5 text-solana-purple" />}
              value="1.2TB"
              label="Point Cloud Data"
            />
            <StatCard 
              icon={<Shield className="h-5 w-5 text-safety-green" />}
              value="4.2M"
              label="$TRN Burned"
            />
            <StatCard 
              icon={<Globe className="h-5 w-5 text-solana-purple" />}
              value="127"
              label="Active Surveyors"
            />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}

function StatCard({ 
  icon, 
  value, 
  label 
}: { 
  icon: React.ReactNode; 
  value: string; 
  label: string;
}) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-2xl font-bold font-mono text-foreground">{value}</span>
      </div>
      <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
    </div>
  );
}

export default IndustrialHero;
