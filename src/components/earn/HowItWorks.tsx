import { GlassCard } from "@/components/ui/glass-card";
import { Upload, Database, Wallet, FolderOpen } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Yard",
    description: "Take a photo of drainage issues, erosion, or landscaping problems",
    reward: "10 TRN",
    color: "text-blue-500"
  },
  {
    icon: Database,
    title: "Allow AI Training",
    description: "Check the consent box to help improve our terrain intelligence models",
    reward: "+50 TRN",
    color: "text-green-500"
  },
  {
    icon: Wallet,
    title: "Connect Wallet",
    description: "Link your Solana wallet to receive rewards directly",
    reward: "+5 TRN",
    color: "text-purple-500"
  },
  {
    icon: FolderOpen,
    title: "Select Category",
    description: "Categorize your terrain issue for better AI training data",
    reward: "+10 TRN",
    color: "text-orange-500"
  }
];

const HowItWorks = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-center mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <GlassCard key={index} className="p-6 relative">
              <div className="absolute top-4 right-4 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-display font-bold text-primary">
                {index + 1}
              </div>
              
              <step.icon className={`w-12 h-12 ${step.color} mb-4`} />
              
              <h3 className="font-display text-xl font-bold mb-2">{step.title}</h3>
              <p className="font-body text-sm text-muted-foreground mb-4">{step.description}</p>
              
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10">
                <span className="font-display font-bold text-primary">{step.reward}</span>
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary/10">
            <span className="font-display text-2xl font-bold text-primary">Total: Up to 75 TRN</span>
            <span className="font-body text-muted-foreground">per upload</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
