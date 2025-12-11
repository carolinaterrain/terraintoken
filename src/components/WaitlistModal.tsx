import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Wallet, Sparkles, Loader2, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const waitlistSchema = z.object({
  email: z.string().email("Please enter a valid email").max(255),
  wallet_address: z.string().max(100).optional(),
});

type WaitlistFormData = z.infer<typeof waitlistSchema>;

interface WaitlistModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}

// Helper to get/create session ID
const getSessionId = () => {
  let id = sessionStorage.getItem("trn-session-id");
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem("trn-session-id", id);
  }
  return id;
};

// Track analytics event
const trackEvent = async (eventName: string, properties?: Record<string, string | number | boolean>) => {
  try {
    await supabase.from("analytics_events").insert([{
      event_name: eventName,
      session_id: getSessionId(),
      event_properties: properties as Record<string, string | number | boolean> || {},
      page_url: window.location.href,
    }]);
  } catch (e) {
    console.error("Tracking error:", e);
  }
};

export function WaitlistModal({ open, onOpenChange, source = "direct" }: WaitlistModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const hasTrackedOpen = useRef(false);
  const hasTrackedFocus = useRef(false);

  const form = useForm<WaitlistFormData>({
    resolver: zodResolver(waitlistSchema),
    defaultValues: {
      email: "",
      wallet_address: "",
    },
  });

  // Track modal opened
  useEffect(() => {
    if (open && !hasTrackedOpen.current) {
      hasTrackedOpen.current = true;
      trackEvent("waitlist_modal_opened", { source, timestamp: Date.now() });
    }
    if (!open) {
      hasTrackedOpen.current = false;
      hasTrackedFocus.current = false;
    }
  }, [open, source]);

  // Track first form focus
  const handleFirstFocus = () => {
    if (!hasTrackedFocus.current) {
      hasTrackedFocus.current = true;
      trackEvent("waitlist_form_focused", { source });
    }
  };

  // Get UTM parameters from URL
  const getUTMParams = () => {
    const params = new URLSearchParams(window.location.search);
    return {
      utm_source: params.get("utm_source") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
    };
  };

  // Generate a simple referral code
  const generateReferralCode = () => {
    return `TRN${Date.now().toString(36).toUpperCase()}`;
  };

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    
    // Track form submission attempt
    await trackEvent("waitlist_form_submitted", { source, has_wallet: !!data.wallet_address });
    
    try {
      const utmParams = getUTMParams();
      
      const { error } = await supabase.from("terrainscape_waitlist").insert({
        email: data.email,
        wallet_address: data.wallet_address || null,
        signup_source: source,
        referral_code: generateReferralCode(),
        utm_source: utmParams.utm_source,
        utm_campaign: utmParams.utm_campaign,
      });

      if (error) {
        if (error.code === "23505") {
          toast.info("You're already on the waitlist!");
          setIsSuccess(true);
          await trackEvent("waitlist_signup_duplicate", { source });
        } else {
          await trackEvent("waitlist_signup_error", { source, error: error.message });
          throw error;
        }
      } else {
        setIsSuccess(true);
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.5 },
          colors: ["#00C46A", "#06FF8C", "#22c55e"],
        });
        toast.success("You're on the list! 🎉");

        // Track successful signup
        await trackEvent("waitlist_signup_success", {
          source,
          has_wallet: !!data.wallet_address,
        });
      }
    } catch (error: any) {
      console.error("Waitlist error:", error);
      toast.error("Failed to join waitlist. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset after animation
    setTimeout(() => {
      setIsSuccess(false);
      form.reset();
    }, 300);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Sparkles className="w-6 h-6 text-primary" />
            {isSuccess ? "You're In!" : "Join the Waitlist"}
          </DialogTitle>
        </DialogHeader>

        {isSuccess ? (
          <div className="py-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-2">Welcome to the TRN Community!</h3>
            <p className="text-muted-foreground mb-6">
              You'll be the first to know about rewards, drops, and exclusive opportunities.
            </p>
            <Button onClick={handleClose} className="w-full">
              Let's Go! 🚀
            </Button>
          </div>
        ) : (
          <>
            <p className="text-muted-foreground">
              Be the first to access new features, exclusive drops, and earn bonus TRN rewards.
            </p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="you@example.com"
                          onFocus={handleFirstFocus}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wallet_address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Wallet className="w-4 h-4" />
                        Solana Wallet (optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your Solana wallet address"
                          {...field}
                        />
                      </FormControl>
                      <p className="text-xs text-muted-foreground mt-1">
                        Add your wallet to receive priority airdrops
                      </p>
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
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Joining...
                    </>
                  ) : (
                    <>
                      Join Waitlist
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  No spam, ever. Unsubscribe anytime.
                </p>
              </form>
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
