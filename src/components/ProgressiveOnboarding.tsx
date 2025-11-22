import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { X, ChevronRight, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ONBOARDING_STEPS = [
  {
    id: 0,
    title: "Welcome to Terrain Token!",
    emoji: "🎉",
    description: "The meme coin backed by real-world drainage business. Let's get you started!",
    action: "Next",
  },
  {
    id: 1,
    title: "Earn TRN by Contributing",
    emoji: "💰",
    description: "Upload project photos, share on social media, and earn rewards in TRN tokens!",
    action: "Show Me How",
  },
  {
    id: 2,
    title: "Track Your Progress",
    emoji: "📊",
    description: "Watch your earnings grow, unlock achievements, and climb the leaderboard!",
    action: "Let's Go",
  },
  {
    id: 3,
    title: "Join the Community",
    emoji: "🌟",
    description: "Join our waitlist for TerrainScape - the upcoming P2E game!",
    action: "Join Waitlist",
  },
  {
    id: 4,
    title: "You're All Set!",
    emoji: "✅",
    description: "Start exploring and earning TRN tokens today. Good luck!",
    action: "Start Earning",
  },
];

export const ProgressiveOnboarding = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    const checkOnboarding = async () => {
      const sessionId = sessionStorage.getItem("analytics_session_id") || "";
      
      const { data } = await supabase
        .from('onboarding_progress')
        .select('*')
        .eq('session_id', sessionId)
        .maybeSingle();

      if (!data) {
        // First time user - show onboarding
        setIsVisible(true);
        await supabase.from('onboarding_progress').insert({
          session_id: sessionId,
          current_step: 0
        });
      } else if (!data.completed) {
        // Resume onboarding
        setIsVisible(true);
        setCurrentStep(data.current_step || 0);
        setCompletedSteps(data.completed_steps || []);
      }
    };

    // Show after 2 seconds
    setTimeout(checkOnboarding, 2000);
  }, []);

  const handleNext = async () => {
    const sessionId = sessionStorage.getItem("analytics_session_id") || "";
    const newCompletedSteps = [...completedSteps, currentStep];
    
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      const nextStep = currentStep + 1;
      setCompletedSteps(newCompletedSteps);
      setCurrentStep(nextStep);

      await supabase
        .from('onboarding_progress')
        .update({
          current_step: nextStep,
          completed_steps: newCompletedSteps
        })
        .eq('session_id', sessionId);
    } else {
      // Complete onboarding
      await supabase
        .from('onboarding_progress')
        .update({
          completed: true,
          completed_at: new Date().toISOString(),
          completed_steps: newCompletedSteps
        })
        .eq('session_id', sessionId);
      
      setIsVisible(false);
    }
  };

  const handleSkip = async () => {
    const sessionId = sessionStorage.getItem("analytics_session_id") || "";
    await supabase
      .from('onboarding_progress')
      .update({
        completed: true,
        completed_at: new Date().toISOString()
      })
      .eq('session_id', sessionId);
    
    setIsVisible(false);
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <AnimatePresence>
      {isVisible && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={handleSkip}
          />
          
          {/* Onboarding Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] sm:w-full max-w-md"
          >
            <Card className="relative overflow-hidden border-2 border-primary/30 shadow-2xl bg-card/95 backdrop-blur-sm">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-10"
                onClick={handleSkip}
              >
                <X className="w-4 h-4" />
              </Button>

              <CardContent className="pt-12 pb-6 px-6">
                {/* Progress Dots */}
                <div className="flex justify-center gap-2 mb-6">
                  {ONBOARDING_STEPS.map((s, i) => (
                    <div
                      key={s.id}
                      className={`h-2 rounded-full transition-all ${
                        i === currentStep
                          ? 'w-8 bg-primary'
                          : i < currentStep
                          ? 'w-2 bg-primary/50'
                          : 'w-2 bg-muted'
                      }`}
                    />
                  ))}
                </div>

                {/* Content */}
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="text-center space-y-4"
                >
                  <div className="space-y-2">
                    <div className="text-4xl md:text-5xl mb-2">
                      {step.emoji}
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-tight px-2">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed px-2">
                    {step.description}
                  </p>
                </motion.div>

                {/* Actions */}
                <div className="mt-8 flex gap-3">
                  {currentStep > 0 && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex-1"
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    className="flex-1 gap-2"
                  >
                    {step.action}
                    {currentStep < ONBOARDING_STEPS.length - 1 ? (
                      <ChevronRight className="w-4 h-4" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                  </Button>
                </div>

                {/* Skip */}
                <button
                  onClick={handleSkip}
                  className="w-full text-center text-sm text-muted-foreground hover:text-foreground mt-4 transition-colors"
                >
                  Skip tutorial
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
