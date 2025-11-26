import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { GlassCard } from "@/components/ui/glass-card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Send, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useFeatureAnalytics } from "@/hooks/useFeatureAnalytics";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  wallet_address: z.string().optional(),
  investment_tier: z.enum(["supporter", "partner", "strategic"]),
  investment_range: z.string().min(1, "Please select an investment range"),
  reason: z.array(z.string()).min(1, "Please select at least one reason"),
  is_accredited: z.boolean(),
  nda_accepted: z.boolean(),
  discord_handle: z.string().optional(),
  additional_notes: z.string().max(1000).optional(),
});

type FormData = z.infer<typeof formSchema>;

export const InvestorForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  const { trackTRNAction } = useFeatureAnalytics();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reason: [],
      is_accredited: false,
      nda_accepted: false,
    },
  });

  const investmentTier = watch("investment_tier");
  const selectedReasons = watch("reason") || [];

  const reasonOptions = [
    { value: "rewards", label: "TRN Rewards & Ecosystem" },
    { value: "utility", label: "Real Utility & Tools" },
    { value: "vc", label: "VC/Fund Investment" },
    { value: "integration", label: "Partnership/Integration" },
  ];

  const investmentRanges = {
    supporter: ["$1,000 - $2,500", "$2,500 - $5,000", "$5,000 - $10,000"],
    partner: ["$10,000 - $25,000", "$25,000 - $50,000", "$50,000 - $100,000"],
    strategic: ["$100,000 - $250,000", "$250,000 - $500,000", "$500,000+"],
  };

  const handleReasonChange = (value: string, checked: boolean) => {
    const current = selectedReasons;
    if (checked) {
      setValue("reason", [...current, value]);
    } else {
      setValue("reason", current.filter((r) => r !== value));
    }
  };

  const onSubmit = async (data: FormData) => {
    // Validate NDA for strategic tier
    if (data.investment_tier === "strategic" && !data.nda_accepted) {
      toast({
        title: "NDA Required",
        description: "Strategic tier requires NDA acceptance",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { data: result, error } = await supabase.functions.invoke(
        "submit-investor-interest",
        {
          body: {
            ...data,
            utm_source: new URLSearchParams(window.location.search).get("utm_source"),
            utm_campaign: new URLSearchParams(window.location.search).get("utm_campaign"),
          },
        }
      );

      if (error) throw error;

      trackTRNAction("earn", {
        tier: data.investment_tier,
        range: data.investment_range,
        accredited: data.is_accredited,
      });

      setIsSuccess(true);
      toast({
        title: "Interest Submitted! 🎉",
        description: "We'll be in touch within 24-48 hours to discuss next steps.",
      });
    } catch (error: any) {
      console.error("Form error:", error);
      toast({
        title: "Submission Error",
        description: error.message || "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-20"
      >
        <GlassCard className="max-w-2xl mx-auto p-12">
          <CheckCircle className="w-20 h-20 text-chart-3 mx-auto mb-6" />
          <h3 className="text-3xl font-bold mb-4">Thank You for Your Interest!</h3>
          <p className="text-lg text-muted-foreground mb-6">
            Your submission has been received. Our team will review your information and reach out within 24-48 hours to discuss the next steps.
          </p>
          <p className="text-sm text-muted-foreground">
            Check your email for confirmation details.
          </p>
        </GlassCard>
      </motion.div>
    );
  }

  return (
    <section id="investor-form" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-chart-2 bg-clip-text text-transparent">
            Express Your Interest
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tell us about your investment goals and we'll reach out to discuss how TRN fits into your strategy
          </p>
        </motion.div>

        <GlassCard className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="John Doe"
                  className="mt-2"
                />
                {errors.name && (
                  <p className="text-sm text-destructive mt-1">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="john@example.com"
                  className="mt-2"
                />
                {errors.email && (
                  <p className="text-sm text-destructive mt-1">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Investment Tier */}
            <div>
              <Label>Investment Tier *</Label>
              <RadioGroup
                onValueChange={(value) => setValue("investment_tier", value as any)}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2"
              >
                {["supporter", "partner", "strategic"].map((tier) => (
                  <div key={tier}>
                    <RadioGroupItem
                      value={tier}
                      id={tier}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={tier}
                      className="flex flex-col items-center justify-center p-4 border-2 border-muted rounded-lg cursor-pointer peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 hover:bg-accent transition-colors"
                    >
                      <span className="font-semibold capitalize">{tier}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.investment_tier && (
                <p className="text-sm text-destructive mt-1">{errors.investment_tier.message}</p>
              )}
            </div>

            {/* Investment Range */}
            {investmentTier && (
              <div>
                <Label htmlFor="investment_range">Investment Range *</Label>
                <select
                  {...register("investment_range")}
                  className="w-full mt-2 p-2 border border-input rounded-md bg-background"
                >
                  <option value="">Select range...</option>
                  {investmentRanges[investmentTier]?.map((range) => (
                    <option key={range} value={range}>
                      {range}
                    </option>
                  ))}
                </select>
                {errors.investment_range && (
                  <p className="text-sm text-destructive mt-1">{errors.investment_range.message}</p>
                )}
              </div>
            )}

            {/* Reason for Interest */}
            <div>
              <Label>Reason for Interest * (Select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {reasonOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={option.value}
                      checked={selectedReasons.includes(option.value)}
                      onCheckedChange={(checked) =>
                        handleReasonChange(option.value, checked as boolean)
                      }
                    />
                    <Label htmlFor={option.value} className="cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
              {errors.reason && (
                <p className="text-sm text-destructive mt-1">{errors.reason.message}</p>
              )}
            </div>

            {/* Optional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="wallet_address">Wallet Address (Optional)</Label>
                <Input
                  id="wallet_address"
                  {...register("wallet_address")}
                  placeholder="Your Solana wallet"
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="discord_handle">Discord Handle (Optional)</Label>
                <Input
                  id="discord_handle"
                  {...register("discord_handle")}
                  placeholder="@username"
                  className="mt-2"
                />
              </div>
            </div>

            {/* Additional Notes */}
            <div>
              <Label htmlFor="additional_notes">Additional Notes (Optional)</Label>
              <Textarea
                id="additional_notes"
                {...register("additional_notes")}
                placeholder="Tell us more about your interest in TRN..."
                rows={4}
                className="mt-2"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-4 border-t border-border pt-6">
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="is_accredited"
                  onCheckedChange={(checked) => setValue("is_accredited", checked as boolean)}
                />
                <Label htmlFor="is_accredited" className="cursor-pointer leading-tight">
                  I am an accredited investor (or equivalent in my jurisdiction)
                </Label>
              </div>

              {investmentTier === "strategic" && (
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="nda_accepted"
                    onCheckedChange={(checked) => setValue("nda_accepted", checked as boolean)}
                  />
                  <Label htmlFor="nda_accepted" className="cursor-pointer leading-tight">
                    I agree to sign an NDA before receiving strategic allocation details *
                  </Label>
                </div>
              )}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                "Submitting..."
              ) : (
                <>
                  <Send className="w-5 h-5 mr-2" />
                  Submit Interest
                </>
              )}
            </Button>
          </form>
        </GlassCard>
      </div>
    </section>
  );
};