import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, Award, TrendingUp, Truck, ExternalLink, CheckCircle, Users } from "lucide-react";
import { motion } from "framer-motion";

export const BusinessCredentials = () => {
  const credentials = [
    {
      icon: Award,
      title: "NC Licensed Contractor",
      value: "License #CL.1872",
      description: "Fully bonded & insured since 2019",
      link: "https://www.nclbgc.org",
      linkText: "Verify License",
      color: "text-chart-2",
    },
    {
      icon: TrendingUp,
      title: "Established Revenue",
      value: "$2M+",
      description: "Annual revenue from terrain services",
      color: "text-chart-3",
    },
    {
      icon: Truck,
      title: "Real Equipment",
      value: "$500K+",
      description: "Cataloged heavy equipment assets",
      link: "/transparency",
      linkText: "View Equipment",
      color: "text-chart-4",
    },
    {
      icon: Users,
      title: "Doxxed Founders",
      value: "100% Verified",
      description: "Public identities, NC-based team",
      link: "/team",
      linkText: "Meet the Team",
      color: "text-primary",
    },
  ];

  const differentiators = [
    "Real business backing — not just a whitepaper",
    "Fair launch on Pump.fun — no VC, no presale, no insider allocation",
    "Liquidity locked — community protection first",
    "TerrainVision AI LIVE — earning real usage today",
    "Verifiable on-chain and off-chain credentials",
  ];

  return (
    <section id="business-credentials" className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Shield className="w-4 h-4 mr-2" />
            Backed by Real Operations
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Not Just Another Token
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            TRN is backed by Carolina Terrain LLC — a licensed North Carolina drainage contractor 
            with real revenue, real equipment, and real customers.
          </p>
        </motion.div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {credentials.map((cred, index) => {
            const Icon = cred.icon;
            return (
              <motion.div
                key={cred.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full text-center hover:scale-105 transition-transform">
                  <div className={`w-14 h-14 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4`}>
                    <Icon className={`w-7 h-7 ${cred.color}`} />
                  </div>
                  <div className={`text-2xl md:text-3xl font-bold ${cred.color} mb-1`}>
                    {cred.value}
                  </div>
                  <h3 className="font-semibold mb-1">{cred.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{cred.description}</p>
                  {cred.link && (
                    <a
                      href={cred.link}
                      target={cred.link.startsWith('http') ? "_blank" : undefined}
                      rel={cred.link.startsWith('http') ? "noopener noreferrer" : undefined}
                      className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                    >
                      {cred.linkText}
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Why We're Different */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <GlassCard className="p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Why TRN is Different</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {differentiators.map((item, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-muted-foreground">{item}</span>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button asChild>
                <a href="/whitepaper" className="inline-flex items-center gap-2">
                  Read the Whitepaper
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
