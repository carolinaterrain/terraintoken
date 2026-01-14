import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  Palette, 
  Coins, 
  Upload, 
  Sparkles, 
  CheckCircle2,
  Info,
  Shirt,
  HardHat,
  Coffee,
  Tag
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const submissionSchema = z.object({
  artistName: z.string().min(2, "Name must be at least 2 characters"),
  artistEmail: z.string().email("Please enter a valid email"),
  artistWallet: z.string().optional(),
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().optional(),
  designConcept: z.string().min(20, "Please describe your concept in at least 20 characters"),
  portfolioUrl: z.string().url().optional().or(z.literal("")),
  productTypes: z.array(z.string()).min(1, "Select at least one product type"),
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type SubmissionFormData = z.infer<typeof submissionSchema>;

const PRODUCT_OPTIONS = [
  { id: "shirt", label: "T-Shirt", icon: Shirt },
  { id: "hoodie", label: "Hoodie", icon: Shirt },
  { id: "hat", label: "Hat", icon: HardHat },
  { id: "mug", label: "Mug", icon: Coffee },
  { id: "stickers", label: "Stickers", icon: Tag },
];

export function ArtistSubmissionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<SubmissionFormData>({
    resolver: zodResolver(submissionSchema),
    defaultValues: {
      artistName: "",
      artistEmail: "",
      artistWallet: "",
      title: "",
      description: "",
      designConcept: "",
      portfolioUrl: "",
      productTypes: ["shirt"],
      agreeToTerms: false,
    },
  });

  const onSubmit = async (data: SubmissionFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from("artist_drop_submissions").insert({
        artist_name: data.artistName,
        artist_email: data.artistEmail,
        artist_wallet: data.artistWallet || null,
        title: data.title,
        description: data.description || null,
        design_concept: data.designConcept,
        portfolio_url: data.portfolioUrl || null,
        product_types: data.productTypes,
      });

      if (error) throw error;

      setIsSubmitted(true);
      toast.success("Submission received!", {
        description: "We'll review your design and get back to you.",
      });
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("Failed to submit", {
        description: "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-6 bg-card/50 rounded-2xl border border-primary/20"
      >
        <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          Submission Received!
        </h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Our team will review your design concept. If approved, we'll reach out to finalize artwork and launch your limited drop.
        </p>
        <div className="bg-primary/10 rounded-xl p-4 max-w-sm mx-auto">
          <p className="text-sm text-primary font-medium">
            💰 10% TRN Commission on Every Sale
          </p>
        </div>
        <Button 
          variant="outline" 
          className="mt-6"
          onClick={() => {
            setIsSubmitted(false);
            form.reset();
          }}
        >
          Submit Another Design
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="bg-card/30 rounded-2xl border border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 to-accent/20 p-6 border-b border-primary/20">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 rounded-lg bg-primary/20">
            <Palette className="w-5 h-5 text-primary" />
          </div>
          <Badge className="bg-accent/20 text-accent border-accent/30">
            <Coins className="w-3 h-3 mr-1" />
            Earn 10% Commission in TRN
          </Badge>
        </div>
        <h3 className="text-xl font-bold text-foreground">
          Submit Your Design
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Create limited edition drops and earn TRN for every sale
        </p>
      </div>

      {/* Commission Info */}
      <div className="p-4 bg-primary/5 border-b border-primary/10">
        <div className="flex items-start gap-3">
          <Info className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div className="text-sm">
            <p className="text-foreground font-medium">How Artist Commissions Work</p>
            <p className="text-muted-foreground mt-1">
              Approved designs become limited drops. You earn <span className="text-primary font-semibold">10% of each sale in TRN</span>, 
              automatically sent to your wallet after each purchase.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="p-6 space-y-6">
          {/* Artist Info */}
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="artistName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Artist name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="artistEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="you@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="artistWallet"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Solana Wallet (for TRN payments)</FormLabel>
                <FormControl>
                  <Input placeholder="Your Solana wallet address" {...field} />
                </FormControl>
                <FormDescription>
                  Optional now, required before launch. TRN commissions are sent here.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Design Info */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Design Title *</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 'Goblin King Collection'" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="designConcept"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Design Concept *</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe your design idea, style, and how it fits the TRN brand..."
                    className="min-h-[120px]"
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Be as detailed as possible. Include colors, themes, and any reference links.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="portfolioUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Portfolio / Reference Link</FormLabel>
                <FormControl>
                  <Input placeholder="https://your-portfolio.com" {...field} />
                </FormControl>
                <FormDescription>
                  Link to your work, social media, or design references.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Product Types */}
          <FormField
            control={form.control}
            name="productTypes"
            render={() => (
              <FormItem>
                <FormLabel>Product Types *</FormLabel>
                <FormDescription className="mb-3">
                  Select which products your design would work on.
                </FormDescription>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {PRODUCT_OPTIONS.map((option) => (
                    <FormField
                      key={option.id}
                      control={form.control}
                      name="productTypes"
                      render={({ field }) => (
                        <FormItem key={option.id}>
                          <FormControl>
                            <label
                              className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all ${
                                field.value?.includes(option.id)
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              }`}
                            >
                              <Checkbox
                                checked={field.value?.includes(option.id)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || [];
                                  if (checked) {
                                    field.onChange([...current, option.id]);
                                  } else {
                                    field.onChange(current.filter((v) => v !== option.id));
                                  }
                                }}
                              />
                              <option.icon className="w-4 h-4 text-muted-foreground" />
                              <span className="text-sm">{option.label}</span>
                            </label>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Terms */}
          <FormField
            control={form.control}
            name="agreeToTerms"
            render={({ field }) => (
              <FormItem className="flex items-start gap-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel className="text-sm font-normal">
                    I agree to the terms and understand that submitted designs may be modified
                    for production. Commission rate is 10% of sale price, paid in TRN.
                  </FormLabel>
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Submit Design
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}