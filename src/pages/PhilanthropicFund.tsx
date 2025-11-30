import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Leaf, 
  Home, 
  GraduationCap, 
  AlertTriangle, 
  Users, 
  Heart,
  CheckCircle,
  ExternalLink,
  ArrowLeft,
  Copy,
  Check,
  Wallet
} from "lucide-react";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import ScrollProgress from "@/components/ScrollProgress";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { spacing, typography } from "@/lib/spacing";
import { toast } from "@/hooks/use-toast";

const PHILANTHROPIC_WALLET = "H3WwWaX1Afj2kpCsCsawZqxk5CHpXDHz9FzLgZmyPecu";
const DEV_TEAM_WALLET = "B3L92AEPpc3HGhxM86GBvSMR54Y88vFV3uuG3kVJ9ER4";

const impactCategories = [
  {
    icon: Leaf,
    title: "Environmental Restoration",
    description: "Erosion repair, stormwater improvements, tree planting"
  },
  {
    icon: Home,
    title: "Community Assistance",
    description: "Flooded yards, elderly homeowners, veterans support"
  },
  {
    icon: GraduationCap,
    title: "STEM & Education",
    description: "Local robotics programs, youth initiatives"
  },
  {
    icon: AlertTriangle,
    title: "Disaster Response",
    description: "Micro-grants for urgent community needs"
  },
  {
    icon: Users,
    title: "Community-Voted Causes",
    description: "Any initiative aligned with Terrain's mission"
  }
];

const benefits = [
  "Strengthens TRN's identity as a utility-backed, community-first ecosystem",
  "Converts platform success into measurable community benefit",
  "Builds trust with investors, users, and contractors",
  "Aligns with TerrainVision's practical mission",
  "Gives holders an ongoing voice in impact decisions",
  "Demonstrates that Web3 can fund real work"
];

