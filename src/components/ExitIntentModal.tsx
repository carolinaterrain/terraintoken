import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaitlistModal } from './WaitlistModal';
import { useFeatureAnalytics } from '@/hooks/useFeatureAnalytics';

export const ExitIntentModal = () => {
  const [showExitIntent, setShowExitIntent] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const { trackButtonClick } = useFeatureAnalytics();

  const handleMouseLeave = useCallback((e: MouseEvent) => {
    // Only trigger when mouse leaves from top of viewport (exit intent)
    if (e.clientY <= 0 && !hasTriggered) {
      // Check if already shown this session
      if (sessionStorage.getItem('exit-intent-shown')) return;
      
      setShowExitIntent(true);
      setHasTriggered(true);
      sessionStorage.setItem('exit-intent-shown', 'true');
      trackButtonClick('exit_intent_shown', 'exit_intent');
    }
  }, [hasTriggered, trackButtonClick]);

  useEffect(() => {
    // Only enable on desktop
    if (window.innerWidth < 768) return;
    
    // Check if already shown
    if (sessionStorage.getItem('exit-intent-shown')) {
      setHasTriggered(true);
      return;
    }

    // Add small delay before enabling exit intent
    const timeout = setTimeout(() => {
      document.addEventListener('mouseleave', handleMouseLeave);
    }, 5000);

    return () => {
      clearTimeout(timeout);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleMouseLeave]);

  const handleClose = () => {
    setShowExitIntent(false);
    trackButtonClick('exit_intent_dismiss', 'exit_intent');
  };

  const handleJoinWaitlist = () => {
    trackButtonClick('exit_intent_claim', 'exit_intent');
    setShowExitIntent(false);
    setShowWaitlist(true);
  };

  return (
    <>
      <AnimatePresence>
        {showExitIntent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-md"
            onClick={handleClose}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="relative w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors z-10"
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>

              {/* Header gradient */}
              <div className="h-2 bg-gradient-to-r from-goblin-green via-goblin-gold to-terrain-purple" />

              {/* Content */}
              <div className="p-6 text-center">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-goblin-gold to-amber-500 flex items-center justify-center mb-4 shadow-lg">
                  <Gift className="w-8 h-8 text-black" />
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold font-display mb-2">
                  Wait! Don't leave empty-handed
                </h2>

                {/* Description */}
                <p className="text-muted-foreground mb-6">
                  Join our waitlist now and get <span className="text-goblin-gold font-semibold">500 TRN bonus tokens</span> when we launch!
                </p>

                {/* Benefits */}
                <div className="grid grid-cols-2 gap-3 mb-6 text-sm">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <span className="font-semibold text-goblin-green">Early Access</span>
                    <p className="text-xs text-muted-foreground">First to know about drops</p>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <span className="font-semibold text-goblin-gold">Bonus TRN</span>
                    <p className="text-xs text-muted-foreground">500 tokens on launch</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-3">
                  <Button
                    onClick={handleJoinWaitlist}
                    className="w-full bg-gradient-to-r from-goblin-green to-goblin-gold hover:opacity-90 text-black font-semibold"
                  >
                    Claim My Bonus
                  </Button>
                  <button
                    onClick={handleClose}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    No thanks, I'll pass on free tokens
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <WaitlistModal open={showWaitlist} onOpenChange={setShowWaitlist} />
    </>
  );
};