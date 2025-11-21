import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";

export const useEasterEggs = () => {
  const [goblinClicks, setGoblinClicks] = useState(0);
  const [coinClicks, setCoinClicks] = useState(0);
  const [footerClicks, setFooterClicks] = useState(0);
  const [typedKeys, setTypedKeys] = useState<string[]>([]);
  const [showBadge, setShowBadge] = useState(false);
  const [raveMode, setRaveMode] = useState(false);
  const { toast } = useToast();

  // Check for saved badge
  useEffect(() => {
    const hasBadge = localStorage.getItem("trn-secret-badge");
    if (hasBadge === "true") {
      setShowBadge(true);
    }
  }, []);

  // Konami code listener
  useEffect(() => {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    
    const handleKeyPress = (e: KeyboardEvent) => {
      const newKeys = [...typedKeys, e.key].slice(-10);
      setTypedKeys(newKeys);

      // Check for ERODE
      const typed = newKeys.join("").toLowerCase();
      if (typed.includes("erode")) {
        triggerScreenShake();
        setTypedKeys([]);
      }

      // Check for VIBE
      if (typed.includes("vibe")) {
        triggerVibeMode();
        setTypedKeys([]);
      }

      // Check for Konami code
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
  }, [typedKeys]);

  const triggerMudFart = () => {
    // Brown particle explosion
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#8B4513", "#A0522D", "#CD853F"],
    });

    // Coin rain
    setTimeout(() => {
      confetti({
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
  };

  const triggerDogeGoblin = () => {
    toast({
      title: "You've unlocked DOGE-GOBLIN MODE 🐕⛏️",
      description: "Such wow. Much erosion.",
    });
  };

  const triggerScreenShake = () => {
    document.body.style.animation = "shake 0.5s";
    document.body.style.animationIterationCount = "3";
    
    toast({
      title: "THE GROUND TREMBLES! ⚠️",
      description: "You've awakened the erosion forces",
    });

    setTimeout(() => {
      document.body.style.animation = "";
    }, 1500);
  };

  const triggerVibeMode = () => {
    // 1. Auto-play music
    const audioEvent = new CustomEvent('trn-audio-play');
    window.dispatchEvent(audioEvent);
    
    // 2. Massive confetti burst
    const duration = 3000;
    const end = Date.now() + duration;
    const colors = ['#10b981', '#FFD700', '#34D399', '#FCD34D'];
    
    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.6 },
        colors: colors,
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.6 },
        colors: colors,
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
    
    // 3. Special toast
    toast({
      title: "✅ VIBE CHECK PASSED",
      description: "The terrain feels your energy. Music activated!",
      duration: 4000,
    });
    
    // 4. Page pulse animation
    document.body.style.animation = 'gentle-pulse 1s ease-in-out';
    setTimeout(() => {
      document.body.style.animation = '';
    }, 1000);
    
    // 5. Track discovery
    localStorage.setItem('trn-vibe-discovered', 'true');
    const discoveries = parseInt(localStorage.getItem('trn-easter-egg-count') || '0');
    localStorage.setItem('trn-easter-egg-count', String(discoveries + 1));
  };

  const triggerRaveMode = () => {
    setRaveMode(true);
    
    toast({
      title: "GOBLIN RAVE ACTIVATED! 🎉🕺",
      description: "Dance like nobody's watching",
    });

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
  };

  const triggerSecretBadge = () => {
    localStorage.setItem("trn-secret-badge", "true");
    setShowBadge(true);
    
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.8 },
      colors: ["#10b981", "#FFD700"],
    });

    toast({
      title: "🏅 Secret Erosion Master Badge Unlocked!",
      description: "You've discovered the hidden achievement!",
    });
  };

  const handleGoblinClick = () => {
    const newCount = goblinClicks + 1;
    setGoblinClicks(newCount);

    if (newCount === 3) {
      triggerMudFart();
      setTimeout(() => setGoblinClicks(0), 2000);
    }
  };

  const handleCoinClick = () => {
    const newCount = coinClicks + 1;
    setCoinClicks(newCount);

    if (newCount === 7) {
      triggerDogeGoblin();
      setTimeout(() => setCoinClicks(0), 2000);
    }
  };

  const handleFooterClick = () => {
    const newCount = footerClicks + 1;
    setFooterClicks(newCount);

    if (newCount === 10) {
      triggerSecretBadge();
    }
  };

  const handleScrollToBottom = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
      const hasShownBedrock = sessionStorage.getItem("trn-bedrock-shown");
      if (!hasShownBedrock) {
        sessionStorage.setItem("trn-bedrock-shown", "true");
        toast({
          title: "You've reached bedrock! ⛏️",
          description: "The deepest layer! Achievement unlocked.",
        });
        
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 1 },
          colors: ["#10b981", "#8B4513"],
        });
      }
    }
  };

  // Scroll listener for bedrock achievement
  useEffect(() => {
    window.addEventListener("scroll", handleScrollToBottom);
    return () => window.removeEventListener("scroll", handleScrollToBottom);
  }, []);

  return {
    handleGoblinClick,
    handleCoinClick,
    handleFooterClick,
    showBadge,
    raveMode,
  };
};