const PhilanthropicFund = () => {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  const copyToClipboard = async (wallet: string, label: string) => {
    try {
      await navigator.clipboard.writeText(wallet);
      setCopiedWallet(wallet);
      toast({
        title: "Wallet address copied!",
        description: `${label} address copied to clipboard.`,
      });
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch {
      toast({
        title: "Failed to copy",
        description: "Please copy the address manually.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Helmet>
        <title>Philanthropic Fund | Terrain Token (TRN)</title>
        <meta 
          name="description" 
          content="The Terrain Philanthropic Fund is a community-governed initiative to direct meaningful support toward real-world projects selected by TRN holders." 
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://terrainvision-ai.com/philanthropic-fund" />
      </Helmet>

      <ScrollProgress />
      <DesktopNav />

      <main className="min-h-screen bg-background pt-24">
        {/* Back Navigation */}
        <div className="container mx-auto px-4 mb-8">
          <Link 
            to="/" 
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {/* Hero Section */}
        <section className={`${spacing.section.hero} text-center`}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-2 mb-6">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Community Initiative</span>
              </div>
              
              <h1 className={`${typography.hero} font-bold text-foreground mb-6`}>
                Terrain Philanthropic Fund
              </h1>
              
              <p className={`${typography.body} text-muted-foreground max-w-2xl mx-auto`}>
                A community-driven initiative to turn platform success into real-world impact.
              </p>
            </motion.div>
          </div>
        </section>

        {/* What the Fund Is */}
        <section className={spacing.section.standard}>
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-8">
                <h2 className={`${typography.h2} font-bold text-foreground mb-6`}>
                  What the Fund Is
                </h2>
                
                <p className={`${typography.body} text-muted-foreground mb-6`}>
                  The Terrain Philanthropic Fund is a community-governed resource pool created by the 
                  TerrainVision and Terrain Token (TRN) ecosystem. Its purpose is to direct meaningful 
                  support toward real-world projects selected by the community.
                </p>
                
                <p className={`${typography.body} text-muted-foreground mb-4`}>
                  The fund receives contributions from three sources:
                </p>
                
                <ul className="space-y-3 mb-4">
                  {[
                    "A portion of platform revenue",
                    "Optional community contributions",
                    "Seasonal TRN allocations"
                  ].map((source, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{source}</span>
                    </li>
                  ))}
                </ul>
                
                <p className={`${typography.small} text-muted-foreground/80`}>
                  All fund activity is transparent and publicly tracked.
                </p>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* What We Support */}
        <section className={spacing.section.standard}>
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-12"
            >
              <h2 className={`${typography.h2} font-bold text-foreground mb-4`}>
                What We Support
              </h2>
              <p className={`${typography.body} text-muted-foreground max-w-2xl mx-auto`}>
                The Philanthropic Fund allocates resources toward initiatives that align with 
                Terrain's mission of improving land, water, and community well-being.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
              {impactCategories.map((category, index) => (
                <motion.div
                  key={category.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <GlassCard hover className="p-6 h-full text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <category.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {category.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Why We're Doing This */}
        <section className={spacing.section.standard}>
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-8">
                <h2 className={`${typography.h2} font-bold text-foreground mb-6`}>
                  Why We're Doing This
                </h2>
                
                <p className={`${typography.body} text-muted-foreground mb-6`}>
                  The Philanthropic Fund reflects the values at the core of the TRN ecosystem:
                </p>
                
                <ul className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Community Vote CTA */}
        <section className={spacing.section.major}>
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <GlassCard className="p-8 md:p-12 text-center border-primary/30">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                
                <h2 className={`${typography.h2} font-bold text-foreground mb-4`}>
                  Community Vote
                </h2>
                
                <p className={`${typography.body} text-muted-foreground mb-4`}>
                  The first community vote includes three key questions:
                </p>
                
                <ol className="text-left max-w-xl mx-auto mb-8 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">1</span>
                    <span className="text-muted-foreground">Should we activate the Terrain Philanthropic Fund?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">2</span>
                    <span className="text-muted-foreground">Should a small, fixed portion of monthly platform revenue be allocated to the fund?</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-sm font-bold flex items-center justify-center flex-shrink-0">3</span>
                    <span className="text-muted-foreground">Should TRN holders vote on the first beneficiary project during the next community cycle?</span>
                  </li>
                </ol>
                
                <p className={`${typography.small} text-muted-foreground mb-8`}>
                  Voting is open to all TRN holders. Results will be published transparently.
                </p>
                
                <Button size="lg" className="gap-2" asChild>
                  <a
                    href="https://docs.google.com/forms/d/e/1FAIpQLSckbxOz881hhJlWrCnyZy3Gj9VNNARGyTVXuUs1LFzLBDhsNw/viewform?usp=header"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cast Your Vote
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </Button>
              </GlassCard>
            </motion.div>
          </div>
        </section>

        {/* Support the Mission */}
        <section className={spacing.section.standard}>
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-center mb-10"
            >
              <h2 className={`${typography.h2} font-bold text-foreground mb-4`}>
                Support the Mission
              </h2>
              <p className={`${typography.body} text-muted-foreground max-w-2xl mx-auto`}>
                Every contribution—small or large—goes directly to accelerating what this community builds.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Philanthropic Fund Wallet */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <GlassCard className="p-6 h-full border-emerald-500/30 bg-emerald-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Heart className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Philanthropic Fund</h3>
                      <span className="text-xs text-emerald-500">SOL / TRN</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Supports environmental projects, storm-relief, veterans, seniors, and community initiatives.
                  </p>
                  
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3 border border-border">
                    <Wallet className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <code className="text-xs text-muted-foreground truncate flex-1">
                      {PHILANTHROPIC_WALLET}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 flex-shrink-0"
                      onClick={() => copyToClipboard(PHILANTHROPIC_WALLET, "Philanthropic Fund")}
                    >
                      {copiedWallet === PHILANTHROPIC_WALLET ? (
                        <Check className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>

              {/* Dev Team Wallet */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <GlassCard className="p-6 h-full border-violet-500/30 bg-violet-500/5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                      <Users className="w-5 h-5 text-violet-500" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Project Development</h3>
                      <span className="text-xs text-violet-500">SOL / TRN</span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-4">
                    Helps fund engineering, infrastructure, servers, and ongoing TRN ecosystem upgrades.
                  </p>
                  
                  <div className="flex items-center gap-2 bg-background/50 rounded-lg p-3 border border-border">
                    <Wallet className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    <code className="text-xs text-muted-foreground truncate flex-1">
                      {DEV_TEAM_WALLET}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 flex-shrink-0"
                      onClick={() => copyToClipboard(DEV_TEAM_WALLET, "Dev Team")}
                    >
                      {copiedWallet === DEV_TEAM_WALLET ? (
                        <Check className="w-4 h-4 text-violet-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </GlassCard>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Disclaimer */}
        <section className={spacing.section.compact}>
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="bg-muted/30 border border-border rounded-lg p-6">
                <h3 className="font-semibold text-foreground mb-3">Disclaimer</h3>
                <p className="text-sm text-muted-foreground">
                  The Terrain Philanthropic Fund is a community initiative. TRN is a utility token—not 
                  an investment vehicle. Participation in voting or contributions does not guarantee any 
                  financial return. All fund allocations are subject to community governance and 
                  operational review.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
};

export default PhilanthropicFund;
