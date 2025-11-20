import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const faqs = [
  {
    question: "How do I participate in the meme contest?",
    answer: "Post your terrain-themed meme on Twitter/X with #TRNMemes and tag @carolinaterrain. Check the Contest Rules section for full details, prizes, and submission guidelines."
  },
  {
    question: "Is TRN an investment?",
    answer: "No. TRN is not an investment and carries no expectation of profit. It's a community token designed for entertainment and future ecosystem utilities."
  },
  {
    question: "What can I do with TRN?",
    answer: "Currently, TRN serves as a community meme token. In the future, it will be used to earn rewards for terrain data contributions, unlock AI-powered analysis tools, and access premium features in our ecosystem."
  },
  {
    question: "How will TRN evolve in the future?",
    answer: "TRN will progressively add utility through our 6-phase roadmap: from community building to data contribution rewards, AI credit unlocks, a terrain data marketplace, and eventually robotics integration."
  },
  {
    question: "How do I buy TRN?",
    answer: "TRN is available on pump.fun and other decentralized exchanges. Check our official social channels for the latest trading information and contract address."
  },
  {
    question: "What makes TRN different from other meme coins?",
    answer: "While TRN starts as a meme, it has a clear evolution path toward real-world utility. We're building the first terrain-data reward ecosystem, bridging internet culture with practical technology."
  }
];

const FAQ = () => {
  return (
    <section id="faq" className="py-20 px-4 bg-terrain-dark/30">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Frequently Asked <span className="text-primary">Questions</span>
          </h2>
        </div>
        
        <Accordion type="single" collapsible className="mb-12">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left hover:text-primary transition-colors">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
        
        <Alert className="border-primary/50 bg-card">
          <AlertTriangle className="h-4 w-4 text-primary" />
          <AlertDescription className="text-sm leading-relaxed">
            <strong className="text-foreground">Legal Disclaimer:</strong> Terrain Token (TRN) is not an investment, 
            has no expectation of profit, and is not redeemable for cash. TRN is a closed-loop community and 
            reward token used for entertainment and future ecosystem utilities. Nothing on this site constitutes 
            financial advice. Always do your own research and never invest more than you can afford to lose.
          </AlertDescription>
        </Alert>
      </div>
    </section>
  );
};

export default FAQ;
