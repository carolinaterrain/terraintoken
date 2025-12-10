import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Send, CheckCircle, Loader2, Shield, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import confetti from "canvas-confetti";

const investorFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email").max(255),
  investment_tier: z.enum(["community", "builder", "strategic"]),
  investment_range: z.string().min(1, "Please select an investment range"),
  reason: z.array(z.string()).optional(),
  wallet_address: z.string().max(100).optional(),
  discord_handle: z.string().max(100).optional(),
  is_accredited: z.boolean().optional(),
  nda_accepted: z.boolean().optional(),
  additional_notes: z.string().max(1000).optional(),
});

type InvestorFormData = z.infer<typeof investorFormSchema>;

const investmentTiers = [
  { value: "community", label: "Community ($1K - $10K)", description: "Early supporter tier" },
  { value: "builder", label: "Builder ($10K - $100K)", description: "Active participant tier" },
  { value: "strategic", label: "Strategic ($100K+)", description: "Partnership tier - NDA required" },
];

const investmentRanges = [
  "$1,000 - $5,000",
  "$5,000 - $10,000",
  "$10,000 - $25,000",
  "$25,000 - $50,000",
  "$50,000 - $100,000",
  "$100,000 - $250,000",
  "$250,000 - $500,000",
  "$500,000 - $1,000,000",
  "$1,000,000+",
];

const interestReasons = [
  { id: "utility", label: "Real-world utility backing" },
  { id: "transparency", label: "Transparency & on-chain verification" },
  { id: "ai", label: "TerrainVision AI technology" },
  { id: "community", label: "Community & governance" },
  { id: "tokenomics", label: "Tokenomics structure" },
  { id: "team", label: "Team & business experience" },
];

export function InvestorInterestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAccredited, setIsAccredited] = useState(false);
  const [ndaAccepted, setNdaAccepted] = useState(false);

  const form = useForm<InvestorFormData>({
    resolver: zodResolver(investorFormSchema),
    defaultValues: {
      name: "",
      email: "",
      investment_tier: "community",
      investment_range: "",
      reason: [],
      wallet_address: "",
      discord_handle: "",
      is_accredited: false,
      nda_accepted: false,
      additional_notes: "",
    },
  });

  const selectedTier = form.watch("investment_tier");
  const isStrategic = selectedTier === "strategic";

  const onSubmit = async (data: InvestorFormData) => {
    // Validate NDA for strategic tier
    if (isStrategic && !ndaAccepted) {
      toast.error("NDA acceptance required for Strategic tier");
      return;
    }

    setIsSubmitting(true);
    try {
      const submitData = {
        ...data,
        is_accredited: isAccredited,
        nda_accepted: ndaAccepted,
      };

      const { error } = await supabase.functions.invoke("submit-investor-interest", {
        body: submitData,
      });

      if (error) throw error;

      setIsSuccess(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00C46A", "#06FF8C", "#22c55e"],
      });
      toast.success("Thank you for your interest! We'll be in touch soon.");
    } catch (error: any) {
      console.error("Submission error:", error);
      toast.error(error.message || "Failed to submit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <section id="investor-form" className="py-20 px-4">
        <div className="container mx-auto max-w-2xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <GlassCard className="p-12 text-center bg-gradient-to-br from-primary/10 to-chart-2/5">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-primary" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Interest Submitted!</h3>
              <p className="text-lg text-muted-foreground mb-6">
                Thank you for expressing interest in TRN. Our team will review your submission and reach out within 24-48 hours.
              </p>
              <p className="text-sm text-muted-foreground">
                Check your email for a confirmation message.
              </p>
            </GlassCard>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="investor-form" className="py-20 px-4 bg-gradient-to-b from-background via-primary/5 to-background">
      <div className="container mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Building2 className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Express Interest</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Investor Interest Form
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Complete this form to express your interest in TRN. We'll review your submission and reach out directly.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <GlassCard className="p-8 md:p-10">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Name & Email Row */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
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
                          <Input type="email" placeholder="john@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Investment Tier */}
                <FormField
                  control={form.control}
                  name="investment_tier"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Tier *</FormLabel>
                      <div className="grid md:grid-cols-3 gap-4 mt-2">
                        {investmentTiers.map((tier) => (
                          <div
                            key={tier.value}
                            onClick={() => field.onChange(tier.value)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                              field.value === tier.value
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                          >
                            <div className="font-semibold text-sm mb-1">{tier.label}</div>
                            <div className="text-xs text-muted-foreground">{tier.description}</div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Investment Range */}
                <FormField
                  control={form.control}
                  name="investment_range"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Investment Range *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your investment range" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {investmentRanges.map((range) => (
                            <SelectItem key={range} value={range}>
                              {range}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Interest Reasons */}
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What interests you about TRN? (optional)</FormLabel>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                        {interestReasons.map((reason) => {
                          const isSelected = field.value?.includes(reason.id);
                          return (
                            <div
                              key={reason.id}
                              onClick={() => {
                                const newValue = isSelected
                                  ? field.value?.filter((v) => v !== reason.id)
                                  : [...(field.value || []), reason.id];
                                field.onChange(newValue);
                              }}
                              className={`p-3 rounded-lg border cursor-pointer transition-all text-sm ${
                                isSelected
                                  ? "border-primary bg-primary/10 text-primary"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              {reason.label}
                            </div>
                          );
                        })}
                      </div>
                    </FormItem>
                  )}
                />

                {/* Optional Fields */}
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="wallet_address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Solana Wallet Address (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Solana wallet address" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="discord_handle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Discord Handle (optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="username#1234" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {/* Accredited Investor - Simple checkbox */}
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="is_accredited"
                    checked={isAccredited}
                    onChange={(e) => setIsAccredited(e.target.checked)}
                    className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                  />
                  <div className="space-y-1 leading-none">
                    <label htmlFor="is_accredited" className="text-sm font-medium cursor-pointer">
                      I am an accredited investor
                    </label>
                    <p className="text-xs text-muted-foreground">
                      Optional - helps us understand investor profiles
                    </p>
                  </div>
                </div>

                {/* NDA Acceptance for Strategic */}
                {isStrategic && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <GlassCard className="p-4 border-chart-2/40 bg-chart-2/5">
                      <div className="flex items-start gap-3">
                        <input
                          type="checkbox"
                          id="nda_accepted"
                          checked={ndaAccepted}
                          onChange={(e) => setNdaAccepted(e.target.checked)}
                          className="mt-1 h-4 w-4 rounded border-primary text-primary focus:ring-primary"
                        />
                        <div className="space-y-1 leading-none">
                          <label htmlFor="nda_accepted" className="text-sm font-medium cursor-pointer flex items-center gap-2">
                            <Shield className="w-4 h-4 text-chart-2" />
                            I accept the NDA requirement *
                          </label>
                          <p className="text-xs text-muted-foreground">
                            Strategic tier requires signing an NDA before receiving detailed investment materials. Required for $100K+ investments.
                          </p>
                        </div>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}

                {/* Additional Notes */}
                <FormField
                  control={form.control}
                  name="additional_notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Any questions or additional information you'd like to share..."
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-5 w-5" />
                      Submit Interest
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  By submitting, you agree to receive communications about TRN investment opportunities.
                  Your information is kept confidential.
                </p>
              </form>
            </Form>
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
}
