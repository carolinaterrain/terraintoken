import { GlassCard } from "@/components/ui/glass-card";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2, Shield, TrendingDown, Users, Gavel, Activity } from "lucide-react";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface Risk {
  id: string;
  title: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
  likelihood: 'high' | 'medium' | 'low';
  mitigation: string[];
  icon: any;
}

export const RiskMitigation = () => {
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  const risks: Risk[] = [
    {
      id: 'slow-adoption',
      title: 'Slow Market Adoption',
      description: 'Contractors may be slow to adopt AI tools due to tech skepticism or inertia',
      severity: 'high',
      likelihood: 'medium',
      icon: Users,
      mitigation: [
        'Freemium trial model to reduce friction and hook early users',
        'Educational content and case studies proving ROI',
        'Partnerships with trade associations for credibility',
        'Referral incentives to accelerate word-of-mouth'
      ]
    },
    {
      id: 'compute-costs',
      title: 'Rising Compute Costs',
      description: 'AI inference costs could spike and hurt margins',
      severity: 'medium',
      likelihood: 'low',
      icon: TrendingDown,
      mitigation: [
        'Model optimization and quantization to reduce compute per analysis',
        'Tiered pricing that passes costs to power users',
        'Edge computing for simple analyses',
        'Bulk purchase agreements with cloud providers'
      ]
    },
    {
      id: 'competition',
      title: 'Market Competition',
      description: 'Competitors may copy the model or large tech companies may enter the space',
      severity: 'medium',
      likelihood: 'medium',
      icon: Activity,
      mitigation: [
        'Rapid innovation cycle to stay ahead',
        'Proprietary training data moat from user contributions',
        'Strong community loyalty through TRN token alignment',
        'Network effects from marketplace make it hard to replicate'
      ]
    },
    {
      id: 'regulatory',
      title: 'Regulatory Uncertainty',
      description: 'Crypto regulations could impact token utility or accessibility',
      severity: 'medium',
      likelihood: 'medium',
      icon: Gavel,
      mitigation: [
        'Utility-first token design (not security)',
        'Legal counsel and compliance monitoring',
        'Geographic diversification of services',
        'Ability to pivot token utility based on regulatory landscape'
      ]
    },
    {
      id: 'token-fatigue',
      title: 'Token Fatigue',
      description: 'Users may lose interest if token utility fails to materialize',
      severity: 'high',
      likelihood: 'low',
      icon: AlertTriangle,
      mitigation: [
        'Continuous introduction of new token utilities',
        'Regular transparency reports on progress',
        'Active community engagement and governance',
        'Quick wins with pay-per-use and staking discounts'
      ]
    },
    {
      id: 'whale-concentration',
      title: 'Whale Concentration',
      description: 'Large holders could manipulate price or dump tokens',
      severity: 'medium',
      likelihood: 'low',
      icon: Shield,
      mitigation: [
        'Regular reporting on holder distribution',
        'Progressive decentralization over time',
        'Vesting schedules for strategic allocations',
        'Focus on utility demand that outlasts whale exits'
      ]
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'text-red-100 border-red-500/40 bg-red-500/30';
      case 'medium': return 'text-yellow-100 border-yellow-500/40 bg-yellow-500/30';
      case 'low': return 'text-green-100 border-green-500/40 bg-green-500/30';
      default: return 'text-muted-foreground border-border bg-muted/20';
    }
  };

  const getShortLabel = (title: string): string => {
    const labelMap: { [key: string]: string } = {
      'Slow Market Adoption': 'Slow Adopt.',
      'Rising Compute Costs': 'Compute',
      'Market Competition': 'Competition',
      'Regulatory Uncertainty': 'Regulatory',
      'Token Fatigue': 'Token',
      'Whale Concentration': 'Whale Conc.'
    };
    return labelMap[title] || title.split(' ').slice(0, 2).join(' ');
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-secondary/5 to-background">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Risk Mitigation Framework
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Every business faces risks. Here's how we're addressing the key challenges in building the terrain intelligence ecosystem.
          </p>
        </motion.div>

        {/* Risk Matrix Visualization */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <GlassCard className="p-8">
            <h3 className="text-2xl font-bold text-center mb-8">Risk Severity × Likelihood Matrix</h3>
            <TooltipProvider>
              <div className="grid grid-cols-4 gap-3 max-w-4xl mx-auto">
                <div className="text-center text-sm font-semibold text-muted-foreground"></div>
                <div className="text-center text-sm font-semibold text-muted-foreground">Low</div>
                <div className="text-center text-sm font-semibold text-muted-foreground">Medium</div>
                <div className="text-center text-sm font-semibold text-muted-foreground">High</div>
                
                {['High', 'Medium', 'Low'].map((severity) => (
                  <>
                    <div key={severity} className="text-right text-sm font-semibold text-muted-foreground pr-2 flex items-center justify-end">
                      {severity}
                    </div>
                    {['low', 'medium', 'high'].map((likelihood) => {
                      const matchingRisks = risks.filter(
                        r => r.severity === severity.toLowerCase() && r.likelihood === likelihood
                      );
                      return (
                        <div
                          key={`${severity}-${likelihood}`}
                          className={`min-h-[80px] rounded-lg border-2 ${
                            matchingRisks.length > 0 
                              ? getSeverityColor(severity.toLowerCase())
                              : 'border-border bg-muted/10'
                          } flex items-center justify-center text-xs font-bold p-3 text-center transition-all hover:scale-105 hover:shadow-lg`}
                        >
                          {matchingRisks.length > 0 ? (
                            <div className="space-y-1 w-full">
                              {matchingRisks.map(r => (
                                <Tooltip key={r.id}>
                                  <TooltipTrigger asChild>
                                    <div className="cursor-help hover:underline">
                                      {getShortLabel(r.title)}
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-xs">
                                    <p className="font-semibold">{r.title}</p>
                                    <p className="text-xs text-muted-foreground mt-1">{r.description}</p>
                                  </TooltipContent>
                                </Tooltip>
                              ))}
                            </div>
                          ) : (
                            <span className="text-muted-foreground/50 text-xs">—</span>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
                
                <div className="col-span-4 text-center text-xs text-muted-foreground mt-4">
                  <span className="font-semibold">Likelihood</span> of occurrence in next 12-24 months →
                </div>
              </div>
            </TooltipProvider>
          </GlassCard>
        </motion.div>

        {/* Risk Detail Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {risks.map((risk, index) => {
            const Icon = risk.icon;
            const isExpanded = expandedRisk === risk.id;

            return (
              <motion.div
                key={risk.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <GlassCard 
                  className={`p-6 cursor-pointer transition-all ${
                    isExpanded ? 'border-primary/40 shadow-xl' : ''
                  }`}
                  onClick={() => setExpandedRisk(isExpanded ? null : risk.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg border-2 ${getSeverityColor(risk.severity)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-lg mb-1">{risk.title}</h4>
                        <p className="text-sm text-muted-foreground">{risk.description}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-4">
                    <span className={`text-xs px-2 py-1 rounded-full border-2 ${getSeverityColor(risk.severity)}`}>
                      {risk.severity.toUpperCase()} severity
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full border-2 ${getSeverityColor(risk.likelihood)}`}>
                      {risk.likelihood.toUpperCase()} likelihood
                    </span>
                  </div>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="border-t border-border pt-4"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-4 h-4 text-chart-3" />
                        <span className="text-sm font-semibold text-chart-3">MITIGATION STRATEGIES:</span>
                      </div>
                      <ul className="space-y-2">
                        {risk.mitigation.map((strategy, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <CheckCircle2 className="w-4 h-4 text-chart-3 mt-0.5 flex-shrink-0" />
                            <span>{strategy}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}

                  <div className="text-xs text-muted-foreground text-center mt-4">
                    {isExpanded ? '▲ Click to collapse' : '▼ Click to see mitigation strategies'}
                  </div>
                </GlassCard>
              </motion.div>
            );
          })}
        </div>

        {/* Trust Signals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <GlassCard className="p-8 bg-gradient-to-br from-chart-3/10 to-chart-2/10">
            <div className="text-center">
              <Shield className="w-12 h-12 text-chart-3 mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">Risk Management Commitment</h3>
              <p className="text-muted-foreground max-w-3xl mx-auto mb-6">
                We believe transparency about risks builds trust. Every strategic decision considers downside scenarios, 
                and we actively monitor these risks with quarterly reviews reported to investors.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <span className="px-4 py-2 rounded-full bg-chart-3/20 text-chart-3 text-sm font-semibold">
                  ✓ Quarterly Risk Reviews
                </span>
                <span className="px-4 py-2 rounded-full bg-chart-2/20 text-chart-2 text-sm font-semibold">
                  ✓ Transparent Reporting
                </span>
                <span className="px-4 py-2 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                  ✓ Active Mitigation
                </span>
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};