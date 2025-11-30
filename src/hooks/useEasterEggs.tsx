import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";

// Dynamic confetti loader - only loads when needed
const fireConfetti = async (options: Parameters<typeof import("canvas-confetti").default>[0]) => {
  const confetti = (await import("canvas-confetti")).default;
  confetti(options);
};

export const useEasterEggs = () => {
  const [goblinClicks, setGoblinClicks] = useState(0);
  const [coinClicks, setCoinClicks] = useState(0);
  const [footerClicks, setFooterClicks] = useState(0);
  const [typedKeys, setTypedKeys] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [raveMode, setRaveMode] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [mascotClickCount, setMascotClickCount] = useState(0);
  const [mascotBadgeUnlocked, setMascotBadgeUnlocked] = useState(() => {
    return localStorage.getItem('trn-mascot-badge') === 'true';
  });
  const { toast } = useToast();

  // Check for saved badge
  useEffect(() => {
    const hasBadge = localStorage.getItem("trn-secret-badge");
    if (hasBadge === "true") {
      setShowBadge(true);
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
      if (e.key === '?' && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        setShowShortcuts(true);
        return;
      }

      const newKeys = [...typedKeys, e.key].slice(-10);
      setTypedKeys(newKeys);

      const typed = newKeys.join("").toLowerCase();
      
      if (typed.includes("erode")) {
        triggerScreenShake();
        setTypedKeys([]);
      }

      if (typed.includes("vibe")) {
        triggerVibeMode();
        setTypedKeys([]);
      }

      if (typed.includes("drain")) {
        triggerDrainMode();
        setTypedKeys([]);
      }

      if (newKeys.length === 10) {
        const match = newKeys.every((key, index) => key === konamiCode[index]);
        if (match) {
          triggerRaveMode();
          setTypedKeys([]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [typedKeys, mascotClickCount, mascotBadgeUnlocked]);

  // Expose mascot click handler globally
  useEffect(() => {
    (window as any).handleMascotClickEasterEgg = handleMascotClickEasterEgg;
    return () => {
      delete (window as any).handleMascotClickEasterEgg;
    };
  }, [mascotClickCount, mascotBadgeUnlocked]);

  const triggerMudFart = useCallback(async () => {
    // Brown particle explosion
    await fireConfetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#8B4513", "#A0522D", "#CD853F"],
    });

    // Coin rain
    setTimeout(async () => {
      await fireConfetti({
        particleCount: 50,
        spread: 100,
        origin: { y: 0 },
        colors: ["#10b981", "#FFD700"],
        shapes: ["circle"],
      });
    }, 300);

    toast({
      title: "Oops! hehe~ 💨",
      description: "Goblin activated mud fart mode",
    });
  }, [toast]);

  const triggerDogeGoblin = useCallback(() => {
    toast({
      title: "You've unlocked DOGE-GOBLIN MODE 🐕⛏️",
      description: "Such wow. Much erosion.",
    });
  }, [toast]);

  const triggerScreenShake = useCallback(() => {
    document.body.style.animation = "shake 0.5s";
    document.body.style.animationIterationCount = "3";
    
    toast({
      title: "THE GROUND TREMBLES! ⚠️",
      description: "You've awakened the erosion forces",
    });

    setTimeout(() => {
      document.body.style.animation = "";
    }, 1500);
  }, [toast]);

  const triggerDrainMode = useCallback(async () => {
    // Water drop confetti only - no screen tilt
    await fireConfetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#0EA5E9', '#06B6D4', '#22D3EE']
    });
    
    toast({
      title: "🌊 DRAIN Mode Activated",
      description: "Everything flows downhill...",
    });
    
    localStorage.setItem('trn-drain-discovered', 'true');
    const discoveries = parseInt(localStorage.getItem('trn-easter-egg-count') || '0');
    localStorage.setItem('trn-easter-egg-count', String(discoveries + 1));
  }, [toast]);

  const triggerVibeMode = useCallback(async () => {
    const audioEvent = new CustomEvent('trn-audio-play');
    window.dispatchEvent(audioEvent);
    
    // Simplified confetti - less particles
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
    
    localStorage.setItem('trn-vibe-discovered', 'true');
    const discoveries = parseInt(localStorage.getItem('trn-easter-egg-count') || '0');
    localStorage.setItem('trn-easter-egg-count', String(discoveries + 1));
  }, [toast]);

  const handleMascotClickEasterEgg = useCallback(async () => {
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
      const discoveries = parseInt(localStorage.getItem('trn-easter-egg-count') || '0');
      localStorage.setItem('trn-easter-egg-count', String(discoveries + 1));
    }
    
    // Reset counter after 2 seconds
    setTimeout(() => {
      setMascotClickCount(0);
    }, 2000);
  }, [mascotClickCount, mascotBadgeUnlocked, toast]);

  const triggerRaveMode = useCallback(async () => {
    setRaveMode(true);
    
    toast({
      title: "GOBLIN RAVE ACTIVATED! 🎉🕺",
      description: "Dance like nobody's watching",
    });

    // Load confetti once for rave mode
    const confetti = (await import("canvas-confetti")).default;

    // Disco confetti
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

  const handleGoblinClick = useCallback(() => {
    const newCount = goblinClicks + 1;
    setGoblinClicks(newCount);

    if (newCount === 3) {
      triggerMudFart();
      setTimeout(() => setGoblinClicks(0), 2000);
    }
  }, [goblinClicks, triggerMudFart]);

  const handleCoinClick = useCallback(() => {
    const newCount = coinClicks + 1;
    setCoinClicks(newCount);

    if (newCount === 7) {
      triggerDogeGoblin();
      setTimeout(() => setCoinClicks(0), 2000);
    }
  }, [coinClicks, triggerDogeGoblin]);

  const handleFooterClick = useCallback(() => {
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);

    if (newCount === 10) {
      triggerSecretBadge();
    }
  }, [footerClicks, triggerSecretBadge]);

  const handleScrollToBottom = useCallback(async () => {
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
    window.addEventListener("scroll", handleScrollToBottom);
    return () => window.removeEventListener("scroll", handleScrollToBottom);
  }, [handleScrollToBottom]);

  return (
    <>
      <KeyboardShortcutsModal 
        open={showShortcuts} 
        onOpenChange={setShowShortcuts} 
      />
      {showBadge && (
        <div className="fixed bottom-24 md:bottom-20 right-4 z-60 animate-bounce">
          <div className="bg-primary/20 backdrop-blur-sm border border-primary/40 rounded-lg p-3 shadow-lg">
            <span className="text-2xl">🏅</span>
          </div>
        </div>
      )}
      {raveMode && (
        <div className="fixed inset-0 pointer-events-none z-30 animate-pulse">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-blue-500/20" />
        </div>
      )}
    </>
  );
};
