import { useState } from "react";
import { Check, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SubscriptionManagerProps {
  walletAddress?: string;
  currentTier?: string;
}

const SUBSCRIPTION_TIERS = [
  {
    id: 'free',
    name: 'Free',
    trnCost: 0,
    fiatCost: 0,
    features: [
      '5 energy/day',
      'Basic AI analysis',
      'Standard features',
      'Community support',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    trnCost: 1000,
    fiatCost: 9.99,
    popular: true,
    features: [
      '20 energy/day',
      'Advanced AI modules',
      'Priority support',
      'Export reports',
      'API access',
    ],
  },
  {
    id: 'business',
    name: 'Business',
    trnCost: 5000,
    fiatCost: 49.99,
    features: [
      'Unlimited energy',
      'All AI features',
      'Team accounts (5)',
      'White-label reports',
      'Priority API',
      'Dedicated support',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    trnCost: 25000,
    fiatCost: 199.99,
    features: [
      'Everything in Business',
      'Custom AI training',
      'Unlimited team accounts',
      'Custom branding',
      'SLA guarantee',
      'Account manager',
    ],
  },
];

export const SubscriptionManager = ({ walletAddress, currentTier = 'free' }: SubscriptionManagerProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSubscribe = async (tierId: string, paymentMethod: 'trn' | 'stripe') => {
    if (!walletAddress) {
      toast({
        title: "Wallet Required",
        description: "Please connect your wallet to subscribe.",
        variant: "destructive",
      });
      return;
    }

    setLoading(tierId);

    try {
      const { data, error } = await supabase.functions.invoke('manage-subscription', {
        body: {
          walletAddress,
          tier: tierId,
          paymentMethod,
          action: 'create',
        },
      });

      if (error) throw error;

      if (paymentMethod === 'stripe' && data?.checkoutUrl) {
        window.location.href = data.checkoutUrl;
        return;
      }

      toast({
        title: "Subscription Activated! 🎉",
        description: `You're now on the ${tierId.toUpperCase()} tier!`,
      });
    } catch (error: any) {
      console.error('Subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: error.message || "Failed to process subscription",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {SUBSCRIPTION_TIERS.map((tier) => (
        <Card 
          key={tier.id}
          className={`p-6 relative ${
            tier.popular ? 'border-primary bg-gradient-to-br from-primary/10 to-accent/10' : ''
          } ${currentTier === tier.id ? 'ring-2 ring-primary' : ''}`}
        >
          {tier.popular && (
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                POPULAR
              </span>
            </div>
          )}

          {currentTier === tier.id && (
            <div className="absolute -top-3 right-4">
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                CURRENT PLAN
              </span>
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-2xl font-bold mb-2">{tier.name}</h3>
            <div className="mb-2">
              <span className="text-3xl font-bold">{tier.trnCost}</span>
              <span className="text-sm text-muted-foreground"> TRN/mo</span>
            </div>
            <div className="text-sm text-muted-foreground">
              or ${tier.fiatCost}/mo
            </div>
          </div>

          <ul className="space-y-2 mb-6">
            {tier.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {tier.id === 'free' ? (
            <Button disabled className="w-full">
              Current Plan
            </Button>
          ) : currentTier === tier.id ? (
            <Button variant="outline" className="w-full">
              Manage Plan
            </Button>
          ) : (
            <div className="space-y-2">
              <Button 
                onClick={() => handleSubscribe(tier.id, 'trn')}
                disabled={loading === tier.id}
                className="w-full"
              >
                <Zap className="h-4 w-4 mr-2" />
                {loading === tier.id ? 'Processing...' : `Pay with TRN (20% off)`}
              </Button>
              <Button 
                onClick={() => handleSubscribe(tier.id, 'stripe')}
                disabled={loading === tier.id}
                variant="outline"
                className="w-full"
              >
                Pay with Card
              </Button>
            </div>
          )}
        </Card>
      ))}
    </div>
  );
};
