import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Coins, Sparkles, CheckCircle2, ArrowRight } from "lucide-react";
import ScrollProgress from "@/components/ScrollProgress";
import BackToHome from "@/components/BackToHome";
import AnnouncementBanner from "@/components/AnnouncementBanner";
import DesktopNav from "@/components/DesktopNav";
import Footer from "@/components/Footer";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { supabase } from "@/integrations/supabase/client";

const TIERS = [
  {
    id: "bronze",
    name: "Bronze",
    trnRequired: 50000,
    discount: 50,
    description: "Perfect for small drainage assessments",
    icon: "🥉",
  },
  {
    id: "silver",
    name: "Silver",
    trnRequired: 150000,
    discount: 200,
    description: "Ideal for mid-size drainage installations",
    icon: "🥈",
    popular: true,
  },
  {
    id: "gold",
    name: "Gold",
    trnRequired: 500000,
    discount: 750,
    description: "Best value for major terrain projects",
    icon: "🥇",
  },
];

const redeemSchema = z.object({
  walletAddress: z.string().trim().min(32, "Invalid wallet address").max(44, "Invalid wallet address"),
  tier: z.enum(["bronze", "silver", "gold"]),
  serviceType: z.string().trim().optional(),
  email: z.string().trim().email("Invalid email address"),
  phone: z.string().trim().optional(),
  preferredContact: z.enum(["email", "phone"]),
  notes: z.string().trim().max(500, "Notes must be less than 500 characters").optional(),
});

type RedeemForm = z.infer<typeof redeemSchema>;

const RedeemTRN = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<RedeemForm>({
    resolver: zodResolver(redeemSchema),
    defaultValues: {
      tier: "silver",
      preferredContact: "email",
    },
  });

  const selectedTier = form.watch("tier");
  const currentTier = TIERS.find((t) => t.id === selectedTier);

  const onSubmit = async (data: RedeemForm) => {
    setIsSubmitting(true);
    try {
      const tier = TIERS.find((t) => t.id === data.tier);
      if (!tier) throw new Error("Invalid tier");

      const { error } = await supabase.from("trn_redemptions").insert({
        wallet_address: data.walletAddress,
        tier: data.tier,
        trn_amount: tier.trnRequired,
        discount_usd: tier.discount,
        service_type: data.serviceType || null,
        email: data.email,
        phone: data.phone || null,
        preferred_contact: data.preferredContact,
        notes: data.notes || null,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Redemption request submitted! We'll contact you within 24 hours.");
    } catch (error) {
      console.error("Redemption error:", error);
      toast.error("Failed to submit redemption. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <>
        <Helmet>
          <title>Redemption Submitted | Terrain Token</title>
        </Helmet>
        <ScrollProgress />
        <AnnouncementBanner />
        <DesktopNav />
        <main className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-32 pb-20 px-4">
          <BackToHome />
          <div className="container max-w-2xl mx-auto text-center space-y-8">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-6">
              <CheckCircle2 className="w-12 h-12 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold">Redemption Submitted!</h1>
            <p className="text-xl text-muted-foreground">
              We've received your {currentTier?.name} tier redemption request for ${currentTier?.discount} off Carolina Terrain services.
            </p>
            <GlassCard className="p-8 space-y-4 text-left">
              <h3 className="text-xl font-semibold">What's Next?</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Our team will verify your TRN balance within 24 hours</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>You'll receive a confirmation email with your discount code</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>Use the code when scheduling your drainage project</span>
                </li>
              </ul>
            </GlassCard>
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
        <title>Redeem TRN for Service Discounts | Terrain Token</title>
        <meta
          name="description"
          content="Hold TRN tokens and redeem them for real discounts on Carolina Terrain drainage services. Bronze, Silver, and Gold tiers available."
        />
      </Helmet>

      <ScrollProgress />
      <AnnouncementBanner />
      <DesktopNav />

      <main className="min-h-screen bg-gradient-to-b from-background to-background/50 pt-32 pb-20 px-4">
        <BackToHome />
        
        <div className="container max-w-6xl mx-auto space-y-16">
          {/* Hero */}
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium">
              <Sparkles className="w-4 h-4 text-primary" />
              Real Utility, Real Savings
            </div>
            <h1 className="text-5xl md:text-6xl font-bold">
              Redeem TRN for <span className="text-primary">Real Discounts</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Hold TRN tokens and get exclusive discounts on Carolina Terrain's professional drainage services.
            </p>
          </div>

          {/* Tier Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {TIERS.map((tier) => (
              <GlassCard
                key={tier.id}
                hover
                className={`p-6 space-y-4 relative ${tier.popular ? "border-primary/50 shadow-glow" : ""}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-xs font-bold">
                    MOST POPULAR
                  </div>
                )}
                <div className="text-4xl">{tier.icon}</div>
                <div>
                  <h3 className="text-2xl font-bold">{tier.name}</h3>
                  <p className="text-sm text-muted-foreground">{tier.description}</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-primary">${tier.discount}</span>
                    <span className="text-muted-foreground">off</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Coins className="w-4 h-4" />
                    {tier.trnRequired.toLocaleString()} TRN
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>

          {/* Redemption Form */}
          <GlassCard className="p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Submit Redemption Request</h2>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="walletAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Solana Wallet Address *</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your Solana wallet address" {...field} />
                      </FormControl>
                      <FormDescription>We'll verify your TRN balance</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Discount Tier *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="space-y-3">
                          {TIERS.map((tier) => (
                            <div key={tier.id} className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:border-primary/50 transition-colors">
                              <RadioGroupItem value={tier.id} id={tier.id} />
                              <label htmlFor={tier.id} className="flex-1 cursor-pointer">
                                <div className="font-semibold">{tier.name} - ${tier.discount} off</div>
                                <div className="text-sm text-muted-foreground">Requires {tier.trnRequired.toLocaleString()} TRN</div>
                              </label>
                            </div>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Desired Service (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Drainage assessment, French drain installation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="your@email.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="(555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="preferredContact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Contact Method *</FormLabel>
                      <FormControl>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex gap-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="email" id="email" />
                            <label htmlFor="email" className="cursor-pointer">Email</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="phone" id="phone" />
                            <label htmlFor="phone" className="cursor-pointer">Phone</label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (Optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any additional details about your project..." rows={4} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" size="lg" className="w-full gap-2" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit Redemption Request"}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>
            </Form>
          </GlassCard>

          {/* How It Works */}
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl font-bold text-center">How It Works</h2>
            <div className="grid gap-6">
              {[
                { step: 1, title: "Hold TRN", desc: "Acquire TRN tokens and hold them in your Solana wallet" },
                { step: 2, title: "Choose Tier", desc: "Select Bronze (50k TRN), Silver (150k TRN), or Gold (500k TRN)" },
                { step: 3, title: "Submit Request", desc: "Fill out the redemption form with your wallet address" },
                { step: 4, title: "Get Verified", desc: "We verify your balance within 24 hours" },
                { step: 5, title: "Receive Code", desc: "Get your discount code via email" },
                { step: 6, title: "Book Service", desc: "Use the code when scheduling your drainage project" },
              ].map((item) => (
                <div key={item.step} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default RedeemTRN;
