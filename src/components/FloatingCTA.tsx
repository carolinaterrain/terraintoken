import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { WaitlistModal } from './WaitlistModal';
import { useFeatureAnalytics } from '@/hooks/useFeatureAnalytics';

export const FloatingCTA = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [showWaitlist, setShowWaitlist] = useState(false);
  const { trackButtonClick } = useFeatureAnalytics();

  useEffect(() => {
    // Check if already dismissed this session
    if (sessionStorage.getItem('floating-cta-dismissed')) {
      setIsDismissed(true);
      return;
    }

    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
      setIsVisible(scrollPercent > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    sessionStorage.setItem('floating-cta-dismissed', 'true');
    trackButtonClick('floating_cta_dismiss', 'floating_cta');
  };

  const handleJoinClick = () => {
    trackButtonClick('floating_cta_join', 'floating_cta');
    setShowWaitlist(true);
  };

  if (isDismissed) return null;

  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 z-50"
          >
            <div className="relative bg-card/95 backdrop-blur-lg border border-goblin-gold/30 rounded-2xl p-4 shadow-2xl max-w-sm mx-auto md:mx-0">
              {/* Dismiss button */}
              <button
                onClick={handleDismiss}
                className="absolute -top-2 -right-2 p-1.5 bg-muted rounded-full hover:bg-muted-foreground/20 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-3 h-3 text-muted-foreground" />
              </button>

              {/* Content */}
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-goblin-green to-goblin-gold flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    Don't miss out!
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    Join 500+ holders on the waitlist
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={handleJoinClick}
                  className="flex-shrink-0 bg-gradient-to-r from-goblin-green to-goblin-gold hover:opacity-90 text-black font-semibold"
                >
                  Join Now
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <WaitlistModal open={showWaitlist} onOpenChange={setShowWaitlist} />
    </>
  );
};