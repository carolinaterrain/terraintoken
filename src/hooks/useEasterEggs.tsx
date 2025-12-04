import { useEffect, useState, useCallback, lazy, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";

// Lazy load KeyboardShortcutsModal - only loads when user presses '?'
const KeyboardShortcutsModal = lazy(() => 
  import("@/components/KeyboardShortcutsModal").then(m => ({ default: m.KeyboardShortcutsModal }))
);

// Dynamic confetti loader - only loads when needed
const fireConfetti = async (options: Parameters<typeof import("canvas-confetti").default>[0]) => {
  const confetti = (await import("canvas-confetti")).default;
  confetti(options);
};

// Easter egg configuration - easy to toggle
const EASTER_EGG_CONFIG = {
  konamiRave: true,      // Konami code rave mode
  vibeMode: true,        // "vibe" keyword for music
  mascotClick: true,     // 5 clicks on mascot
  bedrockScroll: true,   // Scroll to bottom achievement
  footerBadge: true,     // 10 clicks on footer
  shortcutsModal: true,  // ? key for shortcuts
};

export const useEasterEggs = () => {
  const [footerClicks, setFooterClicks] = useState(0);
  const [typedKeys, setTypedKeys] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [raveMode, setRaveMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [mascotClickCount, setMascotClickCount] = useState(0);
  const [mascotBadgeUnlocked, setMascotBadgeUnlocked] = useState(() => {
    return localStorage.getItem('trn-mascot-badge') === 'true';
  });
  const [isInitialized, setIsInitialized] = useState(false);
  const { toast } = useToast();

  // Defer initialization using requestIdleCallback
  useEffect(() => {
    const initEasterEggs = () => {
      const hasBadge = localStorage.getItem("trn-secret-badge");
      if (hasBadge === "true") {
        setShowBadge(true);
      }
      setIsInitialized(true);
    };

    if ('requestIdleCallback' in window) {
      requestIdleCallback(initEasterEggs, { timeout: 2000 });
    } else {
      setTimeout(initEasterEggs, 100);
    }
  }, []);

  // Keyboard listener
  useEffect(() => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    
    const handleKeyPress = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Handle '?' for shortcuts modal
      if (EASTER_EGG_CONFIG.shortcutsModal && e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      const newKeys = [...typedKeys, e.key].slice(-10);
      setTypedKeys(newKeys);

      const typed = newKeys.join("").toLowerCase();

      // Vibe mode - plays music (professional)
      if (EASTER_EGG_CONFIG.vibeMode && typed.includes("vibe")) {
        triggerVibeMode();
        setTypedKeys([]);
      }

      // Konami code - rave mode (classic easter egg)
      if (EASTER_EGG_CONFIG.konamiRave && newKeys.length === 10) {
        const match = newKeys.every((key, index) => key === konamiCode[index]);
        if (match) {
          triggerRaveMode();
          setTypedKeys([]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [typedKeys]);

  // Expose mascot click handler globally
  useEffect(() => {
    if (EASTER_EGG_CONFIG.mascotClick) {
      (window as any).handleMascotClickEasterEgg = handleMascotClickEasterEgg;
      return () => {
        delete (window as any).handleMascotClickEasterEgg;
      };
    }
  }, [mascotClickCount, mascotBadgeUnlocked]);

  const triggerVibeMode = useCallback(async () => {
    const audioEvent = new CustomEvent('trn-audio-play');
    window.dispatchEvent(audioEvent);
    
    await fireConfetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#FFD700', '#34D399']
    });
    
    toast({
      title: "✅ VIBE CHECK PASSED",
      description: "The terrain feels your energy. Music activated!",
      duration: 4000,
    });
    
    // Track discovery
    localStorage.setItem('trn-vibe-discovered', 'true');
  }, [toast]);

  const handleMascotClickEasterEgg = useCallback(async () => {
    if (!EASTER_EGG_CONFIG.mascotClick) return;
    
    const newCount = mascotClickCount + 1;
    setMascotClickCount(newCount);
    
    if (newCount === 5 && !mascotBadgeUnlocked) {
      await fireConfetti({
        particleCount: 100,
        spread: 160,
        origin: { y: 0.6 },
        colors: ['#10b981', '#FFD700'],
      });
      
      toast({
        title: "🏆 GOBLIN WHISPERER BADGE UNLOCKED!",
        description: "You've earned the trust of Terro the Terrain Goblin",
      });
      
      setMascotBadgeUnlocked(true);
      localStorage.setItem('trn-mascot-badge', 'true');
    }
    
    // Reset counter after 2 seconds
    setTimeout(() => {
      setMascotClickCount(0);
    }, 2000);
  }, [mascotClickCount, mascotBadgeUnlocked, toast]);

  const triggerRaveMode = useCallback(async () => {
    if (!EASTER_EGG_CONFIG.konamiRave) return;
    
    setRaveMode(true);
    
    toast({
      title: "🎉 GOBLIN RAVE ACTIVATED!",
      description: "You found the Konami code!",
    });

    const confetti = (await import("canvas-confetti")).default;
    const duration = 10000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ["#10b981", "#FFD700", "#FF00FF", "#00FFFF"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ["#10b981", "#FFD700", "#FF00FF", "#00FFFF"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();

    setTimeout(() => {
      setRaveMode(false);
    }, duration);
  }, [toast]);

  const triggerSecretBadge = useCallback(async () => {
    if (!EASTER_EGG_CONFIG.footerBadge) return;
    
    localStorage.setItem("trn-secret-badge", "true");
    setShowBadge(true);
    
    await fireConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#10b981", "#FFD700"],
    });

    toast({
      title: "🏅 Secret Erosion Master Badge Unlocked!",
      description: "You've discovered the hidden achievement!",
    });
  }, [toast]);

  const handleFooterClick = useCallback(() => {
    if (!EASTER_EGG_CONFIG.footerBadge) return;
    
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);

    if (newCount === 10) {
      triggerSecretBadge();
    }
  }, [footerClicks, triggerSecretBadge]);

  const handleScrollToBottom = useCallback(async () => {
    if (!EASTER_EGG_CONFIG.bedrockScroll) return;
    
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
      const hasShownBedrock = sessionStorage.getItem("trn-bedrock-shown");
      if (!hasShownBedrock) {
        sessionStorage.setItem("trn-bedrock-shown", "true");
        toast({
          title: "You've reached bedrock! ⛏️",
          description: "The deepest layer! Achievement unlocked.",
        });
        
        await fireConfetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 1 },
          colors: ["#10b981", "#8B4513"],
        });
      }
    }
  }, [toast]);

  // Scroll listener for bedrock achievement
  useEffect(() => {
    if (EASTER_EGG_CONFIG.bedrockScroll) {
      window.addEventListener("scroll", handleScrollToBottom);
      return () => window.removeEventListener("scroll", handleScrollToBottom);
    }
  }, [handleScrollToBottom]);

  // Don't render anything until initialized
  if (!isInitialized) return null;

  return (
    <>
      {EASTER_EGG_CONFIG.shortcutsModal && showShortcuts && (
        <Suspense fallback={null}>
          <KeyboardShortcutsModal 
            open={showShortcuts} 
            onOpenChange={setShowShortcuts} 
          />
        </Suspense>
      )}
      {EASTER_EGG_CONFIG.footerBadge && showBadge && (
        <div className="fixed bottom-24 md:bottom-20 right-4 z-60 animate-bounce">
          <div className="bg-primary/20 backdrop-blur-sm border border-primary/40 rounded-lg p-3 shadow-lg">
            <span className="text-2xl">🏅</span>
          </div>
        </div>
      )}
      {EASTER_EGG_CONFIG.konamiRave && raveMode && (
        <div className="fixed inset-0 pointer-events-none z-30 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20" />
        </div>
      )}
    </>
  );
};
