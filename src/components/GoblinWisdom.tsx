import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

const wisdomQuotes = [
  "Every meme is a seed planted in fertile soil 🌱",
  "HODL like roots grip the earth 💎",
  "Paper hands cause erosion, diamond hands create mountains",
  "The deeper you dig, the more treasure you find ⛏️",
  "Patience: nature's most powerful force",
  "Be like water... eroding obstacles since forever 🌊",
  "True wealth comes from the ground up",
  "Don't chase pumps, build foundations",
  "In soil we trust 🌍",
  "Goblins who meme together, moon together 🚀",
  "The best time to buy was yesterday. The second best time is now 🌱",
  "Erosion happens gradually, then suddenly",
  "Strong communities are built grain by grain",
  "When in doubt, zoom out and check the terrain",
  "Every dip is a chance to dig deeper ⛏️",
  "Memes are the nutrients of community growth",
  "Like sediment layers, patience builds mountains",
  "The ground crew never sleeps 😤",
  "Weathering storms makes the strongest formations",
  "TRN: Today's meme, tomorrow's foundation",
  "Goblin logic: If you can't move the mountain, erode it",
  "Trust the process, trust the terrain",
  "We didn't choose the ground life, the ground life chose us",
  "From muddy memes to solid gains 💪",
  "Erosion rewards the persistent",
  "Diamond hands are forged underground 💎",
  "The best views come after the hardest climbs",
  "Goblins don't quit, they pivot... with a pickaxe",
  "Every landslide starts with a single pebble",
  "Born from the ground down 🌱⛏️",
];

const GoblinWisdom = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const getRandomQuote = () => {
    const newIndex = Math.floor(Math.random() * wisdomQuotes.length);
    if (newIndex === currentQuote && wisdomQuotes.length > 1) {
      return getRandomQuote();
    }
    return newIndex;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentQuote(getRandomQuote());
        setIsAnimating(false);
      }, 300);
    }, 8000);

    return () => clearInterval(interval);
  }, [currentQuote]);

  const handleClick = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentQuote(getRandomQuote());
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 hidden lg:block">
      <Card
        onClick={handleClick}
        className="w-64 p-4 bg-card/90 backdrop-blur-md border-primary/30 hover:border-primary/60 cursor-pointer transition-all duration-300 hover:shadow-glow group"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="text-2xl animate-bounce">🧙</div>
          <h3 className="text-sm font-bold text-primary">Goblin Wisdom</h3>
          <Sparkles className="w-4 h-4 text-primary ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div
          className={`min-h-[60px] flex items-center transition-opacity duration-300 ${
            isAnimating ? "opacity-0" : "opacity-100"
          }`}
        >
          <p className="text-sm italic text-muted-foreground leading-relaxed">
            "{wisdomQuotes[currentQuote]}"
          </p>
        </div>

        <div className="text-xs text-muted-foreground mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
          Click for new wisdom
        </div>
      </Card>
    </div>
  );
};

export default GoblinWisdom;
