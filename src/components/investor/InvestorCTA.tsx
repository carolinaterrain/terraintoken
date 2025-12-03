import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { FileText, Mail, ArrowRight, Shield, Clock } from "lucide-react";

export function InvestorCTA() {
  const handleEmailClick = () => {
    const subject = encodeURIComponent("TRN Investment Inquiry");
    const body = encodeURIComponent(
      "Hello,\n\nI am interested in learning more about TRN investment opportunities.\n\nName:\nInvestment Range:\nQuestions:\n\nBest regards"
    );
    window.open(`mailto:info@carolinaterrain.com?subject=${subject}&body=${body}`, "_blank");
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Take the Next Step
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Ready to explore TRN investment opportunities? Download our investor brief or reach out directly.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Download Investor Brief */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 h-full flex flex-col hover:border-primary/50 transition-colors">
              <div className="p-4 rounded-xl bg-primary/10 w-fit mb-6">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">Investor Brief</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                Get our comprehensive one-pager with tokenomics, investment tiers, use of funds, and risk disclosure.
              </p>
              
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-chart-3" />
                  Executive summary & value proposition
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-chart-3" />
                  Token allocation breakdown
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-chart-3" />
                  Investment tier details
                </li>
              </ul>
              
              <Button 
                size="lg" 
                className="w-full group"
                asChild
              >
                <a href="/TRN_Investor_Brief.pdf" download>
                  <FileText className="mr-2 h-5 w-5" />
                  Download PDF
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </Button>
            </GlassCard>
          </motion.div>

          {/* Contact Directly */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <GlassCard className="p-8 h-full flex flex-col hover:border-chart-2/50 transition-colors">
              <div className="p-4 rounded-xl bg-chart-2/10 w-fit mb-6">
                <Mail className="w-8 h-8 text-chart-2" />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">Express Interest</h3>
              <p className="text-muted-foreground mb-6 flex-grow">
                Ready to discuss investment opportunities? Reach out to our team directly via email.
              </p>
              
              <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-chart-2" />
                  Response within 24-48 hours
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-chart-2" />
                  Confidential discussion
                </li>
                <li className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-chart-2" />
                  NDA available for strategic tiers
                </li>
              </ul>
              
              <Button 
                size="lg" 
                variant="outline"
                className="w-full group border-chart-2/50 hover:bg-chart-2/10"
                onClick={handleEmailClick}
              >
                <Mail className="mr-2 h-5 w-5" />
                Email Us
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </GlassCard>
          </motion.div>
        </div>

        {/* Quick Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <p className="text-sm text-muted-foreground">
            📧 <span className="text-foreground font-medium">info@carolinaterrain.com</span>
            <span className="mx-3">•</span>
            Investment tiers from $1K to $1M
          </p>
        </motion.div>
      </div>
    </section>
  );
}
