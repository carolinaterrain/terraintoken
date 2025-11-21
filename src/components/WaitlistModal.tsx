import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Copy, Share2, Loader2 } from "lucide-react";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  referralCode?: string;
}

export const WaitlistModal = ({ isOpen, onClose, referralCode }: WaitlistModalProps) => {
  const [email, setEmail] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [betaApplication, setBetaApplication] = useState("");
  const [honeypot, setHoneypot] = useState(""); // Anti-bot honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formStartTime] = useState(Date.now());
  const [position, setPosition] = useState<number | null>(null);
  const [myReferralCode, setMyReferralCode] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email address";
    } else if (email.length > 255) {
      newErrors.email = "Email too long";
    }

    // Beta application validation
    if (betaApplication && betaApplication.length > 500) {
      newErrors.betaApplication = "Application must be under 500 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { data, error } = await supabase.functions.invoke('join-waitlist', {
        body: {
          email: email.trim(),
          wallet_address: walletAddress.trim() || null,
          referral_code: referralCode || null,
          beta_application: betaApplication.trim() || null,
          utm_source: new URLSearchParams(window.location.search).get('utm_source'),
          utm_campaign: new URLSearchParams(window.location.search).get('utm_campaign')
        }
      });

      if (error) throw error;

      if (data.existing) {
        toast.error("You're already on the waitlist!", {
          description: `Your referral code: ${data.referral_code}`
        });
        setMyReferralCode(data.referral_code);
        setSuccess(true);
        return;
      }

      setPosition(data.position);
      setMyReferralCode(data.referral_code);
      setSuccess(true);
      toast.success(data.message);

    } catch (error: any) {
      console.error('Waitlist error:', error);
      toast.error(error.message || "Failed to join waitlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/?ref=${myReferralCode}`;
    navigator.clipboard.writeText(link);
    toast.success("Referral link copied! Share it to move up the waitlist.");
  };

  const shareOnTwitter = () => {
    const text = `I just joined the TerrainScape waitlist to learn drainage engineering and earn real money playing a game! 🎮💰\n\nJoin me:`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.origin + '/?ref=' + myReferralCode)}&hashtags=TerrainToken,TRN,TerrainScape&via=carolinaterrain`;
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {!success ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Join the TerrainScape Waitlist 🎮</DialogTitle>
              <DialogDescription>
                Get early access to the world's first educational play-to-earn MMO. 
                TRN holders get priority!
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="goblin@terraintoken.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  maxLength={255}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs text-destructive mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <Label htmlFor="wallet">Solana Wallet (Optional - Priority Access for TRN Holders)</Label>
                <Input
                  id="wallet"
                  type="text"
                  placeholder="Your SOL wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  💎 TRN holders automatically get priority access + 500 TRN bonus
                </p>
              </div>

              <div>
                <Label htmlFor="application">Why do you want to join? (Optional)</Label>
                <Textarea
                  id="application"
                  placeholder="Tell us why you're excited about TerrainScape..."
                  value={betaApplication}
                  onChange={(e) => setBetaApplication(e.target.value)}
                  maxLength={500}
                  rows={3}
                  className={errors.betaApplication ? "border-destructive" : ""}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">
                    {betaApplication.length}/500 characters
                  </p>
                  {errors.betaApplication && (
                    <p className="text-xs text-destructive">{errors.betaApplication}</p>
                  )}
                </div>
              </div>

              {referralCode && (
                <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <p className="text-sm text-muted-foreground">
                    ✨ Referred by: <span className="font-bold text-primary">{referralCode}</span>
                    <span className="ml-2 text-xs">(+50 priority points!)</span>
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  "Join Waitlist"
                )}
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 className="w-16 h-16 text-chart-3 mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-2">Welcome to the Waitlist!</h3>
            <p className="text-lg text-muted-foreground mb-6">
              You're <span className="font-bold text-primary">#{position?.toLocaleString()}</span> in line
            </p>

            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20 mb-6">
              <p className="text-sm text-muted-foreground mb-2">Your Referral Code:</p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-xl font-bold text-primary">{myReferralCode}</code>
                <Button size="sm" variant="ghost" onClick={copyReferralLink}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                🚀 Invite 5 friends to skip 100 spots in line!
              </p>
            </div>

            <div className="space-y-3">
              <Button className="w-full" onClick={shareOnTwitter}>
                <Share2 className="w-4 h-4 mr-2" />
                Share on Twitter
              </Button>
              <Button variant="outline" className="w-full" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
