import { GlassCard } from "@/components/ui/glass-card";
import { AlertCircle } from "lucide-react";

const LegalDisclaimers = () => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto max-w-4xl">
        <GlassCard className="p-8">
          <div className="flex items-start gap-4 mb-6">
            <AlertCircle className="w-6 h-6 text-muted-foreground flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-display text-xl font-bold mb-4">Important Information</h3>
              
              <ul className="font-body text-sm text-muted-foreground space-y-3">
                <li>• TRN rewards are recognition tokens for data contribution, not investment returns</li>
                <li>• TRN has no guaranteed monetary value and is subject to market fluctuations</li>
                <li>• Participation does not constitute an investment or financial relationship</li>
                <li>• Data provided is used for AI training and ecosystem improvement</li>
                <li>• No purchase of TRN is required to earn rewards</li>
                <li>• Rewards are utility-based recognition for community contribution</li>
                <li>• Users retain ownership of uploaded photos but grant usage rights for AI training when consent is provided</li>
                <li>• All rewards are subject to verification and may be adjusted for quality and accuracy</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>
    </section>
  );
};

export default LegalDisclaimers;
