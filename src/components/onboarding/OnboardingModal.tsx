import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, Sparkles, Shield, Coins, BarChart3, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { useOnboarding } from '@/hooks/useOnboarding';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import confetti from 'canvas-confetti';

const steps = [
  {
    id: 'welcome',
    icon: Sparkles,
    title: 'Welcome to Terrain Token',
    description: '$TRN is the incentive layer of an ecosystem built by a licensed NC drainage contractor.',
    highlight: "A utility token — not an investment.",
    color: 'from-goblin-gold to-amber-500',
  },
  {
    id: 'operations',
    icon: Shield,
    title: 'Tied to Real Operations',
    description: 'Carolina Terrain LLC operates excavators, skidsteers, and trailers used in active stormwater work. Inventory is publicly tracked.',
    highlight: 'Transparent equipment tracking',
    color: 'from-goblin-green to-emerald-500',
  },
  {
    id: 'earn',
    icon: Coins,
    title: 'Earn TRN Rewards',
    description: 'Share project photos, refer friends, join the waitlist, and participate in community events to earn TRN tokens.',
    highlight: 'Real utility, real rewards',
    color: 'from-terrain-purple to-violet-500',
  },
  {
    id: 'transparency',
    icon: BarChart3,
    title: 'Full Transparency',
    description: 'Track live holder counts, treasury balance, equipment depreciation, and revenue metrics — all on-chain and verifiable.',
    highlight: 'Nothing hidden, everything proven',
    color: 'from-blue-500 to-cyan-500',
  },
];

export const OnboardingModal = () => {
  const {
    showOnboarding,
    currentStep,
    nextStep,
    completeOnboarding,
    skipOnboarding,
    totalSteps,
  } = useOnboarding();
  
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isLastStep = currentStep >= totalSteps - 1;
  const step = steps[Math.min(currentStep, steps.length - 1)];
  const StepIcon = step.icon;

  const handleEmailCapture = async () => {
    if (!email.trim()) {
      // Allow skipping email
      return true;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return false;
    }
    
    setIsSubmitting(true);
    try {
      // Generate a unique referral code
      const referralCode = `TRN-${Date.now().toString(36).toUpperCase()}`;
      
      const { error } = await supabase
        .from('terrainscape_waitlist')
        .upsert(
          { 
            email: email.toLowerCase().trim(), 
            signup_source: 'onboarding',
            referral_code: referralCode,
          },
          { onConflict: 'email', ignoreDuplicates: true }
        );
      
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error saving email:', error);
      // Don't block completion on error
      return true;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = async () => {
    if (isLastStep) {
      const success = await handleEmailCapture();
      if (!success) return;
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#4ADE80', '#FFD700', '#8B5CF6'],
      });
      completeOnboarding();
    } else {
      nextStep();
    }
  };

  if (!showOnboarding) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative w-full max-w-lg bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Skip button */}
          <button
            onClick={skipOnboarding}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
            aria-label="Skip onboarding"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          {/* Progress bar */}
          <div className="px-6 pt-6">
            <Progress value={((currentStep + 1) / totalSteps) * 100} className="h-1" />
            <p className="text-xs text-muted-foreground mt-2">
              Step {currentStep + 1} of {totalSteps}
            </p>
          </div>

          {/* Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-6 pt-4"
            >
              {/* Icon */}
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center mb-6 shadow-lg`}>
                <StepIcon className="w-8 h-8 text-white" />
              </div>

              {/* Title */}
              <h2 className="text-2xl font-bold font-display mb-3">
                {step.title}
              </h2>

              {/* Description */}
              <p className="text-muted-foreground mb-4 leading-relaxed">
                {step.description}
              </p>

              {/* Highlight */}
              <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${step.color} bg-opacity-10 border border-current/20`}>
                <span className={`text-sm font-medium bg-gradient-to-r ${step.color} bg-clip-text text-transparent`}>
                  ✨ {step.highlight}
                </span>
              </div>

              {/* Email capture on last step */}
              {isLastStep && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Get notified about TRN updates (optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Actions */}
          <div className="p-6 pt-0 flex items-center justify-between">
            <button
              onClick={skipOnboarding}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Skip tour
            </button>

            <Button
              onClick={handleNext}
              disabled={isSubmitting}
              className="bg-gradient-to-r from-goblin-green to-goblin-gold hover:opacity-90 text-black font-semibold"
            >
              {isSubmitting ? 'Saving...' : isLastStep ? "Let's Go!" : 'Next'}
              {!isLastStep && <ChevronRight className="w-4 h-4 ml-1" />}
            </Button>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 pb-6">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep
                    ? 'bg-goblin-gold'
                    : index < currentStep
                    ? 'bg-goblin-green'
                    : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
