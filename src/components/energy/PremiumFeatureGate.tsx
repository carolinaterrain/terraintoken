import { Lock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface PremiumFeatureGateProps {
  feature: string;
  requiredTier?: string;
  children?: React.ReactNode;
}

export const PremiumFeatureGate = ({ feature, requiredTier = 'Pro', children }: PremiumFeatureGateProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-8 text-center bg-gradient-to-br from-primary/10 via-accent/10 to-primary/5">
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-full bg-primary/20">
          <Lock className="h-8 w-8 text-primary" />
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-2">Premium Feature</h3>
      <p className="text-muted-foreground mb-6">
        Unlock <strong>{feature}</strong> with {requiredTier} tier or higher
      </p>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 justify-center text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Advanced AI Analysis</span>
        </div>
        <div className="flex items-center gap-2 justify-center text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>3D Visualization</span>
        </div>
        <div className="flex items-center gap-2 justify-center text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Unlimited Energy</span>
        </div>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={() => navigate('/subscriptions')} size="lg">
          Upgrade to {requiredTier}
        </Button>
        <Button onClick={() => navigate('/subscriptions')} variant="outline" size="lg">
          View Plans
        </Button>
      </div>

      {children}
    </Card>
  );
};
