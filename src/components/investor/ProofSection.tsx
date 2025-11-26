import { GlassCard } from "@/components/ui/glass-card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle, ExternalLink, FileCheck, Award, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

import CountUp from "react-countup";

export const ProofSection = () => {
  const equipmentValue = 397000; // Total verified equipment value

  // Get days since launch (assuming Jan 1, 2024)
  const launchDate = new Date("2024-01-01");
  const daysSinceLaunch = Math.floor((Date.now() - launchDate.getTime()) / (1000 * 60 * 60 * 24));

  // Get blog post count
  const { data: blogCount } = useQuery({
    queryKey: ['blog-count'],
    queryFn: async () => {
      // In a real scenario, this would query a blog_posts table
      return 4; // Current number of blog posts
    },
  });

  const credentials = [
    {
      icon: Shield,
      title: "Smart Contract Verified",
      description: "Audited and verified on Solscan",
      link: "https://solscan.io/token/TRNgHXTCb52EtFN3cKXXSDdFLgVEj2XmXqJFoYhR5Hn",
      color: "text-chart-1"
    },
    {
      icon: Award,
      title: "NC Licensed Contractor",
      description: "License #CL.1872 - Fully bonded & insured",
      link: "https://www.nclbgc.org",
      color: "text-chart-2"
    },
    {
      icon: CheckCircle,
      title: "NDS Certified",
      description: "Certified drainage system installation",
      link: "#",
      color: "text-chart-3"
    },
    {
      icon: FileCheck,
      title: "Transparent Reporting",
      description: `${blogCount || 4} detailed transparency reports published`,
      link: "/blog",
      color: "text-chart-4"
    }
  ];

  const trustMetrics = [
    {
      label: "Days Operating",
      value: daysSinceLaunch,
      icon: TrendingUp,
      color: "text-chart-1"
    },
    {
      label: "Equipment Verified",
      value: equipmentValue,
      prefix: "$",
      icon: Shield,
      color: "text-chart-2"
    },
    {
      label: "Transparency Reports",
      value: blogCount || 4,
      icon: FileCheck,
      color: "text-chart-3"
    },
    {
      label: "Active Tools",
      value: 8,
      icon: Award,
      color: "text-chart-4"
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Verified Credentials & Trust
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real licenses. Real equipment. Real transparency. Everything about TRN is verifiable on-chain and off.
          </p>
        </motion.div>

        {/* Credentials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {credentials.map((credential, index) => {
            const Icon = credential.icon;
            return (
              <motion.div
                key={credential.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard className="p-6 h-full hover:scale-105 transition-transform group">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <Icon className={`w-8 h-8 ${credential.color}`} />
                      {credential.link !== "#" && (
                        <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{credential.title}</h3>
                      <p className="text-sm text-muted-foreground">{credential.description}</p>
                    </div>
                    {credential.link !== "#" && (
                      <a
                        href={credential.link}
                        target={credential.link.startsWith('http') ? "_blank" : undefined}
                        rel={credential.link.startsWith('http') ? "noopener noreferrer" : undefined}
                        className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                      >
                        Verify
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-center mb-8">Live Trust Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {trustMetrics.map((metric, index) => {
              const Icon = metric.icon;
              return (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <GlassCard className="p-6 text-center">
                    <Icon className={`w-6 h-6 ${metric.color} mx-auto mb-3`} />
                    <div className={`text-3xl font-bold ${metric.color} mb-2`}>
                      {metric.prefix}
                      <CountUp
                        end={metric.value}
                        duration={2}
                        separator=","
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{metric.label}</p>
                  </GlassCard>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Trust Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <GlassCard className="max-w-3xl mx-auto p-8">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold">Our Commitment to Transparency</h3>
            </div>
            <p className="text-muted-foreground">
              Every claim we make is backed by verifiable data. Our equipment is cataloged, our licenses are public, 
              our smart contracts are audited, and our financials are published monthly. TRN isn't built on promises—
              it's built on proof.
            </p>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};