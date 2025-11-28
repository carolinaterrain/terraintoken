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
    question: "How do I earn TRN tokens?",
    answer: "Upload photos on TerrainVision AI (terrainvision-ai.com/analyze), provide your Solana wallet, and consent to AI training. You'll earn 10-75+ TRN per upload based on data quality, consent, and category. It's live NOW."
  },
  {
    question: "Do I need to buy TRN to earn TRN?",
    answer: "Nope! You can start earning TRN for FREE by uploading terrain photos. No investment required. Just upload, analyze, and earn. This is the future of meme coins — contribution over speculation."
  },
  {
    question: "What makes TRN different from other meme coins?",
    answer: "Other meme coins rely on hype and speculation. TRN has a LIVE earning system where you contribute real-world data and get rewarded. We're backed by a real drainage company (Carolina Terrain) and integrated with AI technology (TerrainVision AI). From memes to meaningful utility."
  },
  {
    question: "Can I analyze my yard for free?",
    answer: "Yes! TerrainVision AI provides instant AI-powered drainage, erosion, and grading analysis for free. If you provide your wallet and consent to AI training, you ALSO earn TRN tokens. Win-win."
  },
  {
    question: "How do I participate in the meme contest?",
    answer: "Post your terrain-themed meme on Twitter/X with #TRNMemes and tag @carolinaterrain. Check the Contest Rules section for full details, prizes, and submission guidelines."
  },
  {
    question: "Can Carolina Terrain help me if I'm not in North Carolina?",
    answer: "YES! We offer remote 2D/3D design services, virtual consultations, and can connect you with certified local contractors in your area. The goblin revolution is NATIONWIDE! 🌍 Fill out the consultation form on our site or visit carolinaterrain.com."
  },
  {
    question: "What makes TRN different from DOGE, SHIB, and other meme coins?",
    answer: "Unlike pure meme coins, TRN is backed by a real licensed landscape company (CL.1872) with established revenue streams, physical equipment, 8 industry certifications, and a 6-phase roadmap to AI-powered utility. TRN powers platform access and sustainability—not speculation."
  },
  {
    question: "How does the Jobber consultation work?",
    answer: "Fill out the form on our site, schedule a video call, and get expert advice from licensed contractors. We can design your entire project remotely using 2D/3D tools and Terrain Vision AI. If you're local to NC, we'll install it. If not, we'll connect you with quality contractors in your area!"
  },
  {
    question: "What's Terrain Vision AI and how does it relate to TRN?",
    answer: "Terrain Vision AI is our data-driven landscape intelligence platform (Phase 3-5 of roadmap). It uses AI to analyze yard photos, generate instant quotes, and provide smart drainage solutions. In the future, TRN holders will earn tokens for contributing terrain data and unlock premium AI features."
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
    question: "When will TerrainScape launch?",
    answer: "TerrainScape is currently in development with public beta planned for Q1 2026. Early access is prioritized for TRN holders who join the waitlist now. Join at terraintoken.com to secure your spot!"
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
