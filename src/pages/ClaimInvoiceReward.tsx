import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Gift, CheckCircle2, ArrowRight, AlertCircle } from "lucide-react";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";

const claimSchema = z.object({
  code: z.string().trim().toUpperCase().min(8, "Invalid code").max(20, "Invalid code"),
  walletAddress: z.string().trim().min(32, "Invalid wallet address").max(44, "Invalid wallet address"),
});

type ClaimForm = z.infer<typeof claimSchema>;

const ClaimInvoiceReward = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);

  const form = useForm<ClaimForm>({
    resolver: zodResolver(claimSchema),
  });

  const onSubmit = async (data: ClaimForm) => {
    setIsSubmitting(true);
    try {
      // Check if code exists and is valid
      const { data: codeData, error: fetchError } = await supabase
        .from("invoice_codes")
        .select("*")
        .eq("code", data.code)
        .single();

      if (fetchError || !codeData) {
        toast.error("Invalid code. Please check and try again.");
        return;
      }

      if (codeData.status !== "active") {
        toast.error(
          codeData.status === "redeemed" 
            ? "This code has already been redeemed." 
            : "This code has expired."
        );
        return;
      }

      if (new Date(codeData.expires_at) < new Date()) {
        toast.error("This code has expired.");
        return;
      }

      // Redeem the code
      const { error: updateError } = await supabase
        .from("invoice_codes")
        .update({
          status: "redeemed",
          redeemed_at: new Date().toISOString(),
          redeemed_by_wallet: data.walletAddress,
        })
        .eq("code", data.code)
        .eq("status", "active"); // Prevent race conditions

      if (updateError) {
        toast.error("Failed to redeem code. Please try again.");
        return;
      }

      setRewardAmount(codeData.trn_reward);
      setIsSuccess(true);
      toast.success(`Successfully claimed ${codeData.trn_reward.toLocaleString()} TRN!`);
    } catch (error) {
      console.error("Claim error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Reward Claimed | Terrain Token</title>
        </Helmet>
        <ScrollProgress />
        <AnnouncementBanner />
        <DesktopNav />
        <main className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-32 pb-20 px-4">
          <BackToHome />
          <div className="container max-w-2xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6 animate-bounce">
              <Gift className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Reward Claimed!</h1>
            <GlassCard className="p-8 space-y-4">
              <div className="text-5xl font-bold text-primary">{rewardAmount.toLocaleString()} TRN</div>
              <p className="text-muted-foreground">has been allocated to your wallet</p>
            </GlassCard>
            <div className="space-y-4 text-left">
              <h3 className="text-xl font-semibold">What's Next?</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Your TRN reward will be airdropped within 48 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Check your wallet at the address you provided</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Start earning more by joining our community</span>
                </li>
              </ul>
            </div>
            <Button onClick={() => window.location.href = "/"} size="lg" className="gap-2">
              Return Home <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Claim Your TRN Reward | Terrain Token</title>
        <meta
          name="description"
          content="Paid a Carolina Terrain invoice? Claim your TRN token reward with your unique invoice code."
        />
      </Helmet>

      <ScrollProgress />
      <AnnouncementBanner />
      <DesktopNav />

      <main className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-32 pb-20 px-4">
        <BackToHome />
        
        <div className="container max-w-4xl mx-auto space-y-16">
          {/* Hero */}
          <div className="text-center space-y-6 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
              <Gift className="w-4 h-4 text-primary" />
              Invoice Reward Program
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              Claim Your <span className="text-primary">TRN Reward</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Paid a Carolina Terrain invoice? Enter your unique code below to claim 10,000 TRN tokens as our thank you.
            </p>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <GlassCard className="p-6 text-center space-y-3">
              <div className="text-3xl">📄</div>
              <h3 className="font-semibold">Find Your Code</h3>
              <p className="text-sm text-muted-foreground">Check your invoice email or the bottom of your physical invoice</p>
            </GlassCard>
            <GlassCard className="p-6 text-center space-y-3">
              <div className="text-3xl">💰</div>
              <h3 className="font-semibold">10,000 TRN</h3>
              <p className="text-sm text-muted-foreground">Free tokens for every paid Carolina Terrain invoice</p>
            </GlassCard>
            <GlassCard className="p-6 text-center space-y-3">
              <div className="text-3xl">⏰</div>
              <h3 className="font-semibold">90 Days to Claim</h3>
              <p className="text-sm text-muted-foreground">Codes expire 90 days after invoice date</p>
            </GlassCard>
          </div>

          {/* Claim Form */}
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Claim Your Reward</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Reward Code *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="TRN-XXXX-XXXX" 
                          className="uppercase font-mono text-lg"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                        />
                      </FormControl>
                      <FormDescription>Enter the code from your Carolina Terrain invoice</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solana Wallet Address *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter your Solana wallet address"
                          className="font-mono"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>Your TRN tokens will be sent to this address</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="bg-muted/50 border border-border rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">Important Notes:</p>
                    <ul className="space-y-1 text-muted-foreground">
                      <li>• Each code can only be redeemed once</li>
                      <li>• TRN airdrop occurs within 48 hours</li>
                      <li>• Make sure your wallet address is correct</li>
                    </ul>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? "Claiming..." : "Claim 10,000 TRN"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </Form>
          </GlassCard>

          {/* FAQ */}
          <div className="max-w-2xl mx-auto space-y-6">
            <h2 className="text-2xl font-bold text-center">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <GlassCard className="p-5">
                <h3 className="font-semibold mb-2">Where do I find my invoice code?</h3>
                <p className="text-muted-foreground">Your unique TRN reward code is printed at the bottom of your Carolina Terrain invoice and also sent in your invoice confirmation email.</p>
              </GlassCard>
              <GlassCard className="p-5">
                <h3 className="font-semibold mb-2">What if my code doesn't work?</h3>
                <p className="text-muted-foreground">Double-check the code for typos. If it still doesn't work, contact us at info@carolina-terrain.com with your invoice number.</p>
              </GlassCard>
              <GlassCard className="p-5">
                <h3 className="font-semibold mb-2">Can I claim multiple codes?</h3>
                <p className="text-muted-foreground">Yes! Each invoice has a unique code. If you've paid multiple invoices, you can claim rewards for each one.</p>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ClaimInvoiceReward;
