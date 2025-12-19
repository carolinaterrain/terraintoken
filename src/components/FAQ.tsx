import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ShieldCheck } from "lucide-react";

const faqs = [
  {
    question: "Is TRN an investment?",
    answer: "No. TRN is a utility access token, not a security or investment product. It grants optional access to platform services. There is no promise of returns, no expectation of profit, and TRN may lose value or become worthless. Do not purchase TRN expecting financial gain."
  },
  {
    question: "Do I need crypto to use the platform?",
    answer: "No. Homeowners can use TerrainVision AI, request quotes from Carolina Terrain, and access TerrainGuard services without ever touching a wallet. TRN operates behind the scenes. Credits can be granted administratively through our service agreements."
  },
  {
    question: "How is TRN different from points or credits?",
    answer: "TRN is a blockchain-based token with a fixed supply and transparent ledger. Unlike points, TRN can be transferred between users and has on-chain verifiability. However, like points, it is designed for utility access—not speculation."
  },
  {
    question: "Who controls TRN usage inside the platform?",
    answer: "The Terrain ecosystem team sets service pricing, contribution rewards, and platform rules. All transactions are logged in a tamper-evident ledger. Users can participate in governance discussions but operational control remains with the licensed business entity."
  },
  {
    question: "Can TRN lose value?",
    answer: "Yes. TRN can lose value, become illiquid, or become worthless. Like any token, its market value depends on supply, demand, and ecosystem adoption. Never purchase more than you can afford to lose. This is not investment advice."
  },
  {
    question: "What can I actually do with TRN?",
    answer: "Access premium AI analysis tiers on TerrainVision, earn credits by contributing terrain data, receive service discounts from Carolina Terrain, and participate in community governance. All utility is optional—you can use basic services without TRN."
  },
  {
    question: "How do I earn TRN without buying?",
    answer: "Upload terrain photos on TerrainVision AI and consent to AI training. You'll receive TRN credits based on data quality and category. No purchase required. This is contribution-based, not speculation-based."
  },
  {
    question: "Is TRN required to get drainage work done?",
    answer: "Absolutely not. Carolina Terrain accepts normal payment methods (credit card, check, financing). TRN is an optional layer that provides discounts and credits—it is never required for services."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-12 px-4 relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-5"
        style={{ background: "var(--terrain-contour)" }}
      />
      
      <div className="container mx-auto max-w-3xl relative">
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
          <p className="font-body text-muted-foreground">
            Conservative, factual answers about TRN utility
          </p>
        </div>
        
        <Accordion type="single" collapsible className="mb-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="font-display text-left hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-body text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {/* What TRN Is NOT - Explicit Section */}
        <div className="mb-8 p-6 rounded-xl bg-muted/30 border border-border">
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <h3 className="font-display text-lg font-semibold">What TRN Is NOT</h3>
          </div>
          <ul className="space-y-2 font-body text-sm text-muted-foreground">
            <li>• <span className="text-foreground font-medium">Not an investment product</span> — no expectation of profit</li>
            <li>• <span className="text-foreground font-medium">Not a promise of returns</span> — value may decrease to zero</li>
            <li>• <span className="text-foreground font-medium">Not required</span> — all core services work without TRN</li>
            <li>• <span className="text-foreground font-medium">Not a substitute for real revenue</span> — the business operates on USD</li>
          </ul>
        </div>
        
        <Alert className="border-destructive/50 bg-destructive/5">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-sm leading-relaxed">
            <strong className="text-foreground">Legal Disclaimer:</strong> Terrain Token (TRN) is a utility access token, 
            not an investment, security, or financial instrument. TRN has no expectation of profit, may lose all value, 
            and is not redeemable for cash. Do not purchase TRN expecting financial returns. All token purchases are 
            final and non-refundable. Nothing on this site constitutes financial, legal, or investment advice. 
            Always do your own research and never risk more than you can afford to lose completely.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
};

export default FAQ;
